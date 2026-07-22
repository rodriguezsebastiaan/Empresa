import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Logo } from '@/components/logo'
import {
  getAdminLoginErrorMessage,
  getAdminRuntimeConfigError,
  getCurrentAdmin,
  getSafeAdminReturnTo,
} from '@/lib/admin-auth'
import { fieldClassName, panelClassName } from '@/components/form-controls'

export const metadata: Metadata = {
  title: 'Admin Login | Konamy Systems',
  robots: {
    index: false,
    follow: false,
  },
}

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const admin = await getCurrentAdmin()

  if (admin) {
    redirect('/admin')
  }

  const resolvedSearchParams = await searchParams
  const next = getSafeAdminReturnTo(readParam(resolvedSearchParams.next))
  const errorCode = readParam(resolvedSearchParams.error)
  const runtimeError = getAdminRuntimeConfigError()
  const errorMessage = getAdminLoginErrorMessage(errorCode)

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,oklch(0.13_0.02_240)_0%,oklch(0.16_0.03_222)_38%,oklch(0.185_0.028_232)_68%,oklch(0.14_0.02_240)_100%)] px-4 py-8 text-foreground lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_28rem]">
          <section className="rounded-[2rem] border border-border/70 bg-background/45 p-8 backdrop-blur-sm lg:p-10">
            <div className="max-w-xl">
              <Link
                href="/"
                className="inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <Logo />
              </Link>

              <p className="mt-8 text-xs font-semibold tracking-[0.32em] text-primary">
                PANEL ADMINISTRATIVO
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground">
                Gestion interna de contactos y diagnosticos de Konamy Systems.
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
                Este acceso permite revisar prospectos, actualizar estados, agregar notas internas,
                descargar CSV y mantener trazabilidad operativa sin tocar la interfaz publica.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary">SEGURIDAD</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Sesion en cookie httpOnly, contrasena con hash fuerte y bloqueo temporal
                    despues de intentos fallidos.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/35 p-4">
                  <p className="text-xs font-semibold tracking-[0.18em] text-primary">ALCANCE</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Dashboard, contactos, diagnosticos, estados, notas, historial y exportacion CSV.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={panelClassName}>
            <p className="text-xs font-semibold tracking-[0.32em] text-primary">INICIAR SESION</p>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">Acceso administrativo</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Use el administrador creado con el seed de Prisma. Si aun no existe, primero ejecute
              `npm run db:seed` con `ADMIN_SEED_EMAIL` y `ADMIN_SEED_PASSWORD`.
            </p>

            {runtimeError ? (
              <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
                Falta configuracion obligatoria para habilitar el panel: {runtimeError}.
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">
                {errorMessage}
              </div>
            ) : null}

            <form action="/admin/api/session/login" method="post" className="mt-6 space-y-5">
              <input type="hidden" name="next" value={next} />

              <label className="block">
                <span className="text-sm font-medium text-foreground">Correo</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  maxLength={191}
                  className={fieldClassName}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground">Contrasena</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  maxLength={120}
                  className={fieldClassName}
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
              >
                ENTRAR AL PANEL
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
              >
                VOLVER AL SITIO
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

