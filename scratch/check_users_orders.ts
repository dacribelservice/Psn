import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminClient = createClient(supabaseUrl, serviceRoleKey);

async function checkUserIds() {
  console.log('Checking distinct user IDs in orders table...');
  const { data: orders, error } = await adminClient
    .from('orders')
    .select('user_id')
    .limit(10);

  if (error) {
    console.error('Error fetching user IDs:', error);
    return;
  }

  const userIds = [...new Set(orders.map(o => o.user_id))];
  console.log('Distinct user IDs found in orders:', userIds);

  if (userIds.length > 0) {
    console.log('Fetching user details for these IDs...');
    // Note: We need admin access to auth.users which might require a different approach or just checking profiles
    const { data: profiles, error: profileError } = await adminClient
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    if (profileError) {
      console.error('Error fetching profiles:', profileError);
    } else {
      console.log('Profiles found:', profiles);
    }
  }
}

checkUserIds();
