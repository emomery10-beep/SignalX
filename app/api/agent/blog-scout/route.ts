import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch, type TavilySearchResponse } from '@/lib/tavily'
import { serperSearch } from '@/lib/serper'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const maxDuration = 300

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const SCOUT_QUERIES = [
  // ── Trend / news queries ──────────────────────────────────────────────────
  { query: 'small business cash flow crisis warning signs 2026', cluster: 'Financial Intelligence', pillar: 'Cash Flow' },
  { query: 'SME pricing strategy inflation margin squeeze 2026', cluster: 'Business Strategy', pillar: 'Pricing Strategy' },
  { query: 'ecommerce inventory management stockout cost 2026', cluster: 'Inventory & Supply Chain', pillar: 'Inventory Management' },
  { query: 'AI tools small business automation ROI results 2026', cluster: 'AI Chief of Staff', pillar: 'AI Automation' },
  { query: 'UK small business tax changes HMRC compliance 2026', cluster: 'UK Business & Tax', pillar: 'Tax Compliance' },
  { query: 'retail POS system omnichannel ecommerce trends 2026', cluster: 'eCommerce Intelligence', pillar: 'Retail Technology' },
  { query: 'SME supplier negotiation procurement cost reduction 2026', cluster: 'Inventory & Supply Chain', pillar: 'Supplier Management' },
  { query: 'small business data analytics decision making 2026', cluster: 'Data-Driven Decisions', pillar: 'Analytics' },
  { query: 'startup growth metrics funding challenges 2026', cluster: 'Startup Growth', pillar: 'Growth Strategy' },
  { query: 'cross border ecommerce trade tariff regulations SME 2026', cluster: 'Global Trade Intelligence', pillar: 'Cross-Border Commerce' },
  { query: 'small business customer churn retention cost 2026', cluster: 'Marketing Intelligence', pillar: 'Customer Retention' },
  { query: 'SME cybersecurity data breach cost small business 2026', cluster: 'Efficiency & Tools', pillar: 'Security' },
  { query: 'Africa ecommerce market growth mobile payments 2026', cluster: 'Africa eCommerce', pillar: 'Market Opportunities' },
  { query: 'restaurant food business rising costs technology 2026', cluster: 'Local & Vertical Growth', pillar: 'Food & Beverage' },
  { query: 'small business hiring staff cost management 2026', cluster: 'Business Strategy', pillar: 'People Management' },
  { query: 'ecommerce returns cost management policy 2026', cluster: 'eCommerce Intelligence', pillar: 'Returns Management' },
  { query: 'SME working capital loan funding options UK 2026', cluster: 'Financial Intelligence', pillar: 'Working Capital' },
  { query: 'supply chain disruption small business contingency 2026', cluster: 'Inventory & Supply Chain', pillar: 'Supply Chain Risk' },
  { query: 'small business VAT Making Tax Digital MTD 2026', cluster: 'UK Business & Tax', pillar: 'VAT Compliance' },
  { query: 'ecommerce marketplace fees Amazon Shopify comparison 2026', cluster: 'eCommerce Intelligence', pillar: 'Marketplace Strategy' },

  // ── Buyer-intent queries ──────────────────────────────────────────────────
  { query: 'how to track profit margin small business step by step', cluster: 'Financial Intelligence', pillar: 'Margin Analysis' },
  { query: 'best cash flow forecasting tools for small business UK', cluster: 'Financial Intelligence', pillar: 'Cash Flow' },
  { query: 'how to reduce shipping costs ecommerce small business', cluster: 'Inventory & Supply Chain', pillar: 'Shipping Costs' },
  { query: 'how to improve gross margin retail business practical guide', cluster: 'Business Strategy', pillar: 'Margin Improvement' },
  { query: 'best inventory management software small business comparison', cluster: 'Inventory & Supply Chain', pillar: 'Inventory Management' },
  { query: 'how to forecast sales small business without spreadsheets', cluster: 'Data-Driven Decisions', pillar: 'Sales Forecasting' },
  { query: 'best POS system for retail shop UK independent', cluster: 'eCommerce Intelligence', pillar: 'POS Systems' },
  { query: 'how to manage cash flow seasonal business practical', cluster: 'Financial Intelligence', pillar: 'Seasonal Cash Flow' },
  { query: 'ecommerce analytics which products make money Shopify', cluster: 'Data-Driven Decisions', pillar: 'eCommerce Analytics' },
  { query: 'how to negotiate better payment terms suppliers SME', cluster: 'Inventory & Supply Chain', pillar: 'Supplier Negotiation' },
  { query: 'how to reduce overheads small business without cutting quality', cluster: 'Business Strategy', pillar: 'Cost Reduction' },
  { query: 'best accounting software for small business UK Xero QuickBooks', cluster: 'Efficiency & Tools', pillar: 'Accounting Tools' },
  { query: 'how to calculate break even point small business', cluster: 'Financial Intelligence', pillar: 'Break-Even Analysis' },
  { query: 'what business metrics should founders track monthly', cluster: 'Data-Driven Decisions', pillar: 'KPI Tracking' },
  { query: 'how AI can replace CFO function small business', cluster: 'AI Chief of Staff', pillar: 'AI Finance' },
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
    log.push('Blog scout starting — checking recent topics to avoid repeats...')

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Skip if already ran today — prevents double-posting when the orchestrator
    // cron and a manual "Run Now" both fire on the same day.
    const today = new Date().toISOString().slice(0, 10)
    const { count: todayCount } = await supabase
      .from('agent_content')
      .select('id', { count: 'exact', head: true })
      .like('run_id', 'blog_%')
      .not('run_id', 'like', 'blog_%_%') // excludes blog_mktg_*, blog_ea_*, blog_us_*
      .gte('created_at', `${today}T00:00:00Z`)
    if ((todayCount ?? 0) > 0) {
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today })
    }

    // Fetch recent coverage for topic dedup and relatedSlugs context
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const [{ data: recentPosts }, { data: publishedPosts }] = await Promise.all([
      supabase.from('agent_content').select('source_query, content').eq('type', 'blog').gte('created_at', thirtyDaysAgo).limit(60),
      supabase.from('agent_content').select('content').eq('type', 'blog').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
    ])

    // Build dedup sets
    const recentQueryWords = new Set<string>()
    const recentClusterCount: Record<string, number> = {}
    for (const p of recentPosts || []) {
      if (p.source_query) {
        p.source_query.toLowerCase().split(/\s+/).forEach((w: string) => recentQueryWords.add(w))
      }
      const cluster = (p.content as Record<string, unknown>)?.cluster as string | undefined
      if (cluster) recentClusterCount[cluster] = (recentClusterCount[cluster] || 0) + 1
    }

    // Existing slugs for dedup
    const existingSlugs = new Set<string>(
      (publishedPosts || []).map(p => (p.content as Record<string, unknown>)?.slug as string | undefined).filter(Boolean) as string[]
    )

    // Recent published posts for relatedSlugs context (title + slug)
    const recentPublished: { slug: string; title: string; cluster: string }[] = (publishedPosts || [])
      .map(p => {
        const c = p.content as Record<string, unknown>
        return { slug: c?.slug as string, title: c?.title as string, cluster: c?.cluster as string }
      })
      .filter(p => p.slug && p.title)

    // Score topic freshness: deprioritise clusters covered 3+ times in last 30 days
    const scoredQueries = SCOUT_QUERIES.map(q => {
      const clusterPenalty = (recentClusterCount[q.cluster] || 0) >= 3 ? 1 : 0
      // Count shared words with recent queries (rough similarity signal)
      const queryWords = q.query.toLowerCase().split(/\s+/)
      const overlap = queryWords.filter(w => w.length > 4 && recentQueryWords.has(w)).length
      const overlapPenalty = overlap >= 4 ? 2 : overlap >= 2 ? 1 : 0
      return { ...q, penalty: clusterPenalty + overlapPenalty }
    })

    // Sort by penalty ascending (freshest topics first), then shuffle within same penalty tier
    scoredQueries.sort((a, b) => a.penalty - b.penalty || Math.random() - 0.5)
    const selected = scoredQueries.slice(0, 5)

    log.push(`Selected ${selected.length} topics (${selected.filter(s => s.penalty === 0).length} fresh, ${selected.filter(s => s.penalty > 0).length} revisits)`)
    const hasTavily = !!process.env.TAVILY_API_KEY
    const hasSerper = !!process.env.SERPER_API_KEY
    if (!hasTavily && !hasSerper) {
      log.push('ERROR: No search keys set — add TAVILY_API_KEY or SERPER_API_KEY to Vercel env vars')
      return NextResponse.json({ success: false, log }, { status: 200 })
    }
    log.push(`Searching ${hasTavily ? 'Tavily' : ''}${hasTavily && hasSerper ? ' + ' : ''}${hasSerper ? 'Serper' : ''} for live data...`)

    const searchResults = await Promise.allSettled(
      selected.map(async s => {
        // Try Tavily first
        let searchResult = await tavilySearch(s.query, {
          searchDepth: 'advanced',
          maxResults: 5,
          includeAnswer: true,
          topic: 'news',
          days: 14,
        })

        // Fall back to Serper if Tavily returns nothing
        if (!searchResult?.results?.length) {
          const serperRes = await serperSearch(s.query, { type: 'news', num: 5 })
          if (serperRes?.organic?.length) {
            searchResult = {
              query: s.query,
              results: serperRes.organic.map(r => ({
                title: r.title,
                url: r.link,
                content: r.snippet,
                score: 1,
                published_date: r.date,
              })),
              answer: serperRes.answerBox?.snippet || serperRes.answerBox?.answer || '',
              response_time: 0,
            } satisfies TavilySearchResponse
            log.push(`Serper fallback used for: "${s.query}"`)
          }
        }

        return { ...s, searchResult }
      })
    )

    const validResults = searchResults
      .filter((r): r is PromiseFulfilledResult<typeof selected[0] & { searchResult: TavilySearchResponse }> =>
        r.status === 'fulfilled' && !!r.value.searchResult?.results?.length
      )
      .map(r => r.value)

    const rejectedCount = searchResults.filter(r => r.status === 'rejected').length
    const nullCount = searchResults.filter(r => r.status === 'fulfilled' && !r.value.searchResult?.results?.length).length
    if (rejectedCount > 0) log.push(`${rejectedCount} requests threw errors`)
    if (nullCount > 0) log.push(`${nullCount} queries returned no results from Tavily or Serper`)

    if (validResults.length === 0) {
      log.push('No search results from any query — exiting')
      return NextResponse.json({ success: false, log, reason: 'no_results' })
    }

    log.push(`Got results for ${validResults.length}/${selected.length} queries. Writing blogs...`)

    const blogResults = await Promise.allSettled(
      validResults.map(r => writeBlogPost(r, recentPublished))
    )

    const inserts: Record<string, unknown>[] = []

    for (let i = 0; i < blogResults.length; i++) {
      const result = blogResults[i]
      const source = validResults[i]
      const topArticle = source.searchResult!.results[0]

      if (result.status === 'fulfilled' && result.value) {
        // Deduplicate slug against existing published posts + this run's inserts
        let slug = result.value.slug as string
        if (existingSlugs.has(slug)) {
          const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, '')
          slug = `${slug}-${dateSuffix}`
          result.value = { ...result.value, slug }
        }
        existingSlugs.add(slug)

        const quality = scoreBlogQuality(result.value)
        // Auto-publish if quality ≥ 80, otherwise hold for review
        const status = quality >= 80 ? 'published' : 'pending'
        inserts.push({
          run_id: runId,
          type: 'blog',
          status,
          content: result.value,
          source_url: topArticle.url,
          source_title: topArticle.title,
          source_query: source.query,
          verdict: 'act',
          verdict_sentence: result.value.tldr?.slice(0, 100) || '',
          key_insight: result.value.metaDescription || '',
        })
        log.push(`✓ Blog ${i + 1}: "${result.value.title}" (quality: ${quality}, status: ${status})`)
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
        const autoPublished = inserts.filter(i => i.status === 'published').length
        const pendingReview = inserts.filter(i => i.status === 'pending').length
        log.push(`Saved ${inserts.length} blogs — ${autoPublished} auto-published, ${pendingReview} pending review`)
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
  penalty?: number
  searchResult: NonNullable<Awaited<ReturnType<typeof tavilySearch>>>
}

type RecentPost = { slug: string; title: string; cluster: string }

async function writeBlogPost(input: SearchInput, recentPublished: RecentPost[] = []) {
  const { query, cluster, pillar, searchResult } = input
  const articles = searchResult.results.slice(0, 5)
  const aiSummary = searchResult.answer || ''

  const articleContext = articles
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content.slice(0, 500)}`)
    .join('\n\n')

  // Provide Alice with recent published posts for relatedSlugs selection
  const relatedContext = recentPublished.length > 0
    ? `\nRECENT PUBLISHED POSTS (for relatedSlugs — pick 2-3 most topically relevant):\n${
        recentPublished.slice(0, 20).map(p => `- slug: "${p.slug}" | "${p.title}" [${p.cluster}]`).join('\n')
      }\n`
    : ''

  const _SYSTEM_ = `You are Alice Watson, Head of Market Intelligence at AskBiz. You write like a sharp, opinionated market analyst — not a content marketer. Your style:

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

ANTI-AI WRITING RULES (these patterns get content flagged as AI-generated — avoid every single one):
- Never open a post or section with: "In today's...", "In an era of...", "As businesses navigate...", "With the rise of..."
- Never use: "It's worth noting", "It's important to remember", "It's no secret", "needless to say", "at the end of the day"
- Never use filler transitions: "Furthermore", "Moreover", "Additionally", "In conclusion", "To summarise", "In summary"
- Em-dash (—) maximum once per 400 words. Em-dash overuse is the single biggest AI tell.
- Never round numbers when specifics exist. "63% of SMEs" beats "most businesses". "£4,200/month" beats "thousands of pounds".
- Vary sentence length sharply. Short. Then a longer sentence that carries the weight of the explanation and gives the reader real context. Short again. Never three long sentences in a row.
- Write to "you" not "businesses" or "founders" — direct second person throughout
- Never start two consecutive paragraphs with the same word
- No hedging constructions: "This may help...", "Consider whether...", "You might want to..."
- Lead every section with a fact, a number, or a tension — not scene-setting prose
- One concrete example per major section: a real business type, a real number, a real outcome — not "a typical founder"

AEO / AI CITATION RULES (makes the article citable by ChatGPT, Perplexity, Claude):
- Write H2s as questions where the article answers them: "What does X mean for your margins?", "How do you calculate Y without an accountant?", "Why is Z the wrong benchmark for UK founders?"
- Define key terms on first use in one clear sentence — AI engines extract these as direct answers
- Include at least one "quick answer" paragraph (2–3 sentences) near the top that directly answers the core question
- Use specific numbers, dates, and named sources — vague claims don't get cited

CONTENT TYPE: Match the format to the topic. Use one of: Guide, How-To, Comparison, Explainer, Report. A "how to" query needs step-by-step sections. A news/trend topic needs a briefing-style report. Reflect this in the title and section structure.

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
- PRICING: Free plan (10 questions/month, no card), Growth (£19/mo — 3 months free trial), Business (£39/mo — 3 months free trial), Enterprise (custom)
- COMPETITORS: Unlike Looker or Tableau (built for data teams), AskBiz needs no setup or SQL. Unlike asking ChatGPT directly, answers are grounded in your actual connected data — no hallucination risk.

When mentioning AskBiz in the post, pick 1-2 specific features that directly solve the problem in the article. Show a realistic scenario — a founder typing a real question and getting a specific answer. Don't list features.`
  const groqRes = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 3000,
      messages: [
        { role: 'system', content: _SYSTEM_ },
        {
      role: 'user',
      content: `Write a blog post based on today's market intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}
Source articles:
${articleContext}
${relatedContext}
Return ONLY valid JSON (no markdown fences):
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars",
  "title": "Sharp, specific title under 65 chars — include the primary keyword near the start",
  "metaDescription": "Active voice, 120-155 chars, primary keyword in first 20 words, makes the reader want to click",
  "cluster": "${cluster}",
  "pillar": "${pillar}",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The shift. The impact. What founders should do.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Lead with the concrete number, policy change, or market shift — not the topic name", "level": 2, "body": "250-300 words. Open with the specific data point or event from the source. Name the publication, regulator, or company. Set the stakes in the first sentence. Use a contrast structure: what was true before, what changed, why it matters now."},
    {"heading": "What this means for a business doing £200k-£2m revenue", "level": 2, "body": "250-300 words. Translate the macro story into founder-level impact. Use a concrete business scenario — 'a Leicester-based Shopify seller doing £40k/month', not 'businesses'. Quantify the impact in pounds, percentages, or hours."},
    {"heading": "The three moves smart operators are making right now", "level": 2, "body": "250-300 words. 3 specific, prescriptive tactics. Name tools, platforms, and timelines. No vague advice — tell them exactly what to do and when. Each tactic should be a standalone sentence that could be extracted as a bullet."},
    {"heading": "A concrete heading showing AskBiz solving this exact problem", "level": 2, "body": "200 words. Open AskBiz scene: a founder types a specific question relevant to this topic — give the exact question text. Describe what AskBiz returns: which feature responds, what the output looks like, what decision it enables. Be specific — 'AskBiz surfaces a cash flow warning: 11 days of runway left based on your Xero data.'"},
    {"heading": "The warning signs to watch for in the next 30 days", "level": 2, "body": "150 words. 3-4 specific signals this issue is getting worse in their business. Actionable watch items — things they can check today."},
    {"heading": "Your action plan for this week", "level": 2, "body": "150 words. One primary action to take before Friday. One thing to set up once. One metric to track monthly. Be prescriptive — no 'consider' or 'think about'."}
  ],
  "paa": [
    {"q": "Exact Google search query about the primary problem in this post (e.g. 'how to improve cash flow small business')", "a": "40-70 word direct answer. Lead with the key action or fact. Cite a specific number if available from the sources. End with what the best operators do."},
    {"q": "Second high-volume search query about a sub-topic in this post", "a": "40-70 word direct answer. Factual, complete sentence. No cliffhangers."},
    {"q": "Third search query a founder would type when facing this problem", "a": "40-70 word direct answer. Include a specific benchmark or timeframe if relevant."},
    {"q": "A 'what is' or 'how does' question about the core concept in this post", "a": "40-70 word direct answer. Plain English definition or explanation, grounded in practical SME context."},
    {"q": "How does AskBiz help with [specific problem from this post]?", "a": "40-70 words. Name the exact AskBiz feature. Describe what it shows or does. Give a specific example of the output."}
  ],
  "cta": {
    "heading": "A CTA headline that names the specific problem solved in this post",
    "body": "One sentence connecting this article's topic to AskBiz. Then: 'Try it free — ask your first question in 30 seconds.'"
  },
  "author": {
    "name": "Alice Watson",
    "role": "Head of Market Intelligence",
    "bio": "Alice Watson is AskBiz's Head of Market Intelligence. She tracks regulatory shifts, pricing trends, and growth signals across global SME markets — and turns them into briefings founders can act on before their competitors notice."
  }
}`
      }],
    }),
  })
  const groqData = await groqRes.json()

  logUsage({ route: 'agent/blog-scout', model: GROQ_MODEL, usage: { input_tokens: groqData.usage?.prompt_tokens || 0, output_tokens: groqData.usage?.completion_tokens || 0 } })
  const raw = groqData.choices?.[0]?.message?.content || ''
  const clean = raw.replace(/```json\n?|```/g, '').trim()
  const parsed = JSON.parse(clean)

  if (!parsed.slug || !parsed.title || !parsed.sections?.length) {
    throw new Error('Invalid blog structure — missing slug, title, or sections')
  }

  // Always use today's date — model may pick the date of a news event instead
  parsed.publishDate = new Date().toISOString().slice(0, 10)

  return parsed
}

function scoreBlogQuality(blog: Record<string, unknown>): number {
  let score = 0

  // Title: 20-70 chars, doesn't start with a generic word
  if (blog.title && typeof blog.title === 'string') {
    const t = blog.title
    if (t.length >= 20 && t.length <= 70) score += 12
    // Penalise generic openers
    if (!/^(the|a |an |how |what |why |is |are |top |best )/i.test(t)) score += 3
  }

  // Slug: keyword-rich, reasonable length
  if (blog.slug && typeof blog.slug === 'string' && blog.slug.length >= 15 && blog.slug.length <= 65) score += 8

  // Meta description: 120-155 chars
  if (blog.metaDescription && typeof blog.metaDescription === 'string') {
    const len = blog.metaDescription.length
    if (len >= 120 && len <= 155) score += 10
    else if (len >= 80) score += 5
  }

  // TLDR: at least 80 chars
  if (blog.tldr && typeof blog.tldr === 'string' && blog.tldr.length >= 80) score += 8

  // Tags: 4+ tags
  if (Array.isArray(blog.tags) && blog.tags.length >= 4) score += 5

  // Sections: at least 5 sections with substantial bodies
  const sections = blog.sections as Array<{ heading?: string; body?: string }> | undefined
  if (Array.isArray(sections)) {
    if (sections.length >= 5) score += 10
    const totalWords = sections.reduce((sum, s) => sum + (s.body?.split(/\s+/).length || 0), 0)
    if (totalWords >= 1000) score += 15
    else if (totalWords >= 700) score += 8
    // All sections have heading + substantial body
    if (sections.every(s => s.heading && s.body && s.body.length > 100)) score += 8
  }

  // PAA: 4+ questions with substantive answers (>150 chars each)
  const paa = blog.paa as Array<{ q?: string; a?: string }> | undefined
  if (Array.isArray(paa)) {
    if (paa.length >= 4) score += 8
    const substantiveAnswers = paa.filter(p => p.q && p.a && p.a.length >= 150).length
    if (substantiveAnswers >= 3) score += 7
    else if (substantiveAnswers >= 2) score += 3
  }

  // CTA present
  if (blog.cta && typeof blog.cta === 'object') score += 3

  // relatedSlugs present (boosts internal linking)
  if (Array.isArray(blog.relatedSlugs) && blog.relatedSlugs.length >= 1) score += 3

  return Math.min(score, 100)
}

async function pingSitemapServices() {
  const sitemapUrl = 'https://askbiz.co/sitemap.xml'
  await Promise.allSettled([
    fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
    fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`),
  ])
}
