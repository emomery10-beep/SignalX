import { NextRequest, NextResponse } from 'next/server'

// Firm front-door gate for the POS. Anyone with no session at all is redirected
// to the login instead of loading an app shell. This is a UX gate on top of the
// real security boundary — every /api/pos/* route independently validates the
// session and returns 401 — so a forged cookie gains nothing but a redirect.
//
// Two session shapes:
//   • Owner  → Supabase auth cookie (sb-<ref>-auth-token[.n]) — server-visible.
//   • PIN staff → session lives in localStorage (invisible to the edge), mirrored
//     by the lightweight `pos_session` cookie (set on login, in usePosAuth).

const POS_SESSION_COOKIE = 'pos_session'

// Never gated: the login page ('/'), the public demo, and (handled by the
// matcher) APIs + static assets.
const PUBLIC_PREFIXES = ['/preview']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/' || PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  const hasOwner = req.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.includes('auth-token'))
  const hasPin = !!req.cookies.get(POS_SESSION_COOKIE)?.value
  if (hasOwner || hasPin) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/'
  url.search = '' // don't carry query onto the login
  return NextResponse.redirect(url)
}

// Run on page navigations only — skip API routes (self-gated), Next internals,
// and any file with an extension (sw.js, manifest.json, images, etc.).
export const config = {
  matcher: ['/((?!api|_next|.*\\.).*)'],
}
