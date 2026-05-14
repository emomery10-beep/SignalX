import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * Debug endpoint to diagnose POS table issues
 * GET /api/pos/debug
 */
export async function GET() {
  try {
    const anon = createClient()
    const service = createServiceClient()

    // Get authenticated user info
    const { data: { user }, error: authError } = await anon.auth.getUser()

    if (authError) {
      return NextResponse.json({
        error: 'Auth error',
        details: authError.message
      }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'No authenticated user'
      }, { status: 200 })
    }

    // Test 1: Try to query pos_staff with anon key (should work via RLS)
    const { data: anonData, error: anonError } = await anon
      .from('pos_staff')
      .select('*')
      .eq('owner_id', user.id)

    // Test 2: Try to query pos_staff with service role key (should always work)
    const { data: serviceData, error: serviceError } = await service
      .from('pos_staff')
      .select('*')
      .eq('owner_id', user.id)

    // Test 3: Try to read pos_image_recognition with anon key
    const { data: imageData, error: imageError } = await anon
      .from('pos_image_recognition')
      .select('*')
      .eq('owner_id', user.id)
      .limit(1)

    // Test 4: Check if pos_items has the new columns
    const { data: itemsData, error: itemsError } = await service
      .from('pos_items')
      .select('*')
      .limit(1)

    return NextResponse.json({
      authenticated: true,
      user_id: user.id,
      tests: {
        pos_staff_anon: {
          success: !anonError,
          count: anonData?.length || 0,
          error: anonError?.message
        },
        pos_staff_service: {
          success: !serviceError,
          count: serviceData?.length || 0,
          error: serviceError?.message
        },
        pos_image_recognition_anon: {
          success: !imageError,
          count: imageData?.length || 0,
          error: imageError?.message
        },
        pos_items_columns: {
          success: !itemsError,
          error: itemsError?.message,
          sample: itemsData?.[0] ? Object.keys(itemsData[0]) : null
        }
      }
    }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({
      error: 'Unexpected error',
      message: err.message
    }, { status: 500 })
  }
}
