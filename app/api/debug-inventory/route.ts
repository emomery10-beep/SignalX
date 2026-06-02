import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const posResult = await supabase.from('pos_products').select('id, name, stock_quantity', { count: 'exact' }).eq('owner_id', user.id).limit(5)
  const unifiedResult = await supabase.from('unified_data').select('product_name, source_type, stock_level, selling_price, payment_status', { count: 'exact' }).eq('user_id', user.id).limit(10)
  const { data: sources } = await supabase.from('connected_sources').select('id, source_type, status, name, last_synced_at, error_message').eq('user_id', user.id)
  const { data: syncLogs } = await supabase.from('sync_log').select('source_type, started_at, status, records_new, records_synced, error_message').eq('user_id', user.id).order('started_at', { ascending: false }).limit(10)

  return NextResponse.json({
    user_id: user.id,
    pos_products: { count: posResult.count, sample: posResult.data, error: posResult.error?.message },
    unified_data: { count: unifiedResult.count, sample: unifiedResult.data, error: unifiedResult.error?.message },
    connected_sources: sources,
    recent_syncs: syncLogs,
  })
}
