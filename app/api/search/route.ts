import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { tavilySearch, formatSearchContext } from '@/lib/tavily'

export const runtime = 'nodejs'
export const maxDuration = 15

// ── GET /api/search?q=query ───────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const topic = (searchParams.get('topic') || 'general') as 'general' | 'news'
  const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : undefined

  if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 })

  const result = await tavilySearch(query, {
    searchDepth: 'basic',
    maxResults: 5,
    includeAnswer: true,
    topic,
    days,
  })

  if (!result) {
    return NextResponse.json(
      { error: 'Search unavailable — check TAVILY_API_KEY in Vercel env vars' },
      { status: 503 }
    )
  }

  const context = formatSearchContext(result, 5)

  return NextResponse.json({
    query: result.query,
    answer: result.answer,
    results: result.results,
    context,
    response_time: result.response_time,
  })
}

// ── POST /api/search ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    query,
    searchDepth = 'basic',
    maxResults = 5,
    includeAnswer = true,
    topic = 'general',
    days,
    includeDomains,
    excludeDomains,
  } = body

  if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 })

  const result = await tavilySearch(query, {
    searchDepth,
    maxResults,
    includeAnswer,
    topic,
    days,
    includeDomains,
    excludeDomains,
  })

  if (!result) {
    return NextResponse.json(
      { error: 'Search unavailable — check TAVILY_API_KEY in Vercel env vars' },
      { status: 503 }
    )
  }

  const context = formatSearchContext(result, maxResults)

  return NextResponse.json({
    query: result.query,
    answer: result.answer,
    results: result.results,
    context,
    response_time: result.response_time,
  })
}
