# 🏛️ DACRIBEL: ARQUITECTURA MAESTRA DE E-COMMERCE PREMIUM

> [!IMPORTANT]
> **REGLA DE ORO**: NUNCA CREAR COPIAS DE SEGURIDAD EN GITHUB DE FORMA AUTOMÁTICA. LAS COPIAS DE SEGURIDAD LAS ACTUALIZA ÚNICAMENTE **CRISTIAN (CEO DEL PROYECTO)**.

Dacribel es un ecosistema digital de alta ingeniería diseñado para la comercialización segura, escalable y automatizada de activos digitales de alto valor. Este documento resume la infraestructura técnica, los protocolos de seguridad y la arquitectura modular que sustenta la plataforma.

---

## 🚀 1. STACK TECNOLÓGICO (CORE)
La plataforma utiliza un stack de vanguardia para garantizar latencia mínima y máxima fiabilidad:

*   **Frontend**: Next.js 14 (App Router) + React 18.
*   **Lenguaje**: TypeScript (Tipado estricto para integridad de datos).
*   **Estética**: Sistema **"Ethereal Vault"** (Tailwind CSS + Framer Motion).
*   **Backend & DB**: Supabase (PostgreSQL + Realtime Engine).
*   **Servicios**: NOWPayments API (Pagos Industriales).

---

## 🏗️ 2. ARQUITECTURA: EL ROBOT MODULAR
Dacribel se divide en dos grandes bloques arquitectónicos para garantizar un crecimiento sin riesgo de colapso:

### A. El Núcleo (Core Búnker)
Contiene la lógica crítica que nunca debe fallar:
*   `/(store)`: El motor de ventas y checkout.
*   `/(admin)`: El centro de mando financiero e inventario.
*   `/(auth)`: Gestión blindada de sesiones y roles.

### B. El Sandbox (Aislamiento por Subdominio Lógico)
Ubicado en `/extensions`, este espacio permite "enchufar" nuevas funcionalidades de forma independiente.
*   **Aislamiento**: Cada módulo (PSN, Xbox, etc.) vive en su propio compartimento estanco.
*   **Protección**: Cuenta con un **Escudo Térmico (Error Boundary)** que evita que errores en extensiones afecten la tienda principal.

---

## 🛡️ 3. MODELO DE SEGURIDAD & BLINDAJE

1.  **Reserva Atómica**: Uso de `FOR UPDATE SKIP LOCKED` en PostgreSQL para bloquear stock físicamente durante 10 minutos en el checkout, eliminando condiciones de carrera (Race Conditions).
2.  **Webhooks Inmunizados**: Validación de firmas HMAC-SHA512 con protección contra ataques de cronometría (`timingSafeEqual`).
3.  **Cifrado Maestro**: Los activos digitales (códigos) se gestionan mediante una llave de cifrado de servidor (`INTERNAL_ENCRYPTION_KEY`).
4.  **Row Level Security (RLS)**: Cada tabla en Supabase está protegida; los datos solo fluyen hacia usuarios autorizados.

---

## 💸 4. MOTOR DE PAGOS (NOWPAYMENTS V3)
El flujo de transacciones es 100% autónomo:
*   **Billeteras Únicas**: Una dirección cripto dinámica generada por cada orden.
*   **Confirmación IPN**: El sistema espera la confirmación de la blockchain mediante webhooks seguros.
*   **Entrega Atómica**: El RPC `complete_order` libera el producto instantáneamente solo cuando el pago ha sido verificado con éxito.

---

## 📊 5. ESQUEMA DE DATOS (NÚCLEO)
*   `public.orders`: Registro histórico fiscal y financiero.
*   `public.inventory_codes`: Almacén blindado de activos digitales (disponibles/reservados/vendidos).
*   `public.products`: Catálogo maestro unificado.
*   `extensions.*`: Esquemas aislados para datos específicos de módulos adicionales (ej. Promos Sony).

---

## ✨ 6. FILOSOFÍA DE DISEÑO: ETHEREAL VAULT
*   **Concepto**: Profundidad tonal y Glassmorphism para una experiencia de usuario premium.
*   **Dashboard Financiero**: Conversión automática a COP e indicadores de ganancias netas en tiempo real.
*   **Adaptabilidad**: Diseño móvil de alta fidelidad que transforma datos financieros en tarjetas interactivas.

---
*Dacribel: Ecosistema Digital Inexpugnable en constante evolución.*
*Última Auditoría de Arquitectura: April 13, 2026.*
