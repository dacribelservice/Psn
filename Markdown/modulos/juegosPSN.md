# 🕹️ MÓDULO: CATÁLOGO DE PROMOCIONES PLAYSTATION

> [!IMPORTANT]
> **REGLA DE ORO**: NUNCA CREAR COPIAS DE SEGURIDAD EN GITHUB DE FORMA AUTOMÁTICA. LAS COPIAS DE SEGURIDAD LAS ACTUALIZA ÚNICAMENTE **CRISTIAN (CEO DEL PROYECTO)**.

Este módulo es la primera extensión oficial de Dacribel, diseñada para ofrecer un catálogo dinámico y filtrable de tarjetas de regalo de PlayStation, conectado al núcleo de pagos pero operando de forma aislada.

---

## 🏛️ ARQUITECTURA DEL MÓDULO
- **ID de Extensión**: `catalogo-playstation`
- **Ubicación de UI**: `app/(extensions)/catalogo-playstation/`
- **Estado**: 🏛️ CONCEPTUALIZACIÓN ALPHA

## 🎯 VISIÓN ESTRATÉGICA: "FLOR DE MARIPOSA"
La premisa de este módulo no es solo vender, sino **servir de utilidad**. Plantar una "flor" (la comparativa de precios) para que las "mariposas" (los clientes y dueños de negocio) lleguen de forma orgánica a Dacribel.
- **Estrategia**: Ofrecer gratis la comparativa de precios regionales para atraer tráfico orgánico masivo.
- **Conversión**: Integrar botones de compra de Gift Cards vinculados a la región de mayor ahorro.

## 🧠 CONCEPTO TÉCNICO: GEMINI-POWERED SCRAPING
A diferencia de los scrapers tradicionales que son frágiles ante cambios de diseño, este módulo propone:
1. **Extracción Adaptativa**: Uso de la API de Gemini para procesar el HTML crudo y extraer precios, regiones y versiones de forma inteligente.
2. **Estabilidad Superior**: Capacidad de recuperación automática si Sony cambia la estructura de su web.

## 📊 ESQUEMA DE DATOS (PSN TRACKER)
| Campo | Tipo | Función |
|-------|------|---------|
| `game_title` | String | Nombre oficial del título |
| `region_prices`| JSONB | Mapa de precios por región (USA, ES, TR, etc) |
| `release_date` | Date | Para seguimiento de preventas |
| `promo_end` | DateTime | Fecha de expiración de la oferta |

## 🛠️ PUNTOS DE CONTROL (CHECKLIST DE EVOLUCIÓN)
- [x] Registro conceptual.
- [ ] Definición de estructura de datos en Supabase.
- [ ] Pruebas de extracción de datos (Gemini AI Integration).
- [ ] Diseño de Grid Comparativo (PC/Mobile).
- [ ] Puente de Checkout (Gift Card Linking).

---
*Dacribel: Evolución Modular de Alta Gama.*
*Creado: 12/04/2026 por Antigravity AI.*
