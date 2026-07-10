import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const source = typeof body?.source === 'string' ? body.source.slice(0, 64) : 'landing_page'
  const country = typeof body?.country === 'string' ? body.country.slice(0, 64) : null
  const locale = typeof body?.locale === 'string' ? body.locale.slice(0, 8) : null

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }

  const db = createServiceClient()
  const { error } = await db.from('leads').insert({ email, source, country, locale })

  if (error) {
    console.error('[api/lead] insert failed:', error)
    return NextResponse.json({ error: 'Could not save your email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
