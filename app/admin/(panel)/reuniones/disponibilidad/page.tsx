import type { Metadata } from 'next'
import { AvailabilityDatePlanner } from '@/components/admin/availability-date-planner'
import { AdminPageHeader, AdminSectionCard } from '@/components/admin/admin-ui'
import { getAvailabilitySnapshot } from '@/lib/availability-service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Disponibilidad de asesorías | Conexacod',
  robots: {
    index: false,
    follow: false,
  },
}

const actionPath = '/admin/api/reuniones/disponibilidad'

export default async function AdminAvailabilityPage() {
  const snapshot = await getAvailabilitySnapshot()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="DISPONIBILIDAD DE ASESORÍAS"
        title="Planifique la agenda mensual de asesorías."
        description="Defina los periodos de atención, revise cada fecha del calendario y bloquee días puntuales cuando sea necesario. Esta pantalla controla la disponibilidad que verá el cliente al agendar; las asesorías ya reservadas se administran desde el detalle de cada asesoría."
      />

      <AdminSectionCard
        title="AGENDA DEL MES"
        description="Planifique un rango de fechas, revise el calendario y ajuste solamente los días que requieran una configuración especial."
      >
        <AvailabilityDatePlanner
          actionPath={actionPath}
          dateSummaries={snapshot.dateSummaries}
          exceptions={snapshot.exceptions}
        />
      </AdminSectionCard>
    </div>
  )
}
