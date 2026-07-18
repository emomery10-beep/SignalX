// app/api/logistics/route.ts — Plan-gated
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  calculateLogisticsHealth,
  generateDailyLogisticsBrief,
  getActiveShipments,
  getUnreadAlerts,
  getSupplierScores,
} from '@/lib/shipment-intelligence'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getUserAndPlan() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, plan: 'free' }
  const { data: profile } = await supabase
    .from('profiles').select('plan, plan_id').eq('id', user.id).single()
  // plan_id first — see memory: profiles-plan-column-drift-bug.
  return { supabase, user, plan: profile?.plan_id || profile?.plan || 'free' }
}

function isBusiness(plan: string) {
  return ['business', 'enterprise'].includes(plan)
}
function isGrowthOrAbove(plan: string) {
  return ['growth', 'business', 'enterprise'].includes(plan)
}

export async function GET(request: NextRequest) {
  try {
    const { user, plan } = await getUserAndPlan()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const view = searchParams.get('view') || 'summary'

    // Supplier scoring — Business only
    if (view === 'suppliers') {
      if (!isBusiness(plan)) {
        return NextResponse.json({
          suppliers: [],
          locked: true,
          message: 'Supplier reliability scoring is a Business plan feature.',
          upgrade_url: '/billing',
        })
      }
      const suppliers = await getSupplierScores(user.id)
      return NextResponse.json({ suppliers })
    }

    // Health score — Growth and above
    if (view === 'health') {
      if (!isGrowthOrAbove(plan)) {
        return NextResponse.json({
          health: null,
          locked: true,
          message: 'Logistics health score is available on Growth and Business plans.',
          upgrade_url: '/billing',
        })
      }
      const health = await calculateLogisticsHealth(user.id)
      // Strip financial data for Growth
      if (!isBusiness(plan)) {
        health.total_working_capital = 0
        health.daily_financing_cost = 0
      }
      return NextResponse.json({ health, plan })
    }

    // Daily brief — Business only (full), Growth gets simplified version
    if (view === 'brief') {
      if (!isGrowthOrAbove(plan)) {
        return NextResponse.json({ brief: null, locked: true, upgrade_url: '/billing' })
      }
      const brief = await generateDailyLogisticsBrief(user.id)
      if (!isBusiness(plan)) {
        // Growth: strip financial impact from brief
        brief.total_financial_impact = 0
        brief.working_capital_in_transit = 0
        brief.critical_alerts = brief.critical_alerts.map(a => ({ ...a, financial_impact: 0 }))
        brief.warning_alerts = brief.warning_alerts.map(a => ({ ...a, financial_impact: 0 }))
      }
      return NextResponse.json({ brief, plan })
    }

    // Alerts — Business only
    if (view === 'alerts') {
      if (!isBusiness(plan)) {
        return NextResponse.json({
          alerts: [],
          locked: !isGrowthOrAbove(plan),
          message: isBusiness(plan) ? null : 'Financial alerts are a Business plan feature.',
          upgrade_url: '/billing',
        })
      }
      const alerts = await getUnreadAlerts(user.id)
      return NextResponse.json({ alerts })
    }

    // Default summary — all plans get something
    const [health, shipments] = await Promise.all([
      isGrowthOrAbove(plan) ? calculateLogisticsHealth(user.id) : Promise.resolve(null),
      getActiveShipments(user.id),
    ])

    const alerts = isBusiness(plan) ? await getUnreadAlerts(user.id) : []
    const brief = isBusiness(plan) ? await generateDailyLogisticsBrief(user.id) : null

    // Strip working capital from Growth health
    if (health && !isBusiness(plan)) {
      health.total_working_capital = 0
      health.daily_financing_cost = 0
    }

    return NextResponse.json({
      health,
      brief,
      alerts,
      shipments,
      plan,
      plan_features: {
        max_shipments: plan === 'free' || plan === 'starter' ? 1 : plan === 'growth' ? 5 : 'unlimited',
        financial_intelligence: isGrowthOrAbove(plan),
        full_intelligence: isBusiness(plan),
        supplier_scoring: isBusiness(plan),
        customs_alerts: isBusiness(plan),
        working_capital: isBusiness(plan),
        stockout_risk: isBusiness(plan),
      },
    })
  } catch (err: any) {
    console.error('[logistics GET]', err)
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await getUserAndPlan()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { alert_ids } = await request.json()
    if (alert_ids?.length) {
      await supabase.from('shipment_alerts').update({ is_read: true })
        .in('id', alert_ids).eq('user_id', user.id)
    }
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
