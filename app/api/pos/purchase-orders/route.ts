import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// GET — list purchase orders (newest first), with items + supplier joined
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'purchase_order.view')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || null
  const limit  = Math.min(200, parseInt(searchParams.get('limit') || '100'))

  let query = service
    .from('purchase_orders')
    .select('*, supplier:pos_suppliers(*), items:purchase_order_items(*)')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ purchase_orders: data })
}

interface IncomingItem {
  inventory_id?: string | null
  name?: string
  qty_ordered?: number | string
  unit_cost?: number | string
}

// POST — create a draft purchase order with its line items
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'purchase_order.create')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceClient()
  const body = await req.json()
  const { supplier_id, notes, expected_at, client_tx_id } = body
  const items: IncomingItem[] = Array.isArray(body.items) ? body.items : []

  if (items.length === 0) {
    return NextResponse.json({ error: 'at least one item required' }, { status: 400 })
  }

  // Idempotency: a replayed create (same client_tx_id) returns the existing PO
  // rather than inserting a duplicate. Backs the DB partial-unique index.
  if (client_tx_id) {
    const { data: existing } = await service
      .from('purchase_orders')
      .select('*, supplier:pos_suppliers(*), items:purchase_order_items(*)')
      .eq('owner_id', auth.ownerId)
      .eq('client_tx_id', client_tx_id)
      .maybeSingle()
    if (existing) return NextResponse.json({ purchase_order: existing, idempotent: true })
  }

  // Normalise line items and compute totals server-side (never trust the client total).
  const rows = items
    .map((i) => {
      const qty  = Math.max(0, parseFloat(String(i.qty_ordered)) || 0)
      const cost = Math.max(0, parseFloat(String(i.unit_cost)) || 0)
      return {
        inventory_id: i.inventory_id || null,
        name:         (i.name || '').trim(),
        qty_ordered:  qty,
        qty_received: 0,
        unit_cost:    cost,
        line_total:   Math.round(qty * cost * 100) / 100,
      }
    })
    .filter((r) => r.name && r.qty_ordered > 0)

  if (rows.length === 0) {
    return NextResponse.json({ error: 'items must have a name and qty > 0' }, { status: 400 })
  }

  const totalCost = Math.round(rows.reduce((sum, r) => sum + r.line_total, 0) * 100) / 100

  // Insert the PO header first, then its items. If the items insert fails we
  // delete the orphan header so a retry starts clean.
  const { data: po, error: poErr } = await service
    .from('purchase_orders')
    .insert({
      owner_id:     auth.ownerId,
      supplier_id:  supplier_id || null,
      status:       'draft',
      total_cost:   totalCost,
      notes:        notes?.trim() || null,
      expected_at:  expected_at || null,
      created_by:   auth.staffId || null,
      client_tx_id: client_tx_id || null,
    })
    .select()
    .single()

  if (poErr) return NextResponse.json({ error: poErr.message }, { status: 500 })

  const { error: itemsErr } = await service
    .from('purchase_order_items')
    .insert(rows.map((r) => ({ ...r, po_id: po.id })))

  if (itemsErr) {
    await service.from('purchase_orders').delete().eq('id', po.id).eq('owner_id', auth.ownerId)
    return NextResponse.json({ error: itemsErr.message }, { status: 500 })
  }

  logPosAudit({
    auth,
    event:      'purchase_order.created',
    entityType: 'purchase_order',
    entityId:   po.id,
    metadata:   { item_count: rows.length, total_cost: totalCost, supplier_id: supplier_id || null },
  })

  // Return the full PO with joins so the UI can render it immediately.
  const { data: full } = await service
    .from('purchase_orders')
    .select('*, supplier:pos_suppliers(*), items:purchase_order_items(*)')
    .eq('id', po.id)
    .single()

  return NextResponse.json({ purchase_order: full || po })
}
