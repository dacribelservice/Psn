# 🛡️ DACRIBEL: PROTOCOLO DE SEGURIDAD Y AUDITORÍA

Este documento registra todas las medidas de seguridad, incidentes y protecciones implementadas para garantizar la integridad de la plataforma.

---

## 🔒 1. CAPAS DE PROTECCIÓN ACTUALES
*   **Supabase RLS (Row Level Security)**: Activado en tablas críticas (`inventory_codes`, `orders`, `profiles`). Solo el dueño de la información puede leerla o modificarla.
*   **Gestión por Roles**: Redirección forzada. Un usuario no puede "escribir" la URL `/admin` y entrar; el servidor lo rebota si no tiene el rol verificado en la tabla de perfiles.
*   **Master Failsafe (Respaldo Maestro)**: Sistema de emergencia que garantiza acceso al dueño por correo electrónico, incluso si la base de datos está caída o bajo ataque.
*   **Anti-Loop Shield**: Protección contra ataques de denegación de servicio (DoS) locales o bucles de autenticación infinitos.

---

## 📋 2. REGISTRO DE INCIDENTES / FALSAS ALARMAS
*   **01/04/2026 - Alerta de "Administrador Boss"**: 
    *   **Estado**: Falsa Alarma.
    *   **Causa**: Implementación de un modo de emergencia para evitar el "Loading Hang" de la App. El sistema forzó el nombre "Administrador Boss" y el rol Admin para el correo del dueño.
    *   **Resolución**: Se ajustó la lógica para permitir la edición de perfil (nombre/foto) manteniendo el respaldo de seguridad del rol.

---

## 🛠️ 3. MEJORAS DE SEGURIDAD PENDIENTES
*   [ ] Implementación de 2FA (Autenticación de dos pasos).
*   [ ] Auditoría de logs de acceso por IP.
*   [ ] Cifrado de extremo a extremo para las Gift Cards en el historial.

---
*Dacribel Security Log - Protegiendo la arquitectura del lujo.*
