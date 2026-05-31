// eBay order → UnifiedRecord normaliser
import { UnifiedRecord } from './normaliser'

function safeNum(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function safeStr(v: unknown): string {
  return v ? String(v).trim() : ''
}

export function normaliseEbayOrder(order: Record<string, unknown>): UnifiedRecord[] {
  const orderId = safeStr(order.orderId)
  const creationDate = safeStr(order.creationDate)
  const recordDate = creationDate ? creationDate.split('T')[0] : new Date().toISOString().split('T')[0]

  const buyer = order.buyer as Record<string, unknown> | undefined
  const buyerUsername = safeStr(buyer?.username)

  const pricingSummary = order.pricingSummary as Record<string, unknown> | undefined
  const totalValue = pricingSummary?.total as Record<string, unknown> | undefined
  const currency = safeStr(totalValue?.currency) || 'USD'

  const fulfillmentCost = pricingSummary?.deliveryCost as Record<string, unknown> | undefined
  const shippingCost = safeNum(fulfillmentCost?.value)

  const lineItems = (order.lineItems || []) as Record<string, unknown>[]
  const paymentStatus = safeStr(order.orderPaymentStatus) || 'UNKNOWN'

  const address = order.fulfillmentStartInstructions as Record<string, unknown>[] | undefined
  const shipTo = address?.[0]?.shippingStep as Record<string, unknown> | undefined
  const shipAddr = shipTo?.shipTo as Record<string, unknown> | undefined
  const region = safeStr(
    (shipAddr?.contactAddress as Record<string, unknown>)?.countryCode
  ) || ''

  if (lineItems.length === 0) {
    const totalAmount = safeNum(totalValue?.value)
    return [{
      record_date: recordDate,
      sku: '',
      product_name: 'eBay Order',
      category: '',
      variant: '',
      supplier: '',
      units_sold: 1,
      selling_price: totalAmount,
      discount: 0,
      gross_revenue: totalAmount,
      net_revenue: totalAmount - shippingCost,
      cost_price: 0,
      shipping_cost: shippingCost,
      packaging_cost: 0,
      marketplace_fee: 0,
      tax: 0,
      total_cost: shippingCost,
      gross_margin: 0,
      net_margin: 0,
      stock_level: 0,
      stock_movement: -1,
      low_stock_flag: false,
      damaged_stock: 0,
      channel: 'ebay',
      customer_region: region,
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: 0,
      payment_status: paymentStatus,
      refund_amount: 0,
      payout_amount: totalAmount,
      source_record_id: orderId,
      source_type: 'ebay',
      raw_data: order,
    }]
  }

  return lineItems.map((item, idx) => {
    const title = safeStr(item.title)
    const sku = safeStr(item.sku) || safeStr(item.legacyItemId)
    const quantity = safeNum(item.quantity) || 1
    const linePrice = item.lineItemCost as Record<string, unknown> | undefined
    const unitPrice = safeNum(linePrice?.value)
    const totalPrice = unitPrice * quantity
    const itemShipping = lineItems.length === 1 ? shippingCost : 0

    const deliveryCost = item.deliveryCost as Record<string, unknown> | undefined
    const itemShipCost = deliveryCost ? safeNum((deliveryCost.shippingCost as Record<string, unknown>)?.value) : itemShipping

    const totalCost = itemShipCost
    const netRevenue = totalPrice - totalCost
    const grossMargin = totalPrice > 0 ? Math.round(((totalPrice - totalCost) / totalPrice) * 100 * 100) / 100 : 0

    return {
      record_date: recordDate,
      sku,
      product_name: title,
      category: '',
      variant: '',
      supplier: '',
      units_sold: quantity,
      selling_price: unitPrice,
      discount: 0,
      gross_revenue: totalPrice,
      net_revenue: netRevenue,
      cost_price: 0,
      shipping_cost: itemShipCost,
      packaging_cost: 0,
      marketplace_fee: 0,
      tax: 0,
      total_cost: totalCost,
      gross_margin: grossMargin,
      net_margin: grossMargin,
      stock_level: 0,
      stock_movement: -quantity,
      low_stock_flag: false,
      damaged_stock: 0,
      channel: 'ebay',
      customer_region: region,
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: 0,
      payment_status: paymentStatus,
      refund_amount: 0,
      payout_amount: totalPrice,
      source_record_id: `${orderId}-${idx}`,
      source_type: 'ebay',
      raw_data: item,
    }
  })
}
