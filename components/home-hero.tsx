import { siteConfig } from '@/config/site'
import { SiteAction } from '@/components/site-action'

export function HomeHero() {
  return (
    <section
      id="hero"
      data-scene="hero"
      className="ks-scene ks-scene--tall overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="ks-enter-fade pointer-events-none absolute inset-x-0 top-0 h-[42rem] [--enter-delay:80ms]"
      >
        <div className="absolute left-1/2 top-[-7rem] h-[30rem] w-[min(88vw,72rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_24%,transparent)_0%,transparent_72%)] blur-3xl" />
        <div className="absolute inset-x-[8%] top-12 h-px bg-[linear-gradient(90deg,transparent_0%,color-mix(in_oklch,var(--primary)_52%,transparent)_50%,transparent_100%)] opacity-70" />
      </div>

      <div className="ks-scene-content mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-xl">
          <h1 className="ks-type-hero font-semibold">
            <span className="ks-enter block [--enter-delay:220ms]">
              Transformamos problemas empresariales en{' '}
            </span>
            <span className="ks-enter block text-primary [--enter-delay:340ms]">
              soluciones digitales.
            </span>
          </h1>
          <p className="ks-copy-primary ks-enter mt-7 max-w-xl [--enter-delay:480ms]">
            Desde Manizales, desarrollamos sitios web, software a medida y
            aplicaciones web que simplifican procesos y conectan la operación
            de empresas en Colombia.
          </p>
          <p className="ks-type-statement ks-enter mt-7 max-w-xl font-semibold tracking-[0.02em] text-primary [--enter-delay:560ms]">
            Digitalizar para simplificar. Automatizar para crecer.
          </p>

          <div className="ks-enter mt-10 flex flex-wrap items-center gap-4 [--enter-delay:660ms]">
            <SiteAction href={siteConfig.routes.services}>
              CONOCER NUESTROS SERVICIOS
            </SiteAction>
            <SiteAction href={siteConfig.routes.advisory} variant="secondary">
              AGENDAR ASESORÍA
            </SiteAction>
          </div>

          <SiteAction
            href={siteConfig.routes.diagnostics}
            variant="text"
            className="ks-enter mt-6 [--enter-delay:760ms]"
          >
            Solicitar diagnóstico
          </SiteAction>
        </div>

      </div>
    </section>
  )
}
