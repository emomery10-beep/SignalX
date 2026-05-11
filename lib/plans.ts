// ============================================================
// AskBiz Plan Feature Gates — Single source of truth
// ============================================================

export type PlanId = 'free' | 'growth' | 'business'

export interface PlanFeatures {
  // Usage limits
  questions_per_month:  number   // -1 = unlimited
  uploads_per_month:    number   // -1 = unlimited
  alerts_limit:         number   // -1 = unlimited
  forecasts_per_month:  number   // -1 = unlimited
  sources_limit:        number   // -1 = unlimited
  team_members:         number   // -1 = unlimited
  shipments_limit:      number   // -1 = unlimited

  // Core features
  data_upload:          boolean
  health_score:         boolean
  daily_brief:          boolean
  anomaly_alerts:       boolean
  decision_memory:      boolean
  competitor_watch:     boolean
  cfo_mode:             boolean
  expansion_intel:      boolean
  live_sync:            boolean
  templates:            boolean
  export_data:          boolean
  api_access:           boolean
  priority_support:     boolean

  // Tools — new features
  fx_risk:              boolean   // FX Risk Modeller
  supplier_scorecard:   boolean   // Supplier Scorecard (read)
  landed_cost:          boolean   // Landed Cost Calculator
  export_markets:       boolean   // Export Market Scoring
  social_commerce:      boolean   // Social Commerce Intelligence
  churn_intelligence:   boolean   // Churn Intelligence
  cost_profile_prefill: boolean   // Auto pre-fill tools from connected data
  tools_full_access:    boolean   // Full Tools page (vs limited)
}

export const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
  free: {
    // Usage
    questions_per_month:  10,
    uploads_per_month:    1,
    alerts_limit:         0,
    forecasts_per_month:  0,
    sources_limit:        3,
    team_members:         1,
    shipments_limit:      1,
    // Core
    data_upload:          true,
    health_score:         true,
    daily_brief:          false,
    anomaly_alerts:       false,
    decision_memory:      false,
    competitor_watch:     false,
    cfo_mode:             false,
    expansion_intel:      false,
    live_sync:            true,
    templates:            false,
    export_data:          false,
    api_access:           true,
    priority_support:     false,
    // Tools
    fx_risk:              true,    // manual input only
    supplier_scorecard:   true,    // view only from shipments
    landed_cost:          true,    // manual input only
    export_markets:       true,    // market scores only, no product matching
    social_commerce:      false,   // connect prompt only
    churn_intelligence:   false,
    cost_profile_prefill: false,   // no auto pre-fill
    tools_full_access:    false,
  },
  growth: {
    // Usage
    questions_per_month:  -1,
    uploads_per_month:    -1,
    alerts_limit:         -1,
    forecasts_per_month:  10,
    sources_limit:        -1,
    team_members:         1,
    shipments_limit:      5,
    // Core
    data_upload:          true,
    health_score:         true,
    daily_brief:          true,
    anomaly_alerts:       true,
    decision_memory:      false,
    competitor_watch:     false,
    cfo_mode:             false,
    expansion_intel:      true,
    live_sync:            true,
    templates:            true,
    export_data:          true,
    api_access:           true,
    priority_support:     false,
    // Tools
    fx_risk:              true,    // full + pre-fill
    supplier_scorecard:   true,    // full
    landed_cost:          true,    // full + pre-fill
    export_markets:       true,    // full + product matching
    social_commerce:      true,    // full
    churn_intelligence:   true,    // monthly scan
    cost_profile_prefill: true,    // auto pre-fill from connected data
    tools_full_access:    true,
  },
  business: {
    // Usage
    questions_per_month:  -1,
    uploads_per_month:    -1,
    alerts_limit:         -1,
    forecasts_per_month:  -1,
    sources_limit:        -1,
    team_members:         5,
    shipments_limit:      -1,
    // Core
    data_upload:          true,
    health_score:         true,
    daily_brief:          true,
    anomaly_alerts:       true,
    decision_memory:      true,
    competitor_watch:     true,
    cfo_mode:             true,
    expansion_intel:      true,
    live_sync:            true,
    templates:            true,
    export_data:          true,
    api_access:           true,
    priority_support:     true,
    // Tools
    fx_risk:              true,
    supplier_scorecard:   true,
    landed_cost:          true,
    export_markets:       true,
    social_commerce:      true,
    churn_intelligence:   true,    // real-time + alerts
    cost_profile_prefill: true,
    tools_full_access:    true,
  },
}

export const PLAN_PRICES: Record<PlanId, { amount: number; display: string }> = {
  free:     { amount: 0,  display: '£0/month' },
  growth:   { amount: 19, display: '£19/month' },
  business: { amount: 49, display: '£49/month' },
}

export const PLAN_DESCRIPTIONS: Record<PlanId, string> = {
  free:     '10 free questions per month. Upload your data, get your Business Pulse score, and explore the tools — no card needed.',
  growth:   'Unlimited questions, all tools pre-filled from your data, Daily Brief, social commerce, churn intelligence, and market intelligence.',
  business: 'Everything in Growth plus team seats, Decision Memory, Competitor Watch, CFO Mode, and priority support.',
}

export const PLAN_HIGHLIGHTS: Record<PlanId, string[]> = {
  free: [
    '10 questions per month',
    'Upload CSV & Excel files',
    'Business Pulse health score',
    'Connect Shopify, Amazon & more',
    'FX Risk, Landed Cost & Export Tools (manual)',
    'Supplier Scorecard (view)',
    'API access',
    'No credit card required',
  ],
  growth: [
    'Unlimited questions',
    'All tools pre-filled from your connected data',
    'Daily Brief — AI-generated morning intelligence',
    'Social Commerce — TikTok, Instagram, Pinterest',
    'Churn Intelligence — monthly at-risk scan',
    'Export Market Scoring — 20 markets with product match',
    'Anomaly alerts',
    'Market intelligence',
    'API access',
  ],
  business: [
    'Everything in Growth',
    'Team seats — up to 5 members',
    'Decision Memory — 6-week check-ins',
    'Competitor Watch',
    'CFO Mode — board-ready reports',
    'Unlimited shipment intelligence',
    'Role-based access',
    'Priority support',
    'API access',
  ],
}

// ── Helper functions ──────────────────────────────────────────
export function getPlanFeatures(planId: string): PlanFeatures {
  return PLAN_FEATURES[(planId as PlanId)] || PLAN_FEATURES.free
}

export function canAccess(planId: string, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(planId)
  const val = features[feature]
  if (typeof val === 'boolean') return val
  if (typeof val === 'number') return val === -1 || val > 0
  return false
}

export function isAtLimit(planId: string, feature: keyof PlanFeatures, current: number): boolean {
  const features = getPlanFeatures(planId)
  const limit = features[feature] as number
  if (limit === -1) return false
  return current >= limit
}

export function getPlanBadge(planId: string): { label: string; colour: string; bg: string } {
  const badges: Record<string, { label: string; colour: string; bg: string }> = {
    free:     { label: 'Free',     colour: '#6b6760', bg: 'rgba(107,103,96,.1)'  },
    growth:   { label: 'Growth',   colour: '#6366F1', bg: 'rgba(99,102,241,.1)' },
    business: { label: 'Business', colour: '#7c3aed', bg: 'rgba(124,58,237,.1)' },
  }
  return badges[planId] || badges.free
}

// ── Feature gate message ──────────────────────────────────────
export function getUpgradeMessage(feature: keyof PlanFeatures): { title: string; desc: string; plan: PlanId } {
  const messages: Partial<Record<keyof PlanFeatures, { title: string; desc: string; plan: PlanId }>> = {
    daily_brief:          { title: 'Daily Brief',           desc: 'Get an AI-generated morning intelligence brief based on your live business data.',         plan: 'growth'   },
    social_commerce:      { title: 'Social Commerce',       desc: 'Track TikTok Shop, Instagram, and Pinterest conversion rates and demand signals.',           plan: 'growth'   },
    churn_intelligence:   { title: 'Churn Intelligence',    desc: 'Scan your customers monthly for at-risk signals and get a retention priority list.',         plan: 'growth'   },
    cost_profile_prefill: { title: 'Auto pre-fill tools',   desc: 'Tools pre-fill automatically from your connected Shopify, Amazon, or uploaded data.',       plan: 'growth'   },
    anomaly_alerts:       { title: 'Anomaly Alerts',        desc: 'AskBiz monitors your data continuously and flags anything that needs attention.',            plan: 'growth'   },
    decision_memory:      { title: 'Decision Memory',       desc: 'Log decisions and AskBiz checks back in 6 weeks to see how they played out.',               plan: 'business' },
    competitor_watch:     { title: 'Competitor Watch',      desc: 'Monitor competitor pricing across Amazon, eBay, and Google Shopping in real time.',          plan: 'business' },
    cfo_mode:             { title: 'CFO Mode',              desc: 'Board-ready financial reports with percentage-first language and executive summaries.',       plan: 'business' },
    expansion_intel:      { title: 'Expansion Intelligence',desc: 'AI-ranked product expansion opportunities based on your margin, demand, and risk data.',     plan: 'growth'   },
  }
  return messages[feature] || { title: 'Upgrade required', desc: 'This feature requires a paid plan.', plan: 'growth' }
}
