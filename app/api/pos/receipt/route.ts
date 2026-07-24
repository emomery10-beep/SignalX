import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { sendReceipt } from '@/lib/whatsapp'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

type ConsentChannel = 'whatsapp' | 'sms' | 'email'

/**
 * GDPR consent gate. Returns true ONLY when the customer record clearly exists
 * AND the relevant channel's marketing-consent flag is explicitly false (hard
 * opt-out). Defensive: any DB error or missing record → returns false (proceed),
 * so the consent lookup can never crash the send path.
 *
 * Consent flags live on pos_customer_preferences (keyed by customer_id); the
 * customer is resolved from pos_customers by recipient phone/email + owner_id.
 */
async function isCustomerOptedOut(
  service: ReturnType<typeof createServiceClient>,
  ownerId: string,
  channel: ConsentChannel,
  recipient: { phone?: string | null; email?: string | null }
): Promise<boolean> {
  try {
    let customerQuery = service.from('pos_customers').select('id').eq('owner_id', ownerId)
    if (channel === 'email' && recipient.email) {
      customerQuery = customerQuery.eq('email', recipient.email)
    } else if (recipient.phone) {
      customerQuery = customerQuery.eq('phone', recipient.phone)
    } else {
      return false
    }

    const { data: customer } = await customerQuery.maybeSingle()
    if (!customer?.id) return false // no matching customer → proceed

    const column =
      channel === 'email'
        ? 'allow_email_marketing'
        : channel === 'sms'
          ? 'allow_sms_marketing'
          : 'allow_whatsapp_marketing'

    const { data: prefs } = await service
      .from('pos_customer_preferences')
      .select(column)
      .eq('owner_id', ownerId)
      .eq('customer_id', customer.id)
      .maybeSingle()

    // Only block on an EXPLICIT false. null / missing prefs → proceed.
    return (prefs as Record<string, boolean | null> | null)?.[column] === false
  } catch {
    return false // never let a consent-lookup error block a legitimate send
  }
}

export async function POST(req: NextRequest) {
  // fix #2 — add authentication; previously this endpoint was completely open
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { transaction_id, phone } = await req.json()
  if (!transaction_id || !phone) {
    return NextResponse.json({ error: 'transaction_id and phone required' }, { status: 400 })
  }

  // Was a single query embedding profiles via
  // `profiles!pos_transactions_owner_id_fkey(...)` — that hint names the real
  // FK (pos_transactions.owner_id -> auth.users), but PostgREST embeds need a
  // DIRECT FK to the embedded table, and there's no direct
  // pos_transactions -> profiles constraint (only the indirect path through
  // auth.users, which PostgREST can't traverse). That made the whole query
  // fail with PGRST200 on every call, surfaced here as a misleading
  // "Transaction not found" — receipts were never reaching sendReceipt().
  // ownerId is already authenticated above, so no join is needed at all.
  const { data: tx, error } = await service
    .from('pos_transactions')
    .select(`*, pos_items(*)`)
    .eq('id', transaction_id)
    .eq('owner_id', ownerId)   // fix #2 — scope to authenticated owner, prevents UUID enumeration
    .single()

  if (error || !tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

  const { data: profile } = await service
    .from('profiles')
    .select('business_name, currency_symbol')
    .eq('id', ownerId)
    .maybeSingle()

  const symbol       = profile?.currency_symbol || '£'
  const businessName = profile?.business_name || 'The Shop'
  const date         = new Date(tx.created_at).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  // GDPR consent gate — receipts are transactional, but still honour a hard
  // WhatsApp opt-out if the customer has explicitly set allow_whatsapp_marketing=false.
  if (await isCustomerOptedOut(service, ownerId, 'whatsapp', { phone })) {
    return NextResponse.json({ sent: false, skipped: true, reason: 'customer opted out' })
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'
  const { ok, error: waError } = await sendReceipt(phone, {
    total: `${symbol}${Number(tx.total).toFixed(2)}`,
    businessName,
    date,
    paymentType: tx.payment_type,
    imageUrl: `${baseUrl}/api/pos/receipt/${transaction_id}/image`,
  })
  // fix #18 — check ok and return error to caller; previously HTTP errors were swallowed
  if (!ok) {
    return NextResponse.json({ error: waError || 'Failed to send WhatsApp receipt' }, { status: 500 })
  }

  await service.from('pos_transactions').update({ receipt_sent: true }).eq('id', transaction_id)

  return NextResponse.json({ sent: true })
}
