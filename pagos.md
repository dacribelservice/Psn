# DOCUMENTACIÓN DE PAGOS - PROYECTO DACRIBEL (PSN)
1: 
2: ## 🏆 REGLAS DE ORO (INVIOLABLES)
3: 1. **NUNCA GUARDAR COPIAS DE SEGURIDAD (BACKUPS, DUMPS, ARCHIVOS BINARIOS) SIN AUTORIZACIÓN EXPRESA DEL USUARIO.**
4: 2. **CERO TRABAJO SIN CONFIRMACIÓN:** LAS TAREAS SE REALIZARÁN ESTRICTAMENTE PASO A PASO Y SOLO TRAS LA CONFIRMACIÓN EXPRESA DEL USUARIO.
5: 
6: ---
7: 

## 🎯 OBJETIVO DE LA FASE 5: Automatización de Pagos Cripto
Automatizar la recepción y verificación de pagos en la red BEP20 (Binance Smart Chain) para liberar códigos de Gift Cards de forma instantánea.

---

## 🏗️ ESTADO ACTUAL (Sesión XVIII)
- [x] **Storefront Checkout UI:** Pantalla de procesamiento y selección de red terminada.
- [x] **Checkout Logic (DB):** Sistema de reserva de stock y vinculación de códigos (`process_checkout`) 100% funcional.
- [x] **Validation Modal UI:** Visual de "Validando Pago" y "Éxito/Error" integrado.

---

## 🛠️ HOJA DE RUTA: Integración de Chaingateway.io (Fase 5)
Para lograr la entrega instantánea mediante pagos cripto en la red **BEP20**, seguiremos este plan de acción de micro-tareas:

### 📡 Fase 1: Infraestructura y Entorno
- [ ] **Registro en Chaingateway.io:** Crear cuenta y obtener la `API_KEY`.
- [ ] **Configuración de Seguridad:** Añadir IPs autorizadas (Localhost y Vercel Production) en el dashboard de Chaingateway.
- [ ] **Variables de Entorno:** Integrar `CHAINGATEWAY_API_KEY` y `CHAINGATEWAY_WEBHOOK_SECRET` en `.env.local` y Vercel.

### 🧠 Fase 2: Lógica de Backend (Next.js)
- [ ] **Servicio Maestro (`lib/payments/chaingateway.ts`):** Crear la clase para interactuar con la API de Chaingateway.
- [ ] **Generación de Wallet Única:** Implementar función para solicitar una dirección por cada nueva orden de Gift Card.
- [ ] **Endpoint de Creación:** Ruta API para vincular una orden de Supabase con una dirección de depósito.

### 🗄️ Fase 3: Persistencia y Estados (Supabase)
- [ ] **Nueva Tabla `payment_transactions`:** Crear en SQL con campos: `id`, `order_id`, `wallet_address`, `amount_usdt`, `status`, `expires_at`.
- [ ] **Sincronización Atómica:** Al generar el pago, registrarlo en la DB y marcar la orden como "payment_pending".
- [ ] **Limpieza Automática:** Tarea para expirar órdenes no pagadas en 10-15 minutos.

### ⚡ Fase 4: Webhooks y Entrega Instantánea
- [ ] **Endpoint Receptor (`/api/webhooks/payments`):** Crear la ruta que escuchará las confirmaciones de Chaingateway.
- [ ] **Validación de Firma:** Verificar que la señal venga realmente de Chaingateway (Protección contra falsificaciones).
- [ ] **Trigger de Liberación:** Al detectar el pago, ejecutar la función SQL que asigna el código digital de `inventory_codes` a la `order` y lo muestra al usuario.

### ✨ Fase 5: Experiencia de Usuario (Ethereal Vault)
- [ ] **QR Dinámico:** Generar código QR visual en el `PaymentBottomSheet` usando la wallet asignada.
- [ ] **Temporizador Realtime:** Mostrar cuenta regresiva de validez del pago.
- [ ] **Feedback de Éxito:** Animación de Confetti y "Bóveda Abierta" al confirmarse la transacción por Webhook.

---
> [!IMPORTANT]
> Cada paso debe ser validado en el puerto 3003 antes de avanzar al siguiente para garantizar la estabilidad total.
