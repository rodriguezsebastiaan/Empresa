import { Blocks, PencilRuler, Search } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { Reveal } from '@/components/reveal'
import { SiteAction } from '@/components/site-action'

const steps = [
  {
    icon: Search,
    title: 'Entendemos',
    description:
      'Analizamos su operación, sus problemas reales y lo que realmente necesita resolver.',
  },
  {
    icon: PencilRuler,
    title: 'Diseñamos',
    description:
      'Definimos la solución digital adecuada, clara, administrable y pensada para crecer.',
  },
  {
    icon: Blocks,
    title: 'Construimos',
    description:
      'Desarrollamos e implementamos el sistema y lo dejamos funcionando en su empresa.',
  },
]

export function HomeApproach() {
  return (
    <section className="relative border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="max-w-lg">
            <Reveal
              as="p"
              variant="fade"
              className="mb-6 text-xs font-semibold tracking-[0.3em] text-primary"
            >
              NUESTRO ENFOQUE
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl"
            >
              No empezamos por la tecnología. Empezamos por entender su
              operación.
            </Reveal>
            <Reveal
              as="p"
              delay={160}
              className="mt-6 text-pretty leading-relaxed text-muted-foreground"
            >
              Konamy Systems analiza problemas operativos y los transforma en
              soluciones digitales funcionales, administrables y preparadas para
              crecer.
            </Reveal>
          </div>

          <div className="flex items-end justify-start border-l border-border/60 pl-0 lg:justify-end lg:pl-12">
            <Reveal delay={220} variant="fade">
              <SiteAction href={siteConfig.routes.about} variant="text">
                CONOCER KONAMY SYSTEMS
              </SiteAction>
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
                  <span className="text-[0.7rem] font-semibold tracking-[0.3em] text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-medium text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
