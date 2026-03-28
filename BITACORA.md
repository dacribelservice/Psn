# 🛡️ BITÁCORA DE PROYECTO: DACRIBEL - Ethereal Vault

> [!IMPORTANT]
> ### 🚨 REGLAS DE ORO DEL DESARROLLO (ACTUALIZADO 27/03/2026)
> 1. **PUERTO OBLIGATORIO**: La aplicación siempre debe correr en el puerto **3003**.
> 2. **DISEÑOS DEL CLIENTE**: El cliente ya tiene todas las pantallas y flujos. **SIEMPRE PREGUNTAR** por el código o diseño antes de proponer o generar uno nuevo.
> 3. **CONFIRMACIÓN PREVIA**: **SIEMPRE PREGUNTAR** y obtener aprobación antes de realizar cualquier cambio o tocar el código del proyecto.
> 4. **MODULARIDAD**: Mantener la estructura de carpetas definida y no mezclar lógica de negocio con componentes visuales.

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
- [x] Fase 1. d) Definición de sistema de colores y tokens (Ethereal Vault).
- [x] Fase 1. e) Configuración básica de i18n (Internacionalización ES/EN).
- [x] Fase 1. f) Enrutamiento y Estructura de Páginas Adicionales.

### 🟡 FASE 2: UI & Layout Premium
- [x] Fase 2. a) Implementación de Layout Global (Sidebar & Header).
- [x] Fase 2. b) Desarrollo de Menú de Perfil (Profile Menu con micro-animaciones).
- [x] Fase 2. c) Creación de componentes base (Buttons, Modals, Cards, Glassmorphism).
- [x] Fase 2. d) Implementación de pestañas principales (Home / History).

### 🔴 FASE 3: Autenticación y Perfil
- [ ] Fase 3. a) Módulo de Login/Registro (Email y Google Auth).
- [ ] Fase 3. b) Lógica de Roles (Admin vs User).
- [ ] Fase 3. c) Vista de Perfil del Cliente.
- [ ] Fase 3. d) Función de eliminación de cuenta y cierre de sesión.

### 🟣 FASE 4: Storefront & Inventario
- [x] Fase 4. a) Banners dinámicos (Carousel interactivo premium).
- [x] Fase 4. b) Cartas de Producto (Denominaciones de $5, $10, $50, etc.).
- [ ] Fase 4. c) Lógica de compra única (Sin carrito, flujo directo).
- [ ] Fase 4. d) Base de datos de Inventory (Códigos listos para entrega).

### 🔵 FASE 5: Automatización de Pagos (Cripto)
- [ ] Fase 5. a) Integración de API de Pagos (Generación de Wallet BEP20).
- [ ] Fase 5. b) Implementación de Webhook de confirmación.
- [ ] Fase 5. c) Modal de estado de pago (Esperando, Confirmado, Error).
- [ ] Fase 5. d) Lógica de liberación instantánea de código tras confirmación.

### 🟠 FASE 6: Admin Dashboard & Settings
- [x] Fase 6. a) Panel de Administración (Rediseño de Inventario y Gestión de Stock).
- [ ] Fase 6. b) Editor de Términos y Condiciones / Contacto para el Admin.
- [ ] Fase 6. c) Gestión de Afiliados integrada.
- [ ] Fase 6. d) Logs de seguridad y monitoreo de pagos.
1: 
---

## 📝 ÚLTIMA INTEGRACIÓN (27/03/2026 - Sesión de Tarde - II)
- **Sistema de Diseño "La Bóveda Etérea"**:
  - **Firma Visual Final**: Implementación de profundidad tonal (#191b23 / #282a32) eliminando bordes sólidos de 1px.
  - **Tipografía Editorial**: Integración de **Lexend** (Titulares) y **Public Sans** (Cuerpo/Labels) via Next.js Google Fonts.
  - **Paleta de Oro Líquido**: Estandarización del color primario `#f7be34` en CTAs y acentos.
- **Admin Modules (Finalización Estética)**:
  - **Dashboard**: Cuadrícula bento de métricas, gráfico de ganancias y tabla de órdenes recientes.
  - **Finanzas**: Reportes detallados de inventario total y ventas por mes con selectores dinámicos.
  - **Inventory**: Reubicación a la ruta `/admin/inventory` con selección activa en amarillo.
- **Navegación Admin**: Lógica dinámica en Sidebar y Header basada en `usePathname`.
- **GitHub**: Backup completo realizado en el repositorio principal (`main`).
- **Archivo Diseño.md**: Documentación formal del sistema para referencias futuras.

