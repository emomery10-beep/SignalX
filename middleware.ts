import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { COUNTRY_TO_LANG } from '@/lib/i18n'
import { DEFAULT_LOCALE, PREFIXED_LOCALES, resolveLocale } from '@/lib/i18n-locale'
// CSP lives in one place (plain JS so next.config.js can require it too).
import { CONTENT_SECURITY_POLICY } from '@/lib/security-headers'
import { STATIC_LOCALE_SEO_SLUGS } from '@/lib/seo-i18n-slugs'

// Logical paths that get a REAL per-locale static render (app/[locale]/[seoSlug])
// instead of the generic "rewrite onto the flat English route + x-locale header"
// treatment every other locale-prefixed path gets. Same carve-out reasoning as
// the homepage a few lines below: reading a header forces dynamic rendering,
// so anything meant to be genuinely translated (not just chrome-translated)
// needs to be excluded from the rewrite and let Next's own file router match
// the static [locale]/[seoSlug] segment directly.
const STATIC_LOCALE_SEO_PATHS = new Set(STATIC_LOCALE_SEO_SLUGS.map(s => `/${s}`))

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

  // ── Geo-route the mobile-POS landing to the visitor's market ────────────────
  // A visitor whose IP is in Somalia gets the Somali Somalia page (localised:
  // USD, EVC Plus/Zaad) instead of the Kenya page. Temporary (307) + geo-based,
  // so search engines still crawl and index both pages independently; only this
  // one path is affected.
  if (
    request.headers.get('x-vercel-ip-country') === 'SO' &&
    request.nextUrl.pathname === '/mobile-pos-kenya'
  ) {
    return NextResponse.redirect(new URL('/mobile-pos-somalia', request.url), { status: 307 })
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

  let { data: { user }, error: getUserError } = await supabase.auth.getUser()

  // A stale/invalid refresh-token cookie (session revoked server-side, or a
  // leftover cookie from before this browser's last cookie-domain change)
  // otherwise fails the exact same way on every single request forever —
  // getUser() surfaces the error but never clears the cookie that caused it.
  // Seen in production 2026-07-20: this repeated on every request (including
  // unrelated static pages) from one browser and coincided with a failed
  // Google sign-in at /auth/callback. Only clear for the specific
  // unrecoverable codes — not transient/5xx errors, which shouldn't nuke a
  // legitimate session over a momentary blip.
  if (getUserError && ['refresh_token_not_found', 'refresh_token_already_used'].includes(getUserError.code || '')) {
    await supabase.auth.signOut()
    user = null
  }

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
    '/settings', '/expansion', '/invite', '/change-pin',
  ]

  function applySecurityHeaders(res: typeof response) {
    res.headers.set('X-Frame-Options', 'DENY')
    res.headers.set('X-Content-Type-Options', 'nosniff')
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.headers.set('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(self)')
    if (!res.headers.has('Content-Security-Policy')) {
      res.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY)
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

  // ── First-visit locale redirect ────────────────────────────────────────────
  // app/layout.tsx no longer reads cookies()/headers() (needed so most public
  // pages can be statically cached), so unprefixed URLs can no longer render a
  // visitor's non-default locale invisibly. Without this, a first-time visitor
  // whose cookie/geo resolves to e.g. 'sw' would silently see English chrome on
  // these pages. Redirecting to the prefixed URL preserves "Kenya -> Swahili,
  // Somalia -> Somali" as an outcome. Only fires with no cookie yet (first
  // touch) — a returning visitor with an existing non-default cookie who
  // follows an unprefixed link to one of these pages is a known, accepted gap
  // (see the locale rendering fix plan) closed by a later real per-locale
  // static-page migration, not by this redirect.
  const LOCALE_REDIRECT_PREFIXES = ['/blog', '/academy', '/help', '/privacy', '/signin', '/signup']
  const needsLocaleRedirect =
    !hasLocalePrefix &&
    !existingLang &&
    locale !== DEFAULT_LOCALE &&
    LOCALE_REDIRECT_PREFIXES.some(p => logicalPath === p || logicalPath.startsWith(p + '/'))
  if (needsLocaleRedirect) {
    const target = new URL(`/${locale}${logicalPath}`, request.url)
    target.search = request.nextUrl.search
    return applySecurityHeaders(NextResponse.redirect(target, 307))
  }

  // ── Homepage auth-callback / Shopify-install redirects ──────────────────────
  // The homepage routes (bare `/` → app/page.tsx, and /es …/so → app/[locale])
  // are both statically generated, so neither can read these off `searchParams`
  // itself — reading searchParams in a server component forces the route into
  // dynamic rendering. Handle them here instead, before the rewrite/pass-through
  // below, for every homepage regardless of locale prefix (this replaces the
  // searchParams handling app/home-i18n/page.tsx used to do for /es …/so).
  if (logicalPath === '/') {
    const qp = request.nextUrl.searchParams
    const code = qp.get('code')
    const tokenHash = qp.get('token_hash')
    const type = qp.get('type')
    const ref = qp.get('ref')
    const shop = qp.get('shop')
    const status = qp.get('status')
    if (code) {
      return applySecurityHeaders(NextResponse.redirect(new URL(`/auth/callback?code=${code}`, request.url)))
    }
    if (tokenHash && type) {
      return applySecurityHeaders(NextResponse.redirect(new URL(`/auth/callback?token_hash=${tokenHash}&type=${type}`, request.url)))
    }
    if (ref === 'shopify' && shop) {
      return applySecurityHeaders(NextResponse.redirect(new URL(`/signin?ref=shopify&shop=${shop}&status=${status || 'install'}`, request.url)))
    }
  }

  // ── Rewrite locale-prefixed URLs onto the flat route tree ──────────────────
  // /es/blog/x stays in the address bar but renders the /blog/x route with
  // x-locale=es. English (unprefixed) falls through untouched.
  //
  // The homepage itself (logicalPath === '/') is deliberately NOT rewritten: the
  // URL is already /es …/so, which maps to the statically-generated per-locale
  // route app/[locale]/page.tsx. Letting it pass through (like the English `/`)
  // keeps that render static and CDN-cacheable — rewriting it to a header-driven
  // route would force it back into dynamic rendering for every visitor. The 13
  // Kenya/Africa SEO pages get the same treatment via app/[locale]/[seoSlug].
  if (hasLocalePrefix && logicalPath !== '/' && !STATIC_LOCALE_SEO_PATHS.has(logicalPath)) {
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

// Pure static assets that never vary by locale or auth state — excluding them
// saves a wasted Supabase auth call + locale detection per request. Verified
// against protectedRoutes/authRoutes/LOCALE_REDIRECT_PREFIXES/
// INACTIVE_LOCALE_PREFIXES above: no overlap. next.config.js's headers()
// still applies its own (superset, includes HSTS) security headers to all of
// these unconditionally, since middleware never touches them to begin with.
// favicon.svg doesn't exist as a file (only app/icon.svg does) but is kept
// here since real traffic still requests it and would otherwise pay the full
// middleware cost just to 404.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|favicon.svg|api/|sitemap|robots.txt|images/|brand/|\\.well-known/|textures/|research/|content/|icons/|manifest.json|logo.svg|ai-plugin.json|llms.txt).*)'],
}
