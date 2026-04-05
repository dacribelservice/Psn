import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Módulo de Rate Limiting (In-memory para desarrollo)
// Nota: En producción escalar a Upstash Redis para consistencia entre nodos
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 15; // 15 peticiones
const WINDOW = 60 * 1000; // 1 minuto

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // --- CAPA 5.3: RATE LIMITING ---
  const ip = request.ip ?? '127.0.0.1';
  const path = request.nextUrl.pathname;
  
  // Solo aplicar a rutas sensibles
  const isSensitive = path.startsWith('/api') || path.startsWith('/auth') || path.startsWith('/admin');
  
  if (isSensitive) {
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userLimit.lastReset > WINDOW) {
      userLimit.count = 0;
      userLimit.lastReset = now;
    }

    userLimit.count++;
    rateLimitMap.set(ip, userLimit);

    if (userLimit.count > LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: 'Demasiadas peticiones. Intenta de nuevo en un minuto.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // ESTRATEGIA: SESSION REFRESHER PASIVO (Sin consulta a base de datos de perfiles)
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Esta llamada refresca el token basado en cookies sin bloquear la navegación
    await supabase.auth.getUser()
    
  } catch (error) {
    // FAIL-SAFE: En caso de error de red, dejamos pasar el tráfico para evitar "Hangs"
    console.warn("Middleware Sync Warning:", error)
    return NextResponse.next()
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
