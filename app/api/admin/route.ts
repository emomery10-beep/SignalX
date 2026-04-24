import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = 'emomery10@gmail.com'

async function verifyAdmin(supabase: ReturnType<typeof createServerClient>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return false
  return true
}

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  if (!(await verifyAdmin(supabase))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all profiles with usage
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, plan_id, business_type, registration_country, is_suspicious, created_at')
      .order('created_at', { ascending: false })

    // Get all auth users for emails
    const { data: authData } = await supabase.auth.admin.listUsers()
    const emailMap: Record<string, string> = {}
    authData?.users?.forEach((u: {id: string, email?: string}) => { if (u.email) emailMap[u.id] = u.email })

    // Get usage logs for current month
    const monthYear = new Date().toISOString().slice(0, 7)
    const { data: usage } = await supabase
      .from('usage_logs')
      .select('user_id, questions_used')
      .eq('month_year', monthYear)

    const usageMap: Record<string, number> = {}
    usage?.forEach(u => { usageMap[u.user_id] = u.questions_used })

    // Get subscriptions
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('user_id, plan_id, status')

    const subsMap: Record<string, string> = {}
    subs?.forEach(s => { subsMap[s.user_id] = s.plan_id })

    // Build user rows
    const users = (profiles || []).map(p => ({
      id: p.id,
      email: emailMap[p.id] || '',
      full_name: p.full_name,
      plan_id: subsMap[p.id] || p.plan_id || 'free',
      business_type: p.business_type,
      registration_country: p.registration_country,
      questions_used: usageMap[p.id] || 0,
      created_at: p.created_at,
      is_suspicious: p.is_suspicious,
    }))

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

    return NextResponse.json({ stats, users, candidates })
  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  if (!(await verifyAdmin(supabase))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, userId, planId } = await request.json()

  if (action === 'change_plan') {
    // Update subscriptions table
    const { error } = await supabase
      .from('subscriptions')
      .upsert({ user_id: userId, plan_id: planId, status: 'active' }, { onConflict: 'user_id' })

    // Also update profiles
    await supabase.from('profiles').update({ plan_id: planId }).eq('id', userId)

    if (error) return NextResponse.json({ success: false, error: error.message })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
