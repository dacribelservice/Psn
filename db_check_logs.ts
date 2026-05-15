import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryzjswxucuwwzqhdtjmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5empzd3h1Y3V3d3pxaGR0am1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU4NzY3MCwiZXhwIjoyMDkwMTYzNjcwfQ.7otsFaQAwJNnM6MilyhgfbKHvhJJ7rxZ1IFWDu203m8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLogs() {
  const { data: logs, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('action', 'UPDATE en orders')
    .limit(10)
    .order('created_at', { ascending: false });
    
  if (logs) {
    console.log("Recent order updates:");
    logs.forEach(l => {
      console.log(`[${l.created_at}] Order: ${l.metadata?.new_data?.id} | Old: ${l.metadata?.old_data?.status} -> New: ${l.metadata?.new_data?.status} | By: ${l.email || 'System'}`);
    });
  }
}

debugLogs();
