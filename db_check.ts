import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDB() {
  console.log("Checking RPC...");
  
  // Try to call complete_order to see if it exists
  const { data, error } = await supabase.rpc('complete_order', { p_order_id: '00000000-0000-0000-0000-000000000000' });
  console.log("RPC Error:", error);

  // Get tables
  console.log("Checking tables...");
  const { data: tables, error: tableError } = await supabase.from('inventory_codes').select('id').limit(1);
  console.log("inventory_codes error:", tableError);
}

checkDB();
