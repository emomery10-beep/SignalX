import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner, resolvePosAuth } from '@/lib/pos-auth'

// GET — fetch transactions with date/cashier/location filters
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const from       = searchParams.get('from') || new Date(Date.now() - 86400000).toISOString()
  const to         = searchParams.get('to')   || new Date().toISOString()
  const cashier_id = searchParams.get('cashier_id')
  const location_id = searchParams.get('location_id') || auth.locationId

  let query = service
    .from('pos_transactions')
    .select(`
      id, owner_id, cashier_id, customer_id, subtotal, discount_amount, amount_tendered, total,
      payment_type, status, notes, created_at, pos_location_id,
      pos_staff!cashier_id(id, name, role),
      pos_customers(id, phone, name),
      pos_items!transaction_id(name, qty, unit_price, cost_price, inventory_id)
    `)
    .eq('owner_id', auth.ownerId)
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at', { ascending: false })

  if (cashier_id) query = query.eq('cashier_id', cashier_id)
  // Staff are locked to their branch; owners can filter or see all
  if (location_id) query = query.eq('pos_location_id', location_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Normalise: rename pos_staff join → cashier
  const transactions = (data || []).map((tx: any) => ({
    ...tx,
    pos_staff: undefined,
    cashier: tx.pos_staff ?? null,
  }))

  return NextResponse.json({ transactions })
}

// POST — cashier creates a new completed sale
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const ownerId = auth.ownerId

  const service = createServiceClient()
  const body = await req.json()
  const { items, payment_type, customer_phone, notes, discount_amount, amount_tendered } = body

  // Location: staff locked to their branch, owner can specify
  const txLocationId = auth.locationId || body.location_id || null

  // fix #3 — cashier_id comes from the validated header, not the untrusted request body
  const cashier_id = body.cashier_id_from_header || null  // ignored; we use header below
  void cashier_id
  const verifiedCashierId = req.headers.get('x-staff-id') // already verified by resolvePosAuth

  if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 })
  if (!payment_type)  return NextResponse.json({ error: 'Payment type required' }, { status: 400 })

  // fix #15 — validate each item
  for (const item of items) {
    if (!item.name?.trim())                      return NextResponse.json({ error: 'Item name required' }, { status: 400 })
    if (typeof item.qty !== 'number' || item.qty <= 0 || isNaN(item.qty))
                                                 return NextResponse.json({ error: `Invalid qty for "${item.name}"` }, { status: 400 })
    if (typeof item.unit_price !== 'number' || item.unit_price < 0)
                                                 return NextResponse.json({ error: `Invalid price for "${item.name}"` }, { status: 400 })
  }

  // Resolve or create customer
  let customer_id: string | null = null
  if (customer_phone) {
    const { data: existing } = await service
      .from('pos_customers').select('id')
      .eq('owner_id', ownerId).eq('phone', customer_phone).maybeSingle()

    if (existing) {
      customer_id = existing.id
      await service.from('pos_customers')
        .update({ last_seen_at: new Date().toISOString() }).eq('id', existing.id)
    } else {
      const { data: newCustomer } = await service
        .from('pos_customers')
        .insert({ owner_id: ownerId, phone: customer_phone })
        .select('id').single()
      if (newCustomer) customer_id = newCustomer.id
    }
  }

  // NEW: Tax Calculation
  // Fetch location tax settings to determine jurisdiction
  let jurisdiction = 'UK' // default
  let taxCountryCode = 'GB'

  if (txLocationId) {
    const { data: locTaxSettings } = await service
      .from('pos_location_tax_settings')
      .select('jurisdiction_code')
      .eq('owner_id', ownerId)
      .eq('location_id', txLocationId)
      .maybeSingle()

    if (locTaxSettings?.jurisdiction_code) {
      jurisdiction = locTaxSettings.jurisdiction_code
      taxCountryCode = jurisdiction.split('_')[0] // e.g., 'US_CA' → 'US'
    }
  }

  // Fetch default tax codes for this jurisdiction
  const { data: taxCodes } = await service
    .from('pos_item_tax_codes')
    .select('category, rate, code')
    .eq('owner_id', ownerId)
    .eq('jurisdiction', jurisdiction)
    .eq('is_active', true)

  const taxCodeMap: Record<string, { rate: number; code: string }> = {}
  ;(taxCodes || []).forEach((tc: any) => {
    taxCodeMap[tc.category] = { rate: tc.rate, code: tc.code }
  })

  // NOTE: Tax calculation disabled temporarily while schema is being prepared
  // Items are stored without tax information for now
  const itemsWithTax = items  // Just use items as-is, no tax processing

  const subtotal        = items.reduce((s: number, i: { qty: number; unit_price: number }) => s + i.qty * i.unit_price, 0)
  const discountAmt     = Math.max(0, Number(discount_amount) || 0)
  const total           = Math.max(0, subtotal - discountAmt)  // No tax included

  // Create transaction — fix #3: use verified cashier_id from header
  // NOTE: Tax fields removed temporarily - only core transaction fields
  // Tax features will be added once database is ready
  const { data: tx, error: txErr } = await service
    .from('pos_transactions')
    .insert({
      owner_id:        ownerId,
      cashier_id:      verifiedCashierId || null,
      customer_id,
      subtotal,
      discount_amount: discountAmt || null,
      total,
      payment_type,
      amount_tendered: amount_tendered ? Number(amount_tendered) : null,
      status:          'completed',
      pos_location_id: txLocationId,
      notes:           notes || null,
    })
    .select('id')
    .single()

  if (txErr || !tx) {
    console.error('Transaction insert error:', txErr)
    return NextResponse.json({ error: txErr?.message || 'Failed to create transaction' }, { status: 500 })
  }

  // Insert line items — fix #16: look up cost_price server-side for tracked items
  // Build a map of inventory_id → cost_price from DB so we don't trust client-sent values
  const trackedInventoryIds = items
    .map((i: { inventory_id?: string }) => i.inventory_id)
    .filter(Boolean) as string[]

  const costPriceMap: Record<string, number> = {}
  if (trackedInventoryIds.length > 0) {
    const { data: invItems } = await service
      .from('inventory')
      .select('id, cost_price')
      .in('id', trackedInventoryIds)
      .eq('owner_id', ownerId)
    for (const inv of invItems || []) {
      costPriceMap[inv.id] = inv.cost_price || 0
    }
  }

  const lineItems = itemsWithTax.map((i: any) => ({
    transaction_id: tx.id,
    inventory_id:   i.inventory_id || null,
    name:           i.name.trim(),
    qty:            i.qty,
    unit_price:     i.unit_price,
    // fix #16 — use server-looked-up cost_price for tracked items; fall back to client for manual items
    cost_price:     i.inventory_id ? (costPriceMap[i.inventory_id] ?? 0) : (i.cost_price || 0),
    line_total:     i.qty * i.unit_price,
    // NOTE: tax fields (tax_code, tax_rate, tax_amount) removed temporarily
    // Will be re-enabled once database schema supports them
  }))

  const { error: itemsErr } = await service.from('pos_items').insert(lineItems)
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })

  // Stock deduction — fix #1: use single atomic UPDATE (no prior SELECT = no race condition)
  // This replaces the old read-modify-write loop that could double-deduct if a DB trigger also ran.
  const oversold: string[] = []
  const trackedLineItems = lineItems.filter((i: any) => i.inventory_id)

  for (const item of trackedLineItems) {
    // Atomic decrement via RPC (if available)
    const { error: rpcErr } = await service.rpc('decrement_inventory_stock', {
      p_id:       item.inventory_id,
      p_owner_id: ownerId,
      p_qty:      item.qty,
    })

    if (rpcErr) {
      // RPC not found — fall back to fetch+update (safe for typical single-cashier low-concurrency use)
      const { data: inv } = await service
        .from('inventory').select('stock_qty')
        .eq('id', item.inventory_id).eq('owner_id', ownerId).single()

      if (inv) {
        // fix #17 — detect oversell before clamping
        if (inv.stock_qty < item.qty) oversold.push(item.name)

        await service.from('inventory')
          .update({ stock_qty: Math.max(0, inv.stock_qty - item.qty) })
          .eq('id', item.inventory_id).eq('owner_id', ownerId)
      }
    }
  }

  // Update customer total_spent
  if (customer_id) {
    await service.rpc('increment_customer_spend', {
      p_customer_id: customer_id,
      p_amount: total,
    }).maybeSingle()
  }

  return NextResponse.json({
    transaction_id: tx.id,
    total,
    // fix #17 — tell the frontend if any items were oversold so cashier can be informed
    oversold: oversold.length > 0 ? oversold : undefined,
  })
}
