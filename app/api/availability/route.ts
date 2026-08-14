import { NextResponse } from 'next/server'
import { listAvailableSlots } from '@/lib/availability-service'
import {
  applyRateLimitHeaders,
  buildRateLimitResponse,
  evaluateRateLimit,
} from '@/lib/rate-limit'

export async function GET(request: Request) {
  const rateLimit = evaluateRateLimit(request, {
    key: 'availability',
    limit: 40,
    windowMs: 5 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      rateLimit,
      'Se alcanzó temporalmente el límite de consultas de disponibilidad.',
    )
  }

  const respond = (body: Record<string, unknown>, status: number) =>
    applyRateLimitHeaders(NextResponse.json(body, { status }), rateLimit)

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  if (!date) {
    return respond({ success: false, message: 'Debe indicar una fecha.' }, 400)
  }

  try {
    const availability = await listAvailableSlots(date)

    return respond(
      {
        success: true,
        configured: availability.configured,
        date,
        slots: availability.slots,
        message: availability.message,
        rules: {
          timezone: availability.snapshot.settings.timezoneLabel,
          durationMinutes: availability.snapshot.settings.durationMinutes,
          bufferMinutes: availability.snapshot.settings.bufferMinutes,
          minNoticeHours: availability.snapshot.settings.minNoticeHours,
          maxDaysAhead: availability.snapshot.settings.maxDaysAhead,
          calendarMode:
            process.env.GOOGLE_CALENDAR_MODE === 'real' ? 'real' : 'mock-development',
        },
      },
      200,
    )
  } catch (error) {
    const invalidDate = error instanceof Error && error.message === 'INVALID_DATE'

    return respond(
      {
        success: false,
        message: invalidDate
          ? 'La fecha solicitada no es válida.'
          : 'No fue posible consultar la disponibilidad.',
      },
      invalidDate ? 400 : 502,
    )
  }
}
