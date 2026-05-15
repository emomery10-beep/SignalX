import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime   = 'nodejs'
export const maxDuration = 60

const PRIVACY_FLOOR = 3
const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b) / arr.length : null
const round2 = (n: number) => Math.round(n * 100) / 100

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const period     = new Date().toISOString().slice(0, 7) // YYYY-MM
  const monthStart = `${period}-01`
  const monthEnd   = new Date(
    new Date(monthStart).setMonth(new Date(monthStart).getMonth() + 1)
  ).toISOString().slice(0, 10)

  let productUpserted = 0
  let routeUpserted   = 0

  // ── 1. Product price signals from unified_data ──────────────
  // Only from market_intelligence_opt_in merchants
  const { data: optedInProfiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('market_intelligence_opt_in', true)

  if (optedInProfiles?.length) {
    const userIds = optedInProfiles.map(p => p.id)

    // Pull product-level data for all opted-in users this month
    const { data: rows } = await supabase
      .from('unified_data')
      .select('user_id, product_name, category, channel, customer_region, currency, selling_price, gross_margin, units_sold')
      .in('user_id', userIds)
      .gte('record_date', monthStart)
      .lt('record_date', monthEnd)
      .gt('selling_price', 0)
      .not('product_name', 'is', null)

    if (rows?.length) {
      // Bucket: product_name + channel + region + currency
      type PriceBucket = {
        prices: number[]
        margins: number[]
        units: number[]
        merchantIds: Set<string>
      }
      const buckets = new Map<string, PriceBucket>()

      for (const row of rows) {
        if (!row.product_name?.trim()) continue
        const key = [
          row.product_name.trim().toLowerCase(),
          row.channel || 'unknown',
          row.customer_region || 'unknown',
          row.currency || 'GBP',
        ].join('|')

        if (!buckets.has(key)) {
          buckets.set(key, { prices: [], margins: [], units: [], merchantIds: new Set() })
        }
        const b = buckets.get(key)!
        b.prices.push(row.selling_price)
        if (row.gross_margin > 0) b.margins.push(row.gross_margin)
        if (row.units_sold > 0)   b.units.push(row.units_sold)
        b.merchantIds.add(row.user_id)
      }

      for (const [key, b] of buckets) {
        if (b.merchantIds.size < PRIVACY_FLOOR) continue // privacy floor

        const [productName, channel, region, currency] = key.split('|')
        const sorted = [...b.prices].sort((a, c) => a - c)
        const median = sorted[Math.floor(sorted.length / 2)]

        // Find category from any row with this product
        const sampleRow = rows.find(r => r.product_name?.trim().toLowerCase() === productName)

        const { error } = await supabase
          .from('global_product_catalogue')
          .upsert({
            product_name:         sampleRow?.product_name?.trim() || productName,
            category:             sampleRow?.category || null,
            channel,
            region,
            currency,
            period,
            avg_selling_price:    round2(avg(b.prices)!),
            min_selling_price:    round2(Math.min(...b.prices)),
            max_selling_price:    round2(Math.max(...b.prices)),
            median_selling_price: round2(median),
            avg_gross_margin:     b.margins.length ? round2(avg(b.margins)!) : null,
            avg_units_sold:       b.units.length   ? round2(avg(b.units)!)   : null,
            merchant_count:       b.merchantIds.size,
            data_points:          b.prices.length,
            last_updated_at:      new Date().toISOString(),
          }, { onConflict: 'product_name,channel,region,currency,period' })

        if (!error) productUpserted++
      }
    }
  }

  // ── 2. Route intelligence from carrier_performance ───────────
  // Uses collective_opt_in (shipment data already under that consent)
  const { data: routeRows } = await supabase
    .from('carrier_performance')
    .select('user_id, route_origin, route_destination, carrier_code, transit_days, on_time, had_customs_hold')
    .gte('recorded_at', monthStart)
    .lt('recorded_at', monthEnd)

  if (routeRows?.length) {
    // Only include users who have collective_opt_in
    const { data: collectiveProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('collective_opt_in', true)

    const collectiveIds = new Set((collectiveProfiles || []).map(p => p.id))
    const filtered = routeRows.filter(r => collectiveIds.has(r.user_id))

    type RouteBucket = {
      transitDays: number[]
      onTime: number[]
      customsHold: number[]
      merchantIds: Set<string>
    }
    const routeBuckets = new Map<string, RouteBucket>()

    for (const row of filtered) {
      if (!row.route_origin || !row.route_destination) continue
      const key = [
        row.route_origin,
        row.route_destination,
        row.carrier_code || 'ALL',
      ].join('|')

      if (!routeBuckets.has(key)) {
        routeBuckets.set(key, { transitDays: [], onTime: [], customsHold: [], merchantIds: new Set() })
      }
      const b = routeBuckets.get(key)!
      if (row.transit_days > 0) b.transitDays.push(row.transit_days)
      b.onTime.push(row.on_time ? 100 : 0)
      b.customsHold.push(row.had_customs_hold ? 100 : 0)
      b.merchantIds.add(row.user_id)
    }

    for (const [key, b] of routeBuckets) {
      if (b.merchantIds.size < PRIVACY_FLOOR) continue

      const [origin, destination, carrier] = key.split('|')

      const { error } = await supabase
        .from('global_route_intelligence')
        .upsert({
          origin_country:      origin,
          destination_country: destination,
          carrier_code:        carrier,
          period,
          avg_transit_days:    b.transitDays.length ? round2(avg(b.transitDays)!) : null,
          on_time_rate:        round2(avg(b.onTime)!),
          customs_hold_rate:   round2(avg(b.customsHold)!),
          avg_delay_days:      null,
          merchant_count:      b.merchantIds.size,
          data_points:         b.onTime.length,
          last_updated_at:     new Date().toISOString(),
        }, { onConflict: 'origin_country,destination_country,carrier_code,period' })

      if (!error) routeUpserted++
    }
  }

  return NextResponse.json({
    ok: true,
    period,
    product_buckets_upserted: productUpserted,
    route_buckets_upserted:   routeUpserted,
  })
}
