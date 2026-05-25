import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/forecast/sources
 * Returns virtual datasets from connected ecommerce sources + POS data
 * aggregated by day, ready for the forecasting engine.
 */
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const datasets: {
    id: string
    name: string
    sourceType: 'ecommerce' | 'pos'
    columns: string[]
    rowCount: number
  }[] = []

  // ── 1. Ecommerce / unified_data ────────────────────────────
  const { data: sources } = await supabase
    .from('connected_sources')
    .select('id, name, source_type, status')
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (sources && sources.length > 0) {
    // Check if there's any unified_data at all
    const { count } = await supabase
      .from('unified_data')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count && count > 0) {
      // Add a combined "All Sources" dataset
      datasets.push({
        id: 'ecommerce-all',
        name: `All Connected Sources (${sources.map(s => s.name || s.source_type).join(', ')})`,
        sourceType: 'ecommerce',
        columns: [
          'gross_revenue', 'net_revenue', 'units_sold', 'total_cost',
          'gross_margin', 'ad_spend', 'discount', 'shipping_cost',
        ],
        rowCount: count,
      })

      // Also add per-source datasets
      for (const src of sources) {
        const { count: srcCount } = await supabase
          .from('unified_data')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('source_id', src.id)

        if (srcCount && srcCount > 0) {
          datasets.push({
            id: `ecommerce-${src.id}`,
            name: `${src.name || src.source_type}`,
            sourceType: 'ecommerce',
            columns: [
              'gross_revenue', 'net_revenue', 'units_sold', 'total_cost',
              'gross_margin', 'ad_spend', 'discount', 'shipping_cost',
            ],
            rowCount: srcCount,
          })
        }
      }
    }
  }

  // ── 2. POS transactions ────────────────────────────────────
  const { count: posCount } = await supabase
    .from('pos_transactions')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .eq('status', 'completed')

  if (posCount && posCount > 0) {
    datasets.push({
      id: 'pos-transactions',
      name: 'Point of Sale',
      sourceType: 'pos',
      columns: [
        'total_revenue', 'transaction_count', 'avg_transaction_value',
        'tax_collected',
      ],
      rowCount: posCount,
    })
  }

  return NextResponse.json({ datasets })
}

/**
 * POST /api/forecast/sources
 * Fetches aggregated time-series data for a virtual source dataset.
 * Returns data in the same format as uploads.parsed_sample so the
 * forecast engine can consume it directly.
 */
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { datasetId, targetColumn } = await request.json()
  if (!datasetId || !targetColumn) {
    return NextResponse.json({ error: 'datasetId and targetColumn required' }, { status: 400 })
  }

  try {
    let rows: Record<string, unknown>[] = []

    if (datasetId === 'pos-transactions') {
      // ── POS: aggregate daily ──────────────────────────────
      const { data: txns } = await supabase
        .from('pos_transactions')
        .select('total, subtotal, tax_amount, created_at')
        .eq('owner_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: true })
        .limit(5000)

      if (!txns?.length) return NextResponse.json({ error: 'No POS data found' }, { status: 404 })

      // Group by date
      const daily: Record<string, { revenue: number; count: number; tax: number }> = {}
      txns.forEach(t => {
        const day = new Date(t.created_at).toISOString().slice(0, 10)
        if (!daily[day]) daily[day] = { revenue: 0, count: 0, tax: 0 }
        daily[day].revenue += Number(t.total) || 0
        daily[day].count += 1
        daily[day].tax += Number(t.tax_amount) || 0
      })

      rows = Object.entries(daily)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, d]) => ({
          date,
          total_revenue: Math.round(d.revenue * 100) / 100,
          transaction_count: d.count,
          avg_transaction_value: d.count > 0 ? Math.round((d.revenue / d.count) * 100) / 100 : 0,
          tax_collected: Math.round(d.tax * 100) / 100,
        }))

    } else if (datasetId.startsWith('ecommerce-')) {
      // ── Ecommerce: aggregate daily from unified_data ──────
      let query = supabase
        .from('unified_data')
        .select('record_date, units_sold, selling_price, discount, gross_revenue, net_revenue, cost_price, shipping_cost, total_cost, gross_margin, ad_spend, marketplace_fee')
        .eq('user_id', user.id)
        .order('record_date', { ascending: true })
        .limit(10000)

      // Filter by specific source if not "all"
      if (datasetId !== 'ecommerce-all') {
        const sourceId = datasetId.replace('ecommerce-', '')
        query = query.eq('source_id', sourceId)
      }

      const { data: records } = await query
      if (!records?.length) return NextResponse.json({ error: 'No ecommerce data found' }, { status: 404 })

      // Group by record_date
      const daily: Record<string, {
        gross_revenue: number; net_revenue: number; units_sold: number
        total_cost: number; gross_margin_sum: number; ad_spend: number
        discount: number; shipping_cost: number; count: number
      }> = {}

      records.forEach(r => {
        const day = r.record_date || 'unknown'
        if (day === 'unknown') return
        if (!daily[day]) daily[day] = { gross_revenue: 0, net_revenue: 0, units_sold: 0, total_cost: 0, gross_margin_sum: 0, ad_spend: 0, discount: 0, shipping_cost: 0, count: 0 }
        daily[day].gross_revenue += Number(r.gross_revenue) || 0
        daily[day].net_revenue += Number(r.net_revenue) || 0
        daily[day].units_sold += Number(r.units_sold) || 0
        daily[day].total_cost += Number(r.total_cost) || 0
        daily[day].gross_margin_sum += Number(r.gross_margin) || 0
        daily[day].ad_spend += Number(r.ad_spend) || 0
        daily[day].discount += Number(r.discount) || 0
        daily[day].shipping_cost += Number(r.shipping_cost) || 0
        daily[day].count += 1
      })

      rows = Object.entries(daily)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, d]) => ({
          date,
          gross_revenue: Math.round(d.gross_revenue * 100) / 100,
          net_revenue: Math.round(d.net_revenue * 100) / 100,
          units_sold: d.units_sold,
          total_cost: Math.round(d.total_cost * 100) / 100,
          gross_margin: d.count > 0 ? Math.round((d.gross_margin_sum / d.count) * 100) / 100 : 0,
          ad_spend: Math.round(d.ad_spend * 100) / 100,
          discount: Math.round(d.discount * 100) / 100,
          shipping_cost: Math.round(d.shipping_cost * 100) / 100,
        }))
    } else {
      return NextResponse.json({ error: 'Unknown dataset' }, { status: 400 })
    }

    return NextResponse.json({ rows, columns: rows.length > 0 ? Object.keys(rows[0]).filter(k => k !== 'date') : [] })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load source data'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
