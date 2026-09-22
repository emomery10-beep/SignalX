import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, welcomeEmail, reEngagementEmail, firstProductEmail, unsubscribeUrl, firstNameOf } from '@/lib/email'
import { resolveLocale, type Lang } from '@/lib/i18n-locale'

export const runtime = 'nodejs'
export const maxDuration = 300

// ── Lifecycle email cron — runs daily ─────────────────────────────────────────
// Three flows, all deduped by the (user_id, email_type) unique constraint on
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
//   first_product  — pos_enabled but the catalogue (`inventory`) is still
//                    empty FIRST_PRODUCT_MIN..MAX_DAYS after signup. Gated on
//                    real product-catalogue state, not login recency, so it
//                    can fire even for someone who keeps signing in without
//                    ever stocking their till — see
//                    [[pos-post-signup-activation-crisis]] in project memory:
//                    71% of pos_enabled accounts (90d) never added a single
//                    product. Marketing-consent gated, same as re_engagement.

const WELCOME_WINDOW_DAYS = 3
const INACTIVE_MIN_DAYS   = 14
const INACTIVE_MAX_DAYS   = 60
const FIRST_PRODUCT_MIN_DAYS = 3
const FIRST_PRODUCT_MAX_DAYS = 45
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
    .select('id, full_name, marketing_emails, preferred_locale, registration_country, pos_enabled')
    .in('id', ids)
  const profileById = new Map((profiles || []).map(p => [p.id, p]))

  const now = Date.now()
  const day = 86400000

  // Precompute which pos_enabled accounts in the first_product age window
  // already have at least one product — cheaper than a per-user query, and
  // scoped to only the candidates that could actually qualify below.
  const firstProductCandidateIds = users
    .filter(u => {
      const createdAgo = now - new Date(u.created_at).getTime()
      return createdAgo >= FIRST_PRODUCT_MIN_DAYS * day && createdAgo <= FIRST_PRODUCT_MAX_DAYS * day
        && profileById.get(u.id)?.pos_enabled
    })
    .map(u => u.id)
  const { data: invRows } = firstProductCandidateIds.length
    ? await service.from('inventory').select('owner_id').in('owner_id', firstProductCandidateIds)
    : { data: [] as { owner_id: string }[] }
  const hasProducts = new Set((invRows || []).map(r => r.owner_id))

  const results = {
    welcome: { sent: 0, failed: 0 },
    re_engagement: { sent: 0, failed: 0 },
    first_product: { sent: 0, failed: 0 },
    skipped_unsubscribed: 0,
  }

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
    type: 'welcome' | 're_engagement' | 'first_product',
    build: (opts: { firstName: string; unsubscribeUrl: string; locale: Lang }) => { subject: string; html: string },
  ) => {
    if (!user.email) return
    if (results[type].sent >= MAX_SENDS_PER_TYPE) return
    if (!(await claim(user.id, type))) return

    const profile = profileById.get(user.id)
    const locale = resolveLocale({ profile: profile?.preferred_locale, country: profile?.registration_country })
    const unsub = unsubscribeUrl(user.id)
    const { subject, html } = build({ firstName: firstNameOf(profile?.full_name), unsubscribeUrl: unsub, locale })
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
      if (optedOut) { results.skipped_unsubscribed++ }
      else await sendFlow(user, 're_engagement', reEngagementEmail)
    }

    // First-product nudge — independent of login recency (see comment at
    // the top of this file); can fire alongside re_engagement above.
    if (createdAgo >= FIRST_PRODUCT_MIN_DAYS * day && createdAgo <= FIRST_PRODUCT_MAX_DAYS * day
      && profileById.get(user.id)?.pos_enabled && !hasProducts.has(user.id)) {
      if (optedOut) { results.skipped_unsubscribed++ }
      else await sendFlow(user, 'first_product', firstProductEmail)
    }
  }

  return NextResponse.json({ users_scanned: users.length, ...results })
}
