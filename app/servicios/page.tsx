import { MessageCircle } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'
import { buildWhatsAppUrl, hasConfiguredWhatsApp } from '@/lib/site'

const serviceGroups = [
  {
    title: 'Diagnóstico, consultoría y definición',
    services: [
      {
        title: 'Diagnóstico y consultoría tecnológica',
        problem: 'Aclara qué está frenando la operación y qué conviene resolver primero.',
        includes: 'Mapa del proceso actual, hallazgos, prioridades y ruta de trabajo.',
        benefit: 'Permite tomar decisiones con criterio y no por intuición.',
        useCases: 'Empresas que saben que tienen un problema, pero aún no la forma exacta de resolverlo.',
      },
      {
        title: 'Desarrollo web corporativo y funcional',
        problem: 'Evita que la presencia digital quede separada de la operación real.',
        includes: 'Sitios corporativos, formularios funcionales, secciones administrables y estructura clara.',
        benefit: 'La web deja de ser solo presencia y empieza a soportar procesos reales.',
        useCases: 'Empresas que necesitan presencia profesional conectada con contacto, reservas o captación.',
      },
      {
        title: 'Plataformas web empresariales',
        problem: 'Centraliza flujos, usuarios y módulos en una plataforma propia.',
        includes: 'Paneles, permisos, estados, formularios, reportes y vistas operativas.',
        benefit: 'La empresa gana orden, trazabilidad y una base lista para crecer.',
        useCases: 'Operaciones que ya no pueden sostenerse solo con hojas de cálculo y mensajería.',
      },
    ],
  },
  {
    title: 'Operación, administración y control',
    services: [
      {
        title: 'Sistemas administrativos a medida',
        problem: 'Resuelve cuellos de botella donde la operación depende de procesos improvisados.',
        includes: 'Módulos administrativos, roles, aprobaciones, estados, históricos y control interno.',
        benefit: 'La operación deja de depender de memoria, chats o archivos aislados.',
        useCases: 'Empresas con procesos internos repetitivos, administrativos o de coordinación.',
      },
      {
        title: 'Paneles administrativos',
        problem: 'Da visibilidad a lo que ocurre en tiempo real.',
        includes: 'Dashboards, listas filtrables, métricas clave, acciones rápidas y seguimiento.',
        benefit: 'Reduce tiempos de respuesta y mejora la lectura operativa.',
        useCases: 'Equipos que necesitan control diario sobre pedidos, clientes, reservas o procesos.',
      },
      {
        title: 'Bases de datos y reportes',
        problem: 'Evita la pérdida de información y la toma de decisiones sin contexto.',
        includes: 'Estructura de datos, consolidación, reportes exportables y métricas útiles.',
        benefit: 'La empresa gana una fuente más confiable para decidir y actuar.',
        useCases: 'Operaciones con información fragmentada, repetida o difícil de consultar.',
      },
      {
        title: 'Comercio electrónico, pedidos y pagos cuando aplique',
        problem: 'Organiza ventas, solicitudes y cobros cuando el proceso lo necesita.',
        includes: 'Catálogos, pedidos, estados, integraciones de pago y seguimiento del pedido.',
        benefit: 'El proceso comercial se vuelve más claro tanto para la empresa como para el cliente.',
        useCases: 'Negocios que venden productos, reciben pedidos o necesitan digitalizar cobros.',
      },
    ],
  },
  {
    title: 'Automatización e integraciones',
    services: [
      {
        title: 'Automatización de procesos',
        problem: 'Reduce pasos manuales que consumen tiempo y generan errores.',
        includes: 'Flujos automáticos, activadores, validaciones, estados y notificaciones.',
        benefit: 'El equipo libera tiempo y mejora consistencia en tareas repetitivas.',
        useCases: 'Procesos con seguimiento manual, copias de datos o tareas repetidas todos los días.',
      },
      {
        title: 'Integraciones tecnológicas',
        problem: 'Evita que cada herramienta trabaje por separado.',
        includes: 'Conexiones entre sistemas, sincronización de datos y reglas entre plataformas.',
        benefit: 'La información circula sin duplicidad ni retrabajo.',
        useCases: 'Empresas que usan varias herramientas y necesitan que trabajen como un sistema.',
      },
      {
        title: 'WhatsApp Business y automatizaciones de comunicación',
        problem: 'Ordena respuestas, seguimientos y confirmaciones desde el canal más usado.',
        includes: 'Mensajes iniciales, secuencias, disparadores y flujos conversacionales simples.',
        benefit: 'Mejora respuesta comercial y operativa sin depender de seguimiento manual constante.',
        useCases: 'Equipos que atienden por WhatsApp, confirman procesos o reciben solicitudes recurrentes.',
      },
      {
        title: 'Integración con Google Calendar',
        problem: 'Automatiza reservas y evita choques de agenda.',
        includes: 'Disponibilidad real, reserva de espacios, eventos y enlaces de reunión.',
        benefit: 'El agendamiento se vuelve más claro para el cliente y más controlado para la empresa.',
        useCases: 'Empresas que atienden por citas, asesorías, reservas o reuniones programadas.',
      },
    ],
  },
  {
    title: 'Evolución y continuidad',
    services: [
      {
        title: 'Modernización de sistemas existentes',
        problem: 'Mejora herramientas actuales sin obligar a empezar desde cero.',
        includes: 'Ajustes de interfaz, lógica, integración, desempeño y estructura interna.',
        benefit: 'La empresa conserva lo útil y corrige lo que hoy limita su operación.',
        useCases: 'Sistemas antiguos, paneles lentos o herramientas internas que ya no alcanzan.',
      },
      {
        title: 'Soporte, mantenimiento y evolución',
        problem: 'Evita que una solución útil se quede congelada o se deteriore con el tiempo.',
        includes: 'Ajustes, mejoras, acompañamiento, correcciones y evolución funcional.',
        benefit: 'La solución se mantiene viva y alineada con el crecimiento del negocio.',
        useCases: 'Empresas que quieren continuidad, estabilidad y mejoras progresivas.',
      },
    ],
  },
] as const

export const metadata = buildPageMetadata('services')

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="SERVICIOS"
        title="Servicios diseñados para ordenar procesos, conectar información y automatizar trabajo real."
        description="Konamy Systems reúne desarrollo, automatización e integración en una misma lógica de trabajo. No ofrecemos paquetes rígidos: cada servicio se adapta a lo que su empresa necesita resolver."
        actions={
          <>
            <SiteAction href={siteConfig.routes.diagnostics}>SOLICITAR DIAGNÓSTICO</SiteAction>
            <SiteAction href={siteConfig.routes.advisory} variant="secondary">
              AGENDAR ASESORÍA
            </SiteAction>
            <SiteAction
              href={buildWhatsAppUrl()}
              external={hasConfiguredWhatsApp()}
              variant="secondary"
              icon={MessageCircle}
            >
              HABLAR POR WHATSAPP
            </SiteAction>
          </>
        }
        aside={
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Servicios y beneficios no son lo mismo. Aquí encontrará lo que
              Konamy Systems puede construir, mejorar o integrar.
            </p>
            <p>
              Los beneficios siguen estando visibles en la home como resultados;
              esta página organiza la oferta real de trabajo.
            </p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="MAPA DE SERVICIOS"
          title="Una oferta completa, sin fragmentar automatizaciones fuera del resto del sistema."
          description="La automatización hace parte natural de los servicios de Konamy Systems. No funciona aislada: se conecta con plataformas, procesos, datos y seguimiento."
        />

        <div className="mt-12 space-y-10">
          {serviceGroups.map((group, groupIndex) => (
            <section key={group.title} className="space-y-5">
              <Reveal variant="fade" delay={groupIndex * 90} className="max-w-2xl">
                <h2 className="text-2xl font-medium text-foreground">
                  {group.title}
                </h2>
              </Reveal>

              <div className="space-y-5">
                {group.services.map((service, serviceIndex) => (
                  <Reveal
                    as="article"
                    key={service.title}
                    delay={groupIndex * 90 + serviceIndex * 70}
                    className="rounded-3xl border border-border/70 bg-background/50 px-6 py-7 backdrop-blur-sm"
                  >
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                      <div>
                        <h3 className="text-xl font-medium text-foreground">
                          {service.title}
                        </h3>
                        <p className="mt-3 leading-relaxed text-muted-foreground">
                          {service.problem}
                        </p>
                      </div>

                      <dl className="grid gap-4 text-sm">
                        <div>
                          <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                            QUÉ PUEDE INCLUIR
                          </dt>
                          <dd className="mt-2 leading-relaxed text-foreground/85">
                            {service.includes}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                            BENEFICIO
                          </dt>
                          <dd className="mt-2 leading-relaxed text-foreground/85">
                            {service.benefit}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold tracking-[0.24em] text-primary">
                            CUÁNDO APLICA
                          </dt>
                          <dd className="mt-2 leading-relaxed text-foreground/85">
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
                  <SiteAction
                    href={buildWhatsAppUrl()}
                    external={hasConfiguredWhatsApp()}
                    variant="secondary"
                    icon={MessageCircle}
                  >
                    HABLAR POR WHATSAPP
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
