# 🗄️ ESQUEMA DE BASE DE DATOS (PSN - SUPABASE)

> [!IMPORTANT]
> **REGLA DE ORO**: NUNCA CREAR COPIAS DE SEGURIDAD EN GITHUB DE FORMA AUTOMÁTICA. LAS COPIAS DE SEGURIDAD LAS ACTUALIZA ÚNICAMENTE **CRISTIAN (CEO DEL PROYECTO)**.

Este documento detalla la estructura oficial de la base de datos alojada en Supabase (Project ID: `ryzjswxucuwwzqhdtjmo`). Toda la gestión se realiza vía el **Dashboard Web**.

---

## 🛡️ SISTEMA DE ROLES (RBAC)
El acceso a la plataforma se controla mediante el campo `role` en la tabla `public.profiles`.
- **`user`**: Acceso estándar a la tienda y su historial.
- **`admin`**: Acceso total al panel administrativo, inventario y finanzas.

---

## 📦 TABLAS DEL NUCLEO (CORE)

### 👤 `public.profiles`
Perfiles de usuario vinculados al sistema de autenticación de Supabase.
- `id`: UUID (Primary Key / FK auth.users.id).
- `email`: Text (Único).
- `role`: Text (Default: 'user'). Valores: `admin`, `user`.
- `full_name`: Text (Opcional).

### 🛒 `public.products`
Catálogo de productos (Gift Cards) disponibles en la tienda.
- `id`: UUID (Primary Key).
- `category_id`: UUID (FK categories.id).
- `name`: Text.
- `sale_price`: Numeric (Precio final al cliente).
- `region`: Text (Default: 'Global').
- `stock_alert_threshold`: Integer (Alerta de stock bajo).

### 🔑 `public.inventory_codes`
El corazón del inventario. Contiene los códigos digitales únicos.
- `id`: UUID (Primary Key).
- `product_id`: UUID (FK products.id).
- `code`: Text (El código de la tarjeta).
- `status`: Text (`available`, `sold`, `reserved`).
- `order_id`: UUID (FK orders.id).
- **`reserved_until`**: Timestamp (Crucial para el sistema de **Reserva Atómica** de 10-15 min).

---

## 💸 SISTEMA DE TRANSACCIONES

### 📜 `public.orders`
Registro de pedidos realizados por los clientes.
- `id`: UUID (Primary Key).
- `user_id`: UUID (FK profiles.id).
- `amount`: Numeric (Ingreso neto del negocio).
- `status`: Text (Default: 'pending').
- `wallet_address`: Text (Billetera única generada por NOWPayments).
- `external_txid`: Text (Hash de la transacción en la blockchain).

### 💳 `public.payment_transactions`
Detalles técnicos de la pasarela de pagos.
- `order_id`: UUID (FK orders.id).
- `amount_usdt`: Numeric.
- `status`: Text (`waiting`, `paid`, `expired`, `partial`, `cancelled`).
- `network`: Text (Default: 'BSC (BEP20)').

---

## 🛠️ TABLAS DE SOPORTE Y GESTIÓN

- **`public.categories`**: Clasificación de productos (PSN, Xbox, etc.).
- **`public.banners`**: Carrusel de imágenes y videos tutoriales para la Home.
- **`public.regions`**: Maestro de países y regiones compatibles con banderas.
- **`public.settings`**: Configuración global de la app (vía JSON).
- **`public.audit_logs`**: Rastro de auditoría para acciones de administradores. 🕵️‍♂️🛡️

---

## 🔄 VISTAS Y LOGICA SQL
### `product_stock_view`
Vista que calcula el stock disponible en tiempo real, descontando los códigos vendidos y los reservados que aún no han expirado.

---
*Dacribel: Integridad de Datos e Ingeniería SQL.*
*Última Actualización: 13/04/2026 por Antigravity AI.*
