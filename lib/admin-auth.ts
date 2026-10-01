import crypto from 'node:crypto'
import { AdminRole, Prisma } from '@prisma/client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { siteConfig } from '@/config/site'
import { getDb } from '@/lib/db'
import { getRequestMetadata } from '@/lib/request-metadata'
import { createSessionToken, normalizeEmail, verifyPassword } from '@/lib/security'

const ADMIN_SESSION_COOKIE_NAME = 'konamy_admin_session'
const ADMIN_SESSION_PATH = '/admin'
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const ADMIN_LOGIN_LOCKOUT_ATTEMPTS = 5
const ADMIN_LOGIN_LOCKOUT_MINUTES = 15

export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  OWNER: [
    'dashboard:view',
    'contacts:view',
    'contacts:edit',
    'diagnostics:view',
    'diagnostics:edit',
    'bookings:view',
    'bookings:edit',
    'exports:download',
  ],
  ADMIN: [
    'dashboard:view',
    'contacts:view',
    'contacts:edit',
    'diagnostics:view',
    'diagnostics:edit',
    'bookings:view',
    'bookings:edit',
    'exports:download',
  ],
}

export type AdminPermissionKey =
  | 'dashboard:view'
  | 'contacts:view'
  | 'contacts:edit'
  | 'diagnostics:view'
  | 'diagnostics:edit'
  | 'bookings:view'
  | 'bookings:edit'
  | 'exports:download'

export type AuthenticatedAdmin = {
  id: string
  name: string
  email: string
  role: AdminRole
  sessionId: string
  expiresAt: Date
}

type LoginFailureCode = 'config' | 'invalid' | 'locked'

type LoginResult =
  | {
      success: true
      token: string
      expiresAt: Date
      admin: Omit<AuthenticatedAdmin, 'sessionId' | 'expiresAt'>
    }
  | {
      success: false
      code: LoginFailureCode
    }

function getAuthSecret() {
  const value = process.env.AUTH_SECRET?.trim()

  if (!value || value.includes('CAMBIAR') || value.length < 32) {
    throw new Error('AUTH_SECRET_NOT_CONFIGURED')
  }

  return value
}

function hashSessionToken(token: string) {
  return crypto.createHmac('sha256', getAuthSecret()).update(token).digest('hex')
}

function getSessionExpiryDate() {
  return new Date(Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000)
}

function getSessionCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    expires,
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: ADMIN_SESSION_PATH,
  }
}

async function recordAdminLoginAttempt(input: {
  adminUserId?: string | null
  emailNormalized: string
  success: boolean
  failureReason?: string | null
  request: Request
}) {
  const metadata = getRequestMetadata(input.request)

  try {
    await getDb().adminLoginAttempt.create({
      data: {
        adminUserId: input.adminUserId ?? null,
        emailNormalized: input.emailNormalized,
        success: input.success,
        failureReason: input.failureReason ?? null,
        userAgent: metadata.userAgent,
        ipHash: metadata.ipHash,
      },
    })
  } catch {
    // Login audit should never block access or reveal database details to the user.
  }
}

export async function recordAdminAuditLog(input: {
  adminUserId: string
  action: string
  entityType: string
  entityId?: string | null
  metadata?: Prisma.InputJsonObject
  request: Request
}) {
  const requestMetadata = getRequestMetadata(input.request)

  try {
    await getDb().adminAuditLog.create({
      data: {
        adminUserId: input.adminUserId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        metadata: input.metadata,
        userAgent: requestMetadata.userAgent,
        ipHash: requestMetadata.ipHash,
      },
    })
  } catch {
    // Operational audit is best-effort; the main flow remains the source of truth.
  }
}

export function hasAdminPermission(admin: Pick<AuthenticatedAdmin, 'role'>, permission: AdminPermissionKey) {
  return ADMIN_ROLE_PERMISSIONS[admin.role]?.includes(permission) ?? false
}

export function buildAdminForbiddenResponse() {
  return NextResponse.json(
    {
      success: false,
      message: 'No tiene permisos para realizar esta acciÃ³n.',
    },
    { status: 403 },
  )
}

export function getAdminRuntimeConfigError() {
  if (!process.env.DATABASE_URL?.trim()) {
    return 'DATABASE_URL'
  }

  try {
    getAuthSecret()
    return null
  } catch {
    return 'AUTH_SECRET'
  }
}

export function getSafeAdminReturnTo(value?: string | null) {
  if (!value) {
    return '/admin'
  }

  try {
    if (!value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(value)) return '/admin'
    const url = new URL(value, 'https://admin.invalid')
    if (url.origin !== 'https://admin.invalid' ||
      !(url.pathname === '/admin' || url.pathname.startsWith('/admin/'))) return '/admin'
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/admin'
  }
}

export function buildAdminLoginUrl(returnTo = '/admin', error?: string) {
  const safeReturnTo = getSafeAdminReturnTo(returnTo)
  const params = new URLSearchParams()

  if (safeReturnTo !== '/admin') {
    params.set('next', safeReturnTo)
  }

  if (error) {
    params.set('error', error)
  }

  const query = params.toString()
  return `/admin/login${query ? `?${query}` : ''}`
}

export function getAdminLoginErrorMessage(code?: string | null) {
  switch (code) {
    case 'config':
      return 'Falta configurar AUTH_SECRET o DATABASE_URL antes de usar el panel.'
    case 'locked':
      return 'El acceso quedó bloqueado temporalmente después de varios intentos fallidos.'
    case 'signed-out':
      return 'La sesión administrativa se cerró correctamente.'
    case 'invalid':
      return 'No fue posible iniciar sesión con esas credenciales.'
    default:
      return ''
  }
}

export function isAdminActionOriginValid(request: Request) {
  const origin = request.headers.get('origin') ?? request.headers.get('referer')

  if (!origin) {
    return false
  }

  try {
    const trustedOrigins = new Set([new URL(siteConfig.url).origin])
    const target = new URL(request.url)
    const loopbackHosts = ['localhost', '127.0.0.1', '[::1]']
    // Next may normalize request.url to localhost. Only trust loopback Host
    // aliases for local verification, never an arbitrary forwarded host.
    if (loopbackHosts.includes(target.hostname)) {
      const host = request.headers.get('host') ?? target.host
      const localTarget = new URL(`${target.protocol}//${host}`)
      if (loopbackHosts.includes(localTarget.hostname)) {
        trustedOrigins.add(target.origin)
        trustedOrigins.add(localTarget.origin)
      }
    }
    return trustedOrigins.has(new URL(origin).origin)
  } catch {
    return false
  }
}

async function findAuthenticatedAdminByToken(token: string) {
  let db

  try {
    db = getDb()
  } catch {
    return null
  }

  const tokenHash = hashSessionToken(token)
  const session = await db.adminSession.findFirst({
    where: {
      tokenHash,
      expiresAt: {
        gt: new Date(),
      },
      adminUser: {
        isActive: true,
      },
    },
    include: {
      adminUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })

  if (!session) {
    return null
  }

  return {
    id: session.adminUser.id,
    name: session.adminUser.name,
    email: session.adminUser.email,
    role: session.adminUser.role,
    sessionId: session.id,
    expiresAt: session.expiresAt,
  } satisfies AuthenticatedAdmin
}

export async function getCurrentAdmin() {
  if (getAdminRuntimeConfigError()) {
    return null
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  return findAuthenticatedAdminByToken(token)
}

export async function requireAdminUser(returnTo = '/admin') {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect(buildAdminLoginUrl(returnTo))
  }

  return admin
}

export async function authenticateAdmin(
  email: string,
  password: string,
  request: Request,
): Promise<LoginResult> {
  if (getAdminRuntimeConfigError()) {
    return {
      success: false,
      code: 'config',
    }
  }

  const db = getDb()
  const emailNormalized = normalizeEmail(email)
  const adminUser = await db.adminUser.findUnique({
    where: {
      emailNormalized,
    },
  })
  const now = new Date()

  if (adminUser?.lockedUntil && adminUser.lockedUntil > now) {
    await recordAdminLoginAttempt({
      adminUserId: adminUser.id,
      emailNormalized,
      success: false,
      failureReason: 'locked',
      request,
    })

    return {
      success: false,
      code: 'locked',
    }
  }

  const passwordValid =
    Boolean(adminUser?.isActive) && (await verifyPassword(password, adminUser?.passwordHash ?? ''))

  if (!adminUser || !passwordValid) {
    if (adminUser) {
      const nextFailedCount = adminUser.failedLoginCount + 1
      const shouldLock = nextFailedCount >= ADMIN_LOGIN_LOCKOUT_ATTEMPTS

      await db.adminUser.update({
        where: {
          id: adminUser.id,
        },
        data: {
          failedLoginCount: shouldLock ? 0 : nextFailedCount,
          lockedUntil: shouldLock
            ? new Date(now.getTime() + ADMIN_LOGIN_LOCKOUT_MINUTES * 60 * 1000)
            : null,
        },
      })

      if (shouldLock) {
        await recordAdminLoginAttempt({
          adminUserId: adminUser.id,
          emailNormalized,
          success: false,
          failureReason: 'locked_after_failures',
          request,
        })

        return {
          success: false,
          code: 'locked',
        }
      }
    }

    await recordAdminLoginAttempt({
      adminUserId: adminUser?.id ?? null,
      emailNormalized,
      success: false,
      failureReason: 'invalid_credentials',
      request,
    })

    return {
      success: false,
      code: 'invalid',
    }
  }

  const token = createSessionToken()
  const tokenHash = hashSessionToken(token)
  const expiresAt = getSessionExpiryDate()
  const metadata = getRequestMetadata(request)

  await db.adminUser.update({
    where: {
      id: adminUser.id,
    },
    data: {
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: now,
      sessions: {
        deleteMany: {
          expiresAt: {
            lte: now,
          },
        },
      },
    },
  })

  await db.adminSession.create({
    data: {
      adminUserId: adminUser.id,
      tokenHash,
      expiresAt,
      lastSeenAt: now,
      userAgent: metadata.userAgent,
      ipHash: metadata.ipHash,
    },
  })

  await recordAdminLoginAttempt({
    adminUserId: adminUser.id,
    emailNormalized,
    success: true,
    request,
  })

  await recordAdminAuditLog({
    adminUserId: adminUser.id,
    action: 'admin.login',
    entityType: 'AdminSession',
    metadata: {
      email: adminUser.email,
      role: adminUser.role,
    },
    request,
  })

  return {
    success: true,
    token,
    expiresAt,
    admin: {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    },
  }
}

export function applyAdminSessionCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set(
    ADMIN_SESSION_COOKIE_NAME,
    token,
    getSessionCookieOptions(expiresAt),
  )
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, '', {
    ...getSessionCookieOptions(new Date(0)),
    maxAge: 0,
  })
}

export async function invalidateCurrentAdminSession() {
  if (getAdminRuntimeConfigError()) {
    return
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value

  if (!token) {
    return
  }

  const db = getDb()
  await db.adminSession.deleteMany({
    where: {
      tokenHash: hashSessionToken(token),
    },
  })
}
