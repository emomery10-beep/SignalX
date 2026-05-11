// ── Churn intent detection ────────────────────────────────────────────────────

const CHURN_PATTERNS = [
  /churn/i,
  /at.?risk.?customer/i,
  /customer.?at.?risk/i,
  /about to (leave|churn|stop|lapse)/i,
  /haven.?t bought/i,
  /not (bought|ordered|purchased) (in|for|since)/i,
  /overdue (for|on) (a |an |their )?(re)?order/i,
  /lapsed customer/i,
  /inactive customer/i,
  /retention (list|priority|alert)/i,
  /who.?s (leaving|churning|at risk)/i,
  /losing customer/i,
  /customer.?retention/i,
  /win.?back/i,
  /days since (last |their )?(order|purchase)/i,
  /repeat purchase/i,
  /haven.?t (seen|heard from|had an order)/i,
]

export function detectChurnIntent(text: string): boolean {
  return CHURN_PATTERNS.some(p => p.test(text))
}

// ── Build churn result for ResultBlock ───────────────────────────────────────

export interface ChurnCustomer {
  customer_ref:     string
  customer_name:    string | null
  last_order_date:  string | null
  days_since_order: number
  order_count:      number
  total_spend:      number
  avg_order_value:  number
  churn_risk_score: number
  churn_risk_label: string
}

export interface ChurnResult {
  summary: {
    total_customers: number
    at_risk:         number
    watch:           number
    churned:         number
    healthy:         number
  }
  top_at_risk: ChurnCustomer[]
}

export function buildChurnAIResult(data: ChurnResult, symbol: string) {
  const { summary, top_at_risk } = data

  const atRisk    = top_at_risk.filter(c => c.churn_risk_label === 'at_risk')
  const watch     = top_at_risk.filter(c => c.churn_risk_label === 'watch')
  const ltv       = atRisk.reduce((s, c) => s + c.total_spend, 0)
  const topCustomer = atRisk[0] || watch[0]

  const answer_text = summary.at_risk === 0 && summary.watch === 0
    ? `Your customer retention looks healthy — no customers are significantly overdue for a repeat order based on their purchase history. ${summary.total_customers} customers scored.`
    : `${summary.at_risk} customer${summary.at_risk !== 1 ? 's are' : ' is'} at risk of churning — significantly overdue for a repeat purchase based on their buying frequency. Another ${summary.watch} ${summary.watch !== 1 ? 'are' : 'is'} worth watching. Combined lifetime value at risk: ${symbol}${ltv.toFixed(0)}.${topCustomer ? ` Most urgent: ${topCustomer.customer_name || topCustomer.customer_ref}, last ordered ${topCustomer.days_since_order} days ago.` : ''}`

  const kpi_cards = [
    { label: 'At risk',     value: String(summary.at_risk),   trend: summary.at_risk > 0 ? 'down' as const : 'neutral' as const,   status: summary.at_risk > 0 ? 'risk' as const : 'good' as const },
    { label: 'Watch',       value: String(summary.watch),     trend: 'neutral' as const, status: summary.watch > 0 ? 'warning' as const : 'good' as const },
    { label: 'LTV at risk', value: `${symbol}${ltv.toFixed(0)}`, trend: 'down' as const, status: ltv > 0 ? 'risk' as const : 'good' as const },
    { label: 'Healthy',     value: String(summary.healthy),   trend: 'up' as const,   status: 'good' as const },
  ]

  const table_headers = ['Customer', 'Last order', 'Days overdue', 'Orders', 'LTV', 'Risk']
  const table_rows = top_at_risk.slice(0, 8).map(c => [
    c.customer_name || c.customer_ref,
    c.last_order_date ? new Date(c.last_order_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : 'Unknown',
    String(c.days_since_order),
    String(c.order_count),
    `${symbol}${c.total_spend.toFixed(0)}`,
    c.churn_risk_label === 'at_risk' ? '🔴 At risk' : '🟡 Watch',
  ])

  const recommendations = [
    atRisk.length > 0 ? `Contact ${atRisk[0]?.customer_name || atRisk[0]?.customer_ref || 'your top at-risk customer'} first — highest lifetime value at ${symbol}${(atRisk[0]?.total_spend || 0).toFixed(0)}` : null,
    summary.at_risk > 0 ? `Send a personalised win-back offer to the ${summary.at_risk} at-risk customer${summary.at_risk > 1 ? 's' : ''} — reference their last purchase` : null,
    summary.watch > 0   ? `Monitor the ${summary.watch} watch-list customer${summary.watch > 1 ? 's' : ''} — check again in 2 weeks` : null,
    'Set a monthly reminder to review this list before your revenue review',
  ].filter(Boolean) as string[]

  const follow_up_suggestions = [
    topCustomer ? `Tell me more about ${topCustomer.customer_name || topCustomer.customer_ref}'s purchase history` : null,
    'Draft a win-back email for my at-risk customers',
    'Which products did my at-risk customers buy most?',
    'What is my overall customer retention rate?',
  ].filter(Boolean) as string[]

  return {
    insight_header:       `${summary.at_risk} customer${summary.at_risk !== 1 ? 's' : ''} at risk — ${symbol}${ltv.toFixed(0)} lifetime value`,
    answer_text,
    confidence:           'high' as const,
    verdict:              summary.at_risk > 0 ? 'act' as const : summary.watch > 0 ? 'watch' as const : null,
    verdict_sentence:     summary.at_risk > 0
      ? `Contact your ${summary.at_risk} at-risk customer${summary.at_risk > 1 ? 's' : ''} this week before they churn permanently.`
      : summary.watch > 0 ? `Monitor ${summary.watch} customer${summary.watch > 1 ? 's' : ''} — they are approaching their expected reorder window.` : undefined,
    chart_type:           'bar' as const,
    chart_labels:         ['Healthy', 'Watch', 'At risk', 'Churned'],
    chart_values:         [summary.healthy, summary.watch, summary.at_risk, summary.churned],
    chart_label:          'Customer health breakdown',
    kpi_cards,
    table_headers,
    table_rows,
    recommendations,
    follow_up_suggestions,
    scope_violation:      false,
  }
}
