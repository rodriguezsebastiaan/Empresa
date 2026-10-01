'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealVariant = 'up' | 'fade' | 'left' | 'clip'

interface RevealProps {
  children: ReactNode
  /** Rendered wrapper element. Defaults to a div. */
  as?: ElementType
  /** Reveal style. Maps to the [data-reveal] CSS in globals.css. */
  variant?: RevealVariant
  /** Stagger delay in milliseconds. */
  delay?: number
  className?: string
  id?: string
  /** Fraction of the element that must be visible before revealing. */
  threshold?: number
}

/**
 * Lightweight scroll reveal wrapper built on IntersectionObserver.
 * Animates once, then disconnects. All motion is defined in CSS so it is
 * automatically neutralized under prefers-reduced-motion.
 */
export function Reveal({
  children,
  as,
  variant = 'up',
  delay = 0,
  className,
  id,
  threshold = 0.2,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <Tag
      id={id}
      ref={ref}
      data-reveal={variant === 'up' ? '' : variant}
      data-visible={visible ? 'true' : 'false'}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  )
}
