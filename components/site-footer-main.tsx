import { ArrowRight, Clock3, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { mainNav, siteConfig } from '@/config/site'
import { Logo } from '@/components/logo'
import {
  buildMailtoUrl,
  buildPhoneUrl,
  buildWhatsAppUrl,
  hasConfiguredEmail,
  hasConfiguredPhone,
  hasConfiguredWhatsApp,
} from '@/lib/site'

type QuickLink = {
  href: string
  label: string
  icon: LucideIcon
}

export function SiteFooterMain() {
  const quickLinks: QuickLink[] = []

  if (hasConfiguredWhatsApp()) {
    const href = buildWhatsAppUrl()

    if (href) {
      quickLinks.push({
        href,
        label: siteConfig.social.whatsappLabel,
        icon: MessageCircle,
      })
    }
  }

  if (hasConfiguredEmail()) {
    const href = buildMailtoUrl('Consulta desde ConexaCod')

    if (href) {
      quickLinks.push({
        href,
        label: siteConfig.social.emailLabel,
        icon: Mail,
      })
    }
  }

  if (hasConfiguredPhone()) {
    const href = buildPhoneUrl()

    if (href) {
      quickLinks.push({
        href,
        label: siteConfig.social.phoneLabel,
        icon: Phone,
      })
    }
  }

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background/65">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 size-80 rounded-full bg-primary/[0.045] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <div className="grid gap-14 border-b border-border/60 pb-14 lg:grid-cols-[1.4fr_0.8fr_0.85fr] lg:gap-18">
          <div className="max-w-xl">
            <Logo />
            <p className="mt-8 text-[clamp(1.25rem,1.45vw,1.55rem)] font-medium leading-snug text-foreground">
              Sistemas digitales para empresas que quieren avanzar.
            </p>
            <p className="ks-footer-copy mt-5 max-w-lg">
              {siteConfig.contact.coverage}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={siteConfig.routes.advisory}
                className="group inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[0.95rem] font-semibold tracking-[0.08em] text-primary-foreground transition-[filter,transform] duration-200 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                AGENDAR ASESORÍA
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                href={siteConfig.routes.contact}
                className="inline-flex min-h-11 items-center rounded-md border border-border bg-secondary/30 px-4 py-2.5 text-[0.95rem] font-semibold tracking-[0.08em] text-foreground transition-colors duration-200 hover:border-primary/55 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                CONTACTO
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">Explorar</h2>
            <nav className="mt-6 grid gap-4" aria-label="Navegación de pie de página">
              {mainNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="w-fit text-[1rem] text-foreground/85 transition-colors duration-200 hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={siteConfig.routes.services}
                className="w-fit text-[1rem] text-foreground/85 transition-colors duration-200 hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                Todos los servicios
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground">Desde Manizales</h2>
            <div className="ks-footer-copy mt-6 space-y-6">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p>{siteConfig.contact.city}, {siteConfig.contact.country}</p>
              </div>
              <div className="flex gap-3">
                <Clock3 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <p>{siteConfig.contact.schedule}</p>
              </div>
              {quickLinks.length > 0 ? (
                <div className="flex items-center gap-3 pt-1">
                  {quickLinks.map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      {...(href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      aria-label={label}
                      className="flex size-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:border-primary/60 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="ks-footer-copy flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.legal.copyrightNotice}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href={siteConfig.routes.privacy}
              className="transition-colors duration-200 hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              {siteConfig.legal.privacyPolicyLabel}
            </Link>
            <span>{siteConfig.legal.privacyPolicyVersionLabel}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
