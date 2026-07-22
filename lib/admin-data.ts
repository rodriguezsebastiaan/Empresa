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
  'NO_SHOW',
]

export const adminRoleLabels: Record<AdminRole, string> = {
  OWNER: 'Owner',
  ADMIN: 'Admin',
}

export type AdminListFilters = {
  page: number
  q: string
  status: string
  from: string
  to: string
  id: string
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

export function parseAdminListFilters(input: SearchParamsInput): AdminListFilters {
  return {
    page: clampPage(readSearchValue(input, 'page')),
    q: sanitizeInline(readSearchValue(input, 'q')).slice(0, 120),
    status: sanitizeInline(readSearchValue(input, 'status')).slice(0, 32),
    from: sanitizeInline(readSearchValue(input, 'from')).slice(0, 10),
    to: sanitizeInline(readSearchValue(input, 'to')).slice(0, 10),
    id: sanitizeInline(readSearchValue(input, 'id')).slice(0, 64),
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
  return status.replaceAll('_', ' ')
}

export async function getAdminDashboardSnapshot() {
  const db = getDb()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const now = new Date()
  const todayValue = getTodayInAdvisoryZone(now)

  const [
    totalContacts,
    newContacts,
    recentContacts,
    totalDiagnostics,
    newDiagnostics,
    recentDiagnostics,
    totalBookings,
    recentBookings,
    pendingBookings,
    upcomingBookings,
    todaysBookings,
  ] = await Promise.all([
    db.contactSubmission.count(),
    db.contactSubmission.count({
      where: {
        status: 'NEW',
      },
    }),
    db.contactSubmission.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    db.diagnosticSubmission.count(),
    db.diagnosticSubmission.count({
      where: {
        status: 'NEW',
      },
    }),
    db.diagnosticSubmission.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    db.advisoryBooking.count(),
    db.advisoryBooking.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    }),
    db.advisoryBooking.count({
      where: {
        status: 'PENDING',
      },
    }),
    db.advisoryBooking.count({
      where: {
        startAt: {
          gte: now,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    }),
    db.advisoryBooking.count({
      where: {
        scheduledDate: todayValue,
      },
    }),
  ])

  const [recentContactItems, recentDiagnosticItems, upcomingBookingItems] = await Promise.all([
    db.contactSubmission.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        name: true,
        company: true,
        subject: true,
        createdAt: true,
      },
    }),
    db.diagnosticSubmission.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        name: true,
        company: true,
        summary: true,
        createdAt: true,
      },
    }),
    db.advisoryBooking.findMany({
      take: 5,
      where: {
        startAt: {
          gte: now,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      orderBy: {
        startAt: 'asc',
      },
      select: {
        id: true,
        status: true,
        fullName: true,
        company: true,
        scheduledDate: true,
        scheduledTime: true,
        startAt: true,
        googleMeetUrl: true,
      },
    }),
  ])

  return {
    totals: {
      totalContacts,
      newContacts,
      recentContacts,
      totalDiagnostics,
      newDiagnostics,
      recentDiagnostics,
      totalBookings,
      recentBookings,
      pendingBookings,
      upcomingBookings,
      todaysBookings,
    },
    recentContactItems,
    recentDiagnosticItems,
    upcomingBookingItems,
  }
}

export async function listContactSubmissions(filters: AdminListFilters) {
  const db = getDb()
  const where = buildContactWhere(filters)
  const total = await db.contactSubmission.count({ where })
  const pageCount = Math.max(1, Math.ceil(total / CONTACT_PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)

  const items = await db.contactSubmission.findMany({
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
  })

  return {
    items,
    page,
    pageCount,
    total,
    pageSize: CONTACT_PAGE_SIZE,
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
  const total = await db.diagnosticSubmission.count({ where })
  const pageCount = Math.max(1, Math.ceil(total / DIAGNOSTIC_PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)

  const items = await db.diagnosticSubmission.findMany({
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
  })

  return {
    items,
    page,
    pageCount,
    total,
    pageSize: DIAGNOSTIC_PAGE_SIZE,
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
  const total = await db.advisoryBooking.count({ where })
  const pageCount = Math.max(1, Math.ceil(total / BOOKING_PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)

  const items = await db.advisoryBooking.findMany({
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
  })

  return {
    items,
    page,
    pageCount,
    total,
    pageSize: BOOKING_PAGE_SIZE,
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
