// ── /api/supplier-context ─────────────────────────────────────────────────────
// Stores where a business sources each of their products from.
// This feeds directly into Market Climate signal selection so it can track
// the right international prices, FX pairs, and shipping lanes.
//
// Saved inside cost_profile_overrides under the key 'supplier_sources'
// so no new Supabase table is required.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export interface SupplierSource {
  product: string         // product / category name e.g. "Vaseline", "sesame seeds"
  sourceCountry: string   // ISO country code e.g. "UK", "ET" — or free text country name
  supplierName?: string   // optional supplier name
  currency?: string       // currency they pay in
  notes?: string          // any extra context
}

export interface SupplierContext {
  sources: SupplierSource[]
  updatedAt: string
}

// GET — return saved supplier context for this user
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('cost_profile_overrides')
    .select('overrides')
    .eq('user_id', user.id)
    .single()

  const overrides = (data?.overrides as Record<string, unknown>) || {}
  const context = (overrides.supplier_sources as SupplierContext) || { sources: [], updatedAt: '' }

  return NextResponse.json(context)
}

// POST — save or update supplier sources
// Body: { sources: SupplierSource[] } — replaces entire list
// Or:   { upsert: SupplierSource }   — adds/updates single entry by product name
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { sources?: SupplierSource[]; upsert?: SupplierSource }

  // Read existing overrides to merge
  const { data: existing } = await supabase
    .from('cost_profile_overrides')
    .select('overrides')
    .eq('user_id', user.id)
    .single()

  const overrides = (existing?.overrides as Record<string, unknown>) || {}
  const current = (overrides.supplier_sources as SupplierContext) || { sources: [], updatedAt: '' }

  let newSources: SupplierSource[]

  if (body.sources) {
    // Full replace
    newSources = body.sources
  } else if (body.upsert) {
    // Upsert single entry — match by product name (case-insensitive)
    const entry = body.upsert
    const existing = current.sources.filter(
      s => s.product.toLowerCase() !== entry.product.toLowerCase()
    )
    newSources = [...existing, entry]
  } else {
    return NextResponse.json({ error: 'Provide sources or upsert' }, { status: 400 })
  }

  const newContext: SupplierContext = {
    sources: newSources,
    updatedAt: new Date().toISOString(),
  }

  const merged = { ...overrides, supplier_sources: newContext }

  const { error } = await supabase
    .from('cost_profile_overrides')
    .upsert(
      { user_id: user.id, overrides: merged, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, context: newContext })
}
