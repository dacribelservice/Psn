import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza contenido HTML permitiendo etiquetas seguras para formato básico.
 * Útil para descripciones de productos que puedan requerir negritas o saltos de línea.
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'span'],
    ALLOWED_ATTR: ['class'], // Permitimos class por si usamos utilidades de estilo seguras
  });
};

/**
 * Limpia completamente cualquier rastro de HTML, dejando solo el texto plano.
 * Ideal para nombres, títulos y campos que no deben contener formato.
 */
export const sanitizePlainText = (text: string): string => {
  if (!text) return '';
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

/**
 * Sanitiza URLs para prevenir ataques de redirección o ejecución de scripts (javascript:).
 */
export const sanitizeURL = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  // Bloquear esquemas peligrosos
  if (trimmed.toLowerCase().startsWith('javascript:') || 
      trimmed.toLowerCase().startsWith('data:') ||
      trimmed.toLowerCase().startsWith('vbscript:')) {
    return '';
  }
  return trimmed;
};
