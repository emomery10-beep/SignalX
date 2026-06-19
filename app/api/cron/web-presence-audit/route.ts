import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { runPresenceAudit } from '@/app/api/admin/web-presence-audit/route'
import { sendEmail } from '@/lib/email'

export const runtime     = 'nodejs'
export const maxDuration = 120

const ADMIN_EMAIL = 'emomery10@gmail.com'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const secret           = searchParams.get('secret')
  const authHeader       = req.headers.get('authorization')

  const isValidCron =
    (!!process.env.CRON_SECRET && secret === process.env.CRON_SECRET) ||
    // 'dev-test' bypass is allowed ONLY outside production — never in prod.
    (secret === 'dev-test' && process.env.NODE_ENV !== 'production') ||
    (!!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`)

  if (!isValidCron) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const result   = await runPresenceAudit()
  const supabase = createServiceClient()

  await supabase.from('agent_content').insert({
    run_id:           `web_presence_cron_${Date.now()}`,
    type:             'web_presence_audit',
    status:           'published',
    content:          result,
    verdict:          result.missingCount > 2 ? 'act' : 'watch',
    verdict_sentence: `${result.listedCount}/6 platforms · ${result.mentionCount} mentions · ${result.citationRate}% AI citation rate`,
    key_insight:      result.topCompetitors.length > 0
      ? `${result.topCompetitors[0]} is winning AI recommendations`
      : 'Expand content coverage to improve AI citations',
    source_query:     'web-presence-cron',
  })

  if (result.missingCount > 0 || result.citationRate < 50) {
    await sendEmail({
      to:      ADMIN_EMAIL,
      subject: `Web Presence: ${result.listedCount}/6 platforms listed · ${result.citationRate}% AI citation rate`,
      html:    presenceAlertHtml(result),
    })
  }

  return NextResponse.json({
    success:      true,
    listedCount:  result.listedCount,
    missingCount: result.missingCount,
    citationRate: result.citationRate,
    mentionCount: result.mentionCount,
    topCompetitor: result.topCompetitors[0] ?? null,
    lastRun:      new Date().toISOString(),
  })
}

function presenceAlertHtml(result: {
  listedCount: number
  missingCount: number
  citationRate: number
  mentionCount: number
  topCompetitors: string[]
  platforms: { name: string; status: string; importance: string; submitUrl: string }[]
  citations: { query: string; hit: boolean; snippet: string }[]
  mentions: { source: string; title: string; url: string; subreddit?: string }[]
}) {
  const missing = result.platforms.filter(p => p.status === 'missing')
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f3f1;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">

  <tr><td style="background:#1a1916;padding:24px 36px;">
    <span style="font-size:11px;font-weight:700;color:#d08a59;letter-spacing:.12em;text-transform:uppercase;">AskBiz Admin</span>
    <p style="margin:8px 0 0;font-size:20px;font-weight:700;color:#fff;">📡 Web Presence & Citation Report</p>
  </td></tr>

  <tr><td style="padding:24px 36px;border-bottom:1px solid #e8ddd4;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:26px;font-weight:700;color:#16a34a;">${result.listedCount}/6</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Platforms</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:26px;font-weight:700;color:#7c3aed;">${result.citationRate}%</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">AI Citation</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:26px;font-weight:700;color:#0891b2;">${result.mentionCount}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Web Mentions</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:14px;font-weight:700;color:#dc2626;">${result.topCompetitors[0] ?? '—'}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Top Competitor</div>
        </td>
      </tr>
    </table>
  </td></tr>

  ${missing.length > 0 ? `
  <tr><td style="padding:24px 36px;border-bottom:1px solid #e8ddd4;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Missing Platforms</p>
    ${missing.map(p => `
    <div style="display:flex;align-items:center;justify-content:space-between;background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:12px 16px;margin-bottom:8px;">
      <div>
        <span style="font-size:13px;font-weight:600;color:#dc2626;">✕ ${p.name}</span>
        <span style="font-size:10px;margin-left:8px;padding:2px 6px;border-radius:4px;background:${p.importance === 'critical' ? '#fee2e2' : '#fef3c7'};color:${p.importance === 'critical' ? '#dc2626' : '#d97706'};font-weight:700;text-transform:uppercase;">${p.importance}</span>
      </div>
      <a href="${p.submitUrl}" style="font-size:11px;color:#6366f1;font-weight:600;text-decoration:none;">Submit →</a>
    </div>`).join('')}
  </td></tr>` : ''}

  <tr><td style="padding:24px 36px;border-bottom:1px solid #e8ddd4;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">AI Citation Test</p>
    ${result.citations.map(c => `
    <div style="border:1px solid ${c.hit ? '#bbf7d0' : '#fca5a5'};background:${c.hit ? '#f0fdf4' : '#fef2f2'};border-radius:8px;padding:12px 16px;margin-bottom:8px;">
      <span style="font-size:10px;font-weight:700;color:${c.hit ? '#16a34a' : '#dc2626'};">${c.hit ? '✓ HIT' : '✕ MISS'}</span>
      <p style="margin:4px 0 0;font-size:11px;color:#6b7280;font-style:italic;">${c.query}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#1a1916;">${c.snippet}</p>
    </div>`).join('')}
  </td></tr>

  ${result.mentions.length > 0 ? `
  <tr><td style="padding:24px 36px;border-bottom:1px solid #e8ddd4;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Recent Mentions</p>
    ${result.mentions.slice(0, 3).map(m => `
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:10px 14px;margin-bottom:8px;">
      <span style="font-size:10px;font-weight:700;color:#0891b2;">${m.source === 'reddit' ? `Reddit · ${m.subreddit ?? ''}` : 'Hacker News'}</span>
      <p style="margin:4px 0 0;font-size:12px;color:#1a1916;"><a href="${m.url}" style="color:#6366f1;text-decoration:none;">${m.title}</a></p>
    </div>`).join('')}
  </td></tr>` : ''}

  <tr><td style="padding:24px 36px;text-align:center;">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background:#6366f1;border-radius:9999px;padding:12px 28px;">
          <a href="https://askbiz.co/admin/agent" style="color:#fff;font-size:14px;font-weight:600;text-decoration:none;">View in Admin →</a>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0;font-size:11px;color:#a39e97;">AskBiz Web Presence Monitor · Runs weekly Monday 9am UTC</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`
}
