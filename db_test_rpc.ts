import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function testCompleteOrder() {
  console.log("Creando una orden de prueba...");
  
  // Create a user or use an existing one
  const userId = 'de08e309-d9ed-4602-8180-f62401ac9ec6'; // The user from before
  const productId = '89217260-ae49-43c4-8d3c-bcccf32b35ee';
  
  // Insert order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: userId,
      product_id: productId,
      amount: 10,
      payment_method: 'bep20',
      status: 'pending',
      quantity: 1,
      wallet_address: '0xtest'
    })
    .select()
    .single();
    
  if (orderErr) {
    console.error("Error creating order:", orderErr);
    return;
  }
  
  console.log("Orden creada:", order.id);
  
  // Reservar un código
  console.log("Buscando un código disponible...");
  const { data: code, error: codeErr } = await supabaseAdmin
    .from('inventory_codes')
    .select('*')
    .eq('status', 'available')
    .eq('product_id', productId)
    .limit(1)
    .single();
    
  if (codeErr || !code) {
    console.error("No hay códigos disponibles o error:", codeErr);
    return;
  }
  
  console.log("Código encontrado:", code.id);
  
  // Update code to reserved
  await supabaseAdmin
    .from('inventory_codes')
    .update({ 
      status: 'reserved', 
      order_id: order.id,
      reserved_until: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    })
    .eq('id', code.id);
    
  // Llamar a complete_order
  console.log("Llamando a complete_order...");
  const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc('complete_order', {
    p_order_id: order.id
  });
  
  console.log("Resultado RPC:", { rpcData, rpcErr });
  
  // Limpieza
  console.log("Limpiando...");
  await supabaseAdmin.from('inventory_codes').update({ status: 'available', order_id: null, reserved_until: null }).eq('id', code.id);
  await supabaseAdmin.from('orders').delete().eq('id', order.id);
  
}

testCompleteOrder();
