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
        src: siteConfig.seo.faviconIcoPath,
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: siteConfig.seo.faviconSvgPath,
        type: 'image/svg+xml',
      },
      {
        src: siteConfig.seo.appleTouchIconPath,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
