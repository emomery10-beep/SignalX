import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHmac } from 'crypto'
import { sendEmail, welcomeEmail } from '@/lib/email'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

async function getAdminUser(request: NextRequest, supabase: ReturnType<typeof createServiceClient>) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (user && ADMIN_EMAILS.includes(user.email || '')) return user
  }
  return null
}

// Same token scheme as app/api/cron/lifecycle-emails/route.ts's unsubscribeUrl() —
// must match exactly, or a manually-sent email's unsubscribe link would fail
// verification against /api/email/unsubscribe.
function unsubscribeUrl(userId: string): string {
  const key = process.env.TOKEN_ENCRYPTION_KEY || process.env.CRON_SECRET || ''
  const token = createHmac('sha256', key).update(userId).digest('hex')
  return `https://askbiz.co/api/email/unsubscribe?uid=${userId}&t=${token}`
}

function firstNameOf(fullName?: string | null): string {
  return (fullName || '').trim().split(/\s+/)[0] || ''
}

// POST /api/admin/send-welcome-email — lets an admin manually (re)send the
// welcome email to a specific user, on demand, from the admin panel — the
// automated lifecycle cron only sends it once, within a 3-day signup window;
// this covers anyone missed, or a deliberate resend for support purposes.
export async function POST(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId } = await request.json().catch(() => ({}))
  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  const { data: userRes, error: userErr } = await supabase.auth.admin.getUserById(userId)
  if (userErr || !userRes?.user?.email) {
    return NextResponse.json({ error: userErr?.message || 'User not found' }, { status: 404 })
  }

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', userId).maybeSingle()

  const unsub = unsubscribeUrl(userId)
  const { subject, html } = welcomeEmail({ firstName: firstNameOf(profile?.full_name), unsubscribeUrl: unsub })
  const ok = await sendEmail({
    to: userRes.user.email,
    subject,
    html,
    replyTo: 'hello@askbiz.co',
    headers: {
      'List-Unsubscribe': `<${unsub}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })

  if (!ok) return NextResponse.json({ error: 'Send failed — check RESEND_API_KEY and server logs' }, { status: 502 })

  // Best-effort record, so the daily lifecycle cron doesn't also auto-send this
  // user a welcome email later. Not required to succeed (e.g. already claimed
  // by an earlier automated send) — the admin's explicit resend still goes out.
  await supabase.from('lifecycle_emails').insert({ user_id: userId, email_type: 'welcome' }).then(() => {}, () => {})

  return NextResponse.json({ success: true, to: userRes.user.email })
}
