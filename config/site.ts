function trimText(value?: string) {
  return value?.trim() ?? ''
}

function normalizeSiteUrl(value?: string) {
  const trimmed = trimText(value).replace(/\/$/, '')
  return trimmed || 'https://conexacod.com'
}

function normalizeExternalUrl(value?: string) {
  const trimmed = trimText(value)

  if (!trimmed) {
    return ''
  }

  try {
    const url = new URL(trimmed)
    if (!['https:', 'http:'].includes(url.protocol)) return ''
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
const domainIsPlaceholder = isPlaceholderSiteUrl(siteUrl)
const rawWhatsAppNumber = trimText(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
const whatsappDigits = rawWhatsAppNumber.replace(/\D/g, '')
const whatsappConfigured = whatsappDigits.length >= 8
const instagramUrl = normalizeExternalUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL)

const pages = {
  home: {
    path: routes.home,
    title: 'Desarrollo web y software en Manizales | ConexaCod',
    description:
      'Desde Manizales, desarrollamos sitios web, software a medida y aplicaciones web para empresas en Colombia. Conozca nuestros proyectos y soluciones.',
  },
  solutions: {
    path: routes.solutions,
    title: 'Digitalización de procesos empresariales | ConexaCod',
    description:
      'Organice información, conecte herramientas y reduzca tareas manuales. Explore soluciones digitales adaptadas a los procesos de su empresa.',
  },
  services: {
    path: routes.services,
    title: 'Software a medida, desarrollo web e integraciones | ConexaCod',
    description:
      'Explore desarrollo web, plataformas empresariales, software a medida, automatización e integraciones. Defina el alcance que necesita su operación.',
  },
  process: {
    path: routes.process,
    title: 'Cómo desarrollamos su solución digital | ConexaCod',
    description:
      'Conozca las siete etapas de ConexaCod: comprensión, diagnóstico, diseño, desarrollo, integración, implementación y mejora de su solución digital.',
  },
  about: {
    path: routes.about,
    title: 'ConexaCod: quiénes somos y qué hemos construido',
    description:
      'Conozca ConexaCod, nuestra base en Manizales y forma de trabajar. Explore cinco proyectos de desarrollo web, plataformas y comercio electrónico.',
  },
  contact: {
    path: routes.contact,
    title: 'Contacte a ConexaCod para su proyecto digital',
    description:
      'Cuéntenos qué necesita resolver su empresa. Contacte a ConexaCod desde Manizales o elija una asesoría virtual o un diagnóstico de procesos.',
  },
  advisory: {
    path: routes.advisory,
    title: 'Agende una asesoría sobre sus procesos | ConexaCod',
    description:
      'Solicite una asesoría virtual de 30 minutos para revisar su necesidad de software o automatización. Consulte los horarios disponibles en la agenda.',
  },
  diagnostics: {
    path: routes.diagnostics,
    title: 'Diagnóstico de procesos empresariales | ConexaCod',
    description:
      'Describa sus procesos, herramientas y tareas repetitivas en el diagnóstico guiado de ConexaCod. Comparta el contexto para definir el siguiente paso.',
  },
  privacy: {
    path: routes.privacy,
    title: 'Privacidad | ConexaCod',
    description:
      'Revise la versión provisional de la política de privacidad de ConexaCod y los datos pendientes de validación legal antes del despliegue final.',
    indexable: false,
  },
} as const

export type SitePageKey = keyof typeof pages

export const siteConfig = {
  name: 'ConexaCod',
  shortName: 'ConexaCod',
  slogan: 'Digitalizar para simplificar. Automatizar para crecer.',
  description: pages.home.description,
  url: siteUrl,
  domainIsPlaceholder,
  routes,
  pages,
  seo: {
    defaultTitle: pages.home.title,
    defaultDescription: pages.home.description,
    siteName: 'ConexaCod',
    locale: 'es_CO',
    twitterCard: 'summary_large_image' as const,
    openGraphImagePath: '/hero-monument-conexacod.png',
    openGraphImageAlt: 'Ilustración principal de ConexaCod',
    faviconSvgPath: '/icon.svg',
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
      : 'PENDIENTE · número de WhatsApp',
    whatsappNumber: rawWhatsAppNumber,
    whatsappIsProvisional: !whatsappConfigured,
    whatsappMessage:
      'Hola, quiero conocer más sobre las soluciones de ConexaCod y recibir una asesoría.',
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
    copyrightNotice: `© ${new Date().getFullYear()} ConexaCod. Todos los derechos reservados.`,
    privacyPolicyNotice:
      'Este documento es una base provisional para la versión 1.0 y debe reemplazarse por el texto legal definitivo antes del despliegue público final.',
  },
  advisory: {
    durationMinutes: 30,
    modality: 'Asesoría virtual',
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
  { label: 'Nosotros', href: siteConfig.routes.about },
  { label: 'Soluciones', href: siteConfig.routes.solutions },
  { label: 'Servicios', href: siteConfig.routes.services },
  { label: 'Procesos', href: siteConfig.routes.process },
  { label: 'Contacto', href: siteConfig.routes.contact },
] as const
