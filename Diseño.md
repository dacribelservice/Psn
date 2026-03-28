# Documento del Sistema de Diseño

## 1. Visión General y Estrella del Norte Creativa
**Estrella del Norte Creativa: "La Bóveda Etérea" (The Ethereal Vault)**

Este sistema de diseño está diseñado para transformar un entorno de comercio criptográfico de alta frecuencia en una experiencia editorial premium. Nos estamos alejando de la estética de "panel de control estándar" hacia una atmósfera sofisticada y en capas que se siente segura y vanguardista.

El concepto de "La Bóveda Etérea" se basa en la **Profundidad Tonal** y el **Glassmorfismo** para crear una sensación de espacio físico. Al utilizar escalas tipográficas de alto contraste y asimetría intencional, rompemos el aspecto de "plantilla" rígida. Esto no es solo una tienda automatizada; es una experiencia digital curada donde cada selección de tarjeta de regalo se siente como una adquisición de valor.

---

## 2. Colores
Nuestra paleta está arraigada en una base profunda y nocturna, acentuada por "Oro Líquido" para significar el poder de transacción y la riqueza.

### Tokens Principales
- **Fondo (Background):** `#11131b` (El vacío)
- **Primario (Primary):** `#f7be34` (Oro Líquido / Amarillo USDT)
- **Secundario (Secondary):** `#c3c4e2` (Pervinca Tenue)
- **Superficie Baja (Surface Container Low):** `#191b23`
- **Superficie Alta (Surface Container High):** `#282a32`
- **Superficie Clara (Modals):** `#e9e9e9` (Usado para enfoque de alto contraste)

### Directrices Visuales
*   **La Regla del "Sin Líneas":** Los bordes sólidos de 1px están estrictamente prohibidos para seccionar. Los límites deben definirse únicamente a través de cambios de color de fondo. Una tarjeta `surface-container-low` sobre un fondo `surface` proporciona suficiente distinción sin el "ruido" visual de un trazo.
*   **Jerarquía de Superficies y Anidamiento:** Trate la interfaz de usuario como una serie de capas físicas. Los elementos anidados deben usar niveles de contenedor progresivamente más altos o más bajos para definir la importancia.
*   **La Regla de Cristal y Gradiente:** Para elementos flotantes (barras de navegación, menús desplegables, CTAs fijos), use colores de superficie semitransparentes con un efecto de `backdrop-blur-[12px]`. Los botones principales deben utilizar un gradiente lineal sutil de `primary` a `primary-container` para añadir "alma" y evitar una apariencia plana y barata.

---

## 3. Tipografía
Usamos **Lexend** para encabezados y **Public Sans** para el texto del cuerpo y etiquetas, por su claridad moderna, permitiendo que la asimetría estructural del diseño tome el centro del escenario.

*   **Display (Display-lg, 3.5rem):** Se usa para encabezados hero y balances criptográficos significativos.
*   **Headline (Headline-sm, 1.5rem):** Se usa para títulos de categorías de tarjetas de regalo.
*   **Body (Body-md, 0.875rem):** El motor principal para descripciones de productos y detalles de transacciones.
*   **Label (Label-sm, 0.6875rem):** Estrictamente para microdatos (por ejemplo, "Orden #", "TXID" o marca de tiempo).

**Jerarquía Editorial:** Empareje un `label-sm` en mayúsculas con un `headline-sm` para crear un ritmo editorial sofisticado y de alta gama que transmita autoridad.

---

## 4. Elevación y Profundidad
En "La Bóveda Etérea", la profundidad se logra a través de **Capas Tonales**, no líneas estructurales.

*   **El Principio de Capas:** Apilar niveles de `surface-container` crea un realce natural. Por ejemplo, una barra de búsqueda debe ser `surface-container-highest` sobre un encabezado `surface-container-low`.
*   **Sombras Ambientales:** Para modales flotantes o paneles inferiores (bottom sheets) de "Superficie Clara", use sombras extra-difusas.
    *   *Especificación:* `shadow-[0_20px_50px_rgba(0,0,0,0.3)]`. Evite las sombras paralelas duras y gris oscuro.
*   **El Recurso de "Borde Fantasma" (Ghost Border):** Si la accesibilidad requiere un borde, debe ser un "Borde Fantasma" usando `outline-variant` al 15% de opacidad.
*   **Profundidad del Glassmorfismo:** Las barras de navegación y las hojas de selección deben dejar que los colores de fondo se filtren a través de un desenfoque (`blur`). Esto integra la interfaz de usuario, haciendo que se sienta como un ecosistema único y cohesivo en lugar de componentes separados.

---

## 5. Componentes

### Botones
*   **Primario:** Primario altamente saturado (Oro) con un gradiente vertical sutil del 5%. `rounded-lg` (1rem).
*   **Secundario:** `surface-container-highest` con texto `on-surface`. Sin borde.
*   **Ghost:** Fondo transparente con texto `primary`. Use solo para acciones de baja prioridad como "Cancelar".

### Campos de Entrada y Búsqueda
*   **Estilo:** Fondo `surface-container-high`. Reemplace el borde con una variante de contorno (`outline-variant`) ligeramente más ligera al 10% de opacidad que brille hacia `primary` al enfocarse.
*   **Iconos:** Use iconos de **Lucide React** (tamaño 18px) configurados con el color `on-surface-variant`.

### Contenedores de Tarjetas de Regalo
*   **Prohibir Divisores:** No use líneas para separar tarjetas. Use `spacing-6` (1.5rem) de espacio en blanco vertical.
*   **El Estilo de Tarjeta:** Use `surface-container-low` con un desenfoque de fondo (`backdrop-blur`). Cuando una tarjeta esté "Activa", dele un brillo dorado sutil (sombra ambiental) en lugar de un borde grueso.

### Paneles Inferiores (Bottom Sheets - Superficies Claras)
*   Se usan para el pago final o la configuración del perfil.
*   **Transición:** Estos deben deslizarse hacia arriba como una superficie sólida de alto contraste `e9e9e9` para captar la atención del usuario de "Navegar" a "Actuar".

---

## 6. Qué Hacer y Qué No Hacer

### Qué Hacer
*   **Hacer** usar `text-on-surface-variant` (`#535353`) para información secundaria para mantener una jerarquía limpia.
*   **Hacer** priorizar el padding móvil primero. Use `spacing-4` (1rem) como su margen predeterminado.
*   **Hacer** permitir que el color primario dorado "respire"—solo debe aparecer donde el dinero se está moviendo o las acciones son finales.

### Qué No Hacer
*   **No** usar bordes de alta opacidad y alto contraste al 100%. Rompen la inmersión de la "Bóveda".
*   **No** usar el estándar "Verde Éxito" o "Rojo Error" para todo. Manténgase dentro de la paleta de oro/pervinca/oscura, usando cambios tonales o iconografía para señalar el estado.
*   **No** amontonar elementos. En un sistema premium, el espacio en blanco (o "espacio oscuro") es un lujo. Si tiene dudas, añada `spacing-4`.

---

*Este sistema de diseño es un documento vivo destinado a guiar la evolución de la tienda hacia un hito digital característico.*
