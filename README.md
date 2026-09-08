# Konamy Systems · Producción 1.0

Esta base queda preparada para publicar la versión 1.0 del sitio sin crear nuevas páginas para `/automatizaciones`, `/sectores` o `/proyectos`.

## Variables de entorno

Copie `.env.example` a `.env.local` y reemplace todos los placeholders antes del despliegue final.

### Sitio y SEO

- `NEXT_PUBLIC_SITE_URL`
  Debe apuntar al dominio público final. Mientras no exista, el proyecto usa un placeholder `.invalid` para evitar referencias a `localhost`.

### SMTP y correos transaccionales

Variables oficiales para Formulario breve, Diagnóstico empresarial y Asesorías:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`
- `SMTP_SECURE`
- `ADMIN_NOTIFICATION_EMAIL`

`SMTP_PASSWORD` es la variable principal para la contraseña del proveedor SMTP. `SMTP_PASS` se mantiene temporalmente como alias heredado para entornos locales antiguos, pero no debe usarse en configuraciones nuevas.

Los correos administrativos usan esta prioridad:

1. Variable específica del módulo, si existe.
2. `ADMIN_NOTIFICATION_EMAIL` como destino general.
3. Si no existe ningún destino, no se intenta el envío administrativo.

Variables específicas compatibles:

- `CONTACT_DESTINATION_EMAIL`: destino específico del Formulario breve.
- `DIAGNOSTIC_DESTINATION_EMAIL`: destino específico del Diagnóstico empresarial.
- `BOOKING_DESTINATION_EMAIL`: destino específico de Asesorías.

Los valores vacíos, `.invalid` o marcados como `pendiente` no se consideran destinos reales. Esto permite copiar `.env.example` y configurar primero solo `ADMIN_NOTIFICATION_EMAIL` sin que un placeholder heredado tome prioridad.

Si SMTP no está configurado, los formularios guardan la información en base de datos, marcan la entrega de correo como omitida o pendiente y no fingen que el proveedor envió mensajes.

Para verificar la conexión SMTP sin exponer credenciales:

```bash
npm run smtp:check
```

Para enviar un correo de prueba explícito:

```bash
npm run smtp:check -- --send --to=correo@dominio.com
```

El comando nunca imprime la contraseña. Si no se pasa `--to`, intentará usar el destino administrativo configurado.

### Contacto por correo

El Formulario breve guarda el registro en base de datos, envía notificación administrativa cuando hay destino configurado y envía confirmación al cliente cuando SMTP está activo. Si el correo falla, el registro no se pierde y el panel conserva el estado de entrega.

### Diagnóstico por correo y n8n

- `N8N_DIAGNOSTIC_WEBHOOK_URL`
  URL real del webhook administrativo.
- `N8N_DIAGNOSTIC_WEBHOOK_SECRET`
  Se usa para firmar el payload en `X-Konamy-Signature`.

El Diagnóstico empresarial guarda todas las respuestas en base de datos, envía correos transaccionales con secciones legibles y puede entregar el evento al webhook de n8n si está configurado. Si una integración falla, la API responde con éxito parcial sin exponer detalles técnicos al cliente.

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
- Cargar SMTP real con `SMTP_PASSWORD` y `ADMIN_NOTIFICATION_EMAIL`.
- Configurar destinos específicos por módulo solo si deben llegar a buzones distintos.
- Cargar webhook real de n8n para diagnóstico si formará parte del flujo 1.0.
- Cargar credenciales reales de Google Calendar/Meet y ejecutar la prueba manual completa.
- Ejecutar `npm run lint`.
- Ejecutar `npx tsc --noEmit`.
- Ejecutar `npm run build`.
- Revisar visualmente home, rutas internas, formularios, consola y scroll horizontal en móvil y desktop.
- Confirmar que las APIs siguen respondiendo sin exponer datos personales ni nombres internos de variables de entorno.
