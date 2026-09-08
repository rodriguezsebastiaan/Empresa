import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, ExternalLink, Link2, type LucideIcon } from 'lucide-react'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import { formatAdminDateTime, type RelatedActivityItem } from '@/lib/admin-data'
import { cn } from '@/lib/utils'

const tileToneClasses = {
  default: 'border-border/70 bg-background/38',
  primary: 'border-primary/25 bg-primary/[0.075]',
  success: 'border-emerald-400/25 bg-emerald-400/[0.075]',
  warning: 'border-amber-400/25 bg-amber-400/[0.075]',
  accent: 'border-sky-400/25 bg-sky-400/[0.075]',
} as const

const moduleToneClasses = {
  primary: 'border-primary/25 bg-primary/[0.08] text-primary',
  accent: 'border-sky-400/25 bg-sky-400/[0.08] text-sky-200',
  success: 'border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-200',
} as const

const relatedEntityLabels: Record<RelatedActivityItem['entity'], string> = {
  diagnosticos: 'Diagnóstico',
  reuniones: 'Asesoría',
}

export function AdminExecutiveModuleCard({
  href,
  label,
  title,
  description,
  total,
  totalLabel,
  icon: Icon,
  tone,
  metrics,
}: {
  href: string
  label: string
  title: string
  description: string
  total: number
  totalLabel: string
  icon: LucideIcon
  tone: keyof typeof moduleToneClasses
  metrics: Array<{
    label: string
    value: number
  }>
}) {
  const totalMetrics = metrics.reduce((sum, metric) => sum + metric.value, 0)

  return (
    <Link
      href={href}
      scroll={false}
      className="group relative block overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(4,13,20,0.42)_42%,rgba(4,13,20,0.72))] p-6 shadow-[0_24px_90px_-70px_var(--primary)] backdrop-blur-sm transition-colors hover:border-primary/30 lg:p-7"
    >
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.28em] text-primary">{label}</p>
          <h2 className="mt-4 text-[1.7rem] font-semibold leading-tight text-foreground sm:text-[1.95rem]">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-2xl border',
            moduleToneClasses[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-6 rounded-[1.55rem] border border-border/70 bg-background/34 p-5 shadow-inner shadow-black/10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.64rem] font-semibold tracking-[0.18em] text-primary">{totalLabel}</p>
            <p className="mt-3 text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-[3.3rem]">
              {total}
            </p>
          </div>
          <p className="max-w-[14rem] text-right text-xs leading-relaxed text-muted-foreground">
            Estados visibles para priorizar operación y seguimiento.
          </p>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-background/80">
          <div className="flex h-full">
            {metrics.map((metric) => (
              <span
                key={metric.label}
                className={cn(
                  'h-full',
                  metric.label.includes('PENDIENTE')
                    ? 'bg-primary/80'
                    : metric.label.includes('PROCESO') || metric.label.includes('CONFIRMADA')
                      ? 'bg-sky-300/80'
                      : 'bg-emerald-300/80',
                )}
                style={{
                  width: `${totalMetrics > 0 ? (metric.value / totalMetrics) * 100 : 0}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="min-w-0 border-border/50 sm:border-l sm:pl-4 first:sm:border-l-0 first:sm:pl-0"
            >
              <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-2 text-[1.85rem] font-semibold leading-none text-foreground">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Abrir módulo
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.85rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.045),rgba(4,13,20,0.46)_48%,rgba(4,13,20,0.7))] p-6 shadow-[0_24px_90px_-72px_var(--primary)] backdrop-blur-sm lg:p-8">
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.32em] text-primary">{eyebrow}</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground">{title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </section>
  )
}

export function AdminModuleSummaryBoard({
  totalLabel,
  total,
  totalHint,
  metrics,
  tone = 'primary',
}: {
  totalLabel: string
  total: number
  totalHint: string
  metrics: Array<{
    label: string
    value: number
    hint: string
  }>
  tone?: keyof typeof moduleToneClasses
}) {
  const totalMetrics = metrics.reduce((sum, metric) => sum + metric.value, 0)

  return (
    <section className="relative overflow-hidden rounded-[1.7rem] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(4,13,20,0.46)_46%,rgba(4,13,20,0.7))] p-5 shadow-[0_20px_70px_-62px_var(--primary)] backdrop-blur-sm lg:p-6">
      <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div
          className={cn(
            'rounded-[1.45rem] border p-5',
            moduleToneClasses[tone],
          )}
        >
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-current/90">{totalLabel}</p>
          <p className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-[3.6rem]">
            {total}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{totalHint}</p>
        </div>

        <div className="rounded-[1.45rem] border border-border/70 bg-background/30 p-4 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-primary">
              ESTADOS SECUNDARIOS
            </p>
            <p className="text-xs text-muted-foreground">Lectura ejecutiva del rango actual.</p>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-background/80">
            <div className="flex h-full">
              {metrics.map((metric) => (
                <span
                  key={metric.label}
                  className={cn(
                    'h-full',
                    metric.label.includes('PENDIENTE')
                      ? 'bg-primary/80'
                      : metric.label.includes('PROCESO') || metric.label.includes('CONFIRMADA')
                        ? 'bg-sky-300/80'
                        : 'bg-emerald-300/80',
                  )}
                  style={{
                    width: `${totalMetrics > 0 ? (metric.value / totalMetrics) * 100 : 0}%`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="border-border/50 sm:border-l sm:pl-4 first:sm:border-l-0 first:sm:pl-0"
              >
                <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-[2rem] font-semibold leading-none text-foreground">
                  {metric.value}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{metric.hint}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function AdminSummaryTile({
  label,
  value,
  hint,
  tone = 'default',
  className,
}: {
  label: string
  value: number | string
  hint: string
  tone?: keyof typeof tileToneClasses
  className?: string
}) {
  return (
    <article
      className={cn(
        'rounded-[1.35rem] border p-4 shadow-[0_16px_55px_-52px_var(--primary)] backdrop-blur-sm',
        tileToneClasses[tone],
        className,
      )}
    >
      <p className="text-[0.65rem] font-semibold tracking-[0.24em] text-primary">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{hint}</p>
    </article>
  )
}

export function AdminQuickFilterLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active?: boolean
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-2 text-[0.68rem] font-semibold tracking-[0.18em] transition-colors',
        active
          ? 'border-primary/40 bg-primary/[0.12] text-primary shadow-[0_0_20px_-12px_var(--primary)]'
          : 'border-border/70 bg-background/30 text-muted-foreground hover:border-primary/30 hover:text-primary',
      )}
    >
      {label}
    </Link>
  )
}

export function AdminInfoCard({
  label,
  hint,
  className,
  children,
}: {
  label: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('rounded-2xl border border-border/70 bg-background/35 p-4 shadow-inner shadow-black/5', className)}>
      <p className="text-xs font-semibold tracking-[0.18em] text-primary">{label}</p>
      <div className="mt-2 text-sm text-foreground">{children}</div>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function AdminSectionCard({
  title,
  description,
  className,
  children,
}: {
  title: string
  description?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn('relative overflow-hidden rounded-[1.55rem] border border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(4,13,20,0.46)_48%,rgba(4,13,20,0.68))] p-5 shadow-[0_18px_65px_-58px_var(--primary)] lg:p-6', className)}>
      <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary">{title}</p>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function AdminEmptyState({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-primary/20 bg-primary/[0.035] p-5 text-sm leading-relaxed text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AdminCollapsiblePanel({
  title,
  summary,
  children,
  defaultOpen = true,
}: {
  title: string
  summary?: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-border/70 bg-background/35 p-4 transition-colors open:border-primary/20 open:bg-background/45"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.16em] text-primary">{title}</p>
          {summary ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
          ) : null}
        </div>
        <span className="pt-1 text-primary transition-transform group-open:rotate-90">
          <ChevronRight className="size-4" />
        </span>
      </summary>

      <div className="mt-4 text-sm text-foreground">{children}</div>
    </details>
  )
}

export function AdminTechnicalDetails({
  title = 'METADATOS TÉCNICOS',
  items,
}: {
  title?: string
  items: Array<{ label: string; value: string }>
}) {
  return (
    <details className="group rounded-2xl border border-border/70 bg-background/35 p-4 transition-colors open:border-primary/20 open:bg-background/45">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.16em] text-primary">{title}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ver datos técnicos de origen, navegador y trazabilidad.
          </p>
        </div>
        <span className="text-xs font-semibold tracking-[0.18em] text-primary transition-transform group-open:rotate-90">
          <ChevronRight className="size-4" />
        </span>
      </summary>

      <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <p key={item.label} className="break-words">
            <span className="font-medium text-foreground/90">{item.label}:</span> {item.value}
          </p>
        ))}
      </div>
    </details>
  )
}

export function AdminNotesSection({
  items,
  emptyLabel,
}: {
  items: Array<{
    id: string
    body: string
    createdAt: Date
    adminUser: {
      name: string
    }
  }>
  emptyLabel: string
}) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary">NOTAS INTERNAS</p>
      {items.length > 0 ? (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {items.map((note) => (
            <article key={note.id} className="rounded-2xl border border-border/70 bg-background/35 p-4 shadow-inner shadow-black/5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{note.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {note.adminUser.name} - {formatAdminDateTime(note.createdAt)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmptyState>{emptyLabel}</AdminEmptyState>
      )}
    </section>
  )
}

export function AdminHistorySection({
  items,
  emptyLabel,
}: {
  items: Array<{
    id: string
    fromStatus: string | null
    toStatus: string
    note: string | null
    createdAt: Date
    adminUser: {
      name: string
    } | null
  }>
  emptyLabel: string
}) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold tracking-[0.18em] text-primary">HISTORIAL</p>
      {items.length > 0 ? (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {items.map((entry) => (
            <article key={entry.id} className="rounded-2xl border border-border/70 bg-background/35 p-4 shadow-inner shadow-black/5">
              <div className="flex flex-wrap items-center gap-2">
                {entry.fromStatus ? <AdminStatusBadge status={entry.fromStatus} compact /> : null}
                <span className="text-xs text-muted-foreground">-&gt;</span>
                <AdminStatusBadge status={entry.toStatus} compact />
              </div>
              {entry.note ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {entry.note}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-muted-foreground">
                {entry.adminUser?.name ?? 'Sistema'} - {formatAdminDateTime(entry.createdAt)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmptyState>{emptyLabel}</AdminEmptyState>
      )}
    </section>
  )
}

export function AdminRelatedActivity({
  items,
}: {
  items: RelatedActivityItem[]
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="size-4 text-primary" />
        <p className="text-xs font-semibold tracking-[0.18em] text-primary">ACTIVIDAD RELACIONADA</p>
      </div>

      {items.length > 0 ? (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {items.map((item) => (
            <Link
              key={`${item.entity}-${item.id}`}
              href={item.href}
              className="block rounded-2xl border border-border/70 bg-background/35 p-4 transition-colors hover:border-primary/30 hover:bg-background/45"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary">
                    {relatedEntityLabels[item.entity]}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <AdminStatusBadge status={item.status} compact />
                  <ExternalLink className="size-4 text-muted-foreground" />
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {item.matchReasons.map((reason) => (
                  <span
                    key={reason}
                    className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-primary"
                  >
                    {reason}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground">{formatAdminDateTime(item.happenedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <AdminEmptyState>
          Aún no encontramos actividad relacionada por correo, teléfono o empresa dentro de los
          otros modulos.
        </AdminEmptyState>
      )}
    </section>
  )
}
