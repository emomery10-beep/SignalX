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
  const { id, action, reason } = body
  if (!id || (action !== 'approve' && action !== 'reject')) {
    return NextResponse.json({ error: 'id and action (approve|reject) are required' }, { status: 400 })
  }

  const { data, error } = await service
    .from('business_spotlights')
    .update({
      status: action === 'approve' ? 'approved' : 'rejected',
      rejected_reason: action === 'reject' ? (reason || null) : null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ spotlight: data })
}
