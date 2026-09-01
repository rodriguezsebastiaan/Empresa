'use client'

import { useEffect, useState } from 'react'
import { fieldClassName } from '@/components/form-controls'

type AvailabilityResponse = {
  slots?: Array<{ label: string; value: string }>
  message?: string
}

type AdminBookingRescheduleFormProps = {
  bookingId: string
  returnTo: string
  currentDate: string
  currentTime: string
  currentLabel: string
}

function formatDateForPreview(value: string) {
  if (!value) {
    return ''
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day, 12))

  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota',
  }).format(date)
}

export function AdminBookingRescheduleForm({
  bookingId,
  returnTo,
  currentDate,
  currentTime,
  currentLabel,
}: AdminBookingRescheduleFormProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [slots, setSlots] = useState<Array<{ label: string; value: string }>>([])
  const [message, setMessage] = useState('Seleccione una fecha para ver horarios libres.')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date) {
      return
    }

    let ignore = false

    async function loadSlots() {
      setLoading(true)
      setSlots([])
      setTime('')
      setMessage('Consultando horarios disponibles...')

      try {
        const response = await fetch(`/api/availability?date=${encodeURIComponent(date)}`)
        const payload = (await response.json()) as AvailabilityResponse

        if (ignore) {
          return
        }

        const nextSlots = payload.slots ?? []
        setSlots(nextSlots)
        setMessage(
          nextSlots.length > 0
            ? 'Seleccione el nuevo horario de la asesoría.'
            : payload.message ?? 'No hay horarios disponibles para este día.',
        )
      } catch {
        if (!ignore) {
          setMessage('No fue posible consultar la disponibilidad.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadSlots()

    return () => {
      ignore = true
    }
  }, [date])

  return (
    <form
      action={`/admin/api/reuniones/${bookingId}/reschedule`}
      method="post"
      className="rounded-2xl border border-primary/20 bg-primary/8 p-4"
    >
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="time" value={time} />

      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-primary">REAGENDAR</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Mueva esta asesoría a una fecha con horario disponible. Puede reprogramarse las veces
          que sea necesario; cada cambio queda registrado en el historial.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-border/70 bg-background/35 p-3">
        <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-muted-foreground">
          HORARIO ACTUAL
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{currentLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Registro interno: {currentDate} · {currentTime}
        </p>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-foreground">Nueva fecha</span>
        <input
          name="date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value)
            setTime('')
            setSlots([])
            setMessage(
              event.target.value
                ? 'Consultando horarios disponibles...'
                : 'Seleccione una fecha para ver horarios libres.',
            )
          }}
          className={fieldClassName}
          required
        />
      </label>

      <div className="mt-4 rounded-2xl border border-border/70 bg-background/35 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">Horarios libres</p>
          {loading ? <span className="text-xs text-primary">Consultando...</span> : null}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {slots.map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => setTime(slot.value)}
              className={
                time === slot.value
                  ? 'rounded-full border border-primary bg-primary/15 px-3 py-2 text-xs font-semibold tracking-[0.14em] text-primary'
                  : 'rounded-full border border-border/70 bg-background/40 px-3 py-2 text-xs font-semibold tracking-[0.14em] text-foreground transition-colors hover:border-primary/35 hover:text-primary'
              }
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/[0.07] p-3">
        <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-primary">
          NUEVO HORARIO
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {date && time
            ? `${formatDateForPreview(date)} · ${slots.find((slot) => slot.value === time)?.label ?? time}`
            : 'Seleccione fecha y hora para confirmar el cambio.'}
        </p>
      </div>

      <details className="mt-4 rounded-xl border border-border/70 bg-background/35 p-3">
        <summary className="cursor-pointer list-none text-xs font-semibold tracking-[0.16em] text-muted-foreground">
          AGREGAR NOTA OPCIONAL
        </summary>
        <label className="mt-3 block">
          <span className="text-sm font-medium text-foreground">Nota interna</span>
          <textarea
            name="note"
            placeholder="Ejemplo: Reprogramada por solicitud del cliente o imprevisto operativo."
            className={`${fieldClassName} min-h-[5rem] resize-y`}
          />
        </label>
      </details>

      <div className="mt-4">
        <button
          type="submit"
          disabled={!date || !time}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          CONFIRMAR REAGENDAMIENTO
        </button>
      </div>
    </form>
  )
}
