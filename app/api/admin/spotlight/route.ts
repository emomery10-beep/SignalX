import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/admin-auth'

// GET — list submissions for the moderation queue. Defaults to pending;
// ?status=approved|rejected|all for the reviewed history.
export async function GET(request: NextRequest) {
  const service = createServiceClient()
  const admin = await getAdminUser(request, service)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = new URL(request.url).searchParams.get('status') || 'pending'
  let query = service
    .from('business_spotlights')
    .select('*')
    .order('submitted_at', { ascending: true })

  if (status !== 'all') query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ spotlights: data || [] })
}

// POST — approve or reject a submission.
export async function POST(request: NextRequest) {
  const service = createServiceClient()
  const admin = await getAdminUser(request, service)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, action, reason, duration_days, amount_charged, currency, price_tier } = body
  if (!id || (action !== 'approve' && action !== 'reject')) {
    return NextResponse.json({ error: 'id and action (approve|reject) are required' }, { status: 400 })
  }

  // Duration/pricing are recorded only on approval — this is the deal
  // AskBiz actually agreed with the advertiser (sales-assisted, so there's
  // no fixed price list to look up), defaulting to a 30-day run if the
  // admin doesn't set one explicitly.
  const days = action === 'approve' ? (Number.isFinite(duration_days) && duration_days > 0 ? Number(duration_days) : 30) : null
  const startsAt = action === 'approve' ? new Date() : null
  const endsAt = action === 'approve' && startsAt ? new Date(startsAt.getTime() + days! * 86400000) : null

  const { data, error } = await service
    .from('business_spotlights')
    .update({
      status: action === 'approve' ? 'approved' : 'rejected',
      rejected_reason: action === 'reject' ? (reason || null) : null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
      ...(action === 'approve' ? {
        duration_days: days,
        starts_at: startsAt!.toISOString(),
        ends_at: endsAt!.toISOString(),
        amount_charged: typeof amount_charged === 'number' ? amount_charged : null,
        currency: typeof currency === 'string' && currency ? currency : null,
        price_tier: typeof price_tier === 'string' && price_tier ? price_tier : null,
      } : {}),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ spotlight: data })
}
