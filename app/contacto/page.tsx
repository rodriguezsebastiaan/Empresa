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
      value: 'Programar asesoría inicial de 30 minutos',
      note: 'Ideal para comprender la necesidad y definir el mejor siguiente paso.',
      href: siteConfig.routes.advisory,
      icon: CalendarDays,
      external: false,
      provisional: false,
    },
    {
      title: 'Solicitar diagnóstico empresarial',
      value: 'Formulario guiado por pasos',
      note: 'Permite explicar el problema con más detalle antes de una asesoría.',
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
      value: siteConfig.contact.emailIsProvisional
        ? 'PENDIENTE · correo de contacto'
        : siteConfig.contact.email,
      note: siteConfig.contact.emailIsProvisional
        ? 'El correo directo se publicará cuando exista una dirección oficial configurada.'
        : 'Puede compartir contexto, dudas o necesidades con más detalle.',
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
    <SiteShell seoPage="contact" cinematicPage="contact">
      <PageHero
        title="Veamos el panorama completo y construyamos lo que sigue."
        description="Cuéntanos qué necesitas resolver. Empecemos por entender el problema y diseñar juntos una solución preparada para crecer."
        aside={
          <p className="ks-type-statement font-medium">
            Una buena solución empieza por una conversación clara.
          </p>
        }
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
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="CANALES DISPONIBLES"
          title="Una ruta distinta según la forma en que prefiera avanzar."
          description="Puede agendar una conversación inicial, solicitar diagnóstico o escribir por los canales directos de ConexaCod."
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
                    className="ks-type-card-title mt-3 block font-semibold transition-colors hover:text-primary"
                  >
                    {channel.value}
                  </a>
                ) : channel.href && isProtocolLink ? (
                  <a
                    href={channel.href}
                    className="ks-type-card-title mt-3 block font-semibold transition-colors hover:text-primary"
                  >
                    {channel.value}
                  </a>
                ) : channel.href ? (
                  <Link
                    href={channel.href}
                    className="ks-type-card-title mt-3 block font-semibold transition-colors hover:text-primary"
                  >
                    {channel.value}
                  </Link>
                ) : (
                  <p className="ks-type-card-title mt-3 font-semibold">{channel.value}</p>
                )}

                <p className="ks-card-copy mt-3">
                  {channel.note}
                </p>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-18 lg:grid-cols-[minmax(0,0.8fr)_minmax(22rem,1.2fr)] lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="CUÉNTANOS QUÉ QUIERES RESOLVER"
            title="Convirtamos el contexto de tu empresa en un siguiente paso concreto."
            description="Comparte la necesidad, el proceso que quieres mejorar o la idea que necesitas aterrizar. Revisaremos el contexto antes de responder."
          />

          <Reveal delay={100}>
            <ContactForm className="bg-background/78 shadow-[0_24px_90px_-54px_rgba(0,0,0,0.95)] backdrop-blur-md" />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,1.05fr)]">
            <Reveal
              as="aside"
              className="rounded-[2rem] border border-primary/20 bg-primary/[0.06] px-6 py-8 backdrop-blur-sm"
            >
              <SectionHeading
                eyebrow="SIGUIENTE PASO"
                title="Elija el flujo que mejor encaje con su necesidad."
                description="Para mantener la atención ordenada, ConexaCod prioriza dos caminos: diagnóstico empresarial cuando necesita explicar el contexto y asesoría cuando desea coordinar una conversación."
              />

              <div className="mt-8 grid gap-3">
                <SiteAction href={siteConfig.routes.diagnostics}>
                  SOLICITAR DIAGNÓSTICO
                </SiteAction>
                <SiteAction href={siteConfig.routes.advisory} variant="secondary">
                  AGENDAR ASESORÍA
                </SiteAction>
                {whatsappHref ? (
                  <SiteAction href={whatsappHref} external variant="secondary">
                    HABLAR POR WHATSAPP
                  </SiteAction>
                ) : null}
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
              <div className="ks-copy-secondary mt-6 space-y-4">
                <p>
                  Si ya sabe que necesita una conversación inicial, el camino más directo es
                  agendar una asesoría.
                </p>
                <p>
                  Si todavía necesita explicar mejor el contexto, el diagnóstico le
                  ayuda a organizar la información antes del contacto.
                </p>
                <p>
                  {hasWhatsApp
                    ? 'WhatsApp queda disponible como acceso rápido solo cuando el número oficial ya está configurado.'
                    : 'Mientras no exista un número oficial configurado, el acceso directo de WhatsApp permanece oculto para evitar enlaces falsos.'}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
