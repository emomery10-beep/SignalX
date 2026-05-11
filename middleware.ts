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

  // ── Language detection ─────────────────────────────────────────────────────
  // Only set if user hasn't already chosen a language manually
  const LANG_MAP: Record<string,string> = {
    GB:'en',US:'en',AU:'en',NZ:'en',IE:'en',CA:'en',ZA:'en',NG:'en',GH:'en',UG:'en',
    FR:'fr',BE:'fr',SN:'fr',CI:'fr',CM:'fr',TN:'fr',MA:'fr',LU:'fr',
    DE:'de',AT:'de',
    ES:'es',MX:'es',AR:'es',CO:'es',CL:'es',PE:'es',
    SA:'ar',AE:'ar',EG:'ar',KW:'ar',QA:'ar',JO:'ar',
    KE:'sw',TZ:'sw',
    PT:'pt',BR:'pt',AO:'pt',MZ:'pt',
    NL:'nl',IT:'it',PL:'pl',
  }
  const existingLang = request.cookies.get('askbiz_lang')?.value
  if (!existingLang) {
    const country = request.headers.get('x-vercel-ip-country') || ''
    const detectedLang = LANG_MAP[country.toUpperCase()] || 'en'
    response.cookies.set('askbiz_lang', detectedLang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    })
  }

  // ── Protected routes ───────────────────────────────────────────────────────
  const protectedRoutes = [
    '/home', '/ask', '/chat', '/intelligence', '/files',
    '/dashboards', '/alerts', '/forecasts', '/templates',
    '/admin', '/sources', '/billing', '/onboarding',
    '/settings', '/expansion', '/invite',
  ]

  const isProtected = protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // ── Redirect signed-in users away from auth pages ─────────────────────────
  const authRoutes = ['/signin', '/signup']
  const isAuthRoute = authRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
