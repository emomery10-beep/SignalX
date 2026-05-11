import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FREIGHTOS_BASE = 'https://developers.freightos.com/api/v1'
const FREIGHTOS_API_KEY = process.env.FREIGHTOS_API_KEY || ''
const FREIGHTOS_API_SECRET = process.env.FREIGHTOS_API_SECRET || ''

function getAuthHeader() {
  const encoded = Buffer.from(`${FREIGHTOS_API_KEY}:${FREIGHTOS_API_SECRET}`).toString('base64')
  return `Basic ${encoded}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('plan, plan_id').eq('id', user.id).single()
    const plan = profile?.plan || profile?.plan_id || 'free'
    const isGrowthPlus = ['growth', 'business', 'enterprise'].includes(plan)
    const isBusinessPlus = ['business', 'enterprise'].includes(plan)

    if (!isGrowthPlus) {
      return NextResponse.json({
        error: 'Freight rate intelligence is available on Growth and Business plans.',
        locked: true,
        upgrade_url: '/billing',
      }, { status: 403 })
    }

    if (!FREIGHTOS_API_KEY) {
      return NextResponse.json({ error: 'Freightos API key not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'quote') {
      const { origin_port, destination_port, weight_kg, volume_cbm, shipment_mode = 'ocean', user_paid_rate } = body

      if (!origin_port || !destination_port || !weight_kg || !volume_cbm) {
        return NextResponse.json({ error: 'origin_port, destination_port, weight_kg, volume_cbm required' }, { status: 400 })
      }

      const quoteRes = await fetch(`${FREIGHTOS_BASE}/rates`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          origin: { port: origin_port },
          destination: { port: destination_port },
          cargo: {
            weight: { value: weight_kg, unit: 'kg' },
            volume: { value: volume_cbm, unit: 'cbm' },
          },
          mode: shipment_mode,
          currency: 'USD',
        }),
      })

      if (!quoteRes.ok) {
        const err = await quoteRes.text()
        console.error('[freightos]', err)
        return NextResponse.json({ error: `Freightos error: ${quoteRes.status}`, detail: err }, { status: 500 })
      }

      const quotes = await quoteRes.json()
      const rates = (quotes.rates || []).sort((a: any, b: any) => a.total_price - b.total_price)
      const cheapest = rates[0] || null
      const market_avg = rates.length ? rates.reduce((s: number, r: any) => s + r.total_price, 0) / rates.length : 0

      let overpaying = null
      if (isBusinessPlus && user_paid_rate && cheapest) {
        const diff = user_paid_rate - cheapest.total_price
        overpaying = {
          amount: parseFloat(diff.toFixed(2)),
          percentage: parseFloat(((diff / user_paid_rate) * 100).toFixed(1)),
          recommendation: diff > 0
            ? `You are paying $${diff.toFixed(0)} more than the cheapest market rate. Consider switching to ${cheapest.provider_name || 'a cheaper forwarder'} or use this data to renegotiate.`
            : 'Your current rate is competitive — within market range.',
        }
      }

      await supabase.from('freight_quotes').insert({
        user_id: user.id,
        origin_port,
        destination_port,
        origin_country: origin_port.slice(0, 2),
        destination_country: destination_port.slice(0, 2),
        weight_kg,
        volume_cbm,
        shipment_mode,
        cheapest_rate: cheapest?.total_price || null,
        market_avg_rate: parseFloat(market_avg.toFixed(2)),
        user_paid_rate: user_paid_rate || null,
        overpaying_amount: overpaying?.amount || null,
        rates_snapshot: rates.slice(0, 5),
        quoted_at: new Date().toISOString(),
      }).select().single()

      return NextResponse.json({
        rates: rates.slice(0, 5),
        cheapest,
        market_avg: parseFloat(market_avg.toFixed(2)),
        overpaying,
        lane: `${origin_port} to ${destination_port}`,
        mode: shipment_mode,
        plan,
      })
    }

    if (action === 'history') {
      const { data } = await supabase.from('freight_quotes').select('*').eq('user_id', user.id).order('quoted_at', { ascending: false }).limit(10)
      return NextResponse.json({ history: data || [] })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    console.error('[freight]', err)
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 })
  }
}
