export type AvailabilitySlot = {
  start: string
  end: string
  label: string
  value: string
}

export type GoogleCalendarCredentials = {
  clientId: string
  clientSecret: string
  refreshToken: string
  calendarId: string
}

export type BusyPeriod = {
  start: string
  end: string
}

export type AdvisoryBookingConfirmation = {
  dateLabel: string
  timeLabel: string
  timezone: string
  durationMinutes: number
  meetUrl: string | null
  guestEmail: string
  guestName: string
}

export type GoogleCalendarBookingRecord = AdvisoryBookingConfirmation & {
  eventId: string
  htmlLink: string | null
}
