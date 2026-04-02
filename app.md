# 🏛️ DACRIBEL: ARQUITECTURA MAESTRA DE E-COMMERCE PREMIUM

Este documento detalla la infraestructura, seguridad y lógica operativa de la plataforma Dacribel, diseñada para la venta y entrega instantánea de activos digitales de alto valor.

---

## 🚀 1. STACK TECNOLÓGICO (EL CEREBRO)
Dacribel está construida sobre un ecosistema de vanguardia para garantizar escalabilidad y rendimiento:

*   **Frontend**: Next.js 14 (App Router) + React 18.
*   **Lenguaje**: TypeScript (Tipado estricto para evitar errores en producción).
*   **Estilos**: Tailwind CSS con sistema de diseño personalizado **"Ethereal Vault"**.
*   **Animaciones**: Framer Motion (UX fluida y micro-interacciones).
*   **Backend & DB**: Supabase (PostgreSQL + Realtime Engine).
*   **Auth**: Supabase Auth (JWT + Session Management).

---

## 📁 2. ESTRUCTURA DEL PROYECTO (EL ESQUELETO)
La aplicación sigue una organización modular dividida por dominios:

### 🌐 `/app` (Rutas Dinámicas)
*   `/(store)`: Todo lo relacionado con el cliente final (Tienda, Historial, Carrito).
*   `/(admin)`: Panel de gestión avanzado (Finanzas, Inventario, Categorías).
*   `/(auth)`: Flujos de seguridad (Login, Registro, Password Recovery).
*   `/api`: Endpoints para automatización de pagos y webhooks.

### 🧩 `/components` (Bloques Reutilizables)
*   `/ui`: Componentes estéticos base (ProductCard, BottomSheets, Modales).
*   `/layout`: Estructura global (Sidebar, Header, BottomNav).

### ⚙️ `/services` & `/context`
*   `inventory.ts`: Servicio maestro de comunicación con la base de datos de productos.
*   `AuthContext.tsx`: Gestor global de sesión y perfiles de usuario.
*   `LanguageContext.tsx`: Sistema de internacionalización (ES/EN).

---

## 🛡️ 3. MODELO DE SEGURIDAD (EL BÚNKER)
La seguridad es el corazón de Dacribel:

1.  **Row Level Security (RLS)**: Cada tabla en Supabase está blindada. Los usuarios solo pueden ver **sus propias órdenes** y los administradores tienen acceso total solo bajo sesión verificada.
2.  **Redirección por Roles**: El sistema detecta si un usuario es `admin` o `user` desde el `AuthContext` y lo redirige automáticamente a su zona de trabajo.
3.  **Failsafe de Carga**: Sistema "Anti-Bucles" que previene que la App se bloquee si la red o la base de datos fallan temporalmente.
4.  **Liberación Atómica**: Los códigos digitales se asignan mediante funciones SQL internas para evitar colisiones (nunca se entrega el mismo código a dos personas).

---

## 📦 4. FLUJOS MAESTROS (LA SANGRE)

### 🛒 A. Flujo de Compra
Tienda -> `ProductBottomSheet` (Selección) -> `PaymentBottomSheet` (Preseteo Cripto) -> `CheckoutProcessing` (Validación Realtime) -> Entrega Final (Revealing Code).

### 📈 B. Gestión Administrativa
Administración -> Inventario -> Carga de Códigos -> Alerta de Stock Bajo (Threshold dinámico).

### 💸 C. Finanzas Realtime
El Dashboard Administrativo calcula Ingresos, Ganancias (USDT) e Inversión Total (Filtro por status `available`) convirtiendo automáticamente a **COP** en tiempo real.

---

## 📊 5. ESQUEMA DE DATOS (LOS NERVIOS)
Tablas principales en Supabase:
*   `profiles`: Datos extendidos del usuario (avatar, rol, balance).
*   `categories`: Agrupadores de productos con diseño circular premium.
*   `products`: El catálogo con precios y regiones.
*   `inventory_codes`: La base de datos de códigos individuales (Criptado/Status).
*   `orders`: Registro histórico de todas las transacciones.
*   `banners`: Carrusel dinámico del Hero de la tienda.

---

## ✨ 6. ESTÉTICA: ETHEREAL VAULT
Dacribel no solo funciona, sino que **deslumbra**.
*   **Glassmorphism**: Efectos de cristal pulido y desenfoques profundos.
*   **Modo Oscuro Nativo**: Profundidad tonal en `#191b23`.
*   **Responsive Pro**: Adaptación inteligente donde las tablas se vuelven tarjetas visuales en móviles.

---
*Dacribel: La infraestructura digital definitiva para el comercio de activos premium.*
