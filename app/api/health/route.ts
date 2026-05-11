import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateHealthScore, detectAnomalies } from '@/lib/health-score'

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
    .select('score, label, color, created_at')
    .eq('user_id', uid)
    .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString())
    .order('created_at', { ascending: true })

  return NextResponse.json({ latest, anomalies: anomalies || [], history: history || [] })
}
