'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type SetStateAction,
} from 'react'
import {
  BarChart3,
  Cog,
  Database,
  Link2,
  Network,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PortalNode = {
  id: string
  icon: LucideIcon
  label: string
  description: string
  x: number
  y: number
}

type CrystalColumnProps = {
  x: number
  y: number
  width: number
  height: number
  rotate?: number
  opacity?: number
  variant?: 'light' | 'dark' | 'ghost'
}

type PortalLayerProps = {
  introClass: string
  travelClass: string
  autoClass: string
  children: ReactNode
}

type PortalLabelProps = {
  node: PortalNode
  index: number
  side: 'left' | 'right'
  activeId: string | null
  dim: boolean
  setHoveredId: (id: string | null) => void
  setPinnedId: Dispatch<SetStateAction<string | null>>
}

const leftNodes: PortalNode[] = [
  {
    id: 'processes',
    icon: Network,
    label: 'PROCESOS',
    description: 'Flujos organizados y trazables.',
    x: 268,
    y: 300,
  },
  {
    id: 'automations',
    icon: Cog,
    label: 'AUTOMATIZACIONES',
    description: 'Activaciones fluidas.',
    x: 230,
    y: 366,
  },
  {
    id: 'reports',
    icon: BarChart3,
    label: 'REPORTES',
    description: 'Lecturas listas para decidir.',
    x: 258,
    y: 428,
  },
]

const rightNodes: PortalNode[] = [
  {
    id: 'clients',
    icon: Users,
    label: 'CLIENTES',
    description: 'Clientes siempre visibles.',
    x: 432,
    y: 300,
  },
  {
    id: 'data',
    icon: Database,
    label: 'DATOS',
    description: 'Datos conectados al instante.',
    x: 470,
    y: 366,
  },
  {
    id: 'integrations',
    icon: Link2,
    label: 'INTEGRACIONES',
    description: 'Sistemas integrados.',
    x: 442,
    y: 428,
  },
]

const allNodes = [...leftNodes, ...rightNodes]

function PortalLayer({
  introClass,
  travelClass,
  autoClass,
  children,
}: PortalLayerProps) {
  return (
    <div className={cn('ks-portal-layer', introClass)}>
      <div className={cn('ks-portal-layer-travel', travelClass)}>
        <div className={cn('ks-portal-layer-auto', autoClass)}>{children}</div>
      </div>
    </div>
  )
}

function PortalSvg({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 700 620"
      className={cn('h-full w-full overflow-visible', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="crystalFill" x1="0.14" y1="0.98" x2="0.86" y2="0.08">
          <stop offset="0" stopColor="#0d2232" stopOpacity="0.44" />
          <stop offset="0.48" stopColor="#53eff8" stopOpacity="0.46" />
          <stop offset="1" stopColor="#f5ffff" stopOpacity="0.92" />
        </linearGradient>
        <linearGradient id="crystalGhostFill" x1="0.14" y1="1" x2="0.9" y2="0.04">
          <stop offset="0" stopColor="#07131c" stopOpacity="0.2" />
          <stop offset="0.55" stopColor="#41eaf6" stopOpacity="0.24" />
          <stop offset="1" stopColor="#dcffff" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient id="crystalDarkFill" x1="0.08" y1="1" x2="0.88" y2="0.02">
          <stop offset="0" stopColor="#051019" stopOpacity="0.96" />
          <stop offset="0.52" stopColor="#103043" stopOpacity="0.9" />
          <stop offset="1" stopColor="#7ffaff" stopOpacity="0.58" />
        </linearGradient>
        <linearGradient id="facetGlow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#f0ffff" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#83fbff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#3bf0ff" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="platformStroke" x1="90" y1="500" x2="610" y2="500">
          <stop offset="0" stopColor="#2af0ff" stopOpacity="0" />
          <stop offset="0.26" stopColor="#74fcff" stopOpacity="0.86" />
          <stop offset="0.52" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.78" stopColor="#74fcff" stopOpacity="0.86" />
          <stop offset="1" stopColor="#2af0ff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="baseGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9fffff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#46efff" stopOpacity="0.48" />
          <stop offset="1" stopColor="#46efff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ambientGlow" cx="0.5" cy="0.45" r="0.62">
          <stop offset="0" stopColor="#67fbff" stopOpacity="0.42" />
          <stop offset="0.55" stopColor="#20d8f0" stopOpacity="0.18" />
          <stop offset="1" stopColor="#0a1118" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="6" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="coreGlow" x="-42%" y="-42%" width="184%" height="184%">
          <feGaussianBlur stdDeviation="12" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {children}
    </svg>
  )
}

function CrystalColumn({
  x,
  y,
  width,
  height,
  rotate = 0,
  opacity = 1,
  variant = 'light',
}: CrystalColumnProps) {
  const fill =
    variant === 'dark'
      ? 'url(#crystalDarkFill)'
      : variant === 'ghost'
        ? 'url(#crystalGhostFill)'
        : 'url(#crystalFill)'

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate} ${width / 2} ${height})`}
      opacity={opacity}
      style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
    >
      <ellipse
        cx={width / 2}
        cy={height + 4}
        rx={width * 0.36}
        ry={width * 0.08}
        fill="url(#baseGlow)"
        opacity={variant === 'ghost' ? 0.16 : 0.4}
      />
      <path
        d={`M ${width * 0.5} 0 L ${width * 0.83} ${height * 0.16} L ${width * 0.98} ${height} L ${width * 0.52} ${height * 0.9} L ${width * 0.48} ${height * 0.9} L ${width * 0.02} ${height} L ${width * 0.17} ${height * 0.16} Z`}
        fill={fill}
        stroke="#d8ffff"
        strokeOpacity={variant === 'dark' ? 0.52 : 0.78}
        strokeWidth="2"
        filter="url(#softGlow)"
      />
      <path
        d={`M ${width * 0.5} ${height * 0.06} L ${width * 0.64} ${height * 0.18} L ${width * 0.56} ${height * 0.88} L ${width * 0.44} ${height * 0.88} L ${width * 0.36} ${height * 0.18} Z`}
        fill="url(#facetGlow)"
        opacity={variant === 'dark' ? 0.56 : 0.9}
      />
      <path
        d={`M ${width * 0.5} ${height * 0.04} L ${width * 0.2} ${height * 0.76} L ${width * 0.48} ${height * 0.9}`}
        stroke="#aefeff"
        strokeOpacity={variant === 'dark' ? 0.38 : 0.56}
        strokeWidth="1.6"
      />
      <path
        d={`M ${width * 0.5} ${height * 0.04} L ${width * 0.8} ${height * 0.76} L ${width * 0.52} ${height * 0.9}`}
        stroke="#f7ffff"
        strokeOpacity={variant === 'dark' ? 0.3 : 0.52}
        strokeWidth="1.6"
      />
      <path
        d={`M ${width * 0.18} ${height * 0.16} L ${width * 0.5} ${height * 0.54} L ${width * 0.82} ${height * 0.16}`}
        stroke="#66fbff"
        strokeOpacity={variant === 'dark' ? 0.24 : 0.42}
        strokeWidth="1.2"
      />
    </g>
  )
}

function PortalLabel({
  node,
  index,
  side,
  activeId,
  dim,
  setHoveredId,
  setPinnedId,
}: PortalLabelProps) {
  const Icon = node.icon
  const active = activeId === node.id

  return (
    <button
      type="button"
      aria-label={`Conexión ${node.label}`}
      aria-pressed={active}
      onMouseEnter={() => setHoveredId(node.id)}
      onMouseLeave={() => setHoveredId(null)}
      onFocus={() => setHoveredId(node.id)}
      onBlur={() => setHoveredId(null)}
      onClick={() =>
        setPinnedId((current) => (current === node.id ? null : node.id))
      }
      className={cn(
        'ks-portal-label group rounded-sm text-left outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-primary/60',
        side === 'right' && 'justify-end text-right',
        dim && !active ? 'opacity-35' : 'opacity-100',
        active && 'is-active',
      )}
      style={
        {
          ['--label-delay' as string]: `${1120 + index * 110}ms`,
        } as CSSProperties
      }
    >
      {side === 'right' && (
        <>
          <span
            className={cn(
              'ks-portal-label-dot',
              active && 'shadow-[0_0_16px_var(--primary)]',
            )}
          />
          <span className="ks-portal-label-line ks-portal-label-line-right" />
        </>
      )}
      {side === 'left' && <Icon className="size-[1.125rem] shrink-0 text-primary" />}
      <span className="min-w-0">
        <span className="block text-[0.67rem] font-semibold tracking-[0.18em] text-foreground/90">
          {node.label}
        </span>
        <span className={cn('ks-portal-label-copy', active && 'is-active')}>
          {node.description}
        </span>
      </span>
      {side === 'right' && <Icon className="size-[1.125rem] shrink-0 text-primary" />}
      {side === 'left' && (
        <>
          <span className="ks-portal-label-line ks-portal-label-line-left" />
          <span
            className={cn(
              'ks-portal-label-dot',
              active && 'shadow-[0_0_16px_var(--primary)]',
            )}
          />
        </>
      )}
    </button>
  )
}

export function PortalHeroVisual() {
  const sceneRef = useRef<HTMLDivElement | null>(null)
  const motionFrameRef = useRef<number | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [pointerEnabled, setPointerEnabled] = useState(false)
  const [documentHidden, setDocumentHidden] = useState(false)
  const [inView, setInView] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pinnedId, setPinnedId] = useState<string | null>(null)
  const [autoIndex, setAutoIndex] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    const pointerQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (min-width: 1024px)',
    )

    const syncMedia = () => {
      setReduced(reducedMotionQuery.matches)
      setPointerEnabled(pointerQuery.matches && !reducedMotionQuery.matches)
    }

    syncMedia()
    reducedMotionQuery.addEventListener('change', syncMedia)
    pointerQuery.addEventListener('change', syncMedia)

    return () => {
      reducedMotionQuery.removeEventListener('change', syncMedia)
      pointerQuery.removeEventListener('change', syncMedia)
    }
  }, [])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    sectionRef.current = scene.closest('section') as HTMLElement | null

    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.2,
        rootMargin: '0px 0px -12% 0px',
      },
    )

    observer.observe(scene)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateVisibility = () => setDocumentHidden(document.hidden)
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    if (visible) return
    if (!inView && !reduced) return

    const timeout = window.setTimeout(() => setVisible(true), reduced ? 0 : 120)
    return () => window.clearTimeout(timeout)
  }, [inView, reduced, visible])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const writeParallax = (x: number, y: number) => {
      scene.style.setProperty('--ks-tilt-x', `${(-y * 2).toFixed(3)}deg`)
      scene.style.setProperty('--ks-tilt-y', `${(x * 2).toFixed(3)}deg`)
      scene.style.setProperty('--ks-back-x', `${(-x * 4).toFixed(2)}px`)
      scene.style.setProperty('--ks-back-y', `${(-y * 2.5).toFixed(2)}px`)
      scene.style.setProperty('--ks-mid-x', `${(x * 5.5).toFixed(2)}px`)
      scene.style.setProperty('--ks-mid-y', `${(y * 3.5).toFixed(2)}px`)
      scene.style.setProperty('--ks-front-x', `${(x * 9).toFixed(2)}px`)
      scene.style.setProperty('--ks-front-y', `${(y * 6).toFixed(2)}px`)
      scene.style.setProperty('--ks-core-x', `${(x * 7).toFixed(2)}px`)
      scene.style.setProperty('--ks-core-y', `${(y * 4).toFixed(2)}px`)
      scene.style.setProperty('--ks-reflection-x', `${(x * 11).toFixed(2)}px`)
      scene.style.setProperty('--ks-reflection-y', `${(y * 5).toFixed(2)}px`)
    }

    const stopLoop = () => {
      if (motionFrameRef.current !== null) {
        window.cancelAnimationFrame(motionFrameRef.current)
        motionFrameRef.current = null
      }
    }

    if (reduced || !pointerEnabled) {
      targetRef.current = { x: 0, y: 0 }
      currentRef.current = { x: 0, y: 0 }
      writeParallax(0, 0)
      stopLoop()
      return
    }

    return stopLoop
  }, [pointerEnabled, reduced])

  useEffect(() => {
    const scene = sceneRef.current
    const section = sectionRef.current
    if (!scene || !section || reduced) return

    const syncScroll = () => {
      const rect = section.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / 240))

      scene.style.setProperty('--ks-scroll-y', `${(-progress * 18).toFixed(2)}px`)
      scene.style.setProperty(
        '--ks-open-back',
        `${(progress * 10).toFixed(2)}px`,
      )
      scene.style.setProperty(
        '--ks-open-front',
        `${(progress * 14).toFixed(2)}px`,
      )
      scene.style.setProperty('--ks-open-core', `${(progress * 6).toFixed(2)}px`)
      scene.style.setProperty(
        '--ks-shell-brightness',
        `${(1 - progress * 0.12).toFixed(3)}`,
      )
      scene.style.setProperty(
        '--ks-shell-opacity',
        `${(1 - progress * 0.08).toFixed(3)}`,
      )
      scene.style.setProperty(
        '--ks-aura-opacity',
        `${(0.84 - progress * 0.2).toFixed(3)}`,
      )
    }

    syncScroll()
    window.addEventListener('scroll', syncScroll, { passive: true })
    window.addEventListener('resize', syncScroll)

    return () => {
      window.removeEventListener('scroll', syncScroll)
      window.removeEventListener('resize', syncScroll)
    }
  }, [reduced])

  useEffect(() => {
    if (!reduced) return
    const scene = sceneRef.current
    if (!scene) return

    scene.style.setProperty('--ks-scroll-y', '0px')
    scene.style.setProperty('--ks-open-back', '0px')
    scene.style.setProperty('--ks-open-front', '0px')
    scene.style.setProperty('--ks-open-core', '0px')
    scene.style.setProperty('--ks-shell-brightness', '1')
    scene.style.setProperty('--ks-shell-opacity', '1')
    scene.style.setProperty('--ks-aura-opacity', '0.84')
  }, [reduced])

  useEffect(() => {
    if (reduced || documentHidden || !inView) return

    const interval = window.setInterval(() => {
      setAutoIndex((current) => (current + 1) % allNodes.length)
    }, 2800)

    return () => window.clearInterval(interval)
  }, [documentHidden, inView, reduced])

  const activeId =
    hoveredId ?? pinnedId ?? (reduced ? null : allNodes[autoIndex]?.id ?? null)

  const dim = activeId !== null
  const motionState = documentHidden || !inView ? 'paused' : 'running'

  function queueParallax() {
    if (motionFrameRef.current !== null) return

    motionFrameRef.current = window.requestAnimationFrame(() => {
      motionFrameRef.current = null

      const scene = sceneRef.current
      if (!scene || reduced || !pointerEnabled || document.hidden) return

      const current = currentRef.current
      const target = targetRef.current

      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08

      scene.style.setProperty('--ks-tilt-x', `${(-current.y * 2).toFixed(3)}deg`)
      scene.style.setProperty('--ks-tilt-y', `${(current.x * 2).toFixed(3)}deg`)
      scene.style.setProperty('--ks-back-x', `${(-current.x * 4).toFixed(2)}px`)
      scene.style.setProperty('--ks-back-y', `${(-current.y * 2.5).toFixed(2)}px`)
      scene.style.setProperty('--ks-mid-x', `${(current.x * 5.5).toFixed(2)}px`)
      scene.style.setProperty('--ks-mid-y', `${(current.y * 3.5).toFixed(2)}px`)
      scene.style.setProperty('--ks-front-x', `${(current.x * 9).toFixed(2)}px`)
      scene.style.setProperty('--ks-front-y', `${(current.y * 6).toFixed(2)}px`)
      scene.style.setProperty('--ks-core-x', `${(current.x * 7).toFixed(2)}px`)
      scene.style.setProperty('--ks-core-y', `${(current.y * 4).toFixed(2)}px`)
      scene.style.setProperty(
        '--ks-reflection-x',
        `${(current.x * 11).toFixed(2)}px`,
      )
      scene.style.setProperty(
        '--ks-reflection-y',
        `${(current.y * 5).toFixed(2)}px`,
      )

      const settled =
        Math.abs(target.x - current.x) < 0.002 &&
        Math.abs(target.y - current.y) < 0.002

      if (!settled) {
        queueParallax()
      }
    })
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointerEnabled || reduced || event.pointerType !== 'mouse') return

    const scene = sceneRef.current
    if (!scene) return

    const rect = scene.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    targetRef.current = {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    }

    queueParallax()
  }

  function resetPointer() {
    targetRef.current = { x: 0, y: 0 }
    queueParallax()
  }

  return (
    <div className="relative">
      <div
        ref={sceneRef}
        data-visible={visible ? 'true' : 'false'}
        data-motion-state={motionState}
        data-reduced={reduced ? 'true' : 'false'}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        className="ks-portal-scene relative mx-auto flex max-w-[42rem] items-center justify-center [perspective:1600px]"
      >
        <div
          aria-hidden="true"
          className="ks-portal-ambient pointer-events-none absolute inset-0 -z-20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[14%] bottom-[6%] -z-10 h-[16%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_28%,transparent)_0%,transparent_72%)] blur-3xl"
        />

        <div className="ks-portal-shell relative aspect-[1.05/1] w-full max-w-[40rem] [transform-style:preserve-3d]">
          <PortalLayer
            introClass="ks-portal-aura-intro"
            travelClass="ks-portal-aura-travel"
            autoClass="ks-portal-aura-auto"
          >
            <PortalSvg>
              <rect x="120" y="74" width="460" height="396" fill="url(#ambientGlow)" />
              <ellipse
                className="ks-portal-orbit"
                cx="350"
                cy="350"
                rx="228"
                ry="78"
                stroke="#69fbff"
                strokeOpacity="0.28"
                strokeWidth="1.6"
              />
              <ellipse
                className="ks-portal-orbit reverse"
                cx="350"
                cy="356"
                rx="262"
                ry="92"
                stroke="#4ef1ff"
                strokeOpacity="0.16"
                strokeWidth="1.2"
              />
              <g fill="#c7ffff">
                <circle cx="162" cy="280" r="4" fillOpacity="0.22" />
                <circle cx="552" cy="252" r="6" fillOpacity="0.18" />
                <circle cx="136" cy="402" r="7" fillOpacity="0.12" />
                <circle cx="586" cy="394" r="5" fillOpacity="0.16" />
                <circle cx="214" cy="168" r="4" fillOpacity="0.14" />
                <circle cx="506" cy="198" r="5" fillOpacity="0.18" />
              </g>
            </PortalSvg>
          </PortalLayer>

          <PortalLayer
            introClass="ks-portal-base-intro"
            travelClass="ks-portal-base-travel"
            autoClass="ks-portal-base-auto"
          >
            <PortalSvg>
              <ellipse
                cx="350"
                cy="504"
                rx="270"
                ry="60"
                stroke="url(#platformStroke)"
                strokeWidth="3.5"
                filter="url(#softGlow)"
              />
              <ellipse
                cx="350"
                cy="503"
                rx="214"
                ry="40"
                stroke="#74fdff"
                strokeOpacity="0.72"
                strokeWidth="2.2"
              />
              <ellipse
                cx="350"
                cy="501"
                rx="122"
                ry="24"
                stroke="#dfffff"
                strokeOpacity="0.82"
                strokeWidth="2"
              />
              <path
                d="M88 504 H182 L226 486 H474 L518 504 H612"
                stroke="#66f9ff"
                strokeOpacity="0.36"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M350 618 L350 522 M350 522 L320 504 M350 522 L380 504 M350 580 L316 548 M350 580 L384 548"
                stroke="#73fbff"
                strokeOpacity="0.52"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M138 516 L186 516 M514 516 L562 516 M248 482 L248 504 M452 482 L452 504"
                stroke="#dfffff"
                strokeOpacity="0.28"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </PortalSvg>
          </PortalLayer>

          <PortalLayer
            introClass="ks-portal-back-intro"
            travelClass="ks-portal-back-travel"
            autoClass="ks-portal-back-auto"
          >
            <PortalSvg>
              <CrystalColumn
                x={108}
                y={334}
                width={60}
                height={138}
                rotate={-6}
                opacity={0.88}
                variant="ghost"
              />
              <CrystalColumn
                x={166}
                y={246}
                width={70}
                height={220}
                rotate={-4}
                opacity={0.9}
                variant="ghost"
              />
              <CrystalColumn x={266} y={104} width={110} height={364} opacity={0.98} />
              <CrystalColumn
                x={464}
                y={246}
                width={70}
                height={220}
                rotate={4}
                opacity={0.9}
                variant="ghost"
              />
              <CrystalColumn
                x={532}
                y={334}
                width={60}
                height={138}
                rotate={6}
                opacity={0.88}
                variant="ghost"
              />
            </PortalSvg>
          </PortalLayer>

          <PortalLayer
            introClass="ks-portal-mid-intro"
            travelClass="ks-portal-mid-travel"
            autoClass="ks-portal-mid-auto"
          >
            <PortalSvg>
              <CrystalColumn
                x={188}
                y={176}
                width={82}
                height={292}
                rotate={-3}
                opacity={0.96}
              />
              <CrystalColumn
                x={432}
                y={176}
                width={82}
                height={292}
                rotate={3}
                opacity={0.96}
              />
              <CrystalColumn
                x={236}
                y={260}
                width={50}
                height={180}
                rotate={-3}
                opacity={0.8}
                variant="ghost"
              />
              <CrystalColumn
                x={414}
                y={260}
                width={50}
                height={180}
                rotate={3}
                opacity={0.8}
                variant="ghost"
              />
              <CrystalColumn
                x={296}
                y={300}
                width={36}
                height={126}
                rotate={-2}
                opacity={0.72}
                variant="ghost"
              />
              <CrystalColumn
                x={368}
                y={300}
                width={36}
                height={126}
                rotate={2}
                opacity={0.72}
                variant="ghost"
              />
            </PortalSvg>
          </PortalLayer>

          <PortalLayer
            introClass="ks-portal-front-intro"
            travelClass="ks-portal-front-travel"
            autoClass="ks-portal-front-auto"
          >
            <PortalSvg>
              <CrystalColumn
                x={210}
                y={316}
                width={82}
                height={176}
                rotate={-4}
                opacity={0.96}
                variant="dark"
              />
              <CrystalColumn
                x={282}
                y={284}
                width={56}
                height={214}
                rotate={-2}
                opacity={0.95}
                variant="dark"
              />
              <CrystalColumn
                x={362}
                y={284}
                width={56}
                height={214}
                rotate={2}
                opacity={0.95}
                variant="dark"
              />
              <CrystalColumn
                x={408}
                y={316}
                width={82}
                height={176}
                rotate={4}
                opacity={0.96}
                variant="dark"
              />
            </PortalSvg>
          </PortalLayer>

          <PortalLayer
            introClass="ks-portal-core-intro"
            travelClass="ks-portal-core-travel"
            autoClass="ks-portal-core-auto"
          >
            <PortalSvg>
              <g filter="url(#coreGlow)">
                <circle cx="350" cy="294" r="88" fill="#5efaff" fillOpacity="0.14" />
                <circle cx="350" cy="294" r="52" fill="#dfffff" fillOpacity="0.12" />
              </g>
              <g className="ks-portal-core-badge" filter="url(#coreGlow)">
                <path
                  d="M350 224 L404 254 V316 L350 346 L296 316 V254 Z"
                  fill="#072532"
                  fillOpacity="0.92"
                  stroke="#cbffff"
                  strokeOpacity="0.9"
                  strokeWidth="3.2"
                />
                <path
                  d="M350 238 L390 260 V310 L350 332 L310 310 V260 Z"
                  fill="#0f3145"
                  fillOpacity="0.64"
                  stroke="#62f8ff"
                  strokeOpacity="0.66"
                  strokeWidth="1.4"
                />
                <text
                  x="350"
                  y="302"
                  textAnchor="middle"
                  fontSize="54"
                  fontWeight="700"
                  fill="#f5ffff"
                  letterSpacing="-2"
                >
                  KS
                </text>
              </g>
              <g className="ks-portal-network">
                {allNodes.map((node) => {
                  const active = activeId === node.id
                  const controlX = node.x < 350 ? 292 : 408
                  const pathOpacity = active ? 0.92 : activeId ? 0.2 : 0.42

                  return (
                    <g key={node.id}>
                      <path
                        className={cn(active && 'is-active')}
                        d={`M 350 294 C ${controlX} 300 ${node.x} ${node.y - 26} ${node.x} ${node.y}`}
                        stroke="#78fcff"
                        strokeOpacity={pathOpacity}
                        strokeWidth={active ? 2.8 : 1.5}
                        strokeDasharray="5 7"
                        strokeLinecap="round"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={active ? 9.5 : 6}
                        fill="#aefeff"
                        fillOpacity={active ? 0.94 : activeId ? 0.32 : 0.54}
                        filter="url(#softGlow)"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={active ? 18 : 11}
                        stroke="#7df9ff"
                        strokeOpacity={active ? 0.54 : activeId ? 0.1 : 0.22}
                        strokeWidth="1.4"
                      />
                    </g>
                  )
                })}
              </g>
            </PortalSvg>
          </PortalLayer>

          <PortalLayer
            introClass="ks-portal-reflections-intro"
            travelClass="ks-portal-reflections-travel"
            autoClass="ks-portal-reflections-auto"
          >
            <div className="pointer-events-none absolute inset-[12%] overflow-hidden rounded-[44%]">
              <div className="ks-portal-scanbeam absolute inset-y-[6%] left-[42%] w-[18%] -skew-x-12 rounded-full bg-[linear-gradient(180deg,transparent_0%,rgba(220,255,255,0.94)_30%,rgba(103,251,255,0.42)_60%,transparent_100%)] blur-[14px]" />
            </div>
            <PortalSvg>
              <path
                className="ks-portal-sparkline"
                d="M124 504 C182 470 262 450 350 446 C438 450 518 470 576 504"
                stroke="#dfffff"
                strokeOpacity="0.42"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                className="ks-portal-sparkline delayed"
                d="M170 364 C248 320 300 298 350 294 C400 298 452 320 530 364"
                stroke="#6efbff"
                strokeOpacity="0.3"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </PortalSvg>
          </PortalLayer>
        </div>

        <div className="pointer-events-auto absolute inset-y-0 left-0 hidden flex-col justify-center gap-9 pr-5 lg:flex">
          {leftNodes.map((node, index) => (
            <PortalLabel
              key={node.id}
              node={node}
              index={index}
              side="left"
              activeId={activeId}
              dim={dim}
              setHoveredId={setHoveredId}
              setPinnedId={setPinnedId}
            />
          ))}
        </div>

        <div className="pointer-events-auto absolute inset-y-0 right-0 hidden flex-col justify-center gap-9 pl-5 lg:flex">
          {rightNodes.map((node, index) => (
            <PortalLabel
              key={node.id}
              node={node}
              index={index}
              side="right"
              activeId={activeId}
              dim={dim}
              setHoveredId={setHoveredId}
              setPinnedId={setPinnedId}
            />
          ))}
        </div>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
        {allNodes.map(({ icon: Icon, id, label }) => {
          const active = activeId === id

          return (
            <li key={id}>
              <button
                type="button"
                onClick={() =>
                  setPinnedId((current) => (current === id ? null : id))
                }
                className={cn(
                  'ks-portal-mobile-label flex w-full items-center gap-2 rounded-xl border border-border/70 bg-background/60 px-3 py-3 text-left backdrop-blur-sm transition-colors',
                  active &&
                    'border-primary/70 bg-primary/10 shadow-[0_0_24px_-14px_var(--primary)]',
                )}
              >
                <Icon className="size-4 shrink-0 text-primary" />
                <span className="text-[0.64rem] font-semibold tracking-[0.12em] text-foreground/90">
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
