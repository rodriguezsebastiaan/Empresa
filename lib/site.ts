import { siteConfig } from '@/config/site'

function stripNonDigits(value: string) {
  return value.replace(/\D/g, '')
}

export function hasConfiguredWhatsApp() {
  return (
    !siteConfig.contact.whatsappIsProvisional &&
    stripNonDigits(siteConfig.contact.whatsappNumber).length >= 8
  )
}

export function hasConfiguredEmail() {
  return !siteConfig.contact.emailIsProvisional && siteConfig.contact.email.length > 3
}

export function hasConfiguredPhone() {
  return !siteConfig.contact.phoneIsProvisional && stripNonDigits(siteConfig.contact.phoneE164).length >= 7
}

export function buildWhatsAppUrl(message = siteConfig.contact.whatsappMessage) {
  if (!hasConfiguredWhatsApp()) {
    return siteConfig.routes.contact
  }

  const number = stripNonDigits(siteConfig.contact.whatsappNumber)
  const params = new URLSearchParams({ text: message })
  return `https://wa.me/${number}?${params.toString()}`
}

export function buildMailtoUrl(subject?: string) {
  if (!hasConfiguredEmail()) {
    return siteConfig.routes.contact
  }

  const params = new URLSearchParams()

  if (subject) {
    params.set('subject', subject)
  }

  const query = params.toString()
  return `mailto:${siteConfig.contact.email}${query ? `?${query}` : ''}`
}

export function buildPhoneUrl() {
  if (!hasConfiguredPhone()) {
    return siteConfig.routes.contact
  }

  return `tel:${siteConfig.contact.phoneE164}`
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}

export function getRouteLabel(pathname: string) {
  const item = Object.values(siteConfig.routes).find((route) => route === pathname)
  return item ?? siteConfig.routes.home
}

export function isGoogleCalendarConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GOOGLE_CALENDAR_ID,
  )
}
