import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const MAX_NAME = 60
const MAX_TAGLINE = 90
const TERMS_VERSION = 'v1'

function validLinkUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// GET — the caller's own spotlight submission, whatever its status (RLS
// scopes this to auth.uid() = owner_id — no service client needed).
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('business_spotlights')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ spotlight: data })
}

// POST — submit or edit. Any content change re-queues for admin review;
// intentionally uses the service client because business_spotlights has no
// client-writable RLS policy (see the migration comment) — status can only
// flip to 'approved' through app/api/admin/spotlight.
async function uploadSpotlightImage(service: ReturnType<typeof createServiceClient>, dataUrl: string, filename: string): Promise<string | null> {
  try {
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) return null
    const { error: uploadErr } = await service.storage
      .from('product-photos')
      .upload(filename, buffer, { contentType: 'image/jpeg', upsert: true })
    if (uploadErr) {
      console.error('[spotlight] image upload failed:', uploadErr.message)
      return null
    }
    return service.storage.from('product-photos').getPublicUrl(filename).data.publicUrl
  } catch (e) {
    console.error('[spotlight] image processing failed:', e)
    return null
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const business_name = String(body.business_name || '').trim().slice(0, MAX_NAME)
  const tagline = String(body.tagline || '').trim().slice(0, MAX_TAGLINE)
  const link_url = typeof body.link_url === 'string' ? body.link_url.trim() : ''
  const logo = typeof body.logo === 'string' ? body.logo : null
  const banner = typeof body.banner === 'string' ? body.banner : null

  if (!business_name) return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
  if (!tagline) return NextResponse.json({ error: 'Tagline is required' }, { status: 400 })
  if (link_url && !validLinkUrl(link_url)) return NextResponse.json({ error: 'Link must be a valid http(s) URL' }, { status: 400 })
  // Every submission (first-time or a resubmission after edits) re-accepts
  // the current Advertiser Terms (terms.sec_18) — required, not implied.
  if (body.terms_accepted !== true) return NextResponse.json({ error: 'You must accept the Advertiser Terms to submit' }, { status: 400 })

  const service = createServiceClient()

  const { data: existing } = await service
    .from('business_spotlights')
    .select('logo_url, banner_url')
    .eq('owner_id', user.id)
    .maybeSingle()

  let logoUrl: string | null = null
  if (logo && logo.startsWith('data:image/')) {
    logoUrl = await uploadSpotlightImage(service, logo, `spotlight/${user.id}.jpg`)
  }
  if (!logoUrl) logoUrl = existing?.logo_url || null

  let bannerUrl: string | null = null
  if (banner && banner.startsWith('data:image/')) {
    bannerUrl = await uploadSpotlightImage(service, banner, `spotlight/${user.id}-banner.jpg`)
  }
  if (!bannerUrl) bannerUrl = existing?.banner_url || null

  const { data, error } = await service
    .from('business_spotlights')
    .upsert({
      owner_id: user.id,
      business_name,
      tagline,
      link_url: link_url || null,
      logo_url: logoUrl,
      banner_url: bannerUrl,
      status: 'pending',
      rejected_reason: null,
      reviewed_at: null,
      reviewed_by: null,
      submitted_at: new Date().toISOString(),
      terms_accepted_at: new Date().toISOString(),
      terms_version: TERMS_VERSION,
    }, { onConflict: 'owner_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ spotlight: data })
}

// PATCH — pause/resume an already-submitted spotlight. Doesn't touch
// content or status, so it never triggers re-review.
export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  if (typeof body.is_active !== 'boolean') {
    return NextResponse.json({ error: 'is_active (boolean) is required' }, { status: 400 })
  }

  const service = createServiceClient()
  const { data, error } = await service
    .from('business_spotlights')
    .update({ is_active: body.is_active })
    .eq('owner_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ spotlight: data })
}
