import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 30

// ── Churn risk scoring ────────────────────────────────────────────────────────
function scoreChurnRisk(customer: {
  last_order_date: string | null
  order_count: number
  avg_days_between: number | null
  total_spend: number
}): { score: number; label: string; days_since: number } {
  if (!customer.last_order_date) return { score: 100, label: 'churned', days_since: 999 }

  const lastOrder = new Date(customer.last_order_date)
  const now = new Date()
  const daysSince = Math.floor((now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24))

  // Expected return window — based on average purchase frequency
  const avgDays = customer.avg_days_between || 30
  const expectedWindow = avgDays * 1.5  // 50% overdue = watch, 100% overdue = at_risk
  const overdueRatio = daysSince / expectedWindow

  let score = 0

  // Days overdue relative to their personal purchase frequency
  if (overdueRatio >= 3)    score += 60
  else if (overdueRatio >= 2) score += 45
  else if (overdueRatio >= 1.5) score += 30
  else if (overdueRatio >= 1) score += 15
  else score += Math.max(0, overdueRatio * 10)

  // Absolute days since last order (catches infrequent buyers)
  if (daysSince > 180) score += 25
  else if (daysSince > 90) score += 15
  else if (daysSince > 60) score += 8

  // Low order count = less established relationship = higher churn risk
  if (customer.order_count === 1) score += 15
  else if (customer.order_count <= 2) score += 8

  const finalScore = Math.min(100, score)

  let label = 'healthy'
  if (finalScore >= 70)      label = 'churned'
  else if (finalScore >= 45) label = 'at_risk'
  else if (finalScore >= 25) label = 'watch'

  return { score: finalScore, label, days_since: daysSince }
}

// ── Parse customer data from uploaded dataset ─────────────────────────────────
function parseCustomersFromData(
  rows: Record<string, unknown>[],
  headers: string[]
): Array<{
  customer_ref: string
  customer_name: string | null
  last_order_date: string | null
  order_count: number
  total_spend: number
  avg_order_value: number
  first_order_date: string | null
}> {
  // Detect column names flexibly
  const find = (keywords: string[]) =>
    headers.find(h => keywords.some(k => h.toLowerCase().includes(k.toLowerCase()))) || null

  const customerCol   = find(['customer_id', 'customer_ref', 'customer', 'email', 'client_id', 'client'])
  const nameCol       = find(['customer_name', 'name', 'client_name', 'contact'])
  const dateCol       = find(['last_order', 'order_date', 'date', 'purchase_date', 'transaction_date'])
  const revenueCol    = find(['revenue', 'total', 'amount', 'value', 'spend', 'gmv', 'sales'])
  const countCol      = find(['order_count', 'orders', 'quantity', 'count', 'transactions'])

  if (!customerCol || !dateCol) return []

  // Group rows by customer
  const customerMap = new Map<string, {
    name: string | null
    dates: string[]
    revenues: number[]
    count: number
  }>()

  for (const row of rows) {
    const ref = String(row[customerCol] || '').trim()
    if (!ref) continue

    const date = String(row[dateCol] || '').trim()
    const revenue = parseFloat(String(row[revenueCol ?? ''] || '0').replace(/[^0-9.-]/g, '')) || 0
    const name = nameCol ? String(row[nameCol] || '').trim() || null : null
    const count = countCol ? parseInt(String(row[countCol] || '1')) || 1 : 1

    if (!customerMap.has(ref)) {
      customerMap.set(ref, { name, dates: [], revenues: [], count: 0 })
    }
    const c = customerMap.get(ref)!
    if (date) c.dates.push(date)
    c.revenues.push(revenue)
    c.count += count
    if (!c.name && name) c.name = name
  }

  return Array.from(customerMap.entries()).map(([ref, data]) => {
    const sortedDates = data.dates
      .filter(d => d && !isNaN(new Date(d).getTime()))
      .sort()

    const totalSpend = data.revenues.reduce((s, r) => s + r, 0)
    const orderCount = Math.max(data.count, data.dates.length, 1)

    return {
      customer_ref:     ref,
      customer_name:    data.name,
      last_order_date:  sortedDates.at(-1) || null,
      first_order_date: sortedDates[0] || null,
      order_count:      orderCount,
      total_spend:      totalSpend,
      avg_order_value:  totalSpend / orderCount,
    }
  })
}

// ── POST /api/churn-scan ──────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const { source = 'auto' } = body // 'auto' | 'manual'

  // 1. Get latest uploaded dataset
  const { data: upload } = await supabase
    .from('uploads')
    .select('parsed_sample, column_names')
    .eq('user_id', user.id)
    .eq('status', 'parsed')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!upload?.parsed_sample) {
    return NextResponse.json({
      success: false,
      error: 'no_data',
      message: 'Upload a CSV with customer order data to enable churn scanning.',
    })
  }

  const rows    = upload.parsed_sample as Record<string, unknown>[]
  const headers = upload.column_names   as string[]

  // 2. Parse customers from dataset
  const parsedCustomers = parseCustomersFromData(rows, headers)

  if (parsedCustomers.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'no_customers',
      message: 'Could not identify customer data. Make sure your CSV has customer ID and order date columns.',
    })
  }

  // 3. Calculate avg days between orders per customer
  const scoredCustomers = parsedCustomers.map(c => {
    // Estimate avg days between orders from date range and order count
    let avgDaysBetween: number | null = null
    if (c.first_order_date && c.last_order_date && c.order_count > 1) {
      const first = new Date(c.first_order_date)
      const last  = new Date(c.last_order_date)
      const rangeDays = Math.floor((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
      avgDaysBetween = rangeDays / (c.order_count - 1)
    }

    const { score, label, days_since } = scoreChurnRisk({
      last_order_date:  c.last_order_date,
      order_count:      c.order_count,
      avg_days_between: avgDaysBetween,
      total_spend:      c.total_spend,
    })

    return {
      user_id:          user.id,
      customer_ref:     c.customer_ref,
      customer_name:    c.customer_name,
      first_order_date: c.first_order_date,
      last_order_date:  c.last_order_date,
      order_count:      c.order_count,
      total_spend:      c.total_spend,
      avg_order_value:  c.avg_order_value,
      avg_days_between: avgDaysBetween,
      churn_risk_score: score,
      churn_risk_label: label,
      days_since_order: days_since,
      updated_at:       new Date().toISOString(),
    }
  })

  // 4. Upsert into customers table
  const { error: upsertError } = await supabase
    .from('customers')
    .upsert(scoredCustomers, { onConflict: 'user_id,customer_ref' })

  if (upsertError) {
    return NextResponse.json({ success: false, error: upsertError.message }, { status: 500 })
  }

  // 5. Count risk levels
  const atRisk  = scoredCustomers.filter(c => c.churn_risk_label === 'at_risk').length
  const watch   = scoredCustomers.filter(c => c.churn_risk_label === 'watch').length
  const churned = scoredCustomers.filter(c => c.churn_risk_label === 'churned').length

  // 6. Log the scan
  await supabase.from('churn_scans').insert({
    user_id:          user.id,
    customers_scored: scoredCustomers.length,
    at_risk_count:    atRisk,
    watch_count:      watch,
    churned_count:    churned,
  })

  // 7. Create alerts for at-risk customers
  if (atRisk > 0) {
    const atRiskCustomers = scoredCustomers
      .filter(c => c.churn_risk_label === 'at_risk')
      .sort((a, b) => b.total_spend - a.total_spend)
      .slice(0, 5)

    const alertValue = atRiskCustomers.reduce((s, c) => s + c.total_spend, 0)

    await supabase.from('alerts').upsert({
      user_id:   user.id,
      type:      'churn_risk',
      title:     `${atRisk} customer${atRisk > 1 ? 's' : ''} at risk of churning`,
      message:   `${atRisk} high-value customer${atRisk > 1 ? 's are' : ' is'} overdue for a repeat purchase. Combined lifetime value: ${alertValue.toFixed(0)}.`,
      is_active: true,
      metadata:  { at_risk: atRisk, watch, churned, top_customers: atRiskCustomers.map(c => c.customer_ref) },
    }, { onConflict: 'user_id,type' })
  }

  // 8. Return top at-risk customers for immediate display
  const topAtRisk = scoredCustomers
    .filter(c => ['at_risk', 'watch'].includes(c.churn_risk_label))
    .sort((a, b) => b.churn_risk_score - a.churn_risk_score || b.total_spend - a.total_spend)
    .slice(0, 10)

  return NextResponse.json({
    success: true,
    summary: {
      total_customers: scoredCustomers.length,
      at_risk:         atRisk,
      watch:           watch,
      churned:         churned,
      healthy:         scoredCustomers.length - atRisk - watch - churned,
    },
    top_at_risk: topAtRisk.map(c => ({
      customer_ref:     c.customer_ref,
      customer_name:    c.customer_name,
      last_order_date:  c.last_order_date,
      days_since_order: c.days_since_order,
      order_count:      c.order_count,
      total_spend:      c.total_spend,
      avg_order_value:  c.avg_order_value,
      churn_risk_score: c.churn_risk_score,
      churn_risk_label: c.churn_risk_label,
    })),
  })
}

// ── GET /api/churn-scan — fetch latest results ─────────────────────────────────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .in('churn_risk_label', ['at_risk', 'watch'])
    .order('churn_risk_score', { ascending: false })
    .limit(20)

  const { data: summary } = await supabase
    .from('churn_scans')
    .select('*')
    .eq('user_id', user.id)
    .order('scanned_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({
    customers: customers || [],
    last_scan: summary || null,
  })
}
