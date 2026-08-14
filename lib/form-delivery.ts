import crypto from 'node:crypto'
import nodemailer from 'nodemailer'
import { siteConfig } from '@/config/site'
import type { ContactFormData, DiagnosticFormData } from '@/lib/validation'

type SubmissionResponse = {
  status: number
  body: Record<string, unknown>
}

type SanitizedContactFormData = ContactFormData
type SanitizedDiagnosticFormData = DiagnosticFormData

function sanitizeInline(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function sanitizeMultiline(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, '')
    .replace(/\r\n/g, '\n')
    .trim()
}

function parseBooleanEnv(value?: string) {
  return ['1', 'true', 'yes', 'on'].includes(value?.trim().toLowerCase() ?? '')
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function readEnv(name: string) {
  return process.env[name]?.trim() ?? ''
}

function isPlaceholderValue(value: string) {
  const normalized = value.toLowerCase()

  return (
    !normalized ||
    normalized.includes('pendiente') ||
    normalized.endsWith('.invalid') ||
    normalized.includes('@example.')
  )
}

function getSmtpPassword() {
  return readEnv('SMTP_PASSWORD') || readEnv('SMTP_PASS')
}

function getAdminNotificationDestination(moduleEnvName: string) {
  const moduleDestination = readEnv(moduleEnvName)
  const generalDestination = readEnv('ADMIN_NOTIFICATION_EMAIL')

  if (!isPlaceholderValue(moduleDestination)) {
    return moduleDestination
  }

  if (!isPlaceholderValue(generalDestination)) {
    return generalDestination
  }

  return ''
}

function getAdminNotificationDestinationLabel(moduleEnvName: string) {
  return `${moduleEnvName} o ADMIN_NOTIFICATION_EMAIL`
}

function getMissingSmtpEnv() {
  const missing: string[] = []

  for (const name of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_FROM_EMAIL'] as const) {
    if (!readEnv(name)) {
      missing.push(name)
    }
  }

  if (!getSmtpPassword()) {
    missing.push('SMTP_PASSWORD')
  }

  return missing
}

function getSmtpConfig() {
  const missingEnv = getMissingSmtpEnv()

  if (missingEnv.length > 0) {
    return null
  }

  const port = Number(process.env.SMTP_PORT)

  if (!Number.isInteger(port) || port <= 0) {
    return null
  }

  return {
    host: readEnv('SMTP_HOST'),
    port,
    secure: parseBooleanEnv(process.env.SMTP_SECURE),
    user: readEnv('SMTP_USER'),
    pass: getSmtpPassword(),
    fromEmail: readEnv('SMTP_FROM_EMAIL'),
    fromName: readEnv('SMTP_FROM_NAME') || siteConfig.name,
  }
}

function buildFromHeader(fromName: string, fromEmail: string) {
  return `${fromName} <${fromEmail}>`
}

async function sendPlainEmail(input: {
  to: string
  subject: string
  replyTo?: string
  text: string
}) {
  const smtp = getSmtpConfig()

  if (!smtp) {
    throw new Error('SMTP_NOT_CONFIGURED')
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  })

  await transporter.sendMail({
    from: buildFromHeader(smtp.fromName, smtp.fromEmail),
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
  })
}

function sanitizeContactFormData(data: ContactFormData): SanitizedContactFormData {
  return {
    ...data,
    name: sanitizeInline(data.name),
    company: sanitizeInline(data.company),
    email: sanitizeInline(data.email),
    phone: sanitizeInline(data.phone),
    subject: sanitizeInline(data.subject),
    message: sanitizeMultiline(data.message),
    website: sanitizeInline(data.website ?? ''),
  }
}

function sanitizeDiagnosticFormData(data: DiagnosticFormData): SanitizedDiagnosticFormData {
  return {
    ...data,
    name: sanitizeInline(data.name),
    company: sanitizeInline(data.company),
    role: sanitizeInline(data.role),
    email: sanitizeInline(data.email),
    phone: sanitizeInline(data.phone),
    city: sanitizeInline(data.city),
    sector: sanitizeInline(data.sector),
    teamSize: sanitizeInline(data.teamSize),
    processes: sanitizeMultiline(data.processes),
    currentProcess: sanitizeMultiline(data.currentProcess),
    tools: sanitizeMultiline(data.tools),
    repetitiveTasks: sanitizeMultiline(data.repetitiveTasks),
    mainProblem: sanitizeMultiline(data.mainProblem),
    expectedResult: sanitizeMultiline(data.expectedResult),
    contactPreference: sanitizeInline(data.contactPreference),
    wantsMeeting: sanitizeInline(data.wantsMeeting),
    website: sanitizeInline(data.website ?? ''),
  }
}

function buildContactEmailText(data: SanitizedContactFormData) {
  return [
    'Nuevo contacto desde el sitio web de Konamy Systems.',
    '',
    `Nombre: ${data.name}`,
    `Empresa: ${data.company}`,
    `Correo: ${data.email}`,
    `Teléfono: ${data.phone}`,
    `Asunto: ${data.subject}`,
    '',
    'Mensaje:',
    data.message,
  ].join('\n')
}

function buildDiagnosticEmailText(data: SanitizedDiagnosticFormData) {
  return [
    'Nuevo diagnóstico recibido desde el sitio web de Konamy Systems.',
    '',
    `Nombre: ${data.name}`,
    `Empresa: ${data.company}`,
    `Cargo: ${data.role}`,
    `Correo: ${data.email}`,
    `Teléfono: ${data.phone}`,
    `Ciudad: ${data.city}`,
    `Sector: ${data.sector}`,
    `Tamaño aproximado: ${data.teamSize}`,
    '',
    'Procesos a mejorar:',
    data.processes,
    '',
    'Cómo opera hoy:',
    data.currentProcess,
    '',
    'Herramientas actuales:',
    data.tools,
    '',
    'Tareas repetitivas:',
    data.repetitiveTasks,
    '',
    'Problema principal:',
    data.mainProblem,
    '',
    'Resultado esperado:',
    data.expectedResult,
    '',
    `Preferencia de contacto: ${data.contactPreference}`,
    `Interés en asesoría: ${data.wantsMeeting}`,
  ].join('\n')
}

function getContactPendingVariables() {
  const pending: string[] = [...getMissingSmtpEnv()]

  if (!getAdminNotificationDestination('CONTACT_DESTINATION_EMAIL')) {
    pending.push(getAdminNotificationDestinationLabel('CONTACT_DESTINATION_EMAIL'))
  }

  return unique(pending)
}

async function sendDiagnosticWebhook(data: SanitizedDiagnosticFormData) {
  const webhookUrl = process.env.N8N_DIAGNOSTIC_WEBHOOK_URL?.trim()
  const webhookSecret = process.env.N8N_DIAGNOSTIC_WEBHOOK_SECRET?.trim()

  if (!webhookUrl || !webhookSecret) {
    throw new Error('DIAGNOSTIC_WEBHOOK_NOT_CONFIGURED')
  }

  const body = JSON.stringify({
    source: 'konamy-systems-web',
    submittedAt: new Date().toISOString(),
    payload: data,
  })

  const signature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex')
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Konamy-Signature': signature,
    },
    body,
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('DIAGNOSTIC_WEBHOOK_FAILED')
  }
}

export async function deliverContactSubmission(
  data: ContactFormData,
): Promise<SubmissionResponse> {
  const pendingVariables = getContactPendingVariables()

  if (pendingVariables.length > 0) {
    return {
      status: 503,
      body: {
        success: false,
        configured: false,
        message:
          'El formulario breve ya valida en cliente y servidor, pero todavía no tiene un destino real completamente configurado.',
      },
    }
  }

  const destinationEmail = getAdminNotificationDestination('CONTACT_DESTINATION_EMAIL')
  const payload = sanitizeContactFormData(data)

  try {
    await sendPlainEmail({
      to: destinationEmail,
      subject: `[Contacto] ${payload.subject} · ${payload.company}`,
      replyTo: payload.email,
      text: buildContactEmailText(payload),
    })

    return {
      status: 200,
      body: {
        success: true,
        configured: true,
        deliveries: ['smtp-email'],
        message: 'La solicitud fue enviada correctamente al canal de contacto configurado.',
      },
    }
  } catch {
    return {
      status: 502,
      body: {
        success: false,
        configured: true,
        message:
          'No fue posible entregar el formulario breve al destino configurado.',
      },
    }
  }
}

export async function deliverDiagnosticSubmission(
  data: DiagnosticFormData,
): Promise<SubmissionResponse> {
  const payload = sanitizeDiagnosticFormData(data)
  const delivered: string[] = []
  const failed: string[] = []
  const pending: string[] = []

  const diagnosticEmailConfigured =
    Boolean(getAdminNotificationDestination('DIAGNOSTIC_DESTINATION_EMAIL')) &&
    Boolean(getSmtpConfig())
  const diagnosticWebhookConfigured =
    Boolean(process.env.N8N_DIAGNOSTIC_WEBHOOK_URL?.trim()) &&
    Boolean(process.env.N8N_DIAGNOSTIC_WEBHOOK_SECRET?.trim())

  if (!diagnosticEmailConfigured) {
    pending.push(...getMissingSmtpEnv())

    if (!getAdminNotificationDestination('DIAGNOSTIC_DESTINATION_EMAIL')) {
      pending.push(getAdminNotificationDestinationLabel('DIAGNOSTIC_DESTINATION_EMAIL'))
    }
  }

  if (!diagnosticWebhookConfigured) {
    pending.push(...siteConfig.integrations.diagnostics.webhookEnv)
  }

  if (!diagnosticEmailConfigured && !diagnosticWebhookConfigured) {
    return {
      status: 503,
      body: {
        success: false,
        configured: false,
        message:
          'El diagnóstico ya está preparado como flujo multipaso con validación completa, pero todavía no tiene un destino real configurado para correo o n8n.',
      },
    }
  }

  if (diagnosticEmailConfigured) {
    try {
      await sendPlainEmail({
        to: getAdminNotificationDestination('DIAGNOSTIC_DESTINATION_EMAIL'),
        subject: `[Diagnóstico] ${payload.company} · ${payload.name}`,
        replyTo: payload.email,
        text: buildDiagnosticEmailText(payload),
      })
      delivered.push('smtp-email')
    } catch {
      failed.push('smtp-email')
    }
  }

  if (diagnosticWebhookConfigured) {
    try {
      await sendDiagnosticWebhook(payload)
      delivered.push('n8n-webhook')
    } catch {
      failed.push('n8n-webhook')
    }
  }

  if (delivered.length === 0) {
    return {
      status: 502,
      body: {
        success: false,
        configured: true,
        message:
          'No fue posible entregar el diagnóstico a ninguno de los destinos configurados.',
        failedDeliveries: failed,
      },
    }
  }

  if (failed.length > 0) {
    return {
      status: 207,
      body: {
        success: true,
        partial: true,
        configured: true,
        deliveries: delivered,
        failedDeliveries: failed,
        message:
          'El diagnóstico se entregó parcialmente. Revise las integraciones pendientes o fallidas antes de publicar.',
      },
    }
  }

  return {
    status: 200,
    body: {
      success: true,
      configured: true,
      deliveries: delivered,
      message: unique(pending).length
        ? 'El diagnóstico fue entregado al destino activo. Aún hay integraciones opcionales pendientes.'
        : 'El diagnóstico fue entregado correctamente a los destinos configurados.',
    },
  }
}
