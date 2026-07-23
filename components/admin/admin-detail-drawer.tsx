'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  Copy,
  Mail,
  MessageSquare,
  Phone,
  Video,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AdminDrawerAction = {
  label: string
  kind: 'link' | 'copy'
  value: string
  icon: 'calendar' | 'copy' | 'mail' | 'phone' | 'video' | 'whatsapp'
  external?: boolean
}

type AdminDrawerTab = {
  id: string
  label: string
  content: ReactNode
}

type AdminDetailDrawerProps = {
  open: boolean
  closeHref: string
  title: string
  subtitle?: string
  badges?: ReactNode
  actions?: AdminDrawerAction[]
  tabs: AdminDrawerTab[]
}

const iconMap = {
  calendar: CalendarDays,
  copy: Copy,
  mail: Mail,
  phone: Phone,
  video: Video,
  whatsapp: MessageSquare,
} as const

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('hidden') && element.offsetParent !== null)
}

export function AdminDetailDrawer({
  open,
  closeHref,
  title,
  subtitle,
  badges,
  actions = [],
  tabs,
}: AdminDetailDrawerProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '')
  const [copiedValue, setCopiedValue] = useState('')

  const currentTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab, tabs],
  )

  function closeDrawer() {
    router.replace(closeHref, { scroll: false })
  }

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        router.replace(closeHref, { scroll: false })
        return
      }

      if (event.key !== 'Tab' || !containerRef.current) {
        return
      }

      const focusable = getFocusableElements(containerRef.current)

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const current = document.activeElement as HTMLElement | null

      if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.cancelAnimationFrame(frame)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeHref, open, router])

  useEffect(() => {
    if (!copiedValue) {
      return
    }

    const timer = window.setTimeout(() => {
      setCopiedValue('')
    }, 1800)

    return () => {
      window.clearTimeout(timer)
    }
  }, [copiedValue])

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)
    } catch {}
  }

  if (!open || !currentTab) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Cerrar detalle"
        className="absolute inset-0 bg-background/72 backdrop-blur-[2px]"
        onClick={closeDrawer}
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-full flex-col border-l border-border/70 bg-[linear-gradient(180deg,oklch(0.13_0.02_240)_0%,oklch(0.16_0.03_222)_42%,oklch(0.19_0.03_228)_100%)] shadow-[-24px_0_60px_-28px_rgba(0,0,0,0.8)] sm:max-w-[38rem]"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-20 border-b border-border/70 bg-background/88 backdrop-blur-md">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.28em] text-primary">DETALLE</p>
                  <h2 className="mt-3 text-2xl font-semibold text-foreground">{title}</h2>
                  {subtitle ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
                  ) : null}
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Cerrar detalle"
                  onClick={closeDrawer}
                  className="inline-flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-background/50 text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                >
                  <X className="size-4" />
                </button>
              </div>

              {badges ? <div className="mt-4 flex flex-wrap gap-2">{badges}</div> : null}

              {actions.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {actions.map((action) => {
                    const Icon = iconMap[action.icon]
                    const copied = copiedValue === action.value

                    if (action.kind === 'link') {
                      return (
                        <Link
                          key={`${action.kind}-${action.label}`}
                          href={action.value}
                          target={action.external ? '_blank' : undefined}
                          rel={action.external ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                        >
                          <Icon className="size-4" />
                          {action.label}
                        </Link>
                      )
                    }

                    return (
                      <button
                        key={`${action.kind}-${action.label}`}
                        type="button"
                        onClick={() => copyToClipboard(action.value)}
                        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/45 px-3 py-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                      >
                        <Icon className="size-4" />
                        {copied ? 'COPIADO' : action.label}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>

            <div
              role="tablist"
              aria-label="Secciones del detalle"
              className="overflow-x-auto border-t border-border/60 px-4 sm:px-6"
            >
              <div className="flex min-w-max gap-2 py-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    id={`admin-drawer-tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={tab.id === currentTab.id}
                    aria-controls={`admin-drawer-panel-${tab.id}`}
                    tabIndex={tab.id === currentTab.id ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-xs font-semibold tracking-[0.16em] transition-colors',
                      tab.id === currentTab.id
                        ? 'border-primary/40 bg-primary/12 text-primary shadow-[0_0_20px_-12px_var(--primary)]'
                        : 'border-border/70 bg-background/30 text-muted-foreground hover:border-primary/30 hover:text-primary',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div
              id={`admin-drawer-panel-${currentTab.id}`}
              role="tabpanel"
              aria-labelledby={`admin-drawer-tab-${currentTab.id}`}
              className="space-y-4"
            >
              {currentTab.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
