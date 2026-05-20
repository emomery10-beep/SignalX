import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// GET — current 86 board (items out today)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const location_id = searchParams.get('location_id') || auth.locationId

  const since = new Date(); since.setHours(0, 0, 0, 0)
  let query = service.from('restaurant_eighty_six')
    .select(`*, staff:pos_staff!eighty_sixed_by(id, name), item:restaurant_menu_items!menu_item_id(id, name, station)`)
    .eq('owner_id', auth.ownerId)
    .is('restored_at', null)
    .gte('eighty_sixed_at', since.toISOString())
    .order('eighty_sixed_at', { ascending: false })
  if (location_id) query = query.eq('location_id', location_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ eighty_six: data || [] })
}

// POST — 86 an item (mark as out)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { menu_item_id, item_name, reason, location_id } = await req.json()
  if (!menu_item_id) return NextResponse.json({ error: 'menu_item_id required' }, { status: 400 })

  // Mark item as eighty_sixed in menu
  await service.from('restaurant_menu_items')
    .update({ eighty_sixed: true })
    .eq('id', menu_item_id).eq('owner_id', auth.ownerId)

  const { data, error } = await service.from('restaurant_eighty_six').insert({
    owner_id:        auth.ownerId,
    location_id:     location_id || auth.locationId,
    menu_item_id,
    item_name,
    reason,
    eighty_sixed_by: auth.staffId,
    eighty_sixed_at: new Date().toISOString(),
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data })
}

// DELETE — restore an 86'd item
export async function DELETE(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { data: entry } = await service.from('restaurant_eighty_six')
    .select('menu_item_id').eq('id', id).single()

  await service.from('restaurant_eighty_six')
    .update({ restored_at: new Date().toISOString() })
    .eq('id', id).eq('owner_id', auth.ownerId)

  if (entry?.menu_item_id) {
    await service.from('restaurant_menu_items')
      .update({ eighty_sixed: false })
      .eq('id', entry.menu_item_id).eq('owner_id', auth.ownerId)
  }
  return NextResponse.json({ success: true })
}
