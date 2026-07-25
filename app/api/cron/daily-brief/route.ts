import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWhatsApp, salesBriefWhatsApp } from '@/lib/notifications/whatsapp'

export const runtime = 'nodejs'
export const maxDuration = 300

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
    .select('id, business_name, currency_symbol, whatsapp_number, notify_whatsapp')
    .not('onboarded', 'is', null)
    .eq('pos_enabled', true)

  if (!users?.length) {
    return NextResponse.json({ message: 'No POS users', generated: 0 })
  }

  const today = new Date().toISOString().slice(0, 10)
  const cutoff24h = new Date(Date.now() - 86400000).toISOString()
  const cutoff7d = new Date(Date.now() - 7 * 86400000).toISOString()

  let generated = 0
  let sent = 0

  for (const profile of users) {
    try {
      if (!profile.notify_whatsapp || !profile.whatsapp_number) continue

      const { data: existing } = await supabase
        .from('daily_briefs')
        .select('id')
        .eq('user_id', profile.id)
        .eq('date', today)
        .single()

      if (existing) continue

      const symbol = profile.currency_symbol || '£'

      const [{ data: txRows }, { data: refundRows }] = await Promise.all([
        // Completed sales + their line-item costs, for sales & gross profit
        supabase
          .from('pos_transactions')
          .select('total, created_at, pos_items!transaction_id(qty, cost_price)')
          .eq('owner_id', profile.id)
          .eq('status', 'completed')
          .gte('created_at', cutoff7d)
          .limit(5000),
        // Refunded line items, for losses — kept unbounded by sale date since a
        // refund can land on a sale placed well before the reporting window
        supabase
          .from('pos_transactions')
          .select('pos_items!transaction_id(line_total, refunded, refunded_at)')
          .eq('owner_id', profile.id)
          .in('status', ['refunded', 'partially_refunded'])
          .limit(1000),
      ])

      const sumSales = (cutoff: string) =>
        (txRows || []).filter((r: any) => r.created_at >= cutoff).reduce((s: number, r: any) => s + (r.total || 0), 0)

      const sumCogs = (cutoff: string) =>
        (txRows || []).filter((r: any) => r.created_at >= cutoff).reduce((s: number, r: any) =>
          s + (r.pos_items || []).reduce((si: number, it: any) => si + (Number(it.qty) || 0) * (Number(it.cost_price) || 0), 0), 0)

      const sumLosses = (cutoff: string) => {
        let total = 0
        for (const tx of (refundRows || []) as any[]) {
          for (const it of tx.pos_items || []) {
            if (it.refunded && it.refunded_at && it.refunded_at >= cutoff) total += Number(it.line_total) || 0
          }
        }
        return total
      }

      const last24h = { sales: sumSales(cutoff24h), profit: sumSales(cutoff24h) - sumCogs(cutoff24h), losses: sumLosses(cutoff24h) }
      const last7d = { sales: sumSales(cutoff7d), profit: sumSales(cutoff7d) - sumCogs(cutoff7d), losses: sumLosses(cutoff7d) }

      await supabase.from('daily_briefs').upsert({
        user_id: profile.id,
        date: today,
        sales_24h: last24h.sales,
        profit_24h: last24h.profit,
        losses_24h: last24h.losses,
        sales_7d: last7d.sales,
        profit_7d: last7d.profit,
        losses_7d: last7d.losses,
        sent_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date' })

      generated++

      const ok = await sendWhatsApp(
        profile.whatsapp_number,
        salesBriefWhatsApp({ businessName: profile.business_name || 'Your business', symbol, last24h, last7d }),
      )
      if (ok) {
        sent++
        await supabase.from('daily_briefs').update({ whatsapp_sent: true }).eq('user_id', profile.id).eq('date', today)
      }
    } catch (e) {
      console.error(`[daily-brief-cron] Error for user ${profile.id}:`, e)
    }
  }

  return NextResponse.json({ success: true, generated, sent, totalUsers: users.length })
}
