import { NextRequest, NextResponse } from 'next/server'

// ── CSP violation collector ──────────────────────────────────────────────────
//
// Target of `report-uri` in this app's report-only CSP (lib/security-headers.js).
// Deliberate copy of the root app's collector — pos-askbiz is a separate Next app
// and cannot import from it; keep the two in sync when either changes.
//
// Its job is to tell us what this app's first-ever CSP would have broken, on real
// trading traffic, before any of it is enforced. Read it with:
//
//   vercel logs --follow | grep '\[csp\]'
//
// Deliberately logs instead of writing to the database. The endpoint has to be
// unauthenticated — browsers post violation reports with no credentials — so a
// DB-backed version would be a publicly writable table, i.e. a spam sink and a
// new migration for something we only need for a week or two of observation.
//
// Reports are grouped in memory per directive+blocked-URI so a single broken
// image on a hot page logs once rather than once per pageview. The map is
// per-serverless-instance and resets on cold start; that is fine — we want to
// know WHICH directives fire, not an exact count.

export const runtime = 'nodejs'

const seen = new Map<string, number>()
const MAX_KEYS = 500

// Browsers send one of two shapes: the legacy `application/csp-report`
// ({"csp-report": {...}}) or the Reporting API's `application/reports+json`
// (an array of {type, body}). Normalise both to one flat record.
interface Violation {
  directive: string
  blockedUri: string
  documentUri: string
  sample?: string
}

function normalise(payload: unknown): Violation[] {
  const out: Violation[] = []
  const push = (r: Record<string, unknown> | undefined) => {
    if (!r) return
    const directive = String(r['effective-directive'] || r['effectiveDirective'] || r['violated-directive'] || r['violatedDirective'] || 'unknown')
    out.push({
      directive,
      blockedUri: String(r['blocked-uri'] || r['blockedURL'] || 'unknown'),
      documentUri: String(r['document-uri'] || r['documentURL'] || 'unknown'),
      sample: r['script-sample'] || r['sample'] ? String(r['script-sample'] || r['sample']).slice(0, 120) : undefined,
    })
  }

  if (Array.isArray(payload)) {
    // Reporting API batch
    for (const entry of payload.slice(0, 20)) {
      const e = entry as Record<string, unknown>
      if (e?.type === 'csp-violation' || e?.type === 'csp') push(e.body as Record<string, unknown>)
    }
  } else if (payload && typeof payload === 'object') {
    push(((payload as Record<string, unknown>)['csp-report'] as Record<string, unknown>) || (payload as Record<string, unknown>))
  }
  return out
}

export async function POST(request: NextRequest) {
  // Cap the body: this is a public endpoint and the payload is never large.
  const raw = await request.text()
  if (raw.length > 16_000) return new NextResponse(null, { status: 413 })

  let payload: unknown
  try {
    payload = JSON.parse(raw)
  } catch {
    return new NextResponse(null, { status: 204 })
  }

  for (const v of normalise(payload)) {
    // Strip the query string from both URLs before using them as the dedupe
    // key: a per-request token or cache-buster would otherwise make every
    // report look unique and defeat the grouping.
    const doc = v.documentUri.split('?')[0]
    const blocked = v.blockedUri.split('?')[0]
    const key = `${v.directive}|${blocked}|${doc}`
    const count = (seen.get(key) || 0) + 1
    if (seen.size < MAX_KEYS || seen.has(key)) seen.set(key, count)

    // Log the first occurrence, then on a widening interval so a persistent
    // violation stays visible in the logs without flooding them.
    if (count === 1 || count === 10 || count % 100 === 0) {
      console.warn('[csp] violation', JSON.stringify({
        directive: v.directive,
        blocked,
        document: doc,
        sample: v.sample,
        seen: count,
      }))
    }
  }

  // 204 regardless: a report endpoint must never make the browser retry.
  return new NextResponse(null, { status: 204 })
}
