import { siteConfig } from '@/config/site'

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

function pickPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value ?? ''
}

export function buildAdvisoryDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00${siteConfig.advisory.utcOffset}`)
}

export function formatDateValueInAdvisoryZone(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: siteConfig.advisory.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  return `${pickPart(parts, 'year')}-${pickPart(parts, 'month')}-${pickPart(parts, 'day')}`
}

export function formatTimeValueInAdvisoryZone(date: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: siteConfig.advisory.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  return `${pickPart(parts, 'hour')}:${pickPart(parts, 'minute')}`
}

export function getTodayInAdvisoryZone(now = new Date()) {
  return formatDateValueInAdvisoryZone(now)
}

export function addDaysToDateValue(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split('-').map(Number)
  const probe = new Date(Date.UTC(year, month - 1, day))
  probe.setUTCDate(probe.getUTCDate() + days)

  return `${probe.getUTCFullYear()}-${pad(probe.getUTCMonth() + 1)}-${pad(probe.getUTCDate())}`
}
