// ============================================================
// Export Market Intelligence — Chat Bar Integration
// Detects export market queries and returns structured results
// with a deep-link redirect to the Intelligence page
// ============================================================

// ── Intent detection ──────────────────────────────────────────
const EXPORT_PATTERNS = [
  /export (to|market|markets|opportunit)/i,
  /sell (abroad|overseas|internationally|in [a-z]+)/i,
  /which (market|country|countries|region)/i,
  /best market(s)? for/i,
  /expand (to|into|overseas|internationally)/i,
  /international (market|expansion|sales)/i,
  /overseas (market|opportunit|expansion)/i,
  /duty (rate|for|on)/i,
  /import duty/i,
  /ship(ping)? to [a-z]+/i,
  /sell in [a-z]+/i,
  /market in [a-z]+/i,
  /africa|nigeria|kenya|ghana|egypt/i,
  /gulf|uae|dubai|saudi/i,
  /germany|france|netherlands|europe/i,
  /united states|usa|america/i,
  /australia|canada|japan|india|singapore/i,
  /ecommerce (in|market|growth)/i,
  /amazon\.(de|fr|co\.jp|com\.au|ca)/i,
  /logistics (to|cost|for)/i,
  /distribution (in|to|channel)/i,
]

export function detectExportIntent(text: string): boolean {
  return EXPORT_PATTERNS.some(p => p.test(text))
}

// ── Market database (shared with component) ───────────────────
export const EXPORT_MARKETS = [
  { id: 'us',  name: 'United States',  flag: '🇺🇸', region: 'North America', tier: 1, ecommerce_growth: 14, uk_brand_premium: 12, logistics_score: 88, duty_environment: 'favourable',      currency: 'USD', hot_categories: ['fashion','beauty','health','food_beverage','homeware','luxury','tech_accessories'] },
  { id: 'de',  name: 'Germany',         flag: '🇩🇪', region: 'EU',            tier: 1, ecommerce_growth: 11, uk_brand_premium: 15, logistics_score: 94, duty_environment: 'post_brexit',    currency: 'EUR', hot_categories: ['fashion','homeware','health','beauty','food_beverage','tech_accessories','sports'] },
  { id: 'fr',  name: 'France',          flag: '🇫🇷', region: 'EU',            tier: 1, ecommerce_growth: 13, uk_brand_premium: 18, logistics_score: 92, duty_environment: 'post_brexit',    currency: 'EUR', hot_categories: ['fashion','beauty','luxury','food_beverage','homeware','health'] },
  { id: 'nl',  name: 'Netherlands',     flag: '🇳🇱', region: 'EU',            tier: 1, ecommerce_growth: 15, uk_brand_premium: 14, logistics_score: 97, duty_environment: 'post_brexit',    currency: 'EUR', hot_categories: ['fashion','homeware','health','tech_accessories','food_beverage','beauty'] },
  { id: 'au',  name: 'Australia',       flag: '🇦🇺', region: 'Asia Pacific',  tier: 1, ecommerce_growth: 16, uk_brand_premium: 20, logistics_score: 78, duty_environment: 'favourable',    currency: 'AUD', hot_categories: ['fashion','beauty','health','homeware','food_beverage','sports','luxury'] },
  { id: 'ca',  name: 'Canada',          flag: '🇨🇦', region: 'North America', tier: 1, ecommerce_growth: 15, uk_brand_premium: 16, logistics_score: 85, duty_environment: 'favourable',    currency: 'CAD', hot_categories: ['fashion','beauty','health','food_beverage','homeware','sports'] },
  { id: 'jp',  name: 'Japan',           flag: '🇯🇵', region: 'Asia',          tier: 2, ecommerce_growth: 10, uk_brand_premium: 30, logistics_score: 90, duty_environment: 'favourable',    currency: 'JPY', hot_categories: ['fashion','beauty','luxury','food_beverage','health','homeware'] },
  { id: 'kr',  name: 'South Korea',     flag: '🇰🇷', region: 'Asia',          tier: 2, ecommerce_growth: 18, uk_brand_premium: 22, logistics_score: 88, duty_environment: 'favourable',    currency: 'KRW', hot_categories: ['beauty','fashion','health','food_beverage','luxury','tech_accessories'] },
  { id: 'in',  name: 'India',           flag: '🇮🇳', region: 'Asia',          tier: 2, ecommerce_growth: 35, uk_brand_premium: 25, logistics_score: 70, duty_environment: 'complex',       currency: 'INR', hot_categories: ['fashion','beauty','health','tech_accessories','food_beverage'] },
  { id: 'sg',  name: 'Singapore',       flag: '🇸🇬', region: 'Asia',          tier: 2, ecommerce_growth: 22, uk_brand_premium: 18, logistics_score: 96, duty_environment: 'very_favourable', currency: 'SGD', hot_categories: ['luxury','fashion','beauty','health','food_beverage','tech_accessories'] },
  { id: 'my',  name: 'Malaysia',        flag: '🇲🇾', region: 'Asia',          tier: 2, ecommerce_growth: 28, uk_brand_premium: 20, logistics_score: 78, duty_environment: 'favourable',    currency: 'MYR', hot_categories: ['fashion','beauty','health','food_beverage','tech_accessories','homeware'] },
  { id: 'br',  name: 'Brazil',          flag: '🇧🇷', region: 'Latin America', tier: 2, ecommerce_growth: 26, uk_brand_premium: 22, logistics_score: 60, duty_environment: 'complex',       currency: 'BRL', hot_categories: ['fashion','beauty','health','tech_accessories','food_beverage'] },
  { id: 'ae',  name: 'UAE',             flag: '🇦🇪', region: 'Middle East',   tier: 3, ecommerce_growth: 31, uk_brand_premium: 18, logistics_score: 92, duty_environment: 'very_favourable', currency: 'AED', hot_categories: ['luxury','fashion','beauty','food_beverage','health','homeware'] },
  { id: 'sa',  name: 'Saudi Arabia',    flag: '🇸🇦', region: 'Middle East',   tier: 3, ecommerce_growth: 45, uk_brand_premium: 20, logistics_score: 85, duty_environment: 'favourable',    currency: 'SAR', hot_categories: ['fashion','beauty','health','food_beverage','tech_accessories','luxury'] },
  { id: 'ng',  name: 'Nigeria',         flag: '🇳🇬', region: 'Africa',        tier: 3, ecommerce_growth: 38, uk_brand_premium: 25, logistics_score: 62, duty_environment: 'moderate',      currency: 'NGN', hot_categories: ['beauty','food_beverage','fashion','health','tech_accessories'] },
  { id: 'za',  name: 'South Africa',    flag: '🇿🇦', region: 'Africa',        tier: 3, ecommerce_growth: 29, uk_brand_premium: 15, logistics_score: 82, duty_environment: 'moderate',      currency: 'ZAR', hot_categories: ['fashion','beauty','homeware','food_beverage','health'] },
  { id: 'ke',  name: 'Kenya',           flag: '🇰🇪', region: 'Africa',        tier: 3, ecommerce_growth: 42, uk_brand_premium: 22, logistics_score: 74, duty_environment: 'moderate',      currency: 'KES', hot_categories: ['health','beauty','food_beverage','fashion','tech_accessories'] },
  { id: 'gh',  name: 'Ghana',           flag: '🇬🇭', region: 'Africa',        tier: 3, ecommerce_growth: 35, uk_brand_premium: 28, logistics_score: 78, duty_environment: 'favourable',    currency: 'GHS', hot_categories: ['beauty','fashion','food_beverage','health','homeware'] },
  { id: 'eg',  name: 'Egypt',           flag: '🇪🇬', region: 'Africa',        tier: 3, ecommerce_growth: 52, uk_brand_premium: 20, logistics_score: 70, duty_environment: 'moderate',      currency: 'EGP', hot_categories: ['fashion','beauty','health','food_beverage','tech_accessories'] },
  { id: 'mx',  name: 'Mexico',          flag: '🇲🇽', region: 'Latin America', tier: 3, ecommerce_growth: 32, uk_brand_premium: 18, logistics_score: 72, duty_environment: 'moderate',      currency: 'MXN', hot_categories: ['fashion','beauty','health','food_beverage','tech_accessories','homeware'] },
]

// ── Parse natural language query for filters ──────────────────
export function parseExportQuery(text: string): {
  regions: string[]
  categories: string[]
  preference: 'growth' | 'duty' | 'logistics' | 'premium' | 'score'
  specificMarkets: string[]
} {
  const t = text.toLowerCase()

  // Regions mentioned
  const regions: string[] = []
  if (/\beu\b|europe|european/.test(t)) regions.push('EU')
  if (/\basia\b|asian/.test(t)) regions.push('Asia', 'Asia Pacific')
  if (/\bafrica\b|african/.test(t)) regions.push('Africa')
  if (/\bmiddle east\b|gulf|mena/.test(t)) regions.push('Middle East')
  if (/north america|usa|america\b/.test(t)) regions.push('North America')
  if (/latin america|south america/.test(t)) regions.push('Latin America')

  // Specific markets mentioned
  const marketNames = EXPORT_MARKETS.map(m => m.name.toLowerCase())
  const specificMarkets = EXPORT_MARKETS
    .filter(m => t.includes(m.name.toLowerCase()) || t.includes(m.id))
    .map(m => m.id)

  // Categories mentioned
  const categories: string[] = []
  const catKeywords: Record<string, string[]> = {
    fashion:      ['fashion', 'clothing', 'apparel', 'clothes', 'footwear'],
    beauty:       ['beauty', 'skincare', 'cosmetics', 'makeup'],
    health:       ['health', 'supplements', 'wellness', 'vitamins'],
    food_beverage:['food', 'drink', 'beverage', 'grocery', 'fmcg'],
    luxury:       ['luxury', 'premium', 'high-end'],
    tech_accessories: ['tech', 'electronics', 'accessories', 'gadgets'],
    homeware:     ['home', 'homeware', 'furniture', 'kitchen'],
    sports:       ['sports', 'outdoor', 'fitness'],
  }
  for (const [cat, kws] of Object.entries(catKeywords)) {
    if (kws.some(k => t.includes(k))) categories.push(cat)
  }

  // What are they optimising for?
  let preference: 'growth' | 'duty' | 'logistics' | 'premium' | 'score' = 'score'
  if (/low(est)? duty|no duty|duty free|tariff/.test(t)) preference = 'duty'
  else if (/fast(est)?|quick|logistics|shipping/.test(t)) preference = 'logistics'
  else if (/grow(ing|th)|fastest|emerging/.test(t)) preference = 'growth'
  else if (/premium|brand|recognition/.test(t)) preference = 'premium'

  return { regions, categories, preference, specificMarkets }
}

// ── Score a market for a specific query ───────────────────────
export function scoreForQuery(
  market: typeof EXPORT_MARKETS[0],
  query: ReturnType<typeof parseExportQuery>,
  productLines: Array<{ category: string }> = []
): number {
  let score = 0

  // Base score components
  const dutyScore = { very_favourable: 100, favourable: 80, post_brexit: 65, moderate: 45, complex: 20 }[market.duty_environment] || 50
  const growthScore = Math.min((market.ecommerce_growth / 55) * 100, 100)
  const logisticsScore = market.logistics_score
  const premiumScore = Math.min((market.uk_brand_premium / 35) * 100, 100)

  // Weight based on what they're optimising for
  if (query.preference === 'duty')      score = dutyScore * 0.7 + logisticsScore * 0.2 + growthScore * 0.1
  else if (query.preference === 'logistics') score = logisticsScore * 0.7 + dutyScore * 0.2 + growthScore * 0.1
  else if (query.preference === 'growth')   score = growthScore * 0.7 + logisticsScore * 0.15 + dutyScore * 0.15
  else if (query.preference === 'premium')  score = premiumScore * 0.6 + logisticsScore * 0.2 + dutyScore * 0.2
  else score = (dutyScore + growthScore + logisticsScore + premiumScore) / 4

  // Category match boost
  if (query.categories.length > 0) {
    const matchCount = query.categories.filter(c => market.hot_categories.includes(c)).length
    const matchBoost = (matchCount / query.categories.length) * 20
    score += matchBoost
  }

  return Math.min(Math.round(score), 100)
}

// ── Build AIResult for chat bar ───────────────────────────────
export function buildExportMarketsResult(
  questionText: string,
  productLines: Array<{ category: string; product_name: string; avg_gross_margin: number }> = []
) {
  const query = parseExportQuery(questionText)

  // Filter and score markets
  let markets = EXPORT_MARKETS

  // Filter by region if specified
  if (query.regions.length > 0) {
    markets = markets.filter(m => query.regions.some(r => m.region.includes(r)))
  }

  // Filter to specific markets if named
  if (query.specificMarkets.length > 0) {
    const specificSet = new Set(query.specificMarkets)
    const specific = markets.filter(m => specificSet.has(m.id))
    if (specific.length > 0) markets = specific
  }

  // Score each market for this query
  const scored = markets
    .map(m => ({ ...m, queryScore: scoreForQuery(m, query, productLines) }))
    .sort((a, b) => b.queryScore - a.queryScore)
    .slice(0, 5)

  const top = scored[0]
  const hasRegionFilter = query.regions.length > 0
  const hasCategoryFilter = query.categories.length > 0

  // Build answer text
  const filterDesc = [
    hasRegionFilter ? query.regions.join('/') : null,
    hasCategoryFilter ? query.categories.join('/') : null,
    query.preference !== 'score' ? `ranked by ${query.preference}` : null,
  ].filter(Boolean).join(', ')

  const answer_text = `Here are your top export market opportunities${filterDesc ? ` for ${filterDesc}` : ''}, scored for UK SMEs. ${top ? `${top.flag} ${top.name} ranks highest${query.preference === 'duty' ? ' for low import duty' : query.preference === 'logistics' ? ' for logistics accessibility' : query.preference === 'growth' ? ' for ecommerce growth' : ''} — ${top.ecommerce_growth}% ecommerce growth, ${top.uk_brand_premium}% UK brand premium, ${top.duty_environment.replace(/_/g, ' ')} duty environment.` : ''} Open the Export Markets tool to explore all 20 markets in detail with per-product margin estimates.`

  const kpi_cards = [
    { label: 'Markets analysed', value: String(markets.length), trend: 'neutral' as const },
    { label: 'Top market', value: top ? `${top.flag} ${top.name}` : '—', trend: 'up' as const, status: 'good' as const },
    { label: 'Best growth', value: `+${Math.max(...scored.map(m => m.ecommerce_growth))}%`, trend: 'up' as const },
    { label: 'Lowest duty', value: scored.find(m => m.duty_environment === 'very_favourable')?.name || scored[0]?.name || '—', trend: 'up' as const, status: 'good' as const },
  ]

  const table_headers = ['Market', 'Region', 'Growth', 'UK Premium', 'Duty', 'Score']
  const table_rows = scored.map(m => [
    `${m.flag} ${m.name}`,
    m.region,
    `+${m.ecommerce_growth}%`,
    `+${m.uk_brand_premium}%`,
    m.duty_environment.replace(/_/g, ' '),
    `${m.queryScore}/100`,
  ])

  const recommendations = [
    top ? `Start with ${top.name} — ${top.duty_environment === 'very_favourable' || top.duty_environment === 'favourable' ? 'favourable duty environment and ' : ''}strong UK brand recognition` : null,
    scored.some(m => m.duty_environment === 'post_brexit') ? 'EU markets require EORI number and customs declarations post-Brexit — factor this into your entry timeline' : null,
    hasCategoryFilter ? `Your ${query.categories[0]} products have strong category demand in ${scored.filter(m => m.hot_categories.includes(query.categories[0])).map(m => m.name).slice(0, 2).join(' and ')}` : null,
    'Open the Export Markets tool to see per-product export margin estimates and entry route details for each market',
  ].filter(Boolean) as string[]

  const follow_up_suggestions = [
    top ? `Tell me more about exporting to ${top.name} — what are the first practical steps?` : null,
    'Which of these markets has the lowest import duty for my products?',
    'Compare logistics costs to Germany vs USA for my business',
    'What do I need to know about post-Brexit EU exports?',
  ].filter(Boolean) as string[]

  return {
    insight_header: `Top export markets${filterDesc ? ` — ${filterDesc}` : ''}`,
    answer_text,
    confidence: 'high' as const,
    verdict: 'act' as const,
    verdict_sentence: top ? `${top.name} is your strongest export opportunity — open the tool to see your product-specific margins.` : 'Review these markets in the Export Markets tool for detailed per-product analysis.',
    chart_type: 'bar' as const,
    chart_labels: scored.map(m => m.name),
    chart_values: scored.map(m => m.queryScore),
    chart_label: 'Export market opportunity score',
    kpi_cards,
    table_headers,
    table_rows,
    recommendations,
    follow_up_suggestions,
    scope_violation: false,
    // Deep link to Intelligence page export tab
    action_buttons: [
      { label: '🌍 Open Export Markets tool →', query: '__navigate:/intelligence?tab=export' },
      top ? { label: `Deep dive: ${top.name}`, query: `Tell me everything I need to know about exporting to ${top.name} as a UK SME` } : null,
    ].filter(Boolean) as Array<{ label: string; query: string }>,
  }
}
