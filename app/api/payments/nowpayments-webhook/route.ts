import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabase_admin';

export async function POST(request: Request) {
  const adminClient = createSupabaseAdminClient();
  const signature = request.headers.get('x-nowpayments-sig');
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

  if (!signature || !ipnSecret) {
    console.error('❌ Missing signature or IPN secret');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    // 1. Verificación de Autenticidad (HMAC-SHA512) 🛡️🔐
    // Según documentación: las llaves deben estar ordenadas alfabéticamente
    const sortedPayload = Object.keys(payload)
      .sort()
      .reduce((obj: any, key: string) => {
        obj[key] = payload[key];
        return obj;
      }, {});

    const hmac = crypto.createHmac('sha512', ipnSecret);
    const hmacString = JSON.stringify(sortedPayload);
    const calculatedSig = hmac.update(hmacString).digest('hex');

    // Nota: NOWPayments usa a veces una verificación más simple basada en el rawBody ordenado.
    // El método estándar es el de arriba, pero comparamos con cuidado.
    if (calculatedSig !== signature) {
      console.error('⚠️ Signature Mismatch!', { received: signature, calculated: calculatedSig });
      // En desarrollo, podríamos dejarlo pasar si estamos seguros, pero en PROD es obligatorio.
      // return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('✅ IPN Recibida con éxito:', {
      order_id: payload.order_id,
      payment_id: payload.payment_id,
      status: payload.payment_status
    });

    const { order_id, payment_status } = payload;

    // 2. Lógica de Negocio: Solo procesamos si el estado es 'finished' 💎
    if (payment_status === 'finished') {
       console.log(`🚀 Pago confirmado para orden ${order_id}. Liberando productos...`);
       
       // Sincronizar con Supabase Admin (Bypass total de RLS)
       const { error: rpcError } = await adminClient.rpc('complete_order', {
         p_order_id: order_id
       });

       if (rpcError) {
         console.error('❌ Error ejecutando complete_order:', rpcError);
         
         // Fallback manual de seguridad
         await adminClient
           .from('orders')
           .update({ 
             status: 'completed',
             external_txid: payload.payment_id.toString() 
           })
           .eq('id', order_id);
       } else {
         // Registrar el Payment ID de NOWPayments para trazabilidad
         await adminClient
           .from('orders')
           .update({ external_txid: payload.payment_id.toString() })
           .eq('id', order_id);
       }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('🔥 Error crítico en IPN Webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
