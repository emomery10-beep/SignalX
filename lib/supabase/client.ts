import { createBrowserClient } from '@supabase/ssr'

// Shared cookie Domain — see lib/supabase/server.ts. Set
// NEXT_PUBLIC_COOKIE_DOMAIN=.askbiz.co in production; unset on localhost/dev.
const cookieOptions = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  ? { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN }
  : undefined

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions,
      auth: {
        experimental: {
          passkey: true,
        },
      },
    }
  )
}
