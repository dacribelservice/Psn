import { z } from 'zod';

export const bannerSchema = z.object({
  title_es: z.string().max(100).optional().nullable(),
  title_en: z.string().max(100).optional().nullable(),
  subtitle_es: z.string().max(200).optional().nullable(),
  subtitle_en: z.string().max(200).optional().nullable(),
  type: z.enum(['home', 'tutorial']).default('home'),
  image_url: z.string().url("URL de imagen inválida"),
  redirect_url: z.string().optional().nullable(),
  video_url: z.string().url().optional().nullable(),
  display_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof bannerSchema>;
