import { Mail, MessageCircle, Phone, type LucideIcon } from 'lucide-react'
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
    const href = buildMailtoUrl('Consulta desde Konamy Systems')

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
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Logo />
            <div className="max-w-[24rem] space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>Sistemas digitales para empresas que quieren avanzar.</p>
              <p>{siteConfig.contact.coverage}</p>
            </div>
          </div>

          <nav
            className="flex flex-wrap gap-x-6 gap-y-3"
            aria-label="Navegación de pie de página"
          >
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {quickLinks.length > 0 ? (
            <div className="flex items-center gap-3">
              {quickLinks.map(({ href, label, icon: Icon }) => (
                href.startsWith('http') ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                ) : (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                )
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{siteConfig.legal.copyrightNotice}</p>
          <div className="flex flex-wrap gap-6">
            <Link
              href={siteConfig.routes.privacy}
              className="transition-colors hover:text-primary"
            >
              {siteConfig.legal.privacyPolicyLabel}
            </Link>
            <span>{siteConfig.contact.city}</span>
            <span>{siteConfig.contact.schedule}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
