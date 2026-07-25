import { UnifiedRecord } from './normaliser'

function safeNum(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function safeStr(v: unknown): string {
  return v ? String(v).trim() : ''
}

// NOTE: field names below (Items[].ItemNumber/Title/Quantity/PricePerUnit/Cost)
// follow Linnworks' commonly-documented GetOpenOrders shape, but could not be
// confirmed against authenticated API docs during development — verify against
// a real response before relying on this in production, and adjust field names
// if they don't match.
export function normaliseLinnworksOrder(order: Record<string, unknown>): UnifiedRecord[] {
  const orderId = safeStr(order.NumOrderId) || safeStr(order.OrderId)
  const general = (order.GeneralInfo as Record<string, unknown>) || {}
  const recordDate = safeStr(general.ReceivedDate)?.split('T')[0] || new Date().toISOString().split('T')[0]
  const status = safeStr(general.Status)
  const channel = safeStr(general.Source) || 'linnworks'
  const currency = safeStr((order.TotalsInfo as Record<string, unknown>)?.Currency) || 'GBP'

  const items = (order.Items as Record<string, unknown>[]) || []
  if (items.length === 0) {
    const total = safeNum((order.TotalsInfo as Record<string, unknown>)?.TotalCharge)
    return [{
      record_date:     recordDate,
      sku:             '',
      product_name:    'Linnworks Order',
      category:        '',
      variant:         '',
      supplier:        '',
      units_sold:      1,
      selling_price:   total,
      discount:        0,
      gross_revenue:   total,
      net_revenue:     total,
      cost_price:      0,
      shipping_cost:   0,
      packaging_cost:  0,
      marketplace_fee: 0,
      tax:             0,
      total_cost:      0,
      gross_margin:    0,
      net_margin:      0,
      stock_level:     0,
      stock_movement:  -1,
      low_stock_flag:  false,
      damaged_stock:   0,
      channel,
      customer_region: '',
      currency,
      ad_spend:        0,
      campaign:        '',
      coupon_code:     '',
      coupon_discount: 0,
      payment_status:  status,
      refund_amount:   0,
      payout_amount:   total,
      source_record_id: `linnworks_order_${orderId}`,
      source_type:     'linnworks',
      raw_data:        order,
    }]
  }

  return items.map((item, idx) => {
    const qty = safeNum(item.Quantity) || 1
    const price = safeNum(item.PricePerUnit)
    const cost = safeNum(item.Cost)
    const grossRev = price * qty
    const totalCost = cost * qty

    return {
      record_date:     recordDate,
      sku:             safeStr(item.ItemNumber) || safeStr(item.SKU),
      product_name:    safeStr(item.Title) || safeStr(item.ItemName),
      category:        '',
      variant:         '',
      supplier:        '',
      units_sold:      qty,
      selling_price:   price,
      discount:        0,
      gross_revenue:   grossRev,
      net_revenue:     grossRev,
      cost_price:      cost,
      shipping_cost:   0,
      packaging_cost:  0,
      marketplace_fee: 0,
      tax:             0,
      total_cost:      totalCost,
      gross_margin:    grossRev > 0 ? Math.round(((grossRev - totalCost) / grossRev) * 10000) / 100 : 0,
      net_margin:      grossRev > 0 ? Math.round(((grossRev - totalCost) / grossRev) * 10000) / 100 : 0,
      stock_level:     0,
      stock_movement:  -qty,
      low_stock_flag:  false,
      damaged_stock:   0,
      channel,
      customer_region: '',
      currency,
      ad_spend:        0,
      campaign:        '',
      coupon_code:     '',
      coupon_discount: 0,
      payment_status:  status,
      refund_amount:   0,
      payout_amount:   grossRev,
      source_record_id: `linnworks_order_${orderId}_item_${idx}`,
      source_type:     'linnworks',
      raw_data:        { order_id: orderId, ...item },
    }
  })
}
