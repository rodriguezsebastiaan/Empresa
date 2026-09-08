'use client'

import { MessageCircle } from 'lucide-react'
import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from 'react'
import { buildInstagramUrl, buildWhatsAppUrl } from '@/lib/site'

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38A5.86 5.86 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.38 5.86 5.86 0 0 0 1.38-2.12c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.38-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.4a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  )
}

type FloatingLink = {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

export function FloatingSocialButtons() {
  const [footerOffset, setFooterOffset] = useState(0)

  const links = useMemo<FloatingLink[]>(() => {
    const nextLinks: FloatingLink[] = []
    const whatsappUrl = buildWhatsAppUrl()
    const instagramUrl = buildInstagramUrl()

    if (whatsappUrl) {
      nextLinks.push({
        href: whatsappUrl,
        label: 'Abrir WhatsApp oficial de Konamy Systems',
        icon: MessageCircle,
      })
    }

    if (instagramUrl) {
      nextLinks.push({
        href: instagramUrl,
        label: 'Abrir Instagram oficial de Konamy Systems',
        icon: InstagramIcon,
      })
    }

    return nextLinks
  }, [])

  useEffect(() => {
    if (links.length === 0) {
      return
    }

    const footer = document.querySelector('footer')

    if (!footer) {
      return
    }

    let frame = 0

    const updateOffset = () => {
      const footerTop = footer.getBoundingClientRect().top
      const margin = window.innerWidth >= 768 ? 24 : 16
      const nextOffset = Math.max(0, window.innerHeight - footerTop + margin)
      setFooterOffset((current) => (current === nextOffset ? current : nextOffset))
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updateOffset)
    }

    updateOffset()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [links.length])

  if (links.length === 0) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-40 transition-transform duration-300 md:bottom-6 md:right-6"
      style={{ transform: `translateY(-${footerOffset}px)` }}
    >
      <div className="pointer-events-auto rounded-[1.75rem] border border-border/70 bg-background/72 p-2 shadow-[0_18px_60px_-30px_rgba(0,227,255,0.7)] backdrop-blur-xl">
        <div className="flex flex-col gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="group flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-background/55 text-foreground outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:size-13"
            >
              <Icon className="size-5 transition-transform duration-300 group-hover:scale-105" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
