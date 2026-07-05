import { createBrowserClient } from '@supabase/ssr'

// Shared cookie Domain across *.askbiz.co so the owner logs in once (on the
// main app) and is authenticated here. Set NEXT_PUBLIC_COOKIE_DOMAIN=.askbiz.co
// in production; leave it UNSET on localhost/dev.
const cookieOptions = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  ? { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN }
  : undefined

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions }
  )
}
