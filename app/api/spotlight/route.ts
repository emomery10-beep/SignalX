import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

const MAX_NAME = 60
const MAX_TAGLINE = 90

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
export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const business_name = String(body.business_name || '').trim().slice(0, MAX_NAME)
  const tagline = String(body.tagline || '').trim().slice(0, MAX_TAGLINE)
  const link_url = typeof body.link_url === 'string' ? body.link_url.trim() : ''
  const logo = typeof body.logo === 'string' ? body.logo : null

  if (!business_name) return NextResponse.json({ error: 'Business name is required' }, { status: 400 })
  if (!tagline) return NextResponse.json({ error: 'Tagline is required' }, { status: 400 })
  if (link_url && !validLinkUrl(link_url)) return NextResponse.json({ error: 'Link must be a valid http(s) URL' }, { status: 400 })

  const service = createServiceClient()

  let logoUrl: string | null = null
  if (logo && logo.startsWith('data:image/')) {
    try {
      const base64Data = logo.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      if (buffer.length > 0 && buffer.length <= 5 * 1024 * 1024) {
        const filename = `spotlight/${user.id}.jpg`
        const { error: uploadErr } = await service.storage
          .from('product-photos')
          .upload(filename, buffer, { contentType: 'image/jpeg', upsert: true })
        if (!uploadErr) {
          logoUrl = service.storage.from('product-photos').getPublicUrl(filename).data.publicUrl
        } else {
          console.error('[spotlight] logo upload failed:', uploadErr.message)
        }
      }
    } catch (e) {
      console.error('[spotlight] logo processing failed:', e)
    }
  }

  // Preserve the existing logo when this edit didn't include a new one.
  if (!logoUrl) {
    const { data: existing } = await service
      .from('business_spotlights')
      .select('logo_url')
      .eq('owner_id', user.id)
      .maybeSingle()
    logoUrl = existing?.logo_url || null
  }

  const { data, error } = await service
    .from('business_spotlights')
    .upsert({
      owner_id: user.id,
      business_name,
      tagline,
      link_url: link_url || null,
      logo_url: logoUrl,
      status: 'pending',
      rejected_reason: null,
      reviewed_at: null,
      reviewed_by: null,
      submitted_at: new Date().toISOString(),
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
