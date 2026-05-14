import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// POST: log a new decision
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, description, decision_type, product, before_value, after_value, context_snapshot } = body

  const review_at = new Date(Date.now() + 42 * 86400000).toISOString() // 6 weeks

  const { data, error } = await supabase.from('decisions').insert({
    user_id: user.id,
    title, description, decision_type,
    product, before_value, after_value,
    context_snapshot, review_at,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ decision: data })
}

// GET: list decisions (optionally filter by due for review)
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const dueForReview = searchParams.get('due') === 'true'

  let q = supabase.from('decisions').select('*').eq('user_id', user.id)

  if (dueForReview) {
    q = q.eq('reviewed', false).lte('review_at', new Date().toISOString())
  }

  const { data, error } = await q.order('created_at', { ascending: false }).limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ decisions: data || [] })
}

// PATCH: review a decision - AI generates the outcome summary
export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, current_data, current_health } = await request.json()

  const { data: decision } = await supabase
    .from('decisions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!decision) return NextResponse.json({ error: 'Decision not found' }, { status: 404 })

  // Ask Claude to review the outcome
  let review_result = 'Review data not available.'
  let review_verdict: 'good_call' | 'bad_call' | 'neutral' = 'neutral'

  try {
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `You are reviewing the outcome of a business decision made 6 weeks ago. Return ONLY valid JSON.

Decision: "${decision.title}"
What they changed: ${decision.before_value} → ${decision.after_value}
Product: ${decision.product || 'N/A'}

Current business data context:
${current_data ? JSON.stringify(current_data).slice(0, 500) : 'No current data provided.'}
${current_health ? `Business health score: ${current_health}/100` : ''}

Return:
{
  "review_result": "2-3 sentence plain English summary of what happened after this decision. Be specific about whether it worked. Include any numbers if available.",
  "review_verdict": "good_call|bad_call|neutral"
}`
      }],
    })
    const raw = res.content[0].type === 'text' ? res.content[0].text : ''
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
    review_result = parsed.review_result
    review_verdict = parsed.review_verdict
  } catch (e) {
    console.error('[decisions] review error:', e)
  }

  const { data: updated } = await supabase
    .from('decisions')
    .update({ reviewed: true, review_result, review_verdict })
    .eq('id', id)
    .select()
    .single()

  return NextResponse.json({ decision: updated })
}
