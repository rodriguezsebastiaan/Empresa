import { NextResponse } from 'next/server'

type RateLimitRule = {
  key: string
  limit: number
  windowMs: number
}

type RateLimitState = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfterSeconds: number
}

const globalRateLimit = globalThis as typeof globalThis & {
  __konamyRateLimitStore?: Map<string, RateLimitState>
}

const rateLimitStore =
  globalRateLimit.__konamyRateLimitStore ??= new Map<string, RateLimitState>()

function getClientAddress(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()

  return forwardedFor || realIp || 'local'
}

function cleanupExpiredEntries(now: number) {
  for (const [key, state] of rateLimitStore.entries()) {
    if (state.resetAt <= now) {
      rateLimitStore.delete(key)
    }
  }
}

export function evaluateRateLimit(
  request: Request,
  rule: RateLimitRule,
): RateLimitResult {
  const now = Date.now()
  cleanupExpiredEntries(now)

  const scopedKey = `${rule.key}:${getClientAddress(request)}`
  const current = rateLimitStore.get(scopedKey)

  if (!current || current.resetAt <= now) {
    const nextState: RateLimitState = {
      count: 1,
      resetAt: now + rule.windowMs,
    }

    rateLimitStore.set(scopedKey, nextState)

    return {
      allowed: true,
      limit: rule.limit,
      remaining: Math.max(rule.limit - 1, 0),
      resetAt: nextState.resetAt,
      retryAfterSeconds: Math.ceil(rule.windowMs / 1000),
    }
  }

  current.count += 1
  rateLimitStore.set(scopedKey, current)

  const remaining = Math.max(rule.limit - current.count, 0)
  const retryAfterSeconds = Math.max(Math.ceil((current.resetAt - now) / 1000), 1)

  return {
    allowed: current.count <= rule.limit,
    limit: rule.limit,
    remaining,
    resetAt: current.resetAt,
    retryAfterSeconds,
  }
}

export function applyRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult,
) {
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('X-RateLimit-Limit', String(result.limit))
  response.headers.set('X-RateLimit-Remaining', String(result.remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.floor(result.resetAt / 1000)))

  return response
}

export function buildRateLimitResponse(
  result: RateLimitResult,
  message: string,
) {
  const response = NextResponse.json(
    {
      success: false,
      message,
      retryAfterSeconds: result.retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSeconds),
      },
    },
  )

  return applyRateLimitHeaders(response, result)
}
