import Link from 'next/link'
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

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
      <p className="text-sm text-muted-foreground">
        Pagina {page} de {pageCount}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={buildHref(Math.max(page - 1, 1))}
          aria-disabled={page <= 1}
          className={cn(
            'rounded-xl border px-4 py-2 text-sm font-medium transition-colors',
            page <= 1
              ? 'pointer-events-none border-border/50 bg-background/30 text-muted-foreground/50'
              : 'border-border/70 bg-background/40 text-foreground hover:border-primary/35 hover:text-primary',
          )}
        >
          Anterior
        </Link>
        <Link
          href={buildHref(Math.min(page + 1, pageCount))}
          aria-disabled={page >= pageCount}
          className={cn(
            'rounded-xl border px-4 py-2 text-sm font-medium transition-colors',
            page >= pageCount
              ? 'pointer-events-none border-border/50 bg-background/30 text-muted-foreground/50'
              : 'border-border/70 bg-background/40 text-foreground hover:border-primary/35 hover:text-primary',
          )}
        >
          Siguiente
        </Link>
      </div>
    </div>
  )
}
