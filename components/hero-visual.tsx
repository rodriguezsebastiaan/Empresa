'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  Network,
  Cog,
  BarChart3,
  Users,
  Database,
  Link2,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Node = { icon: LucideIcon; label: string }

const leftNodes: Node[] = [
  { icon: Network, label: 'PROCESOS' },
  { icon: Cog, label: 'AUTOMATIZACIONES' },
  { icon: BarChart3, label: 'REPORTES' },
]

const rightNodes: Node[] = [
  { icon: Users, label: 'CLIENTES' },
  { icon: Database, label: 'DATOS' },
  { icon: Link2, label: 'INTEGRACIONES' },
]

const allNodes = [...leftNodes, ...rightNodes]

export function HeroVisual() {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState<string | null>(null)
  const [reduced, setReduced] = useState(false)

  // Detect reduced-motion preference once.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Trigger connector-line draw-in shortly after mount.
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 350)
    return () => clearTimeout(t)
  }, [])

  // Gentle auto-cycle for touch devices (no hover) so the diagram feels alive.
  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(hover: none)').matches) return
    let i = 0
    const id = window.setInterval(() => {
      setActive(allNodes[i % allNodes.length].label)
      i += 1
    }, 2200)
    return () => window.clearInterval(id)
  }, [reduced])

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== 'mouse') return
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    // Keep motion very small to avoid discomfort.
    setTilt({ x: py * -4, y: px * 5 })
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 })
  }

  const dim = active !== null

  return (
    <div className="relative [perspective:1200px]">
      <div
        ref={frameRef}
        data-visible={visible ? 'true' : 'false'}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        className="relative mx-auto flex max-w-xl items-center justify-center transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Breathing ambient glow — feels emitted from the core */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_58%_60%_at_50%_50%,color-mix(in_oklch,var(--primary)_24%,transparent),transparent_70%)] blur-2xl',
            reduced ? 'scale-125 opacity-70' : 'ks-breathe',
          )}
        />

        <div className="ks-enter-fade relative aspect-square w-full [--enter-delay:900ms] [mask-image:radial-gradient(ellipse_62%_68%_at_50%_50%,#000_30%,transparent_74%)] [-webkit-mask-image:radial-gradient(ellipse_62%_68%_at_50%_50%,#000_30%,transparent_74%)]">
          <Image
            src="/hero-monument.png"
            alt="Sistema tecnológico central de Konamy Systems con núcleo KS y módulos conectados"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-contain mix-blend-lighten"
          />
        </div>

        {/* Left node labels with connector lines */}
        <div className="pointer-events-auto absolute inset-y-0 left-0 hidden flex-col justify-center gap-10 md:flex">
          {leftNodes.map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              type="button"
              onMouseEnter={() => setActive(label)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(label)}
              onBlur={() => setActive(null)}
              aria-label={`Conexión ${label}`}
              className={cn(
                'group flex items-center gap-3 rounded-sm text-left outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-primary/60',
                dim && active !== label ? 'opacity-40' : 'opacity-100',
              )}
            >
              <Icon className="size-5 shrink-0 text-primary" />
              <span className="text-[0.7rem] font-semibold tracking-[0.15em] text-foreground/90">
                {label}
              </span>
              <span
                className={cn(
                  'ks-line ks-line-left h-px w-8 bg-gradient-to-r from-primary/70 to-transparent lg:w-12',
                  active === label && 'from-primary shadow-[0_0_8px_var(--primary)]',
                )}
                style={{ ['--line-delay' as string]: `${500 + i * 160}ms` }}
              />
              <span
                className={cn(
                  'size-1.5 rounded-full bg-primary',
                  active === label
                    ? 'shadow-[0_0_12px_var(--primary)]'
                    : 'ks-node-pulse',
                )}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            </button>
          ))}
        </div>

        {/* Right node labels with connector lines */}
        <div className="pointer-events-auto absolute inset-y-0 right-0 hidden flex-col justify-center gap-10 text-right md:flex">
          {rightNodes.map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              type="button"
              onMouseEnter={() => setActive(label)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(label)}
              onBlur={() => setActive(null)}
              aria-label={`Conexión ${label}`}
              className={cn(
                'group flex items-center justify-end gap-3 rounded-sm text-right outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-primary/60',
                dim && active !== label ? 'opacity-40' : 'opacity-100',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full bg-primary',
                  active === label
                    ? 'shadow-[0_0_12px_var(--primary)]'
                    : 'ks-node-pulse',
                )}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
              <span
                className={cn(
                  'ks-line ks-line-right h-px w-8 bg-gradient-to-l from-primary/70 to-transparent lg:w-12',
                  active === label && 'from-primary shadow-[0_0_8px_var(--primary)]',
                )}
                style={{ ['--line-delay' as string]: `${500 + i * 160}ms` }}
              />
              <span className="text-[0.7rem] font-semibold tracking-[0.15em] text-foreground/90">
                {label}
              </span>
              <Icon className="size-5 shrink-0 text-primary" />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: labels reorganized as a clean grid below the visual */}
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 md:hidden">
        {allNodes.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-primary" />
            <span className="text-[0.65rem] font-semibold tracking-[0.12em] text-foreground/90">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
