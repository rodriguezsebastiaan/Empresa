import { NextResponse } from 'next/server'
import { siteConfig } from '@/config/site'
import { listAvailableSlots } from '@/lib/google-calendar/availability'
import {
  applyRateLimitHeaders,
  buildRateLimitResponse,
  evaluateRateLimit,
} from '@/lib/rate-limit'
import { isGoogleCalendarConfigured } from '@/lib/site'

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
    return respond(
      { success: false, message: 'Debe indicar una fecha.' },
      400,
    )
  }

  if (!isGoogleCalendarConfigured()) {
    return respond(
      {
        success: false,
        configured: false,
        message:
          'La agenda todavía no está disponible. Escríbanos por el formulario de contacto para coordinar la asesoría.',
      },
      503,
    )
  }

  try {
    const slots = await listAvailableSlots(date)

    return respond(
      {
        success: true,
        configured: true,
        date,
        slots,
        rules: {
          timezone: siteConfig.advisory.timezoneLabel,
          durationMinutes: siteConfig.advisory.durationMinutes,
          bufferMinutes: siteConfig.advisory.bufferMinutes,
          minNoticeHours: siteConfig.advisory.minNoticeHours,
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
          : 'No fue posible consultar la disponibilidad del calendario.',
      },
      invalidDate ? 400 : 502,
    )
  }
}
