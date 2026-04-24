import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, teamInviteEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

export const runtime = 'nodejs'

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner:      ['all'],
  admin:      ['read', 'write', 'invite'],
  analyst:    ['read', 'write'],
  accountant: ['read', 'financial'],
  buyer:      ['read', 'inventory'],
  viewer:     ['read'],
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .eq('org_id', user.id)
    .neq('status', 'removed')
    .order('invited_at', { ascending: false })

  return NextResponse.json({ members: members || [], roles: Object.keys(ROLE_PERMISSIONS) })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email, role, name } = await request.json()
  if (!email || !role) return NextResponse.json({ error: 'email and role required' }, { status: 400 })
  if (!ROLE_PERMISSIONS[role]) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

  // Check not already a member
  const { data: existing } = await supabase
    .from('team_members')
    .select('id, status')
    .eq('org_id', user.id)
    .eq('email', email)
    .single()

  if (existing && existing.status !== 'removed') {
    return NextResponse.json({ error: 'This person is already a team member' }, { status: 409 })
  }

  // Generate invite token
  const invite_token = randomBytes(32).toString('hex')
  const invite_expires_at = new Date(Date.now() + 7 * 86400000).toISOString()

  const { data: member, error } = await supabase
    .from('team_members')
    .upsert({
      org_id: user.id,
      email,
      role,
      name: name || email.split('@')[0],
      status: 'pending',
      invited_at: new Date().toISOString(),
      invite_token,
      invite_expires_at,
    }, { onConflict: 'org_id,email' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get inviter profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const inviterName = profile?.full_name || user.email?.split('@')[0] || 'Your colleague'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://askbiz.co'
  const acceptUrl = `${appUrl}/invite/${invite_token}`

  // Send invite email
  const emailSent = await sendEmail({
    to: email,
    subject: `${inviterName} invited you to AskBiz`,
    html: teamInviteEmail({
      inviterName,
      inviteeName: name || email.split('@')[0],
      role,
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

  const { id, role, status } = await request.json()
  const update: Record<string, string> = {}
  if (role)   update.role   = role
  if (status) update.status = status

  const { data, error } = await supabase
    .from('team_members')
    .update(update)
    .eq('id', id)
    .eq('org_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ member: data })
}
