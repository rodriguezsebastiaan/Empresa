import { siteConfig } from '@/config/site'
import type { GoogleCalendarCredentials } from '@/lib/google-calendar/types'

export function getGoogleCalendarCredentials(): GoogleCalendarCredentials | null {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  if (!clientId || !clientSecret || !refreshToken || !calendarId) {
    return null
  }

  return {
    clientId,
    clientSecret,
    refreshToken,
    calendarId,
  }
}

export async function getGoogleAccessToken() {
  const credentials = getGoogleCalendarCredentials()

  if (!credentials) {
    throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      refresh_token: credentials.refreshToken,
      grant_type: 'refresh_token',
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
    locale: 'es-CO',
  }
}
