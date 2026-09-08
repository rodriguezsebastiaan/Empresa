import type { ReactNode } from 'react'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
  actions?: ReactNode
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = 'left',
  actions,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <Reveal
          as="p"
          variant="fade"
          className="mb-5 text-xs font-semibold tracking-[0.3em] text-primary"
        >
          {eyebrow}
        </Reveal>
      ) : null}
      <Reveal
        as="h2"
        delay={80}
        className="text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl"
      >
        {title}
      </Reveal>
      {description ? (
        <Reveal
          as="p"
          delay={160}
          className="mt-5 text-pretty leading-relaxed text-muted-foreground"
        >
          {description}
        </Reveal>
      ) : null}
      {actions ? (
        <Reveal delay={240} variant="fade" className="mt-8 flex flex-wrap gap-4">
          {actions}
        </Reveal>
      ) : null}
    </div>
  )
}
