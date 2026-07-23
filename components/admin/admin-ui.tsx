import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight, ExternalLink, Link2 } from 'lucide-react'
import type { RelatedActivityItem } from '@/lib/admin-data'
import { formatAdminDateTime } from '@/lib/admin-data'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import { cn } from '@/lib/utils'

const tileToneClasses = {
  default: 'border-border/70 bg-background/35',
  primary: 'border-primary/25 bg-primary/10',
  success: 'border-emerald-400/25 bg-emerald-400/10',
  warning: 'border-amber-400/25 bg-amber-400/10',
  accent: 'border-sky-400/25 bg-sky-400/10',
} as const

const relatedEntityLabels: Record<RelatedActivityItem['entity'], string> = {
  contactos: 'Contacto',
  diagnosticos: 'Diagnostico',
  reuniones: 'Reunion',
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
        'rounded-[1.4rem] border p-4 backdrop-blur-sm',
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
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-2 text-[0.68rem] font-semibold tracking-[0.18em] transition-colors',
        active
          ? 'border-primary/40 bg-primary/12 text-primary shadow-[0_0_20px_-12px_var(--primary)]'
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
    <div className={cn('rounded-2xl border border-border/70 bg-background/35 p-4', className)}>
      <p className="text-xs tracking-[0.16em] text-primary">{label}</p>
      <div className="mt-2 text-sm text-foreground">{children}</div>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
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
        'rounded-2xl border border-dashed border-border/70 bg-background/20 p-5 text-sm leading-relaxed text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AdminTechnicalDetails({
  title = 'METADATOS TECNICOS',
  items,
}: {
  title?: string
  items: Array<{ label: string; value: string }>
}) {
  return (
    <details className="group rounded-2xl border border-border/70 bg-background/35 p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.16em] text-primary">{title}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Ver datos tecnicos de origen, navegador y trazabilidad.
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
        items.map((note) => (
          <article key={note.id} className="rounded-2xl border border-border/70 bg-background/35 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{note.body}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {note.adminUser.name} - {formatAdminDateTime(note.createdAt)}
            </p>
          </article>
        ))
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
        items.map((entry) => (
          <article key={entry.id} className="rounded-2xl border border-border/70 bg-background/35 p-4">
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
        ))
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
        items.map((item) => (
          <Link
            key={`${item.entity}-${item.id}`}
            href={item.href}
            className="block rounded-2xl border border-border/70 bg-background/35 p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
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
        ))
      ) : (
        <AdminEmptyState>
          Aun no encontramos actividad relacionada por correo, telefono o empresa dentro de los
          otros modulos.
        </AdminEmptyState>
      )}
    </section>
  )
}
