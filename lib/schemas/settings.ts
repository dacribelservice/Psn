import { z } from 'zod';

/**
 * Esquema para validar los términos y condiciones bilingües guardados en la tabla 'settings'.
 */
export const termsSchema = z.object({
  content: z.string().min(5, "El contenido en español debe tener al menos 5 caracteres").max(100000),
  content_en: z.string().min(5, "The English content must have at least 5 characters").max(100000),
});

export type TermsInput = z.infer<typeof termsSchema>;
