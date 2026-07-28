import { DeliveryStatus, Prisma } from '@prisma/client'
import { siteConfig } from '@/config/site'
import { buildAdvisoryDateTime } from '@/lib/advisory-time'
import { getDb } from '@/lib/db'
import {
  createGoogleCalendarBookingRecord,
  deleteGoogleCalendarEvent,
} from '@/lib/google-calendar/events'
import {
  buildEmailLayout,
  getAdminNotificationDestination,
  getAdminNotificationDestinationLabel,
  getMissingSmtpEnv,
  isSmtpConfigured,
  renderDefinitionList,
  sendEmail,
} from '@/lib/mailer'
import { getRequestMetadata } from '@/lib/request-metadata'
import { normalizeEmail, sanitizeInline, sanitizeMultiline } from '@/lib/security'
import type { AdvisoryBookingConfirmation } from '@/lib/google-calendar/types'
import type { AdvisoryBookingFormData } from '@/lib/validation'

type SubmissionResponse = {
  status: number
  body: Record<string, unknown>
}

type StoredBookingPreview = {
  id: string
  status: string
  fullName: string
  email: string
  scheduledDate: string
  scheduledTime: string
  googleMeetUrl: string | null
  googleCalendarEventId: string | null
  lastDeliveryError: string | null
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
  }).format(buildAdvisoryDateTime(date, '12:00'))
}

function buildTimeLabel(date: string, time: string) {
  return new Intl.DateTimeFormat('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: siteConfig.advisory.timezone,
  }).format(buildAdvisoryDateTime(date, time))
}

function buildSlotKey(startAt: Date, endAt: Date) {
  return `${startAt.toISOString()}::${endAt.toISOString()}`
}

function isUniqueConstraintError(error: unknown, fieldName: string) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    return false
  }

  if (error.code !== 'P2002') {
    return false
  }

  const target = Array.isArray(error.meta?.target)
    ? error.meta.target.join(',')
    : String(error.meta?.target ?? '')

  return target.includes(fieldName)
}

function buildStoredConfirmation(booking: StoredBookingPreview): AdvisoryBookingConfirmation {
  return {
    dateLabel: buildDateLabel(booking.scheduledDate),
    timeLabel: buildTimeLabel(booking.scheduledDate, booking.scheduledTime),
    timezone: siteConfig.advisory.timezoneLabel,
    durationMinutes: siteConfig.advisory.durationMinutes,
    meetUrl: booking.googleMeetUrl,
    guestEmail: booking.email,
    guestName: booking.fullName,
  }
}

function buildInternalEmail(
  input: ReturnType<typeof sanitizeAdvisoryBookingData>,
  confirmation: AdvisoryBookingConfirmation,
) {
  const bookingItems = [
    { label: 'Correo', value: input.email },
    { label: 'Teléfono', value: input.phone },
    { label: 'Ciudad', value: input.city },
    { label: 'Fecha', value: confirmation.dateLabel },
    { label: 'Hora', value: confirmation.timeLabel },
    { label: 'Zona horaria', value: confirmation.timezone },
    ...(confirmation.meetUrl ? [{ label: 'Google Meet', value: confirmation.meetUrl }] : []),
    { label: 'Motivo', value: input.processGoal },
  ]

  return {
    subject: `[Asesoría] ${input.company} · ${input.fullName}`,
    text: [
      'Nueva asesoría registrada desde Konamy Systems.',
      '',
      `Empresa: ${input.company}`,
      `Contacto: ${input.fullName}`,
      `Correo: ${input.email}`,
      `Teléfono: ${input.phone}`,
      `Ciudad: ${input.city}`,
      `Fecha: ${confirmation.dateLabel}`,
      `Hora: ${confirmation.timeLabel}`,
      `Zona horaria: ${confirmation.timezone}`,
      `Modalidad: ${input.modality}`,
      `Google Meet: ${confirmation.meetUrl ?? 'Pendiente en la invitación del calendario'}`,
      '',
      'Motivo o proceso a revisar:',
      input.processGoal,
    ].join('\n'),
    html: buildEmailLayout({
      eyebrow: 'NUEVA ASESORÍA',
      title: `${input.company} · ${input.fullName}`,
      intro:
        'Se confirmó una nueva asesoría inicial desde el sitio corporativo de Konamy Systems.',
      bodyHtml: renderDefinitionList(bookingItems),
    }),
  }
}

function buildClientEmail(
  input: ReturnType<typeof sanitizeAdvisoryBookingData>,
  confirmation: AdvisoryBookingConfirmation,
) {
  const bookingItems = [
    { label: 'Empresa', value: input.company },
    { label: 'Fecha', value: confirmation.dateLabel },
    { label: 'Hora', value: confirmation.timeLabel },
    { label: 'Zona horaria', value: confirmation.timezone },
    { label: 'Duración', value: `${confirmation.durationMinutes} minutos` },
    ...(confirmation.meetUrl ? [{ label: 'Google Meet', value: confirmation.meetUrl }] : []),
    { label: 'Privacidad', value: 'La información será tratada según la política de privacidad vigente de Konamy Systems.' },
  ]

  return {
    subject: 'Su asesoría inicial fue confirmada · Konamy Systems',
    text: [
      `Hola ${input.fullName},`,
      '',
      'Su asesoría inicial con Konamy Systems quedó confirmada correctamente.',
      '',
      `Fecha: ${confirmation.dateLabel}`,
      `Hora: ${confirmation.timeLabel}`,
      `Zona horaria: ${confirmation.timezone}`,
      `Duración: ${confirmation.durationMinutes} minutos`,
      `Modalidad: ${input.modality}`,
      `Google Meet: ${confirmation.meetUrl ?? 'Lo recibirá en la invitación del calendario.'}`,
      '',
      'Motivo registrado:',
      input.processGoal,
      '',
      'Konamy Systems',
    ].join('\n'),
    html: buildEmailLayout({
      eyebrow: 'ASESORÍA CONFIRMADA',
      title: `Gracias, ${input.fullName}`,
      intro:
        'Su asesoría inicial quedó confirmada. Le compartimos los datos principales para que tenga trazabilidad del agendamiento.',
      bodyHtml: renderDefinitionList(bookingItems),
    }),
  }
}

async function deleteBookingReservation(id: string) {
  const db = getDb()

  try {
    await db.advisoryBooking.delete({
      where: { id },
    })
  } catch {
    await db.advisoryBooking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        slotKey: null,
        calendarEventStatus: 'FAILED',
        lastDeliveryError:
          'No se pudo completar la asesoría. El sistema liberó el horario y marcó la solicitud como cancelada.',
      },
    })
  }
}

async function loadExistingBooking(requestId: string) {
  const db = getDb()
  return db.advisoryBooking.findUnique({
    where: { requestId },
    select: {
      id: true,
      status: true,
      fullName: true,
      email: true,
      scheduledDate: true,
      scheduledTime: true,
      googleMeetUrl: true,
      googleCalendarEventId: true,
      lastDeliveryError: true,
    },
  })
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
          message:
            'El agendamiento está listo, pero todavía no existe una base de datos configurada para guardar asesorías reales.',
        },
      }
    }

    throw error
  }

  const payload = sanitizeAdvisoryBookingData(data)
  const startAt = buildAdvisoryDateTime(payload.date, payload.time)
  const endAt = new Date(
    startAt.getTime() + siteConfig.advisory.durationMinutes * 60 * 1000,
  )
  const slotKey = buildSlotKey(startAt, endAt)
  const metadata = getRequestMetadata(request)

  const existingBooking = await loadExistingBooking(payload.requestId)

  if (existingBooking) {
    if (existingBooking.googleCalendarEventId) {
      return {
        status: 200,
        body: {
          success: true,
          stored: true,
          idempotent: true,
          bookingId: existingBooking.id,
          confirmation: buildStoredConfirmation(existingBooking),
          message: existingBooking.lastDeliveryError
            ? 'La asesoría ya estaba registrada. Algunas notificaciones quedaron pendientes o parciales.'
            : 'La asesoría ya había sido registrada anteriormente.',
        },
      }
    }

    return {
      status: 409,
      body: {
        success: false,
        message:
          'Esta solicitud ya se está procesando. Recargue la página antes de intentar de nuevo.',
      },
    }
  }

  let provisionalBooking

  try {
    provisionalBooking = await db.advisoryBooking.create({
      data: {
        requestId: payload.requestId,
        slotKey,
        status: 'PENDING',
        fullName: payload.fullName,
        company: payload.company,
        email: payload.email,
        emailNormalized: payload.emailNormalized,
        phone: payload.phone,
        city: payload.city,
        processGoal: payload.processGoal,
        modality: payload.modality,
        timezone: payload.timezone,
        scheduledDate: payload.date,
        scheduledTime: payload.time,
        startAt,
        endAt,
        durationMinutes: siteConfig.advisory.durationMinutes,
        privacyAcceptedAt: new Date(),
        privacyPolicyVersion: siteConfig.legal.privacyPolicyVersionLabel,
        requestOrigin: metadata.requestOrigin,
        requestPath: metadata.requestPath,
        referer: metadata.referer,
        userAgent: metadata.userAgent,
        ipHash: metadata.ipHash,
        statusHistory: {
          create: {
            toStatus: 'PENDING',
            note: 'Asesoría creada desde el formulario público de agenda.',
          },
        },
      },
      select: {
        id: true,
      },
    })
  } catch (error) {
    if (isUniqueConstraintError(error, 'requestId')) {
      const duplicatedBooking = await loadExistingBooking(payload.requestId)

      if (duplicatedBooking?.googleCalendarEventId) {
        return {
          status: 200,
          body: {
            success: true,
            stored: true,
            idempotent: true,
            bookingId: duplicatedBooking.id,
            confirmation: buildStoredConfirmation(duplicatedBooking),
            message: 'La asesoría ya había sido registrada anteriormente.',
          },
        }
      }
    }

    if (isUniqueConstraintError(error, 'slotKey')) {
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

  let calendarRecord

  try {
    calendarRecord = await createGoogleCalendarBookingRecord(data)
  } catch (error) {
    await deleteBookingReservation(provisionalBooking.id)

    if (error instanceof Error && error.message === 'GOOGLE_CALENDAR_NOT_CONFIGURED') {
      return {
        status: 503,
        body: {
          success: false,
          configured: false,
          message:
            'El flujo de agendamiento esta preparado, pero la creacion real de citas sigue bloqueada hasta configurar Google Calendar y Google Meet.',
        },
      }
    }

    if (error instanceof Error && error.message === 'SLOT_NOT_AVAILABLE') {
      return {
        status: 409,
        body: {
          success: false,
          message: 'Ese horario ya no esta disponible. Seleccione otro antes de confirmar.',
        },
      }
    }

    return {
      status: 502,
      body: {
        success: false,
        message: 'No fue posible crear la asesoría en Google Calendar.',
      },
    }
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.advisoryBooking.update({
        where: { id: provisionalBooking.id },
        data: {
          status: 'CONFIRMED',
          googleCalendarEventId: calendarRecord.eventId,
          googleCalendarHtmlLink: calendarRecord.htmlLink,
          googleMeetUrl: calendarRecord.meetUrl,
          calendarEventStatus: 'SENT',
        },
      })

      await tx.statusHistory.create({
        data: {
          advisoryBookingId: provisionalBooking.id,
          fromStatus: 'PENDING',
          toStatus: 'CONFIRMED',
          note: 'Asesoría confirmada después de crear el evento en Google Calendar.',
        },
      })
    })
  } catch {
    try {
      await deleteGoogleCalendarEvent(calendarRecord.eventId)
    } catch {}

    await deleteBookingReservation(provisionalBooking.id)

    return {
      status: 502,
      body: {
        success: false,
        message:
          'La asesoría se alcanzó a crear en Google Calendar, pero no pudo guardarse de forma consistente en la base de datos.',
      },
    }
  }

  const smtpReady = isSmtpConfigured()
  const internalDestination = getAdminNotificationDestination('BOOKING_DESTINATION_EMAIL')
  let internalEmailStatus: DeliveryStatus = smtpReady && internalDestination ? 'PENDING' : 'SKIPPED'
  let clientEmailStatus: DeliveryStatus = smtpReady ? 'PENDING' : 'SKIPPED'
  const notificationIssues: string[] = []

  if (!smtpReady) {
    notificationIssues.push(
      `SMTP pendiente: ${getMissingSmtpEnv().join(', ') || 'revise SMTP_PORT o el proveedor SMTP'}`,
    )
  }

  if (!internalDestination) {
    notificationIssues.push(getAdminNotificationDestinationLabel('BOOKING_DESTINATION_EMAIL'))
  }

  const confirmation = {
    dateLabel: calendarRecord.dateLabel,
    timeLabel: calendarRecord.timeLabel,
    timezone: calendarRecord.timezone,
    durationMinutes: calendarRecord.durationMinutes,
    meetUrl: calendarRecord.meetUrl,
    guestEmail: calendarRecord.guestEmail,
    guestName: calendarRecord.guestName,
  } satisfies AdvisoryBookingConfirmation

  const internalEmail = buildInternalEmail(payload, confirmation)
  const clientEmail = buildClientEmail(payload, confirmation)

  if (smtpReady && internalDestination) {
    try {
      await sendEmail({
        to: internalDestination,
        subject: internalEmail.subject,
        text: internalEmail.text,
        html: internalEmail.html,
        replyTo: payload.email,
      })
      internalEmailStatus = 'SENT'
    } catch {
      internalEmailStatus = 'FAILED'
      notificationIssues.push('No fue posible enviar la notificación interna de la asesoría.')
    }
  }

  if (smtpReady) {
    try {
      await sendEmail({
        to: payload.email,
        subject: clientEmail.subject,
        text: clientEmail.text,
        html: clientEmail.html,
      })
      clientEmailStatus = 'SENT'
    } catch {
      clientEmailStatus = 'FAILED'
      notificationIssues.push('No fue posible enviar la confirmacion automatica al cliente.')
    }
  }

  await db.advisoryBooking.update({
    where: { id: provisionalBooking.id },
    data: {
      internalEmailStatus,
      clientEmailStatus,
      lastDeliveryAttemptAt: new Date(),
      lastDeliveryError: notificationIssues.length > 0 ? notificationIssues.join(' ') : null,
    },
  })

  return {
    status: 200,
    body: {
      success: true,
      stored: true,
      partial: notificationIssues.length > 0,
      bookingId: provisionalBooking.id,
      confirmation,
      message:
        notificationIssues.length > 0
          ? 'La asesoría fue confirmada y guardada correctamente. Algunas notificaciones automáticas quedaron pendientes o fallaron.'
          : 'La asesoría fue confirmada, guardada y notificada correctamente.',
    },
  }
}
