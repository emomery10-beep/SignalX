import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { authenticateApiKey, recordRequest, CORS } from '@/lib/api-v1-auth'

export const runtime = 'nodejs'

// Phase 3 — billing-on-behalf-of. A developer creates a charge request
// against a specific AskBiz merchant (identified by email — see the scope
// note in 20260708000005_developer_charges.sql for why this is a one-off
// authorization, not a persistent app-install grant). The merchant approves
// via a hosted confirmation page on developer.askbiz.co, which redirects to
// a real Stripe Checkout session — money collection only; see that
// migration's header for why automatic developer payout isn't built yet.

const MIN_CHARGE_CENTS = 100 // £1 — comfortably above Stripe's per-currency minimums, avoids opaque Stripe API errors on tiny amounts
const MAX_CHARGE_CENTS = 100_000_00 // £100,000 — sanity ceiling, not a real product limit; prevents a typo'd extra zero from creating a six-figure charge request

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(request: NextRequest) {
  const start = Date.now()
  const auth = await authenticateApiKey(request)
  if (!auth.ok) return auth.response
  const { key, supabase } = auth

  let body: { merchant_email?: string; amount_cents?: number; currency?: string; description?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS })
  }

  const { merchant_email, amount_cents, currency = 'gbp', description } = body

  if (!merchant_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(merchant_email)) {
    return NextResponse.json({ error: '"merchant_email" must be a valid email' }, { status: 400, headers: CORS })
  }
  if (!Number.isInteger(amount_cents) || (amount_cents as number) < MIN_CHARGE_CENTS || (amount_cents as number) > MAX_CHARGE_CENTS) {
    return NextResponse.json({ error: `"amount_cents" must be an integer between ${MIN_CHARGE_CENTS} and ${MAX_CHARGE_CENTS}` }, { status: 400, headers: CORS })
  }
  if (!description || typeof description !== 'string' || description.length > 500) {
    return NextResponse.json({ error: '"description" is required and must be under 500 characters' }, { status: 400, headers: CORS })
  }

  const confirmationToken = randomBytes(24).toString('hex')

  const { data: charge, error } = await supabase
    .from('developer_charges')
    .insert({
      key_id: key.id,
      merchant_email: merchant_email.toLowerCase().trim(),
      amount_cents,
      currency,
      description,
      confirmation_token: confirmationToken,
      // Mirrored from the key, not re-derived later — the approve route and
      // the Stripe webhook both need this without a join, and it must be
      // fixed at creation time so it can never drift from the key that
      // actually created the charge.
      key_env: key.key_env,
    })
    .select('id, status, amount_cents, currency, description, created_at, expires_at, key_env')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })

  await recordRequest(supabase, key, '/api/v1/charges', 200, Date.now() - start)

  return NextResponse.json({
    charge,
    confirmation_url: `https://developer.askbiz.co/charges/${confirmationToken}`,
  }, { headers: CORS })
}

export async function GET(request: NextRequest) {
  const auth = await authenticateApiKey(request)
  if (!auth.ok) return auth.response
  const { key, supabase } = auth

  const { data: charges, error } = await supabase
    .from('developer_charges')
    .select('id, merchant_email, amount_cents, currency, description, status, created_at, approved_at, expires_at')
    .eq('key_id', key.id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: CORS })
  return NextResponse.json({ charges: charges || [] }, { headers: CORS })
}
