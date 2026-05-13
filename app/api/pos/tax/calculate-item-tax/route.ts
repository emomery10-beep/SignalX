import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * POST /api/pos/tax/calculate-item-tax
 *
 * Calculates tax for an item based on jurisdiction, category, and customer type
 * Handles reduced rates (UK books, EU food), B2B reverse charge, etc.
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  const {
    item_name,
    price,           // gross or net? assume gross here
    quantity = 1,
    category,        // 'food', 'books', 'digital_services', 'general_merchandise'
    jurisdiction,    // 'UK', 'DE', 'US_CA'
    customer_type = 'B2C', // 'B2B' | 'B2C'
    customer_vat_number = null, // EU VAT number for reverse charge
  } = body

  if (!price || price < 0) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
  }

  if (!jurisdiction || !category) {
    return NextResponse.json({ error: 'jurisdiction and category required' }, { status: 400 })
  }

  // Lookup tax code for this category in jurisdiction
  const { data: taxCode } = await service
    .from('pos_item_tax_codes')
    .select('id, rate, code, label')
    .eq('owner_id', ownerId)
    .eq('jurisdiction', jurisdiction)
    .eq('category', category)
    .eq('is_active', true)
    .maybeSingle()

  if (!taxCode) {
    return NextResponse.json(
      { error: `No tax code found for category "${category}" in ${jurisdiction}` },
      { status: 400 }
    )
  }

  // B2B reverse charge logic for EU
  let effective_rate = taxCode.rate
  let reverse_charge = false
  if (
    customer_type === 'B2B' &&
    customer_vat_number &&
    ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL'].includes(jurisdiction)
  ) {
    // EU cross-border B2B with valid VAT number = 0% (reverse charge)
    effective_rate = 0
    reverse_charge = true
  }

  // Calculate tax
  // Assume price is gross; back out the net
  // gross = net * (1 + rate/100)
  // net = gross / (1 + rate/100)
  const net_price = price / (1 + taxCode.rate / 100)
  const tax_amount = price - net_price
  const line_total = (net_price + (reverse_charge ? 0 : tax_amount)) * quantity

  return NextResponse.json({
    item_name,
    gross_price: price,
    net_price: Math.round(net_price * 100) / 100,
    tax_amount: Math.round(tax_amount * 100) / 100,
    effective_tax_rate: effective_rate,
    standard_rate: taxCode.rate,
    tax_code: taxCode.code,
    tax_code_label: taxCode.label,
    reverse_charge,
    quantity,
    line_total: Math.round(line_total * 100) / 100,
    jurisdiction,
    reason: reverse_charge ? 'EU B2B reverse charge applied' : undefined,
  })
}
