'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, LayoutDashboard, LogOut, Mail, UserRound } from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

type AdminShellProps = {
  children: ReactNode
  admin: {
    name: string
    email: string
    role: string
  }
}

const navigationItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/contactos',
    label: 'Contactos',
    icon: Mail,
  },
  {
    href: '/admin/diagnosticos',
    label: 'Diagnosticos',
    icon: ClipboardList,
  },
] as const

export function AdminShell({ children, admin }: AdminShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,oklch(0.13_0.02_240)_0%,oklch(0.16_0.03_222)_38%,oklch(0.185_0.028_232)_68%,oklch(0.14_0.02_240)_100%)] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <aside className="w-full shrink-0 rounded-[1.75rem] border border-border/70 bg-background/55 p-5 backdrop-blur-sm lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[18rem]">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/admin" className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
              <Logo />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary lg:hidden"
            >
              SITIO
            </Link>
          </div>

          <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/8 p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-primary/30 bg-background/60 text-primary">
                <UserRound className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{admin.name}</p>
                <p className="truncate text-xs text-muted-foreground">{admin.email}</p>
                <p className="mt-2 text-[0.68rem] font-semibold tracking-[0.18em] text-primary">
                  {admin.role}
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6 grid gap-2" aria-label="Navegacion administrativa">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary/35 bg-primary/10 text-primary shadow-[0_0_18px_-10px_var(--primary)]'
                      : 'border-border/70 bg-background/35 text-foreground/85 hover:border-primary/25 hover:text-primary',
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 hidden lg:block">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              VOLVER AL SITIO
            </Link>
          </div>

          <form action="/admin/api/session/logout" method="post" className="mt-6">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border/70 bg-background/40 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/35 hover:text-primary"
            >
              <LogOut className="size-4" />
              CERRAR SESION
            </button>
          </form>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}

