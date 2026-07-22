function stripPhone(value: string) {
  return value.replace(/\D/g, '')
}

export function buildAdminMailto(email: string, subject?: string) {
  const params = new URLSearchParams()

  if (subject) {
    params.set('subject', subject)
  }

  const query = params.toString()
  return `mailto:${email}${query ? `?${query}` : ''}`
}

export function buildAdminPhone(phone: string) {
  return `tel:${stripPhone(phone)}`
}

export function buildAdminWhatsApp(phone: string, text?: string) {
  const number = stripPhone(phone)
  const params = new URLSearchParams()

  if (text) {
    params.set('text', text)
  }

  return `https://wa.me/${number}${params.toString() ? `?${params.toString()}` : ''}`
}

