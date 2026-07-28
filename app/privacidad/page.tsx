import type { Metadata } from 'next'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'

const dataCategories = [
  'Datos de contacto que usted entregue en formularios: nombre, empresa, correo, teléfono y mensaje.',
  'Información operativa o diagnóstica que comparta para explicar procesos, dificultades, herramientas actuales o resultados esperados.',
  'Datos necesarios para coordinar asesorías, disponibilidad e invitaciones de calendario cuando la integración esté activa.',
] as const

const intendedPurposes = [
  'Responder solicitudes comerciales o de contacto.',
  'Analizar el contexto del negocio antes de una asesoría o diagnóstico.',
  'Coordinar asesorías, disponibilidad y seguimiento administrativo.',
  'Preparar automatizaciones futuras relacionadas con formularios, correo y n8n cuando existan canales reales configurados.',
] as const

const pendingItems = [
  'Titular legal o razón social definitiva.',
  'Dominio público definitivo.',
  'Correo legal y correo operativo definitivos.',
  'Número telefónico y número de WhatsApp definitivos.',
  'Texto legal validado por el responsable jurídico correspondiente.',
] as const

export const metadata: Metadata = buildPageMetadata('privacy')

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <Reveal className="rounded-[2rem] border border-border/70 bg-background/45 px-6 py-10 backdrop-blur-sm lg:px-10">
          <Reveal
            as="p"
            variant="fade"
            className="text-xs font-semibold tracking-[0.3em] text-primary"
          >
            PRIVACIDAD
          </Reveal>
          <Reveal
            as="h1"
            delay={80}
            className="mt-5 max-w-3xl text-balance text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            Versión provisional de la política de privacidad para la salida 1.0.
          </Reveal>
          <Reveal
            as="p"
            delay={160}
            className="mt-5 max-w-3xl leading-relaxed text-muted-foreground"
          >
            {siteConfig.legal.privacyPolicyNotice}
          </Reveal>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/45 px-5 py-5 text-sm text-muted-foreground">
              <p className="text-xs font-semibold tracking-[0.24em] text-primary">
                RESPONSABLE
              </p>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-xs tracking-[0.18em] text-muted-foreground">
                    Titular legal
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {siteConfig.legal.privacyPolicyOwnerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs tracking-[0.18em] text-muted-foreground">
                    Correo legal
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {siteConfig.legal.privacyPolicyOwnerEmail}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs tracking-[0.18em] text-muted-foreground">
                    Dirección legal
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {siteConfig.legal.privacyPolicyOwnerAddress}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs tracking-[0.18em] text-muted-foreground">
                    Línea de contacto
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {siteConfig.legal.privacyPolicyOwnerPhone}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-primary/25 bg-primary/[0.06] px-5 py-5 text-sm text-muted-foreground">
              <p className="text-xs font-semibold tracking-[0.24em] text-primary">
                ESTADO DEL DOCUMENTO
              </p>
              <p className="mt-4 leading-relaxed">
                {siteConfig.legal.privacyPolicyVersionLabel}
              </p>
              <p className="mt-4 leading-relaxed">
                Última actualización declarada:{' '}
                <span className="text-foreground">
                  {siteConfig.legal.privacyPolicyUpdatedAt}
                </span>
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="ALCANCE PREVISTO"
            title="Qué datos contempla esta versión provisional."
            description="Esta página deja explícito el alcance funcional actual del proyecto mientras se reciben y validan los datos legales definitivos."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {dataCategories.map((item, index) => (
              <Reveal
                as="article"
                key={item}
                delay={index * 90}
                className="rounded-3xl border border-border/70 bg-background/50 px-6 py-6 backdrop-blur-sm"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal className="rounded-[2rem] border border-border/70 bg-background/45 px-6 py-8 backdrop-blur-sm lg:px-8">
            <SectionHeading
              eyebrow="FINALIDADES PREVISTAS"
              title="Uso esperado de la información compartida."
              description="Estas finalidades describen la intención operativa del sitio, pero deben revisarse con el texto legal definitivo antes del despliegue público final."
            />

            <ul className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {intendedPurposes.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background/40 px-4 py-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-[2rem] border border-border/70 bg-background/45 px-6 py-8 backdrop-blur-sm lg:px-8"
          >
            <SectionHeading
              eyebrow="PENDIENTES"
              title="Datos que no deben publicarse como definitivos todavía."
              description="Los siguientes elementos siguen pendientes de confirmación y deben reemplazarse con información real antes del despliegue final."
            />

            <ul className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {pendingItems.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background/40 px-4 py-4"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <Reveal
            variant="fade"
            className="rounded-[2rem] border border-border/70 bg-secondary/20 px-6 py-10 lg:px-10"
          >
            <SectionHeading
              eyebrow="SIGUIENTE PASO"
              title="Cuando llegue la información real, esta página ya está lista para cerrarse correctamente."
              description="El proyecto ya tiene la ruta, los enlaces legales y la estructura base; falta reemplazar los datos pendientes y validar el texto definitivo."
              actions={
                <>
                  <SiteAction href={siteConfig.routes.contact}>IR A CONTACTO</SiteAction>
                  <SiteAction href={siteConfig.routes.home} variant="secondary">
                    VOLVER AL INICIO
                  </SiteAction>
                </>
              }
            />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  )
}
