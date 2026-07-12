import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

const GATES = ['gate_menu', 'gate_id', 'gate_payout', 'gate_permit', 'gate_health', 'gate_food_handler'] as const
// Document gates → the vendor_captures.kind they store, and the readiness column
// that links back to the capture (food_handler has no link column — that's fine).
const DOC_KIND: Record<string, string> = { gate_id: 'id', gate_permit: 'permit', gate_health: 'health_cert', gate_food_handler: 'food_handler' }
const CAPTURE_COL: Record<string, string> = { gate_id: 'id_capture_id', gate_permit: 'permit_capture_id', gate_health: 'health_capture_id' }

// Clears a single readiness gate: a document photo (id/permit/health/food_handler)
// retained provenance-first in vendor_captures, or an M-Pesa/bank payout number.
// The menu gate has its own richer route (menu/from-photo/save).
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const location_id = req.headers.get('x-location-id') || auth.locationId || null
  const body = await req.json()
  const gate = body.gate

  if (!GATES.includes(gate) || gate === 'gate_menu') {
    return NextResponse.json({ error: 'invalid gate' }, { status: 400 })
  }

  // Fetch or create the readiness row for this vendor.
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
  if (!readiness) return NextResponse.json({ error: 'readiness unavailable' }, { status: 500 })

  const patch: Record<string, any> = {}

  if (gate === 'gate_payout') {
    const num = (body.payout_number ?? '').toString().replace(/\D/g, '').slice(0, 15)
    if (!num) return NextResponse.json({ error: 'payout_number required' }, { status: 400 })
    patch.payout_method = body.payout_method === 'bank' ? 'bank' : 'mpesa'
    patch.payout_number = num
    patch.gate_payout = 'confirmed'
  } else {
    // Document gate — retain the raw photo (provenance) in the private bucket.
    const image: string | undefined = body.image
    if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })
    let storage_path: string | null = null
    try {
      const m = image.match(/^data:(.+?);base64,(.*)$/)
      const contentType = m?.[1] || 'image/jpeg'
      const b64 = m?.[2] || image
      const buffer = Buffer.from(b64, 'base64')
      const path = `${auth.ownerId}/${Date.now()}-${DOC_KIND[gate]}.jpg`
      const { error: upErr } = await service.storage.from('vendor-captures').upload(path, buffer, { contentType, upsert: false })
      if (!upErr) storage_path = path
    } catch { /* retention is best-effort; never block clearing the gate */ }

    const { data: capture } = await service
      .from('vendor_captures')
      .insert({ owner_id: auth.ownerId, location_id, kind: DOC_KIND[gate], storage_path, status: 'confirmed' })
      .select('id')
      .single()

    patch[gate] = 'confirmed'
    if (CAPTURE_COL[gate] && capture?.id) patch[CAPTURE_COL[gate]] = capture.id
  }

  // Recompute the readiness score across all six gates.
  const next: Record<string, any> = { ...readiness, ...patch }
  const done = GATES.filter(g => next[g] === 'confirmed' || next[g] === 'not_applicable').length
  patch.readiness_score = Math.round((done / GATES.length) * 100)

  const { data: updated, error: updErr } = await service
    .from('restaurant_vendor_readiness')
    .update(patch)
    .eq('id', (readiness as any).id)
    .select('*')
    .single()
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  return NextResponse.json({ readiness: updated })
}
