import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/pos/tax/validate-vat
 *
 * Validates EU VAT numbers using VIES API (EU VAT Information Exchange System)
 * Returns: valid status, country, business name
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { vat_number } = body

  if (!vat_number || typeof vat_number !== 'string') {
    return NextResponse.json({ error: 'vat_number required' }, { status: 400 })
  }

  // Extract country code from VAT number (first 2 chars)
  const country = vat_number.substring(0, 2).toUpperCase()
  const vatNumber = vat_number.substring(2)

  // Validate format (basic check)
  const eu_countries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE']

  if (!eu_countries.includes(country)) {
    return NextResponse.json(
      { valid: false, error: 'Invalid country code. Must be EU member state.' },
      { status: 400 }
    )
  }

  if (vatNumber.length < 8 || vatNumber.length > 12) {
    return NextResponse.json(
      { valid: false, error: 'VAT number length invalid for ' + country },
      { status: 400 }
    )
  }

  try {
    // Call VIES API (real validation)
    // Note: VIES API requires SOAP request; we'll use a simple HTTP wrapper for demo
    // In production, use a library like 'axios' + 'soap' or 'vat-checker'
    const response = await fetch('https://ec.europa.eu/taxation_customs/vies/api/v1/checkVat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        countryCode: country,
        vatNumber: vatNumber,
      }),
    })

    if (!response.ok) {
      // VIES API down or VAT invalid
      return NextResponse.json(
        {
          valid: false,
          error: 'VAT validation service unavailable or VAT invalid',
          vat_number,
        },
        { status: 503 }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      valid: data.valid || false,
      country: data.countryCode || country,
      vat_number: data.vatNumber || vatNumber,
      name: data.name || null,
      address: data.address || null,
    })
  } catch (err) {
    // Fallback: basic format validation (if VIES down)
    return NextResponse.json({
      valid: /^\d{8,12}$/.test(vatNumber), // basic numeric format
      country,
      vat_number: vatNumber,
      name: null,
      warning: 'VIES service unavailable; basic format check only',
    })
  }
}
