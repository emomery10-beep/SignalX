import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/pos/reorder-suggestions
 * Returns AI-generated reorder suggestions for the logged-in user's inventory.
 *
 * POST /api/pos/reorder-suggestions (action: dismiss)
 * Dismisses a suggestion so it doesn't show again.
 */

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET() {
  // Get user from session
  const authClient = createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ suggestions: [] })

  // Use service client to bypass RLS for reading suggestions
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('agent_content')
    .select('id, content, verdict, created_at')
    .eq('type', 'reorder_suggestion')
    .eq('run_id', `reorder_${user.id}`)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ suggestions: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    suggestions: (data || []).map(row => ({
      id: row.id,
      ...row.content as Record<string, unknown>,
      verdict: row.verdict,
      generated_at: row.created_at,
    })),
  })
}

export async function POST(request: NextRequest) {
  const authClient = createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  if (body.action === 'dismiss' && body.id) {
    const supabase = getServiceClient()
    await supabase
      .from('agent_content')
      .update({ status: 'rejected' })
      .eq('id', body.id)
      .eq('run_id', `reorder_${user.id}`)

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
