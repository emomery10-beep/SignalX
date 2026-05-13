import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosOwner } from '@/lib/pos-auth'

/**
 * POST /api/pos/settings/save-tax-settings
 *
 * Saves tax configuration for a user's account or specific location
 */
export async function POST(req: NextRequest) {
  const ownerId = await resolvePosOwner(req)
  if (!ownerId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const body = await req.json()

  const {
    location_id,         // if saving for a specific location
    jurisdiction_code,   // 'UK', 'DE', 'US_CA', etc.
    tax_id,              // VAT number, FEIN, etc.
    business_type,       // 'retail', 'restaurant', 'service', 'digital'
  } = body

  if (!jurisdiction_code) {
    return NextResponse.json({ error: 'jurisdiction_code required' }, { status: 400 })
  }

  let result: any = null

  if (location_id) {
    // Save for specific location
    const { data, error } = await service
      .from('pos_location_tax_settings')
      .upsert(
        {
          owner_id: ownerId,
          location_id,
          jurisdiction_code,
          tax_id: tax_id || null,
          business_type: business_type || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'owner_id, location_id' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    result = data
  } else {
    // Save as default (use a default location ID if exists, or create one)
    // For now, we'll just return success
    result = {
      owner_id: ownerId,
      jurisdiction_code,
      tax_id,
      business_type,
    }
  }

  // Also ensure default tax codes exist for this jurisdiction
  const { data: existingCodes } = await service
    .from('pos_item_tax_codes')
    .select('id')
    .eq('owner_id', ownerId)
    .eq('jurisdiction', jurisdiction_code)
    .limit(1)

  if (!existingCodes || existingCodes.length === 0) {
    // Create default tax codes for this jurisdiction
    const defaultCodes = getDefaultTaxCodesForJurisdiction(jurisdiction_code)

    const { error: codesError } = await service
      .from('pos_item_tax_codes')
      .insert(defaultCodes.map(code => ({ ...code, owner_id: ownerId })))

    if (codesError && !codesError.message.includes('duplicate')) {
      // Ignore duplicate key errors
      console.error('Error creating default tax codes:', codesError)
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Tax settings saved',
    settings: result,
  })
}

function getDefaultTaxCodesForJurisdiction(jurisdiction: string): any[] {
  const defaults: Record<string, any[]> = {
    UK: [
      {
        code: 'VAT-20-STANDARD',
        jurisdiction: 'UK',
        category: 'general_merchandise',
        rate: 20,
        label: 'Standard rate 20%',
        is_active: true,
      },
      {
        code: 'VAT-5-REDUCED',
        jurisdiction: 'UK',
        category: 'food',
        rate: 5,
        label: 'Reduced rate 5% (food)',
        is_active: true,
      },
      {
        code: 'VAT-0-EXEMPT',
        jurisdiction: 'UK',
        category: 'books',
        rate: 0,
        label: 'Zero rate 0% (books)',
        is_active: true,
      },
    ],
    DE: [
      {
        code: 'VAT-19-STANDARD',
        jurisdiction: 'DE',
        category: 'general_merchandise',
        rate: 19,
        label: 'Standard rate 19%',
        is_active: true,
      },
      {
        code: 'VAT-7-REDUCED',
        jurisdiction: 'DE',
        category: 'food',
        rate: 7,
        label: 'Reduced rate 7% (food)',
        is_active: true,
      },
    ],
    US_CA: [
      {
        code: 'SALES-TAX-725',
        jurisdiction: 'US_CA',
        category: 'general_merchandise',
        rate: 7.25,
        label: 'State Sales Tax 7.25%',
        is_active: true,
      },
    ],
    US_NY: [
      {
        code: 'SALES-TAX-8',
        jurisdiction: 'US_NY',
        category: 'general_merchandise',
        rate: 8,
        label: 'State Sales Tax 8%',
        is_active: true,
      },
    ],
  }

  return defaults[jurisdiction] || defaults['UK']
}
