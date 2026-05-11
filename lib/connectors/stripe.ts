// ── STRIPE CONNECTOR ─────────────────────────────────────────
// Direct API key auth (no OAuth needed for Stripe)
// Fetches charges, payouts, balance transactions

export async function validateStripeKey(secretKey: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { 'Authorization': `Bearer ${secretKey}` }
    })
    return res.ok
  } catch {
    return false
  }
}

export async function fetchStripeCharges(secretKey: string, limit = 100) {
  const res = await fetch(
    `https://api.stripe.com/v1/charges?limit=${limit}&expand[]=data.balance_transaction`,
    { headers: { 'Authorization': `Bearer ${secretKey}` } }
  )
  if (!res.ok) throw new Error(`Stripe charges failed: ${res.status}`)
  const data = await res.json()
  return data.data || []
}

export async function fetchStripePayouts(secretKey: string, limit = 100) {
  const res = await fetch(
    `https://api.stripe.com/v1/payouts?limit=${limit}`,
    { headers: { 'Authorization': `Bearer ${secretKey}` } }
  )
  if (!res.ok) throw new Error(`Stripe payouts failed: ${res.status}`)
  const data = await res.json()
  return data.data || []
}

export async function fetchStripeBalance(secretKey: string) {
  const res = await fetch('https://api.stripe.com/v1/balance', {
    headers: { 'Authorization': `Bearer ${secretKey}` }
  })
  if (!res.ok) throw new Error(`Stripe balance failed: ${res.status}`)
  return res.json()
}

export async function fetchStripeTransactions(secretKey: string, limit = 250) {
  const res = await fetch(
    `https://api.stripe.com/v1/balance_transactions?limit=${limit}&type=charge`,
    { headers: { 'Authorization': `Bearer ${secretKey}` } }
  )
  if (!res.ok) throw new Error(`Stripe transactions failed: ${res.status}`)
  const data = await res.json()
  return data.data || []
}
