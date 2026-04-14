# 🗺️ MAPA ARQUITECTÓNICO DE DACRIBEL
**Versión Actual**: `1.14.1` 🚀

> [!IMPORTANT]
> **REGLA DE ORO**: NUNCA CREAR COPIAS DE SEGURIDAD EN GITHUB DE FORMA AUTOMÁTICA. LAS COPIAS DE SEGURIDAD LAS ACTUALIZA ÚNICAMENTE **CRISTIAN (CEO DEL PROYECTO)**.

Este documento describe la geografía del código de la aplicación para que cualquier desarrollador o auditor pueda ubicarse rápidamente.

---

## 📂 ESTRUCTURA DE LA CARPETA `app/` (El Corazón)

La carpeta `app/` utiliza el sistema de enrutamiento de Next.js. Aquí es donde se definen las pantallas que ve el usuario.

```text
app/
├── (auth)/               <-- 🔐 TERRITORIO DE ACCESO
│   ├── login/            - Pantalla de inicio de sesión
│   └── register/         - Registro de nuevos usuarios
│
├── (store)/              <-- 🛒 EL ESCAPARATE (Público)
│   ├── page.tsx          - El Home de la web (donde están los banners)
│   └── layout.tsx        - Layout con Sidebar y buscador para clientes
│
├── admin/                <-- 🏛️ EL BUNKER DE GESTIÓN (Privado)
│   ├── inventory/        - Gestión de stock y llaves
│   ├── finance/          - Control de pedidos y pagos
│   └── users/            - Gestión de clientes
│
├── extensions/           <-- 🧩 LA ARENA MODULAR (Sandbox)
│   ├── psn/              - Módulo: PSN Global Tracker (Fase Alpha)
│   ├── layout.tsx        - El "Escudo Térmico" para módulos
│   └── error.tsx         - Failsafe para evitar caídas globales
│
├── api/                  <-- ⚙️ EL MOTOR INTERNO (Backend)
│   ├── payments/         - Webhooks de NOWPayments y transacciones
│   └── auth/             - Endpoints de seguridad de Supabase
│
├── history/              <-- 📄 HISTORIAL DEL CLIENTE
│   └── page.tsx          - Lista de pedidos realizados por el usuario
│
├── layout.tsx            - Raíz de TODO (Fuentes, Analytics, Contextos)
└── globals.css           - Estilos globales y tokens de diseño
```

---

## 🏗️ OTRAS CARPETAS TÉCNICAS (Soporte)

Para que la carpeta `app/` funcione, se apoya en estos pilares:

1.  **`/components`**: Piezas de LEGO reutilizables.
    *   `/ui`: Componentes base del sistema de diseño (Botones, Inputs, Cards).
    *   `/layout`: Estructuras maestras (Sidebar, Navbar, Footer).
    *   `/admin`: Componentes exclusivos del panel de gestión.
2.  **`/lib`**: La "lógica pesada" y utilidades nucleares.
    *   `/schemas`: Validaciones de datos y seguridad (Zod).
    *   `/crypto.ts`: Motor de encriptación para el búnker de llaves.
    *   `supabase.ts`, `supabase_admin.ts`, `supabase_server.ts`: Los tres pilares de acceso a DB.
3.  **`/context`**: El cerebro del estado global. Inyección de `LanguageContext` (Multi-idioma) y Auth.
4.  **`/services`**: Conexiones con servicios externos (Binance API, Blockchain, etc).
5.  **`/config`**: El centro de mando. Gestión del registro de extensiones (`extensions.ts`).
6.  **`/Logos` & `/public`**: Almacén de branding y activos estáticos del proyecto.
7.  **`/Markdown`**: Esta biblioteca de manuales tácticos y bitácoras.

---

## ⚙️ ESQUELETO Y CONFIGURACIÓN RAÍZ

Archivos que controlan el comportamiento global:

*   **`middleware.ts`**: El "Portero" de la app. Gestiona sesiones, seguridad y redirecciones.
*   **`.env.local`**: El Búnker de Secretos. Contiene llaves API y variables de entorno críticas.
*   **`next.config.mjs`**: Configuración del motor de Next.js (dominios de imágenes, optimizaciones).
*   **`tailwind.config.ts`**: Definición de los tokens de diseño (Colores Oro Líquido, fuentes Inter).
*   **`package.json`**: El inventario de dependencias y el control de versiones (actualmente v1.14.x).

---

## 🚀 FLUJO DE NAVEGACIÓN
1. El usuario entra por **`(store)`**.
2. Si quiere comprar, la **`api/`** procesa el pago.
3. Si quiere ver ofertas especiales, entra a **`extensions/`**.
4. Si tú quieres controlar todo, entras a **`admin/`**.

---
*Dacribel: Estructura de Alta Ingeniería para un Negocio Infinito.*
*Última Actualización: 13/04/2026 por Antigravity AI (Versión 1.14.1)*
