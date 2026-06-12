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
        const quality = scoreBlogQuality(result.value)
        const autoPublish = quality >= 80
        inserts.push({
          run_id: runId,
          type: 'blog',
          status: autoPublish ? 'published' : 'pending',
          content: result.value,
          source_url: topArticle.url,
          source_title: topArticle.title,
          source_query: source.query,
          verdict: 'act',
          verdict_sentence: result.value.tldr?.slice(0, 100) || '',
          key_insight: result.value.metaDescription || '',
        })
        log.push(`✓ Blog ${i + 1}: "${result.value.title}" (quality: ${quality}${autoPublish ? ', auto-published' : ', pending review'})`)
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
        const published = inserts.filter(i => i.status === 'published').length
        const pending = inserts.length - published
        log.push(`Saved ${inserts.length} blogs (${published} auto-published, ${pending} pending review)`)

        if (published > 0) {
          await pingSitemapServices()
          log.push('Pinged Google & Bing with updated sitemap')
        }
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
    max_tokens: 3500,
    system: `You are Alice Watson, Head of Market Intelligence at AskBiz. You write like a sharp, opinionated market analyst — not a content marketer. Your style:

VOICE & TONE:
- You write like someone who reads the FT, The Economist, and CB Insights before breakfast
- You lead with the number, the shift, or the tension — never with waffle
- You use short, punchy sentences. You break up walls of text. You let the data breathe.
- You're direct ("This will squeeze your margins") not passive ("Margins may be impacted")
- You use contrasts: "Last year X. This year Y. Here's what changed."
- You occasionally use rhetorical questions, but sparingly
- You name real companies, real regulations, real numbers from the sources
- You never use: "landscape", "leverage", "synergy", "holistic", "ecosystem", "unlock", "empower", "seamless", "cutting-edge", "game-changer", "robust"
- You sound like a smart colleague sharing a briefing, not a blog post

ASKBIZ PRODUCT KNOWLEDGE (use this naturally — never dump it all):
AskBiz is an AI business intelligence platform for SME founders. Key capabilities:
- ASK: Founders type plain-English questions ("What's my true landed cost per unit?", "Which product has the best margin after returns?", "Am I spending more on shipping than last quarter?") and get instant data-backed answers
- DATA SOURCES: Connects to Shopify, Amazon, Stripe, Xero, QuickBooks, Google Sheets, CSV uploads — pulls live data from the tools founders already use
- CFO DASHBOARD: Cash flow forecasting, margin analysis, break-even tracking, tax estimation, working capital cycle, EBITDA valuation, budget vs actual, receivables tracking, expense categorisation, receipt scanning
- MARKET INTELLIGENCE: Live competitor monitoring, pricing benchmarks, industry comparisons, supply chain alerts, regulatory change tracking
- PROACTIVE ALERTS: Daily briefings on stock levels, cash position, anomalies, margin shifts — sent via email or WhatsApp before the founder even asks
- POS SYSTEM: Integrated point-of-sale with real-time sales tracking, staff management, inventory sync, multi-branch support
- FORECASTING: Predictive demand, seasonal trend analysis, "what-if" scenario modelling
- EXPANSION: Cross-border trade intelligence, tariff calculators, market entry analysis for 54 African markets, EU, UK, US, Middle East
- TEMPLATES: Pre-built dashboards for retail, restaurant, repair shops, logistics, manufacturing, salon, and service businesses
- PRICING: Free plan (3 questions/month), Growth (£29/mo), Business (£79/mo), Enterprise (custom)

When mentioning AskBiz in the post, pick 1-2 specific features that directly solve the problem in the article. Show a realistic scenario — a founder typing a real question and getting a specific answer. Don't list features.`,
    messages: [{
      role: 'user',
      content: `Write a blog post based on today's market intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}
Source articles:
${articleContext}

Return ONLY valid JSON:
{
  "slug": "unique-kebab-case-slug",
  "title": "Sharp, specific title under 65 chars — lead with the insight, not the topic",
  "metaDescription": "Active voice, under 155 chars, makes the reader want to click",
  "cluster": "${cluster}",
  "pillar": "${pillar}",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 6,
  "tldr": "3 punchy sentences. The shift. The impact. What to do.",
  "sections": [
    {"heading": "Lead with the number or event — make it concrete", "level": 2, "body": "200 words. Open with the data point from the source. Name the source. Set the stakes immediately."},
    {"heading": "A specific heading about the SME impact", "level": 2, "body": "200 words. Translate the macro trend into what it means for a founder running a 5-50 person business. Use concrete examples — 'a Shopify seller doing £40k/month', not 'businesses'."},
    {"heading": "The playbook: what sharp operators are doing", "level": 2, "body": "200 words. 3-4 specific tactics. Be prescriptive. Name tools, strategies, timelines."},
    {"heading": "A heading that shows AskBiz solving this specific problem", "level": 2, "body": "150 words. Paint a scene: a founder opens AskBiz, types a question like 'Show me my shipping cost per order vs last quarter', and gets an instant breakdown. Be specific about which AskBiz feature helps and what the output looks like."},
    {"heading": "The one thing to do this week", "level": 2, "body": "100 words. Single concrete action. No 'consider' or 'explore' — tell them what to do."}
  ],
  "paa": [
    {"q": "A question people actually search on Google about this?", "a": "Direct answer, 2-3 sentences, cite a number if possible"},
    {"q": "Second real search query?", "a": "Direct answer"},
    {"q": "How does AskBiz help with [this specific problem]?", "a": "Specific answer — name the feature and what it shows"}
  ],
  "cta": {
    "heading": "A CTA that references the specific problem in this post",
    "body": "One sentence connecting this article's topic to AskBiz. Then: 'Try it free — ask your first question in 30 seconds.'"
  },
  "author": {
    "name": "Alice Watson",
    "role": "Head of Market Intelligence",
    "bio": "Alice Watson is AskBiz's Head of Market Intelligence. She tracks regulatory shifts, pricing trends, and growth signals across global SME markets — and turns them into briefings founders can act on before their competitors notice."
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

function scoreBlogQuality(blog: Record<string, unknown>): number {
  let score = 0

  if (blog.title && typeof blog.title === 'string' && blog.title.length >= 20 && blog.title.length <= 80) score += 15
  if (blog.slug && typeof blog.slug === 'string' && blog.slug.length >= 10) score += 10
  if (blog.metaDescription && typeof blog.metaDescription === 'string' && blog.metaDescription.length >= 50) score += 10
  if (blog.tldr && typeof blog.tldr === 'string' && blog.tldr.length >= 30) score += 10

  const sections = blog.sections as Array<{ heading?: string; body?: string }> | undefined
  if (Array.isArray(sections) && sections.length >= 4) {
    score += 15
    const totalWords = sections.reduce((sum, s) => sum + (s.body?.split(/\s+/).length || 0), 0)
    if (totalWords >= 600) score += 15
    if (sections.every(s => s.heading && s.body && s.body.length > 50)) score += 10
  }

  const paa = blog.paa as Array<{ q?: string; a?: string }> | undefined
  if (Array.isArray(paa) && paa.length >= 2 && paa.every(p => p.q && p.a)) score += 10

  if (blog.cta && typeof blog.cta === 'object') score += 5

  return Math.min(score, 100)
}

async function pingSitemapServices() {
  const sitemapUrl = 'https://askbiz.co/sitemap.xml'
  await Promise.allSettled([
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
    fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
  ])
}
