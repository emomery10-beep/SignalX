import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { tavilySearch } from '@/lib/tavily'

export const dynamic = 'force-dynamic'

const PLAN_TIERS: Record<string, number> = { free: 0, growth: 1, business: 2, enterprise: 3 }
const tier = (plan: string) => PLAN_TIERS[plan] ?? 0

function serviceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, market_intelligence_opt_in')
    .eq('id', user.id)
    .single()

  const plan      = profile?.plan || 'free'
  const userTier  = tier(plan)

  if (userTier < 1) {
    return NextResponse.json({
      locked: true,
      message: 'Market Intelligence is available on Growth and above.',
      upgrade_url: '/billing',
    })
  }

  const { searchParams } = new URL(req.url)
  const query    = searchParams.get('q')?.trim() || ''
  const region   = searchParams.get('region') || ''
  const channel  = searchParams.get('channel') || ''

  if (!query) return NextResponse.json({ error: 'q is required' }, { status: 400 })

  const service = serviceClient()

  // ── 1. Internal catalogue search ─────────────────────────────
  let catalogueQuery = service
    .from('global_product_catalogue')
    .select('*')
    .ilike('product_name', `%${query}%`)
    .order('merchant_count', { ascending: false })
    .limit(20)

  if (region)  catalogueQuery = catalogueQuery.ilike('region', `%${region}%`)
  if (channel) catalogueQuery = catalogueQuery.eq('channel', channel)

  // Business+ gets full channel breakdown; Growth gets aggregated only
  if (userTier < 2) {
    catalogueQuery = catalogueQuery.limit(5)
  }

  const { data: catalogue } = await catalogueQuery

  // ── 2. Route intelligence (Business+ only) ───────────────────
  let routes = null
  if (userTier >= 2 && region) {
    const { data: routeData } = await service
      .from('global_route_intelligence')
      .select('*')
      .or(`destination_country.ilike.%${region}%,origin_country.ilike.%${region}%`)
      .order('merchant_count', { ascending: false })
      .limit(10)
    routes = routeData
  }

  // ── 3. Tavily web layer — fires when data is thin or always for trends ──
  const isThin     = !catalogue?.length || catalogue.length < 3
  const needsTavily = isThin || userTier >= 2

  let webInsights = null
  if (needsTavily) {
    const tavilyQuery = region
      ? `${query} selling price market ${region} 2025 2026`
      : `${query} retail price market trend 2025 2026`

    const [priceSearch, newsSearch] = await Promise.all([
      tavilySearch(tavilyQuery, { searchDepth: 'basic', maxResults: 3, includeAnswer: true }),
      tavilySearch(`${query} market news demand trend`, {
        topic: 'news', days: 30, maxResults: 3, includeAnswer: false,
      }),
    ])

    webInsights = {
      price_summary: priceSearch?.answer || null,
      price_sources: priceSearch?.results?.map(r => ({ title: r.title, url: r.url, snippet: r.content.slice(0, 150) })) || [],
      news: newsSearch?.results?.map(r => ({ title: r.title, url: r.url, date: r.published_date })) || [],
    }
  }

  // ── 4. Log the search (non-blocking) ─────────────────────────
  Promise.resolve(service.from('market_intelligence_searches').insert({
    user_id:       user.id,
    query,
    product_name:  query,
    region:        region || null,
    results_count: catalogue?.length || 0,
    tavily_fired:  needsTavily,
  })).catch(() => {})

  return NextResponse.json({
    query,
    region:    region || null,
    channel:   channel || null,
    plan,
    catalogue: catalogue || [],
    routes,
    web:       webInsights,
    data_thin: isThin,
  })
}
