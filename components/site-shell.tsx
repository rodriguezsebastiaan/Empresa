import type { ReactNode } from 'react'
import { SiteFooterMain } from '@/components/site-footer-main'
import { SiteHeaderMain } from '@/components/site-header-main'
import { cn } from '@/lib/utils'

type SiteShellProps = {
  children: ReactNode
  className?: string
}

export function SiteShell({ children, className }: SiteShellProps) {
  return (
    <main
      className={cn(
        'relative min-h-screen bg-[linear-gradient(180deg,oklch(0.13_0.02_240)_0%,oklch(0.16_0.03_222)_38%,oklch(0.185_0.028_232)_68%,oklch(0.14_0.02_240)_100%)]',
        className,
      )}
    >
      <SiteHeaderMain />
      {children}
      <SiteFooterMain />
    </main>
  )
}
