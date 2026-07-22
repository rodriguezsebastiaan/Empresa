import Link from 'next/link'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import { getAdminDashboardSnapshot, formatAdminDateTime } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot()

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <p className="text-xs font-semibold tracking-[0.32em] text-primary">DASHBOARD</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">Panel de control operativo</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Este modulo centraliza la revision de contactos y diagnosticos recibidos por Konamy
          Systems. Desde aqui puede priorizar seguimiento, entrar al detalle y mantener la
          trazabilidad administrativa.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">CONTACTOS TOTALES</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.totalContacts}</p>
          <p className="mt-2 text-sm text-muted-foreground">{snapshot.totals.newContacts} en estado NEW</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">CONTACTOS 7 DIAS</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.recentContacts}</p>
          <p className="mt-2 text-sm text-muted-foreground">Ingresos recientes al pipeline</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">DIAGNOSTICOS TOTALES</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.totalDiagnostics}</p>
          <p className="mt-2 text-sm text-muted-foreground">{snapshot.totals.newDiagnostics} en estado NEW</p>
        </article>
        <article className="rounded-[1.5rem] border border-border/70 bg-background/45 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">DIAGNOSTICOS 7 DIAS</p>
          <p className="mt-4 text-3xl font-semibold text-foreground">{snapshot.totals.recentDiagnostics}</p>
          <p className="mt-2 text-sm text-muted-foreground">Nuevos diagnosticos esta semana</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
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
      </section>
    </div>
  )
}

