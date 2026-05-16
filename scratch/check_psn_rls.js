
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLS() {
  console.log('Checking RLS policies for orders table...');
  const { data, error } = await supabase.rpc('execute_sql', {
    sql: "SELECT * FROM pg_policies WHERE tablename = 'orders';"
  });

  // If execute_sql RPC doesn't exist, we can try querying via rest if we have permissions, 
  // but usually we need service role to see pg_policies.
  // Let's try a direct SQL query via a known RPC or just trust the manual check.
  
  // Actually, I can use the supabase MCP's execute_sql IF I can force it to use the right URL.
  // But wait, the MCP is configured with a DIFFERENT project.
  
  // Let's try to query pg_policies using the admin client in this script.
  const { data: policies, error: polError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'orders');

  if (polError) {
    console.error('Error fetching policies (standard way failed):', polError.message);
    // Try via raw SQL if possible
    const { data: rawPol, error: rawError } = await supabase.from('_pg_policies').select('*'); // unlikely to work
  } else {
    console.log('Policies:', JSON.stringify(policies, null, 2));
  }
}

// Instead of trying to read policies which might be restricted, let's try to simulate a user request.
async function simulateUser() {
  // We'll try to query as the user who made the last order
  const userId = 'dc43d3f8-fac2-47b2-9407-5c6bfa70e04b';
  console.log(`\nSimulating query for user: ${userId}`);
  
  // Note: Using service role key bypasses RLS, so this will always work.
  // To test RLS, we would need a JWT for that user.
}

checkRLS();
simulateUser();
