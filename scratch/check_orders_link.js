
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsersOrders() {
  console.log('--- Checking Orders and User IDs ---');
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, user_id, status, amount, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching orders:', error);
    return;
  }

  console.log('Recent Orders:');
  orders.forEach(o => {
    console.log(`Order: ${o.id}, User: ${o.user_id}, Status: ${o.status}`);
  });

  console.log('\n--- Checking current users in profiles ---');
  const { data: profiles } = await supabase.from('profiles').select('id, email').limit(10);
  console.log('Profiles:');
  profiles.forEach(p => {
    console.log(`Profile ID: ${p.id}, Email: ${p.email}`);
  });
}

checkUsersOrders();
