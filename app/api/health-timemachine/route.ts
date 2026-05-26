import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrencySymbol } from '@/lib/get-currency'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 20

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sym = await getCurrencySymbol(supabase, user.id)
  const { searchParams } = new URL(req.url)
  const compareDate = searchParams.get('compare')

  // Get all health scores (up to 180 days)
  const since = new Date(Date.now() - 180 * 86400000).toISOString()
  const { data: scores } = await supabase
    .from('health_scores')
    .select('score, label, color, components, summary, created_at')
    .eq('user_id', user.id)
    .gte('created_at', since)
    .order('created_at', { ascending: true })
    .limit(500)

  if (!scores?.length) {
    return NextResponse.json({ snapshots: [], timeline: [], analysis: null, currency_symbol: sym })
  }

  // Build weekly snapshots
  const weeklyMap: Record<string, { scores: number[]; labels: string[]; components: any[]; summaries: string[]; date: string }> = {}
  for (const s of scores) {
    const weekStart = getWeekStart(new Date(s.created_at))
    if (!weeklyMap[weekStart]) weeklyMap[weekStart] = { scores: [], labels: [], components: [], summaries: [], date: weekStart }
    weeklyMap[weekStart].scores.push(s.score)
    weeklyMap[weekStart].labels.push(s.label)
    if (s.components) weeklyMap[weekStart].components.push(s.components)
    if (s.summary) weeklyMap[weekStart].summaries.push(s.summary)
  }

  const snapshots = Object.values(weeklyMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(w => ({
      week: w.date,
      avg_score: Math.round(w.scores.reduce((a, b) => a + b, 0) / w.scores.length),
      min_score: Math.min(...w.scores),
      max_score: Math.max(...w.scores),
      label: w.labels[w.labels.length - 1],
      samples: w.scores.length,
      components: w.components[w.components.length - 1] || null,
      summary: w.summaries[w.summaries.length - 1] || null,
    }))

  // Timeline for chart
  const timeline = scores.map(s => ({
    date: s.created_at.split('T')[0],
    score: s.score,
    label: s.label,
  }))

  // If compare date requested, generate AI analysis
  let analysis: string | null = null
  if (compareDate && snapshots.length >= 2) {
    const compareSnapshot = snapshots.find(s => s.week <= compareDate) || snapshots[0]
    const currentSnapshot = snapshots[snapshots.length - 1]

    if (compareSnapshot && currentSnapshot && compareSnapshot.week !== currentSnapshot.week) {
      const context = [
        `THEN (${compareSnapshot.week}): Score ${compareSnapshot.avg_score}/100, Label: "${compareSnapshot.label}"`,
        compareSnapshot.summary ? `Summary: ${compareSnapshot.summary}` : '',
        compareSnapshot.components ? `Components: ${JSON.stringify(compareSnapshot.components)}` : '',
        '',
        `NOW (${currentSnapshot.week}): Score ${currentSnapshot.avg_score}/100, Label: "${currentSnapshot.label}"`,
        currentSnapshot.summary ? `Summary: ${currentSnapshot.summary}` : '',
        currentSnapshot.components ? `Components: ${JSON.stringify(currentSnapshot.components)}` : '',
        '',
        `Score change: ${currentSnapshot.avg_score - compareSnapshot.avg_score > 0 ? '+' : ''}${currentSnapshot.avg_score - compareSnapshot.avg_score} points`,
      ].filter(Boolean).join('\n')

      try {
        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          messages: [{ role: 'user', content: `You are a business analyst. Compare these two health score snapshots and explain what changed in 2-3 concise bullet points. Be specific about which metrics improved or declined and why it matters.

${context}

Respond with plain text bullet points only, no markdown headers.` }],
        })
        analysis = (response.content[0] as { type: string; text: string }).text
      } catch {
        analysis = null
      }
    }
  }

  // Key milestones
  const milestones: { date: string; event: string; score_before: number; score_after: number }[] = []
  for (let i = 1; i < snapshots.length; i++) {
    const diff = snapshots[i].avg_score - snapshots[i - 1].avg_score
    if (Math.abs(diff) >= 10) {
      milestones.push({
        date: snapshots[i].week,
        event: diff > 0 ? `Score jumped +${diff} points` : `Score dropped ${diff} points`,
        score_before: snapshots[i - 1].avg_score,
        score_after: snapshots[i].avg_score,
      })
    }
  }

  return NextResponse.json({
    snapshots,
    timeline,
    milestones,
    analysis,
    current: snapshots.length ? snapshots[snapshots.length - 1] : null,
    oldest: snapshots.length ? snapshots[0] : null,
    total_change: snapshots.length >= 2 ? snapshots[snapshots.length - 1].avg_score - snapshots[0].avg_score : 0,
    currency_symbol: sym,
  })
}

function getWeekStart(date: Date): string {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay() + 1)
  return d.toISOString().split('T')[0]
}
