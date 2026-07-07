import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch } from '@/lib/tavily'
import { logUsage } from '@/lib/log-usage'
import { buildCitableSources, buildArticleContext, citationRulePrompt, findFabricatedCitations, countSectionWords, MIN_WORD_COUNT, generateWithLengthRetry } from '@/lib/scout-citation-guard'

export const runtime     = 'nodejs'
export const maxDuration = 800

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

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

    log.push(`Selected ${selected.length} topics (${selected.filter(s => s.penalty === 0).length} fresh, ${selected.filter(s => s.penalty > 0).length} revisits)`)
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

        const citableSources = (result.value as Record<string, unknown>)._citableSources as string[] | undefined
        delete (result.value as Record<string, unknown>)._citableSources

        const fabricated = findFabricatedCitations(result.value.sections, citableSources || [], { allowedNames: ['AskBiz'] })
        const wordCount = countSectionWords(result.value.sections)
        const isThin = wordCount < MIN_WORD_COUNT
        const quality = scoreUSBlogQuality(result.value)
        // A fabricated "According to Reuters..." always forces human review,
        // regardless of how well the article otherwise scores.
        const status  = quality >= 80 && fabricated.length === 0 && !isThin ? 'published' : 'pending'
        if (fabricated.length > 0) {
          log.push(`  ⚠ "${result.value.title}" cites unverified source(s): ${fabricated.join('; ')} — held for review`)
        }
        if (isThin) {
          log.push(`  ⚠ "${result.value.title}" is thin (${wordCount} words, needs ${MIN_WORD_COUNT}) — held for review`)
        }
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
  // 3 articles (down from 5) and capped summary/related-posts — every char
  // here counts against the account's real 6000 TPM cap for
  // llama-3.1-8b-instant alongside the completion budget (see
  // lib/groq-rate-limiter.ts) — a single oversized request always 413s no
  // matter how pacing between calls is tuned.
  const articles   = searchResult.results.slice(0, 3)
  const aiSummary  = (searchResult.answer || '').slice(0, 250)

  const citableSources = buildCitableSources(articles)
  const articleContext = buildArticleContext(articles)

  const relatedContext = recentPublished.length > 0
    ? `\nRECENT PUBLISHED POSTS (for relatedSlugs — pick 2-3 most topically relevant):\n${
        recentPublished.slice(0, 5).map(p => `- slug: "${p.slug}" | "${p.title}" [${p.cluster}]`).join('\n')
      }\n`
    : ''

  // Trimmed to roughly half its original length — this system prompt plus
  // the JSON template plus source articles all count against the account's
  // real 6000 TPM cap alongside the completion budget. Every hard
  // constraint (word count, citation rule, anti-AI list) is kept.
  const _SYSTEM_ = `You are Ben Carlson, Head of Strategic Partnerships (Americas) at AskBiz and founder of RoG Consulting, helping main street US businesses get clear on their numbers. You write sharp, data-driven analysis for US SMB owners — the briefing a founder in Cleveland, Austin, or Atlanta reads with their morning coffee.

VOICE: Lead with the number, the IRS ruling, the Fed move, or the market shift — never preamble. Short, specific sentences naming real companies, regulators, dollar amounts.
${citationRulePrompt(citableSources, articles.length)}
Direct: "This will compress your margins by Q3" not "margins may face pressure". Use contrast: "Last year X. This year Y. Here's what that means for a $1M business in the South." Reference real US context: IRS, SBA, NFIB, Square, Stripe, QuickBooks, Toast, Shopify, Amazon FBA, ADP, Gusto, OSHA, FTC, Fed. Currency: USD, specific ("$4,200/month" not "thousands of dollars"). Never use: landscape, leverage, synergy, holistic, ecosystem, unlock, empower, seamless, game-changer.

ANTI-AI RULES (these flag content as AI-generated — avoid every one): never open with "In today's economy...", "As small businesses navigate...", "In an era of uncertainty..."; never use "It's worth noting", "needless to say", "at the end of the day", or filler transitions (Furthermore, Moreover, In conclusion); em-dash max once per 400 words; never round numbers when specifics exist ("23% of US small businesses" not "many businesses"); vary sentence length sharply — short, then longer, then short again; write to "you", never "business owners"; no hedging ("This may help...", "Consider whether..."); lead every section with a number, ruling, or named scenario; one concrete example per section — a real US sector, dollar figure, city.

AEO/CITATION: write H2s as questions ("What is the IRS mileage rate for 2026?"). Define key terms on first use in one sentence. Include one 2-3 sentence "quick answer" near the top. Use specific numbers, named sources (IRS, SBA, NFIB, Fed, BLS), dates.

WORD COUNT — HARD REQUIREMENT: the finished article MUST total 1,200-1,500 words across sections (checked automatically; under 1,200 is rejected and never published). Never stop a section short just because you made the main point once — add a second example or a common-mistake callout instead. Do not pad with repetition.

CONTENT TYPE: match the format to the topic — how-to needs steps, news/trend needs a briefing report, compliance needs a checklist.

ASKBIZ (mention naturally, 1-2 features, never a dump): AI business intelligence for SMB founders. ASK: plain-English questions ("Which product has the highest margin after Stripe fees?") get instant data-backed answers. DATA SOURCES: Shopify, Amazon Seller Central, Stripe, Square, QuickBooks, Xero, Toast, Google Sheets. CFO DASHBOARD: cash flow forecasting, margin analysis, break-even tracking, AR/AP. MULTI-CHANNEL: unified P&L across Amazon, Shopify, Walmart, Etsy, in-store POS. TAX: quarterly estimated tax tracking, 1099 prep, state sales tax by channel. MARKET INTEL: competitor price monitoring, US sector benchmarks. POS: card reader, multi-location, staff, inventory sync. ALERTS: daily cash/stock/margin briefings via SMS or email. PRICING: free (3 questions/mo), Growth $49/mo, Business $129/mo, Enterprise custom.
Target: US SMB founders doing $200k-$5M annual revenue.`

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
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The shift. The dollar impact on US SMBs. What founders should do this week.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Lead with the concrete number, IRS change, Fed move, or market shift — not the topic name", "level": 2, "body": "250-300 words. Open with the specific data point or event from the source. Name the regulator, platform, or company. Contrast: what was true before, what changed, why it matters now."},
    {"heading": "What this means for a business doing $200k–$2M in annual revenue", "level": 2, "body": "250-300 words. Translate the macro story into founder-level impact using one concrete US scenario — 'a Nashville-based Shopify store doing $80k/month'. Quantify in dollars, percentages, or hours."},
    {"heading": "Three moves smart operators are making right now", "level": 2, "body": "250-300 words. 3 specific, prescriptive tactics naming US tools/platforms/timelines. No vague advice."},
    {"heading": "A concrete heading showing AskBiz solving this exact US business problem", "level": 2, "body": "200 words. Open with a scene: a US founder types a specific question. Describe what AskBiz returns, with dollar figures — 'AskBiz flags: your Stripe processing fees rose 31% this quarter.'"},
    {"heading": "Warning signs to watch over the next 30 days", "level": 2, "body": "150 words. 3-4 specific signals, checkable on a bank statement or QuickBooks today."},
    {"heading": "Your action plan for this week", "level": 2, "body": "150 words. One action before Friday, one thing to set up once, one metric to track monthly."}
  ],
  "paa": [
    {"q": "Exact Google search query a US small business owner would type about this problem", "a": "40-70 words. Lead with the key action or dollar figure, cite a regulation/platform/benchmark."},
    {"q": "Second high-volume query about a sub-topic", "a": "40-70 words. Factual, complete."},
    {"q": "Third query a US founder would type facing this problem", "a": "40-70 words. Include a benchmark, dollar amount, or timeframe."},
    {"q": "A 'what is'/'how does' question about the core concept", "a": "40-70 words. Plain English, US context (IRS, SBA, Square)."},
    {"q": "How does AskBiz help US small businesses with [specific problem]?", "a": "40-70 words. Name the exact feature and a dollar-figure example."}
  ],
  "cta": {
    "heading": "A CTA headline that names the specific US business problem solved in this post",
    "body": "One sentence connecting this article's topic to AskBiz for US founders. Then: 'Try it free — ask your first question in 30 seconds.'"
  }
}`

  const parsed = await generateWithLengthRetry({
    groqUrl: GROQ_URL,
    apiKey: process.env.GROQ_API_KEY!,
    model: GROQ_MODEL,
    maxTokens: 3200,
    systemPrompt: _SYSTEM_,
    userPrompt,
    logRoute: 'agent/ben-scout',
    logUsage,
  })

  if (!parsed.slug || !parsed.title || !parsed.sections?.length) {
    throw new Error('Invalid blog structure — missing slug, title, or sections')
  }

  // cluster/pillar/region/publishDate/author are deterministic — set here
  // rather than asking the model to reproduce them, which only wastes
  // prompt and completion tokens against the account's tight TPM cap.
  parsed.cluster = cluster
  parsed.pillar = pillar
  parsed.region = 'us'
  parsed.publishDate = new Date().toISOString().slice(0, 10)
  parsed.author = {
    name: 'Ben Carlson',
    role: 'Head of Strategic Partnerships, Americas · Founder, RoG Consulting',
    bio: 'Ben Carlson leads AskBiz\'s Americas strategy and founded RoG Consulting, where he spent a decade helping US main street businesses understand their numbers. He writes briefings that translate macro market shifts into decisions founders can act on before their competitors notice.',
  }
  parsed._citableSources = citableSources

  return parsed
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
