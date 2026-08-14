'use client'

import { useMemo, useState } from 'react'
import { fieldClassName } from '@/components/form-controls'
import { weekdayLabels, type AvailabilityDateMode, type AvailabilityDateSummary } from '@/lib/availability-types'
import { cn } from '@/lib/utils'

type DateException = {
  id: string
  date: string
  type: 'BLOCKED_DAY' | 'SPECIAL_HOURS'
  reason: string | null
  ranges: Array<{
    startTime: string
    endTime: string
  }>
}

type AvailabilityDatePlannerProps = {
  actionPath: string
  dateSummaries: AvailabilityDateSummary[]
  exceptions: DateException[]
}

const modeLabels: Record<AvailabilityDateMode, string> = {
  weekly: 'Regla semanal',
  special: 'Horario especial',
  blocked: 'Bloqueado',
  none: 'Sin disponibilidad',
}

const modeClasses: Record<AvailabilityDateMode, string> = {
  weekly: 'border-sky-300/25 bg-sky-300/10 text-sky-100',
  special: 'border-primary/35 bg-primary/12 text-primary',
  blocked: 'border-rose-300/25 bg-rose-300/10 text-rose-100',
  none: 'border-border/70 bg-background/35 text-muted-foreground',
}

function SubmitButton({
  children,
  subtle = false,
  disabled = false,
}: {
  children: string
  subtle?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={
        subtle
          ? 'inline-flex items-center justify-center rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-foreground transition-colors hover:border-primary/35 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45'
          : 'inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45'
      }
    >
      {children}
    </button>
  )
}

function toMonthKey(dateValue: string) {
  return dateValue.slice(0, 7)
}

function addMonths(monthKey: string, offset: number) {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1 + offset, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

function buildMonthDays(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number)
  const first = new Date(Date.UTC(year, month - 1, 1))
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const leadingBlanks = first.getUTCDay()
  const blanks = Array.from({ length: leadingBlanks }, () => null)
  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    return `${monthKey}-${String(day).padStart(2, '0')}`
  })

  return [...blanks, ...days]
}

function formatMonthLabel(monthKey: string) {
  return new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${monthKey}-01T12:00:00-05:00`))
}

function formatLongDateLabel(dateValue: string) {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${dateValue}T12:00:00-05:00`))
}

function exceptionTimes(exception?: DateException) {
  return exception?.ranges.map((range) => range.startTime).join('\n') ?? '09:00\n10:00\n11:00\n14:00\n15:00'
}

function findException(exceptions: DateException[], dateValue: string) {
  return exceptions.find((exception) => exception.date === dateValue)
}

const plannerWeekdays = weekdayLabels.map((label, index) => ({ label, value: index }))
const defaultPlannerWeekdays = plannerWeekdays
  .filter((day) => day.value >= 1 && day.value <= 5)
  .map((day) => day.value)
const timePresets = {
  full: '09:00\n10:00\n11:00\n14:00\n15:00\n16:00',
  morning: '09:00\n10:00\n11:00',
  afternoon: '14:00\n15:00\n16:00',
  empty: '',
} as const

function countTimeEntries(value: string) {
  return value.split(/[\s,;]+/).map((time) => time.trim()).filter(Boolean).length
}

function SummaryMetric({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: number | string
  tone?: 'neutral' | 'success' | 'warning'
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-background/45 p-3',
        tone === 'success'
          ? 'border-primary/30'
          : tone === 'warning'
            ? 'border-amber-300/25'
            : 'border-border/70',
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  )
}

function countDatesInRange(from: string, to: string, weekdays: number[], maxDays = 62) {
  if (!from || !to || from > to || weekdays.length === 0) {
    return 0
  }

  const allowedWeekdays = new Set(weekdays)
  let count = 0
  let cursor = new Date(`${from}T12:00:00-05:00`)
  const end = new Date(`${to}T12:00:00-05:00`)

  while (cursor <= end && count <= maxDays) {
    if (allowedWeekdays.has(cursor.getDay())) {
      count += 1
    }

    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)
  }

  return count
}

export function AvailabilityDatePlanner({
  actionPath,
  dateSummaries,
  exceptions,
}: AvailabilityDatePlannerProps) {
  const firstDate = dateSummaries[0]?.date ?? new Date().toISOString().slice(0, 10)
  const lastDate = dateSummaries.at(-1)?.date ?? firstDate
  const [selectedDate, setSelectedDate] = useState(firstDate)
  const [visibleMonth, setVisibleMonth] = useState(toMonthKey(firstDate))
  const [rangeFrom, setRangeFrom] = useState(firstDate)
  const [rangeTo, setRangeTo] = useState(lastDate)
  const [planFrom, setPlanFrom] = useState(firstDate)
  const [planTo, setPlanTo] = useState(lastDate)
  const [planWeekdays, setPlanWeekdays] = useState(defaultPlannerWeekdays)
  const [planTimesByDay, setPlanTimesByDay] = useState<Record<number, string>>({
    1: '09:00\n10:00\n11:00\n14:00\n15:00',
    2: '09:00\n10:00\n11:00\n14:00\n15:00',
    3: '09:00\n10:00\n11:00\n14:00\n15:00',
    4: '09:00\n10:00\n11:00\n14:00\n15:00',
    5: '09:00\n10:00\n11:00',
  })
  const summariesByDate = useMemo(
    () => new Map(dateSummaries.map((summary) => [summary.date, summary])),
    [dateSummaries],
  )
  const selectedSummary = summariesByDate.get(selectedDate)
  const selectedException = findException(exceptions, selectedDate)
  const selectedMode = selectedSummary?.mode ?? 'none'
  const monthDays = buildMonthDays(visibleMonth)
  const filteredSummaries = dateSummaries.filter(
    (summary) => summary.date >= rangeFrom && summary.date <= rangeTo,
  )
  const filteredSpecialDays = filteredSummaries.filter(
    (summary) => summary.mode === 'special' || summary.mode === 'blocked' || summary.activeBookings > 0,
  )
  const planTimeCount = planWeekdays.reduce((total, weekday) => {
    const times = planTimesByDay[weekday] ?? ''
    return total + countTimeEntries(times)
  }, 0)
  const planDateCount = countDatesInRange(planFrom, planTo, planWeekdays)
  const planSlotCount = dateSummaries
    .filter((summary) => summary.date >= planFrom && summary.date <= planTo && planWeekdays.includes(summary.weekday))
    .reduce((total, summary) => {
      const times = planTimesByDay[summary.weekday] ?? ''
      return total + countTimeEntries(times)
    }, 0)
  const planHasEmptySelectedDay = planWeekdays.some((weekday) => countTimeEntries(planTimesByDay[weekday] ?? '') === 0)
  const planIsReady = planDateCount > 0 && planSlotCount > 0 && !planHasEmptySelectedDay && planFrom <= planTo

  function selectDate(dateValue: string) {
    setSelectedDate(dateValue)
    setVisibleMonth(toMonthKey(dateValue))
  }

  function togglePlanWeekday(value: number) {
    setPlanWeekdays((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value].sort((first, second) => first - second),
    )
  }

  function updatePlanTimes(weekday: number, value: string) {
    setPlanTimesByDay((current) => ({
      ...current,
      [weekday]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <form
        action={actionPath}
        method="post"
        className="overflow-hidden rounded-[1.45rem] border border-primary/20 bg-[linear-gradient(135deg,rgba(45,242,230,0.07),rgba(4,13,20,0.56)_42%,rgba(4,13,20,0.78))] shadow-[0_20px_70px_-58px_var(--primary)]"
      >
        <input type="hidden" name="action" value="save-date-range" />
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="p-4 lg:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold tracking-[0.24em] text-primary">PLANIFICACION MENSUAL</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">
                  Construya el calendario que veran los clientes.
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Defina el periodo, seleccione los dias de atencion y ajuste las horas de cada dia
                  con plantillas rapidas o edicion manual.
                </p>
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-primary">
                Control administrativo
              </span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-2xl border border-border/70 bg-background/45 p-3">
                <p className="text-xs font-semibold tracking-[0.18em] text-primary">1. PERIODO</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <label>
                    <span className="text-sm font-medium text-foreground">Desde</span>
                    <input
                      name="from"
                      type="date"
                      value={planFrom}
                      onChange={(event) => setPlanFrom(event.target.value)}
                      className={fieldClassName}
                      required
                    />
                  </label>
                  <label>
                    <span className="text-sm font-medium text-foreground">Hasta</span>
                    <input
                      name="to"
                      type="date"
                      value={planTo}
                      onChange={(event) => setPlanTo(event.target.value)}
                      className={fieldClassName}
                      required
                    />
                  </label>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Recomendado: programe de 2 a 4 semanas para mantener la agenda actualizada.
                </p>
              </div>

              <fieldset className="rounded-2xl border border-border/70 bg-background/45 p-3">
                <legend className="px-1 text-xs font-semibold tracking-[0.18em] text-primary">2. DIAS</legend>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4 lg:grid-cols-3">
                  {plannerWeekdays.map((day) => {
                    const checked = planWeekdays.includes(day.value)

                    return (
                      <label
                        key={day.value}
                        className={cn(
                          'flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition-colors',
                          checked
                            ? 'border-primary/35 bg-primary/10 text-foreground'
                            : 'border-border/70 bg-background/30',
                        )}
                      >
                        <span>{day.label}</span>
                        <input
                          type="checkbox"
                          name="weekdays"
                          value={day.value}
                          checked={checked}
                          onChange={() => togglePlanWeekday(day.value)}
                          className="size-4 rounded border-border bg-background accent-primary"
                        />
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div className="rounded-2xl border border-border/70 bg-background/45 p-3 lg:col-span-2">
                <span className="text-xs font-semibold tracking-[0.18em] text-primary">3. HORARIOS POR DIA</span>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Use una plantilla para avanzar rapido y ajuste manualmente cuando un dia tenga una agenda diferente.
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {planWeekdays.length === 0 ? (
                    <div className="rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 text-xs leading-relaxed text-amber-50 md:col-span-2 xl:col-span-3">
                      Seleccione al menos un dia de atencion para configurar horarios.
                    </div>
                  ) : null}
                  {plannerWeekdays
                    .filter((day) => planWeekdays.includes(day.value))
                    .map((day) => {
                      const timeCount = countTimeEntries(planTimesByDay[day.value] ?? '')

                      return (
                        <div key={day.value} className="rounded-xl border border-border/70 bg-background/35 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-foreground">{day.label}</span>
                            <span
                              className={cn(
                                'rounded-full border px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.12em]',
                                timeCount > 0
                                  ? 'border-primary/30 bg-primary/10 text-primary'
                                  : 'border-amber-300/25 bg-amber-300/10 text-amber-100',
                              )}
                            >
                              {timeCount > 0 ? `${timeCount} cupos` : 'Sin horas'}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => updatePlanTimes(day.value, timePresets.full)}
                              className="rounded-lg border border-border/70 bg-background/45 px-2 py-1.5 text-[0.65rem] font-semibold text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                            >
                              COMPLETO
                            </button>
                            <button
                              type="button"
                              onClick={() => updatePlanTimes(day.value, timePresets.morning)}
                              className="rounded-lg border border-border/70 bg-background/45 px-2 py-1.5 text-[0.65rem] font-semibold text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                            >
                              MANANA
                            </button>
                            <button
                              type="button"
                              onClick={() => updatePlanTimes(day.value, timePresets.afternoon)}
                              className="rounded-lg border border-border/70 bg-background/45 px-2 py-1.5 text-[0.65rem] font-semibold text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
                            >
                              TARDE
                            </button>
                            <button
                              type="button"
                              onClick={() => updatePlanTimes(day.value, timePresets.empty)}
                              className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-2 py-1.5 text-[0.65rem] font-semibold text-rose-100 transition-colors hover:border-rose-300/35"
                            >
                              LIMPIAR
                            </button>
                          </div>
                          <label className="mt-3 block">
                            <span className="sr-only">Horas disponibles para {day.label}</span>
                            <textarea
                              name={`times_${day.value}`}
                              value={planTimesByDay[day.value] ?? ''}
                              onChange={(event) => updatePlanTimes(day.value, event.target.value)}
                              placeholder={'09:00\n10:00\n14:00'}
                              className={`${fieldClassName} min-h-24 resize-y font-mono text-xs`}
                              required
                            />
                          </label>
                        </div>
                      )
                    })}
                </div>
              </div>

              <label className="rounded-2xl border border-border/70 bg-background/45 p-3 lg:col-span-2">
                <span className="text-xs font-semibold tracking-[0.18em] text-primary">4. NOTA INTERNA</span>
                <span className="mt-3 block text-sm font-medium text-foreground">Observacion interna opcional</span>
                <input
                  name="reason"
                  placeholder="Ejemplo: Agenda agosto, atencion comercial, jornada especial..."
                  className={fieldClassName}
                />
                <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                  Esta nota solo la vera el equipo administrativo. No se muestra al cliente.
                </span>
              </label>
            </div>
          </div>

          <aside className="border-t border-primary/15 bg-background/50 p-4 xl:border-l xl:border-t-0 lg:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-primary">REVISION</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">
                  {planIsReady ? 'Plan listo para guardar.' : 'Complete la planificacion.'}
                </h3>
              </div>
              <span
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold tracking-[0.12em]',
                  planIsReady
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-amber-300/25 bg-amber-300/10 text-amber-100',
                )}
              >
                {planIsReady ? 'LISTO' : 'PENDIENTE'}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <SummaryMetric label="Fechas que se guardaran" value={planDateCount} tone={planDateCount > 0 ? 'success' : 'warning'} />
              <SummaryMetric label="Cupos visibles estimados" value={planSlotCount} tone={planSlotCount > 0 ? 'success' : 'warning'} />
              <SummaryMetric label="Horas configuradas por semana" value={planTimeCount} />
            </div>

            {!planIsReady ? (
              <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-3 text-xs leading-relaxed text-amber-50">
                Revise que el rango sea valido, que haya al menos un dia activo y que cada dia seleccionado tenga horarios.
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-relaxed text-amber-50">
              Guardar este rango actualiza las fechas seleccionadas. Si una fecha estaba bloqueada o tenia
              otro horario especial, sera reemplazada por esta nueva planificacion.
            </div>

            <div className="mt-4">
              <SubmitButton disabled={!planIsReady}>GUARDAR PLANIFICACION</SubmitButton>
            </div>
          </aside>
        </div>
      </form>

      <div className="rounded-2xl border border-border/70 bg-background/30 p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <label>
            <span className="text-sm font-medium text-foreground">Ver disponibilidad desde</span>
            <input
              type="date"
              value={rangeFrom}
              onChange={(event) => setRangeFrom(event.target.value || firstDate)}
              className={fieldClassName}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-foreground">Hasta</span>
            <input
              type="date"
              value={rangeTo}
              onChange={(event) => setRangeTo(event.target.value || lastDate)}
              className={fieldClassName}
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setRangeFrom(firstDate)
                setRangeTo(lastDate)
                setVisibleMonth(toMonthKey(firstDate))
                setSelectedDate(firstDate)
              }}
              className="inline-flex w-full items-center justify-center rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-foreground transition-colors hover:border-primary/35 hover:text-primary"
            >
              LIMPIAR RANGO
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(modeLabels).map(([mode, label]) => (
              <span
                key={mode}
                className={cn(
                  'rounded-full border px-3 py-1 font-semibold tracking-[0.14em]',
                  modeClasses[mode as AvailabilityDateMode],
                )}
              >
                {label}
              </span>
            ))}
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 font-semibold tracking-[0.14em] text-amber-100">
              Con reservas
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {filteredSpecialDays.length} dia{filteredSpecialDays.length === 1 ? '' : 's'} con cambios o reservas.
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
        <section className="rounded-2xl border border-border/70 bg-background/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">CALENDARIO MENSUAL</p>
              <h2 className="mt-2 text-xl font-semibold capitalize text-foreground">
                {formatMonthLabel(visibleMonth)}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                className="rounded-xl border border-border/70 bg-background/40 px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/35 hover:text-primary"
              >
                ANTERIOR
              </button>
              <button
                type="button"
                onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                className="rounded-xl border border-border/70 bg-background/40 px-3 py-2 text-xs font-semibold text-foreground hover:border-primary/35 hover:text-primary"
              >
                SIGUIENTE
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {weekdayLabels.map((day) => (
              <span key={day}>{day.slice(0, 3)}</span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-2">
            {monthDays.map((dateValue, index) => {
              if (!dateValue) {
                return <div key={`blank-${index}`} />
              }

              const summary = summariesByDate.get(dateValue)
              const mode = summary?.mode ?? 'none'
              const selected = selectedDate === dateValue
              const outsideRange = dateValue < rangeFrom || dateValue > rangeTo

              return (
                <button
                  key={dateValue}
                  type="button"
                  onClick={() => selectDate(dateValue)}
                  className={cn(
                    'min-h-24 rounded-2xl border p-2 text-left transition-colors',
                    outsideRange && 'opacity-35',
                    selected
                      ? 'border-primary bg-primary/14 shadow-[0_0_26px_-18px_var(--primary)]'
                      : 'border-border/70 bg-background/25 hover:border-primary/35',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{dateValue.slice(-2)}</span>
                    <span
                      className={cn(
                        'rounded-full border px-1.5 py-0.5 text-[0.52rem] font-semibold tracking-[0.08em]',
                        modeClasses[mode],
                      )}
                    >
                      {mode === 'special' ? 'ESP' : mode === 'blocked' ? 'BLQ' : mode === 'weekly' ? 'SEM' : 'SIN'}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[0.68rem] leading-relaxed text-muted-foreground">
                    {summary?.availableStarts.length
                      ? summary.availableStarts.slice(0, 3).join(', ')
                      : 'Sin horas'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {summary?.activeBookings ? (
                      <span className="rounded-full bg-amber-300/15 px-1.5 py-0.5 text-[0.55rem] font-semibold text-amber-100">
                        {summary.activeBookings} reserva{summary.activeBookings === 1 ? '' : 's'}
                      </span>
                    ) : null}
                    {summary?.blockedPeriods ? (
                      <span className="rounded-full bg-rose-300/15 px-1.5 py-0.5 text-[0.55rem] font-semibold text-rose-100">
                        {summary.blockedPeriods} bloqueo{summary.blockedPeriods === 1 ? '' : 's'}
                      </span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <aside className="rounded-2xl border border-border/70 bg-background/30 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary">FECHA SELECCIONADA</p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">
                {formatLongDateLabel(selectedDate)}
              </h2>
            </div>
            <span className={cn('rounded-full border px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em]', modeClasses[selectedMode])}>
              {modeLabels[selectedMode]}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-background/35 px-4 py-3">
              <p className="text-xs tracking-[0.14em] text-muted-foreground">Reservas activas</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{selectedSummary?.activeBookings ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/35 px-4 py-3">
              <p className="text-xs tracking-[0.14em] text-muted-foreground">Horas base</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{selectedSummary?.availableStarts.length ?? 0}</p>
            </div>
          </div>

          {(selectedSummary?.activeBookings ?? 0) > 0 ? (
            <div className="mt-4 rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-xs leading-relaxed text-amber-50">
              Esta fecha tiene reservas activas. Antes de modificar, bloquear o restablecer sus
              horarios, revise que el cambio no afecte reuniones ya confirmadas.
            </div>
          ) : null}

          <form action={actionPath} method="post" className="mt-5 grid gap-4">
            <input type="hidden" name="action" value="save-specific-date" />
            <label>
              <span className="text-sm font-medium text-foreground">Fecha</span>
              <input
                name="date"
                type="date"
                value={selectedDate}
                onChange={(event) => selectDate(event.target.value)}
                className={fieldClassName}
                required
              />
            </label>
            <label>
              <span className="text-sm font-medium text-foreground">Estado de la fecha</span>
              <select
                name="type"
                key={`${selectedDate}-${selectedException?.type ?? 'SPECIAL_HOURS'}`}
                defaultValue={selectedException?.type ?? 'SPECIAL_HOURS'}
                className={fieldClassName}
              >
                <option value="SPECIAL_HOURS">Usar horarios especificos</option>
                <option value="BLOCKED_DAY">Bloquear fecha completa</option>
              </select>
            </label>
            <label>
              <span className="text-sm font-medium text-foreground">Horas disponibles</span>
              <textarea
                key={`${selectedDate}-${selectedException?.id ?? 'new'}`}
                name="times"
                defaultValue={exceptionTimes(selectedException)}
                className={`${fieldClassName} min-h-36 resize-y font-mono`}
                aria-describedby="selected-times-help"
              />
              <span id="selected-times-help" className="mt-2 block text-xs text-muted-foreground">
                Una hora por linea. Si la fecha queda como bloqueo completo, estas horas se ignoran.
              </span>
            </label>
            <label>
              <span className="text-sm font-medium text-foreground">Observacion interna</span>
              <input
                key={`${selectedDate}-${selectedException?.reason ?? 'reason'}`}
                name="reason"
                defaultValue={selectedException?.reason ?? ''}
                placeholder="Ejemplo: Viaje, reunion, capacitacion..."
                className={fieldClassName}
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <SubmitButton>GUARDAR FECHA</SubmitButton>
            </div>
          </form>

          <form action={actionPath} method="post" className="mt-3">
            <input type="hidden" name="action" value="reset-specific-date" />
            <input type="hidden" name="date" value={selectedDate} />
            <SubmitButton subtle>RESTABLECER REGLA SEMANAL</SubmitButton>
          </form>
        </aside>
      </div>
    </div>
  )
}
