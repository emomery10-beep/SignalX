import { NextRequest } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase/server'
import { phoneToSyntheticEmail } from '@/lib/phone-auth'

// Single source of truth for "is this user an admin" — extracted from the
// getAdminUser helper duplicated (with 3 slightly different variants)
// across app/api/admin/route.ts, app/api/admin/security-audit/route.ts,
// app/api/admin/send-test-email/route.ts, app/api/admin/web-presence-audit/
// route.ts, app/api/admin/ai-discovery-audit/route.ts, and their pos-askbiz
// mirrors — 14+ independent copies at last count, only some of which get
// updated when the admin list changes. New admin surfaces should import
// this rather than adding a 15th.
export const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
export const ADMIN_PHONES = ['+254713826241']

// Phone+PIN accounts (app/api/auth/phone-pin/route.ts) never populate
// Supabase Auth's own `phone` field — the real phone lives in
// user_metadata.phone, and the actual Auth identity is a synthetic email
// (phoneToSyntheticEmail). Checking user.phone directly would silently
// never match a phone-auth admin.
export function isAdminIdentity(user: Pick<User, 'email' | 'user_metadata'> | null | undefined): boolean {
  if (!user) return false
  if (user.email && ADMIN_EMAILS.includes(user.email)) return true
  if (user.email && ADMIN_PHONES.some(p => phoneToSyntheticEmail(p) === user.email)) return true
  const metaPhone = user.user_metadata?.phone
  if (typeof metaPhone === 'string' && ADMIN_PHONES.includes(metaPhone)) return true
  return false
}

/**
 * Resolves the calling admin from either an `Authorization: Bearer` header
 * or the Supabase session cookie — same dual-path lookup the original
 * admin routes used, so this is a drop-in replacement for their local
 * getAdminUser functions.
 */
export async function getAdminUser(
  request: NextRequest,
  supabase: ReturnType<typeof createServiceClient>
): Promise<User | null> {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (isAdminIdentity(user)) return user
  }

  const accessToken = request.cookies.get('sb-access-token')?.value
    || request.cookies.get(`sb-${(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace('https://', '').split('.')[0]}-auth-token`)?.value
  if (accessToken) {
    try {
      const parsed = JSON.parse(accessToken)
      const token = Array.isArray(parsed) ? parsed[0] : parsed
      const { data: { user } } = await supabase.auth.getUser(token)
      if (isAdminIdentity(user)) return user
    } catch {
      const { data: { user } } = await supabase.auth.getUser(accessToken)
      if (isAdminIdentity(user)) return user
    }
  }

  return null
}
