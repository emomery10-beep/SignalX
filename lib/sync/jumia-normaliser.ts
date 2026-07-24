// Jumia Vendor Center normaliser — GOP order items + GPM stock responses
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

// Normalise one Jumia order item (GET /orders/items) against its parent order
// header (GET /orders). Jumia's model is one row per unit — a 3-unit line
// item on the storefront comes back as 3 separate order items, so
// units_sold is always 1 here rather than a quantity field (none exists).
export function normaliseJumiaOrderItem(order: Record<string, unknown>, item: Record<string, unknown>): UnifiedRecord {
  const product = (item.product as Record<string, unknown>) || {}
  const country = (item.country as Record<string, unknown>) || (order.country as Record<string, unknown>) || {}
  const currency = safeStr(country.currencyCode) || 'USD'

  const paidPrice = safeNum(item.paidPriceLocal ?? item.paidPrice)
  const shipping  = safeNum(item.shippingAmountLocal ?? item.shippingAmount)
  const tax       = safeNum(item.taxAmount)
  const voucher   = safeNum(item.voucherAmount)
  const netRev    = paidPrice - voucher

  return {
    record_date: safeDate(order.createdAt),
    sku: safeStr(product.sellerSku),
    product_name: safeStr(product.name) || safeStr(product.sellerSku),
    category: '',
    variant: '',
    supplier: 'Jumia',
    units_sold: 1,
    selling_price: paidPrice,
    discount: voucher,
    gross_revenue: paidPrice,
    net_revenue: netRev,
    cost_price: 0,
    shipping_cost: shipping,
    packaging_cost: 0,
    marketplace_fee: 0, // Not exposed on this endpoint — real commission only appears on /payout-statement
    tax,
    total_cost: tax,
    gross_margin: calcMargin(netRev, 0),
    net_margin: calcMargin(netRev, tax),
    stock_level: 0,
    stock_movement: -1,
    low_stock_flag: false,
    damaged_stock: 0,
    channel: 'jumia',
    customer_region: safeStr(country.name),
    currency,
    ad_spend: 0,
    campaign: '',
    coupon_code: '',
    coupon_discount: voucher,
    payment_status: safeStr(item.status) || safeStr(order.status),
    refund_amount: 0,
    payout_amount: netRev,
    source_record_id: `jumia_${safeStr(item.id) || `${safeStr(order.id)}_${safeStr(product.sellerSku)}`}`,
    source_type: 'jumia',
    raw_data: { order_id: order.id, order_number: order.number, ...item },
  }
}

// Normalise a Jumia stock row (GET /catalog/stock) — no product name on this
// endpoint, so it falls back to the SKU until a catalog lookup joins it.
export function normaliseJumiaStock(stockItem: Record<string, unknown>): UnifiedRecord {
  const qty = safeNum(stockItem.globalStock)
  const sku = safeStr(stockItem.sellerSku)

  return {
    record_date: new Date().toISOString().split('T')[0],
    sku,
    product_name: sku,
    category: '',
    variant: '',
    supplier: 'Jumia',
    units_sold: 0,
    selling_price: 0,
    discount: 0,
    gross_revenue: 0,
    net_revenue: 0,
    cost_price: 0,
    shipping_cost: 0,
    packaging_cost: 0,
    marketplace_fee: 0,
    tax: 0,
    total_cost: 0,
    gross_margin: 0,
    net_margin: 0,
    stock_level: qty,
    stock_movement: 0,
    low_stock_flag: qty > 0 && qty < 10,
    damaged_stock: 0,
    channel: 'jumia',
    customer_region: '',
    currency: '',
    ad_spend: 0,
    campaign: '',
    coupon_code: '',
    coupon_discount: 0,
    payment_status: 'inventory',
    refund_amount: 0,
    payout_amount: 0,
    source_record_id: `jumia_inventory_${sku}`,
    source_type: 'jumia',
    raw_data: stockItem,
  }
}
