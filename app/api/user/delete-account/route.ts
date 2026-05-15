import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';
import { createSupabaseAdminClient } from '@/lib/supabase_admin';

export async function POST() {
  const supabase = createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Eliminar el perfil de la base de datos pública
    const { error: profileError } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) throw profileError;

    // 2. Opcional: Eliminar el usuario de Auth (esto requiere permisos de admin)
    // Nota: supabase.auth.admin.deleteUser(user.id)
    // Pero por ahora solo borramos el perfil y dejamos que el signOut maneje la sesión local.

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete Account Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
