
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('Checking auth users in PSN project...');
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('Error fetching users:', error);
  } else {
    console.log('Total users:', users.length);
    const lastUser = users[users.length - 1];
    console.log('Latest user:', {
      id: lastUser.id,
      email: lastUser.email,
      created_at: lastUser.created_at
    });
  }
}

checkUsers();
