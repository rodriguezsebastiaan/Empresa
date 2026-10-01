<!-- converted from Portafolio conexacod.docx -->

Portafolio conexacod 
Ruta logos: Empresa-main\assets\Logos
Ruta portafolio: Empresa-main\docs
nombre_proyecto: PR BOX
slug_sugerido: pr-box
tipo_proyecto: Sitio web responsive con landing page pública y sistema administrativo web para gestión de contenidos.
estado_actual: Producción, con funcionalidades adicionales y ajustes evolutivos todavía en desarrollo.
url_produccion: https://prboxcf.com
logo: Sí. El proyecto cuenta con assets oficiales del logo de PR BOX dentro del frontend. En el desarrollo se trabajó además una versión transparente/sin fondo específicamente para el Hero. En el chat se ha referido el asset dentro de src/assets/ y la variante logo-prbox-bg.
tarjeta_portafolio
descripcion_corta:
Sitio web y panel administrativo para PR BOX, centro de Cross Training y Official HYROX Training Club en Manizales. Centraliza información diaria como WOD, anuncios, contenido recomendado, horarios y merchandising, permitiendo al equipo actualizar gran parte del contenido sin modificar código.
necesidad:
PR BOX necesitaba una presencia web propia que complementara sus redes sociales y facilitara a sus miembros consultar información recurrente del gimnasio. La necesidad no era únicamente promocional: los usuarios habituales requerían consultar WOD, anuncios, horarios, videos recomendados y novedades de manera rápida, mientras el equipo necesitaba administrar este contenido de forma autónoma.
que_construimos:
Se desarrolló una landing responsive conectada a un backend en Supabase y un panel administrativo protegido. Desde este panel se gestionan contenidos como WOD, anuncios, equipo, videos recomendados, archivos multimedia, administradores y PR Merch. También se implementaron flujos de autenticación, recuperación y cambio de contraseña, publicación programada de contenidos y experiencias especiales como modos de visualización para TV.
resultado:
Actualmente PR BOX dispone de un sitio oficial en prboxcf.com donde sus usuarios pueden consultar información actualizada del gimnasio, mientras los administradores pueden gestionar buena parte del contenido sin necesidad de editar directamente el frontend. También se incorporó PR Merch como catálogo conectado con WhatsApp para facilitar consultas sobre productos.
pagina_individual
hero_titulo:
La experiencia digital de PR BOX, dentro y fuera del box
hero_subtitulo:
Un sitio web con gestión administrativa propia para centralizar WOD, anuncios, contenido, merchandising y comunicación con la comunidad de PR BOX.
contexto:
PR BOX es un centro de entrenamiento ubicado en Manizales cuya comunicación digital dependía principalmente de sus canales sociales. El proyecto evolucionó hacia la construcción de un sitio oficial que no solo presentara la marca, sino que tuviera utilidad cotidiana para las personas que ya entrenan allí.
Durante el desarrollo, la prioridad fue combinar dos necesidades: ofrecer información institucional y comercial para nuevos visitantes y, al mismo tiempo, proporcionar acceso rápido a información recurrente para los miembros actuales.
problema:
Los usuarios habituales necesitaban consultar contenidos cambiantes —especialmente el WOD, anuncios y videos recomendados— sin depender exclusivamente de redes sociales o de información dispersa.
Además, si cada modificación de contenido requiriera editar código y volver a desplegar la web, el sitio perdería utilidad operativa. Por ello fue necesario construir herramientas administrativas que permitieran al equipo de PR BOX gestionar contenidos de forma autónoma.
También existía la necesidad de establecer prboxcf.com como sitio oficial de la marca y mejorar su presencia técnica para buscadores, ya que las búsquedas de marca mostraban principalmente el perfil de Instagram.
solucion:
Se construyó una aplicación web con React y Vite, dividida entre una landing pública y un panel administrativo protegido.
La landing se diseñó siguiendo una identidad oscura, industrial y deportiva. Cada sección adopta un lenguaje visual relacionado con el entorno físico de un gimnasio: el WOD utiliza una presentación tipo tablero, PR BOX TV simula una pantalla física y PR Merch utiliza una estética inspirada en lockers.
El contenido dinámico se conecta con Supabase. El panel administrativo permite gestionar distintos tipos de contenido y utiliza autenticación con roles y políticas de acceso. También se desarrollaron funcionalidades específicas para usuarios recurrentes, como carruseles, modos TV y enlaces directos a WhatsApp.
funcionalidades_principales:
WOD del día: publicación y consulta del entrenamiento diario desde la landing, con gestión administrativa del contenido.
Anuncios: carrusel de anuncios gestionable desde el panel, con publicación de contenidos y modo de visualización para TV.
PR Merch: catálogo administrable de productos con imagen, nombre, descripción, orden y estado, acompañado de un enlace dinámico a WhatsApp para solicitar más información.
PR BOX TV: sección de videos recomendados administrables, integrada con contenido de YouTube y una presentación visual inspirada en una televisión física.
Gestión de equipo/coaches: contenido administrable relacionado con las personas que forman parte de PR BOX.
Biblioteca multimedia: gestión de imágenes utilizadas posteriormente por otras funcionalidades del sitio.
Panel administrativo protegido: autenticación, roles admin y super_admin, creación y administración de usuarios, cambio de contraseña y recuperación de acceso.
Modos de visualización para TV: contenidos como Anuncios y PR Merch cuentan con experiencias diseñadas para proyectarse en pantallas del gimnasio. En PR Merch todavía se han venido refinando detalles de UX de este modo.
resultado_actual:
Un visitante puede conocer PR BOX, consultar información del gimnasio, revisar anuncios, acceder al merchandising, consultar el WOD, ver videos recomendados, revisar horarios, programas, equipo y formas de contacto.
Un administrador dispone de un panel independiente desde el que puede gestionar diversos contenidos sin modificar directamente el código. PR Merch ya cuenta con gestión administrativa y conexión con la landing.
La conversión de Horarios de contenido estático a contenido totalmente editable desde administración fue planteada y comenzó a trabajarse, pero en este chat no existe confirmación suficiente de que la funcionalidad haya quedado completamente terminada y desplegada. PENDIENTE de confirmar estado final.
tecnologias:
React 18
TypeScript
Vite
Tailwind CSS
React Router
shadcn/ui
Framer Motion
GSAP / ScrollTrigger
Three.js / WebGL en efectos específicos del Hero
PostgreSQL
Supabase
Supabase Auth
Supabase Storage
Supabase Edge Functions
Cloudflare
Cloudflare Workers / Static Assets en la configuración de despliegue
Vitest
integraciones:
Supabase Auth
Supabase PostgreSQL
Supabase Storage
Supabase Edge Functions
YouTube para contenido de PR BOX TV
WhatsApp para consultas de productos de PR Merch
Instagram oficial de PR BOX
Google Maps mediante enlace de ubicación
Cloudflare para despliegue y dominio
IndexNow mediante herramientas de Cloudflare/Bing fue contemplado y configurado externamente según lo trabajado
Google Search Console: dominio registrado y sitemap enviado, confirmado en el chat
panel_administrativo:
Sí.
El proyecto dispone de un dashboard administrativo protegido. Entre las funciones confirmadas o trabajadas se encuentran:
gestión de WOD;
gestión de anuncios;
gestión de coaches/equipo;
gestión de PR BOX TV/videos recomendados;
biblioteca multimedia;
gestión de PR Merch;
gestión de administradores;
roles admin y super_admin;
activación/desactivación de administradores;
protección del último super_admin;
creación de nuevas cuentas administrativas mediante contraseña temporal;
cambio obligatorio de contraseña inicial;
cambio de contraseña autenticado;
recuperación de contraseña;
sesión protegida y rutas administrativas;
cierre automático por inactividad de 30 minutos fue solicitado para implementación. PENDIENTE confirmar que quedó desplegado.
administración dinámica de horarios y tipos de clase fue solicitada y desarrollada parcialmente. PENDIENTE confirmar estado final.
responsive:
Sí. El proyecto ha sido trabajado específicamente para computador, tablet y móvil.
Se realizaron validaciones y correcciones en múltiples anchos, incluyendo aproximadamente 360, 375, 390, 412, 768, 820, 1024 y 1440 px.
Durante el desarrollo se atendieron problemas específicos de:
Safari móvil;
Android/Samsung;
iPad/tablets;
logos responsive;
Hero en pantallas estrechas;
navegación móvil;
carruseles;
PR Merch;
modos TV.
PR Merch cuenta con comportamiento adaptativo para desktop, tablet y móvil. En móvil se implementó un carrusel horizontal; algunos ajustes posteriores relacionados con ancho de cada slide y pequeños saltos verticales fueron solicitados, pero el chat no confirma su estado final. PENDIENTE.
despliegue:
El proyecto está publicado en:
https://prboxcf.com
El frontend se despliega actualmente mediante Cloudflare.
Durante etapas anteriores se utilizó Vercel y permanece registrada la URL prboxcf.vercel.app como origen permitido para determinados casos de compatibilidad, pero el dominio oficial y canónico actual es prboxcf.com.
El backend utiliza Supabase bajo el proyecto PR BOX.
El despliegue tuvo ajustes específicos para:
variables de entorno de Supabase;
fallback de SPA;
rutas administrativas directas;
configuración Wrangler / Cloudflare Static Assets;
CORS de Edge Functions;
recuperación de contraseña;
canonical y configuración SEO.
aporte_conexacod
alcance_del_trabajo:
Arquitectura y desarrollo del frontend.
Diseño y refinamiento UI/UX.
Diseño responsive para computador, tablet y móvil.
Desarrollo de la landing pública.
Desarrollo del panel administrativo.
Integración con Supabase.
Modelado y uso de PostgreSQL.
Autenticación y autorización.
Configuración de RLS.
Implementación de Edge Functions.
Gestión de Storage y multimedia.
Desarrollo de CRUD administrativos.
Integración de WhatsApp para PR Merch.
Integración de videos para PR BOX TV.
Implementación de modos de presentación para TV.
Configuración del despliegue en Cloudflare.
Configuración del dominio.
Trabajo técnico de SEO.
robots.txt.
sitemap.xml.
manifest.webmanifest.
datos estructurados / JSON-LD.
canonical.
metadata social.
preparación para Google, Bing/Copilot y buscadores con IA.
configuración y revisión de security.txt.
pruebas, debugging y optimización responsive.
reto_principal:
Uno de los retos principales fue convertir una landing visualmente fuerte en una herramienta de uso cotidiano sin perder la identidad de PR BOX. El sitio debía servir simultáneamente a nuevos visitantes y a miembros recurrentes que principalmente entran a revisar WOD, anuncios, contenidos y novedades.
A nivel técnico, esto implicó mantener sincronizados frontend público, administración, Supabase, permisos, contenido multimedia, responsive y comportamientos específicos para pantallas de diferentes tamaños.
solucion_al_reto:
La solución evolucionó hacia una arquitectura de contenido administrable: el frontend público conserva una identidad visual diferenciada mientras los contenidos se almacenan y gestionan desde Supabase.
Las secciones se diseñaron con identidades propias pero coherentes entre sí —tablero para WOD, TV física para videos y locker para Merch— y se incorporó un panel administrativo que permite gestionar contenidos sin editar código.
También se reorganizó la jerarquía de la landing para mostrar primero contenidos relevantes como Anuncios y PR Merch antes del WOD, manteniendo acceso directo a este último mediante navegación.
material_disponible
capturas_o_assets:
Sí. En el chat existe material abundante que podría utilizarse posteriormente para construir el caso de proyecto, incluyendo:
capturas desktop del Hero;
capturas mobile del Hero;
navbar desktop/mobile;
dashboard administrativo;
administración de Multimedia;
administración de PR Merch;
sección pública PR Merch;
locker desktop y móvil;
Modo TV de PR Merch;
Modo TV de Anuncios;
anuncios públicos;
recuperación de contraseña;
formularios administrativos;
screenshots de errores/debugging;
logo oficial de PR BOX;
logo transparente utilizado en el Hero;
imágenes de productos de Merch;
imágenes del gimnasio;
video MP4 mostrando el comportamiento del carrusel de PR Merch y problemas de scroll.
También se han trabajado assets específicos del Hero y fondos del gimnasio.
archivos_relevantes:
El chat menciona, entre otros, los siguientes archivos del código:
MerchLocker.tsx
merch-whatsapp.ts
merch-whatsapp.test.ts
Index.tsx
index.css
src/config/auth.ts
migraciones dentro de supabase/migrations/
20260905010000_create_merch_products.sql
componentes administrativos relacionados con Multimedia, PR Merch y autenticación
assets del logo dentro de src/assets/
Estos archivos fueron referenciados durante el desarrollo, aunque no todos fueron adjuntados como archivos descargables dentro de esta conversación.

- nombre_proyecto: SERPLENO
- slug_sugerido: serpleno
- tipo_proyecto: Aplicación web para la gestión de servicios de bienestar.
- estado_actual: PENDIENTE. Existe una versión funcional documentada como “corte técnico DNDA 2026-08-25”, pero no está confirmado si se encuentra en producción, en piloto o todavía en desarrollo.
- url_produccion: PENDIENTE.
- logo: Sí. El proyecto contiene los recursos [logo empresa.png](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\logo empresa.png) y [logoserpleo.png](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\logoserpleo.png). PENDIENTE confirmar cuál debe utilizarse oficialmente en el portafolio.
TARJETA_PORTAFOLIO
- descripcion_corta: Plataforma web de bienestar que reúne contenido guiado, planes y sesiones con profesionales. Facilita que cada usuario gestione su proceso de bienestar físico y mental desde un mismo espacio.
- necesidad: Centralizar el acceso a contenidos de bienestar, acompañamiento profesional, agendamiento de sesiones, recordatorios y planes con distintos niveles de acceso.
- que_construimos: Una aplicación web con experiencias diferenciadas para clientes, profesionales y administradores, incluyendo autenticación, planes, contenido por categorías, agenda, sesiones virtuales, pagos, notificaciones y gestión administrativa.
- resultado: Actualmente, la solución permite que los usuarios consulten contenido, seleccionen planes, agenden sesiones y accedan a salas virtuales. Los profesionales gestionan su disponibilidad y grabaciones, mientras los administradores controlan usuarios, contenidos y estadísticas.
PAGINA_INDIVIDUAL
- hero_titulo: Bienestar y acompañamiento en un solo lugar
- hero_subtitulo: SERPLENO centraliza contenido guiado, planes y sesiones profesionales para acompañar procesos de bienestar físico y mental.
- contexto: SERPLENO fue desarrollado como una plataforma de bienestar orientada a personas que buscan construir hábitos saludables con contenido práctico y acompañamiento profesional. El sistema organiza en una sola experiencia los planes, contenidos, citas, notificaciones y recursos necesarios para ese proceso.
- problema: El proyecto debía resolver la gestión fragmentada de los servicios de bienestar. Los usuarios necesitaban consultar contenidos según su plan, encontrar profesionales, reservar sesiones y recibir recordatorios; al mismo tiempo, los profesionales y administradores requerían herramientas para gestionar disponibilidad, usuarios, contenidos, pagos y grabaciones.
- solucion: Se construyó una aplicación web con flujos separados según el rol. Los clientes disponen de planes, contenidos, agenda y sesiones virtuales; los profesionales administran su calendario, notificaciones, recursos y grabaciones; y los administradores cuentan con herramientas para gestionar la operación de la plataforma. El acceso a las distintas secciones se controla mediante autenticación, roles y restricciones asociadas al plan del usuario.
- funcionalidades_principales:
1. Registro, inicio de sesión y restablecimiento de contraseña.
2. Gestión y comparación de planes con diferentes niveles de acceso.
3. Biblioteca de contenidos de entrenamiento, psicología, nutrición y coaching.
4. Agendamiento de sesiones según la disponibilidad de los profesionales.
5. Acceso controlado a salas virtuales mediante enlaces y tokens.
6. Notificaciones y recordatorios para clientes y profesionales.
7. Gestión de disponibilidad, cargas y grabaciones por parte de profesionales.
8. Administración de usuarios, perfiles, contenidos y estadísticas.
Funcionalidades planeadas: PENDIENTE. La documentación disponible identifica módulos implementados, pero no contiene un roadmap que permita confirmar funciones futuras.
- resultado_actual: El cliente puede registrarse, consultar y comparar planes, acceder al contenido permitido, validar su condición de estudiante, registrar pagos, recibir notificaciones, reservar citas y entrar a sesiones virtuales. Los profesionales pueden administrar su disponibilidad, consultar su agenda, cargar recursos y asociar grabaciones externas a sus sesiones. Los administradores pueden gestionar usuarios, perfiles, contenidos, métricas y grabaciones.
- tecnologias:
- PHP
- HTML
- CSS
- JavaScript
- MySQL o MariaDB
- PDO
- Sesiones PHP
- password_hash y password_verify para el manejo de contraseñas
- integraciones:
- Mercado Pago, mediante redirección a enlaces externos y registro local del pago.
- Jitsi Meet, para las salas virtuales.
- YouTube, para contenido audiovisual externo.
- Google Drive, como opción para enlaces privados de grabaciones.
- Cloudflare R2, como opción para almacenamiento externo de grabaciones.
- Unsplash, para recursos visuales externos.
- panel_administrativo: Sí. Incluye panel de administración, gestión de usuarios y perfiles, gestión de contenidos, consulta de estadísticas y métricas, y acceso administrativo al módulo de grabaciones.
- responsive: Las hojas de estilo contienen adaptaciones para diferentes anchos de pantalla, incluidos puntos de ajuste para tabletas y móviles. Se confirma una implementación responsive a nivel de código; PENDIENTE validar visualmente todos los recorridos en computador, tableta y teléfono.
- despliegue: La aplicación requiere un servidor web con PHP, soporte para PDO MySQL y una base de datos MySQL o MariaDB. La documentación también contempla permisos de escritura para sesiones y cargas. El proveedor de hosting, dominio, entorno de producción y mecanismo real de despliegue están PENDIENTES.
APORTE_CONEXACOD
- alcance_del_trabajo:
- Desarrollo del proyecto web SERPLENO: confirmado por la descripción aportada en este chat.
- Construcción de una interfaz diferenciada para clientes, profesionales y administradores.
- Implementación técnica de frontend en HTML, CSS y JavaScript.
- Implementación del backend y la lógica de negocio en PHP.
- Modelado y acceso a datos con MySQL/MariaDB y PDO.
- Desarrollo de autenticación, sesiones y control de acceso por roles.
- Implementación de módulos de planes, contenido, agenda, notificaciones, pagos y grabaciones.
- Integración funcional con servicios externos.
- PENDIENTE confirmar el alcance exacto atribuible a Conexacod en UI/UX, identidad visual, infraestructura y despliegue.
- reto_principal: Organizar en una misma aplicación los recorridos de tres tipos de usuario —cliente, profesional y administrador— manteniendo permisos, información y herramientas diferentes para cada perfil.
- solucion_al_reto: Se implementó un sistema central de rutas y control de acceso, con módulos separados por rol. La autenticación, las sesiones y las restricciones de acceso determinan qué panel y funcionalidades puede utilizar cada persona. Los contenidos y beneficios también pueden condicionarse según el plan del cliente.
MATERIAL_DISPONIBLE
- capturas_o_assets: Sí. Existen dos archivos de logo, cuatro capturas de pantalla principales y cuatro archivos adicionales de captura dentro de la carpeta Upload. También hay iconos y recursos de un diseño de referencia. No se encontraron videos locales; las grabaciones se administran mediante enlaces externos.
- archivos_relevantes:
- [README técnico](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\SERPLENO_DNDA\\docs\\README.md)
- [Descripción técnica](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\SERPLENO_DNDA\\docs\\DESCRIPCION_TECNICA.md)
- [Listado de módulos](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\SERPLENO_DNDA\\docs\\MODULOS.md)
- [Arquitectura](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\SERPLENO_DNDA\\docs\\ARQUITECTURA.md)
- [Documentación del módulo de grabaciones](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\docs\\session-recordings.md)
- [Paquete SERPLENO_DNDA.zip](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\SERPLENO_DNDA.zip)
- [Primera captura disponible](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\Captura de pantalla 2025-09-04 114812.png)
- [Logo principal disponible](C:\\Users\\rodri\\OneDrive\\Escritorio\\SerplenoH\\logo empresa.png)

nombre_proyecto: Estilo Emporium
slug_sugerido: estilo-emporium
tipo_proyecto: Tienda virtual / plataforma de comercio electrónico para ropa deportiva y kits de fútbol personalizados.
estado_actual: En producción, con mejoras y ajustes en desarrollo.
url_produccion: https://www.estiloemporium10.com
logo: Disponible. El proyecto contiene el logotipo principal y sus variantes en [public/estilo-emporium-logo.png](C:/xampp/htdocs/estiloemporium10/public/estilo-emporium-logo.png), [estilo_emporium_logo_sin_fondo.png](C:/xampp/htdocs/estiloemporium10/estilo_emporium_logo_sin_fondo.png) y los iconos usados por la aplicación.
TARJETA_PORTAFOLIO
descripcion_corta:
Tienda virtual de ropa deportiva para hombre, mujer y niños, con catálogo, personalización de prendas, pagos en línea y seguimiento de pedidos desde una cuenta de cliente.
necesidad:
El proyecto nació de la necesidad de llevar el catálogo de Estilo Emporium a un canal digital propio, facilitar la compra de prendas y kits deportivos personalizados y centralizar la gestión de productos, promociones, pedidos y clientes.
que_construimos:
Desarrollamos una plataforma de comercio electrónico con catálogo organizado por categorías, fichas de producto, personalización de prendas, carrito, checkout, pagos mediante Mercado Pago, cuentas de cliente, seguimiento de pedidos y panel administrativo.
resultado:
Actualmente, la solución permite consultar el catálogo, seleccionar tallas y personalizaciones, calcular el valor del pedido y el envío, pagar en línea, revisar el estado de las compras y gestionar la operación comercial desde un panel administrativo. No hay métricas de ventas o conversión confirmadas.
PAGINA_INDIVIDUAL
hero_titulo:
Estilo Emporium: del catálogo deportivo a la venta en línea
hero_subtitulo:
Una tienda virtual que reúne catálogo, personalización, pagos y seguimiento de pedidos en una sola experiencia.
contexto:
Estilo Emporium comercializa ropa deportiva para hombre, mujer y niños, además de kits de fútbol que pueden incluir personalizaciones. El proyecto buscó convertir esa oferta en una experiencia digital propia, organizada y administrable, cubriendo tanto el proceso de compra del cliente como la gestión posterior del pedido.
problema:
La operación necesitaba algo más que una vitrina de productos. Era necesario presentar un catálogo dividido por categorías, representar correctamente tallas, existencias, promociones y opciones de personalización, recibir pedidos con información completa del comprador, procesar pagos y permitir el seguimiento de cada compra. También se requería una forma centralizada de mantener productos y controlar los estados de los pedidos.
solucion:
Se construyó una aplicación web de comercio electrónico con una experiencia pública para compradores y un entorno administrativo protegido. La solución conecta el catálogo con una base de datos, conserva las personalizaciones seleccionadas dentro de cada pedido, calcula costos de envío y redirige al comprador a Mercado Pago. Los cambios de pago y pedido pueden sincronizarse mediante webhook, mientras el administrador gestiona productos, promociones, pedidos y reseñas.
funcionalidades_principales:
1. Catálogo de productos organizado en hombre, mujer, niños, kits y promociones.
2. Búsqueda de productos y páginas individuales con imágenes, precios, disponibilidad, tallas y reseñas.
3. Personalización de productos compatibles, incluyendo nombre, dorsal, patrocinadores y parches según las opciones habilitadas.
4. Carrito de compras con cantidades, desglose de personalizaciones y cálculo del total.
5. Checkout con datos de entrega, aceptación de términos, cálculo de envío local o nacional y pago mediante Mercado Pago.
6. Registro, inicio de sesión, recuperación de contraseña, perfil de cliente e historial de pedidos.
7. Seguimiento del estado comercial y financiero de cada compra desde el área del cliente.
8. Panel administrativo para productos, promociones, pedidos y moderación de reseñas.
resultado_actual:
El comprador puede explorar el catálogo, revisar existencias, seleccionar una talla, personalizar los productos habilitados, agregarlos al carrito, registrar sus datos de entrega y completar el pago. Después puede consultar sus pedidos y su estado. El administrador puede mantener el catálogo, activar o desactivar productos y promociones, revisar pedidos, cambiar sus estados y moderar reseñas.
No se encontraron métricas confirmadas sobre ventas, tráfico, reducción de tiempos o conversión.
tecnologias:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Base UI
- shadcn/ui
- MySQL o MariaDB
- mysql2/promise
- Node.js
- bcryptjs
- Lucide React
- Sonner
- ESLint
- PostCSS
integraciones:
- Mercado Pago Checkout Pro para pagos.
- Webhook de Mercado Pago para sincronización de pagos y pedidos.
- Cloudinary para almacenamiento de imágenes de productos.
- Resend para correos transaccionales y recuperación de contraseña.
- WhatsApp mediante enlaces de contacto y mensajes preparados.
- Vercel Analytics incluido en las dependencias del proyecto.
La implementación está presente en el código. La configuración productiva actual de cada servicio queda PENDIENTE de confirmación.
panel_administrativo:
Sí existe. Tiene autenticación propia y permite:
- Consultar indicadores básicos de pedidos, productos y promociones.
- Crear, editar, activar, desactivar y eliminar productos.
- Administrar imágenes, categorías, tallas, inventario general y disponibilidad de personalización.
- Crear y modificar promociones porcentuales o de valor fijo.
- Consultar pedidos por rangos de fechas.
- Revisar el detalle y las personalizaciones de un pedido.
- Actualizar estados de pedidos.
- Aprobar, rechazar o eliminar reseñas de productos.
responsive:
La interfaz contiene adaptaciones explícitas para computador, tablet y móvil mediante diseños fluidos, cuadrículas responsivas, menús móviles y reorganización de formularios y tablas según el ancho disponible. La lista completa de dispositivos y navegadores probados es PENDIENTE.
despliegue:
El dominio público configurado es https://www.estiloemporium10.com. La aplicación genera una salida independiente de Next.js y existen paquetes de despliegue preparados para Node.js/Passenger. La base de datos de producción está planteada sobre MySQL.
El nombre del proveedor de hosting, servidor o panel utilizado es PENDIENTE. No se puede afirmar que el sitio esté alojado en Vercel solamente porque utilice su módulo de analítica.
APORTE_CONEXACOD
alcance_del_trabajo:
- Definición y construcción de la experiencia UI/UX de la tienda.
- Desarrollo frontend responsive.
- Desarrollo backend y endpoints internos.
- Modelado e implementación de la base de datos.
- Catálogo, búsqueda, carrito y checkout.
- Personalización de productos.
- Registro, autenticación y recuperación de contraseña.
- Área privada del cliente y seguimiento de pedidos.
- Panel administrativo.
- Integración con Mercado Pago y su webhook.
- Integración de imágenes con Cloudinary.
- Correos transaccionales mediante Resend.
- Moderación de reseñas.
- Configuración SEO básica mediante metadatos, sitemap, robots y datos estructurados.
- Medidas de seguridad como sesiones protegidas, hash de contraseñas, límites de solicitudes y cabeceras HTTP.
- Preparación de paquetes para despliegue.
reto_principal:
Uno de los retos principales fue conectar una compra personalizable con el flujo completo del comercio electrónico. Cada pedido debía conservar talla, nombre, dorsal, patrocinadores, parches y costos adicionales, y al mismo tiempo mantener coherencia entre carrito, pedido local, pago externo y seguimiento administrativo.
solucion_al_reto:
La solución modela las personalizaciones como información asociada a cada artículo y guarda una copia de esos datos dentro del pedido. El backend crea primero el pedido y el pago local, genera después la preferencia de Mercado Pago y conserva las referencias del proveedor. El webhook permite actualizar el estado financiero y comercial cuando Mercado Pago envía una notificación.
La reducción automática del inventario después de una compra no está confirmada como implementada; la documentación disponible señala este punto como pendiente.
MATERIAL_DISPONIBLE
capturas_o_assets:
Existen recursos visuales utilizables para el portafolio:
- Logotipo principal y versión sin fondo.
- Imagen principal del hero.
- Imágenes para las categorías hombre, mujer, niños, kits y promociones.
- Imágenes de productos.
- Iconos de la aplicación.
- Recursos cargados desde la administración.

nombre_proyecto: Citas Ya
slug_sugerido: citas-ya
tipo_proyecto: Plataforma web / web app SaaS para gestión y agendamiento de citas.
estado_actual: MVP funcional en etapa de piloto y validación comercial. La plataforma está desplegada y cuenta con los principales flujos de operación implementados.
url_produccion: https://citasyaa.com.co
logo: PENDIENTE. Se conoce que Citas Ya cuenta con identidad visual y logo, pero en este chat no está confirmado qué archivo o asset debe utilizarse en el portafolio.

tarjeta_portafolio
descripcion_corta:
Citas Ya es una plataforma web para barberías que digitaliza la gestión de citas, permitiendo a clientes reservar en línea y a los negocios organizar barberos, horarios, servicios y disponibilidad desde una misma plataforma.
necesidad:
El proyecto nace frente al uso frecuente de WhatsApp, llamadas y agendas manuales para gestionar citas en barberías. Este proceso puede generar citas cruzadas, tiempos muertos, exceso de mensajes, dificultad para conocer disponibilidad y problemas para coordinar varios barberos.
que_construimos:
Se desarrolló una aplicación web con flujos diferenciados para clientes, barberos, negocios y administradores. Incluye agendamiento, administración de disponibilidad, gestión de servicios, perfiles, notificaciones, correos, mapas, enlaces personalizados y un panel administrativo.
resultado:
Actualmente, una barbería puede configurar su operación dentro de la plataforma y recibir reservas en línea. Los clientes pueden consultar disponibilidad y agendar con o sin cuenta, mientras los barberos gestionan su agenda, horarios y servicios. Los principales flujos fueron utilizados durante una prueba piloto.

pagina_individual
hero_titulo:
Una agenda digital para barberías y sus clientes
hero_subtitulo:
Citas Ya centraliza reservas, disponibilidad, barberos y servicios para reducir el trabajo manual asociado a la gestión de citas.
contexto:
Muchas barberías pequeñas gestionan sus reservas mediante mensajes de WhatsApp, llamadas o agendas físicas. Aunque estos canales permiten atender al cliente, dificultan mantener organizada la disponibilidad cuando aumenta el número de citas o de barberos. Citas Ya se desarrolló como una alternativa web enfocada inicialmente en este sector.
problema:
La gestión manual de reservas puede generar cruces de horarios, espacios vacíos en la agenda, pérdida de citas, falta de confirmaciones y un alto número de conversaciones para coordinar fecha, hora, servicio y barbero. Para negocios con varios profesionales, también aumenta la dificultad de mantener actualizada la disponibilidad de cada uno.
solucion:
Se construyó una plataforma web que conecta al cliente con la agenda disponible de cada barbería. El negocio puede registrar sus servicios, barberos y horarios, mientras que el cliente consulta la disponibilidad y realiza la reserva directamente. La solución incluye herramientas complementarias para confirmación, cancelación, reagendamiento, gestión administrativa y seguimiento de la operación.
funcionalidades_principales:
Agendamiento de citas con cuenta o como invitado.
Selección de barbería, barbero, servicio, fecha y hora disponible.
Gestión de agenda y disponibilidad individual por barbero.
Registro de servicios y bloqueo de horarios o ausencias.
Cancelación y reagendamiento de citas.
Enlaces personalizados para barberías y barberos.
Correos automáticos, notificaciones y exportación de citas a calendario mediante archivos .ics.
Panel administrativo para gestión y seguimiento general de la plataforma.
resultado_actual:
Hoy el usuario puede ingresar a Citas Ya desde la web, localizar una barbería, consultar servicios y disponibilidad y completar una reserva. Los barberos pueden administrar su perfil y agenda, mientras que los negocios pueden organizar sus servicios y equipo. El administrador dispone de herramientas para supervisar usuarios, negocios, aprobaciones, comentarios, pagos y métricas generales.
Durante el piloto se registraron aproximadamente 19 citas con participación de cerca de 3 barberos y 10 usuarios clientes. La prueba permitió validar los principales recorridos de la aplicación e identificar errores y oportunidades de mejora antes de una expansión comercial.
tecnologias:
HTML
CSS modular
JavaScript
Arquitectura MVC
Supabase
PostgreSQL, mediante la infraestructura actual de Supabase
GitHub
Vercel
No se utiliza React ni Vue en la versión descrita en este chat.
integraciones:
Supabase para backend, base de datos y autenticación.
Resend para envío de correos.
Supabase Edge Functions asociadas a procesos de correo.
OpenStreetMap.
Leaflet.
Mercado Pago, integrado pero todavía pendiente de validación comercial con pagos reales.
Generación de archivos .ics para integrar citas con calendarios.
Notificaciones web/PWA.
panel_administrativo:
Sí existe. Permite realizar seguimiento general de la plataforma y gestionar elementos como usuarios, negocios, barberos, aprobaciones, comentarios, pagos y métricas de uso. El alcance exacto de cada indicador disponible actualmente debe confirmarse antes de publicar una lista exhaustiva.
responsive:
La plataforma fue diseñada para funcionar en computador y celular. Durante el piloto, gran parte de las pruebas se realizaron desde dispositivos móviles, debido a que este es uno de los principales medios de acceso esperados para clientes y barberos. También cuenta con adaptación visual responsive y modo oscuro.
despliegue:
La versión actual se encuentra desplegada en Vercel y utiliza el dominio citasyaa.com.co. El backend y la base de datos funcionan actualmente con Supabase. Existe una planificación futura para evaluar infraestructura propia y Hostinger VPS, pero esta migración no corresponde al estado actual del producto.

aporte_conexacod
alcance_del_trabajo:
Diseño y desarrollo de la aplicación web.
Definición y construcción de la interfaz de usuario.
Desarrollo frontend con HTML, CSS y JavaScript.
Implementación de arquitectura MVC.
Desarrollo e integración de lógica backend.
Diseño y gestión de la base de datos.
Implementación de autenticación y roles.
Integración con Supabase.
Integración de correos mediante Resend.
Implementación de mapas con OpenStreetMap y Leaflet.
Integración de Mercado Pago.
Implementación del sistema de agendamiento.
Desarrollo del panel administrativo.
Adaptación responsive para computador y celular.
Despliegue en Vercel.
Configuración del dominio.
Pruebas y corrección de errores durante el piloto.
Nota de atribución: el chat confirma que el desarrollo ha sido realizado principalmente por Juan Martin Betancur Uribe con apoyo de Codex como herramienta técnica. La relación exacta entre este trabajo y la marca Conexacod no está documentada en la conversación, por lo que su atribución comercial debe confirmarse antes de publicarlo como proyecto realizado por Conexacod.
reto_principal:
Uno de los principales retos fue construir un flujo de agendamiento suficientemente flexible para coordinar clientes, barberías, barberos, servicios, disponibilidad y horarios, manteniendo al mismo tiempo una experiencia sencilla desde celular.
Durante el piloto también se identificaron dificultades relacionadas con disponibilidad incorrecta, confirmaciones para usuarios sin cuenta, asociación de barberos, notificaciones y algunos comportamientos relacionados con roles.
solucion_al_reto:
Se realizaron pruebas sobre los principales recorridos de la aplicación en computador y celular, se corrigieron errores detectados durante el piloto y se continuaron ajustando los flujos de agenda, disponibilidad, usuarios y barberos. El proyecto mantiene un proceso iterativo de revisión, corrección y despliegue de nuevas versiones.

material_disponible
capturas_o_assets:
En el historial del proyecto existen capturas de la interfaz relacionadas con precios de tokens y planes mensuales. También se conoce la existencia de una identidad visual y logo de Citas Ya, pero no está confirmado cuál es el archivo definitivo que debe utilizarse para el portafolio.
PENDIENTE confirmar si existen capturas actuales de:
Landing page.
Flujo de agendamiento.
Panel del barbero.
Panel administrativo.
Vista móvil.
Gestión de agenda.
Página pública de una barbería.
archivos_relevantes:
Documento de modelo de negocio de Citas Ya.
Documento de lecciones aprendidas del piloto.
Documento de costos del servicio y punto de equilibrio.
Documento de creación y elección de marca.
Documento de validación del valor de marca.
Documento sobre beneficios del piloto para barberos.
Documento sobre beneficios del piloto para clientes.
Contrato de prestación de servicios tecnológicos.
Documentación sobre estructura organizacional de Citas Ya.
Materiales sobre prospección, proceso de ventas y Business Model Canvas.
Repositorio del proyecto identificado como CitasYa_MVC.

nombre_proyecto: Efectuar SAS — Sitio Web Corporativo
slug_sugerido: efectuar-sas
tipo_proyecto: Sitio web corporativo e informativo responsive.
estado_actual: En desarrollo / fase avanzada de QA y optimización. En el chat se evidencia una versión desplegada y múltiples ciclos de corrección, pero no se ha confirmado formalmente que sea la versión final de producción.
url_produccion: Se observa en capturas una URL de Vercel asociada al proyecto, pero el dominio/URL definitivo de producción no está confirmado. PENDIENTE.
logo: Sí. Durante el proyecto se compartieron el logotipo completo de Efectuar y su isotipo de tres símbolos/flechas. También se trabajó específicamente su uso en navbar, footer y favicon.

Tarjeta de portafolio
descripcion_corta
Sitio web corporativo para Efectuar SAS, diseñado para presentar su experiencia en estructuración de licitaciones y gestión técnica, comunicar sus servicios y respaldar comercialmente la empresa mediante proyectos, metodología, equipo y trayectoria.
necesidad
Efectuar necesitaba una presencia digital profesional que explicara claramente su propuesta empresarial y organizara su oferta alrededor de su actividad principal: licitaciones y estructuración técnica, dejando construcción, interventoría y otros servicios como capacidades complementarias.
El proyecto también debía transmitir confianza y criterio técnico, funcionar correctamente en dispositivos móviles y presentar la información de manera más estratégica para potenciales clientes.
que_construimos
Se desarrolló un sitio corporativo responsive con una experiencia visual propia de Efectuar: hero comercial, navegación dinámica, presentación de servicios, proyectos/casos, metodología, información corporativa, equipo, trayectoria, llamadas a la acción y footer de contacto.
El desarrollo pasó por varias iteraciones de UI/UX, responsive, jerarquía de contenidos, copy, contraste, navegación, animaciones y QA.
resultado
Actualmente la solución permite presentar digitalmente a Efectuar SAS con una jerarquía comercial centrada primero en licitaciones, mostrar sus servicios y experiencia, navegar entre las principales secciones del sitio, conocer al equipo y acceder a canales de contacto externos.
No existen métricas de conversión, tráfico o resultados comerciales confirmadas en este chat.

Página individual
hero_titulo
Efectuar SAS: licitaciones estructuradas con criterio técnico
hero_subtitulo
Una experiencia web corporativa diseñada para presentar primero la capacidad de Efectuar en licitaciones, estructuración técnica y gestión documental, respaldada por sus demás líneas de servicio.
contexto
Efectuar SAS requería construir y posteriormente refinar su página web corporativa. El proyecto evolucionó mediante múltiples ciclos de diseño, implementación, pruebas y correcciones.
Durante el proceso apareció una definición estratégica especialmente importante: la empresa no debía percibirse principalmente como una constructora. Su enfoque principal debía estar en licitaciones, mientras construcción y otros servicios debían presentarse posteriormente como ramas o capacidades complementarias.
A partir de esa definición se reorganizaron el copy, la jerarquía visual, el hero, los proyectos y el orden de las secciones.
problema
El reto no consistía únicamente en construir una página visualmente atractiva. Era necesario conseguir que la estructura comunicara correctamente qué hace Efectuar, que las licitaciones ocuparan el primer nivel de la narrativa y que un potencial cliente pudiera comprender progresivamente sus capacidades, experiencia y respaldo técnico.
Durante las iteraciones también se identificaron problemas concretos de contraste, legibilidad, comportamiento de animaciones, navegación, composición tipográfica móvil, palabras visualmente unidas, saltos de línea poco naturales y adaptación de algunos componentes a pantallas pequeñas.
solucion
Se planteó una web corporativa de navegación por secciones con una identidad visual basada en los azules de Efectuar, acentos cian, superficies claras y elementos tipo glass/liquid glass.
La arquitectura de contenidos fue reorganizada para dar prioridad a licitaciones y acercar los proyectos/casos al inicio de la experiencia. Se trabajó también sobre navegación, animaciones de entrada, comportamiento durante el scroll, carruseles, timeline, CTAs y presentación del equipo.
Posteriormente se realizaron ciclos específicos de QA para responsive y contenido, revisando contraste, tamaños tipográficos, saltos de línea, espaciado, tildes, palabras unidas y composición en resoluciones móviles como 360×740.
funcionalidades_principales
Navegación superior por secciones con comportamiento dinámico durante el recorrido de la página.
Hero corporativo enfocado en licitaciones, estructuración técnica y gestión documental.
Sección de proyectos/casos con carrusel y prioridad para contenidos relacionados con licitaciones.
Presentación estructurada de servicios, metodología, empresa, equipo y trayectoria.
Timeline interactivo de trayectoria con cambio entre hitos y comportamiento automático trabajado durante el desarrollo.
Enlaces del equipo hacia perfiles profesionales, incluyendo integración del perfil de LinkedIn proporcionado para Santiago Uribe.
Dirección del footer preparada para dirigir al usuario a una aplicación/servicio de mapas.
CTAs y navegación interna entre diferentes áreas de la página.
resultado_actual
La versión trabajada permite recorrer una presentación corporativa completa de Efectuar, comprender su enfoque prioritario en licitaciones, explorar servicios y casos, conocer su metodología, empresa, equipo y trayectoria y utilizar diferentes puntos de contacto y navegación.
La página cuenta además con adaptación para dispositivos móviles que ha sido objeto de ciclos específicos de QA. El chat no confirma todavía la aprobación definitiva de todas las pruebas ni el cierre formal del proyecto.
tecnologias
Codex, utilizado durante las etapas de análisis, QA y modificación del código.
Vercel, observado como entorno de despliegue durante las pruebas.
PENDIENTE: El chat no permite confirmar con seguridad el framework frontend, lenguaje, librerías de animación ni demás componentes del stack final.
Lovable participó en etapas anteriores del desarrollo, pero no debe presentarse como una tecnología de la aplicación sin conocer la arquitectura final.
integraciones
Confirmadas en el trabajo realizado:
LinkedIn para enlaces externos de perfiles/equipo y empresa.
Integración/enlace de ubicación para abrir la dirección de Efectuar en mapas.
Se contemplaron además accesos visuales a Instagram y Facebook en el footer, pero sus URLs/funcionalidad definitiva no están confirmadas.
panel_administrativo
No se ha documentado un panel administrativo para este sitio web corporativo.
responsive
El responsive ha sido una parte importante del desarrollo. Se trabajaron específicamente versiones para computador, tablet y móvil, con especial atención a pantallas estrechas.
Entre los puntos revisados estuvieron navegación móvil, tamaños de títulos, saltos de línea, palabras visualmente unidas, distribución de cards, timeline, legibilidad, contraste y composición general.
La resolución 360×740 fue utilizada explícitamente como referencia de pruebas, junto con la intención de comprobar diferentes dimensiones móviles.
No está confirmado en el chat que el QA responsive final haya concluido al 100 %.
despliegue
Existe evidencia de despliegue mediante Vercel durante el desarrollo y las pruebas. El dominio final y el estado definitivo de producción están PENDIENTES.

Aporte Conexacod
alcance_del_trabajo
Definición y refinamiento de la arquitectura de información del sitio.
Diseño y ajustes de experiencia UI/UX.
Desarrollo y corrección del frontend.
Implementación/refinamiento de responsive.
Construcción y ajuste de navegación e interacciones.
Trabajo sobre animaciones y comportamiento durante el scroll.
Reestructuración estratégica del contenido hacia licitaciones.
Revisión y optimización del copy corporativo.
QA visual, responsive, tipográfico y ortográfico.
Preparación de enlaces e integraciones externas simples.
Trabajo sobre identidad visual, logo, isotipo y favicon.
Despliegue: existe evidencia de Vercel, pero el alcance exacto realizado por Conexacod está PENDIENTE.
Backend: PENDIENTE / no existe evidencia suficiente en el chat.
Base de datos: PENDIENTE / no existe evidencia suficiente en el chat.
reto_principal
Uno de los principales retos fue conseguir que una página visualmente elaborada mantuviera correctamente su información, jerarquía y legibilidad en diferentes tamaños de pantalla y durante las animaciones.
A esto se sumó un reto de producto: corregir una narrativa inicialmente demasiado asociada a construcción para reflejar que Efectuar tiene como eje principal las licitaciones, dejando construcción como una capacidad complementaria.
solucion_al_reto
Se realizaron iteraciones sucesivas sobre estructura, copy, orden de secciones, responsive y comportamiento visual. Los proyectos relacionados con licitaciones recibieron prioridad; se modificó el hero y la narrativa comercial; y se hicieron ciclos específicos de QA sobre contraste, scroll, tipografía y dispositivos móviles.
El efecto de scroll/stack fue uno de los componentes que requirió varias revisiones para evitar ocultar información y conservar una transición visual adecuada.

Material disponible
capturas_o_assets
Sí. El chat contiene abundante material que puede reutilizarse para documentar el caso:
Capturas de escritorio de diferentes secciones.
Numerosas capturas de la versión móvil.
Comparaciones visuales durante diferentes iteraciones.
Logo completo de Efectuar.
Isotipo de las tres flechas/símbolos.
Capturas del hero.
Capturas de proyectos.
Capturas de trayectoria/timeline.
Capturas de footer.
Capturas de metodología, soluciones, equipo y contenido corporativo.
También se mencionaron videos utilizados para analizar problemas del efecto scroll stack, aunque su disponibilidad actual para el portafolio debe verificarse.
archivos_relevantes
En el historial del proyecto se menciona el código del sitio descargado localmente y conectado posteriormente con Codex Desktop.
También existe en el contexto un PDF titulado “Fórmulas y Estructuras de Prompts (1).pdf”, pero no corresponde directamente al desarrollo de la página corporativa de Efectuar y no debería incluirse como material del caso.
