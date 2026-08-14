import { getStatusLabel } from '@/lib/admin-data'
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
  CONFIRMED: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  COMPLETED: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  CANCELLED: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  RESCHEDULED: 'border-indigo-400/30 bg-indigo-400/10 text-indigo-200',
  NO_SHOW: 'border-orange-400/30 bg-orange-400/10 text-orange-200',
  SENT: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  FAILED: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  SKIPPED: 'border-muted-foreground/30 bg-muted/25 text-muted-foreground',
}

const statusDotClasses: Record<string, string> = {
  NEW: 'bg-primary',
  IN_REVIEW: 'bg-sky-300',
  CONTACTED: 'bg-emerald-300',
  CLOSED: 'bg-muted-foreground',
  IN_ANALYSIS: 'bg-amber-300',
  PROPOSAL_SENT: 'bg-fuchsia-300',
  WON: 'bg-emerald-300',
  LOST: 'bg-rose-300',
  PENDING: 'bg-amber-300',
  CONFIRMED: 'bg-sky-300',
  COMPLETED: 'bg-emerald-300',
  CANCELLED: 'bg-rose-300',
  RESCHEDULED: 'bg-indigo-300',
  NO_SHOW: 'bg-orange-300',
  SENT: 'bg-emerald-300',
  FAILED: 'bg-rose-300',
  SKIPPED: 'bg-muted-foreground',
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
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-[0.16em]',
        compact ? 'px-2.5 py-1 text-[0.6rem]' : 'px-3 py-1.5 text-[0.64rem]',
        badgeClasses[status] ?? 'border-border/70 bg-background/40 text-foreground/80',
      )}
    >
      <span className={cn('size-1.5 rounded-full', statusDotClasses[status] ?? 'bg-foreground/60')} />
      {getStatusLabel(status)}
    </span>
  )
}

