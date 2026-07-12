import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { COUNTRY_TO_LANG } from '@/lib/i18n'
import { ACTIVE_LOCALES, DEFAULT_LOCALE, resolveLocale } from '@/lib/i18n-locale'

// Non-default locales carry a URL prefix (/es, /fr, …); English stays unprefixed
// so existing indexed URLs and inbound links are untouched.
const PREFIXED_LOCALES = ACTIVE_LOCALES.filter(l => l !== DEFAULT_LOCALE)

// Inactive locale codes that once had URL prefixes — redirect to strip them.
// Prevents 404s for users with /sw/..., /pt/..., etc. in their browser history.
const INACTIVE_LOCALE_PREFIXES = ['pt', 'it', 'pl']

export async function middleware(request: NextRequest) {
  // ── Locale prefix → content locale (URL is the source of truth) ─────────────
  // /es/blog/x is rewritten to /blog/x internally with x-locale=es injected, so
  // the flat route tree renders translated content without being physically moved.
  const segments = request.nextUrl.pathname.split('/')
  const maybePrefix = segments[1]

  // Inactive locale prefixes (sw, pt, …): strip and redirect to avoid 404s.
  if (INACTIVE_LOCALE_PREFIXES.includes(maybePrefix)) {
    const rest = '/' + segments.slice(2).join('/')
    const cleanPath = rest === '/' ? '/' : rest.replace(/\/$/, '') || '/'
    const target = new URL(cleanPath, request.url)
    target.search = request.nextUrl.search
    return NextResponse.redirect(target, { status: 301 })
  }

  const hasLocalePrefix = (PREFIXED_LOCALES as string[]).includes(maybePrefix)
  const logicalPath = hasLocalePrefix ? '/' + segments.slice(2).join('/') : request.nextUrl.pathname

  // Locale source: a URL prefix wins (public, SEO-driven). Otherwise all routes
  // (both public and authenticated) follow the user's cookie/geo — matching the
  // landing page's behaviour. Public visitors arriving without a prefix get content
  // in their detected language; the /es, /fr, … prefixed URLs remain canonical for SEO.
  const locale = hasLocalePrefix
    ? maybePrefix
    : resolveLocale({
        cookie: request.cookies.get('askbiz_lang')?.value,
        country: request.headers.get('x-vercel-ip-country'),
      })

  // Headers server components (and the root layout) read to render the right locale.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)
  requestHeaders.set('x-pathname', logicalPath)

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Shared cookie Domain across *.askbiz.co (env-gated; unset on localhost).
      cookieOptions: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
        ? { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN }
        : undefined,
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let { data: { user } } = await supabase.auth.getUser()

  // ── 24-hour session cap ────────────────────────────────────────────────────
  // Supabase refresh tokens keep a session alive indefinitely by default. Force
  // a real sign-out (not just an access-token refresh) once 24h have passed
  // since the user's last sign-in. Uses Supabase's own last_sign_in_at instead
  // of a separately-tracked cookie — a cookie left over from a session older
  // than 24h would otherwise immediately kill every fresh login, regardless of
  // sign-in method (this broke Google/Microsoft/passkey/phone sign-in on 2026-07-08).
  const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000
  if (user) {
    const lastSignInAt = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : null
    if (lastSignInAt && Date.now() - lastSignInAt > SESSION_MAX_AGE_MS) {
      await supabase.auth.signOut()
      user = null
    }
  }

  // ── POS domain: redirect root to /sell ─────────────────────────────────────
  const host = request.headers.get('host') || ''
  if (host.startsWith('pos.') && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/sell', request.url))
  }

  // ── Language cookie ────────────────────────────────────────────────────────
  // When the user visits a locale-prefixed URL (/es/...) the URL IS their
  // explicit choice — write it to the cookie so subsequent unprefixed routes
  // (signin, glossary, etc.) automatically appear in the same language.
  const existingLang = request.cookies.get('askbiz_lang')?.value
  if (hasLocalePrefix && existingLang !== locale) {
    response.cookies.set('askbiz_lang', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })
  } else if (!existingLang) {
    const country = request.headers.get('x-vercel-ip-country') || ''
    const rawLang = COUNTRY_TO_LANG[country.toUpperCase() as keyof typeof COUNTRY_TO_LANG] || 'en'
    // Only persist active locales — inactive ones (e.g. sw) must not be stored
    // because downstream code may read the cookie directly and build prefixed URLs.
    const detectedLang = (PREFIXED_LOCALES as string[]).includes(rawLang) || rawLang === DEFAULT_LOCALE
      ? rawLang
      : DEFAULT_LOCALE
    response.cookies.set('askbiz_lang', detectedLang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    })
  }

  // ── Protected routes ───────────────────────────────────────────────────────
  const protectedRoutes = [
    '/home', '/ask', '/chat', '/intelligence', '/files',
    '/alerts', '/forecasts', '/templates',
    '/admin', '/sources', '/billing', '/onboarding',
    '/settings', '/expansion', '/invite',
  ]

  function applySecurityHeaders(res: typeof response) {
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.headers.set('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(self)')
    if (!res.headers.has('Content-Security-Policy')) {
      res.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://analytics.tiktok.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://js.stripe.com https://api.stripe.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.google.com https://*.vercel-insights.com https://*.vercel-analytics.com https://api.tavily.com https://*.tile.openstreetmap.org https://analytics.tiktok.com https://ads.tiktok.com; frame-src https://js.stripe.com https://hooks.stripe.com https://pos.askbiz.co; object-src 'none'; base-uri 'self'; form-action 'self'")
    }
    return res
  }

  // Route guards run against the logical (locale-stripped) path; redirects keep
  // the locale prefix so the user stays in their language.
  const localePrefix = hasLocalePrefix ? `/${locale}` : ''

  const isProtected = protectedRoutes.some(r => logicalPath.startsWith(r))
  if (isProtected && !user) {
    return applySecurityHeaders(NextResponse.redirect(new URL(`${localePrefix}/signin`, request.url)))
  }

  // ── Redirect signed-in users away from auth pages ─────────────────────────
  const authRoutes = ['/signin', '/signup']
  const isAuthRoute = authRoutes.some(r => logicalPath.startsWith(r))
  if (isAuthRoute && user) {
    return applySecurityHeaders(NextResponse.redirect(new URL(`${localePrefix}/home`, request.url)))
  }

  // ── Rewrite locale-prefixed URLs onto the flat route tree ──────────────────
  // /es/blog/x stays in the address bar but renders the /blog/x route with
  // x-locale=es. English (unprefixed) falls through untouched.
  if (hasLocalePrefix) {
    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = logicalPath
    const rewritten = NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } })
    response.cookies.getAll().forEach(c => rewritten.cookies.set(c))
    return applySecurityHeaders(rewritten)
  }

  // ── Security headers (belt-and-suspenders with next.config.js) ──────────────
  applySecurityHeaders(response)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|sitemap).*)'],
}
