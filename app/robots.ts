import type { MetadataRoute } from 'next'
import { seoIndexingEnabled, seoOrigin, seoUrl } from '@/config/seo'

export default function robots(): MetadataRoute.Robots {
  if (!seoIndexingEnabled) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin$', '/admin/', '/api$', '/api/'],
      },
    ],
    sitemap: seoUrl('/sitemap.xml'),
    host: seoOrigin,
  }
}
