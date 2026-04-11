// ============================================================
// SignalX Plan Feature Gates
// Single source of truth for what each plan can access
// ============================================================

export type PlanId = 'free' | 'growth' | 'business' | 'enterprise'

export interface PlanFeatures {
  questions_per_month: number       // -1 = unlimited
  uploads_per_month: number
  alerts_limit: number
  forecasts_per_month: number
  sources_limit: number
  team_members: number
  // Feature flags
  expansion_intel: boolean
  live_sync: boolean
  templates: boolean
  export: boolean
  api_access: boolean
  priority_support: boolean
  candidate_simulator: boolean
}

export const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
  free: {
    questions_per_month: 10,
    uploads_per_month: 1,
    alerts_limit: 0,
    forecasts_per_month: 0,
    sources_limit: 0,
    team_members: 1,
    expansion_intel: false,
    live_sync: false,
    templates: false,
    export: false,
    api_access: false,
    priority_support: false,
    candidate_simulator: false,
  },
  growth: {
    questions_per_month: 500,
    uploads_per_month: 10,
    alerts_limit: 10,
    forecasts_per_month: 10,
    sources_limit: 3,
    team_members: 1,
    expansion_intel: true,
    live_sync: true,
    templates: true,
    export: true,
    api_access: false,
    priority_support: true,
    candidate_simulator: true,
  },
  business: {
    questions_per_month: 2000,
    uploads_per_month: -1,
    alerts_limit: -1,
    forecasts_per_month: -1,
    sources_limit: 10,
    team_members: 5,
    expansion_intel: true,
    live_sync: true,
    templates: true,
    export: true,
    api_access: true,
    priority_support: true,
    candidate_simulator: true,
  },
  enterprise: {
    questions_per_month: -1,
    uploads_per_month: -1,
    alerts_limit: -1,
    forecasts_per_month: -1,
    sources_limit: -1,
    team_members: -1,
    expansion_intel: true,
    live_sync: true,
    templates: true,
    export: true,
    api_access: true,
    priority_support: true,
    candidate_simulator: true,
  },
}

export const PLAN_NAMES: Record<PlanId, string> = {
  free: 'Free',
  growth: 'Growth',
  business: 'Business',
  enterprise: 'Enterprise',
}

export const PLAN_PRICES: Record<PlanId, string> = {
  free: '£0',
  growth: '£19/month',
  business: '£49/month',
  enterprise: 'Contact us',
}

export function getPlanFeatures(planId: string): PlanFeatures {
  return PLAN_FEATURES[(planId as PlanId)] || PLAN_FEATURES.free
}

export function canAccess(planId: string, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(planId)
  const val = features[feature]
  if (typeof val === 'boolean') return val
  if (typeof val === 'number') return val !== 0
  return false
}
