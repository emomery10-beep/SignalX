import { NextRequest, NextResponse } from 'next/server'
import { tavilySearch } from '@/lib/tavily'
import Anthropic from '@anthropic-ai/sdk'
import { logUsage } from '@/lib/log-usage'

export const runtime     = 'nodejs'
export const maxDuration = 300

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
      return NextResponse.json({ skipped: true, reason: 'already_ran_today', date: today })
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
    const selected = scoredQueries.slice(0, 10)

    log.push(`Selected 10 topics (${selected.filter(s => s.penalty === 0).length} fresh, ${selected.filter(s => s.penalty > 0).length} revisits)`)
    log.push('Searching Tavily for marketing intelligence...')

    const searchResults = await Promise.allSettled(
      selected.map(s =>
        tavilySearch(s.query, {
          searchDepth:   'advanced',
          maxResults:    5,
          includeAnswer: true,
          topic:         'general',
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

        const quality = scoreMktgBlogQuality(result.value)
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

  const res = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 5000,
    system: `You are Maya Chen, Head of Marketing Intelligence at AskBiz. You write sharp, data-led marketing guides for SME founders — the kind of briefing a growth-focused founder reads before their Monday morning standup. Your style:

VOICE & TONE:
- You write like someone who reads Marketing Week, Search Engine Journal, and Social Media Examiner before breakfast — but translates it for founders, not agencies
- You lead with the number, the benchmark, or the platform shift — never with generic marketing waffle
- You use short, punchy sentences. You name real platforms, real tools, real £/$ ad spend figures.
- You're direct: "Your email open rate benchmark is 38% — here's why you're getting 18%" not "email engagement may vary"
- You use contrasts: "Last year organic reach was X. This year it's Y. Here's what smart SMEs are doing instead."
- You reference real tools: Klaviyo, Mailchimp, Meta Ads Manager, Google Ads, HubSpot, Hootsuite, Buffer, Semrush, Ahrefs, Hotjar, ConvertKit, ActiveCampaign
- You cite real benchmarks: open rates, CTRs, CPMs, CAC, ROAS, conversion rates — with context for SME budget levels (£500/mo–£10k/mo range)
- Currencies: use £ for UK context, $ for US/global benchmarks — specify which
- You NEVER use: "leverage", "synergy", "holistic", "ecosystem", "unlock", "empower", "seamless", "game-changer", "storytelling" (as a buzzword), "authentic" (as a panacea)
- You sound like a sharp colleague who has run paid ads, email campaigns, and SEO for UK SMEs for years — someone who's seen what actually converts

ANTI-AI WRITING RULES (these patterns get content flagged as AI-generated — avoid every single one):
- Never open with: "In today's digital landscape...", "As brands navigate...", "With the rise of social media...", "In an era of..."
- Never use: "It's worth noting", "It's important to remember", "needless to say", "at the end of the day"
- Never use filler transitions: "Furthermore", "Moreover", "Additionally", "In conclusion", "To summarise"
- Em-dash (—) maximum once per 400 words. Em-dash overuse is the single biggest AI tell.
- Never round numbers when specifics exist. "£4,200/month ad spend" beats "thousands of pounds". "A 2.1% conversion rate" beats "low conversion".
- Vary sentence length sharply. Short. Then a longer sentence that carries the benchmark, the data, or the nuance a founder needs. Short again. Never three long sentences in a row.
- Write to "you" not "marketers" or "SME founders" — direct second person throughout
- No hedging: "This may help...", "Consider whether...", "You might want to test..."
- Lead every section with a real benchmark, a named platform change, or a real campaign outcome — not scene-setting prose
- One concrete example per major section: a real UK sector (Shopify fashion brand, local restaurant, B2B SaaS), a real £/$ figure, a real result

AEO / AI CITATION RULES (makes the article citable by ChatGPT, Perplexity, Claude):
- Write H2s as questions: "What is a good ROAS for UK Shopify brands in 2026?", "How do you calculate true CAC when using multiple channels?", "Why does Meta's reported ROAS overstate your real return?"
- Define key terms on first use in one clear sentence — AI engines extract these as direct answers
- Include at least one "quick answer" paragraph near the top that directly answers the core question in 2–3 sentences
- Use specific numbers, named sources (Marketing Week, Statista, Meta Business, Google Ads benchmarks), and dates — vague claims don't get cited

CONTENT TYPE: Match the format to the topic. A "how to" query needs step-by-step sections with real numbers. A benchmarks topic needs data-led analysis. A tools topic needs a practical comparison.

ASKBIZ PRODUCT KNOWLEDGE (use naturally — 1-2 specific features per post, never a feature dump):
AskBiz is an AI business intelligence platform for SME founders. Key capabilities relevant to marketing:
- ASK: Founders type plain-English questions ("Which product has the highest repeat purchase rate?", "What is my customer acquisition cost this quarter?", "Which marketing channel drove the most revenue last month?") and get instant data-backed answers
- MARKETING ANALYTICS: Connects to Shopify, WooCommerce, Google Analytics, Meta Ads, Google Ads, TikTok Shop, Mailchimp — surfaces channel attribution, CAC, LTV, ROAS in one view
- CUSTOMER INTELLIGENCE: Churn prediction, cohort analysis, repeat purchase rates, customer segments by value — answers "who are my best customers and where did they come from?"
- CFO DASHBOARD: Tracks marketing spend vs revenue by channel, gross margin by acquisition source, budget vs actual marketing spend
- PROACTIVE ALERTS: Flags when a channel's ROAS drops below threshold, when email unsubscribes spike, when a product's repurchase rate falls — before the founder notices
- COMPETITIVE INTELLIGENCE: Benchmarks your metrics against industry averages for UK retail, eCommerce, food & beverage, professional services
- PRICING: Free plan (10 questions/month, no card), Growth (£19/mo — 3 months free trial), Business (£39/mo — 3 months free trial), Enterprise (custom)
- COMPETITORS: Unlike Fathom (web analytics only) or Tableau (needs a data team), AskBiz answers plain-English marketing questions with your actual connected data in seconds.

Revenue target: UK/Global SME founders doing £100k–£2M annual revenue, spending £500–£10k/month on marketing.`,

    messages: [{
      role:    'user',
      content: `Write a blog post based on today's marketing intelligence. Research topic: "${query}"

Cluster: "${cluster}" | Pillar: "${pillar}"

${aiSummary ? `Tavily AI summary:\n${aiSummary}\n` : ''}Source articles:
${articleContext}
${relatedContext}
Return ONLY valid JSON (no markdown fences):
{
  "slug": "keyword-rich-kebab-case-slug-under-60-chars",
  "title": "Sharp, specific title under 65 chars — include the primary marketing keyword near the start",
  "metaDescription": "Active voice, 120-155 chars, primary keyword in first 20 words, makes an SME founder want to click",
  "cluster": "${cluster}",
  "pillar": "${pillar}",
  "region": "global",
  "publishDate": "${new Date().toISOString().slice(0, 10)}",
  "readTime": 12,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "tldr": "3 punchy sentences. The benchmark or shift. The impact on SME marketing budgets. What founders should do this week.",
  "relatedSlugs": ["slug-from-recent-published-list-1", "slug-from-recent-published-list-2"],
  "sections": [
    {"heading": "Lead with the concrete benchmark, platform algorithm change, or cost shift — not the topic name", "level": 2, "body": "250-300 words. Open with the specific data point or industry shift from the source. Name the platform, tool, or metric. Set the stakes in the first sentence. Use contrast: what was true 12 months ago, what changed, why it matters now for an SME spending £2k/mo on marketing."},
    {"heading": "What this means for a business spending £500–£5,000/month on marketing", "level": 2, "body": "250-300 words. Translate the platform change or benchmark into founder-level impact. Use a concrete SME scenario — 'a Shopify fashion brand doing £40k/month' or 'a local service business with a £1k/mo Google Ads budget'. Quantify the impact in £, ROAS, CAC, or conversion rate. Reference real tool costs and ad platform mechanics."},
    {"heading": "The three moves smart SME marketers are making right now", "level": 2, "body": "250-300 words. 3 specific, prescriptive tactics with real numbers. Name specific tools, ad formats, targeting options, and realistic budgets. No vague advice — tell them exactly what to test this week and what metric to watch."},
    {"heading": "A concrete heading showing AskBiz solving this exact marketing intelligence problem", "level": 2, "body": "200 words. Open with a scene: a founder types a specific marketing question relevant to this topic — give the exact question text. Describe what AskBiz returns: which feature responds, what the output looks like (include £ figures, ROAS numbers, conversion rates), what decision it enables. Be specific — 'AskBiz shows: your Meta Ads CAC has risen 34% this quarter — email is now 2.1× cheaper per acquisition for your top-selling product.'"},
    {"heading": "The warning signs this issue is hurting your marketing performance", "level": 2, "body": "150 words. 3-4 specific signals in their ad accounts, email reports, or analytics that this problem is real. Things they can check in Meta Ads Manager, Google Analytics, or Klaviyo today."},
    {"heading": "Your action plan for the next 7 days", "level": 2, "body": "150 words. One primary action to take before Friday. One thing to set up once (automation, dashboard, alert). One metric to track weekly. Be prescriptive. Reference specific platform menus, tool settings, or report names where relevant."}
  ],
  "paa": [
    {"q": "Exact Google search query an SME founder would type about this marketing problem", "a": "40-70 word direct answer. Lead with the key metric or action. Cite a specific benchmark, platform, or tool. End with what the best-performing SMEs do."},
    {"q": "Second high-volume marketing query about a sub-topic in this post", "a": "40-70 word direct answer. Factual, complete sentence. Include a specific £/$, percentage, or tool recommendation."},
    {"q": "Third query a founder would type when their marketing isn't working", "a": "40-70 word direct answer. Include a specific benchmark, ROAS figure, or conversion rate for context."},
    {"q": "A 'what is' or 'how does' question about the core marketing concept", "a": "40-70 word direct answer. Plain English definition with a specific SME example — reference a real platform or tool naturally."},
    {"q": "How does AskBiz help SMEs track [specific marketing metric from this post]?", "a": "40-70 words. Name the exact AskBiz feature. Describe what it shows for an SME. Give a specific example with £ figures or percentages."}
  ],
  "cta": {
    "heading": "A CTA headline that names the specific marketing problem solved in this post",
    "body": "One sentence connecting this article's topic to AskBiz for SME founders. Then: 'Try it free — ask your first marketing question in 30 seconds.'"
  },
  "author": {
    "name": "Maya Chen",
    "role": "Head of Marketing Intelligence",
    "bio": "Maya Chen leads AskBiz's marketing intelligence function, tracking platform algorithm shifts, ad cost benchmarks, and channel ROI data across Meta, Google, TikTok, and email — and turning them into briefs that help SME founders spend less and grow faster."
  }
}`,
    }],
  })

  logUsage({ route: 'agent/marketing-scout', model: 'claude-sonnet-4-6', usage: res.usage })
  const raw    = res.content[0].type === 'text' ? res.content[0].text : ''
  const clean  = raw.replace(/```json\n?|```/g, '').trim()
  const parsed = JSON.parse(clean)

  if (!parsed.slug || !parsed.title || !parsed.sections?.length) {
    throw new Error('Invalid blog structure — missing slug, title, or sections')
  }

  parsed.publishDate = new Date().toISOString().slice(0, 10)

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
