import type { Metadata } from 'next'
import { siteConfig, type SitePageKey } from '@/config/site'
import type { PortfolioProject } from '@/config/portfolio'
import { isPageIndexable, seoIndexingEnabled, seoUrl } from '@/config/seo'

type SeoMetadataInput = {
  title: string
  description: string
  path: string
  indexable?: boolean
}

export function buildSeoMetadata({ title, description, path, indexable = seoIndexingEnabled }: SeoMetadataInput): Metadata {
  const canonicalUrl = seoUrl(path)
  const openGraphImageUrl = seoUrl(siteConfig.seo.openGraphImagePath)

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: indexable, follow: true },
    openGraph: {
      type: 'website',
      locale: siteConfig.seo.locale,
      url: canonicalUrl,
      siteName: siteConfig.seo.siteName,
      title,
      description,
      images: [{ url: openGraphImageUrl, alt: siteConfig.seo.openGraphImageAlt }],
    },
    twitter: {
      card: siteConfig.seo.twitterCard,
      title,
      description,
      images: [openGraphImageUrl],
    },
  }
}

export function buildPageMetadata(pageKey: SitePageKey): Metadata {
  const page = siteConfig.pages[pageKey]
  return buildSeoMetadata({ ...page, indexable: isPageIndexable(pageKey) })
}

export function buildProjectMetadata(project: PortfolioProject): Metadata {
  return buildSeoMetadata({
    title: project.seo.title,
    description: project.seo.description,
    path: `/proyectos/${project.slug}`,
  })
}
