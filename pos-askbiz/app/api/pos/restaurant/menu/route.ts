import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// GET — full menu: categories + items + modifier groups
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const location_id = searchParams.get('location_id') || auth.locationId

  const [catRes, itemRes, groupRes, modRes, linkRes] = await Promise.all([
    service.from('restaurant_menu_categories')
      .select('*').eq('owner_id', auth.ownerId)
      .order('sort_order').order('name'),
    service.from('restaurant_menu_items')
      .select('*').eq('owner_id', auth.ownerId)
      .order('sort_order').order('name'),
    service.from('restaurant_modifier_groups')
      .select('*').eq('owner_id', auth.ownerId),
    service.from('restaurant_modifiers')
      .select('*').eq('owner_id', auth.ownerId).order('sort_order'),
    service.from('restaurant_item_modifier_groups')
      .select('item_id, group_id'),
  ])

  const categories = catRes.data || []
  const items      = itemRes.data || []
  const groups     = groupRes.data || []
  const modifiers  = modRes.data || []
  const links      = linkRes.data || []

  // Attach modifiers to groups
  const groupsWithMods = groups.map((g: any) => ({
    ...g,
    modifiers: modifiers.filter((m: any) => m.group_id === g.id),
  }))

  // Attach modifier groups to items
  const itemsEnriched = items.map((item: any) => ({
    ...item,
    modifier_groups: links
      .filter((l: any) => l.item_id === item.id)
      .map((l: any) => groupsWithMods.find((g: any) => g.id === l.group_id))
      .filter(Boolean),
  }))

  // Attach items to categories
  const menu = categories.map((cat: any) => ({
    ...cat,
    items: itemsEnriched.filter((i: any) => i.category_id === cat.id),
  }))

  return NextResponse.json({ menu, categories, items: itemsEnriched, modifier_groups: groupsWithMods })
}

// POST — create category, item, modifier group, or modifier
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const body = await req.json()
  const { type } = body

  if (type === 'category') {
    const { name, icon, color, sort_order } = body
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
    const { data, error } = await service.from('restaurant_menu_categories').insert({
      owner_id: auth.ownerId, name, icon: icon || '🍽️',
      color: color || '#d08a59', sort_order: sort_order || 0,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ category: data })
  }

  if (type === 'item') {
    const { category_id, name, description, price, food_cost, station, prep_time_mins,
            allergens, tags, calories, sort_order, modifier_group_ids } = body
    if (!name || price == null) return NextResponse.json({ error: 'name and price required' }, { status: 400 })
    const { data, error } = await service.from('restaurant_menu_items').insert({
      owner_id: auth.ownerId, category_id, name, description,
      price, food_cost: food_cost || 0, station: station || 'all',
      prep_time_mins: prep_time_mins || 10, allergens: allergens || [],
      tags: tags || [], calories, sort_order: sort_order || 0,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Link modifier groups if provided
    if (modifier_group_ids?.length && data) {
      await service.from('restaurant_item_modifier_groups').insert(
        modifier_group_ids.map((gid: string) => ({ item_id: data.id, group_id: gid }))
      )
    }
    return NextResponse.json({ item: data })
  }

  if (type === 'modifier_group') {
    const { name, selection_type, required, min_selections, max_selections, modifiers: mods } = body
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
    const { data: group, error } = await service.from('restaurant_modifier_groups').insert({
      owner_id: auth.ownerId, name,
      selection_type: selection_type || 'single',
      required: required || false,
      min_selections: min_selections || 0,
      max_selections: max_selections || 1,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (mods?.length && group) {
      await service.from('restaurant_modifiers').insert(
        mods.map((m: any, i: number) => ({
          owner_id: auth.ownerId, group_id: group.id,
          name: m.name, price_adjustment: m.price_adjustment || 0, sort_order: i,
        }))
      )
    }
    return NextResponse.json({ modifier_group: group })
  }

  return NextResponse.json({ error: 'Invalid type. Use: category | item | modifier_group' }, { status: 400 })
}

// PATCH — update item or category
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const body = await req.json()
  const { type, id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const table = type === 'category' ? 'restaurant_menu_categories'
    : type === 'modifier_group' ? 'restaurant_modifier_groups'
    : type === 'modifier' ? 'restaurant_modifiers'
    : 'restaurant_menu_items'

  const { data, error } = await service.from(table)
    .update(fields).eq('id', id).eq('owner_id', auth.ownerId)
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

// DELETE — remove item or category
export async function DELETE(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const id   = searchParams.get('id')
  const type = searchParams.get('type') || 'item'
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const table = type === 'category' ? 'restaurant_menu_categories'
    : type === 'modifier_group' ? 'restaurant_modifier_groups'
    : 'restaurant_menu_items'

  const { error } = await service.from(table).delete()
    .eq('id', id).eq('owner_id', auth.ownerId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
