import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { adminRoleLabels } from '@/lib/admin-data'
import { requireAdminUser } from '@/lib/admin-auth'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode
}) {
  const admin = await requireAdminUser('/admin')

  return (
    <AdminShell
      admin={{
        name: admin.name,
        email: admin.email,
        role: adminRoleLabels[admin.role],
      }}
    >
      {children}
    </AdminShell>
  )
}

