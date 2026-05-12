import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

function hashPin(pin: string, staffId: string): string {
  return createHash('sha256').update(pin + staffId).digest('hex')
}

// GET — owner fetches all staff
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('pos_staff')
    .select('id, name, email, phone, role, active, last_login_at, created_at, pin_hash')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return has_pin flag instead of the actual hash
  const staff = (data || []).map(s => ({ ...s, has_pin: !!s.pin_hash, pin_hash: undefined }))
  return NextResponse.json({ staff })
}

// POST — owner adds a new staff member
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { phone, email, name, role, pin } = await req.json()
  if ((!phone && !email) || !name || !role) return NextResponse.json({ error: 'phone or email, name and role required' }, { status: 400 })
  if (!['cashier', 'inventory'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  if (pin && (String(pin).length < 4 || String(pin).length > 6)) return NextResponse.json({ error: 'PIN must be 4–6 digits' }, { status: 400 })

  // ── Enforce seat limit ────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('pos_seat_count')
    .eq('id', user.id)
    .single()

  const seatLimit = (profile as { pos_seat_count?: number } | null)?.pos_seat_count ?? 0

  const { count: activeCount } = await supabase
    .from('pos_staff')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .eq('active', true)

  if ((activeCount ?? 0) >= seatLimit) {
    return NextResponse.json({
      error: `Seat limit reached. You have ${seatLimit} paid seat${seatLimit !== 1 ? 's' : ''} and ${activeCount} active staff member${activeCount !== 1 ? 's' : ''}. Go to Billing to add more seats.`,
      seat_limit: true,
    }, { status: 403 })
  }

  try {
    const { data, error } = await supabase
      .from('pos_staff')
      .insert({ owner_id: user.id, phone: phone || null, email: email || null, name, role })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message, code: (error as any).code }, { status: 500 })
    }

    // Hash and store PIN if provided
    if (pin && data) {
      const pin_hash = hashPin(String(pin), data.id)
      await supabase.from('pos_staff').update({ pin_hash }).eq('id', data.id)
    }

    return NextResponse.json({ staff: { ...data, has_pin: !!pin, pin_hash: undefined } })
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', message: err.message }, { status: 500 })
  }
}

// PATCH — owner updates a staff member (name, role, phone, email, active, pin)
export async function PATCH(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, name, role, phone, email, active, pin } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  if ((phone !== undefined || email !== undefined) && !phone && !email) {
    return NextResponse.json({ error: 'At least phone or email required' }, { status: 400 })
  }
  if (pin && (String(pin).length < 4 || String(pin).length > 6)) {
    return NextResponse.json({ error: 'PIN must be 4–6 digits' }, { status: 400 })
  }

  // ── If reactivating, check seat limit first ──────────────────────────────
  if (active === true) {
    const { data: profile } = await supabase
      .from('profiles').select('pos_seat_count').eq('id', user.id).single()

    const seatLimit = (profile as { pos_seat_count?: number } | null)?.pos_seat_count ?? 0
    const { count: activeCount } = await supabase
      .from('pos_staff').select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id).eq('active', true)

    if ((activeCount ?? 0) >= seatLimit) {
      return NextResponse.json({
        error: `Seat limit reached. You have ${seatLimit} paid seat${seatLimit !== 1 ? 's' : ''}. Go to Billing to add more seats before reactivating staff.`,
        seat_limit: true,
      }, { status: 403 })
    }
  }

  const updates: Record<string, unknown> = {}
  if (name   !== undefined) updates.name   = name
  if (role   !== undefined) updates.role   = role
  if (phone  !== undefined) updates.phone  = phone || null
  if (email  !== undefined) updates.email  = email || null
  if (active !== undefined) updates.active = active

  // PIN update — need staff ID to hash
  if (pin) {
    updates.pin_hash = hashPin(String(pin), id)
  }

  try {
    const { data, error } = await supabase
      .from('pos_staff')
      .update(updates)
      .eq('id', id)
      .eq('owner_id', user.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ staff: { ...data, has_pin: !!data.pin_hash, pin_hash: undefined } })
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', message: err.message }, { status: 500 })
  }
}
