import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'

const processSteps = [
  {
    title: 'Entendemos',
    whatHappens:
      'Escuchamos cómo funciona hoy la operación, qué depende de tareas manuales y dónde aparecen fricciones reales.',
    clientRole: 'Comparte contexto, prioridades y forma actual de trabajo.',
    deliverable: 'Mapa inicial del proceso y del problema a resolver.',
    validation: 'Confirmamos que estamos entendiendo el problema correcto.',
  },
  {
    title: 'Diagnosticamos',
    whatHappens:
      'Profundizamos en el impacto operativo, el orden de prioridades y la viabilidad de la solución.',
    clientRole: 'Aporta ejemplos, herramientas actuales y restricciones del negocio.',
    deliverable: 'Hallazgos, puntos críticos y criterio para decidir el siguiente paso.',
    validation: 'Revisamos juntos qué vale la pena resolver primero y por qué.',
  },
  {
    title: 'Diseñamos',
    whatHappens:
      'Definimos la arquitectura funcional, los módulos, las integraciones y el recorrido operativo necesario.',
    clientRole: 'Valida alcance, prioridades y lógica general de la solución.',
    deliverable: 'Diseño funcional claro y administrable.',
    validation: 'Ajustamos hasta que la solución represente realmente la operación.',
  },
  {
    title: 'Desarrollamos',
    whatHappens:
      'Construimos los componentes, flujos y reglas que sostendrán la solución.',
    clientRole: 'Participa en revisiones puntuales y aclara detalles del negocio.',
    deliverable: 'Versión funcional del sistema o módulo en construcción.',
    validation: 'Mostramos avances controlados para no esperar hasta el final.',
  },
  {
    title: 'Integramos',
    whatHappens:
      'Conectamos herramientas, datos y automatizaciones necesarias para que la solución no quede aislada.',
    clientRole: 'Confirma accesos, flujos reales y dependencia entre sistemas.',
    deliverable: 'Conexiones operativas y comportamiento integrado.',
    validation: 'Probamos escenarios reales para detectar vacíos antes de salir.',
  },
  {
    title: 'Implementamos',
    whatHappens:
      'Llevamos la solución al contexto operativo, configuramos uso y dejamos lista la transición.',
    clientRole: 'Prueba el sistema en su flujo de trabajo real y reporta observaciones.',
    deliverable: 'Sistema listo para operar con la empresa.',
    validation: 'Se verifican estados, resultados y uso básico en operación.',
  },
  {
    title: 'Mejoramos',
    whatHappens:
      'Acompañamos ajustes, mejoras y nuevas necesidades para que la solución siga creciendo.',
    clientRole: 'Comparte nuevos aprendizajes, cambios del proceso o mejoras deseadas.',
    deliverable: 'Evolución continua, soporte y mejoras progresivas.',
    validation: 'La solución se revisa por utilidad, no solo por estabilidad técnica.',
  },
] as const

export const metadata = buildPageMetadata('process')

export default function ProcessPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="PROCESO"
        title="Una metodología pensada para convertir desorden operativo en estructura digital útil."
        description="Konamy Systems trabaja por etapas claras para que el cliente entienda qué ocurre, qué debe validar y qué entrega recibe en cada momento del proyecto."
        actions={
          <>
            <SiteAction href={siteConfig.routes.diagnostics}>
              COMENZAR DIAGNÓSTICO
            </SiteAction>
            <SiteAction href={siteConfig.routes.advisory} variant="secondary">
              AGENDAR ASESORÍA
            </SiteAction>
          </>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="METODOLOGÍA"
          title="Siete etapas para trabajar con precisión, sin improvisar."
          description="Cada fase tiene un objetivo concreto, una participación esperada del cliente, una entrega visible y una validación para seguir avanzando."
        />

        <ol className="mt-12 space-y-6">
          {processSteps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 90}
              className="rounded-3xl border border-border/70 bg-background/50 px-6 py-7 backdrop-blur-sm"
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)]">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-primary">
                    0{index + 1}
                  </p>
                  <h2 className="mt-4 text-2xl font-medium text-foreground">
                    {step.title}
                  </h2>
                </div>

                <dl className="grid gap-5 text-sm">
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                      QUÉ OCURRE
                    </dt>
                    <dd className="mt-2 leading-relaxed text-foreground/85">
                      {step.whatHappens}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                      PARTICIPACIÓN DEL CLIENTE
                    </dt>
                    <dd className="mt-2 leading-relaxed text-foreground/85">
                      {step.clientRole}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                      ENTREGA DE KONAMY SYSTEMS
                    </dt>
                    <dd className="mt-2 leading-relaxed text-foreground/85">
                      {step.deliverable}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                      VALIDACIÓN
                    </dt>
                    <dd className="mt-2 leading-relaxed text-foreground/85">
                      {step.validation}
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <Reveal
            variant="fade"
            className="rounded-[2rem] border border-border/70 bg-background/40 px-6 py-10 lg:px-10"
          >
            <SectionHeading
              eyebrow="DESPUÉS DE LA ENTREGA"
              title="La implementación no es el cierre: es el inicio de una solución útil en operación."
              description="Una vez la solución entra en funcionamiento, seguimos observando mejoras, ajustes y oportunidades de evolución para que el sistema acompañe el crecimiento de la empresa."
              actions={
                <>
                  <SiteAction href={siteConfig.routes.diagnostics}>
                    COMENZAR DIAGNÓSTICO
                  </SiteAction>
                  <SiteAction href={siteConfig.routes.advisory} variant="secondary">
                    AGENDAR ASESORÍA
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
