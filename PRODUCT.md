# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Empresas que necesitan organizar, digitalizar o automatizar procesos operativos, y personas responsables de evaluar una solución, solicitar un diagnóstico, contactar al equipo o agendar una asesoría.

## Product Purpose

Conexacod diseña plataformas, sistemas, automatizaciones e integraciones para resolver problemas empresariales reales, reducir trabajo manual, organizar información y permitir que la operación evolucione sin rehacerlo todo.

El sitio explica esa propuesta, presenta las rutas de servicio y convierte el interés en tres flujos concretos: contacto, diagnóstico empresarial y asesoría.

## Positioning

Conexacod parte del problema operativo de cada empresa, no de paquetes rígidos. Su propuesta conecta sistemas, automatización e integraciones en una estructura administrable y capaz de crecer junto con el negocio.

## Operating Context

- La marca opera desde Manizales, Caldas, Colombia, y comunica cobertura para empresas dentro y fuera del país.
- La evaluación comercial puede comenzar por contacto, diagnóstico empresarial o una asesoría virtual de 30 minutos.
- El diagnóstico guarda respuestas, puede enviar correos transaccionales y puede entregar un evento administrativo a n8n cuando la integración está configurada.
- La asesoría usa disponibilidad real y creación de eventos con Google Calendar y Google Meet cuando existen credenciales válidas; si faltan, el sistema bloquea la reserva en lugar de simularla.

## Capabilities and Constraints

- Aplicación web construida con Next.js 16.3.1, React 19, TypeScript, Tailwind CSS 4 y Prisma 7 con adaptador MariaDB.
- Rutas públicas confirmadas: Inicio, Nosotros, Soluciones, Servicios, Procesos, Contacto, Agendar asesoría, Diagnóstico empresarial y Privacidad.
- Contacto, diagnóstico y asesorías conservan el registro en base de datos y tratan el correo como una entrega separada; un fallo del proveedor no debe borrar la solicitud.
- SMTP, n8n y Google Calendar/Meet dependen de configuración externa real. El producto no debe fingir entregas, disponibilidad ni citas cuando faltan credenciales.
- Las APIs públicas aceptan JSON, aplican validación, sanitización y límites básicos por IP. El rate limiting actual está documentado para un solo runtime y necesitaría un store compartido en un despliegue con múltiples instancias.
- El dominio público, varios datos de contacto y el texto legal definitivo siguen pendientes. Mientras el dominio sea provisional, el sitio se mantiene fuera de indexación.
- El portfolio tiene un modelo centralizado, una tarjeta reutilizable, cuatro slots de datos vacíos y una ruta dinámica reutilizable en `/proyectos/[slug]`. Sólo se publica un proyecto cuando tiene datos mínimos reales, URL válida, logo y `published: true`; la página detallada exige además `detailPageEnabled: true`.

## Brand Commitments

- Nombre: Conexacod.
- Lema: “Digitalizar para simplificar. Automatizar para crecer.”
- Voz en español, directa y centrada en problemas empresariales, claridad operativa y evolución continua.
- La identidad del iceberg es una marca permanente del producto y no debe sustituirse por la marca anterior Konamy.
- La base local en Manizales y la capacidad de construir para Colombia y el mundo forman parte del relato confirmado.

## Evidence on Hand

- El repositorio contiene copy público, rutas funcionales, formularios, configuración de SEO, servicios de correo, persistencia, seguridad y la integración preparada para Calendar/Meet.
- El símbolo de iceberg existe como SVG reutilizable y como composición visual más amplia en la experiencia principal.
- La página Nosotros usa una narrativa cinematográfica continua y cuenta con capturas de referencia de escritorio y móvil en `.impeccable/review/`.
- Existen componentes y arquitectura de datos para portfolio y detalle de proyecto, pero **no hay casos públicos reales cargados**. No deben inventarse nombres, clientes, logos, enlaces, tecnologías, resultados, métricas ni testimonios.
- El dominio final, correo de contacto, correo legal, teléfonos, WhatsApp, titular y dirección legal, y política de privacidad definitiva están marcados como pendientes en la configuración actual.

## Product Principles

1. Resolver el problema real antes de proponer la tecnología.
2. No afirmar ni publicar lo que todavía no está verificado.
3. Mantener los procesos administrables, claros y preparados para evolucionar.
4. Conservar una relación cercana desde Manizales sin limitar el alcance geográfico de la solución.
5. Degradar con honestidad cuando una integración externa no está disponible.

## Accessibility & Inclusion

La interfaz pública debe mantener estructura semántica, un único H1 por página, navegación por teclado, estados de foco visibles, controles de al menos aproximadamente 44 px y contraste suficiente. Los desplegables del portfolio usan botones con `aria-expanded` y `aria-controls`; los enlaces externos se identifican; y el sistema respeta `prefers-reduced-motion`, desactiva el scroll suave y reduce animaciones y transiciones cuando la persona lo solicita.
