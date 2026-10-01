import type { ReactNode } from 'react'
import { CinematicPage } from '@/components/cinematic/cinematic-page'
import { FloatingSocialButtons } from '@/components/floating-social-buttons'
import { SiteFooterMain } from '@/components/site-footer-main'
import { SiteHeaderMain } from '@/components/site-header-main'
import { PageStructuredData } from '@/components/seo/json-ld'
import type { SitePageKey } from '@/config/site'
import {
  cinematicPageConfig,
  type CinematicPageId,
} from '@/config/cinematic-pages'
import { cn } from '@/lib/utils'

type SiteShellProps = {
  children: ReactNode
  className?: string
  cinematicPage?: CinematicPageId
  seoPage?: SitePageKey
}

export function SiteShell({
  children,
  className,
  cinematicPage,
  seoPage,
}: SiteShellProps) {
  const shellContent = (
    <>
      {seoPage ? <PageStructuredData pageKey={seoPage} /> : null}
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:ring-2 focus-visible:ring-foreground"
      >
        Ir al contenido principal
      </a>
      <SiteHeaderMain />
      <main id="main-content" tabIndex={-1} data-cinematic-page-content data-public-content>
        {children}
      </main>
      <FloatingSocialButtons />
      <div data-cinematic-page-footer>
        <SiteFooterMain />
      </div>
    </>
  )

  if (cinematicPage) {
    return (
      <CinematicPage
        config={cinematicPageConfig[cinematicPage]}
        className={cn('relative min-h-screen', className)}
      >
        {shellContent}
      </CinematicPage>
    )
  }

  return (
    <div
      className={cn(
        'relative min-h-screen bg-[linear-gradient(180deg,oklch(0.13_0.02_240)_0%,oklch(0.16_0.03_222)_38%,oklch(0.185_0.028_232)_68%,oklch(0.14_0.02_240)_100%)]',
        className,
      )}
    >
      {shellContent}
    </div>
  )
}
