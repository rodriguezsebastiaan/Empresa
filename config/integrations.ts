import 'server-only'

export const integrationEnvConfig = {
  contact: {
    destinationEmailEnv: 'CONTACT_DESTINATION_EMAIL',
    fallbackDestinationEmailEnv: 'ADMIN_NOTIFICATION_EMAIL',
    smtpEnv: [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASSWORD',
      'SMTP_FROM_EMAIL',
      'SMTP_FROM_NAME',
      'SMTP_SECURE',
    ],
  },
  diagnostics: {
    destinationEmailEnv: 'DIAGNOSTIC_DESTINATION_EMAIL',
    fallbackDestinationEmailEnv: 'ADMIN_NOTIFICATION_EMAIL',
    smtpEnv: [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASSWORD',
      'SMTP_FROM_EMAIL',
      'SMTP_FROM_NAME',
      'SMTP_SECURE',
    ],
    webhookEnv: ['N8N_DIAGNOSTIC_WEBHOOK_URL', 'N8N_DIAGNOSTIC_WEBHOOK_SECRET'],
  },
  advisory: {
    destinationEmailEnv: 'BOOKING_DESTINATION_EMAIL',
    fallbackDestinationEmailEnv: 'ADMIN_NOTIFICATION_EMAIL',
    smtpEnv: [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASSWORD',
      'SMTP_FROM_EMAIL',
      'SMTP_FROM_NAME',
      'SMTP_SECURE',
    ],
    calendarEnv: [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GOOGLE_REFRESH_TOKEN',
      'GOOGLE_CALENDAR_ID',
      'NEXT_PUBLIC_SITE_URL',
    ],
  },
} as const
