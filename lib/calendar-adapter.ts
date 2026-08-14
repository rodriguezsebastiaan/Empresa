import { siteConfig } from '@/config/site'
import { getGoogleAccessToken, getGoogleCalendarCredentials } from '@/lib/google-calendar/auth'
import type {
  BusyInterval,
  CalendarBookingInput,
  CalendarBookingRecord,
} from '@/lib/availability-types'

export type CalendarAdapter = {
  getBusyIntervals(date: string): Promise<BusyInterval[]>
  createEvent(input: CalendarBookingInput): Promise<CalendarBookingRecord>
  updateEvent(eventId: string, input: Partial<CalendarBookingInput>): Promise<CalendarBookingRecord>
  cancelEvent(eventId: string, reason?: string): Promise<{ status: 'SENT' | 'FAILED' | 'SKIPPED'; error: string | null }>
  generateMeetLink(input: CalendarBookingInput): Promise<string | null>
}

type GoogleCalendarEventPayload = {
  id?: string
  htmlLink?: string
  hangoutLink?: string
  conferenceData?: {
    entryPoints?: Array<{ uri?: string }>
    conferenceId?: string
    createRequest?: {
      status?: {
        statusCode?: string
      }
    }
  }
}

const googleCalendarApiBase = 'https://www.googleapis.com/calendar/v3'

function safeError(message: string) {
  return message.slice(0, 500)
}

function mockMeetUrl(requestId: string) {
  return `https://meet.google.com/mock-${requestId.slice(0, 10).replace(/[^a-z0-9]/gi, '').toLowerCase()}`
}

function resolveMeetUrl(event: GoogleCalendarEventPayload) {
  return (
    event.hangoutLink ??
    event.conferenceData?.entryPoints?.find((entry) => entry.uri)?.uri ??
    null
  )
}

function resolveConferenceStatus(event: GoogleCalendarEventPayload) {
  return event.conferenceData?.createRequest?.status?.statusCode ?? null
}

function isConferencePending(event: GoogleCalendarEventPayload) {
  return resolveConferenceStatus(event) === 'pending'
}

function buildDescription(input: CalendarBookingInput) {
  return [
    'Reserva generada desde Konamy Systems.',
    '',
    `Nombre: ${input.fullName}`,
    `Empresa: ${input.company}`,
    `Correo: ${input.email}`,
    `Teléfono: ${input.phone}`,
    `Servicio: ${input.modality}`,
    `Fecha: ${input.date}`,
    `Hora: ${input.time}`,
    '',
    'Mensaje:',
    input.processGoal,
  ].join('\n')
}

function buildCalendarRecord(input: {
  eventId: string
  calendarId: string | null
  htmlLink: string | null
  meetingUrl: string | null
  syncStatus: 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED'
  syncError: string | null
}): CalendarBookingRecord {
  return {
    eventId: input.eventId,
    calendarId: input.calendarId,
    htmlLink: input.htmlLink,
    meetingUrl: input.meetingUrl,
    meetUrl: input.meetingUrl,
    syncStatus: input.syncStatus,
    syncedAt: input.syncStatus === 'SENT' ? new Date() : null,
    syncError: input.syncError,
  }
}

export class GoogleCalendarMockAdapter implements CalendarAdapter {
  constructor(private readonly mode = 'none') {}

  async getBusyIntervals(date: string): Promise<BusyInterval[]> {
    if (this.mode === 'sample-busy') {
      return [
        {
          start: `${date}T10:00:00${siteConfig.advisory.utcOffset}`,
          end: `${date}T10:45:00${siteConfig.advisory.utcOffset}`,
          source: 'mock',
        },
      ]
    }

    return []
  }

  async createEvent(input: CalendarBookingInput): Promise<CalendarBookingRecord> {
    if (this.mode === 'error') {
      return buildCalendarRecord({
        eventId: `mock-failed-${input.requestId}`,
        calendarId: null,
        htmlLink: null,
        meetingUrl: null,
        syncStatus: 'FAILED',
        syncError: 'Simulación de error de Calendar activada en desarrollo.',
      })
    }

    return buildCalendarRecord({
      eventId: `mock-calendar-${input.requestId}`,
      calendarId: 'mock-calendar',
      htmlLink: `https://calendar.google.com/calendar/event?eid=mock-${input.requestId}`,
      meetingUrl: null,
      syncStatus: 'SKIPPED',
      syncError: 'Integracion de calendario congelada temporalmente. Reserva local guardada.',
    })
  }

  async updateEvent(eventId: string, input: Partial<CalendarBookingInput>) {
    return buildCalendarRecord({
      eventId,
      calendarId: 'mock-calendar',
      htmlLink: `https://calendar.google.com/calendar/event?eid=${eventId}`,
      meetingUrl: input.requestId ? mockMeetUrl(input.requestId) : null,
      syncStatus: 'SKIPPED',
      syncError: 'Actualización simulada en desarrollo.',
    })
  }

  async cancelEvent() {
    return { status: 'SKIPPED' as const, error: 'Cancelación simulada en desarrollo.' }
  }

  async generateMeetLink(input: CalendarBookingInput) {
    return mockMeetUrl(input.requestId)
  }
}

export class GoogleCalendarAdapter implements CalendarAdapter {
  private async fetchEvent(accessToken: string, calendarId: string, eventId: string) {
    const response = await fetch(
      `${googleCalendarApiBase}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?conferenceDataVersion=1`,
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

    return (await response.json()) as GoogleCalendarEventPayload
  }

  async getBusyIntervals(date: string): Promise<BusyInterval[]> {
    const credentials = getGoogleCalendarCredentials()

    if (!credentials) {
      throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED')
    }

    const accessToken = await getGoogleAccessToken()
    const response = await fetch(`${googleCalendarApiBase}/freeBusy`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin: `${date}T00:00:00${siteConfig.advisory.utcOffset}`,
        timeMax: `${date}T23:59:59${siteConfig.advisory.utcOffset}`,
        timeZone: credentials.timezone,
        items: [{ id: credentials.calendarId }],
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('GOOGLE_FREEBUSY_FAILED')
    }

    const payload = (await response.json()) as {
      calendars?: Record<string, { busy?: Array<{ start: string; end: string }> }>
    }

    return (payload.calendars?.[credentials.calendarId]?.busy ?? []).map((busy) => ({
      start: busy.start,
      end: busy.end,
      source: 'google' as const,
    }))
  }

  async createEvent(input: CalendarBookingInput): Promise<CalendarBookingRecord> {
    const credentials = getGoogleCalendarCredentials()

    if (!credentials) {
      return buildCalendarRecord({
        eventId: `calendar-not-configured-${input.requestId}`,
        calendarId: null,
        htmlLink: null,
        meetingUrl: null,
        syncStatus: 'FAILED',
        syncError: 'Google Calendar no está configurado.',
      })
    }

    try {
      const accessToken = await getGoogleAccessToken()
      const response = await fetch(
        `${googleCalendarApiBase}/calendars/${encodeURIComponent(credentials.calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: `Asesoría inicial · ${input.company}`,
            description: buildDescription(input),
            start: {
              dateTime: input.startAt.toISOString(),
              timeZone: credentials.timezone,
            },
            end: {
              dateTime: input.endAt.toISOString(),
              timeZone: credentials.timezone,
            },
            attendees: [{ email: input.email, displayName: input.fullName }],
            conferenceData: {
              createRequest: {
                requestId: input.requestId,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
              },
            },
            extendedProperties: {
              private: {
                konamyRequestId: input.requestId,
              },
            },
            guestsCanModify: false,
            guestsCanInviteOthers: false,
          }),
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        return buildCalendarRecord({
          eventId: `calendar-failed-${input.requestId}`,
          calendarId: credentials.calendarId,
          htmlLink: null,
          meetingUrl: null,
          syncStatus: 'FAILED',
          syncError: safeError(`Google Calendar rechazó la creación del evento. Código ${response.status}.`),
        })
      }

      let event = (await response.json()) as GoogleCalendarEventPayload

      if (!event.id) {
        return buildCalendarRecord({
          eventId: `calendar-missing-id-${input.requestId}`,
          calendarId: credentials.calendarId,
          htmlLink: event.htmlLink ?? null,
          meetingUrl: resolveMeetUrl(event),
          syncStatus: 'FAILED',
          syncError: 'Google Calendar no devolvió ID de evento.',
        })
      }

      const eventId = event.id

      if (isConferencePending(event)) {
        await new Promise((resolve) => setTimeout(resolve, 900))
        event = (await this.fetchEvent(accessToken, credentials.calendarId, eventId)) ?? event
      }

      const conferenceStatus = resolveConferenceStatus(event)
      const meetingUrl = resolveMeetUrl(event)

      return buildCalendarRecord({
        eventId,
        calendarId: credentials.calendarId,
        htmlLink: event.htmlLink ?? null,
        meetingUrl,
        syncStatus: meetingUrl ? 'SENT' : conferenceStatus === 'failure' ? 'FAILED' : 'PENDING',
        syncError: meetingUrl
          ? null
          : conferenceStatus === 'failure'
            ? 'Google Meet no pudo generarse para el evento.'
            : 'Google Meet sigue pendiente de generación por Google Calendar.',
      })
    } catch (error) {
      return buildCalendarRecord({
        eventId: `calendar-error-${input.requestId}`,
        calendarId: credentials.calendarId,
        htmlLink: null,
        meetingUrl: null,
        syncStatus: 'FAILED',
        syncError: safeError(error instanceof Error ? error.message : 'Error desconocido de Calendar.'),
      })
    }
  }

  async updateEvent(eventId: string, input: Partial<CalendarBookingInput>) {
    return buildCalendarRecord({
      eventId,
      calendarId: getGoogleCalendarCredentials()?.calendarId ?? null,
      htmlLink: null,
      meetingUrl: input.requestId ? await this.generateMeetLink(input as CalendarBookingInput) : null,
      syncStatus: 'SKIPPED',
      syncError: 'Actualización real pendiente de reglas de reprogramación.',
    })
  }

  async cancelEvent(eventId: string) {
    const credentials = getGoogleCalendarCredentials()

    if (!credentials) {
      return { status: 'FAILED' as const, error: 'Google Calendar no está configurado.' }
    }

    try {
      const accessToken = await getGoogleAccessToken()
      const response = await fetch(
        `${googleCalendarApiBase}/calendars/${encodeURIComponent(credentials.calendarId)}/events/${encodeURIComponent(eventId)}?sendUpdates=all`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        },
      )

      if (!response.ok && response.status !== 404) {
        return {
          status: 'FAILED' as const,
          error: safeError(`Google Calendar rechazó la cancelación. Código ${response.status}.`),
        }
      }

      return { status: 'SENT' as const, error: null }
    } catch (error) {
      return {
        status: 'FAILED' as const,
        error: safeError(error instanceof Error ? error.message : 'Error desconocido al cancelar Calendar.'),
      }
    }
  }

  async generateMeetLink(input: CalendarBookingInput) {
    return mockMeetUrl(input.requestId)
  }
}

export function getCalendarAdapter(mockMode = 'none'): CalendarAdapter {
  if (process.env.GOOGLE_CALENDAR_MODE === 'real') {
    return new GoogleCalendarAdapter()
  }

  return new GoogleCalendarMockAdapter(process.env.GOOGLE_CALENDAR_MOCK_MODE ?? mockMode)
}
