# DACRIBEL: PLAN MAESTRO DE PERFECCIONAMIENTO (POLISHING & SCALE)

Este documento es el mapa de ruta final para llevar a Dacribel de una plataforma segura a una solución de nivel empresarial (Scale Ready). Aquí se consolidan los hallazgos de la auditoría y pendientes estratégicos.

---

## 🚀 ESTATUS DE PERFECCIONAMIENTO
*   **Fase Actual:** Pulido de Auditoría e Integraciones.
*   **Prioridad:** Estabilidad, Escalabilidad y Google Login.
*   **Regla:** "Un micro-paso a la vez para no romper el búnker de seguridad".

---

## 🛠️ CHECKLIST DE ACCIONES PENDIENTES

### 1. UNIFICACIÓN DE SEGURIDAD (VALIDACIÓN ATÓMICA)
*   [ ] **Paso 1.1: Esquema Zod en Categorías.** Integrar `CategorySchema` en `CategoryBottomSheet.tsx`.
*   [ ] **Paso 1.2: Esquema Zod en Banners.** Integrar `BannerSchema` en `BannersModal.tsx`.
*   [ ] **Paso 1.3: Blindaje de Términos (XSS).** Aplicar `sanitizeHTML` en `AdminTermsModal.tsx` para prevenir inyecciones.
*   [ ] **Paso 1.4: Esquema Zod en Términos.** Crear y aplicar validación para el contenido bilingüe de políticas.

### 2. ESCALABILIDAD Y RENDIMIENTO (SCALE READY)
*   [ ] **Paso 2.1: Paginación de Inventario.** Implementar carga por lotes (Pagination) en la tabla de códigos para evitar que el navegador se congele con miles de registros.
*   [ ] **Paso 2.2: Optimización de Consultas (Joins).** Reemplazar el filtrado en JS (`.find`) por uniones directas de Postgres (`select('*, stock:product_stock_view!product_id(stock_available)')`).
*   [ ] **Paso 2.3: Limpieza de Hardcode.** Mover URLs directas de banderas y storage a variables de entorno o constantes centralizadas.

### 3. UTILIDAD ADMINISTRATIVA (ADMIN UX)
*   [ ] **Paso 3.1: Función "Revelar Código".** Añadir un botón con permiso de administrador para descifrar y ver un código individual en el dashboard (AES-256 Decrypt on-demand).
*   [ ] **Paso 3.2: Estandarización de Errores.** Cambiar los `alert()` genéricos por Toasts descriptivos que indiquen si el fallo fue por validación Zod o por bloqueo de Rate Limit.

### 4. IDENTIDAD Y SOCIAL AUTH (GOOGLE LOGIN)
*   [ ] **Paso 4.1: Configuración en Google Console.** Crear el ID de cliente OAuth y configurar URIs de redirección.
*   [ ] **Paso 4.2: Activación en Supabase Dashboard.** Configurar el Provider de Google con las credenciales obtenidas.
*   [ ] **Paso 4.3: Implementación Frontend.** Añadir el botón "Continuar con Google" en el `AuthPage` y manejar el flujo de redirección sin romper el `middleware`.
*   [ ] **Paso 4.4: Sincronización de Perfiles.** Asegurar que el login con Google cree correctamente el perfil en la tabla de usuarios y asigne el rol de cliente por defecto.

---

## 🚩 SEGUIMIENTO DE MICRO-PASOS

> [!NOTE]
> Cada vez que completemos una tarea, se marcará aquí su detalle técnico.

### [SIN INICIAR] - Fase de Pulido 

---
*Dacribel: Forjando el estándar de excelencia en ventas digitales.*
