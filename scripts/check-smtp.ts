import dotenv from 'dotenv'
import {
  getAdminNotificationDestination,
  getMissingSmtpEnv,
  isSmtpConfigured,
  sendEmail,
  verifySmtpConnection,
} from '../lib/mailer'

dotenv.config({ path: '.env.local' })
dotenv.config()

const args = new Set(process.argv.slice(2))
const sendTest = args.has('--send')

function readArgValue(name: string) {
  const prefix = `${name}=`
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length).trim() ?? ''
}

async function main() {
  const missing = getMissingSmtpEnv()

  if (!isSmtpConfigured()) {
    console.log('SMTP no está configurado.')
    console.log(`Variables pendientes: ${missing.join(', ') || 'revise SMTP_PORT o SMTP_SECURE'}`)
    process.exitCode = 1
    return
  }

  console.log('Verificando conexión SMTP...')
  await verifySmtpConnection()
  console.log('Conexión SMTP verificada correctamente.')

  if (!sendTest) {
    console.log('No se envió correo de prueba. Use --send para enviar uno explícitamente.')
    return
  }

  const to =
    readArgValue('--to') ||
    getAdminNotificationDestination('CONTACT_DESTINATION_EMAIL')

  if (!to) {
    console.log('No hay destinatario para el correo de prueba.')
    console.log('Use --to=correo@dominio.com o configure ADMIN_NOTIFICATION_EMAIL.')
    process.exitCode = 1
    return
  }

  await sendEmail({
    to,
    subject: 'Prueba SMTP · Conexacod',
    text: [
      'Prueba de correo transaccional de Conexacod.',
      '',
      'Si recibió este mensaje, la conexión SMTP quedó verificada correctamente.',
      'No se incluyeron credenciales ni datos sensibles en esta prueba.',
    ].join('\n'),
    html: [
      '<p>Prueba de correo transaccional de <strong>Conexacod</strong>.</p>',
      '<p>Si recibió este mensaje, la conexión SMTP quedó verificada correctamente.</p>',
      '<p>No se incluyeron credenciales ni datos sensibles en esta prueba.</p>',
    ].join(''),
  })

  console.log(`Correo de prueba enviado a ${to}.`)
}

main().catch((error) => {
  console.error('No fue posible validar SMTP.')
  console.error(error instanceof Error ? error.message : 'Error desconocido.')
  process.exitCode = 1
})
