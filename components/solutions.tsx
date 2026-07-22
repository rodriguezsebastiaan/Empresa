'use client'

import { useState } from 'react'
import { ArrowRight, MonitorCog, Workflow, Link2, CodeXml } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

const solutions = [
  {
    icon: MonitorCog,
    title: 'Plataformas y sistemas empresariales',
    description:
      'Sistemas administrativos y operativos a la medida de su negocio.',
    detail:
      'Centralizamos su operación en una plataforma propia: usuarios, permisos, módulos y reportes diseñados para su forma de trabajar.',
  },
  {
    icon: Workflow,
    title: 'Automatización de procesos',
    description:
      'Eliminamos tareas repetitivas y optimizamos su operación con flujos inteligentes.',
    detail:
      'Conectamos pasos manuales en flujos automáticos que ahorran tiempo, reducen errores y liberan a su equipo.',
  },
  {
    icon: Link2,
    title: 'Integraciones tecnológicas',
    description:
      'Conectamos sus sistemas y centralizamos la información para mejores decisiones.',
    detail:
      'Unificamos las herramientas que ya usa para que sus datos fluyan sin duplicidad y siempre estén actualizados.',
  },
  {
    icon: CodeXml,
    title: 'Desarrollo web funcional',
    description:
      'Sitios y aplicaciones web rápidas, seguras y pensadas para resultados.',
    detail:
      'Construimos experiencias web veloces, accesibles y orientadas a convertir, listas para escalar con su negocio.',
  },
]

export function Solutions() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section
      id="soluciones"
      className="relative border-t border-border/60 bg-primary/[0.015]"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
          <div className="max-w-xs">
            <Reveal
              as="p"
              variant="fade"
              className="mb-6 text-xs font-semibold leading-relaxed tracking-[0.3em] text-primary"
            >
              SOLUCIONES CONSTRUIDAS ALREDEDOR DE SU OPERACIÓN
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl"
            >
              Soluciones que impulsan su empresa.
            </Reveal>
          </div>

          {/* Editorial modules: hover to expand on desktop, tap to expand on mobile */}
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
                      'group relative flex flex-col border-t border-border/60 py-6 text-left outline-none transition-all duration-500 ease-out first:border-t-0 focus-visible:ring-2 focus-visible:ring-primary/50 lg:border-l lg:border-t-0 lg:px-6 lg:py-2 lg:first:border-l-0',
                      'lg:basis-0',
                      isActive ? 'lg:grow-[1.9]' : 'lg:grow',
                      dimmed ? 'lg:opacity-45' : 'opacity-100',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-8 text-primary transition-all duration-300',
                        isActive
                          ? 'drop-shadow-[0_0_10px_var(--primary)]'
                          : 'opacity-90',
                      )}
                      strokeWidth={1.5}
                    />
                    <h3 className="mt-5 text-base font-medium leading-snug text-foreground">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>

                    {/* Expanded detail */}
                    <div
                      className={cn(
                        'grid transition-all duration-500 ease-out',
                        isActive
                          ? 'mt-3 grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {detail}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-widest text-primary">
                          VER SERVICIO
                          <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Divider accent that lights up */}
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

        <div className="mt-16 flex justify-center" id="servicios">
          <a
            href="#servicios"
            className="group inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-primary outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            EXPLORAR TODOS LOS SERVICIOS
            <ArrowRight className="ks-arrow size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
