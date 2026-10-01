import { CalendarDays, Clock3, ShieldCheck, Video } from 'lucide-react'
import { AdvisoryBookingForm } from '@/components/advisory-booking-form'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SiteAction } from '@/components/site-action'
import { SiteShell } from '@/components/site-shell'
import { siteConfig } from '@/config/site'
import { buildPageMetadata } from '@/lib/metadata'

const bookingHighlights = [
  {
    title: 'Duración',
    value: `${siteConfig.advisory.durationMinutes} minutos`,
    description: 'Asesoría inicial enfocada en entender la necesidad y decidir el siguiente paso.',
    icon: Clock3,
  },
  {
    title: 'Modalidad',
    value: siteConfig.advisory.modality,
    description: 'La asesoría inicial se coordina de forma virtual y con confirmación controlada.',
    icon: Video,
  },
  {
    title: 'Disponibilidad',
    value: 'Lunes a viernes',
    description: 'Los horarios visibles respetan la agenda actual, la anticipación mínima y posibles cruces de horario.',
    icon: CalendarDays,
  },
  {
    title: 'Validación',
    value: 'Cliente y servidor',
    description: 'El formulario valida los datos y evita confirmar horarios cuando la agenda no está disponible.',
    icon: ShieldCheck,
  },
] as const

const afterBooking = [
  'Se validan los datos y el horario seleccionado.',
  'Se consulta la disponibilidad real de la agenda.',
  'Si el horario sigue libre, se confirma la asesoría con invitación y recordatorios.',
  'La confirmación muestra fecha, hora, zona horaria y enlace de asesoría.',
] as const

export const metadata = buildPageMetadata('advisory')

export default function AdvisoryPage() {
  return (
    <SiteShell seoPage="advisory">
      <PageHero
        eyebrow="AGENDAR ASESORÍA"
        title="Programe una asesoría inicial para revisar qué proceso conviene ordenar o automatizar."
        description="Esta asesoría inicial nos permitirá comprender su necesidad y definir el mejor siguiente paso. La duración predeterminada es de 30 minutos y la modalidad base es virtual."
        actions={
          <>
            <SiteAction href={siteConfig.routes.diagnostics}>SOLICITAR DIAGNÓSTICO</SiteAction>
            <SiteAction href={siteConfig.routes.contact} variant="secondary">
              IR A CONTACTO
            </SiteAction>
          </>
        }
        aside={
          <div className="ks-copy-secondary space-y-4">
            <p>
              La agenda está preparada para consultar disponibilidad real, evitar
              cruces y confirmar asesorías de forma controlada.
            </p>
            <p>
              Si la agenda aún no está disponible, la interfaz indicará un canal
              alternativo en lugar de confirmar una asesoría incompleta.
            </p>
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {bookingHighlights.map((item, index) => {
            const Icon = item.icon

            return (
              <Reveal
                as="article"
                key={item.title}
                delay={index * 80}
                className="rounded-3xl border border-border/70 bg-background/50 px-5 py-6 backdrop-blur-sm"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <p className="mt-5 text-xs font-semibold tracking-[0.24em] text-primary">
                  {item.title}
                </p>
                <h2 className="ks-type-card-title mt-3 font-semibold">{item.value}</h2>
                <p className="ks-card-copy mt-3">
                  {item.description}
                </p>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="border-t border-border/60 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="RESERVA"
            title="Elija fecha, hora y comparta el contexto de la asesoría."
            description="La disponibilidad visible responde a la agenda actual de ConexaCod y a la zona horaria mostrada en la interfaz."
          />

          <Reveal className="mt-8">
            <AdvisoryBookingForm />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 lg:px-10 lg:py-24">
        <Reveal
          variant="fade"
          className="rounded-[2rem] border border-border/70 bg-background/45 px-6 py-10 backdrop-blur-sm lg:px-10"
        >
          <SectionHeading
            eyebrow="QUÉ OCURRE AL CONFIRMAR"
            title="La asesoría no se procesa como un simple formulario."
            description="El flujo valida la información, consulta disponibilidad y confirma la asesoría solo cuando el horario puede reservarse correctamente."
          />

          <ol className="mt-8 grid gap-4 lg:grid-cols-2">
            {afterBooking.map((item, index) => (
              <Reveal
                as="li"
                key={item}
                delay={index * 90}
                className="ks-card-copy rounded-2xl border border-border/70 bg-background/55 px-5 py-5"
              >
                <p className="text-xs font-semibold tracking-[0.24em] text-primary">
                  0{index + 1}
                </p>
                <p className="mt-3 leading-relaxed">{item}</p>
              </Reveal>
            ))}
          </ol>
        </Reveal>
      </section>
    </SiteShell>
  )
}
