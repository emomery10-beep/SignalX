import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — owner fetches all staff
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('pos_staff')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ staff: data })
}

// POST — owner adds a new staff member
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { phone, email, name, role } = await req.json()
  if ((!phone && !email) || !name || !role) return NextResponse.json({ error: 'phone or email, name and role required' }, { status: 400 })
  if (!['cashier', 'inventory'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

  const { data, error } = await supabase
    .from('pos_staff')
    .insert({ owner_id: user.id, phone: phone || null, email: email || null, name, role })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ staff: data })
}

// PATCH — owner updates a staff member (name, role, active)
export async function PATCH(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id, name, role, active } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (name   !== undefined) updates.name   = name
  if (role   !== undefined) updates.role   = role
  if (active !== undefined) updates.active = active

  const { data, error } = await supabase
    .from('pos_staff')
    .update(updates)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ staff: data })
}
