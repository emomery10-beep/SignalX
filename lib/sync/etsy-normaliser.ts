// Etsy receipt/transaction → UnifiedRecord normaliser
import { UnifiedRecord } from './normaliser'

function safeNum(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function safeStr(v: unknown): string {
  return v ? String(v).trim() : ''
}

// Etsy prices are in smallest currency unit (cents) with a divisor
function etsyPrice(price: unknown): number {
  if (!price || typeof price !== 'object') return 0
  const p = price as Record<string, unknown>
  const amount = safeNum(p.amount)
  const divisor = safeNum(p.divisor) || 100
  return amount / divisor
}

export function normaliseEtsyReceipt(receipt: Record<string, unknown>): UnifiedRecord[] {
  const receiptId = safeStr(receipt.receipt_id)
  const createdAt = safeNum(receipt.create_timestamp)
  const recordDate = createdAt
    ? new Date(createdAt * 1000).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  const grandTotal = etsyPrice(receipt.grandtotal)
  const subtotal = etsyPrice(receipt.subtotal)
  const totalShipping = etsyPrice(receipt.total_shipping_cost)
  const totalTax = etsyPrice(receipt.total_tax_cost)
  const discountAmt = etsyPrice(receipt.discount_amt)
  const currency = safeStr((receipt.grandtotal as Record<string, unknown>)?.currency_code) || 'USD'

  const paymentStatus = receipt.was_paid ? 'PAID' : 'UNPAID'
  const country = safeStr(receipt.country_iso)

  const transactions = (receipt.transactions || []) as Record<string, unknown>[]

  if (transactions.length === 0) {
    return [{
      record_date: recordDate,
      sku: '',
      product_name: 'Etsy Order',
      category: '',
      variant: '',
      supplier: '',
      units_sold: 1,
      selling_price: subtotal,
      discount: discountAmt,
      gross_revenue: grandTotal,
      net_revenue: subtotal - totalShipping,
      cost_price: 0,
      shipping_cost: totalShipping,
      packaging_cost: 0,
      marketplace_fee: 0,
      tax: totalTax,
      total_cost: totalShipping,
      gross_margin: 0,
      net_margin: 0,
      stock_level: 0,
      stock_movement: -1,
      low_stock_flag: false,
      damaged_stock: 0,
      channel: 'etsy',
      customer_region: country,
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: discountAmt,
      payment_status: paymentStatus,
      refund_amount: 0,
      payout_amount: grandTotal,
      source_record_id: receiptId,
      source_type: 'etsy',
      raw_data: receipt,
    }]
  }

  return transactions.map((txn, idx) => {
    const title = safeStr(txn.title)
    const quantity = safeNum(txn.quantity) || 1
    const price = etsyPrice(txn.price)
    const shippingCost = etsyPrice(txn.shipping_cost)
    const totalPrice = price * quantity
    const totalCost = shippingCost
    const grossMargin = totalPrice > 0
      ? Math.round(((totalPrice - totalCost) / totalPrice) * 100 * 100) / 100
      : 0

    return {
      record_date: recordDate,
      sku: safeStr(txn.listing_id),
      product_name: title,
      category: safeStr(txn.taxonomy_category),
      variant: safeStr(txn.variations),
      supplier: '',
      units_sold: quantity,
      selling_price: price,
      discount: 0,
      gross_revenue: totalPrice,
      net_revenue: totalPrice - totalCost,
      cost_price: 0,
      shipping_cost: shippingCost,
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
      channel: 'etsy',
      customer_region: country,
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: 0,
      payment_status: paymentStatus,
      refund_amount: 0,
      payout_amount: totalPrice,
      source_record_id: `${receiptId}-${idx}`,
      source_type: 'etsy',
      raw_data: txn,
    }
  })
}
