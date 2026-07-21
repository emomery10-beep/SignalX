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

// Verified Business bonus — a flat multiplier applied on top of the plan
// limits above, not a new plan tier. Applied at the same two snapshot
// points as the base limits: key creation (app/api/v1/keys/route.ts) and
// admin approval of a verification (app/api/admin/developers/route.ts,
// resource=verifications). -1 (business plan's "unlimited" month) is left
// untouched — multiplying it would silently turn it into a real cap.
export const VERIFIED_LIMIT_MULTIPLIER = 3

export function withVerifiedMultiplier(
  limits: { month: number; minute: number },
  verified: boolean
): { month: number; minute: number } {
  if (!verified) return limits
  return {
    month:  limits.month === -1 ? -1 : limits.month * VERIFIED_LIMIT_MULTIPLIER,
    minute: limits.minute * VERIFIED_LIMIT_MULTIPLIER,
  }
}
