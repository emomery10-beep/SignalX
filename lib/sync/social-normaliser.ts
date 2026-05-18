// ============================================================
// Social Commerce Normaliser
// Maps TikTok Shop, Instagram, Pinterest data →
// UnifiedRecord (for unified_data) + SocialSignal (for social_signals)
// ============================================================

import type { UnifiedRecord } from './normaliser'

function safeNum(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}
function safeStr(v: unknown): string {
  return v ? String(v).trim() : ''
}
function safeDate(v: unknown): string {
  if (!v) return new Date().toISOString().split('T')[0]
  try { return new Date(String(v)).toISOString().split('T')[0] }
  catch { return new Date().toISOString().split('T')[0] }
}

export interface SocialSignalRecord {
  source_type:      string
  platform:         string
  content_id:       string
  content_type:     string
  product_name:     string
  sku:              string
  record_date:      string
  views:            number
  likes:            number
  comments:         number
  shares:           number
  saves:            number
  clicks:           number
  impressions:      number
  orders:           number
  units_sold:       number
  gross_revenue:    number
  conversion_rate:  number
  avg_order_value:  number
  save_rate:        number
  engagement_rate:  number
  viral_score:      number
  creator_handle:   string
  campaign_name:    string
  is_paid:          boolean
  ad_spend:         number
  roas:             number
  currency:         string
  raw_data:         Record<string, unknown>
}

// ── TikTok Shop ───────────────────────────────────────────────

export function normaliseTikTokOrders(
  orders: Record<string, unknown>[]
): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  for (const order of orders) {
    const lineItems = (order.line_items as Record<string, unknown>[]) || []
    const createdAt = safeStr(order.create_time)
    const currency  = safeStr(order.currency) || 'GBP'

    for (const item of lineItems) {
      const qty   = safeNum(item.quantity)
      const price = safeNum(item.sale_price)
      const sku   = safeStr(item.sku_id) || safeStr(item.product_id)
      const name  = safeStr(item.product_name)

      records.push({
        record_date:      safeDate(createdAt),
        sku,
        product_name:     name,
        category:         safeStr(item.product_category),
        variant:          safeStr(item.sku_name),
        supplier:         '',
        units_sold:       qty,
        selling_price:    price,
        discount:         safeNum(item.platform_discount) + safeNum(item.seller_discount),
        gross_revenue:    qty * price,
        net_revenue:      qty * price - safeNum(item.platform_discount),
        cost_price:       0,
        shipping_cost:    safeNum(order.shipping_fee),
        packaging_cost:   0,
        marketplace_fee:  safeNum(order.platform_fee) || qty * price * 0.02,
        tax:              safeNum(order.tax),
        total_cost:       safeNum(order.shipping_fee) + safeNum(order.platform_fee),
        gross_margin:     0,
        net_margin:       0,
        stock_level:      0,
        stock_movement:   -qty,
        low_stock_flag:   false,
        damaged_stock:    0,
        channel:          'tiktok_shop',
        customer_region:  safeStr((order.recipient_address as Record<string, unknown>)?.country_code),
        currency,
        ad_spend:         0,
        campaign:         '',
        coupon_code:      safeStr(order.coupon_id),
        coupon_discount:  safeNum(order.coupon_discount_amount),
        payment_status:   safeStr(order.payment_status) || 'paid',
        refund_amount:    0,
        payout_amount:    qty * price,
        source_record_id: `tiktok_order_${safeStr(order.order_id)}_${sku}`,
        source_type:      'tiktok_shop',
        raw_data:         { order, item },
      })
    }
  }
  return records
}

export function normaliseTikTokAnalytics(
  analytics: Record<string, unknown>[]
): SocialSignalRecord[] {
  return analytics.map(a => {
    const views   = safeNum(a.video_views)
    const saves   = safeNum(a.product_saves)
    const clicks  = safeNum(a.product_clicks)
    const orders  = safeNum(a.orders)
    const revenue = safeNum(a.gmv)

    return {
      source_type:     'tiktok_shop',
      platform:        'TikTok Shop',
      content_id:      safeStr(a.video_id) || safeStr(a.product_id),
      content_type:    'video',
      product_name:    safeStr(a.product_name),
      sku:             safeStr(a.sku_id),
      record_date:     safeDate(a.date),
      views,
      likes:           safeNum(a.likes),
      comments:        safeNum(a.comments),
      shares:          safeNum(a.shares),
      saves,
      clicks,
      impressions:     safeNum(a.impressions) || views,
      orders,
      units_sold:      safeNum(a.units_sold),
      gross_revenue:   revenue,
      conversion_rate: clicks > 0 ? orders / clicks : 0,
      avg_order_value: orders > 0 ? revenue / orders : 0,
      save_rate:       views > 0 ? saves / views : 0,
      engagement_rate: views > 0 ? (safeNum(a.likes) + safeNum(a.comments) + safeNum(a.shares)) / views : 0,
      viral_score:     Math.min((views / 1000) * (saves > 0 ? saves / views * 10 : 1), 100),
      creator_handle:  safeStr(a.creator_handle),
      campaign_name:   '',
      is_paid:         false,
      ad_spend:        safeNum(a.ad_spend),
      roas:            safeNum(a.ad_spend) > 0 ? revenue / safeNum(a.ad_spend) : 0,
      currency:        'GBP',
      raw_data:        a,
    }
  })
}

// ── Instagram ─────────────────────────────────────────────────

export function normaliseInstagramOrders(
  orders: Record<string, unknown>[]
): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  for (const order of orders) {
    const items = (order.items as Record<string, unknown>[]) || []
    const payment = order.estimated_payment_details as Record<string, unknown> || {}

    for (const item of items) {
      const qty     = safeNum(item.quantity)
      const price   = safeNum((item.price_per_unit as any)?.amount) || safeNum(item.retailer_price)
      const name    = safeStr(item.product_name) || safeStr(item.retailer_product_id)

      records.push({
        record_date:      safeDate(order.created_time),
        sku:              safeStr(item.retailer_id),
        product_name:     name,
        category:         '',
        variant:          safeStr(item.selected_option),
        supplier:         '',
        units_sold:       qty,
        selling_price:    price,
        discount:         0,
        gross_revenue:    qty * price,
        net_revenue:      qty * price,
        cost_price:       0,
        shipping_cost:    safeNum(payment.shipping_amount),
        packaging_cost:   0,
        marketplace_fee:  qty * price * 0.05,  // Instagram takes ~5%
        tax:              safeNum(payment.tax_amount),
        total_cost:       safeNum(payment.shipping_amount),
        gross_margin:     0,
        net_margin:       0,
        stock_level:      0,
        stock_movement:   -qty,
        low_stock_flag:   false,
        damaged_stock:    0,
        channel:          'instagram_shopping',
        customer_region:  '',
        currency:         safeStr((item.price_per_unit as any)?.currency) || 'GBP',
        ad_spend:         0,
        campaign:         '',
        coupon_code:      '',
        coupon_discount:  0,
        payment_status:   safeStr(order.order_status) || 'paid',
        refund_amount:    0,
        payout_amount:    qty * price,
        source_record_id: `instagram_order_${safeStr(order.id)}_${safeStr(item.retailer_id)}`,
        source_type:      'instagram',
        raw_data:         { order, item },
      })
    }
  }
  return records
}

export function normaliseInstagramInsights(
  posts: Record<string, unknown>[]
): SocialSignalRecord[] {
  return posts.map(post => {
    const views       = safeNum(post.reach) || safeNum(post.views)
    const impressions = safeNum(post.impressions)
    const saves       = safeNum(post.saved)
    const likes       = safeNum(post.like_count)
    const comments    = safeNum(post.comments_count)

    return {
      source_type:     'instagram',
      platform:        'Instagram',
      content_id:      safeStr(post.id),
      content_type:    safeStr(post.media_type).toLowerCase() || 'post',
      product_name:    '',
      sku:             '',
      record_date:     safeDate(post.timestamp),
      views,
      likes,
      comments,
      shares:          safeNum(post.shares),
      saves,
      clicks:          safeNum(post.profile_visits) + safeNum(post.website_clicks),
      impressions,
      orders:          0,
      units_sold:      0,
      gross_revenue:   0,
      conversion_rate: 0,
      avg_order_value: 0,
      save_rate:       impressions > 0 ? saves / impressions : 0,
      engagement_rate: views > 0 ? (likes + comments) / views : 0,
      viral_score:     Math.min((views / 500) * (saves > 0 ? saves / Math.max(views, 1) * 10 : 1), 100),
      creator_handle:  '',
      campaign_name:   '',
      is_paid:         false,
      ad_spend:        0,
      roas:            0,
      currency:        'GBP',
      raw_data:        post,
    }
  })
}

// ── Pinterest ─────────────────────────────────────────────────

export function normalisePinterestAnalytics(
  pins: Record<string, unknown>[]
): SocialSignalRecord[] {
  return pins.map(pin => {
    const impressions = safeNum(pin.impressions)
    const saves       = safeNum(pin.saves)
    const clicks      = safeNum(pin.pin_clicks) + safeNum(pin.outbound_clicks)

    // Pinterest: saves are the primary demand signal
    // A high save rate = strong future purchase intent
    const saveRate = impressions > 0 ? saves / impressions : 0

    return {
      source_type:     'pinterest',
      platform:        'Pinterest',
      content_id:      safeStr(pin.id),
      content_type:    'pin',
      product_name:    safeStr((pin.link_data as Record<string, unknown>)?.title) || safeStr(pin.title) || '',
      sku:             safeStr(pin.product_id) || '',
      record_date:     safeDate(pin.created_at),
      views:           impressions,
      likes:           0,
      comments:        0,
      shares:          saves,   // saves = shares on Pinterest
      saves,
      clicks,
      impressions,
      orders:          0,
      units_sold:      0,
      gross_revenue:   0,
      conversion_rate: 0,
      avg_order_value: 0,
      save_rate:       saveRate,
      engagement_rate: impressions > 0 ? (saves + clicks) / impressions : 0,
      // Pinterest viral score — saves are worth more than clicks (intent signal)
      viral_score:     Math.min((saves * 3 + clicks) / 10, 100),
      creator_handle:  '',
      campaign_name:   '',
      is_paid:         false,
      ad_spend:        0,
      roas:            0,
      currency:        'GBP',
      raw_data:        pin,
    }
  })
}
