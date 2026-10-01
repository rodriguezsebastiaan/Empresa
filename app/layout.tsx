import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import { seoIndexingEnabled, seoOrigin, seoUrl } from '@/config/seo'
import { JsonLd } from '@/components/seo/json-ld'
import { buildSiteStructuredData } from '@/lib/structured-data'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(seoOrigin),
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  applicationName: siteConfig.name,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  robots: !seoIndexingEnabled
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      }
    : {
        index: true,
        follow: true,
      },
  icons: {
    icon: [{ url: siteConfig.seo.faviconSvgPath, type: 'image/svg+xml' }],
  },
  manifest: siteConfig.seo.manifestPath,
  openGraph: {
    type: 'website',
    locale: siteConfig.seo.locale,
    url: seoUrl(),
    siteName: siteConfig.seo.siteName,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: seoUrl(siteConfig.seo.openGraphImagePath),
        alt: siteConfig.seo.openGraphImageAlt,
      },
    ],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [seoUrl(siteConfig.seo.openGraphImagePath)],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0f1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className="bg-background"
      style={
        {
          ['--font-sans' as string]:
            '"Segoe UI Variable Display", "Segoe UI", "Trebuchet MS", sans-serif',
          ['--font-mono' as string]:
            '"Consolas", "JetBrains Mono", "Courier New", monospace',
        } as React.CSSProperties
      }
    >
      <body className="font-sans antialiased">
        <JsonLd data={buildSiteStructuredData()} />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
