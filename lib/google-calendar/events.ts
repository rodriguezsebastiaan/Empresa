import { siteConfig } from '@/config/site'
import { buildAdvisoryDateTime } from '@/lib/advisory-time'
import { getGoogleAccessToken, getGoogleCalendarCredentials } from '@/lib/google-calendar/auth'
import { listAvailableSlots } from '@/lib/google-calendar/availability'
import type { AdvisoryBookingFormData } from '@/lib/validation'
import type { AdvisoryBookingConfirmation } from '@/lib/google-calendar/types'

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

async function findExistingBookingByRequestId(
  accessToken: string,
  calendarId: string,
  requestId: string,
) {
  const searchParams = new URLSearchParams({
    privateExtendedProperty: `konamyRequestId=${requestId}`,
    maxResults: '1',
    singleEvents: 'true',
  })

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as {
    items?: Array<{
      hangoutLink?: string
      conferenceData?: { entryPoints?: Array<{ uri?: string }> }
    }>
  }

  return payload.items?.[0] ?? null
}

export async function createAdvisoryBooking(
  payload: AdvisoryBookingFormData,
): Promise<AdvisoryBookingConfirmation> {
  const credentials = getGoogleCalendarCredentials()

  if (!credentials) {
    throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED')
  }

  const availableSlots = await listAvailableSlots(payload.date)
  const selectedSlot = availableSlots.find((slot) => slot.value === payload.time)

  if (!selectedSlot) {
    throw new Error('SLOT_NOT_AVAILABLE')
  }

  const accessToken = await getGoogleAccessToken()
  const existingBooking = await findExistingBookingByRequestId(
    accessToken,
    credentials.calendarId,
    payload.requestId,
  )

  if (existingBooking) {
    return {
      dateLabel: buildDateLabel(payload.date),
      timeLabel: buildTimeLabel(payload.date, payload.time),
      timezone: siteConfig.advisory.timezoneLabel,
      durationMinutes: siteConfig.advisory.durationMinutes,
      meetUrl:
        existingBooking.hangoutLink ??
        existingBooking.conferenceData?.entryPoints?.find((entry) => entry.uri)?.uri ??
        null,
      guestEmail: payload.email,
      guestName: payload.fullName,
    }
  }

  const startDateTime = buildAdvisoryDateTime(payload.date, payload.time)
  const endDateTime = new Date(
    startDateTime.getTime() + siteConfig.advisory.durationMinutes * 60 * 1000,
  )

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(credentials.calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `Asesoría inicial · ${payload.company}`,
        description: [
          `Empresa: ${payload.company}`,
          `Contacto: ${payload.fullName}`,
          `Correo: ${payload.email}`,
          `Teléfono: ${payload.phone}`,
          `Ciudad: ${payload.city}`,
          `Proceso a mejorar: ${payload.processGoal}`,
          `Modalidad: ${payload.modality}`,
        ].join('\n'),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: siteConfig.advisory.timezone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: siteConfig.advisory.timezone,
        },
        attendees: [
          {
            email: payload.email,
            displayName: payload.fullName,
          },
        ],
        reminders: {
          useDefault: false,
          overrides: siteConfig.advisory.remindersMinutes.map((minutes) => ({
            method: 'email',
            minutes,
          })),
        },
        conferenceData: {
          createRequest: {
            requestId: payload.requestId,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
        extendedProperties: {
          private: {
            konamyRequestId: payload.requestId,
          },
        },
        guestsCanModify: false,
        guestsCanInviteOthers: false,
      }),
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error('GOOGLE_EVENT_CREATE_FAILED')
  }

  const data = (await response.json()) as {
    hangoutLink?: string
    conferenceData?: { entryPoints?: Array<{ uri?: string }> }
  }

  return {
    dateLabel: buildDateLabel(payload.date),
    timeLabel: buildTimeLabel(payload.date, payload.time),
    timezone: siteConfig.advisory.timezoneLabel,
    durationMinutes: siteConfig.advisory.durationMinutes,
    meetUrl:
      data.hangoutLink ??
      data.conferenceData?.entryPoints?.find((entry) => entry.uri)?.uri ??
      null,
    guestEmail: payload.email,
    guestName: payload.fullName,
  }
}
