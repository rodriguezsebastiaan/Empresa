import { cn } from '@/lib/utils'

const badgeClasses: Record<string, string> = {
  NEW: 'border-primary/30 bg-primary/10 text-primary',
  IN_REVIEW: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  CONTACTED: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  CLOSED: 'border-muted-foreground/30 bg-muted/25 text-muted-foreground',
  IN_ANALYSIS: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  PROPOSAL_SENT: 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200',
  WON: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  LOST: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  PENDING: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  SENT: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  FAILED: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  SKIPPED: 'border-muted-foreground/30 bg-muted/25 text-muted-foreground',
}

function toLabel(status: string) {
  return status.replaceAll('_', ' ')
}

export function AdminStatusBadge({
  status,
  compact = false,
}: {
  status: string
  compact?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold tracking-[0.18em]',
        compact ? 'px-2.5 py-1 text-[0.6rem]' : 'px-3 py-1.5 text-[0.64rem]',
        badgeClasses[status] ?? 'border-border/70 bg-background/40 text-foreground/80',
      )}
    >
      {toLabel(status)}
    </span>
  )
}

