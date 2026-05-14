// ============================================================
// SignalX Universal Data Normaliser
// Maps raw data from any source → unified model
// ============================================================

export interface UnifiedRecord {
  record_date: string
  sku: string
  product_name: string
  category: string
  variant: string
  supplier: string
  units_sold: number
  selling_price: number
  discount: number
  gross_revenue: number
  net_revenue: number
  cost_price: number
  shipping_cost: number
  packaging_cost: number
  marketplace_fee: number
  tax: number
  total_cost: number
  gross_margin: number
  net_margin: number
  stock_level: number
  stock_movement: number
  low_stock_flag: boolean
  damaged_stock: number
  channel: string
  customer_region: string
  currency: string
  ad_spend: number
  campaign: string
  coupon_code: string
  coupon_discount: number
  payment_status: string
  refund_amount: number
  payout_amount: number
  source_record_id: string
  source_type: string
  raw_data: Record<string, unknown>
}

function calcMargin(revenue: number, cost: number): number {
  if (!revenue || revenue === 0) return 0
  return Math.round(((revenue - cost) / revenue) * 100 * 100) / 100
}

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

// ── SHOPIFY ───────────────────────────────────────────────────
// Maps Shopify orders API response
export function normaliseShopify(order: Record<string, unknown>): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  const lineItems = (order.line_items as Record<string, unknown>[]) || []
  const currency = safeStr(order.currency) || 'USD'
  const region = safeStr((order.shipping_address as Record<string, unknown>)?.country_code)
  const paymentStatus = safeStr(order.financial_status)
  const discount = safeNum((order.total_discounts as string))
  const shippingCost = safeNum(((order.shipping_lines as Record<string, unknown>[])?.[0] as Record<string, unknown>)?.price)
  const tax = safeNum(order.total_tax as string)

  for (const item of lineItems) {
    const qty = safeNum(item.quantity)
    const price = safeNum(item.price)
    const totalPrice = qty * price
    const itemDiscount = safeNum(item.total_discount)
    const netRev = totalPrice - itemDiscount
    const costPrice = safeNum((item.cost as Record<string, unknown>)?.amount) // from inventory cost API
    const marketplaceFee = netRev * 0.02 // Shopify 2% transaction fee estimate

    records.push({
      record_date: safeDate(order.created_at),
      sku: safeStr(item.sku) || safeStr(item.variant_id),
      product_name: safeStr(item.name) || safeStr(item.title),
      category: safeStr((item.properties as Record<string, unknown>[])?.[0]?.value) || '',
      variant: safeStr(item.variant_title),
      supplier: '',
      units_sold: qty,
      selling_price: price,
      discount: itemDiscount,
      gross_revenue: totalPrice,
      net_revenue: netRev,
      cost_price: costPrice,
      shipping_cost: shippingCost / lineItems.length,
      packaging_cost: 0,
      marketplace_fee: marketplaceFee,
      tax: tax / lineItems.length,
      total_cost: costPrice + (shippingCost / lineItems.length) + marketplaceFee + (tax / lineItems.length),
      gross_margin: calcMargin(netRev, costPrice),
      net_margin: calcMargin(netRev, costPrice + (shippingCost / lineItems.length) + marketplaceFee),
      stock_level: safeNum((item.inventory_quantity as number)),
      stock_movement: -qty,
      low_stock_flag: safeNum(item.inventory_quantity as number) < 10,
      damaged_stock: 0,
      channel: 'shopify',
      customer_region: region,
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: safeStr((order.discount_codes as Record<string, unknown>[])?.[0]?.code),
      coupon_discount: discount,
      payment_status: paymentStatus,
      refund_amount: 0,
      payout_amount: netRev,
      source_record_id: `shopify_order_${order.id}_item_${item.id}`,
      source_type: 'shopify',
      raw_data: { order_id: order.id, item_id: item.id, ...item },
    })
  }
  return records
}

// ── STRIPE ────────────────────────────────────────────────────
// Maps Stripe payment intents / charges
export function normaliseStripe(payment: Record<string, unknown>): UnifiedRecord {
  const amount = safeNum(payment.amount) / 100 // Stripe amounts in cents
  const fee = safeNum((payment.application_fee_amount as number)) / 100
  const refunded = safeNum((payment.amount_refunded as number)) / 100
  const meta = (payment.metadata as Record<string, unknown>) || {}

  return {
    record_date: safeDate(new Date(safeNum(payment.created) * 1000)),
    sku: safeStr(meta.sku) || safeStr(meta.product_id),
    product_name: safeStr(meta.product_name) || safeStr((payment.description as string)),
    category: safeStr(meta.category),
    variant: safeStr(meta.variant),
    supplier: '',
    units_sold: safeNum(meta.quantity) || 1,
    selling_price: amount,
    discount: 0,
    gross_revenue: amount,
    net_revenue: amount - refunded,
    cost_price: safeNum(meta.cost_price),
    shipping_cost: 0,
    packaging_cost: 0,
    marketplace_fee: fee,
    tax: safeNum((payment.calculated_statement_descriptor as string)),
    total_cost: fee + safeNum(meta.cost_price),
    gross_margin: calcMargin(amount - refunded, safeNum(meta.cost_price)),
    net_margin: calcMargin(amount - refunded, fee + safeNum(meta.cost_price)),
    stock_level: 0,
    stock_movement: -1,
    low_stock_flag: false,
    damaged_stock: 0,
    channel: 'stripe',
    customer_region: safeStr((payment.billing_details as Record<string, unknown>)?.address?.country),
    currency: safeStr(payment.currency).toUpperCase() || 'USD',
    ad_spend: 0,
    campaign: safeStr(meta.campaign),
    coupon_code: safeStr(meta.coupon),
    coupon_discount: 0,
    payment_status: safeStr(payment.status),
    refund_amount: refunded,
    payout_amount: amount - fee - refunded,
    source_record_id: `stripe_${payment.id}`,
    source_type: 'stripe',
    raw_data: payment,
  }
}

// ── SQUARE ────────────────────────────────────────────────────
// Maps Square orders
export function normaliseSquare(order: Record<string, unknown>): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  const lineItems = (order.line_items as Record<string, unknown>[]) || []
  const currency = safeStr((order.total_money as Record<string, unknown>)?.currency) || 'USD'

  for (const item of lineItems) {
    const qty = safeNum(item.quantity)
    const basePriceMoney = (item.base_price_money as Record<string, unknown>) || {}
    const price = safeNum(basePriceMoney.amount) / 100
    const grossRev = qty * price
    const discount = safeNum((item.total_discount_money as Record<string, unknown>)?.amount) / 100
    const netRev = grossRev - discount
    const tax = safeNum((item.total_tax_money as Record<string, unknown>)?.amount) / 100

    records.push({
      record_date: safeDate(order.created_at),
      sku: safeStr((item.catalog_object_id as string)),
      product_name: safeStr(item.name),
      category: safeStr((item.variation_name as string)),
      variant: safeStr(item.variation_name),
      supplier: '',
      units_sold: qty,
      selling_price: price,
      discount,
      gross_revenue: grossRev,
      net_revenue: netRev,
      cost_price: 0,
      shipping_cost: 0,
      packaging_cost: 0,
      marketplace_fee: 0,
      tax,
      total_cost: tax,
      gross_margin: calcMargin(netRev, 0),
      net_margin: calcMargin(netRev, tax),
      stock_level: 0,
      stock_movement: -qty,
      low_stock_flag: false,
      damaged_stock: 0,
      channel: 'square',
      customer_region: '',
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: 0,
      payment_status: safeStr(order.state),
      refund_amount: 0,
      payout_amount: netRev,
      source_record_id: `square_order_${order.id}_item_${item.uid}`,
      source_type: 'square',
      raw_data: { order_id: order.id, ...item },
    })
  }
  return records
}

// ── QUICKBOOKS ───────────────────────────────────────────────
// Maps QuickBooks P&L / invoice lines
export function normaliseQuickBooks(invoice: Record<string, unknown>): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  const lines = (invoice.Line as Record<string, unknown>[]) || []
  const currency = safeStr((invoice.CurrencyRef as Record<string, unknown>)?.value) || 'USD'

  for (const line of lines) {
    if (safeStr(line.DetailType) !== 'SalesItemLineDetail') continue
    const detail = (line.SalesItemLineDetail as Record<string, unknown>) || {}
    const qty = safeNum(detail.Qty)
    const price = safeNum(detail.UnitPrice)
    const grossRev = safeNum(line.Amount)

    records.push({
      record_date: safeDate(invoice.TxnDate),
      sku: safeStr((detail.ItemRef as Record<string, unknown>)?.value),
      product_name: safeStr((detail.ItemRef as Record<string, unknown>)?.name),
      category: '',
      variant: '',
      supplier: safeStr((invoice.VendorRef as Record<string, unknown>)?.name),
      units_sold: qty,
      selling_price: price,
      discount: safeNum(invoice.DiscountAmt),
      gross_revenue: grossRev,
      net_revenue: grossRev - safeNum(invoice.DiscountAmt),
      cost_price: 0,
      shipping_cost: 0,
      packaging_cost: 0,
      marketplace_fee: 0,
      tax: safeNum((invoice.TxnTaxDetail as Record<string, unknown>)?.TotalTax),
      total_cost: safeNum((invoice.TxnTaxDetail as Record<string, unknown>)?.TotalTax),
      gross_margin: 0,
      net_margin: 0,
      stock_level: 0,
      stock_movement: -qty,
      low_stock_flag: false,
      damaged_stock: 0,
      channel: 'quickbooks',
      customer_region: safeStr((invoice.BillAddr as Record<string, unknown>)?.Country),
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: 0,
      payment_status: safeStr(invoice.EmailStatus),
      refund_amount: 0,
      payout_amount: grossRev,
      source_record_id: `qb_invoice_${invoice.Id}_line_${line.Id}`,
      source_type: 'quickbooks',
      raw_data: { invoice_id: invoice.Id, ...line },
    })
  }
  return records
}

// ── GOOGLE SHEETS ────────────────────────────────────────────
// Maps a generic spreadsheet into unified model
// Tries to auto-detect columns by name
export function normaliseGoogleSheets(
  rows: Record<string, unknown>[],
  sourceId: string
): UnifiedRecord[] {
  if (!rows.length) return []
  const headers = Object.keys(rows[0]).map(h => h.toLowerCase())

  const col = (patterns: RegExp) => headers.find(h => patterns.test(h)) || ''

  const dateCol     = col(/date|day|created|order.date/i)
  const skuCol      = col(/sku|product.id|item.id|code/i)
  const nameCol     = col(/name|product|item|description/i)
  const categoryCol = col(/category|cat|type|dept/i)
  const qtyCol      = col(/qty|quantity|units|sold|volume/i)
  const priceCol    = col(/price|selling.price|unit.price|revenue|amount/i)
  const costCol     = col(/cost|cost.price|purchase.price|cogs/i)
  const stockCol    = col(/stock|inventory|on.hand|balance/i)
  const marginCol   = col(/margin/i)
  const discountCol = col(/discount|promo/i)
  const regionCol   = col(/region|country|location|area/i)
  const channelCol  = col(/channel|source|platform/i)
  const adSpendCol  = col(/ad.spend|ads|marketing.spend/i)
  const campaignCol = col(/campaign/i)
  const feeCol      = col(/fee|commission|marketplace/i)
  const shippingCol = col(/shipping|delivery/i)

  return rows.map((row, i) => {
    const qty      = safeNum(row[qtyCol])
    const price    = safeNum(row[priceCol])
    const cost     = safeNum(row[costCol])
    const disc     = safeNum(row[discountCol])
    const grossRev = qty > 0 && price > 0 ? qty * price : price
    const netRev   = grossRev - disc
    const margin   = marginCol && safeNum(row[marginCol]) > 0
      ? safeNum(row[marginCol])
      : calcMargin(netRev, cost)
    const stock    = safeNum(row[stockCol])
    const fee      = safeNum(row[feeCol])
    const shipping = safeNum(row[shippingCol])

    return {
      record_date:     dateCol ? safeDate(row[dateCol]) : new Date().toISOString().split('T')[0],
      sku:             skuCol ? safeStr(row[skuCol]) : `row_${i}`,
      product_name:    nameCol ? safeStr(row[nameCol]) : `Item ${i + 1}`,
      category:        categoryCol ? safeStr(row[categoryCol]) : '',
      variant:         '',
      supplier:        '',
      units_sold:      qty,
      selling_price:   price,
      discount:        disc,
      gross_revenue:   grossRev,
      net_revenue:     netRev,
      cost_price:      cost,
      shipping_cost:   shipping,
      packaging_cost:  0,
      marketplace_fee: fee,
      tax:             0,
      total_cost:      cost + shipping + fee,
      gross_margin:    margin,
      net_margin:      calcMargin(netRev, cost + shipping + fee),
      stock_level:     stock,
      stock_movement:  -qty,
      low_stock_flag:  stock > 0 && stock < 10,
      damaged_stock:   0,
      channel:         channelCol ? safeStr(row[channelCol]) : 'sheets',
      customer_region: regionCol ? safeStr(row[regionCol]) : '',
      currency:        'USD',
      ad_spend:        adSpendCol ? safeNum(row[adSpendCol]) : 0,
      campaign:        campaignCol ? safeStr(row[campaignCol]) : '',
      coupon_code:     '',
      coupon_discount: 0,
      payment_status:  'paid',
      refund_amount:   0,
      payout_amount:   netRev,
      source_record_id: `sheets_${sourceId}_row_${i}`,
      source_type:     'google_sheets',
      raw_data:        row,
    }
  })
}

// ── CSV/XLSX (manual upload) ──────────────────────────────────
// Same as Google Sheets normaliser but from uploaded file
export function normaliseCSV(
  rows: Record<string, unknown>[],
  filename: string
): UnifiedRecord[] {
  const sourceId = filename.replace(/[^a-z0-9]/gi, '_')
  return normaliseGoogleSheets(rows, sourceId).map(r => ({
    ...r,
    channel: 'manual_csv',
    source_type: 'manual_csv',
    source_record_id: r.source_record_id.replace('sheets', 'csv'),
  }))
}
