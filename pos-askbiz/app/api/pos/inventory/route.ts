import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// GET — fetch active inventory for this owner (filtered by location for staff)
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const search      = searchParams.get('search') || ''
  const page        = Math.max(0, parseInt(searchParams.get('page') || '0'))
  const limit       = Math.min(200, parseInt(searchParams.get('limit') || '200'))
  const location_id = searchParams.get('location_id') || auth.locationId
  const sector      = searchParams.get('sector') || null

  let query = service
    .from('inventory')
    .select('*, location:pos_locations!location_id(id, name)', { count: 'exact' })
    .eq('owner_id', auth.ownerId)
    .eq('active', true)
    .order('name', { ascending: true })
    .range(page * limit, (page + 1) * limit - 1)

  // Staff locked to branch; owner can filter or see all
  if (location_id) query = query.eq('location_id', location_id)

  // Sector filter: strict — each sector only sees its own tagged items.
  // (Previously included sector.is.null, which leaked untagged retail products
  // into the repair/salon/factory views.)
  if (sector) query = query.eq('sector', sector)

  if (search) {
    query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
  }

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ inventory: data, total: count })
}

// POST — add a new product (inventory staff only) — fix #10
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { name, sku, cost_price, sale_price, stock_qty, low_stock_threshold, unit, sector } = body
  const locationId = auth.locationId || body.location_id || null

  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const { data, error } = await service
    .from('inventory')
    .insert({
      owner_id:            auth.ownerId,
      location_id:         locationId,
      name:                name.trim(),
      sku:                 sku?.trim() || null,
      cost_price:          Number(cost_price) || 0,
      sale_price:          Number(sale_price) || 0,
      stock_qty:           Math.max(0, parseFloat(stock_qty) || 0),
      low_stock_threshold: Math.max(1, parseInt(low_stock_threshold) || 5),
      unit:                unit || 'item',
      sector:              sector || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

// POST bulk — add multiple products in one round-trip (used by template import) — fix #5
export async function PUT(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()
  const { items } = body as { items: { name: string; sale_price?: number; stock_qty?: number; unit?: string }[] }
  const locationId = auth.locationId || body.location_id || null

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'items array required' }, { status: 400 })
  }

  const rows = items.map(i => ({
    owner_id:            auth.ownerId,
    location_id:         locationId,
    name:                (i.name || '').trim(),
    sale_price:          Number(i.sale_price) || 0,
    cost_price:          0,
    stock_qty:           Math.max(0, parseFloat(String(i.stock_qty)) || 0),
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
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const ownerId = auth.ownerId

  const service = createServiceClient()
  const body = await req.json()
  const { id, restock_qty, ...fields } = body
  const clientTxId = (typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64) ? body.client_tx_id : null

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Restock — fix #24: coerce to number; fix #4: atomic increment via DB.
  // increment_inventory_stock is idempotent on client_tx_id (dedup +
  // increment + audit-log insert happen in one Postgres transaction) — see
  // supabase/migrations/20260710_pos_inventory_restock_idempotency.sql.
  if (restock_qty !== undefined) {
    const qty = Number(restock_qty)
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ error: 'restock_qty must be a positive number' }, { status: 400 })
    }

    const { data, error } = await service.rpc('increment_inventory_stock', {
      p_id:            id,
      p_owner_id:      ownerId,
      p_qty:           qty,
      p_client_tx_id:  clientTxId,
      p_staff_id:      auth.staffId,
      p_staff_role:    auth.role,
    }).select().single()

    if (error) {
      // Genuinely missing RPC (e.g. migration not yet applied in this
      // environment) — fall back to the historical non-atomic path rather
      // than fail the restock outright. Any other error is a real failure.
      if (/function.*increment_inventory_stock.*does not exist|schema cache/i.test(error.message || '')) {
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json({ product: data })
  }

  // General field update — whitelist writable fields
  const allowed = ['name', 'sku', 'cost_price', 'sale_price', 'stock_qty', 'low_stock_threshold', 'unit', 'active', 'sector']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (fields[key] !== undefined) updates[key] = fields[key]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  // Idempotency: a field-edit is naturally idempotent (applying the same
  // set twice produces the same end state), but still dedupe an immediate
  // retry so it's a fast no-op and doesn't generate a duplicate write.
  if (clientTxId) {
    try {
      const { data: dupe, error: dupeErr } = await service
        .from('inventory')
        .select('*, location:pos_locations!location_id(id, name)')
        .eq('owner_id', ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (!dupeErr && dupe) return NextResponse.json({ product: dupe, deduped: true })
    } catch { /* dedupe is best-effort — never block an edit on it */ }
  }

  const updateRow = { ...updates, client_tx_id: clientTxId }
  let { data, error } = await service
    .from('inventory')
    .update(updateRow)
    .eq('id', id)
    .eq('owner_id', ownerId)
    .select()
    .single()

  if (error && clientTxId && (error as any).code === '23505') {
    const { data: dupe } = await service
      .from('inventory')
      .select('*, location:pos_locations!location_id(id, name)')
      .eq('owner_id', ownerId)
      .eq('client_tx_id', clientTxId)
      .maybeSingle()
    if (dupe) return NextResponse.json({ product: dupe, deduped: true })
  }
  if (error && /client_tx_id|column|schema cache/i.test(error.message || '')) {
    const retry = await service.from('inventory').update(updates).eq('id', id).eq('owner_id', ownerId).select().single()
    data = retry.data
    error = retry.error
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}
