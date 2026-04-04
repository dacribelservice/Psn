import { z } from 'zod';

export const bannerSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(100),
  subtitle: z.string().max(200).optional().nullable(),
  image_url: z.string().url("URL de imagen inválida"),
  link_url: z.string().optional().nullable(),
  display_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof bannerSchema>;
