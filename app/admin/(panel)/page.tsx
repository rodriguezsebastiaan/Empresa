import Link from 'next/link'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import { formatAdminDateTime, getAdminDashboardSnapshot } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot()

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <p className="text-xs font-semibold tracking-[0.32em] text-primary">DASHBOARD</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">Panel de control operativo</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Este modulo centraliza contactos, diagnosticos y reuniones reales de Konamy Systems.
          Desde aqui puede revisar actividad reciente, priorizar seguimiento y entrar al detalle
          administrativo de cada flujo sin afectar el sitio publico.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">CONTACTOS TOTALES</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.totalContacts}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {snapshot.totals.newContacts} en estado NEW
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">CONTACTOS 7 DIAS</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.recentContacts}</p>
          <p className="mt-2 text-sm text-muted-foreground">Ingresos recientes al pipeline</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">DIAGNOSTICOS TOTALES</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.totalDiagnostics}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {snapshot.totals.newDiagnostics} en estado NEW
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">DIAGNOSTICOS 7 DIAS</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.recentDiagnostics}</p>
          <p className="mt-2 text-sm text-muted-foreground">Actividad reciente del diagnostico</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">REUNIONES TOTALES</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.totalBookings}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {snapshot.totals.pendingBookings} pendientes de gestion
          </p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">REUNIONES 7 DIAS</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.recentBookings}</p>
          <p className="mt-2 text-sm text-muted-foreground">Reservas creadas recientemente</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">REUNIONES PROXIMAS</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.upcomingBookings}</p>
          <p className="mt-2 text-sm text-muted-foreground">Pendientes o confirmadas hacia adelante</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">REUNIONES DE HOY</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.todaysBookings}</p>
          <p className="mt-2 text-sm text-muted-foreground">Agenda del dia actual</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-[1.75rem] border border-border/70 bg-background/45 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">CONTACTOS RECIENTES</p>
              <h2 className="mt-3 text-xl font-semibold text-foreground">Ultimos ingresos</h2>
            </div>
            <Link
              href="/admin/contactos"
              className="rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
            >
              VER TODOS
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {snapshot.recentContactItems.length > 0 ? (
              snapshot.recentContactItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/contactos?id=${item.id}`}
                  className="block rounded-2xl border border-border/70 bg-background/35 p-4 transition-colors hover:border-primary/25"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.company}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.name}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{item.subject}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{formatAdminDateTime(item.createdAt)}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/20 p-5 text-sm text-muted-foreground">
                Todavia no hay contactos registrados.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-border/70 bg-background/45 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">DIAGNOSTICOS RECIENTES</p>
              <h2 className="mt-3 text-xl font-semibold text-foreground">Ultimos ingresos</h2>
            </div>
            <Link
              href="/admin/diagnosticos"
              className="rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
            >
              VER TODOS
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {snapshot.recentDiagnosticItems.length > 0 ? (
              snapshot.recentDiagnosticItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/diagnosticos?id=${item.id}`}
                  className="block rounded-2xl border border-border/70 bg-background/35 p-4 transition-colors hover:border-primary/25"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.company}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.name}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{item.summary}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{formatAdminDateTime(item.createdAt)}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/20 p-5 text-sm text-muted-foreground">
                Todavia no hay diagnosticos registrados.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-border/70 bg-background/45 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">PROXIMAS REUNIONES</p>
              <h2 className="mt-3 text-xl font-semibold text-foreground">Agenda operativa</h2>
            </div>
            <Link
              href="/admin/reuniones"
              className="rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
            >
              VER TODAS
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {snapshot.upcomingBookingItems.length > 0 ? (
              snapshot.upcomingBookingItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/reuniones?id=${item.id}`}
                  className="block rounded-2xl border border-border/70 bg-background/35 p-4 transition-colors hover:border-primary/25"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.company}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.fullName}</p>
                    </div>
                    <AdminStatusBadge status={item.status} compact />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {formatAdminDateTime(item.startAt)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.googleMeetUrl ? 'Google Meet listo' : 'Meet pendiente en invitacion'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/20 p-5 text-sm text-muted-foreground">
                Todavia no hay reuniones proximas registradas.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}
