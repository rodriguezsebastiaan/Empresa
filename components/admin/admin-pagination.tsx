import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type AdminPaginationProps = {
  page: number
  pageCount: number
  buildHref: (page: number) => string
}

export function AdminPagination({
  page,
  pageCount,
  buildHref,
}: AdminPaginationProps) {
  if (pageCount <= 1) {
    return null
  }

  const linkClassName =
    'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/25 px-4 py-3">
      <p className="text-sm font-medium text-muted-foreground">
        Pagina <span className="text-foreground">{page}</span> de{' '}
        <span className="text-foreground">{pageCount}</span>
      </p>

      <div className="flex items-center gap-2">
        <Link
          href={buildHref(Math.max(page - 1, 1))}
          aria-disabled={page <= 1}
          className={cn(
            linkClassName,
            page <= 1
              ? 'pointer-events-none border-border/50 bg-background/30 text-muted-foreground/50'
              : 'border-border/70 bg-background/40 text-foreground hover:border-primary/35 hover:text-primary',
          )}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Link>
        <Link
          href={buildHref(Math.min(page + 1, pageCount))}
          aria-disabled={page >= pageCount}
          className={cn(
            linkClassName,
            page >= pageCount
              ? 'pointer-events-none border-border/50 bg-background/30 text-muted-foreground/50'
              : 'border-border/70 bg-background/40 text-foreground hover:border-primary/35 hover:text-primary',
          )}
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
