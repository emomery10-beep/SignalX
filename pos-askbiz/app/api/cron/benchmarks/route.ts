import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

// Nightly collective intelligence aggregation.
// Reads opted-in businesses' anonymised metrics and upserts into market_benchmarks.
// Minimum 3 businesses per bucket before we publish (privacy floor).

const PRIVACY_FLOOR = 3

function businessSize(seatCount: number, plan: string): 'micro' | 'small' | 'medium' {
  if (plan === 'business' || seatCount >= 5) return 'medium'
  if (plan === 'growth'   || seatCount >= 2) return 'small'
  return 'micro'
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const period = new Date().toISOString().slice(0, 7) // YYYY-MM
  const monthStart = `${period}-01`
  const monthEnd   = new Date(new Date(monthStart).setMonth(new Date(monthStart).getMonth() + 1)).toISOString().slice(0, 10)

  // Pull all opted-in profiles
  const { data: profiles, error: profileErr } = await supabase
    .from('profiles')
    .select('id, region, business_type, sector_hints, pos_seat_count, plan')
    .eq('collective_opt_in', true)

  if (profileErr || !profiles?.length) {
    return NextResponse.json({ ok: true, message: 'No opted-in profiles', count: 0 })
  }

  // Bucket key → accumulator
  type Bucket = {
    sector: string
    region: string
    size: 'micro' | 'small' | 'medium'
    margins:      number[]
    baskets:       number[]
    dailyRevenues: number[]
    refundRates:   number[]
  }
  const buckets = new Map<string, Bucket>()

  for (const profile of profiles) {
    const sector = profile.sector_hints?.split(',')[0]?.trim() || profile.business_type || 'retail'
    const region = profile.region || 'United Kingdom'
    const size   = businessSize(profile.pos_seat_count || 0, profile.plan || 'free')
    const key    = `${sector}|${region}|${size}`

    if (!buckets.has(key)) {
      buckets.set(key, { sector, region, size, margins: [], baskets: [], dailyRevenues: [], refundRates: [] })
    }
    const bucket = buckets.get(key)!

    // Unified data — last month's revenue + margin per day
    const { data: unified } = await supabase
      .from('unified_data')
      .select('gross_revenue, gross_margin, record_date')
      .eq('user_id', profile.id)
      .gte('record_date', monthStart)
      .lt('record_date', monthEnd)

    if (unified?.length) {
      const validMargins = unified.filter(r => r.gross_margin > 0).map(r => r.gross_margin)
      if (validMargins.length) bucket.margins.push(validMargins.reduce((a, b) => a + b) / validMargins.length)

      const totalRev = unified.reduce((s, r) => s + (r.gross_revenue || 0), 0)
      if (totalRev > 0) bucket.dailyRevenues.push(totalRev / unified.length)
    }

    // POS basket + refund rate
    const { data: txs } = await supabase
      .from('pos_transactions')
      .select('total, status')
      .eq('owner_id', profile.id)
      .gte('created_at', monthStart)
      .lt('created_at', monthEnd)

    if (txs?.length) {
      const completed = txs.filter(t => t.status === 'completed')
      if (completed.length) {
        bucket.baskets.push(completed.reduce((s, t) => s + t.total, 0) / completed.length)
      }
      const refunded = txs.filter(t => t.status.includes('refund')).length
      bucket.refundRates.push((refunded / txs.length) * 100)
    }
  }

  let upserted = 0
  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b) / arr.length : null

  for (const [, b] of buckets) {
    const sampleSize = profiles.filter(p => {
      const sector = p.sector_hints?.split(',')[0]?.trim() || p.business_type || 'retail'
      const region = p.region || 'United Kingdom'
      const size   = businessSize(p.pos_seat_count || 0, p.plan || 'free')
      return `${sector}|${region}|${size}` === `${b.sector}|${b.region}|${b.size}`
    }).length

    if (sampleSize < PRIVACY_FLOOR) continue // Privacy floor — never publish thin buckets

    const metrics: Array<{ metric: string; value: number }> = [
      { metric: 'avg_margin',        value: avg(b.margins)!        },
      { metric: 'avg_basket',        value: avg(b.baskets)!        },
      { metric: 'avg_daily_revenue', value: avg(b.dailyRevenues)!  },
      { metric: 'refund_rate',       value: avg(b.refundRates)!    },
    ].filter(m => m.value !== null && !isNaN(m.value)) as Array<{ metric: string; value: number }>

    for (const { metric, value } of metrics) {
      const { error } = await supabase.from('market_benchmarks').upsert({
        sector:        b.sector,
        region:        b.region,
        business_size: b.size,
        metric,
        value:         Math.round(value * 100) / 100,
        sample_size:   sampleSize,
        period,
      }, { onConflict: 'sector,region,business_size,metric,period' })

      if (!error) upserted++
    }
  }

  return NextResponse.json({ ok: true, period, buckets: buckets.size, upserted })
}
