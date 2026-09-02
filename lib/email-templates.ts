import type { EmailDeliveryType } from '@prisma/client'

export type RenderedEmailTemplate = {
  subject: string
  html: string
  text: string
}

type DiagnosticTemplateData = {
  customerName: string
  company: string
  diagnosticId: string
  status?: string
}

type BookingTemplateData = {
  customerName: string
  company: string
  bookingId: string
  scheduledAt: string
  timezone: string
}

export type EmailTemplateInput =
  | {
      type: Extract<
        EmailDeliveryType,
        'DIAGNOSTIC_RECEIVED_CUSTOMER' | 'DIAGNOSTIC_RECEIVED_ADMIN' | 'DIAGNOSTIC_STATUS_CHANGED'
      >
      data: DiagnosticTemplateData
    }
  | {
      type: Extract<
        EmailDeliveryType,
        | 'BOOKING_CONFIRMED_CUSTOMER'
        | 'BOOKING_CONFIRMED_ADMIN'
        | 'BOOKING_RESCHEDULED'
        | 'BOOKING_CANCELLED'
        | 'BOOKING_ONE_HOUR_REMINDER'
      >
      data: BookingTemplateData
    }

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function cleanLine(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function paragraph(label: string, value: string) {
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(cleanLine(value))}</p>`
}

function layout(title: string, body: string) {
  return [
    '<!doctype html>',
    '<html lang="es">',
    '<body style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">',
    `<h1>${escapeHtml(title)}</h1>`,
    body,
    '<p>Konamy Systems</p>',
    '</body>',
    '</html>',
  ].join('')
}

function diagnosticTemplate(type: EmailTemplateInput['type'], data: DiagnosticTemplateData) {
  const company = cleanLine(data.company)
  const customerName = cleanLine(data.customerName)
  const status = cleanLine(data.status ?? 'Recibido')
  const diagnosticId = cleanLine(data.diagnosticId)
  const isAdmin = type === 'DIAGNOSTIC_RECEIVED_ADMIN'
  const isStatusChange = type === 'DIAGNOSTIC_STATUS_CHANGED'
  const title = isStatusChange
    ? 'Actualización de diagnóstico'
    : isAdmin
      ? 'Nuevo diagnóstico recibido'
      : 'Recibimos tu diagnóstico'
  const subject = isStatusChange
    ? `Diagnóstico actualizado: ${company}`
    : isAdmin
      ? `Nuevo diagnóstico: ${company}`
      : `Diagnóstico recibido: ${company}`
  const body = [
    paragraph('Cliente', customerName),
    paragraph('Empresa', company),
    paragraph('Estado', status),
    paragraph('Referencia', diagnosticId),
  ].join('')
  const text = [
    title,
    `Cliente: ${customerName}`,
    `Empresa: ${company}`,
    `Estado: ${status}`,
    `Referencia: ${diagnosticId}`,
    'Konamy Systems',
  ].join('\n')

  return { subject: cleanLine(subject), html: layout(title, body), text }
}

function bookingTemplate(type: EmailTemplateInput['type'], data: BookingTemplateData) {
  const company = cleanLine(data.company)
  const customerName = cleanLine(data.customerName)
  const scheduledAt = cleanLine(data.scheduledAt)
  const timezone = cleanLine(data.timezone)
  const bookingId = cleanLine(data.bookingId)
  const labels: Record<string, { title: string; subject: string }> = {
    BOOKING_CONFIRMED_CUSTOMER: {
      title: 'Asesoría confirmada',
      subject: `Asesoría confirmada: ${scheduledAt}`,
    },
    BOOKING_CONFIRMED_ADMIN: {
      title: 'Nueva asesoría agendada',
      subject: `Nueva asesoría: ${company}`,
    },
    BOOKING_RESCHEDULED: {
      title: 'Asesoría reagendada',
      subject: `Asesoría reagendada: ${scheduledAt}`,
    },
    BOOKING_CANCELLED: {
      title: 'Asesoría cancelada',
      subject: `Asesoría cancelada: ${company}`,
    },
    BOOKING_ONE_HOUR_REMINDER: {
      title: 'Recordatorio de asesoría',
      subject: `Recordatorio: asesoría en una hora`,
    },
  }
  const label = labels[type]
  const body = [
    paragraph('Cliente', customerName),
    paragraph('Empresa', company),
    paragraph('Fecha y hora', scheduledAt),
    paragraph('Zona horaria', timezone),
    paragraph('Referencia', bookingId),
  ].join('')
  const text = [
    label.title,
    `Cliente: ${customerName}`,
    `Empresa: ${company}`,
    `Fecha y hora: ${scheduledAt}`,
    `Zona horaria: ${timezone}`,
    `Referencia: ${bookingId}`,
    'Konamy Systems',
  ].join('\n')

  return { subject: cleanLine(label.subject), html: layout(label.title, body), text }
}

export function renderEmailTemplate(input: EmailTemplateInput): RenderedEmailTemplate {
  switch (input.type) {
    case 'DIAGNOSTIC_RECEIVED_CUSTOMER':
    case 'DIAGNOSTIC_RECEIVED_ADMIN':
    case 'DIAGNOSTIC_STATUS_CHANGED':
      return diagnosticTemplate(input.type, input.data)
    case 'BOOKING_CONFIRMED_CUSTOMER':
    case 'BOOKING_CONFIRMED_ADMIN':
    case 'BOOKING_RESCHEDULED':
    case 'BOOKING_CANCELLED':
    case 'BOOKING_ONE_HOUR_REMINDER':
      return bookingTemplate(input.type, input.data)
  }
}
