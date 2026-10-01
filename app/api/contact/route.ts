import { NextResponse } from 'next/server'
import { submitContactForm } from '@/lib/contact-service'
import {
  applyRateLimitHeaders,
  buildRateLimitResponse,
  evaluateRateLimit,
} from '@/lib/rate-limit'
import { readJsonRequestBody } from '@/lib/request-body'
import { validateContactForm } from '@/lib/validation'

export async function POST(request: Request) {
  const rateLimit = evaluateRateLimit(request, {
    key: 'contact',
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      rateLimit,
      'Demasiadas solicitudes de contacto. Espere unos minutos antes de intentar de nuevo.',
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

  const result = validateContactForm(body.data)

  if (!result.success) {
    return respond(
      {
        success: false,
        message: 'Revise los campos resaltados.',
        errors: result.errors,
      },
      422,
    )
  }

  try {
    const submission = await submitContactForm(result.data, request)
    return respond(submission.body, submission.status)
  } catch {
    return respond({ success: false, message: 'No fue posible registrar la solicitud en este momento.' }, 502)
  }
}
