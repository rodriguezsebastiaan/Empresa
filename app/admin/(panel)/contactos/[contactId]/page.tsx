import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdminDetailShell } from '@/components/admin/admin-detail-shell'
import { AdminStatusBadge } from '@/components/admin/admin-status-badge'
import {
  AdminHistorySection,
  AdminInfoCard,
  AdminNotesSection,
  AdminRelatedActivity,
  AdminSectionCard,
  AdminTechnicalDetails,
} from '@/components/admin/admin-ui'
import { fieldClassName } from '@/components/form-controls'
import {
  contactStatusOptions,
  formatAdminDateTime,
  getContactSubmissionDetail,
  getRelatedActivityForRecord,
  getStatusLabel,
  parseAdminListFilters,
} from '@/lib/admin-data'
import { buildAdminMailto, buildAdminPhone, buildAdminWhatsApp } from '@/lib/admin-links'
import { buildAdminDetailHref, buildAdminListHref } from '@/lib/admin-routes'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Detalle de contacto | Konamy Systems',
  robots: {
    index: false,
    follow: false,
  },
}

type ContactDetailPageProps = {
  params: Promise<{ contactId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminContactDetailPage({
  params,
  searchParams,
}: ContactDetailPageProps) {
  const { contactId } = await params
  const filters = parseAdminListFilters(await searchParams)
  const detail = await getContactSubmissionDetail(contactId)

  if (!detail) {
    notFound()
  }

  const relatedActivity = await getRelatedActivityForRecord({
    entity: 'contactos',
    id: detail.id,
    emailNormalized: detail.emailNormalized,
    phone: detail.phone,
    company: detail.company,
  })

  const listHref = buildAdminListHref('/admin/contactos', filters)
  const returnTo = buildAdminDetailHref('/admin/contactos', detail.id, filters)

  return (
    <AdminDetailShell
      backHref={listHref}
      backLabel="VOLVER A CONTACTOS"
      eyebrow="DETALLE DE CONTACTO"
      title={detail.name}
      subtitle={`${detail.company} · ${formatAdminDateTime(detail.createdAt)}`}
      badges={
        <>
          <AdminStatusBadge status={detail.status} />
          <AdminStatusBadge status={detail.internalEmailStatus} compact />
          <AdminStatusBadge status={detail.clientEmailStatus} compact />
        </>
      }
      actions={[
        {
          label: 'ABRIR CORREO',
          kind: 'link',
          value: buildAdminMailto(detail.email, `Seguimiento de ${detail.company}`),
          icon: 'mail',
        },
        {
          label: 'WHATSAPP',
          kind: 'link',
          value: buildAdminWhatsApp(
            detail.phone,
            `Hola ${detail.name}, gracias por escribir a Konamy Systems.`,
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
            title="INFORMACIÓN DEL CLIENTE"
            description="Datos clave para responder rápido sin perder el contexto comercial del formulario breve."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <AdminInfoCard label="NOMBRE">{detail.name}</AdminInfoCard>
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
              <AdminInfoCard label="SERVICIO / ASUNTO">{detail.subject}</AdminInfoCard>
              <AdminInfoCard label="FECHA DE INGRESO">
                {formatAdminDateTime(detail.createdAt)}
              </AdminInfoCard>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="MENSAJE RECIBIDO"
            description="Contenido completo del formulario breve, con un ancho de lectura más cómodo."
          >
            <div className="rounded-[1.35rem] border border-border/70 bg-background/30 p-5">
              <p className="whitespace-pre-wrap text-sm leading-8 text-foreground">
                {detail.message}
              </p>
            </div>
          </AdminSectionCard>

          <AdminSectionCard
            title="PRIVACIDAD Y ENTREGA"
            description="Consentimiento entregado por el cliente y estado real del envío asociado."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <AdminInfoCard
                label="CONSENTIMIENTO"
                hint={`Aceptado el ${formatAdminDateTime(detail.privacyAcceptedAt)}`}
              >
                {detail.privacyPolicyVersion}
              </AdminInfoCard>
              <AdminInfoCard label="RESULTADO DE ENTREGA">
                <div className="flex flex-wrap gap-2">
                  <AdminStatusBadge status={detail.internalEmailStatus} compact />
                  <AdminStatusBadge status={detail.clientEmailStatus} compact />
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
            title="ACTIVIDAD RELACIONADA"
            description="Diagnósticos, asesorías u otros contactos vinculados por correo o teléfono."
          >
            <AdminRelatedActivity items={relatedActivity} />
          </AdminSectionCard>
        </>
      }
      secondary={
        <>
          <AdminSectionCard
            title="GESTIÓN"
            description="Actualice el estado actual y documente el motivo del cambio."
          >
            <form
              action={`/admin/api/contactos/${detail.id}/status`}
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
                  {contactStatusOptions.map((status) => (
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
            title="AGREGAR NOTA"
            description="Las notas internas ayudan a mantener continuidad comercial entre revisiones."
          >
            <form
              action={`/admin/api/contactos/${detail.id}/notes`}
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
            emptyLabel="Todavía no hay notas internas para este contacto."
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
