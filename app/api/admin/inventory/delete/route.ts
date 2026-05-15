import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';
import { createSupabaseAdminClient } from '@/lib/supabase_admin';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { type, id } = await request.json();

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    if (type === 'code') {
      const { error } = await adminClient.from('inventory_codes').delete().eq('id', id);
      if (error) throw error;
    } else if (type === 'product') {
      // Verificar stock antes de borrar producto (seguridad extra)
      const { data: product } = await adminClient.from('products').select('stock').eq('id', id).single();
      if (product && product.stock > 0) {
        return NextResponse.json({ error: 'Cannot delete product with active stock' }, { status: 400 });
      }
      const { error } = await adminClient.from('products').delete().eq('id', id);
      if (error) throw error;
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Admin Delete Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
