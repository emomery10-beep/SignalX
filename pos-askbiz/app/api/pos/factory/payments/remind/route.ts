import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'
import { moneySchemaReady } from '@/lib/factory-parties'
import { computeMoney } from '@/lib/factory-money'
import { ownerFactoryTimeZone } from '@/lib/factory-time'
import { sendCustomerWhatsApp } from '@/lib/factory-dispatch-whatsapp'

// POST /api/pos/factory/payments/remind { capture_id } — a polite WhatsApp payment reminder to the customer on one
// unpaid dispatch. Always a deliberate click by the production manager or owner (never automatic), at most one
// reminder per dispatch per 24 hours, and every send is audited.
export const dynamic = 'force-dynamic'
export async function OPTIONS() { return new NextResponse(null, { status: 204 }) }
const json = (d: unknown, status = 200) => NextResponse.json(d, { status })
const DAY_MS = 24 * 3600 * 1000

export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'capture.approve_dispatch')) return json({ error: 'Only the production manager or owner can send payment reminders' }, 403)
  const body = await req.json().catch(() => ({}))
  if (typeof body.capture_id !== 'string') return json({ error: 'capture_id required' }, 400)
  const service = createServiceClient()
  if (!(await moneySchemaReady(service))) return json({ error: 'Payments are not set up yet' }, 503)

  const { data: cap } = await service.from('pos_factory_captures')
    .select('id, type, status, location_id, party_id, product_name, quantity, dispatch_price, due_date, created_at, approved_at, customer_phone, buyer_name')
    .eq('id', body.capture_id).eq('owner_id', auth.ownerId).maybeSingle()
  if (!cap || cap.type !== 'dispatch' || cap.status !== 'approved') return json({ error: 'Only an approved dispatch can have a payment reminder' }, 400)

  const [{ data: pays }, { data: party }, { data: profile }] = await Promise.all([
    service.from('pos_factory_payments').select('capture_id, direction, amount, paid_at').eq('capture_id', cap.id),
    cap.party_id ? service.from('pos_factory_parties').select('id, name, phone').eq('id', cap.party_id).eq('owner_id', auth.ownerId).maybeSingle() : Promise.resolve({ data: null as any }),
    service.from('profiles').select('business_name, currency_symbol').eq('id', auth.ownerId).maybeSingle(),
  ])
  const tz = await ownerFactoryTimeZone(service, auth.ownerId)
  const report = computeMoney([cap as any], (pays || []) as any[], party ? [party as any] : [], Date.now(), tz)
  const item = report.receivables[0]
  if (!item) return json({ error: 'Nothing is outstanding on this dispatch' }, 400)

  const phone = (cap as any).customer_phone || party?.phone || (/^[+\d][\d\s()+-]{6,}$/.test(String((cap as any).buyer_name || '')) ? (cap as any).buyer_name : null)
  if (!phone) return json({ error: 'No phone number for this customer. Add one on the dispatch first.' }, 400)

  const { data: recent } = await service.from('pos_audit_log').select('created_at')
    .eq('owner_id', auth.ownerId).eq('event', 'payment.reminder_sent').eq('entity_id', cap.id)
    .gte('created_at', new Date(Date.now() - DAY_MS).toISOString()).limit(1)
  if (recent && recent.length > 0) return json({ error: 'A reminder for this dispatch was already sent in the last 24 hours' }, 429)

  const symbol = profile?.currency_symbol || ''
  const amount = symbol + Math.round(item.outstanding).toLocaleString('en-US')
  const business = profile?.business_name || 'us'
  const when = item.days_overdue > 0 ? 'was due on ' + item.due_date + ' and is now ' + item.days_overdue + ' days late' : 'is due on ' + item.due_date
  const text = 'Payment reminder from ' + business + (party?.name ? ' for ' + party.name : '') + ': ' + amount + ' for ' + (cap.product_name || 'your order') + ' ' + when + '. Please pay or reply to arrange. Thank you.'
  const sent = await sendCustomerWhatsApp(auth.ownerId, phone, text)
  if (!sent.success) return json({ error: sent.error || 'WhatsApp could not send this reminder' }, 502)
  logPosAudit({ auth, event: 'payment.reminder_sent', entityType: 'factory_capture', entityId: cap.id, toValue: String(Math.round(item.outstanding)), metadata: { days_overdue: item.days_overdue } })
  return json({ ok: true })
}
