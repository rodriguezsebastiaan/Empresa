import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  if (siteConfig.domainIsPlaceholder) {
    return []
  }

  const lastModified = new Date()

  return Object.values(siteConfig.pages).map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
