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

// ── In-memory rate limiter for PIN attempts ───────────────────
// { emailKey: { count, resetAt } }
const pinAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 5 * 60 * 1000 // 5-minute window

function checkPinRateLimit(email: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const key = email.trim().toLowerCase()
  const rec = pinAttempts.get(key)
  if (!rec || now > rec.resetAt) {
    pinAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 }
  }
  rec.count += 1
  if (rec.count > MAX_ATTEMPTS) return { allowed: false, remaining: 0 }
  return { allowed: true, remaining: MAX_ATTEMPTS - rec.count }
}

function clearPinRateLimit(email: string) {
  pinAttempts.delete(email.trim().toLowerCase())
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  const { action, email, pin } = await req.json()

  if (!email?.trim()) return json({ error: 'email required' }, 400)

  // ── CHECK: does this email belong to an active staff member? ─────────────
  if (action === 'check_staff') {
    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, pin_hash')
      .eq('email', email.trim().toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Email not recognised. Ask your manager to add you.' }, 404)

    // Tell the client whether this staff member has a PIN set
    return json({ ok: true, name: staff.name, has_pin: !!staff.pin_hash })
  }

  // ── VERIFY PIN: check PIN and return staff session ────────────────────────
  if (action === 'verify_pin') {
    if (!pin) return json({ error: 'PIN required' }, 400)

    // Rate limit: max 5 attempts per 5 minutes per email
    const limit = checkPinRateLimit(String(email))
    if (!limit.allowed) return json({ error: 'Too many PIN attempts. Please wait 5 minutes.' }, 429)

    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active, pin_hash, location_id')
      .eq('email', email.trim().toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Staff account not found or deactivated' }, 404)
    if (!staff.pin_hash) return json({ error: 'No PIN set — ask your manager to set your PIN in the dashboard.' }, 403)

    if (!verifyPin(String(pin), staff.pin_hash, staff.id)) return json({ error: 'Incorrect PIN' }, 401)

    // Clear rate limit on successful auth
    clearPinRateLimit(String(email))

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
