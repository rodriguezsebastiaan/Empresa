import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { siteConfig } from '@/config/site'
import { absoluteUrl } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  applicationName: siteConfig.name,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  robots: siteConfig.domainIsPlaceholder
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
    icon: [
      { url: siteConfig.seo.faviconIcoPath },
      { url: siteConfig.seo.faviconSvgPath, type: 'image/svg+xml' },
      { url: siteConfig.seo.faviconPngPath, sizes: '32x32', type: 'image/png' },
    ],
    shortcut: [siteConfig.seo.faviconIcoPath],
    apple: [
      {
        url: siteConfig.seo.appleTouchIconPath,
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: siteConfig.seo.manifestPath,
  openGraph: {
    type: 'website',
    locale: siteConfig.seo.locale,
    url: siteConfig.url,
    siteName: siteConfig.seo.siteName,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl(siteConfig.seo.openGraphImagePath),
        alt: siteConfig.seo.openGraphImageAlt,
      },
    ],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [absoluteUrl(siteConfig.seo.openGraphImagePath)],
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
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
