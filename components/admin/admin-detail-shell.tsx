import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AdminDetailActions, type AdminDetailAction } from '@/components/admin/admin-detail-actions'

export function AdminDetailShell({
  backHref,
  backLabel,
  eyebrow,
  title,
  subtitle,
  badges,
  actions,
  primary,
  secondary,
}: {
  backHref: string
  backLabel: string
  eyebrow: string
  title: string
  subtitle?: string
  badges?: ReactNode
  actions?: AdminDetailAction[]
  primary: ReactNode
  secondary: ReactNode
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.85rem] border border-border/70 bg-background/50 p-6 backdrop-blur-sm lg:p-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/35 px-3.5 py-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
        >
          <ChevronLeft className="size-4" />
          {backLabel}
        </Link>

        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-primary">{eyebrow}</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground lg:text-[2.4rem]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
            {badges ? <div className="mt-4 flex flex-wrap gap-2">{badges}</div> : null}
          </div>

          {actions && actions.length > 0 ? (
            <div className="xl:max-w-[34rem] xl:justify-end">
              <AdminDetailActions actions={actions} />
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(23rem,0.95fr)]">
        <div className="min-w-0 space-y-6">{primary}</div>
        <aside className="min-w-0 space-y-6 xl:sticky xl:top-6 xl:self-start">{secondary}</aside>
      </div>
    </div>
  )
}
