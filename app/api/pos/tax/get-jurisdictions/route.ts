import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/pos/tax/get-jurisdictions
 *
 * Returns list of all supported jurisdictions with their tax rules and currencies
 */
export async function GET(req: NextRequest) {
  // Global tax jurisdiction database (can be moved to DB if needed)
  const jurisdictions = [
    {
      code: 'UK',
      name: 'United Kingdom',
      type: 'VAT',
      standard_rate: 20,
      reduced_rates: [
        { rate: 5, applies_to: ['food', 'newspapers', 'books', 'children_car_seats'] },
        { rate: 0, applies_to: ['books', 'newspapers', 'food', 'water', 'children_clothing'] },
      ],
      currency: 'GBP',
      local_currency_symbol: '£',
      filing_frequency: 'quarterly',
      filing_deadline_days: 30,
      min_turnover_threshold_for_vat: 85000,
    },
    {
      code: 'DE',
      name: 'Germany',
      type: 'VAT',
      standard_rate: 19,
      reduced_rates: [
        { rate: 7, applies_to: ['food', 'books', 'newspapers', 'medicines'] },
        { rate: 0, applies_to: ['books', 'newspapers', 'certain_medical_services'] },
      ],
      currency: 'EUR',
      local_currency_symbol: '€',
      filing_frequency: 'monthly',
      filing_deadline_days: 10,
      min_turnover_threshold_for_vat: 22000,
    },
    {
      code: 'FR',
      name: 'France',
      type: 'VAT',
      standard_rate: 20,
      reduced_rates: [
        { rate: 5.5, applies_to: ['food', 'newspapers', 'books'] },
        { rate: 2.1, applies_to: ['books', 'newspapers'] },
      ],
      currency: 'EUR',
      local_currency_symbol: '€',
      filing_frequency: 'monthly',
      filing_deadline_days: 15,
      min_turnover_threshold_for_vat: 34400,
    },
    {
      code: 'IT',
      name: 'Italy',
      type: 'VAT',
      standard_rate: 22,
      reduced_rates: [
        { rate: 10, applies_to: ['food', 'books', 'medicines'] },
        { rate: 5, applies_to: ['food', 'books', 'certain_medical_devices'] },
      ],
      currency: 'EUR',
      local_currency_symbol: '€',
      filing_frequency: 'monthly',
      filing_deadline_days: 15,
      min_turnover_threshold_for_vat: 0,
    },
    {
      code: 'ES',
      name: 'Spain',
      type: 'VAT',
      standard_rate: 21,
      reduced_rates: [
        { rate: 10, applies_to: ['food', 'books', 'medicines'] },
        { rate: 4, applies_to: ['books', 'newspapers', 'medicines'] },
      ],
      currency: 'EUR',
      local_currency_symbol: '€',
      filing_frequency: 'monthly',
      filing_deadline_days: 20,
      min_turnover_threshold_for_vat: 0,
    },
    {
      code: 'US_CA',
      name: 'California, USA',
      type: 'Sales_Tax',
      standard_rate: 7.25,
      reduced_rates: [],
      exemptions: ['food', 'medicine', 'clothing_children'],
      currency: 'USD',
      local_currency_symbol: '$',
      filing_frequency: 'monthly',
      filing_deadline_days: 30,
    },
    {
      code: 'US_NY',
      name: 'New York, USA',
      type: 'Sales_Tax',
      standard_rate: 8,
      reduced_rates: [],
      exemptions: ['food', 'medicine'],
      currency: 'USD',
      local_currency_symbol: '$',
      filing_frequency: 'quarterly',
      filing_deadline_days: 20,
    },
    {
      code: 'US_TX',
      name: 'Texas, USA',
      type: 'Sales_Tax',
      standard_rate: 6.25,
      reduced_rates: [],
      exemptions: ['food', 'clothing'],
      currency: 'USD',
      local_currency_symbol: '$',
      filing_frequency: 'quarterly',
      filing_deadline_days: 20,
    },
    {
      code: 'AU',
      name: 'Australia',
      type: 'GST',
      standard_rate: 10,
      reduced_rates: [],
      exemptions: ['food', 'medicine', 'education'],
      currency: 'AUD',
      local_currency_symbol: 'A$',
      filing_frequency: 'quarterly',
      filing_deadline_days: 30,
    },
    {
      code: 'CA',
      name: 'Canada',
      type: 'GST',
      standard_rate: 5,
      reduced_rates: [],
      currency: 'CAD',
      local_currency_symbol: 'C$',
      filing_frequency: 'quarterly',
      filing_deadline_days: 30,
    },
  ]

  return NextResponse.json({ jurisdictions })
}
