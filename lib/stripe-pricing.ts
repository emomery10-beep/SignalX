import Stripe from 'stripe'

// Cache product → default-price resolutions so we only hit Stripe once per cold start.
const productPriceCache = new Map<string, string>()

// Resolve a Stripe price ID for a plan + interval, given an env var prefix.
// Lookup chain: <PREFIX>_<PLAN>_<INTERVAL> → <PREFIX>_<PLAN>_MONTHLY (legacy monthly).
// Accepts either a price ID (price_...) or a product ID (prod_...); product IDs
// are resolved to their default price on first use. Annual env vars are optional —
// if missing, annual silently falls back to monthly.
//
// Extracted from app/api/billing/route.ts (main plan checkout) so
// app/api/v1/keys/subscription/route.ts (developer API plan upgrade) can
// share the exact same resolution logic against its own env var prefix
// (STRIPE_PRICE_API_*) instead of a second, driftable copy.
export async function resolvePriceId(stripe: Stripe, envPrefix: string, plan: string, annual: boolean): Promise<string> {
  const PLAN = plan.toUpperCase()
  const interval = annual ? 'ANNUAL' : 'MONTHLY'
  const raw = (
    process.env[`${envPrefix}_${PLAN}_${interval}`] ||
    process.env[`${envPrefix}_${PLAN}_MONTHLY`] ||
    process.env[`${envPrefix}_${PLAN}`] ||
    ''
  ).trim()

  if (!raw) return ''
  if (raw.startsWith('price_')) return raw
  if (raw.startsWith('prod_')) {
    const cached = productPriceCache.get(raw)
    if (cached) return cached
    const product = await stripe.products.retrieve(raw)
    const defaultPrice = typeof product.default_price === 'string'
      ? product.default_price
      : product.default_price?.id
    if (!defaultPrice) throw new Error(`Product ${raw} has no default price set in Stripe`)
    productPriceCache.set(raw, defaultPrice)
    return defaultPrice
  }
  return raw
}
