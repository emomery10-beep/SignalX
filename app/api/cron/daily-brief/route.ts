import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { sendEmail } from '@/lib/email'
import { logUsage } from '@/lib/log-usage'

export const runtime = 'nodejs'
export const maxDuration = 300

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function GET(request: NextRequest) {
  const secret = new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test' && request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: users } = await supabase
    .from('profiles')
    .select('id, business_name, currency_symbol, region, sector_hints, business_type, notify_email_alerts')
    .not('onboarded', 'is', null)

  if (!users?.length) {
    return NextResponse.json({ message: 'No active users', generated: 0 })
  }

  const today = new Date().toISOString().slice(0, 10)
  let generated = 0
  let emailed = 0

  for (const profile of users) {
    try {
      const { data: existing } = await supabase
        .from('daily_briefs')
        .select('id')
        .eq('user_id', profile.id)
        .eq('date', today)
        .single()

      if (existing) continue

      const symbol = profile.currency_symbol || '£'

      const [
        { data: health },
        { data: anomalies },
        { data: recentData },
        { data: sources },
      ] = await Promise.all([
        supabase.from('health_scores').select('score,label,summary').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(1).single(),
        supabase.from('anomalies').select('title').eq('user_id', profile.id).eq('seen', false).order('created_at', { ascending: false }).limit(5),
        supabase.from('unified_data').select('gross_revenue,gross_margin,channel').eq('user_id', profile.id).gte('record_date', new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)).limit(200),
        supabase.from('connected_sources').select('name').eq('user_id', profile.id).eq('status', 'active'),
      ])

      const healthCtx = health ? `Health: ${health.score}/100 (${health.label}). ${health.summary || ''}` : 'No health score.'
      const anomalyCtx = anomalies?.length ? `Alerts: ${anomalies.map(a => a.title).join('; ')}` : 'No alerts.'
      let revenueCtx = ''
      if (recentData?.length) {
        const total = recentData.reduce((s, r) => s + (r.gross_revenue || 0), 0)
        const avgMargin = recentData.filter(r => r.gross_margin).reduce((s, r) => s + r.gross_margin, 0) / Math.max(recentData.filter(r => r.gross_margin).length, 1)
        revenueCtx = `Last 7 days: ${symbol}${Math.round(total).toLocaleString()} revenue, ${Math.round(avgMargin)}% avg margin.`
      }

      const contextParts = [healthCtx, revenueCtx, anomalyCtx].filter(Boolean).join('\n')

      let brief = {
        improved: 'Your business data is being monitored continuously.',
        worsened: 'No critical issues detected today.',
        action: 'Ask AskBiz about your current performance to get personalised insights.',
        health_score: health?.score || 0,
        revenue_7d: recentData?.reduce((s, r) => s + (r.gross_revenue || 0), 0) || 0,
        sources_count: sources?.length || 0,
      }

      try {
        const res = await anthropic.messages.create({
          model: 'claude-haiku-4-5',
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: `You are AskBiz — a plain-English business intelligence advisor. Write a concise morning brief for a business owner. Be specific and direct. No jargon. Return ONLY valid JSON.

Business data:
${contextParts}

Return exactly:
{
  "improved": "One specific thing that improved or is going well. One sentence, max 20 words.",
  "worsened": "One specific thing that needs attention. One sentence, max 20 words.",
  "action": "The single most important action for today. One sentence, max 25 words. Start with a strong verb."
}`,
          }],
        })

        logUsage({ route: 'cron/daily-brief', model: 'claude-haiku-4-5', usage: res.usage, userId: profile.id })
        const raw = res.content[0].type === 'text' ? res.content[0].text : ''
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
        brief = { ...brief, improved: parsed.improved || brief.improved, worsened: parsed.worsened || brief.worsened, action: parsed.action || brief.action }
      } catch {}

      await supabase.from('daily_briefs').upsert({
        user_id: profile.id,
        date: today,
        improved: brief.improved,
        worsened: brief.worsened,
        action: brief.action,
        health_score: brief.health_score,
        sent_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' })

      generated++

      if (profile.notify_email_alerts) {
        const { data: authUser } = await supabase.auth.admin.getUserById(profile.id)
        const email = authUser?.user?.email
        if (email) {
          const sent = await sendEmail({
            to: email,
            subject: `Your morning brief — ${profile.business_name || 'AskBiz'}`,
            html: briefEmailHtml(profile.business_name || 'Your business', brief),
          })
          if (sent) emailed++
        }
      }
    } catch (e) {
      console.error(`[daily-brief-cron] Error for user ${profile.id}:`, e)
    }
  }

  return NextResponse.json({ success: true, generated, emailed, totalUsers: users.length })
}

function briefEmailHtml(businessName: string, brief: { improved: string; worsened: string; action: string }) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f3f1;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f1;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">
  <tr><td style="background:#6366F1;padding:24px 36px;text-align:center;">
    <span style="font-size:20px;font-weight:700;color:#fff;">AskBiz Morning Brief</span>
  </td></tr>
  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:.06em;">What's going well</p>
    <p style="margin:0 0 20px;font-size:15px;color:#1a1916;line-height:1.5;">${brief.improved}</p>
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#d97706;text-transform:uppercase;letter-spacing:.06em;">Needs attention</p>
    <p style="margin:0 0 20px;font-size:15px;color:#1a1916;line-height:1.5;">${brief.worsened}</p>
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#6366F1;text-transform:uppercase;letter-spacing:.06em;">Today's action</p>
    <p style="margin:0 0 24px;font-size:15px;color:#1a1916;line-height:1.5;font-weight:600;">${brief.action}</p>
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="background:#6366F1;border-radius:9999px;padding:12px 24px;">
        <a href="https://askbiz.co/home" style="color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Open AskBiz &rarr;</a>
      </td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:16px 36px;border-top:1px solid #e8e6e1;text-align:center;">
    <p style="margin:0;font-size:11px;color:#a39e97;">${businessName} &middot; <a href="https://askbiz.co/settings" style="color:#6366F1;text-decoration:none;">Manage notifications</a></p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}
