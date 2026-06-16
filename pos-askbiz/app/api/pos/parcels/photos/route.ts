import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

// Allowed photo types per schema (we also accept some logical aliases)
const VALID_PHOTO_TYPES = [
  'waybill', 'condition', 'loading', 'checkpoint',
  'pickup_proof', 'delivery_proof', 'failed_delivery',
  'collection_proof', 'return', 'other',
]
const PHOTO_TYPE_ALIAS: Record<string, string> = {
  delivery_video: 'delivery_proof',
}

// POST — attach a photo (or captured document) to a parcel / owner
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const body = await req.json()

  if (!body.photo_url) return json({ error: 'photo_url required' }, 400)

  // If a parcel_id is supplied, verify it belongs to this owner
  if (body.parcel_id) {
    const { data: parcel } = await service
      .from('pos_parcels')
      .select('id')
      .eq('id', body.parcel_id)
      .eq('owner_id', auth.ownerId)
      .maybeSingle()
    if (!parcel) return json({ error: 'Parcel not found' }, 404)
  }

  let photo_type = body.photo_type || 'other'
  photo_type = PHOTO_TYPE_ALIAS[photo_type] || photo_type
  if (!VALID_PHOTO_TYPES.includes(photo_type)) photo_type = 'other'

  const document_type = ['waybill', 'invoice', 'receipt'].includes(body.document_type)
    ? body.document_type
    : null

  const { data, error } = await service
    .from('pos_parcel_photos')
    .insert({
      owner_id: auth.ownerId,
      parcel_id: body.parcel_id || null,
      photo_type,
      photo_url: body.photo_url,
      storage: body.storage === 'fallback' ? 'fallback' : 'supabase',
      document_type,
      extracted_data: body.extracted_data || {},
      confidence: toNum(body.confidence),
      lat: toNum(body.lat),
      lng: toNum(body.lng),
      captured_by: auth.staffId || null,
      branch_id: body.branch_id || auth.locationId || null,
      notes: body.notes || null,
    })
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ photo: data }, 201)
}

// GET — list photos for a parcel
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const parcel_id = searchParams.get('parcel_id')
  const limit = Math.min(200, parseInt(searchParams.get('limit') || '100'))

  let query = service
    .from('pos_parcel_photos')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (parcel_id) query = query.eq('parcel_id', parcel_id)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ photos: data || [] })
}
