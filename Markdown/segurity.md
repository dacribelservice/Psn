# 🛡️ Reporte de Seguridad e Incidente (Mayo 2026)

Este documento detalla la investigación, las vulnerabilidades identificadas, las medidas de mitigación aplicadas y el análisis final del incidente de seguridad ocurrido en el sistema **Psn**.

---

## 1. Resumen del Incidente
El 14 de mayo de 2026, se detectó actividad inusual por parte de un usuario con el correo `estccerv@gmail.com`. El atacante logró crear órdenes fraudulentas y marcarlas como "Completadas" sin realizar un pago real. 

### Hallazgos Clave:
- **Órdenes Detectadas**:
    - ID: `614f0c25-20d7-4bbe-b67d-e9d91d0b59ab` (Monto: 9.5 USDT)
    - ID: `21047748-9582-41f8-bd51-b025bce63719` (Monto: 0.00 USDT)
- **Resultado**: El atacante **NO logró obtener los códigos**. Las órdenes quedaron en estado "Completado" en la base de datos, pero el sistema de entrega no asignó códigos del inventario. El atacante solo ve el texto "PENDIENTE" en su historial.
- **Inventario**: Se confirmó que el inventario de Nintendo $10 cuenta con 3 códigos actualmente, y que no se han liberado ni eliminado códigos de este producto desde el 7 de abril de 2026.

---

## 2. Vulnerabilidades Identificadas
Durante la auditoría inicial, se encontraron los siguientes puntos débiles:

1.  **Validación de Webhooks (PayPal)**: El endpoint de recepción de notificaciones de PayPal no verificaba las firmas criptográficas. Esto permitía a un atacante simular una confirmación de pago enviando un JSON falso directamente al servidor.
2.  **Políticas de Seguridad de Base de Datos (RLS)**: Las políticas de Supabase (Row Level Security) permitían inserciones o actualizaciones directas en la tabla de `orders` desde el cliente (anon key), facilitando la manipulación del estado de las órdenes.
3.  **Falta de Auditoría**: No existía un registro detallado de quién y cuándo modificaba tablas críticas como `inventory_codes` o el saldo de los usuarios.

---

## 3. Checklist de Acciones Aplicadas (Mitigación)

Se implementaron las siguientes mejoras técnicas para blindar el sistema:

### ✅ Seguridad en Webhooks
- **Verificación de Firma**: Se integró el SDK oficial de PayPal para verificar que cada notificación de pago provenga realmente de los servidores de PayPal.
- **Validación de Monto**: El sistema ahora compara el monto reportado por el webhook contra el precio real del producto en la base de datos antes de completar la orden.

### ✅ Seguridad en Base de Datos (Supabase RLS)
- **Bloqueo de Inserción Directa**: Se configuraron políticas para que solo el rol de servicio (`service_role`) pueda marcar órdenes como `completed`.
- **Protección de Inventario**: La tabla `inventory_codes` ahora es de "solo lectura" para usuarios normales. Solo procesos internos del servidor pueden asignar o vender códigos.
- **Restricción de Perfiles**: Los usuarios solo pueden ver sus propios datos, y se bloqueó cualquier intento de modificar campos sensibles (como roles o balances) desde el frontend.

### ✅ Sistema de Auditoría Avanzada
- **Tabla de Auditoría**: Se creó `public.audit_logs` para registrar cada `INSERT`, `UPDATE` y `DELETE` en tablas críticas.
- **Triggers Automáticos**: Se instalaron disparadores en la base de datos que guardan automáticamente el estado anterior y nuevo de cada registro, permitiendo reconstruir cualquier incidente.
- **Rastreo de Identidad**: Cada log captura (cuando está disponible) el `user_id`, correo, dirección IP y el tipo de acción realizada.

---

## 4. Análisis del Atacante
- **Email**: `estccerv@gmail.com`
- **ID de Usuario**: `8760730a-6fa3-4e4b-8b82-9961a2b02da3`
- **Método de Ataque**: Intento de explotación de vulnerabilidad en el flujo de PayPal antes de las correcciones de firma.
- **Estado Actual**: El usuario ha sido identificado y sus órdenes fraudulentas están aisladas. No tiene acceso a ningún código de tarjetas de regalo.

---

## 5. Estado Actual del Sistema
- **Integridad del Inventario**: **100% SEGURO**. No hay evidencia de fuga de códigos.
- **Nivel de Riesgo**: **BAJO**. Las vulnerabilidades explotadas han sido parchadas.
- **Recomendación Final**: Proceder a eliminar manualmente las órdenes del atacante para limpiar los reportes financieros.

## 6. Estado de Desincronización (Código vs Base de Datos)
- **Problema Actual**: El repositorio local fue restaurado a un commit anterior al parche de seguridad, pero la base de datos de Supabase mantiene las estrictas políticas de seguridad (RLS activado, triggers y bloqueo de modificaciones desde el frontend).
- **Consecuencia**: La aplicación falla al intentar procesar pagos y entregar códigos. El código antiguo (frontend) intenta actualizar/leer tablas (`orders`, `inventory_codes`) directamente, pero Supabase rechaza estas peticiones por seguridad.
- **Decisión Estratégica**: Se **MANTENDRÁ** la seguridad máxima en la base de datos. En su lugar, el código será refactorizado (alineado) para cumplir con las nuevas reglas, moviendo toda lógica sensible al servidor (backend).

## 7. Plan Quirúrgico: Alineación de Código y Base de Datos (Checklist)
Para restaurar la funcionalidad completa de la app de forma segura, debemos seguir estos pasos uno por uno:

- [x] **Paso 1: Auditoría y Ajuste de Rutas API (Servidor)**
  - Revisar `app/api/payments/nowpayments-webhook/route.ts` y `create/route.ts`.
  - Garantizar que TODA interacción con la base de datos en estas rutas use `createSupabaseAdminClient` (Service Role Key) para sortear el RLS.
  - Validar que la asignación de códigos se haga **exclusivamente** invocando la función segura `adminClient.rpc('complete_order')`.

- [x] **Paso 2: Refactorización del Flujo de Procesamiento (`app/(store)/payment/processing/page.tsx`)**
  - Eliminar por completo los comandos como `supabase.from('orders').update(...)` desde este componente de cliente (frontend).
  - Ajustar la suscripción en tiempo real (Supabase Realtime) para que el cliente solo "escuche" pasivamente los cambios de estado emitidos por el webhook, sin intentar forzar actualizaciones en la BD.

- [x] **Paso 3: Refactorización del Historial del Usuario (`app/history/page.tsx`)**
  - Analizar cómo se consultan los códigos comprados. Actualmente falla porque RLS bloquea la lectura de `inventory_codes` desde el cliente.
  - Se creó la API Route segura `/api/user/orders` que valida la identidad y devuelve los códigos descifrados desde el servidor.

- [x] **Paso 4: Erradicación de Código Cliente Obsoleto**
  - Rastrear en todo el frontend llamadas residuales que intenten escribir o manipular datos sensibles directamente en Supabase.
  - Reemplazar estas llamadas por peticiones HTTP seguras (`fetch`) hacia nuestras API internas protegidas.

- [x] **Paso 5: Pruebas de Flujo Completo (End-to-End)**
  - Realizar transacciones de prueba simulando pagos.
  - Validar que la orden pase de "Pendiente" a "Completado" automáticamente sin intervención manual.
  - Confirmar que el código del inventario se asigne, se descuente, y el usuario lo pueda visualizar en su historial de manera segura.
  - **Resultado**: Prueba realizada exitosamente el 15 de mayo de 2026. La orden `a33b5b1e-e64f-4bad-a03c-9e38404cfa1b` se completó y asignó el código correctamente.

---
*Documento generado por Antigravity - Asistente de Seguridad e Inteligencia Artificial.*
