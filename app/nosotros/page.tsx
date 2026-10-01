import { PageHero } from '@/components/page-hero'
import { PortfolioSection } from '@/components/portfolio/portfolio-section'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'

const workingPrinciples = [
  {
    title: 'Digitalizar',
    description: 'Procesos claros que no dependan de la improvisación.',
  },
  {
    title: 'Simplificar',
    description: 'Menos fricción para trabajar sin perder control administrativo.',
  },
  {
    title: 'Automatizar',
    description: 'Menos tareas repetitivas, errores y tiempo sin valor.',
  },
  {
    title: 'Crecer',
    description: 'Tecnología capaz de evolucionar junto con la empresa.',
  },
] as const

const values = [
  'Confianza',
  'Organización',
  'Innovación',
  'Crecimiento',
  'Compromiso',
  'Claridad',
  'Calidad',
] as const

export const metadata = buildPageMetadata('about')

export default function AboutPage() {
  return (
    <SiteShell seoPage="about" cinematicPage="about">
      <PageHero
        title="Pensamos en grande. Construimos desde lo cercano."
        description="Con base en Manizales, creamos soluciones digitales para empresas que quieren transformar su operación y crecer dentro y fuera de Colombia."
        actions={
          <>
            <SiteAction href="#proyectos">VER PROYECTOS</SiteAction>
            <SiteAction href={siteConfig.routes.advisory} variant="secondary">
              AGENDAR ASESORÍA
            </SiteAction>
          </>
        }
      />

      <PortfolioSection />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
          <SectionHeading title="Una propuesta enfocada en resolver problemas empresariales reales." />
          <Reveal delay={100} className="ks-copy-secondary space-y-5 lg:pt-2">
            <p>
              Diseñamos soluciones digitales conectadas con la operación real de
              cada empresa. No partimos de paquetes rígidos, sino del problema que
              necesita resolverse.
            </p>
            <p>
              Trabajamos cuando la información se duplica, los pasos manuales frenan
              al equipo o un proceso importante ya no cabe en hojas de cálculo y
              tareas improvisadas. Unimos sistemas, automatización e integraciones
              en una estructura administrable que puede evolucionar sin rehacerlo todo.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border/60 bg-background/35">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionHeading
            title="Digitalizar, simplificar, automatizar y crecer."
            description="Trabajamos con claridad, validación y evolución continua para que cada solución pueda crecer junto con el negocio."
          />

          <ol className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {workingPrinciples.map((principle, index) => (
              <Reveal
                as="li"
                key={principle.title}
                delay={index * 80}
                className="border-t border-primary/35 pt-5"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  {principle.title}
                </h3>
                <p className="ks-card-copy mt-3">{principle.description}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={180} variant="fade" className="mt-14 border-t border-border/60 pt-8">
            <p className="sr-only">Valores de ConexaCod</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Valores de ConexaCod">
              {values.map((value) => (
                <li key={value} className="text-sm font-medium tracking-[0.08em] text-foreground/82">
                  {value}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 border-y border-primary/25 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] lg:items-end lg:py-16">
          <SectionHeading title="Desde Manizales, construyendo para cualquier lugar." />
          <Reveal delay={100} as="p" className="ks-copy-primary">
            Una base local, una forma cercana de trabajar y soluciones digitales
            preparadas para operar en Colombia y el mundo.
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60 bg-background/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <Reveal>
            <SectionHeading
              title="Tu proyecto podría ser el siguiente."
              description="Cuéntanos qué necesitas resolver y veamos cómo convertirlo en una solución digital."
              actions={
                <>
                  <SiteAction href={siteConfig.routes.advisory}>
                    AGENDAR ASESORÍA
                  </SiteAction>
                  <SiteAction href={siteConfig.routes.diagnostics} variant="secondary">
                    SOLICITAR DIAGNÓSTICO
                  </SiteAction>
                </>
              }
            />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
