// Mirrors: lib/api-plan-limits.ts (root) — keep both in sync, same reasoning
// as this app's stripe-billing webhook already being a kept-in-sync mirror.
//
// Developer-API per-key plan tiers — NOT the same thing as lib/plans.ts
// (the consumer/POS subscription plans). These limits are snapshotted onto
// an individual api_keys row's request_limit_month/request_limit_minute,
// at key creation and again on any plan change.
export type ApiPlan = 'free' | 'growth' | 'business'

export const API_PLAN_LIMITS: Record<ApiPlan, { month: number; minute: number }> = {
  free:     { month: 100,   minute: 5   },
  growth:   { month: 10000, minute: 60  },
  business: { month: -1,    minute: 120 },
}

export function isApiPlan(value: string): value is ApiPlan {
  return value === 'free' || value === 'growth' || value === 'business'
}
