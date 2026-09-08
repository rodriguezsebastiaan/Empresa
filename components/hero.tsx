import { ArrowRight } from 'lucide-react'
import { PortalHeroVisual } from '@/components/portal-hero-visual'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24"
    >
      <div
        aria-hidden="true"
        className="ks-enter-fade pointer-events-none absolute inset-x-0 top-0 h-[42rem] [--enter-delay:80ms]"
      >
        <div className="absolute left-1/2 top-[-7rem] h-[30rem] w-[min(88vw,72rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_24%,transparent)_0%,transparent_72%)] blur-3xl" />
        <div className="absolute inset-x-[8%] top-12 h-px bg-[linear-gradient(90deg,transparent_0%,color-mix(in_oklch,var(--primary)_52%,transparent)_50%,transparent_100%)] opacity-70" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-10">
        {/* Copy — staggered entrance via CSS (reduced-motion safe) */}
        <div className="max-w-xl">
          <p className="ks-enter mb-6 text-xs font-semibold tracking-[0.3em] text-primary [--enter-delay:120ms]">
            KONAMY SYSTEMS
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="ks-enter block [--enter-delay:220ms]">
              Transformamos problemas empresariales en{' '}
            </span>
            <span className="ks-enter block text-primary [--enter-delay:340ms]">
              soluciones digitales.
            </span>
          </h1>
          <p className="ks-enter mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground [--enter-delay:480ms]">
            Diseñamos plataformas, sistemas y automatizaciones para organizar
            procesos, ahorrar tiempo y ayudar a las empresas a crecer.
          </p>
          <p className="ks-enter mt-6 text-xs font-semibold tracking-[0.2em] text-primary [--enter-delay:560ms]">
            DIGITALIZAR PARA SIMPLIFICAR. AUTOMATIZAR PARA CRECER.
          </p>

          <div className="ks-enter mt-10 flex flex-wrap items-center gap-4 [--enter-delay:660ms]">
            <a
              href="#servicios"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-xs font-semibold tracking-widest text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] outline-none transition-all duration-300 hover:shadow-[0_0_30px_-6px_var(--primary)] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              CONOCER NUESTROS SERVICIOS
              <ArrowRight className="ks-arrow size-4" />
            </a>
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-6 py-3.5 text-xs font-semibold tracking-widest text-foreground outline-none transition-colors duration-300 hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              AGENDAR ASESORÍA
              <ArrowRight className="ks-arrow size-4" />
            </a>
          </div>

          <a
            href="#contacto"
            className="group ks-enter mt-6 inline-flex items-center gap-2 text-sm text-primary outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary/60 [--enter-delay:760ms]"
          >
            Solicitar diagnóstico
            <ArrowRight className="ks-arrow size-4" />
          </a>
        </div>

        {/* Visual — living KS diagram */}
        <div className="ks-enter-fade relative [--enter-delay:820ms]">
          <PortalHeroVisual />
        </div>
      </div>
    </section>
  )
}
