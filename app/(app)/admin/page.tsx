'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
const PLAN_COLORS: Record<string, string> = {
  free: '#64748b', growth: '#b45309', business: '#7c3aed', enterprise: '#047857',
}
// Distinguishes an actually-paid plan/seats from a free trial or an admin-granted
// plan with no Stripe/M-Pesa/PesaPal payment behind it — both look identical to
// plan_id/pos_seat_count alone, so surface it explicitly next to each badge.
const PAYMENT_BADGE: Record<string, React.ReactNode> = {
  trial: <span title="Free trial, not yet paid" style={{marginLeft:5,padding:'1px 6px',borderRadius:9999,fontSize:13,fontWeight:700,background:'#2563eb20',color:'#2563eb'}}>TRIAL</span>,
  trial_expired: <span title="Trial period ended, never converted to paid" style={{marginLeft:5,padding:'1px 6px',borderRadius:9999,fontSize:13,fontWeight:700,background:'#dc262620',color:'#dc2626'}}>EXPIRED</span>,
  manual: <span title="Granted manually via admin panel, no payment on file" style={{marginLeft:5,padding:'1px 6px',borderRadius:9999,fontSize:13,fontWeight:700,background:'#d9770620',color:'#d97706'}}>MANUAL</span>,
}
const TABS = ['Overview','Revenue','Users','Activity','Costs','Growth'] as const
type Tab = typeof TABS[number]
const TAB_KEYS: Record<Tab, string> = {
  Overview: 'tab_overview', Revenue: 'tab_revenue', Users: 'tab_users',
  Activity: 'tab_activity', Costs: 'tab_costs', Growth: 'tab_growth',
}

function KV({ label, value, sub, color, onClick, active }: { label: string; value: any; sub?: string; color?: string; onClick?: () => void; active?: boolean }) {
  const clickable = !!onClick
  return (
    <div
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-expanded={clickable ? !!active : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick!() } } : undefined}
      className={clickable ? 'kv-clickable' : undefined}
      style={{display:'flex',flexDirection:'column',alignItems:'flex-start',position:'relative',padding:'20px 20px 18px',borderRadius:16,border:'1px solid '+(active?(color||'#6366F1'):'var(--b)'),background:'var(--sf)',cursor:clickable?'pointer':'default',minHeight:112,transition:'border-color .18s, box-shadow .18s, transform .18s',boxShadow:active?'0 0 0 3px '+(color||'#6366F1')+'1f':undefined}}
    >
      <div style={{fontSize:15,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.07em',lineHeight:1.3,marginBottom:'auto',paddingRight:clickable?22:0}}>{label}</div>
      <div style={{fontSize:34,fontWeight:700,fontFamily:'var(--font-sora)',color:color||'var(--tx)',lineHeight:1.05,letterSpacing:'-.02em',marginTop:14}}>{value}</div>
      {sub && <div style={{fontSize:16,color:'var(--tx2)',marginTop:6,lineHeight:1.4}}>{sub}</div>}
      {clickable && (
        <span aria-hidden style={{position:'absolute',top:18,right:18,display:'flex',color:active?(color||'#6366F1'):'var(--tx3)',opacity:active?1:.5,transition:'transform .2s',transform:active?'rotate(180deg)':'none'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </span>
      )}
    </div>
  )
}

// ── Drill-down helpers (Overview) ──
function DetailShell({ title, subtitle, accent, onClose, children }: { title: string; subtitle?: string; accent: string; onClose: () => void; children: any }) {
  return (
    <div className="ov-detail" style={{marginBottom:28,borderRadius:16,border:'1px solid '+accent+'44',background:'var(--sf)',overflow:'hidden',boxShadow:'0 8px 28px '+accent+'12'}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,padding:'16px 22px',borderBottom:'1px solid var(--b)',background:accent+'0d'}}>
        <div>
          <div style={{fontSize:19,fontWeight:700,fontFamily:'var(--font-sora)',color:accent,letterSpacing:'-.01em'}}>{title}</div>
          {subtitle && <div style={{fontSize:16,color:'var(--tx3)',marginTop:3}}>{subtitle}</div>}
        </div>
        <button onClick={onClose} aria-label="Close details" style={{flexShrink:0,width:30,height:30,borderRadius:9,border:'1px solid var(--b)',background:'var(--sf)',color:'var(--tx3)',cursor:'pointer',fontSize:22,lineHeight:1,fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
      </div>
      <div style={{padding:'18px 22px'}}>{children}</div>
    </div>
  )
}

function SectionLabel({ children }: { children: any }) {
  return <div style={{fontSize:15,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.06em',margin:'22px 0 12px'}}>{children}</div>
}

function Chip({ text, color }: { text: string; color: string }) {
  return <span style={{padding:'3px 9px',borderRadius:9999,fontSize:15,fontWeight:600,background:color+'1f',color,textTransform:'capitalize'}}>{text}</span>
}

function ChipStats({ items }: { items: { label: string; value: any }[] }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(128px,1fr))',gap:12}}>
      {items.map(({label,value}) => (
        <div key={label} style={{padding:'12px 14px',borderRadius:12,background:'var(--bg)',border:'1px solid var(--b)'}}>
          <div style={{fontSize:14,color:'var(--tx3)',marginBottom:6,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
          <div style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-sora)',letterSpacing:'-.01em'}}>{value}</div>
        </div>
      ))}
    </div>
  )
}

function Bar({ label, pct, color, right }: { label: string; pct: number; color: string; right: string }) {
  return (
    <div style={{marginBottom:14}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,fontSize:16.5,gap:8}}>
        <span style={{textTransform:'capitalize',fontWeight:500}}>{label}</span>
        <span style={{color:'var(--tx3)',whiteSpace:'nowrap'}}>{right}</span>
      </div>
      <div style={{height:7,borderRadius:4,background:'var(--ev)'}}>
        <div style={{height:'100%',width:Math.min(100,Math.max(0,pct))+'%',background:color,borderRadius:4}} />
      </div>
    </div>
  )
}

function PersonRow({ name, sub, right }: { name: any; sub?: any; right?: any }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 0',borderBottom:'1px solid var(--b)',gap:12}}>
      <div style={{minWidth:0}}>
        <div style={{fontWeight:600,fontSize:17,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{name}</div>
        {sub && <div style={{fontSize:16,color:'var(--tx3)',marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{sub}</div>}
      </div>
      {right && <div style={{flexShrink:0}}>{right}</div>}
    </div>
  )
}

function EmptyNote({ text }: { text: string }) {
  return <div style={{textAlign:'center',padding:'24px 12px',color:'var(--tx3)',fontSize:17}}>{text}</div>
}

function MoreNote({ n }: { n: number }) {
  if (n <= 0) return null
  return <div style={{fontSize:16,color:'var(--tx3)',textAlign:'center',paddingTop:10}}>+{n} more</div>
}

export default function AdminPage() {
  const router = useRouter()
  const { tc } = useLang()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('Overview')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [xActivity, setXActivity] = useState<any[]>([])
  const [signups, setSignups] = useState<any[]>([])
  const [stripeData, setStripeData] = useState<any>(null)
  const [apiUsage, setApiUsage] = useState<any>(null)
  const [sendingEmailFor, setSendingEmailFor] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) { router.push('/'); return }
      setAuthorized(true)
      loadAll()
    }
    init()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin', {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      })
      if (res.ok) {
        const d = await res.json()
        setStats(d.stats)
        setUsers(d.users || [])
        setCandidates(d.candidates || [])
        setXActivity(d.xActivity || [])
        setStripeData(d.stripe || null)
        setApiUsage(d.apiUsage || null)
        const days: Record<string, number> = {}
        const now = new Date()
        for (let i = 29; i >= 0; i--) {
          const d2 = new Date(now)
          d2.setDate(d2.getDate() - i)
          days[d2.toISOString().slice(0, 10)] = 0
        }
        ;(d.users || []).forEach((u: any) => {
          const day = u.created_at?.slice(0, 10)
          if (day && days[day] !== undefined) days[day]++
        })
        setSignups(Object.entries(days).map(([date, count]) => ({ date, count })))
      }
    } finally { setLoading(false) }
  }

  const changePlan = async (userId: string, planId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ action: 'change_plan', userId, planId }),
      })
      const d = await res.json()
      if (d.success) {
        setActionMsg(tc('admin.plan_updated', { plan: planId }))
        loadAll()
      } else {
        setActionMsg(tc('admin.plan_update_failed', { error: d.error || res.statusText }))
      }
      setTimeout(() => setActionMsg(''), 4000)
    } catch (err: any) {
      setActionMsg(tc('admin.error_prefix', { error: err?.message || tc('admin.network_error') }))
      setTimeout(() => setActionMsg(''), 4000)
    }
  }

  const sendLifecycleEmail = async (userId: string, emailType: string) => {
    setSendingEmailFor(userId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ userId, emailType }),
      })
      const d = await res.json()
      setActionMsg(d.success ? tc('admin.lifecycle_email_sent', { type: emailType }) : tc('admin.lifecycle_email_failed', { error: d.error || res.statusText }))
      setTimeout(() => setActionMsg(''), 4000)
    } catch (err: any) {
      setActionMsg(tc('admin.error_prefix', { error: err?.message || tc('admin.network_error') }))
      setTimeout(() => setActionMsg(''), 4000)
    } finally {
      setSendingEmailFor(null)
    }
  }

  if (!authorized) return null

  const fu = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()))
  const mrr = stripeData?.mrr ?? stats?.mrr ?? 0
  const arr = stripeData?.arr ?? mrr * 12
  const payingCount = stripeData?.activeSubscriptions ?? stats?.payingUsers ?? 0
  const conv = stats?.totalUsers > 0 ? ((payingCount / stats.totalUsers) * 100).toFixed(1) : '0'
  const xPosted = xActivity.filter(x => x.status === 'posted').length
  const xPending = xActivity.filter(x => x.status === 'pending').length
  // Content tab removed — blog review lives at /admin/agent (Alice Watson)
  const counts = signups.map(s => s.count as number)
  const maxS = counts.length > 0 ? Math.max(...counts, 1) : 1

  // ── Overview drill-down data (all client-side, no extra fetch) ──
  const nowD = new Date()
  const sinceDays = (n: number) => { const d = new Date(nowD); d.setDate(d.getDate() - n); return d }
  const fmtDate = (d: any) => d ? new Date(d).toLocaleDateString('en-GB') : '—'
  const totalUsers = stats?.totalUsers || 0
  const paidUsers = users.filter(u => u.plan_id && u.plan_id !== 'free')
  const freeUsersList = users.filter(u => !u.plan_id || u.plan_id === 'free')
  const newWeekUsers = users.filter(u => u.created_at && new Date(u.created_at) >= sinceDays(7)).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
  const newMonthUsers = users.filter(u => u.created_at && new Date(u.created_at) >= sinceDays(30)).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
  const flaggedUsers = users.filter(u => u.is_suspicious)
  const subs: any[] = stripeData?.subscriptions || []
  // Stripe prices without a nickname come through as a raw price id (price_…) — show a friendly label instead.
  const prettyPlan = (p: string) => (!p || /^price_/i.test(p)) ? 'Subscription' : p.charAt(0).toUpperCase() + p.slice(1)
  const mrrByPlan: Record<string, { count: number; monthly: number }> = {}
  subs.forEach(s => {
    const p = prettyPlan(s.plan)
    const monthly = s.interval === 'year' ? (s.amount || 0) / 12 : (s.amount || 0)
    if (!mrrByPlan[p]) mrrByPlan[p] = { count: 0, monthly: 0 }
    mrrByPlan[p].count++; mrrByPlan[p].monthly += monthly
  })
  const mrrByPlanArr = Object.entries(mrrByPlan).sort((a, b) => b[1].monthly - a[1].monthly)

  // Revenue / Activity / Growth drill-down data
  const recentPayments: any[] = stripeData?.recentPayments || []
  const monthStart = new Date(nowD.getFullYear(), nowD.getMonth(), 1)
  const monthPayments = recentPayments.filter(p => p.created && new Date(p.created) >= monthStart)
  const totalQuestions = users.reduce((s, u) => s + (u.questions_used || 0), 0)
  const avgQuestions = users.length > 0 ? totalQuestions / users.length : 0
  const topAskers = users.filter(u => (u.questions_used || 0) > 0).sort((a, b) => (b.questions_used || 0) - (a.questions_used || 0))
  const powerUsersList = users.filter(u => (u.questions_used || 0) >= 5).sort((a, b) => (b.questions_used || 0) - (a.questions_used || 0))
  const qBuckets = [
    { label: '0 questions', n: users.filter(u => !((u.questions_used || 0) > 0)).length, color: '#64748b' },
    { label: '1–4', n: users.filter(u => u.questions_used >= 1 && u.questions_used <= 4).length, color: '#2563eb' },
    { label: '5–9', n: users.filter(u => u.questions_used >= 5 && u.questions_used <= 9).length, color: '#7c3aed' },
    { label: '10+', n: users.filter(u => u.questions_used >= 10).length, color: '#b45309' },
  ]
  const byCountry: [string, number][] = (Object.entries(users.reduce((acc: any, u) => { const c = u.registration_country || 'Unknown'; acc[c] = (acc[c] || 0) + 1; return acc }, {})) as [string, number][]).sort((a, b) => b[1] - a[1])
  const byPlanAll = ['free', 'growth', 'business', 'enterprise'].map(p => ({ plan: p, n: users.filter(u => (u.plan_id || 'free') === p).length }))

  const overviewMetrics = [
    { key: 'mrr', label: tc('admin.kv_mrr'), value: '£' + mrr, sub: tc('admin.kv_mrr_sub'), color: '#b45309' },
    { key: 'arr', label: tc('admin.kv_arr'), value: '£' + arr, sub: tc('admin.kv_arr_sub'), color: '#7c3aed' },
    { key: 'paying', label: tc('admin.kv_paying_users'), value: payingCount, sub: tc('admin.kv_paying_users_sub'), color: '#047857' },
    { key: 'free', label: tc('admin.kv_free_users'), value: stats?.freeUsers, sub: tc('admin.kv_free_users_sub'), color: '#64748b' },
    { key: 'conversion', label: tc('admin.kv_conversion'), value: conv + '%', sub: tc('admin.kv_conversion_sub'), color: '#6366F1' },
    { key: 'newWeek', label: tc('admin.kv_new_this_week'), value: stats?.newThisWeek, sub: tc('admin.kv_new_this_week_sub'), color: '#2563eb' },
    { key: 'newMonth', label: tc('admin.kv_new_this_month'), value: stats?.newThisMonth, sub: tc('admin.kv_new_this_month_sub'), color: '#059669' },
    { key: 'flagged', label: tc('admin.kv_flagged'), value: stats?.suspiciousCount, sub: tc('admin.kv_flagged_sub'), color: '#dc2626' },
  ]

  const closeDetail = () => setExpanded(null)
  const signupWindow = (list: any[], title: string, days: number, accent: string) => {
    const dayBars = signups.slice(-days)
    const dmax = Math.max(...dayBars.map(x => x.count as number), 1)
    return (
      <DetailShell title={title} subtitle={list.length + ' new ' + (list.length === 1 ? 'signup' : 'signups') + ' in the last ' + days + ' days'} accent={accent} onClose={closeDetail}>
        <SectionLabel>Daily signups</SectionLabel>
        <div style={{display:'flex',alignItems:'flex-end',gap:3,height:70,marginBottom:2}}>
          {dayBars.map((s, i) => (
            <div key={i} title={s.date + ': ' + s.count} style={{flex:1,display:'flex',alignItems:'flex-end',height:'100%'}}>
              <div style={{width:'100%',background:s.count > 0 ? accent : 'var(--ev)',borderRadius:'3px 3px 0 0',height:(s.count / dmax * 64) + 'px',minHeight:s.count > 0 ? 3 : 0,opacity:s.count > 0 ? 0.85 : 0.3}} />
            </div>
          ))}
        </div>
        <SectionLabel>New accounts</SectionLabel>
        {list.length > 0 ? list.slice(0, 25).map(u => (
          <PersonRow key={u.id} name={u.full_name || u.email} sub={u.email + (u.registration_country ? ' · ' + u.registration_country : '')}
            right={<span style={{display:'flex',alignItems:'center',gap:8}}><Chip text={u.plan_id || 'free'} color={PLAN_COLORS[u.plan_id] || '#64748b'} /><span style={{fontSize:16,color:'var(--tx3)',whiteSpace:'nowrap'}}>{fmtDate(u.created_at)}</span></span>} />
        )) : <EmptyNote text="No new signups in this window." />}
        <MoreNote n={list.length - 25} />
      </DetailShell>
    )
  }

  const renderDetail = () => {
    switch (expanded) {
      case 'mrr':
        return (
          <DetailShell title="Monthly Recurring Revenue" subtitle="Normalised monthly value of active subscriptions" accent="#b45309" onClose={closeDetail}>
            <ChipStats items={[
              { label: 'MRR', value: '£' + mrr },
              { label: 'This month', value: '£' + (stripeData?.monthRevenue ?? 0) },
              { label: 'All-time', value: '£' + (stripeData?.totalRevenue ?? 0) },
              { label: 'Active subs', value: stripeData?.activeSubscriptions ?? subs.length },
            ]} />
            {mrrByPlanArr.length > 0 ? <>
              <SectionLabel>MRR by plan</SectionLabel>
              {mrrByPlanArr.map(([plan, d]) => (
                <Bar key={plan} label={plan} pct={mrr > 0 ? d.monthly / mrr * 100 : 0} color={PLAN_COLORS[plan.toLowerCase()] || '#b45309'} right={'£' + Math.round(d.monthly) + ' · ' + d.count + ' sub' + (d.count !== 1 ? 's' : '')} />
              ))}
              <SectionLabel>Active subscriptions</SectionLabel>
              {subs.slice(0, 20).map(s => (
                <PersonRow key={s.id} name={s.customerName || s.customerEmail || '—'} sub={(s.customerEmail || '') + ' · renews ' + fmtDate(s.currentPeriodEnd)}
                  right={<span style={{display:'flex',alignItems:'center',gap:8}}><Chip text={s.plan} color="#6366F1" /><span style={{fontWeight:700,fontSize:17}}>£{s.amount}</span></span>} />
              ))}
              <MoreNote n={subs.length - 20} />
            </> : <EmptyNote text="No Stripe subscription data available — MRR is estimated from plan assignments." />}
          </DetailShell>
        )
      case 'arr':
        return (
          <DetailShell title="Annual Run Rate" subtitle="Current MRR projected over 12 months" accent="#7c3aed" onClose={closeDetail}>
            <div style={{display:'flex',alignItems:'baseline',gap:10,flexWrap:'wrap',padding:'4px 0 6px'}}>
              <span style={{fontSize:30,fontWeight:700,fontFamily:'var(--font-sora)'}}>£{mrr}</span>
              <span style={{color:'var(--tx3)',fontSize:17}}>MRR × 12 months =</span>
              <span style={{fontSize:30,fontWeight:700,fontFamily:'var(--font-sora)',color:'#7c3aed'}}>£{arr}</span>
            </div>
            {mrrByPlanArr.length > 0 && <>
              <SectionLabel>Annualised by plan</SectionLabel>
              {mrrByPlanArr.map(([plan, d]) => (
                <Bar key={plan} label={plan} pct={arr > 0 ? d.monthly * 12 / arr * 100 : 0} color={PLAN_COLORS[plan.toLowerCase()] || '#7c3aed'} right={'£' + Math.round(d.monthly * 12) + '/yr'} />
              ))}
            </>}
          </DetailShell>
        )
      case 'paying':
        return (
          <DetailShell title="Paying Users" subtitle={payingCount + ' active paid ' + (payingCount === 1 ? 'subscription' : 'subscriptions')} accent="#047857" onClose={closeDetail}>
            <SectionLabel>By plan</SectionLabel>
            {['growth', 'business', 'enterprise'].map(plan => {
              const c = paidUsers.filter(u => u.plan_id === plan).length
              return <Bar key={plan} label={plan} pct={paidUsers.length > 0 ? c / paidUsers.length * 100 : 0} color={PLAN_COLORS[plan]} right={String(c)} />
            })}
            <SectionLabel>Subscribers</SectionLabel>
            {paidUsers.length > 0 ? paidUsers.slice(0, 25).map(u => (
              <PersonRow key={u.id} name={u.full_name || u.email} sub={u.email + (u.registration_country ? ' · ' + u.registration_country : '')} right={<Chip text={u.plan_id} color={PLAN_COLORS[u.plan_id] || '#047857'} />} />
            )) : <EmptyNote text="No paying users yet." />}
            <MoreNote n={paidUsers.length - 25} />
          </DetailShell>
        )
      case 'free':
        return (
          <DetailShell title="Free Users" subtitle={freeUsersList.length + ' on the free plan'} accent="#64748b" onClose={closeDetail}>
            <ChipStats items={[
              { label: 'Free users', value: freeUsersList.length },
              { label: '% of total', value: (totalUsers > 0 ? Math.round(freeUsersList.length / totalUsers * 100) : 0) + '%' },
              { label: 'Upgrade-ready', value: candidates.length },
            ]} />
            <SectionLabel>Upgrade candidates (near free limit)</SectionLabel>
            {candidates.length > 0 ? candidates.slice(0, 20).map(c => (
              <PersonRow key={c.id} name={c.full_name || '—'} sub={c.email} right={<span style={{fontSize:16,fontWeight:700,color:'#b45309'}}>{c.questions_used}/10</span>} />
            )) : <EmptyNote text="No free users are near the usage limit yet." />}
            <MoreNote n={candidates.length - 20} />
          </DetailShell>
        )
      case 'conversion':
        return (
          <DetailShell title="Free → Paid Conversion" subtitle={conv + '% of users are on a paid plan'} accent="#6366F1" onClose={closeDetail}>
            <SectionLabel>Funnel</SectionLabel>
            <Bar label="Total users" pct={100} color="#64748b" right={String(totalUsers)} />
            <Bar label="Free" pct={totalUsers > 0 ? freeUsersList.length / totalUsers * 100 : 0} color="#64748b" right={String(freeUsersList.length)} />
            <Bar label="Paying" pct={totalUsers > 0 ? payingCount / totalUsers * 100 : 0} color="#047857" right={payingCount + ' (' + conv + '%)'} />
            <SectionLabel>Ready to convert</SectionLabel>
            {candidates.length > 0 ? candidates.slice(0, 15).map(c => (
              <PersonRow key={c.id} name={c.full_name || '—'} sub={c.email} right={<span style={{fontSize:16,fontWeight:700,color:'#b45309'}}>{c.questions_used}/10</span>} />
            )) : <EmptyNote text="No upgrade candidates right now." />}
            <MoreNote n={candidates.length - 15} />
          </DetailShell>
        )
      case 'newWeek':
        return signupWindow(newWeekUsers, 'New This Week', 7, '#2563eb')
      case 'newMonth':
        return signupWindow(newMonthUsers, 'New This Month', 30, '#059669')
      case 'flagged':
        return (
          <DetailShell title="Flagged Accounts" subtitle={flaggedUsers.length + ' account' + (flaggedUsers.length !== 1 ? 's' : '') + ' marked suspicious'} accent="#dc2626" onClose={closeDetail}>
            {flaggedUsers.length > 0 ? flaggedUsers.slice(0, 30).map(u => (
              <PersonRow key={u.id} name={(u.full_name || u.email) + ' ⚠️'} sub={u.email + ' · ' + (u.questions_used || 0) + ' questions · joined ' + fmtDate(u.created_at)} right={<Chip text={u.plan_id || 'free'} color={PLAN_COLORS[u.plan_id] || '#64748b'} />} />
            )) : <EmptyNote text="No flagged accounts — all clear." />}
            <MoreNote n={flaggedUsers.length - 30} />
          </DetailShell>
        )
      case 'subs':
        return (
          <DetailShell title="Active Subscriptions" subtitle={(stripeData?.activeSubscriptions ?? subs.length) + ' paying ' + ((stripeData?.activeSubscriptions ?? subs.length) === 1 ? 'subscription' : 'subscriptions')} accent="#047857" onClose={closeDetail}>
            {mrrByPlanArr.length > 0 && <>
              <SectionLabel>By plan</SectionLabel>
              {mrrByPlanArr.map(([plan, d]) => (
                <Bar key={plan} label={plan} pct={subs.length > 0 ? d.count / subs.length * 100 : 0} color={PLAN_COLORS[plan.toLowerCase()] || '#047857'} right={d.count + ' · £' + Math.round(d.monthly) + '/mo'} />
              ))}
            </>}
            <SectionLabel>Subscriptions</SectionLabel>
            {subs.length > 0 ? subs.slice(0, 25).map(s => (
              <PersonRow key={s.id} name={s.customerName || s.customerEmail || '—'} sub={(s.customerEmail || '') + ' · ' + s.interval + 'ly · renews ' + fmtDate(s.currentPeriodEnd)}
                right={<span style={{display:'flex',alignItems:'center',gap:8}}><Chip text={s.plan} color="#6366F1" /><span style={{fontWeight:700,fontSize:17}}>£{s.amount}</span></span>} />
            )) : <EmptyNote text="No active subscriptions." />}
            <MoreNote n={subs.length - 25} />
          </DetailShell>
        )
      case 'monthRev':
        return (
          <DetailShell title="Revenue This Month" subtitle={monthPayments.length + ' payment' + (monthPayments.length !== 1 ? 's' : '') + ' since ' + fmtDate(monthStart)} accent="#2563eb" onClose={closeDetail}>
            <ChipStats items={[
              { label: 'This month', value: '£' + (stripeData?.monthRevenue ?? 0) },
              { label: 'Payments', value: monthPayments.length },
            ]} />
            <SectionLabel>Payments this month</SectionLabel>
            {monthPayments.length > 0 ? monthPayments.slice(0, 25).map(p => (
              <PersonRow key={p.id} name={<span>£{p.amount} <span style={{fontSize:15,fontWeight:500,color:p.status === 'succeeded' ? '#047857' : '#dc2626'}}>{p.status}</span></span>} sub={p.email + (p.description ? ' · ' + p.description : '')} right={<span style={{fontSize:16,color:'var(--tx3)',whiteSpace:'nowrap'}}>{fmtDate(p.created)}</span>} />
            )) : <EmptyNote text="No payments recorded this month yet." />}
            <MoreNote n={monthPayments.length - 25} />
          </DetailShell>
        )
      case 'totalRev':
        return (
          <DetailShell title="Total Revenue" subtitle="All-time gross payments" accent="#059669" onClose={closeDetail}>
            <ChipStats items={[
              { label: 'All-time', value: '£' + (stripeData?.totalRevenue ?? 0) },
              { label: 'This month', value: '£' + (stripeData?.monthRevenue ?? 0) },
              { label: 'MRR', value: '£' + mrr },
            ]} />
            <SectionLabel>Recent payments</SectionLabel>
            {recentPayments.length > 0 ? recentPayments.slice(0, 25).map(p => (
              <PersonRow key={p.id} name={<span>£{p.amount} <span style={{fontSize:15,fontWeight:500,color:p.status === 'succeeded' ? '#047857' : '#dc2626'}}>{p.status}</span></span>} sub={p.email + (p.description ? ' · ' + p.description : '')} right={<span style={{fontSize:16,color:'var(--tx3)',whiteSpace:'nowrap'}}>{fmtDate(p.created)}</span>} />
            )) : <EmptyNote text="No payment history available." />}
            <MoreNote n={recentPayments.length - 25} />
          </DetailShell>
        )
      case 'questions':
        return (
          <DetailShell title="Total Questions Asked" subtitle={totalQuestions + ' questions across ' + users.length + ' users'} accent="#047857" onClose={closeDetail}>
            <ChipStats items={[
              { label: 'Total', value: totalQuestions },
              { label: 'Avg / user', value: avgQuestions.toFixed(1) },
              { label: 'Active askers', value: topAskers.length },
            ]} />
            <SectionLabel>Top askers</SectionLabel>
            {topAskers.length > 0 ? topAskers.slice(0, 25).map(u => (
              <PersonRow key={u.id} name={u.full_name || u.email} sub={u.email} right={<span style={{display:'flex',alignItems:'center',gap:8}}><Chip text={u.plan_id || 'free'} color={PLAN_COLORS[u.plan_id] || '#64748b'} /><span style={{fontWeight:700,fontSize:17}}>{u.questions_used}</span></span>} />
            )) : <EmptyNote text="No questions asked yet." />}
            <MoreNote n={topAskers.length - 25} />
          </DetailShell>
        )
      case 'avgQuestions':
        return (
          <DetailShell title="Questions per User" subtitle={'Average ' + avgQuestions.toFixed(1) + ' questions per user'} accent="#b45309" onClose={closeDetail}>
            <SectionLabel>Usage distribution</SectionLabel>
            {qBuckets.map(b => (
              <Bar key={b.label} label={b.label} pct={users.length > 0 ? b.n / users.length * 100 : 0} color={b.color} right={b.n + ' user' + (b.n !== 1 ? 's' : '')} />
            ))}
          </DetailShell>
        )
      case 'powerUsers':
        return (
          <DetailShell title="Power Users" subtitle={powerUsersList.length + ' user' + (powerUsersList.length !== 1 ? 's' : '') + ' with 5+ questions'} accent="#7c3aed" onClose={closeDetail}>
            {powerUsersList.length > 0 ? powerUsersList.slice(0, 30).map(u => (
              <PersonRow key={u.id} name={u.full_name || u.email} sub={u.email + (u.registration_country ? ' · ' + u.registration_country : '')} right={<span style={{display:'flex',alignItems:'center',gap:8}}><Chip text={u.plan_id || 'free'} color={PLAN_COLORS[u.plan_id] || '#64748b'} /><span style={{fontWeight:700,fontSize:17}}>{u.questions_used}</span></span>} />
            )) : <EmptyNote text="No power users yet." />}
            <MoreNote n={powerUsersList.length - 30} />
          </DetailShell>
        )
      case 'totalUsers':
        return (
          <DetailShell title="Total Users" subtitle={totalUsers + ' registered ' + (totalUsers === 1 ? 'user' : 'users')} accent="#64748b" onClose={closeDetail}>
            <SectionLabel>By plan</SectionLabel>
            {byPlanAll.map(({ plan, n }) => (
              <Bar key={plan} label={plan} pct={users.length > 0 ? n / users.length * 100 : 0} color={PLAN_COLORS[plan]} right={String(n)} />
            ))}
            <SectionLabel>By country</SectionLabel>
            {byCountry.slice(0, 12).map(([c, n]) => (
              <Bar key={c} label={c} pct={users.length > 0 ? n / users.length * 100 : 0} color="#6366F1" right={String(n)} />
            ))}
          </DetailShell>
        )
      default:
        return null
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',fontFamily:'var(--font-dm,DM Sans,sans-serif)'}}>
      <style>{`
        .kv-clickable:hover { border-color: var(--tx3); box-shadow: 0 4px 14px rgba(0,0,0,.07); transform: translateY(-1px); }
        .kv-clickable:focus-visible { outline: 2px solid #6366F1; outline-offset: 2px; }
        .ov-detail { animation: fadeUp .22s ease-out; }
        @media (prefers-reduced-motion: reduce) { .kv-clickable:hover { transform: none; } .ov-detail { animation: none; } }
      `}</style>
      {actionMsg && <div style={{position:'fixed',top:16,right:16,zIndex:999,padding:'10px 16px',borderRadius:10,background:'rgba(34,197,94,.15)',border:'1px solid rgba(34,197,94,.3)',color:'#16a34a',fontSize:17,fontWeight:500}}>✓ {actionMsg}</div>}
      <div style={{padding:'20px 24px',borderBottom:'1px solid var(--b)',background:'var(--sf)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:'var(--font-sora)',fontSize:24,fontWeight:700,margin:0}}>🔐 {tc('admin.title')}</h1>
          <p style={{fontSize:16,color:'var(--tx3)',margin:'2px 0 0'}}>{tc('admin.subtitle')}</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <a href="/admin/agent" style={{padding:'7px 14px',borderRadius:9999,border:'1px solid #6366F1',background:'rgba(99,102,241,.08)',color:'#6366F1',fontSize:16,fontWeight:600,textDecoration:'none'}}>⚡ {tc('admin.growth_agent')}</a>
          <button onClick={loadAll} style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',fontSize:16,cursor:'pointer',fontFamily:'inherit'}}>↻ {tc('admin.refresh')}</button>
        </div>
      </div>
      <div className="tab-strip" style={{borderBottom:'1px solid var(--b)',background:'var(--sf)',padding:'0 24px'}}>
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setExpanded(null) }} style={{padding:'12px 16px',border:'none',background:'transparent',fontSize:17,fontWeight:tab===t?600:400,color:tab===t?'#6366F1':'var(--tx3)',borderBottom:tab===t?'2px solid #6366F1':'2px solid transparent',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>
            {tc('admin.' + TAB_KEYS[t])}{t==='Users'?' (' + users.length + ')':''}
          </button>
        ))}
      </div>
      <div style={{padding:'24px',maxWidth:1160,margin:'0 auto'}}>
        {loading ? <div style={{textAlign:'center',padding:60,color:'var(--tx3)'}}>{tc('admin.loading')}</div> : <>

          {tab==='Overview' && <>
            <div style={{fontSize:16.5,color:'var(--tx3)',marginBottom:14,display:'flex',alignItems:'center',gap:7}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>
              {tc('admin.tap_card_hint') !== 'admin.tap_card_hint' ? tc('admin.tap_card_hint') : 'Tap any metric to expand a detailed breakdown.'}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(198px,1fr))',gap:14,marginBottom:28}}>
              {overviewMetrics.map(m => (
                <KV key={m.key} label={m.label} value={m.value} sub={m.sub} color={m.color}
                  active={expanded === m.key} onClick={() => setExpanded(expanded === m.key ? null : m.key)} />
              ))}
            </div>
            {expanded && renderDetail()}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{padding:22,borderRadius:16,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:17,fontWeight:700,letterSpacing:'-.01em',marginBottom:16}}>{tc('admin.plan_distribution')}</div>
                {['free','growth','business','enterprise'].map(plan => {
                  const count = users.filter(u => u.plan_id === plan).length
                  const pct = stats?.totalUsers > 0 ? Math.round(count/stats.totalUsers*100) : 0
                  return <Bar key={plan} label={plan} pct={pct} color={PLAN_COLORS[plan]} right={count + ' (' + pct + '%)'} />
                })}
              </div>
              <div style={{padding:22,borderRadius:16,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:17,fontWeight:700,letterSpacing:'-.01em',marginBottom:16}}>{tc('admin.quick_stats')}</div>
                {[
                  {label:tc('admin.kv_total_users'),value:stats?.totalUsers??0,color:'var(--tx)'},
                  {label:tc('admin.kv_paying_users'),value:payingCount,color:'#047857'},
                  {label:tc('admin.kv_new_this_week'),value:stats?.newThisWeek??0,color:'#2563eb'},
                  {label:tc('admin.upgrade_candidates_label'),value:candidates.length,color:'#b45309'},
                ].map(({label,value,color}) => (
                  <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:'1px solid var(--b)',fontSize:17}}>
                    <span style={{color:'var(--tx2)'}}>{label}</span>
                    <span style={{fontWeight:700,fontFamily:'var(--font-sora)',color}}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {tab==='Revenue' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14,marginBottom:28}}>
              <KV label={tc('admin.kv_mrr')} value={"£"+mrr} sub={tc('admin.kv_mrr_stripe_sub')} color="#b45309" active={expanded==='mrr'} onClick={()=>setExpanded(expanded==='mrr'?null:'mrr')} />
              <KV label={tc('admin.kv_arr')} value={"£"+arr} sub={tc('admin.kv_arr_annualised_sub')} color="#7c3aed" active={expanded==='arr'} onClick={()=>setExpanded(expanded==='arr'?null:'arr')} />
              <KV label={tc('admin.kv_active_subs')} value={stripeData?.activeSubscriptions??0} sub={tc('admin.kv_active_subs_sub')} color="#047857" active={expanded==='subs'} onClick={()=>setExpanded(expanded==='subs'?null:'subs')} />
              <KV label={tc('admin.kv_conversion')} value={conv+"%"} sub={tc('admin.kv_conversion_sub')} color="#6366F1" active={expanded==='conversion'} onClick={()=>setExpanded(expanded==='conversion'?null:'conversion')} />
              <KV label={tc('admin.kv_this_month')} value={"£"+(stripeData?.monthRevenue??0)} sub={tc('admin.kv_this_month_sub')} color="#2563eb" active={expanded==='monthRev'} onClick={()=>setExpanded(expanded==='monthRev'?null:'monthRev')} />
              <KV label={tc('admin.kv_total_revenue')} value={"£"+(stripeData?.totalRevenue??0)} sub={tc('admin.kv_total_revenue_sub')} color="#059669" active={expanded==='totalRev'} onClick={()=>setExpanded(expanded==='totalRev'?null:'totalRev')} />
            </div>
            {expanded && renderDetail()}

            {stripeData?.subscriptions?.length > 0 && <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:600,marginBottom:12}}>{tc('admin.active_subscriptions')}</div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:16}}>
                  <thead>
                    <tr style={{background:'var(--ev)'}}>
                      {[tc('admin.th_customer'),tc('admin.th_email'),tc('admin.th_plan'),tc('admin.th_amount'),tc('admin.th_interval'),tc('admin.th_renews'),tc('admin.th_since')].map(h=>(
                        <th key={h} style={{padding:'8px 12px',textAlign:'left',fontWeight:600,color:'var(--tx2)'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stripeData.subscriptions.map((s:any)=>(
                      <tr key={s.id} style={{borderTop:'1px solid var(--b)'}}>
                        <td style={{padding:'8px 12px',fontWeight:500}}>{s.customerName||tc('admin.empty_dash')}</td>
                        <td style={{padding:'8px 12px',color:'var(--tx2)'}}>{s.customerEmail}</td>
                        <td style={{padding:'8px 12px'}}><span style={{padding:'2px 8px',borderRadius:9999,fontSize:15,fontWeight:600,background:'rgba(99,102,241,.1)',color:'#6366F1'}}>{s.plan}</span></td>
                        <td style={{padding:'8px 12px',fontWeight:600}}>£{s.amount}</td>
                        <td style={{padding:'8px 12px',color:'var(--tx3)',textTransform:'capitalize'}}>{s.interval}ly</td>
                        <td style={{padding:'8px 12px',color:'var(--tx3)'}}>{new Date(s.currentPeriodEnd).toLocaleDateString('en-GB')}</td>
                        <td style={{padding:'8px 12px',color:'var(--tx3)'}}>{new Date(s.created).toLocaleDateString('en-GB')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>}

            {stripeData?.recentPayments?.length > 0 && <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:600,marginBottom:12}}>{tc('admin.recent_payments')}</div>
              {stripeData.recentPayments.map((p:any)=>(
                <div key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:17}}>£{p.amount} <span style={{fontSize:15,color:p.status==='succeeded'?'#047857':'#dc2626',fontWeight:500}}>{p.status}</span></div>
                    <div style={{fontSize:16,color:'var(--tx3)'}}>{p.email}{p.description?' · '+p.description:''}</div>
                  </div>
                  <div style={{fontSize:15,color:'var(--tx3)'}}>{new Date(p.created).toLocaleDateString('en-GB')}</div>
                </div>
              ))}
            </div>}

            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
              <div style={{fontSize:17,fontWeight:600,marginBottom:8}}>{tc('admin.upgrade_candidates_title', { count: candidates.length })}</div>
              <p style={{fontSize:16,color:'var(--tx3)',marginBottom:16}}>{tc('admin.upgrade_candidates_desc')}</p>
              {candidates.length===0 ? <div style={{textAlign:'center',padding:20,color:'var(--tx3)'}}>{tc('admin.no_candidates')}</div> :
                candidates.map(c => (
                  <div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:17}}>{c.full_name||tc('admin.default_user')}</div>
                      <div style={{fontSize:16,color:'var(--tx3)'}}>{c.email} · {c.questions_used}/10</div>
                    </div>
                    <button onClick={() => changePlan(c.id,'growth')} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#b45309',color:'#fff',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('admin.give_growth')}</button>
                  </div>
                ))
              }
            </div>
          </>}

          {tab==='Users' && <>
            <div style={{marginBottom:16,display:'flex',gap:12,alignItems:'center'}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={tc('admin.search_placeholder')} style={{flex:1,minWidth:200,padding:'9px 14px',borderRadius:10,border:'1px solid var(--b)',background:'var(--ev)',fontFamily:'inherit',fontSize:17,outline:'none'}} />
              <span style={{fontSize:16,color:'var(--tx3)'}}>{tc('admin.results_count', { shown: fu.length, total: users.length })}</span>
            </div>
            <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:16}}>
                  <thead>
                    <tr style={{background:'var(--ev)'}}>
                      {[tc('admin.th_name'),tc('admin.th_email'),tc('admin.th_plan'),tc('admin.th_type'),tc('admin.th_country'),tc('admin.th_questions'),'POS Sales','POS Revenue','POS Seats',tc('admin.th_joined'),tc('admin.th_actions')].map(h => (
                        <th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:600,whiteSpace:'nowrap',color:'var(--tx2)'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fu.map((u,i) => (
                      <tr key={u.id} style={{borderTop:'1px solid var(--b)',background:u.is_suspicious?'rgba(248,113,113,.04)':i%2===0?'var(--sf)':'var(--bg)'}}>
                        <td style={{padding:'9px 12px',fontWeight:500}}>{u.full_name||tc('admin.empty_dash')}{u.is_suspicious?' ⚠️':''}</td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)'}}>{u.email}</td>
                        <td style={{padding:'9px 12px'}}>
                          <span style={{padding:'2px 8px',borderRadius:9999,fontSize:15,fontWeight:600,background:(PLAN_COLORS[u.plan_id]||'#64748b')+'20',color:PLAN_COLORS[u.plan_id]||'#64748b'}}>{u.plan_id}</span>
                          {PAYMENT_BADGE[u.plan_payment_status as string]}
                        </td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)',textTransform:'capitalize'}}>{u.business_type||tc('admin.empty_dash')}</td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)'}}>{u.registration_country||tc('admin.empty_dash')}</td>
                        <td style={{padding:'9px 12px'}}>{u.questions_used||0}</td>
                        <td style={{padding:'9px 12px'}}>{u.pos_tx_count > 0 ? <span style={{padding:'2px 8px',borderRadius:9999,fontSize:15,fontWeight:600,background:'#0891b220',color:'#0891b2'}}>{u.pos_tx_count}</span> : <span style={{color:'var(--tx3)'}}>—</span>}</td>
                        <td style={{padding:'9px 12px',fontWeight:u.pos_revenue>0?600:'normal',color:u.pos_revenue>0?'var(--tx)':'var(--tx3)'}}>{u.pos_revenue>0 ? (u.pos_revenue>=1000 ? (u.pos_revenue/1000).toFixed(1)+'K' : u.pos_revenue.toFixed(0)) : '—'}</td>
                        <td style={{padding:'9px 12px'}}>{u.pos_enabled ? <><span style={{padding:'2px 8px',borderRadius:9999,fontSize:15,fontWeight:600,background:'#16a34a20',color:'#16a34a'}}>{u.pos_seat_count||0} seat{u.pos_seat_count===1?'':'s'}</span>{PAYMENT_BADGE[u.pos_payment_status as string]}</> : <span style={{color:'var(--tx3)'}}>—</span>}</td>
                        <td style={{padding:'9px 12px',color:'var(--tx3)'}}>{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                        <td style={{padding:'9px 12px'}}>
                          <select onChange={e=>changePlan(u.id,e.target.value)} value={u.plan_id} style={{padding:'3px 6px',borderRadius:6,border:'1px solid var(--b)',background:'var(--ev)',fontFamily:'inherit',fontSize:15,cursor:'pointer'}}>
                            {['free','growth','business','enterprise'].map(p=><option key={p} value={p}>{p}</option>)}
                          </select>
                          <select
                            value=""
                            disabled={sendingEmailFor===u.id}
                            onChange={e=>{ if(e.target.value) sendLifecycleEmail(u.id, e.target.value); e.target.value='' }}
                            style={{padding:'3px 6px',borderRadius:6,border:'1px solid var(--b)',background:'var(--ev)',fontFamily:'inherit',fontSize:15,cursor:'pointer',marginLeft:6}}
                          >
                            <option value="" disabled>{sendingEmailFor===u.id?tc('admin.sending'):tc('admin.send_email')}</option>
                            <option value="welcome">Welcome</option>
                            <option value="re_engagement_7">Re-engagement (7d)</option>
                            <option value="re_engagement_14">Re-engagement (14d)</option>
                            <option value="re_engagement_30">Re-engagement (30d)</option>
                            <option value="plan_upgrade">Plan upgrade welcome</option>
                            <option value="pos_seats_welcome">POS seats welcome</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {tab==='Activity' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14,marginBottom:28}}>
              <KV label={tc('admin.kv_new_this_month')} value={stats?.newThisMonth} sub={tc('admin.kv_new_signups_sub')} color="#6366F1" active={expanded==='newMonth'} onClick={()=>setExpanded(expanded==='newMonth'?null:'newMonth')} />
              <KV label={tc('admin.kv_total_questions')} value={totalQuestions} sub={tc('admin.kv_total_questions_sub')} color="#047857" active={expanded==='questions'} onClick={()=>setExpanded(expanded==='questions'?null:'questions')} />
              <KV label={tc('admin.kv_avg_questions')} value={avgQuestions.toFixed(1)} sub={tc('admin.kv_avg_questions_sub')} color="#b45309" active={expanded==='avgQuestions'} onClick={()=>setExpanded(expanded==='avgQuestions'?null:'avgQuestions')} />
              <KV label={tc('admin.kv_power_users')} value={powerUsersList.length} sub={tc('admin.kv_power_users_sub')} color="#7c3aed" active={expanded==='powerUsers'} onClick={()=>setExpanded(expanded==='powerUsers'?null:'powerUsers')} />
            </div>
            {expanded && renderDetail()}
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:600,marginBottom:16}}>{tc('admin.daily_signups')}</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:4,height:100}}>
                {signups.map((s,i) => (
                  <div key={i} title={s.date+": "+s.count} style={{flex:1,display:'flex',alignItems:'flex-end',height:'100%'}}>
                    <div style={{width:'100%',background:s.count>0?'#6366F1':'var(--ev)',borderRadius:'3px 3px 0 0',height:(s.count/maxS*80)+"px",minHeight:s.count>0?3:0,opacity:0.8}} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:17,fontWeight:600,marginBottom:12}}>{tc('admin.by_country')}</div>
                {Object.entries(users.reduce((acc:any,u)=>{const c=u.registration_country||tc('admin.unknown');acc[c]=(acc[c]||0)+1;return acc},{})).sort((a:any,b:any)=>b[1]-a[1]).slice(0,8).map(([c,n]:any)=>(
                  <div key={c} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--b)',fontSize:16}}>
                    <span>{c}</span><span style={{fontWeight:600}}>{n}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:17,fontWeight:600,marginBottom:12}}>{tc('admin.by_business_type')}</div>
                {Object.entries(users.reduce((acc:any,u)=>{const t=u.business_type||tc('admin.unknown');acc[t]=(acc[t]||0)+1;return acc},{})).sort((a:any,b:any)=>b[1]-a[1]).map(([t,n]:any)=>(
                  <div key={t} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--b)',fontSize:16}}>
                    <span style={{textTransform:'capitalize'}}>{t}</span><span style={{fontWeight:600}}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* Content review moved to /admin/agent (Alice Watson) */}

          {tab==='Costs' && (() => {
            const total = apiUsage?.totalCostUsd || 0
            const dayOfMonth = new Date().getDate()
            const dailyAvg = total / dayOfMonth
            // Projection is unreliable in the first 5 days — show "—" to avoid
            // a 30× inflation on day 1 (e.g. $10 spend → "$300 projected").
            const monthlyProj = dayOfMonth >= 5 ? dailyAvg * 30 : null

            // Route → category
            const categorize = (r: string) => {
              if (r.startsWith('pos-app/')) return 'posapp'
              if (r.includes('scout')) return 'scouts'
              if (r.startsWith('pos/') || r.includes('/pos/')) return 'pos'
              if (r.includes('cron/')) return 'cron'
              if (r.includes('xagent') || r.startsWith('admin/')) return 'admin'
              return 'product'
            }
            const CAT: Record<string,{label:string;color:string;dot:string}> = {
              scouts:  {label:'Marketing scouts',  color:'#dc2626', dot:'#fca5a5'},
              product: {label:'Product features',  color:'#6366F1', dot:'#a5b4fc'},
              pos:     {label:'POS / scans',        color:'#0891b2', dot:'#67e8f9'},
              posapp:  {label:'POS App (pos.askbiz.co)', color:'#0e7490', dot:'#67e8f9'},
              cron:    {label:'Cron jobs',           color:'#7c3aed', dot:'#c4b5fd'},
              admin:   {label:'Admin / X agent',    color:'#64748b', dot:'#cbd5e1'},
            }
            const byRoute = apiUsage?.byRoute as Record<string,{calls:number;costUsd:number;model:string;inputTokens:number;outputTokens:number}> || {}
            const byModel = apiUsage?.byModel as Record<string,{calls:number;costUsd:number}> || {}
            const byDay = apiUsage?.byDay as Record<string,number> || {}

            // Build category groups sorted by total cost
            const grouped: Record<string,{route:string;d:{calls:number;costUsd:number;model:string}}[]> = {}
            Object.entries(byRoute).forEach(([route, d]) => {
              const cat = categorize(route)
              if (!grouped[cat]) grouped[cat] = []
              grouped[cat].push({route, d})
            })
            const catTotals = Object.entries(grouped).map(([cat, routes]) => ({cat, subtotal: routes.reduce((s,r)=>s+r.d.costUsd,0)})).sort((a,b)=>b.subtotal-a.subtotal)

            // 30-day sparkline
            const days30 = Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(29-i));return d.toISOString().slice(0,10)})
            const dayMax = Math.max(...days30.map(d=>byDay[d]||0), 0.0001)

            const isGroq = (m:string) => m.includes('llama') || m.includes('mixtral') || m.includes('whisper')
            const modelLabel = (m:string) => {
              if (m.includes('llama-4-scout')) return 'Llama 4 Scout'
              if (m.includes('llama-3.3') || m.includes('llama-3-3')) return 'Llama 3.3'
              if (m.includes('llama-3')) return 'Llama 3'
              if (m.includes('haiku')) return 'Haiku'
              if (m.includes('sonnet')) return 'Sonnet'
              if (m.includes('opus')) return 'Opus'
              return m.slice(0,10)
            }
            const modelColor = (m:string) => {
              if (isGroq(m)) return '#f97316'
              if (m.includes('haiku')) return '#0891b2'
              if (m.includes('sonnet')) return '#7c3aed'
              if (m.includes('opus')) return '#dc2626'
              return '#64748b'
            }
            const groqTotal = Object.entries(byModel).filter(([m])=>isGroq(m)).reduce((s,[,d])=>s+d.costUsd,0)
            const anthropicTotal = Object.entries(byModel).filter(([m])=>!isGroq(m)).reduce((s,[,d])=>s+d.costUsd,0)

            return <>
              {/* ── Summary KVs ── */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:10,marginBottom:16}}>
                {[
                  {label:'This month (USD)',  value:'$'+(total).toFixed(4)},
                  {label:'≈ GBP',             value:'£'+(total*0.79).toFixed(2)},
                  {label:'Daily average',     value:'$'+dailyAvg.toFixed(3)},
                  {label:'30-day projection', value: monthlyProj !== null ? '$'+monthlyProj.toFixed(2) : '—'},
                  {label:'Input tokens',      value:((apiUsage?.totalInputTokens||0)/1000).toFixed(1)+'k'},
                  {label:'Output tokens',     value:((apiUsage?.totalOutputTokens||0)/1000).toFixed(1)+'k'},
                ].map(({label,value})=>(
                  <div key={label} style={{padding:'10px 12px',borderRadius:9,background:'var(--sf)',border:'1px solid var(--b)'}}>
                    <div style={{fontSize:14,color:'var(--tx3)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
                    <div style={{fontSize:19,fontWeight:700,fontFamily:'var(--font-sora)'}}>{value}</div>
                  </div>
                ))}
              </div>

              {/* ── 30-day spend sparkline ── */}
              {Object.keys(byDay).length > 0 && (
                <div style={{padding:'16px 20px',borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
                  <div style={{fontSize:15,fontWeight:600,color:'var(--tx3)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.06em'}}>Spend — last 30 days</div>
                  <div style={{display:'flex',alignItems:'flex-end',gap:2,height:60}}>
                    {days30.map((d,i)=>{
                      const v = byDay[d]||0
                      const h = Math.max(v/dayMax*56,v>0?3:0)
                      return <div key={d} title={d+': $'+v.toFixed(4)} style={{flex:1,display:'flex',alignItems:'flex-end',height:'100%'}}>
                        <div style={{width:'100%',background:v>0?'#6366F1':'var(--ev)',borderRadius:'2px 2px 0 0',height:h+'px',opacity:v>0?0.8:0.2}}/>
                      </div>
                    })}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:14,color:'var(--tx3)',marginTop:4}}>
                    <span>{days30[0]}</span><span>today</span>
                  </div>
                </div>
              )}

              {/* ── Model breakdown ── */}
              {Object.keys(byModel).length > 0 && (
                <div style={{padding:'16px 20px',borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
                  <div style={{fontSize:15,fontWeight:600,color:'var(--tx3)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.06em'}}>By model</div>
                  {Object.entries(byModel).sort((a,b)=>b[1].costUsd-a[1].costUsd).map(([model,d])=>{
                    const pct = total > 0 ? (d.costUsd/total*100) : 0
                    const col = modelColor(model)
                    const groq = isGroq(model)
                    return <div key={model} style={{marginBottom:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:16,marginBottom:4}}>
                        <span style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{padding:'1px 5px',borderRadius:99,background:groq?'#f9731618':'#7c3aed18',color:groq?'#f97316':'#7c3aed',fontSize:14,fontWeight:700}}>{groq?'Groq':'Anthropic'}</span>
                          <span style={{padding:'1px 7px',borderRadius:99,background:col+'22',color:col,fontSize:15,fontWeight:600}}>{modelLabel(model)}</span>
                          <span style={{color:'var(--tx3)'}}>{d.calls} calls</span>
                        </span>
                        <span style={{fontWeight:600,color:'var(--tx)'}}>${d.costUsd.toFixed(4)} <span style={{color:'var(--tx3)',fontWeight:400}}>({Math.round(pct)}%)</span></span>
                      </div>
                      <div style={{height:5,borderRadius:99,background:'var(--ev)',overflow:'hidden'}}>
                        <div style={{height:'100%',width:pct+'%',background:col,borderRadius:99}}/>
                      </div>
                    </div>
                  })}
                </div>
              )}

              {/* ── By category + route breakdown ── */}
              {catTotals.length > 0 && (
                <div style={{padding:'16px 20px',borderRadius:14,border:'1px solid rgba(99,102,241,.3)',background:'rgba(99,102,241,.04)',marginBottom:16}}>
                  <div style={{fontSize:15,fontWeight:600,color:'#6366F1',marginBottom:12,textTransform:'uppercase',letterSpacing:'.06em'}}>Breakdown by route</div>
                  {catTotals.map(({cat,subtotal})=>{
                    const meta = CAT[cat as keyof typeof CAT] || CAT.product
                    const pct = total > 0 ? (subtotal/total*100) : 0
                    const routes = (grouped[cat]||[]).sort((a,b)=>b.d.costUsd-a.d.costUsd)
                    return <div key={cat} style={{marginBottom:16}}>
                      {/* Category header */}
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <span style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{width:8,height:8,borderRadius:'50%',background:meta.color,display:'inline-block'}}/>
                          <span style={{fontSize:16,fontWeight:600,color:meta.color}}>{meta.label}</span>
                        </span>
                        <span style={{fontSize:16,fontWeight:600,color:'var(--tx)'}}>${subtotal.toFixed(4)} <span style={{color:'var(--tx3)',fontWeight:400}}>({Math.round(pct)}%)</span></span>
                      </div>
                      {/* Category bar */}
                      <div style={{height:4,borderRadius:99,background:'var(--ev)',overflow:'hidden',marginBottom:8}}>
                        <div style={{height:'100%',width:pct+'%',background:meta.color,borderRadius:99}}/>
                      </div>
                      {/* Route rows */}
                      {routes.map(({route,d})=>{
                        const routePct = total > 0 ? (d.costUsd/total*100) : 0
                        const col = modelColor(d.model||'')
                        return <div key={route} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:8,padding:'7px 10px',borderRadius:8,background:'var(--sf)',border:'1px solid var(--b)',marginBottom:5,alignItems:'center'}}>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:3,flexWrap:'wrap'}}>
                              <span style={{fontSize:15,fontFamily:'monospace',color:'var(--tx2)'}}>{route}</span>
                              {d.model && <>
                                <span style={{padding:'0px 4px',borderRadius:99,background:isGroq(d.model)?'#f9731618':'#7c3aed18',color:isGroq(d.model)?'#f97316':'#7c3aed',fontSize:13,fontWeight:700,whiteSpace:'nowrap'}}>{isGroq(d.model)?'Groq':'Anthropic'}</span>
                                <span style={{padding:'0px 5px',borderRadius:99,background:col+'22',color:col,fontSize:14,fontWeight:600,whiteSpace:'nowrap'}}>{modelLabel(d.model)}</span>
                              </>}
                            </div>
                            <div style={{height:3,borderRadius:99,background:'var(--ev)',overflow:'hidden'}}>
                              <div style={{height:'100%',width:routePct+'%',background:meta.color,opacity:0.7,borderRadius:99}}/>
                            </div>
                          </div>
                          <div style={{textAlign:'right',whiteSpace:'nowrap'}}>
                            <div style={{fontSize:16,fontWeight:600,color:'var(--tx)'}}>${d.costUsd.toFixed(4)}</div>
                            <div style={{fontSize:14,color:'var(--tx3)'}}>{d.calls} calls</div>
                          </div>
                        </div>
                      })}
                    </div>
                  })}
                </div>
              )}
              {(!apiUsage || Object.keys(byRoute).length===0) && (
                <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16,fontSize:16,color:'var(--tx3)'}}>
                  No API calls logged yet. Usage appears here once routes with logUsage are called.
                </div>
              )}

              {/* ── Other monthly costs ── */}
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
                <div style={{fontSize:17,fontWeight:600,marginBottom:4}}>{tc('admin.other_monthly_costs')}</div>
                <p style={{fontSize:16,color:'var(--tx3)',marginBottom:16}}>{tc('admin.other_monthly_costs_desc')}</p>
                {[
                  {service:tc('admin.cost_tavily_service'),estimate:tc('admin.cost_tavily_estimate'),note:tc('admin.cost_tavily_note'),color:'#b45309'},
                  {service:tc('admin.cost_supabase_service'),estimate:tc('admin.cost_supabase_estimate'),note:tc('admin.cost_supabase_note'),color:'#047857'},
                  {service:tc('admin.cost_vercel_service'),estimate:tc('admin.cost_vercel_estimate'),note:tc('admin.cost_vercel_note'),color:'#64748b'},
                  {service:tc('admin.cost_resend_service'),estimate:tc('admin.cost_resend_estimate'),note:tc('admin.cost_resend_note'),color:'#2563eb'},
                ].map(({service,estimate,note,color})=>(
                  <div key={service} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:17,color}}>{service}</div>
                      <div style={{fontSize:15,color:'var(--tx3)',marginTop:2}}>{note}</div>
                    </div>
                    <div style={{fontSize:17,fontWeight:600,color:'var(--tx2)'}}>{estimate}</div>
                  </div>
                ))}
              </div>

              {/* ── Unit economics ── */}
              <div style={{padding:20,borderRadius:14,border:'1px solid rgba(99,102,241,.2)',background:'rgba(99,102,241,.04)'}}>
                <div style={{fontSize:17,fontWeight:600,color:'#6366F1',marginBottom:12}}>{tc('admin.unit_economics')}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  {[
                    {label:tc('admin.ue_revenue_per_user'),value:'£'+(mrr/(payingCount||1)).toFixed(2)+'/mo'},
                    {label:'Total AI cost (month)',value:total>0?('$'+total.toFixed(2)+'  (~$'+dailyAvg.toFixed(2)+'/day)'):'$0.00'},
                    {label:'Groq (llama) cost',value:groqTotal>0?'$'+groqTotal.toFixed(4):'$0.00'},
                    {label:'Anthropic (claude) cost',value:anthropicTotal>0?'$'+anthropicTotal.toFixed(4):'$0.00'},
                    {label:tc('admin.ue_gross_margin'),value:mrr>0?Math.max(0,Math.round((1-(total*0.79)/mrr)*100))+'%':'~85%'},
                    {label:tc('admin.ue_ltv'),value:'£'+((mrr/(payingCount||1))*12).toFixed(0)},
                  ].map(({label,value})=>(
                    <div key={label} style={{padding:'10px 12px',borderRadius:9,background:'var(--sf)',border:'1px solid var(--b)'}}>
                      <div style={{fontSize:15,color:'var(--tx3)',marginBottom:4}}>{label}</div>
                      <div style={{fontSize:19,fontWeight:700,fontFamily:'var(--font-sora)'}}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          })()}

          {tab==='Growth' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14,marginBottom:28}}>
              <KV label={tc('admin.kv_weekly_growth')} value={"+"+stats?.newThisWeek} sub={tc('admin.kv_weekly_growth_sub')} color="#047857" active={expanded==='newWeek'} onClick={()=>setExpanded(expanded==='newWeek'?null:'newWeek')} />
              <KV label={tc('admin.kv_monthly_growth')} value={"+"+stats?.newThisMonth} sub={tc('admin.kv_monthly_growth_sub')} color="#6366F1" active={expanded==='newMonth'} onClick={()=>setExpanded(expanded==='newMonth'?null:'newMonth')} />
              <KV label={tc('admin.kv_paying_ratio')} value={conv+"%"} sub={tc('admin.kv_paying_ratio_sub')} color="#b45309" active={expanded==='conversion'} onClick={()=>setExpanded(expanded==='conversion'?null:'conversion')} />
              <KV label={tc('admin.kv_total_users')} value={stats?.totalUsers} sub={tc('admin.kv_total_users_sub')} color="#64748b" active={expanded==='totalUsers'} onClick={()=>setExpanded(expanded==='totalUsers'?null:'totalUsers')} />
            </div>
            {expanded && renderDetail()}
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:17,fontWeight:600,marginBottom:16}}>{tc('admin.daily_signups')}</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:3,height:120}}>
                {signups.map((s,i)=>(
                  <div key={i} title={s.date+": "+s.count} style={{flex:1,display:'flex',alignItems:'flex-end',height:'100%'}}>
                    <div style={{width:'100%',background:s.count>0?'#6366F1':'var(--ev)',borderRadius:'3px 3px 0 0',height:(s.count/maxS*100)+"px",minHeight:s.count>0?3:0,opacity:s.count>0?0.85:0.3}} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
              <div style={{fontSize:17,fontWeight:600,marginBottom:12}}>{tc('admin.growth_levers')}</div>
              {[
                {action:tc('admin.lever_email_action'),detail:tc('admin.lever_email_detail', { count: candidates.length }),cta:tc('admin.lever_view'),onClick:()=>setTab('Revenue'),color:'#b45309'},
                {action:tc('admin.lever_blog_action'),detail:tc('admin.lever_blog_detail'),cta:tc('admin.lever_open'),onClick:()=>router.push('/admin/agent'),color:'#6366F1'},
              ].map(({action,detail,cta,onClick,color})=>(
                <div key={action} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:17,color}}>{action}</div>
                    <div style={{fontSize:16,color:'var(--tx3)',marginTop:2}}>{detail}</div>
                  </div>
                  <button onClick={onClick} style={{padding:'6px 14px',borderRadius:9999,border:'1px solid '+color,background:'transparent',color,fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{cta}</button>
                </div>
              ))}
            </div>
          </>}


        </>}
      </div>
    </div>
  )
}
