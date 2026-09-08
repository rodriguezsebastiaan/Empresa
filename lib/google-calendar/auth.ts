import { createSign } from 'node:crypto'
import { siteConfig } from '@/config/site'

const tokenEndpoint = 'https://oauth2.googleapis.com/token'
export const googleCalendarScopes = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.events.freebusy',
] as const

export type GoogleServiceAccountCredentials = {
  clientEmail: string
  privateKey: string
  projectId: string | null
  calendarId: string
  timezone: string
  impersonatedUser: string
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, '\n').trim()
}

function readEnv(name: string) {
  return process.env[name]?.trim() || ''
}

export function getGoogleCalendarCredentials(): GoogleServiceAccountCredentials | null {
  const calendarId = readEnv('GOOGLE_CALENDAR_ID')
  const clientEmail = readEnv('GOOGLE_CLIENT_EMAIL')
  const privateKey = readEnv('GOOGLE_PRIVATE_KEY')
  const impersonatedUser = readEnv('GOOGLE_IMPERSONATED_USER')

  if (!calendarId || !clientEmail || !privateKey || !impersonatedUser) {
    return null
  }

  return {
    calendarId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
    projectId: readEnv('GOOGLE_PROJECT_ID') || null,
    timezone: readEnv('GOOGLE_CALENDAR_TIMEZONE') || siteConfig.advisory.timezone,
    impersonatedUser,
  }
}

function buildServiceAccountJwt(credentials: GoogleServiceAccountCredentials) {
  const now = Math.floor(Date.now() / 1000)
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  }
  const claimSet = {
    iss: credentials.clientEmail,
    sub: credentials.impersonatedUser,
    scope: googleCalendarScopes.join(' '),
    aud: tokenEndpoint,
    exp: now + 3600,
    iat: now,
  }
  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claimSet))}`
  const signer = createSign('RSA-SHA256')

  signer.update(unsignedToken)
  signer.end()

  return `${unsignedToken}.${base64Url(signer.sign(credentials.privateKey))}`
}

export async function getGoogleAccessToken() {
  const credentials = getGoogleCalendarCredentials()

  if (!credentials) {
    throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED')
  }

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: buildServiceAccountJwt(credentials),
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('GOOGLE_TOKEN_REQUEST_FAILED')
  }

  const payload = (await response.json()) as {
    access_token?: string
  }

  if (!payload.access_token) {
    throw new Error('GOOGLE_TOKEN_MISSING')
  }

  return payload.access_token
}

export function getCalendarRuntimeConfig() {
  return {
    ...siteConfig.advisory,
    timezone: readEnv('GOOGLE_CALENDAR_TIMEZONE') || siteConfig.advisory.timezone,
    locale: 'es-CO',
  }
}
