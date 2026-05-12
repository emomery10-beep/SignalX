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
  const { action, email } = await req.json()

  if (!email?.trim()) return json({ error: 'email required' }, 400)

  // ── CHECK: does this email belong to an active staff member? ─────────────
  // Called before signInWithOtp so we don't send magic links to random people
  if (action === 'check_staff') {
    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name')
      .eq('email', email.trim().toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Email not recognised. Ask your manager to add you.' }, 404)
    return json({ ok: true, name: staff.name })
  }

  // ── VERIFY: after Supabase authenticates, confirm they're still active staff ─
  if (action === 'verify_staff') {
    const { data: staff } = await supabase
      .from('pos_staff')
      .select('id, name, role, owner_id, active')
      .eq('email', email.trim().toLowerCase())
      .eq('active', true)
      .maybeSingle()

    if (!staff) return json({ error: 'Staff account not found or deactivated' }, 404)

    await supabase.from('pos_staff')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', staff.id)

    return json({
      verified: true,
      staff: { id: staff.id, name: staff.name, role: staff.role, owner_id: staff.owner_id },
    })
  }

  return json({ error: 'Invalid action' }, 400)
}
