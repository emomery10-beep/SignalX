import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Shared cookie Domain so ONE login on askbiz.co is valid across every
// *.askbiz.co subdomain (e.g. the standalone POS PWA). Set
// NEXT_PUBLIC_COOKIE_DOMAIN=.askbiz.co in production. Leave it UNSET on
// localhost/dev — a Domain there is rejected by the browser and breaks login.
export const SUPABASE_COOKIE_OPTIONS = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  ? { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN }
  : undefined

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: SUPABASE_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (_) {
            // Ignored in Server Components (read-only)
          }
        },
      },
    }
  )
}

/** Service-role client — only for trusted server-side operations */
export function createServiceClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
