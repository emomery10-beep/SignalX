import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }

  const cookieStore = cookies()
  return createServerClient(url, key, {
    // Shared cookie Domain so the owner's askbiz.co login is seen here too.
    // Set NEXT_PUBLIC_COOKIE_DOMAIN=.askbiz.co in production; unset on localhost.
    cookieOptions: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
      ? { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN }
      : undefined,
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value },
      set(name: string, value: string, options: CookieOptions) {
        try { cookieStore.set({ name, value, ...options }) } catch (_) {}
      },
      remove(name: string, options: CookieOptions) {
        try { cookieStore.set({ name, value: '', ...options }) } catch (_) {}
      },
    },
  })
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
