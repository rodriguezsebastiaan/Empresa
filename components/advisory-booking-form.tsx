'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckboxField, TextField, TextareaField, panelClassName } from '@/components/form-controls'
import { PrivacyConsentCopy } from '@/components/privacy-consent-copy'
import { SiteAction } from '@/components/site-action'
import { siteConfig } from '@/config/site'
import { addDaysToDateValue, getTodayInAdvisoryZone } from '@/lib/advisory-time'
import {
  validateAdvisoryBookingForm,
  type AdvisoryBookingFormData,
  type FieldErrors,
} from '@/lib/validation'
import { buildWhatsAppUrl } from '@/lib/site'

type AvailabilityResponse = {
  configured?: boolean
  message?: string
  slots?: Array<{ label: string; value: string }>
  rules?: Partial<PublicAvailabilitySettings>
}

type PublicAvailabilitySettings = {
  isEnabled: boolean
  timezoneLabel: string
  durationMinutes: number
  bufferMinutes: number
  minNoticeHours: number
  maxDaysAhead: number
  defaultModality: string
  calendarMode: 'real' | 'mock-development'
}

type BookingConfirmation = {
  dateLabel: string
  timeLabel: string
  timezone: string
  durationMinutes: number
  meetUrl: string | null
  guestEmail: string
  guestName: string
}

function todayValue() {
  return getTodayInAdvisoryZone()
}

function futureValue(daysAhead: number) {
  return addDaysToDateValue(todayValue(), daysAhead)
}

const initialState: AdvisoryBookingFormData = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  city: '',
  processGoal: '',
  modality: siteConfig.advisory.modality,
  date: '',
  time: '',
  timezone: siteConfig.advisory.timezoneLabel,
  privacyAccepted: false,
  requestId: '',
  website: '',
}

function createInitialState(): AdvisoryBookingFormData {
  return {
    ...initialState,
    requestId: globalThis.crypto?.randomUUID?.() ?? `req-${Date.now()}`,
  }
}

export function AdvisoryBookingForm() {
  const whatsappHref = buildWhatsAppUrl()
  const [form, setForm] = useState<AdvisoryBookingFormData>(createInitialState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [availabilityMessage, setAvailabilityMessage] = useState(
    'Seleccione una fecha para consultar horarios disponibles.',
  )
  const [availabilityConfigured, setAvailabilityConfigured] = useState(true)
  const [availabilitySettings, setAvailabilitySettings] = useState<PublicAvailabilitySettings>({
    isEnabled: true,
    timezoneLabel: siteConfig.advisory.timezoneLabel,
    durationMinutes: siteConfig.advisory.durationMinutes,
    bufferMinutes: siteConfig.advisory.bufferMinutes,
    minNoticeHours: siteConfig.advisory.minNoticeHours,
    maxDaysAhead: siteConfig.advisory.maxDaysAhead,
    defaultModality: siteConfig.advisory.modality,
    calendarMode: 'mock-development',
  })
  const [slots, setSlots] = useState<Array<{ label: string; value: string }>>([])
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadSettings() {
      try {
        const response = await fetch('/api/availability/settings')
        const payload = (await response.json()) as {
          settings?: PublicAvailabilitySettings
        }

        if (!ignore && response.ok && payload.settings) {
          setAvailabilitySettings(payload.settings)
          setAvailabilityConfigured(payload.settings.isEnabled)
          setForm((current) => ({
            ...current,
            modality: payload.settings?.defaultModality ?? current.modality,
            timezone: payload.settings?.timezoneLabel ?? current.timezone,
          }))
        }
      } catch {
        if (!ignore) {
          setAvailabilityMessage(
            'No fue posible cargar la configuración de disponibilidad. Intente de nuevo.',
          )
        }
      }
    }

    loadSettings()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!form.date) {
      return
    }

    let ignore = false

    async function loadAvailability() {
      setLoadingSlots(true)
      setAvailabilityMessage('Consultando horarios disponibles...')
      setStatusMessage('')
      setSlots([])
      updateField('time', '')

      try {
        const response = await fetch(`/api/availability?date=${encodeURIComponent(form.date)}`)
        const payload = (await response.json()) as AvailabilityResponse

        if (ignore) {
          return
        }

        setAvailabilityConfigured(payload.configured !== false)

        if (!response.ok) {
          setAvailabilityMessage(
            payload.message ??
              'No fue posible consultar la disponibilidad para la fecha seleccionada.',
          )
          return
        }

        setSlots(payload.slots ?? [])
        setAvailabilitySettings((current) => ({
          ...current,
          ...payload.rules,
        }))
        setAvailabilityMessage(
          (payload.slots ?? []).length > 0
            ? 'Seleccione uno de los horarios disponibles.'
            : 'No hay horarios disponibles para este día. Selecciona otra fecha.',
        )
      } catch {
        if (!ignore) {
          setAvailabilityMessage('No fue posible conectar con el servicio de disponibilidad.')
        }
      } finally {
        if (!ignore) {
          setLoadingSlots(false)
        }
      }
    }

    loadAvailability()

    return () => {
      ignore = true
    }
  }, [form.date])

  function updateField<K extends keyof AdvisoryBookingFormData>(
    key: K,
    value: AdvisoryBookingFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateDate(value: string) {
    setForm((current) => ({
      ...current,
      date: value,
      time: '',
    }))
    setSlots([])
    setAvailabilityConfigured(true)
    setStatusMessage('')
    setAvailabilityMessage(
      value
        ? 'Consultando horarios disponibles...'
        : 'Seleccione una fecha para consultar horarios disponibles.',
    )
  }

  const summary = useMemo(
    () => [
      ['Empresa', form.company || 'Pendiente'],
      ['Contacto', form.fullName || 'Pendiente'],
      ['Correo', form.email || 'Pendiente'],
      ['Ciudad', form.city || 'Pendiente'],
      ['Fecha', form.date || 'Pendiente'],
      ['Hora', form.time || 'Pendiente'],
      ['Modalidad', form.modality],
      ['Zona horaria', availabilitySettings.timezoneLabel],
    ],
    [form, availabilitySettings.timezoneLabel],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setConfirmation(null)
    setStatusMessage('')

    const result = validateAdvisoryBookingForm(form)

    if (!result.success) {
      setErrors(result.errors)
      setStatusMessage('Revise los datos antes de confirmar la asesoría.')
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      const response = await fetch('/api/advisory-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data),
      })

      const payload = (await response.json()) as {
        success?: boolean
        message?: string
        errors?: FieldErrors
        confirmation?: BookingConfirmation
      }

      if (!response.ok) {
        setErrors(payload.errors ?? {})
        setStatusMessage(
          payload.message ?? 'No fue posible crear la asesoría en este momento.',
        )
        return
      }

      setConfirmation(payload.confirmation ?? null)
      setStatusMessage('')
    } catch {
      setStatusMessage('No fue posible conectar con el servidor.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmation) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className={panelClassName}>
          <p className="text-xs font-semibold tracking-[0.3em] text-primary">
            ASESORÍA CONFIRMADA
          </p>
          <h2 className="mt-4 text-2xl font-medium text-foreground">
            Su asesoría inicial quedó registrada.
          </h2>
          <dl className="mt-8 grid gap-4 text-sm">
            <div className="rounded-xl border border-border/70 bg-background/40 px-4 py-3">
              <dt className="text-xs tracking-[0.18em] text-muted-foreground">Fecha</dt>
              <dd className="mt-1 text-foreground">{confirmation.dateLabel}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/40 px-4 py-3">
              <dt className="text-xs tracking-[0.18em] text-muted-foreground">Hora</dt>
              <dd className="mt-1 text-foreground">{confirmation.timeLabel}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/40 px-4 py-3">
              <dt className="text-xs tracking-[0.18em] text-muted-foreground">Zona horaria</dt>
              <dd className="mt-1 text-foreground">{confirmation.timezone}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/40 px-4 py-3">
              <dt className="text-xs tracking-[0.18em] text-muted-foreground">Duración</dt>
              <dd className="mt-1 text-foreground">
                {confirmation.durationMinutes} minutos
              </dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/40 px-4 py-3">
              <dt className="text-xs tracking-[0.18em] text-muted-foreground">Invitado</dt>
              <dd className="mt-1 text-foreground">{confirmation.guestEmail}</dd>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/40 px-4 py-3">
              <dt className="text-xs tracking-[0.18em] text-muted-foreground">Enlace de reunión</dt>
              <dd className="mt-1 text-foreground">
                {confirmation.meetUrl ? (
                  <a
                    href={confirmation.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary transition-opacity hover:opacity-80"
                  >
                    Abrir enlace de la asesoría
                  </a>
                ) : (
                  'El enlace quedara pendiente hasta activar la integracion de calendario.'
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className={`${panelClassName} h-fit`}>
          <p className="text-sm leading-relaxed text-muted-foreground">
            La reserva queda guardada en el sistema local. Las invitaciones automáticas se activarán
            cuando retomemos las integraciones externas.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <SiteAction href={siteConfig.routes.home}>VOLVER AL INICIO</SiteAction>
            {whatsappHref ? (
              <SiteAction href={whatsappHref} external variant="secondary">
                HABLAR POR WHATSAPP
              </SiteAction>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_22rem]">
      <form onSubmit={handleSubmit} className={panelClassName}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Nombre completo"
            name="fullName"
            autoComplete="name"
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            error={errors.fullName}
            maxLength={90}
          />
          <TextField
            label="Empresa"
            name="company"
            autoComplete="organization"
            value={form.company}
            onChange={(event) => updateField('company', event.target.value)}
            error={errors.company}
            maxLength={90}
          />
          <TextField
            label="Correo"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            error={errors.email}
            maxLength={120}
          />
          <TextField
            label="Teléfono"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            error={errors.phone}
            maxLength={25}
          />
          <TextField
            label="Ciudad"
            name="city"
            autoComplete="address-level2"
            value={form.city}
            onChange={(event) => updateField('city', event.target.value)}
            error={errors.city}
            maxLength={80}
          />
          <TextField
            label="Modalidad"
            name="modality"
            value={form.modality}
            onChange={(event) => updateField('modality', event.target.value)}
            error={errors.modality}
            readOnly
          />
        </div>

        <div className="mt-5">
          <TextareaField
            label="Motivo o proceso que quiere mejorar"
            name="processGoal"
            value={form.processGoal}
            onChange={(event) => updateField('processGoal', event.target.value)}
            error={errors.processGoal}
            maxLength={600}
            placeholder="Cuéntenos qué área quiere ordenar, automatizar o mejorar."
          />
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextField
            label="Fecha"
            name="date"
            type="date"
            value={form.date}
            min={todayValue()}
            max={futureValue(availabilitySettings.maxDaysAhead)}
            onChange={(event) => updateDate(event.target.value)}
            error={errors.date}
          />
          <TextField
            label="Zona horaria"
            name="timezone"
            value={form.timezone}
            onChange={(event) => updateField('timezone', event.target.value)}
            error={errors.timezone}
            readOnly
          />
        </div>

        <div className="mt-5 rounded-2xl border border-border/70 bg-background/40 p-4">
          <div className="flex items-center justify-between gap-4" aria-live="polite">
            <div>
              <p className="text-sm font-medium text-foreground">Horas disponibles</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {availabilityMessage}
              </p>
            </div>
            {loadingSlots ? (
              <span className="text-xs text-primary">Consultando...</span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {slots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => updateField('time', slot.value)}
                className={
                  form.time === slot.value
                    ? 'rounded-full border border-primary bg-primary/15 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-primary shadow-[0_0_16px_-10px_var(--primary)]'
                    : 'rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-foreground transition-colors hover:border-primary/50 hover:text-primary'
                }
              >
                {slot.label}
              </button>
            ))}
          </div>

          {errors.time ? (
            <p className="mt-3 text-xs text-destructive">{errors.time}</p>
          ) : null}
        </div>

        <div className="mt-5 hidden">
          <TextField
            label="Sitio web"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => updateField('website', event.target.value)}
          />
        </div>

        <div className="mt-5">
          <CheckboxField
            label={<PrivacyConsentCopy />}
            name="privacyAccepted"
            checked={form.privacyAccepted}
            onChange={(event) => updateField('privacyAccepted', event.target.checked)}
            error={errors.privacyAccepted}
            hint={siteConfig.legal.privacyPolicyVersionLabel}
          />
        </div>

        <div aria-live="polite" className="mt-5 min-h-6 text-sm">
          {statusMessage ? <p className="text-destructive">{statusMessage}</p> : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={submitting || !availabilityConfigured}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3.5 text-xs font-semibold tracking-widest text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'CONFIRMANDO...' : 'CONFIRMAR ASESORÍA'}
          </button>
          <SiteAction href={siteConfig.routes.diagnostics} variant="secondary">
            IR A DIAGNÓSTICO
          </SiteAction>
        </div>
      </form>

      <aside className={`${panelClassName} h-fit`}>
        <p className="text-xs font-semibold tracking-[0.3em] text-primary">
          RESUMEN ANTES DE CONFIRMAR
        </p>
        <dl className="mt-5 space-y-4 text-sm">
          {summary.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border/70 bg-background/40 px-4 py-3">
              <dt className="text-xs tracking-[0.18em] text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
          <p>Duración predeterminada: {availabilitySettings.durationMinutes} minutos.</p>
          <p className="mt-2">{availabilitySettings.timezoneLabel}</p>
          <p className="mt-2">
            El flujo local valida disponibilidad, evita doble reserva y guarda la asesoría en el panel.
          </p>
          <p className="mt-2">
            Esta conversación inicial nos permitirá comprender su necesidad y
            definir el mejor siguiente paso.
          </p>
        </div>
      </aside>
    </div>
  )
}
