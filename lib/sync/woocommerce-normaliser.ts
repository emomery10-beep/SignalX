import { UnifiedRecord } from './normaliser'

function safeNum(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function safeStr(v: unknown): string {
  return v ? String(v).trim() : ''
}

export function normaliseWooOrder(order: Record<string, unknown>): UnifiedRecord[] {
  const orderId  = safeStr(order.id)
  const currency = safeStr(order.currency) || 'GBP'
  const region   = safeStr((order.billing as Record<string, unknown>)?.country) || ''
  const shipping = safeNum(order.shipping_total)
  const tax      = safeNum(order.total_tax)
  const discount = safeNum(order.discount_total)
  const status   = safeStr(order.status)
  const recordDate = safeStr(order.date_created)?.split('T')[0]
    || new Date().toISOString().split('T')[0]

  const couponLines = (order.coupon_lines as Record<string, unknown>[]) || []
  const couponCode  = safeStr(couponLines[0]?.code)

  const lineItems = (order.line_items as Record<string, unknown>[]) || []
  if (lineItems.length === 0) {
    const total = safeNum(order.total)
    return [{
      record_date:     recordDate,
      sku:             '',
      product_name:    'WooCommerce Order',
      category:        '',
      variant:         '',
      supplier:        '',
      units_sold:      1,
      selling_price:   total,
      discount,
      gross_revenue:   total,
      net_revenue:     total - discount,
      cost_price:      0,
      shipping_cost:   shipping,
      packaging_cost:  0,
      marketplace_fee: 0,
      tax,
      total_cost:      shipping + tax,
      gross_margin:    0,
      net_margin:      0,
      stock_level:     0,
      stock_movement:  -1,
      low_stock_flag:  false,
      damaged_stock:   0,
      channel:         'woocommerce',
      customer_region: region,
      currency,
      ad_spend:        0,
      campaign:        '',
      coupon_code:     couponCode,
      coupon_discount: discount,
      payment_status:  status,
      refund_amount:   0,
      payout_amount:   total,
      source_record_id: `woo_order_${orderId}`,
      source_type:     'woocommerce',
      raw_data:        order,
    }]
  }

  const perItem = lineItems.length
  return lineItems.map((item, idx) => {
    const qty      = safeNum(item.quantity) || 1
    const total    = safeNum(item.total)
    const price    = qty > 0 ? total / qty : safeNum(item.price)
    const itemTax  = safeNum(item.total_tax)
    const itemShip = idx === 0 ? shipping : 0
    const itemDisc = discount / perItem
    const netRev   = total - itemDisc
    const totalCost = itemShip + itemTax

    return {
      record_date:     recordDate,
      sku:             safeStr(item.sku) || String(item.product_id || ''),
      product_name:    safeStr(item.name),
      category:        '',
      variant:         safeStr(item.variation_id) && item.variation_id !== 0
                         ? String(item.variation_id) : '',
      supplier:        '',
      units_sold:      qty,
      selling_price:   price,
      discount:        itemDisc,
      gross_revenue:   total,
      net_revenue:     netRev,
      cost_price:      0,
      shipping_cost:   itemShip,
      packaging_cost:  0,
      marketplace_fee: 0,
      tax:             itemTax,
      total_cost:      totalCost,
      gross_margin:    total > 0 ? Math.round(((total - totalCost) / total) * 10000) / 100 : 0,
      net_margin:      netRev > 0 ? Math.round(((netRev - totalCost) / netRev) * 10000) / 100 : 0,
      stock_level:     0,
      stock_movement:  -qty,
      low_stock_flag:  false,
      damaged_stock:   0,
      channel:         'woocommerce',
      customer_region: region,
      currency,
      ad_spend:        0,
      campaign:        '',
      coupon_code:     couponCode,
      coupon_discount: itemDisc,
      payment_status:  status,
      refund_amount:   0,
      payout_amount:   netRev,
      source_record_id: `woo_order_${orderId}_item_${item.id ?? idx}`,
      source_type:     'woocommerce',
      raw_data:        { order_id: orderId, ...item },
    }
  })
}
