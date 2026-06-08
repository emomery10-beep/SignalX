import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/pos/payment/banks?country=kenya
 * Fetches available banks/mobile money providers from Paystack for a given country
 */

const COUNTRY_MAP: Record<string, string> = {
  KE: 'kenya',
  NG: 'nigeria',
  GH: 'ghana',
  ZA: 'south africa',
  UG: 'kenya',   // Uganda uses Kenya channel
  TZ: 'kenya',   // Tanzania uses Kenya channel
  RW: 'kenya',   // Rwanda uses Kenya channel
}

export async function GET(req: NextRequest) {
  const countryCode = req.nextUrl.searchParams.get('country') || 'KE'
  const paystackCountry = COUNTRY_MAP[countryCode] || 'kenya'

  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) {
    return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/bank?country=${paystackCountry}&perPage=100`,
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch banks' },
        { status: res.status }
      )
    }

    // Return simplified bank list
    const banks = (data.data || [])
      .filter((b: any) => b.active)
      .map((b: any) => ({
        name: b.name,
        code: b.code,
        type: b.type,        // 'nuban', 'mobile_money', etc.
        currency: b.currency,
      }))

    return NextResponse.json({ banks, country: paystackCountry })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
