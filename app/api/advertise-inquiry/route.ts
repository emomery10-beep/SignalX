import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const MAX_NAME = 80
const MAX_PHONE = 30
const MAX_EMAIL = 120

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// POST — anonymous "Advertise here" lead capture from the signin page's
// floating bubble (components/AdvertiseInquiryModal.tsx). No auth: this is
// a marketing contact-me form, not the merchant self-serve flow (see
// app/api/spotlight for that). Always lands as 'pending' for an admin to
// review at /admin/spotlight → Inquiries.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const name = String(body.name || '').trim().slice(0, MAX_NAME)
  const phone = String(body.phone || '').trim().slice(0, MAX_PHONE)
  const email = String(body.email || '').trim().slice(0, MAX_EMAIL)

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  if (!phone) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
  if (!email || !validEmail(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })

  const service = createServiceClient()
  const { error } = await service
    .from('advertise_inquiries')
    .insert({ name, phone, email })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
