// CFO read access for the signed-in user or a delegated team member.
//
// Owners get exactly what they had before: their own RLS-scoped client and
// their own id. Team members with CFO access (per the Team tab's role matrix)
// are resolved to the owner's account and read through the service client,
// because the CFO tables' RLS policies are `auth.uid() = user_id` and would
// otherwise return nothing. Roles without CFO access (auditor, buyer,
// business_partner) are refused. Read paths only — writes stay owner-only.
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getCallerContext, type CallerRole } from '@/lib/team-auth'

// Mirrors 'CFO reports' view/full in ROLE_PERMS (components/intelligence/TeamPanel.tsx).
const CFO_READ_ROLES: CallerRole[] = ['owner', 'admin', 'analyst', 'accountant', 'viewer']

export interface CfoReader {
  user: User
  ownerId: string
  role: CallerRole
  isOwner: boolean
  db: SupabaseClient
}

export type CfoReaderResult =
  | { ok: true; reader: CfoReader }
  | { ok: false; status: 401 | 403; error: string }

export async function resolveCfoReader(): Promise<CfoReaderResult> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, status: 401, error: 'Unauthorized' }

  const ctx = await getCallerContext(user.id, supabase)
  if (ctx.isOwner) {
    return { ok: true, reader: { user, ownerId: user.id, role: 'owner', isOwner: true, db: supabase } }
  }
  if (!CFO_READ_ROLES.includes(ctx.role)) {
    return { ok: false, status: 403, error: 'Your role does not include CFO reports' }
  }
  return {
    ok: true,
    reader: { user, ownerId: ctx.orgId, role: ctx.role, isOwner: false, db: createServiceClient() },
  }
}
