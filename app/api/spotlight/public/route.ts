import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Public, unauthenticated — feeds the signin/signup carousel. Same shape
// as app/api/blog/published: service client, query itself enforces the
// public-safe filter, short edge cache since this is community content
// that changes as admins approve new submissions.
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('business_spotlights')
    .select('id, business_name, tagline, logo_url, banner_url, link_url')
    .eq('status', 'approved')
    .eq('is_active', true)
    // ends_at is null for the old free-flow rows and any open-ended deal —
    // only rows with an explicit, already-passed end date are excluded.
    .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
    .order('submitted_at', { ascending: true })
    .limit(24)

  if (error) return NextResponse.json({ spotlights: [], error: error.message }, { status: 500 })

  return NextResponse.json(
    { spotlights: data || [] },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  )
}
