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
import { readLimitedRequestText } from '@/lib/request-body'

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

  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/x-www-form-urlencoded') {
    return applyRateLimitHeaders(NextResponse.json({ success: false, message: 'Formato de formulario inválido.' }, { status: 415 }), rateLimit)
  }
  const body = await readLimitedRequestText(request, 8 * 1024)
  if (!body.success) {
    return applyRateLimitHeaders(NextResponse.json({ success: false, message: body.message }, { status: body.status }), rateLimit)
  }
  const formData = new URLSearchParams(body.text)
  if ([...formData.keys()].some((key) => !['email', 'password', 'next'].includes(key)) ||
    ['email', 'password', 'next'].some((key) => formData.getAll(key).length > 1)) {
    return applyRateLimitHeaders(NextResponse.json({ success: false, message: 'Formulario inválido.' }, { status: 400 }), rateLimit)
  }
  const email = (formData.get('email') ?? '').trim()
  const password = formData.get('password') ?? ''
  const next = getSafeAdminReturnTo(formData.get('next'))

  if (!email || email.length > 191 || !password || password.length > 1024) {
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
