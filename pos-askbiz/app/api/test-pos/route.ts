import { NextResponse } from 'next/server'
import { createServiceClient, createClient } from '@/lib/supabase/server'

/**
 * Simple test to check if pos_staff table works.
 * Gated behind an authenticated owner session — uses the service-role key.
 */
export async function GET() {
  try {
    const { data: { user } } = await createClient().auth.getUser()
    if (!user) return NextResponse.json({ status: 'error', message: 'Unauthorised' }, { status: 401 })

    const service = createServiceClient()

    // Test 1: Simple query
    const { data, error } = await service
      .from('pos_staff')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'error',
        message: error.message,
        code: (error as any).code,
        details: (error as any).details,
        hint: (error as any).hint
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'ok',
      message: 'pos_staff table is accessible',
      records: data?.length || 0
    }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({
      status: 'error',
      error: err.message
    }, { status: 500 })
  }
}
