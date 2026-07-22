import { NextResponse } from 'next/server'
import {
  exportContactSubmissions,
  formatAdminDateTime,
  parseAdminListFilters,
  serializeCsv,
} from '@/lib/admin-data'
import { getCurrentAdmin } from '@/lib/admin-auth'

export async function GET(request: Request) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const filters = parseAdminListFilters(new URL(request.url).searchParams)
  const items = await exportContactSubmissions(filters)

  const csv = serializeCsv(
    items.map((item) => ({
      id: item.id,
      createdAt: formatAdminDateTime(item.createdAt),
      status: item.status,
      name: item.name,
      company: item.company,
      email: item.email,
      phone: item.phone,
      subject: item.subject,
      message: item.message,
      internalEmailStatus: item.internalEmailStatus,
      clientEmailStatus: item.clientEmailStatus,
      lastDeliveryError: item.lastDeliveryError,
    })),
  )

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="konamy-contactos.csv"',
      'Cache-Control': 'no-store',
    },
  })
}

