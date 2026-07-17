import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Shared cookie Domain — see lib/supabase/client.ts. Deliberately no
// service-role client here: this app never touches the DB directly, it
// calls the main app's /api/v1/* routes (which already own that logic)
// with the browser's session cookie/credentials.
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
