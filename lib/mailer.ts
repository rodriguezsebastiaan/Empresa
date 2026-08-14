import nodemailer from 'nodemailer'
import { siteConfig } from '@/config/site'

type MailInput = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

type SmtpConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  fromEmail: string
  fromName: string
}

function parseBooleanEnv(value?: string) {
  return ['1', 'true', 'yes', 'on'].includes(value?.trim().toLowerCase() ?? '')
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

export function getMissingSmtpEnv() {
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

function getSmtpConfig(): SmtpConfig | null {
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

function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

function buildFromHeader(fromName: string, fromEmail: string) {
  return `${sanitizeHeaderValue(fromName)} <${sanitizeHeaderValue(fromEmail)}>`
}

export function isSmtpConfigured() {
  return Boolean(getSmtpConfig())
}

export function getAdminNotificationDestination(moduleEnvName: string) {
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

export function getAdminNotificationDestinationLabel(moduleEnvName: string) {
  return `${moduleEnvName} o ADMIN_NOTIFICATION_EMAIL`
}

function createTransporter(smtp: SmtpConfig) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  })
}

export async function verifySmtpConnection() {
  const smtp = getSmtpConfig()

  if (!smtp) {
    throw new Error('SMTP_NOT_CONFIGURED')
  }

  await createTransporter(smtp).verify()
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function buildEmailLayout(input: {
  eyebrow: string
  title: string
  intro: string
  bodyHtml: string
  footer?: string
}) {
  const footer =
    input.footer ??
    `${siteConfig.name}<br>${escapeHtml(siteConfig.slogan)}`

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;background:#061017;color:#e8eef4;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#061017;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border:1px solid rgba(65,245,255,0.18);border-radius:24px;background:#09161f;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 20px;">
                <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.28em;color:#41f5ff;font-weight:700;">${escapeHtml(input.eyebrow)}</p>
                <h1 style="margin:0 0 16px;font-size:30px;line-height:1.12;color:#f5f8fb;">${escapeHtml(input.title)}</h1>
                <p style="margin:0;color:#b6c4d2;font-size:15px;line-height:1.7;">${escapeHtml(input.intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;">
                ${input.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px;border-top:1px solid rgba(65,245,255,0.12);font-size:12px;line-height:1.6;color:#8fa0b2;">
                ${footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function renderDefinitionList(items: Array<{ label: string; value: string }>) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;color:#7fefff;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;vertical-align:top;">${escapeHtml(item.label)}</td>
        <td style="padding:8px 0 8px 18px;color:#e8eef4;font-size:14px;line-height:1.6;">${escapeHtml(item.value)}</td>
      </tr>`,
    )
    .join('')

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>`
}

export function renderEmailSection(title: string, items: Array<{ label: string; value: string }>) {
  return `
    <div style="margin-top:18px;padding:18px;border:1px solid rgba(65,245,255,0.12);border-radius:18px;background:rgba(255,255,255,0.025);">
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#7fefff;font-weight:700;">${escapeHtml(title)}</p>
      ${renderDefinitionList(items)}
    </div>`
}

export function formatEmailDateTime(date: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: siteConfig.advisory.timezone,
  }).format(date)
}

export async function sendEmail(input: MailInput) {
  const smtp = getSmtpConfig()

  if (!smtp) {
    throw new Error('SMTP_NOT_CONFIGURED')
  }

  const transporter = createTransporter(smtp)

  await transporter.sendMail({
    from: buildFromHeader(smtp.fromName, smtp.fromEmail),
    to: sanitizeHeaderValue(input.to),
    replyTo: input.replyTo ? sanitizeHeaderValue(input.replyTo) : undefined,
    subject: sanitizeHeaderValue(input.subject),
    html: input.html,
    text: input.text,
  })
}
