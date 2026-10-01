# Estrategia SEO de ConexaCod

Fecha: 2026-10-01. Estado: arquitectura implementada y validada en una compilación de producción local; publicación y verificación del dominio pendientes por DNS. El mapa siguiente se documentó antes de cambiar metadatos o contenido.

## Estrategia ejecutiva y alcance

ConexaCod debe ser comprensible como proveedor de desarrollo web, software a medida y aplicaciones web desde Manizales para empresas en Colombia. El sistema combina intención distinta por página, evidencia de cinco proyectos, relaciones entre capacidades y casos, metadatos nativos de Next.js y entidades consistentes. Son 13 rutas indexables y una política provisional accesible con `noindex, follow`. No se prometen posiciones, volúmenes, demanda ni resultados comerciales.

Los cambios están en el código del workspace. No se han desplegado. La comprobación de `https://conexacod.com` sigue fallando con `Could not resolve host`; la consulta pública de Google DNS para el registro A devuelve una respuesta sin dirección, con SOA de Cloudflare. La revisión de publicación anterior también documenta ausencia de A/AAAA en el dominio raíz y NXDOMAIN en www: [Step 5D](../release/step5d-production-release.md). La presencia de canonical correcto en HTML local no demuestra que el destino público funcione. DNS, HTTPS y la redirección www → raíz deben verificarse tras asociar el dominio al despliegue correcto.

## Skills utilizados y reconciliación

Se enumeraron los skills instalados antes de editar y se consultaron estos recursos relevantes:

| Skill | Aplicación concreta |
| --- | --- |
| `seo` | Auditoría de fuente/HTML, intención, SEO local, EEAT, tipos de schema, calidad y cobertura semántica; guías `source-code-seo`, `schema-types`, `local-seo`, `core-web-vitals`, `eeat`, `geo-ai-search` y `quality-gates`. |
| `graphify` | Se intentó primero la consulta de arquitectura. Ante ausencia del ejecutable y del módulo Python, se consultaron directamente nodos/aristas existentes para metadatos, layout, sitemap, robots y generación de proyectos, y después la fuente. |
| `vercel:nextjs` | Metadatos por ruta, herencia del layout, `generateMetadata` con parámetros asíncronos y metadata routes; guía de metadatos y documentación local de Next.js 16.3.6 leídas antes de editar. |
| `web-design-guidelines` | Revisión de jerarquía de encabezados, landmarks, skip link, texto de anclas, foco visible, alt y dimensiones; breadcrumbs navegables sin texto oculto. |
| `security-audit` | Serialización de JSON-LD que escapa `<`, prueba de cierre hostil de script y compatibilidad con headers/CSP existentes. |
| `vercel:react-best-practices` | Datos estructurados y metadatos en servidor, datos compartidos pequeños, sin nueva dependencia/hook cliente ni cambio de carga de terceros. |
| `vercel:observability` | Inspección de Analytics existente y plan de eventos/medición; no se instalaron trackers, Drains ni integraciones. |
| `vercel:cdn-caching` | Inspección del modelo estático; sin evidencia pública de caché o ISR que justifique cambiar headers, TTL o revalidación. |
| `vercel:verification` | Verificación del flujo completo de descubrimiento: enlaces → respuesta HTTP → HTML/metadatos → entidad/schema → sitemap/robots. |
| `browser:control-in-app-browser` | Navegación de producción local, enlaces servicio/caso, revisión visual y consola; validación externa mediante fragmentos del JSON-LD renderizado. |

Las recomendaciones genéricas de cantidad mínima de palabras no se aplicaron mecánicamente: los formularios cumplen una intención transaccional y añadir relleno contradice el encargo. No se crearon blogs o páginas por ciudad. La guía genérica sobre `LocalBusiness`, `VideoObject`, FAQ, precarga, cambiar imágenes o diferir scripts se condicionó a datos y arquitectura reales: aquí no corresponde añadirlos solo por completar una lista. La excepción explícita del usuario conserva LogoLoop. No se cambiaron fuentes, caché, CSP ni el sistema cinematográfico.

`graphify update .` se intentó después de editar y falló porque Graphify no está instalado/disponible en este entorno; el Python indicado por el repositorio tampoco contiene `graphify` ni `networkx`. El grafo permanece pendiente de actualización en un entorno que disponga de su CLI. No se generó un grafo ficticio ni se instalaron herramientas.

## Auditoría inicial

| Área | Evidencia inicial y decisión |
| --- | --- |
| Metadatos | Existían helpers y metadatos por página; se precisó la intención de los títulos/descripciones. Los casos sobrescribían título/description/canonical, pero heredaban OG/Twitter del Inicio. Ahora cada caso tiene ambas familias sociales propias. |
| Identidad canónica | La URL podía depender de configuración de entorno. Se fijó una identidad SEO explícita al dominio solicitado; los parámetros de campaña no se trasladan al canonical de la ruta. |
| Datos estructurados | No había JSON-LD de organización, sitio, servicios, páginas ni breadcrumbs. Se implementó un grafo conectado con hechos del repositorio. |
| Sitemap | Incluía la política provisional y usaba fechas generadas al construir, prioridad y frecuencia. Se excluyó la política y se retiraron indicadores sin evidencia editorial. |
| Robots | Había exclusiones de directorios; se cubrieron también las rutas raíz `/admin` y `/api`, conservando acceso a recursos necesarios. |
| Semántica y contenido | Había un H1 por página, contenido server-rendered y jerarquía útil. No se sustituyeron titulares narrativos por frases repetitivas: se aclararon los párrafos de apoyo de Inicio y Soluciones. |
| Portafolio y enlaces | Los casos eran alcanzables desde Nosotros; faltaban relaciones contextuales con servicios y las tarjetas repetían anclas genéricas. Se añadieron vínculos bidireccionales y breadcrumbs. |
| Contacto/legal | La ciudad y país están documentados, pero no hay dirección postal completa, teléfono público ni correo público verificado. La política declara información pendiente. No se rellenaron esos campos. |
| Imágenes y video | Logos con alt/dimensiones y videos decorativos. Se conservaron los perfiles multimedia; no se añadió `VideoObject` para fondos cinematográficos. |
| Idioma/404 | Se conservó `lang="es"` y locale social/schema `es_CO`/`es-CO`. Las rutas inexistentes deben responder 404 y mantenerse fuera del sitemap. |

## Arquitectura de intención y mapa previo a implementación

Las capacidades y la base en Manizales están verificadas en `config/site.ts`, `/servicios`, `/nosotros` y los cinco casos de `config/portfolio.ts`. La investigación web es una muestra de resultados obtenidos con búsquedas sobre desarrollo web/software en Manizales y automatización en Colombia; no representa una SERP geolocalizada completa ni aporta volúmenes o posiciones.

| Ruta | Tema principal | Términos semánticos secundarios | Intención | Alcance |
| --- | --- | --- | --- | --- |
| `/` | Desarrollo web y software en Manizales | aplicaciones web, soluciones digitales, ConexaCod | Descubrimiento comercial de proveedor | Local con alcance Colombia |
| `/servicios` | Servicios de software a medida | plataformas empresariales, desarrollo web funcional, integraciones | Evaluar capacidades y alcance | Colombia |
| `/soluciones` | Digitalización de procesos empresariales | información dispersa, tareas repetitivas, automatización, trazabilidad | Resolver problemas operativos | Colombia |
| `/nosotros` | ConexaCod y sus proyectos | equipo/identidad sin inventar biografías, portafolio, Manizales | Marca, confianza y evidencia | Marca/local |
| `/proceso` | Proceso de desarrollo de soluciones digitales | diagnóstico, diseño, implementación, evolución | Comprender cómo se trabaja | Comercial informacional |
| `/contacto` | Contactar a ConexaCod | consulta sobre un proyecto digital | Transaccional de marca | Marca/local |
| `/agendar-asesoria` | Asesoría para digitalizar procesos | asesoría virtual, agenda, necesidad empresarial | Transaccional | Colombia |
| `/diagnostico` | Diagnóstico de procesos empresariales | tareas manuales, herramientas, contexto operativo | Transaccional guiada | Colombia |
| `/proyectos/citas-ya` | Caso Citas Ya: agenda para barberías | reservas, disponibilidad, SaaS en piloto | Evidencia específica | Proyecto |
| `/proyectos/serpleno` | Caso SERPLENO: plataforma de bienestar | roles, contenidos, sesiones | Evidencia específica | Proyecto |
| `/proyectos/pr-box` | Caso PR BOX: web y administración | Cross Training, contenido administrable, Manizales | Evidencia específica | Proyecto/local |
| `/proyectos/estilo-emporium` | Caso Estilo Emporium: comercio electrónico | catálogo, personalización, pedidos, pagos | Evidencia específica | Proyecto |
| `/proyectos/efectuar-sas` | Caso Efectuar SAS: web corporativa | licitaciones, arquitectura de información, QA | Evidencia específica | Proyecto |
| `/privacidad` | Política provisional | transparencia sobre datos pendientes | Utilidad legal; no promocionar en búsqueda mientras provisional | Noindex, follow |

Inicio presenta proveedor y ubicación; Servicios explica capacidades; Soluciones explica problemas. No se crean tres landing pages con la misma intención. Los casos conservan su identidad y estados reales, sin resultados cuantificados inventados. Privacidad continúa accesible desde formularios/pie, con noindex y fuera del sitemap mientras sea provisional.

## Investigación consultada

- [Manizales Virtual](https://www.manizalesvirtual.com/): combina oferta de desarrollo/consultoría y portafolio; sugiere intención de evaluación de proveedor.
- [Wacosta: desarrollo web](https://wacosta.com.co/diseno-y-desarrollo-web/): página comercial centrada en presencia digital y contacto.
- [Jaramillo Villegas: desarrollo a medida](https://jaramillovillegas.co/productos/desarrollo/): oferta de software para necesidades operativas específicas.
- [Andez: automatización en Colombia](https://andezconsultores.com/automatizacion-de-procesos-colombia/): resultado comercial centrado en procesos.

La diferenciación propuesta es una inferencia estratégica de esta muestra y de las capacidades documentadas, no una garantía de demanda ni rankings. No se copia texto ni se adoptan servicios de IA/apps nativas porque otros proveedores los mencionen.

## Enlaces implementados y cambios de contenido

Se mantienen navegación y portafolio. Servicios ↔ casos usan anclas estables y textos descriptivos; cada caso contiene Inicio → Nosotros → proyecto como breadcrumb visible, enlaces a capacidades relacionadas y contacto. Soluciones enlaza Servicios y el proceso. El rastreo local desde Inicio alcanza las 14 rutas públicas, incluida la política; no quedan casos huérfanos ni fragmentos internos rotos.

| Caso | Capacidades enlazadas en `/servicios` |
| --- | --- |
| Citas Ya | `#plataformas-web`, `#automatizacion-procesos` |
| SERPLENO | `#plataformas-web`, `#integraciones` |
| PR BOX | `#desarrollo-web`, `#paneles-administrativos` |
| Estilo Emporium | `#comercio-electronico`, `#integraciones` |
| Efectuar SAS | `#desarrollo-web`, `#modernizacion-sistemas` |

Las tarjetas ahora dicen “Ver caso de [proyecto]”. Los textos de los 13 servicios se conservan y pasan a una configuración compartida para evitar divergencia entre HTML, schema y relaciones. Inicio mantiene su H1 y aclara en el párrafo visible: “Desde Manizales, desarrollamos sitios web, software a medida y aplicaciones web que simplifican procesos y conectan la operación de empresas en Colombia.” Soluciones explicita información dispersa, herramientas desconectadas y tareas manuales. Los cinco casos conservan problema, trabajo realizado y estado real, incluidos MVP/piloto/QA; no se les atribuyen métricas ni testimonios nuevos.

## SEO local y confianza

Se usa la base verificada en Manizales, Caldas, Colombia y cobertura nacional sin repetir la ciudad en cada título. Inicio es la principal entrada comercial local; Nosotros aporta identidad y proyectos; PR BOX añade evidencia específica en Manizales. Contacto ofrece vías de consulta y asesoría, sin inventar NAP ni afirmar una oficina visitable.

El schema identifica una `Organization` con ubicación `Place` y `PostalAddress` parcial: locality Manizales, region Caldas, country CO. Esa ubicación no incluye calle ni describe una sucursal. `areaServed` declara Colombia. Se omitieron `LocalBusiness`/`ProfessionalService`, teléfono, email, legalName, coordenadas y `sameAs` por falta de datos confirmados. Tampoco se publicaron las variables placeholder del entorno como identidad verificable.

Google Business Profile es una recomendación condicionada a atención presencial real, en establecimiento o visitando clientes. Un negocio exclusivamente online no es elegible según [las reglas de Google](https://support.google.com/business/answer/13763036?hl=en-en). Confirmar esa modalidad antes de crear o reclamar un perfil. Si resulta elegible, usar el nombre real, categoría que corresponda a la actividad y datos verificados, mantener una única ficha y no usar oficinas virtuales; seguir [las normas de representación](https://support.google.com/business/answer/3038177?hl=en). No se creó ninguna ficha.

La confianza se apoya en evidencia existente: descripción del trabajo, tecnologías/alcance y estados de cinco casos. Futuras biografías, permisos de publicación de clientes, resultados documentados y referencias solo se incorporarán cuando existan fuentes reales. No se inventaron certificaciones o años de experiencia.

## Arquitectura técnica y metadatos

La implementación usa `Metadata`/`generateMetadata` y `MetadataRoute` nativos de Next.js. `config/seo.ts` centraliza `https://conexacod.com` y la política de indexación; `lib/metadata.ts` genera título, description, canonical, Open Graph, Twitter y robots coherentes. El layout conserva defaults y `metadataBase` absoluto. Los títulos completos son absolutos para evitar duplicar la marca con la herencia del layout. No hay meta keywords ni alternates de idiomas inexistentes.

Cada página pública y cada proyecto tiene una descripción única y canonical propio; las rutas de proyecto siguen usando los slugs publicados, parámetros asíncronos y `notFound()` para un slug inexistente. La política provisional tiene `noindex, follow` y continúa accesible para usuarios. Los 404 siguen con noindex y no se canonicalizan falsamente al Inicio. Una visita a `/servicios?utm_source=...` mantiene `/servicios` como canonical.

Cuando `VERCEL_ENV` es `preview` o `development`, o se conserva la bandera de dominio placeholder, se desactiva indexación: metadata noindex, robots disallow global y sitemap vacío. Los canonicals siguen identificando el dominio final. La prueba de límites incluye un entorno preview con `NEXT_PUBLIC_SITE_URL` externo para verificar que el host no contamina la identidad SEO. Un despliegue de pruebas fuera de Vercel debe proporcionar una configuración equivalente de preview; este cambio no inventa una detección universal del host.

## Arquitectura de datos estructurados

Dos scripts JSON-LD server-rendered por página comparten identificadores absolutos: el primero define `Organization` y `WebSite`; el segundo define la página y sus entidades particulares. Cada entidad aparece una vez por documento; las referencias usan `@id`. `lib/json-ld.ts` escapa `<` antes de insertar JSON para impedir que texto del modelo termine un script. No se añadió librería SEO, dependencia, script externo ni permiso nuevo en CSP.

| Contexto | Tipos y propósito |
| --- | --- |
| Todas las páginas públicas | `Organization`, `WebSite`, y entidad de página. |
| Nosotros | `AboutPage`. |
| Contacto | `ContactPage`. |
| Resto de páginas estáticas | `WebPage`. |
| Servicios | `WebPage` con 13 entidades `Service`, proveedor ConexaCod, texto derivado del contenido visible y URL del fragmento correspondiente. |
| Cada proyecto | `WebPage`, `CreativeWork` para el caso escrito, `BreadcrumbList` con las mismas tres posiciones visibles. |

`CreativeWork` describe la página de evidencia escrita, no vende el proyecto como un producto con precio o valoración. Los logos del caso se referencian con URLs absolutas de assets existentes. No se añadieron Review/AggregateRating, FAQPage, VideoObject, SearchAction, premios ni KPIs.

Schema.org y resultados enriquecidos son comprobaciones distintas. El validador externo aceptó los fragmentos de Servicios y PR BOX con cero errores/advertencias. Esto confirma el vocabulario y las relaciones de esas muestras, no garantiza resultados enriquecidos ni valida la disponibilidad del dominio. `Service` y `CreativeWork` se usan para describir entidades; no se afirma un resultado enriquecido específico por usarlos. Breadcrumb puede ser elegible si Google procesa una página pública que cumpla [sus requisitos](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb). La representación de organización sigue [la guía oficial](https://developers.google.com/search/docs/appearance/structured-data/organization); el logo SVG existente tiene 180×180 y responde localmente, pero su rastreo público sigue pendiente.

## Robots, sitemap, canonical y recursos sociales

`/sitemap.xml` contiene exactamente 13 URLs de producción: ocho páginas estáticas indexables y cinco proyectos. No incluye privacidad provisional, admin, APIs, pruebas o 404. Se omitió `lastModified` al no existir una fecha editorial fiable; no se inventa una fecha por cada build. Google ignora `priority` y `changefreq`, y requiere fechas de modificación significativas cuando se declaran, según [su documentación](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Robots público permite `/`, excluye `/admin$`, `/admin/`, `/api$` y `/api/` y declara `https://conexacod.com/sitemap.xml`. No bloquea `_next`, CSS, JavaScript, logos, imágenes o videos. Privacidad permanece rastreable para que se pueda leer su noindex. Robots no constituye un control de acceso; se conservan autenticación y seguridad existentes.

El host canónico es HTTPS sin www. No se verificó una redirección www pública debido al fallo DNS; configurarla/verificarla en el proveedor real con una redirección permanente que preserve path y parámetros. No se añadió una regla de servidor local fingiendo que resuelve DNS.

OG y Twitter ahora tienen título/description propios en todas las rutas, incluidos los cinco casos. Se reutiliza la imagen de marca existente, `hero-monument-conexacod.png` (1254×1254; aproximadamente 1,71 MiB), sin fabricar gráficos. Icono, manifest, imagen social y logos enlazados por schema responden 200 en producción local. Una imagen editorial 1200×630 para la marca y posters específicos de casos son oportunidades futuras, con revisión visual y factual; no están generados ni implementados aquí.

## Rendimiento, accesibilidad y límites de evidencia

Se reutilizaron [Step 4A](../performance/cinematic-step4a-performance-audit.md), [Step 4B](../performance/cinematic-step4b-validation.md) y [Step 4C](../performance/cinematic-step4c-startup-buffering.md). Step 4A registró LCP local de 4,32–4,51 s asociado al reveal del titular y CLS bajo; no estableció INP real. Step 4C rechazó las variantes de diferimiento de video1 y conserva la política original. Estos datos históricos de laboratorio no son una medición nueva de SEO ni un aprobado global de Core Web Vitals.

Los cambios SEO agregan texto, enlaces y JSON-LD estático en servidor. No modifican controladores cinematográficos, medios, perfiles, reencoding, fuentes, CSS global, autenticación, rate limiting, CAPTCHA o headers. Se conserva el componente cliente LogoLoop y su advertencia de lint preexistente. Se ejecutaron las tres suites cinematográficas porque cambió SiteShell/layout y se añadió únicamente la prop `id` a Reveal.

Un H1 por ruta, un main, skip link, heading hierarchy y alt/dimensiones se comprobaron en HTML. Los breadcrumbs y enlaces nuevos tienen foco visible y texto identificable. Los videos decorativos no sustituyen la explicación rastreable. La inspección visual de PR BOX y navegación caso → servicio funcionó en navegador de escritorio sin errores/warnings de la aplicación ni mensajes de CSP. No se afirma una nueva prueba de teléfono físico ni una medición de CWV: el intento de override móvil no cambió el viewport observable y se restableció.

Después de publicar, evaluar LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1 al percentil 75, distinguiendo móvil/escritorio, según [Web Vitals](https://web.dev/articles/vitals). Sin datos de usuarios reales o CrUX suficiente, el estado será “sin datos”; no se reemplaza por ceros ni por un score inventado. Ninguna mejora cuantitativa de estos indicadores se atribuye a esta implementación.

## Validación ejecutada

| Comprobación | Resultado y alcance |
| --- | --- |
| `npm run build` | PASS, Next.js 16.3.6; compilación de producción y prerenderizado de 30 páginas totales. |
| `npx --no-install tsc --noEmit` | PASS. |
| `npm run lint` | PASS: cero errores; una advertencia preexistente de `<img>` en LogoLoop. |
| `node --import tsx scripts/test-security-baseline.ts` | PASS. |
| `node --import tsx scripts/test-cinematic-seek.ts` | PASS. |
| `node --import tsx scripts/test-cinematic-transitions.ts` | PASS. |
| `node --import tsx scripts/test-cinematic-source-switch.ts` | PASS. |
| `node --import tsx scripts/test-seo-boundaries.ts` | PASS en configuración normal y preview; escape hostil, identidad canónica y límites de indexación. |
| `node scripts/test-seo-rendered.mjs http://127.0.0.1:3105` | PASS: 14 rutas HTTP 200, 13 entradas sitemap, títulos/descripciones únicos, canonical exacto, OG/Twitter propios, JSON válido, referencias consistentes, 13 services y anchors coincidentes, enlaces internos y assets resueltos, index/noindex esperado, dos 404 reales y canonical sin UTM. |
| Headers y consola | CSP existente, `frame-ancestors 'none'`, sin `unsafe-eval`, nosniff, sin powered-by; sin errores/warnings CSP en las páginas locales observadas. |
| [Schema.org Validator](https://validator.schema.org/) | Fragmentos extraídos del HTML de Servicios y PR BOX: 0 errores y 0 advertencias. No se presenta como Google Rich Results Test. |
| `git diff --check` | PASS. |
| Graphify update | Pendiente: CLI/módulo no disponibles. |
| Producción pública | Pendiente: DNS no resuelve. Canonicals locales validados contra el servidor local, no contra un despliegue accesible. |

La prueba HTTP guarda la matriz real en `.local/seo/route-matrix.json`, evidencia de trabajo ignorada por Git. Los scripts nuevos se pueden repetir tras construir y arrancar un servidor local; no aceptan auditar un host externo accidentalmente. Build usó una URL de base de datos placeholder solo en el proceso cuando fue necesaria; no se alteró `.env` ni se contactó/mutó una base de datos. Se preservaron cambios preexistentes del workspace. No hay commit, push ni despliegue nuevo.

## Archivos de esta implementación

| Archivos | Responsabilidad |
| --- | --- |
| `config/site.ts`, `config/portfolio.ts` | Intención y metadatos de páginas/casos; indexación de privacidad y relaciones con servicios. |
| `config/seo.ts` (nuevo), `lib/metadata.ts` | Identidad canónica y helpers de metadata por ruta. |
| `config/services.ts` (nuevo) | Los 13 servicios existentes compartidos entre vista, links y schema. |
| `lib/structured-data.ts`, `lib/json-ld.ts`, `components/seo/json-ld.tsx` (nuevos) | Grafo de entidades, escape seguro y scripts renderizados en servidor. |
| `app/layout.tsx`, `components/site-shell.tsx` | Defaults e inserción de schema global/página. |
| `app/page.tsx`, `app/nosotros/page.tsx`, `app/soluciones/page.tsx`, `app/servicios/page.tsx`, `app/proceso/page.tsx`, `app/contacto/page.tsx`, `app/agendar-asesoria/page.tsx`, `app/diagnostico/page.tsx`, `app/privacidad/page.tsx` | Esquema por página; servicios y soluciones añaden relaciones contextuales. |
| `app/proyectos/[slug]/page.tsx` | Metadatos y grafo propios del proyecto, con comportamiento 404 conservado. |
| `app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx` | Rastreo, URLs indexables y referencias sociales correctas en 404. |
| `components/home-hero.tsx` | Claridad de oferta/localidad en el párrafo existente. |
| `components/portfolio/project-detail.tsx`, `components/portfolio/project-card.tsx` | Breadcrumbs y enlaces servicio/caso/contacto descriptivos. |
| `components/reveal.tsx` | Prop `id` opcional para los fragmentos de servicio; sin cambio de animación. |
| `scripts/test-seo-boundaries.ts`, `scripts/test-seo-rendered.mjs` (nuevos) | Pruebas de límites y verificación de HTML/HTTP. |
| `docs/seo/conexacod-seo-strategy.md` (nuevo) | Estrategia, mapa renderizado, validaciones y hoja de medición. |

No se modificaron lockfiles ni dependencias para SEO. Los cambios previos presentes en estos mismos archivos permanecen; esta tabla identifica los archivos tocados durante SEO, no adjudica todo el diff acumulado a esta tarea.

## Configuración pendiente de Search Console y Bing

1. Resolver el dominio con el despliegue real y verificar HTTPS, respuesta 200, versión de código, canonical, robots y sitemap. Comprobar la redirección www y que el despliegue productivo no tenga `VERCEL_ENV=preview` ni `domainIsPlaceholder` activado.
2. Abrir [Google Search Console](https://search.google.com/search-console), añadir propiedad de tipo Dominio `conexacod.com` y obtener el TXT real de la cuenta propietaria. Publicarlo en el DNS autorizado y completar “Verificar”, siguiendo [el procedimiento de propiedad](https://support.google.com/webmasters/answer/9008080?hl=es). Conservar ese token en DNS; no se inventó ni insertó un valor en el código.
3. En Sitemaps enviar `https://conexacod.com/sitemap.xml`; revisar lectura, URLs descubiertas y errores. Inspeccionar `/`, `/servicios`, `/soluciones`, `/nosotros` y casos, usar prueba de URL publicada y confirmar canonical elegido/noindex, render y assets. Solicitar indexación cuando la página sea accesible y correcta; la solicitud no garantiza inclusión.
4. Revisar Indexación de páginas, Seguridad/acciones manuales, Experiencia/CWV cuando haya datos y Rendimiento → resultados de búsqueda con filtros de país Colombia, dispositivo, página y consulta. Anotar fecha de publicación para comparaciones posteriores.
5. Abrir [Bing Webmaster Tools](https://www.bing.com/webmasters/), importar la propiedad verificada de Google si el propietario autoriza el vínculo, o añadirla manualmente y usar el método/token real presentado por Bing. Enviar el mismo sitemap y verificar rastreo. Procedimiento: [Añadir y verificar un sitio](https://www2.bing.com/webmasters/help/add-and-verify-site-12184f8b).

No se hallaron tokens de verificación existentes que sustituir. No se solicitaron permisos de cuentas ni se publicaron archivos de verificación arbitrarios. La titularidad/DNS y la existencia de las propiedades no pueden deducirse de que el repositorio tenga metadatos correctos.

## Analítica existente y recomendaciones separadas del código

Existe `@vercel/analytics` 1.6.1 y su componente condicionado a producción en el layout. Se conserva esa integración. No se agregó GA4, Speed Insights, pixel, SDK ni envío personalizado de eventos. Tener el componente no demuestra que el dashboard del proyecto correcto esté recibiendo datos; confirmarlo después de publicar. Search Console proveerá la medición de búsqueda; Analytics puede apoyar navegación/engagement según la configuración y plan reales.

| Evento recomendado, NO implementado | Disparador futuro y utilidad |
| --- | --- |
| `contact_cta_click` | Click en CTA identificado; distinguir interés de envío real. |
| `advisory_entry` | Entrada a asesoría; analizar abandono del flujo. |
| `contact_submission_success` | Solo respuesta exitosa real del backend, no al pulsar enviar ni ante un error. |
| `advisory_booking_success` | Solo reserva persistida/confirmada por el flujo real, no éxito simulado ni apertura de la agenda. |
| `diagnostic_submission_success` | Solo envío validado y exitoso del diagnóstico. |
| `project_case_engagement` | Navegación a caso/CTA con slug público, sin inflar una simple impresión como conversión. |

Una futura implementación puede enviar ruta, slug y ubicación del CTA; no nombres, emails, teléfonos, respuestas libres o payloads de diagnóstico. Definir consentimiento/política y requisitos reales de la herramienta antes de añadir tracking. La atribución de conversiones orgánicas no se obtiene uniendo identificadores privados con Search Console: es una medición a diseñar, no ya instalada.

## Oportunidades futuras y riesgos de canibalización

El orden siguiente es una prioridad estratégica basada en la muestra de búsqueda y los casos, sin volúmenes validados. Cada nueva página exige una necesidad distinta, ejemplos útiles, evidencia y revisión humana; no se crea automáticamente.

| Prioridad | Oportunidad | Valor y límites |
| --- | --- | --- |
| 1 | Guía: cuándo pasar de hojas de cálculo a software a medida | Diagnóstico de proceso, criterios de alcance y ejemplos reales; enlace a Servicios/Diagnóstico, sin promesas de ahorro. |
| 2 | Guía de reservas y disponibilidad para barberías | Problemas específicos con evidencia de Citas Ya, indicando su estado MVP/piloto. |
| 3 | Caso ampliado de catálogo y pedidos personalizables | Estilo Emporium y decisiones reales de comercio electrónico; cifras solo documentadas y autorizadas. |
| 4 | Contenido sobre web administrable y publicación operativa | PR BOX/Efectuar y comparación de necesidades de contenido, sin convertir casos en clones de Servicios. |
| 5 | Explicación de integración de agenda/WhatsApp con procesos | Solo capacidades confirmadas, requisitos de integración y límites; no inventar bots de IA ni integraciones productivas ya activas. |

Riesgos: una landing “desarrollo web Manizales” muy parecida al Inicio dividiría su intención; Servicios y Soluciones deben seguir diferenciando capacidad de problema. Contacto, Asesoría y Diagnóstico deben cumplir sus flujos, sin perseguir todos los mismos términos comerciales. Los casos se evalúan por su nombre/sector/evidencia, no como cinco páginas para “software Colombia”. Revisar consultas por landing en Search Console antes de ampliar la arquitectura; no asumir canibalización solo porque dos páginas compartan una palabra.

## Plan de medición 30/60/90 días

El día 0 es la publicación accesible y verificada, no la fecha de este documento. No hay baselines medidos de tráfico orgánico, posición, conversiones o indexación actual.

| Ventana | Qué medir y comparar | Decisión |
| --- | --- | --- |
| Días 0–30 | DNS/HTTPS, redirecciones, sitemap leído, URLs indexadas/no indexadas y motivos, errores de rastreo, canonical elegido, consultas por landing; recoger impresiones, clics, CTR y posición media como baseline, sin objetivos inventados. | Corregir errores técnicos verificables; revisar la exclusión intencionada de Privacidad; comprobar funcionamiento real de contacto/agenda y recepción de Analytics. |
| Días 31–60 | Tendencias de impresiones/clics/CTR/posición por página y consulta; marca vs no marca, intención local Manizales/Caldas vs nacional Colombia, dispositivos y oportunidades de engagement/conversión según eventos que se hayan autorizado después. | Afinar título/description cuando impresión y consulta revelen desajuste; conservar coherencia de intención; evaluar qué contenidos merecen desarrollo, evitando cambios simultáneos que impidan interpretar resultados. |
| Días 61–90 | Comparación con periodos equivalentes, cobertura de casos/servicios, duplicación de consultas entre páginas, calidad de consultas y contactos; CWV de campo si existe muestra suficiente. | Consolidar páginas si compiten por la misma necesidad; ampliar uno o dos temas con evidencia; priorizar mejoras de rendimiento solo ante datos reproducibles. |

Registrar cada modificación con fecha, URL y propósito. Separar país, dispositivo y consultas de marca (ConexaCod y variantes) de descubrimiento comercial. Posición media es un agregado contextual, no una posición fija en toda Colombia. No confundir aumento de impresiones con contactos cualificados, ni errores de prueba con conversiones. Si no hay muestra suficiente, ampliar el periodo y conservar “sin datos”.

## Información del propietario todavía necesaria

Necesario para verificar publicación: proveedor/proyecto de despliegue real y DNS del dominio; propiedad Search Console/Bing y tokens reales si se desea verificación por archivo/meta en vez de DNS. Necesario para completar contacto y política: responsable legal de datos, correo público confirmado y política definitiva coherente con el tratamiento real. Teléfono/WhatsApp y perfiles sociales confirmados solo si se desean publicar.

Dirección completa y atención presencial son opcionales y requieren confirmación si se quiere evaluar SEO de una ubicación/Google Business Profile; no son un prerrequisito para el schema `Organization` implementado. Evidencia autorizada de resultados, biografías o credenciales puede fortalecer futuros casos sin inventar datos. Hasta entonces esos campos permanecen omitidos y Privacidad no se promociona en búsqueda.

## Matriz final del HTML renderizado

Datos extraídos de respuestas HTTP de la compilación final local. El tema/intención corresponden al mapa estratégico anterior; metadatos, H1, schema, enlaces y robots se verificaron en HTML. Todas las rutas siguientes respondieron 200. `Organization` + `WebSite` están presentes en todas y se abrevian en la columna de schema. Los enlaces listados son un subconjunto contextual de los links reales; la navegación general añade Inicio, Nosotros, Soluciones, Servicios, Proceso, Contacto y Asesoría.

| Ruta | Intención | Tema principal | Title | Description | Canonical | H1 | Schema adicional | Enlaces importantes | Indexabilidad |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | Proveedor comercial/local | Desarrollo web y software en Manizales | Desarrollo web y software en Manizales &#124; ConexaCod | Desde Manizales, desarrollamos sitios web, software a medida y aplicaciones web para empresas en Colombia. Conozca nuestros proyectos y soluciones. | https://conexacod.com | Transformamos problemas empresariales en soluciones digitales. | WebPage | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria`, `/diagnostico` | index, follow |
| /nosotros | Marca y evidencia | ConexaCod y sus proyectos | ConexaCod: quiénes somos y qué hemos construido | Conozca ConexaCod, nuestra base en Manizales y forma de trabajar. Explore cinco proyectos de desarrollo web, plataformas y comercio electrónico. | https://conexacod.com/nosotros | Pensamos en grande. Construimos desde lo cercano. | AboutPage | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria`, `/proyectos/citas-ya`, `/proyectos/serpleno`, `/proyectos/pr-box`, `/proyectos/estilo-emporium`, `/proyectos/efectuar-sas`, `/diagnostico` | index, follow |
| /soluciones | Problema operativo | Digitalización de procesos empresariales | Digitalización de procesos empresariales &#124; ConexaCod | Organice información, conecte herramientas y reduzca tareas manuales. Explore soluciones digitales adaptadas a los procesos de su empresa. | https://conexacod.com/soluciones | Cada solución empieza por encontrar el problema correcto. | WebPage | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria`, `/diagnostico` | index, follow |
| /servicios | Evaluar capacidades | Software a medida y servicios digitales | Software a medida, desarrollo web e integraciones &#124; ConexaCod | Explore desarrollo web, plataformas empresariales, software a medida, automatización e integraciones. Defina el alcance que necesita su operación. | https://conexacod.com/servicios | Convertimos una necesidad en algo que puedes ver, usar y poner a trabajar. | WebPage, Service | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria`, `/diagnostico`, `/proyectos/pr-box`, `/proyectos/efectuar-sas`, `/proyectos/citas-ya`, `/proyectos/serpleno`, `/proyectos/estilo-emporium` | index, follow |
| /proceso | Comercial informacional | Proceso de desarrollo de soluciones | Cómo desarrollamos su solución digital &#124; ConexaCod | Conozca las siete etapas de ConexaCod: comprensión, diagnóstico, diseño, desarrollo, integración, implementación y mejora de su solución digital. | https://conexacod.com/proceso | Lo que ves es el resultado. El proceso ocurre mucho más profundo. | WebPage | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria`, `/diagnostico` | index, follow |
| /contacto | Transaccional de marca | Contactar a ConexaCod | Contacte a ConexaCod para su proyecto digital | Cuéntenos qué necesita resolver su empresa. Contacte a ConexaCod desde Manizales o elija una asesoría virtual o un diagnóstico de procesos. | https://conexacod.com/contacto | Veamos el panorama completo y construyamos lo que sigue. | ContactPage | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria`, `/diagnostico` | index, follow |
| /agendar-asesoria | Transaccional | Asesoría sobre procesos | Agende una asesoría sobre sus procesos &#124; ConexaCod | Solicite una asesoría virtual de 30 minutos para revisar su necesidad de software o automatización. Consulte los horarios disponibles en la agenda. | https://conexacod.com/agendar-asesoria | Programe una asesoría inicial para revisar qué proceso conviene ordenar o automatizar. | WebPage | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria`, `/diagnostico` | index, follow |
| /diagnostico | Transaccional guiada | Diagnóstico de procesos | Diagnóstico de procesos empresariales &#124; ConexaCod | Describa sus procesos, herramientas y tareas repetitivas en el diagnóstico guiado de ConexaCod. Comparta el contexto para definir el siguiente paso. | https://conexacod.com/diagnostico | Explique su problema por etapas y convirtámoslo en un siguiente paso claro. | WebPage | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria` | index, follow |
| /privacidad | Utilidad legal | Política provisional | Privacidad &#124; ConexaCod | Revise la versión provisional de la política de privacidad de ConexaCod y los datos pendientes de validación legal antes del despliegue final. | https://conexacod.com/privacidad | Versión provisional de la política de privacidad para la salida 1.0. | WebPage | `/nosotros`, `/soluciones`, `/servicios`, `/proceso`, `/contacto`, `/agendar-asesoria` | noindex, follow |
| /proyectos/citas-ya | Evidencia sectorial | Reservas para barberías: Citas Ya | Citas Ya: plataforma de reservas para barberías &#124; ConexaCod | Conozca Citas Ya, plataforma de agendamiento para barberías: reservas, servicios y disponibilidad por barbero. MVP funcional en piloto desarrollado por ConexaCod. | https://conexacod.com/proyectos/citas-ya | Citas Ya | WebPage, CreativeWork, BreadcrumbList | `/nosotros`, `/contacto`, `/servicios#plataformas-web`, `/servicios#automatizacion-procesos` | index, follow |
| /proyectos/serpleno | Evidencia sectorial | Plataforma de bienestar: SERPLENO | SERPLENO: plataforma web de bienestar &#124; ConexaCod | Explore el caso SERPLENO: plataforma de bienestar con contenidos, planes y agenda para clientes, profesionales y administración. Versión funcional documentada. | https://conexacod.com/proyectos/serpleno | SERPLENO | WebPage, CreativeWork, BreadcrumbList | `/nosotros`, `/contacto`, `/servicios#plataformas-web`, `/servicios#integraciones` | index, follow |
| /proyectos/pr-box | Evidencia local | Web y panel de contenidos: PR BOX | PR BOX: sitio web y panel de contenidos &#124; ConexaCod | Caso PR BOX en Manizales: sitio web y panel administrativo para publicar WOD, horarios, anuncios y catálogo. Conozca la solución de ConexaCod. | https://conexacod.com/proyectos/pr-box | PR BOX | WebPage, CreativeWork, BreadcrumbList | `/nosotros`, `/contacto`, `/servicios#desarrollo-web`, `/servicios#paneles-administrativos` | index, follow |
| /proyectos/estilo-emporium | Evidencia sectorial | Tienda deportiva: Estilo Emporium | Estilo Emporium: tienda virtual deportiva &#124; ConexaCod | Caso Estilo Emporium: comercio electrónico con catálogo deportivo, personalización de prendas, pagos y pedidos. Conozca el trabajo de ConexaCod. | https://conexacod.com/proyectos/estilo-emporium | Estilo Emporium | WebPage, CreativeWork, BreadcrumbList | `/nosotros`, `/contacto`, `/servicios#comercio-electronico`, `/servicios#integraciones` | index, follow |
| /proyectos/efectuar-sas | Evidencia sectorial | Web corporativa: Efectuar SAS | Efectuar SAS: desarrollo web corporativo &#124; ConexaCod | Caso Efectuar SAS: web corporativa centrada en licitaciones, servicios y proyectos. Explore la estructura y el trabajo de QA realizado por ConexaCod. | https://conexacod.com/proyectos/efectuar-sas | Efectuar SAS | WebPage, CreativeWork, BreadcrumbList | `/nosotros`, `/contacto`, `/servicios#desarrollo-web`, `/servicios#modernizacion-sistemas` | index, follow |

Extracción HTTP final: 2026-10-01T22:12:42.280Z. La fila de Privacidad documenta la exclusión intencional; las otras 13 son indexables en producción configurada correctamente.
