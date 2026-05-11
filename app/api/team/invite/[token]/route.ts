import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// GET: validate token and return invite details
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = createServiceClient()

  const { data: invite, error } = await supabase
    .from('team_members')
    .select('email, role, name, org_id, invite_expires_at, status')
    .eq('invite_token', params.token)
    .single()

  if (error || !invite) {
    return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
  }

  if (invite.status === 'active') {
    return NextResponse.json({ error: 'Invite already accepted' }, { status: 409 })
  }

  if (invite.status === 'removed') {
    return NextResponse.json({ error: 'This invite has been revoked' }, { status: 410 })
  }

  if (new Date(invite.invite_expires_at) < new Date()) {
    return NextResponse.json({ error: 'This invite has expired. Ask your team admin to send a new one.' }, { status: 410 })
  }

  return NextResponse.json({ invite })
}

// POST: accept the invite — mark as active and link user
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Must be signed in to accept invite' }, { status: 401 })
  }

  const serviceSupabase = createServiceClient()

  // Fetch the invite
  const { data: invite, error } = await serviceSupabase
    .from('team_members')
    .select('*')
    .eq('invite_token', params.token)
    .single()

  if (error || !invite) {
    return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
  }

  if (invite.status === 'active') {
    return NextResponse.json({ success: true, message: 'Already accepted' })
  }

  // Validate email matches
  if (invite.email.toLowerCase() !== user.email?.toLowerCase()) {
    return NextResponse.json({
      error: `This invite is for ${invite.email} but you are signed in as ${user.email}`
    }, { status: 403 })
  }

  // Check not expired
  if (new Date(invite.invite_expires_at) < new Date()) {
    return NextResponse.json({ error: 'This invite has expired' }, { status: 410 })
  }

  // Accept the invite
  const { error: updateError } = await serviceSupabase
    .from('team_members')
    .update({
      user_id: user.id,
      status: 'active',
      accepted_at: new Date().toISOString(),
      invite_token: null,  // consume the token
    })
    .eq('id', invite.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Update user profile with name if not set
  if (invite.name) {
    await serviceSupabase
      .from('profiles')
      .update({ full_name: invite.name })
      .eq('id', user.id)
  }

  return NextResponse.json({
    success: true,
    role: invite.role,
    org_id: invite.org_id,
    message: 'Invite accepted successfully',
  })
}
