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
    description: 'Conversación inicial enfocada en entender la necesidad y decidir el siguiente paso.',
    icon: Clock3,
  },
  {
    title: 'Modalidad',
    value: siteConfig.advisory.modality,
    description: 'La primera versión usa Google Calendar y Google Meet como flujo principal.',
    icon: Video,
  },
  {
    title: 'Disponibilidad',
    value: 'Lunes a viernes',
    description: 'Los horarios visibles respetan configuración, anticipación mínima y cruces reales del calendario.',
    icon: CalendarDays,
  },
  {
    title: 'Validación',
    value: 'Cliente y servidor',
    description: 'El formulario bloquea dobles envíos razonables y no simula reservas cuando faltan credenciales.',
    icon: ShieldCheck,
  },
] as const

const afterBooking = [
  'Se validan los datos y el horario seleccionado.',
  'Se consulta la disponibilidad real en Google Calendar.',
  'Si el horario sigue libre, se crea el evento con Google Meet y recordatorios.',
  'La confirmación muestra fecha, hora, zona horaria y enlace de reunión.',
] as const

export const metadata = buildPageMetadata('advisory')

export default function AdvisoryPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="AGENDAR ASESORÍA"
        title="Programe una reunión inicial para revisar qué proceso conviene ordenar o automatizar."
        description="Esta conversación inicial nos permitirá comprender su necesidad y definir el mejor siguiente paso. La duración predeterminada es de 30 minutos y la modalidad base es reunión virtual."
        actions={
          <>
            <SiteAction href={siteConfig.routes.diagnostics}>SOLICITAR DIAGNÓSTICO</SiteAction>
            <SiteAction href={siteConfig.routes.contact} variant="secondary">
              IR A CONTACTO
            </SiteAction>
          </>
        }
        aside={
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              La integración ya está preparada para consultar disponibilidad real,
              evitar cruces y crear eventos con Google Meet desde el servidor.
            </p>
            <p>
              Si las credenciales aún no están configuradas, la interfaz mostrará
              un bloqueo administrativo claro en lugar de fingir una reserva.
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
                <h2 className="mt-3 text-lg font-medium text-foreground">{item.value}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
            title="Elija fecha, hora y comparta el contexto de la reunión."
            description="La disponibilidad visible responde a la configuración actual del calendario de Konamy Systems y a la zona horaria mostrada en la interfaz."
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
            description="El flujo está preparado para validar, consultar disponibilidad y crear la reunión de forma controlada desde el servidor."
          />

          <ol className="mt-8 grid gap-4 lg:grid-cols-2">
            {afterBooking.map((item, index) => (
              <Reveal
                as="li"
                key={item}
                delay={index * 90}
                className="rounded-2xl border border-border/70 bg-background/55 px-5 py-5 text-sm text-muted-foreground"
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
