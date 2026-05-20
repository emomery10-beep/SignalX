import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const includeSeen = searchParams.get('include_seen') === 'true'

  let query = service
    .from('anomalies')
    .select('id, type, severity, title, body, metric, value, threshold, prompt, seen, created_at')
    .eq('user_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (!includeSeen) {
    query = query.eq('seen', false)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ anomalies: data || [] })
}

// PATCH — mark anomaly/anomalies as seen
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { id, mark_all_seen } = await req.json()

  if (mark_all_seen) {
    await service
      .from('anomalies')
      .update({ seen: true })
      .eq('user_id', auth.ownerId)
      .eq('seen', false)
    return NextResponse.json({ success: true })
  }

  if (!id) return NextResponse.json({ error: 'id or mark_all_seen required' }, { status: 400 })

  const { error } = await service
    .from('anomalies')
    .update({ seen: true })
    .eq('id', id)
    .eq('user_id', auth.ownerId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
