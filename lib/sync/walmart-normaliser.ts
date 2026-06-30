import { UnifiedRecord } from './normaliser'

function safeNum(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function safeStr(v: unknown): string {
  return v ? String(v).trim() : ''
}

function epochToDate(ms: unknown): string {
  const n = safeNum(ms)
  if (!n) return new Date().toISOString().split('T')[0]
  try { return new Date(n).toISOString().split('T')[0] }
  catch { return new Date().toISOString().split('T')[0] }
}

function sumCharges(charges: Record<string, unknown>[], type: string): number {
  return charges
    .filter(c => safeStr(c.chargeType) === type)
    .reduce((sum, c) => sum + safeNum((c.chargeAmount as Record<string, unknown>)?.amount), 0)
}

function sumTax(charges: Record<string, unknown>[]): number {
  return charges.reduce((sum, c) => {
    const tax = c.tax as Record<string, unknown> | undefined
    return sum + safeNum((tax?.taxAmount as Record<string, unknown>)?.amount)
  }, 0)
}

export function normaliseWalmartOrder(order: Record<string, unknown>): UnifiedRecord[] {
  const orderId   = safeStr(order.purchaseOrderId)
  const recordDate = epochToDate(order.orderDate)
  const status    = safeStr(order.status) || 'Created'
  const addr      = (order.shippingInfo as Record<string, unknown>)?.postalAddress as Record<string, unknown> | undefined
  const region    = safeStr(addr?.country) || 'US'

  const lineItems = (
    (order.orderLines as Record<string, unknown>)?.orderLine as Record<string, unknown>[]
  ) || []

  if (lineItems.length === 0) return []

  return lineItems.map((line, idx) => {
    const item      = (line.item as Record<string, unknown>) || {}
    const qty       = safeNum((line.orderLineQuantity as Record<string, unknown>)?.amount) || 1
    const charges   = ((line.charges as Record<string, unknown>)?.charge as Record<string, unknown>[]) || []
    const price     = sumCharges(charges, 'PRODUCT')
    const shipping  = sumCharges(charges, 'SHIPPING')
    const tax       = sumTax(charges)
    const grossRev  = price
    const fee       = grossRev * 0.08  // Walmart referral fee ~8%
    const netRev    = grossRev - fee

    const lineStatus = ((line.orderLineStatuses as Record<string, unknown>)
      ?.orderLineStatus as Record<string, unknown>[])?.[0]?.status
    const effectiveStatus = safeStr(lineStatus) || status

    return {
      record_date:     recordDate,
      sku:             safeStr(item.sku),
      product_name:    safeStr(item.productName),
      category:        '',
      variant:         '',
      supplier:        '',
      units_sold:      qty,
      selling_price:   price / Math.max(qty, 1),
      discount:        0,
      gross_revenue:   grossRev,
      net_revenue:     netRev,
      cost_price:      0,
      shipping_cost:   shipping,
      packaging_cost:  0,
      marketplace_fee: fee,
      tax,
      total_cost:      shipping + fee + tax,
      gross_margin:    grossRev > 0 ? Math.round(((grossRev - fee) / grossRev) * 10000) / 100 : 0,
      net_margin:      netRev > 0 ? Math.round(((netRev - shipping - tax) / netRev) * 10000) / 100 : 0,
      stock_level:     0,
      stock_movement:  -qty,
      low_stock_flag:  false,
      damaged_stock:   0,
      channel:         'walmart',
      customer_region: region,
      currency:        'USD',
      ad_spend:        0,
      campaign:        '',
      coupon_code:     '',
      coupon_discount: 0,
      payment_status:  effectiveStatus,
      refund_amount:   0,
      payout_amount:   netRev - shipping - tax,
      source_record_id: `walmart_order_${orderId}_line_${line.lineNumber ?? idx}`,
      source_type:     'walmart',
      raw_data:        { order_id: orderId, ...line },
    }
  })
}
