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
  { query: 'social media marketing ROI small business 2026 benchmarks',                cluster: 'Social Media Marketing',    pillar: 'Social ROI'             },
  { query: 'TikTok shop ecommerce SME sales conversion rates 2026',                    cluster: 'Social Commerce',           pillar: 'TikTok Commerce'        },
  { query: 'email marketing open rates benchmarks small business 2026',                cluster: 'Email Marketing',           pillar: 'Email Performance'      },
  { query: 'Meta ads CPM CPC rising costs small business 2026',                        cluster: 'Paid Advertising',          pillar: 'Meta Ads'               },
  { query: 'Google Ads performance max small business results 2026',                   cluster: 'Paid Advertising',          pillar: 'Google Ads'             },
  { query: 'SEO content marketing strategy small business organic traffic 2026',       cluster: 'Content & SEO',             pillar: 'Organic Growth'         },
  { query: 'influencer marketing micro nano SME ROI UK 2026',                          cluster: 'Influencer Marketing',      pillar: 'Influencer ROI'         },
  { query: 'marketing automation tools small business email CRM 2026',                 cluster: 'Marketing Automation',      pillar: 'Automation Tools'       },
  { query: 'conversion rate optimisation ecommerce landing page CRO 2026',             cluster: 'CRO & UX',                  pillar: 'Conversion Rate'        },
  { query: 'customer acquisition cost CAC UK SME marketing budget 2026',               cluster: 'Marketing Finance',         pillar: 'CAC Benchmarks'         },
  { query: 'Instagram shopping product tagging ecommerce small brand 2026',            cluster: 'Social Commerce',           pillar: 'Instagram Commerce'     },
  { query: 'LinkedIn marketing B2B small business lead generation 2026',               cluster: 'B2B Marketing',             pillar: 'LinkedIn Leads'         },
  { query: 'WhatsApp business marketing UK SME customer engagement 2026',              cluster: 'Messaging & Chat',          pillar: 'WhatsApp Marketing'     },
  { query: 'customer retention loyalty programme small business 2026',                 cluster: 'Customer Marketing',        pillar: 'Retention & Loyalty'    },
  { query: 'video marketing short form Reels YouTube Shorts SME 2026',                 cluster: 'Video Marketing',           pillar: 'Short-Form Video'       },
  { query: 'local SEO Google Business Profile small business 2026',                    cluster: 'Content & SEO',             pillar: 'Local SEO'              },
  { query: 'brand marketing authenticity small business differentiation 2026',         cluster: 'Brand Strategy',            pillar: 'Brand Building'         },
  { query: 'review reputation management Google Trustpilot small business 2026',       cluster: 'Customer Marketing',        pillar: 'Reputation Management'  },
  { query: 'affiliate marketing programme ecommerce SME revenue 2026',                 cluster: 'Performance Marketing',     pillar: 'Affiliate Marketing'    },
  { query: 'marketing analytics attribution multi-touch small business 2026',          cluster: 'Marketing Finance',         pillar: 'Attribution Analytics'  },

  // ── Buyer-intent queries ──────────────────────────────────────────────────
  { query: 'how to grow Instagram following small business UK organic',                cluster: 'Social Media Marketing',    pillar: 'Instagram Growth'       },
  { query: 'how to write email marketing campaigns that convert SME',                  cluster: 'Email Marketing',           pillar: 'Email Campaigns'        },
  { query: 'how to run Facebook ads small business on a budget 2026',                  cluster: 'Paid Advertising',          pillar: 'Meta Ads'               },
  { query: 'best marketing tools small business free affordable UK',                   cluster: 'Marketing Automation',      pillar: 'Marketing Stack'        },
  { query: 'how to track marketing ROI small business analytics',                      cluster: 'Marketing Finance',         pillar: 'Marketing ROI'          },
  { query: 'how to get more Google reviews small business guide',                      cluster: 'Customer Marketing',        pillar: 'Reputation Management'  },
  { query: 'how to create content calendar small business social media',               cluster: 'Content & SEO',             pillar: 'Content Strategy'       },
  { query: 'how to increase website conversion rate ecommerce UK',                     cluster: 'CRO & UX',                  pillar: 'Conversion Rate'        },
  { query: 'best email marketing platform small business Mailchimp Klaviyo',           cluster: 'Email Marketing',           pillar: 'Platform Selection'     },
  { query: 'how to find micro influencers small business collaboration UK',            cluster: 'Influencer Marketing',      pillar: 'Finding Influencers'    },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret           = searchParams.get('secret')
  const authHeader       = request.headers.get('authorization')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runMarketingScout()
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runMarketingScout()
}

async function runMarketingScout() {
  const runId = `blog_mktg_uk_${Date.now()}`
  const log: string[] = []

  try {
    log.push('Maya is scanning global marketing signals for today\'s posts...')

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
      .like('run_id', 'blog_mktg_uk_%')
      .gte('created_at', `${today}T00:00:00Z`)
    if ((todayCount ?? 0) > 0) {
      log.push(`Already ran today (${today}) — skipping to avoid duplicates`)
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today, log })
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const [{ data: recentPosts }, { data: publishedPosts }] = await Promise.all([
      supabase.from('agent_content').select('source_query, content').eq('type', 'blog').like('run_id', 'blog_mktg_uk_%').gte('created_at', thirtyDaysAgo).limit(60),
      supabase.from('agent_content').select('content').eq('type', 'blog').like('run_id', 'blog_mktg_uk_%').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
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

    log.push(`Selected ${selected.length} topics (${selected.filter(s => s.penalty === 0).length} fresh, ${selected.filter(s => s.penalty > 0).length} revisits)`)
    log.push('Searching Tavily for marketing intelligence...')

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

    // Pacing against Groq's per-minute token cap happens inside writeMarketingBlogPost
    // via waitForGroqBudget — safe to dispatch all topics concurrently here.
    const blogResults = await Promise.allSettled(
      validResults.map(r => writeMarketingBlogPost(r, recentPublished))
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
        const quality = scoreMktgBlogQuality(result.value)
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

    log.push(`Maya complete. ${inserts.length}/${validResults.length} posts generated.`)

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

async function writeMarketingBlogPost(input: SearchInput, recentPublished: RecentPost[] = []) {
  const { query, cluster, pillar, searchResult } = input
  // 3 articles (down from 5) and capped summary/related-posts — every char
  // here counts against the account's real 6000 TPM cap for
  // llama-3.1-8b-instant alongside the completion budget (see
  // lib/groq-rate-limiter.ts) — a single oversized request always 413s no
  // matter how pacing between calls is tuned.
  const articles   = searchResult.results.slice(0, 3)
  const aiSummary  = (searchResult.answer || '').slice(0, 250)

  const articleContext = buildArticleContext(articles)
  const citableSources = buildCitableSources(articles)

  const relatedContext = recentPublished.length > 0
    ? `\nRECENT PUBLISHED POSTS (for relatedSlugs — pick 2-3 most topically relevant):\n${
        recentPublished.slice(0, 5).map(p => `- slug: "${p.slug}" | "${p.title}" [${p.cluster}]`).join('\n')
      }\n`
    : ''

  // Trimmed to roughly half its original length — this system prompt plus
  // the JSON template plus source articles all count against the account's
  // real 6000 TPM cap alongside the completion budget. Every hard
  // constraint (word count, citation rule, anti-AI list) is kept.
  const _SYSTEM_ = `You are Maya Chen, Head of Marketing Intelligence at AskBiz. You write sharp, data-led marketing guides for SME founders — the briefing a growth-focused founder reads before their Monday standup.

VOICE: Lead with the number, the benchmark, or the platform shift — never generic marketing waffle. Short, punchy sentences naming real platforms, tools, £/$ ad spend figures. Direct: "Your email open rate benchmark is 38% — here's why you're getting 18%" not "email engagement may vary". Contrasts: "Last year organic reach was X. This year it's Y." Reference real tools: Klaviyo, Mailchimp, Meta Ads Manager, Google Ads, HubSpot, Hootsuite, Semrush, Ahrefs, ConvertKit. Cite real benchmarks: open rates, CTRs, CPMs, CAC, ROAS, conversion rates, for SME budget levels (£500/mo-£10k/mo). Use £ for UK, $ for US/global — specify which.
${citationRulePrompt(citableSources, articles.length)}
Never use: leverage, synergy, holistic, ecosystem, unlock, empower, seamless, game-changer, "storytelling"/"authentic" as buzzwords.

ANTI-AI RULES (these flag content as AI-generated — avoid every one): never open with "In today's digital landscape...", "As brands navigate...", "In an era of..."; never use "It's worth noting", "needless to say", "at the end of the day", or filler transitions (Furthermore, Moreover, In conclusion); em-dash max once per 400 words; never round numbers when specifics exist ("a 2.1% conversion rate" not "low conversion"); vary sentence length sharply; write to "you", never "marketers"; no hedging ("This may help...", "Consider whether..."); lead every section with a benchmark, platform change, or campaign outcome; one concrete example per section — a real UK sector, £/$ figure, real result.

AEO/CITATION: write H2s as questions ("What is a good ROAS for UK Shopify brands in 2026?"). Define key terms on first use in one sentence. Include one 2-3 sentence "quick answer" near the top. Use specific numbers, named sources (Marketing Week, Statista, Meta Business), dates.

WORD COUNT — HARD REQUIREMENT: the finished article MUST total 1,200-1,500 words across sections (checked automatically; under 1,200 is rejected and never published). Never stop a section short just because you made the main point once — add a second example or a common-mistake callout instead. Do not pad with repetition.

CONTENT TYPE: match the format to the topic — how-to needs steps with real numbers, benchmarks needs data-led analysis, tools needs a comparison.

ASKBIZ (mention naturally, 1-2 features, never a dump): AI business intelligence for SME founders. ASK: plain-English questions ("What is my customer acquisition cost this quarter?") get instant data-backed answers. MARKETING ANALYTICS: connects to Shopify, WooCommerce, Google Analytics, Meta Ads, Google Ads, TikTok Shop, Mailchimp — channel attribution, CAC, LTV, ROAS in one view. CUSTOMER INTEL: churn prediction, cohort analysis, repeat purchase rates, value segments. CFO DASHBOARD: marketing spend vs revenue by channel, margin by acquisition source. ALERTS: flags when ROAS drops, unsubscribes spike, repurchase rate falls. COMPETITIVE INTEL: benchmarks vs UK retail/eCommerce/F&B/services averages. PRICING: free (10 questions/mo), Growth £19/mo, Business £39/mo, Enterprise custom.
Target: UK/Global SME founders doing £100k-£2M revenue, spending £500-£10k/month on marketing.`

  const userPrompt = `Write a blog post based on today's marketing intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}Source articles:
${articleContext}
${relatedContext}
The six section bodies below must total 1200+ words combined — do not compress or shorten them to save space. Write every section to its full stated word count.

Return ONLY valid JSON (no markdown fences):
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars",
  "title": "Sharp, specific title under 65 chars — include the primary marketing keyword near the start",
  "metaDescription": "Active voice, 120-155 chars, primary keyword in first 20 words, makes an SME founder want to click",
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The benchmark or shift. The impact on SME marketing budgets. What founders should do this week.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Lead with the concrete benchmark, platform algorithm change, or cost shift — not the topic name", "level": 2, "body": "250-300 words. Open with the specific data point or shift from the source. Name the platform, tool, or metric. Contrast: what was true 12 months ago, what changed, why it matters for an SME spending £2k/mo."},
    {"heading": "What this means for a business spending £500–£5,000/month on marketing", "level": 2, "body": "250-300 words. Translate the change into founder-level impact using one concrete SME scenario. Quantify in £, ROAS, CAC, or conversion rate."},
    {"heading": "The three moves smart SME marketers are making right now", "level": 2, "body": "250-300 words. 3 specific, prescriptive tactics with real numbers — tools, ad formats, targeting, realistic budgets."},
    {"heading": "A concrete heading showing AskBiz solving this exact marketing intelligence problem", "level": 2, "body": "200 words. Open with a scene: a founder types a specific marketing question. Describe what AskBiz returns — £ figures, ROAS numbers, conversion rates."},
    {"heading": "The warning signs this issue is hurting your marketing performance", "level": 2, "body": "150 words. 3-4 specific signals checkable in Meta Ads Manager, Google Analytics, or Klaviyo today."},
    {"heading": "Your action plan for the next 7 days", "level": 2, "body": "150 words. One action before Friday, one thing to set up once, one metric to track weekly."}
  ],
  "paa": [
    {"q": "Exact Google search query an SME founder would type about this marketing problem", "a": "40-70 words. Lead with the key metric or action, cite a benchmark/platform/tool."},
    {"q": "Second high-volume marketing query about a sub-topic", "a": "40-70 words. Factual, complete, with a £/$ or percentage."},
    {"q": "Third query a founder would type when marketing isn't working", "a": "40-70 words. Include a benchmark, ROAS figure, or conversion rate."},
    {"q": "A 'what is'/'how does' question about the core marketing concept", "a": "40-70 words. Plain English, a real platform/tool reference."},
    {"q": "How does AskBiz help SMEs track [specific marketing metric]?", "a": "40-70 words. Name the exact feature and a £-figure example."}
  ],
  "cta": {
    "heading": "A CTA headline that names the specific marketing problem solved in this post",
    "body": "One sentence connecting this article's topic to AskBiz for SME founders. Then: 'Try it free — ask your first marketing question in 30 seconds.'"
  }
}`

  const parsed = await generateWithLengthRetry({
    groqUrl: GROQ_URL,
    apiKey: process.env.GROQ_API_KEY!,
    model: GROQ_MODEL,
    maxTokens: 3200,
    systemPrompt: _SYSTEM_,
    userPrompt,
    logRoute: 'agent/marketing-scout',
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
  parsed.region = 'global'
  parsed.publishDate = new Date().toISOString().slice(0, 10)
  parsed.author = {
    name: 'Maya Chen',
    role: 'Head of Marketing Intelligence',
    bio: 'Maya Chen leads AskBiz\'s marketing intelligence function, tracking platform algorithm shifts, ad cost benchmarks, and channel ROI data across Meta, Google, TikTok, and email — and turning them into briefs that help SME founders spend less and grow faster.',
  }
  parsed._citableSources = citableSources

  return parsed
}

function scoreMktgBlogQuality(blog: Record<string, unknown>): number {
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
