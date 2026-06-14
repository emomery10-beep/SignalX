import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'
import { logPosAudit } from '@/lib/pos-audit'
import type { PosAuthResult } from '@/lib/pos-auth'

function hashPin(pin: string, staffId: string): string {
  return createHash('sha256').update(pin + staffId).digest('hex')
}

// GET — owner fetches all staff
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  let { data, error } = await supabase
    .from('pos_staff')
    .select('id, name, email, phone, role, sector, sector_edit_count, active, last_login_at, created_at, pin_hash, location_id, location:pos_locations!location_id(id, name)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })

  // If columns don't exist yet (migration pending), fall back to query without them
  if (error && (error.message.includes('column') || error.message.includes('does not exist') || (error as any).code === '42703')) {
    const fallback = await supabase
      .from('pos_staff')
      .select('id, name, email, phone, role, active, last_login_at, created_at, pin_hash, location_id, location:pos_locations!location_id(id, name)')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
    data = fallback.data as any
    error = fallback.error
  }

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

  const { phone, email, name, role, pin, location_id, sector } = await req.json()
  if ((!phone && !email) || !name || !role) return NextResponse.json({ error: 'phone or email, name and role required' }, { status: 400 })

  // Accept both legacy roles AND template IDs (format: "business-type-role")
  const legacyRoles = ['cashier', 'inventory', 'repair', 'engineer', 'manager', 'supervisor', 'handler', 'driver', 'dispatcher', 'branch_manager']
  const isTemplate = typeof role === 'string' && role.includes('-')
  const isValidRole = legacyRoles.includes(role) || (isTemplate && /^(factory|restaurant|repair|salon|retail|logistics)-/.test(role))

  if (!isValidRole) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  if (sector && !['restaurant', 'repair', 'salon', 'retail', 'logistics'].includes(sector)) return NextResponse.json({ error: 'Invalid sector' }, { status: 400 })
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
      .insert({ owner_id: user.id, phone: phone || null, email: email || null, name, role, sector: sector || 'retail', sector_edit_count: 0, location_id: location_id || null })
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

    // Audit: staff created
    logPosAudit({
      auth: { ownerId: user.id, staffId: null, role: null, locationId: null } as PosAuthResult,
      event: 'staff.created',
      entityType: 'staff', entityId: data.id,
      metadata: { staff_name: data.name, role: data.role, sector: data.sector },
    })

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

  const { id, name, role, phone, email, active, pin, location_id, sector } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Accept both legacy roles AND template IDs (format: "business-type-role")
  if (role !== undefined) {
    const legacyRoles = ['cashier', 'inventory', 'repair', 'engineer', 'manager', 'supervisor', 'handler', 'driver', 'dispatcher', 'branch_manager']
    const isTemplate = typeof role === 'string' && role.includes('-')
    const isValidRole = legacyRoles.includes(role) || (isTemplate && /^(factory|restaurant|repair|salon|retail|logistics)-/.test(role))

    if (!isValidRole) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
  }

  // Enforce sector edit limit of 2
  if (sector !== undefined) {
    const { data: existing } = await supabase.from('pos_staff').select('sector, sector_edit_count').eq('id', id).eq('owner_id', user.id).single()
    if (existing && sector !== existing.sector) {
      const editCount = existing.sector_edit_count ?? 0
      if (editCount >= 2) {
        return NextResponse.json({ error: 'Sector edit limit reached. Purchase a new seat to reassign this staff member.', sector_limit: true }, { status: 403 })
      }
    }
  }

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
  if (location_id !== undefined) updates.location_id = location_id || null
  if (sector !== undefined) {
    updates.sector = sector
    // Only increment count when sector actually changes (checked above)
    const { data: cur } = await supabase.from('pos_staff').select('sector, sector_edit_count').eq('id', id).eq('owner_id', user.id).single()
    if (cur && sector !== cur.sector) updates.sector_edit_count = (cur.sector_edit_count ?? 0) + 1
  }

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

    // Audit: deactivated, pin changed, or general update
    const ownerAuth = { ownerId: user.id, staffId: null, role: null, locationId: null } as PosAuthResult
    if (active === false) {
      logPosAudit({ auth: ownerAuth, event: 'staff.deactivated', entityType: 'staff', entityId: id,
        metadata: { staff_name: data.name } })
    } else if (pin) {
      logPosAudit({ auth: ownerAuth, event: 'staff.pin_changed', entityType: 'staff', entityId: id,
        metadata: { staff_name: data.name } })
    } else {
      logPosAudit({ auth: ownerAuth, event: 'staff.updated', entityType: 'staff', entityId: id,
        metadata: { staff_name: data.name, updated_fields: Object.keys(updates) } })
    }

    return NextResponse.json({ staff: { ...data, has_pin: !!data.pin_hash, pin_hash: undefined } })
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', message: err.message }, { status: 500 })
  }
}
