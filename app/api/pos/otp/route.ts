import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendOTP } from '@/lib/whatsapp'
import { sendOTPEmail } from '@/lib/email'

const CORS = {
  'Access-Control-Allow-Origin': 'https://pos.askbiz.co',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS })
}

// POST /api/pos/otp — send OTP or verify it
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { action, phone, email, code } = await req.json()

  const contact = phone?.trim() || email?.trim()
  if (!contact) return json({ error: 'phone or email required' }, 400)
  const isEmail = !!email?.trim()

  // ── SEND OTP ──────────────────────────────────────────────
  if (action === 'send') {
    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq(isEmail ? 'email' : 'phone', contact)
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({
      error: isEmail
        ? 'Email not recognised. Ask your manager to add you.'
        : 'Phone number not recognised. Ask your manager to add you.',
    }, 404)

    const otp        = Math.floor(100000 + Math.random() * 900000).toString()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await supabase.from('pos_otp').insert({ phone: contact, code: otp, expires_at })

    if (isEmail) {
      const ok = await sendOTPEmail(contact, otp, staff.name)
      if (!ok) console.error('[pos/otp] Email send failed for', contact)
    } else {
      const { ok, error: waError } = await sendOTP(contact, otp)
      if (!ok) console.error('[pos/otp] WhatsApp send failed:', waError)
    }

    return json({ sent: true, name: staff.name, method: isEmail ? 'email' : 'whatsapp' })
  }

  // ── VERIFY OTP ───────────────────────────────────────────
  if (action === 'verify') {
    if (!code) return json({ error: 'code required' }, 400)

    const { data: otp } = await supabase
      .from('pos_otp')
      .select('*')
      .eq('phone', contact)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!otp) return json({ error: 'Invalid or expired code' }, 401)

    await supabase.from('pos_otp').update({ used: true }).eq('id', otp.id)

    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq(isEmail ? 'email' : 'phone', contact)
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Staff account not found' }, 404)

    await supabase.from('pos_staff').update({ last_login_at: new Date().toISOString() }).eq('id', staff.id)

    return json({
      verified: true,
      staff: { id: staff.id, name: staff.name, role: staff.role, owner_id: staff.owner_id },
    })
  }

  return json({ error: 'Invalid action' }, 400)
}
