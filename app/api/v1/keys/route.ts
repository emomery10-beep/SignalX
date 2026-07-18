import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export const runtime = 'nodejs'

// Tiers mirror lib/plans.ts (free | growth | business). -1 = unlimited.
const PLAN_LIMITS: Record<string, { month: number; minute: number }> = {
  free:     { month: 100,   minute: 5   },
  growth:   { month: 10000, minute: 60  },
  business: { month: -1,    minute: 120 },
}

function generateKey(): string {
  const rand = randomBytes(24).toString('hex')
  return `abz_live_${rand}`
}

// ── GET — list all keys for the logged-in user ────────────────────────────────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: keys, error } = await supabase
    .from('api_keys')
    .select('id, name, key, mode, plan, is_active, requests_month, request_limit_month, credit_balance_cents, last_used_at, created_at, app_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Mask the key — only show last 6 chars
  const masked = (keys || []).map(k => ({
    ...k,
    key: `abz_live_${'•'.repeat(10)}${k.key.slice(-6)}`,
  }))

  return NextResponse.json({ keys: masked })
}

// ── POST — create a new key ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name = 'My API Key', mode = 'generic', app_id = null } = body

  // Optional app grouping — if given, must be an app the caller actually owns.
  // Grouping is opt-in: omitting app_id keeps a key exactly as it works today.
  if (app_id) {
    const { data: app } = await supabase.from('developer_apps').select('id').eq('id', app_id).eq('user_id', user.id).maybeSingle()
    if (!app) return NextResponse.json({ error: 'app_id not found, or not owned by you' }, { status: 400 })
  }

  // The key's plan comes from the user's actual subscription — never the request
  // body — so a free user can't mint a higher-tier (e.g. unlimited) key. The
  // entry tier and any unknown value map to 'free'.
  // Reads plan_id, not the legacy `plan` column — plan_id is the one column
  // every payment path (Stripe self-serve, admin, M-Pesa) actually keeps in
  // sync; `plan` silently freezes at signup for self-serve Stripe upgrades
  // (see memory: profiles-plan-column-drift-bug). `plan` is read as a
  // fallback only for accounts that predate plan_id.
  const { data: profile } = await supabase.from('profiles').select('plan, plan_id').eq('id', user.id).single()
  const resolvedPlan = profile?.plan_id || profile?.plan
  const plan = resolvedPlan && PLAN_LIMITS[resolvedPlan] ? resolvedPlan : 'free'

  // Max 5 keys per user
  const { count } = await supabase
    .from('api_keys')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if ((count || 0) >= 5) {
    return NextResponse.json(
      { error: 'Maximum of 5 API keys per account. Delete an existing key to create a new one.' },
      { status: 400 }
    )
  }

  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free
  const key = generateKey()

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id:              user.id,
      key,
      name,
      mode,
      plan,
      app_id,
      request_limit_month:  limits.month,
      request_limit_minute: limits.minute,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return the full key ONCE — never shown again after this
  return NextResponse.json({
    success: true,
    key: {
      ...data,
      key, // full key returned only on creation
    },
    warning: 'Copy this key now — it will not be shown again.',
  })
}

// ── PATCH — rename or toggle active status ────────────────────────────────────
export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, name, is_active, app_id } = body

  if (!id) return NextResponse.json({ error: 'Key id required' }, { status: 400 })

  if (app_id) {
    const { data: app } = await supabase.from('developer_apps').select('id').eq('id', app_id).eq('user_id', user.id).maybeSingle()
    if (!app) return NextResponse.json({ error: 'app_id not found, or not owned by you' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (name      !== undefined) update.name      = name
  if (is_active !== undefined) update.is_active = is_active
  if (app_id    !== undefined) update.app_id    = app_id

  const { data, error } = await supabase
    .from('api_keys')
    .update(update)
    .eq('id', id)
    .eq('user_id', user.id) // ensure user owns this key
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, key: data })
}

// ── DELETE — revoke a key ─────────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'Key id required' }, { status: 400 })

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
