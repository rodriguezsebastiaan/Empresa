import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdminBookingRescheduleForm } from '@/components/admin/admin-booking-reschedule-form'
import { AdminDetailShell } from '@/components/admin/admin-detail-shell'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import {
  AdminInfoCard,
  AdminSectionCard,
} from '@/components/admin/admin-ui'
import { fieldClassName } from '@/components/form-controls'
import {
  formatAdvisoryDateTimeLabel,
  formatAdvisoryEndTimeLabel,
} from '@/lib/advisory-time'
import {
  advisoryBookingStatusOptions,
  formatAdminDateTime,
  getAdvisoryBookingDetail,
  getStatusLabel,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminMailto, buildAdminPhone, buildAdminWhatsApp } from '@/lib/admin-links'
import { buildAdminDetailHref, buildAdminListHref } from '@/lib/admin-routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Detalle de asesoría | Conexacod',
  robots: {
    index: false,
    follow: false,
  },
}

type BookingDetailPageProps = {
  params: Promise<{ bookingId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminBookingDetailPage({
  params,
  searchParams,
}: BookingDetailPageProps) {
  const { bookingId } = await params
  const filters = parseAdminListFilters(await searchParams)
  const detail = await getAdvisoryBookingDetail(bookingId)

  if (!detail) {
    notFound()
  }

  const listHref = buildAdminListHref('/admin/reuniones', filters)
  const returnTo = buildAdminDetailHref('/admin/reuniones', detail.id, filters)
  const meetUrl = detail.meetingUrl ?? detail.googleMeetUrl
  const scheduledLabel = formatAdvisoryDateTimeLabel(detail.scheduledDate, detail.scheduledTime)
  const endTimeLabel = formatAdvisoryEndTimeLabel(
    detail.scheduledDate,
    detail.scheduledTime,
    detail.durationMinutes,
  )

  return (
    <AdminDetailShell
      backHref={listHref}
      backLabel="VOLVER A ASESORÍAS"
      eyebrow="DETALLE DE ASESORÍA"
      title={detail.fullName}
      subtitle={`${detail.company} · ${scheduledLabel}`}
      badges={
        <>
          <AdminStatusBadge status={detail.status} />
          <AdminStatusBadge status={detail.calendarEventStatus} compact />
          <AdminStatusBadge status={detail.internalEmailStatus} compact />
          <AdminStatusBadge status={detail.clientEmailStatus} compact />
        </>
      }
      actions={[
        ...(meetUrl
          ? [
              {
                label: 'ABRIR MEET',
                kind: 'link' as const,
                value: meetUrl,
                icon: 'video' as const,
                external: true,
              },
              {
                label: 'COPIAR MEET',
                kind: 'copy' as const,
                value: meetUrl,
                icon: 'copy' as const,
              },
            ]
          : []),
        {
          label: 'ABRIR CORREO',
          kind: 'link',
          value: buildAdminMailto(detail.email, `Seguimiento de asesoría ${detail.company}`),
          icon: 'mail',
        },
        {
          label: 'WHATSAPP',
          kind: 'link',
          value: buildAdminWhatsApp(
            detail.phone,
            `Hola ${detail.fullName}, seguimos atentos a su asesoría con Conexacod.`,
          ),
          icon: 'whatsapp',
          external: true,
        },
      ]}
      primary={
        <>
          <AdminSectionCard
            title="DATOS DE LA ASESORÍA"
            description="Información central de cliente, empresa y horario, presentada con más amplitud para operación diaria."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <AdminInfoCard label="CLIENTE">{detail.fullName}</AdminInfoCard>
              <AdminInfoCard label="EMPRESA">{detail.company}</AdminInfoCard>
              <AdminInfoCard label="CORREO">
                <a href={buildAdminMailto(detail.email)} className="text-primary hover:opacity-80">
                  {detail.email}
                </a>
              </AdminInfoCard>
              <AdminInfoCard label="TELÉFONO">
                <a href={buildAdminPhone(detail.phone)} className="text-primary hover:opacity-80">
                  {detail.phone}
                </a>
              </AdminInfoCard>
              <AdminInfoCard label="MOTIVO / PROCESO" className="md:col-span-2">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {detail.processGoal}
                </p>
              </AdminInfoCard>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="AGENDA Y SINCRONIZACIÓN"
            description="Horario de la asesoría y estado de sus integraciones con Google Meet y Google Calendar."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <AdminInfoCard label="FECHA">{detail.scheduledDate}</AdminInfoCard>
              <AdminInfoCard label="HORA DE INICIO" hint={`${detail.durationMinutes} minutos`}>
                {scheduledLabel}
              </AdminInfoCard>
              <AdminInfoCard label="HORA FINAL">{endTimeLabel}</AdminInfoCard>
              <AdminInfoCard label="ZONA HORARIA">{detail.timezone}</AdminInfoCard>
              <AdminInfoCard label="MODALIDAD">{detail.modality}</AdminInfoCard>
              <AdminInfoCard label="CIUDAD">{detail.city}</AdminInfoCard>
              <AdminInfoCard label="GOOGLE MEET">
                {meetUrl ? (
                  <a
                    href={meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:opacity-80"
                  >
                    Abrir asesoría
                  </a>
                ) : (
                  'Sin enlace disponible.'
                )}
              </AdminInfoCard>
              <AdminInfoCard label="GOOGLE CALENDAR">
                {detail.googleCalendarHtmlLink ? (
                  <a
                    href={detail.googleCalendarHtmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:opacity-80"
                  >
                    Abrir evento
                  </a>
                ) : (
                  'Sin enlace HTML disponible.'
                )}
                <p className="mt-3 break-all text-xs text-muted-foreground">
                  ID: {detail.calendarEventId ?? detail.googleCalendarEventId ?? 'Sin dato'}
                </p>
                <p className="mt-1 break-all text-xs text-muted-foreground">
                  Calendario: {detail.calendarId ?? 'Sin dato'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sincronizado: {detail.calendarSyncedAt ? formatAdminDateTime(detail.calendarSyncedAt) : 'Sin dato'}
                </p>
              </AdminInfoCard>
            </div>
          </AdminSectionCard>

        </>
      }
      secondary={
        <>
          <AdminSectionCard
            title="GESTIÓN"
            description="Actualice el estado de la asesoría y documente reprogramaciones, cierre o novedades."
          >
            <AdminBookingRescheduleForm
              bookingId={detail.id}
              returnTo={returnTo}
              currentDate={detail.scheduledDate}
              currentTime={detail.scheduledTime}
              currentLabel={scheduledLabel}
            />

            <details className="mt-4 rounded-2xl border border-border/70 bg-background/35 p-4">
              <summary className="cursor-pointer list-none text-xs font-semibold tracking-[0.18em] text-muted-foreground">
                CAMBIAR ESTADO MANUALMENTE
              </summary>
            <form
              action={`/admin/api/reuniones/${detail.id}/status`}
              method="post"
              className="mt-4 space-y-4"
            >
              <input type="hidden" name="returnTo" value={returnTo} />
              <AdminInfoCard label="ESTADO ACTUAL">
                <AdminStatusBadge status={detail.status} />
              </AdminInfoCard>
              <label className="block">
                <span className="text-sm font-medium text-foreground">Nuevo estado</span>
                <select name="status" defaultValue={detail.status} className={fieldClassName}>
                  {advisoryBookingStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">Nota del cambio</span>
                <textarea name="note" className={`${fieldClassName} min-h-[7rem] resize-y`} />
              </label>
              <button
                type="submit"
                className="inline-flex items-center rounded-xl bg-primary px-4 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-8px_var(--primary)] transition-opacity hover:opacity-90"
              >
                GUARDAR ESTADO
              </button>
            </form>
            </details>
          </AdminSectionCard>

        </>
      }
    />
  )
}
