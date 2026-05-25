import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { calculateHealthScore, detectAnomalies, calculateHealthScoreFromPOS } from '@/lib/health-score'
import type { HealthScore } from '@/lib/health-score'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const { rows, headers, previousRows, cashBalance, monthlyFixedCosts, userId } = body

  // Allow internal sync calls with userId override
  const isInternal = request.headers.get('x-internal') === 'sync'
  const uid = (isInternal && userId) ? userId : user?.id
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Calculate health score
  const health = calculateHealthScore({ rows, headers, previousRows, cashBalance, monthlyFixedCosts })

  // Detect anomalies
  const anomalies = detectAnomalies(rows, headers, previousRows)

  // Save health score to DB
  await supabase.from('health_scores').insert({
    user_id: uid,
    score: health.score,
    label: health.label,
    color: health.color,
    components: health.components,
    summary: health.summary,
  })

  // Save new anomalies — deduplicate within last 24h
  if (anomalies.length > 0) {
    const { data: recent } = await supabase
      .from('anomalies')
      .select('type, product')
      .eq('user_id', uid)
      .gte('created_at', new Date(Date.now() - 86400000).toISOString())

    const recentKeys = new Set((recent || []).map(r => `${r.type}:${r.product || ''}`))

    const newAnomalies = anomalies
      .filter(a => !recentKeys.has(`${a.type}:${a.product || ''}`))
      .map(a => ({ ...a, user_id: uid }))

    if (newAnomalies.length > 0) {
      await supabase.from('anomalies').insert(newAnomalies)
    }
  }

  return NextResponse.json({ health, anomalies })
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const uid = user.id

  // Latest health score
  const { data: latest } = await supabase
    .from('health_scores')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // If no recent score (older than 24h or none), try generating from POS data
  const isStale = !latest || (Date.now() - new Date(latest.created_at).getTime() > 86400000)
  let posHealth: HealthScore | null = null

  if (isStale) {
    posHealth = await generatePOSHealthScore(uid)
    if (posHealth && posHealth.score > 0) {
      const service = createServiceClient()
      await service.from('health_scores').insert({
        user_id: uid,
        score: posHealth.score,
        label: posHealth.label,
        color: posHealth.color,
        components: posHealth.components,
        summary: posHealth.summary,
      })
    }
  }

  // Unseen anomalies
  const { data: anomalies } = await supabase
    .from('anomalies')
    .select('*')
    .eq('user_id', uid)
    .eq('seen', false)
    .order('created_at', { ascending: false })
    .limit(20)

  // 30-day score history
  const { data: history } = await supabase
    .from('health_scores')
    .select('score, label, color, components, summary, created_at')
    .eq('user_id', uid)
    .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
    .order('created_at', { ascending: true })

  const effectiveLatest = (posHealth && posHealth.score > 0) ? {
    score: posHealth.score,
    label: posHealth.label,
    color: posHealth.color,
    components: posHealth.components,
    summary: posHealth.summary,
    created_at: new Date().toISOString(),
  } : latest

  return NextResponse.json({ latest: effectiveLatest, anomalies: anomalies || [], history: history || [] })
}

async function generatePOSHealthScore(userId: string): Promise<HealthScore | null> {
  try {
    const service = createServiceClient()

    const now = new Date()
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); thirtyDaysAgo.setHours(0, 0, 0, 0)
    const sixtyDaysAgo = new Date(now); sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60); sixtyDaysAgo.setHours(0, 0, 0, 0)

    const [txRes, prevTxRes, invRes] = await Promise.all([
      service.from('pos_transactions')
        .select('total,status,created_at,pos_items(name,qty,unit_price,cost_price)')
        .eq('owner_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false }).limit(500),
      service.from('pos_transactions')
        .select('total,status,created_at,pos_items(name,qty,unit_price,cost_price)')
        .eq('owner_id', userId)
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false }).limit(500),
      service.from('inventory')
        .select('name,stock_qty,low_stock_threshold,sale_price,cost_price')
        .eq('owner_id', userId).eq('active', true).limit(200),
    ])

    const transactions = txRes.data || []
    const previousTransactions = prevTxRes.data || []
    const inventory = invRes.data || []

    if (transactions.length === 0 && inventory.length === 0) return null

    return calculateHealthScoreFromPOS({
      transactions: transactions as any,
      previousTransactions: previousTransactions as any,
      inventory: inventory as any,
    })
  } catch (err) {
    console.error('POS health score generation error:', err)
    return null
  }
}
