# DACRIBEL: PLAN MAESTRO DE FORTIFICACIÓN DIGITAL (SECURITY FORCED PHASE)

---

## 🏆 REGLAS DE ORO (INVIOLABLES)
1. **NUNCA GUARDAR COPIAS DE SEGURIDAD (BACKUPS, DUMPS DE BASE DE DATOS, ARCHIVOS BINARIOS) EN GITHUB. ESTA ESTRICTAMENTE PROHIBIDO.**
2. **NUNCA COMENZAR UN PROCESO DE TRABAJO SIN AUTORIZACIÓN EXPRESA DEL USUARIO. ESTA TOTAL Y ESTRICTAMENTE PROHIBIDO.**

---

Este documento es el único mapa de ruta oficial para la implementación de seguridad en Dacribel. Se ejecutará mediante micro-pasos para garantizar la estabilidad total de la plataforma.

## ESTATUS DE IMPLEMENTACIÓN GLOBAL
*   **Nivel de Seguridad Actual:** Básico (Capa de datos activa).
*   **Estabilidad del Sistema:** Estable (Port 3003 activo).
*   **Regla de Oro:** Ningún cambio se aplica sin la aprobación previa del paso correspondiente.

---

## FASE 1: CIMIENTOS DE DATOS Y AUDITORÍA (CAPA 1)
Estrategia: Asegurar que la base de datos sea la última línea de defensa y que toda acción administrativa sea rastreable.

*   [x] **Paso 1.1: Creación de Infraestructura de Auditoría.** (Tabla `audit_logs` creada en Supabase).
*   [x] **Paso 1.2: Activación de Triggers de Auditoría.** (Functions y Triggers instalados en 5 tablas críticas).
*   [x] **Paso 1.3: Auditoría Estricta de RLS.** (Políticas blindadas y optimizadas para eliminar recursión infinita).
*   [x] **Paso 1.4: Blindaje de la tabla `profiles`.** (Implementada función `is_admin()` para control de roles y acceso administrativo).

---

## FASE 2: BLINDAJE DE RED E INFRAESTRUCTURA (CAPA 2)
Estrategia: Evitar que el navegador sea utilizado como un arma contra el servidor a través de inyecciones o suplantaciones.

*   [x] **Paso 2.1: Implementación de Cabeceras Globales.** (Configuración verificada: se añadió soporte para `flagcdn.com`, `wikimedia.org`, `gamerantimages.com` y `notebookcheck.org` para asegurar visualización total de banners e iconos).
*   [x] **Paso 2.2: Refinamiento de CSP (Content Security Policy).** (Implementado: Lista blanca estricta para Google Auth y Dominios de Supabase en `next.config.mjs`).
*   [x] **Paso 2.3: Configuración de HSTS (Strict-Transport-Security).** (Verificado y Activo: max-age 1 año con preload habilitado en `next.config.mjs`).
*   [x] **Paso 2.4: Protección Anti-Sniffing y Clickjacking.** (Implementado: X-Frame-Options: DENY y X-Content-Type-Options: nosniff activos en `next.config.mjs`).

---

## FASE 3: BLINDAJE DE ACTIVOS Y DATOS (SUPABASE STORAGE)
Estrategia: Eliminar dependencias de dominios externos (Wikimedia, GameRant, etc.) y centralizar todos los archivos en tu propio servidor de Supabase Storage para un control total.

*   [x] **Paso 3.1: Creación del Búnker de Archivos (Buckets).** (Buckets `app-assets` y `products` creados y confirmados en Supabase).
*   [x] **Paso 3.2: Políticas de Acceso (RLS para Storage).** (Reglas de lectura pública y escritura solo para administradores instaladas).
*   [x] **Paso 3.3: Actualización de Panel Administrativo (Banners).** (Selector de archivos e integración con Supabase Storage implementados con éxito).
*   [x] **Paso 3.4: Actualización de Panel Administrativo (Categorías).** (Sistema de carga de logos de consolas migrado a almacenamiento propio).
*   [x] **Paso 3.5: Purga de Seguridad (Consolidación de CSP).** Borrar todos los dominios temporales de `next.config.mjs` y bloquear cualquier imagen externa. (**Completado:** Dacribel es ahora 100% independiente de activos externos).

---

*   [x] **Paso 4.1: Activación de Identidad de Búnker (SMTP Profesional).** (Transición de Gmail a Resend completada para asegurar entregas instantáneas).
*   [x] **Paso 4.2: Activación del Session Refresher.** (Implementado: Middleware pasivo para sincronización de cookies sin latencia de red).
*   [x] **Paso 4.3: Firewall de Rutas Administrativas.** (Implementado: Validación estricta de correo maestro y protección contra flash de contenido en AdminLayout).
*   [x] **Paso 4.4: Protección del Flujo de Login.** (Implementado: Normalización de identidad, saneamiento de errores y estabilización del flujo).

---

## FASE 5: VALIDACIÓN ATÓMICA Y SEGURIDAD PROACTIVA (CAPA 5)
Estrategia: Tratar todo input de usuario como una amenaza potencial y preparar el sistema para ataques de fuerza bruta.

*   [x] **Paso 5.1: Esquemas de Validación (Zod).** Implementada infraestructura centralizada de validación en `lib/schemas` para Auth, Inventario y Categorías.

*   [x] **Paso 5.2: Sanitización contra XSS.** Implementada limpieza de texto vinculada a `isomorphic-dompurify` en todos los puntos de entrada administrativa (Banners, Categorías y Productos).
*   [x] **Paso 5.3: Cifrado y Rate Limiting.** Implementado cifrado AES-256 en códigos digitales y limitador de peticiones por IP en middleware.

---

## PROTOCOLO DE AVANCE
1.  Se define el paso a ejecutar (ejemplo: **Paso 1.2**).
2.  Se analiza el código afectado.
3.  Se solicita aprobación para el cambio.
4.  Se ejecuta el cambio y se verifica la estabilidad en el puerto 3003.
5.  Se marca como [x] y se avanza al siguiente micro-paso.

---
---

## 🚩 MATRIZ DE RIESGOS Y POSIBLES FALLOS (VIGILANCIA PROACTIVA)
Estrategia: Anticipar el fallo para garantizar la continuidad del servicio en Dacribel.

### FASE 1: CIMIENTOS DE DATOS (DB)
*   **Posible Fallo:** **Recursión Infinita (Error 500).** 
    *   *Causa:* Las políticas RLS intentan leer la misma tabla que protegen.
    *   *Solución:* Uso de funciones auxiliares con `SECURITY DEFINER` para romper el bucle. (**Mitigado con `is_admin()`**).
*   **Posible Fallo:** **Bloqueo Total de Registros.** 
    *   *Causa:* Triggers de auditoría mal configurados que impiden el `INSERT`.
    *   *Solución:* Probar cada trigger en una transacción aislada antes del despliegue masivo.

### FASE 2: BLINDAJE DE RED (CSP & HEADERS)
*   **Posible Fallo:** **"Pantalla Negra" de Imágenes.** 
    *   *Causa:* Nuevas imágenes de productos subidas desde dominios no autorizados en el CSP.
    *   *Solución:* Añadir dinámicamente el dominio a la lista blanca de `next.config.mjs` tras monitoreo en consola (F12).
*   **Posible Fallo:** **Fallo de Login con Google.** 
    *   *Causa:* Bloqueo de los scripts de OAuth de Google por políticas de red estrictas.
    *   *Solución:* Autorizar explícitamente `accounts.google.com` y `content.googleapis.com` en los headers de seguridad.
*   **Posible Fallo:** **Bloqueo Total de Visualización Externa (iframes).** 
    *   *Causa:* Implementación de `X-Frame-Options: DENY` (Paso 2.4).
    *   *Solución:* Entender que Dacribel no puede ser incrustada en otras webs por seguridad (Clickjacking). Si es vital para un socio, cambiar temporalmente a `SAMEORIGIN`.
*   **Posible Fallo:** **Recursos Estáticos no Cargan (CSS/JS).** 
    *   *Causa:* `X-Content-Type-Options: nosniff` (Paso 2.4) rechaza archivos con "MIME type" incorrecto.
    *   *Solución:* Verificar que el servidor de activos (Vercel/Supabase) envíe los encabezados de tipo de archivo correctos (`text/css`, `application/javascript`).

### FASE 3: ACTIVOS Y DATOS (STORAGE)
*   **Posible Fallo:** **Error 403 (Acceso Denegado a Fotos).** 
    *   *Causa:* Las políticas RLS del Bucket de Supabase no reconocen al usuario logueado.
    *   *Solución:* Sincronizar las políticas de Storage con los roles de la tabla `profiles`.
*   **Posible Fallo:** **Lentitud de Carga (LCP Alto).** 
    *   *Causa:* Imágenes sin optimizar de varios megabytes subidas al servidor.
    *   *Solución:* Implementar redimensionamiento automático o conversión a WebP antes de la carga.

### FASE 4: MIDDLEWARE Y REDIRECCIÓN (CAPA 4)
*   **Posible Fallo:** **Bucle de Guerra de Decisiones (Infinite Redirect).** 
    *   *Causa:* Inconsistencia entre la lista de "Correos Maestros" en `middleware.ts` vs `AuthContext.tsx`. El servidor deja pasar y el cliente expulsa.
    *   *Solución:* Uso de Mando Único (`dacribel.service@gmail.com`) en todo el proyecto y Middleware Pasivo que no toma decisiones de redirección de roles (**Implementado en Paso 4.2**).
*   **Posible Fallo:** **Regresión de Fallo VIII (Infinite Redirect en Login).** 
    *   *Causa:* Si la página de login intenta redirigir antes de que las cookies del `Step 4.2` se escriban en el navegador.
    *   *Solución:* Uso de `window.location.href` forzado para asegurar la sincronía total del stack de autenticación al entrar al admin (Paso 4.4).
*   **Posible Fallo:** **Falla Crítica en Google Login (Auth Bypass).** 
    *   *Causa:* Modificaciones agresivas en la redirección final que impiden que el token de Google sea procesado por Supabase.
    *   *Solución:* Proteger la ruta de callback oficial y no intervenir en el flujo nativo de autenticación OAuth de Supabase.
*   **Posible Fallo:** **Falso Bloqueo de Acceso Maestro.** 
    *   *Causa:* Normalización de correo demasiado estricta o inconsistente que impide que el administrador use mayúsculas por error en el correo maestro.
    *   *Solución:* Forzar `.toLowerCase().trim()` en todos los campos de entrada de identidad antes de procesar el inicio de sesión.
*   **Posible Fallo:** **Falso Bloqueo (Acceso Denegado al Admin).** 
    *   *Causa:* Si la base de datos de Supabase responde con lentitud extrema (más de 1.5s), el administrador legítimo podría ser expulsado por el firewall de rutas antes de que su rol sea verificado.
    *   *Solución:* El sistema prioriza el correo electrónico maestro sobre la base de datos; mientras el correo sea el oficial, tiene paso inmediato.
*   **Posible Fallo:** **Flash de Contenido (Fuga de Datos).** 
    *   *Causa:* El panel administrativo se muestra por una fracción de segundo antes de que el firewall lo bloquee.
    *   *Solución:* Mostrar pantalla de carga protectora ("Sincronizando Bóveda") hasta que el estado de autorización sea confirmado al 100%.
*   **Posible Fallo:** **Bloqueo Total de ERP (Lockout).** 
    *   *Causa:* Error en la comparación de correo maestro (ej: error tipográfico) impidiendo que el dueño entre.
    *   *Solución:* Verificar estrictamente en cada despliegue que el correo no ha sido alterado y realizar pruebas en modo incógnito.

### FASE 5: VALIDACIÓN ATÓMICA (INPUTS - ZOD)
*   **Posible Fallo:** **Rechazo de Datos Válidos (Falso Bloqueo).** 
    *   *Causa:* Esquemas de validación Zod demasiado estrictos (ej: no permitir tildes, "ñ" o caracteres especiales en nombres).
    *   *Solución:* Probar esquemas con "casos de borde" reales y usar expresiones regulares (Regex) permisivas para nombres pero estrictas para tipos de archivo/slugs.
*   **Posible Fallo:** **Inconsistencia entre Esquemas y Base de Datos.** 
    *   *Causa:* Definir un campo como obligatorio en Zod que es opcional (`nullable`) en Supabase, provocando errores internos inesperados.
    *   *Solución:* Sincronizar el tipado de TypeScript generado por Supabase con los esquemas de Zod y realizar revisiones cruzadas antes de liberar nuevas rutas de API.
*   **Posible Fallo:** **Manejo de Errores Pobre (UX Rota).** 
    *   *Causa:* No devolver los mensajes de error específicos de Zod al frontend, dejando al usuario sin saber por qué falló su envío de formulario.
    *   *Solución:* Implementar un formateador global de errores de Zod que devuelva respuestas claras (ej: "El precio debe ser un número positivo") en lugar de códigos de error genéricos.
*   **Posible Fallo:** **Impacto en Rendimiento (Latencia de Validación).** 
    *   *Causa:* Validar objetos extremadamente grandes o listas masivas de códigos digitales en tiempo real en cada petición.
    *   *Solución:* Optimizar las validaciones distribuyéndolas entre el cliente (para feedback inmediato) y el servidor (para seguridad final), evitando re-validaciones innecesarias de datos estáticos.

### FASE 5: SANITIZACIÓN CONTRA XSS
*   **Posible Fallo:** **Pérdida de Formato (Sobre-sanitización).** 
    *   *Causa:* Un filtro demasiado agresivo que elimine etiquetas legítimas de diseño (ej: `<b>`, `<br>`, `<i>`).
    *   *Solución:* Implementar una configuración de "whitelist" (lista blanca) que permita únicamente el formato visual esencial pero bloquee cualquier script.
*   **Posible Fallo:** **Visualización de Código "Sucio" (Doble Escapado).** 
    *   *Causa:* Aplicar escapado de caracteres (`&lt;`, `&gt;`) tanto en el cliente como en el servidor simultáneamente.
    *   *Solución:* Estandarizar la sanitización únicamente en el punto de entrada (Server Actions/APIs) y dejar que React maneje el renderizado seguro de forma nativa.
*   **Posible Fallo:** **Fugas de Seguridad (Entry Points Olvidados).** 
    *   *Causa:* Omitir la limpieza en campos "insignificantes" como la barra de búsqueda o mensajes de soporte.
    *   *Solución:* Auditoría total de todos los `props` que se inyectan en el DOM y uso de middlewares de sanitización global.
*   **Posible Fallo:** **Conflictos con la política de red (CSP).** 
    *   *Causa:* Intentar usar estilos en línea (`style="..."`) que son bloqueados por las cabeceras de la Fase 2.
    *   *Solución:* Migrar estilos dinámicos a clases de Tailwind o variables CSS (`CSS Variables`) seguras.


### FASE 5: CIFRADO Y RATE LIMITING
*   **Posible Fallo:** **Bloqueo de Usuarios Legítimos (Falsos Positivos).** 
    *   *Causa:* Configuración de "Rate Limit" (límite de velocidad) demasiado agresiva para IPs compartidas o usuarios muy rápidos.
    *   *Solución:* Establecer umbrales dinámicos y una lista blanca para administradores y servicios internos conocidos.
*   **Posible Fallo:** **Pérdida Irrecuperable de Datos (Master Key Loss).** 
    *   *Causa:* Implementar cifrado de datos en la DB y perder la clave maestra de cifrado en las variables de entorno.
    *   *Solución:* Almacenar copias de seguridad de las claves en un gestor de secretos profesional (como Supabase Vault o Doppler) y nunca persistirlas en el código.
*   **Posible Fallo:** **Latencia Aumentada (Pérdida de Performance).** 
    *   *Causa:* El proceso de cifrar/descifrar cada registro en tiempo real añade milisegundos a cada petición.
    *   *Solución:* Cifrar únicamente campos críticos (ej: códigos de tarjetas) y usar algoritmos de alto rendimiento (AES-256-GCM).
*   **Posible Fallo:** **Cierre de Sesión Inesperado (Session Refresher Block).** 
    *   *Causa:* El limitador de velocidad bloquea las peticiones automáticas de refresco de sesión del middleware.
    *   *Solución:* Excluir las rutas de `/auth/*` y `/api/refresh` de los límites estrictos de petición por segundo.

---
*Dacribel: Bóveda Digital Inexpugnable en construcción.*

