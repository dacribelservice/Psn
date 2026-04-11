# 🏦 BÚNKER DE PAGOS DACRIBEL - INFRAESTRUCTURA INDUSTRIAL

Este documento detalla el motor de transacciones de Dacribel, su arquitectura actual basada en NOWPayments y los planes de mejora para garantizar la integridad total de los activos digitales.

---

## 🚀 1. SISTEMA ACTUAL: INTEGRACIÓN NOWPAYMENTS (FASE 10-12)

Dacribel ha migrado a una pasarela de grado industrial para garantizar la escalabilidad y seguridad de cada transacción.

### 🪄 1.1 Funcionamiento (Experiencia Premium)
1.  **Zen Checkout**: Interfaz simplificada que oculta datos técnicos al inicio.
2.  **Reveal Effect**: Generación de billetera única y dinámica al pulsar "PAGAR AHORA" con animaciones fluidas.
3.  **Confirmación Automática (Webhook IPN)**:
    *   **NOWPayments** notifica al servidor mediante un webhook seguro.
    *   **Validación HMAC-SHA512**: El sistema verifica la firma digital para asegurar que el aviso es auténtico.
    *   **Entrega Atómica**: Al confirmarse el pago (`finished`), el sistema dispara el RPC `complete_order` para entregar los códigos instantáneamente. ✅🚀

### 🛠️ 1.2 Configuración en Producción (Vercel)
*   `NOWPAYMENTS_API_KEY`: Llave privada para generación de cobros.
*   `NOWPAYMENTS_IPN_SECRET`: Secreto para validación de firmas digitales.
*   `SUPABASE_SERVICE_ROLE_KEY`: Acceso maestro para entrega de productos saltando restricciones de RLS.

---

## 🛡️ 2. BLINDAJE DE INTEGRIDAD: RESERVA ATÓMICA (IMPLEMENTADO)

El sistema de inventario ha sido blindado contra condiciones de carrera (Race Condition) y duplicidad de ventas para garantizar una experiencia industrial.

### 🪄 2.1 Motor de Reserva Atómica
*   **Bloqueo de Hardware (`FOR UPDATE SKIP LOCKED`)**: El sistema bloquea físicamente las filas de la base de datos durante el checkout, impidiendo que dos clientes tomen el mismo código simultáneamente.
*   **Asignación de Vínculo**: Cada código seleccionado es vinculado de forma exclusiva al `order_id` antes de que el cliente realice el pago.
*   **Time-to-Live (10 Minutos)**: Se establece un cronómetro de 10 minutos por reserva. Si el pago no se completa, los códigos se liberan automáticamente.
*   **Entrega Blindada**: El proceso de entrega (`complete_order`) solo procesa los códigos previamente reservados, eliminando errores de stock insuficiente al confirmar el pago.

### 🔄 2.2 Automatización y Reciclaje (Self-Healing)
El sistema cuenta con un motor de mantenimiento autónomo:
*   **Job Scheduler (`pg_cron`)**: Ejecuta la función `release_expired_reservations()` cada 5 minutos.
*   **Protocolo de Liberación**: Identifica reservas expiradas y las devuelve al stock disponible (`status: available`), limpiando historiales de carritos abandonados.
*   **Vista de Stock Dinámica**: La tienda muestra stock disponible sumando tanto los códigos libres como los de reservas que acaban de expirar, optimizando la visibilidad de inventario.

### 📊 2.3 Precisión Financiera (Desacoplamiento)
Se ha implementado una capa de abstracción para las comisiones de red:
*   **Libro Contable Limpio**: La tabla `orders.amount` registra únicamente el ingreso neto del negocio.
*   **Pasarela Inteligente**: NOWPayments calcula y cobra la comisión de red (0.01 USDT) al cliente final por encima del precio del producto, asegurando que el negocio no asuma costos de red indebidos.

---



## 📜 3. HISTORIAL DE EVOLUCIÓN (SISTEMAS LEGADOS)

Dacribel ha pasado por múltiples etapas para alcanzar su robustez actual:

### 🛑 Fase de Verificación Manual (SISTEMA DESCARTADO)
Originalmente se intentó implementar un sistema de verificación directa con nodos de blockchain (Binance RPC) y campos manuales de **TxID (Hash)**.
*   **Motivo del descarte**: Ineficiencia en la gestión de nodos públicos, latencia en las confirmaciones y riesgo de fraude por re-uso de hashes.
*   **Detalle técnico**: Se utilizaban herramientas como `chaingateway.ts` y verificadores de precisión de input que resultaron ser frágiles ante cambios en los protocolos de red (USDT BEP20).

### 🔄 Migración a Independencia
Se estableció un búnker de seguridad intermedio que utilizaba una billetera maestra estática, el cual sirvió como puente hacia la automatización actual con **NOWPayments**.

---
*Estado del Sistema: 100% OPERATIVO EN PRODUCCIÓN.* 🥂🏙️✨🚀🛰️
*Última auditoría y actualización: 07/04/2026 por Antigravity AI.* ✅
