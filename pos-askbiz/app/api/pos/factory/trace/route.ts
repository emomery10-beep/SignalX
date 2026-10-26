import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

// GET /api/pos/factory/trace?run_ref=XYZ — follow one production run both ways: the raw material that went in
// (and which supplier delivered it), what was made and packed, and which customers received it. This is the
// recall question: "something is wrong with batch X, who got it?". It works for captures tagged with the same
// run reference at each step; tag a delivery with the lot/run reference too and its supplier shows up. No prices are returned. Approvers only: it names customers and their numbers.
// GET /api/pos/factory/trace?recent=1 — the latest runs, for a pick-list.
export const dynamic = 'force-dynamic'
export async function OPTIONS() { return new NextResponse(null, { status: 204 }) }
const json = (d: unknown, status = 200) => NextResponse.json(d, { status })

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'capture.approve')) return json({ error: 'Access denied' }, 403)
  const service = createServiceClient()
  const sp = new URL(req.url).searchParams

  if (sp.get('recent') === '1') {
    const { data } = await service.from('pos_factory_production_runs').select('id, run_ref, input_product_name, created_at')
      .eq('owner_id', auth.ownerId).order('created_at', { ascending: false }).limit(30)
    return json({ runs: data || [] })
  }

  const ref = (sp.get('run_ref') || '').trim().slice(0, 64)
  if (!ref) return json({ error: 'run_ref required' }, 400)
  const { data: run } = await service.from('pos_factory_production_runs').select('id, run_ref, input_product_name, created_at')
    .eq('owner_id', auth.ownerId).ilike('run_ref', ref.replace(/[%_]/g, m => '\\' + m)).maybeSingle()
  if (!run) return json({ error: 'not_found' }, 404)

  // '*' on purpose: customer_phone / party_id exist only after the money-loop migration.
  const { data: caps } = await service.from('pos_factory_captures').select('*')
    .eq('owner_id', auth.ownerId).eq('production_run_id', run.id).neq('status', 'rejected').order('created_at', { ascending: true }).limit(2000)
  const rows = (caps || []) as any[]
  const partyIds = Array.from(new Set(rows.map(r => r.party_id).filter(Boolean)))
  const { data: parties } = partyIds.length
    ? await service.from('pos_factory_parties').select('id, name, phone').eq('owner_id', auth.ownerId).in('id', partyIds)
    : { data: [] as any[] }
  const party = new Map<string, any>((parties || []).map((p: any): [string, any] => [p.id, p]))
  const shape = (r: any) => ({
    id: r.id, type: r.type, status: r.status, date: r.created_at, product: r.product_name, quantity: r.quantity,
    party: r.party_id ? (party.get(r.party_id)?.name || null) : null,
    destination: r.type === 'dispatch' ? r.notes : null,
    phone: r.type === 'dispatch' ? (r.customer_phone || party.get(r.party_id)?.phone || null) : null,
  })
  const of = (...types: string[]) => rows.filter(r => types.includes(r.type)).map(shape)
  return json({
    run,
    went_in: of('intake_arrival', 'intake_feed', 'intake'),
    made: of('output'),
    packed: of('packaging'),
    sent: of('dispatch'),
  })
}
