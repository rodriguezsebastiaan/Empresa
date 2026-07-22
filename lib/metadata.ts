import type { Metadata } from 'next'
import { siteConfig, type SitePageKey } from '@/config/site'
import { absoluteUrl } from '@/lib/site'

export function buildPageMetadata(pageKey: SitePageKey): Metadata {
  const page = siteConfig.pages[pageKey]
  const canonicalUrl = absoluteUrl(page.path)
  const openGraphImageUrl = absoluteUrl(siteConfig.seo.openGraphImagePath)

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
    },
    robots: siteConfig.domainIsPlaceholder
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type: 'website',
      locale: siteConfig.seo.locale,
      url: canonicalUrl,
      siteName: siteConfig.seo.siteName,
      title: page.title,
      description: page.description,
      images: [
        {
          url: openGraphImageUrl,
          alt: siteConfig.seo.openGraphImageAlt,
        },
      ],
    },
    twitter: {
      card: siteConfig.seo.twitterCard,
      title: page.title,
      description: page.description,
      images: [openGraphImageUrl],
    },
  }
}
