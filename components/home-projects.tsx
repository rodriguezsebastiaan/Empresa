'use client'

import { type ComponentType, type ReactNode } from 'react'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import LogoLoop from '@/components/LogoLoop'
import { SiteAction } from '@/components/site-action'
import { publishedPortfolioProjects } from '@/config/portfolio'
import { siteConfig } from '@/config/site'

type LoopItem = {
  title: string
  ariaLabel: string
  node: ReactNode
}

type LogoLoopProps = {
  logos: LoopItem[]
  speed?: number
  gap?: number
  logoHeight?: number
  pauseOnHover?: boolean
  fadeOut?: boolean
  fadeOutColor?: string
  ariaLabel?: string
  className?: string
}

// The restored registry component is JavaScript-only, so its public props are
// declared locally until it is migrated to TypeScript.
const TypedLogoLoop = LogoLoop as ComponentType<LogoLoopProps>

const projectLogos = publishedPortfolioProjects.map((project) => ({
  title: project.name,
  ariaLabel: `Proyecto documentado: ${project.name}`,
  node: (
    <span className="flex h-[clamp(4rem,5vw,5rem)] items-center gap-[clamp(1rem,1.8vw,1.5rem)] text-foreground">
      <span className="flex h-full w-[clamp(5rem,7vw,7rem)] shrink-0 items-center justify-center">
        <Image
          src={project.logo.src.src}
          alt={project.logo.alt}
          width={project.logo.width}
          height={project.logo.height}
          className="max-h-[clamp(3.25rem,4.2vw,4.5rem)] max-w-full object-contain"
        />
      </span>
      <span aria-hidden="true" className="project-loop-label whitespace-nowrap tracking-[0.04em] text-foreground">
        {project.name}
      </span>
    </span>
  ),
}))

export function HomeProjects() {
  return (
    <section
      id="projects"
      data-scene="projects"
      className="ks-scene ks-scene--tall overflow-hidden border-t border-border/60 bg-primary/[0.015]"
    >
      <div className="ks-scene-content mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative isolate mx-auto max-w-3xl text-center">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-x-12 -inset-y-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(3,12,21,0.72)_0%,rgba(3,12,21,0.36)_48%,transparent_76%)]" />
          <Reveal
            as="h2"
            className="ks-type-section font-semibold"
          >
            No hablamos solo de ideas. Ya las estamos construyendo.
          </Reveal>
          <Reveal
            as="p"
            delay={100}
            className="ks-copy-primary mx-auto mt-6 max-w-2xl"
          >
            Una muestra de soluciones documentadas, diseñadas para convertir
            necesidades empresariales en productos y experiencias digitales.
          </Reveal>
        </div>

        <Reveal delay={180} variant="fade" className="relative mt-16 max-w-full overflow-hidden sm:mt-20">
          <div className="relative -mx-2 overflow-hidden rounded-2xl border-y border-primary/20 bg-[linear-gradient(90deg,rgba(3,12,21,0.78),rgba(5,18,29,0.34)_50%,rgba(3,12,21,0.78))] px-2 py-3 shadow-[inset_0_1px_0_rgba(191,255,255,0.08)] sm:-mx-4 sm:px-4">
            <TypedLogoLoop
              logos={projectLogos}
              speed={22}
              gap={104}
              logoHeight={80}
              pauseOnHover
              fadeOut
              fadeOutColor="rgb(3 12 21)"
              ariaLabel="Proyectos documentados en el portafolio de ConexaCod"
              className="py-4"
            />
          </div>
          <div className="mt-10 flex justify-center sm:mt-12">
            <SiteAction
              href={`${siteConfig.routes.about}#proyectos`}
              variant="secondary"
              className="ks-type-secondary min-h-[4.5rem] w-full justify-center rounded-xl border-primary/70 bg-[linear-gradient(110deg,rgba(15,38,43,0.78),rgba(5,8,13,0.86)_52%,rgba(57,219,211,0.1))] px-6 py-4 text-center font-semibold leading-snug tracking-[0.02em] text-primary shadow-[0_0_30px_-18px_var(--primary)] !transition-[border-color,background,box-shadow] !duration-200 hover:border-primary hover:bg-[linear-gradient(110deg,rgba(15,38,43,0.94),rgba(5,8,13,0.9)_52%,rgba(57,219,211,0.18))] hover:text-primary hover:shadow-[0_0_34px_-14px_var(--primary)] sm:px-10"
            >
              Conoce a fondo los proyectos que hemos construido
            </SiteAction>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
