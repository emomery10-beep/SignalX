import { createBrowserClient } from '@supabase/ssr'

// Shared cookie Domain so a session started on askbiz.co (or pos.askbiz.co)
// is already valid here — same Supabase project, same auth.users table.
// Set NEXT_PUBLIC_COOKIE_DOMAIN=.askbiz.co in production; unset on localhost.
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
