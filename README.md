# Konamy Systems · Producción 1.0

Esta base queda preparada para publicar la versión 1.0 del sitio sin crear nuevas páginas para `/automatizaciones`, `/sectores` o `/proyectos`.

## Variables de entorno

Copie `.env.example` a `.env.local` y reemplace todos los placeholders antes del despliegue final.

### Sitio y SEO

- `NEXT_PUBLIC_SITE_URL`
  Debe apuntar al dominio público final. Mientras no exista, el proyecto usa un placeholder `.invalid` para evitar referencias a `localhost`.

### Contacto por correo

- `CONTACT_DESTINATION_EMAIL`
  Buzón real que recibirá el formulario de contacto.
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`
- `SMTP_SECURE`

Sin estas variables, `/api/contact` responderá `503` y no fingirá éxito.

### Diagnóstico por correo y n8n

- `DIAGNOSTIC_DESTINATION_EMAIL`
  Buzón real que recibirá el diagnóstico por correo.
- `N8N_DIAGNOSTIC_WEBHOOK_URL`
  URL real del webhook administrativo.
- `N8N_DIAGNOSTIC_WEBHOOK_SECRET`
  Se usa para firmar el payload en `X-Konamy-Signature`.

El diagnóstico puede entregar por correo, por webhook o por ambos. Si ninguno está configurado, `/api/diagnostico` responderá `503`. Si solo uno funciona, la API responde con éxito parcial y lo informa claramente.

### Google Calendar y Google Meet

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`

Sin estas credenciales, `/api/availability` y `/api/advisory-bookings` bloquean la reserva real y no simulan disponibilidad ni creación de citas.

## Comportamiento SEO mientras faltan datos reales

- Si `NEXT_PUBLIC_SITE_URL` sigue apuntando a un placeholder `.invalid` o a un valor provisional, la metadata marca el sitio como `noindex`.
- En ese mismo estado, `robots.txt` bloquea el rastreo y `sitemap.xml` no publica URLs definitivas.
- Cuando llegue el dominio real, basta con reemplazar `NEXT_PUBLIC_SITE_URL` para habilitar canonical, Open Graph, Twitter Cards, `robots` y `sitemap` con el dominio correcto.

## Rate limiting actual

Las APIs públicas usan un rate limiting básico en memoria por dirección IP y responden con `429` cuando se supera el umbral:

- `/api/contact`: 5 intentos por 10 minutos.
- `/api/diagnostico`: 4 intentos por 15 minutos.
- `/api/availability`: 40 consultas por 5 minutos.
- `/api/advisory-bookings`: 6 intentos por 30 minutos.

La solución actual es suficiente para una salida 1.0 básica en un solo runtime. Si luego se despliega en múltiples instancias, conviene mover este control a un store compartido.

## Errores controlados y seguridad

- Las APIs públicas de contacto, diagnóstico y reservas aceptan únicamente `application/json`.
- Si el `Content-Type` no es correcto, responden `415`.
- Si el cuerpo no contiene JSON válido, responden `400`.
- No se exponen logs con datos personales en servidor dentro del flujo actual.
- `next.config.mjs` aplica headers de seguridad base, incluyendo `Content-Security-Policy`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` y `Strict-Transport-Security`.

## Pruebas reales de Google Calendar y Meet

Con credenciales reales, la validación mínima recomendada antes de publicar es:

1. Definir `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` y `NEXT_PUBLIC_SITE_URL`.
2. Consultar `/api/availability?date=AAAA-MM-DD` con una fecha hábil dentro de la ventana configurada.
3. Confirmar que la respuesta devuelve horarios reales y respeta cruces, anticipación mínima y buffer.
4. Crear una reserva desde `/agendar-asesoria`.
5. Verificar en Google Calendar que se cree el evento con invitado, enlace de Google Meet, recordatorios por correo y descripción con contexto de la solicitud.
6. Confirmar que el invitado reciba la invitación y que una segunda reserva del mismo slot falle o deje de mostrarse.

Sin credenciales válidas, la interfaz debe bloquear disponibilidad y reservas reales con un mensaje claro. Ese es el comportamiento esperado actual.

## Datos todavía pendientes

Los siguientes placeholders siguen centralizados en [config/site.ts](C:/xampp/htdocs/KONAMY/config/site.ts):

- Dominio final público.
- Correo de contacto real.
- Correo legal real.
- Número telefónico real.
- Número de WhatsApp real.
- Titular legal o razón social definitiva.
- Dirección legal definitiva.
- Texto legal definitivo de privacidad.

## Comportamiento actual esperado

- `/privacidad` existe con texto provisional claramente identificado.
- `app/not-found.tsx` reemplaza la página 404 genérica.
- `robots`, `sitemap`, `manifest` e iconos reales ya están expuestos.
- Contacto y diagnóstico validan en cliente y servidor, sanitizan la entrada y no confirman éxito sin integración real.
- Asesoría mantiene Google Calendar/Meet como flujo real y devuelve bloqueo claro cuando faltan credenciales.

## Checklist de despliegue

- Reemplazar todos los placeholders legales, de contacto y dominio.
- Confirmar que `NEXT_PUBLIC_SITE_URL` ya sea el dominio público final.
- Cargar SMTP real para contacto y, si aplica, para diagnóstico.
- Cargar webhook real de n8n para diagnóstico si formará parte del flujo 1.0.
- Cargar credenciales reales de Google Calendar/Meet y ejecutar la prueba manual completa.
- Ejecutar `npm run lint`.
- Ejecutar `npx tsc --noEmit`.
- Ejecutar `npm run build`.
- Revisar visualmente home, rutas internas, formularios, consola y scroll horizontal en móvil y desktop.
- Confirmar que las APIs siguen respondiendo sin exponer datos personales ni nombres internos de variables de entorno.
