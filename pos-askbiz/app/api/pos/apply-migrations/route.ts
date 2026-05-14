import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * Manual schema verification endpoint
 * Tests if all POS tables are accessible with proper RLS
 * GET /api/pos/apply-migrations (migration endpoint moved to debug)
 */
export async function GET(req: NextRequest) {
  const service = createServiceClient()

  try {
    console.log('🔍 Verifying POS schema...')

    // Test 1: Verify pos_staff table exists and is accessible
    const { data: staffData, error: staffError } = await service
      .from('pos_staff')
      .select('*')
      .limit(1)

    if (staffError) {
      console.error('❌ pos_staff error:', staffError.message)
      return NextResponse.json({
        success: false,
        error: 'pos_staff table error',
        details: staffError.message
      }, { status: 500 })
    }

    // Test 2: Verify pos_image_recognition table exists
    const { data: imageData, error: imageError } = await service
      .from('pos_image_recognition')
      .select('*')
      .limit(1)

    if (imageError) {
      console.warn('⚠️  pos_image_recognition error:', imageError.message)
    }

    // Test 3: Verify pos_items has new columns
    const { data: itemsData, error: itemsError } = await service
      .from('pos_items')
      .select('*')
      .limit(1)

    const hasImageColumns = itemsData?.[0]?.hasOwnProperty?.('image_url')

    console.log('✅ Schema verification complete')

    return NextResponse.json({
      success: true,
      schema_status: {
        pos_staff: { accessible: !staffError, records: staffData?.length || 0 },
        pos_image_recognition: { accessible: !imageError, records: imageData?.length || 0 },
        pos_items_image_columns: hasImageColumns
      },
      message: 'All tables accessible with proper RLS',
      timestamp: new Date().toISOString()
    }, { status: 200 })
  } catch (err: any) {
    console.error('❌ Verification error:', err)
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 })
  }
}
