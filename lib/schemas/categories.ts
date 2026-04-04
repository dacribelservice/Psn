import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string()
    .min(3, "El nombre de categoría debe tener al menos 3 caracteres")
    .max(50, "El nombre es demasiado largo"),
  slug: z.string()
    .min(3, "El slug debe tener al menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones")
    .max(50),
  display_order: z.number().int().nonnegative().default(0),
  image_url: z.string().url("URL de imagen de categoría inválida").optional().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
