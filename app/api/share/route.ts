import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { capText } from '@/lib/sanitize'

export const runtime = 'nodejs'

// ── POST /api/share — create a shareable link ─────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    question,
    answer_text,
    insight_header,
    kpi_cards,
    chart_type,
    chart_labels,
    chart_values,
    chart_label,
    recommendations,
  } = body

  if (!question || !answer_text) {
    return NextResponse.json({ error: 'question and answer_text are required' }, { status: 400 })
  }

  // Everything here is client-supplied and ends up on a PUBLIC, unauthenticated
  // page (/insight/[id]), so it is untrusted no matter that the caller is
  // signed in. What makes it safe is escaping at the render site — the page
  // escapes answer_text before formatting it, and React escapes the rest as JSX
  // text. These caps are here so the share endpoint can't be used to publish
  // arbitrary long-form content on our own domain. Markup is deliberately NOT
  // stripped: a real insight says things like "products selling < 10 a week".
  if (String(question).length > 2_000 || String(answer_text).length > 20_000) {
    return NextResponse.json({ error: 'Insight too large to share' }, { status: 413 })
  }
  const cleanRecommendations = Array.isArray(recommendations)
    ? recommendations.slice(0, 20).map(r => capText(r, 500))
    : null

  const { data, error } = await supabase
    .from('shared_insights')
    .insert({
      user_id: user.id,
      question: capText(question, 2_000),
      answer_text,
      insight_header: insight_header ? capText(insight_header, 300) : null,
      kpi_cards: kpi_cards || null,
      chart_type: chart_type || null,
      chart_labels: chart_labels || null,
      chart_values: chart_values || null,
      chart_label: chart_label || null,
      recommendations: cleanRecommendations,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[share] insert error:', error)
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 })
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/insight/${data.id}`
  return NextResponse.json({ id: data.id, url })
}

// ── GET /api/share?id=xxx — fetch a shared insight ────────────────────────────
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('shared_insights')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Insight not found' }, { status: 404 })
  }

  // Increment view count non-blocking
  supabase.rpc('increment_insight_views', { insight_id: id }).then(() => {})

  return NextResponse.json(data)
}
