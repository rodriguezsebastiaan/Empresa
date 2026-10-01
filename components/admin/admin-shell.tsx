'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowUpRight,
  CalendarCheck2,
  Clock3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from 'lucide-react'
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
    href: '/admin/diagnosticos',
    label: 'Diagnósticos',
    icon: ClipboardList,
  },
  {
    href: '/admin/reuniones',
    label: 'Asesorías',
    icon: CalendarCheck2,
  },
  {
    href: '/admin/reuniones/disponibilidad',
    label: 'Disponibilidad',
    icon: Clock3,
  },
] as const

function getCurrentSection(pathname: string) {
  const match =
    [...navigationItems].sort((a, b) => b.href.length - a.href.length).find(
      (item) => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)),
    ) ?? navigationItems[0]

  return match.label
}

export function AdminShell({ children, admin }: AdminShellProps) {
  const pathname = usePathname()
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen])

  const currentSection = getCurrentSection(pathname)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(45,242,230,0.11),transparent_30%),radial-gradient(circle_at_90%_18%,rgba(125,211,252,0.07),transparent_28%),linear-gradient(180deg,oklch(0.13_0.02_240)_0%,oklch(0.16_0.03_222)_38%,oklch(0.185_0.028_232)_68%,oklch(0.14_0.02_240)_100%)] text-foreground">
      <div className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-[1640px] items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] font-semibold tracking-[0.24em] text-primary">CONEXACOD ADMIN</p>
            <p className="truncate text-sm text-foreground">{currentSection}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              SITIO
            </Link>
            <button
              type="button"
              aria-label={mobileOpen ? 'Cerrar menú administrativo' : 'Abrir menú administrativo'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((current) => !current)}
              className="inline-flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-background/55 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1640px] gap-5 px-4 py-4 lg:px-6 lg:py-6">
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Cerrar menú administrativo"
            className="fixed inset-0 z-40 bg-background/72 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-[20rem] flex-col overflow-y-auto border-r border-border/70 bg-background/92 p-4 shadow-[24px_0_90px_-72px_var(--primary)] backdrop-blur-md transition-transform duration-300 lg:sticky lg:top-4 lg:z-auto lg:h-[calc(100vh-2rem)] lg:rounded-[1.7rem] lg:border lg:bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(4,13,20,0.56)_42%,rgba(4,13,20,0.72))] lg:p-3.5',
            desktopCollapsed ? 'lg:w-[5.8rem]' : 'lg:w-[15.8rem]',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                desktopCollapsed && 'justify-center',
              )}
            >
              <div className={cn('flex items-center gap-3', desktopCollapsed && 'lg:gap-0')}>
                <div className="scale-[0.92]">
                  <Logo />
                </div>
              </div>
            </Link>

            <button
              type="button"
              aria-label={desktopCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
              aria-expanded={!desktopCollapsed}
              onClick={() => setDesktopCollapsed((current) => !current)}
              className="hidden lg:inline-flex size-9 items-center justify-center rounded-2xl border border-border/70 bg-background/45 text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
            >
              {desktopCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </button>
          </div>

          <div
            className={cn(
              'mt-3 rounded-[1.35rem] border border-primary/18 bg-primary/[0.08] p-3 shadow-inner shadow-black/10',
              desktopCollapsed && 'lg:px-2.5 lg:py-3',
            )}
          >
            <p className={cn('text-[0.62rem] font-semibold tracking-[0.2em] text-primary', desktopCollapsed && 'lg:text-center')}>
              PERFIL
            </p>
            <div className={cn('mt-2.5 flex items-start gap-3', desktopCollapsed && 'lg:justify-center lg:gap-0')}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-background/60 text-primary">
                <UserRound className="size-[1.05rem]" />
              </div>
              <div className={cn('min-w-0', desktopCollapsed && 'lg:hidden')}>
                <p className="text-[0.92rem] font-semibold leading-snug text-foreground">{admin.name}</p>
                <p className="mt-1 text-[0.72rem] font-semibold tracking-[0.16em] text-primary">
                  {admin.role}
                </p>
                <p className="mt-1.5 truncate text-xs text-muted-foreground">{admin.email}</p>
              </div>
            </div>
          </div>

          <nav className="mt-4 flex-1 space-y-1.5" aria-label="Navegación administrativa">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const active =
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={desktopCollapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary/35 bg-primary/[0.12] text-primary shadow-[0_0_22px_-13px_var(--primary)]'
                      : 'border-border/70 bg-background/32 text-foreground/85 hover:border-primary/25 hover:bg-primary/[0.045] hover:text-primary',
                    desktopCollapsed && 'lg:justify-center lg:px-0',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className={cn(desktopCollapsed && 'lg:hidden')}>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {!desktopCollapsed ? (
            <div className="mt-3 hidden rounded-2xl border border-border/70 bg-background/28 p-3 text-[0.72rem] leading-relaxed text-muted-foreground shadow-inner shadow-black/5 lg:block">
              Seguimiento comercial, diagnósticos y asesorías en una sola operación interna.
            </div>
          ) : null}

          <div className="mt-3 space-y-1.5">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              title={desktopCollapsed ? 'Volver al sitio' : undefined}
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border/70 bg-background/35 px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary',
                desktopCollapsed && 'lg:px-0',
              )}
            >
              <ArrowUpRight className="size-4 shrink-0" />
              <span className={cn(desktopCollapsed && 'lg:hidden')}>VOLVER AL SITIO</span>
            </Link>

            <form action="/admin/api/session/logout" method="post">
              <button
                type="submit"
                title={desktopCollapsed ? 'Cerrar sesión' : undefined}
                className={cn(
                  'inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border/70 bg-background/40 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/35 hover:text-primary',
                  desktopCollapsed && 'lg:px-0',
                )}
              >
                <LogOut className="size-4 shrink-0" />
                <span className={cn(desktopCollapsed && 'lg:hidden')}>CERRAR SESIÓN</span>
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
