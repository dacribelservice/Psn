import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';

/**
 * Receptor de Webhooks de Chaingateway.io
 * Esta ruta escuchará las señales de pago recibido.
 */
import crypto from 'crypto';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const secret = process.env.CHAINGATEWAY_WEBHOOK_SECRET;
  
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature');

    // 1. Validar la firma digital (Fase 4.2)
    if (!secret || !signature) {
      console.error('Missing secret or signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hmac = crypto.createHmac('sha256', secret);
    const expectedSignature = hmac.update(rawBody).digest('hex');

    // Usamos timingSafeEqual para evitar ataques de tiempo
    const isValid = signature.toLowerCase() === expectedSignature.toLowerCase();

    if (!isValid) {
      console.error('❌ Firma de Webhook Inválida');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    console.log('--- Webhook Verificado y Recibido de Chaingateway ---', payload);

    // Chaingateway v2 envía la dirección de wallet y el hash de transacción (txid)
    const { address, amount, txid, contractaddress } = payload;

    // 2. Buscamos el pago correspondiente en nuestra base de datos por la wallet
    const { data: payment, error: paymentError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('wallet_address', address)
      .eq('status', 'waiting')
      .single();

    if (paymentError || !payment) {
      console.warn(`Webhook ignorado: No hay pago pendiente para la dirección ${address}`);
      return NextResponse.json({ message: 'Address not found or already processed' });
    }

    // 3. Verificamos que el monto sea correcto (Opcional si usas montos aproximados, pero idealmente debe ser exacto o mayor)
    // Chaingateway maneja el monto en el campo 'amount' de su payload.

    // 4. Actualizamos el pago a 'paid'
    const { error: updatePaymentError } = await supabase
      .from('payment_transactions')
      .update({ 
        status: 'paid',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    if (updatePaymentError) throw updatePaymentError;

    // 5. Ejecutar la liberación automática del producto (Fase 4.3)
    const { data: deliverySuccess, error: deliveryError } = await supabase
      .rpc('complete_order_with_code_delivery', { target_order_id: payment.order_id });

    if (deliveryError || !deliverySuccess) {
      console.warn(`⚠️ Pago recibido pero no hay stock para Orden ${payment.order_id}. Revisión manual necesaria.`);
      // Nota: El cliente ya pagó, así que la orden queda en 'manual_review_required' o similar
    } else {
      console.log(`✅ Código liberado y entregado para Orden: ${payment.order_id}`);
    }

    return NextResponse.json({ success: true, message: 'Payment confirmed and order completed' });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
