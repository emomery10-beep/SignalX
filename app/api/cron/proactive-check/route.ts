// ── Proactive Intelligence Cron ───────────────────────────────────────────────
// Runs once a day via Vercel cron (see vercel.json — "0 8 * * *").
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

      // 1b. Check connected sources health
      const { data: sources } = await supabase
        .from('connected_sources')
        .select('source_type, status, last_synced_at, name, created_at')
        .eq('user_id', userId) as { data: { source_type: string; status: string | null; last_synced_at: string | null; name: string | null; created_at: string | null }[] | null }

      if (sources?.length) {
        const SOURCE_LABELS: Record<string, string> = {
          stripe: 'Stripe', shopify: 'Shopify', amazon_fba: 'Amazon', xero: 'Xero',
          quickbooks: 'QuickBooks', ebay: 'eBay', paypal: 'PayPal', google_analytics: 'Google Analytics',
        }

        // Stale sync check (> 24h)
        const stale = sources.filter(s => {
          if (!s.last_synced_at) return false
          return (Date.now() - new Date(s.last_synced_at).getTime()) > 24 * 3600000
        })
        if (stale.length > 0) {
          const names = stale.map(s => SOURCE_LABELS[s.source_type] || s.source_type).join(', ')
          allAlerts.push({
            type: 'source',
            severity: 'warning',
            title: `${names} sync stale`,
            body: `Your ${names} ${stale.length > 1 ? 'connections haven\'t' : 'connection hasn\'t'} synced in 24+ hours. Data may be outdated.`,
            metadata: { sources: stale.map(s => s.source_type) },
          })
        }

        // Disconnected/errored sources
        const errored = sources.filter(s => s.status === 'error' || s.status === 'disconnected')
        for (const src of errored) {
          const label = SOURCE_LABELS[src.source_type] || src.source_type
          allAlerts.push({
            type: 'source',
            severity: 'critical',
            title: `${label} disconnected`,
            body: `Your ${label} integration needs reconnecting. Go to Sources to fix it.`,
            metadata: { source: src.source_type, status: src.status },
          })
        }

        // Freshly connected (< 1 hour old, first-time notification)
        const fresh = sources.filter(s =>
          s.status === 'active' && s.created_at &&
          (Date.now() - new Date(s.created_at).getTime()) < 3600000
        )
        for (const src of fresh) {
          const label = SOURCE_LABELS[src.source_type] || src.source_type
          allAlerts.push({
            type: 'insight',
            severity: 'info',
            title: `${label} connected`,
            body: `${label} is now syncing data to AskBiz. You can ask questions about your ${label} data.`,
            metadata: { source: src.source_type },
          })
        }
      }

      // 2. Check connected source data for stock + anomalies
      const { data: unifiedRows } = await supabase
        .from('unified_data')
        .select('stock_level, product_name, sku, gross_revenue, net_margin, record_date, source_type')
        .eq('user_id', userId)
        .order('record_date', { ascending: false })
        .limit(100)

      if (unifiedRows?.length) {
        // Low stock from live connected data
        for (const row of unifiedRows) {
          const channel = row.source_type || 'unknown'
          // Marketplace order-item rows (Amazon, Jumia, etc.) always hardcode
          // stock_level: 0 as a "not applicable" placeholder on every sale —
          // a real inventory-snapshot row from the same channel always zeroes
          // gross_revenue instead, so that's what tells the two apart. AskBiz's
          // own POS channel doesn't have this split: every synced row (normaliseAskBizPOS)
          // carries a genuine, live stock reading alongside real revenue, so it's
          // never subject to the placeholder pattern and is always trusted directly.
          const isStockSignal = channel === 'pos' || !row.gross_revenue || row.gross_revenue === 0
          if (isStockSignal && typeof row.stock_level === 'number' && row.stock_level <= 3 && row.stock_level >= 0) {
            const name = row.product_name || row.sku || 'Unknown product'
            const channelLabel = channel.charAt(0).toUpperCase() + channel.slice(1).replace(/_/g, ' ')
            // Dedupe per (channel, product) — not product name alone — so a
            // genuine stockout on one channel (e.g. Jumia) isn't silently
            // swallowed just because another channel already alerted on a
            // product with the same name. Legacy/upload-derived alerts (from
            // checkLowStock() above) carry no `source` at all — treat those as
            // matching any channel so this doesn't newly duplicate alongside them.
            if (!allAlerts.find(a => a.metadata?.product === name && (!a.metadata?.source || a.metadata.source === channel))) {
              allAlerts.push({
                type: 'stock',
                severity: row.stock_level === 0 ? 'critical' : 'warning',
                title: row.stock_level === 0 ? `Out of stock on ${channelLabel}: ${name}` : `Low stock on ${channelLabel}: ${name}`,
                body: `${name} has ${row.stock_level} units remaining on ${channelLabel}.`,
                metadata: { product: name, stock_level: row.stock_level, source: channel },
              })
            }
          }
        }
      }

      // 2b. POS daily sales summary
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0, 0, 0, 0)
      const yesterdayEnd = new Date(yesterday); yesterdayEnd.setHours(23, 59, 59, 999)

      const { data: yesterdayTx } = await supabase
        .from('pos_transactions')
        .select('total, payment_type')
        .eq('owner_id', userId)
        .eq('status', 'completed')
        .gte('created_at', yesterday.toISOString())
        .lte('created_at', yesterdayEnd.toISOString())

      if (yesterdayTx && yesterdayTx.length > 0) {
        const dayRevenue = yesterdayTx.reduce((s: number, t: any) => s + (t.total || 0), 0)
        const dayName = yesterday.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
        const cashCount = yesterdayTx.filter((t: any) => t.payment_type === 'cash').length
        const digitalCount = yesterdayTx.length - cashCount

        allAlerts.push({
          type: 'summary',
          severity: 'info',
          title: `Daily summary — ${dayName}`,
          body: `${yesterdayTx.length} sales totalling ${symbol}${dayRevenue.toLocaleString()} (${cashCount} cash, ${digitalCount} digital).`,
          metadata: { revenue: dayRevenue, transactions: yesterdayTx.length, cash: cashCount, digital: digitalCount },
        })

        // Flag large individual sales (top sale > 2× average)
        const avgSale = dayRevenue / yesterdayTx.length
        const topSale = Math.max(...yesterdayTx.map((t: any) => t.total || 0))
        if (topSale >= avgSale * 2 && topSale >= 1000) {
          allAlerts.push({
            type: 'insight',
            severity: 'info',
            title: `Large sale yesterday — ${symbol}${topSale.toLocaleString()}`,
            body: `Your biggest sale yesterday was ${symbol}${topSale.toLocaleString()}, ${(topSale / avgSale).toFixed(1)}× your average of ${symbol}${Math.round(avgSale).toLocaleString()}.`,
            metadata: { top_sale: topSale, avg_sale: avgSale },
          })
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

      const recentTitles = new Set((recentNotes || []).map((n: any) => n.title))
      const freshAlerts  = allAlerts.filter(a => !recentTitles.has(a.title))

      if (!freshAlerts.length) {
        processed++
        continue
      }

      // Deliver each fresh alert
      for (const alert of freshAlerts.slice(0, 5)) {
        const notifType = alert.type === 'news' ? 'brief'
          : alert.type === 'summary' ? 'insight'
          : alert.type === 'insight' ? 'insight'
          : alert.type === 'source' ? 'system'
          : 'alert'

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
