import { CalendarCheck2, ClipboardList } from 'lucide-react'
import type { Metadata } from 'next'
import { AdminExecutiveModuleCard, AdminPageHeader } from '@/components/admin/admin-ui'
import { getAdminDashboardSnapshot } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Panel administrativo | Konamy Systems',
}

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="DASHBOARD"
        title="Operacion comercial en curso"
        description="Diagnósticos y asesorías en una sola lectura: qué ingresó, qué sigue pendiente y qué ya avanzó lo suficiente para mantener el seguimiento ordenado."
        action={
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.06] px-4 py-3 text-right">
            <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-primary">VISTA EJECUTIVA</p>
            <p className="mt-1 text-sm text-muted-foreground">Diagnósticos y asesorías.</p>
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-2">
        <AdminExecutiveModuleCard
          href="/admin/diagnosticos"
          label="DIAGNOSTICOS"
          title="Diagnosticos empresariales"
          description="Lectura ejecutiva de cada empresa para revisar necesidad, operacion actual y siguiente paso comercial."
          total={snapshot.modules.diagnostics.total}
          totalLabel="TOTAL RECIBIDO"
          tone="accent"
          icon={ClipboardList}
          metrics={[
            {
              label: 'PENDIENTES',
              value: snapshot.modules.diagnostics.pending,
            },
            {
              label: 'EN PROCESO',
              value: snapshot.modules.diagnostics.inProgress,
            },
            {
              label: 'FINALIZADOS',
              value: snapshot.modules.diagnostics.finalized,
            },
          ]}
        />

        <div>
          <AdminExecutiveModuleCard
            href="/admin/reuniones"
            label="ASESORIAS"
            title="Asesorias agendadas"
            description="Asesorias listas para confirmar, ejecutar, reprogramar y cerrar con trazabilidad operativa."
            total={snapshot.modules.bookings.total}
            totalLabel="TOTAL REGISTRADO"
            tone="success"
            icon={CalendarCheck2}
            metrics={[
              {
                label: 'PENDIENTES',
                value: snapshot.modules.bookings.pending,
              },
              {
                label: 'CONFIRMADAS',
                value: snapshot.modules.bookings.confirmed,
              },
              {
                label: 'REALIZADAS',
                value: snapshot.modules.bookings.completed,
              },
            ]}
          />
        </div>
      </section>
    </div>
  )
}
