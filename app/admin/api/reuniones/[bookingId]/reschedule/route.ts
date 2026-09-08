import { NextResponse } from 'next/server'
import {
  buildAdminForbiddenResponse,
  getCurrentAdmin,
  getSafeAdminReturnTo,
  hasAdminPermission,
  isAdminActionOriginValid,
} from '@/lib/admin-auth'
import { rescheduleAdvisoryBooking } from '@/lib/admin-data'

export async function POST(
  request: Request,
  context: { params: Promise<{ bookingId: string }> },
) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (!hasAdminPermission(admin, 'bookings:edit')) {
    return buildAdminForbiddenResponse()
  }

  if (!isAdminActionOriginValid(request)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Origen inválido.',
      },
      { status: 403 },
    )
  }

  const { bookingId } = await context.params
  const formData = await request.formData()
  const date = String(formData.get('date') ?? '')
  const time = String(formData.get('time') ?? '')
  const note = String(formData.get('note') ?? '')
  const returnTo = getSafeAdminReturnTo(String(formData.get('returnTo') ?? '/admin/reuniones'))

  try {
    await rescheduleAdvisoryBooking({
      id: bookingId,
      date,
      time,
      note,
      adminUserId: admin.id,
    })
  } catch {
    return NextResponse.redirect(new URL(returnTo, request.url), {
      status: 303,
    })
  }

  return NextResponse.redirect(new URL(returnTo, request.url), {
    status: 303,
  })
}
