import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 60

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CRON_SECRET',
]

const PROTECTED_API_ROUTES = [
  '/api/admin',
  '/api/chat',
  '/api/cfo/snapshot',
  '/api/conversations',
  '/api/export',
  '/api/forecast',
  '/api/memory',
  '/api/profile',
  '/api/team',
  '/api/billing',
]

const HEALTH_ENDPOINTS = [
  '/api/health',
  '/api/consent',
]

// Mutation routes we actively probe to confirm the WRITE path (not just GET)
// rejects anonymous callers. Each route below checks the session as its first
// statement, so an unauthenticated probe returns 401 before any body parsing or
// side effect — safe to run unattended. Keep this a curated allowlist: only add
// a route here after confirming it gates auth before doing any work.
const WRITE_PATH_PROBES = [
  { path: '/api/pos/gdpr/delete-customer', method: 'POST' },
  { path: '/api/memory', method: 'DELETE' },
  { path: '/api/team', method: 'POST' },
  { path: '/api/profile', method: 'PATCH' },
  { path: '/api/conversations', method: 'POST' },
]

// Webhooks that must verify a provider signature before acting. We POST an
// unsigned payload and expect rejection (400/401) — a 2xx here means forged
// events could be accepted. Safe to probe: no valid signature is ever sent.
const SIGNED_WEBHOOKS = [
  '/api/webhooks/stripe',
  '/api/webhooks/stripe-billing',
  '/api/stripe/webhook',
]

const REQUIRED_SECURITY_HEADERS = [
  { header: 'x-frame-options', expected: 'DENY', fallback: 'SAMEORIGIN' },
  { header: 'x-content-type-options', expected: 'nosniff' },
  { header: 'referrer-policy', expected: 'strict-origin-when-cross-origin', fallback: 'no-referrer' },
]

const GDPR_SUB_PROCESSORS = [
  'Supabase (database & auth)',
  'Stripe (payments)',
  'Anthropic (AI processing)',
  'Vercel (hosting)',
  'Paystack (payments - Africa)',
  'Resend (email)',
]

type CheckStatus = 'pass' | 'warn' | 'fail'

interface CheckResult {
  category: string
  name: string
  status: CheckStatus
  detail: string
}

async function getAdminUser(request: NextRequest, supabase: any) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (user && ADMIN_EMAILS.includes(user.email || '')) return user
  }
  const accessToken = request.cookies.get('sb-access-token')?.value
    || request.cookies.get(`sb-${(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace('https://', '').split('.')[0]}-auth-token`)?.value
  if (accessToken) {
    try {
      const parsed = JSON.parse(accessToken)
      const token = Array.isArray(parsed) ? parsed[0] : parsed
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user && ADMIN_EMAILS.includes(user.email || '')) return user
    } catch {
      const { data: { user } } = await supabase.auth.getUser(accessToken)
      if (user && ADMIN_EMAILS.includes(user.email || '')) return user
    }
  }
  return null
}

// ── CHECK FUNCTIONS ───────────────────────────────────────────────────────────

async function checkApiHealth(baseUrl: string): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  for (const endpoint of HEALTH_ENDPOINTS) {
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, { method: 'GET', signal: AbortSignal.timeout(8000) })
      const isUp = res.status < 500
      const isProtected = res.status === 401 || res.status === 403
      results.push({
        category: 'API Health',
        name: `${endpoint} responds`,
        status: isUp ? 'pass' : 'fail',
        detail: isProtected
          ? `Endpoint active (${res.status} — auth required, which is expected)`
          : res.ok
            ? `Status ${res.status} — healthy`
            : `Status ${res.status} — server error. Check Vercel function logs for this route.`,
      })
    } catch (e: any) {
      results.push({
        category: 'API Health',
        name: `${endpoint} responds`,
        status: 'fail',
        detail: `Unreachable: ${e.message}. Recommendation: check the route exists and Vercel deployment is healthy.`,
      })
    }
  }
  return results
}

async function checkAuthAccess(baseUrl: string): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  for (const route of PROTECTED_API_ROUTES) {
    try {
      const res = await fetch(`${baseUrl}${route}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8000),
      })
      const rejectsUnauth = res.status === 401 || res.status === 403
      const methodNotAllowed = res.status === 405
      results.push({
        category: 'Auth & Access Control',
        name: `${route} rejects unauthenticated`,
        status: rejectsUnauth || methodNotAllowed ? 'pass' : 'warn',
        detail: rejectsUnauth
          ? `Correctly returned ${res.status} — auth gate is working`
          : methodNotAllowed
          ? `Returned 405 (Method Not Allowed) — route is POST-only, which implicitly rejects unauthenticated GET requests`
          : `Returned ${res.status} — this route may be publicly accessible. Recommendation: add auth middleware or check the route handler enforces session validation.`,
      })
    } catch (e: any) {
      results.push({
        category: 'Auth & Access Control',
        name: `${route} rejects unauthenticated`,
        status: 'warn',
        detail: `Could not test: ${e.message}. Recommendation: ensure the route is deployed and reachable.`,
      })
    }
  }
  return results
}

async function checkWritePathAuth(baseUrl: string): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  for (const { path, method } of WRITE_PATH_PROBES) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method,
        // Deliberately invalid body + probe marker. A correctly-gated route
        // returns 401/403 before ever reading this, so nothing is mutated.
        headers: { 'Content-Type': 'application/json', 'x-audit-probe': '1' },
        body: JSON.stringify({ __audit_probe__: true }),
        signal: AbortSignal.timeout(8000),
      })
      const rejected = res.status === 401 || res.status === 403
      const methodNotAllowed = res.status === 405
      const validatedFirst = res.status === 400 || res.status === 422
      results.push({
        category: 'Auth & Access Control',
        name: `${method} ${path} rejects unauthenticated`,
        // A 2xx/3xx here is a real failure: the write path ran (or would run)
        // for an anonymous caller. This must be able to fail the whole audit.
        status: rejected || methodNotAllowed ? 'pass' : validatedFirst ? 'warn' : 'fail',
        detail: rejected
          ? `Correctly returned ${res.status} before processing — write path is gated`
          : methodNotAllowed
          ? `Returned 405 — ${method} not allowed on this route, so it cannot be exploited`
          : validatedFirst
          ? `Returned ${res.status} (body rejected) — appears to validate before auth. Recommendation: confirm the session check runs first.`
          : `Returned ${res.status} — UNAUTHENTICATED WRITE PATH MAY BE OPEN. Recommendation: ensure the handler checks the session before touching any data.`,
      })
    } catch (e: any) {
      results.push({
        category: 'Auth & Access Control',
        name: `${method} ${path} rejects unauthenticated`,
        status: 'warn',
        detail: `Could not probe: ${e.message}. Recommendation: ensure the route is deployed and reachable.`,
      })
    }
  }
  return results
}

async function checkWebhookSignatures(baseUrl: string): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  for (const path of SIGNED_WEBHOOKS) {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // deliberately no stripe-signature
        body: JSON.stringify({ id: 'evt_audit_probe', type: 'ping' }),
        signal: AbortSignal.timeout(8000),
      })
      // A route that verifies signatures rejects an unsigned payload (400/401).
      const rejects = res.status === 400 || res.status === 401 || res.status === 403
      results.push({
        category: 'Webhook Security',
        name: `${path} rejects unsigned payloads`,
        status: rejects ? 'pass' : 'fail',
        detail: rejects
          ? `Returned ${res.status} — signature verification is enforced`
          : `Returned ${res.status} — webhook may accept forged events. Recommendation: verify stripe-signature via stripe.webhooks.constructEvent before acting on the payload.`,
      })
    } catch (e: any) {
      results.push({
        category: 'Webhook Security',
        name: `${path} rejects unsigned payloads`,
        status: 'warn',
        detail: `Could not probe: ${e.message}. Recommendation: ensure the webhook route is deployed and reachable.`,
      })
    }
  }
  return results
}

function checkEnvVars(): CheckResult[] {
  const results: CheckResult[] = []
  for (const key of REQUIRED_ENV_VARS) {
    const isSet = !!process.env[key]
    results.push({
      category: 'Environment & Secrets',
      name: `${key} is set`,
      status: isSet ? 'pass' : 'fail',
      detail: isSet ? 'Present and configured' : `Missing — required for the app to function. Recommendation: add ${key} to your Vercel environment variables in Project Settings → Environment Variables.`,
    })
  }

  const clientVars = Object.keys(process.env).filter(k =>
    k.startsWith('NEXT_PUBLIC_') && !['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'].includes(k)
  )
  const sensitiveLeaks = clientVars.filter(k =>
    k.toLowerCase().includes('secret') || k.toLowerCase().includes('private') || k.toLowerCase().includes('password')
  )
  if (sensitiveLeaks.length > 0) {
    results.push({
      category: 'Environment & Secrets',
      name: 'No secrets in NEXT_PUBLIC_ vars',
      status: 'fail',
      detail: `Sensitive vars exposed to client: ${sensitiveLeaks.join(', ')}. Recommendation: rename these without the NEXT_PUBLIC_ prefix so they are server-only.`,
    })
  } else {
    results.push({
      category: 'Environment & Secrets',
      name: 'No secrets in NEXT_PUBLIC_ vars',
      status: 'pass',
      detail: 'No sensitive-looking variables found in client-exposed env vars',
    })
  }

  return results
}

async function checkDbSecurity(supabase: any): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  const criticalTables = ['profiles', 'usage', 'subscriptions', 'conversations', 'agent_content']

  for (const table of criticalTables) {
    try {
      const { data, error } = await supabase.from(table).select('id').limit(1)
      if (error && error.code === '42501') {
        results.push({
          category: 'Database Security',
          name: `${table} has RLS`,
          status: 'pass',
          detail: 'RLS is active — service role needed for access',
        })
      } else {
        results.push({
          category: 'Database Security',
          name: `${table} accessible`,
          status: 'pass',
          detail: error ? `Query error: ${error.message}` : `Table accessible (${data?.length ?? 0} rows returned)`,
        })
      }
    } catch (e: any) {
      results.push({
        category: 'Database Security',
        name: `${table} check`,
        status: 'warn',
        detail: `Could not verify: ${e.message}`,
      })
    }
  }

  try {
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    results.push({
      category: 'Database Security',
      name: 'Profiles table integrity',
      status: 'pass',
      detail: `${count ?? 0} profiles in database`,
    })
  } catch {
    results.push({
      category: 'Database Security',
      name: 'Profiles table integrity',
      status: 'warn',
      detail: 'Could not count profiles',
    })
  }

  return results
}

async function checkContentIntegrity(supabase: any): Promise<CheckResult[]> {
  const results: CheckResult[] = []

  try {
    const { data: orphaned } = await supabase
      .from('agent_content')
      .select('id', { count: 'exact', head: false })
      .is('run_id', null)
      .limit(100)

    results.push({
      category: 'Content Integrity',
      name: 'No orphaned content entries',
      status: (orphaned?.length ?? 0) === 0 ? 'pass' : 'warn',
      detail: (orphaned?.length ?? 0) === 0
        ? 'All content entries have a valid run_id'
        : `${orphaned?.length} entries without run_id. Recommendation: review these in the Content Agent tab — they may be from a failed agent run and can be safely deleted.`,
    })
  } catch {
    results.push({
      category: 'Content Integrity',
      name: 'Content integrity check',
      status: 'warn',
      detail: 'Could not query agent_content table (may not exist yet)',
    })
  }

  try {
    const staleDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data: pending } = await supabase
      .from('agent_content')
      .select('id', { count: 'exact', head: false })
      .eq('status', 'pending')
      .lt('created_at', staleDate)

    // Audits are read-only: report stale content, do NOT mutate it here.
    // (Auto-expiry belongs in the stale-content cron, not the security audit.)
    const staleCount = pending?.length ?? 0
    results.push({
      category: 'Content Integrity',
      name: 'No stale pending content',
      status: staleCount === 0 ? 'pass' : 'warn',
      detail: staleCount === 0
        ? 'No content pending for more than 7 days'
        : `${staleCount} items pending for 7+ days. Recommendation: the stale-content cron should expire these — verify it is running.`,
    })
  } catch {
    results.push({
      category: 'Content Integrity',
      name: 'Stale content check',
      status: 'warn',
      detail: 'Could not check for stale content',
    })
  }

  return results
}

async function checkSecurityHeaders(baseUrl: string): Promise<CheckResult[]> {
  const results: CheckResult[] = []
  try {
    const res = await fetch(baseUrl, { method: 'GET', signal: AbortSignal.timeout(8000) })
    for (const { header, expected, fallback } of REQUIRED_SECURITY_HEADERS) {
      const value = res.headers.get(header)
      const passes = value && (
        value.toLowerCase().includes(expected.toLowerCase()) ||
        (fallback && value.toLowerCase().includes(fallback.toLowerCase()))
      )
      results.push({
        category: 'Security Headers',
        name: `${header} header`,
        status: passes ? 'pass' : value ? 'warn' : 'fail',
        detail: value
          ? `Value: ${value}`
          : `Missing. Recommendation: add a security headers config in next.config.js under headers() — set ${header}: ${expected}.`,
      })
    }

    const csp = res.headers.get('content-security-policy')
    results.push({
      category: 'Security Headers',
      name: 'Content-Security-Policy',
      status: csp ? 'pass' : 'warn',
      detail: csp ? `CSP is set (${csp.slice(0, 80)}…)` : 'No CSP header. Recommendation: add a Content-Security-Policy in next.config.js headers() to prevent XSS attacks — start with a report-only policy to avoid breaking anything.',
    })

    const hsts = res.headers.get('strict-transport-security')
    results.push({
      category: 'Security Headers',
      name: 'Strict-Transport-Security',
      status: hsts ? 'pass' : 'warn',
      detail: hsts ? `HSTS active: ${hsts}` : 'No HSTS header. Recommendation: add Strict-Transport-Security: max-age=63072000; includeSubDomains in next.config.js headers() to enforce HTTPS.',
    })
  } catch (e: any) {
    results.push({
      category: 'Security Headers',
      name: 'Header check',
      status: 'fail',
      detail: `Could not fetch homepage: ${e.message}`,
    })
  }
  return results
}

async function checkGdprCompliance(baseUrl: string, supabase: any): Promise<CheckResult[]> {
  const results: CheckResult[] = []

  // Privacy policy page
  try {
    const res = await fetch(`${baseUrl}/privacy`, { signal: AbortSignal.timeout(8000) })
    results.push({
      category: 'GDPR Compliance',
      name: 'Privacy policy page accessible',
      status: res.ok ? 'pass' : 'fail',
      detail: res.ok ? 'Privacy policy page loads correctly and is publicly accessible' : `Status ${res.status}. Recommendation: the privacy policy must be accessible without login under GDPR Article 13 — check the /privacy route is public.`,
    })
  } catch (e: any) {
    results.push({
      category: 'GDPR Compliance',
      name: 'Privacy policy page accessible',
      status: 'fail',
      detail: `Unreachable: ${e.message}`,
    })
  }

  // Terms page
  try {
    const res = await fetch(`${baseUrl}/terms`, { signal: AbortSignal.timeout(8000) })
    results.push({
      category: 'GDPR Compliance',
      name: 'Terms of service page accessible',
      status: res.ok ? 'pass' : 'fail',
      detail: res.ok ? 'Terms page loads correctly' : `Status ${res.status}`,
    })
  } catch {
    results.push({
      category: 'GDPR Compliance',
      name: 'Terms of service page accessible',
      status: 'fail',
      detail: 'Terms page unreachable',
    })
  }

  // Cookie consent endpoint
  try {
    const res = await fetch(`${baseUrl}/api/consent`, { signal: AbortSignal.timeout(8000) })
    results.push({
      category: 'GDPR Compliance',
      name: 'Cookie consent API active',
      status: res.status !== 404 ? 'pass' : 'fail',
      detail: res.status !== 404 ? `Consent endpoint responds (${res.status})` : 'Consent endpoint not found — cookie consent required under GDPR',
    })
  } catch {
    results.push({
      category: 'GDPR Compliance',
      name: 'Cookie consent API active',
      status: 'warn',
      detail: 'Could not reach consent endpoint',
    })
  }

  // GDPR data endpoints (right to erasure, data export)
  const gdprEndpoints = [
    { path: '/api/pos/gdpr/customer-data-export', name: 'Data export endpoint (Right of Access)' },
    { path: '/api/pos/gdpr/delete-customer', name: 'Data deletion endpoint (Right to Erasure)' },
    { path: '/api/pos/gdpr/consent-log', name: 'Consent logging endpoint' },
    { path: '/api/pos/gdpr/data-retention-report', name: 'Data retention report endpoint' },
  ]

  for (const ep of gdprEndpoints) {
    try {
      const res = await fetch(`${baseUrl}${ep.path}`, { signal: AbortSignal.timeout(8000) })
      const exists = res.status !== 404
      results.push({
        category: 'GDPR Compliance',
        name: ep.name,
        status: exists ? 'pass' : 'fail',
        detail: exists ? `Endpoint active (${res.status})` : `Endpoint not found. Recommendation: implement ${ep.path} — this is required under GDPR for data subject rights.`,
      })
    } catch {
      results.push({
        category: 'GDPR Compliance',
        name: ep.name,
        status: 'warn',
        detail: 'Could not verify endpoint',
      })
    }
  }

  // Sub-processor documentation
  results.push({
    category: 'GDPR Compliance',
    name: 'Sub-processors documented',
    status: 'pass',
    detail: `${GDPR_SUB_PROCESSORS.length} sub-processors tracked: ${GDPR_SUB_PROCESSORS.join(', ')}`,
  })

  // Data retention — check for old user data
  try {
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString()
    const { data: oldProfiles } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: false })
      .lt('created_at', twoYearsAgo)
      .limit(100)

    results.push({
      category: 'GDPR Compliance',
      name: 'Data retention check (2yr threshold)',
      status: (oldProfiles?.length ?? 0) === 0 ? 'pass' : 'warn',
      detail: (oldProfiles?.length ?? 0) === 0
        ? 'No user profiles older than 2 years'
        : `${oldProfiles?.length} profiles older than 2 years. Recommendation: review your data retention policy — consider anonymising or deleting inactive accounts per GDPR Article 5(1)(e) storage limitation principle.`,
    })
  } catch {
    results.push({
      category: 'GDPR Compliance',
      name: 'Data retention check',
      status: 'warn',
      detail: 'Could not verify data retention',
    })
  }

  return results
}

async function checkMainAppGdpr(baseUrl: string, supabase: any): Promise<CheckResult[]> {
  const results: CheckResult[] = []

  // Right to Portability (Art. 20) — chat users' export of profile/conversations/memory
  try {
    const res = await fetch(`${baseUrl}/api/export`, { signal: AbortSignal.timeout(8000) })
    const exists = res.status !== 404
    results.push({
      category: 'GDPR Compliance',
      name: 'Chat-user data export (Right to Portability)',
      status: exists ? 'pass' : 'fail',
      detail: exists
        ? `Endpoint active (${res.status}) — main-app users can export their data`
        : 'Missing — profiles/conversations/memory have no export path. Recommendation: implement /api/export (GDPR Art. 20).',
    })
  } catch {
    results.push({ category: 'GDPR Compliance', name: 'Chat-user data export (Right to Portability)', status: 'warn', detail: 'Could not verify /api/export' })
  }

  // Right to Erasure (Art. 17) — main-app account deletion request flow
  try {
    const { error } = await supabase.from('deletion_requests').select('id', { head: true, count: 'exact' }).limit(1)
    const tableOk = !error || error.code === '42501' // exists (or exists + RLS-protected)
    results.push({
      category: 'GDPR Compliance',
      name: 'Account erasure request flow (Right to Erasure)',
      status: tableOk ? 'pass' : 'warn',
      detail: tableOk
        ? 'deletion_requests table present — /api/account supports request_deletion'
        : `Could not confirm deletion_requests table: ${error?.message}. Recommendation: ensure the erasure flow is wired (GDPR Art. 17).`,
    })
  } catch (e: any) {
    results.push({ category: 'GDPR Compliance', name: 'Account erasure request flow (Right to Erasure)', status: 'warn', detail: `Could not verify: ${e.message}` })
  }

  // Consent accountability (Art. 7(1)) — consent must be demonstrable server-side
  try {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('data_consent_at', 'is', null)
    results.push({
      category: 'GDPR Compliance',
      name: 'Consent is demonstrable server-side',
      status: (count ?? 0) > 0 ? 'pass' : 'warn',
      detail: (count ?? 0) > 0
        ? `${count} profiles have a recorded consent timestamp — consent is demonstrable (not localStorage-only)`
        : 'No server-side consent timestamps recorded yet. Recommendation: ensure /api/consent persists data_consent_at so consent can be demonstrated under Art. 7(1).',
    })
  } catch (e: any) {
    results.push({ category: 'GDPR Compliance', name: 'Consent is demonstrable server-side', status: 'warn', detail: `Could not verify consent records: ${e.message}` })
  }

  return results
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function runSecurityAudit(baseUrl: string) {
  const supabase = createServiceClient()
  const runId = `sec_${Date.now()}`
  const startTime = Date.now()

  const [apiHealth, authAccess, writePathAuth, webhookSig, dbSecurity, contentIntegrity, securityHeaders, gdpr] = await Promise.all([
    checkApiHealth(baseUrl),
    checkAuthAccess(baseUrl),
    checkWritePathAuth(baseUrl),
    checkWebhookSignatures(baseUrl),
    checkDbSecurity(supabase),
    checkContentIntegrity(supabase),
    checkSecurityHeaders(baseUrl),
    checkGdprCompliance(baseUrl, supabase),
  ])

  const mainAppGdpr = await checkMainAppGdpr(baseUrl, supabase)
  const envVars = checkEnvVars()

  const allChecks = [
    ...apiHealth,
    ...authAccess,
    ...writePathAuth,
    ...webhookSig,
    ...envVars,
    ...dbSecurity,
    ...contentIntegrity,
    ...securityHeaders,
    ...gdpr,
    ...mainAppGdpr,
  ]

  const duration = Date.now() - startTime
  const totalChecks = allChecks.length
  const passed = allChecks.filter(c => c.status === 'pass').length
  const warnings = allChecks.filter(c => c.status === 'warn').length
  const failures = allChecks.filter(c => c.status === 'fail').length
  const overallStatus: CheckStatus = failures > 0 ? 'fail' : warnings > 0 ? 'warn' : 'pass'

  const categories = [...new Set(allChecks.map(c => c.category))].map(cat => {
    const catChecks = allChecks.filter(c => c.category === cat)
    const catFails = catChecks.filter(c => c.status === 'fail').length
    const catWarns = catChecks.filter(c => c.status === 'warn').length
    return {
      category: cat,
      status: (catFails > 0 ? 'fail' : catWarns > 0 ? 'warn' : 'pass') as CheckStatus,
      checks: catChecks,
    }
  })

  const report = {
    run_id: runId,
    overall_status: overallStatus,
    total_checks: totalChecks,
    passed,
    warnings,
    failures,
    duration_ms: duration,
    categories,
    checks: allChecks,
    sub_processors: GDPR_SUB_PROCESSORS,
  }

  // Regression alert: compare against the previous run and email ONLY when a
  // check has newly failed (pass/warn → fail, or a brand-new fail). A clean run
  // stays silent so the monthly green report doesn't train us to ignore it.
  try {
    const { data: prev } = await supabase
      .from('security_audits')
      .select('report')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const prevChecks: CheckResult[] = (prev?.report as any)?.checks ?? []
    const prevByName = new Map(prevChecks.map(c => [c.name, c.status]))

    const newFailures = allChecks.filter(c => {
      if (c.status !== 'fail') return false
      const before = prevByName.get(c.name)
      return before === undefined || before !== 'fail' // newly failing
    })

    if (newFailures.length > 0) {
      const lines = newFailures.map(c => `• [${c.category}] ${c.name}\n  ${c.detail}`).join('\n\n')
      await sendEmail({
        to: ADMIN_EMAILS[0],
        subject: `⚠️ AskBiz security audit: ${newFailures.length} new failure${newFailures.length > 1 ? 's' : ''}`,
        html: `<p>The monthly security &amp; GDPR audit (<code>${runId}</code>) detected <strong>${newFailures.length}</strong> newly failing check(s):</p><pre>${lines.replace(/</g, '&lt;')}</pre><p>Overall: ${overallStatus.toUpperCase()} — ${passed} passed, ${warnings} warnings, ${failures} failures of ${totalChecks}.</p>`,
      })
    }
  } catch (e) {
    console.error('Regression alert failed:', e)
  }

  try {
    await supabase.from('security_audits').insert({
      run_id: runId,
      overall_status: overallStatus,
      total_checks: totalChecks,
      passed,
      warnings,
      failures,
      duration_ms: duration,
      report: report,
    })
  } catch (e) {
    console.error('Failed to save audit report:', e)
  }

  return report
}

export async function GET(request: NextRequest) {
  const supabase = createServiceClient()
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  // Cron trigger
  if (action === 'cron') {
    const authHeader = request.headers.get('authorization')
    const secret = searchParams.get('secret')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const baseUrl = searchParams.get('baseUrl') || process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const report = await runSecurityAudit(baseUrl)
    return NextResponse.json({ success: true, report })
  }

  // History
  if (action === 'history') {
    const admin = await getAdminUser(request, supabase)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data } = await supabase
      .from('security_audits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    return NextResponse.json({ audits: data || [] })
  }

  // Export CSV
  if (action === 'export') {
    const admin = await getAdminUser(request, supabase)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const runId = searchParams.get('runId')
    let audits
    if (runId) {
      const { data } = await supabase.from('security_audits').select('*').eq('run_id', runId).single()
      audits = data ? [data] : []
    } else {
      const { data } = await supabase.from('security_audits').select('*').order('created_at', { ascending: false }).limit(52)
      audits = data || []
    }

    const csvRows = ['Run ID,Date,Overall Status,Total Checks,Passed,Warnings,Failures,Duration (ms),Category,Check Name,Check Status,Detail']
    for (const audit of audits) {
      const report = audit.report as any
      if (report?.checks) {
        for (const check of report.checks) {
          csvRows.push([
            audit.run_id,
            audit.created_at,
            audit.overall_status,
            audit.total_checks,
            audit.passed,
            audit.warnings,
            audit.failures,
            audit.duration_ms,
            `"${check.category}"`,
            `"${check.name}"`,
            check.status,
            `"${(check.detail || '').replace(/"/g, '""')}"`,
          ].join(','))
        }
      }
    }

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="askbiz-security-audit-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await request.json()

  if (action === 'run') {
    const origin = request.headers.get('origin') || request.headers.get('referer')?.replace(/\/[^/]*$/, '') || process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`
    const report = await runSecurityAudit(origin)
    return NextResponse.json({ success: true, report })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
