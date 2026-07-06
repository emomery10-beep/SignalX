import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import {
  sendEmail, unsubscribeUrl, firstNameOf,
  welcomeEmail, reEngagement7DayEmail, reEngagementEmail, reEngagement30DayEmail,
  planUpgradeEmail, posSeatsWelcomeEmail,
} from '@/lib/email'
import { resolveLocale } from '@/lib/i18n-locale'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

async function getAdminUser(request: NextRequest, supabase: ReturnType<typeof createServiceClient>) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (user && ADMIN_EMAILS.includes(user.email || '')) return user
  }
  return null
}

type EmailType = 'welcome' | 're_engagement_7' | 're_engagement_14' | 're_engagement_30' | 'plan_upgrade' | 'pos_seats_welcome'

// POST /api/admin/send-test-email — lets an admin fire any real lifecycle email at
// any real user through the live Resend pipeline, on demand (support resends, or
// confirming a template renders correctly) — without waiting for the real automated
// trigger. Deliberately bypasses the lifecycle_emails claim table: that table's
// unique constraint exists to stop the *automated* cron/webhook from double-sending,
// not to gate a deliberate one-off admin action, and inserting from here risks
// colliding with a real dedupe key and silently suppressing a legitimate future
// automated send to that same user.
export async function POST(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId, emailType } = await request.json().catch(() => ({})) as { userId?: string; emailType?: EmailType }
  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'A "userId" is required' }, { status: 400 })
  }
  if (!emailType) {
    return NextResponse.json({ error: 'An "emailType" is required' }, { status: 400 })
  }

  const [{ data: authData }, { data: profile }] = await Promise.all([
    supabase.auth.admin.getUserById(userId),
    supabase.from('profiles').select('full_name, plan_id, preferred_locale, registration_country').eq('id', userId).single(),
  ])
  const to = authData?.user?.email
  if (!to) return NextResponse.json({ error: 'Could not find that user’s email' }, { status: 404 })

  const firstName = firstNameOf(profile?.full_name)
  const unsub = unsubscribeUrl(userId)
  const locale = resolveLocale({ profile: profile?.preferred_locale, country: profile?.registration_country })

  let built: { subject: string; html: string }
  switch (emailType) {
    case 'welcome':
      built = welcomeEmail({ firstName, unsubscribeUrl: unsub, locale })
      break
    case 're_engagement_7':
      built = reEngagement7DayEmail({ firstName, unsubscribeUrl: unsub, locale })
      break
    case 're_engagement_14':
      built = reEngagementEmail({ firstName, unsubscribeUrl: unsub, locale })
      break
    case 're_engagement_30':
      built = reEngagement30DayEmail({ firstName, unsubscribeUrl: unsub, locale })
      break
    case 'plan_upgrade': {
      const planId = profile?.plan_id || 'free'
      built = planUpgradeEmail({ firstName, planId, unsubscribeUrl: unsub, locale })
      break
    }
    case 'pos_seats_welcome':
      built = posSeatsWelcomeEmail({ firstName, unsubscribeUrl: unsub, locale })
      break
    default:
      return NextResponse.json({ error: `Unknown emailType "${emailType}"` }, { status: 400 })
  }

  const sentAt = new Date().toISOString()
  const ok = await sendEmail({
    to,
    subject: built.subject,
    html: built.html,
    replyTo: 'hello@askbiz.co',
    headers: {
      'List-Unsubscribe': `<${unsub}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  })

  if (!ok) return NextResponse.json({ error: 'Send failed — check RESEND_API_KEY and server logs' }, { status: 502 })
  return NextResponse.json({ success: true, to, emailType, sentAt })
}
