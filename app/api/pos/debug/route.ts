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

    // Test 5: Transaction counts by month (last 6 months)
    const now = new Date()
    const sixMonthsAgo = new Date(now); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); sixMonthsAgo.setDate(1); sixMonthsAgo.setHours(0,0,0,0)
    const { data: txData, error: txError } = await service
      .from('pos_transactions')
      .select('id,status,created_at,owner_id')
      .eq('owner_id', user.id)
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: false })

    // Group by month
    const byMonth: Record<string, { total: number; completed: number; other: number; statuses: Record<string, number> }> = {}
    for (const tx of (txData || [])) {
      const month = tx.created_at?.slice(0, 7) || 'unknown'
      if (!byMonth[month]) byMonth[month] = { total: 0, completed: 0, other: 0, statuses: {} }
      byMonth[month].total++
      if (tx.status === 'completed') byMonth[month].completed++
      else byMonth[month].other++
      byMonth[month].statuses[tx.status] = (byMonth[month].statuses[tx.status] || 0) + 1
    }

    // Test 6: Most recent 5 transactions regardless of date
    const { data: recentTxs } = await service
      .from('pos_transactions')
      .select('id,status,created_at,total,owner_id')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

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
        },
        transactions_by_month: {
          success: !txError,
          error: txError?.message,
          total_last_6_months: txData?.length || 0,
          by_month: byMonth,
        },
        most_recent_5_transactions: {
          data: recentTxs || [],
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
