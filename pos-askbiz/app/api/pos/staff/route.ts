import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'
import { getSector } from '@/lib/pos-role-client'
import { hashPin } from '@/lib/pin'
import { sanitizeName } from '@/lib/sanitize'

// All valid pos_staff.role values — must mirror the pos_staff_role_check
// constraint (supabase/migrations/043_counter_clerk.sql) exactly. Anything
// not in this list is rejected here with a clean 400 instead of falling
// through to a raw DB constraint-violation 500.
const VALID_ROLES = [
  'cashier', 'inventory', 'repair', 'engineer', 'manager', 'supervisor',
  'handler', 'driver', 'dispatcher', 'branch_manager',
  'retail-cashier', 'retail-floor-staff', 'retail-inventory-manager', 'retail-shift-supervisor', 'retail-manager',
  'factory-line-operator', 'factory-quality-inspector', 'factory-shift-supervisor', 'factory-production-manager', 'factory-inventory-manager',
  'restaurant-server', 'restaurant-lead-server', 'restaurant-host', 'restaurant-head-chef', 'restaurant-kitchen-manager', 'restaurant-line-cook', 'restaurant-operations-manager', 'restaurant-cashier',
  'repair-intake-specialist', 'repair-technician', 'repair-quality-checker', 'repair-manager',
  'salon-receptionist', 'salon-stylist', 'salon-esthetician', 'salon-manager',
  'logistics-counter-clerk', 'logistics-handler', 'logistics-driver', 'logistics-dispatcher', 'logistics-branch-manager',
]

// A staff row's sector follows its role prefix (e.g. factory-* -> 'factory')
// so factory/restaurant/salon/repair/logistics staff don't default to the
// 'retail' column default — see migration 20260724000010_inventory_sector.sql
// and 052_fix_logistics_sector.sql for the same drift already hit once for
// logistics roles.
function sectorForRole(role: string): string {
  return getSector(role) || 'retail'
}

// GET — any authenticated POS session (owner or PIN staff) fetches all staff.
// Deliberately not gated on staff.manage: restaurant/floor and
// restaurant/labor read this same endpoint for rostering, not just managers.
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { data, error } = await service
    .from('pos_staff')
    .select('id, name, email, phone, role, active, last_login_at, created_at, pin_hash, location_id, location:pos_locations!location_id(id, name)')
    .eq('owner_id', auth.ownerId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return has_pin flag instead of the actual hash
  const staff = (data || []).map(s => ({ ...s, has_pin: !!s.pin_hash, pin_hash: undefined }))
  return NextResponse.json({ staff })
}

// POST — owner or manager (staff.manage) adds a new staff member
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'staff.manage')) {
    return NextResponse.json({ error: 'Your role does not have permission to add staff' }, { status: 403 })
  }

  const service = createServiceClient()
  const { phone, email, name: rawName, role, pin, location_id } = await req.json()
  // A staff name is written by one person (owner/manager) and displayed to
  // others — owner dashboards, receipts, the audit log — so it is untrusted
  // input to those surfaces, not just a label for its author.
  const name = sanitizeName(rawName)
  if ((!phone && !email) || !name || !role) return NextResponse.json({ error: 'phone or email, name and role required' }, { status: 400 })
  if (!VALID_ROLES.includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  if (pin && (String(pin).length < 4 || String(pin).length > 6)) return NextResponse.json({ error: 'PIN must be 4–6 digits' }, { status: 400 })

  // ── Enforce seat limit ────────────────────────────────────────────────────
  const { data: profile } = await service
    .from('profiles')
    .select('pos_seat_count')
    .eq('id', auth.ownerId)
    .single()

  const seatLimit = (profile as { pos_seat_count?: number } | null)?.pos_seat_count ?? 0

  const { count: activeCount } = await service
    .from('pos_staff')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', auth.ownerId)
    .eq('active', true)

  if ((activeCount ?? 0) >= seatLimit) {
    return NextResponse.json({
      error: `Seat limit reached. You have ${seatLimit} paid seat${seatLimit !== 1 ? 's' : ''} and ${activeCount} active staff member${activeCount !== 1 ? 's' : ''}. Go to Billing to add more seats.`,
      seat_limit: true,
    }, { status: 403 })
  }

  try {
    const { data, error } = await service
      .from('pos_staff')
      .insert({
        owner_id:    auth.ownerId,
        phone:       phone || null,
        email:       email || null,
        name,
        role,
        sector:      sectorForRole(role),
        location_id: location_id || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message, code: (error as any).code }, { status: 500 })
    }

    // Hash and store PIN if provided
    if (pin && data) {
      const pin_hash = hashPin(String(pin))
      await service.from('pos_staff').update({ pin_hash }).eq('id', data.id)
    }

    return NextResponse.json({ staff: { ...data, has_pin: !!pin, pin_hash: undefined } })
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', message: err.message }, { status: 500 })
  }
}

// PATCH — owner or manager (staff.manage) updates a staff member (name, role, phone, email, active, pin)
export async function PATCH(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  if (!hasPermission(auth.role, 'staff.manage')) {
    return NextResponse.json({ error: 'Your role does not have permission to edit staff' }, { status: 403 })
  }

  const service = createServiceClient()
  const { id, name, role, phone, email, active, pin, location_id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  if ((phone !== undefined || email !== undefined) && !phone && !email) {
    return NextResponse.json({ error: 'At least phone or email required' }, { status: 400 })
  }
  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }
  if (pin && (String(pin).length < 4 || String(pin).length > 6)) {
    return NextResponse.json({ error: 'PIN must be 4–6 digits' }, { status: 400 })
  }

  // ── If reactivating, check seat limit first ──────────────────────────────
  if (active === true) {
    const { data: profile } = await service
      .from('profiles').select('pos_seat_count').eq('id', auth.ownerId).single()

    const seatLimit = (profile as { pos_seat_count?: number } | null)?.pos_seat_count ?? 0
    const { count: activeCount } = await service
      .from('pos_staff').select('id', { count: 'exact', head: true })
      .eq('owner_id', auth.ownerId).eq('active', true)

    if ((activeCount ?? 0) >= seatLimit) {
      return NextResponse.json({
        error: `Seat limit reached. You have ${seatLimit} paid seat${seatLimit !== 1 ? 's' : ''}. Go to Billing to add more seats before reactivating staff.`,
        seat_limit: true,
      }, { status: 403 })
    }
  }

  const updates: Record<string, unknown> = {}
  if (name   !== undefined) {
    // The DB trigger rejects a name that is nothing but markup; catch it
    // here so the caller gets a clean 400 instead of a constraint error.
    const cleanName = sanitizeName(name)
    if (!cleanName) return NextResponse.json({ error: 'Name must contain at least one ordinary character' }, { status: 400 })
    updates.name = cleanName
  }
  if (role   !== undefined) { updates.role = role; updates.sector = sectorForRole(role) }
  if (phone  !== undefined) updates.phone  = phone || null
  if (email  !== undefined) updates.email  = email || null
  if (active !== undefined) updates.active = active
  if (location_id !== undefined) updates.location_id = location_id || null

  // PIN update — need staff ID to hash
  if (pin) {
    updates.pin_hash = hashPin(String(pin))
  }

  try {
    const { data, error } = await service
      .from('pos_staff')
      .update(updates)
      .eq('id', id)
      .eq('owner_id', auth.ownerId)
      .select('id, name, email, phone, role, active, last_login_at, created_at, pin_hash, location_id, location:pos_locations!location_id(id, name)')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ staff: { ...data, has_pin: !!data.pin_hash, pin_hash: undefined } })
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', message: err.message }, { status: 500 })
  }
}
