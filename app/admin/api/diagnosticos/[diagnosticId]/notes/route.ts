import { NextResponse } from 'next/server'
import {
  buildAdminForbiddenResponse,
  getCurrentAdmin,
  getSafeAdminReturnTo,
  hasAdminPermission,
  isAdminActionOriginValid,
} from '@/lib/admin-auth'
import { addDiagnosticSubmissionNote } from '@/lib/admin-data'

export async function POST(
  request: Request,
  context: { params: Promise<{ diagnosticId: string }> },
) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (!hasAdminPermission(admin, 'diagnostics:edit')) {
    return buildAdminForbiddenResponse()
  }

  if (!isAdminActionOriginValid(request)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Origen invalido.',
      },
      { status: 403 },
    )
  }

  const { diagnosticId } = await context.params
  const formData = await request.formData()
  const note = String(formData.get('note') ?? '')
  const returnTo = getSafeAdminReturnTo(String(formData.get('returnTo') ?? '/admin/diagnosticos'))

  try {
    await addDiagnosticSubmissionNote({
      id: diagnosticId,
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
