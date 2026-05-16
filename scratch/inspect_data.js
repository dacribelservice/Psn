
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectData() {
  console.log('--- Inspecting Products ---');
  const { data: products } = await supabase.from('products').select('*').limit(3);
  console.log(JSON.stringify(products, null, 2));

  console.log('\n--- Inspecting Orders (Last 3) ---');
  const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(3);
  console.log(JSON.stringify(orders, null, 2));

  console.log('\n--- Inspecting Inventory (Status counts) ---');
  const { data: inventory } = await supabase.from('inventory_codes').select('status');
  const counts = inventory.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify(counts, null, 2));
}

inspectData();
