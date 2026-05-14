import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { sendReceipt } from '@/lib/whatsapp'

// CORS handled globally by next.config.js
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
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

  const { data: tx, error } = await service
    .from('pos_transactions')
    .select(`
      *,
      pos_items(*),
      profiles!pos_transactions_owner_id_fkey(business_name, currency_symbol)
    `)
    .eq('id', transaction_id)
    .eq('owner_id', ownerId)   // fix #2 — scope to authenticated owner, prevents UUID enumeration
    .single()

  if (error || !tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

  const symbol       = (tx.profiles as { currency_symbol?: string })?.currency_symbol || '£'
  const businessName = (tx.profiles as { business_name?: string })?.business_name || 'The Shop'
  const date         = new Date(tx.created_at).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const lines = (tx.pos_items as { name: string; qty: number; line_total: number }[])
    .map(item => `${item.name} ×${item.qty}    ${symbol}${Number(item.line_total).toFixed(2)}`)
    .join('\n')

  const discountLine = tx.discount_amount && Number(tx.discount_amount) > 0
    ? `\nDiscount    -${symbol}${Number(tx.discount_amount).toFixed(2)}`
    : ''

  const message =
    `🧾 *Receipt from ${businessName}*\n` +
    `─────────────────────\n` +
    `${lines}${discountLine}\n` +
    `─────────────────────\n` +
    `*TOTAL    ${symbol}${Number(tx.total).toFixed(2)}*\n\n` +
    `${date}\n` +
    `Payment: ${tx.payment_type}\n\n` +
    `Thank you for shopping with us! 🙏\n` +
    `_Powered by AskBiz_`

  const { ok, error: waError } = await sendReceipt(phone, message)
  // fix #18 — check ok and return error to caller; previously HTTP errors were swallowed
  if (!ok) {
    return NextResponse.json({ error: waError || 'Failed to send WhatsApp receipt' }, { status: 500 })
  }

  await service.from('pos_transactions').update({ receipt_sent: true }).eq('id', transaction_id)

  return NextResponse.json({ sent: true })
}
