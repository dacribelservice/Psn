import { createClient } from '@supabase/supabase-js';
const supabaseAdmin = createClient('https://ryzjswxucuwwzqhdtjmo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8');

async function run() {
  const userId = 'de08e309-d9ed-4602-8180-f62401ac9ec6'; 
  const productId = '89217260-ae49-43c4-8d3c-bcccf32b35ee';
  
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({ user_id: userId, product_id: productId, amount: 10, payment_method: 'bep20', status: 'pending', quantity: 1, wallet_address: '0xtest_no_reserve' })
    .select().single();
    
  if (orderErr) { console.error(orderErr); return; }
  
  console.log('Order created:', order.id);
  
  console.log('Calling complete_order...');
  const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc('complete_order', { p_order_id: order.id });
  
  console.log('Result:', { rpcData, rpcErr });
  
  const { data: updatedOrder } = await supabaseAdmin.from('orders').select('status').eq('id', order.id).single();
  console.log('Order Status:', updatedOrder?.status);

  const { data: codes } = await supabaseAdmin.from('inventory_codes').select('*').eq('order_id', order.id);
  console.log('Codes assigned:', codes);
}
run();
