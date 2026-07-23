import { CalendarCheck2, ClipboardList, Mail } from 'lucide-react'
import { AdminExecutiveModuleCard } from '@/components/admin/admin-ui'
import { getAdminDashboardSnapshot } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot()

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <p className="text-xs font-semibold tracking-[0.32em] text-primary">DASHBOARD</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">
          Panel ejecutivo de seguimiento comercial
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Este tablero resume solamente lo que el equipo necesita atender primero: formularios
          breves, diagnosticos empresariales y reuniones activas. Cada modulo concentra cifras
          reales de la base de datos y lleva directo al flujo operativo correspondiente.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <AdminExecutiveModuleCard
          href="/admin/contactos"
          label="CONTACTOS"
          title="Formularios breves"
          description="Entradas rapidas para responder, mover de estado y dar seguimiento sin perder el contexto comercial."
          total={snapshot.modules.contacts.total}
          totalLabel="TOTAL RECIBIDO"
          tone="primary"
          icon={Mail}
          metrics={[
            {
              label: 'PENDIENTES',
              value: snapshot.modules.contacts.pending,
            },
            {
              label: 'EN PROCESO',
              value: snapshot.modules.contacts.inProgress,
            },
            {
              label: 'ATENDIDOS',
              value: snapshot.modules.contacts.attended,
            },
          ]}
        />

        <AdminExecutiveModuleCard
          href="/admin/diagnosticos"
          label="DIAGNOSTICOS"
          title="Evaluaciones empresariales"
          description="Casos para revisar por fecha, entender su contexto operativo y avanzar el seguimiento con criterio."
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

        <AdminExecutiveModuleCard
          href="/admin/reuniones"
          label="REUNIONES"
          title="Agenda de asesorias"
          description="Vista diaria para confirmar reuniones, detectar proximas sesiones y abrir rapido Meet o Calendar cuando ya existan."
          total={snapshot.modules.bookings.total}
          totalLabel="TOTAL REGISTRADO"
          tone="success"
          icon={CalendarCheck2}
          metrics={[
            {
              label: 'HOY',
              value: snapshot.modules.bookings.today,
            },
            {
              label: 'PROXIMAS',
              value: snapshot.modules.bookings.upcoming,
            },
            {
              label: 'ACTIVAS',
              value: snapshot.modules.bookings.active,
            },
          ]}
        />
      </section>
    </div>
  )
}
