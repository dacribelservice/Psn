import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';
import { createSupabaseAdminClient } from '@/lib/supabase_admin';
import { decrypt } from '@/lib/crypto';

export async function GET() {
  const supabase = createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  try {
    // 1. Obtener la sesión del usuario
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Consultar órdenes e inventario usando el cliente admin (Bypass RLS)
    // Esto es necesario porque el usuario no tiene permiso de lectura directa sobre inventory_codes por seguridad.
    const { data: orders, error } = await adminClient
      .from('orders')
      .select(`
        id,
        amount,
        payment_method,
        created_at,
        status,
        quantity,
        products(name, image_url, region),
        inventory_codes!order_id(id, code)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders via adminClient:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    // 3. Descifrar los códigos en el servidor antes de enviarlos al cliente
    // Esto garantiza que la llave de cifrado nunca salga del entorno del servidor.
    const formattedOrders = orders.map((o: any) => ({
      ...o,
      // Mapeamos los códigos descifrados
      decryptedCodes: o.inventory_codes?.map((c: any) => decrypt(c.code)) || []
    }));

    return NextResponse.json(formattedOrders);
  } catch (error: any) {
    console.error('API User Orders Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
