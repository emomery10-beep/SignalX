import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

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

/** Hash a PIN using SHA-256 with the staff ID as salt */
function hashPin(pin: string, staffId: string): string {
  return createHash('sha256').update(pin + staffId).digest('hex')
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

    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active, pin_hash')
      .eq('email', email.trim().toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Staff account not found or deactivated' }, 404)
    if (!staff.pin_hash) return json({ error: 'No PIN set — ask your manager to set your PIN in the dashboard.' }, 403)

    const expected = hashPin(String(pin), staff.id)
    if (expected !== staff.pin_hash) return json({ error: 'Incorrect PIN' }, 401)

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
        currency_symbol: (profile as any)?.currency_symbol || '£',
      },
    })
  }

  return json({ error: 'Invalid action' }, 400)
}
