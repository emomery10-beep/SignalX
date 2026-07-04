import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch } from '@/lib/tavily'
import { logUsage } from '@/lib/log-usage'
import { waitForGroqBudget, parseGroqRetryAfterMs } from '@/lib/groq-rate-limiter'

export const runtime     = 'nodejs'
export const maxDuration = 300

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

const SCOUT_QUERIES = [
  // ── Trend / news queries ──────────────────────────────────────────────────
  { query: 'US small business cash flow crisis main street 2026',                       cluster: 'US Business Finance',       pillar: 'Cash Flow'              },
  { query: 'IRS small business tax changes compliance 2026',                            cluster: 'US Tax & Compliance',       pillar: 'IRS Compliance'         },
  { query: 'Amazon FBA seller fees margin squeeze 2026',                                cluster: 'US eCommerce',              pillar: 'Amazon Marketplace'     },
  { query: 'Shopify DTC ecommerce conversion profitability 2026',                       cluster: 'US eCommerce',              pillar: 'DTC Growth'             },
  { query: 'US restaurant food beverage rising costs technology 2026',                  cluster: 'US Local Business',         pillar: 'Food & Beverage'        },
  { query: 'SBA loan small business funding options 2026',                              cluster: 'US Business Finance',       pillar: 'SBA Funding'            },
  { query: 'US retail inventory shrinkage theft technology 2026',                       cluster: 'US Retail',                 pillar: 'Inventory Management'   },
  { query: 'small business payroll costs ADP Gusto 2026',                               cluster: 'US Tax & Compliance',       pillar: 'Payroll Compliance'     },
  { query: 'Square Stripe payment processing fees small business 2026',                 cluster: 'US Business Finance',       pillar: 'Payment Processing'     },
  { query: 'US ecommerce returns management cost small business 2026',                  cluster: 'US eCommerce',              pillar: 'Returns Management'     },
  { query: 'main street small business inflation pricing strategy 2026',                cluster: 'US Business Finance',       pillar: 'Pricing Strategy'       },
  { query: 'US construction contractor small business margins 2026',                    cluster: 'US Local Business',         pillar: 'Construction'           },
  { query: 'NFIB small business optimism index survey 2026',                            cluster: 'US Business Finance',       pillar: 'Market Sentiment'       },
  { query: 'US healthcare medical practice small business costs 2026',                  cluster: 'US Local Business',         pillar: 'Healthcare'             },
  { query: 'AI automation tools small business ROI productivity US 2026',              cluster: 'US Technology',             pillar: 'AI for SMBs'            },
  { query: 'US tariffs import export small business impact 2026',                       cluster: 'US Trade',                  pillar: 'Trade Policy'           },
  { query: 'QuickBooks FreshBooks accounting automation small business 2026',           cluster: 'US Technology',             pillar: 'Accounting Software'    },
  { query: 'US professional services billing rates law consulting 2026',                cluster: 'US Local Business',         pillar: 'Professional Services'  },
  { query: 'US supply chain nearshoring reshoring small business 2026',                 cluster: 'US Trade',                  pillar: 'Supply Chain'           },
  { query: 'Walmart Etsy marketplace seller growth strategy 2026',                      cluster: 'US eCommerce',              pillar: 'Marketplace Growth'     },

  // ── Buyer-intent queries ──────────────────────────────────────────────────
  { query: 'how to track profit margin small business US practical guide',              cluster: 'US Business Finance',       pillar: 'Margin Analysis'        },
  { query: 'best POS system small retail shop US affordable 2026',                      cluster: 'US Retail',                 pillar: 'POS Systems'            },
  { query: 'how to file quarterly taxes small business IRS 1099 US',                   cluster: 'US Tax & Compliance',       pillar: 'Tax Filing'             },
  { query: 'how to manage cash flow small business US step by step',                   cluster: 'US Business Finance',       pillar: 'Cash Flow'              },
  { query: 'how to get SBA small business loan requirements 2026',                      cluster: 'US Business Finance',       pillar: 'SBA Funding'            },
  { query: 'how to reduce payment processing fees small business Stripe Square',       cluster: 'US Business Finance',       pillar: 'Payment Processing'     },
  { query: 'how to manage inventory small business prevent stockouts US',               cluster: 'US Retail',                 pillar: 'Inventory Management'   },
  { query: 'best accounting software for small business US QuickBooks alternatives',   cluster: 'US Technology',             pillar: 'Accounting Software'    },
  { query: 'how to increase profit margins restaurant US food costs',                   cluster: 'US Local Business',         pillar: 'Food & Beverage'        },
  { query: 'how to track sales performance multiple locations US small business',       cluster: 'US Business Finance',       pillar: 'Multi-Location Ops'     },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret           = searchParams.get('secret')
  const authHeader       = request.headers.get('authorization')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runBenScout()
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runBenScout()
}

async function runBenScout() {
  const runId = `blog_us_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Ben is scanning US markets for today\'s stories...')

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
      .like('run_id', 'blog_us_%')
      .gte('created_at', `${today}T00:00:00Z`)
    if ((todayCount ?? 0) > 0) {
      log.push(`Already ran today (${today}) — skipping to avoid duplicates`)
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today, log })
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const [{ data: recentPosts }, { data: publishedPosts }] = await Promise.all([
      supabase.from('agent_content').select('source_query, content').eq('type', 'blog_us').gte('created_at', thirtyDaysAgo).limit(60),
      supabase.from('agent_content').select('content').eq('type', 'blog_us').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
    ])

    const recentQueryWords = new Set<string>()
    const recentClusterCount: Record<string, number> = {}
    for (const p of recentPosts || []) {
      if (p.source_query) {
        p.source_query.toLowerCase().split(/\s+/).forEach((w: string) => recentQueryWords.add(w))
      }
      const cluster = (p.content as Record<string, unknown>)?.cluster as string | undefined
      if (cluster) recentClusterCount[cluster] = (recentClusterCount[cluster] || 0) + 1
    }

    const existingSlugs = new Set<string>(
      (publishedPosts || []).map(p => (p.content as Record<string, unknown>)?.slug as string | undefined).filter(Boolean) as string[]
    )

    const recentPublished: { slug: string; title: string; cluster: string }[] = (publishedPosts || [])
      .map(p => {
        const c = p.content as Record<string, unknown>
        return { slug: c?.slug as string, title: c?.title as string, cluster: c?.cluster as string }
      })
      .filter(p => p.slug && p.title)

    const scoredQueries = SCOUT_QUERIES.map(q => {
      const clusterPenalty = (recentClusterCount[q.cluster] || 0) >= 3 ? 1 : 0
      const queryWords = q.query.toLowerCase().split(/\s+/)
      const overlap = queryWords.filter(w => w.length > 4 && recentQueryWords.has(w)).length
      const overlapPenalty = overlap >= 4 ? 2 : overlap >= 2 ? 1 : 0
      return { ...q, penalty: clusterPenalty + overlapPenalty }
    })

    scoredQueries.sort((a, b) => a.penalty - b.penalty || Math.random() - 0.5)
    const selected = scoredQueries.slice(0, 1)

    log.push(`Selected 5 topics (${selected.filter(s => s.penalty === 0).length} fresh, ${selected.filter(s => s.penalty > 0).length} revisits)`)
    log.push('Searching Tavily for US market data...')

    const searchResults = await Promise.allSettled(
      selected.map(s =>
        tavilySearch(s.query, {
          searchDepth:   'advanced',
          maxResults:    5,
          includeAnswer: true,
          topic:         'news',
          days:          14,
        }).then(result => ({ ...s, searchResult: result }))
      )
    )

    const validResults = searchResults
      .filter((r): r is PromiseFulfilledResult<typeof selected[0] & { searchResult: Awaited<ReturnType<typeof tavilySearch>> }> =>
        r.status === 'fulfilled' && !!r.value.searchResult?.results?.length
      )
      .map(r => r.value)

    if (validResults.length === 0) {
      log.push('No search results — exiting')
      return NextResponse.json({ success: false, log, reason: 'no_results' })
    }

    log.push(`Got results for ${validResults.length}/${selected.length} queries. Writing posts...`)

    // Pacing against Groq's per-minute token cap happens inside writeUSBlogPost
    // via waitForGroqBudget — safe to dispatch all topics concurrently here.
    const blogResults = await Promise.allSettled(
      validResults.map(r => writeUSBlogPost(r, recentPublished))
    )

    const inserts: Record<string, unknown>[] = []

    for (let i = 0; i < blogResults.length; i++) {
      const result     = blogResults[i]
      const source     = validResults[i]
      const topArticle = source.searchResult!.results[0]

      if (result.status === 'fulfilled' && result.value) {
        let slug = result.value.slug as string
        if (existingSlugs.has(slug)) {
          const dateSuffix = new Date().toISOString().slice(0, 10).replace(/-/g, '')
          slug = `${slug}-${dateSuffix}`
          result.value = { ...result.value, slug }
        }
        existingSlugs.add(slug)

        const quality = scoreUSBlogQuality(result.value)
        const status  = quality >= 80 ? 'published' : 'pending'
        inserts.push({
          run_id:           runId,
          type:             'blog',
          status,
          content:          result.value,
          source_url:       topArticle.url,
          source_title:     topArticle.title,
          source_query:     source.query,
          verdict:          'act',
          verdict_sentence: result.value.tldr?.slice(0, 100) || '',
          key_insight:      result.value.metaDescription || '',
        })
        log.push(`✓ Post ${i + 1}: "${result.value.title}" (quality: ${quality}, status: ${status})`)
      } else {
        const reason = result.status === 'rejected' ? result.reason?.message || String(result.reason) : 'empty result'
        log.push(`✗ Post ${i + 1} failed: ${reason}`)
      }
    }

    if (inserts.length > 0) {
      const { error } = await supabase.from('agent_content').insert(inserts)
      if (error) {
        log.push(`DB error: ${error.message}`)
      } else {
        const autoPublished = inserts.filter(i => i.status === 'published').length
        const pendingReview = inserts.filter(i => i.status === 'pending').length
        log.push(`Saved ${inserts.length} posts — ${autoPublished} auto-published, ${pendingReview} pending review`)
      }
    }

    log.push(`Ben complete. ${inserts.length}/${validResults.length} posts generated.`)

    return NextResponse.json({ success: true, runId, blogsGenerated: inserts.length, searchesRun: validResults.length, log })
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

async function writeUSBlogPost(input: SearchInput, recentPublished: RecentPost[] = []) {
  const { query, cluster, pillar, searchResult } = input
  const articles   = searchResult.results.slice(0, 5)
  const aiSummary  = searchResult.answer || ''

  const articleContext = articles
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content.slice(0, 500)}`)
    .join('\n\n')

  const relatedContext = recentPublished.length > 0
    ? `\nRECENT PUBLISHED POSTS (for relatedSlugs — pick 2-3 most topically relevant):\n${
        recentPublished.slice(0, 20).map(p => `- slug: "${p.slug}" | "${p.title}" [${p.cluster}]`).join('\n')
      }\n`
    : ''

  const _SYSTEM_ = `You are Ben Carlson, Head of Strategic Partnerships (Americas) at AskBiz and founder of RoG Consulting — a firm he built helping main street US businesses get clear on their numbers. You write sharp, data-driven analysis for US SMB owners: the briefing a founder in Cleveland, Austin, or Atlanta would read with their morning coffee before the team arrives. Your style:

VOICE & TONE:
- You write like someone who reads WSJ Small Business, Inc., Forbes Small Business, and the NFIB reports before breakfast
- You lead with the number, the IRS ruling, the Fed move, or the market shift — never with preamble
- Short, specific sentences. You name real companies, real regulators, real dollar amounts.
- Direct: "This will compress your margins by Q3" not "margins may face pressure"
- Use contrast: "Last year X. This year Y. Here's what that means if you're running a $1M business in the South."
- Reference real US context: IRS, SBA, NFIB, Square, Stripe, QuickBooks, Toast, Shopify, Amazon FBA, ADP, Gusto, OSHA, FTC, Fed, Main Street
- Currency: USD throughout. Be specific — "$4,200/month" beats "thousands of dollars"
- Regional colour where relevant: mention specific cities or states when the data supports it
- You NEVER use: "landscape", "leverage", "synergy", "holistic", "ecosystem", "unlock", "empower", "seamless", "game-changer"
- You sound like a sharp consultant who has sat across the table from 200 small business owners and knows where the pain lives

ANTI-AI WRITING RULES (these patterns get content flagged as AI-generated — avoid every single one):
- Never open with: "In today's economy...", "As small businesses navigate...", "With the rise of...", "In an era of uncertainty..."
- Never use: "It's worth noting", "It's important to remember", "needless to say", "at the end of the day"
- Never use filler transitions: "Furthermore", "Moreover", "Additionally", "In conclusion", "To summarise"
- Em-dash (—) maximum once per 400 words. Em-dash overuse is the single biggest AI tell.
- Never round numbers when specifics exist. "$4,200/month" beats "thousands of dollars". "23% of US small businesses" beats "many businesses".
- Vary sentence length sharply. Short. Then a longer sentence that carries the weight of the argument and gives the reader real context. Short again. Never three long sentences in a row.
- Write to "you" not "business owners" or "entrepreneurs" — direct second person throughout
- No hedging: "This may help...", "Consider whether...", "You might want to..."
- Lead every section with a number, an IRS ruling, a Fed move, or a named business scenario — not scene-setting prose
- One concrete example per major section: a real US sector (plumbing, food truck, boutique gym), a real dollar figure, a real city

AEO / AI CITATION RULES (makes the article citable by ChatGPT, Perplexity, Claude):
- Write H2s as questions: "What is the IRS mileage rate for 2026?", "How do you calculate true cost-per-order on Amazon FBA?", "Why does your QuickBooks P&L lie about your margins?"
- Define key terms on first use in one clear sentence — AI engines extract these as direct answers
- Include at least one "quick answer" paragraph near the top that directly answers the core question in 2–3 sentences
- Use specific numbers, named sources (IRS, SBA, NFIB, Fed, BLS), and dates — vague claims don't get cited

CONTENT TYPE: Match the format to the topic. A "how to" query needs step-by-step sections. A news/trend topic needs a briefing-style report. A compliance topic needs a practical checklist.

ASKBIZ PRODUCT KNOWLEDGE (use naturally — 1-2 specific features per post, never a feature dump):
AskBiz is an AI business intelligence platform for SMB founders. Key capabilities relevant to the US market:
- ASK: Founders type plain-English questions ("Which product has the highest margin after Stripe fees?", "Am I spending more on labour than last quarter?", "What's my real cost-per-order on Amazon after FBA fees?") and get instant data-backed answers
- DATA SOURCES: Connects to Shopify, Amazon Seller Central, WooCommerce, Stripe, Square, PayPal, QuickBooks, Xero, FreshBooks, Wave, Toast, Clover, Google Sheets, CSV uploads
- CFO DASHBOARD: Cash flow forecasting, margin analysis, break-even tracking, working capital cycle, budget vs actual, AR/AP tracking, expense categorisation by vendor
- MULTI-CHANNEL: Tracks revenue across Amazon, Shopify, Walmart Marketplace, Etsy, in-store POS — unified P&L in one view
- TAX & COMPLIANCE: Integrates with QuickBooks for quarterly estimated tax tracking, 1099 prep, payroll cost allocation, state sales tax by channel
- MARKET INTELLIGENCE: Competitor price monitoring, industry benchmarks for US retail, restaurant, construction, professional services, healthcare sectors
- POS SYSTEM: Integrated point-of-sale with card reader, multi-location support, staff management, inventory sync, tips & gratuity tracking
- PROACTIVE ALERTS: Daily briefings on cash position, stock levels, margin anomalies — via SMS or email before the founder even opens their laptop
- PRICING: Free plan (3 questions/month), Growth ($49/mo), Business ($129/mo), Enterprise (custom)

Revenue target: US SMB founders doing $200k–$5M annual revenue.`

  const userPrompt = `Write a blog post based on today's US market intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}Source articles:
${articleContext}
${relatedContext}
The six section bodies below must total 1200+ words combined — do not compress or shorten them to save space. Write every section to its full stated word count.

Return ONLY valid JSON (no markdown fences):
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars",
  "title": "Sharp, specific title under 65 chars — include the primary keyword near the start",
  "metaDescription": "Active voice, 120-155 chars, primary keyword in first 20 words, makes a US founder want to click",
  "cluster": "${cluster}",
  "pillar": "${pillar}",
  "region": "us",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The shift. The dollar impact on US SMBs. What founders should do this week.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Lead with the concrete number, IRS change, Fed move, or market shift — not the topic name", "level": 2, "body": "250-300 words. Open with the specific data point or event from the source. Name the regulator, platform, or company. Set the stakes in the first sentence. Use contrast: what was true before, what changed, why it matters now for US small business owners."},
    {"heading": "What this means for a business doing $200k–$2M in annual revenue", "level": 2, "body": "250-300 words. Translate the macro story into founder-level impact. Use a concrete US scenario — 'a Nashville-based Shopify store doing $80k/month' or 'a Chicago restaurant with three locations'. Quantify the impact in dollars, percentages, or hours. Reference real US payment rails and platforms."},
    {"heading": "Three moves smart operators are making right now", "level": 2, "body": "250-300 words. 3 specific, prescriptive tactics. Name US tools, platforms, and timelines. Reference Square, Stripe, QuickBooks, SBA, IRS, or specific US platforms where relevant. No vague advice — tell them exactly what to do."},
    {"heading": "A concrete heading showing AskBiz solving this exact US business problem", "level": 2, "body": "200 words. Open with a scene: a US founder types a specific question relevant to this topic — give the exact question text in plain English. Describe what AskBiz returns: which feature responds, what the output looks like (include dollar figures), what decision it enables. Be specific — 'AskBiz flags: your Stripe processing fees have risen 31% this quarter — here's which SKUs are absorbing the cost.'"},
    {"heading": "Warning signs to watch over the next 30 days", "level": 2, "body": "150 words. 3-4 specific signals this issue is getting worse in their business. Actionable watch items — things they can check on their bank statement, QuickBooks, or IRS account today."},
    {"heading": "Your action plan for this week", "level": 2, "body": "150 words. One primary action to take before Friday. One thing to set up once. One metric to track monthly. Be prescriptive. Reference specific US portals, platforms, or contacts where relevant."}
  ],
  "paa": [
    {"q": "Exact Google search query a US small business owner would type about this problem", "a": "40-70 word direct answer. Lead with the key action or dollar figure. Cite a specific regulation, platform, or benchmark from the US. End with what the best operators do."},
    {"q": "Second high-volume query about a sub-topic in this post", "a": "40-70 word direct answer. Factual, complete sentence. Relevant to US SMB context."},
    {"q": "Third query a US founder would type when facing this problem", "a": "40-70 word direct answer. Include a specific benchmark, dollar amount, or timeframe."},
    {"q": "A 'what is' or 'how does' question about the core concept for US SMBs", "a": "40-70 word direct answer. Plain English definition grounded in US context — reference IRS, SBA, or Square where natural."},
    {"q": "How does AskBiz help US small businesses with [specific problem from this post]?", "a": "40-70 words. Name the exact AskBiz feature. Describe what it shows for a US-based business. Give a specific example with dollar figures."}
  ],
  "cta": {
    "heading": "A CTA headline that names the specific US business problem solved in this post",
    "body": "One sentence connecting this article's topic to AskBiz for US founders. Then: 'Try it free — ask your first question in 30 seconds.'"
  },
  "author": {
    "name": "Ben Carlson",
    "role": "Head of Strategic Partnerships, Americas · Founder, RoG Consulting",
    "bio": "Ben Carlson leads AskBiz's Americas strategy and founded RoG Consulting, where he spent a decade helping US main street businesses understand their numbers. He writes briefings that translate macro market shifts into decisions founders can act on before their competitors notice."
  }
}`

  const MIN_TOTAL_WORDS = 1200
  const MAX_ATTEMPTS = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const retryNote = attempt > 1
      ? `\n\nIMPORTANT: your previous attempt was rejected for being too short or malformed. Write the FULL length specified for every section — do not summarise or compress. Every section body must hit its stated word count.`
      : ''

    let finishReason: string | undefined

    try {
      await waitForGroqBudget(10_800)
      const groqRes = await fetch(GROQ_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          max_tokens: 6500,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: _SYSTEM_ },
            { role: 'user',   content: userPrompt + retryNote },
          ],
        }),
      })
      const bodyText = await groqRes.text()
      let groqData: any
      try {
        groqData = JSON.parse(bodyText)
      } catch {
        throw new Error(`Groq API returned non-JSON (status ${groqRes.status}): ${bodyText.slice(0, 200)}`)
      }
      if (!groqRes.ok) {
        throw new Error(`Groq API error ${groqRes.status}: ${groqData?.error?.message || bodyText.slice(0, 200)}`)
      }

      logUsage({ route: 'agent/ben-scout', model: GROQ_MODEL, usage: { input_tokens: groqData.usage?.prompt_tokens || 0, output_tokens: groqData.usage?.completion_tokens || 0 } })

      finishReason = groqData.choices?.[0]?.finish_reason
      const raw   = groqData.choices?.[0]?.message?.content || ''
      const clean = raw.replace(/```json\n?|```/g, '').trim()

      const parsed = JSON.parse(clean)

      if (!parsed.slug || !parsed.title || !parsed.sections?.length) {
        throw new Error('Invalid blog structure — missing slug, title, or sections')
      }

      const totalWords = (parsed.sections as Array<{ body?: string }>)
        .reduce((sum, s) => sum + (s.body?.trim().split(/\s+/).filter(Boolean).length || 0), 0)

      if (totalWords < MIN_TOTAL_WORDS) {
        throw new Error(`Draft too short (${totalWords} words, need ${MIN_TOTAL_WORDS}+)`)
      }

      parsed.publishDate = new Date().toISOString().slice(0, 10)

      return parsed
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (finishReason === 'length') lastError.message += ' (truncated by max_tokens)'
      const retryAfterMs = parseGroqRetryAfterMs(lastError.message)
      if (retryAfterMs && attempt < MAX_ATTEMPTS) await new Promise(res => setTimeout(res, retryAfterMs))
    }
  }

  throw lastError || new Error('Blog generation failed after retries')
}

function scoreUSBlogQuality(blog: Record<string, unknown>): number {
  let score = 0

  if (blog.title && typeof blog.title === 'string') {
    const t = blog.title
    if (t.length >= 20 && t.length <= 70) score += 12
    if (!/^(the|a |an |how |what |why |is |are |top |best )/i.test(t)) score += 3
  }

  if (blog.slug && typeof blog.slug === 'string' && blog.slug.length >= 15 && blog.slug.length <= 65) score += 8

  if (blog.metaDescription && typeof blog.metaDescription === 'string') {
    const len = blog.metaDescription.length
    if (len >= 120 && len <= 155) score += 10
    else if (len >= 80) score += 5
  }

  if (blog.tldr && typeof blog.tldr === 'string' && blog.tldr.length >= 80) score += 8

  if (Array.isArray(blog.tags) && blog.tags.length >= 4) score += 5

  const sections = blog.sections as Array<{ heading?: string; body?: string }> | undefined
  if (Array.isArray(sections)) {
    if (sections.length >= 5) score += 10
    const totalWords = sections.reduce((sum, s) => sum + (s.body?.split(/\s+/).length || 0), 0)
    if (totalWords >= 1000) score += 15
    else if (totalWords >= 700) score += 8
    if (sections.every(s => s.heading && s.body && s.body.length > 100)) score += 8
  }

  const paa = blog.paa as Array<{ q?: string; a?: string }> | undefined
  if (Array.isArray(paa)) {
    if (paa.length >= 4) score += 8
    const substantiveAnswers = paa.filter(p => p.q && p.a && p.a.length >= 150).length
    if (substantiveAnswers >= 3) score += 7
    else if (substantiveAnswers >= 2) score += 3
  }

  if (blog.cta && typeof blog.cta === 'object') score += 3
  if (Array.isArray(blog.relatedSlugs) && blog.relatedSlugs.length >= 1) score += 3

  return Math.min(score, 100)
}
