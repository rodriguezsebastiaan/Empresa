import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function PrivacyConsentCopy() {
  return (
    <>
      Acepto el tratamiento de mis datos conforme a la{' '}
      <Link
        href={siteConfig.routes.privacy}
        className="text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
      >
        política de privacidad
      </Link>
      .
    </>
  )
}
