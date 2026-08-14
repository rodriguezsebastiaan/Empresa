import { NextResponse } from 'next/server'
import {
  buildAvailabilityRangesFromTimes,
  ensureAvailabilitySettings,
  parseAvailabilityTimes,
  sanitizeAvailabilityDate,
  sanitizeAvailabilityNumber,
  sanitizeAvailabilityTime,
} from '@/lib/availability-service'
import { addDaysToDateValue, buildAdvisoryDateTime } from '@/lib/advisory-time'
import { getCurrentAdmin, isAdminActionOriginValid } from '@/lib/admin-auth'
import { getDb } from '@/lib/db'
import { sanitizeInline } from '@/lib/security'

function redirectBack(request: Request) {
  return NextResponse.redirect(new URL('/admin/reuniones/disponibilidad', request.url), {
    status: 303,
  })
}

async function replaceDateException({
  settingsId,
  date,
  type,
  reason,
  ranges,
}: {
  settingsId: string
  date: string
  type: 'BLOCKED_DAY' | 'SPECIAL_HOURS'
  reason: string | null
  ranges: Array<{ startTime: string; endTime: string; sortOrder: number }>
}) {
  const db = getDb()

  await db.$transaction(async (tx) => {
    await tx.availabilityException.deleteMany({
      where: { settingsId, date },
    })

    await tx.availabilityException.create({
      data: {
        settingsId,
        date,
        type,
        reason,
        ranges:
          type === 'SPECIAL_HOURS'
            ? {
                create: ranges,
              }
            : undefined,
      },
    })
  })
}

function getWeekday(date: string) {
  return buildAdvisoryDateTime(date, '12:00').getUTCDay()
}

function listDateRange(from: string, to: string, maxDays = 62) {
  const dates: string[] = []
  let cursor = from

  while (cursor <= to && dates.length <= maxDays) {
    dates.push(cursor)
    cursor = addDaysToDateValue(cursor, 1)
  }

  return dates
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin()

  if (!admin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (!isAdminActionOriginValid(request)) {
    return NextResponse.json({ success: false, message: 'Origen no permitido.' }, { status: 403 })
  }

  const formData = await request.formData()
  const action = sanitizeInline(String(formData.get('action') ?? ''))
  const settings = await ensureAvailabilitySettings()
  const db = getDb()

  if (action === 'settings') {
    await db.availabilitySettings.update({
      where: { id: settings.id },
      data: {
        isEnabled: formData.get('isEnabled') === 'on',
        durationMinutes: sanitizeAvailabilityNumber(formData.get('durationMinutes'), 45),
        bufferMinutes: sanitizeAvailabilityNumber(formData.get('bufferMinutes'), 15),
        minNoticeHours: sanitizeAvailabilityNumber(formData.get('minNoticeHours'), 12),
        maxDaysAhead: sanitizeAvailabilityNumber(formData.get('maxDaysAhead'), 30),
        defaultModality: sanitizeInline(String(formData.get('defaultModality') ?? 'Virtual')).slice(0, 80) || 'Virtual',
        calendarMockMode: sanitizeInline(String(formData.get('calendarMockMode') ?? 'none')).slice(0, 40) || 'none',
        updatedByAdminId: admin.id,
      },
    })
  }

  if (action === 'add-rule') {
    const weekday = sanitizeAvailabilityNumber(formData.get('weekday'), 1)
    const startTime = sanitizeAvailabilityTime(formData.get('startTime'))
    const endTime = sanitizeAvailabilityTime(formData.get('endTime'))

    if (weekday >= 0 && weekday <= 6 && startTime && endTime && startTime < endTime) {
      await db.availabilityRule.create({
        data: {
          settingsId: settings.id,
          weekday,
          startTime,
          endTime,
          sortOrder: sanitizeAvailabilityNumber(formData.get('sortOrder'), 10),
        },
      })
    }
  }

  if (action === 'update-rule') {
    const id = sanitizeInline(String(formData.get('id') ?? ''))
    const weekday = sanitizeAvailabilityNumber(formData.get('weekday'), 1)
    const startTime = sanitizeAvailabilityTime(formData.get('startTime'))
    const endTime = sanitizeAvailabilityTime(formData.get('endTime'))

    if (weekday >= 0 && weekday <= 6 && startTime && endTime && startTime < endTime) {
      await db.availabilityRule.updateMany({
        where: { id, settingsId: settings.id },
        data: {
          weekday,
          startTime,
          endTime,
          sortOrder: sanitizeAvailabilityNumber(formData.get('sortOrder'), 10),
        },
      })
    }
  }

  if (action === 'toggle-rule') {
    const id = sanitizeInline(String(formData.get('id') ?? ''))
    const rule = await db.availabilityRule.findFirst({ where: { id, settingsId: settings.id } })

    if (rule) {
      await db.availabilityRule.update({
        where: { id: rule.id },
        data: { isEnabled: !rule.isEnabled },
      })
    }
  }

  if (action === 'delete-rule') {
    const id = sanitizeInline(String(formData.get('id') ?? ''))
    await db.availabilityRule.deleteMany({ where: { id, settingsId: settings.id } })
  }

  if (action === 'save-specific-date') {
    const date = sanitizeAvailabilityDate(formData.get('date'))
    const type = String(formData.get('type') ?? '') === 'BLOCKED_DAY' ? 'BLOCKED_DAY' : 'SPECIAL_HOURS'
    const reason = sanitizeInline(String(formData.get('reason') ?? '')).slice(0, 180) || null
    const times = parseAvailabilityTimes(formData.get('times'))
    const ranges = buildAvailabilityRangesFromTimes(times, settings.durationMinutes)

    if (date && (type === 'BLOCKED_DAY' || ranges.length > 0)) {
      await replaceDateException({
        settingsId: settings.id,
        date,
        type,
        reason,
        ranges,
      })
    }
  }

  if (action === 'save-date-range') {
    const from = sanitizeAvailabilityDate(formData.get('from'))
    const to = sanitizeAvailabilityDate(formData.get('to'))
    const weekdays = new Set(
      formData
        .getAll('weekdays')
        .map((value) => Number.parseInt(String(value), 10))
        .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6),
    )
    const reason = sanitizeInline(String(formData.get('reason') ?? '')).slice(0, 180) || null

    if (from && to && from <= to && weekdays.size > 0) {
      const dates = listDateRange(from, to).filter((date) => weekdays.has(getWeekday(date)))

      for (const date of dates) {
        const weekday = getWeekday(date)
        const times = parseAvailabilityTimes(formData.get(`times_${weekday}`))
        const ranges = buildAvailabilityRangesFromTimes(times, settings.durationMinutes)

        if (ranges.length === 0) {
          continue
        }

        await replaceDateException({
          settingsId: settings.id,
          date,
          type: 'SPECIAL_HOURS',
          reason,
          ranges,
        })
      }
    }
  }

  if (action === 'reset-specific-date') {
    const date = sanitizeAvailabilityDate(formData.get('date'))

    if (date) {
      await db.availabilityException.deleteMany({ where: { settingsId: settings.id, date } })
    }
  }

  if (action === 'add-blocked-period') {
    const date = sanitizeAvailabilityDate(formData.get('date'))
    const startTime = sanitizeAvailabilityTime(formData.get('startTime'))
    const endTime = sanitizeAvailabilityTime(formData.get('endTime'))

    if (date && startTime && endTime && startTime < endTime) {
      await db.blockedPeriod.create({
        data: {
          settingsId: settings.id,
          date,
          startTime,
          endTime,
          reason: sanitizeInline(String(formData.get('reason') ?? '')).slice(0, 180) || null,
        },
      })
    }
  }

  if (action === 'update-blocked-period') {
    const id = sanitizeInline(String(formData.get('id') ?? ''))
    const date = sanitizeAvailabilityDate(formData.get('date'))
    const startTime = sanitizeAvailabilityTime(formData.get('startTime'))
    const endTime = sanitizeAvailabilityTime(formData.get('endTime'))

    if (date && startTime && endTime && startTime < endTime) {
      await db.blockedPeriod.updateMany({
        where: { id, settingsId: settings.id },
        data: {
          date,
          startTime,
          endTime,
          reason: sanitizeInline(String(formData.get('reason') ?? '')).slice(0, 180) || null,
        },
      })
    }
  }

  if (action === 'delete-blocked-period') {
    const id = sanitizeInline(String(formData.get('id') ?? ''))
    await db.blockedPeriod.deleteMany({ where: { id, settingsId: settings.id } })
  }

  return redirectBack(request)
}
