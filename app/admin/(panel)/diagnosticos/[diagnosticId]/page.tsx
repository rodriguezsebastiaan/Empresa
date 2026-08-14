import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdminDetailShell } from '@/components/admin/admin-detail-shell'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import {
  AdminCollapsiblePanel,
  AdminHistorySection,
  AdminInfoCard,
  AdminNotesSection,
  AdminRelatedActivity,
  AdminSectionCard,
  AdminTechnicalDetails,
} from '@/components/admin/admin-ui'
import { fieldClassName } from '@/components/form-controls'
import {
  diagnosticStatusOptions,
  formatAdminDateTime,
  getDiagnosticSubmissionDetail,
  getRelatedActivityForRecord,
  getStatusLabel,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminMailto, buildAdminPhone, buildAdminWhatsApp } from '@/lib/admin-links'
import { buildAdminDetailHref, buildAdminListHref } from '@/lib/admin-routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Detalle de diagnóstico | Konamy Systems',
  robots: {
    index: false,
    follow: false,
  },
}

type DiagnosticDetailPageProps = {
  params: Promise<{ diagnosticId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminDiagnosticDetailPage({
  params,
  searchParams,
}: DiagnosticDetailPageProps) {
  const { diagnosticId } = await params
  const filters = parseAdminListFilters(await searchParams)
  const detail = await getDiagnosticSubmissionDetail(diagnosticId)

  if (!detail) {
    notFound()
  }

  const relatedActivity = await getRelatedActivityForRecord({
    entity: 'diagnosticos',
    id: detail.id,
    emailNormalized: detail.emailNormalized,
    phone: detail.phone,
    company: detail.company,
  })

  const listHref = buildAdminListHref('/admin/diagnosticos', filters)
  const returnTo = buildAdminDetailHref('/admin/diagnosticos', detail.id, filters)

  return (
    <AdminDetailShell
      backHref={listHref}
      backLabel="VOLVER A DIAGNÓSTICOS"
      eyebrow="DETALLE DE DIAGNÓSTICO"
      title={detail.company}
      subtitle={`${detail.name}${detail.role ? ` · ${detail.role}` : ''} · ${formatAdminDateTime(detail.createdAt)}`}
      badges={
        <>
          <AdminStatusBadge status={detail.status} />
          <AdminStatusBadge status={detail.internalEmailStatus} compact />
          <AdminStatusBadge status={detail.clientEmailStatus} compact />
          <AdminStatusBadge status={detail.webhookStatus} compact />
          {detail.wantsMeeting ? (
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.16em] text-primary">
              QUIERE ASESORÍA
            </span>
          ) : null}
        </>
      }
      actions={[
        {
          label: 'ABRIR CORREO',
          kind: 'link',
          value: buildAdminMailto(detail.email, `Seguimiento de diagnóstico ${detail.company}`),
          icon: 'mail',
        },
        {
          label: 'WHATSAPP',
          kind: 'link',
          value: buildAdminWhatsApp(
            detail.phone,
            `Hola ${detail.name}, gracias por completar el diagnóstico empresarial de Konamy Systems.`,
          ),
          icon: 'whatsapp',
          external: true,
        },
        {
          label: 'COPIAR CORREO',
          kind: 'copy',
          value: detail.email,
          icon: 'copy',
        },
        {
          label: 'COPIAR TEL',
          kind: 'copy',
          value: detail.phone,
          icon: 'phone',
        },
      ]}
      primary={
        <>
          <AdminSectionCard
            title="DATOS DE LA EMPRESA"
            description="Información base para entender rápido la empresa, su contexto y la persona que completó el diagnóstico."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <AdminInfoCard label="EMPRESA">{detail.company}</AdminInfoCard>
              <AdminInfoCard label="CONTACTO">{detail.name}</AdminInfoCard>
              <AdminInfoCard label="CARGO">{detail.role}</AdminInfoCard>
              <AdminInfoCard label="SECTOR">{detail.sector}</AdminInfoCard>
              <AdminInfoCard label="CIUDAD">{detail.city}</AdminInfoCard>
              <AdminInfoCard label="EQUIPO">{detail.teamSize}</AdminInfoCard>
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
              <AdminInfoCard
                label="PREFERENCIA DE CONTACTO"
                hint={detail.wantsMeeting ? 'Pidió avanzar a una asesoría.' : 'No pidió asesoría por ahora.'}
                className="md:col-span-2"
              >
                {detail.contactPreference}
              </AdminInfoCard>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="RESUMEN EJECUTIVO"
            description="Lectura corta del diagnóstico para ubicar necesidad, contexto y siguiente paso sugerido."
          >
            <div className="grid gap-3 lg:grid-cols-2">
              <AdminInfoCard label="RESUMEN DEL DIAGNÓSTICO" className="lg:col-span-2">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.summary}</p>
              </AdminInfoCard>
              <AdminInfoCard label="NECESIDAD PRINCIPAL">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {detail.mainProblem}
                </p>
              </AdminInfoCard>
              <AdminInfoCard label="SIGUIENTE PASO / RESULTADO ESPERADO">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {detail.expectedResult}
                </p>
              </AdminInfoCard>
              <AdminInfoCard label="CONTEXTO OPERATIVO" className="lg:col-span-2">
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {detail.currentProcess}
                </p>
              </AdminInfoCard>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="DIAGNÓSTICO COMPLETO"
            description="Las respuestas se organizan por bloques para que la lectura se sienta más cercana a un informe empresarial."
          >
            <div className="space-y-4">
              <AdminCollapsiblePanel
                title="PROCESOS ACTUALES"
                summary="Flujos, areas o procesos que la empresa reporta hoy."
              >
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.processes}</p>
              </AdminCollapsiblePanel>

              <AdminCollapsiblePanel
                title="OPERACIÓN ACTUAL"
                summary="Descripción del proceso principal en su estado actual."
                defaultOpen={false}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.currentProcess}</p>
              </AdminCollapsiblePanel>

              <AdminCollapsiblePanel
                title="HERRAMIENTAS Y SISTEMAS"
                summary="Software, plataformas o métodos que la empresa ya usa."
                defaultOpen={false}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">{detail.tools}</p>
              </AdminCollapsiblePanel>

              <AdminCollapsiblePanel
                title="TAREAS REPETITIVAS"
                summary="Actividad manual o repetitiva que hoy genera fricción."
                defaultOpen={false}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {detail.repetitiveTasks}
                </p>
              </AdminCollapsiblePanel>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="ACTIVIDAD RELACIONADA"
            description="Relación comercial detectada con formularios breves, otros diagnósticos o asesorías."
          >
            <AdminRelatedActivity items={relatedActivity} />
          </AdminSectionCard>
        </>
      }
      secondary={
        <>
          <AdminSectionCard
            title="GESTIÓN"
            description="Actualice el avance comercial y registre el contexto del cambio."
          >
            <form
              action={`/admin/api/diagnosticos/${detail.id}/status`}
              method="post"
              className="space-y-4"
            >
              <input type="hidden" name="returnTo" value={returnTo} />
              <AdminInfoCard label="ESTADO ACTUAL">
                <AdminStatusBadge status={detail.status} />
              </AdminInfoCard>
              <label className="block">
                <span className="text-sm font-medium text-foreground">Nuevo estado</span>
                <select name="status" defaultValue={detail.status} className={fieldClassName}>
                  {diagnosticStatusOptions.map((status) => (
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
          </AdminSectionCard>

          <AdminSectionCard
            title="ENTREGA Y PRIVACIDAD"
            description="Consulte consentimiento y estados de entrega sin quitar foco al diagnóstico principal."
          >
            <div className="space-y-3">
              <AdminInfoCard
                label="PRIVACIDAD"
                hint={`Aceptada el ${formatAdminDateTime(detail.privacyAcceptedAt)}`}
              >
                {detail.privacyPolicyVersion}
              </AdminInfoCard>
              <AdminInfoCard label="ENTREGA">
                <div className="flex flex-wrap gap-2">
                  <AdminStatusBadge status={detail.internalEmailStatus} compact />
                  <AdminStatusBadge status={detail.clientEmailStatus} compact />
                  <AdminStatusBadge status={detail.webhookStatus} compact />
                </div>
                {detail.lastDeliveryError ? (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {detail.lastDeliveryError}
                  </p>
                ) : null}
              </AdminInfoCard>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="AGREGAR NOTA"
            description="Notas internas para seguimiento, propuesta o contexto adicional."
          >
            <form
              action={`/admin/api/diagnosticos/${detail.id}/notes`}
              method="post"
              className="space-y-4"
            >
              <input type="hidden" name="returnTo" value={returnTo} />
              <label className="block">
                <span className="text-sm font-medium text-foreground">Nota interna</span>
                <textarea
                  name="note"
                  required
                  className={`${fieldClassName} min-h-[8rem] resize-y`}
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center rounded-xl border border-border/70 bg-background/40 px-4 py-3 text-xs font-semibold tracking-[0.18em] text-foreground transition-colors hover:border-primary/35 hover:text-primary"
              >
                GUARDAR NOTA
              </button>
            </form>
          </AdminSectionCard>

          <AdminNotesSection
            items={detail.notes}
            emptyLabel="Todavía no hay notas internas para este diagnóstico."
          />

          <AdminHistorySection
            items={detail.statusHistory}
            emptyLabel="Todavía no hay cambios de estado registrados."
          />

          <AdminTechnicalDetails
            title="INFORMACIÓN TÉCNICA"
            items={[
              { label: 'Origen', value: detail.requestOrigin ?? 'Sin dato' },
              { label: 'Ruta', value: detail.requestPath ?? 'Sin dato' },
              { label: 'Referer', value: detail.referer ?? 'Sin dato' },
              { label: 'User-Agent', value: detail.userAgent ?? 'Sin dato' },
              { label: 'IP Hash', value: detail.ipHash ?? 'Sin dato' },
            ]}
          />
        </>
      }
    />
  )
}
