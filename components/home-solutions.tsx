'use client'

import { useState } from 'react'
import { CodeXml, Link2, MonitorCog, Workflow } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'
import { SiteAction } from '@/components/site-action'

const solutions = [
  {
    icon: MonitorCog,
    title: 'Plataformas y sistemas empresariales',
    description:
      'Sistemas propios que ordenan usuarios, procesos y reportes.',
    detail:
      'Centralizamos su operación en una plataforma propia: usuarios, permisos, módulos y reportes diseñados para su forma de trabajar.',
  },
  {
    icon: Workflow,
    title: 'Automatización de procesos',
    description:
      'Flujos que eliminan tareas repetitivas y hacen avanzar la operación.',
    detail:
      'Conectamos pasos manuales en flujos automáticos que ahorran tiempo, reducen errores y liberan a su equipo.',
  },
  {
    icon: Link2,
    title: 'Integraciones tecnológicas',
    description:
      'Sistemas conectados para que los datos fluyan sin duplicidad.',
    detail:
      'Unificamos las herramientas que ya usa para que sus datos fluyan sin duplicidad y siempre estén actualizados.',
  },
  {
    icon: CodeXml,
    title: 'Desarrollo web funcional',
    description:
      'Experiencias web claras, veloces y preparadas para evolucionar.',
    detail:
      'Construimos experiencias web veloces, accesibles y orientadas a convertir, listas para escalar con su negocio.',
  },
]

export function HomeSolutions() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="solutions" data-scene="solutions" className="ks-scene ks-scene--tall border-t border-border/60 bg-primary/[0.015]">
      <div className="ks-scene-content mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.95fr_2.2fr] lg:items-center">
          <div className="max-w-md">
            <Reveal
              as="h2"
              delay={80}
            className="ks-type-section font-semibold"
            >
              Lo que tus clientes ven debe ser simple. La complejidad la
              resolvemos nosotros.
            </Reveal>
            <Reveal as="p" delay={150} className="ks-copy-primary mt-7">
              Diseñamos experiencias digitales claras y funcionales que convierten necesidades reales en herramientas que las personas pueden usar.
            </Reveal>
          </div>

          <Reveal delay={120} variant="fade" className="lg:pl-4">
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              {solutions.map(({ icon: Icon, title, description, detail }, i) => {
                const isActive = active === i
                const dimmed = active !== null && !isActive

                return (
                  <button
                    key={title}
                    type="button"
                    aria-expanded={isActive}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive((prev) => (prev === i ? null : i))}
                    className={cn(
                      'group relative flex flex-col border-t border-border/60 py-7 text-left outline-none transition-all duration-500 ease-out first:border-t-0 focus-visible:ring-2 focus-visible:ring-primary/50 lg:min-h-80 lg:border-l lg:border-t-0 lg:px-7 lg:py-3 lg:first:border-l-0',
                      'lg:basis-0',
                      isActive ? 'lg:grow-[1.9]' : 'lg:grow',
                      dimmed ? 'lg:opacity-60' : 'opacity-100',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-9 text-primary transition-all duration-300',
                        isActive
                          ? 'drop-shadow-[0_0_10px_var(--primary)]'
                          : 'opacity-90',
                      )}
                      strokeWidth={1.5}
                    />
                    <h3 className="ks-type-card-title mt-6 font-semibold">
                      {title}
                    </h3>
                    <p className="ks-card-copy mt-4">
                      {description}
                    </p>

                    <div
                      className={cn(
                        'grid transition-all duration-500 ease-out',
                        isActive
                          ? 'mt-3 grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <div className="overflow-hidden">
                          <p className="ks-card-copy">
                          {detail}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-semibold tracking-[0.12em] text-primary">
                          VER SOLUCIÓN
                        </span>
                      </div>
                    </div>

                    <span
                      className={cn(
                        'mt-5 block h-px origin-left bg-primary shadow-[0_0_8px_var(--primary)] transition-transform duration-500 lg:mt-auto',
                        isActive ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </button>
                )
              })}
            </div>
          </Reveal>
        </div>

        <Reveal as="p" delay={180} className="ks-type-statement mx-auto mt-16 max-w-2xl text-center font-medium">
          La solución visible es solo el comienzo.
        </Reveal>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <SiteAction href={siteConfig.routes.services} variant="text">
            EXPLORAR TODOS LOS SERVICIOS
          </SiteAction>
          <SiteAction href={siteConfig.routes.solutions} variant="text">
            VER CÓMO SE ADAPTA CADA SOLUCIÓN
          </SiteAction>
        </div>
      </div>
    </section>
  )
}
