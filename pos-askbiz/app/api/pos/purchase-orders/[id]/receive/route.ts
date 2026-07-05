import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

interface Receipt { item_id: string; qty: number | string }

// POST — receive stock against a PO.
// Body: { receipts: [{ item_id, qty }], client_tx_id? }  where qty is the
// amount received in THIS delivery. Each line increments inventory via the
// atomic, idempotent increment_inventory_stock RPC; qty_received is bumped and
// the PO status recomputed (partial / received). Back-orders fall out of
// qty_ordered − qty_received. Safe to retry: each line is guarded by a distinct
// client_tx_id so a replay converges to a single applied receipt.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'purchase_order.receive')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceClient()
  const body = await req.json()
  const clientTxId: string = body.client_tx_id || randomUUID()
  const rawReceipts: Receipt[] = Array.isArray(body.receipts) ? body.receipts : []

  // Dedup by item_id (last wins) so a duplicated line can't double-apply.
  const wanted = new Map<string, number>()
  for (const r of rawReceipts) {
    const qty = Math.max(0, parseFloat(String(r.qty)) || 0)
    if (r.item_id && qty > 0) wanted.set(r.item_id, qty)
  }
  if (wanted.size === 0) {
    return NextResponse.json({ error: 'no quantities to receive' }, { status: 400 })
  }

  const { data: po, error } = await service
    .from('purchase_orders')
    .select('*, items:purchase_order_items(*)')
    .eq('id', params.id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!po) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (po.status === 'cancelled') {
    return NextResponse.json({ error: 'Cannot receive a cancelled order' }, { status: 400 })
  }

  const itemsById = new Map<string, { id: string; inventory_id: string | null; qty_received: number }>(
    (po.items || []).map((i: { id: string; inventory_id: string | null; qty_received: number }) => [i.id, i]),
  )

  // Idempotency pre-check: which of these line receipts already landed?
  const itemTxIds = [...wanted.keys()].map((itemId) => `${clientTxId}:${itemId}`)
  const { data: appliedLogs } = await service
    .from('pos_audit_log')
    .select('client_tx_id')
    .eq('owner_id', auth.ownerId)
    .eq('event', 'inventory.restocked')
    .in('client_tx_id', itemTxIds)
  const applied = new Set<string>((appliedLogs || []).map((l: { client_tx_id: string }) => l.client_tx_id))

  for (const [itemId, qty] of wanted) {
    const item = itemsById.get(itemId)
    if (!item) continue // line doesn't belong to this PO
    const itemTx = `${clientTxId}:${itemId}`
    if (applied.has(itemTx)) continue // already received on a prior (retried) call

    // Increment inventory atomically + idempotently. The RPC writes its own
    // inventory.restocked audit row (keyed by itemTx) — that's also what the
    // pre-check above reads, so retries never double-apply.
    if (item.inventory_id) {
      const { error: rpcErr } = await service.rpc('increment_inventory_stock', {
        p_id:         item.inventory_id,
        p_owner_id:   auth.ownerId,
        p_qty:        qty,
        p_client_tx_id: itemTx,
        p_staff_id:   auth.staffId,
        p_staff_role: auth.role,
      })

      if (rpcErr) {
        // RPC unavailable (or it rolled back on a concurrent idempotency clash).
        // Non-atomic fallback: the audit row is the idempotency CLAIM — insert
        // it FIRST. If it violates the unique (owner_id, client_tx_id) index,
        // another call already applied this line, so we must NOT increment
        // again (this is what prevents a concurrent-retry double-count).
        const { error: claimErr } = await service.from('pos_audit_log').insert({
          owner_id: auth.ownerId, staff_id: auth.staffId, staff_role: auth.role,
          event: 'inventory.restocked', entity_type: 'inventory', entity_id: item.inventory_id,
          to_value: String(qty), metadata: { added_qty: qty, via: 'po_receive_fallback' },
          client_tx_id: itemTx,
        })
        if (!claimErr) {
          const { data: cur } = await service
            .from('inventory')
            .select('stock_qty')
            .eq('id', item.inventory_id)
            .eq('owner_id', auth.ownerId)
            .single()
          if (cur) {
            await service
              .from('inventory')
              .update({ stock_qty: (Number(cur.stock_qty) || 0) + qty })
              .eq('id', item.inventory_id)
              .eq('owner_id', auth.ownerId)
          }
        }
      }
    }

    // Bump the received quantity on the line (only for not-yet-applied lines).
    await service
      .from('purchase_order_items')
      .update({ qty_received: (Number(item.qty_received) || 0) + qty })
      .eq('id', itemId)

    applied.add(itemTx)
  }

  // Recompute status from the fresh line quantities.
  const { data: freshItems } = await service
    .from('purchase_order_items')
    .select('qty_ordered, qty_received')
    .eq('po_id', po.id)

  const rows = freshItems || []
  const allReceived = rows.length > 0 && rows.every((i: { qty_ordered: number; qty_received: number }) => Number(i.qty_received) >= Number(i.qty_ordered))
  const anyReceived = rows.some((i: { qty_received: number }) => Number(i.qty_received) > 0)
  const nextStatus = allReceived ? 'received' : anyReceived ? 'partial' : po.status

  const patch: { status: string; received_at?: string } = { status: nextStatus }
  if (allReceived) patch.received_at = new Date().toISOString()

  const { data: updated, error: updErr } = await service
    .from('purchase_orders')
    .update(patch)
    .eq('id', po.id)
    .eq('owner_id', auth.ownerId)
    .select('*, supplier:pos_suppliers(*), items:purchase_order_items(*)')
    .single()

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  logPosAudit({
    auth,
    event:      'purchase_order.received',
    entityType: 'purchase_order',
    entityId:   po.id,
    metadata:   { lines: wanted.size, status: nextStatus },
  })

  return NextResponse.json({ ok: true, purchase_order: updated })
}
