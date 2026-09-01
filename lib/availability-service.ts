import { Prisma } from '@prisma/client'
import { siteConfig } from '@/config/site'
import {
  addDaysToDateValue,
  buildAdvisoryDateTime,
  formatTimeValueInAdvisoryZone,
  getTodayInAdvisoryZone,
} from '@/lib/advisory-time'
import { getCalendarAdapter } from '@/lib/calendar-adapter'
import { getDb } from '@/lib/db'
import type {
  AvailabilityRulesSnapshot,
  AvailabilitySlot,
  BusyInterval,
  TimeRange,
} from '@/lib/availability-types'

const activeBookingStatuses = ['PENDING', 'CONFIRMED', 'RESCHEDULED'] as const

const defaultRules = [
  { weekday: 1, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
  { weekday: 1, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
  { weekday: 2, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
  { weekday: 2, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
  { weekday: 3, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
  { weekday: 3, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
  { weekday: 4, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
  { weekday: 4, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
  { weekday: 5, startTime: '09:00', endTime: '12:00', sortOrder: 10 },
  { weekday: 5, startTime: '14:00', endTime: '17:00', sortOrder: 20 },
]

function minutesToMilliseconds(minutes: number) {
  return minutes * 60 * 1000
}

function parseMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function formatTimeFromMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function isTimeValue(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

function isDateValue(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isRangeValid(range: TimeRange) {
  return isTimeValue(range.startTime) && isTimeValue(range.endTime) && parseMinutes(range.startTime) < parseMinutes(range.endTime)
}

export function addMinutesToAvailabilityTime(value: string, minutesToAdd: number) {
  if (!isTimeValue(value)) {
    return ''
  }

  const nextMinutes = parseMinutes(value) + minutesToAdd

  if (nextMinutes > 24 * 60) {
    return ''
  }

  return formatTimeFromMinutes(nextMinutes)
}

export function parseAvailabilityTimes(value: FormDataEntryValue | null) {
  const entries = String(value ?? '')
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean)

  return [...new Set(entries)]
    .filter(isTimeValue)
    .sort((first, second) => parseMinutes(first) - parseMinutes(second))
}

export function buildAvailabilityRangesFromTimes(times: string[], durationMinutes: number) {
  return times
    .map((startTime, index) => ({
      startTime,
      endTime: addMinutesToAvailabilityTime(startTime, durationMinutes),
      sortOrder: (index + 1) * 10,
    }))
    .filter((range) => isRangeValid(range))
}

function getWeekday(date: string) {
  return buildAdvisoryDateTime(date, '12:00').getUTCDay()
}

function listDateValues(startDate: string, days: number) {
  return Array.from({ length: days + 1 }, (_, index) => addDaysToDateValue(startDate, index))
}

function buildBusyInterval(startAt: Date, endAt: Date, source: BusyInterval['source']): BusyInterval {
  return {
    start: startAt.toISOString(),
    end: endAt.toISOString(),
    source,
  }
}

function overlaps(slotStart: Date, slotEnd: Date, busy: BusyInterval) {
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

function buildSlotKey(startAt: Date, endAt: Date) {
  return `${startAt.toISOString()}::${endAt.toISOString()}`
}

export function buildAdvisorySlotKey(startAt: Date, endAt: Date) {
  return buildSlotKey(startAt, endAt)
}

function listAvailableStartTimesForDate({
  date,
  ranges,
  durationMinutes,
  bufferMinutes,
  minNoticeHours,
  busyIntervals,
}: {
  date: string
  ranges: TimeRange[]
  durationMinutes: number
  bufferMinutes: number
  minNoticeHours: number
  busyIntervals: BusyInterval[]
}) {
  const starts: string[] = []
  const slotDuration = durationMinutes
  const slotStep = durationMinutes + bufferMinutes

  for (const range of ranges) {
    let cursor = buildAdvisoryDateTime(date, range.startTime)
    const endBoundary = buildAdvisoryDateTime(date, range.endTime)

    while (cursor.getTime() + minutesToMilliseconds(slotDuration) <= endBoundary.getTime()) {
      const slotStart = new Date(cursor)
      const slotEnd = new Date(cursor.getTime() + minutesToMilliseconds(slotDuration))

      const minimumLead = minutesToMilliseconds(minNoticeHours * 60)

      if (
        slotStart.getTime() - Date.now() >= minimumLead &&
        !busyIntervals.some((busy) => overlaps(slotStart, slotEnd, busy))
      ) {
        starts.push(formatTimeValueInAdvisoryZone(slotStart))
      }

      cursor = new Date(cursor.getTime() + minutesToMilliseconds(slotStep))
    }
  }

  return starts
}

export async function ensureAvailabilitySettings() {
  const db = getDb()
  const existing = await db.availabilitySettings.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (existing) {
    return existing
  }

  return db.availabilitySettings.create({
    data: {
      isEnabled: true,
      timezone: siteConfig.advisory.timezone,
      timezoneLabel: siteConfig.advisory.timezoneLabel,
      durationMinutes: 45,
      bufferMinutes: 15,
      minNoticeHours: 12,
      maxDaysAhead: 30,
      defaultModality: siteConfig.advisory.modality,
      calendarMockMode: 'none',
      rules: {
        create: defaultRules,
      },
    },
  })
}

export async function getAvailabilitySnapshot(): Promise<AvailabilityRulesSnapshot> {
  const settings = await ensureAvailabilitySettings()
  const db = getDb()
  const fullSettings = await db.availabilitySettings.findUniqueOrThrow({
    where: { id: settings.id },
    include: {
      rules: { orderBy: [{ weekday: 'asc' }, { sortOrder: 'asc' }, { startTime: 'asc' }] },
      exceptions: {
        orderBy: [{ date: 'asc' }, { updatedAt: 'desc' }],
        include: { ranges: { orderBy: [{ sortOrder: 'asc' }, { startTime: 'asc' }] } },
      },
      blockedPeriods: { orderBy: [{ date: 'asc' }, { startTime: 'asc' }] },
    },
  })

  const snapshotCore = {
    settings: {
      id: fullSettings.id,
      isEnabled: fullSettings.isEnabled,
      timezone: fullSettings.timezone,
      timezoneLabel: fullSettings.timezoneLabel,
      durationMinutes: fullSettings.durationMinutes,
      bufferMinutes: fullSettings.bufferMinutes,
      minNoticeHours: fullSettings.minNoticeHours,
      maxDaysAhead: fullSettings.maxDaysAhead,
      defaultModality: fullSettings.defaultModality,
      calendarMockMode: fullSettings.calendarMockMode,
    },
    rules: fullSettings.rules.map((rule) => ({
      id: rule.id,
      weekday: rule.weekday,
      startTime: rule.startTime,
      endTime: rule.endTime,
      isEnabled: rule.isEnabled,
      sortOrder: rule.sortOrder,
    })),
    exceptions: fullSettings.exceptions.map((exception) => ({
      id: exception.id,
      date: exception.date,
      type: exception.type,
      reason: exception.reason,
      ranges: exception.ranges.map((range) => ({
        startTime: range.startTime,
        endTime: range.endTime,
      })),
    })),
    blockedPeriods: fullSettings.blockedPeriods.map((period) => ({
      id: period.id,
      date: period.date,
      startTime: period.startTime,
      endTime: period.endTime,
      reason: period.reason,
    })),
  }

  const today = getTodayInAdvisoryZone()
  const dates = listDateValues(today, fullSettings.maxDaysAhead)
  const bookings = await db.advisoryBooking.findMany({
    where: {
      scheduledDate: { in: dates },
      status: { in: [...activeBookingStatuses] },
    },
    select: {
      scheduledDate: true,
      startAt: true,
      endAt: true,
    },
  })
  const bookingsByDate = new Map<string, number>()
  const busyByDate = new Map<string, BusyInterval[]>()

  for (const booking of bookings) {
    bookingsByDate.set(booking.scheduledDate, (bookingsByDate.get(booking.scheduledDate) ?? 0) + 1)
    const intervals = busyByDate.get(booking.scheduledDate) ?? []
    intervals.push(buildBusyInterval(booking.startAt, booking.endAt, 'local'))
    busyByDate.set(booking.scheduledDate, intervals)
  }

  const snapshot = {
    ...snapshotCore,
    dateSummaries: dates.map((date) => {
      const exception = snapshotCore.exceptions.find((item) => item.date === date)
      const weekday = getWeekday(date)
      const weeklyRanges = snapshotCore.rules
        .filter((rule) => rule.isEnabled && rule.weekday === weekday)
        .map((rule) => ({ startTime: rule.startTime, endTime: rule.endTime }))
        .filter(isRangeValid)
      const blockedPeriods = snapshotCore.blockedPeriods.filter((period) => period.date === date)
      const busyIntervals = [
        ...(busyByDate.get(date) ?? []),
        ...blockedPeriods
          .filter(isRangeValid)
          .map((period) =>
            buildBusyInterval(
              buildAdvisoryDateTime(date, period.startTime),
              buildAdvisoryDateTime(date, period.endTime),
              'blocked',
            ),
          ),
      ]
      const availableStarts = listAvailableStartTimesForDate({
        date,
        ranges: exception?.type === 'SPECIAL_HOURS' ? exception.ranges.filter(isRangeValid) : weeklyRanges,
        durationMinutes: fullSettings.durationMinutes,
        bufferMinutes: fullSettings.bufferMinutes,
        minNoticeHours: fullSettings.minNoticeHours,
        busyIntervals,
      })

      if (exception?.type === 'BLOCKED_DAY') {
        return {
          date,
          weekday,
          mode: 'blocked' as const,
          reason: exception.reason,
          activeBookings: bookingsByDate.get(date) ?? 0,
          blockedPeriods: blockedPeriods.length,
          availableStarts: [],
        }
      }

      if (exception?.type === 'SPECIAL_HOURS') {
        return {
          date,
          weekday,
          mode: 'special' as const,
          reason: exception.reason,
          activeBookings: bookingsByDate.get(date) ?? 0,
          blockedPeriods: blockedPeriods.length,
          availableStarts,
        }
      }

      return {
        date,
        weekday,
        mode: weeklyRanges.length > 0 ? ('weekly' as const) : ('none' as const),
        reason: null,
        activeBookings: bookingsByDate.get(date) ?? 0,
        blockedPeriods: blockedPeriods.length,
        availableStarts,
      }
    }),
  }

  return snapshot
}

function getBaseRangesForDate(snapshot: AvailabilityRulesSnapshot, date: string): TimeRange[] {
  const exception = snapshot.exceptions.find((item) => item.date === date)

  if (exception?.type === 'BLOCKED_DAY') {
    return []
  }

  if (exception?.type === 'SPECIAL_HOURS') {
    return exception.ranges.filter(isRangeValid)
  }

  const weekday = getWeekday(date)
  return snapshot.rules
    .filter((rule) => rule.isEnabled && rule.weekday === weekday)
    .map((rule) => ({ startTime: rule.startTime, endTime: rule.endTime }))
    .filter(isRangeValid)
}

function isInsideBookingWindow(date: string, snapshot: AvailabilityRulesSnapshot) {
  const today = getTodayInAdvisoryZone()
  const maxDate = addDaysToDateValue(today, snapshot.settings.maxDaysAhead)
  return date >= today && date <= maxDate
}

function isPastOrTooSoon(startAt: Date, snapshot: AvailabilityRulesSnapshot) {
  const minimumLead = minutesToMilliseconds(snapshot.settings.minNoticeHours * 60)
  return startAt.getTime() - Date.now() < minimumLead
}

async function listLocalBusyIntervals(date: string): Promise<BusyInterval[]> {
  const db = getDb()
  const bookings = await db.advisoryBooking.findMany({
    where: {
      scheduledDate: date,
      status: { in: [...activeBookingStatuses] },
    },
    select: {
      startAt: true,
      endAt: true,
    },
  })

  return bookings.map((booking) => ({
    start: booking.startAt.toISOString(),
    end: booking.endAt.toISOString(),
    source: 'local',
  }))
}

function listBlockedIntervals(snapshot: AvailabilityRulesSnapshot, date: string): BusyInterval[] {
  return snapshot.blockedPeriods
    .filter((period) => period.date === date)
    .filter(isRangeValid)
    .map((period) => ({
      start: buildAdvisoryDateTime(date, period.startTime).toISOString(),
      end: buildAdvisoryDateTime(date, period.endTime).toISOString(),
      source: 'blocked' as const,
    }))
}

export async function listAvailableSlots(date: string): Promise<{
  slots: AvailabilitySlot[]
  snapshot: AvailabilityRulesSnapshot
  configured: boolean
  message?: string
}> {
  if (!isDateValue(date)) {
    throw new Error('INVALID_DATE')
  }

  const snapshot = await getAvailabilitySnapshot()

  if (!snapshot.settings.isEnabled) {
    return {
      slots: [],
      snapshot,
      configured: true,
      message: 'El agendamiento está desactivado temporalmente.',
    }
  }

  if (!isInsideBookingWindow(date, snapshot)) {
    return { slots: [], snapshot, configured: true }
  }

  const ranges = getBaseRangesForDate(snapshot, date)

  if (ranges.length === 0) {
    return {
      slots: [],
      snapshot,
      configured: true,
      message: 'No hay horarios disponibles para este día. Selecciona otra fecha.',
    }
  }

  const calendarAdapter = getCalendarAdapter(snapshot.settings.calendarMockMode)
  const [localBusy, calendarBusy] = await Promise.all([
    listLocalBusyIntervals(date),
    calendarAdapter.getBusyIntervals(date),
  ])
  const busyIntervals = [
    ...localBusy,
    ...calendarBusy,
    ...listBlockedIntervals(snapshot, date),
  ]
  const slots: AvailabilitySlot[] = []
  const slotDuration = snapshot.settings.durationMinutes
  const slotStep = snapshot.settings.durationMinutes + snapshot.settings.bufferMinutes

  for (const range of ranges) {
    let cursor = buildAdvisoryDateTime(date, range.startTime)
    const endBoundary = buildAdvisoryDateTime(date, range.endTime)

    while (cursor.getTime() + minutesToMilliseconds(slotDuration) <= endBoundary.getTime()) {
      const slotStart = new Date(cursor)
      const slotEnd = new Date(cursor.getTime() + minutesToMilliseconds(slotDuration))
      const slotValue = formatTimeValueInAdvisoryZone(slotStart)

      if (
        !isPastOrTooSoon(slotStart, snapshot) &&
        !busyIntervals.some((busy) => overlaps(slotStart, slotEnd, busy))
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
  }

  return { slots, snapshot, configured: true }
}

export async function assertSlotAvailable(date: string, time: string) {
  const availability = await listAvailableSlots(date)
  const selectedSlot = availability.slots.find((slot) => slot.value === time)

  if (!selectedSlot) {
    throw new Error('SLOT_NOT_AVAILABLE')
  }

  return {
    slot: selectedSlot,
    snapshot: availability.snapshot,
    startAt: new Date(selectedSlot.start),
    endAt: new Date(selectedSlot.end),
    slotKey: buildSlotKey(new Date(selectedSlot.start), new Date(selectedSlot.end)),
  }
}

export function sanitizeAvailabilityNumber(value: FormDataEntryValue | null, fallback: number) {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export function sanitizeAvailabilityTime(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return isTimeValue(text) ? text : ''
}

export function sanitizeAvailabilityDate(value: FormDataEntryValue | null) {
  const text = String(value ?? '').trim()
  return isDateValue(text) ? text : ''
}

export function uniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}
