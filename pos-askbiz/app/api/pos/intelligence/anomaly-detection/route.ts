import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'
import { logUsage } from '@/lib/log-usage'

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
 *   analysis_type: 'sales' | 'cash' | 'inventory' | 'tax' | 'all'
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

    // Use Groq to analyze the data
    const prompt = buildAnalysisPrompt(analysisData, periodDays)

    const _groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const _groqData = await _groqRes.json()
    const analysis = _groqData.choices?.[0]?.message?.content || ''
    logUsage({ route: 'pos/anomaly-detection', model: 'llama-3.3-70b-versatile', usage: { input_tokens: _groqData.usage?.prompt_tokens ?? 0, output_tokens: _groqData.usage?.completion_tokens ?? 0 }, userId: ownerId })

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

function buildAnalysisPrompt(data: Record<string, any>, periodDays: number): string {
  return `Analyze this POS business data for anomalies and patterns. Focus on:
1. Sales trends (normal vs unusual patterns)
2. Cash discrepancies and possible causes
3. Inventory health and shrinkage
4. Tax calculation accuracy
5. Potential fraud indicators

Period analyzed: Last ${periodDays} days

Data:
${JSON.stringify(data, null, 2)}

Provide:
- Top 3 anomalies (if any)
- Risk level (Low/Medium/High)
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
