import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin Client (SERVICE_ROLE)
 * ONLY FOR SERVER-SIDE USE. NEVER EXPOSE TO CLIENT.
 * This client bypasses Row Level Security (RLS).
 */
export function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
