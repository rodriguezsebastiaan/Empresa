import { ShieldCheck, Target, TrendingUp, Zap } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const benefits = [
  {
    icon: Target,
    title: 'Menos tareas repetitivas',
    description: 'Automatizamos lo manual para que el equipo avance con foco.',
  },
  {
    icon: Zap,
    title: 'Procesos más conectados',
    description: 'La información pasa de un paso a otro sin duplicidad.',
  },
  {
    icon: ShieldCheck,
    title: 'Información más clara',
    description: 'Datos organizados para entender la operación y decidir.',
  },
  {
    icon: TrendingUp,
    title: 'Sistemas listos para crecer',
    description: 'Una base que acompaña nuevas necesidades sin empezar de cero.',
  },
]

export function HomeBenefits() {
  return (
    <section id="benefits" data-scene="benefits" className="ks-scene ks-scene--tall border-t border-border/60">
      <div className="ks-scene-content mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_2.1fr] lg:items-center">
          <div className="max-w-md">
            <Reveal
              as="h2"
              delay={80}
              className="ks-type-section font-semibold"
            >
              La experiencia es solo la punta del iceberg.
            </Reveal>
            <Reveal as="p" delay={150} className="ks-copy-primary mt-7">
              Detrás de cada solución construimos la lógica, integraciones, datos y automatizaciones que hacen que todo funcione.
            </Reveal>
            <Reveal as="p" delay={220} className="ks-type-statement mt-10 max-w-md font-medium">
              Tú ves el resultado. Nosotros construimos todo lo que lo hace posible.
            </Reveal>
          </div>

          <Reveal variant="fade" className="relative">
            <span
              aria-hidden="true"
              className="ks-sweep absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-primary via-primary/40 to-transparent"
            />
            <div className="grid gap-x-12 gap-y-12 pt-10 sm:grid-cols-2 xl:grid-cols-4">
              {benefits.map(({ icon: Icon, title, description }, i) => (
                <Reveal
                  key={title}
                  delay={200 + i * 140}
                  className="group border-l border-border/60 pl-5 transition-colors duration-300 hover:border-primary"
                >
                  <Icon
                    className="size-9 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_10px_var(--primary)]"
                    strokeWidth={1.5}
                  />
                  <h3 className="ks-type-card-title mt-6 font-semibold transition-transform duration-300 group-hover:-translate-y-0.5">
                    {title}
                  </h3>
                  <p className="ks-card-copy mt-4">
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
