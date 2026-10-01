export type Service = {
  id: string
  title: string
  problem: string
  includes: string
  benefit: string
  useCases: string
}

export type ServiceGroup = {
  title: string
  services: readonly Service[]
}

export const serviceGroups: readonly ServiceGroup[] = [
  {
    title: 'Diagnóstico, consultoría y definición',
    services: [
      {
        id: 'diagnostico-consultoria',
        title: 'Diagnóstico y consultoría tecnológica',
        problem: 'Aclara qué está frenando la operación y qué conviene resolver primero.',
        includes: 'Mapa del proceso actual, hallazgos, prioridades y ruta de trabajo.',
        benefit: 'Permite tomar decisiones con criterio y no por intuición.',
        useCases: 'Empresas que saben que tienen un problema, pero aún no la forma exacta de resolverlo.',
      },
      {
        id: 'desarrollo-web',
        title: 'Desarrollo web corporativo y funcional',
        problem: 'Evita que la presencia digital quede separada de la operación real.',
        includes: 'Sitios corporativos, formularios funcionales, secciones administrables y estructura clara.',
        benefit: 'La web deja de ser solo presencia y empieza a soportar procesos reales.',
        useCases: 'Empresas que necesitan presencia profesional conectada con contacto, agenda o captación.',
      },
      {
        id: 'plataformas-web',
        title: 'Plataformas web empresariales',
        problem: 'Centraliza flujos, usuarios y módulos en una plataforma propia.',
        includes: 'Paneles, permisos, estados, formularios, reportes y vistas operativas.',
        benefit: 'La empresa gana orden, trazabilidad y una base lista para crecer.',
        useCases: 'Operaciones que ya no pueden sostenerse solo con hojas de cálculo y mensajería.',
      },
    ],
  },
  {
    title: 'Operación, administración y control',
    services: [
      {
        id: 'sistemas-administrativos',
        title: 'Sistemas administrativos a medida',
        problem: 'Resuelve cuellos de botella donde la operación depende de procesos improvisados.',
        includes: 'Módulos administrativos, roles, aprobaciones, estados, históricos y control interno.',
        benefit: 'La operación deja de depender de memoria, chats o archivos aislados.',
        useCases: 'Empresas con procesos internos repetitivos, administrativos o de coordinación.',
      },
      {
        id: 'paneles-administrativos',
        title: 'Paneles administrativos',
        problem: 'Da visibilidad a lo que ocurre en tiempo real.',
        includes: 'Dashboards, listas filtrables, métricas clave, acciones rápidas y seguimiento.',
        benefit: 'Reduce tiempos de respuesta y mejora la lectura operativa.',
        useCases: 'Equipos que necesitan control diario sobre pedidos, clientes, agenda o procesos.',
      },
      {
        id: 'bases-datos-reportes',
        title: 'Bases de datos y reportes',
        problem: 'Evita la pérdida de información y la toma de decisiones sin contexto.',
        includes: 'Estructura de datos, consolidación, reportes exportables y métricas útiles.',
        benefit: 'La empresa gana una fuente más confiable para decidir y actuar.',
        useCases: 'Operaciones con información fragmentada, repetida o difícil de consultar.',
      },
      {
        id: 'comercio-electronico',
        title: 'Comercio electrónico, pedidos y pagos cuando aplique',
        problem: 'Organiza ventas, solicitudes y cobros cuando el proceso lo necesita.',
        includes: 'Catálogos, pedidos, estados, integraciones de pago y seguimiento del pedido.',
        benefit: 'El proceso comercial se vuelve más claro tanto para la empresa como para el cliente.',
        useCases: 'Negocios que venden productos, reciben pedidos o necesitan digitalizar cobros.',
      },
    ],
  },
  {
    title: 'Automatización e integraciones',
    services: [
      {
        id: 'automatizacion-procesos',
        title: 'Automatización de procesos',
        problem: 'Reduce pasos manuales que consumen tiempo y generan errores.',
        includes: 'Flujos automáticos, activadores, validaciones, estados y notificaciones.',
        benefit: 'El equipo libera tiempo y mejora consistencia en tareas repetitivas.',
        useCases: 'Procesos con seguimiento manual, copias de datos o tareas repetidas todos los días.',
      },
      {
        id: 'integraciones',
        title: 'Integraciones tecnológicas',
        problem: 'Evita que cada herramienta trabaje por separado.',
        includes: 'Conexiones entre sistemas, sincronización de datos y reglas entre plataformas.',
        benefit: 'La información circula sin duplicidad ni retrabajo.',
        useCases: 'Empresas que usan varias herramientas y necesitan que trabajen como un sistema.',
      },
      {
        id: 'whatsapp-business',
        title: 'WhatsApp Business y automatizaciones de comunicación',
        problem: 'Ordena respuestas, seguimientos y confirmaciones desde el canal más usado.',
        includes: 'Mensajes iniciales, secuencias, disparadores y flujos conversacionales simples.',
        benefit: 'Mejora respuesta comercial y operativa sin depender de seguimiento manual constante.',
        useCases: 'Equipos que atienden por WhatsApp, confirman procesos o reciben solicitudes recurrentes.',
      },
      {
        id: 'google-calendar',
        title: 'Integración con Google Calendar',
        problem: 'Automatiza asesorías y evita choques de agenda.',
        includes: 'Disponibilidad real, espacios agendados, eventos y enlaces de asesoría.',
        benefit: 'El agendamiento se vuelve más claro para el cliente y más controlado para la empresa.',
        useCases: 'Empresas que atienden por citas, asesorías programadas o agendas operativas.',
      },
    ],
  },
  {
    title: 'Evolución y continuidad',
    services: [
      {
        id: 'modernizacion-sistemas',
        title: 'Modernización de sistemas existentes',
        problem: 'Mejora herramientas actuales sin obligar a empezar desde cero.',
        includes: 'Ajustes de interfaz, lógica, integración, desempeño y estructura interna.',
        benefit: 'La empresa conserva lo útil y corrige lo que hoy limita su operación.',
        useCases: 'Sistemas antiguos, paneles lentos o herramientas internas que ya no alcanzan.',
      },
      {
        id: 'soporte-mantenimiento',
        title: 'Soporte, mantenimiento y evolución',
        problem: 'Evita que una solución útil se quede congelada o se deteriore con el tiempo.',
        includes: 'Ajustes, mejoras, acompañamiento, correcciones y evolución funcional.',
        benefit: 'La solución se mantiene viva y alineada con el crecimiento del negocio.',
        useCases: 'Empresas que quieren continuidad, estabilidad y mejoras progresivas.',
      },
    ],
  },
]
