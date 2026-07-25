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
// Maps Shopify GraphQL Admin API order nodes → UnifiedRecord[]
export function normaliseShopify(order: Record<string, unknown>): UnifiedRecord[] {
  const records: UnifiedRecord[] = []

  // GraphQL field paths (camelCase, nested edges/nodes)
  const lineItemEdges = ((order.lineItems as Record<string, unknown>)
    ?.edges as { node: Record<string, unknown> }[]) || []
  const currency = safeStr(order.currencyCode) || 'USD'
  const region = safeStr((order.shippingAddress as Record<string, unknown>)?.countryCodeV2)
  const paymentStatus = safeStr(order.displayFinancialStatus)
  const discount = safeNum(
    ((order.totalDiscountsSet as Record<string, unknown>)
      ?.shopMoney as Record<string, unknown>)?.amount
  )
  const shippingEdge = ((order.shippingLines as Record<string, unknown>)
    ?.edges as { node: Record<string, unknown> }[])?.[0]
  const shippingCost = safeNum(
    ((shippingEdge?.node?.originalPriceSet as Record<string, unknown>)
      ?.shopMoney as Record<string, unknown>)?.amount
  )
  const tax = safeNum(
    ((order.totalTaxSet as Record<string, unknown>)
      ?.shopMoney as Record<string, unknown>)?.amount
  )
  const discountCode = safeStr((order.discountCodes as string[])?.[0])
  const count = lineItemEdges.length || 1

  for (const edge of lineItemEdges) {
    const item = edge.node
    const variant = (item.variant as Record<string, unknown>) || {}
    const qty = safeNum(item.quantity)
    const price = safeNum(
      ((item.originalUnitPriceSet as Record<string, unknown>)
        ?.shopMoney as Record<string, unknown>)?.amount
    )
    const totalPrice = qty * price
    const itemDiscount = safeNum(
      ((item.totalDiscountSet as Record<string, unknown>)
        ?.shopMoney as Record<string, unknown>)?.amount
    )
    const netRev = totalPrice - itemDiscount
    const costPrice = safeNum(
      ((variant.inventoryItem as Record<string, unknown>)
        ?.unitCost as Record<string, unknown>)?.amount
    )
    const marketplaceFee = netRev * 0.02

    records.push({
      record_date: safeDate(order.createdAt),
      sku: safeStr(variant.sku) || safeStr(variant.id),
      product_name: safeStr(item.name),
      category: '',
      variant: safeStr(variant.title) === 'Default Title' ? '' : safeStr(variant.title),
      supplier: '',
      units_sold: qty,
      selling_price: price,
      discount: itemDiscount,
      gross_revenue: totalPrice,
      net_revenue: netRev,
      cost_price: costPrice,
      shipping_cost: shippingCost / count,
      packaging_cost: 0,
      marketplace_fee: marketplaceFee,
      tax: tax / count,
      total_cost: costPrice + (shippingCost / count) + marketplaceFee + (tax / count),
      gross_margin: calcMargin(netRev, costPrice),
      net_margin: calcMargin(netRev, costPrice + (shippingCost / count) + marketplaceFee),
      stock_level: safeNum(variant.inventoryQuantity),
      stock_movement: -qty,
      low_stock_flag: safeNum(variant.inventoryQuantity) < 10,
      damaged_stock: 0,
      channel: 'shopify',
      customer_region: region,
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: discountCode,
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
    customer_region: safeStr((payment.billing_details as any)?.address?.country),
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

// ── ASKBIZ POS ────────────────────────────────────────────────
// Maps AskBiz POS transactions (pos.askbiz.co) → unified sales records.
// Same Supabase project as the main app, so this has no external API
// shape to normalise from — just our own pos_transactions/pos_items rows.
export function normaliseAskBizPOS(
  tx: Record<string, unknown>,
  items: Record<string, unknown>[],
  inventoryById: Map<string, { stock_qty: number; low_stock_threshold: number; sku: string }>,
  currency: string
): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  const paymentStatus = safeStr(tx.status)
  const isRefund = paymentStatus === 'refunded' || paymentStatus === 'partially_refunded'
  const itemCount = items.length || 1
  const taxShare = safeNum(tx.tax_amount) / itemCount
  const discountShare = safeNum(tx.discount_amount) / itemCount

  for (const item of items) {
    if (item.refunded) continue
    const qty = safeNum(item.qty) || 1
    const price = safeNum(item.unit_price)
    const costPrice = safeNum(item.cost_price) * qty
    const grossRev = qty * price
    const netRev = safeNum(item.line_total) || grossRev
    const inv = inventoryById.get(safeStr(item.inventory_id))

    records.push({
      record_date: safeDate(tx.created_at),
      sku: inv?.sku || '',
      product_name: safeStr(item.name),
      category: '',
      variant: '',
      supplier: '',
      units_sold: qty,
      selling_price: price,
      discount: discountShare,
      gross_revenue: grossRev,
      net_revenue: netRev,
      cost_price: costPrice,
      shipping_cost: 0,
      packaging_cost: 0,
      marketplace_fee: 0,
      tax: taxShare,
      total_cost: costPrice + taxShare,
      gross_margin: calcMargin(netRev, costPrice),
      net_margin: calcMargin(netRev, costPrice + taxShare),
      stock_level: inv?.stock_qty ?? 0,
      stock_movement: -qty,
      low_stock_flag: inv ? inv.stock_qty <= inv.low_stock_threshold : false,
      damaged_stock: 0,
      channel: 'pos',
      customer_region: '',
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: discountShare,
      payment_status: paymentStatus,
      refund_amount: isRefund ? netRev : 0,
      payout_amount: netRev,
      source_record_id: `pos_transaction_${tx.id}_item_${item.id}`,
      source_type: 'askbiz_pos',
      raw_data: { transaction_id: tx.id, ...item },
    })
  }
  return records
}

// ── QUICKBOOKS ───────────────────────────────────────────────
// Maps QuickBooks invoices → unified sales records
export function normaliseQuickBooks(invoice: Record<string, unknown>): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  const lines = (invoice.Line as Record<string, unknown>[]) || []
  const currency = safeStr((invoice.CurrencyRef as Record<string, unknown>)?.value) || 'USD'
  // Balance > 0 means the invoice has an outstanding amount owed
  const balance = safeNum(invoice.Balance)
  const totalAmt = safeNum(invoice.TotalAmt)
  const paymentStatus = balance > 0 ? (balance === totalAmt ? 'pending' : 'partially_paid') : 'paid'
  const customerName = safeStr((invoice.CustomerRef as Record<string, unknown>)?.name)

  for (const line of lines) {
    if (safeStr(line.DetailType) !== 'SalesItemLineDetail') continue
    const detail = (line.SalesItemLineDetail as Record<string, unknown>) || {}
    const qty = safeNum(detail.Qty)
    const price = safeNum(detail.UnitPrice)
    const grossRev = safeNum(line.Amount)

    records.push({
      record_date: safeDate(invoice.TxnDate),
      sku: safeStr((detail.ItemRef as Record<string, unknown>)?.value),
      product_name: safeStr((detail.ItemRef as Record<string, unknown>)?.name) || customerName,
      category: '',
      variant: '',
      supplier: customerName,
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
      payment_status: paymentStatus,
      refund_amount: 0,
      payout_amount: grossRev,
      source_record_id: `qb_invoice_${invoice.Id}_line_${line.Id}`,
      source_type: 'quickbooks',
      raw_data: { invoice_id: invoice.Id, doc_number: invoice.DocNumber, due_date: invoice.DueDate, balance, ...line },
    })
  }
  return records
}

// Maps QuickBooks Bills → cfo_expenses rows
export interface QBExpenseRow {
  vendor: string
  date: string
  amount: number
  category: string
  notes: string
  source_record_id: string
}

export function normaliseQuickBooksBill(bill: Record<string, unknown>): QBExpenseRow | null {
  const totalAmt = safeNum(bill.TotalAmt)
  if (!totalAmt) return null
  const vendorName = safeStr((bill.VendorRef as Record<string, unknown>)?.name) || 'Unknown vendor'
  // Derive a category from the first account line
  const lines = (bill.Line as Record<string, unknown>[]) || []
  let category = 'Other'
  for (const line of lines) {
    if (safeStr(line.DetailType) === 'AccountBasedExpenseLineDetail') {
      const acct = (line.AccountBasedExpenseLineDetail as Record<string, unknown>)
      category = safeStr((acct?.AccountRef as Record<string, unknown>)?.name) || 'Other'
      break
    }
  }
  return {
    vendor: vendorName,
    date: safeDate(bill.TxnDate) || new Date().toISOString().slice(0, 10),
    amount: totalAmt,
    category,
    notes: safeStr(bill.PrivateNote) || `QB Bill #${bill.DocNumber || bill.Id}`,
    source_record_id: `qb_bill_${bill.Id}`,
  }
}

// ── XERO ─────────────────────────────────────────────────────
// Xero's Invoices endpoint returns both sales invoices (Type: ACCREC) and
// bills (Type: ACCPAY) in one collection — the sync handler routes each to
// the right normaliser below based on Type, mirroring the QuickBooks split.

// Maps a Xero ACCREC (sales) invoice → unified sales records
export function normaliseXeroInvoice(invoice: Record<string, unknown>): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  const lines = (invoice.LineItems as Record<string, unknown>[]) || []
  const currency = safeStr(invoice.CurrencyCode) || 'GBP'
  const total = safeNum(invoice.Total)
  const amountDue = safeNum(invoice.AmountDue)
  const paymentStatus = amountDue > 0 ? (amountDue === total ? 'pending' : 'partially_paid') : 'paid'
  const contactName = safeStr((invoice.Contact as Record<string, unknown>)?.Name)

  for (const line of lines) {
    const qty = safeNum(line.Quantity) || 1
    const price = safeNum(line.UnitAmount)
    const grossRev = safeNum(line.LineAmount)

    records.push({
      record_date: safeDate(invoice.Date),
      sku: safeStr(line.ItemCode),
      product_name: safeStr(line.Description) || contactName,
      category: '',
      variant: '',
      supplier: contactName,
      units_sold: qty,
      selling_price: price,
      discount: safeNum(line.DiscountAmount),
      gross_revenue: grossRev,
      net_revenue: grossRev,
      cost_price: 0,
      shipping_cost: 0,
      packaging_cost: 0,
      marketplace_fee: 0,
      tax: safeNum(line.TaxAmount),
      total_cost: safeNum(line.TaxAmount),
      gross_margin: 0,
      net_margin: 0,
      stock_level: 0,
      stock_movement: -qty,
      low_stock_flag: false,
      damaged_stock: 0,
      channel: 'xero',
      customer_region: '',
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: 0,
      payment_status: paymentStatus,
      refund_amount: 0,
      payout_amount: grossRev,
      source_record_id: `xero_invoice_${invoice.InvoiceID}_line_${safeStr(line.LineItemID) || lines.indexOf(line)}`,
      source_type: 'xero',
      raw_data: { invoice_id: invoice.InvoiceID, invoice_number: invoice.InvoiceNumber, due_date: invoice.DueDate, status: invoice.Status, ...line },
    })
  }
  return records
}

// Maps a Xero ACCPAY (bill) invoice → cfo_expenses rows — reuses the same
// QBExpenseRow shape as QuickBooks Bills since the target table is identical.
export function normaliseXeroBill(bill: Record<string, unknown>): QBExpenseRow | null {
  const total = safeNum(bill.Total)
  if (!total) return null
  const vendorName = safeStr((bill.Contact as Record<string, unknown>)?.Name) || 'Unknown vendor'
  const lines = (bill.LineItems as Record<string, unknown>[]) || []
  const category = safeStr(lines[0]?.AccountCode) || 'Other'

  return {
    vendor: vendorName,
    date: safeDate(bill.Date) || new Date().toISOString().slice(0, 10),
    amount: total,
    category,
    notes: safeStr(bill.Reference) || `Xero Bill #${bill.InvoiceNumber || bill.InvoiceID}`,
    source_record_id: `xero_bill_${bill.InvoiceID}`,
  }
}

// ── FREEAGENT ────────────────────────────────────────────────
// FreeAgent has separate /v2/invoices (receivable) and /v2/bills (payable)
// endpoints, like QuickBooks — unlike Xero's single split-by-Type endpoint.

// Maps a FreeAgent invoice → unified sales records
export function normaliseFreeAgentInvoice(invoice: Record<string, unknown>): UnifiedRecord[] {
  const records: UnifiedRecord[] = []
  const items = (invoice.invoice_items as Record<string, unknown>[]) || []
  const currency = safeStr(invoice.currency) || 'GBP'
  const dueValue = safeNum(invoice.due_value)
  const totalValue = safeNum(invoice.total_value)
  const paymentStatus = dueValue > 0 ? (dueValue === totalValue ? 'pending' : 'partially_paid') : 'paid'
  const contactName = safeStr((invoice.contact as Record<string, unknown>)?.organisation_name)
  const invoiceId = safeStr(invoice.url).split('/').pop() || safeStr(invoice.reference)

  for (const [idx, item] of items.entries()) {
    const qty = safeNum(item.quantity) || 1
    const price = safeNum(item.price)
    const grossRev = safeNum(item.total_value)

    records.push({
      record_date: safeDate(invoice.dated_on),
      sku: '',
      product_name: safeStr(item.description) || contactName,
      category: safeStr(item.item_type),
      variant: '',
      supplier: contactName,
      units_sold: qty,
      selling_price: price,
      discount: 0,
      gross_revenue: grossRev,
      net_revenue: grossRev,
      cost_price: 0,
      shipping_cost: 0,
      packaging_cost: 0,
      marketplace_fee: 0,
      tax: safeNum(item.sales_tax_value),
      total_cost: safeNum(item.sales_tax_value),
      gross_margin: 0,
      net_margin: 0,
      stock_level: 0,
      stock_movement: -qty,
      low_stock_flag: false,
      damaged_stock: 0,
      channel: 'freeagent',
      customer_region: '',
      currency,
      ad_spend: 0,
      campaign: '',
      coupon_code: '',
      coupon_discount: 0,
      payment_status: paymentStatus,
      refund_amount: 0,
      payout_amount: grossRev,
      source_record_id: `freeagent_invoice_${invoiceId}_line_${idx}`,
      source_type: 'freeagent',
      raw_data: { invoice_url: invoice.url, reference: invoice.reference, due_on: invoice.due_on, status: invoice.status, ...item },
    })
  }
  return records
}

// Maps a FreeAgent bill → cfo_expenses rows — reuses the QBExpenseRow shape.
export function normaliseFreeAgentBill(bill: Record<string, unknown>): QBExpenseRow | null {
  const totalValue = safeNum(bill.total_value)
  if (!totalValue) return null
  const vendorName = safeStr((bill.contact as Record<string, unknown>)?.organisation_name) || 'Unknown vendor'
  const billId = safeStr(bill.url).split('/').pop() || safeStr(bill.reference)

  return {
    vendor: vendorName,
    date: safeDate(bill.dated_on) || new Date().toISOString().slice(0, 10),
    amount: totalValue,
    category: safeStr(bill.category).split('/').pop() || 'Other',
    notes: safeStr(bill.reference) || `FreeAgent Bill ${billId}`,
    source_record_id: `freeagent_bill_${billId}`,
  }
}

// ── GOOGLE ANALYTICS ─────────────────────────────────────────
export interface GASessionRow {
  record_date: string
  channel: string
  sessions: number
  users: number
  conversions: number
  conversion_rate: number
  bounce_rate: number
  avg_session_secs: number
  revenue: number
  currency: string
  raw_data: Record<string, unknown>
}

// GA4's Data API returns values positionally (dimensionValues[]/metricValues[])
// matched to the dimensions/metrics requested — this maps one row assuming the
// exact request shape built in syncGoogleAnalytics(): dimensions
// [date, sessionDefaultChannelGroup], metrics [sessions, totalUsers,
// conversions, bounceRate, averageSessionDuration, totalRevenue].
export function normaliseGoogleAnalyticsRow(row: Record<string, unknown>): GASessionRow {
  const dims = (row.dimensionValues as Record<string, unknown>[]) || []
  const mets = (row.metricValues as Record<string, unknown>[]) || []
  const dim = (i: number) => safeStr(dims[i]?.value)
  const met = (i: number) => safeNum(mets[i]?.value)

  const rawDate = dim(0) // GA4 returns YYYYMMDD
  const isoDate = rawDate.length === 8
    ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
    : safeDate(rawDate)

  const sessions = met(0)
  const conversions = met(2)

  return {
    record_date: isoDate,
    channel: dim(1) || 'Unassigned',
    sessions,
    users: met(1),
    conversions,
    conversion_rate: sessions > 0 ? conversions / sessions : 0,
    bounce_rate: met(3),
    avg_session_secs: met(4),
    revenue: met(5),
    currency: 'GBP',
    raw_data: row,
  }
}

// ── GOCARDLESS ───────────────────────────────────────────────
export interface GoCardlessPaymentRow {
  payment_id: string
  mandate_id: string
  amount: number
  currency: string
  status: string
  charge_date: string
  description: string
  raw_data: Record<string, unknown>
}

export function normaliseGoCardlessPayment(payment: Record<string, unknown>): GoCardlessPaymentRow {
  const links = (payment.links as Record<string, unknown>) || {}
  // GoCardless amounts are in the minor currency unit (pence/cents).
  const amountMinor = safeNum(payment.amount)

  return {
    payment_id: safeStr(payment.id),
    mandate_id: safeStr(links.mandate),
    amount: amountMinor / 100,
    currency: safeStr(payment.currency) || 'GBP',
    status: safeStr(payment.status),
    charge_date: safeDate(payment.charge_date),
    description: safeStr(payment.description),
    raw_data: payment,
  }
}

// ── EMAIL CAMPAIGNS (Mailchimp + Klaviyo) ─────────────────────
export interface EmailCampaignRow {
  source_type:   'mailchimp' | 'klaviyo'
  campaign_id:   string
  campaign_name: string
  sent_at:       string | null
  recipients:    number
  opens:         number
  open_rate:     number
  clicks:        number
  click_rate:    number
  unsubscribes:  number
  revenue:       number
  currency:      string
  raw_data:      Record<string, unknown>
}

// Maps one Mailchimp /3.0/reports entry.
export function normaliseMailchimpCampaign(report: Record<string, unknown>): EmailCampaignRow {
  const opensInfo = (report.opens as Record<string, unknown>) || {}
  const clicksInfo = (report.clicks as Record<string, unknown>) || {}
  const ecommerce = (report.ecommerce as Record<string, unknown>) || {}
  const recipients = safeNum(report.emails_sent)

  return {
    source_type:   'mailchimp',
    campaign_id:   safeStr(report.id),
    campaign_name: safeStr(report.campaign_title),
    sent_at:       report.send_time ? new Date(String(report.send_time)).toISOString() : null,
    recipients,
    opens:         safeNum(opensInfo.opens_total),
    open_rate:     safeNum(opensInfo.open_rate),
    clicks:        safeNum(clicksInfo.clicks_total),
    click_rate:    safeNum(clicksInfo.click_rate),
    unsubscribes:  safeNum(report.unsubscribed),
    revenue:       safeNum(ecommerce.total_revenue),
    currency:      safeStr(ecommerce.currency_code) || 'GBP',
    raw_data:      report,
  }
}

// Maps one Klaviyo campaign-values-report result (from the Campaign Values
// Reporting API — aggregated per-campaign statistics, not raw events).
export function normaliseKlaviyoCampaign(
  campaign: Record<string, unknown>,
  stats: Record<string, unknown>
): EmailCampaignRow {
  const recipients = safeNum(stats.recipients)
  const opens = safeNum(stats.opens_unique)
  const clicks = safeNum(stats.clicks_unique)

  return {
    source_type:   'klaviyo',
    campaign_id:   safeStr(campaign.id),
    campaign_name: safeStr((campaign.attributes as Record<string, unknown>)?.name),
    sent_at:       (campaign.attributes as Record<string, unknown>)?.send_time
                     ? new Date(String((campaign.attributes as Record<string, unknown>).send_time)).toISOString()
                     : null,
    recipients,
    opens,
    open_rate:     recipients > 0 ? opens / recipients : 0,
    clicks,
    click_rate:    recipients > 0 ? clicks / recipients : 0,
    unsubscribes:  safeNum(stats.unsubscribes),
    revenue:       safeNum(stats.conversion_value),
    currency:      safeStr(stats.conversion_value_currency) || 'GBP',
    raw_data:      { campaign, stats },
  }
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
