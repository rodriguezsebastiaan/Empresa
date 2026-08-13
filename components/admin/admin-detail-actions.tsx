'use client'

import { useEffect, useState } from 'react'
import {
  CalendarDays,
  Copy,
  Mail,
  MessageSquare,
  Phone,
  Video,
} from 'lucide-react'

export type AdminDetailAction = {
  label: string
  kind: 'link' | 'copy'
  value: string
  icon: 'calendar' | 'copy' | 'mail' | 'phone' | 'video' | 'whatsapp'
  external?: boolean
}

const iconMap = {
  calendar: CalendarDays,
  copy: Copy,
  mail: Mail,
  phone: Phone,
  video: Video,
  whatsapp: MessageSquare,
} as const

export function AdminDetailActions({
  actions,
}: {
  actions: AdminDetailAction[]
}) {
  const [copiedValue, setCopiedValue] = useState('')

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

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-background/28 p-2">
      {actions.map((action) => {
        const Icon = iconMap[action.icon]
        const copied = copiedValue === action.value

        if (action.kind === 'link') {
          return (
            <a
              key={`${action.kind}-${action.label}-${action.value}`}
              href={action.value}
              target={action.external ? '_blank' : undefined}
              rel={action.external ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/45 px-3.5 py-2.5 text-xs font-semibold tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/35 hover:bg-primary/[0.06] hover:text-primary"
            >
              <Icon className="size-4" />
              {action.label}
            </a>
          )
        }

        return (
          <button
            key={`${action.kind}-${action.label}-${action.value}`}
            type="button"
            onClick={() => copyToClipboard(action.value)}
            className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-background/45 px-3.5 py-2.5 text-xs font-semibold tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/35 hover:bg-primary/[0.06] hover:text-primary"
          >
            <Icon className="size-4" />
            {copied ? 'COPIADO' : action.label}
          </button>
        )
      })}
    </div>
  )
}
