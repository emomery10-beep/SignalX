import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch, type TavilySearchResponse } from '@/lib/tavily'
import { serperSearch } from '@/lib/serper'
import { logUsage } from '@/lib/log-usage'
import { buildCitableSources, buildArticleContext, citationRulePrompt, findFabricatedCitations, countSectionWords, MIN_WORD_COUNT, generateWithLengthRetry } from '@/lib/scout-citation-guard'

export const runtime     = 'nodejs'
export const maxDuration = 800

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.1-8b-instant'

const SCOUT_QUERIES = [
  // ── Trend / news queries ──────────────────────────────────────────────────
  { query: 'Kenya SME cash flow mobile money M-Pesa challenges 2026',                cluster: 'East Africa Finance',       pillar: 'Cash Flow'            },
  { query: 'East Africa ecommerce Jumia Jiji growth trends SME 2026',                cluster: 'East Africa eCommerce',     pillar: 'Market Growth'        },
  { query: 'Kenya KRA tax compliance digital business VAT 2026',                      cluster: 'East Africa Tax & Compliance', pillar: 'KRA Compliance'    },
  { query: 'Nairobi startup ecosystem funding challenges founders 2026',              cluster: 'East Africa Startups',      pillar: 'Startup Growth'       },
  { query: 'East Africa supply chain logistics last mile delivery 2026',             cluster: 'East Africa Supply Chain',  pillar: 'Logistics'            },
  { query: 'Kenya retail informal market digitisation mobile POS 2026',              cluster: 'East Africa eCommerce',     pillar: 'Retail Digitisation'  },
  { query: 'M-Pesa Lipa Na M-Pesa business payments SME adoption 2026',              cluster: 'East Africa Finance',       pillar: 'Mobile Payments'      },
  { query: 'East Africa fintech lending SACCO working capital SME 2026',             cluster: 'East Africa Finance',       pillar: 'SME Lending'          },
  { query: 'Kenya Uganda Tanzania cross-border EAC trade SME 2026',                  cluster: 'East Africa Trade',         pillar: 'Cross-Border Commerce'},
  { query: 'Kenya agribusiness value chain digital platform 2026',                   cluster: 'East Africa Agriculture',   pillar: 'Agri-Commerce'        },
  { query: 'East Africa social commerce WhatsApp Instagram selling SME 2026',        cluster: 'East Africa eCommerce',     pillar: 'Social Commerce'      },
  { query: 'Nairobi salon beauty hair SME business growth 2026',                     cluster: 'East Africa Local Business',pillar: 'Beauty & Wellness'    },
  { query: 'Kenya food delivery restaurant technology rising costs 2026',             cluster: 'East Africa Local Business',pillar: 'Food & Beverage'      },
  { query: 'Safaricom business products SME data analytics 2026',                    cluster: 'East Africa Technology',    pillar: 'Telco Solutions'      },
  { query: 'East Africa AI tools small business productivity automation 2026',       cluster: 'East Africa Technology',    pillar: 'AI for SMEs'          },
  { query: 'Kenya import export duty tariff regulations small business 2026',        cluster: 'East Africa Trade',         pillar: 'Import & Export'      },
  { query: 'Rwanda Uganda fintech mobile money payment innovation 2026',             cluster: 'East Africa Finance',       pillar: 'Fintech Innovation'   },
  { query: 'Kenya construction real estate small contractor margins 2026',           cluster: 'East Africa Local Business',pillar: 'Construction'         },
  { query: 'East Africa SME cybersecurity data fraud mobile banking 2026',           cluster: 'East Africa Technology',    pillar: 'Cybersecurity'        },
  { query: 'Kenya MSME government support funding grants programmes 2026',           cluster: 'East Africa Finance',       pillar: 'Grants & Funding'     },

  // ── Buyer-intent queries ──────────────────────────────────────────────────
  { query: 'how to track M-Pesa business payments and income Kenya',                 cluster: 'East Africa Finance',       pillar: 'Mobile Payments'      },
  { query: 'best inventory management software small business Nairobi Kenya',        cluster: 'East Africa eCommerce',     pillar: 'Inventory Management' },
  { query: 'how to file KRA returns small business Kenya step by step',              cluster: 'East Africa Tax & Compliance', pillar: 'KRA Compliance'    },
  { query: 'how to track profit margin retail business Kenya practical guide',       cluster: 'East Africa Finance',       pillar: 'Margin Analysis'      },
  { query: 'best POS system retail shop Nairobi Kenya affordable',                   cluster: 'East Africa eCommerce',     pillar: 'POS Systems'          },
  { query: 'how to get business loan Kenya SME microfinance SACCO options',          cluster: 'East Africa Finance',       pillar: 'SME Lending'          },
  { query: 'how to sell online Kenya Jiji Jumia WhatsApp ecommerce',                 cluster: 'East Africa eCommerce',     pillar: 'Online Selling'       },
  { query: 'how to manage multiple branch business Kenya track sales',               cluster: 'East Africa Finance',       pillar: 'Multi-Branch Ops'     },
  { query: 'how to accept online payments website Kenya M-Pesa integration',         cluster: 'East Africa Technology',    pillar: 'Payment Integration'  },
  { query: 'how to manage staff payroll Kenya small business NHIF NSSF',             cluster: 'East Africa Tax & Compliance', pillar: 'Payroll Compliance' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret           = searchParams.get('secret')
  const authHeader       = request.headers.get('authorization')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runCarolyneScout()
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runCarolyneScout()
}

async function runCarolyneScout() {
  const runId = `blog_ea_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Carolyne is scanning East African markets for today\'s stories...')

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
      .like('run_id', 'blog_ea_%')
      .gte('created_at', `${today}T00:00:00Z`)
    if ((todayCount ?? 0) > 0) {
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today, log: [`Carolyne already ran today (${today}) — skipping to avoid duplicates.`] })
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const [{ data: recentPosts }, { data: publishedPosts }] = await Promise.all([
      // Was filtering on type='blog_ea', which never matches — inserts below
      // use type='blog' (so posts render at /blog/[slug]), isolated by the
      // run_id prefix instead. The mismatch silently zeroed topic-freshness
      // scoring, this agent's own slug-collision dedup, and relatedSlugs context.
      supabase.from('agent_content').select('source_query, content').eq('type', 'blog').like('run_id', 'blog_ea_%').gte('created_at', thirtyDaysAgo).limit(60),
      supabase.from('agent_content').select('content').eq('type', 'blog').like('run_id', 'blog_ea_%').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
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
    // 5 topics couldn't safely finish within Vercel's 300s function limit
    // once Groq's real TPM rate limit is respected — 3 fits with margin.
    const selected = scoredQueries.slice(0, 3)

    const hasTavily = !!process.env.TAVILY_API_KEY
    const hasSerper = !!process.env.SERPER_API_KEY
    if (!hasTavily && !hasSerper) {
      log.push('ERROR: No search keys set — add TAVILY_API_KEY or SERPER_API_KEY to Vercel env vars')
      return NextResponse.json({ success: false, log }, { status: 200 })
    }

    log.push(`Selected 5 topics (${selected.filter(s => s.penalty === 0).length} fresh, ${selected.filter(s => s.penalty > 0).length} revisits)`)
    log.push(`Searching ${hasTavily ? 'Tavily' : ''}${hasTavily && hasSerper ? ' + ' : ''}${hasSerper ? 'Serper' : ''} for East African market data...`)

    const searchResults = await Promise.allSettled(
      selected.map(async s => {
        let searchResult: TavilySearchResponse | null = null
        if (hasTavily) {
          searchResult = await tavilySearch(s.query, {
            searchDepth:   'advanced',
            maxResults:    5,
            includeAnswer: true,
            topic:         'news',
            days:          14,
          })
        }
        if (!searchResult?.results?.length && hasSerper) {
          const serperRes = await serperSearch(s.query, { type: 'news', num: 5 })
          if (serperRes?.organic?.length) {
            searchResult = {
              query:   s.query,
              answer:  serperRes.answerBox?.snippet || serperRes.answerBox?.answer || '',
              results: serperRes.organic.map(r => ({ url: r.link, title: r.title, content: r.snippet, score: 0.7, published_date: r.date })),
              response_time: 0,
            } as TavilySearchResponse
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

    if (validResults.length === 0) {
      log.push('No search results — exiting')
      return NextResponse.json({ success: false, log, reason: 'no_results' })
    }

    log.push(`Got results for ${validResults.length}/${selected.length} queries. Writing posts...`)

    // Pacing against Groq's per-minute token cap happens inside writeEABlogPost
    // via waitForGroqBudget — safe to dispatch all topics concurrently here.
    const blogResults = await Promise.allSettled(
      validResults.map(r => writeEABlogPost(r, recentPublished))
    )

    const inserts: Record<string, unknown>[] = []

    for (let i = 0; i < blogResults.length; i++) {
      const result   = blogResults[i]
      const source   = validResults[i]
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
        const quality = scoreEABlogQuality(result.value)
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

    log.push(`Carolyne complete. ${inserts.length}/${validResults.length} posts generated.`)

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

async function writeEABlogPost(input: SearchInput, recentPublished: RecentPost[] = []) {
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
  const _SYSTEM_ = `You are Carolyne Kigathi, Head of Strategic Partnerships (East Africa) at AskBiz. You write sharp, data-driven analysis for East African SME founders — the briefing a Nairobi-based founder reads over chai before their first meeting.

VOICE: Lead with the number, the policy change, or the market shift — never waffle. Short, punchy sentences naming real companies, regulators, shilling amounts.
${citationRulePrompt(citableSources, articles.length)}
Direct: "This will squeeze your margins in Q3" not "margins may be impacted". Contrasts: "Last year X. This year Y." Reference real EA context: M-Pesa, KRA, NHIF, NSSF, Safaricom, Equity Bank, Jumia, Twiga Foods, Copia, EAC, CBK. Currencies: lead with KSh, add USD in brackets where helpful; occasionally UGX/TZS/RWF for cross-border topics. Never use: landscape, leverage, synergy, holistic, ecosystem, unlock, empower, seamless, game-changer.

ANTI-AI RULES (these flag content as AI-generated — avoid every one): never open with "In today's Kenya...", "As East African businesses navigate...", "In an era of..."; never use "It's worth noting", "needless to say", "at the end of the day", or filler transitions (Furthermore, Moreover, In conclusion); em-dash max once per 400 words; never round numbers when specifics exist ("67% of Nairobi retailers" not "many businesses"); vary sentence length sharply; write to "you", never "founders"; no hedging ("This may help...", "Consider whether..."); lead every section with a fact, number, or tension; one concrete example per section — a real business type in a real Kenyan city, a real KSh amount.

AEO/CITATION: write H2s as questions ("What does the new KRA DST mean for your Nairobi business?"). Define key terms on first use in one sentence. Include one 2-3 sentence "quick answer" near the top. Use specific numbers, named sources (KRA, CBK, Safaricom, KNBS), dates.

WORD COUNT — HARD REQUIREMENT: the finished article MUST total 1,200-1,500 words across sections (checked automatically; under 1,200 is rejected and never published). Never stop a section short just because you made the main point once — add a second example or a common-mistake callout instead. Do not pad with repetition.

CONTENT TYPE: match the format to the topic — how-to needs steps, news/trend needs a briefing report, compliance needs a checklist.

ASKBIZ (mention naturally, 1-2 features, never a dump): AI business intelligence for SME founders. ASK: plain-English questions ("What is my true landed cost per unit from China?") get instant data-backed answers. DATA SOURCES: Shopify, WooCommerce, Stripe, Pesapal, M-Pesa STK Push exports, Xero, QuickBooks. CFO DASHBOARD: cash flow forecasting, margin analysis, break-even, receivables. MULTI-CURRENCY: KSh, UGX, TZS, RWF, USD, GBP. EA EXPANSION: market-entry analysis for 54 African markets, EAC trade intel, county-level Kenya benchmarks. MARKET INTEL: competitor price monitoring for Kenyan retail/restaurant/salon/logistics/agribusiness. POS: M-Pesa Till integration, multi-branch, real-time inventory sync. ALERTS: cash/stock briefings via WhatsApp or email. PRICING: free (3 questions/mo), Growth KSh 3,800/mo, Business KSh 10,200/mo, Enterprise custom.
Target: East African SME founders doing KSh 2M-20M annual revenue (approx $15k-$150k).`

  const userPrompt = `Write a blog post based on today's East African market intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}Source articles:
${articleContext}
${relatedContext}
The six section bodies below must total 1200+ words combined — do not compress or shorten them to save space. Write every section to its full stated word count.

Return ONLY valid JSON (no markdown fences):
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars",
  "title": "Sharp, specific title under 65 chars — include the primary keyword near the start",
  "metaDescription": "Active voice, 120-155 chars, primary keyword in first 20 words, makes an East African founder want to click",
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The shift. The impact on East African SMEs. What founders should do this week.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Lead with the concrete number, KRA ruling, Safaricom change, or market shift — not the topic name", "level": 2, "body": "250-300 words. Open with the specific data point or event from the source. Name the regulator, telco, or company. Contrast: what was true before, what changed, why it matters now for Nairobi operators."},
    {"heading": "What this means for a business doing KSh 2M–20M revenue", "level": 2, "body": "250-300 words. Translate the macro story into founder-level impact using one concrete East African scenario. Quantify in KSh, percentages, or hours."},
    {"heading": "The three moves smart operators in Nairobi are making right now", "level": 2, "body": "250-300 words. 3 specific, prescriptive tactics naming EA tools/platforms/timelines. No vague advice."},
    {"heading": "A concrete heading showing AskBiz solving this exact East African problem", "level": 2, "body": "200 words. Open with a scene: a Nairobi founder types a specific question. Describe what AskBiz returns, with KSh figures — 'AskBiz flags: your M-Pesa Till charges rose 23% this quarter.'"},
    {"heading": "The warning signs to watch in the next 30 days", "level": 2, "body": "150 words. 3-4 specific signals, checkable on an M-Pesa statement, KRA portal, or Equity Bank today."},
    {"heading": "Your action plan for this week", "level": 2, "body": "150 words. One action before Friday, one thing to set up once, one metric to track monthly."}
  ],
  "paa": [
    {"q": "Exact Google search query an East African founder would type about this problem", "a": "40-70 words. Lead with the key action or KSh figure, cite a regulation/platform/benchmark."},
    {"q": "Second high-volume query about a sub-topic", "a": "40-70 words. Factual, complete, Kenya/EA context."},
    {"q": "Third query a Kenyan founder would type facing this problem", "a": "40-70 words. Include a benchmark, KSh amount, or timeframe."},
    {"q": "A 'what is'/'how does' question about the core concept", "a": "40-70 words. Plain English, Kenya/EA context (M-Pesa, KRA, Equity Bank)."},
    {"q": "How does AskBiz help East African businesses with [specific problem]?", "a": "40-70 words. Name the exact feature and a KSh-figure example."}
  ],
  "cta": {
    "heading": "A CTA headline that names the specific East African business problem solved in this post",
    "body": "One sentence connecting this article's topic to AskBiz for East African founders. Then: 'Try it free — ask your first question in 30 seconds.'"
  }
}`

  const parsed = await generateWithLengthRetry({
    groqUrl: GROQ_URL,
    apiKey: process.env.GROQ_API_KEY!,
    model: GROQ_MODEL,
    maxTokens: 3200,
    systemPrompt: _SYSTEM_,
    userPrompt,
    logRoute: 'agent/carolyne-scout',
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
  parsed.region = 'east-africa'
  parsed.publishDate = new Date().toISOString().slice(0, 10)
  parsed.author = {
    name: 'Carolyne Kigathi',
    role: 'Head of Strategic Partnerships, East Africa',
    bio: 'Carolyne Kigathi leads AskBiz\'s East Africa strategy, tracking regulatory shifts, mobile money trends, and SME growth signals across Kenya, Uganda, Tanzania, and Rwanda — and turning them into briefings founders can act on before their competitors notice.',
  }
  parsed._citableSources = citableSources

  return parsed
}

function scoreEABlogQuality(blog: Record<string, unknown>): number {
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
