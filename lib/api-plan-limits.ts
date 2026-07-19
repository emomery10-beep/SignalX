// Developer-API per-key plan tiers — NOT the same thing as lib/plans.ts
// (the consumer/POS subscription plans). These limits are snapshotted onto
// an individual api_keys row's request_limit_month/request_limit_minute,
// at key creation and again on any plan change.
//
// Single source of truth: extracted from app/api/v1/keys/route.ts so
// app/api/v1/keys/subscription/route.ts (plan upgrade) and the
// stripe-billing webhook's resync-on-upgrade branch read the exact same
// numbers instead of a second copy that can drift out of sync — that drift
// was itself a known, previously-unfixed billing-fairness gap.
export type ApiPlan = 'free' | 'growth' | 'business'

export const API_PLAN_LIMITS: Record<ApiPlan, { month: number; minute: number }> = {
  free:     { month: 100,   minute: 5   },
  growth:   { month: 10000, minute: 60  },
  business: { month: -1,    minute: 120 },
}

export function isApiPlan(value: string): value is ApiPlan {
  return value === 'free' || value === 'growth' || value === 'business'
}
