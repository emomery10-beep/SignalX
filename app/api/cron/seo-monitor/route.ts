import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 120

const ADMIN_EMAIL = 'emomery10@gmail.com'
const SITE_URL = 'https://askbiz.co'

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let accessToken = process.env.GOOGLE_SEARCH_CONSOLE_TOKEN

  // Method 1 (recommended): individual env vars — avoids JSON/base64 encoding issues
  const saEmail = process.env.GOOGLE_SA_CLIENT_EMAIL
  const saKey = process.env.GOOGLE_SA_PRIVATE_KEY
  if (!accessToken && saEmail && saKey) {
    try {
      accessToken = await getServiceAccountToken(saEmail, saKey.replace(/\\n/g, '\n'))
    } catch (e) {
      return NextResponse.json({ error: `Service account auth failed: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 })
    }
  }

  // Method 2: full JSON blob (raw or base64)
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  const b64Json = process.env.GOOGLE_SERVICE_ACCOUNT_B64
  if (!accessToken && (rawJson || b64Json)) {
    try {
      let jsonStr = rawJson || ''
      if (b64Json) {
        jsonStr = Buffer.from(b64Json, 'base64').toString('utf-8')
      }
      const sa = JSON.parse(jsonStr)
      accessToken = await getServiceAccountToken(sa.client_email, sa.private_key.replace(/\\n/g, '\n'))
    } catch (e) {
      return NextResponse.json({ error: `Service account auth failed: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 })
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Set GOOGLE_SA_CLIENT_EMAIL + GOOGLE_SA_PRIVATE_KEY, or GOOGLE_SEARCH_CONSOLE_TOKEN' }, { status: 500 })
  }

  const issues: Array<{ type: string; detail: string; severity: 'critical' | 'warning' | 'info' }> = []

  // 1. Check indexing status + collect Alice Watson baseline
  let aliceBaseline: AliceBaseline | null = null
  try {
    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    const thisWeekStart = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10)
    const lastWeekStart = new Date(now.getTime() - 14 * 86400000).toISOString().slice(0, 10)
    const lastWeekEnd = thisWeekStart
    const last28Start = new Date(now.getTime() - 28 * 86400000).toISOString().slice(0, 10)

    const [thisWeekRes, lastWeekRes, blogPagesRes, blogQueriesRes] = await Promise.all([
      fetchSearchAnalytics(accessToken, thisWeekStart, today, ['page']),
      fetchSearchAnalytics(accessToken, lastWeekStart, lastWeekEnd, ['page']),
      // Blog posts: last 28 days, by page — to get per-post impressions/position
      fetchSearchAnalytics(accessToken, last28Start, today, ['page'], `${SITE_URL}/blog/`),
      // Top queries driving traffic to /blog/ URLs
      fetchSearchAnalytics(accessToken, last28Start, today, ['query'], `${SITE_URL}/blog/`),
    ])

    // Week-over-week traffic drop check (existing logic)
    if (thisWeekRes && lastWeekRes) {
      const thisClicks = thisWeekRes.reduce((s: number, r: GscRow) => s + r.clicks, 0)
      const lastClicks = lastWeekRes.reduce((s: number, r: GscRow) => s + r.clicks, 0)

      if (lastClicks > 0) {
        const changePercent = ((thisClicks - lastClicks) / lastClicks) * 100
        if (changePercent < -30) {
          issues.push({
            type: 'traffic_drop',
            detail: `Total clicks dropped ${Math.abs(Math.round(changePercent))}% week-over-week (${lastClicks} → ${thisClicks})`,
            severity: 'critical',
          })
        } else if (changePercent < -15) {
          issues.push({
            type: 'traffic_decline',
            detail: `Total clicks declined ${Math.abs(Math.round(changePercent))}% week-over-week (${lastClicks} → ${thisClicks})`,
            severity: 'warning',
          })
        }
      }

      const thisWeekByPage = new Map(thisWeekRes.map((r: GscRow) => [r.keys[0], r]))
      const lastWeekByPage = new Map(lastWeekRes.map((r: GscRow) => [r.keys[0], r]))
      for (const [page, lastData] of lastWeekByPage) {
        const thisData = thisWeekByPage.get(page) as GscRow | undefined
        if (lastData.clicks >= 10 && (!thisData || thisData.clicks < lastData.clicks * 0.3)) {
          issues.push({
            type: 'page_drop',
            detail: `${page}: clicks dropped from ${lastData.clicks} to ${thisData?.clicks || 0}`,
            severity: 'warning',
          })
        }
      }
    }

    // Alice Watson baseline: per-post performance over last 28 days
    if (blogPagesRes) {
      const posts = (blogPagesRes as GscRow[])
        .map(r => ({
          url: r.keys[0].replace(SITE_URL, ''),
          slug: r.keys[0].replace(`${SITE_URL}/blog/`, '').replace(/\/$/, ''),
          impressions: r.impressions,
          clicks: r.clicks,
          ctr: r.ctr,
          position: Math.round(r.position * 10) / 10,
        }))
        .sort((a, b) => b.impressions - a.impressions)

      const totalImpressions = posts.reduce((s, p) => s + p.impressions, 0)
      const totalClicks = posts.reduce((s, p) => s + p.clicks, 0)
      const postsInTop10 = posts.filter(p => p.position <= 10).length
      const postsInTop3 = posts.filter(p => p.position <= 3).length
      // position ≤ 1.5 is a strong signal for featured snippet
      const featuredSnippetCandidates = posts.filter(p => p.position <= 1.5 && p.impressions > 0)

      const topQueries = (blogQueriesRes as GscRow[] | null)
        ?.map(r => ({
          query: r.keys[0],
          impressions: r.impressions,
          clicks: r.clicks,
          position: Math.round(r.position * 10) / 10,
        }))
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 20) || []

      aliceBaseline = {
        period: `${last28Start} to ${today}`,
        totalPosts: posts.length,
        totalImpressions,
        totalClicks,
        avgCtr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0,
        postsInTop10,
        postsInTop3,
        featuredSnippetCandidates: featuredSnippetCandidates.slice(0, 5),
        topPosts: posts.slice(0, 10),
        topQueries,
        zeroImpressionPosts: posts.filter(p => p.impressions === 0).length,
      }

      // Flag if Alice has posts but no impressions at all — indexing issue
      if (posts.length === 0) {
        issues.push({
          type: 'blog_not_indexed',
          detail: 'No /blog/ pages appear in Search Console — possible indexing issue',
          severity: 'warning',
        })
      }
    }
  } catch (e) {
    issues.push({ type: 'api_error', detail: `Search Console API error: ${e instanceof Error ? e.message : String(e)}`, severity: 'info' })
  }

  // 2. Spot-check a sample of important pages for 200 status
  const criticalPages = ['/', '/pricing', '/academy', '/blog', '/point-of-sale', '/benchmarks']
  const checkResults = await Promise.allSettled(
    criticalPages.map(async (path) => {
      const res = await fetch(`${SITE_URL}${path}`, { method: 'HEAD', redirect: 'follow' })
      return { path, status: res.status }
    })
  )

  for (const result of checkResults) {
    if (result.status === 'fulfilled' && result.value.status >= 400) {
      issues.push({
        type: 'broken_page',
        detail: `${result.value.path} returned ${result.value.status}`,
        severity: 'critical',
      })
    } else if (result.status === 'rejected') {
      issues.push({
        type: 'unreachable',
        detail: `${SITE_URL} unreachable: ${result.reason}`,
        severity: 'critical',
      })
    }
  }

  // 3. Check sitemap is accessible
  try {
    const sitemapRes = await fetch(`${SITE_URL}/sitemap.xml`, { method: 'HEAD' })
    if (!sitemapRes.ok) {
      issues.push({ type: 'sitemap_error', detail: `Sitemap returned ${sitemapRes.status}`, severity: 'critical' })
    }
  } catch {
    issues.push({ type: 'sitemap_error', detail: 'Sitemap unreachable', severity: 'critical' })
  }

  // 4. Save to DB + email if critical issues
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  await supabase.from('agent_content').insert({
    run_id: `seo_${Date.now()}`,
    type: 'seo_report',
    status: 'published',
    content: { issues, aliceBaseline, checkedAt: new Date().toISOString() },
    verdict: issues.some(i => i.severity === 'critical') ? 'problem' : issues.length > 0 ? 'watch' : 'act',
    verdict_sentence: issues.length === 0
      ? `All SEO checks passed${aliceBaseline ? ` · ${aliceBaseline.totalImpressions.toLocaleString()} blog impressions (28d)` : ''}`
      : `${issues.length} issue(s) found`,
    key_insight: issues.filter(i => i.severity === 'critical').map(i => i.detail).join('; ').slice(0, 200) || 'No critical issues',
  })

  if (issues.some(i => i.severity === 'critical')) {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `SEO Alert: ${issues.filter(i => i.severity === 'critical').length} critical issue(s)`,
      html: seoAlertHtml(issues, aliceBaseline),
    })
  }

  return NextResponse.json({ success: true, issues, aliceBaseline })
}

interface GscRow {
  keys: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

interface AliceBaseline {
  period: string
  totalPosts: number
  totalImpressions: number
  totalClicks: number
  avgCtr: number
  postsInTop10: number
  postsInTop3: number
  featuredSnippetCandidates: { url: string; slug: string; impressions: number; clicks: number; ctr: number; position: number }[]
  topPosts: { url: string; slug: string; impressions: number; clicks: number; ctr: number; position: number }[]
  topQueries: { query: string; impressions: number; clicks: number; position: number }[]
  zeroImpressionPosts: number
}

async function fetchSearchAnalytics(
  token: string,
  startDate: string,
  endDate: string,
  dimensions: string[] = ['page'],
  urlPrefix?: string,
) {
  const body: Record<string, unknown> = {
    startDate,
    endDate,
    dimensions,
    rowLimit: 500,
  }
  if (urlPrefix) {
    body.dimensionFilterGroups = [{
      filters: [{ dimension: 'page', operator: 'contains', expression: urlPrefix }],
    }]
  }
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )
  if (!res.ok) throw new Error(`GSC API ${res.status}`)
  const data = await res.json()
  return (data.rows || []) as GscRow[]
}

function seoAlertHtml(issues: Array<{ type: string; detail: string; severity: string }>, baseline: AliceBaseline | null = null) {
  const critical = issues.filter(i => i.severity === 'critical')
  const warnings = issues.filter(i => i.severity === 'warning')
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f3f1;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
  <tr><td style="background:#DC2626;padding:24px 36px;text-align:center;">
    <span style="font-size:20px;font-weight:700;color:#fff;">SEO Monitor Alert</span>
  </td></tr>
  ${baseline ? `<tr><td style="padding:20px 36px;border-bottom:1px solid #e5e5e5;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Alice Watson — Last 28 Days</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:22px;font-weight:700;color:#1a1916;">${baseline.totalImpressions.toLocaleString()}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Impressions</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:22px;font-weight:700;color:#1a1916;">${baseline.totalClicks.toLocaleString()}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Clicks</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:22px;font-weight:700;color:#1a1916;">${baseline.avgCtr}%</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Avg CTR</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:22px;font-weight:700;color:#1a1916;">${baseline.postsInTop10}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Posts Top 10</div>
        </td>
      </tr>
    </table>
    ${baseline.featuredSnippetCandidates.length > 0 ? `
    <p style="margin:12px 0 6px;font-size:12px;font-weight:700;color:#059669;">Featured Snippet Candidates (position ≤ 1.5)</p>
    ${baseline.featuredSnippetCandidates.map(p => `<div style="font-size:12px;color:#1a1916;padding:4px 0;">${p.slug} — pos ${p.position} · ${p.impressions} imp · ${p.clicks} clicks</div>`).join('')}
    ` : ''}
    ${baseline.topQueries.slice(0, 5).length > 0 ? `
    <p style="margin:12px 0 6px;font-size:12px;font-weight:700;color:#1a1916;">Top 5 Queries</p>
    ${baseline.topQueries.slice(0, 5).map(q => `<div style="font-size:12px;color:#6b7280;padding:3px 0;">"${q.query}" — pos ${q.position} · ${q.impressions} imp</div>`).join('')}
    ` : ''}
  </td></tr>` : ''}
  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 16px;font-size:14px;color:#1a1916;font-weight:700;">${critical.length} critical issue(s), ${warnings.length} warning(s)</p>
    ${issues.map(i => `<div style="background:${i.severity === 'critical' ? '#FEF2F2' : '#FFFBEB'};border:1px solid ${i.severity === 'critical' ? '#FCA5A5' : '#FCD34D'};border-radius:8px;padding:12px 16px;margin-bottom:8px;">
      <span style="font-size:10px;font-weight:700;color:${i.severity === 'critical' ? '#DC2626' : '#D97706'};text-transform:uppercase;">${i.severity}</span>
      <p style="margin:4px 0 0;font-size:13px;color:#1a1916;">${i.detail}</p>
    </div>`).join('')}
    <table cellpadding="0" cellspacing="0" style="margin-top:20px;"><tr>
      <td style="background:#6366F1;border-radius:9999px;padding:12px 24px;">
        <a href="https://askbiz.co/admin" style="color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Open Admin &rarr;</a>
      </td>
    </tr></table>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

async function getServiceAccountToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))

  const { createSign } = await import('crypto')
  const sign = createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = sign.sign(privateKey, 'base64url')

  const jwt = `${header}.${payload}.${signature}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`)
  const data = await res.json()
  return data.access_token
}
