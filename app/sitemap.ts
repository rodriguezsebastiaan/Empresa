import type { MetadataRoute } from 'next'
import { publishedPortfolioProjects } from '@/config/portfolio'
import { siteConfig } from '@/config/site'
import { isPageIndexable, seoIndexingEnabled, seoUrl } from '@/config/seo'
import type { SitePageKey } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!seoIndexingEnabled) {
    return []
  }

  const publicPages = (Object.keys(siteConfig.pages) as SitePageKey[])
    .filter(isPageIndexable)
    .map((key) => ({ url: seoUrl(siteConfig.pages[key].path) }))

  const projectPages = publishedPortfolioProjects
    .filter((project) => project.detailPageEnabled)
    .map((project) => ({
      url: seoUrl(`/proyectos/${project.slug}`),
    }))

  return [...publicPages, ...projectPages]
}
