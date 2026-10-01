import type { StaticImageData } from 'next/image'
import citasYaLogo from '@/assets/Logos/LogoCitasYa.png'
import estiloEmporiumLogo from '@/assets/Logos/LogoEmporium.jpeg'
import efectuarLogo from '@/assets/Logos/logo-efectuar-mark.png'
import prBoxLogo from '@/assets/Logos/logo-prbox.png'
import serplenoLogo from '@/assets/Logos/LogoSerpleno.jpeg'

export type ProjectLogo = {
  src: StaticImageData
  alt: string
  width: number
  height: number
}

export type PortfolioProject = {
  position: number
  id: string
  slug: string
  name: string
  logo: ProjectLogo | null
  category: string
  status: string
  shortDescription: string
  context?: string
  need: string
  solution: string
  result: string
  technologies: readonly string[]
  integrations: readonly string[]
  features: readonly string[]
  contribution?: readonly string[]
  challenge?: string
  resolution?: string
  liveUrl?: string
  detailPageEnabled: boolean
  published: boolean
  seo: {
    title: string
    description: string
    relatedServiceIds: readonly string[]
  }
}

const portfolioProjectRecords = [
  {
    position: 3,
    id: 'pr-box', slug: 'pr-box', name: 'PR BOX',
    seo: {
      title: 'PR BOX: sitio web y panel de contenidos | ConexaCod',
      description: 'Caso PR BOX en Manizales: sitio web y panel administrativo para publicar WOD, horarios, anuncios y catálogo. Conozca la solución de ConexaCod.',
      relatedServiceIds: ['desarrollo-web', 'paneles-administrativos'],
    },
    logo: { src: prBoxLogo, alt: 'Logotipo de PR BOX', width: 150, height: 150 },
    category: 'Sitio web + plataforma administrativa', status: 'En producción',
    shortDescription: 'Sitio web y panel administrativo para PR BOX, centro de Cross Training y Official HYROX Training Club en Manizales. Centraliza WOD, anuncios, horarios, videos recomendados y merchandising para que la comunidad consulte información diaria y el equipo la actualice sin editar código.',
    context: 'PR BOX es un centro de entrenamiento de Manizales cuya comunicación digital dependía principalmente de redes sociales. El sitio debía servir tanto a nuevos visitantes como a miembros que consultan información recurrente.',
    need: 'Los miembros necesitaban consultar WOD, anuncios, horarios, videos recomendados y novedades sin depender de información dispersa. El equipo también requería actualizar esos contenidos sin editar código ni volver a desplegar el sitio.',
    solution: 'Se desarrolló una landing responsive en React y Vite, conectada con Supabase, junto con un panel administrativo protegido para gestionar WOD, anuncios, equipo, videos, multimedia, administradores y PR Merch.',
    result: 'PR BOX cuenta con un sitio oficial donde su comunidad consulta información actualizada y el equipo administra gran parte del contenido. PR Merch funciona como catálogo con un canal directo de consulta por WhatsApp.',
    technologies: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Cloudflare'],
    integrations: ['YouTube', 'WhatsApp', 'Google Maps', 'Supabase Auth', 'Supabase Storage'],
    features: ['Publicación y consulta del WOD diario.', 'Anuncios administrables con modo de visualización para TV.', 'Catálogo PR Merch con consultas dinámicas por WhatsApp.', 'PR BOX TV con videos recomendados administrables.', 'Panel administrativo con roles y recuperación de acceso.'],
    contribution: ['Arquitectura, frontend y diseño UI/UX responsive.', 'Panel administrativo, autenticación, roles y CRUD de contenidos.', 'Integración con Supabase, PostgreSQL, Storage y Edge Functions.', 'Despliegue, dominio y trabajo técnico de SEO.'],
    challenge: 'Convertir una landing con una identidad deportiva fuerte en una herramienta de uso cotidiano para visitantes y miembros recurrentes.',
    resolution: 'La solución evolucionó hacia una arquitectura de contenido administrable: una experiencia pública con identidad propia y un panel que permite operar los contenidos sin modificar el frontend.',
    liveUrl: 'https://prboxcf.com', detailPageEnabled: true, published: true,
  },
  {
    position: 2,
    id: 'serpleno', slug: 'serpleno', name: 'SERPLENO',
    seo: {
      title: 'SERPLENO: plataforma web de bienestar | ConexaCod',
      description: 'Explore el caso SERPLENO: plataforma de bienestar con contenidos, planes y agenda para clientes, profesionales y administración. Versión funcional documentada.',
      relatedServiceIds: ['plataformas-web', 'integraciones'],
    },
    logo: { src: serplenoLogo, alt: 'Logotipo de SERPLENO', width: 1080, height: 906 },
    category: 'Plataforma web de bienestar', status: 'Versión funcional documentada',
    shortDescription: 'Plataforma de bienestar que reúne contenido guiado, planes y sesiones profesionales. Centraliza procesos de bienestar físico y mental para que clientes, profesionales y administradores gestionen contenido, disponibilidad, citas, notificaciones y recursos desde experiencias diferenciadas.',
    context: 'SERPLENO se desarrolló para acompañar hábitos saludables mediante contenido práctico, planes, citas, notificaciones y recursos organizados dentro de una sola experiencia.',
    need: 'Era necesario centralizar contenido, acompañamiento profesional, agendamiento, recordatorios y planes con distintos niveles de acceso, sin fragmentar la operación entre clientes, profesionales y administración.',
    solution: 'Se construyó una aplicación web con flujos por rol. Clientes acceden a planes, contenidos, agenda y sesiones; profesionales administran calendario, recursos y grabaciones; el equipo administrativo gestiona la operación.',
    result: 'La solución documentada permite consultar contenido, seleccionar planes, agendar sesiones y acceder a salas virtuales. También contempla la gestión de disponibilidad, recursos, usuarios, contenidos y estadísticas según el rol.',
    technologies: ['PHP', 'HTML', 'CSS', 'JavaScript', 'MySQL / MariaDB', 'PDO'],
    integrations: ['Mercado Pago', 'Jitsi Meet', 'YouTube', 'Google Drive'],
    features: ['Registro, inicio de sesión y restablecimiento de contraseña.', 'Planes y contenido con niveles de acceso.', 'Agenda de sesiones según disponibilidad profesional.', 'Acceso controlado a salas virtuales.', 'Administración de usuarios, contenidos y estadísticas.'],
    contribution: ['Desarrollo frontend, backend y lógica de negocio.', 'Autenticación, sesiones y control de acceso por roles.', 'Módulos de planes, contenido, agenda, notificaciones, pagos y grabaciones.'],
    challenge: 'Organizar los recorridos de clientes, profesionales y administradores manteniendo permisos, información y herramientas diferentes para cada perfil.',
    resolution: 'Se implementó una estructura de rutas, sesiones y controles de acceso por rol, con beneficios y contenidos condicionados por el plan del cliente.',
    liveUrl: 'https://serplenoo.com/',
    detailPageEnabled: true, published: true,
  },
  {
    position: 4,
    id: 'estilo-emporium', slug: 'estilo-emporium', name: 'Estilo Emporium',
    seo: {
      title: 'Estilo Emporium: tienda virtual deportiva | ConexaCod',
      description: 'Caso Estilo Emporium: comercio electrónico con catálogo deportivo, personalización de prendas, pagos y pedidos. Conozca el trabajo de ConexaCod.',
      relatedServiceIds: ['comercio-electronico', 'integraciones'],
    },
    logo: { src: estiloEmporiumLogo, alt: 'Logotipo de Estilo Emporium', width: 746, height: 746 },
    category: 'E-commerce deportivo', status: 'En producción',
    shortDescription: 'Tienda virtual de ropa deportiva para hombre, mujer y niños, con catálogo, personalización de prendas, pagos en línea y seguimiento de pedidos desde una cuenta de cliente.',
    context: 'Estilo Emporium comercializa ropa deportiva y kits de fútbol personalizados. El proyecto convirtió esa oferta en una experiencia digital propia, administrable y orientada a la compra.',
    need: 'La operación requería un canal propio para organizar el catálogo, representar tallas, existencias, promociones y personalizaciones, recibir pagos y centralizar productos, pedidos y clientes.',
    solution: 'Se construyó una plataforma de comercio electrónico con catálogo, personalización, carrito, checkout, cuentas de cliente, seguimiento de pedidos y panel administrativo. El flujo conserva las opciones de personalización dentro de cada pedido.',
    result: 'Los compradores pueden explorar productos, seleccionar talla y personalizaciones, calcular envío, pagar en línea y consultar sus pedidos. El equipo puede mantener catálogo, promociones, pedidos y reseñas desde administración.',
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Node.js', 'MySQL / MariaDB'],
    integrations: ['Mercado Pago Checkout Pro', 'Cloudinary', 'Resend', 'WhatsApp'],
    features: ['Catálogo por categorías, búsqueda y fichas de producto.', 'Personalización de productos compatibles.', 'Carrito y checkout con cálculo de envío.', 'Cuentas de cliente e historial de pedidos.', 'Panel administrativo para productos, promociones, pedidos y reseñas.'],
    contribution: ['Diseño UI/UX y desarrollo frontend responsive.', 'Backend, base de datos, catálogo, carrito y checkout.', 'Integraciones de pagos, imágenes, correo y moderación de reseñas.', 'SEO básico y preparación de paquetes de despliegue.'],
    challenge: 'Conectar productos personalizables con todo el flujo de comercio electrónico sin perder la información de talla, nombres, dorsales, parches y costos asociados.',
    resolution: 'Las personalizaciones se modelaron por artículo y se guardan como copia dentro del pedido. El backend crea la orden y la preferencia de pago, mientras el webhook sincroniza los estados del pago y pedido.',
    liveUrl: 'https://www.estiloemporium10.com', detailPageEnabled: true, published: true,
  },
  {
    position: 1,
    id: 'citas-ya', slug: 'citas-ya', name: 'Citas Ya',
    seo: {
      title: 'Citas Ya: plataforma de reservas para barberías | ConexaCod',
      description: 'Conozca Citas Ya, plataforma de agendamiento para barberías: reservas, servicios y disponibilidad por barbero. MVP funcional en piloto desarrollado por ConexaCod.',
      relatedServiceIds: ['plataformas-web', 'automatizacion-procesos'],
    },
    logo: { src: citasYaLogo, alt: 'Logotipo de Citas Ya', width: 453, height: 435 },
    category: 'SaaS de agendamiento', status: 'MVP funcional en piloto',
    shortDescription: 'Plataforma web para barberías que digitaliza la gestión de citas, permitiendo a clientes reservar en línea y a los negocios organizar barberos, horarios, servicios y disponibilidad desde una misma plataforma.',
    context: 'Citas Ya se desarrolló para barberías que todavía coordinan reservas a través de mensajes, llamadas o agendas físicas, con una experiencia pensada para clientes y negocios.',
    need: 'La gestión manual de reservas puede producir cruces de horarios, espacios vacíos, pérdida de citas y demasiadas conversaciones para coordinar servicio, fecha, hora y barbero.',
    solution: 'Se construyó una plataforma web con flujos para clientes, barberos, negocios y administración. Incluye reservas, disponibilidad, servicios, perfiles, notificaciones, correos, mapas, enlaces personalizados y supervisión operativa.',
    result: 'Durante el piloto, la plataforma permitió localizar barberías, consultar disponibilidad y completar reservas; los negocios organizaron equipo y servicios, mientras los barberos gestionaron su perfil y agenda.',
    technologies: ['HTML', 'CSS modular', 'JavaScript', 'Arquitectura MVC', 'Supabase', 'PostgreSQL'],
    integrations: ['Resend', 'OpenStreetMap', 'Leaflet', 'Mercado Pago', 'Archivos .ics'],
    features: ['Reservas con cuenta o como invitado.', 'Selección de barbería, barbero, servicio, fecha y hora.', 'Disponibilidad individual por barbero y bloqueo de horarios.', 'Cancelación y reagendamiento de citas.', 'Correos, notificaciones y exportación a calendario.'],
    challenge: 'Construir un flujo de agendamiento flexible para clientes, barberías, barberos, servicios y horarios sin sacrificar la sencillez en celular.',
    resolution: 'Las pruebas del piloto guiaron ajustes iterativos sobre agenda, disponibilidad, usuarios y barberos, corrigiendo los principales recorridos en computador y celular.',
    liveUrl: 'https://citasyaa.com.co', detailPageEnabled: true, published: true,
  },
  {
    position: 5,
    id: 'efectuar-sas', slug: 'efectuar-sas', name: 'Efectuar SAS',
    seo: {
      title: 'Efectuar SAS: desarrollo web corporativo | ConexaCod',
      description: 'Caso Efectuar SAS: web corporativa centrada en licitaciones, servicios y proyectos. Explore la estructura y el trabajo de QA realizado por ConexaCod.',
      relatedServiceIds: ['desarrollo-web', 'modernizacion-sistemas'],
    },
    logo: { src: efectuarLogo, alt: 'Isotipo de Efectuar SAS', width: 581, height: 429 },
    category: 'Sitio web corporativo', status: 'Fase avanzada de QA y optimización',
    shortDescription: 'Sitio web corporativo para Efectuar SAS, diseñado para presentar su experiencia en estructuración de licitaciones y gestión técnica, comunicar servicios y respaldar comercialmente la empresa mediante proyectos, metodología, equipo y trayectoria.',
    context: 'Efectuar SAS requería construir y refinar una presencia corporativa que reflejara la prioridad estratégica de las licitaciones sobre sus demás líneas de servicio.',
    need: 'La estructura debía comunicar con claridad qué hace Efectuar, situar las licitaciones en el primer nivel de la narrativa y presentar progresivamente capacidades, experiencia y respaldo técnico.',
    solution: 'Se desarrolló un sitio corporativo responsive con hero comercial, navegación dinámica, servicios, proyectos, metodología, empresa, equipo, trayectoria, llamadas a la acción y contacto. La información se reorganizó para priorizar licitaciones.',
    result: 'La versión trabajada permite recorrer una presentación corporativa completa, conocer el enfoque en licitaciones, explorar servicios y casos, y acceder a los puntos de contacto y navegación de la empresa.',
    technologies: [], integrations: ['LinkedIn', 'Enlace de ubicación a mapas'],
    features: ['Navegación superior dinámica por secciones.', 'Hero comercial enfocado en licitaciones y gestión documental.', 'Proyectos y casos presentados con carrusel.', 'Metodología, equipo y trayectoria con timeline interactivo.', 'Llamadas a la acción y enlaces corporativos externos.'],
    contribution: ['Arquitectura de información, UI/UX y frontend responsive.', 'Navegación, interacciones, animaciones y comportamiento de scroll.', 'Reestructuración estratégica del contenido hacia licitaciones.', 'QA visual, tipográfico y responsive.'],
    challenge: 'Mantener la jerarquía y legibilidad de una web visualmente elaborada durante las animaciones y en distintos tamaños de pantalla, sin desplazar el foco de las licitaciones.',
    resolution: 'Se realizaron iteraciones sobre estructura, copy, orden de secciones, responsive y comportamiento visual; los casos de licitaciones recibieron prioridad y se ejecutaron ciclos específicos de QA.',
    liveUrl: 'https://efectuar-sas.vercel.app/',
    detailPageEnabled: true, published: true,
  },
] as const satisfies readonly PortfolioProject[]

export const portfolioProjects = [...portfolioProjectRecords].sort(
  (first, second) => first.position - second.position,
)

export function hasValidLiveUrl(value: string | undefined) {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function isPublishedProject(project: PortfolioProject): project is PortfolioProject & { logo: ProjectLogo } {
  return Boolean(project.published && project.slug.trim() && project.name.trim() && project.logo?.alt.trim() && project.shortDescription.trim() && project.need.trim() && project.solution.trim() && project.result.trim())
}

export const publishedPortfolioProjects = portfolioProjects.filter(isPublishedProject)

export function getPublishedProjectBySlug(slug: string) {
  return publishedPortfolioProjects.find((project) => project.slug === slug)
}
