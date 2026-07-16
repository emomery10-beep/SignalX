import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { hashPin, verifyPin, needsRehash } from '@/lib/pin'

// CORS is handled globally by next.config.js headers() for all /api/pos/* routes.
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// ── DB-backed rate limiter for PIN attempts ───────────────────
// Durable across cold starts and shared across serverless instances
// (unlike the old in-memory Map this replaced). Keyed by staff_id in
// pos_staff_pin_attempts — see supabase/migrations/20260716000001_pos_staff_pin_attempts.sql
// and the mirrored pattern in the root app's phone_pin_attempts.
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

const RESET_CONTACT_MSG = 'Contact customer@askbiz.co or WhatsApp 0713826241 to reset your PIN.'

// Owners add/edit staff phone numbers through a plain text field with no
// country code or E.164 normalisation — numbers end up stored however they
// were typed (e.g. "0797446343"). The login form, on the other hand, builds
// a proper E.164 value from the selected country + local digits. Matching
// strictly on one format silently rejects real staff, so we generate every
// plausible stored variant from (dial, local digits) and match against all
// of them.
function phoneCandidates(dial: string, raw: string): string[] {
  const digits = String(raw).replace(/\D/g, '').replace(/^0+/, '')
  if (!digits) return []
  return Array.from(new Set([
    `${dial}${digits}`,   // E.164, e.g. +254797446343
    `0${digits}`,         // local with leading zero, e.g. 0797446343
    digits,                // bare local digits, e.g. 797446343
  ]))
}

// Resolve the login identifier: staff log in with EITHER email or phone.
// Email takes precedence if both are somehow sent. Email is normalised to
// lowercase (matches how it's stored); phone may arrive as a raw local
// number + dial code (preferred, generates all candidate formats) or as a
// single pre-built value (fallback, matched as-is).
function resolveIdentifier(body: Record<string, unknown>): { column: 'email' | 'phone'; values: string[]; key: string } | null {
  const email = body.email ? String(body.email).trim().toLowerCase() : ''
  if (email) return { column: 'email', values: [email], key: `email:${email}` }

  const dial = body.dial ? String(body.dial).trim() : ''
  const rawPhone = body.phone ? String(body.phone).trim() : ''
  if (!rawPhone) return null

  const values = dial ? phoneCandidates(dial, rawPhone) : [rawPhone]
  if (!values.length) return null
  return { column: 'phone', values, key: `phone:${values[0]}` }
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return json({ error: 'Invalid request' }, 400) }
  const action = String(body.action ?? '')
  const pin = body.pin

  const id = resolveIdentifier(body)
  if (!id) return json({ error: 'Phone or email required' }, 400)

  // ── CHECK: does this identifier belong to an active staff member? ────────
  if (action === 'check_staff') {
    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, pin_hash')
      .in(id.column, id.values)
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Not recognised. Ask your manager to add you.' }, 404)

    // Tell the client whether this staff member has a PIN set
    return json({ ok: true, name: staff.name, has_pin: !!staff.pin_hash })
  }

  // ── VERIFY PIN: check PIN and return staff session ────────────────────────
  if (action === 'verify_pin') {
    if (!pin) return json({ error: 'PIN required' }, 400)

    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active, pin_hash, location_id')
      .in(id.column, id.values)
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Staff account not found or deactivated' }, 404)
    if (!staff.pin_hash) return json({ error: 'No PIN set — ask your manager to set your PIN in the dashboard.' }, 403)

    const { data: attempt } = await supabase
      .from('pos_staff_pin_attempts')
      .select('*')
      .eq('staff_id', staff.id)
      .maybeSingle()

    if (attempt?.locked_until && new Date(attempt.locked_until) > new Date()) {
      const retryMins = Math.ceil((new Date(attempt.locked_until).getTime() - Date.now()) / 60000)
      return json({ error: `Too many attempts. Try again in ${retryMins} minute${retryMins === 1 ? '' : 's'}. ${RESET_CONTACT_MSG}` }, 429)
    }

    if (!verifyPin(String(pin), staff.pin_hash, staff.id)) {
      const failedCount = (attempt?.failed_count || 0) + 1
      const locked = failedCount >= MAX_ATTEMPTS
      await supabase.from('pos_staff_pin_attempts').upsert({
        staff_id: staff.id,
        failed_count: locked ? 0 : failedCount,
        locked_until: locked ? new Date(Date.now() + LOCKOUT_MS).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      if (locked) return json({ error: `Too many attempts. Try again in 15 minutes. ${RESET_CONTACT_MSG}` }, 429)
      return json({ error: 'Incorrect PIN', attemptsRemaining: MAX_ATTEMPTS - failedCount }, 401)
    }

    // Clear failed-attempt record on successful auth
    if (attempt) await supabase.from('pos_staff_pin_attempts').delete().eq('staff_id', staff.id)

    // Transparently upgrade legacy (SHA-256) hashes to scrypt on successful login.
    // Best-effort — never fail login if the upgrade write errors.
    if (needsRehash(staff.pin_hash)) {
      try {
        await supabase.from('pos_staff')
          .update({ pin_hash: hashPin(String(pin)) })
          .eq('id', staff.id)
      } catch { /* ignore — login still succeeds */ }
    }

    // Fetch owner currency
    const { data: profile } = await supabase
      .from('profiles')
      .select('currency_symbol')
      .eq('id', staff.owner_id)
      .single()

    await supabase.from('pos_staff')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', staff.id)

    return json({
      verified: true,
      staff: {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        owner_id: staff.owner_id,
        location_id: staff.location_id || null,
        currency_symbol: (profile as any)?.currency_symbol || '£',
      },
    })
  }

  return json({ error: 'Invalid action' }, 400)
}
