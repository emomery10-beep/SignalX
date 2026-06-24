import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import Anthropic from '@anthropic-ai/sdk'
import { logUsage } from '@/lib/log-usage'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * POST /api/pos/intelligence/anomaly-detection
 *
 * Uses Claude AI to detect anomalies in POS data:
 * - Unusual sales patterns
 * - Cash discrepancies
 * - Inventory shrinkage
 * - Tax calculation errors
 * - Fraud indicators
 *
 * Body:
 *   analysis_type: 'sales' | 'cash' | 'inventory' | 'tax' | 'factory' | 'all'
 *   period_days?: number (default: 30)
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json() as any

  const analysisType = body.analysis_type || 'all'
  const periodDays = body.period_days || 30

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - periodDays)

  try {
    // Gather data for analysis
    const analysisData: Record<string, any> = {}

    if (analysisType === 'sales' || analysisType === 'all') {
      analysisData.sales = await getSalesData(service, ownerId, startDate)
    }

    if (analysisType === 'cash' || analysisType === 'all') {
      analysisData.cash = await getCashData(service, ownerId, startDate)
    }

    if (analysisType === 'inventory' || analysisType === 'all') {
      analysisData.inventory = await getInventoryData(service, ownerId, startDate)
    }

    if (analysisType === 'tax' || analysisType === 'all') {
      analysisData.tax = await getTaxData(service, ownerId, startDate)
    }

    if (analysisType === 'factory' || analysisType === 'all') {
      analysisData.factory = await getFactoryData(service, ownerId, startDate)
    }

    if (analysisType === 'logistics' || analysisType === 'all') {
      analysisData.logistics = await getLogisticsData(service, ownerId, startDate)
    }

    // Use Claude to analyze the data
    const prompt = buildAnalysisPrompt(analysisData, periodDays)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
    logUsage({ route: 'pos/intelligence/anomaly-detection', model: 'claude-sonnet-4-6', usage: message.usage, userId: ownerId })

    // Extract analysis from response
    const analysis = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse anomalies from response
    const anomalies = parseAnomalies(analysis)

    // Store analysis results
    await service.from('pos_intelligence_logs').insert({
      owner_id: ownerId,
      analysis_type: analysisType,
      analysis_date: new Date().toISOString(),
      period_days: periodDays,
      analysis_data_json: analysisData,
      findings_json: anomalies,
      raw_analysis: analysis,
    })

    return NextResponse.json({
      analysis_date: new Date().toISOString(),
      period_analyzed: `${periodDays} days`,
      analysis_type: analysisType,
      anomalies: anomalies,
      raw_analysis: analysis,
      recommendations: generateRecommendations(anomalies),
    })
  } catch (error: any) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
}

async function getSalesData(service: any, ownerId: string, startDate: Date) {
  const { data: transactions } = await service
    .from('pos_transactions')
    .select('created_at, total_amount, payment_method, payment_status')
    .eq('owner_id', ownerId)
    .gte('created_at', startDate.toISOString())

  if (!transactions) return null

  // Calculate daily averages
  const byDay: Record<string, { count: number; total: number }> = {}

  for (const tx of transactions) {
    const day = tx.created_at?.split('T')[0]
    if (!byDay[day]) byDay[day] = { count: 0, total: 0 }
    byDay[day].count++
    byDay[day].total += tx.total_amount || 0
  }

  const dailyAvg = Object.values(byDay).reduce((sum, d) => sum + d.total, 0) / Object.keys(byDay).length

  return {
    total_transactions: transactions.length,
    daily_average_revenue: dailyAvg,
    days_analyzed: Object.keys(byDay).length,
    by_day: byDay,
    payment_methods: transactions.reduce(
      (acc: Record<string, number>, tx: any) => {
        const method = tx.payment_method || 'unknown'
        acc[method] = (acc[method] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    ),
  }
}

async function getCashData(service: any, ownerId: string, startDate: Date) {
  const { data: shifts } = await service
    .from('pos_shifts')
    .select('opening_balance, closing_balance, expected_balance, variance_amount, variance_reason')
    .eq('owner_id', ownerId)
    .gte('opened_at', startDate.toISOString())
    .not('closed_at', 'is', null)

  if (!shifts) return null

  const variances = shifts.map((s: any) => ({
    variance: s.variance_amount || 0,
    reason: s.variance_reason,
  }))

  const avgVariance = variances.reduce((sum: number, v: any) => sum + Math.abs(v.variance), 0) / variances.length

  return {
    total_shifts: shifts.length,
    average_variance: avgVariance,
    shifts_with_variance: variances.filter((v: any) => v.variance !== 0).length,
    largest_variance: Math.max(...variances.map((v: any) => Math.abs(v.variance))),
    variance_reasons: variances.map((v: any) => v.reason).filter(Boolean),
  }
}

async function getInventoryData(service: any, ownerId: string, startDate: Date) {
  const { data: items } = await service
    .from('pos_items')
    .select('id, name, qty, cost_price, unit_price')
    .eq('owner_id', ownerId)

  if (!items) return null

  // Calculate inventory value
  const totalValue = items.reduce((sum: number, item: any) => sum + ((item.cost_price || 0) * (item.qty || 0)), 0)
  const lowStockItems = items.filter((item: any) => (item.qty || 0) < 5)

  return {
    total_items: items.length,
    low_stock_items: lowStockItems.length,
    total_inventory_value: totalValue,
    items_below_threshold: lowStockItems.map((item: any) => ({ name: item.name, qty: item.qty })),
  }
}

async function getTaxData(service: any, ownerId: string, startDate: Date) {
  const { data: transactions } = await service
    .from('pos_transactions')
    .select('total_amount, total_tax, tax_rate')
    .eq('owner_id', ownerId)
    .gte('created_at', startDate.toISOString())

  if (!transactions) return null

  const totalRevenue = transactions.reduce((sum: number, t: any) => sum + (t.total_amount || 0), 0)
  const totalTax = transactions.reduce((sum: number, t: any) => sum + (t.total_tax || 0), 0)

  return {
    total_revenue: totalRevenue,
    total_tax_collected: totalTax,
    effective_tax_rate: totalRevenue > 0 ? ((totalTax / totalRevenue) * 100).toFixed(2) : 0,
    transactions_analyzed: transactions.length,
  }
}

async function getFactoryData(service: any, ownerId: string, startDate: Date) {
  const { data: captures } = await service
    .from('pos_factory_captures')
    .select('type, status, quantity, created_at, approved_at, batch_ref, product_name')
    .eq('owner_id', ownerId)
    .gte('created_at', startDate.toISOString())

  if (!captures || captures.length === 0) return null

  const byType: Record<string, { count: number; totalQty: number }> = {}
  let pending = 0, approved = 0, rejected = 0

  for (const c of captures) {
    const t = c.type || 'unknown'
    if (!byType[t]) byType[t] = { count: 0, totalQty: 0 }
    byType[t].count++
    byType[t].totalQty += c.quantity || 0
    if (c.status === 'pending') pending++
    else if (c.status === 'approved') approved++
    else if (c.status === 'rejected') rejected++
  }

  const total = captures.length
  const wastageCount = byType['wastage']?.count || 0
  const outputCount  = byType['output']?.count  || 0
  const intakeCount  = byType['intake']?.count  || 0

  // Average approval lag (hours)
  const approvedWithTimes = captures.filter((c: any) => c.approved_at && c.created_at)
  const avgApprovalLagHrs = approvedWithTimes.length > 0
    ? (approvedWithTimes.reduce((sum: number, c: any) => {
        return sum + (new Date(c.approved_at).getTime() - new Date(c.created_at).getTime()) / 3_600_000
      }, 0) / approvedWithTimes.length).toFixed(1)
    : null

  return {
    total_captures: total,
    by_type: byType,
    status_breakdown: { pending, approved, rejected },
    wastage_rate_pct: total > 0 ? +((wastageCount / total) * 100).toFixed(1) : 0,
    rejection_rate_pct: (approved + rejected) > 0 ? +((rejected / (approved + rejected)) * 100).toFixed(1) : 0,
    output_vs_intake_ratio: intakeCount > 0 ? +(outputCount / intakeCount).toFixed(2) : null,
    avg_approval_lag_hours: avgApprovalLagHrs,
    pending_approvals: pending,
    unique_batches: new Set(captures.map((c: any) => c.batch_ref).filter(Boolean)).size,
    unique_products: new Set(captures.map((c: any) => c.product_name).filter(Boolean)).size,
  }
}

async function getLogisticsData(service: any, ownerId: string, startDate: Date) {
  const [{ data: parcels }, { data: trucks }] = await Promise.all([
    service
      .from('pos_parcels')
      .select('status, fee_charged, payment_status, created_at, delivered_at, dispatched_at, fail_reason, destination_city')
      .eq('owner_id', ownerId)
      .gte('created_at', startDate.toISOString()),
    service
      .from('pos_trucks')
      .select('plate_number, status, make_model')
      .eq('owner_id', ownerId),
  ])

  if (!parcels || parcels.length === 0) return null

  const byStatus: Record<string, number> = {}
  let totalRevenue = 0, unpaidRevenue = 0, failedCount = 0, deliveredCount = 0

  for (const p of parcels) {
    byStatus[p.status] = (byStatus[p.status] || 0) + 1
    totalRevenue += p.fee_charged || 0
    if (p.payment_status === 'unpaid') unpaidRevenue += p.fee_charged || 0
    if (p.status === 'failed_delivery') failedCount++
    if (p.status === 'delivered' || p.status === 'collected') deliveredCount++
  }

  const completedTotal = deliveredCount + failedCount
  const failRate = completedTotal > 0 ? +((failedCount / completedTotal) * 100).toFixed(1) : 0

  // Average delivery time (dispatched → delivered)
  const deliveredWithTimes = parcels.filter((p: any) => p.delivered_at && p.dispatched_at)
  const avgDeliveryHrs = deliveredWithTimes.length > 0
    ? +(deliveredWithTimes.reduce((sum: number, p: any) => sum + (new Date(p.delivered_at).getTime() - new Date(p.dispatched_at).getTime()) / 3_600_000, 0) / deliveredWithTimes.length).toFixed(1)
    : null

  // Parcels stuck > 48h
  const now = Date.now()
  const stuckCount = parcels.filter((p: any) => ['received', 'at_branch'].includes(p.status) && (now - new Date(p.created_at).getTime()) > 48 * 3600000).length

  // By destination city
  const byCity: Record<string, number> = {}
  for (const p of parcels) {
    const city = p.destination_city || 'Unknown'
    byCity[city] = (byCity[city] || 0) + 1
  }

  // Fail reasons
  const failReasons: Record<string, number> = {}
  for (const p of parcels.filter((p: any) => p.fail_reason)) {
    failReasons[p.fail_reason] = (failReasons[p.fail_reason] || 0) + 1
  }

  return {
    total_parcels: parcels.length,
    status_breakdown: byStatus,
    total_revenue: totalRevenue,
    unpaid_revenue: unpaidRevenue,
    unpaid_rate_pct: totalRevenue > 0 ? +((unpaidRevenue / totalRevenue) * 100).toFixed(1) : 0,
    delivery_fail_rate_pct: failRate,
    fail_reasons: failReasons,
    avg_delivery_hours: avgDeliveryHrs,
    parcels_stuck_over_48h: stuckCount,
    by_destination: byCity,
    fleet: {
      total_trucks: trucks?.length || 0,
      available: trucks?.filter((t: any) => t.status === 'available').length || 0,
      in_transit: trucks?.filter((t: any) => t.status === 'in_transit').length || 0,
      maintenance: trucks?.filter((t: any) => t.status === 'maintenance').length || 0,
    },
  }
}

function buildAnalysisPrompt(data: Record<string, any>, periodDays: number): string {
  const focusAreas = [
    '1. Sales trends (normal vs unusual patterns)',
    '2. Cash discrepancies and possible causes',
    '3. Inventory health and shrinkage',
    '4. Tax calculation accuracy',
    '5. Potential fraud indicators',
  ]
  if (data.factory) {
    focusAreas.push(
      '6. Factory production efficiency (output vs intake ratio)',
      '7. Wastage rate — is it rising above baseline?',
      '8. Approval bottlenecks (pending captures, slow approval lag)',
      '9. Rejection spikes — potential quality control issues',
      '10. Batch-level anomalies in production flow',
    )
  }
  if (data.logistics) {
    const n = focusAreas.length + 1
    focusAreas.push(
      `${n}. Delivery failure rate — is it above 15%? What are the top reasons?`,
      `${n+1}. Parcel throughput anomalies — unusual spikes or drops in volume`,
      `${n+2}. Revenue at risk — unpaid parcels, stuck parcels over 48h`,
      `${n+3}. Fleet utilization — trucks in maintenance vs available`,
      `${n+4}. Delivery speed — average delivery time trends`,
      `${n+5}. Route/destination imbalances — any city disproportionately failing?`,
    )
  }

  return `Analyze this POS business data for anomalies and patterns. Focus on:
${focusAreas.join('\n')}

Period analyzed: Last ${periodDays} days

Data:
${JSON.stringify(data, null, 2)}

Provide:
- Top 3–5 anomalies (if any)
- Risk level (Low/Medium/High) for each
- Root cause hypothesis for each anomaly
- Recommended actions

Format as JSON with "anomalies" array containing {issue, risk_level, hypothesis, action}.`
}

function parseAnomalies(analysis: string): any[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = analysis.match(/\{[\s\S]*"anomalies"[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).anomalies
    }
  } catch (e) {
    console.error('Failed to parse anomalies:', e)
  }

  // Fallback: extract anomalies from text
  return [
    {
      issue: 'Unable to parse structured anomalies',
      risk_level: 'Low',
      hypothesis: 'Analysis completed but format unclear',
      action: 'Review raw analysis above',
    },
  ]
}

function generateRecommendations(anomalies: any[]): string[] {
  const recommendations: string[] = []

  for (const anomaly of anomalies) {
    if (anomaly.risk_level === 'High') {
      recommendations.push(`🔴 URGENT: ${anomaly.issue} - ${anomaly.action}`)
    } else if (anomaly.risk_level === 'Medium') {
      recommendations.push(`🟡 Review: ${anomaly.issue} - ${anomaly.action}`)
    }
  }

  return recommendations.length > 0
    ? recommendations
    : ['✅ No significant anomalies detected - business operating normally']
}
