import type { DeliveryStatus } from '@prisma/client'

export type BookingEmailInput = {
  bookingId: string
  fullName: string
  company: string
  email: string
  phone: string
  dateLabel: string
  timeLabel: string
  timezone: string
  meetUrl: string | null
  reason: string
  description: string
}

export type EmailDeliveryResult = {
  status: DeliveryStatus
  error: string | null
}

export type ResendAdapter = {
  sendCustomerConfirmation(input: BookingEmailInput): Promise<EmailDeliveryResult>
  sendCompanyNotification(input: BookingEmailInput): Promise<EmailDeliveryResult>
  sendCancellation(input: BookingEmailInput & { cancellationReason?: string }): Promise<EmailDeliveryResult>
  sendSyncError(input: BookingEmailInput & { error: string }): Promise<EmailDeliveryResult>
}

const resendEndpoint = 'https://api.resend.com/emails'

function readEnv(name: string) {
  return process.env[name]?.trim() || ''
}

function getEmailFrom() {
  return readEnv('EMAIL_FROM') || readEnv('RESEND_FROM_EMAIL')
}

function getReplyTo() {
  return readEnv('EMAIL_REPLY_TO') || readEnv('RESEND_REPLY_TO') || undefined
}

function getAdminEmail() {
  return (
    readEnv('ADMIN_NOTIFICATION_EMAIL') ||
    readEnv('COMPANY_NOTIFICATION_EMAIL') ||
    readEnv('BOOKING_DESTINATION_EMAIL')
  )
}

function sanitizeError(message: string) {
  return message.replace(/re_[A-Za-z0-9_-]+/g, '[redacted]').slice(0, 500)
}

function renderLayout(title: string, intro: string, rows: Array<[string, string | null]>) {
  const rowHtml = rows
    .map(([label, value]) => {
      const safeValue = value ?? 'No disponible'
      return `<tr><td style="padding:10px 14px;color:#6b7b86;font-size:12px;text-transform:uppercase;letter-spacing:.08em">${label}</td><td style="padding:10px 14px;color:#0f1720;font-size:14px">${safeValue}</td></tr>`
    })
    .join('')

  return `<!doctype html><html><body style="margin:0;background:#061014;padding:28px;font-family:Arial,sans-serif;color:#0f1720"><main style="max-width:620px;margin:auto;background:#f8fbfb;border-radius:18px;overflow:hidden"><section style="padding:28px"><p style="margin:0 0 10px;color:#00bfc3;font-size:12px;font-weight:700;letter-spacing:.18em">CONEXACOD</p><h1 style="margin:0 0 12px;font-size:26px;line-height:1.2">${title}</h1><p style="margin:0 0 22px;color:#42515a;line-height:1.6">${intro}</p><table style="width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden">${rowHtml}</table></section></main></body></html>`
}

function buildCustomerConfirmation(input: BookingEmailInput) {
  const rows: Array<[string, string | null]> = [
    ['Fecha', input.dateLabel],
    ['Hora', input.timeLabel],
    ['Zona horaria', input.timezone],
    ['Servicio', input.reason],
    ['Google Meet', input.meetUrl],
    ['Contacto', getReplyTo() ?? 'Pendiente'],
  ]

  return {
    subject: 'Confirmación de asesoría · Conexacod',
    html: renderLayout(
      'Su asesoría quedó confirmada',
      'Estos son los datos principales de la reunión. Conserve este correo para tener trazabilidad de la reserva.',
      rows,
    ),
    text: [
      'Su asesoría quedó confirmada.',
      `Fecha: ${input.dateLabel}`,
      `Hora: ${input.timeLabel}`,
      `Zona horaria: ${input.timezone}`,
      `Servicio: ${input.reason}`,
      `Google Meet: ${input.meetUrl ?? 'No disponible'}`,
      `Contacto: ${getReplyTo() ?? 'Pendiente'}`,
    ].join('\n'),
  }
}

function buildCompanyNotification(input: BookingEmailInput) {
  const rows: Array<[string, string | null]> = [
    ['Nombre', input.fullName],
    ['Empresa', input.company],
    ['Correo', input.email],
    ['Teléfono', input.phone],
    ['Fecha', input.dateLabel],
    ['Hora', input.timeLabel],
    ['Servicio', input.reason],
    ['Mensaje', input.description],
    ['Google Meet', input.meetUrl],
    ['Panel', `/admin/reuniones/${input.bookingId}`],
  ]

  return {
    subject: `[Asesoría] ${input.company} · ${input.fullName}`,
    html: renderLayout(
      'Nueva asesoría reservada',
      'Se registró una nueva reserva desde el sitio corporativo de Conexacod.',
      rows,
    ),
    text: rows.map(([label, value]) => `${label}: ${value ?? 'No disponible'}`).join('\n'),
  }
}

function buildCancellation(input: BookingEmailInput & { cancellationReason?: string }) {
  const rows: Array<[string, string | null]> = [
    ['Fecha', input.dateLabel],
    ['Hora', input.timeLabel],
    ['Motivo', input.cancellationReason ?? 'Cancelación registrada por Conexacod.'],
    ['Contacto', getReplyTo() ?? 'Pendiente'],
  ]

  return {
    subject: 'Cancelación de asesoría · Conexacod',
    html: renderLayout(
      'Su asesoría fue cancelada',
      'Le compartimos la confirmación de cancelación para mantener trazabilidad del proceso.',
      rows,
    ),
    text: rows.map(([label, value]) => `${label}: ${value ?? 'No disponible'}`).join('\n'),
  }
}

async function sendResendEmail(input: {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}): Promise<EmailDeliveryResult> {
  const apiKey = readEnv('RESEND_API_KEY')
  const from = getEmailFrom()

  if (!apiKey || !from) {
    return {
      status: 'SKIPPED',
      error: 'Resend no está configurado.',
    }
  }

  try {
    const response = await fetch(resendEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        status: 'FAILED',
        error: sanitizeError(`Resend rechazó el correo. Código ${response.status}.`),
      }
    }

    return { status: 'SENT', error: null }
  } catch (error) {
    return {
      status: 'FAILED',
      error: sanitizeError(error instanceof Error ? error.message : 'Error desconocido de Resend.'),
    }
  }
}

export class ResendMockAdapter implements ResendAdapter {
  async sendCustomerConfirmation(): Promise<EmailDeliveryResult> {
    return { status: 'SKIPPED', error: 'Correo simulado en desarrollo. Resend real aún no está conectado.' }
  }

  async sendCompanyNotification(): Promise<EmailDeliveryResult> {
    return { status: 'SKIPPED', error: 'Notificación interna simulada en desarrollo. Resend real aún no está conectado.' }
  }

  async sendCancellation(): Promise<EmailDeliveryResult> {
    return { status: 'SKIPPED', error: 'Cancelación por correo simulada en desarrollo. Resend real aún no está conectado.' }
  }

  async sendSyncError(): Promise<EmailDeliveryResult> {
    return { status: 'SKIPPED', error: 'Alerta de sincronización simulada en desarrollo. Resend real aún no está conectado.' }
  }
}

export class ResendRealAdapter implements ResendAdapter {
  async sendCustomerConfirmation(input: BookingEmailInput): Promise<EmailDeliveryResult> {
    const email = buildCustomerConfirmation(input)
    return sendResendEmail({
      to: input.email,
      replyTo: getReplyTo(),
      ...email,
    })
  }

  async sendCompanyNotification(input: BookingEmailInput): Promise<EmailDeliveryResult> {
    const to = getAdminEmail()

    if (!to) {
      return { status: 'SKIPPED', error: 'ADMIN_NOTIFICATION_EMAIL no está configurado.' }
    }

    const email = buildCompanyNotification(input)
    return sendResendEmail({
      to,
      replyTo: input.email,
      ...email,
    })
  }

  async sendCancellation(input: BookingEmailInput & { cancellationReason?: string }): Promise<EmailDeliveryResult> {
    const email = buildCancellation(input)
    return sendResendEmail({
      to: input.email,
      replyTo: getReplyTo(),
      ...email,
    })
  }

  async sendSyncError(input: BookingEmailInput & { error: string }): Promise<EmailDeliveryResult> {
    const to = getAdminEmail()

    if (!to) {
      return { status: 'SKIPPED', error: 'ADMIN_NOTIFICATION_EMAIL no está configurado.' }
    }

    return sendResendEmail({
      to,
      replyTo: getReplyTo(),
      subject: '[Conexacod] Error de sincronización de asesoría',
      html: renderLayout('Error de sincronización', input.error, [
        ['Cliente', input.fullName],
        ['Empresa', input.company],
        ['Reserva', input.bookingId],
      ]),
      text: `Error de sincronización\nReserva: ${input.bookingId}\nCliente: ${input.fullName}\nError: ${input.error}`,
    })
  }
}

export function getResendAdapter(): ResendAdapter {
  if (process.env.RESEND_MODE === 'mock') {
    return new ResendMockAdapter()
  }

  return new ResendRealAdapter()
}
