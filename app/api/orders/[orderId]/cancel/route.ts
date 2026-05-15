import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';
import { createSupabaseAdminClient } from '@/lib/supabase_admin';

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
  const supabase = createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  try {
    // 1. Verificar sesión del usuario
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verificar que la orden pertenezca al usuario y sea cancelable
    const { data: order, error: fetchError } = await adminClient
      .from('orders')
      .select('user_id, status')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Solo permitir cancelar si no está completada ni ya cancelada
    if (order.status === 'completed' || order.status === 'cancelled') {
      return NextResponse.json({ 
        error: 'Invalid state', 
        details: `No se puede cancelar una orden con estado ${order.status}` 
      }, { status: 400 });
    }

    // 3. Ejecutar la cancelación vía Admin
    const { error: updateError } = await adminClient
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, message: 'Orden cancelada correctamente.' });

  } catch (error: any) {
    console.error('Cancel Order Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
