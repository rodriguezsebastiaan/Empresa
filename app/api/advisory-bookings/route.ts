import { NextResponse } from 'next/server'
import { submitAdvisoryBooking } from '@/lib/advisory-booking-service'
import {
  applyRateLimitHeaders,
  buildRateLimitResponse,
  evaluateRateLimit,
} from '@/lib/rate-limit'
import { readJsonRequestBody } from '@/lib/request-body'
import { validateAdvisoryBookingForm } from '@/lib/validation'

export async function POST(request: Request) {
  const rateLimit = evaluateRateLimit(request, {
    key: 'advisory-bookings',
    limit: 6,
    windowMs: 30 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      rateLimit,
      'Demasiados intentos de agendamiento. Espere unos minutos antes de intentar de nuevo.',
    )
  }

  const respond = (body: Record<string, unknown>, status: number) =>
    applyRateLimitHeaders(NextResponse.json(body, { status }), rateLimit)

  const body = await readJsonRequestBody(request)

  if (!body.success) {
    return respond({ success: false, message: body.message }, body.status)
  }

  const result = validateAdvisoryBookingForm(body.data)

  if (!result.success) {
    return respond(
      {
        success: false,
        message: 'Revise los datos del formulario antes de continuar.',
        errors: result.errors,
      },
      422,
    )
  }

  try {
    const submission = await submitAdvisoryBooking(result.data, request)
    return respond(submission.body, submission.status)
  } catch (error) {
    const message =
      error instanceof Error && error.message === 'SLOT_NOT_AVAILABLE'
        ? 'Ese horario ya no está disponible. Seleccione otro antes de confirmar.'
        : 'No fue posible crear la asesoría en este momento.'

    return respond(
      {
        success: false,
        message,
      },
      message.includes('ya no está disponible') ? 409 : 502,
    )
  }
}
