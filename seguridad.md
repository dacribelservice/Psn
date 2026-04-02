# DACRIBEL: PLAN MAESTRO DE FORTIFICACIÓN DIGITAL (SECURITY FORCED PHASE)

Este documento es el único mapa de ruta oficial para la implementación de seguridad en Dacribel. Se ejecutará mediante micro-pasos para garantizar la estabilidad total de la plataforma.

---

## ESTATUS DE IMPLEMENTACIÓN GLOBAL
*   **Nivel de Seguridad Actual:** Básico (Capa de datos activa).
*   **Estabilidad del Sistema:** Estable (Port 3003 activo).
*   **Regla de Oro:** Ningún cambio se aplica sin la aprobación previa del paso correspondiente.

---

## FASE 1: CIMIENTOS DE DATOS Y AUDITORÍA (CAPA 1)
Estrategia: Asegurar que la base de datos sea la última línea de defensa y que toda acción administrativa sea rastreable.

*   [x] **Paso 1.1: Creación de Infraestructura de Auditoría.** (Tabla `audit_logs` creada en Supabase).
*   [ ] **Paso 1.2: Activación de Triggers de Auditoría.** Crear funciones en PostgreSQL que registren automáticamente cambios en el inventario.
*   [ ] **Paso 1.3: Auditoría Estricta de RLS.** Revisar una a una las políticas de lectura/escritura de las 7 tablas activas.
*   [ ] **Paso 1.4: Blindaje de la tabla `profiles`.** Asegurar que solo el `admin` pueda alterar el campo `role`.

---

## FASE 2: BLINDAJE DE RED E INFRAESTRUCTURA (CAPA 2)
Estrategia: Evitar que el navegador sea utilizado como un arma contra el servidor a través de inyecciones o suplantaciones.

*   [x] **Paso 2.1: Implementación de Cabeceras Globales.** (Configuración verificada: se añadió soporte para `flagcdn.com`, `wikimedia.org`, `gamerantimages.com` y `notebookcheck.org` para asegurar visualización total de banners e iconos).
*   [ ] **Paso 2.2: Refinamiento de CSP (Content Security Policy).** Ajustar la política para ser más restrictiva con scripts inline (evaluación de riesgo).
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
*   [ ] **Paso 4.2: Activación del Session Refresher.** Unir el proceso de actualización de cookies de Supabase al Middleware.
*   [ ] **Paso 4.3: Firewall de Rutas Administrativas.** Barrera estricta que redirige fuera de `/admin` si no hay sesión válida.
*   [ ] **Paso 4.4: Protección del Flujo de Login.** Evitar que usuarios ya autenticados accedan a la página de inicio de sesión.

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
*Dacribel: Bóveda Digital Inexpugnable en construcción.*
