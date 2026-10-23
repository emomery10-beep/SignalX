import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'
import { moneySchemaReady } from '@/lib/factory-parties'
import { computeMoney } from '@/lib/factory-money'
import { ownerFactoryTimeZone } from '@/lib/factory-time'
import { parseOptionalAmount, clipText, MAX_MONEY } from '@/lib/pos-input'

// /api/pos/factory/payments — the Factory money loop.
//   GET    → who owes the factory (receivables) and whom the factory owes (payables), aged
//   POST   → record a payment against an approved dispatch ('in') or raw-material delivery ('out')
//   DELETE → reverse a mistaken payment (production manager / owner only; audited)
// Receivables carry sale prices, so they are limited to the roles that may see dispatch prices.

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
const json = (data: unknown, status = 200) => NextResponse.json(data, { status })
const METHODS = ['cash', 'mobile_money', 'bank', 'cheque', 'other']

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  const canSeeAr = hasPermission(auth.role, 'capture.approve_dispatch')
  const canSeeAp = canSeeAr || hasPermission(auth.role, 'capture.approve')
  if (!canSeeAp) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  if (!(await moneySchemaReady(service))) return json({ ready: false, receivables: [], payables: [], arTotal: 0, apTotal: 0, arOverdue: 0, apOverdue: 0, aging: { current: 0, overdue_30: 0, overdue_60: 0, overdue_90: 0 }, parties: [] })

  const locationId = new URL(req.url).searchParams.get('location_id') || auth.locationId
  let capQ = service.from('pos_factory_captures')
    .select('id, type, status, location_id, party_id, product_name, quantity, dispatch_price, param_label, param_value, due_date, created_at, approved_at')
    .eq('owner_id', auth.ownerId).eq('status', 'approved').in('type', ['dispatch', 'intake_arrival']).limit(20000)
  if (locationId && /^[0-9a-f-]{36}$/i.test(locationId)) capQ = capQ.eq('location_id', locationId)
  const [{ data: caps }, { data: pays }, { data: parties }] = await Promise.all([
    capQ,
    service.from('pos_factory_payments').select('capture_id, direction, amount, paid_at').eq('owner_id', auth.ownerId).limit(50000),
    service.from('pos_factory_parties').select('id, kind, name, phone').eq('owner_id', auth.ownerId),
  ])
  const tz = await ownerFactoryTimeZone(service, auth.ownerId)
  const report = computeMoney((caps || []) as any[], (pays || []) as any[], (parties || []) as any[], Date.now(), tz)

  // Role split: an inventory manager sees what the factory owes suppliers, not what customers owe it.
  const out = canSeeAr
    ? report
    : { ...report, receivables: [], arTotal: 0, arOverdue: 0, aging: { current: 0, overdue_30: 0, overdue_60: 0, overdue_90: 0 } }
  return json({ ready: true, ...out, parties: (parties || []).filter((p: any) => canSeeAr || p.kind === 'supplier') })
}

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  const body = await req.json().catch(() => ({}))
  const service = createServiceClient()
  if (!(await moneySchemaReady(service))) return json({ error: 'Payments are not set up yet' }, 503)

  const amount = parseOptionalAmount(body.amount, 'amount', MAX_MONEY)
  if (!amount.ok || !amount.value || amount.value <= 0) return json({ error: amount.error || 'Enter an amount greater than 0' }, 400)
  if (typeof body.capture_id !== 'string') return json({ error: 'capture_id required' }, 400)
  const method = METHODS.includes(body.method) ? body.method : 'cash'

  const { data: cap } = await service.from('pos_factory_captures')
    .select('id, type, status, location_id, party_id, quantity, dispatch_price, param_label, param_value')
    .eq('id', body.capture_id).eq('owner_id', auth.ownerId).maybeSingle()
  if (!cap || cap.status !== 'approved' || !['dispatch', 'intake_arrival'].includes(cap.type)) return json({ error: 'Only an approved dispatch or raw-material delivery can take a payment' }, 400)
  const direction = cap.type === 'dispatch' ? 'in' : 'out'
  if (!hasPermission(auth.role, direction === 'in' ? 'capture.approve_dispatch' : 'capture.approve')) return json({ error: 'Your role cannot record this payment' }, 403)

  const unitPrice = direction === 'in' ? Number(cap.dispatch_price) : (cap.param_label === 'intake_price_per_kg' ? Number(cap.param_value) : 0)
  const total = (Number(cap.quantity) || 0) * (unitPrice || 0)
  const { data: prior } = await service.from('pos_factory_payments').select('amount').eq('capture_id', cap.id).eq('direction', direction)
  const outstanding = total - (prior || []).reduce((s: number, p: any) => s + Number(p.amount), 0)
  if (amount.value > outstanding + 0.005) return json({ error: `Only ${Math.max(0, Math.round(outstanding * 100) / 100)} is still outstanding on this one` }, 400)

  const clientTxId = typeof body.client_tx_id === 'string' && body.client_tx_id.length <= 64 ? body.client_tx_id : null
  const { data: payment, error } = await service.from('pos_factory_payments').insert({
    owner_id: auth.ownerId, location_id: cap.location_id || null, capture_id: cap.id, party_id: cap.party_id || null,
    direction, amount: amount.value, method, reference: clipText(body.reference, 120),
    recorded_by: auth.staffId || null, client_tx_id: clientTxId,
  }).select('*').single()
  if (error) {
    if ((error as any).code === '23505' && clientTxId) return json({ ok: true, deduped: true })
    return json({ error: error.message }, 500)
  }
  logPosAudit({ auth, event: 'payment.recorded', entityType: 'factory_capture', entityId: cap.id, toValue: String(amount.value), metadata: { direction, method, payment_id: payment.id } })
  return json({ ok: true, payment }, 201)
}

export async function DELETE(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'capture.approve_dispatch')) return json({ error: 'Only the production manager or owner can reverse a payment' }, 403)
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return json({ error: 'id required' }, 400)
  const service = createServiceClient()
  const { data: pay } = await service.from('pos_factory_payments').select('id, capture_id, direction, amount, recorded_by').eq('id', id).eq('owner_id', auth.ownerId).maybeSingle()
  if (!pay) return json({ error: 'Payment not found' }, 404)
  if (auth.staffId && pay.recorded_by === auth.staffId) return json({ error: 'You cannot reverse a payment you recorded. Ask another approver.' }, 403)
  const { error } = await service.from('pos_factory_payments').delete().eq('id', id).eq('owner_id', auth.ownerId)
  if (error) return json({ error: error.message }, 500)
  logPosAudit({ auth, event: 'payment.recorded', entityType: 'factory_capture', entityId: pay.capture_id, fromValue: String(pay.amount), toValue: '0', metadata: { reversed: true, direction: pay.direction, payment_id: id } })
  return json({ ok: true })
}
