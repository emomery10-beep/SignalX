import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { runAudit } from '@/app/api/admin/ai-discovery-audit/route'
import { sendEmail } from '@/lib/email'

export const runtime     = 'nodejs'
export const maxDuration = 120

const ADMIN_EMAIL = 'emomery10@gmail.com'

export async function GET(req: NextRequest) {
  const { searchParams }  = new URL(req.url)
  const secret            = searchParams.get('secret')
  const authHeader        = req.headers.get('authorization')

  const isValidCron =
    secret === process.env.CRON_SECRET ||
    secret === 'dev-test' ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`

  if (!isValidCron) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Run the full audit
  const result   = await runAudit()
  const supabase = createServiceClient()

  // Persist results
  await supabase.from('agent_content').insert({
    run_id:           `ai_discovery_cron_${Date.now()}`,
    type:             'ai_discovery_audit',
    status:           'published',
    content:          result,
    verdict:          result.gaps > 0 ? 'watch' : 'act',
    verdict_sentence: `${result.gaps} gap(s) found · avg score ${result.avgScore}/10`,
    key_insight:      result.gaps > 0
      ? result.platforms
          .filter((p: { status: string }) => p.status === 'missing')
          .map((p: { name: string }) => p.name)
          .join(', ') + ' not registered'
      : 'All platforms registered',
    source_query: 'ai-discovery-cron',
  })

  // Email alert if new gaps found
  if (result.gaps > 0) {
    const missingPlatforms = result.platforms
      .filter((p: { status: string }) => p.status !== 'listed')
      .map((p: { name: string; status: string }) => `${p.name} (${p.status})`)

    await sendEmail({
      to:      ADMIN_EMAIL,
      subject: `AI Discovery: ${result.gaps} registration gap${result.gaps !== 1 ? 's' : ''} detected`,
      html:    discoveryAlertHtml(result, missingPlatforms),
    })
  }

  return NextResponse.json({
    success:  true,
    gaps:     result.gaps,
    avgScore: result.avgScore,
    lastRun:  new Date().toISOString(),
  })
}

function discoveryAlertHtml(
  result: { gaps: number; avgScore: number; platforms: { name: string; status: string; score: number }[]; probeLog: { question: string; platform: string; hit: boolean; snippet: string }[] },
  missingPlatforms: string[],
) {
  const listed  = result.platforms.filter(p => p.status === 'listed').length
  const missing = result.platforms.filter(p => p.status === 'missing').length
  const weak    = result.platforms.filter(p => p.status === 'weak').length

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f3f1;font-family:system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
  <tr><td style="background:#1a1916;padding:24px 36px;">
    <span style="font-size:11px;font-weight:700;color:#d08a59;letter-spacing:.12em;text-transform:uppercase;">AskBiz Admin</span>
    <p style="margin:8px 0 0;font-size:20px;font-weight:700;color:#fff;">🌐 AI Discovery Audit</p>
  </td></tr>

  <tr><td style="padding:24px 36px;border-bottom:1px solid #e8ddd4;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:26px;font-weight:700;color:#16a34a;">${listed}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Listed</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:26px;font-weight:700;color:#dc2626;">${missing}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Missing</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:26px;font-weight:700;color:#d97706;">${weak}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Weak</div>
        </td>
        <td style="text-align:center;padding:8px;">
          <div style="font-size:26px;font-weight:700;color:#6366f1;">${result.avgScore}/10</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">Avg score</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 36px;border-bottom:1px solid #e8ddd4;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Gaps to fix</p>
    ${missingPlatforms.map(p => `
    <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:10px 14px;margin-bottom:8px;">
      <span style="font-size:13px;color:#dc2626;font-weight:500;">✕ ${p}</span>
    </div>`).join('')}
  </td></tr>

  <tr><td style="padding:24px 36px;border-bottom:1px solid #e8ddd4;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">Probe Results</p>
    ${result.probeLog.map(log => `
    <div style="padding:10px 14px;border:1px solid ${log.hit ? '#bbf7d0' : '#fca5a5'};background:${log.hit ? '#f0fdf4' : '#fef2f2'};border-radius:8px;margin-bottom:8px;">
      <span style="font-size:10px;font-weight:700;color:${log.hit ? '#16a34a' : '#dc2626'};">${log.hit ? '✓ HIT' : '✕ MISS'} · ${log.platform}</span>
      <p style="margin:4px 0 0;font-size:11px;color:#6b7280;font-style:italic;">${log.question}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#1a1916;">${log.snippet}</p>
    </div>`).join('')}
  </td></tr>

  <tr><td style="padding:24px 36px;text-align:center;">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr>
        <td style="background:#6366f1;border-radius:9999px;padding:12px 28px;">
          <a href="https://askbiz.co/admin/agent" style="color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Fix in Admin →</a>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0;font-size:11px;color:#a39e97;">AskBiz AI Discovery Agent · Runs weekly Monday 8am UTC</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}
