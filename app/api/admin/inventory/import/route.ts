import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase_server';
import { createSupabaseAdminClient } from '@/lib/supabase_admin';
import { sanitizeHTML } from '@/lib/sanitizer';

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const adminClient = createSupabaseAdminClient();

  try {
    // 1. Verificar sesión y rol de administrador
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar si es admin (asumiendo que hay una tabla profiles o metadata)
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      categoryId, 
      value, 
      costPrice, 
      salePrice, 
      description, 
      codes, 
      region, 
      exchangeRate, 
      lowStockAlert 
    } = body;

    if (!categoryId || !value || !codes || !Array.isArray(codes)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Obtener información de la categoría para el nombre del producto
    const { data: category } = await adminClient
      .from('categories')
      .select('name')
      .eq('id', categoryId)
      .single();

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const productName = `${category.name} $${value}`;
    const sanitizedDescription = sanitizeHTML(description) || `Tarjeta digital original para ${category.name} ${region}. Entrega inmediata y segura.`;

    // 3. Buscar o Crear Producto vía Admin
    let { data: product } = await adminClient
      .from('products')
      .select('id')
      .eq('name', productName)
      .eq('category_id', categoryId)
      .eq('region', region)
      .maybeSingle();

    if (!product) {
      const { data: newProd, error: insertError } = await adminClient
        .from('products')
        .insert([{ 
          name: productName, 
          price: value,
          face_value: value,
          cost_price: costPrice,
          sale_price: salePrice,
          category_id: categoryId,
          region: region,
          description: sanitizedDescription,
          stock_alert_threshold: lowStockAlert
        }])
        .select()
        .single();
      
      if (insertError) throw insertError;
      product = newProd;
    } else {
      // Actualizar producto existente
      const { error: updateError } = await adminClient
        .from('products')
        .update({ 
          face_value: value,
          cost_price: costPrice,
          sale_price: salePrice,
          description: sanitizedDescription, 
          stock_alert_threshold: lowStockAlert 
        })
        .eq('id', product.id);
      
      if (updateError) throw updateError;
    }

    // 4. Insertar Códigos vía Admin
    const codesToInsert = codes.map((code: string) => ({
      product_id: product?.id,
      code: code.trim(),
      status: 'available',
      face_value: value,
      usd_rate: exchangeRate,
      region: region
    }));

    const { error: codeError } = await adminClient
      .from('inventory_codes')
      .insert(codesToInsert);

    if (codeError) throw codeError;

    return NextResponse.json({ 
      success: true, 
      message: `${codes.length} códigos cargados correctamente para ${productName}.` 
    });

  } catch (error: any) {
    console.error('Admin Inventory Import Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
