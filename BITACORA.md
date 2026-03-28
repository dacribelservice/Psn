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
- [x] Fase 4. c) Lógica de compra única (Sin carrito, flujo directo).
- [x] Fase 4. d) Base de datos de Inventory (Estructura de entrega de códigos).

### 🔵 FASE 5: Automatización de Pagos (Cripto)
- [ ] Fase 5. a) Integración de API de Pagos (Generación de Wallet BEP20).
- [ ] Fase 5. b) Implementación de Webhook de confirmación (Lógica Backend).
- [x] Fase 5. c) Modal de estado de pago (Esperando, Validando, Éxito - UI Completa).
- [x] Fase 5. d) Lógica de liberación instantánea de código (Visualización de Gift Cards).

### 🟠 FASE 6: Admin Dashboard & Settings
- [x] Fase 6. a) Panel de Administración (Rediseño de Inventario y Gestión de Stock).
- [ ] Fase 6. b) Editor de Términos y Condiciones / Contacto para el Admin.
- [ ] Fase 6. c) Gestión de Afiliados integrada.
- [ ] Fase 6. d) Logs de seguridad y monitoreo de pagos.
1: 
---

## 📝 ÚLTIMA INTEGRACIÓN (27/03/2026 - Sesión de Tarde - III)
- **User Orders UI (Ethereal Vault Adaptation)**:
  - **Metric Cards (Bento Style)**: Rediseño completo de la barra de estadísticas con profundidad tonal y sin bordes sólidos (`#191b23`).
  - **Iconografía Premium**: Iconos con efectos de resplandor (glow) en Liquid Gold y Emerald Green.
  - **Jerarquía Editorial**: Implementación de la escala **Display-lg (3.5rem / 56px)** en el título principal para un impacto visual "Hero".
  - **Emparejamiento Tipográfico**: Contraste refinado entre etiquetas en **Public Sans** (micro-dato) y titulares en **Lexend**.
- **Consistencia Visual**: Auditoría de fuentes en Sidebar y Header para asegurar el uso de tokens variables de Next.js.
- **GitHub**: Respaldo completo de la sesión sincronizado con el repositorio (`main`).

---

## 📝 ÚLTIMA INTEGRACIÓN (28/03/2026 - Sesión de Madrugada - IV)

- **Flujo de Pago de Extremo a Extremo (End-to-End)**:
    - **`ProductBottomSheet`**: Integración de selector de cantidad y cálculo dinámico de subtotales.
    - **`PaymentBottomSheet`**: Selector de canales cripto (BEP20, TRC20) alineado con los diseños del cliente.
    - **`CheckoutProcessingPage`**: Página de espera con **temporizador de 10 min** en tiempo real, QR dinámico y sistema de copiado de billetera prioritario.
    - **`ValidationModal`**: Modal premium con micro-animaciones, spinner de reloj de arena y barra de progreso.
    - **Visualización de Códigos (`OrderDetailsView`)**: Pantalla final con confeti, detalles de la transacción y visualización segura de los códigos adquiridos.

- **Refinamiento de UX/UI**:
    - **Limpieza de Roles**: Remoción completa de etiquetas "Vault Access" y badges de rol (Admin/User) para una estética más minimalista en Sidebar y Header.
    - **Animaciones Premium**: Implementación de `framer-motion` para transiciones de "Page Overlay" y efectos de pulso en estados de carga.
    - **Internacionalización**: Sincronización completa de todos los nuevos componentes con el `LanguageContext` (ES/EN).

- **Mantenimiento y Dependencias**:
    - Instalación de `canvas-confetti` y tipos para efectos visuales.
    - Auditoría de estilos y corrección de desbordamientos en modales móviles.

- **GitHub**: Respaldo completo de la lógica de pago y entrega de códigos.

---

## 📝 ÚLTIMA INTEGRACIÓN (28/03/2026 - Auditoría y Ajustes UX/UI)
- **Correcciones de UX/UI en Panel Admin**: Solución de discrepancias tipográficas (`text-display-lg`) en las vistas de Inventario y Finanzas, reduciendo los tamaños a escalas proporcionales (`text-xl` y `2xl`) para restaurar el balance visual y el espacio de trabajo.
- **Silenciado de Linter CSS**: Creación de archivo `.vscode/settings.json` para ignorar falsas advertencias de reglas `@tailwind`.
- **Auditoría General de Arquitectura y Flujos**:
  - **✅ Storefront & Checkout (UI) - Completado**: Las pantallas de visualización, modales de compra y entrega final (con confeti) están 100% integradas visualmente.
  - **✅ Dashboard Admin (UI) - Completado**: Base estructural (Finanzas, Inventario) terminada con estética Ethereal Vault y vistas de tablas responsivas.
  - **❌ Flujos de Autenticación (Fase 3) - Ausente**: El directorio `/app/(auth)` está vacío. No existe proveedor de sesión en `layout.tsx` ni lógica de protección de rutas o roles.
  - **❌ Backend y Webhooks (Fase 5) - Ausente**: El directorio `/app/api` está vacío. La lógica de generación de wallets y persistencia real en Supabase no ha iniciado.

> **Siguiente Paso Crítico Recomendado**: Ejecutar la **FASE 3: Autenticación y Perfil**. Es el pilar fundamental que falta para proteger el acceso a `/admin`, separar los roles y vincular las compras simuladas en la UI con una base de datos real en Supabase.
