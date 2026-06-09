import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { runHealthCheckFromUpload, runHealthCheckFromPOSData } from '@/lib/signal-engine'
import type { Signal } from '@/lib/signal-engine'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Try POS data first (live), then connected sources, then CSV uploads
  let signals: Signal[] = await runPOSSignals(user.id)

  if (signals.length === 0) {
    signals = await runSourceSignals(user.id)
  }

  if (signals.length === 0) {
    signals = await runHealthCheckFromUpload(user.id, supabase)
  }

  return NextResponse.json({ signals }, {
    headers: { 'Cache-Control': 'no-store' }
  })
}

const SOURCE_LABELS: Record<string, string> = {
  stripe: 'Stripe', shopify: 'Shopify', amazon_fba: 'Amazon FBA',
  xero: 'Xero', quickbooks: 'QuickBooks', pos: 'POS', csv: 'CSV', ebay: 'eBay',
}

async function runSourceSignals(userId: string): Promise<Signal[]> {
  try {
    const service = createServiceClient()
    const { data: sources } = await service
      .from('connected_sources')
      .select('source_type, status, last_synced_at, created_at')
      .eq('user_id', userId)

    if (!sources || sources.length === 0) return []

    const signals: Signal[] = []
    const now = Date.now()

    // Check for stale syncs (> 24h)
    const staleSources = sources.filter(s => {
      if (!s.last_synced_at) return true
      return (now - new Date(s.last_synced_at).getTime()) > 24 * 60 * 60 * 1000
    })

    if (staleSources.length > 0) {
      const names = staleSources.map(s => SOURCE_LABELS[s.source_type] || s.source_type).join(', ')
      signals.push({
        id: `stale-sync-${userId}`,
        title: `${names} data is stale`,
        description: `Your ${names} ${staleSources.length > 1 ? 'connections haven\'t' : 'connection hasn\'t'} synced in over 24 hours. Answers may be outdated.`,
        severity: 'yellow',
        suggested_action: 'Re-sync now',
        prompt: `Check my ${names} data — when was my last sync and is my data up to date?`,
        metric: `${staleSources.length} stale`,
        created_at: new Date().toISOString(),
      })
    }

    // Check for errored/disconnected sources
    const errorSources = sources.filter(s => s.status === 'error' || s.status === 'disconnected')
    if (errorSources.length > 0) {
      const names = errorSources.map(s => SOURCE_LABELS[s.source_type] || s.source_type).join(', ')
      signals.push({
        id: `error-source-${userId}`,
        title: `${names} connection issue`,
        description: `Your ${names} integration needs attention — it may have been disconnected or encountered an error.`,
        severity: 'red',
        suggested_action: 'Fix connection',
        prompt: `What's wrong with my ${names} connection? How do I reconnect?`,
        metric: 'Disconnected',
        created_at: new Date().toISOString(),
      })
    }

    // Proactive insight prompts based on source types
    const types = new Set(sources.map(s => s.source_type))

    if (types.has('stripe') && signals.length === 0) {
      signals.push({
        id: `stripe-insight-${userId}`,
        title: 'Weekly revenue check available',
        description: 'Your Stripe data is connected. Ask for a revenue breakdown, failed payment analysis, or churn risk report.',
        severity: 'blue',
        suggested_action: 'Analyse revenue',
        prompt: 'Give me a detailed Stripe revenue breakdown for the past 7 days. Include failed payments, refunds, and net revenue.',
        created_at: new Date().toISOString(),
      })
    }

    if (types.has('shopify') && signals.length === 0) {
      signals.push({
        id: `shopify-insight-${userId}`,
        title: 'Sales performance ready',
        description: 'Your Shopify store is connected. Ask about top products, conversion rates, or inventory levels.',
        severity: 'blue',
        suggested_action: 'Check sales',
        prompt: 'What are my top selling Shopify products this week? Include revenue, units sold, and any products with declining sales.',
        created_at: new Date().toISOString(),
      })
    }

    if ((types.has('xero') || types.has('quickbooks')) && signals.length === 0) {
      signals.push({
        id: `accounting-insight-${userId}`,
        title: 'Financial health check ready',
        description: 'Your accounting data is connected. Ask about cash flow, profit margins, or upcoming expenses.',
        severity: 'blue',
        suggested_action: 'Run health check',
        prompt: 'Give me a financial health check — current cash position, monthly burn rate, and any concerning expense trends.',
        created_at: new Date().toISOString(),
      })
    }

    return signals
  } catch (err) {
    console.error('Source signal check error:', err)
    return []
  }
}

async function runPOSSignals(userId: string): Promise<Signal[]> {
  try {
    const service = createServiceClient()

    const now = new Date()
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); sevenDaysAgo.setHours(0, 0, 0, 0)

    const [invRes, recentTxRes, todayTxRes] = await Promise.all([
      service.from('inventory')
        .select('name,stock_qty,low_stock_threshold,sale_price,cost_price')
        .eq('owner_id', userId).eq('active', true)
        .order('stock_qty', { ascending: true }).limit(100),
      service.from('pos_transactions')
        .select('total,status,created_at,pos_items(name,qty,unit_price,cost_price)')
        .eq('owner_id', userId).eq('status', 'completed')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false }).limit(500),
      service.from('pos_transactions')
        .select('total')
        .eq('owner_id', userId).eq('status', 'completed')
        .gte('created_at', todayStart.toISOString()),
    ])

    const inventory = invRes.data || []
    const recentTx = recentTxRes.data || []
    const todayTx = todayTxRes.data || []

    if (inventory.length === 0 && recentTx.length === 0) return []

    // Flatten line items from last 7 days
    const recentSales: { name: string; qty: number; unit_price: number; cost_price: number }[] = []
    for (const tx of recentTx) {
      for (const item of (tx.pos_items || [])) {
        recentSales.push({
          name: item.name,
          qty: item.qty,
          unit_price: item.unit_price,
          cost_price: item.cost_price || 0,
        })
      }
    }

    // Calculate daily averages (exclude today)
    const pastTx = recentTx.filter((t: any) => new Date(t.created_at) < todayStart)
    const daysWithSales = new Set(pastTx.map((t: any) => t.created_at.slice(0, 10))).size || 1
    const pastRevenue = pastTx.reduce((s: number, t: any) => s + t.total, 0)
    const avgDailyRevenue = pastRevenue / daysWithSales

    const todayRevenue = todayTx.reduce((s: number, t: any) => s + t.total, 0)

    return runHealthCheckFromPOSData({
      inventory,
      recentSales,
      todayRevenue,
      avgDailyRevenue,
    })
  } catch (err) {
    console.error('POS signal check error:', err)
    return []
  }
}
