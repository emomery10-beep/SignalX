import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencySymbol } from '@/lib/get-currency'
import Anthropic from '@anthropic-ai/sdk'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const maxDuration = 30

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sym = await getCurrencySymbol(supabase, user.id)

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString()
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 3600000).toISOString()

  const [
    { data: lowStock },
    { data: staleQuotes },
    { data: staleSources },
    { data: unresolvedAnomalies },
    { data: atRiskCustomers },
    { data: recentTx },
    { data: pendingDecisions },
  ] = await Promise.all([
    supabase.from('inventory')
      .select('id, name, stock_qty, low_stock_threshold, sale_price')
      .eq('owner_id', user.id).eq('active', true)
      .or('stock_qty.lte.low_stock_threshold')
      .order('stock_qty', { ascending: true }).limit(10),

    supabase.from('pos_service_jobs')
      .select('id, ticket_number, device_model, fault_description, quoted_price, created_at, status')
      .eq('owner_id', user.id).eq('status', 'quoted')
      .lte('created_at', fortyEightHoursAgo)
      .order('created_at', { ascending: true }).limit(5),

    supabase.from('connected_sources')
      .select('id, source_type, name, last_synced_at')
      .eq('user_id', user.id).eq('status', 'active')
      .lte('last_synced_at', new Date(now.getTime() - 24 * 3600000).toISOString())
      .limit(5),

    supabase.from('anomalies')
      .select('id, title, severity, body')
      .eq('user_id', user.id).eq('seen', false)
      .order('created_at', { ascending: false }).limit(5),

    supabase.from('pos_customers')
      .select('id, name, phone, total_spent, last_seen_at')
      .eq('owner_id', user.id)
      .lte('last_seen_at', thirtyDaysAgo)
      .gte('total_spent', 100)
      .order('total_spent', { ascending: false }).limit(5),

    supabase.from('pos_transactions')
      .select('id, total, created_at')
      .eq('owner_id', user.id).eq('status', 'completed')
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false }).limit(200),

    supabase.from('decisions')
      .select('id, title, review_at')
      .eq('user_id', user.id).eq('reviewed', false)
      .lte('review_at', new Date(now.getTime() + 7 * 86400000).toISOString())
      .order('review_at', { ascending: true }).limit(3),
  ])

  const signals: string[] = []

  if (lowStock?.length) {
    const outOfStock = lowStock.filter(i => i.stock_qty <= 0)
    const runningLow = lowStock.filter(i => i.stock_qty > 0)
    if (outOfStock.length) signals.push(`OUT OF STOCK (${outOfStock.length}): ${outOfStock.map(i => i.name).join(', ')}`)
    if (runningLow.length) signals.push(`LOW STOCK (${runningLow.length}): ${runningLow.map(i => `${i.name} (${i.stock_qty} left)`).join(', ')}`)
  }

  if (staleQuotes?.length) {
    signals.push(`STALE QUOTES (${staleQuotes.length}): ${staleQuotes.map(j => `#${j.ticket_number} ${j.device_model || 'repair'} — quoted ${Math.round((now.getTime() - new Date(j.created_at).getTime()) / 3600000)}h ago`).join('; ')}`)
  }

  if (staleSources?.length) {
    signals.push(`STALE DATA SOURCES (${staleSources.length}): ${staleSources.map(s => `${s.name || s.source_type} — last synced ${Math.round((now.getTime() - new Date(s.last_synced_at).getTime()) / 3600000)}h ago`).join('; ')}`)
  }

  if (unresolvedAnomalies?.length) {
    signals.push(`UNRESOLVED ALERTS (${unresolvedAnomalies.length}): ${unresolvedAnomalies.map(a => `[${a.severity}] ${a.title}`).join('; ')}`)
  }

  if (atRiskCustomers?.length) {
    signals.push(`AT-RISK HIGH-VALUE CUSTOMERS (${atRiskCustomers.length}): ${atRiskCustomers.map(c => `${c.name || c.phone} — spent ${sym}${c.total_spent}, last seen ${Math.round((now.getTime() - new Date(c.last_seen_at).getTime()) / 86400000)} days ago`).join('; ')}`)
  }

  if (pendingDecisions?.length) {
    signals.push(`DECISIONS DUE FOR REVIEW (${pendingDecisions.length}): ${pendingDecisions.map(d => `"${d.title}" — due ${new Date(d.review_at).toLocaleDateString('en-GB')}`).join('; ')}`)
  }

  const dailyRevenue = (recentTx || []).reduce((s, t) => s + (t.total || 0), 0) / 7
  if (dailyRevenue > 0) {
    signals.push(`CONTEXT: Average daily revenue this week: ${sym}${dailyRevenue.toFixed(2)} from ${Math.round((recentTx?.length || 0) / 7)} transactions/day`)
  }

  if (signals.length === 0) {
    return NextResponse.json({
      actions: [{ title: 'All clear', why: 'No urgent actions detected today. Keep up the good work.', priority: 3, type: 'info' }],
      currency_symbol: sym,
    })
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: `You are a business operations assistant. Given these signals from a small business, produce a prioritised daily action list.

SIGNALS:
${signals.join('\n')}

Return a JSON array of max 7 actions. Each action: {"title": "short imperative (max 8 words)", "why": "one sentence explaining impact", "priority": 1|2|3, "type": "restock|followup|alert|sync|customer|decision|info"}

Priority 1 = do now (revenue at risk), 2 = do today, 3 = this week.
Sort by priority ascending. Be specific — use actual product names, customer names, amounts.
Return ONLY the JSON array, no markdown.` }],
    })
    logUsage({ route: 'daily-actions', model: 'claude-sonnet-4-6', usage: response.usage, userId: user.id })

    const text = (response.content[0] as { type: string; text: string }).text
    const actions = JSON.parse(text)
    return NextResponse.json({ actions, currency_symbol: sym })
  } catch {
    const fallbackActions: any[] = []
    if (lowStock?.some(i => i.stock_qty <= 0)) fallbackActions.push({ title: `Restock ${lowStock.filter(i => i.stock_qty <= 0).length} out-of-stock items`, why: 'These items cannot be sold until restocked.', priority: 1, type: 'restock' })
    if (lowStock?.some(i => i.stock_qty > 0)) fallbackActions.push({ title: `Review ${lowStock.filter(i => i.stock_qty > 0).length} low-stock items`, why: 'Stock is running low and may run out soon.', priority: 2, type: 'restock' })
    if (staleQuotes?.length) fallbackActions.push({ title: `Follow up on ${staleQuotes.length} stale repair quotes`, why: 'Customers may go elsewhere if not contacted.', priority: 2, type: 'followup' })
    if (unresolvedAnomalies?.length) fallbackActions.push({ title: `Review ${unresolvedAnomalies.length} unresolved alerts`, why: 'Alerts may indicate issues requiring attention.', priority: 2, type: 'alert' })
    if (staleSources?.length) fallbackActions.push({ title: `Reconnect ${staleSources.length} stale data sources`, why: 'Your analytics may be based on outdated data.', priority: 3, type: 'sync' })
    if (atRiskCustomers?.length) fallbackActions.push({ title: `Re-engage ${atRiskCustomers.length} high-value customers`, why: 'These customers have not visited in over 30 days.', priority: 3, type: 'customer' })
    if (pendingDecisions?.length) fallbackActions.push({ title: `Review ${pendingDecisions.length} pending decisions`, why: 'Decision check-ins are due this week.', priority: 3, type: 'decision' })
    return NextResponse.json({ actions: fallbackActions.length ? fallbackActions : [{ title: 'All clear', why: 'No urgent actions detected.', priority: 3, type: 'info' }], currency_symbol: sym })
  }
}
