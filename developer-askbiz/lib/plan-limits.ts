// Single source of truth for the 3 developer-API plan tiers within this
// app — used by the Pricing page, the Authentication docs page, and the
// Settings Billing tab, so the numbers can't drift between them. Mirrors
// the root app's lib/api-plan-limits.ts (a separate deployment, can't
// import across apps) — GET /api/v1/pricing is the ultimate live source of
// truth if these ever disagree.
export type ApiPlan = 'free' | 'growth' | 'business'

export type PlanInfo = {
  id: ApiPlan
  label: string
  monthlyQuota: number // -1 = unlimited
  perMinuteLimit: number
  tagline: string
}

export const PLANS: PlanInfo[] = [
  { id: 'free', label: 'Free', monthlyQuota: 100, perMinuteLimit: 5, tagline: 'Try every endpoint, no card required.' },
  { id: 'growth', label: 'Growth', monthlyQuota: 10000, perMinuteLimit: 60, tagline: 'For a live integration serving real users.' },
  { id: 'business', label: 'Business', monthlyQuota: -1, perMinuteLimit: 120, tagline: 'Unlimited monthly requests, highest rate limit.' },
]

export function formatQuota(n: number): string {
  return n === -1 ? 'Unlimited' : n.toLocaleString('en-GB')
}
