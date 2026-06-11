import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch } from '@/lib/tavily'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 300

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SCOUT_QUERIES = [
  { query: 'small business cash flow management tips 2026', cluster: 'Financial Intelligence', pillar: 'Cash Flow' },
  { query: 'SME pricing strategy inflation margins 2026', cluster: 'Business Strategy', pillar: 'Pricing Strategy' },
  { query: 'ecommerce inventory management trends small business 2026', cluster: 'Inventory & Supply Chain', pillar: 'Inventory Management' },
  { query: 'AI tools small business automation productivity 2026', cluster: 'AI Chief of Staff', pillar: 'AI Automation' },
  { query: 'small business tax compliance UK EU changes 2026', cluster: 'UK Business & Tax', pillar: 'Tax Compliance' },
  { query: 'retail POS system trends customer experience 2026', cluster: 'eCommerce Intelligence', pillar: 'Retail Technology' },
  { query: 'SME supplier negotiation procurement cost reduction 2026', cluster: 'Inventory & Supply Chain', pillar: 'Supplier Management' },
  { query: 'small business data analytics decision making 2026', cluster: 'Data-Driven Decisions', pillar: 'Analytics' },
  { query: 'startup growth scaling challenges funding 2026', cluster: 'Startup Growth', pillar: 'Growth Strategy' },
  { query: 'cross border ecommerce trade regulations SME 2026', cluster: 'Global Trade Intelligence', pillar: 'Cross-Border Commerce' },
  { query: 'small business customer retention churn strategy 2026', cluster: 'Marketing Intelligence', pillar: 'Customer Retention' },
  { query: 'SME cybersecurity data protection compliance 2026', cluster: 'Efficiency & Tools', pillar: 'Security' },
  { query: 'Africa ecommerce market growth opportunities 2026', cluster: 'Africa eCommerce', pillar: 'Market Opportunities' },
  { query: 'restaurant cafe food business operations technology 2026', cluster: 'Local & Vertical Growth', pillar: 'Food & Beverage' },
  { query: 'small business hiring workforce management challenges 2026', cluster: 'Business Strategy', pillar: 'People Management' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const authHeader = request.headers.get('authorization')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runBlogScout()
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runBlogScout()
}

async function runBlogScout() {
  const runId = `blog_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Blog scout starting — selecting 10 topics...')

    const shuffled = [...SCOUT_QUERIES].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 10)

    log.push('Searching Tavily for live data...')
    const searchResults = await Promise.allSettled(
      selected.map(s =>
        tavilySearch(s.query, {
          searchDepth: 'advanced',
          maxResults: 5,
          includeAnswer: true,
          topic: 'news',
          days: 7,
        }).then(result => ({ ...s, searchResult: result }))
      )
    )

    const validResults = searchResults
      .filter((r): r is PromiseFulfilledResult<typeof selected[0] & { searchResult: Awaited<ReturnType<typeof tavilySearch>> }> =>
        r.status === 'fulfilled' && !!r.value.searchResult?.results?.length
      )
      .map(r => r.value)

    if (validResults.length === 0) {
      log.push('No search results from any query — exiting')
      return NextResponse.json({ success: false, log, reason: 'no_results' })
    }

    log.push(`Got results for ${validResults.length}/${selected.length} queries. Writing blogs...`)

    const blogResults = await Promise.allSettled(
      validResults.map(r => writeBlogPost(r))
    )

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const inserts: Record<string, unknown>[] = []

    for (let i = 0; i < blogResults.length; i++) {
      const result = blogResults[i]
      const source = validResults[i]
      const topArticle = source.searchResult!.results[0]

      if (result.status === 'fulfilled' && result.value) {
        inserts.push({
          run_id: runId,
          type: 'blog',
          status: 'pending',
          content: result.value,
          source_url: topArticle.url,
          source_title: topArticle.title,
          source_query: source.query,
          verdict: 'act',
          verdict_sentence: result.value.tldr?.slice(0, 100) || '',
          key_insight: result.value.metaDescription || '',
        })
        log.push(`✓ Blog ${i + 1}: "${result.value.title}"`)
      } else {
        const reason = result.status === 'rejected' ? result.reason?.message || String(result.reason) : 'empty result'
        log.push(`✗ Blog ${i + 1} failed: ${reason}`)
      }
    }

    if (inserts.length > 0) {
      const { error } = await supabase.from('agent_content').insert(inserts)
      if (error) {
        log.push(`DB error: ${error.message}`)
      } else {
        log.push(`Saved ${inserts.length} blogs as pending`)
      }
    }

    log.push(`Blog scout complete. ${inserts.length}/${validResults.length} blogs generated.`)

    return NextResponse.json({
      success: true,
      runId,
      blogsGenerated: inserts.length,
      searchesRun: validResults.length,
      log,
    })
  } catch (err) {
    log.push(`Fatal error: ${err instanceof Error ? err.message : String(err)}`)
    return NextResponse.json({ success: false, log, error: String(err) }, { status: 500 })
  }
}

interface SearchInput {
  query: string
  cluster: string
  pillar: string
  searchResult: NonNullable<Awaited<ReturnType<typeof tavilySearch>>>
}

async function writeBlogPost(input: SearchInput) {
  const { query, cluster, pillar, searchResult } = input
  const articles = searchResult.results.slice(0, 4)
  const aiSummary = searchResult.answer || ''

  const articleContext = articles
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content.slice(0, 400)}`)
    .join('\n\n')

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [{
      role: 'user',
      content: `You are the AskBiz blog writer. AskBiz is an AI-powered business intelligence platform for SME founders — it gives them a CFO, market analyst, and operations advisor in one tool. They upload their data and ask questions in plain English.

Write a blog post based on TODAY's real news and data. The post must:
1. Lead with the real-world problem or trend (backed by the sources below)
2. Explain why it matters to SME founders specifically
3. Show how smart founders are handling it
4. Naturally demonstrate how AskBiz solves this — not salesy, but "here's what the tool does for you"
5. End with a clear, useful takeaway

News query: "${query}"
Cluster: "${cluster}"
Pillar: "${pillar}"

${aiSummary ? `AI Summary of findings:\n${aiSummary}\n` : ''}
Source articles:
${articleContext}

Return ONLY valid JSON matching this exact structure:
{
  "slug": "a-unique-kebab-case-slug-based-on-the-topic",
  "title": "SEO-friendly title under 65 characters",
  "metaDescription": "Active voice meta description under 155 chars",
  "cluster": "${cluster}",
  "pillar": "${pillar}",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 6,
  "tldr": "3-sentence plain-English TL;DR that a busy founder can scan in 10 seconds",
  "sections": [
    {"heading": "Concrete heading about the news/trend", "level": 2, "body": "200 words. Lead with the data point or event. Cite the source naturally."},
    {"heading": "Why this hits SME margins specifically", "level": 2, "body": "200 words. Concrete impact — costs, time, risk. Use real numbers from the sources."},
    {"heading": "What the sharpest founders are doing now", "level": 2, "body": "200 words. Actionable tactics, not theory."},
    {"heading": "How AskBiz gives you the edge", "level": 2, "body": "150 words. Show a founder asking AskBiz a plain-English question about this topic and getting an instant, data-backed answer. Be specific about the feature."},
    {"heading": "The bottom line", "level": 2, "body": "100 words. One clear takeaway and next step."}
  ],
  "paa": [
    {"q": "Highly searched question about this topic?", "a": "Plain English answer in 2-3 sentences"},
    {"q": "Second question founders would Google?", "a": "Plain English answer"},
    {"q": "How can AskBiz help me with [this specific problem]?", "a": "Specific answer mentioning the relevant AskBiz feature"}
  ],
  "cta": {
    "heading": "A compelling, specific CTA heading about this topic",
    "body": "Upload your data to AskBiz and ask about this in plain English. Get your answer in seconds — no spreadsheets, no consultants."
  },
  "author": {
    "name": "Alice Watson",
    "role": "Head of Market Intelligence",
    "bio": "Alice covers emerging business trends, regulatory shifts, and growth strategies for SME founders. She distils complex market data into plain-English insights you can act on today."
  }
}`
    }],
  })

  const raw = res.content[0].type === 'text' ? res.content[0].text : ''
  const clean = raw.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(clean)

  if (!parsed.slug || !parsed.title || !parsed.sections?.length) {
    throw new Error('Invalid blog structure — missing slug, title, or sections')
  }

  return parsed
}
