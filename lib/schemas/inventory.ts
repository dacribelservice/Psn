import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  description: z.string().max(500).optional().nullable(),
  category_id: z.string().uuid("ID de categoría inválido"),
  price: z.number().positive("El precio base debe ser mayor a 0"),
  cost_price: z.number().nonnegative("El precio de costo no puede ser negativo"),
  face_value: z.number().positive("El valor facial debe ser positivo"),
  sale_price: z.number().positive("El precio de venta debe ser positivo"),
  type: z.enum(['gift_card', 'direct_recharge']),
  image_url: z.string().url("URL de imagen inválida").optional().nullable(),
  is_active: z.boolean().default(true),
});

export const inventoryCodeSchema = z.object({
  product_id: z.string().uuid("ID de producto inválido"),
  codes: z.array(z.string().min(5, "El código debe tener al menos 5 caracteres"))
    .min(1, "Debes agregar al menos un código"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type InventoryCodeInput = z.infer<typeof inventoryCodeSchema>;
