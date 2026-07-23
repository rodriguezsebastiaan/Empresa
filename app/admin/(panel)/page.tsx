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
        <h1 className="mt-4 text-3xl font-semibold text-foreground">Operacion comercial en curso</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Tres modulos, una sola lectura: que entro, que sigue pendiente y que ya avanzo lo
          suficiente como para no perder tiempo buscando contexto.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AdminExecutiveModuleCard
          href="/admin/contactos"
          label="CONTACTOS"
          title="Formularios breves"
          description="Entradas rapidas para responder, mover de estado y sostener el seguimiento sin abrir vistas secundarias."
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
          description="Lectura ejecutiva de cada empresa para revisar dolor, operacion actual y siguiente paso comercial."
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

        <div className="md:col-span-2 xl:col-span-1">
          <AdminExecutiveModuleCard
            href="/admin/reuniones"
            label="REUNIONES"
            title="Agenda de asesorias"
            description="Reservas listas para confirmar, ejecutar y cerrar con trazabilidad completa sobre Meet, Calendar y seguimiento."
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
