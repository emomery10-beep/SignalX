import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

const GATES = ['gate_menu', 'gate_id', 'gate_payout', 'gate_permit', 'gate_health', 'gate_food_handler'] as const

// Confirming a photo-built menu does three things at once, server-side:
//   1. retains the raw capture (private bucket + vendor_captures provenance row)
//   2. inserts the confirmed dishes into restaurant_menu_items
//   3. marks the 'menu' readiness gate and recomputes the readiness score
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const location_id = req.headers.get('x-location-id') || auth.locationId || null

  const body = await req.json()
  const image: string | undefined = body.image
  const items: any[] = Array.isArray(body.items) ? body.items : []
  const clean = items
    .map(it => ({
      name: (it?.name ?? '').toString().trim().slice(0, 120),
      price: Number(it?.price) || 0,
      description: it?.description ? it.description.toString().trim().slice(0, 300) : null,
    }))
    .filter(it => it.name)
  if (clean.length === 0) return NextResponse.json({ error: 'items required' }, { status: 400 })

  // 1. Provenance: retain the raw menu photo in the PRIVATE bucket + a capture row.
  let storage_path: string | null = null
  if (typeof image === 'string' && image) {
    try {
      const m = image.match(/^data:(.+?);base64,(.*)$/)
      const contentType = m?.[1] || 'image/jpeg'
      const b64 = m?.[2] || image
      const buffer = Buffer.from(b64, 'base64')
      const path = `${auth.ownerId}/${Date.now()}-menu.jpg`
      const { error: upErr } = await service.storage
        .from('vendor-captures')
        .upload(path, buffer, { contentType, upsert: false })
      if (!upErr) storage_path = path
    } catch { /* capture retention is best-effort; never block the save */ }
  }
  const { data: capture } = await service
    .from('vendor_captures')
    .insert({
      owner_id: auth.ownerId,
      location_id,
      kind: 'menu_photo',
      storage_path,
      model: body.model || null,
      confidence: typeof body.confidence === 'number' ? body.confidence : null,
      raw_json: { items: clean },
      status: 'confirmed',
    })
    .select('id')
    .single()

  // 2. Insert the confirmed dishes.
  const { data: inserted, error: insErr } = await service
    .from('restaurant_menu_items')
    .insert(clean.map(it => ({
      owner_id: auth.ownerId,
      name: it.name,
      price: it.price,
      description: it.description,
      station: 'all',
      available: true,
    })))
    .select('id, name, price')
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 })

  // 3. Mark the menu gate and recompute the readiness score.
  let rQuery = service.from('restaurant_vendor_readiness').select('*').eq('owner_id', auth.ownerId)
  rQuery = location_id ? rQuery.eq('location_id', location_id) : rQuery.is('location_id', null)
  let { data: readiness } = await rQuery.maybeSingle()
  if (!readiness) {
    const { data: created } = await service
      .from('restaurant_vendor_readiness')
      .insert({ owner_id: auth.ownerId, location_id })
      .select('*')
      .single()
    readiness = created
  }

  const next: Record<string, any> = { ...(readiness || {}), gate_menu: 'confirmed' }
  const done = GATES.filter(g => next[g] === 'confirmed' || next[g] === 'not_applicable').length
  const readiness_score = Math.round((done / GATES.length) * 100)

  const { data: updated, error: updErr } = await service
    .from('restaurant_vendor_readiness')
    .update({ gate_menu: 'confirmed', readiness_score, stage: 'gauge' })
    .eq('id', (readiness as any).id)
    .select('*')
    .single()
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  return NextResponse.json({ readiness: updated, items: inserted, capture_id: capture?.id ?? null })
}
