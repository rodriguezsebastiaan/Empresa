import { NextResponse } from 'next/server'
import { getAvailabilitySnapshot } from '@/lib/availability-service'
import {
  applyRateLimitHeaders,
  buildRateLimitResponse,
  evaluateRateLimit,
} from '@/lib/rate-limit'

export async function GET(request: Request) {
  const rateLimit = evaluateRateLimit(request, {
    key: 'availability-settings',
    limit: 40,
    windowMs: 5 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      rateLimit,
      'Se alcanzÃ³ temporalmente el lÃ­mite de consultas de disponibilidad.',
    )
  }

  const snapshot = await getAvailabilitySnapshot()

  return applyRateLimitHeaders(
    NextResponse.json({
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
    }),
    rateLimit,
  )
}
