import { NextResponse } from 'next/server'
import {
  buildAdminForbiddenResponse,
  getCurrentAdmin,
  getSafeAdminReturnTo,
  hasAdminPermission,
  isAdminActionOriginValid,
} from '@/lib/admin-auth'
import { updateContactSubmissionStatus } from '@/lib/admin-data'

export async function POST(
  request: Request,
  context: { params: Promise<{ contactId: string }> },
) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (!hasAdminPermission(admin, 'contacts:edit')) {
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

  const { contactId } = await context.params
  const formData = await request.formData()
  const status = String(formData.get('status') ?? '')
  const note = String(formData.get('note') ?? '')
  const returnTo = getSafeAdminReturnTo(String(formData.get('returnTo') ?? '/admin/contactos'))

  try {
    await updateContactSubmissionStatus({
      id: contactId,
      status,
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
