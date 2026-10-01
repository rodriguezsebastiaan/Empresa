import type { Metadata } from 'next'
import { Reveal } from '@/components/reveal'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { seoUrl } from '@/config/seo'

export const metadata: Metadata = {
  title: 'Ruta no disponible | ConexaCod',
  description:
    'La ruta solicitada no forma parte de la versión 1.0 publicada de ConexaCod.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.seo.locale,
    url: seoUrl(),
    siteName: siteConfig.seo.siteName,
    title: 'Ruta no disponible | ConexaCod',
    description:
      'La ruta solicitada no forma parte de la versión 1.0 publicada de ConexaCod.',
    images: [
      {
        url: seoUrl(siteConfig.seo.openGraphImagePath),
        alt: siteConfig.seo.openGraphImageAlt,
      },
    ],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: 'Ruta no disponible | ConexaCod',
    description:
      'La ruta solicitada no forma parte de la versión 1.0 publicada de ConexaCod.',
    images: [seoUrl(siteConfig.seo.openGraphImagePath)],
  },
}

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-6 py-24 lg:px-10 lg:py-32">
        <Reveal className="rounded-[2rem] border border-border/70 bg-background/45 px-6 py-10 text-center backdrop-blur-sm lg:px-10">
          <p className="text-xs font-semibold tracking-[0.32em] text-primary">404</p>
          <h1 className="mt-6 text-4xl font-semibold text-foreground sm:text-5xl">
            Esta ruta no está disponible.
          </h1>
          <p className="ks-copy-secondary mx-auto mt-5 max-w-2xl">
            La página que intenta abrir no existe, cambió de ubicación o todavía no forma
            parte de la versión 1.0 publicada de ConexaCod.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <SiteAction href={siteConfig.routes.home}>VOLVER AL INICIO</SiteAction>
            <SiteAction href={siteConfig.routes.contact} variant="secondary">
              IR A CONTACTO
            </SiteAction>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  )
}
