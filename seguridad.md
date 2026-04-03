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
*   [ ] **Paso 2.3: Configuración de HSTS (Strict-Transport-Security).** Forzar HTTPS en todos los niveles del dominio.
*   [ ] **Paso 2.4: Protección Anti-Sniffing y Clickjacking.** Activar `nosniff` y `DENY` para frames (Listo para despliegue).

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
*   [ ] **Paso 4.2: Activación del Session Refresher.** (Desactivado por conflictos en Vercel).
*   [ ] **Paso 4.3: Firewall de Rutas Administrativas.** (Desactivado por conflictos en Vercel).
*   [ ] **Paso 4.4: Protección del Flujo de Login.** (Desactivado por conflictos en Vercel).

---

## FASE 5: VALIDACIÓN ATÓMICA Y SEGURIDAD PROACTIVA (CAPA 5)
Estrategia: Tratar todo input de usuario como una amenaza potencial y preparar el sistema para ataques de fuerza bruta.

*   [ ] **Paso 5.1: Esquemas de Validación (Zod).** Implementar validación estricta de tipos de datos en el lado del servidor.
*   [ ] **Paso 5.2: Sanitización contra XSS.** Asegurar que ningún campo de texto libre pueda inyectar código malicioso.
*   [ ] **Paso 5.3: Cifrado y Rate Limiting.** Limitar intentos de acceso y cifrar datos sensibles en la base de datos.

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

### FASE 3: ACTIVOS Y DATOS (STORAGE)
*   **Posible Fallo:** **Error 403 (Acceso Denegado a Fotos).** 
    *   *Causa:* Las políticas RLS del Bucket de Supabase no reconocen al usuario logueado.
    *   *Solución:* Sincronizar las políticas de Storage con los roles de la tabla `profiles`.
*   **Posible Fallo:** **Lentitud de Carga (LCP Alto).** 
    *   *Causa:* Imágenes sin optimizar de varios megabytes subidas al servidor.
    *   *Solución:* Implementar redimensionamiento automático o conversión a WebP antes de la carga.

### FASE 5: VALIDACIÓN ATÓMICA (INPUTS)
*   **Posible Fallo:** **Rechazo de Datos Válidos.** 
    *   *Causa:* Esquemas de validación Zod demasiado estrictos (ej: no permitir tildes o caracteres especiales en nombres).
    *   *Solución:* Test de entrada con "casos de borde" y refinamiento del Regex de validación.

---
*Dacribel: Bóveda Digital Inexpugnable en construcción.*

