# 🛡️ BITÁCORA DE PROYECTO: DACRIBEL - Ethereal Vault

Este documento es la hoja de ruta oficial y el registro de progreso para la aplicación **Dacribel**, una plataforma automatizada de venta de Gift Cards (PSN, Nintendo, Xbox) con pagos en criptomonedas (USDT BEP20).

---

## 🚀 VISIÓN GENERAL
Dacribel es un ecommerce de alta gama diseñado para la automatización total. El usuario selecciona un producto, paga con USDT y recibe su código digital de forma instantánea sin intervención humana.

### 🛠️ STACK TECNOLÓGICO
- **Frontend**: Next.js 14+ (App Router)
- **Estilo**: Tailwind CSS (Ethereal Vault Design System)
- **Backend/DB**: Supabase (Auth, Database, Storage)
- **Pagos**: NOWPayments / Cryptomus (USDT BEP20)
- **Hosting**: Vercel

---

## 📂 ESTRUCTURA DEL PROYECTO (ARQUITECTURA)
```text
/psn
├── /app                # Next.js App Router (Páginas y Rutas de API)
│   ├── /(auth)         # Login, Registro, Recuperar contraseña
│   ├── /(store)        # Home, Categorías, Detalles de producto
│   ├── /history        # Historial de compras
│   ├── /admin          # Panel de administración (Inventario, Usuarios, Ajustes)
│   └── /api            # Webhooks de pagos (NOWPayments/Cryptomus) y scripts
├── /components         # Componentes UI (Botones, Modales, Cards)
│   ├── /ui             # Componentes base (shadcn/ui o similares)
│   ├── /layout         # Navbar, Sidebar, ProfileMenu, BottomNav
│   └── /payments       # Modal de pago, estados de transacción
├── /lib                # Configuración de herramientas
│   ├── supabase.ts     # Cliente de Supabase
│   └── utils.ts        # Funciones utilitarias
├── /services           # Lógica de negocio
│   ├── inventory.ts    # Gestión de códigos
│   ├── payments.ts     # Integración con procesador cripto
│   └── auth.ts         # Lógica de roles
├── /types              # Definiciones de TypeScript (Interface de Producto, Orden, etc.)
└── /i18n               # Configuración de idiomas (ES/EN)
```

## 🧭 HOJA DE RUTA Y PROGRESO (CHECKLIST)

### 🟢 FASE 1: Cimiento y Estructura
- [x] Fase 1. a) Inicialización de proyecto Next.js + Tailwind CSS.
- [x] Fase 1. b) Creación de estructura de carpetas modular (app, components, lib, services, types, i18n).
- [x] Fase 1. c) Configuración de Supabase (Database Schema & Auth).
- [ ] Fase 1. d) Definición de sistema de colores y tokens (Ethereal Vault).
- [x] Fase 1. e) Configuración básica de i18n (Internacionalización ES/EN).

### 🟡 FASE 2: UI & Layout Premium
- [ ] Fase 2. a) Implementación de Layout Global (Sidebar & Header).
- [x] Fase 2. b) Desarrollo de Menú de Perfil (Profile Menu con micro-animaciones).
- [ ] Fase 2. c) Creación de componentes base (Buttons, Modals, Cards, Glassmorphism).
- [ ] Fase 2. d) Implementación de pestañas principales (Home / History).

### 🔴 FASE 3: Autenticación y Perfil
- [ ] Fase 3. a) Módulo de Login/Registro (Email y Google Auth).
- [ ] Fase 3. b) Lógica de Roles (Admin vs User).
- [ ] Fase 3. c) Vista de Perfil del Cliente.
- [ ] Fase 3. d) Función de eliminación de cuenta y cierre de sesión.

### 🟣 FASE 4: Storefront & Inventario
- [ ] Fase 4. a) Categorías por consola (Banners dinámicos).
- [ ] Fase 4. b) Cartas de Producto (Denominaciones de $5, $10, $50, etc.).
- [ ] Fase 4. c) Lógica de compra única (Sin carrito, flujo directo).
- [ ] Fase 4. d) Base de datos de Inventory (Códigos listos para entrega).

### 🔵 FASE 5: Automatización de Pagos (Cripto)
- [ ] Fase 5. a) Integración de API de Pagos (Generación de Wallet BEP20).
- [ ] Fase 5. b) Implementación de Webhook de confirmación.
- [ ] Fase 5. c) Modal de estado de pago (Esperando, Confirmado, Error).
- [ ] Fase 5. d) Lógica de liberación instantánea de código tras confirmación.

### 🟠 FASE 6: Admin Dashboard & Settings
- [ ] Fase 6. a) Panel de Administración (Gestión de Stock de Códigos).
- [ ] Fase 6. b) Editor de Términos y Condiciones / Contacto para el Admin.
- [ ] Fase 6. c) Gestión de Afiliados integrada.
- [ ] Fase 6. d) Logs de seguridad y monitoreo de pagos.

---

## 🛠️ ESPECIFICACIONES DE DISEÑO (ETHEREAL VAULT)
- **Tema**: Dark Mode Obligatorio.
- **Paleta de Colores**:
  - `Primary`: #f7be34 (Gold)
  - `Surface`: #11131b (Deep Black)
  - `Secondary`: #c3c4e2 (Soft Violet)
- **Layout**: Diseño tipo bóveda (glassmorphism), bordes redondeados (xl/2xl), tipografía Inter.

## 🔗 INTEGRACIONES CLAVE
- **Blockchain**: BNB Smart Chain (BEP20).
- **Notificaciones**: Entrega en pantalla + Email automático.

---

## 📝 NOTAS DE CAMBIO (CHANGELOG)
- **2026-03-27**: Inicialización de la bitácora y definición del Roadmap integral.
- **2026-03-27**: Inicialización de proyecto Next.js y estructura modular.
- **2026-03-27**: Conexión establecida con Supabase y creación de esquema de tablas.
