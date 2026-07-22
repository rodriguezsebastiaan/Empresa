import {
  CalendarDays,
  Clock3,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { ContactForm } from '@/components/contact-form'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'
import {
  buildMailtoUrl,
  buildPhoneUrl,
  buildWhatsAppUrl,
  hasConfiguredWhatsApp,
} from '@/lib/site'

type ContactChannel = {
  title: string
  value: string
  note: string
  href?: string | null
  icon: LucideIcon
  external: boolean
  provisional: boolean
}

export const metadata = buildPageMetadata('contact')

export default function ContactPage() {
  const whatsappHref = buildWhatsAppUrl()
  const emailHref = buildMailtoUrl('Consulta desde contacto web')
  const phoneHref = buildPhoneUrl()
  const hasWhatsApp = hasConfiguredWhatsApp()

  const contactChannels: ContactChannel[] = [
    {
      title: 'Agendar una asesoría',
      value: 'Programar reunión inicial de 30 minutos',
      note: 'Ideal para comprender la necesidad y definir el mejor siguiente paso.',
      href: siteConfig.routes.advisory,
      icon: CalendarDays,
      external: false,
      provisional: false,
    },
    {
      title: 'Solicitar diagnóstico',
      value: 'Formulario guiado por pasos',
      note: 'Permite explicar el problema con más detalle antes de una reunión.',
      href: siteConfig.routes.diagnostics,
      icon: CalendarDays,
      external: false,
      provisional: false,
    },
    {
      title: 'WhatsApp',
      value: siteConfig.contact.whatsappDisplay,
      note: hasWhatsApp
        ? 'Canal útil para una conversación inicial o seguimiento rápido.'
        : 'El acceso directo se publicará cuando exista un número oficial configurado.',
      href: whatsappHref,
      icon: MessageCircle,
      external: Boolean(whatsappHref),
      provisional: siteConfig.contact.whatsappIsProvisional,
    },
    {
      title: 'Correo',
      value: siteConfig.contact.email,
      note: 'Puede compartir contexto, dudas o necesidades con más detalle.',
      href: emailHref,
      icon: Mail,
      external: false,
      provisional: siteConfig.contact.emailIsProvisional,
    },
    {
      title: 'Teléfono',
      value: siteConfig.contact.phoneDisplay,
      note: 'Disponible como canal complementario de contacto.',
      href: phoneHref,
      icon: Phone,
      external: false,
      provisional: siteConfig.contact.phoneIsProvisional,
    },
    {
      title: 'Base operativa',
      value: siteConfig.contact.city,
      note: 'Coordinación inicial y seguimiento desde Manizales, Caldas.',
      icon: MapPin,
      external: false,
      provisional: false,
    },
    {
      title: 'Horario',
      value: siteConfig.contact.schedule,
      note: 'Horario base para atención y coordinación inicial.',
      icon: Clock3,
      external: false,
      provisional: false,
    },
    {
      title: 'Cobertura',
      value: siteConfig.contact.country,
      note: siteConfig.contact.coverage,
      icon: Globe,
      external: false,
      provisional: false,
    },
  ]

  return (
    <SiteShell>
      <PageHero
        eyebrow="CONTACTO"
        title="Canales claros para iniciar la conversación con Konamy Systems."
        description="Esta página reúne asesoría, diagnóstico, WhatsApp, correo, teléfono y formulario breve de contacto, todo conectado a una configuración central para evitar datos duplicados."
        actions={
          <>
            <SiteAction href={siteConfig.routes.advisory}>AGENDAR ASESORÍA</SiteAction>
            <SiteAction href={siteConfig.routes.diagnostics} variant="secondary">
              SOLICITAR DIAGNÓSTICO
            </SiteAction>
            {whatsappHref ? (
              <SiteAction href={whatsappHref} external variant="secondary">
                HABLAR POR WHATSAPP
              </SiteAction>
            ) : null}
          </>
        }
        aside={
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Los canales de contacto se administran desde una configuración central
              para mantener consistencia entre header, footer, formularios y CTAs.
            </p>
            <p>{siteConfig.contact.coverage}</p>
            <p>
              Mientras algunos datos sigan provisionales, esta interfaz los deja
              claramente identificados.
            </p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="CANALES DISPONIBLES"
          title="Una ruta distinta según la forma en que prefiera avanzar."
          description="Puede agendar una conversación inicial, solicitar diagnóstico o escribir por los canales directos de Konamy Systems."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {contactChannels.map((channel, index) => {
            const Icon = channel.icon
            const isHttpLink = channel.href?.startsWith('http')
            const isProtocolLink =
              channel.href?.startsWith('mailto:') || channel.href?.startsWith('tel:')

            return (
              <Reveal
                as="article"
                key={channel.title}
                delay={index * 70}
                className="rounded-3xl border border-border/70 bg-background/50 px-5 py-6 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  {channel.provisional ? (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] text-primary">
                      PROVISIONAL
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 text-xs font-semibold tracking-[0.24em] text-primary">
                  {channel.title}
                </p>

                {channel.href && isHttpLink ? (
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-base font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {channel.value}
                  </a>
                ) : channel.href && isProtocolLink ? (
                  <a
                    href={channel.href}
                    className="mt-3 block text-base font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {channel.value}
                  </a>
                ) : channel.href ? (
                  <Link
                    href={channel.href}
                    className="mt-3 block text-base font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {channel.value}
                  </Link>
                ) : (
                  <p className="mt-3 text-base font-medium text-foreground">{channel.value}</p>
                )}

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {channel.note}
                </p>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
            <Reveal>
              <SectionHeading
                eyebrow="FORMULARIO BREVE"
                title="Comparta su necesidad y organizamos el siguiente paso."
                description="El formulario ya valida en cliente y servidor. Si el destino final todavía no está activado, la plataforma lo informa con claridad en vez de fingir un envío."
              />

              <div className="mt-8">
                <ContactForm />
              </div>
            </Reveal>

            <Reveal
              as="aside"
              delay={120}
              className="rounded-[2rem] border border-border/70 bg-background/50 px-6 py-8 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold tracking-[0.3em] text-primary">
                ANTES DE ESCRIBIR
              </p>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Si ya sabe que necesita una reunión, el camino más directo es
                  agendar una asesoría.
                </p>
                <p>
                  Si todavía necesita explicar mejor el contexto, el diagnóstico le
                  ayuda a ordenar la información antes del contacto.
                </p>
                <p>
                  {hasWhatsApp
                    ? 'WhatsApp queda disponible como acceso rápido solo cuando el número oficial ya está configurado.'
                    : 'Mientras no exista un número oficial configurado, el acceso directo de WhatsApp permanece oculto para evitar enlaces falsos.'}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <SiteAction href={siteConfig.routes.advisory}>AGENDAR ASESORÍA</SiteAction>
                <SiteAction href={siteConfig.routes.diagnostics} variant="secondary">
                  SOLICITAR DIAGNÓSTICO
                </SiteAction>
                {whatsappHref ? (
                  <SiteAction href={whatsappHref} external variant="secondary">
                    HABLAR POR WHATSAPP
                  </SiteAction>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
