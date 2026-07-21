import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/admin-auth'
import { API_PLAN_LIMITS, isApiPlan, withVerifiedMultiplier } from '@/lib/api-plan-limits'

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

  if (resource === 'verifications') {
    const { data: verifications, error } = await supabase
      .from('business_verifications')
      .select('id, user_id, status, legal_name, registration_number, tax_id, address, submitted_at, reviewed_at, reviewed_by, rejection_reason')
      .order('submitted_at', { ascending: false })
      .limit(500)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: authData } = await supabase.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authData?.users?.forEach((u: any) => { if (u.email) emailMap[u.id] = u.email })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = (verifications || []).map((v: any) => v.id)
    const { data: docs } = ids.length
      ? await supabase
        .from('business_verification_documents')
        .select('id, verification_id, kind, storage_path, uploaded_at')
        .in('verification_id', ids)
      : { data: [] }

    // Signed URLs so the admin can view each document — the bucket is
    // private (same as vendor-captures), so a plain storage_path is
    // useless without one. Signed in parallel, 10-minute TTL (a review
    // session, not a link to hand out).
    const docsByVerification: Record<string, { id: string; kind: string; uploaded_at: string; url: string | null }[]> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await Promise.all((docs || []).map(async (d: any) => {
      const { data: signed } = await supabase.storage.from('kyc-documents').createSignedUrl(d.storage_path, 600)
      const entry = { id: d.id, kind: d.kind, uploaded_at: d.uploaded_at, url: signed?.signedUrl || null }
      ;(docsByVerification[d.verification_id] ||= []).push(entry)
    }))

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      verifications: (verifications || []).map((v: any) => ({
        ...v,
        user_email: emailMap[v.user_id] || null,
        documents: docsByVerification[v.id] || [],
      })),
    })
  }

  return NextResponse.json({ error: 'Unknown resource — use keys, connections, charges, or verifications' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body || !['grant', 'approve', 'reject'].includes(body.action)) {
    return NextResponse.json({ error: 'Unknown action — use "grant", "approve", or "reject"' }, { status: 400 })
  }

  if (body.action === 'approve' || body.action === 'reject') {
    const { verification_id, rejection_reason } = body as { verification_id?: string; rejection_reason?: string }
    if (!verification_id) return NextResponse.json({ error: '"verification_id" is required' }, { status: 400 })

    const { data: verification } = await supabase
      .from('business_verifications')
      .select('id, user_id, status')
      .eq('id', verification_id)
      .maybeSingle()
    if (!verification) return NextResponse.json({ error: 'Verification not found' }, { status: 404 })

    if (body.action === 'reject') {
      if (!rejection_reason || !rejection_reason.trim()) {
        return NextResponse.json({ error: '"rejection_reason" is required to reject' }, { status: 400 })
      }
      const { error } = await supabase.from('business_verifications').update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: admin.id,
        rejection_reason: rejection_reason.trim().slice(0, 500),
      }).eq('id', verification_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    // approve
    const { error: approveError } = await supabase.from('business_verifications').update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
      rejection_reason: null,
    }).eq('id', verification_id)
    if (approveError) return NextResponse.json({ error: approveError.message }, { status: 500 })

    // One-time retroactive bump onto this business's EXISTING keys — future
    // keys pick up the multiplier automatically at creation
    // (app/api/v1/keys/route.ts) and it survives any later plan change
    // (stripe-billing webhook resync). Applied to each key's own current
    // limits (not re-derived from its plan) via the same shared helper, so
    // a business that already has a mix of plans/keys gets each one
    // multiplied from where it actually stands.
    const { data: keysToBump } = await supabase
      .from('api_keys')
      .select('id, request_limit_month, request_limit_minute')
      .eq('user_id', verification.user_id)
    if (keysToBump?.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await Promise.all(keysToBump.map((k: any) => {
        const bumped = withVerifiedMultiplier({ month: k.request_limit_month, minute: k.request_limit_minute }, true)
        return supabase.from('api_keys').update({
          request_limit_month: bumped.month,
          request_limit_minute: bumped.minute,
        }).eq('id', k.id)
      }))
    }

    return NextResponse.json({ success: true })
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
