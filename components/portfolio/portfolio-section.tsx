import { ProjectCard } from '@/components/portfolio/project-card'
import { Reveal } from '@/components/reveal'
import { publishedPortfolioProjects } from '@/config/portfolio'

export function PortfolioSection() {
  return (
    <section
      id="proyectos"
      aria-labelledby="portfolio-heading"
      className="relative scroll-mt-24 overflow-hidden border-y border-primary/20 py-24 sm:py-28 lg:min-h-[86svh] lg:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,12,21,0.38),rgba(3,12,21,0.72)_48%,rgba(3,12,21,0.4))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-20 h-px w-[84%] bg-[linear-gradient(90deg,transparent,rgba(77,235,235,0.65),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-end">
          <Reveal>
            <h2
              id="portfolio-heading"
              className="max-w-4xl text-[clamp(2.7rem,5.8vw,5.8rem)] font-semibold leading-[0.98] tracking-[-0.038em] text-foreground text-balance"
            >
              Lo que decimos se demuestra construyendo.
            </h2>
          </Reveal>
          <Reveal delay={100} as="p" className="ks-copy-primary lg:pb-2">
            Conoce algunos de los proyectos en los que hemos convertido necesidades
            reales en productos y experiencias digitales.
          </Reveal>
        </div>

        {publishedPortfolioProjects.length > 0 ? (
          <div className="mt-16 grid items-start gap-6 md:grid-cols-2 lg:mt-20 lg:gap-8">
            {publishedPortfolioProjects.map((project, index) => (
              <Reveal key={project.id} delay={index * 90}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal
            variant="fade"
            delay={160}
            className="mt-16 border-y border-primary/25 py-8 lg:mt-24 lg:py-10"
          >
            <p className="max-w-3xl text-[clamp(1.15rem,1.65vw,1.55rem)] leading-relaxed text-foreground/88">
              Los casos se publicarán aquí únicamente cuando cuenten con información
              real, enlaces activos y resultados validados.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
