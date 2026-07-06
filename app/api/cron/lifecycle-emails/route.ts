import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, welcomeEmail, reEngagementEmail, unsubscribeUrl, firstNameOf } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 300

// ── Lifecycle email cron — runs daily ─────────────────────────────────────────
// Two flows, both deduped by the (user_id, email_type) unique constraint on
// lifecycle_emails, claimed BEFORE sending so a crash or a concurrently
// overlapping run can never email anyone twice:
//
//   welcome        — accounts created in the last WELCOME_WINDOW_DAYS.
//                    The window (not "everyone without one") means the first
//                    deploy doesn't blast the whole existing user base.
//   re_engagement  — last sign-in between INACTIVE_MIN and INACTIVE_MAX days
//                    ago. Bounded for the same reason: long-dead accounts are
//                    left in peace. Marketing consent (profiles.marketing_emails)
//                    is respected; the welcome email is a service message.

const WELCOME_WINDOW_DAYS = 3
const INACTIVE_MIN_DAYS   = 14
const INACTIVE_MAX_DAYS   = 60
const MAX_SENDS_PER_TYPE  = 200 // per run — the daily cadence drains any backlog
const LIST_USERS_MAX_PAGES = 10 // 1000/page via the admin API

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // ── Gather users (email, created_at, last_sign_in_at live in auth.users) ──
  type AuthUser = { id: string; email?: string; created_at: string; last_sign_in_at?: string }
  const users: AuthUser[] = []
  for (let page = 1; page <= LIST_USERS_MAX_PAGES; page++) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) return NextResponse.json({ error: `listUsers: ${error.message}` }, { status: 500 })
    users.push(...(data.users as AuthUser[]))
    if (data.users.length < 1000) break
  }

  const ids = users.map(u => u.id)
  const { data: profiles } = await service
    .from('profiles')
    .select('id, full_name, marketing_emails')
    .in('id', ids)
  const profileById = new Map((profiles || []).map(p => [p.id, p]))

  const now = Date.now()
  const day = 86400000
  const results = { welcome: { sent: 0, failed: 0 }, re_engagement: { sent: 0, failed: 0 }, skipped_unsubscribed: 0 }

  // Claim the (user, type) row first; only send if the claim was ours.
  // 23505 (unique violation) = already sent / another run owns it.
  const claim = async (userId: string, type: string): Promise<boolean> => {
    const { error } = await service.from('lifecycle_emails').insert({ user_id: userId, email_type: type })
    return !error
  }
  const releaseClaim = async (userId: string, type: string) => {
    await service.from('lifecycle_emails').delete().eq('user_id', userId).eq('email_type', type)
  }

  const sendFlow = async (
    user: AuthUser,
    type: 'welcome' | 're_engagement',
    build: (opts: { firstName: string; unsubscribeUrl: string }) => { subject: string; html: string },
  ) => {
    if (!user.email) return
    if (results[type].sent >= MAX_SENDS_PER_TYPE) return
    if (!(await claim(user.id, type))) return

    const unsub = unsubscribeUrl(user.id)
    const { subject, html } = build({ firstName: firstNameOf(profileById.get(user.id)?.full_name), unsubscribeUrl: unsub })
    const ok = await sendEmail({
      to: user.email,
      subject,
      html,
      replyTo: 'hello@askbiz.co',
      headers: {
        'List-Unsubscribe': `<${unsub}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })
    if (ok) {
      results[type].sent++
    } else {
      results[type].failed++
      await releaseClaim(user.id, type) // retried on the next run
    }
    await new Promise(r => setTimeout(r, 120)) // stay under Resend's rate limit
  }

  for (const user of users) {
    const createdAgo = now - new Date(user.created_at).getTime()
    const lastSeenAgo = now - new Date(user.last_sign_in_at || user.created_at).getTime()
    const optedOut = profileById.get(user.id)?.marketing_emails === false

    // Welcome — service message, sent regardless of marketing consent
    if (createdAgo <= WELCOME_WINDOW_DAYS * day) {
      await sendFlow(user, 'welcome', welcomeEmail)
      continue // brand-new accounts are never "inactive"
    }

    // Re-engagement — marketing, consent-gated
    if (lastSeenAgo >= INACTIVE_MIN_DAYS * day && lastSeenAgo <= INACTIVE_MAX_DAYS * day) {
      if (optedOut) { results.skipped_unsubscribed++; continue }
      await sendFlow(user, 're_engagement', reEngagementEmail)
    }
  }

  return NextResponse.json({ users_scanned: users.length, ...results })
}
