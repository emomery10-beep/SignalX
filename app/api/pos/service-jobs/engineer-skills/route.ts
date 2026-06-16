import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

// 'engineer' legacy role or any repair-technician/specialist template role
function isEngineerRole(role: string | null | undefined): boolean {
  if (!role) return false
  if (role === 'engineer') return true
  return /^repair-(technician|specialist|intake-specialist)$/.test(role)
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET — list skills for an engineer, or engineers for a preset
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  const { searchParams } = new URL(req.url)
  const staff_id = searchParams.get('staff_id')
  const preset_id = searchParams.get('preset_id')

  const service = createServiceClient()

  if (staff_id) {
    const { data, error } = await service
      .from('pos_engineer_skills')
      .select('*, preset:pos_service_presets!preset_id(id, name, category, price)')
      .eq('staff_id', staff_id)

    if (error) return json({ error: error.message }, 500)
    return json({ skills: data })
  }

  if (preset_id) {
    // Find all engineers who can do this repair
    const { data, error } = await service
      .from('pos_engineer_skills')
      .select('*, staff:pos_staff!staff_id(id, name, role, active, location_id)')
      .eq('preset_id', preset_id)

    if (error) return json({ error: error.message }, 500)

    // Filter to active engineers (legacy 'engineer' role or repair-technician template role)
    const qualified = (data || []).filter((s: any) => s.staff?.active && isEngineerRole(s.staff?.role))
    return json({ engineers: qualified })
  }

  return json({ error: 'staff_id or preset_id required' }, 400)
}

// POST — assign a skill to an engineer
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'service.manage')) {
    return json({ error: 'Only repair/manager/owner can manage engineer skills' }, 403)
  }

  const service = createServiceClient()
  const { staff_id, preset_id, proficiency } = await req.json()

  if (!staff_id || !preset_id) {
    return json({ error: 'staff_id and preset_id required' }, 400)
  }

  // Verify staff is an engineer
  const { data: staff } = await service
    .from('pos_staff')
    .select('id, role')
    .eq('id', staff_id)
    .eq('owner_id', auth.ownerId)
    .maybeSingle()

  if (!staff) return json({ error: 'Staff not found' }, 404)
  if (!isEngineerRole(staff.role)) return json({ error: 'Staff must be an engineer or technician' }, 400)

  const { data, error } = await service
    .from('pos_engineer_skills')
    .upsert({
      staff_id,
      preset_id,
      proficiency: proficiency || 'standard',
    }, { onConflict: 'staff_id,preset_id' })
    .select('*, preset:pos_service_presets!preset_id(id, name, category)')
    .single()

  if (error) return json({ error: error.message }, 500)
  return json({ skill: data }, 201)
}

// DELETE — remove a skill from an engineer
export async function DELETE(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)

  if (!hasPermission(auth.role, 'service.manage')) {
    return json({ error: 'Only repair/manager/owner can manage engineer skills' }, 403)
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return json({ error: 'id required' }, 400)

  const { error } = await service
    .from('pos_engineer_skills')
    .delete()
    .eq('id', id)

  if (error) return json({ error: error.message }, 500)
  return json({ deleted: true })
}
