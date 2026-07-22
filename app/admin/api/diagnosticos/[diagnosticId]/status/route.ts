import { NextResponse } from 'next/server'
import {
  getCurrentAdmin,
  getSafeAdminReturnTo,
  isAdminActionOriginValid,
} from '@/lib/admin-auth'
import { updateDiagnosticSubmissionStatus } from '@/lib/admin-data'

export async function POST(
  request: Request,
  context: { params: Promise<{ diagnosticId: string }> },
) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
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
  const status = String(formData.get('status') ?? '')
  const note = String(formData.get('note') ?? '')
  const returnTo = getSafeAdminReturnTo(String(formData.get('returnTo') ?? '/admin/diagnosticos'))

  try {
    await updateDiagnosticSubmissionStatus({
      id: diagnosticId,
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
