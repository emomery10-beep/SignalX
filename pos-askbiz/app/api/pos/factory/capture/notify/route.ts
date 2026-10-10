import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { logPosAudit } from '@/lib/pos-audit'
import { sendDispatchWhatsApp, cleanWhatsAppNumber } from '@/lib/factory-dispatch-whatsapp'

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// POST — approver sends the customer an "awaiting approval" WhatsApp for a
// pending dispatch capture, before signing it off.
// Body: { id, phone? }  (phone overrides the number the dispatcher logged)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'capture.approve_dispatch')) {
    return json({ error: 'Only the production manager or owner can notify dispatch customers' }, 403)
  }

  const { id, phone } = await req.json().catch(() => ({}))
  if (!id) return json({ error: 'id required' }, 400)

  const service = createServiceClient()
  const { data: capture } = await service
    .from('pos_factory_captures')
    .select('id, type, status, product_name, quantity, notes, buyer_name')
    .eq('id', id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!capture) return json({ error: 'Capture not found' }, 404)
  if (capture.type !== 'dispatch') return json({ error: 'Only dispatch captures can be notified' }, 400)
  if (capture.status !== 'pending') return json({ error: `Capture is already ${capture.status}` }, 400)

  const number = cleanWhatsAppNumber(phone) || cleanWhatsAppNumber(capture.buyer_name)
  if (number.length < 8) return json({ error: 'Enter a valid WhatsApp number' }, 400)

  const result = await sendDispatchWhatsApp(auth.ownerId, number, {
    kind: 'pending',
    productName: capture.product_name,
    quantity: capture.quantity,
    destination: capture.notes,
  })
  if (!result.success) return json({ error: result.error || 'WhatsApp send failed' }, 502)

  // Keep the number on the capture so the approval message reaches it too.
  if (number !== cleanWhatsAppNumber(capture.buyer_name)) {
    await service.from('pos_factory_captures').update({ buyer_name: number }).eq('id', id).eq('owner_id', auth.ownerId)
  }

  logPosAudit({
    auth,
    event: 'capture.dispatch_notified',
    entityType: 'factory_capture', entityId: id,
    metadata: { kind: 'pending' },
  })

  return json({ ok: true })
}
