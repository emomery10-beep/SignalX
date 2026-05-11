import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — fetch inventory with optional low-stock filter
export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const low_stock = searchParams.get('low_stock') === 'true'

  let query = supabase
    .from('inventory')
    .select('*')
    .eq('owner_id', user.id)
    .eq('active', true)
    .order('name', { ascending: true })

  if (low_stock) {
    // stock_qty <= low_stock_threshold
    query = query.filter('stock_qty', 'lte', 'low_stock_threshold')
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ inventory: data })
}

// POST — add a new product to inventory
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { name, sku, cost_price, sale_price, stock_qty, low_stock_threshold, unit } = await req.json()
  if (!name)       return NextResponse.json({ error: 'name required' }, { status: 400 })
  if (!sale_price) return NextResponse.json({ error: 'sale_price required' }, { status: 400 })

  const { data, error } = await supabase
    .from('inventory')
    .insert({
      owner_id: user.id,
      name,
      sku:                 sku || null,
      cost_price:          cost_price || 0,
      sale_price,
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
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, restock_qty, staff_id, ...fields } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // If restocking, log it and increment stock
  if (restock_qty && restock_qty > 0) {
    await supabase.from('inventory_restock').insert({
      owner_id:     user.id,
      inventory_id: id,
      qty_added:    restock_qty,
      created_by:   staff_id || null,
    })

    const { data, error } = await supabase.rpc('increment_stock', {
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

  const { data, error } = await supabase
    .from('inventory')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}
