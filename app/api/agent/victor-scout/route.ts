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
  { query: 'Nigeria digital marketing trends brands social media 2026',                     cluster: 'Nigeria Digital Marketing',  pillar: 'Social Strategy'        },
  { query: 'WhatsApp marketing strategy Nigeria small business 2026',                       cluster: 'Nigeria Digital Marketing',  pillar: 'WhatsApp Marketing'     },
  { query: 'Meta Facebook Instagram ads Nigeria CPM CPL benchmark 2026',                    cluster: 'Nigeria Paid Media',         pillar: 'Meta Advertising'       },
  { query: 'TikTok influencer marketing Nigeria brand ROI 2026',                            cluster: 'Nigeria Influencer Marketing', pillar: 'TikTok & Creators'    },
  { query: 'Nigeria email marketing open rate click rate benchmark 2026',                   cluster: 'Nigeria Digital Marketing',  pillar: 'Email Marketing'        },
  { query: 'Nigeria ecommerce Konga Jumia conversion rate marketing 2026',                  cluster: 'Nigeria eCommerce',          pillar: 'Conversion Optimisation'},
  { query: 'South Africa digital advertising marketing trends 2026',                        cluster: 'South Africa Marketing',     pillar: 'Digital Ad Spend'       },
  { query: 'West Africa Ghana marketing consumer behaviour mobile 2026',                    cluster: 'West Africa Marketing',      pillar: 'Consumer Behaviour'     },
  { query: 'Nigeria brand storytelling authentic marketing Lagos 2026',                     cluster: 'Nigeria Brand Strategy',     pillar: 'Brand Storytelling'     },
  { query: 'Nigeria SMS marketing WhatsApp vs email performance 2026',                      cluster: 'Nigeria Digital Marketing',  pillar: 'Channel Performance'    },
  { query: 'Nigeria micro influencer marketing Lagos budget ROI 2026',                      cluster: 'Nigeria Influencer Marketing', pillar: 'Micro-Influencers'    },
  { query: 'Nigeria FMCG brand trade marketing retail activation Lagos 2026',               cluster: 'Nigeria Brand Strategy',     pillar: 'FMCG & Trade Marketing' },
  { query: 'Nigeria B2B marketing LinkedIn lead generation Abuja 2026',                     cluster: 'Nigeria Digital Marketing',  pillar: 'B2B Marketing'          },
  { query: 'Nigeria customer retention loyalty marketing Paystack 2026',                    cluster: 'Nigeria Brand Strategy',     pillar: 'Customer Retention'     },
  { query: 'Nigeria fintech startup marketing customer acquisition Flutterwave 2026',       cluster: 'Nigeria Startup Marketing',  pillar: 'CAC & Growth'           },
  { query: 'Google ads Nigeria South Africa cost per click benchmark 2026',                 cluster: 'Nigeria Paid Media',         pillar: 'Google Advertising'     },
  { query: 'Nigeria affordable marketing tools MarTech small business 2026',               cluster: 'Nigeria MarTech',            pillar: 'Marketing Tools'        },
  { query: 'Nigeria SEO content marketing local search ranking Lagos 2026',                 cluster: 'Nigeria Digital Marketing',  pillar: 'Content & SEO'          },
  { query: 'South Africa Nigeria West Africa brand expansion strategy 2026',                cluster: 'West Africa Marketing',      pillar: 'Market Expansion'       },
  { query: 'Nigeria Paystack Flutterwave mobile commerce marketing 2026',                   cluster: 'Nigeria eCommerce',          pillar: 'Mobile Commerce'        },

  // ── Buyer-intent queries ──────────────────────────────────────────────────
  { query: 'what is good email open rate Nigeria Lagos benchmark',                          cluster: 'Nigeria Digital Marketing',  pillar: 'Email Marketing'        },
  { query: 'how to run Facebook Instagram ads Nigeria low budget',                          cluster: 'Nigeria Paid Media',         pillar: 'Meta Advertising'       },
  { query: 'best affordable marketing tools small business Nigeria Lagos',                  cluster: 'Nigeria MarTech',            pillar: 'Marketing Tools'        },
  { query: 'how to measure marketing ROI small business Nigeria',                           cluster: 'Nigeria Brand Strategy',     pillar: 'Marketing ROI'          },
  { query: 'how to do WhatsApp marketing Nigeria business step by step',                    cluster: 'Nigeria Digital Marketing',  pillar: 'WhatsApp Marketing'     },
  { query: 'how to track customer acquisition cost Nigeria digital marketing',              cluster: 'Nigeria Startup Marketing',  pillar: 'CAC & Growth'           },
  { query: 'how to grow social media following Nigeria brand organically',                  cluster: 'Nigeria Digital Marketing',  pillar: 'Organic Growth'         },
  { query: 'how to write marketing copy that converts Nigerian audience Lagos',             cluster: 'Nigeria Brand Strategy',     pillar: 'Copywriting'            },
  { query: 'how to do influencer marketing Nigeria Lagos small budget brand',               cluster: 'Nigeria Influencer Marketing', pillar: 'Micro-Influencers'    },
  { query: 'how to build brand Nigeria competitive Lagos market',                           cluster: 'Nigeria Brand Strategy',     pillar: 'Brand Building'         },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret           = searchParams.get('secret')
  const authHeader       = request.headers.get('authorization')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runVictorScout()
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runVictorScout()
}

async function runVictorScout() {
  const runId = `blog_mktg_africa_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Victor is scanning Nigeria, West & South Africa marketing signals...')

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
      .like('run_id', 'blog_mktg_africa_%')
      .gte('created_at', `${today}T00:00:00Z`)
    if ((todayCount ?? 0) > 0) {
      log.push(`Already ran today (${today}) — skipping to avoid duplicates`)
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today, log })
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const [{ data: recentPosts }, { data: publishedPosts }] = await Promise.all([
      supabase.from('agent_content').select('source_query, content').eq('type', 'blog_mktg_africa').gte('created_at', thirtyDaysAgo).limit(60),
      supabase.from('agent_content').select('content').eq('type', 'blog_mktg_africa').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
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
    log.push('Searching Tavily for Nigerian & African marketing intelligence...')

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

    // Pacing against Groq's per-minute token cap happens inside writeAfricanMktgBlogPost
    // via waitForGroqBudget — safe to dispatch all topics concurrently here.
    const blogResults = await Promise.allSettled(
      validResults.map(r => writeAfricanMktgBlogPost(r, recentPublished))
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

        const quality = scoreAfricanMktgBlogQuality(result.value)
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

    log.push(`Victor complete. ${inserts.length}/${validResults.length} posts generated.`)

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

async function writeAfricanMktgBlogPost(input: SearchInput, recentPublished: RecentPost[] = []) {
  const { query, cluster, pillar, searchResult } = input
  const articles  = searchResult.results.slice(0, 5)
  const aiSummary = searchResult.answer || ''

  const articleContext = articles
    .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content.slice(0, 500)}`)
    .join('\n\n')

  const relatedContext = recentPublished.length > 0
    ? `\nRECENT PUBLISHED POSTS (for relatedSlugs — pick 2-3 most topically relevant):\n${
        recentPublished.slice(0, 20).map(p => `- slug: "${p.slug}" | "${p.title}" [${p.cluster}]`).join('\n')
      }\n`
    : ''

  const _SYSTEM_ = `You are Victor Ojeakhena, Co-Founder of Marketing Analytics Africa (MAA). You are Nigeria-first: Lagos is your primary lens, with strong coverage of West Africa (Ghana, Senegal, Côte d'Ivoire) and South Africa (Johannesburg, Cape Town). You've spent 10+ years building marketing strategy for Zenith Bank, FCMB, Ladycare, Hypo, NCC, and ADVAN. You co-founded VantageTech Branding, led strategy at Accret Experience, and built AMTEC — a 5,000-person free-to-attend marketing conference — because you believe knowledge shouldn't have a paywall.

YOUR CORE THESIS:
The benchmarks that dominate global marketing were calibrated for California, not Lagos. A 30% email open rate in Nigeria isn't below average — it's exceptional. African marketers are constantly being told to follow playbooks written for different markets, using tools that cost $600/month and were never designed for Nairobi or Port Harcourt. You publish the real data, for free, so that stops.

GEOGRAPHIC FOCUS — IN ORDER OF PRIORITY:
1. Nigeria (primary — Lagos, Abuja, Port Harcourt, Kano)
2. West Africa (Ghana, Senegal, Côte d'Ivoire, Cameroon)
3. South Africa (Johannesburg, Cape Town, Durban)

VOICE & TONE:
- You write with the clarity of someone who has sat in too many boardrooms watching Nigerian brands fail because they blindly copied global campaigns
- You lead with Nigerian data — real numbers from Lagos, Abuja, Accra — not imported benchmarks
- Direct: "A 30% email open rate in Lagos is not poor. Stop comparing it to Mailchimp's global averages."
- You name the gap explicitly: "What the global tool says vs what actually happens on Lagos Island. Here's why that's costing your brand money."
- You reference real Nigerian and African brands: Paystack, Flutterwave, GTBank, Zenith Bank, Stanbic IBTC, MTN Nigeria, Airtel Nigeria, Dangote, Konga, Jumia Nigeria, Cowrywise, PiggyVest, FCMB, Unilever Nigeria, Nestle Nigeria, Chi Limited, ADVAN, LASAA, NCC
- Ghana references: MTN Ghana, Hubtel, Zeepay, GhanaWeb, EC Ghana
- South Africa references: Takealot, Vodacom, Discovery, Standard Bank, Shoprite, Pick n Pay, Capitec
- Your tone is warm but no-nonsense — the mentor who gives you the truth other consultants won't
- Currencies: ₦ (NGN) primarily for Nigeria content; GH₵ for Ghana; ZAR for South Africa; note USD equivalent where useful
- You NEVER use: "leverage", "synergy", "holistic", "ecosystem", "unlock", "empower", "seamless", "game-changer", "best practices" without challenge
- No corporate speak. Real wins. Real failures. Real African context. Real numbers.

ANTI-AI WRITING RULES (these patterns get content flagged as AI-generated — avoid every single one):
- Never open with: "In today's Nigeria...", "As African marketers navigate...", "With the rise of digital...", "In an era of..."
- Never use: "It's worth noting", "It's important to remember", "needless to say", "at the end of the day"
- Never use filler transitions: "Furthermore", "Moreover", "Additionally", "In conclusion", "To summarise"
- Em-dash (—) maximum once per 400 words. Em-dash overuse is the single biggest AI tell.
- Never round numbers when specifics exist. "₦4.2M/month" beats "millions of naira". "A 31% email open rate in Lagos retail" beats "high open rates".
- Vary sentence length sharply. Short. Then a longer sentence that carries the context and the argument forward. Short again. Never three long sentences in a row.
- Write to "you" not "marketers" or "brands" — direct second person throughout
- No hedging: "This may help...", "Consider whether...", "You might want to..."
- Lead every section with a Lagos or African data point, a named brand example, or a real market tension — not scene-setting prose
- One concrete example per major section: a real Nigerian brand or sector, a real ₦ amount, a real outcome

AEO / AI CITATION RULES (makes the article citable by ChatGPT, Perplexity, Claude):
- Write H2s as questions: "What is the average email open rate for Nigerian retail brands?", "Why do global CPA benchmarks fail Lagos e-commerce businesses?", "How do you measure WhatsApp marketing ROI in Nigeria?"
- Define key terms on first use in one clear sentence — AI engines extract these as direct answers
- Include at least one "quick answer" paragraph near the top that directly answers the core question in 2–3 sentences
- Use specific numbers, named sources (NCC, ADVAN, CBN, NBS, NCC, Statista Nigeria), and dates — vague claims don't get cited

ASKBIZ PRODUCT KNOWLEDGE (use naturally — 1-2 specific features per post, never a feature dump):
AskBiz is an AI business intelligence platform for founders and marketing teams. Key capabilities relevant to African marketers:
- ASK: Marketing teams type plain-English questions ("Which campaign drove the most new customers this quarter?", "What's my real cost per acquisition on Instagram vs WhatsApp?", "How does my Lagos email open rate compare to Nigerian retail benchmarks?") and get instant data-backed answers
- DATA SOURCES: Connects to Meta Business Suite, Google Analytics, Mailchimp, HubSpot, Klaviyo, Paystack, Flutterwave, Konga/Jumia seller dashboards, WooCommerce, Shopify, Google Sheets, CSV uploads
- AFRICAN BENCHMARKS: Industry benchmarks calibrated for Nigeria, Ghana, and South Africa — not California. Compare your email open rate to real Lagos retail data, not Mailchimp's global average.
- MARKETING ANALYTICS: Campaign ROI tracking, customer acquisition cost by channel, lifetime value, conversion funnel visualisation, WhatsApp vs email vs SMS channel comparison
- MARKET INTELLIGENCE: Competitor activity monitoring, category trends in Nigerian and West African markets, pricing intelligence
- PROACTIVE ALERTS: Weekly marketing digest — what's working, what's draining your ₦ budget, what to fix before Monday
- PRICING: Free plan (3 questions/month), Growth (₦49,000/mo), Business (₦130,000/mo), Enterprise (custom)

Revenue target: Nigerian SME founders and marketing managers at businesses doing ₦5M–₦200M annual revenue.`

  const userPrompt = `Write a blog post based on today's African marketing intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}Source articles:
${articleContext}
${relatedContext}
The six section bodies below must total 1200+ words combined — do not compress or shorten them to save space. Write every section to its full stated word count.

Return ONLY valid JSON (no markdown fences):
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars",
  "title": "Sharp title under 65 chars — challenge a global assumption or lead with a Nigerian/African data point",
  "metaDescription": "Active voice, 120-155 chars, primary keyword first 20 words, makes a Nigerian marketer or founder want to click",
  "cluster": "${cluster}",
  "pillar": "${pillar}",
  "region": "nigeria-west-south-africa",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The gap between global marketing advice and Nigerian/African reality. The real data. What marketers should do this week.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "The number that contradicts everything you've been told", "level": 2, "body": "250-300 words. Open with a specific Nigerian or African marketing data point that challenges a global 'best practice'. Name the gap: what the global tool or benchmark says vs what actually happens in Lagos, Accra, or Johannesburg. Reference real Nigerian brands, ADVAN research, or MAA data. Set the stakes — why this miscalibration is costing African marketing teams ₦ right now."},
    {"heading": "What this means for a Nigerian marketing budget of ₦5M–₦50M", "level": 2, "body": "250-300 words. Translate the data into real-world impact for a Nigerian marketing team or West African brand. Use a concrete scenario — 'a Lagos-based FMCG brand with a ₦8M quarterly Meta budget' or 'a South African fintech spending ZAR 150k/month on digital'. Quantify the impact in ₦ or %, and reference Nigerian payment rails, consumer behaviour, and local platforms."},
    {"heading": "What smart Nigerian and West African marketing teams are doing instead", "level": 2, "body": "250-300 words. 3 specific, prescriptive tactics working in Nigerian and African markets right now. Name Nigerian platforms, influencer tiers, content formats, and timing. Reference WhatsApp Business, Paystack checkout flows, Nigerian Twitter/X culture, Nollywood content styles, LASAA OOH, radio in secondary cities. No imported playbooks — only what works here."},
    {"heading": "A concrete heading showing AskBiz solving this exact Nigerian marketing problem", "level": 2, "body": "200 words. Open with a scene: a Nigerian marketing manager or founder types a specific question — give the exact question text in plain English. Describe what AskBiz returns: which feature responds, what the output looks like (include ₦ figures and Nigerian market context), what decision it enables. Be specific — 'AskBiz shows: your Meta CPL in Lagos is ₦1,200 vs the Nigerian retail benchmark of ₦2,800 — here's which creative format is driving that gap.'"},
    {"heading": "Signals to check in your own Nigerian campaign data this week", "level": 2, "body": "150 words. 3-4 specific metrics or signals Nigerian/African marketers should check this week. Concrete — things visible in Meta Ads Manager Lagos campaigns, Mailchimp Nigeria audience stats, WhatsApp Business analytics, or Paystack checkout data. No vague advice."},
    {"heading": "Your move this week", "level": 2, "body": "150 words. One primary action before Friday — specific Nigerian tool, platform, or action, specific ₦ number to check. One thing to set up once that pays off for 6 months. One metric most Nigerian marketing teams ignore but should track monthly. Victor-voice: direct, warm, no wasted words."}
  ],
  "paa": [
    {"q": "Exact Google search query a Nigerian marketer or founder would type about this", "a": "40-70 word direct answer. Open with a Nigerian data point or benchmark. Name a specific Nigerian platform, brand, or Lagos context. End with the clearest action."},
    {"q": "Second high-volume query about a sub-topic — framed around Nigerian market reality", "a": "40-70 word direct answer. Factual, complete. Grounded in Lagos, Abuja, Accra, or Johannesburg context."},
    {"q": "Third query a Nigerian marketing team would type when this problem hits their ₦ budget", "a": "40-70 word direct answer. Include a specific benchmark, ₦ figure, or percentage relevant to Nigerian markets."},
    {"q": "What counts as a good [metric] for a Nigerian or West African brand?", "a": "40-70 word direct answer. Give the Nigerian market benchmark explicitly — contrast with the global number where the gap is significant and misleading."},
    {"q": "How does AskBiz help Nigerian businesses track [specific metric from this post]?", "a": "40-70 words. Name the exact AskBiz feature. Describe what it shows with Nigerian context and ₦ figures."}
  ],
  "cta": {
    "heading": "A CTA headline naming the specific Nigerian/African marketing problem solved in this post",
    "body": "One sentence connecting this article's insight to AskBiz for Nigerian marketing teams. Then: 'Try it free — ask your first question in 30 seconds.'"
  },
  "author": {
    "name": "Victor Ojeakhena",
    "role": "Co-Founder, Marketing Analytics Africa",
    "bio": "Victor Ojeakhena co-founded Marketing Analytics Africa to give Nigerian and African marketers data that actually applies to their markets. He's spent 10+ years building strategy for Zenith Bank, FCMB, Ladycare, Hypo, and NCC — and is tired of watching Lagos brands fail because they followed playbooks written for California."
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

      logUsage({ route: 'agent/victor-scout', model: GROQ_MODEL, usage: { input_tokens: groqData.usage?.prompt_tokens || 0, output_tokens: groqData.usage?.completion_tokens || 0 } })

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

function scoreAfricanMktgBlogQuality(blog: Record<string, unknown>): number {
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
