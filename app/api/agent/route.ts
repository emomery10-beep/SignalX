import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch } from '@/lib/tavily'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 300

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

const SCOUT_QUERIES = [
  'SME retail ecommerce trends UK EU 2026',
  'global shipping customs tax changes ecommerce 2026',
  'small business inflation pricing strategy 2026',
  'EU AI Act GDPR compliance SME 2026',
  'UK EU trade import export small business 2026',
]

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── GET: manual trigger ───────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runAgent()
}

// ── POST: Vercel Cron ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runAgent()
}

async function runAgent() {
  const runId = `run_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Agent starting...')

    // Scout
    const query = SCOUT_QUERIES[Math.floor(Math.random() * SCOUT_QUERIES.length)]
    const searchResult = await tavilySearch(query, {
      searchDepth: 'advanced',
      maxResults: 5,
      includeAnswer: true,
      topic: 'news',
      days: 3,
    })

    if (!searchResult?.results?.length) {
      log.push('No search results — agent exiting')
      return NextResponse.json({ success: false, log, reason: 'no_results' })
    }

    const topArticle = searchResult.results[0]
    log.push(`Top article: "${topArticle.title}"`)

    const articleContext = searchResult.results
      .slice(0, 3)
      .map((r, i) => `[${i + 1}] ${r.title}\n${r.content.slice(0, 300)}`)
      .join('\n\n')

    // Analyse
    log.push('Analysing for SME impact...')
    const analysis = await analyseNews(query, articleContext, topArticle.title, topArticle.url)
    log.push(`Verdict: ${analysis.verdict} — ${analysis.verdict_sentence}`)

    // Write 3 content pieces in parallel
    log.push('Writing content...')
    const [blogPost, thread, smartReplies] = await Promise.allSettled([
      writeBlogPost(analysis, query, articleContext, topArticle),
      writeThread(analysis, topArticle),
      writeSmartReplies(analysis, topArticle),
    ])

    // Save to DB as pending
    log.push('Saving to database...')
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const basePayload = {
      run_id: runId,
      source_url: topArticle.url,
      source_title: topArticle.title,
      source_query: query,
      verdict: analysis.verdict,
      verdict_sentence: analysis.verdict_sentence,
      scenario: analysis.scenario,
      pulse_signal: analysis.pulse_signal,
      key_insight: analysis.key_insight,
    }

    const inserts = []

    if (blogPost.status === 'fulfilled') {
      inserts.push({ ...basePayload, type: 'blog', status: 'pending', content: blogPost.value })
      log.push('Blog post saved')
    } else {
      log.push(`Blog post failed: ${blogPost.reason}`)
    }

    if (thread.status === 'fulfilled') {
      inserts.push({ ...basePayload, type: 'thread', status: 'pending', content: thread.value })
      log.push('Thread saved')
    } else {
      log.push(`Thread failed: ${thread.reason}`)
    }

    if (smartReplies.status === 'fulfilled') {
      inserts.push({ ...basePayload, type: 'smart_reply', status: 'pending', content: smartReplies.value })
      log.push('Smart replies saved')
    } else {
      log.push(`Smart replies failed: ${smartReplies.reason}`)
    }

    if (inserts.length > 0) {
      const { error } = await supabase.from('agent_content').insert(inserts)
      if (error) log.push(`DB error: ${error.message}`)
    }

    log.push(`Agent complete. ${inserts.length}/3 items saved as pending.`)

    return NextResponse.json({
      success: true,
      runId,
      itemsSaved: inserts.length,
      verdict: analysis.verdict,
      source: topArticle.title,
      log,
    })

  } catch (err) {
    log.push(`Fatal error: ${err instanceof Error ? err.message : String(err)}`)
    return NextResponse.json({ success: false, log, error: String(err) }, { status: 500 })
  }
}

async function analyseNews(query: string, context: string, title: string, url: string) {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `You are an expert SME business analyst. Analyse this news for small business owners and return ONLY valid JSON.

News topic: "${query}"
Article: "${title}"
Context:
${context}

Return this exact JSON:
{
  "verdict": "act|watch|problem",
  "verdict_sentence": "One sentence, one action, max 20 words, plain English",
  "scenario": "A what-if question a founder would ask. e.g. What if my shipping costs go up 15%?",
  "pulse_signal": "One-line Pulse Bar text. Max 15 words.",
  "key_insight": "The single most useful number or fact for an SME. Plain English.",
  "slug_suffix": "3-5 word kebab-case slug suffix",
  "blog_title": "SEO-friendly blog post title under 65 chars",
  "meta_description": "Blog meta description under 155 chars, active voice"
}`
    }],
  })

  const raw = res.content[0].type === 'text' ? res.content[0].text : ''
  const clean = raw.replace(/```json|```/g, '').trim()
  try {
    return JSON.parse(clean)
  } catch {
    return { verdict: 'watch', verdict_sentence: 'Monitor this development closely.', slug_suffix: 'daily-intel', blog_title: title.slice(0, 60), meta_description: '' }
  }
}

async function writeBlogPost(analysis: Record<string, string>, query: string, context: string, article: { title: string; url: string; content: string }) {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You are the AskBiz blog writer. Write a blog post for SME founders in plain English. Return ONLY valid JSON.

News source: "${article.title}" (${article.url})
Key insight: ${analysis.key_insight}
Verdict: ${analysis.verdict} — ${analysis.verdict_sentence}
Scenario: ${analysis.scenario}

Context:
${context}

Return this JSON structure:
{
  "slug": "agent-${Date.now()}-${analysis.slug_suffix || 'news'}",
  "title": "${analysis.blog_title || 'Business Intelligence Update'}",
  "metaDescription": "${analysis.meta_description || ''}",
  "cluster": "BI News & Trends 2026",
  "pillar": "Market Intelligence",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 5,
  "tldr": "3-sentence TL;DR in plain English.",
  "sections": [
    {"heading": "What happened and why it matters for your shop", "level": 2, "body": "Write 150 words here"},
    {"heading": "The number that matters", "level": 2, "body": "Write 150 words here"},
    {"heading": "What smart founders are doing right now", "level": 2, "body": "Write 150 words here"},
    {"heading": "How AskBiz helps you act on this today", "level": 2, "body": "Write 150 words showing a founder asking AskBiz this question and getting a plain-English verdict"},
    {"heading": "The bottom line", "level": 2, "body": "Write 100 words here"}
  ],
  "paa": [
    {"q": "Relevant question 1?", "a": "Plain English answer"},
    {"q": "Relevant question 2?", "a": "Plain English answer"},
    {"q": "How can AskBiz help me with this?", "a": "Specific answer"}
  ],
  "cta": {
    "heading": "Find out how this affects your margins",
    "body": "Upload your data to AskBiz and ask about this in plain English. Get your answer in seconds."
  },
  "relatedSlugs": ["ai-business-health-score", "predictive-analytics-small-business"]
}`
    }],
  })

  const raw = res.content[0].type === 'text' ? res.content[0].text : ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

async function writeThread(analysis: Record<string, string>, article: { title: string; url: string }) {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `Write a 5-tweet thread for SME founders about this news. Plain English. Under 280 chars per tweet. Return ONLY valid JSON.

News: "${article.title}"
Key insight: ${analysis.key_insight}
Verdict: ${analysis.verdict} — ${analysis.verdict_sentence}

Return:
{
  "tweets": [
    {"num": 1, "text": "Hook with verdict"},
    {"num": 2, "text": "What happened"},
    {"num": 3, "text": "What it means for shop owners"},
    {"num": 4, "text": "One action to take now"},
    {"num": 5, "text": "CTA mentioning askbiz.co"}
  ]
}`
    }],
  })

  const raw = res.content[0].type === 'text' ? res.content[0].text : ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

async function writeSmartReplies(analysis: Record<string, string>, article: { title: string }) {
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Write 3 smart social media replies about this news topic. Under 255 chars each. Add genuine value. Mention askbiz.co naturally. Return ONLY valid JSON.

News: "${article.title}"
Key insight: ${analysis.key_insight}

Return:
{
  "replies": [
    {"trigger": "Someone worried about this news", "reply": "Your reply text"},
    {"trigger": "Someone asking what to do", "reply": "Your reply text"},
    {"trigger": "Someone sharing the news", "reply": "Your reply text"}
  ]
}`
    }],
  })

  const raw = res.content[0].type === 'text' ? res.content[0].text : ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
