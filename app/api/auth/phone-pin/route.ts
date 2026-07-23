import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { phoneToSyntheticEmail, isValidPin, PHONE_PIN_MAX_ATTEMPTS, PHONE_PIN_LOCKOUT_MS } from '@/lib/phone-auth'
import { countryFromPhone } from '@/lib/geo'

const RESET_CONTACT_MSG = 'Contact customer@askbiz.co or WhatsApp 0713826241 to reset your PIN.'

// Service-role client — creates users and reads/writes the attempts table
// (which has RLS blocking direct anon/authenticated access).
const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
// Anon-key client — used only to run the real password check via GoTrue,
// so the actual PIN verification goes through the same code path as every
// other password login in the app.
const anon = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const { action, phone, pin } = body || {}

  if (!action || !phone) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (!isValidPin(pin || '')) return NextResponse.json({ error: 'PIN must be 4 digits' }, { status: 400 })

  const email = phoneToSyntheticEmail(phone)
  const db = admin()

  if (action === 'signup') {
    const { firstName, lastName, consentVersion } = body
    const { data, error } = await db.auth.admin.createUser({
      email,
      password: pin,
      email_confirm: true,
      user_metadata: {
        full_name: `${firstName || ''} ${lastName || ''}`.trim(),
        phone,
        // Recorded proof of affirmative consent (GDPR Art. 7(1)) — same
        // shape as the email signup path in app/(auth)/signin/page.tsx.
        consent_accepted: true,
        consent_accepted_at: new Date().toISOString(),
        consent_terms_version: consentVersion,
        consent_privacy_version: consentVersion,
      },
    })
    if (error) {
      if (/already.*registered|already exists/i.test(error.message)) {
        return NextResponse.json({ error: 'This phone number already has an account. Sign in instead.' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    // Best-effort: seed country_code from the signup phone's dial code right
    // away, rather than leaving it null until onboarding's location-confirm
    // step — which some users skip. Never blocks signup on failure; this is
    // enrichment, not core to account creation (same spirit as
    // handle_new_user's own "never block auth" exception handling).
    const cc = countryFromPhone(phone)
    if (cc && data.user) {
      await db.from('profiles').update({ country_code: cc }).eq('id', data.user.id)
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'signin') {
    const { data: attempt } = await db.from('phone_pin_attempts').select('*').eq('phone', phone).maybeSingle()
    if (attempt?.locked_until && new Date(attempt.locked_until) > new Date()) {
      const retryMins = Math.ceil((new Date(attempt.locked_until).getTime() - Date.now()) / 60000)
      return NextResponse.json({ error: `Too many attempts. Try again in ${retryMins} minute${retryMins === 1 ? '' : 's'}. ${RESET_CONTACT_MSG}` }, { status: 429 })
    }

    const { data, error } = await anon().auth.signInWithPassword({ email, password: pin })

    if (error) {
      const failedCount = (attempt?.failed_count || 0) + 1
      const locked = failedCount >= PHONE_PIN_MAX_ATTEMPTS
      await db.from('phone_pin_attempts').upsert({
        phone,
        failed_count: locked ? 0 : failedCount,
        locked_until: locked ? new Date(Date.now() + PHONE_PIN_LOCKOUT_MS).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      if (locked) return NextResponse.json({ error: `Too many attempts. Try again in 15 minutes. ${RESET_CONTACT_MSG}` }, { status: 429 })
      return NextResponse.json({ error: 'Incorrect PIN', attemptsRemaining: PHONE_PIN_MAX_ATTEMPTS - failedCount }, { status: 401 })
    }

    if (attempt) await db.from('phone_pin_attempts').delete().eq('phone', phone)
    return NextResponse.json({ session: data.session })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
