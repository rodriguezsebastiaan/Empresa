import { NextResponse } from 'next/server'
import { getAvailabilitySnapshot } from '@/lib/availability-service'

export async function GET() {
  const snapshot = await getAvailabilitySnapshot()

  return NextResponse.json({
    success: true,
    settings: {
      isEnabled: snapshot.settings.isEnabled,
      timezoneLabel: snapshot.settings.timezoneLabel,
      durationMinutes: snapshot.settings.durationMinutes,
      bufferMinutes: snapshot.settings.bufferMinutes,
      minNoticeHours: snapshot.settings.minNoticeHours,
      maxDaysAhead: snapshot.settings.maxDaysAhead,
      defaultModality: snapshot.settings.defaultModality,
      calendarMode: process.env.GOOGLE_CALENDAR_MODE === 'real' ? 'real' : 'mock-development',
    },
  })
}
