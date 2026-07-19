import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/admin-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any })

export async function GET(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all profiles with usage
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      // NOTE: is_suspicious is not selected here — migration 006_ip_fraud.sql that adds it
      // to profiles has not been applied to production, so selecting it fails the whole query.
      .select('id, full_name, plan_id, business_type, country_code, created_at, pos_enabled, pos_seat_count, pos_stripe_subscription_id')
      .order('created_at', { ascending: false })

    if (profilesError) console.error('Profiles query error:', profilesError)

    // Get all auth users for emails
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) console.error('Auth listUsers error:', authError)
    const emailMap: Record<string, string> = {}
    const authUserMap: Record<string, any> = {}
    authData?.users?.forEach((u: any) => {
      if (u.email) emailMap[u.id] = u.email
      authUserMap[u.id] = u
    })

    // Get usage for current month (table: usage, columns: questions / period)
    const monthYear = new Date().toISOString().slice(0, 7)
    const { data: usage } = await supabase
      .from('usage')
      .select('user_id, questions')
      .eq('period', monthYear)

    const usageMap: Record<string, number> = {}
    usage?.forEach((u: any) => { usageMap[u.user_id] = u.questions })

    // Get subscriptions
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('user_id, plan_id, status, stripe_subscription_id, trial_ends_at')

    const subsMap: Record<string, string> = {}
    const subsByUser: Record<string, any> = {}
    subs?.forEach((s: any) => { subsMap[s.user_id] = s.plan_id; subsByUser[s.user_id] = s })

    // Get trials — used to tell a paid plan/seats apart from an unpaid free trial
    // or an admin-granted plan with no payment behind it (see change_plan below).
    const { data: trials } = await supabase
      .from('trials')
      .select('user_id, trial_type, ends_at, converted')

    const trialsByUser: Record<string, any[]> = {}
    trials?.forEach((t: any) => {
      if (!trialsByUser[t.user_id]) trialsByUser[t.user_id] = []
      trialsByUser[t.user_id].push(t)
    })

    const now2 = Date.now()
    function paymentStatus(p: any, sub: any, userTrials: any[], planPaid: boolean) {
      if (planPaid) return 'paid'
      const activeTrial = userTrials.find(t => !t.converted && new Date(t.ends_at).getTime() > now2)
      if (activeTrial || sub?.status === 'trialing') return 'trial'
      const expiredTrial = userTrials.find(t => !t.converted && new Date(t.ends_at).getTime() <= now2)
      if (expiredTrial) return 'trial_expired'
      if (p.plan_id !== 'free' || p.pos_enabled) return 'manual'
      return 'free'
    }

    // Get POS stats per user — transaction count and total revenue
    // status is constrained to completed/refunded/partially_refunded/amended — 'paid'
    // and 'complete' never occur, so the old .in() filter was matching a value ('completed')
    // plus two values that don't exist. payment_status is unreliable as a revenue gate:
    // many real completed sales (e.g. cash) are left at payment_status='pending' and never
    // flipped, so gating on it would undercount revenue platform-wide.
    const { data: posStats } = await supabase
      .from('pos_transactions')
      .select('owner_id, total, status')
      .eq('status', 'completed')

    const posMap: Record<string, { txCount: number; revenue: number }> = {}
    posStats?.forEach((tx: any) => {
      if (!posMap[tx.owner_id]) posMap[tx.owner_id] = { txCount: 0, revenue: 0 }
      posMap[tx.owner_id].txCount++
      posMap[tx.owner_id].revenue += Number(tx.total) || 0
    })

    // Build user rows — fallback to auth users if profiles table is empty/errored
    let users: any[]
    if (profiles && profiles.length > 0) {
      users = profiles.map((p: any) => {
        const sub = subsByUser[p.id]
        const userTrials = trialsByUser[p.id] || []
        const planId = subsMap[p.id] || p.plan_id || 'free'
        return {
          id: p.id,
          email: emailMap[p.id] || '',
          full_name: p.full_name,
          plan_id: planId,
          business_type: p.business_type,
          registration_country: p.country_code,
          questions_used: usageMap[p.id] || 0,
          pos_tx_count: posMap[p.id]?.txCount || 0,
          pos_revenue: posMap[p.id]?.revenue || 0,
          pos_enabled: !!p.pos_enabled,
          pos_seat_count: p.pos_seat_count || 0,
          created_at: p.created_at,
          is_suspicious: false,
          plan_payment_status: planId === 'free' ? 'free' : paymentStatus(p, sub, userTrials.filter((t: any) => t.trial_type === 'growth'), !!sub?.stripe_subscription_id),
          pos_payment_status: !p.pos_enabled ? 'free' : paymentStatus(p, sub, userTrials.filter((t: any) => t.trial_type === 'pos'), !!p.pos_stripe_subscription_id),
        }
      })
    } else {
      users = (authData?.users || []).map((u: any) => ({
        id: u.id,
        email: u.email || '',
        full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || '',
        plan_id: subsMap[u.id] || 'free',
        business_type: null,
        registration_country: null,
        questions_used: usageMap[u.id] || 0,
        pos_tx_count: posMap[u.id]?.txCount || 0,
        pos_revenue: posMap[u.id]?.revenue || 0,
        pos_enabled: false,
        pos_seat_count: 0,
        created_at: u.created_at,
        is_suspicious: false,
        plan_payment_status: 'free',
        pos_payment_status: 'free',
      }))
    }

    // Stats
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const payingUsers = users.filter(u => ['growth', 'business', 'enterprise'].includes(u.plan_id)).length
    const mrr = users.reduce((sum, u) => {
      if (u.plan_id === 'growth') return sum + 19
      if (u.plan_id === 'business') return sum + 49
      return sum
    }, 0)

    const stats = {
      totalUsers: users.length,
      payingUsers,
      freeUsers: users.length - payingUsers,
      mrr,
      newThisWeek: users.filter(u => new Date(u.created_at) > weekAgo).length,
      newThisMonth: users.filter(u => new Date(u.created_at) > monthStart).length,
      suspiciousCount: users.filter(u => u.is_suspicious).length,
    }

    // Upgrade candidates — 7-9 questions used on free plan
    const candidates = users.filter(u =>
      u.plan_id === 'free' &&
      u.questions_used >= 7 &&
      u.questions_used <= 9
    )

    const { data: xActivity } = await supabase
      .from('x_agent_activity')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    const { data: agentContent } = await supabase
      .from('agent_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    // Stripe data
    let stripeData: any = { mrr: 0, arr: 0, activeSubscriptions: 0, totalRevenue: 0, customers: 0, recentPayments: [], subscriptions: [] }
    try {
      const [activeSubs, customers, recentCharges, balanceTransactions] = await Promise.all([
        stripe.subscriptions.list({ status: 'active', limit: 100, expand: ['data.customer'] }),
        stripe.customers.list({ limit: 100 }),
        stripe.charges.list({ limit: 20 }),
        stripe.balanceTransactions.list({ limit: 100, type: 'charge' }),
      ])

      let stripeMrr = 0
      const stripeSubs = activeSubs.data.map(sub => {
        const item = sub.items.data[0]
        const amount = (item?.price?.unit_amount || 0) / 100
        const interval = item?.price?.recurring?.interval
        const monthly = interval === 'year' ? amount / 12 : amount
        stripeMrr += monthly
        const customer = sub.customer as Stripe.Customer
        return {
          id: sub.id,
          customerEmail: customer?.email || '',
          customerName: customer?.name || '',
          plan: item?.price?.nickname || item?.price?.id || 'Unknown',
          amount,
          interval: interval || 'month',
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          created: new Date(sub.created * 1000).toISOString(),
        }
      })

      const recentPayments = recentCharges.data.map(c => ({
        id: c.id,
        amount: (c.amount || 0) / 100,
        currency: c.currency,
        status: c.status,
        email: c.billing_details?.email || c.receipt_email || '',
        description: c.description || '',
        created: new Date(c.created * 1000).toISOString(),
      }))

      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthRevenue = balanceTransactions.data
        .filter(t => new Date(t.created * 1000) >= monthStart)
        .reduce((sum, t) => sum + t.net, 0) / 100

      stripeData = {
        mrr: Math.round(stripeMrr * 100) / 100,
        arr: Math.round(stripeMrr * 12 * 100) / 100,
        activeSubscriptions: activeSubs.data.length,
        totalCustomers: customers.data.length,
        monthRevenue: Math.round(monthRevenue * 100) / 100,
        totalRevenue: Math.round(balanceTransactions.data.reduce((s, t) => s + t.net, 0) / 100 * 100) / 100,
        recentPayments,
        subscriptions: stripeSubs,
      }

      stats.mrr = stripeData.mrr
      stats.payingUsers = activeSubs.data.length
    } catch (stripeError) {
      console.error('Stripe error:', stripeError)
    }

    // Real API usage for current month
    const apiUsageMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const { data: apiUsageRows } = await supabase
      .from('api_usage')
      .select('route, model, input_tokens, output_tokens, cost_usd, created_at')
      .gte('created_at', apiUsageMonthStart)
      .order('created_at', { ascending: true })

    const apiUsage = {
      totalCostUsd: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      byRoute: {} as Record<string, { calls: number; costUsd: number; model: string; inputTokens: number; outputTokens: number }>,
      byModel: {} as Record<string, { calls: number; costUsd: number }>,
      byDay: {} as Record<string, number>,
    }
    ;(apiUsageRows || []).forEach((r: any) => {
      apiUsage.totalCostUsd += r.cost_usd || 0
      apiUsage.totalInputTokens += r.input_tokens || 0
      apiUsage.totalOutputTokens += r.output_tokens || 0
      if (!apiUsage.byRoute[r.route]) apiUsage.byRoute[r.route] = { calls: 0, costUsd: 0, model: r.model || '', inputTokens: 0, outputTokens: 0 }
      apiUsage.byRoute[r.route].calls++
      apiUsage.byRoute[r.route].costUsd += r.cost_usd || 0
      apiUsage.byRoute[r.route].inputTokens += r.input_tokens || 0
      apiUsage.byRoute[r.route].outputTokens += r.output_tokens || 0
      // Keep the model with the most calls (first-seen wins; only overwrite if unset)
      if (!apiUsage.byRoute[r.route].model && r.model) apiUsage.byRoute[r.route].model = r.model
      const model = r.model || 'unknown'
      if (!apiUsage.byModel[model]) apiUsage.byModel[model] = { calls: 0, costUsd: 0 }
      apiUsage.byModel[model].calls++
      apiUsage.byModel[model].costUsd += r.cost_usd || 0
      const day = (r.created_at || '').slice(0, 10)
      if (day) apiUsage.byDay[day] = (apiUsage.byDay[day] || 0) + (r.cost_usd || 0)
    })

    return NextResponse.json({
      stats, users, candidates, stripe: stripeData,
      xActivity: xActivity || [], agentContent: agentContent || [],
      apiUsage,
    })
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServiceClient()
  const admin = await getAdminUser(request, supabase)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { action, userId, planId } = await request.json()

  if (action === 'change_plan') {
    // Check if subscription row exists
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    let subError: any = null
    if (existing) {
      // Update existing subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ plan_id: planId, status: 'active' })
        .eq('user_id', userId)
      subError = error
    } else {
      // Insert new subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert({ user_id: userId, plan_id: planId, status: 'active' })
      subError = error
    }

    // Also update profiles
    const { error: profileError } = await supabase.from('profiles').update({ plan: planId, plan_id: planId }).eq('id', userId)

    if (subError) return NextResponse.json({ success: false, error: subError.message })
    if (profileError) return NextResponse.json({ success: false, error: profileError.message })
    return NextResponse.json({ success: true })
  }

  if (action === 'reset_pin') {
    // Confirm the target account exists before minting a credential for it.
    const { data: target, error: targetError } = await supabase.auth.admin.getUserById(userId)
    if (targetError || !target?.user) return NextResponse.json({ success: false, error: 'User not found' })

    const tempPin = String(Math.floor(Math.random() * 10000)).padStart(4, '0')

    const { error: authError } = await supabase.auth.admin.updateUserById(userId, { password: tempPin })
    if (authError) return NextResponse.json({ success: false, error: authError.message })

    const { error: profileError } = await supabase.from('profiles').update({ must_change_pin: true }).eq('id', userId)
    if (profileError) return NextResponse.json({ success: false, error: profileError.message })

    return NextResponse.json({ success: true, tempPin })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
