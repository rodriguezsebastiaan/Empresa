'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { mainNav } from '@/config/site'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navItems = mainNav.map((item) => ({
    ...item,
    active: pathname === item.href,
  }))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500',
        scrolled
          ? 'border-b border-border/70 bg-background/70 shadow-[0_8px_30px_-18px_var(--primary)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-500 lg:px-10',
          scrolled ? 'py-3.5' : 'py-6',
        )}
      >
        <a
          href="#inicio"
          aria-label="Konamy Systems - Inicio"
          className="ks-enter rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60 [--enter-delay:80ms]"
        >
          <Logo />
        </a>

        <nav
          className="hidden items-center gap-9 lg:flex"
          aria-label="Navegación principal"
        >
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              style={{ ['--enter-delay' as string]: `${170 + index * 60}ms` }}
              className={cn(
                'ks-enter group relative rounded-sm text-[0.95rem] font-medium tracking-wide outline-none transition-colors duration-300 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                item.active ? 'text-primary' : 'text-foreground/85',
              )}
            >
              {item.label}
              {/* Active indicator dot */}
              {item.active && (
                <span className="absolute -bottom-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
              )}
              {/* Animated hover underline (does not shift layout) */}
              <span
                className={cn(
                  'pointer-events-none absolute -bottom-2 left-0 h-px w-full origin-center scale-x-0 rounded-full bg-primary/80 shadow-[0_0_8px_var(--primary)] transition-transform duration-300 group-hover:scale-x-100',
                  item.active && 'hidden',
                )}
              />
            </a>
          ))}
        </nav>

        <a
          href="#contacto"
          className="ks-enter group hidden items-center gap-2 rounded-md border border-primary/70 bg-primary/10 px-5 py-2.5 text-xs font-semibold tracking-widest text-primary shadow-[0_0_18px_-8px_var(--primary)] outline-none transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_24px_-6px_var(--primary)] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background [--enter-delay:620ms] lg:inline-flex"
        >
          AGENDAR ASESORÍA
          <ArrowRight className="ks-arrow size-4" />
        </a>

        <button
          type="button"
          className="ks-enter rounded-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/60 [--enter-delay:420ms] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card/95 px-6 py-6 backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Navegación móvil">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'text-base font-medium transition-colors hover:text-primary',
                  item.active ? 'text-primary' : 'text-foreground/85',
                )}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="group mt-2 inline-flex items-center justify-center gap-2 rounded-md border border-primary/60 px-5 py-2.5 text-xs font-semibold tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              AGENDAR ASESORÍA
              <ArrowRight className="ks-arrow size-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
