import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { SiteAction } from '@/components/site-action'
import { buildWhatsAppUrl } from '@/lib/site'

export function HomeCallToAction() {
  const whatsappHref = buildWhatsAppUrl()

  return (
    <section className="relative border-t border-border/60 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-lg">
            <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-primary">
              HABLEMOS SOBRE SU EMPRESA
            </p>
            <h2 className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
              Conversemos sobre el proceso que quiere mejorar.
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
              No necesita saber qué tecnología requiere. Empezamos entendiendo su
              necesidad y diseñamos el siguiente paso.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 lg:justify-end">
            <SiteAction href={siteConfig.routes.advisory}>
              AGENDAR ASESORÍA
            </SiteAction>
            <SiteAction href={siteConfig.routes.diagnostics} variant="secondary">
              SOLICITAR DIAGNÓSTICO
            </SiteAction>
            {whatsappHref ? (
              <SiteAction
                href={whatsappHref}
                external
                icon={MessageCircle}
                variant="secondary"
              >
                HABLAR POR WHATSAPP
              </SiteAction>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
