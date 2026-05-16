const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOrders() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching orders:', error);
    return;
  }

  console.log('--- LAST 10 ORDERS ---');
  orders.forEach(o => {
    console.log(`ID: ${o.id} | User: ${o.user_id} | Status: ${o.status} | Amount: ${o.amount} | Created: ${o.created_at}`);
  });

  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) {
     console.error('Error listing users:', userError);
  } else {
     console.log('\n--- REGISTERED USERS ---');
     users.users.forEach(u => {
        console.log(`UID: ${u.id} | Email: ${u.email}`);
     });
  }
}

checkOrders();
