import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const from   = searchParams.get('from') || new Date(Date.now() - 30 * 86400000).toISOString()
  const to     = searchParams.get('to')   || new Date().toISOString()
  const format = searchParams.get('format') || 'csv'

  const { data: transactions } = await supabase
    .from('pos_transactions')
    .select('*, pos_items(*), pos_staff(name), pos_customers(phone, name)')
    .eq('owner_id', user.id)
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at', { ascending: false })

  if (!transactions) return NextResponse.json({ error: 'No data' }, { status: 404 })

  // Flatten to rows
  type TxRow = {
    pos_items: { name: string; qty: number; unit_price: number; line_total: number; refunded: boolean }[]
    pos_staff: { name: string } | null
    pos_customers: { phone: string; name?: string } | null
    id: string
    created_at: string
    total: number
    payment_type: string
    status: string
  }

  const rows: string[][] = []
  rows.push(['Date', 'Time', 'Sale ID', 'Cashier', 'Customer Phone', 'Item', 'Qty', 'Unit Price', 'Line Total', 'Sale Total', 'Payment', 'Status'])

  for (const tx of transactions as TxRow[]) {
    const date     = new Date(tx.created_at)
    const dateStr  = date.toLocaleDateString('en-GB')
    const timeStr  = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    const cashier  = tx.pos_staff?.name || 'Owner'
    const customer = tx.pos_customers?.phone || ''

    if (!tx.pos_items?.length) {
      rows.push([dateStr, timeStr, tx.id.slice(0, 8), cashier, customer, '', '', '', '', tx.total.toFixed(2), tx.payment_type, tx.status])
    } else {
      tx.pos_items.forEach((item, idx) => {
        rows.push([
          dateStr, timeStr,
          idx === 0 ? tx.id.slice(0, 8) : '',
          idx === 0 ? cashier : '',
          idx === 0 ? customer : '',
          item.name,
          item.qty.toString(),
          item.unit_price.toFixed(2),
          item.line_total.toFixed(2),
          idx === 0 ? tx.total.toFixed(2) : '',
          idx === 0 ? tx.payment_type : '',
          idx === 0 ? tx.status : '',
        ])
      })
    }
  }

  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const filename = `askbiz-pos-${new Date().toISOString().split('T')[0]}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type':        'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
