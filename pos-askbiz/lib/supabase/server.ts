import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch (_) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch (_) {}
        },
      },
    }
  )
}

/** Service-role client — only for trusted server-side operations */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(`Missing Supabase credentials. URL: ${url ? 'set' : 'missing'}, KEY: ${key ? 'set' : 'missing'}`)
  }

  const { createClient } = require('@supabase/supabase-js')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}
