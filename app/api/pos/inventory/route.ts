import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

async function resolveOwnerId(req: NextRequest): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return user.id

  // Staff PIN auth fallback
  const staffId = req.headers.get('x-staff-id')
  const ownerId = req.headers.get('x-owner-id')
  if (!staffId || !ownerId) return null

  const service = createServiceClient()
  const { data: staff } = await service
    .from('pos_staff')
    .select('id')
    .eq('id', staffId)
    .eq('owner_id', ownerId)
    .eq('active', true)
    .maybeSingle()

  return staff ? ownerId : null
}

// GET — fetch inventory with optional low-stock filter
export async function GET(req: NextRequest) {
  const ownerId = await resolveOwnerId(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const low_stock = searchParams.get('low_stock') === 'true'

  let query = service
    .from('inventory')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('active', true)
    .order('name', { ascending: true })

  if (low_stock) {
    query = query.filter('stock_qty', 'lte', 'low_stock_threshold')
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inventory: data })
}

// POST — add a new product to inventory
export async function POST(req: NextRequest) {
  const ownerId = await resolveOwnerId(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { name, sku, cost_price, sale_price, stock_qty, low_stock_threshold, unit } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const { data, error } = await service
    .from('inventory')
    .insert({
      owner_id:            ownerId,
      name,
      sku:                 sku || null,
      cost_price:          cost_price || 0,
      sale_price:          sale_price || 0,
      stock_qty:           stock_qty || 0,
      low_stock_threshold: low_stock_threshold || 5,
      unit:                unit || 'item',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

// PATCH — update product or restock
export async function PATCH(req: NextRequest) {
  const ownerId = await resolveOwnerId(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { id, restock_qty, staff_id, ...fields } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // If restocking, log it and increment stock
  if (restock_qty && restock_qty > 0) {
    await service.from('inventory_restock').insert({
      owner_id:     ownerId,
      inventory_id: id,
      qty_added:    restock_qty,
      created_by:   staff_id || null,
    })

    const { data, error } = await service.rpc('increment_stock', {
      p_inventory_id: id,
      p_qty:          restock_qty,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ product: data })
  }

  // Otherwise update fields
  const allowed = ['name', 'sku', 'cost_price', 'sale_price', 'low_stock_threshold', 'unit', 'active']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (fields[key] !== undefined) updates[key] = fields[key]
  }

  const { data, error } = await service
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', ownerId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}
