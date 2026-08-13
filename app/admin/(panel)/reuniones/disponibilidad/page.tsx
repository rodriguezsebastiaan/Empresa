import type { Metadata } from 'next'
import { AvailabilityDatePlanner } from '@/components/admin/availability-date-planner'
import { AdminPageHeader, AdminSectionCard } from '@/components/admin/admin-ui'
import { getAvailabilitySnapshot } from '@/lib/availability-service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Disponibilidad de asesorias | Konamy Systems',
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
        eyebrow="DISPONIBILIDAD DE ASESORIAS"
        title="Planifique la agenda mensual de asesorias."
        description="Defina los periodos de atencion, revise cada fecha del calendario y bloquee dias puntuales cuando sea necesario. Esta pantalla controla la disponibilidad que vera el cliente al agendar; las asesorias ya reservadas se administran desde el detalle de cada asesoria."
      />

      <AdminSectionCard
        title="AGENDA DEL MES"
        description="Planifique un rango de fechas, revise el calendario y ajuste solamente los dias que requieran una configuracion especial."
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
