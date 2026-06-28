import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { sendEmail, teamInviteEmail } from '@/lib/email'
import { randomBytes } from 'crypto'
import { getCallerContext, can } from '@/lib/team-auth'

export const runtime = 'nodejs'

const VALID_ROLES = ['owner', 'admin', 'analyst', 'accountant', 'buyer', 'viewer']

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Team members see their org's team; owners see their own team
  const { orgId, role } = await getCallerContext(user.id, supabase)

  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .eq('org_id', orgId)
    .neq('status', 'removed')
    .order('invited_at', { ascending: false })

  return NextResponse.json({ members: members || [], roles: VALID_ROLES, callerRole: role })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orgId, role } = await getCallerContext(user.id, supabase)
  if (!can(role, 'invite')) {
    return NextResponse.json({ error: 'Only owners and admins can invite team members' }, { status: 403 })
  }

  const { email, role: inviteRole, name } = await request.json()
  if (!email || !inviteRole) return NextResponse.json({ error: 'email and role required' }, { status: 400 })
  if (!VALID_ROLES.includes(inviteRole) || inviteRole === 'owner') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // Admins cannot invite other admins
  if (role === 'admin' && inviteRole === 'admin') {
    return NextResponse.json({ error: 'Admins cannot invite other admins' }, { status: 403 })
  }

  const { data: existing } = await supabase
    .from('team_members')
    .select('id, status')
    .eq('org_id', orgId)
    .eq('email', email)
    .single()

  if (existing && existing.status !== 'removed') {
    return NextResponse.json({ error: 'This person is already a team member' }, { status: 409 })
  }

  const invite_token = randomBytes(32).toString('hex')
  const invite_expires_at = new Date(Date.now() + 7 * 86400000).toISOString()

  const admin = createServiceClient()
  const { data: member, error } = await admin
    .from('team_members')
    .upsert({
      team_id: orgId,
      org_id: orgId,
      email,
      role: inviteRole,
      name: name || email.split('@')[0],
      status: 'pending',
      invited_at: new Date().toISOString(),
      invite_token,
      invite_expires_at,
    }, { onConflict: 'org_id,email' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const inviterName = profile?.full_name || user.email?.split('@')[0] || 'Your colleague'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'
  const acceptUrl = `${appUrl}/invite/${invite_token}`

  const emailSent = await sendEmail({
    to: email,
    subject: `${inviterName} invited you to AskBiz`,
    html: teamInviteEmail({
      inviterName,
      inviteeName: name || email.split('@')[0],
      role: inviteRole,
      acceptUrl,
    }),
  })

  return NextResponse.json({
    member,
    emailSent,
    acceptUrl,
    message: emailSent
      ? `Invitation sent to ${email}`
      : `Member added — email not sent (check RESEND_API_KEY). Share this link: ${acceptUrl}`,
  })
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orgId, role } = await getCallerContext(user.id, supabase)
  if (!can(role, 'manage_team')) {
    return NextResponse.json({ error: 'Only owners and admins can manage team members' }, { status: 403 })
  }

  const { id, role: newRole, status } = await request.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Fetch the target member to prevent privilege escalation
  const { data: target } = await supabase
    .from('team_members')
    .select('role')
    .eq('id', id)
    .eq('org_id', orgId)
    .single()

  if (!target) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

  // Admins cannot modify other admins
  if (role === 'admin' && (target.role === 'admin' || newRole === 'admin')) {
    return NextResponse.json({ error: 'Admins cannot modify other admins' }, { status: 403 })
  }

  const update: Record<string, string> = {}
  if (newRole && VALID_ROLES.includes(newRole) && newRole !== 'owner') update.role = newRole
  if (status) update.status = status

  const { data, error } = await supabase
    .from('team_members')
    .update(update)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ member: data })
}
