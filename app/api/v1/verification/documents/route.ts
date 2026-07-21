import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const DOCUMENT_KINDS = ['registration_certificate', 'proof_of_address', 'owner_id', 'ownership_disclosure'] as const
type DocumentKind = typeof DOCUMENT_KINDS[number]

// Session-authenticated upload into the private 'kyc-documents' bucket —
// same base64-decode-then-upload shape as
// pos-askbiz/app/api/pos/restaurant/menu/from-photo/save/route.ts. Uses the
// service client only for the storage write + document row insert (needs
// to succeed even though the RLS-bound client also could — service role
// keeps this consistent with the rest of the codebase's file-upload routes,
// which all write via service role rather than relying on storage RLS
// alone for multi-step writes).
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

  const { image, kind } = body as { image?: string; kind?: string }
  if (!kind || !DOCUMENT_KINDS.includes(kind as DocumentKind)) {
    return NextResponse.json({ error: `kind must be one of: ${DOCUMENT_KINDS.join(', ')}` }, { status: 400 })
  }
  if (typeof image !== 'string' || !image) {
    return NextResponse.json({ error: 'image is required (data URL or base64)' }, { status: 400 })
  }

  const { data: verification } = await supabase
    .from('business_verifications')
    .select('id, status')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!verification) {
    return NextResponse.json({ error: 'Submit business details first (POST /api/v1/verification)' }, { status: 400 })
  }
  if (verification.status === 'approved') {
    return NextResponse.json({ error: 'Already verified — contact support to update documents' }, { status: 409 })
  }

  const service = createServiceClient()

  const match = image.match(/^data:(.+?);base64,(.*)$/)
  const contentType = match?.[1] || 'image/jpeg'
  const b64 = match?.[2] || image
  let buffer: Buffer
  try {
    buffer = Buffer.from(b64, 'base64')
  } catch {
    return NextResponse.json({ error: 'image is not valid base64' }, { status: 400 })
  }

  const path = `${user.id}/${Date.now()}-${kind}.jpg`
  const { error: uploadError } = await service.storage
    .from('kyc-documents')
    .upload(path, buffer, { contentType, upsert: false })
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: doc, error: insertError } = await service
    .from('business_verification_documents')
    .insert({
      verification_id: verification.id,
      owner_id: user.id,
      kind,
      storage_path: path,
    })
    .select('id, kind, uploaded_at')
    .single()
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ success: true, document: doc })
}
