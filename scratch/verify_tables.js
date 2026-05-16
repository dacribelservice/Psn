
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
  const tables = [
    'profiles',
    'products',
    'inventory_codes',
    'orders',
    'payment_transactions',
    'categories',
    'banners',
    'regions',
    'settings',
    'audit_logs'
  ];

  console.log('--- Verifying Public Tables ---');
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`Table [${table}]: Error - ${error.message}`);
    } else {
      console.log(`Table [${table}]: Found - ${count} rows`);
    }
  }

  // Try to check psn.games (different schema might require a different approach in PostgREST if not exposed)
  console.log('\n--- Verifying psn.games (Custom Schema) ---');
  const { count: psnCount, error: psnError } = await supabase
    .from('games') // PostgREST usually maps schemas to different endpoints or requires search_path
    .select('*', { count: 'exact', head: true });
    
  if (psnError) {
    console.log(`Table [psn.games]: Error (default path) - ${psnError.message}`);
  } else {
    console.log(`Table [psn.games]: Found (default path) - ${psnCount} rows`);
  }
}

verifyTables();
