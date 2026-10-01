import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/portfolio/project-detail'
import { JsonLd } from '@/components/seo/json-ld'
import { buildProjectMetadata } from '@/lib/metadata'
import { buildProjectStructuredData } from '@/lib/structured-data'
import {
  getPublishedProjectBySlug,
  publishedPortfolioProjects,
} from '@/config/portfolio'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return publishedPortfolioProjects
    .filter((project) => project.detailPageEnabled)
    .map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getPublishedProjectBySlug(slug)

  if (!project?.detailPageEnabled) {
    return {
      title: 'Proyecto no disponible | ConexaCod',
      robots: { index: false, follow: false },
    }
  }

  return buildProjectMetadata(project)
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getPublishedProjectBySlug(slug)

  if (!project?.detailPageEnabled) notFound()

  return (
    <>
      <JsonLd data={buildProjectStructuredData(project)} />
      <ProjectDetail project={project} />
    </>
  )
}
