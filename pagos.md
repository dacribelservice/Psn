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

## 🛡️ 2. MEJORAS DEL SISTEMA DE PAGOS (AUDITORÍA DE INTEGRIDAD)

Tras una auditoría realizada el **07/04/2026**, se ha detectado una falencia crítica en la lógica de asignación de inventario que debe ser blindada:

### ⚠️ Falencia Detectada: Condición de Carrera (Race Condition)
*   **Problema**: El sistema permite crear múltiples órdenes `PENDING` si hay stock disponible en el momento del "Checkout", pero no reserva ni aparta esos códigos de forma exclusiva. 
*   **Escenario de Riesgo**: Si dos clientes compran al mismo tiempo una cantidad que, sumada, supera el stock disponible (ej: Stock 20, Cliente A pide 15, Cliente B pide 10), ambos podrán pagar.
*   **Consecuencia**: El segundo cliente en pagar recibirá una **entrega incompleta** (solo los códigos restantes) a pesar de haber pagado el total, ya que el sistema no valida el cumplimiento total al momento del webhook.

### 🚀 Plan de Blindaje Sugerido
1.  **Reserva Atómica**: Implementar un bloqueo temporal de códigos en la base de datos durante los primeros 15-30 minutos de la orden.
2.  **Validación de Salida**: Modificar el RPC `complete_order` para que lance un error si no puede asignar la cantidad exacta pagada, permitiendo al administrador gestionar el reembolso o la carga manual de stock faltante.

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
