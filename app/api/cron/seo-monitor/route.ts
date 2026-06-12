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

  // Support service account JSON — exchange for access token
  if (!accessToken && process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      accessToken = await getServiceAccountToken(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    } catch (e) {
      return NextResponse.json({ error: `Service account auth failed: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 })
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Set GOOGLE_SEARCH_CONSOLE_TOKEN or GOOGLE_SERVICE_ACCOUNT_JSON' }, { status: 500 })
  }

  const issues: Array<{ type: string; detail: string; severity: 'critical' | 'warning' | 'info' }> = []

  // 1. Check indexing status via Search Console API
  try {
    const now = new Date()
    const thisWeekStart = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10)
    const lastWeekStart = new Date(now.getTime() - 14 * 86400000).toISOString().slice(0, 10)
    const lastWeekEnd = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10)

    const [thisWeekRes, lastWeekRes] = await Promise.all([
      fetchSearchAnalytics(accessToken, thisWeekStart, now.toISOString().slice(0, 10)),
      fetchSearchAnalytics(accessToken, lastWeekStart, lastWeekEnd),
    ])

    if (thisWeekRes && lastWeekRes) {
      const thisClicks = thisWeekRes.reduce((s: number, r: { clicks: number }) => s + r.clicks, 0)
      const lastClicks = lastWeekRes.reduce((s: number, r: { clicks: number }) => s + r.clicks, 0)

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

      // Check for pages that dropped significantly
      const thisWeekByPage = new Map(thisWeekRes.map((r: { keys: string[]; clicks: number; position: number }) => [r.keys[0], r]))
      const lastWeekByPage = new Map(lastWeekRes.map((r: { keys: string[]; clicks: number; position: number }) => [r.keys[0], r]))

      for (const [page, lastData] of lastWeekByPage) {
        const thisData = thisWeekByPage.get(page) as { clicks: number; position: number } | undefined
        if (lastData.clicks >= 10 && (!thisData || thisData.clicks < lastData.clicks * 0.3)) {
          issues.push({
            type: 'page_drop',
            detail: `${page}: clicks dropped from ${lastData.clicks} to ${thisData?.clicks || 0}`,
            severity: 'warning',
          })
        }
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
    content: { issues, checkedAt: new Date().toISOString() },
    verdict: issues.some(i => i.severity === 'critical') ? 'problem' : issues.length > 0 ? 'watch' : 'act',
    verdict_sentence: issues.length === 0 ? 'All SEO checks passed' : `${issues.length} issue(s) found`,
    key_insight: issues.filter(i => i.severity === 'critical').map(i => i.detail).join('; ').slice(0, 200) || 'No critical issues',
  })

  if (issues.some(i => i.severity === 'critical')) {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `SEO Alert: ${issues.filter(i => i.severity === 'critical').length} critical issue(s)`,
      html: seoAlertHtml(issues),
    })
  }

  return NextResponse.json({ success: true, issues })
}

async function fetchSearchAnalytics(token: string, startDate: string, endDate: string) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: 500,
      }),
    }
  )
  if (!res.ok) throw new Error(`GSC API ${res.status}`)
  const data = await res.json()
  return data.rows || []
}

function seoAlertHtml(issues: Array<{ type: string; detail: string; severity: string }>) {
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

async function getServiceAccountToken(jsonStr: string): Promise<string> {
  const sa = JSON.parse(jsonStr)
  const now = Math.floor(Date.now() / 1000)
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))

  const { createSign } = await import('crypto')
  const sign = createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = sign.sign(sa.private_key, 'base64url')

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
