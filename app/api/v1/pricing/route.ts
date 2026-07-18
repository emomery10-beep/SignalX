import { NextResponse } from 'next/server'
import { PLAN_LIMITS } from '@/lib/api-v1-auth'
import { API_PRICE_CENTS } from '@/lib/api-pricing'

export const runtime = 'nodejs'

// Public, unauthenticated — a developer evaluating the API should be able to
// see real prices before writing a line of code, not just discover them in a
// 402 body after being rejected. Single source of truth for both this route
// and openapi.json (API_PRICE_CENTS), never restate the numbers.
export async function GET() {
  return NextResponse.json(
    {
      endpoints: Object.entries(API_PRICE_CENTS).map(([path, price_cents]) => ({ path, price_cents })),
      plans: PLAN_LIMITS,
      currency: 'usd_cents',
      note: 'Prices are per successful call — failed or rejected requests are never billed.',
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } }
  )
}
