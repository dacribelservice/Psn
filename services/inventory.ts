import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  image_url?: string;
}

export interface Product {
  id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  type: string;
  stock?: number;
}

export const inventoryService = {
  // Get all active categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as Category[];
  },

  // Get active products for the storefront
  async getStorefrontProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch stock separately if needed or via a view
    const { data: stockData } = await supabase
      .from('product_stock_view')
      .select('*');

    const productsWithStock = data.map(p => ({
      ...p,
      stock: stockData?.find(s => s.product_id === p.id)?.stock_available || 0
    }));

    return productsWithStock as Product[];
  },

  // Admin: Get all inventory including stock details
  async getAdminInventory() {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug, image_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const { data: stockData } = await supabase
      .from('product_stock_view')
      .select('*');

    return data.map(p => ({
      ...p,
      stock: stockData?.find(s => s.product_id === p.id)?.stock_available || 0
    }));
  },

  // Admin: Add new codes to inventory
  async addInventoryCodes(productId: string, codes: string[]) {
    const inserts = codes.map(code => ({
      product_id: productId,
      code,
      status: 'available'
    }));

    const { data, error } = await supabase
      .from('inventory_codes')
      .insert(inserts);

    if (error) throw error;
    return data;
  },

  async getBanners() {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};
