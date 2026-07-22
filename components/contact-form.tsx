'use client'

import { useState } from 'react'
import { CheckboxField, TextareaField, TextField, panelClassName } from '@/components/form-controls'
import { PrivacyConsentCopy } from '@/components/privacy-consent-copy'
import { SiteAction } from '@/components/site-action'
import { siteConfig } from '@/config/site'
import { validateContactForm, type ContactFormData, type FieldErrors } from '@/lib/validation'

const initialState: ContactFormData = {
  name: '',
  company: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacyAccepted: false,
  website: '',
}

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialState)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    tone: 'neutral' | 'error' | 'success'
    message: string
  }>({
    tone: 'neutral',
    message: '',
  })

  function updateField<K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ tone: 'neutral', message: '' })

    const result = validateContactForm(form)

    if (!result.success) {
      setErrors(result.errors)
      setStatus({
        tone: 'error',
        message: 'Revise los campos marcados antes de continuar.',
      })
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
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
      }

      if (!response.ok) {
        setErrors(payload.errors ?? {})
        setStatus({
          tone: 'error',
          message:
            payload.message ??
            'No fue posible procesar el formulario de contacto en este momento.',
        })
        return
      }

      setStatus({
        tone: 'success',
        message: payload.message ?? 'La solicitud fue enviada correctamente.',
      })
      setForm(initialState)
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
    <form onSubmit={handleSubmit} className={panelClassName}>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Nombre"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          error={errors.name}
          maxLength={80}
        />
        <TextField
          label="Empresa"
          name="company"
          autoComplete="organization"
          value={form.company}
          onChange={(event) => updateField('company', event.target.value)}
          error={errors.company}
          maxLength={80}
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
      </div>

      <div className="mt-5">
        <TextField
          label="Asunto"
          name="subject"
          value={form.subject}
          onChange={(event) => updateField('subject', event.target.value)}
          error={errors.subject}
          maxLength={100}
        />
      </div>

      <div className="mt-5">
        <TextareaField
          label="Mensaje"
          name="message"
          value={form.message}
          onChange={(event) => updateField('message', event.target.value)}
          error={errors.message}
          maxLength={1200}
          placeholder="Cuéntenos qué proceso desea mejorar, qué problema enfrenta o qué tipo de solución necesita."
        />
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

      <div
        aria-live="polite"
        className="mt-5 min-h-6 text-sm"
      >
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
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3.5 text-xs font-semibold tracking-widest text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'ENVIANDO...' : 'ENVIAR CONSULTA'}
        </button>
        <SiteAction href={siteConfig.routes.advisory} variant="secondary">
          AGENDAR ASESORÍA
        </SiteAction>
      </div>
    </form>
  )
}
