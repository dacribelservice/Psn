
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testOrderQuery() {
  const userId = 'de08e309-d9ed-4602-8180-f62401ac9ec6'; // User we know has orders
  console.log(`--- Testing Query for User: ${userId} ---`);
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      amount,
      payment_method,
      created_at,
      status,
      quantity,
      products(name, image_url, region),
      inventory_codes!order_id(id, code)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Query Error:', error);
  } else {
    console.log('Orders found:', orders.length);
    if (orders.length > 0) {
      console.log('Sample Order:', JSON.stringify(orders[0], null, 2));
    }
  }
}

testOrderQuery();
