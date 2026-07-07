import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// POST — mark a purchase order as paid to the supplier. Distinct from
// `status` (which tracks stock receipt) — this tracks invoice settlement,
// which the Zakat calculator reads to know which received orders are
// still real outstanding payables.
// Body: { amount? } — omit for full payment (amount_paid = total_cost);
// pass a specific amount for a partial payment. Payments accumulate;
// payment_status becomes 'paid' once amount_paid reaches total_cost.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'purchase_order.pay')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createServiceClient()
  const body = await req.json().catch(() => ({}))

  const { data: po, error } = await service
    .from('purchase_orders')
    .select('id, total_cost, amount_paid')
    .eq('id', params.id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!po) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const totalCost = Number(po.total_cost) || 0
  const requestedAmount = body?.amount != null ? Number(body.amount) : totalCost
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 })
  }

  const amountPaid = Math.min(totalCost, (Number(po.amount_paid) || 0) + requestedAmount)
  const paymentStatus = amountPaid >= totalCost ? 'paid' : 'partial'

  const { data: updated, error: updErr } = await service
    .from('purchase_orders')
    .update({
      amount_paid: amountPaid,
      payment_status: paymentStatus,
      paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
    })
    .eq('id', po.id)
    .eq('owner_id', auth.ownerId)
    .select('*, supplier:pos_suppliers(*), items:purchase_order_items(*)')
    .single()

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  logPosAudit({
    auth,
    event:      'purchase_order.paid',
    entityType: 'purchase_order',
    entityId:   po.id,
    metadata:   { amount: requestedAmount, payment_status: paymentStatus },
  })

  return NextResponse.json({ ok: true, purchase_order: updated })
}
