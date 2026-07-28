import {
  type AdminRole,
  type AdvisoryBookingStatus,
  type ContactSubmissionStatus,
  type DiagnosticSubmissionStatus,
  Prisma,
} from '@prisma/client'
import { siteConfig } from '@/config/site'
import { getTodayInAdvisoryZone } from '@/lib/advisory-time'
import { getDb } from '@/lib/db'
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar/events'
import { normalizeEmail, sanitizeInline, sanitizeMultiline } from '@/lib/security'

const CONTACT_PAGE_SIZE = 10
const DIAGNOSTIC_PAGE_SIZE = 10
const BOOKING_PAGE_SIZE = 10
const EXPORT_LIMIT = 5000

export const contactStatusOptions: ContactSubmissionStatus[] = [
  'NEW',
  'IN_REVIEW',
  'CONTACTED',
  'CLOSED',
]

export const diagnosticStatusOptions: DiagnosticSubmissionStatus[] = [
  'NEW',
  'IN_ANALYSIS',
  'CONTACTED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
]

export const advisoryBookingStatusOptions: AdvisoryBookingStatus[] = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'RESCHEDULED',
  'NO_SHOW',
]

const contactPendingStatuses: ContactSubmissionStatus[] = ['NEW']
const contactInProgressStatuses: ContactSubmissionStatus[] = ['IN_REVIEW']
const contactAttendedStatuses: ContactSubmissionStatus[] = ['CONTACTED', 'CLOSED']

const diagnosticPendingStatuses: DiagnosticSubmissionStatus[] = ['NEW']
const diagnosticInProgressStatuses: DiagnosticSubmissionStatus[] = [
  'IN_ANALYSIS',
  'CONTACTED',
  'PROPOSAL_SENT',
]
const diagnosticFinalStatuses: DiagnosticSubmissionStatus[] = ['WON', 'LOST']

const bookingActiveStatuses: AdvisoryBookingStatus[] = ['PENDING', 'CONFIRMED']

export const statusLabels: Record<string, string> = {
  NEW: 'Pendiente',
  IN_REVIEW: 'En proceso',
  CONTACTED: 'Contactado',
  CLOSED: 'Cerrado',
  IN_ANALYSIS: 'En análisis',
  PROPOSAL_SENT: 'Propuesta enviada',
  WON: 'Ganado',
  LOST: 'Descartado',
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Realizada',
  CANCELLED: 'Cancelada',
  RESCHEDULED: 'Reprogramada',
  NO_SHOW: 'No asistió',
  SENT: 'Enviado',
  FAILED: 'Error',
  SKIPPED: 'Omitido',
}

export const adminRoleLabels: Record<AdminRole, string> = {
  OWNER: 'Administrador',
  ADMIN: 'Administrador',
}

export type AdminListFilters = {
  page: number
  q: string
  status: string
  from: string
  to: string
  id: string
  preset: string
}

export type RelatedActivityItem = {
  id: string
  entity: 'contactos' | 'diagnosticos' | 'reuniones'
  href: string
  title: string
  subtitle: string
  description: string
  status: string
  happenedAt: Date
  matchReasons: string[]
}

type SearchParamsInput =
  | URLSearchParams
  | Record<string, string | string[] | undefined>

function readSearchValue(input: SearchParamsInput, key: string) {
  if (input instanceof URLSearchParams) {
    return input.get(key) ?? ''
  }

  const value = input[key]

  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

function clampPage(value: string) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function buildDateBoundary(date: string, endOfDay: boolean) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null
  }

  const time = endOfDay ? '23:59:59.999' : '00:00:00.000'
  return new Date(`${date}T${time}${siteConfig.advisory.utcOffset}`)
}

function buildDateFilter(from: string, to: string) {
  const fromDate = buildDateBoundary(from, false)
  const toDate = buildDateBoundary(to, true)

  if (!fromDate && !toDate) {
    return undefined
  }

  return {
    ...(fromDate ? { gte: fromDate } : {}),
    ...(toDate ? { lte: toDate } : {}),
  }
}

function isValidContactStatus(value: string): value is ContactSubmissionStatus {
  return contactStatusOptions.includes(value as ContactSubmissionStatus)
}

function isValidDiagnosticStatus(value: string): value is DiagnosticSubmissionStatus {
  return diagnosticStatusOptions.includes(value as DiagnosticSubmissionStatus)
}

function isValidAdvisoryBookingStatus(value: string): value is AdvisoryBookingStatus {
  return advisoryBookingStatusOptions.includes(value as AdvisoryBookingStatus)
}

function shouldReleaseBookingSlot(status: AdvisoryBookingStatus) {
  return status === 'CANCELLED'
}

function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

function normalizeCompanyKey(value: string | null | undefined) {
  return sanitizeInline(value ?? '').toLowerCase()
}

function buildPhoneProbe(phone: string) {
  const digits = normalizePhoneDigits(phone)

  if (digits.length >= 8) {
    return digits.slice(-8)
  }

  return digits.length >= 5 ? digits : ''
}

function buildScopeFilters(filters: AdminListFilters): AdminListFilters {
  return {
    ...filters,
    page: 1,
    status: '',
    id: '',
  }
}

function buildRelatedMatchKey(input: {
  emailNormalized: string
  phone: string
  company: string
}) {
  return {
    emailNormalized: input.emailNormalized,
    phoneDigits: normalizePhoneDigits(input.phone),
    phoneProbe: buildPhoneProbe(input.phone),
    company: sanitizeInline(input.company),
    companyKey: normalizeCompanyKey(input.company),
  }
}

function collectMatchReasons(
  matchKey: ReturnType<typeof buildRelatedMatchKey>,
  candidate: {
    emailNormalized: string
    phone: string
    company: string
  },
) {
  const reasons: string[] = []

  if (matchKey.emailNormalized && candidate.emailNormalized === matchKey.emailNormalized) {
    reasons.push('Mismo correo')
  }

  if (matchKey.phoneDigits && normalizePhoneDigits(candidate.phone) === matchKey.phoneDigits) {
    reasons.push('Mismo teléfono')
  }

  if (matchKey.companyKey && normalizeCompanyKey(candidate.company) === matchKey.companyKey) {
    reasons.push('Misma empresa')
  }

  return reasons
}

function getMatchScore(reasons: string[]) {
  return reasons.reduce((score, reason) => {
    if (reason === 'Mismo correo') return score + 4
    if (reason === 'Mismo teléfono') return score + 3
    if (reason === 'Misma empresa') return score + 1
    return score
  }, 0)
}

function hasStrongRelatedMatch(reasons: string[]) {
  return reasons.includes('Mismo correo') || reasons.includes('Mismo teléfono')
}

export function parseAdminListFilters(input: SearchParamsInput): AdminListFilters {
  return {
    page: clampPage(readSearchValue(input, 'page')),
    q: sanitizeInline(readSearchValue(input, 'q')).slice(0, 120),
    status: sanitizeInline(readSearchValue(input, 'status')).slice(0, 32),
    from: sanitizeInline(readSearchValue(input, 'from')).slice(0, 10),
    to: sanitizeInline(readSearchValue(input, 'to')).slice(0, 10),
    id: sanitizeInline(readSearchValue(input, 'id')).slice(0, 64),
    preset: sanitizeInline(readSearchValue(input, 'preset')).slice(0, 32),
  }
}

function buildContactWhere(filters: AdminListFilters): Prisma.ContactSubmissionWhereInput {
  const andClauses: Prisma.ContactSubmissionWhereInput[] = []
  const createdAt = buildDateFilter(filters.from, filters.to)

  if (filters.q) {
    const emailNormalized = normalizeEmail(filters.q)

    andClauses.push({
      OR: [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { company: { contains: filters.q, mode: 'insensitive' } },
        { email: { contains: filters.q, mode: 'insensitive' } },
        { emailNormalized: { contains: emailNormalized } },
        { phone: { contains: filters.q } },
        { subject: { contains: filters.q, mode: 'insensitive' } },
        { message: { contains: filters.q, mode: 'insensitive' } },
      ],
    })
  }

  if (isValidContactStatus(filters.status)) {
    andClauses.push({
      status: filters.status,
    })
  }

  if (createdAt) {
    andClauses.push({
      createdAt,
    })
  }

  return andClauses.length > 0 ? { AND: andClauses } : {}
}

function buildDiagnosticWhere(filters: AdminListFilters): Prisma.DiagnosticSubmissionWhereInput {
  const andClauses: Prisma.DiagnosticSubmissionWhereInput[] = []
  const createdAt = buildDateFilter(filters.from, filters.to)

  if (filters.q) {
    const emailNormalized = normalizeEmail(filters.q)

    andClauses.push({
      OR: [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { company: { contains: filters.q, mode: 'insensitive' } },
        { email: { contains: filters.q, mode: 'insensitive' } },
        { emailNormalized: { contains: emailNormalized } },
        { phone: { contains: filters.q } },
        { city: { contains: filters.q, mode: 'insensitive' } },
        { sector: { contains: filters.q, mode: 'insensitive' } },
        { summary: { contains: filters.q, mode: 'insensitive' } },
      ],
    })
  }

  if (isValidDiagnosticStatus(filters.status)) {
    andClauses.push({
      status: filters.status,
    })
  }

  if (createdAt) {
    andClauses.push({
      createdAt,
    })
  }

  return andClauses.length > 0 ? { AND: andClauses } : {}
}

function buildBookingWhere(filters: AdminListFilters): Prisma.AdvisoryBookingWhereInput {
  const andClauses: Prisma.AdvisoryBookingWhereInput[] = []
  const startAt = buildDateFilter(filters.from, filters.to)

  if (filters.q) {
    const emailNormalized = normalizeEmail(filters.q)

    andClauses.push({
      OR: [
        { fullName: { contains: filters.q, mode: 'insensitive' } },
        { company: { contains: filters.q, mode: 'insensitive' } },
        { email: { contains: filters.q, mode: 'insensitive' } },
        { emailNormalized: { contains: emailNormalized } },
        { phone: { contains: filters.q } },
        { city: { contains: filters.q, mode: 'insensitive' } },
        { processGoal: { contains: filters.q, mode: 'insensitive' } },
      ],
    })
  }

  if (isValidAdvisoryBookingStatus(filters.status)) {
    andClauses.push({
      status: filters.status,
    })
  }

  if (startAt) {
    andClauses.push({
      startAt,
    })
  }

  return andClauses.length > 0 ? { AND: andClauses } : {}
}

export function formatAdminDateTime(date: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function getStatusLabel(status: string) {
  return statusLabels[status] ?? status.replaceAll('_', ' ')
}

export async function getAdminDashboardSnapshot() {
  const db = getDb()

  const [
    totalContacts,
    pendingContacts,
    inProgressContacts,
    attendedContacts,
    totalDiagnostics,
    pendingDiagnostics,
    inProgressDiagnostics,
    finalizedDiagnostics,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
  ] = await Promise.all([
    db.contactSubmission.count(),
    db.contactSubmission.count({
      where: {
        status: {
          in: contactPendingStatuses,
        },
      },
    }),
    db.contactSubmission.count({
      where: {
        status: {
          in: contactInProgressStatuses,
        },
      },
    }),
    db.contactSubmission.count({
      where: {
        status: {
          in: contactAttendedStatuses,
        },
      },
    }),
    db.diagnosticSubmission.count(),
    db.diagnosticSubmission.count({
      where: {
        status: {
          in: diagnosticPendingStatuses,
        },
      },
    }),
    db.diagnosticSubmission.count({
      where: {
        status: {
          in: diagnosticInProgressStatuses,
        },
      },
    }),
    db.diagnosticSubmission.count({
      where: {
        status: {
          in: diagnosticFinalStatuses,
        },
      },
    }),
    db.advisoryBooking.count(),
    db.advisoryBooking.count({
      where: {
        status: 'PENDING',
      },
    }),
    db.advisoryBooking.count({
      where: {
        status: 'CONFIRMED',
      },
    }),
    db.advisoryBooking.count({
      where: {
        status: 'COMPLETED',
      },
    }),
  ])

  return {
    modules: {
      contacts: {
        total: totalContacts,
        pending: pendingContacts,
        inProgress: inProgressContacts,
        attended: attendedContacts,
      },
      diagnostics: {
        total: totalDiagnostics,
        pending: pendingDiagnostics,
        inProgress: inProgressDiagnostics,
        finalized: finalizedDiagnostics,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
      },
    },
  }
}

export async function listContactSubmissions(filters: AdminListFilters) {
  const db = getDb()
  const where = buildContactWhere(filters)
  const scopeWhere = buildContactWhere(buildScopeFilters(filters))
  const total = await db.contactSubmission.count({ where })
  const pageCount = Math.max(1, Math.ceil(total / CONTACT_PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)

  const [items, pendingCount, inProgressCount, attendedCount] = await Promise.all([
    db.contactSubmission.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * CONTACT_PAGE_SIZE,
      take: CONTACT_PAGE_SIZE,
      select: {
        id: true,
        status: true,
        name: true,
        company: true,
        email: true,
        phone: true,
        subject: true,
        createdAt: true,
        internalEmailStatus: true,
        clientEmailStatus: true,
        _count: {
          select: {
            notes: true,
            statusHistory: true,
          },
        },
      },
    }),
    db.contactSubmission.count({
      where: {
        AND: [scopeWhere, { status: { in: contactPendingStatuses } }],
      },
    }),
    db.contactSubmission.count({
      where: {
        AND: [scopeWhere, { status: { in: contactInProgressStatuses } }],
      },
    }),
    db.contactSubmission.count({
      where: {
        AND: [scopeWhere, { status: { in: contactAttendedStatuses } }],
      },
    }),
  ])

  return {
    items,
    page,
    pageCount,
    total,
    pageSize: CONTACT_PAGE_SIZE,
    stats: {
      total: pendingCount + inProgressCount + attendedCount,
      pending: pendingCount,
      inProgress: inProgressCount,
      attended: attendedCount,
    },
  }
}

export async function getContactSubmissionDetail(id: string) {
  if (!id) {
    return null
  }

  const db = getDb()
  return db.contactSubmission.findUnique({
    where: {
      id,
    },
    include: {
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          adminUser: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      statusHistory: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          adminUser: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })
}

export async function listDiagnosticSubmissions(filters: AdminListFilters) {
  const db = getDb()
  const where = buildDiagnosticWhere(filters)
  const scopeWhere = buildDiagnosticWhere(buildScopeFilters(filters))
  const total = await db.diagnosticSubmission.count({ where })
  const pageCount = Math.max(1, Math.ceil(total / DIAGNOSTIC_PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)

  const [items, pendingCount, inProcessCount, finalizedCount] = await Promise.all([
    db.diagnosticSubmission.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * DIAGNOSTIC_PAGE_SIZE,
      take: DIAGNOSTIC_PAGE_SIZE,
      select: {
        id: true,
        status: true,
        name: true,
        company: true,
        email: true,
        phone: true,
        city: true,
        sector: true,
        summary: true,
        wantsMeeting: true,
        createdAt: true,
        internalEmailStatus: true,
        clientEmailStatus: true,
        webhookStatus: true,
        _count: {
          select: {
            notes: true,
            statusHistory: true,
          },
        },
      },
    }),
    db.diagnosticSubmission.count({
      where: {
        AND: [scopeWhere, { status: { in: diagnosticPendingStatuses } }],
      },
    }),
    db.diagnosticSubmission.count({
      where: {
        AND: [scopeWhere, { status: { in: diagnosticInProgressStatuses } }],
      },
    }),
    db.diagnosticSubmission.count({
      where: {
        AND: [scopeWhere, { status: { in: diagnosticFinalStatuses } }],
      },
    }),
  ])

  return {
    items,
    page,
    pageCount,
    total,
    pageSize: DIAGNOSTIC_PAGE_SIZE,
    stats: {
      total: pendingCount + inProcessCount + finalizedCount,
      pending: pendingCount,
      inProcess: inProcessCount,
      finalized: finalizedCount,
    },
  }
}

export async function getDiagnosticSubmissionDetail(id: string) {
  if (!id) {
    return null
  }

  const db = getDb()
  return db.diagnosticSubmission.findUnique({
    where: {
      id,
    },
    include: {
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          adminUser: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      statusHistory: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          adminUser: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })
}

export async function listAdvisoryBookings(filters: AdminListFilters) {
  const db = getDb()
  const where = buildBookingWhere(filters)
  const scopeWhere = buildBookingWhere(buildScopeFilters(filters))
  const total = await db.advisoryBooking.count({ where })
  const pageCount = Math.max(1, Math.ceil(total / BOOKING_PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)
  const todayValue = getTodayInAdvisoryZone()

  const [items, scopeTotal, todayCount, upcomingCount, activeCount] =
    await Promise.all([
      db.advisoryBooking.findMany({
        where,
        orderBy: [{ startAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * BOOKING_PAGE_SIZE,
        take: BOOKING_PAGE_SIZE,
        select: {
          id: true,
          status: true,
          fullName: true,
          company: true,
          email: true,
          phone: true,
          scheduledDate: true,
          scheduledTime: true,
          startAt: true,
          createdAt: true,
          googleMeetUrl: true,
          googleCalendarEventId: true,
          calendarEventStatus: true,
          internalEmailStatus: true,
          clientEmailStatus: true,
          _count: {
            select: {
              notes: true,
              statusHistory: true,
            },
          },
        },
      }),
      db.advisoryBooking.count({
        where: scopeWhere,
      }),
      db.advisoryBooking.count({
        where: {
          AND: [scopeWhere, { scheduledDate: todayValue }],
        },
      }),
      db.advisoryBooking.count({
        where: {
          AND: [
            scopeWhere,
            {
              startAt: {
                gte: new Date(),
              },
            },
            { status: { in: bookingActiveStatuses } },
          ],
        },
      }),
      db.advisoryBooking.count({
        where: {
          AND: [scopeWhere, { status: { in: bookingActiveStatuses } }],
        },
      }),
    ])

  return {
    items,
    page,
    pageCount,
    total,
    pageSize: BOOKING_PAGE_SIZE,
    stats: {
      total: scopeTotal,
      today: todayCount,
      upcoming: upcomingCount,
      active: activeCount,
    },
  }
}

export async function getAdvisoryBookingDetail(id: string) {
  if (!id) {
    return null
  }

  const db = getDb()
  return db.advisoryBooking.findUnique({
    where: {
      id,
    },
    include: {
      notes: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          adminUser: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      statusHistory: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          adminUser: {
            select: {
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })
}

export async function getRelatedActivityForRecord(input: {
  entity: RelatedActivityItem['entity']
  id: string
  emailNormalized: string
  phone: string
  company: string
}) {
  const matchKey = buildRelatedMatchKey(input)
  const db = getDb()
  const contactOr: Prisma.ContactSubmissionWhereInput[] = []
  const diagnosticOr: Prisma.DiagnosticSubmissionWhereInput[] = []
  const bookingOr: Prisma.AdvisoryBookingWhereInput[] = []

  if (matchKey.emailNormalized) {
    contactOr.push({ emailNormalized: matchKey.emailNormalized })
    diagnosticOr.push({ emailNormalized: matchKey.emailNormalized })
    bookingOr.push({ emailNormalized: matchKey.emailNormalized })
  }

  if (matchKey.phoneProbe) {
    contactOr.push({ phone: { contains: matchKey.phoneProbe } })
    diagnosticOr.push({ phone: { contains: matchKey.phoneProbe } })
    bookingOr.push({ phone: { contains: matchKey.phoneProbe } })
  }

  if (matchKey.company) {
    contactOr.push({
      company: {
        equals: matchKey.company,
        mode: 'insensitive',
      },
    })
    diagnosticOr.push({
      company: {
        equals: matchKey.company,
        mode: 'insensitive',
      },
    })
    bookingOr.push({
      company: {
        equals: matchKey.company,
        mode: 'insensitive',
      },
    })
  }

  if (contactOr.length === 0 || diagnosticOr.length === 0 || bookingOr.length === 0) {
    return [] as RelatedActivityItem[]
  }

  const [contacts, diagnostics, bookings] = await Promise.all([
    db.contactSubmission.findMany({
      where: {
        OR: contactOr,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
      select: {
        id: true,
        status: true,
        name: true,
        company: true,
        emailNormalized: true,
        phone: true,
        subject: true,
        createdAt: true,
      },
    }),
    db.diagnosticSubmission.findMany({
      where: {
        OR: diagnosticOr,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 12,
      select: {
        id: true,
        status: true,
        name: true,
        role: true,
        company: true,
        emailNormalized: true,
        phone: true,
        summary: true,
        createdAt: true,
      },
    }),
    db.advisoryBooking.findMany({
      where: {
        OR: bookingOr,
      },
      orderBy: {
        startAt: 'desc',
      },
      take: 12,
      select: {
        id: true,
        status: true,
        fullName: true,
        company: true,
        emailNormalized: true,
        phone: true,
        scheduledDate: true,
        scheduledTime: true,
        startAt: true,
      },
    }),
  ])

  const relatedItems: RelatedActivityItem[] = []

  for (const item of contacts) {
    if (input.entity === 'contactos' && item.id === input.id) {
      continue
    }

    const matchReasons = collectMatchReasons(matchKey, item)

    if (matchReasons.length === 0 || !hasStrongRelatedMatch(matchReasons)) {
      continue
    }

    relatedItems.push({
      id: item.id,
      entity: 'contactos',
      href: `/admin/contactos/${item.id}`,
      title: item.company,
      subtitle: item.name,
      description: item.subject,
      status: item.status,
      happenedAt: item.createdAt,
      matchReasons,
    })
  }

  for (const item of diagnostics) {
    if (input.entity === 'diagnosticos' && item.id === input.id) {
      continue
    }

    const matchReasons = collectMatchReasons(matchKey, item)

    if (matchReasons.length === 0 || !hasStrongRelatedMatch(matchReasons)) {
      continue
    }

    relatedItems.push({
      id: item.id,
      entity: 'diagnosticos',
      href: `/admin/diagnosticos/${item.id}`,
      title: item.company,
      subtitle: `${item.name}${item.role ? ` - ${item.role}` : ''}`,
      description: item.summary,
      status: item.status,
      happenedAt: item.createdAt,
      matchReasons,
    })
  }

  for (const item of bookings) {
    if (input.entity === 'reuniones' && item.id === input.id) {
      continue
    }

    const matchReasons = collectMatchReasons(matchKey, item)

    if (matchReasons.length === 0 || !hasStrongRelatedMatch(matchReasons)) {
      continue
    }

    relatedItems.push({
      id: item.id,
      entity: 'reuniones',
      href: `/admin/reuniones/${item.id}`,
      title: item.company,
      subtitle: item.fullName,
      description: `${item.scheduledDate} ${item.scheduledTime}`,
      status: item.status,
      happenedAt: item.startAt,
      matchReasons,
    })
  }

  relatedItems.sort((a, b) => {
    const scoreDiff = getMatchScore(b.matchReasons) - getMatchScore(a.matchReasons)

    if (scoreDiff !== 0) {
      return scoreDiff
    }

    return b.happenedAt.getTime() - a.happenedAt.getTime()
  })

  return relatedItems.slice(0, 8)
}

export async function updateContactSubmissionStatus(input: {
  id: string
  status: string
  note?: string
  adminUserId: string
}) {
  if (!isValidContactStatus(input.status)) {
    throw new Error('INVALID_STATUS')
  }

  const nextStatus: ContactSubmissionStatus = input.status
  const db = getDb()
  const current = await db.contactSubmission.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      status: true,
    },
  })

  if (!current) {
    throw new Error('NOT_FOUND')
  }

  if (current.status === nextStatus) {
    return current
  }

  const note = sanitizeMultiline(input.note ?? '').slice(0, 2000)

  return db.$transaction(async (tx) => {
    const updated = await tx.contactSubmission.update({
      where: {
        id: input.id,
      },
      data: {
        status: nextStatus,
      },
    })

    await tx.statusHistory.create({
      data: {
        adminUserId: input.adminUserId,
        contactSubmissionId: input.id,
        fromStatus: current.status,
        toStatus: nextStatus,
        note: note || null,
      },
    })

    return updated
  })
}

export async function addContactSubmissionNote(input: {
  id: string
  note: string
  adminUserId: string
}) {
  const note = sanitizeMultiline(input.note).slice(0, 2000)

  if (note.length < 3) {
    throw new Error('INVALID_NOTE')
  }

  const db = getDb()
  return db.adminNote.create({
    data: {
      adminUserId: input.adminUserId,
      contactSubmissionId: input.id,
      body: note,
    },
  })
}

export async function updateDiagnosticSubmissionStatus(input: {
  id: string
  status: string
  note?: string
  adminUserId: string
}) {
  if (!isValidDiagnosticStatus(input.status)) {
    throw new Error('INVALID_STATUS')
  }

  const nextStatus: DiagnosticSubmissionStatus = input.status
  const db = getDb()
  const current = await db.diagnosticSubmission.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      status: true,
    },
  })

  if (!current) {
    throw new Error('NOT_FOUND')
  }

  if (current.status === nextStatus) {
    return current
  }

  const note = sanitizeMultiline(input.note ?? '').slice(0, 2000)

  return db.$transaction(async (tx) => {
    const updated = await tx.diagnosticSubmission.update({
      where: {
        id: input.id,
      },
      data: {
        status: nextStatus,
      },
    })

    await tx.statusHistory.create({
      data: {
        adminUserId: input.adminUserId,
        diagnosticSubmissionId: input.id,
        fromStatus: current.status,
        toStatus: nextStatus,
        note: note || null,
      },
    })

    return updated
  })
}

export async function addDiagnosticSubmissionNote(input: {
  id: string
  note: string
  adminUserId: string
}) {
  const note = sanitizeMultiline(input.note).slice(0, 2000)

  if (note.length < 3) {
    throw new Error('INVALID_NOTE')
  }

  const db = getDb()
  return db.adminNote.create({
    data: {
      adminUserId: input.adminUserId,
      diagnosticSubmissionId: input.id,
      body: note,
    },
  })
}

export async function updateAdvisoryBookingStatus(input: {
  id: string
  status: string
  note?: string
  adminUserId: string
}) {
  if (!isValidAdvisoryBookingStatus(input.status)) {
    throw new Error('INVALID_STATUS')
  }

  const nextStatus: AdvisoryBookingStatus = input.status
  const db = getDb()
  const current = await db.advisoryBooking.findUnique({
    where: {
      id: input.id,
    },
    select: {
      id: true,
      status: true,
      slotKey: true,
      googleCalendarEventId: true,
    },
  })

  if (!current) {
    throw new Error('NOT_FOUND')
  }

  if (current.status === nextStatus) {
    return current
  }

  if (shouldReleaseBookingSlot(nextStatus) && current.googleCalendarEventId) {
    await deleteGoogleCalendarEvent(current.googleCalendarEventId)
  }

  const note = sanitizeMultiline(input.note ?? '').slice(0, 2000)

  return db.$transaction(async (tx) => {
    const updated = await tx.advisoryBooking.update({
      where: {
        id: input.id,
      },
      data: {
        status: nextStatus,
        slotKey: shouldReleaseBookingSlot(nextStatus) ? null : current.slotKey,
      },
    })

    await tx.statusHistory.create({
      data: {
        adminUserId: input.adminUserId,
        advisoryBookingId: input.id,
        fromStatus: current.status,
        toStatus: nextStatus,
        note: note || null,
      },
    })

    return updated
  })
}

export async function addAdvisoryBookingNote(input: {
  id: string
  note: string
  adminUserId: string
}) {
  const note = sanitizeMultiline(input.note).slice(0, 2000)

  if (note.length < 3) {
    throw new Error('INVALID_NOTE')
  }

  const db = getDb()
  return db.adminNote.create({
    data: {
      adminUserId: input.adminUserId,
      advisoryBookingId: input.id,
      body: note,
    },
  })
}

export async function exportContactSubmissions(filters: AdminListFilters) {
  const db = getDb()
  return db.contactSubmission.findMany({
    where: buildContactWhere(filters),
    orderBy: {
      createdAt: 'desc',
    },
    take: EXPORT_LIMIT,
    select: {
      id: true,
      createdAt: true,
      status: true,
      name: true,
      company: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      internalEmailStatus: true,
      clientEmailStatus: true,
      lastDeliveryError: true,
    },
  })
}

export async function exportDiagnosticSubmissions(filters: AdminListFilters) {
  const db = getDb()
  return db.diagnosticSubmission.findMany({
    where: buildDiagnosticWhere(filters),
    orderBy: {
      createdAt: 'desc',
    },
    take: EXPORT_LIMIT,
    select: {
      id: true,
      createdAt: true,
      status: true,
      name: true,
      company: true,
      role: true,
      email: true,
      phone: true,
      city: true,
      sector: true,
      teamSize: true,
      summary: true,
      processes: true,
      currentProcess: true,
      tools: true,
      repetitiveTasks: true,
      mainProblem: true,
      expectedResult: true,
      contactPreference: true,
      wantsMeeting: true,
      internalEmailStatus: true,
      clientEmailStatus: true,
      webhookStatus: true,
      lastDeliveryError: true,
    },
  })
}

export function serializeCsv(rows: Array<Record<string, string | number | boolean | null>>) {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          const text = value == null ? '' : String(value)
          return `"${text.replaceAll('"', '""')}"`
        })
        .join(','),
    ),
  ]

  return `\uFEFF${lines.join('\n')}`
}
