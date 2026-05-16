
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error(error);
    return;
  }
  
  console.log('User IDs in auth.users:');
  users.forEach(u => console.log(`- ${u.id} (${u.email})`));
  
  const targetId = 'dc43d3f8-fac2-47b2-9407-5c6bfa70e04b';
  const found = users.find(u => u.id === targetId);
  console.log(`\nTarget user ${targetId} found? ${!!found}`);
}

checkUsers();
