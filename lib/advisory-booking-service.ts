import type { DeliveryStatus } from '@prisma/client'
import { siteConfig } from '@/config/site'
import { assertSlotAvailable, buildAdvisorySlotKey, uniqueConstraintError } from '@/lib/availability-service'
import { getCalendarAdapter } from '@/lib/calendar-adapter'
import { getDb } from '@/lib/db'
import { EmailDeliveryService } from '@/lib/email-delivery'
import { renderEmailTemplate } from '@/lib/email-templates'
import { getAdminNotificationDestination } from '@/lib/mailer'
import { getRequestMetadata } from '@/lib/request-metadata'
import { getResendAdapter } from '@/lib/resend-adapter'
import { normalizeEmail, sanitizeInline, sanitizeMultiline } from '@/lib/security'
import type { AdvisoryBookingFormData } from '@/lib/validation'

type SubmissionResponse = {
  status: number
  body: Record<string, unknown>
}

type StoredBookingPreview = {
  id: string
  fullName: string
  email: string
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
  meetingUrl: string | null
  googleMeetUrl: string | null
}

function sanitizeAdvisoryBookingData(data: AdvisoryBookingFormData) {
  return {
    fullName: sanitizeInline(data.fullName),
    company: sanitizeInline(data.company),
    email: sanitizeInline(data.email),
    emailNormalized: normalizeEmail(data.email),
    phone: sanitizeInline(data.phone),
    city: sanitizeInline(data.city),
    processGoal: sanitizeMultiline(data.processGoal),
    modality: sanitizeInline(data.modality),
    timezone: sanitizeInline(data.timezone),
    date: sanitizeInline(data.date),
    time: sanitizeInline(data.time),
    requestId: sanitizeInline(data.requestId),
  }
}

function buildDateLabel(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: siteConfig.advisory.timezone,
  }).format(new Date(`${date}T12:00:00${siteConfig.advisory.utcOffset}`))
}

function buildTimeLabel(date: string, time: string) {
  return new Intl.DateTimeFormat('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: siteConfig.advisory.timezone,
  }).format(new Date(`${date}T${time}:00${siteConfig.advisory.utcOffset}`))
}

function buildConfirmation(booking: StoredBookingPreview) {
  return {
    dateLabel: buildDateLabel(booking.scheduledDate),
    timeLabel: buildTimeLabel(booking.scheduledDate, booking.scheduledTime),
    timezone: siteConfig.advisory.timezoneLabel,
    durationMinutes: booking.durationMinutes,
    meetUrl: booking.meetingUrl ?? booking.googleMeetUrl,
    guestEmail: booking.email,
    guestName: booking.fullName,
  }
}

function joinIssues(...items: Array<string | null | undefined>) {
  return items.filter(Boolean).join(' ')
}

async function loadExistingBooking(requestId: string) {
  const db = getDb()
  return db.advisoryBooking.findUnique({
    where: { requestId },
    select: {
      id: true,
      fullName: true,
      email: true,
      scheduledDate: true,
      scheduledTime: true,
      durationMinutes: true,
      meetingUrl: true,
      googleMeetUrl: true,
    },
  })
}

function resolveDeliveryStatus(status: DeliveryStatus) {
  return status
}

function shouldPersistCalendarEventId(status: DeliveryStatus) {
  return status === 'SENT' || status === 'PENDING'
}

async function enqueueBookingEmailDeliveries(input: {
  bookingId: string
  payload: ReturnType<typeof sanitizeAdvisoryBookingData>
  scheduledAt: string
  timezone: string
}) {
  const delivery = new EmailDeliveryService()
  const destinationEmail = getAdminNotificationDestination('BOOKING_DESTINATION_EMAIL')
  const issues: string[] = []
  let customerQueued = false
  let adminQueued = false

  try {
    renderEmailTemplate({
      type: 'BOOKING_CONFIRMED_CUSTOMER',
      data: {
        customerName: input.payload.fullName,
        company: input.payload.company,
        bookingId: input.bookingId,
        scheduledAt: input.scheduledAt,
        timezone: input.timezone,
      },
    })
    await delivery.create({
      type: 'BOOKING_CONFIRMED_CUSTOMER',
      entityType: 'AdvisoryBooking',
      entityId: input.bookingId,
      recipient: input.payload.email,
      idempotencyKey: `booking:${input.bookingId}:customer:confirmed`,
      provider: 'MOCK',
    })
    customerQueued = true
  } catch {
    issues.push('No fue posible registrar la confirmación por correo del cliente.')
  }

  if (destinationEmail) {
    try {
      renderEmailTemplate({
        type: 'BOOKING_CONFIRMED_ADMIN',
        data: {
          customerName: input.payload.fullName,
          company: input.payload.company,
          bookingId: input.bookingId,
          scheduledAt: input.scheduledAt,
          timezone: input.timezone,
        },
      })
      await delivery.create({
        type: 'BOOKING_CONFIRMED_ADMIN',
        entityType: 'AdvisoryBooking',
        entityId: input.bookingId,
        recipient: destinationEmail,
        idempotencyKey: `booking:${input.bookingId}:admin:confirmed`,
        provider: 'MOCK',
      })
      adminQueued = true
    } catch {
      issues.push('No fue posible registrar la notificación interna por correo.')
    }
  }

  return { customerQueued, adminQueued, issues }
}

export async function submitAdvisoryBooking(
  data: AdvisoryBookingFormData,
  request: Request,
): Promise<SubmissionResponse> {
  let db

  try {
    db = getDb()
  } catch (error) {
    if (error instanceof Error && error.message === 'DATABASE_URL_NOT_CONFIGURED') {
      return {
        status: 503,
        body: {
          success: false,
          configured: false,
          message: 'El agendamiento esta listo, pero todavia no existe una base de datos configurada.',
        },
      }
    }

    throw error
  }

  const payload = sanitizeAdvisoryBookingData(data)
  const existingBooking = await loadExistingBooking(payload.requestId)

  if (existingBooking) {
    return {
      status: 200,
      body: {
        success: true,
        stored: true,
        idempotent: true,
        bookingId: existingBooking.id,
        confirmation: buildConfirmation(existingBooking),
        message: 'La asesoría ya había sido registrada anteriormente.',
      },
    }
  }

  const slotCheck = await assertSlotAvailable(payload.date, payload.time)
  const calendarAdapter = getCalendarAdapter(slotCheck.snapshot.settings.calendarMockMode)
  const calendarRecord = await calendarAdapter.createEvent({
    requestId: payload.requestId,
    fullName: payload.fullName,
    company: payload.company,
    email: payload.email,
    phone: payload.phone,
    city: payload.city,
    processGoal: payload.processGoal,
    modality: payload.modality,
    date: payload.date,
    time: payload.time,
    startAt: slotCheck.startAt,
    endAt: slotCheck.endAt,
    durationMinutes: slotCheck.snapshot.settings.durationMinutes,
  })
  const metadata = getRequestMetadata(request)
  const resend = getResendAdapter()
  let bookingId = ''

  try {
    const created = await db.$transaction(async (tx) => {
      const slotKey = buildAdvisorySlotKey(slotCheck.startAt, slotCheck.endAt)
      const booking = await tx.advisoryBooking.create({
        data: {
          requestId: payload.requestId,
          slotKey,
          status: 'CONFIRMED',
          fullName: payload.fullName,
          company: payload.company,
          email: payload.email,
          emailNormalized: payload.emailNormalized,
          phone: payload.phone,
          city: payload.city,
          processGoal: payload.processGoal,
          modality: payload.modality,
          timezone: slotCheck.snapshot.settings.timezoneLabel,
          scheduledDate: payload.date,
          scheduledTime: payload.time,
          startAt: slotCheck.startAt,
          endAt: slotCheck.endAt,
          durationMinutes: slotCheck.snapshot.settings.durationMinutes,
          privacyAcceptedAt: new Date(),
          privacyPolicyVersion: siteConfig.legal.privacyPolicyVersionLabel,
          calendarEventId: shouldPersistCalendarEventId(calendarRecord.syncStatus)
            ? calendarRecord.eventId
            : null,
          calendarId: calendarRecord.calendarId,
          meetingUrl: calendarRecord.meetingUrl,
          googleCalendarEventId: shouldPersistCalendarEventId(calendarRecord.syncStatus)
            ? calendarRecord.eventId
            : null,
          googleCalendarHtmlLink: calendarRecord.htmlLink,
          googleMeetUrl: calendarRecord.meetUrl,
          calendarEventStatus: calendarRecord.syncStatus,
          calendarSyncStatus: calendarRecord.syncStatus,
          calendarSyncedAt: calendarRecord.syncedAt,
          calendarSyncError: calendarRecord.syncError,
          requestOrigin: metadata.requestOrigin,
          requestPath: metadata.requestPath,
          referer: metadata.referer,
          userAgent: metadata.userAgent,
          ipHash: metadata.ipHash,
          statusHistory: {
            create: {
              toStatus: 'CONFIRMED',
              note:
                calendarRecord.syncStatus === 'PENDING'
                  ? 'Asesoria guardada con evento de Calendar creado y Google Meet pendiente.'
                  : calendarRecord.syncStatus === 'FAILED'
                  ? 'Asesoría guardada localmente; Calendar falló y requiere revisión.'
                  : calendarRecord.syncStatus === 'SKIPPED'
                    ? 'Asesoria confirmada con adaptador simulado de Calendar.'
                    : 'Asesoria confirmada con evento de Calendar.',
            },
          },
        },
        select: { id: true },
      })

      return booking
    })

    bookingId = created.id
  } catch (error) {
    if (uniqueConstraintError(error)) {
      return {
        status: 409,
        body: {
          success: false,
          message: 'Ese horario ya no esta disponible. Seleccione otro antes de confirmar.',
        },
      }
    }

    throw error
  }

  const confirmation = {
    dateLabel: buildDateLabel(payload.date),
    timeLabel: buildTimeLabel(payload.date, payload.time),
    timezone: slotCheck.snapshot.settings.timezoneLabel,
    durationMinutes: slotCheck.snapshot.settings.durationMinutes,
    meetUrl: calendarRecord.meetUrl,
    guestEmail: payload.email,
    guestName: payload.fullName,
  }
  const emailPayload = {
    bookingId,
    fullName: payload.fullName,
    company: payload.company,
    email: payload.email,
    phone: payload.phone,
    dateLabel: confirmation.dateLabel,
    timeLabel: confirmation.timeLabel,
    timezone: confirmation.timezone,
    meetUrl: confirmation.meetUrl,
    reason: payload.processGoal,
    description: payload.processGoal,
  }
  const queuedEmails = await enqueueBookingEmailDeliveries({
    bookingId,
    payload,
    scheduledAt: `${confirmation.dateLabel}, ${confirmation.timeLabel}`,
    timezone: confirmation.timezone,
  })
  const [customerEmail, companyEmail] = await Promise.all([
    resend.sendCustomerConfirmation(emailPayload),
    resend.sendCompanyNotification(emailPayload),
  ])

  await db.advisoryBooking.update({
    where: { id: bookingId },
    data: {
      clientEmailStatus: resolveDeliveryStatus(customerEmail.status),
      customerEmailStatus: resolveDeliveryStatus(customerEmail.status),
      customerConfirmationEmailStatus: resolveDeliveryStatus(customerEmail.status),
      internalEmailStatus: resolveDeliveryStatus(companyEmail.status),
      companyEmailStatus: resolveDeliveryStatus(companyEmail.status),
      companyConfirmationEmailStatus: resolveDeliveryStatus(companyEmail.status),
      lastDeliveryAttemptAt: new Date(),
      lastDeliveryError:
        joinIssues(calendarRecord.syncError, customerEmail.error, companyEmail.error, ...queuedEmails.issues) ||
        null,
    },
  })

  return {
    status: 200,
    body: {
      success: true,
      stored: true,
      simulated: calendarRecord.syncStatus === 'SKIPPED',
      calendarSynced: calendarRecord.syncStatus === 'SENT',
      calendarPending: calendarRecord.syncStatus === 'PENDING',
      bookingId,
      confirmation,
      emailConfirmation: {
        customerEmailQueued: queuedEmails.customerQueued,
        adminEmailQueued: queuedEmails.adminQueued,
        customerEmailStatus: customerEmail.status,
      },
      message:
        calendarRecord.syncStatus === 'PENDING'
          ? 'Asesoría enviada con éxito. Quedó guardada en el panel y el evento de Calendar fue creado; Google Meet sigue pendiente.'
          : calendarRecord.syncStatus === 'FAILED'
          ? 'Asesoría enviada con éxito y guardada en el panel, pero Calendar requiere revisión.'
          : calendarRecord.syncStatus === 'SKIPPED'
            ? 'Asesoría enviada con éxito. Quedó guardada en el panel y la confirmación por correo fue registrada.'
            : 'Asesoría enviada con éxito. Quedó guardada, sincronizada y con confirmación por correo registrada.',
    },
  }
}
