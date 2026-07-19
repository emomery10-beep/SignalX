import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/admin-auth'
import { API_PLAN_LIMITS, isApiPlan } from '@/lib/api-plan-limits'

// Admin oversight for the developer API platform — kept separate from the
// general app/api/admin/route.ts (POS/consumer business metrics) since
// this is a different domain (api_keys, developer_connections,
// developer_charges) with its own resource shapes. developer.askbiz.co's
// /admin section proxies here; this endpoint IS the real authorization
// boundary (see lib/admin-auth.ts) — the developer-askbiz UI guard is only
// a UX convenience, not what actually blocks a non-admin.

export async function GET(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const resource = request.nextUrl.searchParams.get('resource') || 'keys'

  if (resource === 'keys') {
    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, name, user_id, plan, mode, is_active, requests_month, request_limit_month, request_limit_minute, credit_balance_cents, app_id, created_at, last_used_at')
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: authData } = await supabase.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authData?.users?.forEach((u: any) => { if (u.email) emailMap[u.id] = u.email })

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      keys: (keys || []).map((k: any) => ({ ...k, user_email: emailMap[k.user_id] || null })),
    })
  }

  if (resource === 'connections') {
    const { data, error } = await supabase
      .from('developer_connections')
      .select('id, key_id, merchant_email, merchant_user_id, status, scopes, app_id, created_at, approved_at, revoked_at')
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ connections: data || [] })
  }

  if (resource === 'charges') {
    const { data, error } = await supabase
      .from('developer_charges')
      .select('id, key_id, merchant_email, amount_cents, currency, description, status, created_at, approved_at, expires_at')
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ charges: data || [] })
  }

  return NextResponse.json({ error: 'Unknown resource — use keys, connections, or charges' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body || body.action !== 'grant') {
    return NextResponse.json({ error: 'Unknown action — only "grant" is supported' }, { status: 400 })
  }

  const { key_id, plan, credit_cents } = body as { key_id?: string; plan?: string; credit_cents?: number }
  if (!key_id) return NextResponse.json({ error: '"key_id" is required' }, { status: 400 })

  const { data: key } = await supabase.from('api_keys').select('id').eq('id', key_id).maybeSingle()
  if (!key) return NextResponse.json({ error: 'Key not found' }, { status: 404 })

  // Same dual-write-plus-manual-marker spirit as app/api/admin/route.ts's
  // change_plan action for POS plans: a direct write, not a real payment,
  // so it shows up honestly in api_credit_transactions as provider:'admin'
  // rather than looking like a Stripe top-up.
  if (plan !== undefined) {
    if (!isApiPlan(plan)) {
      return NextResponse.json({ error: `"plan" must be one of: ${Object.keys(API_PLAN_LIMITS).join(', ')}` }, { status: 400 })
    }
    const limits = API_PLAN_LIMITS[plan]
    const { error } = await supabase.from('api_keys').update({
      plan, request_limit_month: limits.month, request_limit_minute: limits.minute,
    }).eq('id', key_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (credit_cents !== undefined) {
    if (!Number.isInteger(credit_cents) || credit_cents <= 0) {
      return NextResponse.json({ error: '"credit_cents" must be a positive integer' }, { status: 400 })
    }
    const { error } = await supabase.rpc('topup_api_credits', {
      p_key_id: key_id,
      p_amount_cents: credit_cents,
      p_provider: 'admin',
      p_provider_ref: `admin_${admin.id}_${randomUUID()}`,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: updated, error } = await supabase
    .from('api_keys')
    .select('id, name, plan, credit_balance_cents, request_limit_month, request_limit_minute')
    .eq('id', key_id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, key: updated })
}
