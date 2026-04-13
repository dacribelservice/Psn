# 🗺️ MAPA ARQUITECTÓNICO DE DACRIBEL (v1.14.1)

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

1.  **`/components`**: Piezas de LEGO reutilizables (Botones, Footer, Navbars).
2.  **`/lib`**: La "lógica pesada" (Cálculos de precios, conexión a base de datos, encriptación).
3.  **`/config`**: El centro de mando (Interruptores de módulos, variables globales).
4.  **`/Markdown`**: Esta biblioteca de manuales tácticos.
5.  **`/services`**: Conexiones con servicios externos (Binance API, Blockchain, etc).

---

## 🚀 FLUJO DE NAVEGACIÓN
1. El usuario entra por **`(store)`**.
2. Si quiere comprar, la **`api/`** procesa el pago.
3. Si quiere ver ofertas especiales, entra a **`extensions/`**.
4. Si tú quieres controlar todo, entras a **`admin/`**.

---
*Dacribel: Estructura de Alta Ingeniería para un Negocio Infinito.*
*Última Actualización: 12/04/2026 por Antigravity AI.*
