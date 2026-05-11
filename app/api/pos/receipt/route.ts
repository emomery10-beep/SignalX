import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendReceipt } from '@/lib/whatsapp'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { transaction_id, phone } = await req.json()
  if (!transaction_id || !phone) return NextResponse.json({ error: 'transaction_id and phone required' }, { status: 400 })

  // Fetch transaction with items and owner profile
  const { data: tx, error } = await supabase
    .from('pos_transactions')
    .select(`
      *,
      pos_items(*),
      profiles!pos_transactions_owner_id_fkey(business_name, currency_symbol)
    `)
    .eq('id', transaction_id)
    .single()

  if (error || !tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })

  const symbol       = (tx.profiles as { currency_symbol?: string })?.currency_symbol || '£'
  const businessName = (tx.profiles as { business_name?: string })?.business_name || 'The Shop'
  const date         = new Date(tx.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const lines = (tx.pos_items as { name: string; qty: number; line_total: number }[])
    .map((item) => `${item.name} ×${item.qty}    ${symbol}${item.line_total.toFixed(2)}`)
    .join('\n')

  const message = `🧾 *Receipt from ${businessName}*\n` +
    `─────────────────────\n` +
    `${lines}\n` +
    `─────────────────────\n` +
    `*TOTAL    ${symbol}${tx.total.toFixed(2)}*\n\n` +
    `${date}\n` +
    `Payment: ${tx.payment_type}\n\n` +
    `Thank you for shopping with us! 🙏\n` +
    `_Powered by AskBiz_`

  // Send via Meta WhatsApp Cloud API
  const { ok, error: waError } = await sendReceipt(phone, message)
  if (!ok) {
    return NextResponse.json({ error: waError || 'Failed to send WhatsApp receipt' }, { status: 500 })
  }

  // Mark receipt as sent
  await supabase.from('pos_transactions').update({ receipt_sent: true }).eq('id', transaction_id)

  // Update customer last_seen and total_spent
  if (tx.customer_id) {
    await supabase
      .from('pos_customers')
      .update({ last_seen_at: new Date().toISOString(), total_spent: (tx.total || 0) })
      .eq('id', tx.customer_id)
  }

  return NextResponse.json({ sent: true })
}
