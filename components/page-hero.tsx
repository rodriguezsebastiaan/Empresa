import type { ReactNode } from 'react'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

type PageHeroProps = {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
  aside?: ReactNode
  className?: string
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  className,
}: PageHeroProps) {
  return (
    <section className={cn('relative overflow-hidden pt-32', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem]"
      >
        <div className="absolute left-1/2 top-[-8rem] h-[26rem] w-[min(88vw,68rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_18%,transparent)_0%,transparent_72%)] blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
        <div className="grid gap-12 border-b border-border/60 pb-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:items-end">
          <div className="max-w-3xl">
            <Reveal
              as="p"
              variant="fade"
              className="mb-6 text-xs font-semibold tracking-[0.3em] text-primary"
            >
              {eyebrow}
            </Reveal>
            <Reveal
              as="h1"
              delay={80}
              className="text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {title}
            </Reveal>
            <Reveal
              as="p"
              delay={160}
              className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground"
            >
              {description}
            </Reveal>
            {actions ? (
              <Reveal
                delay={240}
                variant="fade"
                className="mt-10 flex flex-wrap gap-4"
              >
                {actions}
              </Reveal>
            ) : null}
          </div>

          {aside ? (
            <Reveal
              delay={220}
              variant="fade"
              className="rounded-2xl border border-border/70 bg-background/50 p-6 backdrop-blur-sm"
            >
              {aside}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}
