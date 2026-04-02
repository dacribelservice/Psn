import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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

  const { data: { user } } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register') ||
                     request.nextUrl.pathname.startsWith('/reset-password')

  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  // Lógica de "Correos Maestros" para el Firewall
  const masterEmails = ["cangel@gmail.com", "cangelgames@gmail.com", "cangel@dacribel.com", "dacribel.service@gmail.com"]
  const isAdmin = user?.email && masterEmails.includes(user.email.toLowerCase().trim())

  // Redirigir a login si intenta ir a admin sin sesión
  if (isAdminPage && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirigir fuera de admin si no tiene el rol de administrador
  if (isAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Si ya tiene sesión, no dejarlo entrar a login/register
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL(isAdmin ? '/admin' : '/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
