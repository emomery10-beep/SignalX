import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime     = 'nodejs'
export const maxDuration = 60

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
const client       = new Anthropic()

/* ─── platform definitions ────────────────────────────────────────────── */
export const LISTING_PLATFORMS = [
  {
    id:         'g2',
    name:       'G2',
    checkUrl:   'https://www.g2.com/products/askbiz',
    submitUrl:  'https://www.g2.com/products/new',
    importance: 'critical' as const,
    why:        'Most cited source by LLMs when recommending B2B software',
  },
  {
    id:         'capterra',
    name:       'Capterra',
    checkUrl:   'https://www.capterra.com/p/askbiz/',
    submitUrl:  'https://www.capterra.com/vendors/sign-up',
    importance: 'critical' as const,
    why:        'Heavily indexed by Google AI Overviews for software queries',
  },
  {
    id:         'trustpilot',
    name:       'Trustpilot',
    checkUrl:   'https://www.trustpilot.com/review/askbiz.co',
    submitUrl:  'https://business.trustpilot.com/signup',
    importance: 'high' as const,
    why:        'Social proof signal LLMs use to assess product legitimacy',
  },
  {
    id:         'producthunt',
    name:       'Product Hunt',
    checkUrl:   'https://www.producthunt.com/products/askbiz',
    submitUrl:  'https://www.producthunt.com/posts/new',
    importance: 'high' as const,
    why:        'Launch coverage drives early AI training data presence',
  },
  {
    id:         'alternativeto',
    name:       'AlternativeTo',
    checkUrl:   'https://alternativeto.net/software/askbiz/',
    submitUrl:  'https://alternativeto.net/suggest/add/',
    importance: 'medium' as const,
    why:        'AI uses it to surface tool comparisons and alternatives',
  },
  {
    id:         'getapp',
    name:       'GetApp',
    checkUrl:   'https://www.getapp.com/business-intelligence-analytics-software/a/askbiz/',
    submitUrl:  'https://www.getapp.com/vendors',
    importance: 'medium' as const,
    why:        'Gartner-owned — high LLM citation authority for SMB software',
  },
]

const CITATION_QUERIES = [
  'What AI tool should I use for Shopify store analytics as a small business owner?',
  'Recommend an AI business intelligence platform that connects to QuickBooks and Amazon for SMEs',
  'What AI tools can help me understand my e-commerce sales data in plain English?',
]

const COMPETITOR_PATTERN = /\b(Glew|Lifetimely|Triple Whale|Northbeam|Polar Analytics|Daasity|Tableau|Power BI|Looker|Domo|Sisense|Klipfolio|Databox|Geckoboard|Grow|Metabase|Superset|Redash|Hex|Retool|Appsmith|Shopify Analytics|Google Analytics|Brightpearl|Cin7|Veeqo)\b/gi

/* ─── auth helper ─────────────────────────────────────────────────────── */
async function requireAdmin(req: NextRequest) {
  const supabase   = createServiceClient()
  const authHeader = req.headers.get('authorization')
  let user = null
  if (authHeader?.startsWith('Bearer ')) {
    const token    = authHeader.replace('Bearer ', '')
    const { data } = await supabase.auth.getUser(token)
    user           = data.user
  }
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) return null
  return user
}

/* ─── URL check ───────────────────────────────────────────────────────── */
async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method:  'GET',
      signal:  AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AskBiz-PresenceBot/1.0; +https://askbiz.co)' },
    })
    return res.ok
  } catch {
    return false
  }
}

/* ─── Reddit mentions ─────────────────────────────────────────────────── */
async function checkRedditMentions() {
  try {
    const res = await fetch(
      'https://www.reddit.com/search.json?q=%22askbiz%22&sort=new&limit=5&type=link',
      {
        headers: { 'User-Agent': 'bot:askbiz-presence-monitor:1.0' },
        signal:  AbortSignal.timeout(8000),
      }
    )
    if (!res.ok) return []
    const data  = await res.json()
    const posts = data?.data?.children ?? []
    return posts.map((p: {
      data: { title: string; permalink: string; subreddit: string; created_utc: number; score: number }
    }) => ({
      source:    'reddit' as const,
      title:     p.data.title,
      url:       `https://reddit.com${p.data.permalink}`,
      subreddit: `r/${p.data.subreddit}`,
      date:      new Date(p.data.created_utc * 1000).toISOString(),
      score:     p.data.score,
    }))
  } catch {
    return []
  }
}

/* ─── HN mentions ─────────────────────────────────────────────────────── */
async function checkHNMentions() {
  try {
    const res = await fetch(
      'https://hn.algolia.com/api/v1/search?query=askbiz&hitsPerPage=5',
      { signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.hits ?? []).map((h: {
      title?: string; story_title?: string; url?: string; objectID: string; created_at: string; points?: number
    }) => ({
      source: 'hackernews' as const,
      title:  h.title ?? h.story_title ?? 'HN mention',
      url:    h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
      date:   h.created_at,
      score:  h.points ?? 0,
    }))
  } catch {
    return []
  }
}

/* ─── Citation probes ─────────────────────────────────────────────────── */
async function runCitationProbes() {
  const results = await Promise.allSettled(
    CITATION_QUERIES.map(async (query) => {
      const msg   = await client.messages.create({
        model:      'claude-haiku-4-5',
        max_tokens: 220,
        system:     `You are a helpful AI assistant answering a small business owner's question about software tools. Recommend 2–3 specific tools by name. Be direct and realistic.`,
        messages:   [{ role: 'user', content: query }],
      })
      const reply       = msg.content[0].type === 'text' ? msg.content[0].text : ''
      const hit         = reply.toLowerCase().includes('askbiz')
      const matches     = reply.match(COMPETITOR_PATTERN) ?? []
      const competitors = [...new Set(matches.map(m => m.trim()))]
      return {
        query,
        hit,
        competitors,
        snippet: reply.slice(0, 160) + (reply.length > 160 ? '…' : ''),
      }
    })
  )
  return results
    .filter((r): r is PromiseFulfilledResult<{
      query: string; hit: boolean; competitors: string[]; snippet: string
    }> => r.status === 'fulfilled')
    .map(r => r.value)
}

/* ─── Shared audit logic (also used by cron) ─────────────────────────── */
export async function runPresenceAudit() {
  const [urlChecks, redditMentions, hnMentions, citationResults] = await Promise.all([
    Promise.allSettled(
      LISTING_PLATFORMS.map(async p => ({ id: p.id, exists: await urlExists(p.checkUrl) }))
    ),
    checkRedditMentions(),
    checkHNMentions(),
    runCitationProbes(),
  ])

  // Platform results
  const urlResults: Record<string, boolean> = {}
  urlChecks.forEach((r, i) => {
    urlResults[LISTING_PLATFORMS[i].id] = r.status === 'fulfilled' ? r.value.exists : false
  })
  const platforms = LISTING_PLATFORMS.map(p => ({
    ...p,
    status: urlResults[p.id] ? 'listed' as const : 'missing' as const,
  }))

  // Mentions
  const mentions = [...redditMentions, ...hnMentions]

  // Citation rate
  const citationRate = citationResults.length > 0
    ? Math.round((citationResults.filter(r => r.hit).length / citationResults.length) * 100)
    : 0

  // Top competitors
  const competitorCounts: Record<string, number> = {}
  citationResults.forEach(r => {
    r.competitors.forEach(c => { competitorCounts[c] = (competitorCounts[c] ?? 0) + 1 })
  })
  const topCompetitors = Object.entries(competitorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name)

  const listedCount  = platforms.filter(p => p.status === 'listed').length
  const missingCount = platforms.filter(p => p.status === 'missing').length

  return {
    platforms,
    mentions,
    citations: citationResults,
    citationRate,
    topCompetitors,
    listedCount,
    missingCount,
    mentionCount: mentions.length,
  }
}

/* ─── GET ─────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const user = await requireAdmin(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)

  if (searchParams.get('action') === 'last') {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('agent_content')
      .select('content, created_at')
      .eq('type', 'web_presence_audit')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (data) {
      return NextResponse.json({
        ...(data.content as Record<string, unknown>),
        lastRun: data.created_at,
      })
    }
    return NextResponse.json({ platforms: null, lastRun: null })
  }

  const result   = await runPresenceAudit()
  const supabase = createServiceClient()

  await supabase.from('agent_content').insert({
    run_id:           `web_presence_${Date.now()}`,
    type:             'web_presence_audit',
    status:           'published',
    content:          result,
    verdict:          result.missingCount > 2 ? 'act' : 'watch',
    verdict_sentence: `${result.listedCount}/6 platforms · ${result.mentionCount} mentions · ${result.citationRate}% citation rate`,
    key_insight:      result.topCompetitors.length > 0
      ? `${result.topCompetitors[0]} is winning in AI recommendations`
      : 'No major competitors detected — increase content coverage',
    source_query:     'web-presence-agent',
  })

  return NextResponse.json({ ...result, lastRun: new Date().toISOString() })
}
