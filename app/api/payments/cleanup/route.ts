import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';

/**
 * Cleanup Task for Expired Payments
 * This route should be called periodically (cron job) to handle expired payment sessions.
 * Phase 3.3.
 */
export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const now = new Date().toISOString();

  try {
    console.log('--- Iniciando limpieza de pagos expirados ---');

    // 1. Buscamos los pagos en espera que ya pasaron su fecha de expiración
    const { data: expiredPayments, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('id, order_id')
      .eq('status', 'waiting')
      .lt('expires_at', now);

    if (fetchError) {
      throw new Error(`Error fetching expired payments: ${fetchError.message}`);
    }

    if (!expiredPayments || expiredPayments.length === 0) {
      return NextResponse.json({ success: true, message: 'No expired payments found.' });
    }

    const orderIds = expiredPayments.map(p => p.order_id);
    const paymentIds = expiredPayments.map(p => p.id);

    // 2. Marcamos los pagos como 'expired'
    const { error: paymentUpdateError } = await supabase
      .from('payment_transactions')
      .update({ status: 'expired' })
      .in('id', paymentIds);

    if (paymentUpdateError) {
      throw new Error(`Error updating payments: ${paymentUpdateError.message}`);
    }

    // 3. Marcamos las órdenes asociadas como 'cancelled'
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .in('id', orderIds);

    if (orderUpdateError) {
      throw new Error(`Error updating orders: ${orderUpdateError.message}`);
    }

    // 🛡️ FALLBACK: Limpiar órdenes 'pending' o 'payment_pending' que tengan más de 12 minutos
    // Esto es por seguridad en caso de que fallen los registros de transacciones
    const twelveMinutesAgo = new Date(Date.now() - 12 * 60 * 1000).toISOString();
    
    const { error: fallbackError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .in('status', ['pending', 'payment_pending'])
      .lt('created_at', twelveMinutesAgo);

    if (fallbackError) {
      console.warn('⚠️ Fallback cleanup warning:', fallbackError.message);
    }

    console.log(`✅ Se han expirado ${expiredPayments.length} pagos y órdenes.`);

    return NextResponse.json({
      success: true,
      count: expiredPayments.length,
      message: `${expiredPayments.length} payments and orders expired successfully.`
    });

  } catch (error: any) {
    console.error('❌ Error en el proceso de limpieza:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
