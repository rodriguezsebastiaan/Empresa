import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'

const solutionGroups = [
  {
    title: 'Organizar la operación',
    summary:
      'Convertimos procesos dispersos en un flujo claro, trazable y administrable.',
    items: [
      'Organización de procesos.',
      'Pedidos, citas y reservas.',
      'Control administrativo.',
      'Gestión documental.',
    ],
  },
  {
    title: 'Centralizar y conectar información',
    summary:
      'Reunimos datos, clientes, reportes y herramientas para que la empresa deje de trabajar por fragmentos.',
    items: [
      'Centralización de información.',
      'Gestión de clientes.',
      'Bases de datos y reportes.',
      'Integraciones.',
    ],
  },
  {
    title: 'Automatizar lo repetitivo',
    summary:
      'Reducimos tareas manuales y activamos flujos más precisos, lentos donde deben serlo y rápidos donde generan valor.',
    items: [
      'Automatización de tareas.',
      'Activación de procesos entre áreas.',
      'Seguimiento administrativo.',
      'Mejora de sistemas existentes.',
    ],
  },
  {
    title: 'Preparar el crecimiento',
    summary:
      'Diseñamos soluciones que puedan crecer con la empresa, adaptarse y sostener nuevas necesidades sin rehacer todo desde cero.',
    items: [
      'Escalabilidad.',
      'Modernización gradual.',
      'Capas y módulos administrables.',
      'Evolución continua del sistema.',
    ],
  },
] as const

const adaptationSteps = [
  {
    title: 'Entendemos el problema real',
    description:
      'Primero ubicamos dónde se pierde tiempo, dónde se duplica información y dónde la operación depende demasiado de pasos manuales.',
  },
  {
    title: 'Definimos la arquitectura adecuada',
    description:
      'No empujamos una herramienta genérica. Diseñamos la estructura digital que mejor se ajusta al tamaño, ritmo y complejidad de la empresa.',
  },
  {
    title: 'Construimos por capas útiles',
    description:
      'Cada solución puede incluir procesos, usuarios, permisos, automatizaciones, reportes, integraciones y mejoras progresivas sin romper lo que ya funciona.',
  },
] as const

export const metadata = buildPageMetadata('solutions')

export default function SolutionsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="SOLUCIONES"
        title="Soluciones digitales diseñadas alrededor de la operación real de su empresa."
        description="Konamy Systems interviene donde la operación se desordena, la información se dispersa o el crecimiento empieza a depender de demasiadas tareas manuales. Cada solución se construye según el problema, no según una plantilla rígida."
        actions={
          <>
            <SiteAction href={siteConfig.routes.services}>CONOCER SERVICIOS</SiteAction>
            <SiteAction href={siteConfig.routes.diagnostics} variant="secondary">
              SOLICITAR DIAGNÓSTICO
            </SiteAction>
            <SiteAction href={siteConfig.routes.advisory} variant="secondary">
              AGENDAR ASESORÍA
            </SiteAction>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="DÓNDE INTERVENIMOS"
          title="Problemas empresariales que podemos convertir en una estructura digital clara."
          description="No se trata de sumar herramientas. Se trata de ordenar el trabajo, conectar la información y darle continuidad a la operación."
        />

        <div className="mt-12 space-y-8">
          {solutionGroups.map((group, index) => (
            <Reveal
              as="article"
              key={group.title}
              delay={index * 100}
              className="grid gap-6 rounded-3xl border border-border/70 bg-background/45 px-6 py-8 backdrop-blur-sm lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]"
            >
              <div>
                <h2 className="text-2xl font-medium text-foreground">
                  {group.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {group.summary}
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item, itemIndex) => (
                  <Reveal
                    as="li"
                    key={item}
                    delay={index * 100 + itemIndex * 70}
                    className="rounded-2xl border border-border/70 bg-background/55 px-4 py-4 text-sm text-foreground/90"
                  >
                    {item}
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="CÓMO SE ADAPTA"
            title="Cada solución se construye de forma progresiva y útil."
            description="El objetivo no es impresionar con complejidad técnica, sino organizar la operación con la precisión necesaria para que la empresa funcione mejor."
          />

          <ol className="mt-12 grid gap-6 lg:grid-cols-3">
            {adaptationSteps.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 110}
                className="rounded-3xl border border-border/70 bg-background/50 p-6 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold tracking-[0.3em] text-primary">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-xl font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <Reveal
          variant="fade"
          className="rounded-[2rem] border border-border/70 bg-secondary/20 px-6 py-10 lg:px-10"
        >
          <SectionHeading
            eyebrow="SIGUIENTE PASO"
            title="Si ya identifica el problema, pasamos a definir la solución."
            description="Podemos profundizar en los servicios, revisar su operación mediante un diagnóstico o programar una asesoría inicial."
            actions={
              <>
                <SiteAction href={siteConfig.routes.services}>VER SERVICIOS</SiteAction>
                <SiteAction href={siteConfig.routes.diagnostics} variant="secondary">
                  SOLICITAR DIAGNÓSTICO
                </SiteAction>
                <SiteAction href={siteConfig.routes.advisory} variant="secondary">
                  AGENDAR ASESORÍA
                </SiteAction>
              </>
            }
          />
        </Reveal>
      </section>
    </SiteShell>
  )
}
