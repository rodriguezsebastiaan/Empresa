import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { SiteAction } from '@/components/site-action'
import { buildWhatsAppUrl } from '@/lib/site'

export function HomeCallToAction() {
  const whatsappHref = buildWhatsAppUrl()

  return (
    <section id="contact" data-scene="contact" className="ks-scene ks-scene--tall border-t border-border/60 bg-secondary/20">
      <div className="ks-scene-content mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-xl">
            <h2 className="ks-type-section font-semibold">
              Ahora construyamos lo que sigue.
            </h2>
            <p className="ks-copy-primary mt-7">
              Cuéntanos qué quieres resolver. Te ayudamos a convertirlo en una
              solución digital clara, funcional y preparada para crecer.
            </p>
            <p className="ks-type-statement mt-10 max-w-md font-medium">
              Una buena solución empieza por entender el problema correcto.
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
