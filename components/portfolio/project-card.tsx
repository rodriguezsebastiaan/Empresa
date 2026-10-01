'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ExternalLink } from 'lucide-react'
import {
  hasValidLiveUrl,
  type PortfolioProject,
  type ProjectLogo,
} from '@/config/portfolio'

type ProjectCardProps = {
  project: PortfolioProject & { logo: ProjectLogo }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = useId()
  const detailHref = `/proyectos/${project.slug}`
  const hasLiveUrl = hasValidLiveUrl(project.liveUrl)
  const projectLogo = (
    <Image
      src={project.logo.src}
      alt={project.logo.alt}
      width={project.logo.width}
      height={project.logo.height}
      className="max-h-16 w-auto object-contain"
    />
  )

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-primary/25 bg-[linear-gradient(145deg,rgba(3,12,21,0.84),rgba(5,21,32,0.58))] transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-primary/55 focus-within:border-primary/55 ${isExpanded ? '' : 'md:min-h-[32rem]'}`}
    >
      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <div className="flex min-h-[4.5rem] items-start justify-between gap-6 md:h-24">
          {hasLiveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[4.5rem] min-w-11 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={`Abrir ${project.name} en una pestaña nueva`}
            >
              {projectLogo}
            </a>
          ) : (
            <div className="inline-flex h-[4.5rem] min-w-11 items-center">{projectLogo}</div>
          )}
          <div className="max-w-44 text-right">
            <p className="text-[0.98rem] font-semibold leading-snug text-primary sm:text-[1.06rem]">
              {project.category}
            </p>
            <p className="mt-1.5 text-[0.9rem] font-medium leading-snug tracking-[0.02em] text-foreground/78 sm:text-[0.98rem]">
              {project.status}
            </p>
          </div>
        </div>

        <h3 className="ks-type-card-title mt-8 font-semibold md:min-h-[3.5rem]">
          {hasLiveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>
        <p className="ks-card-copy mt-4 leading-[1.62] text-foreground/92 md:line-clamp-6 md:min-h-[10.125rem]">
          {project.shortDescription}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-3 pt-7">
          {hasLiveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2.5 rounded-sm text-[1rem] font-semibold text-primary outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary sm:text-[1.05rem]"
            >
              Ver proyecto
              <ExternalLink className="size-[1.125rem]" aria-hidden="true" />
              <span className="sr-only"> (abre en una pestaña nueva)</span>
            </a>
          ) : null}
          {project.detailPageEnabled ? (
            <Link
              href={detailHref}
              className="inline-flex min-h-12 items-center rounded-sm text-[1rem] font-semibold text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary sm:text-[1.05rem]"
            >
              Ver caso de {project.name}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="border-t border-primary/20">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="flex min-h-14 w-full items-center justify-between gap-4 px-7 py-3.5 text-left text-[1rem] font-semibold text-foreground outline-none transition-colors hover:bg-primary/[0.06] hover:text-primary focus-visible:bg-primary/[0.08] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-8 sm:text-[1.05rem]"
        >
          {isExpanded ? 'Ocultar desarrollo' : 'Conocer el desarrollo'}
          <ChevronDown
            aria-hidden="true"
            className={`size-[1.125rem] shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          id={detailsId}
          aria-hidden={!isExpanded}
          inert={!isExpanded}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <dl className="grid gap-7 px-7 pb-8 pt-4 sm:px-8 sm:pb-9">
              <div>
                <dt className="text-[1.02rem] font-semibold text-primary">Necesidad</dt>
                <dd className="ks-card-copy mt-2">{project.need}</dd>
              </div>
              <div>
                <dt className="text-[1.02rem] font-semibold text-primary">Qué construimos</dt>
                <dd className="ks-card-copy mt-2">{project.solution}</dd>
              </div>
              <div>
                <dt className="text-[1.02rem] font-semibold text-primary">Resultado</dt>
                <dd className="ks-card-copy mt-2">{project.result}</dd>
              </div>
              {project.technologies.length > 0 ? (
                <div>
                  <dt className="text-[1.02rem] font-semibold text-primary">Tecnologías</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-border/80 px-3 py-1 text-sm text-foreground/85"
                      >
                        {technology}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </article>
  )
}
