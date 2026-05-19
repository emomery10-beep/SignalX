import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const parcel_id = searchParams.get('parcel_id')
  const photo_type = searchParams.get('photo_type')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)

  let query = service
    .from('pos_parcel_photos')
    .select('*, captured_staff:pos_staff!captured_by(id, name, role), branch:pos_locations!branch_id(id, name)')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (parcel_id) query = query.eq('parcel_id', parcel_id)
  if (photo_type) query = query.eq('photo_type', photo_type)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photos: data || [] })
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  if (!body.photo_url || !body.photo_type) {
    return NextResponse.json({ error: 'photo_url and photo_type required' }, { status: 400 })
  }

  const photo = {
    owner_id: auth.ownerId,
    parcel_id: body.parcel_id || null,
    photo_type: body.photo_type,
    photo_url: body.photo_url,
    storage: body.storage || 'supabase',
    document_type: body.document_type || null,
    extracted_data: body.extracted_data || {},
    confidence: body.confidence || null,
    lat: body.lat || null,
    lng: body.lng || null,
    captured_by: auth.staffId || null,
    branch_id: body.branch_id || auth.locationId || null,
    notes: body.notes || null,
  }

  const { data, error } = await service
    .from('pos_parcel_photos')
    .insert(photo)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photo: data })
}
