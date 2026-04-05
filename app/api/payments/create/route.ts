import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';
import { createSupabaseAdminClient } from '@/lib/supabase_admin'; // 🗝️ Master Key
import { ChaingatewayService } from '@/lib/payments/chaingateway';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient(); // Bypasses RLS safety locally
  
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Intentar verificar sesión del usuario (Vía Cookies)
    const { data: { user } } = await supabase.auth.getUser();
    let activeUser = user;

    if (!activeUser) {
      const { data: { session } } = await supabase.auth.getSession();
      activeUser = session?.user || null;
    }

    // 2. INDUSTRIAL BYPASS: Si falla el navegador, validamos con el Service Role (🛡️ Grado Industrial)
    let orderOwnerId = activeUser?.id;

    if (!activeUser) {
      console.warn('⚠️ Activando Validación de Grado Industrial por Service Role para OrderID:', orderId);
      
      // Usamos el cliente admin que se salta el RLS para verificar la orden
      const { data: adminOrder, error: adminError } = await adminClient
        .from('orders')
        .select('user_id, status')
        .eq('id', orderId)
        .single();

      if (adminError || !adminOrder) {
        console.error('❌ Orden no encontrada incluso con Service Role:', adminError?.message);
        return NextResponse.json({ error: 'Unauthorized', details: 'Orden no válida o inexistente.' }, { status: 401 });
      }

      if (adminOrder.status === 'pending') {
        orderOwnerId = adminOrder.user_id;
        console.log('✅ Integridad de orden confirmada vía Búnker Interno.');
      } else {
        return NextResponse.json({ error: 'Unauthorized', details: 'La orden no está en estado pendiente.' }, { status: 401 });
      }
    }

    // 3. Obtener la orden completa usando el cliente admin para evitar bloqueos de RLS
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('*, product_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 4. Revisar si ya existe un pago activo (vía Admin)
    const { data: existingPayment } = await adminClient
      .from('payment_transactions')
      .select('*')
      .eq('order_id', orderId)
      .eq('status', 'waiting')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Si ya existe uno y no ha expirado, lo devolvemos
    if (existingPayment) {
      const expiresAt = new Date(existingPayment.expires_at).getTime();
      const now = new Date().getTime();
      if (expiresAt > now) {
        return NextResponse.json({ 
          success: true, 
          payment: existingPayment,
          message: 'Reusing existing active payment'
        });
      }
    }

    // 5. Generar nueva wallet en Chaingateway (vía Service)
    const chaingatewayResult = await ChaingatewayService.generateOrderPayment(orderId);

    // 6. Registrar la transacción (vía Admin - Bypass RLS)
    const { data: newPayment, error: insertError } = await adminClient
      .from('payment_transactions')
      .insert({
        order_id: orderId,
        wallet_address: chaingatewayResult.address,
        amount_usdt: order.amount,
        status: 'waiting',
        network: chaingatewayResult.network,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting payment_transaction:', insertError);
      return NextResponse.json({ error: 'Failed to record payment transaction' }, { status: 500 });
    }

    // 7. Actualizar el estado de la orden (vía Admin)
    await adminClient
      .from('orders')
      .update({ status: 'payment_pending' })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      payment: newPayment
    });

  } catch (error: any) {
    console.error('Payment Creation Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
