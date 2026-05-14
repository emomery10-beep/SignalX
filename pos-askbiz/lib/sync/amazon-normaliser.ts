// Amazon FBA normaliser — SP-API responses
import type { UnifiedRecord } from './normaliser'

function safeNum(v: unknown): number { const n = Number(v); return isNaN(n) ? 0 : n }
function safeStr(v: unknown): string { return v ? String(v).trim() : '' }
function safeDate(v: unknown): string {
  if (!v) return new Date().toISOString().split('T')[0]
  try { return new Date(String(v)).toISOString().split('T')[0] } catch { return new Date().toISOString().split('T')[0] }
}
function calcMargin(rev: number, cost: number): number {
  if (!rev) return 0
  return Math.round(((rev - cost) / rev) * 10000) / 100
}

// Normalise Amazon FBA order items
export function normaliseAmazonOrder(order: Record<string, unknown>): UnifiedRecord[] {
  const items = (order.OrderItems as Record<string, unknown>[]) || []
  const currency = safeStr((order.OrderTotal as Record<string, unknown>)?.CurrencyCode) || 'USD'
  const region = safeStr(order.ShipServiceLevel) || ''

  return items.map(item => {
    const qty = safeNum(item.QuantityOrdered)
    const price = safeNum((item.ItemPrice as Record<string, unknown>)?.Amount)
    const discount = safeNum((item.PromotionDiscount as Record<string, unknown>)?.Amount)
    const tax = safeNum((item.ItemTax as Record<string, unknown>)?.Amount)
    const shippingPrice = safeNum((item.ShippingPrice as Record<string, unknown>)?.Amount)
    const fbaFee = safeNum((item.FulfillmentFee as Record<string, unknown>)?.Amount) || price * 0.15
    const netRev = price - discount
    const totalCost = fbaFee + tax

    return {
      record_date: safeDate(order.PurchaseDate),
      sku: safeStr(item.SellerSKU),
      product_name: safeStr(item.Title),
      category: safeStr(item.ProductInfo),
      variant: safeStr(item.VariationParentASIN),
      supplier: 'Amazon FBA',
      units_sold: qty,
      selling_price: price / (qty || 1),
      discount,
      gross_revenue: price,
      net_revenue: netRev,
      cost_price: 0, // Would need inventory cost API
      shipping_cost: shippingPrice,
      packaging_cost: 0,
      marketplace_fee: fbaFee,
      tax,
      total_cost: totalCost,
      gross_margin: calcMargin(netRev, fbaFee),
      net_margin: calcMargin(netRev, totalCost),
      stock_level: 0,
      stock_movement: -qty,
      low_stock_flag: false,
      damaged_stock: 0,
      channel: 'amazon_fba',
      customer_region: safeStr(order.ShipCountry) || region,
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: discount,
      payment_status: safeStr(order.OrderStatus),
      refund_amount: 0,
      payout_amount: netRev - fbaFee,
      source_record_id: `amazon_${order.AmazonOrderId}_${item.ASIN}`,
      source_type: 'amazon_fba',
      raw_data: { order_id: order.AmazonOrderId, ...item },
    }
  })
}

// Normalise Amazon FBA inventory
export function normaliseAmazonInventory(item: Record<string, unknown>): Partial<UnifiedRecord> {
  return {
    sku: safeStr(item.SellerSku),
    product_name: safeStr(item.ProductName) || safeStr(item.SellerSku),
    stock_level: safeNum((item.TotalQuantity as number)),
    low_stock_flag: safeNum(item.TotalQuantity as number) < 10,
    channel: 'amazon_fba',
    source_type: 'amazon_fba',
    source_record_id: `amazon_inventory_${item.SellerSku}`,
  }
}
