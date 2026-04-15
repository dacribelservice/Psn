# 🕹️ MÓDULO: CATÁLOGO DE PROMOCIONES PLAYSTATION

> [!IMPORTANT]
> **REGLA DE ORO**: NUNCA CREAR COPIAS DE SEGURIDAD EN GITHUB DE FORMA AUTOMÁTICA. LAS COPIAS DE SEGURIDAD LAS ACTUALIZA ÚNICAMENTE **CRISTIAN (CEO DEL PROYECTO)**.

Este módulo es la primera extensión oficial de Dacribel, diseñada para ofrecer un catálogo dinámico y filtrable de promociones de PlayStation, conectado al núcleo de pagos pero operando de forma aislada.

---

## 🏛️ ARQUITECTURA DEL MÓDULO
- **ID de Extensión**: `psn-tracker`
- **Ubicación de UI**: `app/extensions/psn/`
- **Esquema DB**: `psn` (aislado del Core `public`)
- **Estado**: 🚧 EN CONSTRUCCIÓN

---

## 🎯 VISIÓN ESTRATÉGICA: "FLOR DE MARIPOSA"
La premisa de este módulo no es solo vender, sino **servir de utilidad**. Plantar una "flor" (la comparativa de precios) para que las "mariposas" (los clientes y dueños de negocio) lleguen de forma orgánica a Dacribel.
- **Estrategia**: Ofrecer gratis la comparativa de precios regionales para atraer tráfico orgánico masivo.
- **Conversión**: Integrar botones de compra de códigos de juego vinculados a las promociones del catálogo.

---

## 🧢 PRINCIPIO DE DISEÑO: "GORRA, NO CHICLE"

> [!IMPORTANT]
> Este módulo debe ser **100% enchufable y desenchufable**. Si en algún momento se desconecta, el Core de Dacribel (tienda, pagos, admin) **no debe enterarse de su existencia**. Cero rastros, cero dependencias inversas.

### Reglas de Aislamiento Total
1. **CERO modificaciones a tablas del esquema `public`** — No se toca `orders`, `products`, `inventory_codes` ni ninguna tabla Core.
2. **Esquema `psn` autocontenido** — Tiene sus propias órdenes, pagos, inventario y finanzas.
3. **Webhook propio** — Ruta dedicada `/api/psn/webhook` para pagos del módulo.
4. **Desconexión limpia** — Un `DROP SCHEMA psn CASCADE` + eliminar carpeta `extensions/psn` + quitar registro de `extensions.ts` = módulo borrado sin dejar rastro.
5. **Sin imports cruzados** — El código del módulo puede **leer** utilidades del Core (Supabase client, crypto, auth context) pero el Core **nunca importa** nada del módulo.

### ¿Qué SÍ se comparte? (Solo lectura)
- `lib/supabase.ts` — Cliente de base de datos (lectura).
- `lib/supabase_admin.ts` — Cliente admin para el webhook propio.
- `lib/crypto.ts` — Motor de encriptación para códigos.
- `context/AuthContext.tsx` — Para verificar rol del usuario.
- `config/extensions.ts` — Registro del módulo (Kill Switch).
- Estilos globales (`globals.css`) — Para mantener coherencia visual.

---

## 📐 DECISIONES ARQUITECTÓNICAS

### Inventario y Finanzas: 100% Aislado en `psn`
| Aspecto | Ubicación | Justificación |
|---------|-----------|---------------|
| Catálogo (scraping) | `psn.catalog_games` | Datos informativos del scraping |
| Productos vendibles | `psn.game_products` | Vincula catálogo con códigos comerciales |
| Códigos de Juego (stock) | `psn.game_codes` | Inventario de cuentas, encriptados |
| Órdenes del módulo | `psn.orders` | Órdenes propias, sin tocar `public.orders` |
| Pagos del módulo | `psn.payment_transactions` | Registro de transacciones cripto propias |
| Webhook | `/api/psn/webhook` | Endpoint propio para NOWPayments IPN |

### Esquema de Navegación y Visualización Admin
```
Dacribel (navegación)
│
├── 🏛️ Admin Principal (/admin/)         ← El Centro Comercial
│   ├── Inventario    → Solo Gift Cards
│   ├── Finanzas      → Solo Gift Cards
│   └── Usuarios      → Todos
│
└── 🎮 PSN Module (/extensions/psn/)     ← El Local
    ├── Catálogo      → Grid de juegos (público)
    ├── Inventario    → Códigos de juego (solo admin)
    └── Finanzas      → Ventas PSN (solo admin)
```
> Si se desconecta el módulo PSN, el Admin Principal queda intacto.
> Cada uno tiene su propio libro contable. Cero facturas huérfanas.

### Dos Capas del Módulo
1. **CAPA INFORMATIVA (Catálogo)**: Scraping → Atrae tráfico → Solo lectura para usuarios.
2. **CAPA COMERCIAL (Códigos)**: Admin vincula códigos a juegos del catálogo → Botón "Comprar" → Entrega automática.

---

## 🗄️ ESQUEMA DE BASE DE DATOS (Esquema `psn`)

### `psn.catalog_games` (Juegos scrapeados — informativos)
| Campo | Tipo | Función |
|-------|------|---------|
| `id` | UUID (PK) | Identificador único |
| `url` | Text (Unique) | URL de PlayStation Store |
| `title` | Text | Nombre del juego |
| `image_url` | Text | URL de la imagen del juego |
| `regular_price` | Numeric | Precio sin descuento |
| `promo_price` | Numeric | Precio con descuento |
| `discount_percent` | Integer | Porcentaje de descuento |
| `region` | Text | Región (USA, ES, TR, etc.) |
| `platforms` | Text[] | Versiones (PS4, PS5) |
| `promo_end_date` | Timestamptz | Fecha fin de promoción |
| `last_scraped_at` | Timestamptz | Última actualización de scraping |
| `scrape_status` | Text | `idle`, `queued`, `processing`, `error` |
| `is_visible` | Boolean | Visible para usuarios (default: true) |
| `created_at` | Timestamptz | Fecha de creación |

### `psn.game_products` (Juegos vendibles — vinculan catálogo con códigos)
| Campo | Tipo | Función |
|-------|------|---------|
| `id` | UUID (PK) | Identificador único |
| `catalog_game_id` | UUID (FK → catalog_games.id) | Juego del catálogo vinculado |
| `sale_price` | Numeric | Precio de **venta** al cliente (en USDT) |
| `cost_price` | Numeric | Precio de **costo** para Dacribel (en USDT) |
| `description` | Text | Descripción o notas (opcional) |
| `stock_alert_threshold` | Integer | Umbral de alerta de stock bajo (default: 5) |
| `is_active` | Boolean | Disponible para compra (default: true) |
| `created_at` | Timestamptz | Fecha de creación |

> **Utilidad** se calcula automáticamente: `sale_price - cost_price` por unidad.

### `psn.game_codes` (Inventario de cuentas/códigos)
| Campo | Tipo | Función |
|-------|------|---------|
| `id` | UUID (PK) | Identificador único |
| `game_product_id` | UUID (FK → game_products.id) | Producto al que pertenece |
| `code` | Text | El código/cuenta completa (encriptado) |
| `status` | Text | `available`, `sold`, `reserved` |
| `order_id` | UUID (FK → psn.orders.id) | Orden que lo compró |
| `reserved_until` | Timestamptz | Expiración de reserva (10 min) |
| `created_at` | Timestamptz | Fecha de carga |

### `psn.orders` (Órdenes del módulo — autónomas)
| Campo | Tipo | Función |
|-------|------|---------|
| `id` | UUID (PK) | Identificador único |
| `user_id` | UUID (FK → auth.users.id) | Cliente que compró |
| `game_product_id` | UUID (FK → game_products.id) | Producto comprado |
| `quantity` | Integer | Cantidad de códigos |
| `amount` | Numeric | Ingreso neto del negocio (venta × cantidad) |
| `cost_total` | Numeric | Costo total (costo × cantidad) |
| `profit` | Numeric | Ganancia (amount - cost_total) |
| `status` | Text | `pending`, `completed`, `cancelled`, `expired` |
| `wallet_address` | Text | Billetera única de NOWPayments |
| `external_txid` | Text | Hash de la transacción blockchain |
| `created_at` | Timestamptz | Fecha de creación |

### `psn.payment_transactions` (Pagos del módulo)
| Campo | Tipo | Función |
|-------|------|---------|
| `id` | UUID (PK) | Identificador único |
| `order_id` | UUID (FK → psn.orders.id) | Orden asociada |
| `nowpayments_id` | Text | ID de la factura en NOWPayments |
| `amount_usdt` | Numeric | Monto en USDT |
| `status` | Text | `waiting`, `paid`, `expired`, `confirmed`, `cancelled` |
| `network` | Text | Red blockchain (default: 'BSC (BEP20)') |
| `raw_payload` | JSONB | Respuesta cruda del webhook |
| `created_at` | Timestamptz | Fecha |

---

## 🖊️ CAMPOS DEL BOTTOM SHEET: "CREAR JUEGO VENDIBLE"

El bottom sheet que se abre al presionar el **FAB circular** del admin contiene:

### Sección 1: Información del Producto
1. **Selector de Juego del Catálogo** (Dropdown con búsqueda)
   - Lista todos los juegos de `psn.catalog_games`
   - Muestra: imagen miniatura + título + región
   - Filtro de búsqueda por nombre

2. **Precio de Venta** (Input numérico — USDT)
   - Lo que el cliente paga

3. **Precio de Costo** (Input numérico — USDT)
   - Lo que Dacribel pagó por la cuenta

4. **Descripción** (Textarea, opcional)
   - Notas internas o descripción visible

### Sección 2: Carga de Códigos
5. **Textarea de Códigos** (Multilínea)
   - Un código por línea
   - Formato: `NombreJuego-correo@mail.com-Contraseña-FechaNac-Region-dato-dato`
   - Cada salto de línea = 1 unidad de stock

### Sección 3: Resumen Financiero (Auto-calculado)
Panel visual estilo tarjeta oscura con las métricas en tiempo real:

| Métrica | Cálculo |
|---------|---------|
| **TOTAL CÓDIGOS** | Conteo de líneas del textarea |
| **TOTAL INVERSIÓN** | `cost_price × total_códigos` USDT |
| **VENTA ESTIMADA** | `sale_price × total_códigos` USDT |
| **GANANCIA ESTIMADA** | `(sale_price - cost_price) × total_códigos` USDT + ≈ COP |

### Sección 4: Configuración
6. **Alerta de Stock Bajo** (Input numérico con stepper)
   - Umbral para notificación (default: 5)
   - Cuando el stock disponible baje de este número, el admin recibe aviso visual

### Botón Final
7. **"CARGAR INVENTARIO"** (Botón primario Oro)
   - Crea el `game_product` + parsea textarea + inserta N registros en `game_codes`

---

## 🔔 SISTEMA DE NOTIFICACIONES (Stock Bajo)

### Implementación Ligera (Sin servicios externos)
Al ser un módulo enchufable, las notificaciones se manejan **dentro del propio módulo**, sin tocar el Core:

1. **Badge Visual en el Sidebar/NavLink del módulo PSN**
   - Si algún `game_product` tiene stock < `stock_alert_threshold`, se muestra un punto rojo en el ícono de PSN del menú.
   - Se calcula con una vista SQL: `psn.low_stock_alerts`.

2. **Banner de Alerta en la Página del Módulo** (Solo admin)
   - Franja superior: "⚠️ 3 juegos con stock bajo" + link para ver cuáles.

3. **Indicador en la Tarjeta** (Solo admin)
   - Si un juego tiene stock bajo, su tarjeta muestra un badge naranja: "Stock: 2 ⚠️".

> **Notificaciones push/email**: Se pueden agregar en el futuro como una mejora, sin modificar la arquitectura actual.

---

## 🗺️ HOJA DE RUTA (CHECKLIST DETALLADO)

---

### 📦 FASE 1: CIMIENTOS DE BASE DE DATOS
*Esquema SQL + Migraciones en Supabase*

- [ ] **1.1** Crear/verificar esquema `psn` en Supabase.
- [ ] **1.2** Crear tabla `psn.catalog_games` con todos los campos.
- [ ] **1.3** Crear tabla `psn.game_products` con FK a `catalog_games`.
- [ ] **1.4** Crear tabla `psn.game_codes` con FK a `game_products`.
- [ ] **1.5** Crear tabla `psn.orders` (órdenes autónomas del módulo).
- [ ] **1.6** Crear tabla `psn.payment_transactions` con FK a `psn.orders`.
- [ ] **1.7** Crear vista `psn.game_stock_view` (stock disponible en tiempo real).
- [ ] **1.8** Crear vista `psn.low_stock_alerts` (productos con stock bajo).
- [ ] **1.9** Configurar políticas RLS para todas las tablas del esquema `psn`.
- [ ] **1.10** Crear función `psn.release_expired_game_reservations()`.
- [ ] **1.11** Configurar job `pg_cron` para liberación de reservas cada 5 minutos.

---

### ⚙️ FASE 2: MOTOR DE SCRAPING (Backend)
*API Routes + Integración Gemini*

- [ ] **2.1** Crear API Route `/api/psn/scrape` (POST) — Recibe 1 URL, extrae datos con Gemini.
- [ ] **2.2** Configurar prompt de Gemini para extracción estructurada (imagen, precios, región, plataformas, descuento, fecha fin).
- [ ] **2.3** Implementar parseo y validación de la respuesta de Gemini.
- [ ] **2.4** Guardar datos extraídos en `psn.catalog_games` (insert o update por URL).
- [ ] **2.5** Crear API Route `/api/psn/scrape-batch` (POST) — Recibe múltiples URLs, las encola.
- [ ] **2.6** Implementar sistema de cola con intervalo de 5 minutos entre cada juego.
- [ ] **2.7** Crear API Route `/api/psn/scrape-refresh` (POST) — Re-scrapea juegos con promos expiradas.
- [ ] **2.8** Agregar manejo de errores y reintentos para scraping fallido.
- [ ] **2.9** Proteger todas las rutas API con validación de rol `admin`.

---

### 🎮 FASE 3: CATÁLOGO FRONTEND (UI Informativa)
*Grid de tarjetas + Vista pública*

- [ ] **3.1** Crear layout base del módulo PSN (`extensions/psn/layout.tsx`).
- [ ] **3.2** Crear página principal del catálogo (`extensions/psn/page.tsx`).
- [ ] **3.3** Diseñar componente `GameCard` (imagen, título, precios, descuento, región, plataformas, fecha fin).
- [ ] **3.4** Implementar grid responsive (mobile-first) para las tarjetas.
- [ ] **3.5** Mostrar badge de "% Descuento" en cada tarjeta.
- [ ] **3.6** Mostrar cuenta regresiva o fecha fin de promo.
- [ ] **3.7** Indicador visual cuando una promo ya expiró.
- [ ] **3.8** Implementar filtros: por región, por plataforma, por estado de promo.
- [ ] **3.9** Implementar buscador por nombre de juego.

---

### 🛡️ FASE 4: PANEL ADMIN DEL CATÁLOGO
*Gestión de URLs y scraping*

- [ ] **4.1** Agregar icono de editar (esquina superior) en cada `GameCard` (solo admin).
- [ ] **4.2** Bottom sheet de edición: editar URL, visibilidad, re-scrapear individual.
- [ ] **4.3** Botón "Actualizar" visible solo cuando la promo expiró (solo admin).
- [ ] **4.4** Implementar lógica del botón "Actualizar": encolar re-scraping escalonado.
- [ ] **4.5** Bottom sheet para agregar URLs en lote (textarea, 1 URL por línea).
- [ ] **4.6** Indicador visual del estado de scraping (`processing`, `queued`, `error`).
- [ ] **4.7** Notificación/toast cuando un juego termina de actualizarse.

---

### 🏪 FASE 5: SISTEMA DE CÓDIGOS (Backend Comercial)
*CRUD de productos vendibles + inventario de cuentas*

- [ ] **5.1** Crear API Route `/api/psn/products` (POST) — Crear juego vendible + cargar códigos.
- [ ] **5.2** Parsear textarea de códigos (split por `\n`) y crear registros en `psn.game_codes`.
- [ ] **5.3** Encriptar códigos con `INTERNAL_ENCRYPTION_KEY` (mismo motor que gift cards).
- [ ] **5.4** Crear API Route `/api/psn/products` (GET) — Listar productos con stock disponible.
- [ ] **5.5** Crear API Route `/api/psn/products/[id]` (PATCH) — Editar producto, agregar más códigos.
- [ ] **5.6** Crear API Route `/api/psn/products/[id]` (DELETE) — Desactivar producto.
- [ ] **5.7** Crear RPC `psn.process_game_checkout` — Reserva Atómica con `FOR UPDATE SKIP LOCKED`.
- [ ] **5.8** Crear RPC `psn.complete_game_order` — Desencriptar y entregar códigos al confirmar pago.

---

### 🛒 FASE 6: SISTEMA DE COMPRA (Frontend Comercial)
*Bottom sheets de compra + FAB de creación*

- [ ] **6.1** Botón FAB circular flotante (solo admin) → abre bottom sheet de creación.
- [ ] **6.2** Implementar bottom sheet "Crear Juego Vendible" con todos los campos.
- [ ] **6.3** Selector de juego del catálogo con búsqueda y preview (miniatura + título + región).
- [ ] **6.4** Inputs de Precio de Venta y Precio de Costo.
- [ ] **6.5** Textarea para códigos con contador de líneas (= unidades de stock).
- [ ] **6.6** Panel de resumen financiero auto-calculado (Total Códigos, Inversión, Venta, Ganancia + COP).
- [ ] **6.7** Input de Alerta de Stock Bajo con stepper.
- [ ] **6.8** Mostrar botón "Comprar" en tarjetas que tienen stock disponible.
- [ ] **6.9** Ocultar botón "Comprar" en tarjetas puramente informativas.
- [ ] **6.10** Bottom sheet de compra: imagen, título, precio, botones +/- cantidad, total.
- [ ] **6.11** Validación de stock disponible antes de confirmar cantidad.

---

### 💸 FASE 7: INTEGRACIÓN DE PAGOS (Webhook Propio)
*Motor de pagos autónomo del módulo*

- [ ] **7.1** Crear API Route `/api/psn/create-payment` — Genera factura en NOWPayments.
- [ ] **7.2** Crear API Route `/api/psn/webhook` — Webhook IPN propio del módulo.
- [ ] **7.3** Implementar validación HMAC-SHA512 en el webhook propio.
- [ ] **7.4** Conectar webhook con `psn.complete_game_order` para entrega automática.
- [ ] **7.5** Registrar transacciones en `psn.payment_transactions`.
- [ ] **7.6** Bottom sheet de pago con QR, dirección, temporizador (reutilizar diseño existente).

---

### 📊 FASE 8: FINANZAS E INVENTARIO PSN (Admin del Módulo)
*Panel de gestión completo dentro del módulo*

- [ ] **8.1** Sub-página de inventario de códigos dentro de `/extensions/psn`.
- [ ] **8.2** Tabla: Juego | Stock Total | Disponibles | Vendidos | Reservados.
- [ ] **8.3** Expandir fila para ver códigos individuales (enmascarados).
- [ ] **8.4** Botón para agregar más códigos a un producto existente.
- [ ] **8.5** Botón para desactivar/activar un producto vendible.
- [ ] **8.6** Sub-página de finanzas PSN con métricas propias.
- [ ] **8.7** Métricas: Ingresos Totales | Costo Total | Ganancia Neta | Conversión COP.
- [ ] **8.8** Tabla de órdenes PSN con filtros (fecha, estado, juego).
- [ ] **8.9** Badges de alerta de stock bajo en tarjetas y sidebar.
- [ ] **8.10** Banner "⚠️ X juegos con stock bajo" (solo admin).

---

### 🧪 FASE 9: PRUEBAS Y PULIDO
*QA + Optimización*

- [ ] **9.1** Test de scraping con 5 URLs reales de PlayStation Store.
- [ ] **9.2** Test de cola escalonada (verificar intervalo de 5 min).
- [ ] **9.3** Test de compra completa: seleccionar → pagar → recibir código.
- [ ] **9.4** Test de Reserva Atómica: verificar liberación tras 10 min sin pago.
- [ ] **9.5** Test de concurrencia: 2 usuarios comprando el mismo código.
- [ ] **9.6** Verificar que errores en PSN no afectan el Core (Error Boundary).
- [ ] **9.7** Test de desconexión: desactivar módulo en `extensions.ts` y confirmar Core intacto.
- [ ] **9.8** Optimización de carga de imágenes (lazy loading).
- [ ] **9.9** Revisión de responsive en móvil, tablet y desktop.
- [ ] **9.10** Actualizar documentación (`modulos.md`, `database.md`, `BITACORA.md`).

---

## 🚦 ESTADO GLOBAL DEL MÓDULO

| Fase | Descripción | Pasos | Estado |
|------|-------------|-------|--------|
| Fase 1 | Base de Datos | 11 | ⬜ Pendiente |
| Fase 2 | Motor de Scraping | 9 | ⬜ Pendiente |
| Fase 3 | Catálogo Frontend | 9 | ⬜ Pendiente |
| Fase 4 | Panel Admin Catálogo | 7 | ⬜ Pendiente |
| Fase 5 | Sistema de Códigos Backend | 8 | ⬜ Pendiente |
| Fase 6 | Sistema de Compra Frontend | 11 | ⬜ Pendiente |
| Fase 7 | Integración de Pagos | 6 | ⬜ Pendiente |
| Fase 8 | Finanzas e Inventario Admin | 10 | ⬜ Pendiente |
| Fase 9 | Pruebas y Pulido | 10 | ⬜ Pendiente |
| **TOTAL** | | **81 pasos** | |

---
*Dacribel: Evolución Modular de Alta Gama.*
*Última Actualización: 15/04/2026 por Antigravity AI.*
