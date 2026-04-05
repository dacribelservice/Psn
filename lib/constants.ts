/**
 * Centralized Configuration for Dacribel ERP
 * Part of Step 2.3: Cleaning up Hardcoded values
 */

export const APP_CONFIG = {
  FINANCE: {
    DEFAULT_BUY_RATE: 4000,    // Valor por defecto para carga (Admin)
    DEFAULT_SALE_RATE: 3650,   // Valor usado para estimar ventas diarias
    CURRENCY_CODE: 'COP',
    CURRENCY_SYMBOL: '$'
  },
  STOCK: {
    CRITICAL_THRESHOLD: 5,     // Umbral para alertas de stock bajo
    DEFAULT_PAGE_SIZE: 20      // Elementos por página en el administrador
  },
  STORAGE: {
    BUCKET_URL: 'https://ryzjswxucuwwzqhdtjmo.supabase.co/storage/v1/object/public/'
  }
};
