import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: posProducts, count: posCount }, { data: unifiedSample, count: unifiedCount }, { data: sources }, { data: syncLogs }] = await Promise.all([
    supabase.from('pos_products').select('id, name, stock_quantity', { count: 'exact' }).eq('owner_id', user.id).limit(5),
    supabase.from('unified_data').select('product_name, source_type, stock_level, selling_price, payment_status', { count: 'exact' }).eq('user_id', user.id).limit(10),
    supabase.from('connected_sources').select('id, source_type, status, name').eq('user_id', user.id),
    supabase.from('sync_log').select('source_type, started_at, status, records_new, error_message').eq('user_id', user.id).order('started_at', { ascending: false }).limit(5),
  ])

  return NextResponse.json({
    user_id: user.id,
    pos_products: { count: posCount, sample: posProducts },
    unified_data: { count: unifiedCount, sample: unifiedSample },
    connected_sources: sources,
    recent_syncs: syncLogs,
  })
}
