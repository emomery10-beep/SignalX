import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/admin-auth'

// GET — list "Advertise here" leads for the admin queue. Defaults to
// pending; ?status=contacted|dismissed|all for the reviewed history.
export async function GET(request: NextRequest) {
  const service = createServiceClient()
  const admin = await getAdminUser(request, service)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = new URL(request.url).searchParams.get('status') || 'pending'
  let query = service
    .from('advertise_inquiries')
    .select('*')
    .order('submitted_at', { ascending: true })

  if (status !== 'all') query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inquiries: data || [] })
}

// POST — mark a lead contacted or dismissed.
export async function POST(request: NextRequest) {
  const service = createServiceClient()
  const admin = await getAdminUser(request, service)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, action, notes } = body
  if (!id || (action !== 'contact' && action !== 'dismiss')) {
    return NextResponse.json({ error: 'id and action (contact|dismiss) are required' }, { status: 400 })
  }

  const { data, error } = await service
    .from('advertise_inquiries')
    .update({
      status: action === 'contact' ? 'contacted' : 'dismissed',
      notes: typeof notes === 'string' ? notes : null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inquiry: data })
}
