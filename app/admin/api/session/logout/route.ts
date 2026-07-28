import { NextResponse } from 'next/server'
import {
  clearAdminSessionCookie,
  invalidateCurrentAdminSession,
  isAdminActionOriginValid,
} from '@/lib/admin-auth'

export async function POST(request: Request) {
  if (!isAdminActionOriginValid(request)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Origen inválido para cerrar sesión.',
      },
      { status: 403 },
    )
  }

  await invalidateCurrentAdminSession()

  const response = NextResponse.redirect(new URL('/admin/login?error=signed-out', request.url), {
    status: 303,
  })
  clearAdminSessionCookie(response)
  return response
}
