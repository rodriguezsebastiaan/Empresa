import { siteConfig, type SitePageKey } from '@/config/site'

// Canonical identity must not inherit a localhost, preview or legacy URL override.
export const seoOrigin = 'https://conexacod.com'
export const seoIndexingEnabled =
  !siteConfig.domainIsPlaceholder &&
  process.env.VERCEL_ENV !== 'preview' &&
  process.env.VERCEL_ENV !== 'development'

export function seoUrl(path = '/') {
  return new URL(path, `${seoOrigin}/`).href
}

export function isPageIndexable(pageKey: SitePageKey) {
  const page = siteConfig.pages[pageKey]
  return seoIndexingEnabled && !('indexable' in page && page.indexable === false)
}
