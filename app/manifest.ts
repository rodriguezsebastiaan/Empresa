import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: siteConfig.routes.home,
    display: 'standalone',
    background_color: '#050b12',
    theme_color: '#0a0f1a',
    lang: 'es-CO',
    icons: [
      {
        src: siteConfig.seo.faviconSvgPath,
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
