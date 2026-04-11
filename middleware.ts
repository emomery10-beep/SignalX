import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const appRoutes = ['/chat', '/files', '/dashboards', '/alerts', '/forecasts', '/templates', '/admin', '/sources', '/billing', '/onboarding']
  const isAppRoute = appRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  if (isAppRoute && !user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  const authRoutes = ['/signin', '/signup']
  const isAuthRoute = authRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/geo).*)'],
}
