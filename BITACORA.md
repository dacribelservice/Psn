## 🎯 OBJETIVO ESTRATÉGICO
Plataforma de activos digitales de ultra-lujo con diseño **"Ethereal Vault"**, entrega instantánea de códigos y automatización de pagos cripto, operando sobre un stack moderno de **Next.js 14 + Supabase**.

---

## 🏆 REGLAS DE ORO DE DACRIBEL (INVIOLABLES)
1. **NUNCA GUARDAR COPIAS DE SEGURIDAD (BACKUPS, DUMPS, ARCHIVOS BINARIOS) EN GITHUB.**
2. **NUNCA COMENZAR UN PROCESO DE TRABAJO SIN AUTORIZACIÓN EXPRESA DEL USUARIO. ESTÁ TOTAL Y ESTRICTAMENTE PROHIBIDO.**

---

## 🚀 ESTADO ACTUAL: PRODUCCIÓN 🌎🟢
*   **Enlace Local:** `http://localhost:3003` 🏗️🛠️
*   **Web Oficial:** `https://www.dacribel.shop` 🪐✨
*   **Infraestructura:** Dominio propio (`dacribel.shop`) gestionado en Vercel DNS y HostGator.
*   **Seguridad:** SMTP Profesional (Resend). Verificación de DKIM, SPF y MX activa.
*   **Auth (Fase 4):** Google OAuth Activo y Verificado (Dacribel App). 🔑🛡️
*   **Finanzas (Fase 2.3):** Sistema de Precisión Histórica RPC (Inversión Capital) activo. 💰🛡️
*   **Inventario:** Realtime sync habilitado (Supabase).

---

## 🛡️ CAPACIDADES CORE (LO QUE HACE QUE LA APP SEA ÚNICA)

### 1. Sistema de Diseño "Ethereal Vault"
*   Estética de cristal pulido (**Glassmorphism**) con profundidad tonal en `#191b23`.
*   Layout adaptativo inteligente: tablas que se transforman en tarjetas en móviles.
*   Micro-animaciones de alto impacto con `framer-motion` y efectos visuales de éxito (Confetti).

### 2. Motor de Ventas & Autenticación
*   **Auth Flow Completo:** Login, Registro y Recuperación de Contraseña con diseño consistente y legal (Términos integrados).
*   **Checkout Atómico:** Lógica SQL que garantiza que un código digital nunca se entregue dos veces, incluso bajo alta demanda.
*   **Historial Premium:** Seguimiento de pedidos con estados de color y visualización segura de activos comprados.

### 3. Panel Administrativo (ERP Interno)
*   **Dashboard Financiero:** Métricas en tiempo real de ingresos, ganancias e inversión activa con conversión automática a COP.
*   **Gestión de Stock:** CRUD avanzado de productos, categorías y banners con alertas inteligentes de "Stock Bajo".
*   **Control de Banners:** Sistema dinámico para gestionar el Hero del Storefront sin tocar el código.

---

## 🚦 HITOS CLAVE (CRONOLOGÍA RESUMIDA)

### 🏗️ Fase I & II: Cimientos y Storefront (Marzo 2026)
*   Definición de tokens de diseño y creación de la cuadrícula de productos premium.
*   Implementación de `ProductBottomSheet` y filtrado regional por países (Banderas animadas).

### 🔐 Fase III & IV: Identidad y Seguridad
*   Integración de **Supabase Auth**. Redirección inteligente: Administradores al panel, Clientes a la tienda.
*   Implementación de políticas de seguridad (RLS) para proteger los códigos del inventario.
*   **Blindaje de Identidad:** Migración de SMTP Gmail personal a Infraestructura Profesional (Resend).

### 💰 Fase V (Iniciada): Procesamiento de Pagos
*   Diseño del flujo de pago con temporizadores de 10 min, QRs dinámicos y estados de validación.
*   Integración de lógica atómica para la liberación instantánea de códigos digitales.

### 🌐 Fase Final: Identidad de Marca Pro (Abril 2026)
*   **Dominio Propio:** Migración exitosa de `vercel.app` a `dacribel.shop` 🏯🛡️.
*   **Infraestructura DNS:** Configuración de Vercel como manager de DNS para mayor velocidad.
*   **Bypass de SMTP:** Verificación de dominio en Resend, permitiendo el registro global de usuarios sin restricciones de prueba.
*   **Supabase SMTP:** Conexión segura vía registros DKIM/SPF y API Keys dedicadas.
*   **Seguridad de Identidades (Paso 1.3):** Blindaje total del campo `role` en la tabla `profiles` para prevenir escalada de privilegios. 🔒✨
*   **Reparación de RLS (Bucle 500):** Implementación de la función suprema `is_admin()` con privilegios `SECURITY DEFINER` para solucionar la recursión infinita y optimizar el servidor. 🚀🔒✨
*   **Purga de Identidad:** El correo `dacribel.service@gmail.com` ha sido instaurado como el nuevo Pase Maestro oficial en toda la infraestructura. 🚥🚩✨🛡️🏰
*   **Identidad Visual:** Restauración de banderas (USA/España) usando recursos internos de Supabase Storage para cumplimiento de CSP. 🚩✨
*   **Recuperación de Contraseña:** Reparación del error 404 al redirigir el flujo directamente a `/update-password`. 🛡️🔐
*   **Reparación de RLS (Bucle 500):** Implementación de función `is_admin()` con `SECURITY DEFINER` para eliminar la recursión infinita y optimizar el rendimiento del servidor. 🛡️🚀✨🏰
*   **Paso 2.1 & 2.2 (Escalibilidad Masiva):** Migración total a paginación nativa en Postgres (`.range()`) y consolidación de datos mediante JOINS físicos entre `products`, `categories` y `regions`. 🛰️📉✨
*   **Paso 2.3 (Precisión Contable):** Creación de la función RPC `get_inventory_financials` para calcular el valor del inventario basado en el **costo histórico (USDT/COP)** de cada código individual. Adiós a las estimaciones, hola a la contabilidad exacta. 💰🛡️📊
*   **Paso 3.0 (Centralización de Lógica):** Creación de `lib/constants.ts` como cerebro de configuración única para tasas de cambio, umbrales de stock y tamaños de página. 🧠⚙️
*   **Fase 4 (Identidad Social):** Integración exitosa de **Google OAuth**. Corrección de ID de cliente (`...pbknqk...`) para habilitar login con un solo clic. Los administradores supremos son mapeados por correo automáticamente. 🔑🛡️✨ Google Cloud & Supabase sincronizados al 100%.
*   **Paso 5.1 (Inteligencia de Inventario):** Implementación de **Umbrales Dinámicos por Producto**. El sistema ahora respeta alertas personalizadas (ej. avisar con 1 para Xbox, con 10 para Amazon) y muestra banderas regionales en las notificaciones. 🚩🧠🛡️
*   **Control de Versiones:** Sincronización total de cambios en el repositorio GitHub `dacribelservice/Psn`. 📂🛸
*   **Fase 8 (Independencia Blockchain Total):** Implementación de Billetera Maestra fija y verificación directa por TxID en red BSC. Suprimido el modal de selección para un flujo de pago directo y sin fricciones. 🛡️🛰️🦾⚡

---

---

## 📜 DOCUMENTACIÓN DE APOYO
*   [**PAGOS.md**](file:///c:/Users/cange/Documents/Psn/pagos.md): Hoja de ruta para la automatización BEP20/TRC20.
*   [**SEGURIDAD.md**](file:///c:/Users/cange/Documents/Psn/seguridad.md): Manual de blindaje de RLS y Firewall administrativo.
*   [**DISEÑO.md**](file:///c:/Users/cange/Documents/Psn/Diseño.md): Lineamientos estéticos del sistema "Ethereal Vault".
*   [**APP.md**](file:///c:/Users/cange/Documents/Psn/app.md): Arquitectura de componentes y flujos de usuario.
*   [**MID.md**](file:///c:/Users/cange/Documents/Psn/mid.md): Bitácora técnica de incidentes de seguridad y middleware.

---
*Dacribel: La bóveda digital de activos más segura y estética del mercado.*
