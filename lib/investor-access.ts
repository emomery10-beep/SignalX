// Who is calling the investor APIs.
//  - resolveOwner():    the business OWNER only (manages every investor's deal).
//  - resolveInvestor(): a signed-in team member with the 'investor' role. Their
//    rows are looked up strictly by investor_user_id = their own login id, so
//    one investor can never reach another's deal, even through this layer.
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getCallerContext } from '@/lib/team-auth'

type Fail = { ok: false; status: 401 | 403; error: string }

export async function resolveOwner(): Promise<{ ok: true; user: User; ownerId: string; db: SupabaseClient } | Fail> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, status: 401, error: 'Unauthorized' }
  const ctx = await getCallerContext(user.id, supabase)
  if (!ctx.isOwner) return { ok: false, status: 403, error: 'Only the business owner can manage investors' }
  // RLS-scoped client: even a bug here cannot reach another business's rows.
  return { ok: true, user, ownerId: user.id, db: supabase }
}

export async function resolveInvestor(): Promise<{ ok: true; user: User; ownerId: string; db: SupabaseClient } | Fail> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, status: 401, error: 'Unauthorized' }
  const ctx = await getCallerContext(user.id, supabase)
  if (ctx.isOwner || ctx.role !== 'investor') return { ok: false, status: 403, error: 'This area is for investors' }

  const db = createServiceClient()
  // First visit after accepting the invite: attach this login to the deal(s) the
  // owner created for their email. Only deals in the org they were invited to.
  const email = (user.email || '').trim().toLowerCase()
  if (email) {
    await db.from('investor_investments')
      .update({ investor_user_id: user.id, updated_at: new Date().toISOString() })
      .eq('owner_id', ctx.orgId).is('investor_user_id', null).ilike('investor_email', email)
  }
  return { ok: true, user, ownerId: ctx.orgId, db }
}
