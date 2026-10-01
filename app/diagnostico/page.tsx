import { ClipboardList, Mail, Network, Workflow } from 'lucide-react'
import { DiagnosticWizard } from '@/components/diagnostic-wizard'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'

const preparedFlow = [
  {
    title: 'Captura guiada del problema',
    description: 'El diagnóstico empresarial guiado ayuda a explicar la operación sin hacer sentir al cliente que llena un bloque largo de campos.',
    icon: ClipboardList,
  },
  {
    title: 'Automatización futura',
    description: 'El flujo queda preparado para conectar correo, CRM, base de datos, n8n y tareas administrativas cuando existan credenciales.',
    icon: Network,
  },
  {
    title: 'Seguimiento organizado',
    description: 'Después del envío se puede conducir a asesoría, confirmación al cliente y procesos de seguimiento sin duplicar lógica.',
    icon: Workflow,
  },
  {
    title: 'Validación completa',
    description: 'Existe validación por paso, resumen previo, honeypot, prevención razonable de doble envío y mensajes claros de éxito o bloqueo.',
    icon: Mail,
  },
] as const

export const metadata = buildPageMetadata('diagnostics')

export default function DiagnosticPage() {
  return (
    <SiteShell seoPage="diagnostics">
      <PageHero
        eyebrow="DIAGNÓSTICO"
        title="Explique su problema por etapas y convirtámoslo en un siguiente paso claro."
        description="El diagnóstico empresarial está pensado para entender cómo opera hoy su empresa, qué proceso desea mejorar y qué resultado espera obtener, sin recurrir a un formulario pesado ni a promesas simuladas."
        actions={
          <>
            <SiteAction href={siteConfig.routes.advisory}>AGENDAR ASESORÍA</SiteAction>
            <SiteAction href={siteConfig.routes.contact} variant="secondary">
              IR A CONTACTO
            </SiteAction>
          </>
        }
        aside={
          <div className="ks-copy-secondary space-y-4">
            <p>
              El formulario no guarda datos personales en `localStorage` y deja
              preparado el flujo para integraciones reales cuando existan
              credenciales.
            </p>
            <p>
              Si el destino real del diagnóstico todavía no está activo, la
              plataforma lo informará con claridad después del envío.
            </p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <SectionHeading
          eyebrow="FORMULARIO MULTIPASO"
          title="Un recorrido pensado para entender la operación, no para pedir datos porque sí."
          description="Cada paso valida lo necesario, permite regresar y construye un resumen antes de enviar la información."
        />

        <Reveal className="mt-8">
          <DiagnosticWizard />
        </Reveal>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="ARQUITECTURA PREPARADA"
            title="El diagnóstico ya deja listo el terreno para automatización real."
            description="Aunque todavía no se conecten servicios reales sin credenciales, la estructura ya contempla los siguientes destinos y procesos."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {preparedFlow.map((item, index) => {
              const Icon = item.icon

              return (
                <Reveal
                  as="article"
                  key={item.title}
                  delay={index * 90}
                  className="rounded-3xl border border-border/70 bg-background/50 px-6 py-6 backdrop-blur-sm"
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="ks-type-card-title mt-5 font-semibold">{item.title}</h2>
                  <p className="ks-card-copy mt-3">
                    {item.description}
                  </p>
                </Reveal>
              )
            })}
          </div>

          <Reveal
            variant="fade"
            className="mt-12 rounded-[2rem] border border-border/70 bg-background/45 px-6 py-10 backdrop-blur-sm lg:px-10"
          >
            <SectionHeading
              eyebrow="DESPUÉS DEL ENVÍO"
              title="Puede continuar con una asesoría o esperar la activación del canal definitivo."
              description="Cuando la integración real del diagnóstico se conecte, este flujo podrá disparar correo, CRM, seguimiento administrativo y confirmaciones al cliente sin rehacer la interfaz."
              actions={
                <>
                  <SiteAction href={siteConfig.routes.advisory}>AGENDAR ASESORÍA</SiteAction>
                  <SiteAction href={siteConfig.routes.contact} variant="secondary">
                    IR A CONTACTO
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
