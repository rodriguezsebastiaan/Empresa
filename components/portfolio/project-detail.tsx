import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import {
  hasValidLiveUrl,
  type PortfolioProject,
  type ProjectLogo,
} from '@/config/portfolio'
import { siteConfig } from '@/config/site'
import { serviceGroups } from '@/config/services'

type ProjectDetailProps = {
  project: PortfolioProject & { logo: ProjectLogo }
}

function ProjectCopySection({ title, copy }: { title: string; copy?: string }) {
  if (!copy) return null

  return (
    <div>
      <SectionHeading title={title} />
      <Reveal as="p" delay={100} className="ks-copy-secondary mt-7">
        {copy}
      </Reveal>
    </div>
  )
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const hasLiveUrl = hasValidLiveUrl(project.liveUrl)
  const hasStack = project.technologies.length > 0 || project.integrations.length > 0
  const relatedServices = serviceGroups.flatMap((group) => group.services)
    .filter((service) => project.seo.relatedServiceIds.includes(service.id))

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-primary/20 pt-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.45fr)] lg:items-end lg:px-10 lg:pb-28">
          <div>
            <nav aria-label="Migas de pan" className="mb-8 text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <li><Link href="/" className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">Inicio</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href={siteConfig.routes.about} className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">Nosotros</Link></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{project.name}</li>
              </ol>
            </nav>
            <Reveal>
              <Image
                src={project.logo.src}
                alt={project.logo.alt}
                width={project.logo.width}
                height={project.logo.height}
                className="max-h-16 w-auto object-contain"
                priority
              />
            </Reveal>
            <Reveal as="p" delay={60} className="mt-8 text-sm font-semibold tracking-[0.09em] text-primary">
              {project.category} · {project.status}
            </Reveal>
            <Reveal as="h1" delay={100} className="ks-type-page-hero mt-5 font-semibold">
              {project.name}
            </Reveal>
            <Reveal as="p" delay={180} className="ks-copy-primary mt-7">
              {project.shortDescription}
            </Reveal>
          </div>
          {hasLiveUrl ? (
            <Reveal delay={220} className="lg:justify-self-end">
              <SiteAction href={project.liveUrl!} external icon={ExternalLink}>
                VER PROYECTO
              </SiteAction>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <ProjectCopySection title="Contexto" copy={project.context} />
          <ProjectCopySection title="Problema" copy={project.need} />
        </div>
      </section>

      <section className="border-y border-border/60 bg-background/35">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <ProjectCopySection title="Qué construimos" copy={project.solution} />
          {relatedServices.length ? (
            <nav aria-label={`Servicios relacionados con ${project.name}`} className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {relatedServices.map((service) => (
                <SiteAction key={service.id} href={`/servicios#${service.id}`} variant="text">
                  {service.title}
                </SiteAction>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      {project.features.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <SectionHeading title="Funcionalidad clave" />
          <ul className="mt-10 grid gap-x-10 gap-y-5 md:grid-cols-2">
            {project.features.map((feature, index) => (
              <Reveal
                as="li"
                key={feature}
                delay={index * 70}
                className="border-t border-primary/25 pt-5 text-lg leading-relaxed text-foreground/90"
              >
                {feature}
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border-y border-primary/20 bg-primary/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <ProjectCopySection title="Resultado actual" copy={project.result} />
        </div>
      </section>

      {project.challenge || project.resolution ? (
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <ProjectCopySection title="Reto principal" copy={project.challenge} />
            <ProjectCopySection title="Cómo lo resolvimos" copy={project.resolution} />
          </div>
        </section>
      ) : null}

      {hasStack || project.contribution ? (
        <section className="border-y border-border/60 bg-background/35">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
            {hasStack ? (
              <Reveal delay={100}>
                <h2 className="text-xl font-semibold text-foreground">Tecnología e integraciones</h2>
                {project.technologies.length > 0 ? (
                  <>
                    <p className="mt-6 text-sm font-semibold tracking-[0.08em] text-primary">TECNOLOGÍAS</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <li key={technology} className="rounded-full border border-border/80 px-3 py-1.5 text-sm text-foreground/85">
                          {technology}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {project.integrations.length > 0 ? (
                  <>
                    <p className="mt-7 text-sm font-semibold tracking-[0.08em] text-primary">INTEGRACIONES</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {project.integrations.map((integration) => (
                        <li key={integration} className="rounded-full border border-border/80 px-3 py-1.5 text-sm text-foreground/85">
                          {integration}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </Reveal>
            ) : null}
            {project.contribution ? (
              <Reveal delay={150}>
                <h2 className="text-xl font-semibold text-foreground">Aporte de ConexaCod</h2>
                <ul className="mt-6 grid gap-4">
                  {project.contribution.map((item) => (
                    <li key={item} className="border-t border-primary/25 pt-4 leading-relaxed text-foreground/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="border-t border-primary/20 bg-background/45">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
          <SectionHeading
            title="¿Tienes un reto parecido?"
            description="Cuéntanos qué necesitas resolver y evaluemos juntos el siguiente paso."
            actions={
              <>
                {hasLiveUrl ? (
                  <SiteAction href={project.liveUrl!} external icon={ExternalLink}>
                    VER PROYECTO
                  </SiteAction>
                ) : null}
                <SiteAction href={siteConfig.routes.advisory} variant="secondary">
                  AGENDAR ASESORÍA
                </SiteAction>
                <SiteAction href={siteConfig.routes.contact} variant="text">
                  HABLAR SOBRE UN PROYECTO SIMILAR
                </SiteAction>
              </>
            }
          />
        </div>
      </section>
    </SiteShell>
  )
}
