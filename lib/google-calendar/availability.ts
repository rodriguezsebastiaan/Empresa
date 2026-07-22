import { siteConfig } from '@/config/site'
import {
  addDaysToDateValue,
  buildAdvisoryDateTime,
  formatTimeValueInAdvisoryZone,
  getTodayInAdvisoryZone,
} from '@/lib/advisory-time'
import { getGoogleAccessToken, getGoogleCalendarCredentials } from '@/lib/google-calendar/auth'
import type { AvailabilitySlot, BusyPeriod } from '@/lib/google-calendar/types'

function minutesToMilliseconds(minutes: number) {
  return minutes * 60 * 1000
}

function isAllowedBusinessDay(date: string) {
  const probe = buildAdvisoryDateTime(date, '12:00')
  return siteConfig.advisory.businessDays.some((day) => day === probe.getUTCDay())
}

function isPastOrTooSoon(date: string, time: string) {
  const slotDate = buildAdvisoryDateTime(date, time)
  const minimumLead = minutesToMilliseconds(siteConfig.advisory.minNoticeHours * 60)
  return slotDate.getTime() - Date.now() < minimumLead
}

function isInsideBookingWindow(date: string) {
  const today = getTodayInAdvisoryZone()
  const maxDate = addDaysToDateValue(today, siteConfig.advisory.maxDaysAhead)
  return date >= today && date <= maxDate
}

function overlaps(slotStart: Date, slotEnd: Date, busy: BusyPeriod) {
  const busyStart = new Date(busy.start)
  const busyEnd = new Date(busy.end)
  return slotStart < busyEnd && slotEnd > busyStart
}

function formatTimeLabel(date: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: siteConfig.advisory.timezone,
  }).format(date)
}

export async function getBusyPeriods(date: string): Promise<BusyPeriod[]> {
  const credentials = getGoogleCalendarCredentials()

  if (!credentials) {
    throw new Error('GOOGLE_CALENDAR_NOT_CONFIGURED')
  }

  const accessToken = await getGoogleAccessToken()
  const timeMin = buildAdvisoryDateTime(date, '00:00').toISOString()
  const timeMax = buildAdvisoryDateTime(date, '23:59').toISOString()

  const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: siteConfig.advisory.timezone,
      items: [{ id: credentials.calendarId }],
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('GOOGLE_FREEBUSY_FAILED')
  }

  const payload = (await response.json()) as {
    calendars?: Record<string, { busy?: BusyPeriod[] }>
  }

  return payload.calendars?.[credentials.calendarId]?.busy ?? []
}

export async function listAvailableSlots(date: string): Promise<AvailabilitySlot[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('INVALID_DATE')
  }

  if (!isAllowedBusinessDay(date) || !isInsideBookingWindow(date)) {
    return []
  }

  const busyPeriods = await getBusyPeriods(date)
  const slots: AvailabilitySlot[] = []
  const slotDuration = siteConfig.advisory.durationMinutes
  const slotBuffer = siteConfig.advisory.bufferMinutes
  const slotStep = slotDuration + slotBuffer

  let cursor = buildAdvisoryDateTime(date, siteConfig.advisory.startTime)
  const endBoundary = buildAdvisoryDateTime(date, siteConfig.advisory.endTime)

  while (cursor.getTime() + minutesToMilliseconds(slotDuration) <= endBoundary.getTime()) {
    const slotStart = new Date(cursor)
    const slotEnd = new Date(cursor.getTime() + minutesToMilliseconds(slotDuration))
    const slotValue = formatTimeValueInAdvisoryZone(slotStart)

    if (
      !isPastOrTooSoon(date, slotValue) &&
      !busyPeriods.some((busy) => overlaps(slotStart, slotEnd, busy))
    ) {
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        label: formatTimeLabel(slotStart),
        value: slotValue,
      })
    }

    cursor = new Date(cursor.getTime() + minutesToMilliseconds(slotStep))
  }

  return slots
}
