import { NextResponse } from 'next/server'
import { deliverDiagnosticSubmission } from '@/lib/form-delivery'
import {
  applyRateLimitHeaders,
  buildRateLimitResponse,
  evaluateRateLimit,
} from '@/lib/rate-limit'
import { readJsonRequestBody } from '@/lib/request-body'
import { validateDiagnosticForm } from '@/lib/validation'

export async function POST(request: Request) {
  const rateLimit = evaluateRateLimit(request, {
    key: 'diagnostic',
    limit: 4,
    windowMs: 15 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      rateLimit,
      'Demasiados envíos de diagnóstico. Espere unos minutos antes de intentar de nuevo.',
    )
  }

  const respond = (body: Record<string, unknown>, status: number) =>
    applyRateLimitHeaders(NextResponse.json(body, { status }), rateLimit)

  const body = await readJsonRequestBody(request)

  if (!body.success) {
    return respond(
      {
        success: false,
        message: body.message,
      },
      body.status,
    )
  }

  const result = validateDiagnosticForm(body.data)

  if (!result.success) {
    return respond(
      {
        success: false,
        message: 'Complete correctamente la información del diagnóstico.',
        errors: result.errors,
      },
      422,
    )
  }

  const delivery = await deliverDiagnosticSubmission(result.data)
  return respond(delivery.body, delivery.status)
}
