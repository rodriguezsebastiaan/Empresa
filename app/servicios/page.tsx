import { MessageCircle } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { serviceGroups } from '@/config/services'
import { publishedPortfolioProjects } from '@/config/portfolio'
import { buildPageMetadata } from '@/lib/metadata'
import { buildWhatsAppUrl } from '@/lib/site'



export const metadata = buildPageMetadata('services')

export default function ServicesPage() {
  const whatsappHref = buildWhatsAppUrl()

  return (
    <SiteShell seoPage="services" cinematicPage="services">
      <PageHero
        title="Convertimos una necesidad en algo que puedes ver, usar y poner a trabajar."
        description="Desarrollo web, plataformas, automatizaciones e integraciones diseñadas para convertirse en herramientas reales para tu operación."
        aside={
          <p className="ks-type-statement font-medium">
            La tecnología importa cuando se convierte en una herramienta útil.
          </p>
        }
        actions={
          <>
            <SiteAction href={siteConfig.routes.diagnostics}>SOLICITAR DIAGNÓSTICO</SiteAction>
            <SiteAction href={siteConfig.routes.advisory} variant="secondary">
              AGENDAR ASESORÍA
            </SiteAction>
            {whatsappHref ? (
              <SiteAction
                href={whatsappHref}
                external
                variant="secondary"
                icon={MessageCircle}
              >
                HABLAR POR WHATSAPP
              </SiteAction>
            ) : null}
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="MAPA DE SERVICIOS"
          title="Una oferta completa, sin fragmentar automatizaciones fuera del resto del sistema."
          description="La automatización hace parte natural de los servicios de ConexaCod. No funciona aislada: se conecta con plataformas, procesos, datos y seguimiento."
        />

        <div className="mt-12 space-y-10">
          {serviceGroups.map((group, groupIndex) => (
            <section key={group.title} className="space-y-5">
              <Reveal variant="fade" delay={groupIndex * 90} className="max-w-2xl">
                <h2 className="ks-type-card-title font-semibold">
                  {group.title}
                </h2>
              </Reveal>

              <div className="space-y-5">
                {group.services.map((service, serviceIndex) => (
                  <Reveal
                    as="article"
                    key={service.title}
                    delay={groupIndex * 90 + serviceIndex * 70}
                    id={service.id}
                    className="scroll-mt-28 rounded-3xl border border-border/70 bg-background/50 px-6 py-7 backdrop-blur-sm"
                  >
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                      <div>
                        <h3 className="ks-type-card-title font-semibold">
                          {service.title}
                        </h3>
                        <p className="ks-card-copy mt-3">
                          {service.problem}
                        </p>
                        {publishedPortfolioProjects
                          .filter((project) => project.detailPageEnabled && project.seo.relatedServiceIds.some((id) => id === service.id))
                          .map((project) => (
                            <SiteAction key={project.slug} href={`/proyectos/${project.slug}`} variant="text" className="mt-4">
                              Caso {project.name}
                            </SiteAction>
                          ))}
                      </div>

                      <dl className="grid gap-4">
                        <div>
                          <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                            QUÉ PUEDE INCLUIR
                          </dt>
                          <dd className="ks-card-copy mt-2">
                            {service.includes}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                            BENEFICIO
                          </dt>
                          <dd className="ks-card-copy mt-2">
                            {service.benefit}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                            CUÁNDO APLICA
                          </dt>
                          <dd className="ks-card-copy mt-2">
                            {service.useCases}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <Reveal
            variant="fade"
            className="rounded-[2rem] border border-border/70 bg-background/40 px-6 py-10 lg:px-10"
          >
            <SectionHeading
              eyebrow="SIGUIENTE PASO"
              title="Podemos aterrizar qué servicio conviene según el momento de su empresa."
              description="Si todavía no tiene claro por dónde empezar, el diagnóstico ayuda a priorizar. Si ya desea avanzar, podemos agendar una asesoría inicial."
              actions={
                <>
                  <SiteAction href={siteConfig.routes.diagnostics}>
                    SOLICITAR DIAGNÓSTICO
                  </SiteAction>
                  <SiteAction href={siteConfig.routes.advisory} variant="secondary">
                    AGENDAR ASESORÍA
                  </SiteAction>
                  <SiteAction href={siteConfig.routes.solutions} variant="text">
                    EXPLORAR PROBLEMAS QUE RESOLVEMOS
                  </SiteAction>
                  {whatsappHref ? (
                    <SiteAction
                      href={whatsappHref}
                      external
                      variant="secondary"
                      icon={MessageCircle}
                    >
                      HABLAR POR WHATSAPP
                    </SiteAction>
                  ) : null}
                </>
              }
            />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
