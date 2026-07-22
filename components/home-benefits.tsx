import { ShieldCheck, Target, TrendingUp, Zap } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const benefits = [
  {
    icon: Target,
    title: 'Más organización',
    description: 'Procesos claros, visibles y ordenados.',
  },
  {
    icon: Zap,
    title: 'Menos trabajo manual',
    description: 'Automatizamos lo repetitivo para liberar tiempo.',
  },
  {
    icon: ShieldCheck,
    title: 'Mayor control',
    description: 'Información centralizada y trazable.',
  },
  {
    icon: TrendingUp,
    title: 'Mejor crecimiento',
    description: 'Decisiones más claras para escalar el negocio.',
  },
]

export function HomeBenefits() {
  return (
    <section className="relative border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
          <div className="max-w-sm">
            <Reveal
              as="p"
              variant="fade"
              className="mb-6 text-xs font-semibold tracking-[0.3em] text-primary"
            >
              TECNOLOGÍA QUE SE TRADUCE EN RESULTADOS
            </Reveal>
            <Reveal
              as="h2"
              delay={80}
              className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl"
            >
              Beneficios que generan crecimiento.
            </Reveal>
          </div>

          <Reveal variant="fade" className="relative">
            <span
              aria-hidden="true"
              className="ks-sweep absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-primary via-primary/40 to-transparent"
            />
            <div className="grid gap-8 pt-8 sm:grid-cols-2 xl:grid-cols-4">
              {benefits.map(({ icon: Icon, title, description }, i) => (
                <Reveal
                  key={title}
                  delay={200 + i * 140}
                  className="group border-l border-border/60 pl-5 transition-colors duration-300 hover:border-primary"
                >
                  <Icon
                    className="size-8 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_10px_var(--primary)]"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-5 text-base font-medium text-foreground transition-transform duration-300 group-hover:-translate-y-0.5">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                  <span className="mt-4 block h-px w-8 origin-left scale-x-0 bg-primary shadow-[0_0_8px_var(--primary)] transition-transform duration-300 group-hover:scale-x-100" />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
