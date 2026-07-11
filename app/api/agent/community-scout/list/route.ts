import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'pending'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // If requesting counts, return separate count queries for accuracy.
  // Deliberately not using { count: 'exact', head: true } here — that mode
  // reproducibly returned 0 for this table/type combo in production even
  // though the rows exist (same issue worked around below for .limit()).
  // Fetching ids and counting client-side sidesteps it.
  if (searchParams.has('counts')) {
    const [pending, published, rejected] = await Promise.all([
      supabase.from('agent_content').select('id').eq('type', 'community_post').eq('status', 'pending'),
      supabase.from('agent_content').select('id').eq('type', 'community_post').eq('status', 'published'),
      supabase.from('agent_content').select('id').eq('type', 'community_post').eq('status', 'rejected'),
    ])
    const pendingCount = pending.data?.length || 0
    const publishedCount = published.data?.length || 0
    const rejectedCount = rejected.data?.length || 0
    return NextResponse.json({
      pending: pendingCount,
      published: publishedCount,
      rejected: rejectedCount,
      total: pendingCount + publishedCount + rejectedCount,
    })
  }

  const janeBase = supabase
    .from('agent_content')
    .select('*')
    .eq('type', 'community_post')

  // .limit(100) reproducibly returns zero rows for this query shape on this
  // table (confirmed against production — .range(0, 99), which is the same
  // effective window, returns correctly). Using .range() here sidesteps it.
  let query
  if (status === 'all') {
    query = janeBase.order('created_at', { ascending: false }).range(0, 99)
  } else {
    query = janeBase.eq('status', status).order('created_at', { ascending: false }).range(0, 99)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ items: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data || [] })
}
