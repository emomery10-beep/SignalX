import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// MTD-compatible VAT export
// Produces a CSV with columns HMRC expects for digital record-keeping:
// Date, Reference, Description, Net, VAT Rate, VAT Amount, Gross, Payment Method
export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)

  // Default to current VAT quarter
  const now     = new Date()
  const quarter = Math.floor(now.getMonth() / 3)
  const qStart  = new Date(now.getFullYear(), quarter * 3, 1)
  const qEnd    = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59)

  const from = searchParams.get('from') || qStart.toISOString()
  const to   = searchParams.get('to')   || qEnd.toISOString()

  // Fetch VAT number from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('vat_number, business_name')
    .eq('id', user.id)
    .single()

  const { data: transactions } = await supabase
    .from('pos_transactions')
    .select('*, pos_items(name, qty, unit_price, line_total, refunded)')
    .eq('owner_id', user.id)
    .eq('status', 'completed')
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at', { ascending: true })

  if (!transactions) return NextResponse.json({ error: 'No data' }, { status: 404 })

  type TxRow = {
    id: string
    created_at: string
    total: number
    subtotal: number
    tax_amount: number
    payment_type: string
    pos_items: { name: string; qty: number; unit_price: number; line_total: number; refunded: boolean }[]
  }

  // MTD VAT header — HMRC digital records format
  const rows: string[][] = []
  rows.push([
    'Date',
    'VAT Period',
    'Reference',
    'Description',
    'Net Amount (£)',
    'VAT Rate (%)',
    'VAT Amount (£)',
    'Gross Amount (£)',
    'Payment Method',
    'VAT Number',
  ])

  const vatPeriod = `${qStart.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} – ${qEnd.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
  const vatNumber = profile?.vat_number || 'Not registered'

  let totalNet    = 0
  let totalVat    = 0
  let totalGross  = 0

  for (const tx of transactions as TxRow[]) {
    const date      = new Date(tx.created_at).toLocaleDateString('en-GB')
    const ref       = `POS-${tx.id.slice(0, 8).toUpperCase()}`
    const gross     = tx.total
    const vatAmt    = tx.tax_amount || 0
    const net       = gross - vatAmt
    const vatRate   = vatAmt > 0 ? ((vatAmt / net) * 100).toFixed(0) : '0'

    // Summary for line items
    const itemDesc  = tx.pos_items?.length
      ? tx.pos_items.filter(i => !i.refunded).map(i => `${i.qty}× ${i.name}`).join(', ')
      : 'POS sale'

    rows.push([
      date,
      vatPeriod,
      ref,
      itemDesc,
      net.toFixed(2),
      vatRate,
      vatAmt.toFixed(2),
      gross.toFixed(2),
      tx.payment_type,
      vatNumber,
    ])

    totalNet   += net
    totalVat   += vatAmt
    totalGross += gross
  }

  // Totals row
  rows.push(['', '', '', 'TOTALS', totalNet.toFixed(2), '', totalVat.toFixed(2), totalGross.toFixed(2), '', ''])

  const businessName = profile?.business_name || 'Your Business'
  const fromLabel    = new Date(from).toLocaleDateString('en-GB')
  const toLabel      = new Date(to).toLocaleDateString('en-GB')

  // Metadata header block (not parsed by HMRC but useful for accountants)
  const meta = [
    `"AskBiz MTD-Compatible VAT Record"`,
    `"Business: ${businessName}"`,
    `"VAT Number: ${vatNumber}"`,
    `"Period: ${fromLabel} to ${toLabel}"`,
    `"Exported: ${new Date().toLocaleDateString('en-GB')}"`,
    `"Total transactions: ${transactions.length}"`,
    `""`,
  ].join('\n')

  const csv  = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
  const body = meta + '\n' + csv

  const filename = `askbiz-vat-${fromLabel.replace(/\//g, '-')}-to-${toLabel.replace(/\//g, '-')}.csv`

  return new NextResponse(body, {
    headers: {
      'Content-Type':        'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
