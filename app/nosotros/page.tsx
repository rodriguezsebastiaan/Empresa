import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'

const philosophy = [
  'Digitalizar procesos para que la operación no dependa de improvisación.',
  'Simplificar la forma de trabajar sin perder control administrativo.',
  'Automatizar tareas repetitivas para liberar tiempo y reducir errores.',
  'Crecer con una estructura tecnológica que pueda evolucionar junto con la empresa.',
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

const differentiators = [
  'No partimos de paquetes rígidos, sino del problema operativo que la empresa necesita resolver.',
  'Unimos procesos, sistemas, automatización e integraciones dentro de una misma lógica de trabajo.',
  'Diseñamos soluciones administrables que puedan mejorar progresivamente sin rehacerlo todo.',
] as const

export const metadata = buildPageMetadata('about')

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="NOSOTROS"
        title="Konamy Systems existe para convertir desorden operativo en claridad digital."
        description="Diseñamos plataformas, sistemas y automatizaciones para empresas que necesitan organizar procesos, centralizar información y crecer con una estructura tecnológica más clara."
        actions={
          <>
            <SiteAction href={siteConfig.routes.process}>CONOCER PROCESO</SiteAction>
            <SiteAction href={siteConfig.routes.advisory} variant="secondary">
              AGENDAR ASESORÍA
            </SiteAction>
            <SiteAction href={siteConfig.routes.diagnostics} variant="secondary">
              SOLICITAR DIAGNÓSTICO
            </SiteAction>
          </>
        }
        aside={
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Konamy Systems no se presenta como una vitrina de promesas vacías.
              Se presenta como una forma ordenada de trabajar con empresas que
              necesitan soluciones digitales útiles.
            </p>
            <p>
              Desde {siteConfig.contact.city} diseÃ±amos sistemas, plataformas y
              automatizaciones que ayudan a las empresas a organizar sus
              procesos, mejorar su operaciÃ³n y crecer sin lÃ­mites geogrÃ¡ficos.
            </p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal className="rounded-[2rem] border border-border/70 bg-background/45 px-6 py-8 backdrop-blur-sm lg:px-8">
            <SectionHeading
              eyebrow="QUÉ ES KONAMY SYSTEMS"
              title="Una propuesta enfocada en resolver problemas empresariales reales."
              description="Konamy Systems busca que la tecnología deje de ser un conjunto de herramientas dispersas y se convierta en una estructura clara para operar, administrar y crecer."
            />

            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Trabajamos donde la operación se vuelve lenta, la información se
                duplica, los equipos dependen de demasiados pasos manuales o un
                proceso importante ya no cabe en hojas de cálculo, chats o tareas
                improvisadas.
              </p>
              <p>
                Nuestro propósito es ayudar a las empresas a digitalizar con
                criterio, simplificar su forma de trabajo y automatizar lo que hoy
                consume demasiado tiempo sin aportar valor.
              </p>
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-[2rem] border border-border/70 bg-primary/[0.04] px-6 py-8 backdrop-blur-sm lg:px-8"
          >
            <p className="text-xs font-semibold tracking-[0.3em] text-primary">
              PROPUESTA DE VALOR
            </p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Diseñamos soluciones digitales adaptadas al ritmo, complejidad y
                prioridades de cada empresa.
              </p>
              <p>
                No ofrecemos tecnología separada del negocio. Construimos sistemas,
                automatizaciones e integraciones que se conectan con la operación
                real.
              </p>
              <p>
                La meta es que cada avance sea útil desde el principio y pueda
                sostener mejoras futuras sin perder claridad.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="FILOSOFÍA"
            title="Digitalizar, simplificar, automatizar y crecer."
            description="Estas cuatro ideas resumen la forma de trabajo de Konamy Systems y la intención detrás de cada solución."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {philosophy.map((item, index) => (
              <Reveal
                as="article"
                key={item}
                delay={index * 90}
                className="rounded-3xl border border-border/70 bg-background/50 px-6 py-6 backdrop-blur-sm"
              >
                <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal className="rounded-[2rem] border border-border/70 bg-background/45 px-6 py-8 backdrop-blur-sm lg:px-8">
            <SectionHeading
              eyebrow="FORMA DE TRABAJO"
              title="Claridad, validación y evolución continua."
              description="Trabajamos por etapas para entender el problema, definir la arquitectura adecuada y validar avances sin esconder el proceso detrás de tecnicismos."
            />

            <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                Cada solución se aterriza según la necesidad del negocio, se
                construye con lógica administrable y se revisa por utilidad real en
                la operación.
              </p>
              <p>
                Después de la entrega seguimos contemplando ajustes, mejoras e
                integración progresiva para acompañar el crecimiento.
              </p>
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-[2rem] border border-border/70 bg-background/45 px-6 py-8 backdrop-blur-sm lg:px-8"
          >
            <p className="text-xs font-semibold tracking-[0.3em] text-primary">
              VALORES
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {values.map((value, index) => (
                <Reveal
                  as="div"
                  key={value}
                  delay={index * 60}
                  className="rounded-2xl border border-border/70 bg-background/50 px-4 py-4 text-sm text-foreground/90"
                >
                  {value}
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="DIFERENCIA KONAMY"
            title="Una base local en Manizales. Soluciones digitales preparadas para operar en Colombia y el mundo."
            description="Konamy Systems inicia su presencia desde Manizales y trabaja de forma remota con empresas colombianas que necesitan orden, trazabilidad y automatización."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {differentiators.map((item, index) => (
              <Reveal
                as="article"
                key={item}
                delay={index * 90}
                className="rounded-3xl border border-border/70 bg-background/50 px-6 py-6 backdrop-blur-sm"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </Reveal>
            ))}
          </div>

          <Reveal
            variant="fade"
            className="mt-12 rounded-[2rem] border border-border/70 bg-secondary/20 px-6 py-10 lg:px-10"
          >
            <SectionHeading
              eyebrow="SIGUIENTE PASO"
              title="Si quiere conocer cómo trabajamos con su caso, podemos avanzar."
              description="Puede revisar el proceso completo, solicitar un diagnóstico guiado o programar una asesoría inicial."
              actions={
                <>
                  <SiteAction href={siteConfig.routes.process}>CONOCER PROCESO</SiteAction>
                  <SiteAction href={siteConfig.routes.advisory} variant="secondary">
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
