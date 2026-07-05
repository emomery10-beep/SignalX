import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner, resolvePosAuth } from '@/lib/pos-auth'
import { logPosAudit } from '@/lib/pos-audit'

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
  const sector      = searchParams.get('sector') || null   // filter by sector tag

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
  const { name, sku, cost_price, sale_price, stock_qty, low_stock_threshold, unit, sector, expiry_date, batch_number, supplier, brand, category, image } = body
  const locationId = auth.locationId || body.location_id || null

  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 })

  // Optional product photo (base64 data URL) → product-photos bucket.
  // The photo is the product's visual identity for low-literacy vendors,
  // but a failed upload must never block the save — insert without it.
  let imageUrl: string | null = null
  if (typeof image === 'string' && image.startsWith('data:image/')) {
    try {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      if (buffer.length > 0 && buffer.length <= 5 * 1024 * 1024) { // cap at 5MB
        const filename = `${auth.ownerId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`
        const { error: uploadErr } = await service.storage
          .from('product-photos')
          .upload(filename, buffer, { contentType: 'image/jpeg', upsert: false })
        if (!uploadErr) {
          imageUrl = service.storage.from('product-photos').getPublicUrl(filename).data.publicUrl
        } else {
          console.error('[inventory] photo upload failed (saving without photo):', uploadErr.message)
        }
      }
    } catch (e) {
      console.error('[inventory] photo processing failed (saving without photo):', e)
    }
  }

  const { data, error } = await service
    .from('inventory')
    .insert({
      owner_id:            auth.ownerId,
      location_id:         locationId,
      image_url:           imageUrl,
      name:                name.trim(),
      sku:                 sku?.trim() || null,
      cost_price:          Number(cost_price) || 0,
      sale_price:          Number(sale_price) || 0,
      stock_qty:           Math.max(0, parseFloat(stock_qty) || 0),
      low_stock_threshold: Math.max(1, parseInt(low_stock_threshold) || 5),
      unit:                unit || 'item',
      sector:              sector || null,
      expiry_date:         expiry_date || null,
      batch_number:        batch_number?.trim() || null,
      supplier:            supplier?.trim() || null,
      brand:               brand?.trim() || null,
      category:            category?.trim() || null,
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
    stock_qty:           Math.max(0, parseFloat(String(i.stock_qty)) || 0),  // numeric(10,3): keep decimals for weight items
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

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Restock — fix #24: coerce to number; fix #4: atomic increment via DB
  if (restock_qty !== undefined) {
    const qty = Number(restock_qty)
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ error: 'restock_qty must be a positive number' }, { status: 400 })
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
        .select('stock_qty, name')
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
      logPosAudit({ auth, event: 'inventory.restocked', entityType: 'inventory', entityId: id,
        toValue: String(qty), metadata: { product_name: current.name, added_qty: qty, new_total: current.stock_qty + qty } })
      return NextResponse.json({ product: updated })
    }

    // RPC succeeded — fire audit
    logPosAudit({ auth, event: 'inventory.restocked', entityType: 'inventory', entityId: id,
      toValue: String(qty), metadata: { product_name: (data as any)?.name, added_qty: qty } })
    return NextResponse.json({ product: data })
  }

  // General field update — whitelist writable fields
  const allowed = ['name', 'sku', 'cost_price', 'sale_price', 'stock_qty', 'low_stock_threshold', 'unit', 'active', 'sector', 'expiry_date', 'batch_number', 'supplier', 'brand', 'category']
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

  // Log manual stock adjustment if stock_qty was explicitly changed
  if (updates.stock_qty !== undefined) {
    logPosAudit({ auth, event: 'inventory.adjusted', entityType: 'inventory', entityId: id,
      toValue: String(updates.stock_qty),
      metadata: { product_name: (data as any)?.name, new_qty: updates.stock_qty } })
  }

  return NextResponse.json({ product: data })
}
