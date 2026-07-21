import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Session-authenticated, same auth pattern as app/api/v1/keys/route.ts —
// this is a dashboard account action, not something called with an
// x-api-key. Business details are stored on business_verifications
// (one row per user, see the unique(user_id) constraint); documents are
// uploaded separately via /api/v1/verification/documents.

// ── GET — current verification status + documents ─────────────────────────────
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: verification, error } = await supabase
    .from('business_verifications')
    .select('id, status, legal_name, registration_number, tax_id, address, submitted_at, reviewed_at, rejection_reason')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let documents: { id: string; kind: string; uploaded_at: string }[] = []
  if (verification) {
    const { data: docs, error: docsError } = await supabase
      .from('business_verification_documents')
      .select('id, kind, uploaded_at')
      .eq('verification_id', verification.id)
      .order('uploaded_at', { ascending: false })
    if (docsError) return NextResponse.json({ error: docsError.message }, { status: 500 })
    documents = docs || []
  }

  return NextResponse.json({ verification, documents })
}

// ── POST — submit or resubmit business details ─────────────────────────────────
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const legal_name = typeof body.legal_name === 'string' ? body.legal_name.trim().slice(0, 200) : ''
  const registration_number = typeof body.registration_number === 'string' ? body.registration_number.trim().slice(0, 100) : ''
  const tax_id = typeof body.tax_id === 'string' ? body.tax_id.trim().slice(0, 100) : ''
  const address = typeof body.address === 'string' ? body.address.trim().slice(0, 500) : ''

  if (!legal_name || !registration_number || !address) {
    return NextResponse.json({ error: 'legal_name, registration_number, and address are required' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('business_verifications')
    .select('id, status')
    .eq('user_id', user.id)
    .maybeSingle()

  // Once approved, this endpoint no longer accepts changes — a verified
  // business that needs to update its details is a support-handled edge
  // case, not a self-serve resubmission that could re-open a badge without
  // review.
  if (existing?.status === 'approved') {
    return NextResponse.json({ error: 'Already verified — contact support to update business details' }, { status: 409 })
  }

  const row = {
    user_id: user.id,
    status: 'pending' as const,
    legal_name,
    registration_number,
    tax_id: tax_id || null,
    address,
    submitted_at: new Date().toISOString(),
    reviewed_at: null,
    reviewed_by: null,
    rejection_reason: null,
  }

  const { data, error } = existing
    ? await supabase.from('business_verifications').update(row).eq('id', existing.id).select().single()
    : await supabase.from('business_verifications').insert(row).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, verification: data })
}
