import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST: generate daily brief for a user (called by cron or user)
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return generateBrief(user.id, supabase)
}

// GET: fetch today's brief for the current user
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const today = new Date().toISOString().slice(0, 10)

  const { data: brief } = await supabase
    .from('daily_briefs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  if (brief) {
    // Mark as opened
    await supabase.from('daily_briefs').update({ opened_at: new Date().toISOString() }).eq('id', brief.id)
    return NextResponse.json({ brief, fresh: false })
  }

  // Generate fresh if not exists
  return generateBrief(user.id, supabase)
}

async function generateBrief(userId: string, supabase: ReturnType<typeof createClient>) {
  const today = new Date().toISOString().slice(0, 10)

  // Get latest health score
  const { data: health } = await supabase
    .from('health_scores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Get unseen anomalies
  const { data: anomalies } = await supabase
    .from('anomalies')
    .select('*')
    .eq('user_id', userId)
    .eq('seen', false)
    .order('created_at', { ascending: false })
    .limit(5)

  // Get recent decisions due for review
  const { data: decisions } = await supabase
    .from('decisions')
    .select('*')
    .eq('user_id', userId)
    .eq('reviewed', false)
    .lte('review_at', new Date(Date.now() + 7 * 86400000).toISOString())
    .order('review_at', { ascending: true })
    .limit(3)

  // Build context for Claude
  const healthContext = health
    ? `Business Health Score: ${health.score}/100 (${health.label}). ${health.summary}`
    : 'No health score data yet.'

  const anomalyContext = anomalies?.length
    ? `Active alerts:\n${anomalies.map(a => `- ${a.title}: ${a.body}`).join('\n')}`
    : 'No active alerts.'

  const decisionContext = decisions?.length
    ? `Pending decision reviews:\n${decisions.map(d => `- ${d.title} (due ${new Date(d.review_at).toLocaleDateString('en-GB')})`).join('\n')}`
    : ''

  let brief = {
    improved: "Your business data is connected and being monitored.",
    worsened: "No critical issues detected today.",
    action: "Ask AskBiz about your current performance to get personalised insights.",
    health_score: health?.score || 0,
  }

  if (health || anomalies?.length) {
    try {
      const res = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `You are the AskBiz morning brief generator. Based on this business data, write a concise morning brief. Plain English. No jargon. Return ONLY valid JSON.

${healthContext}
${anomalyContext}
${decisionContext}

Return:
{
  "improved": "One thing that improved or is going well. One sentence, max 20 words.",
  "worsened": "One thing that needs attention or got worse. One sentence, max 20 words.",
  "action": "The single most important action for today. One sentence, max 25 words. Start with a verb."
}`
        }],
      })
      const raw = res.content[0].type === 'text' ? res.content[0].text : ''
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      brief = { ...parsed, health_score: health?.score || 0 }
    } catch (e) {
      console.error('[daily-brief] Claude error:', e)
    }
  }

  // Save to DB
  const { data: saved } = await supabase
    .from('daily_briefs')
    .upsert({
      user_id: userId,
      date: today,
      ...brief,
      sent_at: new Date().toISOString(),
      opened_at: new Date().toISOString(),
    }, { onConflict: 'user_id,date' })
    .select()
    .single()

  return NextResponse.json({ brief: saved || brief, fresh: true })
}
