import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase_admin';

interface OrderResponse {
  pay_address: string;
  pay_amount: number;
  payment_id: string;
  order_id: string;
  pay_currency: string;
}

export async function POST(request: Request) {
  const adminClient = createSupabaseAdminClient();
  
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Falta orderId' }, { status: 400 });
    }

    // 1. Obtener detalles de la orden 🔎
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // 2. Llamada a NOWPayments para generar Factura Dinámica 🚀🛰️
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      throw new Error('Falta NOWPAYMENTS_API_KEY en el servidor');
    }

    // NOTA: Para producción, ipn_callback_url debe ser tu dominio real.
    // Usaremos una construcción dinámica si es posible, o dejaremos que el usuario la defina.
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    const nowResponse = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price_amount: order.amount,
        price_currency: 'usd', // Moneda de la tienda
        pay_currency: 'usdtbsc', // USDT en red BEP20 (Binance Smart Chain)
        order_id: order.id,
        order_description: `Compra Dacribel - Orden #${order.id.slice(0, 8)}`,
        ipn_callback_url: `${baseUrl}/api/payments/nowpayments-webhook`,
        success_url: `${baseUrl}/payment/processing?id=${order.id}`,
        cancel_url: `${baseUrl}/payment/processing?id=${order.id}`
      })
    });

    const responseData = await nowResponse.json();

    if (!nowResponse.ok) {
      console.error('❌ Error NOWPayments API:', responseData);
      throw new Error(responseData.message || 'Error al generar pago en NOWPayments');
    }

    const { pay_address, pay_amount, payment_id } = responseData as OrderResponse;

    // 3. Actualizar la orden con la Billetera Única Temporal 💎🛡️
    // Guardamos la billetera y el monto exacto dictado por la pasarela
    // Esto garantiza que el cliente pague exactamente lo necesario
    const { error: updateError } = await adminClient
      .from('orders')
      .update({
        wallet_address: pay_address, // Sobrescribimos la billetera maestra con la temporal única
        status: 'pending',
        external_txid: payment_id.toString() // Guardamos el ID de pago para rastreo
      })
      .eq('id', orderId);

    if (updateError) {
      throw new Error('Error al actualizar billetera en la orden');
    }

    return NextResponse.json({
      success: true,
      payAddress: pay_address,
      payAmount: pay_amount,
      paymentId: payment_id
    });

  } catch (error: any) {
    console.error('🔥 Error en create-nowpayments:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
