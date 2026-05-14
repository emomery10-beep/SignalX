import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']

async function getAdminUser(request: NextRequest, supabase: any) {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
    if (user && ADMIN_EMAILS.includes(user.email || '')) return user
  }
  const accessToken = request.cookies.get('sb-access-token')?.value
    || request.cookies.get(`sb-${(process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace('https://','').split('.')[0]}-auth-token`)?.value
  if (accessToken) {
    try {
      const parsed = JSON.parse(accessToken)
      const token = Array.isArray(parsed) ? parsed[0] : parsed
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user && ADMIN_EMAILS.includes(user.email || '')) return user
    } catch {
      const { data: { user } } = await supabase.auth.getUser(accessToken)
      if (user && ADMIN_EMAILS.includes(user.email || '')) return user
    }
  }
  return null
}

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
      .select('id, full_name, plan_id, business_type, registration_country, is_suspicious, created_at')
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
    usage?.forEach(u => { usageMap[u.user_id] = u.questions })

    // Get subscriptions
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('user_id, plan_id, status')

    const subsMap: Record<string, string> = {}
    subs?.forEach(s => { subsMap[s.user_id] = s.plan_id })

    // Build user rows — fallback to auth users if profiles table is empty/errored
    let users: any[]
    if (profiles && profiles.length > 0) {
      users = profiles.map(p => ({
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
    } else {
      users = (authData?.users || []).map((u: any) => ({
        id: u.id,
        email: u.email || '',
        full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || '',
        plan_id: subsMap[u.id] || 'free',
        business_type: null,
        registration_country: null,
        questions_used: usageMap[u.id] || 0,
        created_at: u.created_at,
        is_suspicious: false,
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

    return NextResponse.json({
      stats, users, candidates,
      xActivity: xActivity || [], agentContent: agentContent || [],
      _debug: {
        profilesCount: profiles?.length ?? 0,
        profilesError: profilesError?.message || null,
        authUsersCount: authData?.users?.length ?? 0,
        subsCount: subs?.length ?? 0,
        usageCount: usage?.length ?? 0,
      }
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
