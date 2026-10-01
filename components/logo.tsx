import Image from 'next/image'
import conexaCodIceLogo from '@/assets/Logos/LogoConexacodIce.png'
import { cn } from '@/lib/utils'

type BrandWordmarkProps = {
  className?: string
  accessibleLabel?: boolean
}

type LogoProps = {
  className?: string
  decorative?: boolean
  variant?: 'full' | 'symbol-only'
}

/** The wordmark uses live HTML text; its X is built from CSS diagonal strokes. */
export function BrandWordmark({ className, accessibleLabel = false }: BrandWordmarkProps) {
  return (
    <span
      className={cn('brand-wordmark', className)}
      {...(accessibleLabel
        ? { role: 'img', 'aria-label': 'ConexaCod' }
        : { 'aria-hidden': true })}
    >
      <span className="brand-wordmark__white">Cone</span>
      <span className="brand-wordmark__x" />
      <span className="brand-wordmark__white">a</span>
      <span className="brand-wordmark__turquoise">Cod</span>
    </span>
  )
}

export function Logo({ className, decorative = false, variant = 'full' }: LogoProps) {
  return (
    <div
      className={cn('brand-lockup', className)}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': 'ConexaCod' })}
    >
      <span className="brand-lockup__symbol">
        <Image
          src={conexaCodIceLogo}
          alt=""
          sizes="(max-width: 640px) 2.25rem, 2.75rem"
          className="size-full object-contain"
        />
      </span>
      {variant === 'full' ? <BrandWordmark /> : null}
    </div>
  )
}
