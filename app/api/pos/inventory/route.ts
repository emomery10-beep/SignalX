import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// GET — fetch active inventory for this owner
export async function GET(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const page   = Math.max(0, parseInt(searchParams.get('page') || '0'))
  const limit  = Math.min(200, parseInt(searchParams.get('limit') || '200'))

  let query = service
    .from('inventory')
    .select('*', { count: 'exact' })
    .eq('owner_id', ownerId)
    .eq('active', true)
    .order('name', { ascending: true })
    .range(page * limit, (page + 1) * limit - 1)

  if (search) {
    // Search by name OR sku — fix #14
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
  }

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ inventory: data, total: count })
}

// POST — add a new product (inventory staff only) — fix #10
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req, 'inventory')
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { name, sku, cost_price, sale_price, stock_qty, low_stock_threshold, unit } = body

  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const { data, error } = await service
    .from('inventory')
    .insert({
      owner_id:            ownerId,
      name:                name.trim(),
      sku:                 sku?.trim() || null,
      cost_price:          Number(cost_price) || 0,
      sale_price:          Number(sale_price) || 0,
      stock_qty:           Math.max(0, parseInt(stock_qty) || 0),
      low_stock_threshold: Math.max(1, parseInt(low_stock_threshold) || 5),
      unit:                unit || 'item',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

// POST bulk — add multiple products in one round-trip (used by template import) — fix #5
export async function PUT(req: NextRequest) {
  const ownerId = await resolvePosOwner(req, 'inventory')
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { items } = await req.json() as { items: { name: string; sale_price?: number; stock_qty?: number; unit?: string }[] }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'items array required' }, { status: 400 })
  }

  const rows = items.map(i => ({
    owner_id:            ownerId,
    name:                (i.name || '').trim(),
    sale_price:          Number(i.sale_price) || 0,
    cost_price:          0,
    stock_qty:           Math.max(0, parseInt(String(i.stock_qty)) || 0),
    low_stock_threshold: 5,
    unit:                i.unit || 'item',
  })).filter(r => r.name)

  const { data, error } = await service
    .from('inventory')
    .insert(rows)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data })
}

// PATCH — update product fields or restock — fix #4 #10 #24
export async function PATCH(req: NextRequest) {
  const ownerId = await resolvePosOwner(req, 'inventory')
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { id, restock_qty, ...fields } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Restock — fix #24: coerce to number; fix #4: atomic increment via DB
  if (restock_qty !== undefined) {
    const qty = Number(restock_qty)
    if (!Number.isInteger(qty) || qty <= 0) {
      return NextResponse.json({ error: 'restock_qty must be a positive integer' }, { status: 400 })
    }

    // Atomic increment — avoids race condition from separate SELECT + UPDATE
    const { data, error } = await service.rpc('increment_inventory_stock', {
      p_id:       id,
      p_owner_id: ownerId,
      p_qty:      qty,
    }).select().single()

    if (error) {
      // RPC may not exist yet — fall back to fetch-then-update (non-atomic but safe for low-concurrency use)
      const { data: current, error: fetchErr } = await service
        .from('inventory')
        .select('stock_qty')
        .eq('id', id)
        .eq('owner_id', ownerId)
        .single()

      if (fetchErr || !current) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

      const { data: updated, error: updateErr } = await service
        .from('inventory')
        .update({ stock_qty: current.stock_qty + qty })
        .eq('id', id)
        .eq('owner_id', ownerId)
        .select()
        .single()

      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })
      return NextResponse.json({ product: updated })
    }

    return NextResponse.json({ product: data })
  }

  // General field update — whitelist writable fields
  const allowed = ['name', 'sku', 'cost_price', 'sale_price', 'stock_qty', 'low_stock_threshold', 'unit', 'active']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (fields[key] !== undefined) updates[key] = fields[key]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
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
