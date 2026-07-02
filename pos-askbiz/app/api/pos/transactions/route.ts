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
      pos_items!transaction_id(id, name, qty, unit_price, cost_price, inventory_id, line_total, refunded)
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

// PATCH — finalise a pending transaction after card/mobile payment resolves
// status='paid'  → mark completed + paid
// status='failed' → mark void + failed (removes it from sales records)
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { transaction_id, status } = await req.json()
  if (!transaction_id) return NextResponse.json({ error: 'transaction_id required' }, { status: 400 })

  const allowed = ['paid', 'failed']
  if (!allowed.includes(status)) return NextResponse.json({ error: 'status must be paid or failed' }, { status: 400 })

  const updates = status === 'paid'
    ? { status: 'completed', payment_status: 'paid' }
    : { status: 'void', payment_status: 'failed' }

  const { error } = await service
    .from('pos_transactions')
    .update(updates)
    .eq('id', transaction_id)
    .eq('owner_id', auth.ownerId)
    .eq('status', 'pending') // safety: only touch pending — never overwrite a completed transaction

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

// POST — cashier creates a new completed sale
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const ownerId = auth.ownerId

  const service = createServiceClient()
  const body = await req.json()
  const { items, payment_type, customer_phone, notes, discount_amount, amount_tendered, shift_id, initial_payment_status } = body

  // Idempotency: a client_tx_id makes retries and offline-queue replays safe.
  // Dedupe before doing anything with money or stock.
  const clientTxId = (typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64) ? body.client_tx_id : null
  if (clientTxId) {
    try {
      const { data: dupe, error: dupeErr } = await service
        .from('pos_transactions')
        .select('id, total')
        .eq('owner_id', ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      // dupeErr means the client_tx_id column isn't in the live schema yet — behave as before
      if (!dupeErr && dupe) {
        return NextResponse.json({ transaction_id: dupe.id, total: dupe.total, deduped: true })
      }
    } catch { /* dedupe is best-effort — never block a sale on it */ }
  }

  // shift_id is a uuid column — ignore client-side placeholder ids like
  // "shift_1781595035263_mxnf5" so a sale never fails on a bad shift id.
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const safeShiftId = (typeof shift_id === 'string' && UUID_RE.test(shift_id)) ? shift_id : null

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

  // Look up cost_price + category server-side for tracked items — cost so we
  // don't trust client-sent values (fix #16), category to map items to tax codes.
  const trackedInventoryIds = items
    .map((i: { inventory_id?: string }) => i.inventory_id)
    .filter(Boolean) as string[]

  const costPriceMap: Record<string, number> = {}
  const categoryMap: Record<string, string> = {}
  if (trackedInventoryIds.length > 0) {
    const { data: invItems } = await service
      .from('inventory')
      .select('id, cost_price, category')
      .in('id', trackedInventoryIds)
      .eq('owner_id', ownerId)
    for (const inv of invItems || []) {
      costPriceMap[inv.id] = inv.cost_price || 0
      if (inv.category) categoryMap[inv.id] = String(inv.category).toLowerCase()
    }
  }

  // Tax is INCLUSIVE of the sale price (VAT model): we back the tax component
  // out of the gross, so the customer total is identical with or without tax
  // codes configured. No codes for this jurisdiction → items carry no tax,
  // exactly the previous behaviour.
  const itemsWithTax = items.map((i: any) => {
    const cat = (i.inventory_id && categoryMap[i.inventory_id]) || ''
    const code = taxCodeMap[cat] || taxCodeMap['general_merchandise']
    if (!code || !(code.rate > 0)) return { ...i, tax_code: code?.code || null, tax_rate: code?.rate ?? null, tax_amount: code ? 0 : null }
    const lineGross = i.qty * i.unit_price
    const taxAmount = Math.round((lineGross - lineGross / (1 + code.rate / 100)) * 100) / 100
    return { ...i, tax_code: code.code, tax_rate: code.rate, tax_amount: taxAmount }
  })
  const totalTax = Math.round(itemsWithTax.reduce((s: number, i: any) => s + (i.tax_amount || 0), 0) * 100) / 100

  const subtotal        = items.reduce((s: number, i: { qty: number; unit_price: number }) => s + i.qty * i.unit_price, 0)
  const discountAmt     = Math.max(0, Number(discount_amount) || 0)
  const total           = Math.max(0, subtotal - discountAmt)  // tax-inclusive — unchanged by tax recording

  // Create transaction — fix #3: use verified cashier_id from header
  const txRow: Record<string, unknown> = {
    owner_id:        ownerId,
    cashier_id:      verifiedCashierId || null,
    customer_id,
    subtotal,
    discount_amount: discountAmt || null,
    total,
    payment_type,
    amount_tendered: amount_tendered ? Number(amount_tendered) : null,
    // cash = completed immediately; card/mobile = pending until payment webhook/polling confirms
    status:          initial_payment_status === 'paid' ? 'completed' : 'pending',
    payment_status:  initial_payment_status === 'paid' ? 'paid' : 'pending',
    pos_location_id: txLocationId,
    shift_id:        safeShiftId,
    notes:           notes || null,
  }
  if (clientTxId) txRow.client_tx_id = clientTxId
  if (totalTax > 0) {
    txRow.total_tax               = totalTax
    txRow.tax_jurisdiction        = jurisdiction
    txRow.tax_country_code        = taxCountryCode
    txRow.tax_calculation_version = 'v1_inclusive'
  }

  let { data: tx, error: txErr } = await service
    .from('pos_transactions')
    .insert(txRow)
    .select('id')
    .single()

  if (txErr) {
    // 23505 = unique violation: a concurrent retry already recorded this sale — return it
    if (clientTxId && txErr.code === '23505') {
      const { data: dupe } = await service
        .from('pos_transactions')
        .select('id, total')
        .eq('owner_id', ownerId)
        .eq('client_tx_id', clientTxId)
        .maybeSingle()
      if (dupe) return NextResponse.json({ transaction_id: dupe.id, total: dupe.total, deduped: true })
    }
    // Live schema may predate the client_tx_id / tax migrations — a sale must
    // never fail because an optional column is missing. Retry with core fields only.
    if (/client_tx_id|total_tax|tax_jurisdiction|tax_country_code|tax_calculation_version|column|schema cache/i.test(txErr.message || '')) {
      delete txRow.client_tx_id
      delete txRow.total_tax
      delete txRow.tax_jurisdiction
      delete txRow.tax_country_code
      delete txRow.tax_calculation_version
      ;({ data: tx, error: txErr } = await service
        .from('pos_transactions')
        .insert(txRow)
        .select('id')
        .single())
    }
  }

  if (txErr || !tx) {
    console.error('Transaction insert error:', txErr)
    return NextResponse.json({ error: txErr?.message || 'Failed to create transaction' }, { status: 500 })
  }

  // Insert line items (inventory cost/category map was built above, pre-insert)
  const lineItems = itemsWithTax.map((i: any) => ({
    transaction_id: tx.id,
    inventory_id:   i.inventory_id || null,
    name:           i.name.trim(),
    qty:            i.qty,
    unit_price:     i.unit_price,
    // fix #16 — use server-looked-up cost_price for tracked items; fall back to client for manual items
    cost_price:     i.inventory_id ? (costPriceMap[i.inventory_id] ?? 0) : (i.cost_price || 0),
    line_total:     i.qty * i.unit_price,
    tax_code:       i.tax_code ?? null,
    tax_rate:       i.tax_rate ?? null,
    tax_amount:     i.tax_amount ?? null,
  }))

  let { error: itemsErr } = await service.from('pos_items').insert(lineItems)
  if (itemsErr && /tax_code|tax_rate|tax_amount|column|schema cache/i.test(itemsErr.message || '')) {
    // pos_items tax columns not in the live schema yet — store core fields only
    ;({ error: itemsErr } = await service.from('pos_items').insert(
      lineItems.map(({ tax_code, tax_rate, tax_amount, ...core }: any) => core)
    ))
  }
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 })

  // Immutable tax audit trail — best-effort, never blocks the sale
  if (totalTax > 0) {
    try {
      await service.from('pos_tax_audit_log').insert({
        owner_id:       ownerId,
        transaction_id: tx.id,
        items_json:     itemsWithTax.map((i: any) => ({ name: i.name, qty: i.qty, unit_price: i.unit_price, tax_code: i.tax_code, tax_rate: i.tax_rate, tax_amount: i.tax_amount })),
        subtotal,
        total_tax:      totalTax,
        total,
        jurisdiction,
        tax_calculation_version: 'v1_inclusive',
      })
    } catch { /* audit log missing/unreachable — the sale still stands */ }
  }

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
