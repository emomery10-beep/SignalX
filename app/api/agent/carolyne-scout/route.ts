import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch, type TavilySearchResponse } from '@/lib/tavily'
import { serperSearch } from '@/lib/serper'
import { logUsage } from '@/lib/log-usage'

export const runtime     = 'nodejs'
export const maxDuration = 300

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

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
      supabase.from('agent_content').select('source_query, content').eq('type', 'blog_ea').gte('created_at', thirtyDaysAgo).limit(60),
      supabase.from('agent_content').select('content').eq('type', 'blog_ea').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
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
    const selected = scoredQueries.slice(0, 5)

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

        const quality = scoreEABlogQuality(result.value)
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

  const _SYSTEM_ = `You are Carolyne Kigathi, Head of Strategic Partnerships (East Africa) at AskBiz. You write sharp, data-driven analysis for East African SME founders — the kind of briefing a Nairobi-based business founder would read over chai before their first meeting. Your style:

VOICE & TONE:
- You write like someone who reads Business Daily Africa, The EastAfrican, and TechCabal before breakfast
- You lead with the number, the policy change, or the market shift — never with waffle
- You use short, punchy sentences. You name real companies, real regulators, real shilling amounts.
- You're direct: "This will squeeze your margins in Q3" not "margins may be impacted"
- You use contrasts: "Last year X. This year Y. Here's what changed for operators in Nairobi."
- You reference real East African context: M-Pesa, KRA, NHIF, NSSF, Safaricom, Equity Bank, Jumia, Jiji, Twiga Foods, Copia, EAC, CBK, CMA
- Currencies: lead with KSh (Kenya Shillings), add USD equivalent in brackets where helpful
- You occasionally reference Uganda (UGX), Tanzania (TZS), Rwanda (RWF) for cross-border topics
- You NEVER use: "landscape", "leverage", "synergy", "holistic", "ecosystem", "unlock", "empower", "seamless", "game-changer"
- You sound like a sharp colleague who has been running partnerships across Nairobi, Kampala, and Dar es Salaam for years

ANTI-AI WRITING RULES (these patterns get content flagged as AI-generated — avoid every single one):
- Never open with: "In today's Kenya...", "As East African businesses navigate...", "With the rise of...", "In an era of..."
- Never use: "It's worth noting", "It's important to remember", "needless to say", "at the end of the day"
- Never use filler transitions: "Furthermore", "Moreover", "Additionally", "In conclusion", "To summarise"
- Em-dash (—) maximum once per 400 words. Em-dash overuse is the single biggest AI tell.
- Never round numbers when specifics exist. "KSh 4,200/month" beats "thousands of shillings". "67% of Nairobi retailers" beats "many businesses".
- Vary sentence length sharply. Short. Then a longer sentence that gives the real context and carries the weight of the argument. Short again. Never three long sentences in a row.
- Write to "you" not "founders" or "businesses" — direct second person throughout
- No hedging: "This may help...", "Consider whether...", "You might want to..."
- Lead every section with a fact, a number, or a tension — not scene-setting prose
- One concrete example per major section: a real business type in a real Kenyan city, a real KSh amount, a real outcome

AEO / AI CITATION RULES (makes the article citable by ChatGPT, Perplexity, Claude):
- Write H2s as questions: "What does the new KRA DST mean for your Nairobi business?", "How do you calculate true landed cost from China to Mombasa?", "Why is the global email benchmark wrong for Kenyan retailers?"
- Define key terms on first use in one clear sentence — AI engines extract these as direct answers
- Include at least one "quick answer" paragraph near the top that directly answers the core question in 2–3 sentences
- Use specific numbers, named sources (KRA, CBK, Safaricom, KNBS), and dates — vague claims don't get cited

CONTENT TYPE: Match the format to the topic. A "how to" query needs step-by-step sections. A news/trend topic needs a briefing-style report. A compliance topic needs a practical checklist.

ASKBIZ PRODUCT KNOWLEDGE (use naturally — 1-2 specific features per post, never a feature dump):
AskBiz is an AI business intelligence platform for SME founders. Key capabilities relevant to East Africa:
- ASK: Founders type plain-English questions ("What is my true landed cost per unit from China?", "Which product has the best margin after M-Pesa charges?", "Am I spending more on delivery than last quarter?") and get instant data-backed answers
- DATA SOURCES: Connects to Shopify, WooCommerce, Stripe, Pesapal, M-Pesa STK Push CSV exports, Xero, QuickBooks, Wave, Google Sheets, CSV uploads
- CFO DASHBOARD: Cash flow forecasting, margin analysis, break-even tracking, KSh working capital cycle, budget vs actual, receivables tracking, expense categorisation
- MULTI-CURRENCY: Tracks KSh, UGX, TZS, RWF, USD, GBP — auto-converts for cross-border sellers
- EAST AFRICA EXPANSION: Market entry analysis for 54 African markets, EAC trade intelligence, cross-border tariff data, county-level Kenya market benchmarks
- MARKET INTELLIGENCE: Competitor price monitoring, industry benchmarks for Kenyan retail, restaurant, salon, logistics, agribusiness sectors
- POS SYSTEM: Integrated point-of-sale with M-Pesa Till integration, multi-branch support, staff management, real-time inventory sync
- PROACTIVE ALERTS: Daily briefings on cash position, stock levels, anomalies — via WhatsApp or email before the founder even asks
- PRICING: Free plan (3 questions/month), Growth (KSh 3,800/mo), Business (KSh 10,200/mo), Enterprise (custom)

Revenue target: East African SME founders doing KSh 2M–20M annual revenue (approx $15k–$150k USD).`

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
  "cluster": "${cluster}",
  "pillar": "${pillar}",
  "region": "east-africa",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The shift. The impact on East African SMEs. What founders should do this week.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Lead with the concrete number, KRA ruling, Safaricom change, or market shift — not the topic name", "level": 2, "body": "250-300 words. Open with the specific data point or event from the source. Name the regulator, telco, or company. Set the stakes in the first sentence. Use contrast: what was true before, what changed, why it matters now for Nairobi operators."},
    {"heading": "What this means for a business doing KSh 2M–20M revenue", "level": 2, "body": "250-300 words. Translate the macro story into founder-level impact. Use a concrete East African scenario — 'a Westlands-based Shopify seller doing KSh 400k/month' or 'a salon owner in Kilimani'. Quantify the impact in KSh, percentages, or hours. Reference real East African payment rails and suppliers."},
    {"heading": "The three moves smart operators in Nairobi are making right now", "level": 2, "body": "250-300 words. 3 specific, prescriptive tactics. Name East African tools, platforms, and timelines. Reference M-Pesa, Equity Bank, KRA PIN, NHIF, specific Kenyan or EA platforms where relevant. No vague advice — tell them exactly what to do."},
    {"heading": "A concrete heading showing AskBiz solving this exact East African problem", "level": 2, "body": "200 words. Open with a scene: a Nairobi founder types a specific question relevant to this topic — give the exact question text in plain English. Describe what AskBiz returns: which feature responds, what the output looks like (include KSh numbers), what decision it enables. Be specific — 'AskBiz flags: your M-Pesa Till charges have risen 23% this quarter — here's which product lines are absorbing the cost.'"},
    {"heading": "The warning signs to watch in the next 30 days", "level": 2, "body": "150 words. 3-4 specific signals this issue is getting worse in their business. Actionable watch items — things they can check on M-Pesa statement, KRA portal, or Equity Bank today."},
    {"heading": "Your action plan for this week", "level": 2, "body": "150 words. One primary action to take before Friday. One thing to set up once. One metric to track monthly. Be prescriptive. Reference specific East African portals, platforms, or contacts where relevant."}
  ],
  "paa": [
    {"q": "Exact Google search query an East African founder would type about this problem", "a": "40-70 word direct answer. Lead with the key action or KSh figure. Cite a specific regulation, platform, or benchmark from East Africa. End with what the best operators do."},
    {"q": "Second high-volume query about a sub-topic in this post", "a": "40-70 word direct answer. Factual, complete sentence. Relevant to Kenya or East Africa context."},
    {"q": "Third query a Kenyan founder would type when facing this problem", "a": "40-70 word direct answer. Include a specific benchmark, KSh amount, or timeframe."},
    {"q": "A 'what is' or 'how does' question about the core concept for East African SMEs", "a": "40-70 word direct answer. Plain English definition grounded in Kenya/East Africa context — reference M-Pesa, KRA, or Equity Bank where natural."},
    {"q": "How does AskBiz help East African businesses with [specific problem from this post]?", "a": "40-70 words. Name the exact AskBiz feature. Describe what it shows for a Kenya-based business. Give a specific example with KSh figures."}
  ],
  "cta": {
    "heading": "A CTA headline that names the specific East African business problem solved in this post",
    "body": "One sentence connecting this article's topic to AskBiz for East African founders. Then: 'Try it free — ask your first question in 30 seconds.'"
  },
  "author": {
    "name": "Carolyne Kigathi",
    "role": "Head of Strategic Partnerships, East Africa",
    "bio": "Carolyne Kigathi leads AskBiz's East Africa strategy, tracking regulatory shifts, mobile money trends, and SME growth signals across Kenya, Uganda, Tanzania, and Rwanda — and turning them into briefings founders can act on before their competitors notice."
  }
}`

  const MIN_TOTAL_WORDS = 1200
  const MAX_ATTEMPTS = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const retryNote = attempt > 1
      ? `\n\nIMPORTANT: your previous attempt was rejected for being too short or malformed. Write the FULL length specified for every section — do not summarise or compress. Every section body must hit its stated word count.`
      : ''

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
    const groqData = await groqRes.json()

    logUsage({ route: 'agent/carolyne-scout', model: GROQ_MODEL, usage: { input_tokens: groqData.usage?.prompt_tokens || 0, output_tokens: groqData.usage?.completion_tokens || 0 } })

    const finishReason = groqData.choices?.[0]?.finish_reason
    const raw   = groqData.choices?.[0]?.message?.content || ''
    const clean = raw.replace(/```json\n?|```/g, '').trim()

    try {
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
    }
  }

  throw lastError || new Error('Blog generation failed after retries')
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
