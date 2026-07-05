import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'
import { sendPurchaseOrder, waLink } from '@/lib/whatsapp'
import type { PurchaseOrderItem } from '@/lib/purchase-order-types'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// Whole numbers render clean; decimals keep up to 3 places (kg / litre items).
function fmtQty(n: number): string {
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(3)))
}

function buildPoText(items: PurchaseOrderItem[], supplierName: string | null, totalCost: number, notes: string | null): string {
  const header = supplierName ? `Purchase Order for ${supplierName}` : 'Purchase Order'
  const lines = items.map((it) => {
    const qty = fmtQty(Number(it.qty_ordered) || 0)
    return it.unit_cost ? `• ${it.name} x ${qty} @ ${it.unit_cost}` : `• ${it.name} x ${qty}`
  })
  const parts = [header, '', ...lines, '', `Total: ${totalCost}`]
  if (notes) parts.push('', `Notes: ${notes}`)
  return parts.join('\n')
}

// POST — send a PO to its supplier over WhatsApp.
// Attempts a server-side template send; always returns a wa.me link so the
// owner can send manually if the template isn't approved yet.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'purchase_order.send')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceClient()

  const { data: po, error } = await service
    .from('purchase_orders')
    .select('*, supplier:pos_suppliers(*), items:purchase_order_items(*)')
    .eq('id', params.id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!po) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (po.status === 'cancelled' || po.status === 'received') {
    return NextResponse.json({ error: `Cannot send a ${po.status} order` }, { status: 400 })
  }

  const supplier = po.supplier
  if (!supplier?.phone) {
    // Distinct code so the UI can prompt "add a WhatsApp number to this supplier".
    return NextResponse.json({ error: 'supplier_no_phone' }, { status: 400 })
  }

  const text = buildPoText(po.items || [], supplier.name, po.total_cost, po.notes)
  const link = waLink(supplier.phone, text)

  const sendResult = await sendPurchaseOrder(supplier.phone, text)
  const sentVia = sendResult.ok ? 'whatsapp' : 'link'

  // Mark ordered on first send; keep status on re-send. Always refresh sent_at.
  const nextStatus = po.status === 'draft' ? 'ordered' : po.status
  const { data: updated, error: updErr } = await service
    .from('purchase_orders')
    .update({ status: nextStatus, sent_at: new Date().toISOString() })
    .eq('id', po.id)
    .eq('owner_id', auth.ownerId)
    .select('*, supplier:pos_suppliers(*), items:purchase_order_items(*)')
    .single()

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  logPosAudit({
    auth,
    event:      'purchase_order.sent',
    entityType: 'purchase_order',
    entityId:   po.id,
    metadata:   { sent_via: sentVia, supplier_id: supplier.id, template_error: sendResult.ok ? null : sendResult.error },
  })

  return NextResponse.json({
    ok:             true,
    sent_via:       sentVia,
    wa_link:        link,
    template_error: sendResult.ok ? null : sendResult.error,
    purchase_order: updated,
  })
}
