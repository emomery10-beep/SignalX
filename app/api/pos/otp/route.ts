import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

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

export async function POST(req: NextRequest) {
  const supabase = createServiceClient()
  const body = await req.json()
  const { action, email } = body

  // ── CHECK STAFF EXISTS (before sending OTP from client) ───────────────────
  if (action === 'check_staff') {
    if (!email?.trim()) return json({ error: 'email required' }, 400)

    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq('email', email.trim().toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({
      error: 'Email not recognised. Ask your manager to add you.',
    }, 404)

    return json({ ok: true, name: staff.name })
  }

  // ── VERIFY STAFF after Supabase magic link auth ───────────────────────────
  // Called after Supabase authenticates the user — just looks up their staff record
  if (action === 'verify_staff') {
    if (!email?.trim()) return json({ error: 'email required' }, 400)

    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq('email', email.trim().toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Staff account not found or deactivated' }, 404)

    // Update last login
    await supabase
      .from('pos_staff')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', staff.id)

    return json({
      verified: true,
      staff: { id: staff.id, name: staff.name, role: staff.role, owner_id: staff.owner_id },
    })
  }

  return json({ error: 'Invalid action' }, 400)
}
