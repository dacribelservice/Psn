import { z } from 'zod';

export const bannerSchema = z.object({
  title_es: z.string().min(3, "El título en español debe tener al menos 3 caracteres").max(100),
  title_en: z.string().min(3, "The English title must have at least 3 characters").max(100),
  subtitle_es: z.string().max(200).optional().nullable(),
  subtitle_en: z.string().max(200).optional().nullable(),
  image_url: z.string().url("URL de imagen inválida"),
  redirect_url: z.string().optional().nullable(),
  display_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof bannerSchema>;
