import type { AvailabilityExceptionType, DeliveryStatus } from '@prisma/client'

export const advisoryTimezone = 'America/Bogota'
export const advisoryTimezoneLabel = 'America/Bogota'
export const advisoryUtcOffset = '-05:00'

export const weekdayLabels = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
] as const

export type TimeRange = {
  startTime: string
  endTime: string
}

export type AvailabilityDateMode = 'weekly' | 'special' | 'blocked' | 'none'

export type AvailabilityDateSummary = {
  date: string
  weekday: number
  mode: AvailabilityDateMode
  reason: string | null
  activeBookings: number
  blockedPeriods: number
  availableStarts: string[]
}

export type AvailabilityRulesSnapshot = {
  settings: {
    id: string
    isEnabled: boolean
    timezone: string
    timezoneLabel: string
    durationMinutes: number
    bufferMinutes: number
    minNoticeHours: number
    maxDaysAhead: number
    defaultModality: string
    calendarMockMode: string
  }
  rules: Array<{
    id: string
    weekday: number
    startTime: string
    endTime: string
    isEnabled: boolean
    sortOrder: number
  }>
  exceptions: Array<{
    id: string
    date: string
    type: AvailabilityExceptionType
    reason: string | null
    ranges: TimeRange[]
  }>
  blockedPeriods: Array<{
    id: string
    date: string
    startTime: string
    endTime: string
    reason: string | null
  }>
  dateSummaries: AvailabilityDateSummary[]
}

export type AvailabilitySlot = {
  start: string
  end: string
  label: string
  value: string
}

export type BusyInterval = {
  start: string
  end: string
  source: 'local' | 'google' | 'mock' | 'blocked'
}

export type CalendarBookingInput = {
  requestId: string
  fullName: string
  company: string
  email: string
  phone: string
  city: string
  processGoal: string
  modality: string
  date: string
  time: string
  startAt: Date
  endAt: Date
  durationMinutes: number
}

export type CalendarBookingRecord = {
  eventId: string
  calendarId: string | null
  htmlLink: string | null
  meetingUrl: string | null
  meetUrl: string | null
  syncStatus: DeliveryStatus
  syncedAt: Date | null
  syncError: string | null
}
