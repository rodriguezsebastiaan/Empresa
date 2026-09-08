import { NextResponse } from 'next/server'
import {
  applyAdminSessionCookie,
  authenticateAdmin,
  buildAdminLoginUrl,
  getSafeAdminReturnTo,
  isAdminActionOriginValid,
} from '@/lib/admin-auth'
import {
  applyRateLimitHeaders,
  buildRateLimitResponse,
  evaluateRateLimit,
} from '@/lib/rate-limit'

export async function POST(request: Request) {
  const rateLimit = evaluateRateLimit(request, {
    key: 'admin-login',
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(
      rateLimit,
      'Demasiados intentos de inicio de sesión. Espere antes de intentar de nuevo.',
    )
  }

  if (!isAdminActionOriginValid(request)) {
    return applyRateLimitHeaders(
      NextResponse.json(
        {
          success: false,
          message: 'Origen inválido para este formulario.',
        },
        { status: 403 },
      ),
      rateLimit,
    )
  }

  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = getSafeAdminReturnTo(String(formData.get('next') ?? '/admin'))

  if (!email || !password) {
    return NextResponse.redirect(new URL(buildAdminLoginUrl(next, 'invalid'), request.url), {
      status: 303,
    })
  }

  let result: Awaited<ReturnType<typeof authenticateAdmin>>

  try {
    result = await authenticateAdmin(email, password, request)
  } catch {
    return NextResponse.redirect(new URL(buildAdminLoginUrl(next, 'config'), request.url), {
      status: 303,
    })
  }

  if (!result.success) {
    return NextResponse.redirect(new URL(buildAdminLoginUrl(next, result.code), request.url), {
      status: 303,
    })
  }

  const response = NextResponse.redirect(new URL(next, request.url), {
    status: 303,
  })
  applyAdminSessionCookie(response, result.token, result.expiresAt)
  return applyRateLimitHeaders(response, rateLimit)
}
