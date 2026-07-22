type SitemapChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

function trimText(value?: string) {
  return value?.trim() ?? ''
}

function normalizeSiteUrl(value?: string) {
  const trimmed = trimText(value).replace(/\/$/, '')
  return trimmed || 'https://pendiente-dominio-konamysystems.invalid'
}

function normalizeExternalUrl(value?: string) {
  const trimmed = trimText(value)

  if (!trimmed) {
    return ''
  }

  try {
    const url = new URL(trimmed)
    return url.toString()
  } catch {
    return ''
  }
}

function isPlaceholderSiteUrl(value?: string) {
  const trimmed = trimText(value)

  if (!trimmed) {
    return true
  }

  try {
    const hostname = new URL(normalizeSiteUrl(trimmed)).hostname.toLowerCase()

    return (
      hostname.endsWith('.invalid') ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('pendiente-') ||
      hostname.includes('placeholder')
    )
  } catch {
    return true
  }
}

const routes = {
  home: '/',
  solutions: '/soluciones',
  services: '/servicios',
  process: '/proceso',
  about: '/nosotros',
  contact: '/contacto',
  advisory: '/agendar-asesoria',
  diagnostics: '/diagnostico',
  privacy: '/privacidad',
} as const

const rawSiteUrl = trimText(process.env.NEXT_PUBLIC_SITE_URL)
const siteUrl = normalizeSiteUrl(rawSiteUrl)
const domainIsPlaceholder = isPlaceholderSiteUrl(rawSiteUrl)
const rawWhatsAppNumber = trimText(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
const whatsappDigits = rawWhatsAppNumber.replace(/\D/g, '')
const whatsappConfigured = whatsappDigits.length >= 8
const instagramUrl = normalizeExternalUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL)

const pages = {
  home: {
    path: routes.home,
    title: 'Konamy Systems | Transformamos problemas en soluciones digitales',
    description:
      'Konamy Systems diseña plataformas, sistemas y automatizaciones para organizar procesos, ahorrar tiempo y ayudar a las empresas a crecer.',
    changeFrequency: 'weekly' as SitemapChangeFrequency,
    priority: 1,
  },
  solutions: {
    path: routes.solutions,
    title: 'Soluciones | Konamy Systems',
    description:
      'Conozca los tipos de problemas empresariales que Konamy Systems puede resolver y cómo se construye una solución digital adaptada a cada empresa.',
    changeFrequency: 'monthly' as SitemapChangeFrequency,
    priority: 0.9,
  },
  services: {
    path: routes.services,
    title: 'Servicios | Konamy Systems',
    description:
      'Explore todos los servicios de Konamy Systems: diagnóstico, plataformas empresariales, automatización, integraciones, WhatsApp, reportes y evolución continua.',
    changeFrequency: 'monthly' as SitemapChangeFrequency,
    priority: 0.9,
  },
  process: {
    path: routes.process,
    title: 'Proceso | Konamy Systems',
    description:
      'Conozca cómo trabaja Konamy Systems: entendemos, diagnosticamos, diseñamos, desarrollamos, integramos, implementamos y mejoramos.',
    changeFrequency: 'monthly' as SitemapChangeFrequency,
    priority: 0.8,
  },
  about: {
    path: routes.about,
    title: 'Nosotros | Konamy Systems',
    description:
      'Conozca qué es Konamy Systems, su propósito, filosofía de trabajo, valores y enfoque para construir soluciones digitales empresariales preparadas para operar en Colombia y el mundo.',
    changeFrequency: 'monthly' as SitemapChangeFrequency,
    priority: 0.8,
  },
  contact: {
    path: routes.contact,
    title: 'Contacto | Konamy Systems',
    description:
      'Organice el contacto con Konamy Systems mediante asesoría, diagnóstico, WhatsApp, correo, teléfono y formulario validado en cliente y servidor.',
    changeFrequency: 'monthly' as SitemapChangeFrequency,
    priority: 0.8,
  },
  advisory: {
    path: routes.advisory,
    title: 'Agendar Asesoría | Konamy Systems',
    description:
      'Programe una asesoría inicial con Konamy Systems mediante disponibilidad, validación y arquitectura preparada para Google Calendar y Google Meet.',
    changeFrequency: 'weekly' as SitemapChangeFrequency,
    priority: 0.8,
  },
  diagnostics: {
    path: routes.diagnostics,
    title: 'Diagnóstico | Konamy Systems',
    description:
      'Explique el problema de su empresa mediante un diagnóstico multipaso con validación, progreso, resumen y preparación para automatizaciones futuras.',
    changeFrequency: 'weekly' as SitemapChangeFrequency,
    priority: 0.8,
  },
  privacy: {
    path: routes.privacy,
    title: 'Privacidad | Konamy Systems',
    description:
      'Revise la versión provisional de la política de privacidad de Konamy Systems y los datos pendientes de validación legal antes del despliegue final.',
    changeFrequency: 'yearly' as SitemapChangeFrequency,
    priority: 0.4,
  },
} as const

export type SitePageKey = keyof typeof pages

export const siteConfig = {
  name: 'Konamy Systems',
  shortName: 'Konamy',
  slogan: 'Digitalizar para simplificar. Automatizar para crecer.',
  description: pages.home.description,
  url: siteUrl,
  domainIsPlaceholder,
  routes,
  pages,
  seo: {
    defaultTitle: pages.home.title,
    defaultDescription: pages.home.description,
    siteName: 'Konamy Systems',
    locale: 'es_CO',
    twitterCard: 'summary_large_image' as const,
    openGraphImagePath: '/hero-monument.png',
    openGraphImageAlt: 'Ilustración principal de Konamy Systems',
    faviconIcoPath: '/favicon.ico',
    faviconSvgPath: '/icon.svg',
    faviconPngPath: '/icon-light-32x32.png',
    appleTouchIconPath: '/apple-icon.png',
    manifestPath: '/manifest.webmanifest',
  },
  contact: {
    email: 'pendiente-contacto@konamysystems.invalid',
    emailIsProvisional: true,
    phoneDisplay: 'PENDIENTE · número telefónico principal',
    phoneE164: '',
    phoneIsProvisional: true,
    whatsappDisplay: whatsappConfigured
      ? rawWhatsAppNumber
      : 'PENDIENTE · numero de WhatsApp',
    whatsappNumber: rawWhatsAppNumber,
    whatsappIsProvisional: !whatsappConfigured,
    whatsappMessage:
      'Hola, quiero conocer más sobre las soluciones de Konamy Systems y recibir una asesoría.',
    city: 'Manizales, Caldas',
    country: 'Colombia',
    coverage:
      'Una base local en Manizales. Soluciones digitales preparadas para operar en Colombia y el mundo.',
    schedule: 'Lunes a viernes · 8:30 a. m. a 5:30 p. m.',
  },
  legal: {
    privacyPolicyLabel: 'Política de privacidad',
    privacyPolicyVersionLabel: 'Versión provisional pendiente de validación legal.',
    privacyPolicyOwnerName: 'PENDIENTE · razón social o titular legal',
    privacyPolicyOwnerEmail: 'pendiente-legal@konamysystems.invalid',
    privacyPolicyOwnerAddress: 'PENDIENTE · dirección legal',
    privacyPolicyOwnerPhone: 'PENDIENTE · línea legal de contacto',
    privacyPolicyUpdatedAt: 'Pendiente de confirmación',
    copyrightNotice: `© ${new Date().getFullYear()} Konamy Systems. Todos los derechos reservados.`,
    privacyPolicyNotice:
      'Este documento es una base provisional para la versión 1.0 y debe reemplazarse por el texto legal definitivo antes del despliegue público final.',
  },
  advisory: {
    durationMinutes: 30,
    modality: 'Reunión virtual',
    timezone: 'America/Bogota',
    timezoneLabel: 'America/Bogota (GMT-5)',
    utcOffset: '-05:00',
    businessDays: [1, 2, 3, 4, 5],
    startTime: '08:30',
    endTime: '17:30',
    bufferMinutes: 15,
    minNoticeHours: 4,
    maxDaysAhead: 30,
    remindersMinutes: [1440, 60],
  },
  integrations: {
    contact: {
      destinationEmailEnv: 'CONTACT_DESTINATION_EMAIL',
      smtpEnv: [
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
        'SMTP_FROM_EMAIL',
        'SMTP_FROM_NAME',
        'SMTP_SECURE',
      ],
    },
    diagnostics: {
      destinationEmailEnv: 'DIAGNOSTIC_DESTINATION_EMAIL',
      smtpEnv: [
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
        'SMTP_FROM_EMAIL',
        'SMTP_FROM_NAME',
        'SMTP_SECURE',
      ],
      webhookEnv: ['N8N_DIAGNOSTIC_WEBHOOK_URL', 'N8N_DIAGNOSTIC_WEBHOOK_SECRET'],
    },
    advisory: {
      calendarEnv: [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_REFRESH_TOKEN',
        'GOOGLE_CALENDAR_ID',
        'NEXT_PUBLIC_SITE_URL',
      ],
    },
  },
  primaryCta: {
    label: 'Agendar asesoría',
    href: routes.advisory,
  },
  secondaryCta: {
    label: 'Solicitar diagnóstico',
    href: routes.diagnostics,
  },
  social: {
    whatsappLabel: 'WhatsApp',
    instagramLabel: 'Instagram',
    instagramUrl,
    instagramIsProvisional: !instagramUrl,
    emailLabel: 'Correo',
    phoneLabel: 'Teléfono',
  },
} as const

export const mainNav = [
  { label: 'Inicio', href: siteConfig.routes.home },
  { label: 'Soluciones', href: siteConfig.routes.solutions },
  { label: 'Servicios', href: siteConfig.routes.services },
  { label: 'Proceso', href: siteConfig.routes.process },
  { label: 'Nosotros', href: siteConfig.routes.about },
  { label: 'Contacto', href: siteConfig.routes.contact },
] as const
