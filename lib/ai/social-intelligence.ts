// ============================================================
// Social Commerce Intelligence — Chat Bar Integration
// Detects social commerce queries and returns structured results
// ============================================================

const SOCIAL_PATTERNS = [
  /tiktok|tik tok/i,
  /instagram|ig\b/i,
  /pinterest/i,
  /social (commerce|media|selling|shop)/i,
  /social (revenue|sales|orders)/i,
  /going viral/i,
  /viral (product|post|video)/i,
  /saves? (on|from|spike)/i,
  /demand signal/i,
  /content (convert|performance|analytics)/i,
  /video (performance|analytics|convert)/i,
  /pin (analytics|performance)/i,
  /reels? (performance|convert)/i,
  /influencer (data|performance|roi)/i,
  /creator (performance|data)/i,
  /ugc performance/i,
  /social (conversion|cvr)/i,
  /which (product|content).*(viral|converting|performing)/i,
  /best (performing|converting).*(post|video|pin|reel)/i,
]

export function detectSocialIntent(text: string): boolean {
  return SOCIAL_PATTERNS.some(p => p.test(text))
}

// ── Build AIResult from social data ──────────────────────────
export function buildSocialResult(questionText: string, data: {
  has_data: boolean
  summary: {
    total_views: number; total_saves: number; total_orders: number
    total_revenue: number; overall_conversion_rate: number; avg_save_rate: number
  } | null
  platform_breakdown: Array<{
    platform: string; views: number; saves: number; orders: number
    revenue: number; conversion_rate: number; posts: number
  }>
  top_content: Array<{
    platform: string; product_name: string; views: number
    saves: number; orders: number; revenue: number; viral_score: number
  }>
  demand_signals: Array<{
    platform: string; product_name: string; saves: number; signal: string
  }>
  connected_sources: Array<{ source_type: string; name: string }>
}) {
  const { summary, platform_breakdown, top_content, demand_signals, connected_sources } = data

  // Not connected
  if (!connected_sources?.length) {
    return {
      insight_header: 'Social commerce not connected',
      answer_text: 'You haven\'t connected any social commerce platforms yet. Connect TikTok Shop, Instagram Shopping, or Pinterest from the Sources page and AskBiz will track your conversion rates, demand signals, and which products are going viral.',
      confidence: 'high' as const,
      verdict: 'act' as const,
      verdict_sentence: 'Connect TikTok Shop, Instagram, or Pinterest from Sources to enable social commerce intelligence.',
      chart_type: 'none' as const,
      chart_labels: [], chart_values: [], chart_label: '',
      kpi_cards: [],
      table_headers: [], table_rows: [],
      recommendations: ['Go to Sources and connect TikTok Shop, Instagram Shopping, or Pinterest', 'Token-based connection — paste your access token from the platform dashboard'],
      follow_up_suggestions: ['How do I get my TikTok Shop access token?', 'What social commerce data can AskBiz track?'],
      action_buttons: [{ label: '📱 Connect social platforms →', query: '__navigate:/sources' }],
      scope_violation: false,
    }
  }

  // No data yet
  if (!data.has_data || !summary) {
    return {
      insight_header: 'Social commerce connected — syncing data',
      answer_text: `Your social platforms are connected (${connected_sources.map(s => s.name).join(', ')}). Trigger a sync from the Social Commerce tab to pull in your latest data.`,
      confidence: 'high' as const,
      verdict: 'watch' as const,
      verdict_sentence: 'Sync your social platforms to see conversion rates and demand signals.',
      chart_type: 'none' as const,
      chart_labels: [], chart_values: [], chart_label: '',
      kpi_cards: [],
      table_headers: [], table_rows: [],
      recommendations: ['Open the Social Commerce tab and click Sync now', 'Data will appear within 60 seconds of syncing'],
      follow_up_suggestions: ['Which products are going viral on TikTok?', 'What is my Instagram Shopping conversion rate?'],
      action_buttons: [{ label: '📱 Open Social Commerce →', query: '__navigate:/intelligence?tab=social' }],
      scope_violation: false,
    }
  }

  const topPlatform = platform_breakdown.sort((a, b) => b.revenue - a.revenue)[0]
  const topContent  = top_content[0]
  const topSignal   = demand_signals[0]

  const fmt = (n: number) => n >= 1000 ? (n/1000).toFixed(1)+'K' : String(Math.round(n))

  const answer_text = [
    `Your social commerce across ${platform_breakdown.length} platform${platform_breakdown.length > 1 ? 's' : ''} generated £${summary.total_revenue.toLocaleString()} revenue from ${summary.total_orders} orders in the last 30 days.`,
    topPlatform ? `${topPlatform.platform} is your top channel with ${topPlatform.orders} orders and a ${topPlatform.conversion_rate}% conversion rate.` : '',
    topContent ? `Your best performing content is "${topContent.product_name || 'a recent post'}" with ${fmt(topContent.views)} views and ${fmt(topContent.saves)} saves.` : '',
    topSignal ? `⚡ Demand signal: "${topSignal.product_name}" has ${fmt(topSignal.saves)} saves but no orders yet — strong purchase intent, check your stock.` : '',
  ].filter(Boolean).join(' ')

  const kpi_cards = [
    { label: 'Total views',      value: fmt(summary.total_views),                  trend: 'up' as const },
    { label: 'Total saves',      value: fmt(summary.total_saves),                  trend: 'up' as const },
    { label: 'Social revenue',   value: `£${summary.total_revenue.toLocaleString()}`, trend: 'up' as const, status: 'good' as const },
    { label: 'Conversion rate',  value: `${summary.overall_conversion_rate}%`,     trend: summary.overall_conversion_rate > 2 ? 'up' as const : 'down' as const },
  ]

  const table_headers = ['Platform', 'Views', 'Saves', 'Orders', 'Revenue', 'CVR']
  const table_rows = platform_breakdown.map(p => [
    p.platform,
    fmt(p.views),
    fmt(p.saves),
    String(p.orders),
    `£${p.revenue.toLocaleString()}`,
    `${p.conversion_rate}%`,
  ])

  const recommendations = [
    topSignal ? `Convert ${topSignal.saves} saves on "${topSignal.product_name}" — add a direct buy link to the post, run a limited-time offer, or boost the post` : null,
    topContent && topContent.viral_score > 50 ? `Replicate your viral content formula — "${topContent.product_name}" is working. Create similar content for your other top products` : null,
    summary.overall_conversion_rate < 1 ? `Your overall conversion rate of ${summary.overall_conversion_rate}% is below average. Check that product pages are loading fast and the buy button is prominent` : null,
    'Set a weekly save-rate alert — when any product exceeds 100 saves in a week, AskBiz will flag it so you can act before demand peaks',
  ].filter(Boolean) as string[]

  const follow_up_suggestions = [
    topSignal ? `How do I convert the ${topSignal.saves} saves on "${topSignal.product_name}" into orders?` : null,
    'Which of my products has the highest viral potential for TikTok?',
    'Compare my Instagram vs TikTok Shop conversion rates',
    'What content format converts best for my products?',
  ].filter(Boolean) as string[]

  return {
    insight_header: `Social commerce — £${summary.total_revenue.toLocaleString()} · ${summary.total_orders} orders · ${summary.overall_conversion_rate}% CVR`,
    answer_text,
    confidence: 'high' as const,
    verdict: demand_signals.length > 0 ? 'act' as const : 'watch' as const,
    verdict_sentence: demand_signals.length > 0
      ? `${demand_signals.length} demand signal${demand_signals.length > 1 ? 's' : ''} detected — act now to convert saves into sales.`
      : `Your social commerce is generating £${summary.total_revenue.toLocaleString()} — open the tool to see what's driving it.`,
    chart_type: 'bar' as const,
    chart_labels: platform_breakdown.map(p => p.platform),
    chart_values: platform_breakdown.map(p => p.revenue),
    chart_label: 'Revenue by platform (last 30 days)',
    kpi_cards,
    table_headers,
    table_rows,
    recommendations,
    follow_up_suggestions,
    action_buttons: [
      { label: '📱 Open Social Commerce tool →', query: '__navigate:/intelligence?tab=social' },
      topSignal ? { label: `Convert "${topSignal.product_name}" saves →`, query: `How do I convert ${topSignal.saves} saves on ${topSignal.platform} for "${topSignal.product_name}" into orders? What are the best tactics?` } : null,
    ].filter(Boolean) as Array<{ label: string; query: string }>,
    scope_violation: false,
  }
}
