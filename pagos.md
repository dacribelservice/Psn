# DOCUMENTACIÓN DE PAGOS - PROYECTO DACRIBEL (PSN)

## 🎯 OBJETIVO DE LA FASE 5: Automatización de Pagos Cripto
Automatizar la recepción y verificación de pagos en la red BEP20 (Binance Smart Chain) para liberar códigos de Gift Cards de forma instantánea.

---

## 🏗️ ESTADO ACTUAL (Sesión XVIII)
- [x] **Storefront Checkout UI:** Pantalla de procesamiento y selección de red terminada.
- [x] **Checkout Logic (DB):** Sistema de reserva de stock y vinculación de códigos (`process_checkout`) 100% funcional.
- [x] **Validation Modal UI:** Visual de "Validando Pago" y "Éxito/Error" integrado.

---

## 🕵️‍♂️ PRÓXIMO FOCO: Lógica de Backend & Webhooks
Aquí registraremos el análisis profundo para:
1.  **Generación de Wallet:** Estrategia para asignar una dirección única por transacción.
2.  **Monitoreo On-Chain:** Cómo detectar que el USDT ha llegado a la billetera.
3.  **Confirmación API:** Punto de entrada para que el servicio de pagos le diga a Supabase: "¡Pago recibido, libera el código!". 🔓💰🔐

---
> **Nota de Sesión:** Este archivo será el foco principal de la Sesión XIX para el análisis técnico de integración con pasarelas de pago o nodos dedicados.
