const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic env parser
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

const adminClient = createClient(supabaseUrl, serviceRoleKey);

async function checkUserIds() {
  console.log('Checking distinct user IDs in orders table...');
  const { data: orders, error } = await adminClient
    .from('orders')
    .select('user_id')
    .limit(50);

  if (error) {
    console.error('Error fetching user IDs:', error);
    return;
  }

  const userIds = [...new Set(orders.map(o => o.user_id))];
  console.log('Distinct user IDs found in orders:', userIds);

  if (userIds.length > 0) {
    console.log('Fetching profile details for these IDs...');
    const { data: profiles, error: profileError } = await adminClient
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    if (profileError) {
      console.error('Error fetching profiles:', profileError);
    } else {
      console.log('Profiles found:', profiles);
    }
  } else {
    console.log('No orders found in the database.');
  }
}

checkUserIds();
