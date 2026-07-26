import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// POST — anonymous impression/click beacon fired by SpotlightCarousel.
// Deliberately basic (Phase 1 scope): an atomic counter bump via
// increment_spotlight_metric, no auth, no per-visitor dedup/rate-limit —
// this is "some visibility" for the advertiser, not a fraud-resistant ad
// server. Never fails loudly: a beacon miss shouldn't affect the visitor.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  const kind = body?.kind === 'click' ? 'click' : (body?.kind === 'impression' ? 'impression' : null)
  if (!UUID_RE.test(id) || !kind) return NextResponse.json({ ok: false }, { status: 400 })

  const service = createServiceClient()
  await service.rpc('increment_spotlight_metric', { p_id: id, p_metric: kind })
  return NextResponse.json({ ok: true })
}
