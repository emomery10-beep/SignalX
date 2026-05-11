// ── Proactive Intelligence Cron ───────────────────────────────────────────────
// Runs every 4 hours via Vercel cron.
// For each active user: checks stock, revenue anomalies, shipment risks,
// and sector news — then delivers via notification bell + email + WhatsApp.

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import {
  checkLowStock,
  checkAnomalies,
  checkNewsSignals,
  checkShipmentRisks,
  type ProactiveAlert,
} from '@/lib/notifications/proactive'
import { sendEmail, alertEmail } from '@/lib/email'
import { sendWhatsApp, proactiveWhatsApp } from '@/lib/notifications/whatsapp'

export const runtime  = 'nodejs'
export const maxDuration = 300

export async function GET(request: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Get all users with connected sources or recent uploads
  const { data: activeUsers } = await supabase
    .from('profiles')
    .select('id, business_name, business_type, currency, currency_symbol, region, sector_hints, notify_whatsapp, whatsapp_number, notify_email_alerts')
    .not('onboarded', 'is', null)

  if (!activeUsers?.length) {
    return NextResponse.json({ message: 'No active users', processed: 0 })
  }

  let processed = 0
  let notified  = 0

  for (const profile of activeUsers) {
    try {
      const userId       = profile.id
      const businessName = profile.business_name || 'Your business'
      const symbol       = profile.currency_symbol || '£'
      const region       = profile.region || ''
      const sector       = profile.sector_hints || profile.business_type || 'retail'

      const allAlerts: ProactiveAlert[] = []

      // 1. Check latest uploaded data for stock + anomalies
      const { data: upload } = await supabase
        .from('uploads')
        .select('parsed_sample, column_names')
        .eq('user_id', userId)
        .eq('status', 'parsed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (upload?.parsed_sample) {
        const rows = upload.parsed_sample as Record<string, unknown>[]
        allAlerts.push(...checkLowStock(rows, symbol))
        allAlerts.push(...checkAnomalies(rows, symbol))
      }

      // 2. Check connected source data for stock + anomalies
      const { data: unifiedRows } = await supabase
        .from('unified_data')
        .select('stock_level, product_name, sku, gross_revenue, net_margin, record_date')
        .eq('user_id', userId)
        .order('record_date', { ascending: false })
        .limit(100)

      if (unifiedRows?.length) {
        // Low stock from live connected data
        for (const row of unifiedRows) {
          if (typeof row.stock_level === 'number' && row.stock_level <= 3 && row.stock_level >= 0) {
            const name = row.product_name || row.sku || 'Unknown product'
            // Only add if not already flagged from upload
            if (!allAlerts.find(a => a.metadata?.product === name)) {
              allAlerts.push({
                type: 'stock',
                severity: row.stock_level === 0 ? 'critical' : 'warning',
                title: row.stock_level === 0 ? `Out of stock: ${name}` : `Low stock: ${name}`,
                body: `${name} has ${row.stock_level} units remaining.`,
                metadata: { product: name, stock_level: row.stock_level },
              })
            }
          }
        }
      }

      // 3. Shipment risks
      const shipmentAlerts = await checkShipmentRisks(userId, symbol)
      allAlerts.push(...shipmentAlerts)

      // 4. Regional/sector news (only once every 12h per user — check last notification)
      const { data: lastNewsNote } = await supabase
        .from('notifications')
        .select('created_at')
        .eq('user_id', userId)
        .eq('type', 'brief')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const lastNewsAge = lastNewsNote
        ? Date.now() - new Date(lastNewsNote.created_at).getTime()
        : Infinity

      if (lastNewsAge > 12 * 60 * 60 * 1000) {
        const newsAlerts = await checkNewsSignals(region, sector, profile.business_type || 'retail')
        allAlerts.push(...newsAlerts)
      }

      if (!allAlerts.length) {
        processed++
        continue
      }

      // Deduplicate — don't re-fire an alert already sent in last 6 hours
      const { data: recentNotes } = await supabase
        .from('notifications')
        .select('title')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString())

      const recentTitles = new Set((recentNotes || []).map(n => n.title))
      const freshAlerts  = allAlerts.filter(a => !recentTitles.has(a.title))

      if (!freshAlerts.length) {
        processed++
        continue
      }

      // Deliver each fresh alert
      for (const alert of freshAlerts.slice(0, 5)) {
        const notifType = alert.type === 'news' ? 'brief' : 'alert'

        // In-app notification (always)
        await supabase.from('notifications').insert({
          user_id:  userId,
          type:     notifType,
          title:    alert.title,
          body:     alert.body,
          metadata: { ...alert.metadata, severity: alert.severity },
        })

        // Email (if opted in)
        const userEmail = await getUserEmail(supabase, userId)
        if (profile.notify_email_alerts !== false && userEmail) {
          await sendEmail({
            to:      userEmail,
            subject: `${alert.severity === 'critical' ? '🔴' : alert.severity === 'warning' ? '🟡' : '🔵'} AskBiz: ${alert.title}`,
            html:    alertEmail({
              alertName:    alert.title,
              message:      alert.body,
              severity:     alert.severity,
              businessName,
            }),
          })
        }

        // WhatsApp (if opted in + number set)
        if (profile.notify_whatsapp && profile.whatsapp_number) {
          await sendWhatsApp(
            profile.whatsapp_number,
            proactiveWhatsApp({
              businessName,
              title: alert.title,
              body:  alert.body,
              type:  alert.type,
            }),
          )
        }
      }

      notified++
      processed++
    } catch {
      processed++
    }
  }

  return NextResponse.json({
    message:   `Proactive check complete`,
    processed,
    notified,
  })
}

async function getUserEmail(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
): Promise<string | null> {
  try {
    const { data } = await supabase.auth.admin.getUserById(userId)
    return data.user?.email || null
  } catch {
    return null
  }
}
