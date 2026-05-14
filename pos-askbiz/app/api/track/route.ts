// app/api/track/route.ts — Plan-gated version
// Free: 1 shipment, status only
// Growth: 5 shipments, basic financial (total value + delay days)
// Business: unlimited, full intelligence
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SEVENTEEN_TOKEN = process.env.SEVENTEEN_TRACK_API_KEY || ''
const BASE = 'https://api.17track.net/track/v2.2'

async function t17(endpoint: string, body: unknown) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', '17token': SEVENTEEN_TOKEN },
    body: JSON.stringify(body),
  })
  return res.json()
}

function safeJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// Plan checks
const LIMITS = {
  free:     { shipments: 1,         financial: false, intelligence: false },
  starter:  { shipments: 1,         financial: false, intelligence: false },
  growth:   { shipments: 5,         financial: true,  intelligence: false },
  business: { shipments: Infinity,  financial: true,  intelligence: true  },
  enterprise:{ shipments: Infinity, financial: true,  intelligence: true  },
}

function getLimits(plan: string) {
  return LIMITS[plan as keyof typeof LIMITS] || LIMITS.free
}

async function getUserAndPlan() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, plan: 'free' }
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, plan_id')
    .eq('id', user.id)
    .single()
  const plan = profile?.plan || profile?.plan_id || 'free'
  return { supabase, user, plan }
}

// Strip fields based on plan
function applyPlanFilter(shipment: any, plan: string) {
  const limits = getLimits(plan)

  // Business: everything
  if (limits.intelligence) return { ...shipment, intelligence_locked: false }

  // Growth: basic financial (total value + delay days), no intelligence
  if (limits.financial) {
    return {
      id: shipment.id,
      tracking_number: shipment.tracking_number,
      carrier_name: shipment.carrier_name,
      supplier_name: shipment.supplier_name,
      sku: shipment.sku,
      quantity: shipment.quantity,
      shipment_type: shipment.shipment_type,
      track_status: shipment.track_status,
      track_sub_status: shipment.track_sub_status,
      last_event: shipment.last_event,
      last_location: shipment.last_location,
      expected_arrival: shipment.expected_arrival,
      actual_arrival: shipment.actual_arrival,
      order_date: shipment.order_date,
      is_at_risk: shipment.is_at_risk,
      customs_hold: shipment.customs_hold,
      delay_days: shipment.delay_days,
      // Growth gets: total value only
      total_value: shipment.total_value,
      // Locked for growth
      financial_impact: null,
      daily_financing_cost: null,
      working_capital_days: null,
      stockout_risk: null,
      created_at: shipment.created_at,
      intelligence_locked: true,
      plan_limit: 'growth',
    }
  }

  // Free: status only
  return {
    id: shipment.id,
    tracking_number: shipment.tracking_number,
    supplier_name: shipment.supplier_name,
    sku: shipment.sku,
    shipment_type: shipment.shipment_type,
    track_status: shipment.track_status,
    last_event: shipment.last_event,
    last_location: shipment.last_location,
    expected_arrival: shipment.expected_arrival,
    actual_arrival: shipment.actual_arrival,
    customs_hold: shipment.customs_hold,
    created_at: shipment.created_at,
    // Everything locked
    total_value: null,
    financial_impact: null,
    daily_financing_cost: null,
    working_capital_days: null,
    delay_days: null,
    is_at_risk: null,
    stockout_risk: null,
    intelligence_locked: true,
    plan_limit: 'free',
  }
}

// ── GET — list shipments ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { supabase, user, plan } = await getUserAndPlan()
    if (!user) return safeJson({ error: 'Unauthorized' }, 401)

    const limits = getLimits(plan)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('shipments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (status === 'active') {
      query = query.not('track_status', 'in', '("Delivered","Undelivered","Expired")')
    } else if (status === 'delivered') {
      query = query.eq('track_status', 'Delivered')
    }

    const { data: shipments } = await query.limit(100)
    const result = (shipments || []).map(s => applyPlanFilter(s, plan))

    return safeJson({
      shipments: result,
      plan,
      limits: {
        max_shipments: limits.shipments === Infinity ? 'unlimited' : limits.shipments,
        financial_intelligence: limits.financial,
        full_intelligence: limits.intelligence,
        current_count: result.length,
      },
    })
  } catch (err: any) {
    return safeJson({ error: err?.message }, 500)
  }
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { supabase, user, plan } = await getUserAndPlan()
    if (!user) return safeJson({ error: 'Unauthorized' }, 401)

    const limits = getLimits(plan)
    const body = await request.json()
    const { action } = body

    // ── Register ──────────────────────────────────────────────────────────────
    if (action === 'register') {
      // Check shipment limit
      if (limits.shipments !== Infinity) {
        const { count } = await supabase
          .from('shipments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .not('track_status', 'in', '("Delivered","Undelivered","Expired")')

        if ((count || 0) >= limits.shipments) {
          return safeJson({
            error: plan === 'free'
              ? 'Free plan includes 1 shipment. Upgrade to Growth for 5 shipments, or Business for unlimited.'
              : 'Growth plan includes 5 shipments. Upgrade to Business for unlimited shipments and full financial intelligence.',
            locked: true,
            limit: limits.shipments,
            current: count,
            upgrade_url: '/billing',
          }, 403)
        }
      }

      const {
        tracking_number, carrier, supplier_name, sku, quantity,
        unit_cost, order_date, expected_arrival, notes,
        purchase_order_ref, shipment_type = 'inbound',
      } = body

      if (!tracking_number) return safeJson({ error: 'tracking_number required' }, 400)

      // Register with 17Track
      const t17res = await t17('/register', [{ number: tracking_number, ...(carrier ? { carrier } : {}) }])
      const accepted = t17res?.data?.accepted?.[0]
      const rejected = t17res?.data?.rejected?.[0]
      if (rejected) return safeJson({ error: `17Track: ${rejected.error?.message || 'Rejected'}` }, 400)

      // Financial fields: only save if plan allows
      const totalValue = limits.financial && unit_cost && quantity
        ? unit_cost * quantity : null
      const dailyFinancingCost = limits.intelligence && unit_cost && quantity
        ? parseFloat(((unit_cost * quantity * 0.085) / 365).toFixed(2)) : 0

      const { data: shipment, error } = await supabase.from('shipments').insert({
        user_id: user.id,
        tracking_number,
        carrier_code: accepted?.carrier || carrier || null,
        supplier_name: supplier_name || null,
        sku: sku || null,
        quantity: quantity || null,
        unit_cost: limits.financial ? (unit_cost || null) : null,
        total_value: totalValue,
        order_date: order_date || null,
        expected_arrival: expected_arrival || null,
        track_status: 'Pending',
        shipment_type,
        purchase_order_ref: limits.financial ? (purchase_order_ref || null) : null,
        notes: notes || null,
        daily_financing_cost: dailyFinancingCost,
        working_capital_days: 0,
        financial_impact: 0,
        is_at_risk: false,
        customs_hold: false,
        stockout_risk: false,
      }).select().single()

      if (error) return safeJson({ error: error.message }, 500)

      return safeJson({
        success: true,
        shipment: applyPlanFilter(shipment, plan),
        plan,
        remaining_slots: limits.shipments === Infinity
          ? 'unlimited'
          : limits.shipments - ((await supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('user_id', user.id).not('track_status', 'in', '("Delivered","Undelivered","Expired")')).count || 0),
      })
    }

    // ── Lookup ────────────────────────────────────────────────────────────────
    if (action === 'lookup') {
      const { tracking_number } = body
      if (!tracking_number) return safeJson({ error: 'tracking_number required' }, 400)
      const { data: existing } = await supabase
        .from('shipments').select('*')
        .eq('user_id', user.id).eq('tracking_number', tracking_number).single()
      if (existing) return safeJson({ shipment: applyPlanFilter(existing, plan), source: 'db' })
      const t17res = await t17('/push', [{ number: tracking_number }])
      return safeJson({ tracking: t17res?.data?.accepted?.[0] || null, source: '17track' })
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    if (action === 'delete') {
      const { id } = body
      await supabase.from('shipments').delete().eq('id', id).eq('user_id', user.id)
      return safeJson({ success: true })
    }

    return safeJson({ error: 'Invalid action' }, 400)
  } catch (err: any) {
    console.error('[track POST]', err)
    return safeJson({ error: err?.message || 'Internal error' }, 500)
  }
}
