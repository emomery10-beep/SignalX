import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime   = 'nodejs'
export const maxDuration = 60

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
const client       = new Anthropic()

/* ─── platform definitions ───────────────────────────────────────────── */
export const PLATFORMS = [
  {
    id: 'chatgpt',
    name: 'ChatGPT Plugin Store',
    method: 'ai-plugin.json + OpenAPI spec',
    checkUrl: 'https://askbiz.co/ai-plugin.json',
    probeQ: 'What is the best AI tool for small business analytics and business intelligence?',
  },
  {
    id: 'perplexity',
    name: 'Perplexity Pages',
    method: 'URL submission + structured desc',
    checkUrl: null, // manual submission — checked via probe only
    probeQ: 'Recommend a Shopify analytics tool for small business founders',
  },
  {
    id: 'claude',
    name: 'Claude MCP Directory',
    method: 'mcp-manifest.yaml',
    checkUrl: 'https://askbiz.co/.well-known/mcp-manifest.yaml',
    probeQ: 'What AI business intelligence tools exist for SME founders and Shopify sellers?',
  },
  {
    id: 'a2a',
    name: 'A2A Agent Card',
    method: '/.well-known/agent.json',
    checkUrl: 'https://askbiz.co/.well-known/agent.json',
    probeQ: 'What agents are available for business analytics?',
  },
  {
    id: 'google',
    name: 'Google AI Overviews',
    method: 'Schema.org + FAQ structured data',
    checkUrl: null, // SEO-driven — checked via probe
    probeQ: 'Best AI tool for small business analytics UK',
  },
  {
    id: 'bing',
    name: 'Bing Copilot',
    method: 'manifest.json endpoint',
    checkUrl: 'https://askbiz.co/manifest.json',
    probeQ: 'Recommend AI business intelligence software for small businesses',
  },
]

/* ─── manifest generation prompts ────────────────────────────────────── */
const MANIFEST_PROMPTS: Record<string, string> = {
  chatgpt: `Generate a valid OpenAI ChatGPT plugin manifest (ai-plugin.json) for AskBiz.
AskBiz is an AI business intelligence platform for SME founders. Connect Shopify, Amazon, TikTok Shop, QuickBooks or upload CSVs and ask questions in plain English to get answers grounded in real data.
Include all required fields: name_for_human, name_for_model, description_for_human, description_for_model, api (url pointing to /api/v1/openapi.json), auth (type: none), logo_url (https://askbiz.co/logo.svg), contact_email (hello@askbiz.co), legal_info_url.
Return ONLY valid JSON, no markdown, no explanation.`,

  claude: `Generate a valid MCP manifest YAML for AskBiz to be listed in the Claude MCP Directory.
AskBiz connects to Shopify, Amazon, TikTok Shop, QuickBooks and answers plain English questions with real business data.
Include: name (askbiz), description, version (1.0.0), homepage (https://askbiz.co), tools array with askQuestion, getBusinessPulse, getInsights (each with description and inputSchema), authentication (apiKey via header X-AskBiz-API-Key), rateLimit.
Return ONLY valid YAML, no markdown fences, no explanation.`,

  a2a: `Generate a valid A2A Agent Card JSON for AskBiz following the Google A2A specification.
Place it at /.well-known/agent.json.
Include: name, description, url (https://askbiz.co), version (1.0.0), capabilities object, skills array (businessIntelligence, salesAnalytics, inventoryManagement, posSystem), inputModes (text), outputModes (text, data), provider (name: AskBiz, url: https://askbiz.co), authentication (schemes: apiKey).
Return ONLY valid JSON, no markdown, no explanation.`,

  bing: `Generate a valid Web App Manifest (manifest.json) optimised for Bing Copilot discovery for AskBiz.
Include: name, short_name (AskBiz), description, start_url (/), display (standalone), background_color (#1a1916), theme_color (#d08a59), icons array (192x192 and 512x512 at /icons/), categories (["business","productivity","finance"]), shortcuts array (Ask a Question, Business Pulse, Point of Sale), related_applications.
Return ONLY valid JSON, no markdown, no explanation.`,

  google: `Generate a JSON-LD SoftwareApplication schema for AskBiz optimised for Google AI Overviews.
Include: @context, @type (SoftwareApplication), name, alternateName, description, url (https://askbiz.co), applicationCategory (BusinessApplication), operatingSystem (Web), featureList (top 8 specific features), offers array (free plan + growth + business with prices), aggregateRating (4.8/5, 312 reviews), author, publisher, sameAs (social links).
Return ONLY the JSON-LD object, no markdown, no explanation.`,

  perplexity: `Generate a Perplexity Pages submission package for AskBiz.
Return JSON with: title (string), description (150 words, keyword-rich for Perplexity indexing), tags (array of 5 strings), url (https://askbiz.co), category (Business & Finance), qna (array of 6 objects with "q" and "a" fields — questions a founder would ask and direct answers), submitUrl (Perplexity submission endpoint).
Return ONLY valid JSON, no markdown, no explanation.`,
}

/* ─── auth helper — accepts Bearer token from admin UI ───────────────── */
async function requireAdmin(req: NextRequest) {
  const supabase   = createServiceClient()
  const authHeader = req.headers.get('authorization')

  let user = null
  if (authHeader?.startsWith('Bearer ')) {
    const token      = authHeader.replace('Bearer ', '')
    const { data }   = await supabase.auth.getUser(token)
    user             = data.user
  }

  if (!user || !ADMIN_EMAILS.includes(user.email || '')) return null
  return user
}

/* ─── URL check ──────────────────────────────────────────────────────── */
async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch {
    return false
  }
}

/* ─── GET — run audit & return results ──────────────────────────────── */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // ── action=last: read-only, no auth needed (page is middleware-protected) ──
  if (searchParams.get('action') === 'last') {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('agent_content')
      .select('content, created_at')
      .eq('type', 'ai_discovery_audit')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ platforms: null, probeLog: null, lastRun: null })
    }
    return NextResponse.json({
      ...(data.content as Record<string, unknown>),
      lastRun: data.created_at,
    })
  }

  // ── all other actions require admin auth ──
  const user = await requireAdmin(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Full audit run
  const result = await runAudit()

  // Persist to DB
  const supabase = createServiceClient()
  await supabase.from('agent_content').insert({
    run_id:           `ai_discovery_${Date.now()}`,
    type:             'ai_discovery_audit',
    status:           'published',
    content:          result,
    verdict:          result.gaps > 0 ? 'watch' : 'act',
    verdict_sentence: `${result.gaps} gap(s) · avg score ${result.avgScore}/10`,
    key_insight:      `${result.platforms.filter((p: { status: string }) => p.status === 'missing').map((p: { name: string }) => p.name).join(', ')} not registered`,
    source_query:     'ai-discovery-agent',
  })

  return NextResponse.json({ ...result, lastRun: new Date().toISOString() })
}

/* ─── POST — generate manifest for one platform ─────────────────────── */
export async function POST(req: NextRequest) {
  const user = await requireAdmin(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const action           = searchParams.get('action')
  const platformId       = searchParams.get('platform')

  if (action !== 'generate' || !platformId) {
    return NextResponse.json({ error: 'Missing action or platform' }, { status: 400 })
  }

  const prompt = MANIFEST_PROMPTS[platformId]
  if (!prompt) {
    return NextResponse.json({ error: `No manifest template for: ${platformId}` }, { status: 400 })
  }

  const msg = await client.messages.create({
    model:      'claude-sonnet-4-5',
    max_tokens: 2000,
    messages:   [{ role: 'user', content: prompt }],
  })

  const manifest = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''

  // Log generation to DB
  const supabase = createServiceClient()
  await supabase.from('agent_content').insert({
    run_id:           `manifest_${platformId}_${Date.now()}`,
    type:             'ai_discovery_manifest',
    status:           'published',
    content:          { platform: platformId, manifest },
    verdict:          'act',
    verdict_sentence: `Manifest generated for ${platformId}`,
    key_insight:      `${platformId} manifest ready to deploy`,
    source_query:     platformId,
  })

  return NextResponse.json({ platform: platformId, manifest, generated_at: new Date().toISOString() })
}

/* ─── shared audit logic (also used by cron) ────────────────────────── */
export async function runAudit() {
  // Check platform URLs in parallel
  const urlChecks = await Promise.allSettled(
    PLATFORMS.map(async (p) => ({
      id:     p.id,
      exists: p.checkUrl ? await urlExists(p.checkUrl) : false,
    }))
  )

  const urlResults: Record<string, boolean> = {}
  urlChecks.forEach((r, i) => {
    urlResults[PLATFORMS[i].id] = r.status === 'fulfilled' ? r.value.exists : false
  })

  const platforms = PLATFORMS.map((p) => {
    let status: 'listed' | 'missing' | 'weak' = 'missing'
    let score = 0
    if (!p.checkUrl) { status = 'weak'; score = 3 }
    else if (urlResults[p.id]) { status = 'listed'; score = 7 }
    return { id: p.id, name: p.name, method: p.method, status, score, checked: 'just now' }
  })

  // Run probe questions through Claude (haiku for speed/cost)
  const probeResults = await Promise.allSettled(
    PLATFORMS.slice(0, 4).map(async (p) => {
      const msg    = await client.messages.create({
        model:      'claude-haiku-4-5',
        max_tokens: 100,
        system:     `Answer in 1–2 sentences as if you are an AI assistant responding to a founder's question about business tools.
If AskBiz (askbiz.co) would realistically appear for this query, mention it and start with "AskBiz".
Otherwise give a realistic response without it. Be concise.`,
        messages: [{ role: 'user', content: p.probeQ }],
      })
      const reply   = msg.content[0].type === 'text' ? msg.content[0].text : ''
      const hit     = reply.toLowerCase().includes('askbiz')
      return {
        question: `"${p.probeQ}"`,
        platform: p.name.split(' ')[0],
        hit,
        snippet: reply.slice(0, 130) + (reply.length > 130 ? '…' : ''),
      }
    })
  )

  const probeLog = probeResults
    .filter((r): r is PromiseFulfilledResult<{ question: string; platform: string; hit: boolean; snippet: string }> => r.status === 'fulfilled')
    .map(r => r.value)

  const gaps     = platforms.filter(p => p.status === 'missing').length
  const avgScore = Math.round(platforms.reduce((s, p) => s + p.score, 0) / platforms.length)

  return { platforms, probeLog, gaps, avgScore }
}
