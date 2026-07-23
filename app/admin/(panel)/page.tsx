import Link from 'next/link'
import { ArrowRight, CalendarCheck2, ClipboardList, Mail } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/admin-ui'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import { formatAdminDateTime, getAdminDashboardSnapshot } from '@/lib/admin-data'

export const dynamic = 'force-dynamic'

type ModuleCardProps = {
  href: string
  label: string
  title: string
  description: string
  total: number
  totalLabel: string
  accent: 'primary' | 'sky' | 'emerald'
  icon: typeof Mail
  metrics: Array<{
    label: string
    value: number
  }>
}

const accentClasses: Record<ModuleCardProps['accent'], string> = {
  primary: 'border-primary/25 bg-primary/10 text-primary',
  sky: 'border-sky-400/25 bg-sky-400/10 text-sky-200',
  emerald: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
}

function ModuleCard({
  href,
  label,
  title,
  description,
  total,
  totalLabel,
  accent,
  icon: Icon,
  metrics,
}: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-[1.75rem] border border-border/70 bg-background/45 p-6 backdrop-blur-sm transition-colors hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] text-primary">{label}</p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">{title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border ${accentClasses[accent]}`}
        >
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-border/70 bg-background/35 p-4">
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-primary">{totalLabel}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{total}</p>
        </article>
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-border/70 bg-background/30 p-4">
            <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{metric.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Abrir modulo
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

export default async function AdminDashboardPage() {
  const snapshot = await getAdminDashboardSnapshot()

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <p className="text-xs font-semibold tracking-[0.32em] text-primary">DASHBOARD</p>
        <h1 className="mt-4 text-3xl font-semibold text-foreground">Panel operativo de Konamy Systems</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Este tablero prioriza el trabajo real del equipo: entradas nuevas, seguimientos en curso
          y reuniones activas. Cada modulo concentra un flujo operativo completo sin convertir el
          sistema en un CMS general.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <ModuleCard
          href="/admin/contactos"
          label="CONTACTOS"
          title="Prospectos de respuesta rapida"
          description="Entradas del formulario breve listas para clasificar, responder y mover dentro del seguimiento comercial."
          total={snapshot.totals.totalContacts}
          totalLabel="TOTAL REGISTRADO"
          accent="primary"
          icon={Mail}
          metrics={[
            {
              label: 'PENDIENTES',
              value: snapshot.totals.newContacts,
            },
            {
              label: 'ULTIMOS 7 DIAS',
              value: snapshot.totals.recentContacts,
            },
          ]}
        />

        <ModuleCard
          href="/admin/diagnosticos"
          label="DIAGNOSTICOS"
          title="Evaluaciones empresariales completas"
          description="Respuestas extensas para entender procesos, detectar urgencias y preparar la siguiente conversacion comercial."
          total={snapshot.totals.totalDiagnostics}
          totalLabel="TOTAL REGISTRADO"
          accent="sky"
          icon={ClipboardList}
          metrics={[
            {
              label: 'PENDIENTES',
              value: snapshot.totals.newDiagnostics,
            },
            {
              label: 'ULTIMOS 7 DIAS',
              value: snapshot.totals.recentDiagnostics,
            },
          ]}
        />

        <ModuleCard
          href="/admin/reuniones"
          label="REUNIONES"
          title="Agenda y seguimiento de asesoria"
          description="Reservas reales con estado, enlaces de Meet, evento de Calendar y trazabilidad administrativa para el equipo."
          total={snapshot.totals.totalBookings}
          totalLabel="TOTAL REGISTRADO"
          accent="emerald"
          icon={CalendarCheck2}
          metrics={[
            {
              label: 'PENDIENTES',
              value: snapshot.totals.pendingBookings,
            },
            {
              label: 'PROXIMAS',
              value: snapshot.totals.upcomingBookings,
            },
          ]}
        />
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
              <AdminEmptyState>Todavia no hay contactos registrados.</AdminEmptyState>
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
              <AdminEmptyState>Todavia no hay diagnosticos registrados.</AdminEmptyState>
            )}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-border/70 bg-background/45 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">PROXIMAS REUNIONES</p>
              <h2 className="mt-3 text-xl font-semibold text-foreground">Agenda prioritaria</h2>
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
                  <p className="mt-3 text-sm text-muted-foreground">{formatAdminDateTime(item.startAt)}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {item.googleMeetUrl ? 'Google Meet disponible' : 'Meet pendiente'}
                  </p>
                </Link>
              ))
            ) : (
              <AdminEmptyState>Todavia no hay reuniones proximas registradas.</AdminEmptyState>
            )}
          </div>
        </article>
      </section>
    </div>
  )
}
