import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { isValidPin } from '@/lib/phone-auth'
import { sendOTP } from '@/lib/whatsapp'

// Self-service "forgot PIN" — verifies phone ownership over WhatsApp before
// letting anyone set a new PIN. Companion to app/api/auth/phone-pin/route.ts;
// see supabase/migrations/20260723000002_phone_pin_reset.sql for the two
// tables this reads/writes.
const RESET_CODE_TTL_MS = 10 * 60 * 1000
const RESET_COOLDOWN_MS = 60 * 1000
const RESET_MAX_ATTEMPTS = 5
const GENERIC_ERROR = 'Invalid or expired code. Request a new one.'

const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { action, phone } = body || {}
  if (!action || !phone) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const db = admin()

  if (action === 'request') {
    // Always respond the same way whether or not this phone has an account,
    // whether or not a code was actually sent — the request step must not
    // let a caller learn which phone numbers are registered.
    const generic = NextResponse.json({ ok: true })

    const { data: identity } = await db.from('phone_pin_identities').select('user_id').eq('phone', phone).maybeSingle()
    if (!identity) return generic

    const { data: existing } = await db.from('phone_pin_resets').select('created_at').eq('phone', phone).maybeSingle()
    if (existing && Date.now() - new Date(existing.created_at).getTime() < RESET_COOLDOWN_MS) return generic

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const { error: upsertError } = await db.from('phone_pin_resets').upsert({
      phone,
      code_hash: hashCode(code),
      attempts: 0,
      expires_at: new Date(Date.now() + RESET_CODE_TTL_MS).toISOString(),
      created_at: new Date().toISOString(),
    })
    if (upsertError) {
      console.error('[phone-pin-reset] failed to store reset code:', upsertError.message)
      return generic
    }

    const sent = await sendOTP(phone, code)
    if (!sent.ok) console.error('[phone-pin-reset] sendOTP failed:', sent.error)

    return generic
  }

  if (action === 'confirm') {
    const { code, newPin } = body
    if (!isValidPin(newPin || '')) return NextResponse.json({ error: 'PIN must be 4 digits' }, { status: 400 })
    if (!/^\d{6}$/.test(code || '')) return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })

    const { data: reset } = await db.from('phone_pin_resets').select('*').eq('phone', phone).maybeSingle()
    if (!reset || new Date(reset.expires_at) < new Date()) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })
    }
    if (reset.attempts >= RESET_MAX_ATTEMPTS) {
      await db.from('phone_pin_resets').delete().eq('phone', phone)
      return NextResponse.json({ error: 'Too many attempts. Request a new code.' }, { status: 429 })
    }
    if (hashCode(code) !== reset.code_hash) {
      const attempts = reset.attempts + 1
      await db.from('phone_pin_resets').update({ attempts }).eq('phone', phone)
      return NextResponse.json({ error: GENERIC_ERROR, attemptsRemaining: RESET_MAX_ATTEMPTS - attempts }, { status: 401 })
    }

    const { data: identity } = await db.from('phone_pin_identities').select('user_id').eq('phone', phone).maybeSingle()
    if (!identity) return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 })

    const { error: authError } = await db.auth.admin.updateUserById(identity.user_id, { password: newPin })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

    await db.from('phone_pin_attempts').delete().eq('phone', phone)
    await db.from('profiles').update({ must_change_pin: false }).eq('id', identity.user_id)
    await db.from('phone_pin_resets').delete().eq('phone', phone)

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
