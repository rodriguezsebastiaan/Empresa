import { Blocks, PencilRuler, Search } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/reveal'
import { SiteAction } from '@/components/site-action'

const steps = [
  {
    icon: Search,
    title: 'Entender',
    description:
      'Analizamos su operación, sus problemas reales y lo que realmente necesita resolver.',
  },
  {
    icon: PencilRuler,
    title: 'Diseñar',
    description:
      'Definimos la solución digital adecuada, clara, administrable y pensada para crecer.',
  },
  {
    icon: Blocks,
    title: 'Construir',
    description:
      'Desarrollamos e implementamos el sistema y lo dejamos funcionando en su empresa.',
  },
]

export function HomeApproach() {
  return (
    <section id="approach" data-scene="approach" className="ks-scene border-t border-border/60">
      <div className="ks-scene-content mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-lg">
            <Reveal
              as="h2"
              delay={80}
              className="ks-type-section font-semibold"
            >
              Antes de construir una solución, entendemos lo que realmente
              necesita tu negocio.
            </Reveal>
            <Reveal
              as="p"
              delay={160}
              className="ks-copy-primary mt-7"
            >
              Analizamos cómo funciona su operación, identificamos qué está
              frenando el proceso y definimos una ruta clara antes de desarrollar.
            </Reveal>
          </div>

          <div className="max-w-md border-l border-primary/35 pl-6 lg:justify-self-end lg:pl-12">
            <Reveal as="p" delay={220} variant="fade" className="ks-type-statement text-pretty font-medium">
              La tecnología cobra valor cuando resuelve problemas reales.
            </Reveal>
          </div>
        </div>

        <div className="relative mt-20">
          <Reveal
            variant="clip"
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-primary/60 via-primary/30 to-transparent md:block"
          >
            <span className="sr-only">Línea de proceso</span>
          </Reveal>

          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 160}
                className="group relative"
              >
                <div className="flex items-center gap-4">
                  <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-lg border border-border bg-background transition-colors duration-300 group-hover:border-primary">
                    <Icon
                      className="size-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="text-[0.78rem] font-semibold tracking-[0.24em] text-foreground/80">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="ks-type-card-title mt-5 font-semibold">
                  {title}
                </h3>
                <p className="ks-card-copy mt-3">
                  {description}
                </p>
                <span className="mt-4 block h-px w-10 origin-left scale-x-0 bg-primary shadow-[0_0_8px_var(--primary)] transition-transform duration-300 group-hover:scale-x-100" />
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={260} variant="fade" className="mt-12">
          <SiteAction href={siteConfig.routes.process} variant="text">
            VER EL PROCESO COMPLETO
          </SiteAction>
        </Reveal>
      </div>
    </section>
  )
}
