import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type SiteActionProps = {
  href: string
  children: React.ReactNode
  className?: string
  icon?: LucideIcon
  variant?: 'primary' | 'secondary' | 'text'
  external?: boolean
}

const variants = {
  primary:
    'group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-xs font-semibold tracking-widest text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] outline-none transition-all duration-300 hover:shadow-[0_0_30px_-6px_var(--primary)] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  secondary:
    'group inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-6 py-3.5 text-xs font-semibold tracking-widest text-foreground outline-none transition-colors duration-300 hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  text:
    'group inline-flex items-center gap-2 text-sm text-primary outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary/60',
} as const

export function SiteAction({
  href,
  children,
  className,
  icon: Icon = ArrowRight,
  variant = 'primary',
  external = false,
}: SiteActionProps) {
  const content = (
    <>
      {children}
      <Icon className="ks-arrow size-4" />
    </>
  )

  const classes = cn(variants[variant], className)

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
