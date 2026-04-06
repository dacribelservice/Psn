import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';
import { createSupabaseAdminClient } from '@/lib/supabase_admin';
import { ChaingatewayService } from '@/lib/payments/chaingateway';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();
  
  try {
    const body = await request.text();
    if (!body) {
      return NextResponse.json({ success: false, error: 'Cuerpo de petición vacío.' }, { status: 400 });
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Formato JSON inválido.' }, { status: 400 });
    }

    const { orderId, txid } = payload;

    if (!orderId || !txid) {
      return NextResponse.json({ success: false, error: 'Order ID y TxID son obligatorios.' }, { status: 400 });
    }

    // 1. Saneamiento y Normalización de Entrada (Paso 1 Checklist)
    // Limpiar espacios, forzar minúsculas y validar formato Regex 🛡️
    let cleanTxid = txid.trim().toLowerCase();
    
    // Inteligencia de Entrada (Paso 6.4): Autocorrección de prefijo 0x 🗝️
    if (!cleanTxid.startsWith('0x') && cleanTxid.length === 64) {
      console.log('💡 TxID detectado sin prefijo 0x. Corrigiendo automáticamente...');
      cleanTxid = '0x' + cleanTxid;
    }
    
    // El TxID debe comenzar con 0x seguido de 64 caracteres hexadecimales (Total 66)
    const txidRegex = /^0x[a-f0-9]{64}$/;
    
    if (!txidRegex.test(cleanTxid)) {
      return NextResponse.json({ 
        success: false, 
        error: 'El formato del TxID no es válido. Debe ser una cadena hexadecimal de 66 caracteres (incluyendo el 0x).' 
      }, { status: 400 });
    }

    // 4.1 Consulta de Duplicados (Anti-Fraude / Paso 4 Checklist) 🛡️
    // Verificamos si este TxID ya ha sido registrado en alguna orden previa.
    const { data: existingOrder } = await adminClient
      .from('orders')
      .select('id')
      .eq('external_txid', cleanTxid)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json({ 
        success: false, 
        error: 'Este TxID ya ha sido utilizado para validar otra orden. El fraude no está permitido.' 
      }, { status: 400 });
    }

    // 3. Obtener detalles de la orden para validación de montos
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .select('amount, status, user_id, created_at')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Orden no encontrada.' }, { status: 404 });
    }

    if (order.status === 'completed') {
       return NextResponse.json({ success: true, message: 'La orden ya está completada.' });
    }

    // 4. VERIFICACIÓN BLOCKCHAIN (EL MOMENTO DE LA VERDAD) 🛰️🌌🔍
    // Paso 5.2: Implementando Timeout Técnico de 20 segundos (Prevención de procesos zombies) 🚨⏲️
    const verification: any = await Promise.race([
      ChaingatewayService.verifyTransaction(cleanTxid, order.amount),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Tiempo de verificación agotado (Network Timeout). Por favor, intenta de nuevo en unos segundos.')), 20000)
      )
    ]);

    if (!verification.success) {
      return NextResponse.json({ 
        success: false, 
        error: verification.error || 'No pudimos confirmar tu pago. Verifica los detalles.' 
      }, { status: 400 });
    }

    // ⌚ FIREWALL DE TIEMPO (Paso 6.6): Evitar Re-uso de Recibos Antiguos 🛡️🔥
    const orderTime = new Date(order.created_at).getTime();
    const txTime = verification.timestamp;

    // Permitimos un margen de cortesía de 30 mins por desfase de red/billetera
    const marginOfCourtesy = 30 * 60 * 1000; 
    
    if (txTime > 0 && txTime < (orderTime - marginOfCourtesy)) {
       return NextResponse.json({
         success: false,
         error: '⚠️ SEGURIDAD: Este comprobante de pago es antiguo y ya ha sido procesado o pertenece a otra operación anterior. No puedes reutilizar recibos.'
       }, { status: 403 });
    }

    // 5. REGISTRO Y CIERRE DE ORDEN (FASE ATÓMICA / Paso 4.2) 🦾💎🔓
    // Primero, persistimos el TxID usado para que no se pueda reutilizar (Double-Spend Block)
    const { error: updateError } = await adminClient
      .from('orders')
      .update({ external_txid: cleanTxid })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error persistiendo TxID:', updateError);
      return NextResponse.json({ 
        success: false, 
        error: 'No pudimos registrar el TxID en tu orden. Intenta de nuevo.' 
      }, { status: 500 });
    }

    // Llamar al RPC de completado oficial (SERVICE_ROLE asegura bypass total de RLS)
    const { error: rpcError } = await adminClient.rpc('complete_order', {
      p_order_id: orderId
    });

    if (rpcError) {
      console.error('RPC Error:', rpcError);
      // Fallback manual de seguridad si el RPC falla pero el TxID ya está registrado
      await adminClient
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);
    }

    return NextResponse.json({
      success: true,
      message: '¡Pago validado con éxito! Tu orden ha sido liberada.'
    });

  } catch (error: any) {
    // 5.1 Manejador Supremo de Errores (Caja Negra / Paso 5 Checklist) 🛡️🌑
    // Garantizamos que NUNCA se devuelva HTML o texto plano, siempre JSON.
    const errorMessage = error.message || 'Ocurrió un error inesperado en el motor de pagos.';
    
    console.error('CRITICAL PAYMENT ENGINE FAILURE:', {
      timestamp: new Date().toISOString(),
      error: errorMessage,
      stack: error.stack
    });

    return NextResponse.json({ 
      success: false, 
      error: `Error de Verificación: ${errorMessage}`,
      code: 'VERIFICATION_ENGINE_FAULT'
    }, { status: 500 });
  }
}
