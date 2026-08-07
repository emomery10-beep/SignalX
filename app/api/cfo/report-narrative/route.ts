import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRegionConfig } from '@/lib/region-config'
import { logUsage } from '@/lib/log-usage'
import { getDailyCache, setDailyCache } from '@/lib/ai-daily-cache'

// Real, embedded narrative for the "Full CFO Report" export's Executive
// Summary (components/cfo/CfoReportExport.tsx) — a single professional
// paragraph in the "what changed / why / what's next" shape real board
// reports use, instead of a canned template sentence. DELIBERATELY a
// separate route from cfo/ai-insight rather than a shared "mode" flag: that
// route's output shape (3 short insight cards) is tuned for a different UI
// (CfoAiInsight.tsx) and is left untouched.
//
// Cached per user+period+day (not just per user+day like ai-insight) since
// the report can be viewed for any of several periods and the narrative
// must match whichever one is showing.

export const runtime = 'nodejs'
export const maxDuration = 20

const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { totals, comparison, cash, inventory, alerts, period, countryCode } = body
  const routeKey = `cfo/report-narrative:${period || 'default'}`

  const isRefresh = new URL(req.url).searchParams.get('refresh') === 'true'
  if (!isRefresh) {
    const cached = await getDailyCache<{ narrative: string }>(user.id, routeKey)
    if (cached) return NextResponse.json(cached)
  }

  const region = getRegionConfig(countryCode)
  const signals: string[] = []

  if (totals) {
    signals.push(`Revenue ${totals.revenue}, COGS ${totals.cogs}, Gross Profit ${totals.gross_profit} (${totals.gross_margin_pct}% margin)`)
    signals.push(`Fixed Costs ${totals.fixed_costs}, Net Profit ${totals.net_profit} (${totals.net_margin_pct}% margin)`)
  }
  if (comparison && totals) {
    const revChange = comparison.revenue > 0 ? Math.round(((totals.revenue - comparison.revenue) / comparison.revenue) * 100) : null
    const netChange = comparison.net_profit ? Math.round(((totals.net_profit - comparison.net_profit) / Math.abs(comparison.net_profit)) * 100) : null
    signals.push(`Vs prior period: revenue ${revChange != null ? `${revChange > 0 ? '+' : ''}${revChange}%` : 'n/a'}, net profit ${netChange != null ? `${netChange > 0 ? '+' : ''}${netChange}%` : 'n/a'}`)
  }
  if (cash) {
    signals.push(`Cash balance ${cash.balance}, runway ${cash.runway_months ?? 'unknown'} months (${cash.runway_status})`)
  }
  if (inventory) {
    signals.push(`Inventory: ${inventory.total_products} products, ${inventory.stockout_rate}% stockout rate`)
  }
  if (alerts && alerts.length > 0) {
    signals.push(`Active alerts: ${alerts.map((a: any) => `[${a.severity}] ${a.message}`).join('; ')}`)
  }

  if (signals.length === 0) return NextResponse.json({ narrative: null })

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 220,
        messages: [{
          role: 'user',
          content: `You are a CFO writing the Executive Summary paragraph of a formal financial report for a small/medium business in ${region.countryName}. Using ONLY the figures below, write ONE professional paragraph of 2-4 sentences covering: what changed this period, the most likely reason why, and one thing to watch next. Use specific numbers from the data. Do not invent figures not given. No headers, no bullet points, no preamble — plain prose only, third person ("the business"), suitable to print in a document.

${signals.join('\n')}

Format as JSON: {"narrative": "..."}
Return ONLY valid JSON.`,
        }],
      }),
    })

    if (!groqRes.ok) {
      const err = await groqRes.text()
      console.error('[cfo/report-narrative] Groq error:', err)
      return NextResponse.json({ narrative: null, error: true }, { status: 500 })
    }

    const groqData = await groqRes.json()
    const text = groqData.choices?.[0]?.message?.content || ''

    logUsage({
      route: 'cfo/report-narrative',
      model: GROQ_MODEL,
      usage: {
        input_tokens: groqData.usage?.prompt_tokens || 0,
        output_tokens: groqData.usage?.completion_tokens || 0,
      },
      userId: user.id,
    })

    if (!text) return NextResponse.json({ narrative: null })
    const match = text.match(/\{[\s\S]*\}/)
    const parsed = match ? JSON.parse(match[0]) : { narrative: null }

    setDailyCache(user.id, routeKey, parsed)
    return NextResponse.json(parsed)
  } catch (e) {
    console.error('[cfo/report-narrative] Groq error:', e)
    return NextResponse.json({ narrative: null, error: true }, { status: 500 })
  }
}
