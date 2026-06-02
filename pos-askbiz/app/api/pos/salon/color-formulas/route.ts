import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// ─────────────────────────────────────────────────────────────
// GET — list color formulas (filter by client)
// ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.view')) return json({ error: 'Access denied' }, 403)

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const client_id = searchParams.get('client_id')

  let query = service
    .from('salon_color_formulas')
    .select('*')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: false })

  if (client_id) query = query.eq('client_id', client_id)

  const { data, error } = await query
  if (error) return json({ error: error.message }, 500)

  return json({ formulas: data })
}

// ─────────────────────────────────────────────────────────────
// POST — save a color formula
// Body: { client_id, formula, brand?, developer?, processing_mins?, notes? }
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'sales.create')) return json({ error: 'Access denied' }, 403)

  const body = await req.json()
  const { client_id, formula, brand, developer, processing_mins, notes } = body

  if (!client_id) return json({ error: 'client_id required' }, 400)
  if (!formula || !String(formula).trim()) return json({ error: 'formula required' }, 400)

  const service = createServiceClient()
  const { data: saved, error } = await service
    .from('salon_color_formulas')
    .insert({
      owner_id:        auth.ownerId,
      client_id,
      stylist_id:      auth.staffId || null,
      formula:         String(formula).trim(),
      brand:           brand     || null,
      developer:       developer || null,
      processing_mins: processing_mins ?? null,
      notes:           notes     || null,
    })
    .select('*')
    .single()

  if (error) return json({ error: error.message }, 500)

  return json({ formula: saved }, 201)
}
