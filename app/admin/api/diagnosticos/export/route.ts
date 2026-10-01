import { NextResponse } from 'next/server'
import {
  exportDiagnosticSubmissions,
  formatAdminDateTime,
  parseAdminListFilters,
  serializeCsv,
} from '@/lib/admin-data'
import {
  buildAdminForbiddenResponse,
  getCurrentAdmin,
  hasAdminPermission,
  recordAdminAuditLog,
} from '@/lib/admin-auth'

export async function GET(request: Request) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (!hasAdminPermission(admin, 'exports:download')) {
    return buildAdminForbiddenResponse()
  }

  const filters = parseAdminListFilters(new URL(request.url).searchParams)
  const items = await exportDiagnosticSubmissions(filters)
  await recordAdminAuditLog({
    adminUserId: admin.id,
    action: 'diagnostics.export',
    entityType: 'DiagnosticSubmission',
    metadata: {
      count: items.length,
      status: filters.status ?? null,
      hasQuery: Boolean(filters.q),
      from: filters.from ?? null,
      to: filters.to ?? null,
    },
    request,
  })

  const csv = serializeCsv(
    items.map((item) => ({
      id: item.id,
      createdAt: formatAdminDateTime(item.createdAt),
      status: item.status,
      name: item.name,
      company: item.company,
      role: item.role,
      email: item.email,
      phone: item.phone,
      city: item.city,
      sector: item.sector,
      teamSize: item.teamSize,
      summary: item.summary,
      processes: item.processes,
      currentProcess: item.currentProcess,
      tools: item.tools,
      repetitiveTasks: item.repetitiveTasks,
      mainProblem: item.mainProblem,
      expectedResult: item.expectedResult,
      contactPreference: item.contactPreference,
      wantsMeeting: item.wantsMeeting,
      internalEmailStatus: item.internalEmailStatus,
      clientEmailStatus: item.clientEmailStatus,
      webhookStatus: item.webhookStatus,
      lastDeliveryError: item.lastDeliveryError,
    })),
  )

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="conexacod-diagnosticos.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
