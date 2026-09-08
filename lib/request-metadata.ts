import { hashValue, sanitizeInline } from '@/lib/security'

export type RequestMetadata = {
  requestOrigin: string | null
  requestPath: string | null
  referer: string | null
  userAgent: string | null
  ipHash: string | null
}

function readClientAddress(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  return forwardedFor || realIp || null
}

function safeHeaderValue(value: string | null, maxLength: number) {
  if (!value) {
    return null
  }

  const sanitized = sanitizeInline(value)
  return sanitized ? sanitized.slice(0, maxLength) : null
}

export function getRequestMetadata(request: Request): RequestMetadata {
  const url = new URL(request.url)
  const requestOrigin = safeHeaderValue(request.headers.get('origin') || url.origin, 191)
  const referer = safeHeaderValue(request.headers.get('referer'), 191)
  const userAgent = safeHeaderValue(request.headers.get('user-agent'), 500)
  const clientAddress = readClientAddress(request)

  return {
    requestOrigin,
    requestPath: safeHeaderValue(url.pathname, 191),
    referer,
    userAgent,
    ipHash: clientAddress ? hashValue(clientAddress) : null,
  }
}
