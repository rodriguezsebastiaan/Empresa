import { siteConfig, type SitePageKey } from '@/config/site'
import { seoUrl } from '@/config/seo'
import { serviceGroups } from '@/config/services'
import type { PortfolioProject } from '@/config/portfolio'

const organizationId = seoUrl('/#organization')
const websiteId = seoUrl('/#website')
const organization = { '@id': organizationId }

export function buildSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: siteConfig.name,
        url: seoUrl(),
        logo: { '@type': 'ImageObject', url: seoUrl(siteConfig.seo.faviconSvgPath), width: 180, height: 180 },
        description: siteConfig.description,
        location: {
          '@type': 'Place',
          name: `${siteConfig.contact.city}, ${siteConfig.contact.country}`,
          address: { '@type': 'PostalAddress', addressLocality: 'Manizales', addressRegion: 'Caldas', addressCountry: 'CO' },
        },
        areaServed: { '@type': 'Country', name: siteConfig.contact.country },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: seoUrl(),
        name: siteConfig.name,
        inLanguage: 'es-CO',
        publisher: organization,
      },
    ],
  }
}

export function buildPageStructuredData(pageKey: SitePageKey) {
  const page = siteConfig.pages[pageKey]
  const pageId = seoUrl(`${page.path}#webpage`)
  const services = pageKey === 'services'
    ? serviceGroups.flatMap(group => group.services.map(service => ({
        '@type': 'Service',
        '@id': seoUrl(`/servicios#${service.id}`),
        url: seoUrl(`/servicios#${service.id}`),
        name: service.title,
        serviceType: service.title,
        description: `${service.problem} ${service.includes}`,
        provider: organization,
        areaServed: { '@type': 'Country', name: siteConfig.contact.country },
      })))
    : []

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': pageKey === 'about' ? 'AboutPage' : pageKey === 'contact' ? 'ContactPage' : 'WebPage',
        '@id': pageId,
        url: seoUrl(page.path),
        name: page.title,
        description: page.description,
        inLanguage: 'es-CO',
        isPartOf: { '@id': websiteId },
        publisher: organization,
        ...(services.length ? { mainEntity: services.map(service => ({ '@id': service['@id'] })) } : {}),
      },
      ...services,
    ],
  }
}

export function buildProjectStructuredData(project: PortfolioProject) {
  const path = `/proyectos/${project.slug}`
  const pageId = seoUrl(`${path}#webpage`)
  const caseId = seoUrl(`${path}#case-study`)
  const breadcrumbId = seoUrl(`${path}#breadcrumb`)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': pageId,
        url: seoUrl(path), name: project.seo.title, description: project.seo.description,
        inLanguage: 'es-CO', isPartOf: { '@id': websiteId }, publisher: organization,
        mainEntity: { '@id': caseId }, breadcrumb: { '@id': breadcrumbId },
      },
      {
        '@type': 'CreativeWork', '@id': caseId,
        name: `Caso ${project.name}`, url: seoUrl(path),
        description: project.shortDescription, genre: project.category,
        inLanguage: 'es-CO', author: organization, mainEntityOfPage: { '@id': pageId },
        ...(project.logo ? { image: seoUrl(project.logo.src.src) } : {}),
        about: { '@type': 'Thing', name: project.name },
      },
      {
        '@type': 'BreadcrumbList', '@id': breadcrumbId,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: seoUrl() },
          { '@type': 'ListItem', position: 2, name: 'Nosotros', item: seoUrl('/nosotros') },
          { '@type': 'ListItem', position: 3, name: project.name, item: seoUrl(path) },
        ],
      },
    ],
  }
}
