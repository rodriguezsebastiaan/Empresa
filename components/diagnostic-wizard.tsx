'use client'

import { useMemo, useState } from 'react'
import {
  CheckboxField,
  SelectField,
  TextareaField,
  TextField,
  panelClassName,
} from '@/components/form-controls'
import { PrivacyConsentCopy } from '@/components/privacy-consent-copy'
import { SiteAction } from '@/components/site-action'
import { siteConfig } from '@/config/site'
import {
  validateDiagnosticStep,
  type DiagnosticFormData,
  type FieldErrors,
} from '@/lib/validation'

const steps = [
  'Datos personales',
  'Empresa',
  'Proceso a mejorar',
  'Herramientas actuales',
  'Dificultad principal',
  'Resultado esperado',
  'Preferencia de contacto',
  'Resumen',
] as const

const initialState: DiagnosticFormData = {
  name: '',
  company: '',
  role: '',
  email: '',
  phone: '',
  city: '',
  sector: '',
  teamSize: '',
  processes: '',
  currentProcess: '',
  tools: '',
  repetitiveTasks: '',
  mainProblem: '',
  expectedResult: '',
  contactPreference: '',
  wantsMeeting: '',
  privacyAccepted: false,
  website: '',
}

function formatSummaryValue(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Pendiente'
  }

  return trimmed
}

export function DiagnosticWizard() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<DiagnosticFormData>(initialState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    tone: 'neutral' | 'error' | 'success'
    message: string
  }>({ tone: 'neutral', message: '' })

  const progress = ((step + 1) / steps.length) * 100

  const summaryItems = useMemo(
    () => [
      ['Nombre', form.name],
      ['Empresa', form.company],
      ['Cargo', form.role],
      ['Correo', form.email],
      ['Teléfono', form.phone],
      ['Ciudad', form.city],
      ['Sector', form.sector],
      ['Tamaño aproximado', form.teamSize],
      ['Procesos a mejorar', form.processes],
      ['Cómo opera hoy', form.currentProcess],
      ['Herramientas actuales', form.tools],
      ['Tareas repetitivas', form.repetitiveTasks],
      ['Problema principal', form.mainProblem],
      ['Resultado esperado', form.expectedResult],
      ['Preferencia de contacto', form.contactPreference],
      ['Interés en asesoría', form.wantsMeeting],
    ],
    [form],
  )

  function updateField<K extends keyof DiagnosticFormData>(
    key: K,
    value: DiagnosticFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function validateCurrentStep() {
    const result = validateDiagnosticStep(step, form)
    setErrors(result)
    return Object.keys(result).length === 0
  }

  function nextStep() {
    setStatus({ tone: 'neutral', message: '' })

    if (!validateCurrentStep()) {
      setStatus({
        tone: 'error',
        message: 'Complete correctamente los campos de este paso antes de continuar.',
      })
      return
    }

    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  function previousStep() {
    setStatus({ tone: 'neutral', message: '' })
    setStep((current) => Math.max(current - 1, 0))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = validateDiagnosticStep(7, form)
    setErrors(result)

    if (Object.keys(result).length > 0) {
      setStatus({
        tone: 'error',
        message: 'Revise la información resumida antes de enviar el diagnóstico.',
      })
      return
    }

    setSubmitting(true)
    setStatus({ tone: 'neutral', message: '' })

    try {
      const response = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const payload = (await response.json()) as {
        success?: boolean
        message?: string
        errors?: FieldErrors
      }

      if (!response.ok) {
        setErrors(payload.errors ?? {})
        setStatus({
          tone: 'error',
          message:
            payload.message ??
            'No fue posible procesar el diagnóstico en este momento.',
        })
        return
      }

      setStatus({
        tone: 'success',
        message:
          payload.message ?? 'El diagnóstico fue enviado correctamente.',
      })
      setForm(initialState)
      setStep(0)
    } catch {
      setStatus({
        tone: 'error',
        message: 'No fue posible conectar con el servidor.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_20rem]">
      <div className={panelClassName}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-primary">
              PASO {step + 1} DE {steps.length}
            </p>
            <h2 className="mt-3 text-2xl font-medium text-foreground">
              {steps[step]}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
        </div>

        <div className="mt-5 h-2 rounded-full bg-background/70">
          <div
            className="h-2 rounded-full bg-primary shadow-[0_0_16px_-6px_var(--primary)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-8 space-y-5">
          {step === 0 ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  label="Nombre"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  error={errors.name}
                />
                <TextField
                  label="Empresa"
                  name="company"
                  autoComplete="organization"
                  value={form.company}
                  onChange={(event) => updateField('company', event.target.value)}
                  error={errors.company}
                />
                <TextField
                  label="Cargo"
                  name="role"
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                  error={errors.role}
                />
                <TextField
                  label="Correo"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  error={errors.email}
                />
              </div>
              <TextField
                label="Teléfono"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                error={errors.phone}
              />
            </>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Ciudad"
                name="city"
                value={form.city}
                onChange={(event) => updateField('city', event.target.value)}
                error={errors.city}
              />
              <TextField
                label="Sector"
                name="sector"
                value={form.sector}
                onChange={(event) => updateField('sector', event.target.value)}
                error={errors.sector}
              />
              <div className="sm:col-span-2">
                <TextField
                  label="Tamaño aproximado"
                  name="teamSize"
                  value={form.teamSize}
                  onChange={(event) => updateField('teamSize', event.target.value)}
                  error={errors.teamSize}
                  placeholder="Ejemplo: 5 personas, 20 colaboradores, operación en 2 sedes"
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <>
              <TextareaField
                label="Procesos que desea mejorar"
                name="processes"
                value={form.processes}
                onChange={(event) => updateField('processes', event.target.value)}
                error={errors.processes}
                placeholder="Pedidos, atención comercial, administración, reportes, agenda..."
              />
              <TextareaField
                label="Cómo lo realiza actualmente"
                name="currentProcess"
                value={form.currentProcess}
                onChange={(event) => updateField('currentProcess', event.target.value)}
                error={errors.currentProcess}
                placeholder="Explique cómo fluye hoy el trabajo, aunque sea de forma manual."
              />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <TextareaField
                label="Herramientas actuales"
                name="tools"
                value={form.tools}
                onChange={(event) => updateField('tools', event.target.value)}
                error={errors.tools}
                placeholder="Excel, WhatsApp, Google Sheets, software contable, agenda manual..."
              />
              <TextareaField
                label="Tareas repetitivas"
                name="repetitiveTasks"
                value={form.repetitiveTasks}
                onChange={(event) => updateField('repetitiveTasks', event.target.value)}
                error={errors.repetitiveTasks}
                placeholder="Copiar datos, confirmar citas, consolidar reportes, responder siempre lo mismo..."
              />
            </>
          ) : null}

          {step === 4 ? (
            <TextareaField
              label="Principal dificultad"
              name="mainProblem"
              value={form.mainProblem}
              onChange={(event) => updateField('mainProblem', event.target.value)}
              error={errors.mainProblem}
              placeholder="Cuéntenos qué le hace perder tiempo, dinero, orden o trazabilidad."
            />
          ) : null}

          {step === 5 ? (
            <TextareaField
              label="Resultado esperado"
              name="expectedResult"
              value={form.expectedResult}
              onChange={(event) => updateField('expectedResult', event.target.value)}
              error={errors.expectedResult}
              placeholder="Qué quiere lograr cuando ese proceso esté organizado, automatizado o conectado."
            />
          ) : null}

          {step === 6 ? (
            <>
              <SelectField
                label="Preferencia de contacto"
                name="contactPreference"
                value={form.contactPreference}
                onChange={(event) => updateField('contactPreference', event.target.value)}
                error={errors.contactPreference}
                options={[
                  { label: 'Seleccione una opción', value: '' },
                  { label: 'Correo', value: 'Correo' },
                  { label: 'WhatsApp', value: 'WhatsApp' },
                  { label: 'Llamada', value: 'Llamada' },
                ]}
              />
              <SelectField
                label="¿Le interesa agendar una asesoría?"
                name="wantsMeeting"
                value={form.wantsMeeting}
                onChange={(event) => updateField('wantsMeeting', event.target.value)}
                error={errors.wantsMeeting}
                options={[
                  { label: 'Seleccione una opción', value: '' },
                  { label: 'Sí, quiero agendar asesoría', value: 'Sí' },
                  { label: 'No por ahora', value: 'No' },
                ]}
              />
            </>
          ) : null}

          {step === 7 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {summaryItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border/70 bg-background/40 px-4 py-3"
                  >
                    <p className="text-xs tracking-[0.18em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm leading-relaxed text-foreground">
                      {formatSummaryValue(value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="hidden">
                <TextField
                  label="Sitio web"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) => updateField('website', event.target.value)}
                />
              </div>

              <CheckboxField
                label={<PrivacyConsentCopy />}
                name="privacyAccepted"
                checked={form.privacyAccepted}
                onChange={(event) => updateField('privacyAccepted', event.target.checked)}
                error={errors.privacyAccepted}
                hint={siteConfig.legal.privacyPolicyVersionLabel}
              />
            </>
          ) : null}
        </div>

        <div aria-live="polite" className="mt-5 min-h-6 text-sm">
          {status.message ? (
            <p
              className={
                status.tone === 'error'
                  ? 'text-destructive'
                  : status.tone === 'success'
                    ? 'text-primary'
                    : 'text-muted-foreground'
              }
            >
              {status.message}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={previousStep}
              className="inline-flex items-center justify-center rounded-md border border-border bg-secondary/40 px-6 py-3.5 text-xs font-semibold tracking-widest text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              VOLVER
            </button>
          ) : null}

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3.5 text-xs font-semibold tracking-widest text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
            >
              CONTINUAR
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3.5 text-xs font-semibold tracking-widest text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'ENVIANDO...' : 'ENVIAR DIAGNÓSTICO'}
            </button>
          )}
        </div>
      </div>

      <aside className={`${panelClassName} h-fit`}>
        <p className="text-xs font-semibold tracking-[0.3em] text-primary">
          QUÉ OCURRE DESPUÉS
        </p>
        <div className="mt-5 space-y-4 text-sm text-muted-foreground">
          <p>
            Este diagnóstico está pensado para entender su operación sin hacerlo
            llenar un formulario interminable.
          </p>
          <p>
            Una vez active el destino real del flujo, el diagnóstico podrá
            enviarse a correo, CRM, seguimiento administrativo y n8n.
          </p>
          <p>
            Si prefiere avanzar más rápido, también puede agendar una asesoría
            inicial de 30 minutos.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <SiteAction href={siteConfig.routes.advisory}>
            AGENDAR ASESORÍA
          </SiteAction>
          <SiteAction href={siteConfig.routes.contact} variant="secondary">
            IR A CONTACTO
          </SiteAction>
        </div>
      </aside>
    </form>
  )
}
