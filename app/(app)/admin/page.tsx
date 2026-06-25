'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLang } from '@/components/LanguageProvider'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
const PLAN_COLORS: Record<string, string> = {
  free: '#94a3b8', growth: '#f59e0b', business: '#8b5cf6', enterprise: '#10b981',
}
const TABS = ['Overview','Revenue','Users','Activity','Costs','Growth'] as const
type Tab = typeof TABS[number]
const TAB_KEYS: Record<Tab, string> = {
  Overview: 'tab_overview', Revenue: 'tab_revenue', Users: 'tab_users',
  Activity: 'tab_activity', Costs: 'tab_costs', Growth: 'tab_growth',
}

function KV({ label, value, sub, color }: { label: string; value: any; sub?: string; color?: string }) {
  return (
    <div style={{padding:'18px',borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
      <div style={{fontSize:11,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>{label}</div>
      <div style={{fontSize:28,fontWeight:700,fontFamily:'var(--font-sora)',color:color||'var(--tx)',marginBottom:4}}>{value}</div>
      {sub && <div style={{fontSize:12,color:'var(--tx3)'}}>{sub}</div>}
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const { tc } = useLang()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('Overview')
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [candidates, setCandidates] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [actionMsg, setActionMsg] = useState('')
  const [xActivity, setXActivity] = useState<any[]>([])
  const [signups, setSignups] = useState<any[]>([])
  const [stripeData, setStripeData] = useState<any>(null)
  const [apiUsage, setApiUsage] = useState<any>(null)

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

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',fontFamily:'var(--font-dm,DM Sans,sans-serif)'}}>
      {actionMsg && <div style={{position:'fixed',top:16,right:16,zIndex:999,padding:'10px 16px',borderRadius:10,background:'rgba(34,197,94,.15)',border:'1px solid rgba(34,197,94,.3)',color:'#16a34a',fontSize:13,fontWeight:500}}>✓ {actionMsg}</div>}
      <div style={{padding:'20px 24px',borderBottom:'1px solid var(--b)',background:'var(--sf)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:'var(--font-sora)',fontSize:20,fontWeight:700,margin:0}}>🔐 {tc('admin.title')}</h1>
          <p style={{fontSize:12,color:'var(--tx3)',margin:'2px 0 0'}}>{tc('admin.subtitle')}</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <a href="/admin/agent" style={{padding:'7px 14px',borderRadius:9999,border:'1px solid #6366F1',background:'rgba(99,102,241,.08)',color:'#6366F1',fontSize:12,fontWeight:600,textDecoration:'none'}}>⚡ {tc('admin.growth_agent')}</a>
          <button onClick={loadAll} style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>↻ {tc('admin.refresh')}</button>
        </div>
      </div>
      <div className="tab-strip" style={{borderBottom:'1px solid var(--b)',background:'var(--sf)',padding:'0 24px'}}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{padding:'12px 16px',border:'none',background:'transparent',fontSize:13,fontWeight:tab===t?600:400,color:tab===t?'#6366F1':'var(--tx3)',borderBottom:tab===t?'2px solid #6366F1':'2px solid transparent',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>
            {tc('admin.' + TAB_KEYS[t])}{t==='Users'?' (' + users.length + ')':''}
          </button>
        ))}
      </div>
      <div style={{padding:'24px',maxWidth:1100,margin:'0 auto'}}>
        {loading ? <div style={{textAlign:'center',padding:60,color:'var(--tx3)'}}>{tc('admin.loading')}</div> : <>

          {tab==='Overview' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12,marginBottom:24}}>
              <KV label={tc('admin.kv_mrr')} value={"£"+mrr} sub={tc('admin.kv_mrr_sub')} color="#f59e0b" />
              <KV label={tc('admin.kv_arr')} value={"£"+arr} sub={tc('admin.kv_arr_sub')} color="#8b5cf6" />
              <KV label={tc('admin.kv_paying_users')} value={payingCount} sub={tc('admin.kv_paying_users_sub')} color="#10b981" />
              <KV label={tc('admin.kv_free_users')} value={stats?.freeUsers} sub={tc('admin.kv_free_users_sub')} color="#94a3b8" />
              <KV label={tc('admin.kv_conversion')} value={conv+"%"} sub={tc('admin.kv_conversion_sub')} color="#6366F1" />
              <KV label={tc('admin.kv_new_this_week')} value={stats?.newThisWeek} sub={tc('admin.kv_new_this_week_sub')} color="#60a5fa" />
              <KV label={tc('admin.kv_new_this_month')} value={stats?.newThisMonth} sub={tc('admin.kv_new_this_month_sub')} color="#34d399" />
              <KV label={tc('admin.kv_flagged')} value={stats?.suspiciousCount} sub={tc('admin.kv_flagged_sub')} color="#f87171" />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>{tc('admin.plan_distribution')}</div>
                {['free','growth','business','enterprise'].map(plan => {
                  const count = users.filter(u => u.plan_id === plan).length
                  const pct = stats?.totalUsers > 0 ? Math.round(count/stats.totalUsers*100) : 0
                  return <div key={plan} style={{marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:12}}>
                      <span style={{textTransform:'capitalize',fontWeight:500}}>{plan}</span>
                      <span style={{color:'var(--tx3)'}}>{count} ({pct}%)</span>
                    </div>
                    <div style={{height:6,borderRadius:3,background:'var(--ev)'}}>
                      <div style={{height:'100%',width:pct+"%",background:PLAN_COLORS[plan],borderRadius:3}} />
                    </div>
                  </div>
                })}
              </div>
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>{tc('admin.quick_stats')}</div>
                {[{label:tc('admin.upgrade_candidates_label'),value:candidates.length,color:'#10b981'}].map(({label,value,color}) => (
                  <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--b)',fontSize:13}}>
                    <span style={{color:'var(--tx2)'}}>{label}</span>
                    <span style={{fontWeight:700,color}}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {tab==='Revenue' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:24}}>
              <KV label={tc('admin.kv_mrr')} value={"£"+mrr} sub={tc('admin.kv_mrr_stripe_sub')} color="#f59e0b" />
              <KV label={tc('admin.kv_arr')} value={"£"+arr} sub={tc('admin.kv_arr_annualised_sub')} color="#8b5cf6" />
              <KV label={tc('admin.kv_active_subs')} value={stripeData?.activeSubscriptions??0} sub={tc('admin.kv_active_subs_sub')} color="#10b981" />
              <KV label={tc('admin.kv_conversion')} value={conv+"%"} sub={tc('admin.kv_conversion_sub')} color="#6366F1" />
              <KV label={tc('admin.kv_this_month')} value={"£"+(stripeData?.monthRevenue??0)} sub={tc('admin.kv_this_month_sub')} color="#60a5fa" />
              <KV label={tc('admin.kv_total_revenue')} value={"£"+(stripeData?.totalRevenue??0)} sub={tc('admin.kv_total_revenue_sub')} color="#34d399" />
            </div>

            {stripeData?.subscriptions?.length > 0 && <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>{tc('admin.active_subscriptions')}</div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
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
                        <td style={{padding:'8px 12px'}}><span style={{padding:'2px 8px',borderRadius:9999,fontSize:11,fontWeight:600,background:'rgba(99,102,241,.1)',color:'#6366F1'}}>{s.plan}</span></td>
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
              <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>{tc('admin.recent_payments')}</div>
              {stripeData.recentPayments.map((p:any)=>(
                <div key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>£{p.amount} <span style={{fontSize:11,color:p.status==='succeeded'?'#10b981':'#f87171',fontWeight:500}}>{p.status}</span></div>
                    <div style={{fontSize:12,color:'var(--tx3)'}}>{p.email}{p.description?' · '+p.description:''}</div>
                  </div>
                  <div style={{fontSize:11,color:'var(--tx3)'}}>{new Date(p.created).toLocaleDateString('en-GB')}</div>
                </div>
              ))}
            </div>}

            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{tc('admin.upgrade_candidates_title', { count: candidates.length })}</div>
              <p style={{fontSize:12,color:'var(--tx3)',marginBottom:16}}>{tc('admin.upgrade_candidates_desc')}</p>
              {candidates.length===0 ? <div style={{textAlign:'center',padding:20,color:'var(--tx3)'}}>{tc('admin.no_candidates')}</div> :
                candidates.map(c => (
                  <div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:13}}>{c.full_name||tc('admin.default_user')}</div>
                      <div style={{fontSize:12,color:'var(--tx3)'}}>{c.email} · {c.questions_used}/10</div>
                    </div>
                    <button onClick={() => changePlan(c.id,'growth')} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#f59e0b',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{tc('admin.give_growth')}</button>
                  </div>
                ))
              }
            </div>
          </>}

          {tab==='Users' && <>
            <div style={{marginBottom:16,display:'flex',gap:12,alignItems:'center'}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={tc('admin.search_placeholder')} style={{flex:1,minWidth:200,padding:'9px 14px',borderRadius:10,border:'1px solid var(--b)',background:'var(--ev)',fontFamily:'inherit',fontSize:13,outline:'none'}} />
              <span style={{fontSize:12,color:'var(--tx3)'}}>{tc('admin.results_count', { shown: fu.length, total: users.length })}</span>
            </div>
            <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                  <thead>
                    <tr style={{background:'var(--ev)'}}>
                      {[tc('admin.th_name'),tc('admin.th_email'),tc('admin.th_plan'),tc('admin.th_type'),tc('admin.th_country'),tc('admin.th_questions'),'POS Sales','POS Revenue',tc('admin.th_joined'),tc('admin.th_actions')].map(h => (
                        <th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:600,whiteSpace:'nowrap',color:'var(--tx2)'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fu.map((u,i) => (
                      <tr key={u.id} style={{borderTop:'1px solid var(--b)',background:u.is_suspicious?'rgba(248,113,113,.04)':i%2===0?'var(--sf)':'var(--bg)'}}>
                        <td style={{padding:'9px 12px',fontWeight:500}}>{u.full_name||tc('admin.empty_dash')}{u.is_suspicious?' ⚠️':''}</td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)'}}>{u.email}</td>
                        <td style={{padding:'9px 12px'}}><span style={{padding:'2px 8px',borderRadius:9999,fontSize:11,fontWeight:600,background:(PLAN_COLORS[u.plan_id]||'#94a3b8')+'20',color:PLAN_COLORS[u.plan_id]||'#94a3b8'}}>{u.plan_id}</span></td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)',textTransform:'capitalize'}}>{u.business_type||tc('admin.empty_dash')}</td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)'}}>{u.registration_country||tc('admin.empty_dash')}</td>
                        <td style={{padding:'9px 12px'}}>{u.questions_used||0}</td>
                        <td style={{padding:'9px 12px'}}>{u.pos_tx_count > 0 ? <span style={{padding:'2px 8px',borderRadius:9999,fontSize:11,fontWeight:600,background:'#0891b220',color:'#0891b2'}}>{u.pos_tx_count}</span> : <span style={{color:'var(--tx3)'}}>—</span>}</td>
                        <td style={{padding:'9px 12px',fontWeight:u.pos_revenue>0?600:'normal',color:u.pos_revenue>0?'var(--tx)':'var(--tx3)'}}>{u.pos_revenue>0 ? (u.pos_revenue>=1000 ? (u.pos_revenue/1000).toFixed(1)+'K' : u.pos_revenue.toFixed(0)) : '—'}</td>
                        <td style={{padding:'9px 12px',color:'var(--tx3)'}}>{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                        <td style={{padding:'9px 12px'}}>
                          <select onChange={e=>changePlan(u.id,e.target.value)} value={u.plan_id} style={{padding:'3px 6px',borderRadius:6,border:'1px solid var(--b)',background:'var(--ev)',fontFamily:'inherit',fontSize:11,cursor:'pointer'}}>
                            {['free','growth','business','enterprise'].map(p=><option key={p} value={p}>{p}</option>)}
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
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:24}}>
              <KV label={tc('admin.kv_new_this_month')} value={stats?.newThisMonth} sub={tc('admin.kv_new_signups_sub')} color="#6366F1" />
              <KV label={tc('admin.kv_total_questions')} value={users.reduce((s,u)=>s+(u.questions_used||0),0)} sub={tc('admin.kv_total_questions_sub')} color="#10b981" />
              <KV label={tc('admin.kv_avg_questions')} value={(users.reduce((s,u)=>s+(u.questions_used||0),0)/(users.length||1)).toFixed(1)} sub={tc('admin.kv_avg_questions_sub')} color="#f59e0b" />
              <KV label={tc('admin.kv_power_users')} value={users.filter(u=>u.questions_used>=5).length} sub={tc('admin.kv_power_users_sub')} color="#8b5cf6" />
            </div>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>{tc('admin.daily_signups')}</div>
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
                <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>{tc('admin.by_country')}</div>
                {Object.entries(users.reduce((acc:any,u)=>{const c=u.registration_country||tc('admin.unknown');acc[c]=(acc[c]||0)+1;return acc},{})).sort((a:any,b:any)=>b[1]-a[1]).slice(0,8).map(([c,n]:any)=>(
                  <div key={c} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--b)',fontSize:12}}>
                    <span>{c}</span><span style={{fontWeight:600}}>{n}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>{tc('admin.by_business_type')}</div>
                {Object.entries(users.reduce((acc:any,u)=>{const t=u.business_type||tc('admin.unknown');acc[t]=(acc[t]||0)+1;return acc},{})).sort((a:any,b:any)=>b[1]-a[1]).map(([t,n]:any)=>(
                  <div key={t} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--b)',fontSize:12}}>
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
              if (r.includes('scout')) return 'scouts'
              if (r.startsWith('pos/') || r.includes('/pos/')) return 'pos'
              if (r.includes('cron/')) return 'cron'
              if (r.includes('xagent') || r.startsWith('admin/')) return 'admin'
              return 'product'
            }
            const CAT: Record<string,{label:string;color:string;dot:string}> = {
              scouts:  {label:'Marketing scouts', color:'#dc2626', dot:'#fca5a5'},
              product: {label:'Product features', color:'#6366F1', dot:'#a5b4fc'},
              pos:     {label:'POS / scans',      color:'#0891b2', dot:'#67e8f9'},
              cron:    {label:'Cron jobs',         color:'#7c3aed', dot:'#c4b5fd'},
              admin:   {label:'Admin / X agent',   color:'#64748b', dot:'#cbd5e1'},
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
                    <div style={{fontSize:10,color:'var(--tx3)',marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>{label}</div>
                    <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--font-sora)'}}>{value}</div>
                  </div>
                ))}
              </div>

              {/* ── 30-day spend sparkline ── */}
              {Object.keys(byDay).length > 0 && (
                <div style={{padding:'16px 20px',borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--tx3)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.06em'}}>Spend — last 30 days</div>
                  <div style={{display:'flex',alignItems:'flex-end',gap:2,height:60}}>
                    {days30.map((d,i)=>{
                      const v = byDay[d]||0
                      const h = Math.max(v/dayMax*56,v>0?3:0)
                      return <div key={d} title={d+': $'+v.toFixed(4)} style={{flex:1,display:'flex',alignItems:'flex-end',height:'100%'}}>
                        <div style={{width:'100%',background:v>0?'#6366F1':'var(--ev)',borderRadius:'2px 2px 0 0',height:h+'px',opacity:v>0?0.8:0.2}}/>
                      </div>
                    })}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--tx3)',marginTop:4}}>
                    <span>{days30[0]}</span><span>today</span>
                  </div>
                </div>
              )}

              {/* ── Model breakdown ── */}
              {Object.keys(byModel).length > 0 && (
                <div style={{padding:'16px 20px',borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--tx3)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.06em'}}>By model</div>
                  {Object.entries(byModel).sort((a,b)=>b[1].costUsd-a[1].costUsd).map(([model,d])=>{
                    const pct = total > 0 ? (d.costUsd/total*100) : 0
                    const col = modelColor(model)
                    const groq = isGroq(model)
                    return <div key={model} style={{marginBottom:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                        <span style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{padding:'1px 5px',borderRadius:99,background:groq?'#f9731618':'#8b5cf618',color:groq?'#f97316':'#8b5cf6',fontSize:10,fontWeight:700}}>{groq?'Groq':'Anthropic'}</span>
                          <span style={{padding:'1px 7px',borderRadius:99,background:col+'22',color:col,fontSize:11,fontWeight:600}}>{modelLabel(model)}</span>
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
                  <div style={{fontSize:11,fontWeight:600,color:'#6366F1',marginBottom:12,textTransform:'uppercase',letterSpacing:'.06em'}}>Breakdown by route</div>
                  {catTotals.map(({cat,subtotal})=>{
                    const meta = CAT[cat as keyof typeof CAT] || CAT.product
                    const pct = total > 0 ? (subtotal/total*100) : 0
                    const routes = (grouped[cat]||[]).sort((a,b)=>b.d.costUsd-a.d.costUsd)
                    return <div key={cat} style={{marginBottom:16}}>
                      {/* Category header */}
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <span style={{display:'flex',alignItems:'center',gap:6}}>
                          <span style={{width:8,height:8,borderRadius:'50%',background:meta.color,display:'inline-block'}}/>
                          <span style={{fontSize:12,fontWeight:600,color:meta.color}}>{meta.label}</span>
                        </span>
                        <span style={{fontSize:12,fontWeight:600,color:'var(--tx)'}}>${subtotal.toFixed(4)} <span style={{color:'var(--tx3)',fontWeight:400}}>({Math.round(pct)}%)</span></span>
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
                              <span style={{fontSize:11,fontFamily:'monospace',color:'var(--tx2)'}}>{route}</span>
                              {d.model && <>
                                <span style={{padding:'0px 4px',borderRadius:99,background:isGroq(d.model)?'#f9731618':'#8b5cf618',color:isGroq(d.model)?'#f97316':'#8b5cf6',fontSize:9,fontWeight:700,whiteSpace:'nowrap'}}>{isGroq(d.model)?'Groq':'Anthropic'}</span>
                                <span style={{padding:'0px 5px',borderRadius:99,background:col+'22',color:col,fontSize:10,fontWeight:600,whiteSpace:'nowrap'}}>{modelLabel(d.model)}</span>
                              </>}
                            </div>
                            <div style={{height:3,borderRadius:99,background:'var(--ev)',overflow:'hidden'}}>
                              <div style={{height:'100%',width:routePct+'%',background:meta.color,opacity:0.7,borderRadius:99}}/>
                            </div>
                          </div>
                          <div style={{textAlign:'right',whiteSpace:'nowrap'}}>
                            <div style={{fontSize:12,fontWeight:600,color:'var(--tx)'}}>${d.costUsd.toFixed(4)}</div>
                            <div style={{fontSize:10,color:'var(--tx3)'}}>{d.calls} calls</div>
                          </div>
                        </div>
                      })}
                    </div>
                  })}
                </div>
              )}
              {(!apiUsage || Object.keys(byRoute).length===0) && (
                <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16,fontSize:12,color:'var(--tx3)'}}>
                  No API calls logged yet. Usage appears here once routes with logUsage are called.
                </div>
              )}

              {/* ── Other monthly costs ── */}
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{tc('admin.other_monthly_costs')}</div>
                <p style={{fontSize:12,color:'var(--tx3)',marginBottom:16}}>{tc('admin.other_monthly_costs_desc')}</p>
                {[
                  {service:tc('admin.cost_tavily_service'),estimate:tc('admin.cost_tavily_estimate'),note:tc('admin.cost_tavily_note'),color:'#f59e0b'},
                  {service:tc('admin.cost_supabase_service'),estimate:tc('admin.cost_supabase_estimate'),note:tc('admin.cost_supabase_note'),color:'#10b981'},
                  {service:tc('admin.cost_vercel_service'),estimate:tc('admin.cost_vercel_estimate'),note:tc('admin.cost_vercel_note'),color:'#94a3b8'},
                  {service:tc('admin.cost_resend_service'),estimate:tc('admin.cost_resend_estimate'),note:tc('admin.cost_resend_note'),color:'#60a5fa'},
                ].map(({service,estimate,note,color})=>(
                  <div key={service} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:13,color}}>{service}</div>
                      <div style={{fontSize:11,color:'var(--tx3)',marginTop:2}}>{note}</div>
                    </div>
                    <div style={{fontSize:13,fontWeight:600,color:'var(--tx2)'}}>{estimate}</div>
                  </div>
                ))}
              </div>

              {/* ── Unit economics ── */}
              <div style={{padding:20,borderRadius:14,border:'1px solid rgba(99,102,241,.2)',background:'rgba(99,102,241,.04)'}}>
                <div style={{fontSize:13,fontWeight:600,color:'#6366F1',marginBottom:12}}>{tc('admin.unit_economics')}</div>
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
                      <div style={{fontSize:11,color:'var(--tx3)',marginBottom:4}}>{label}</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--font-sora)'}}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          })()}

          {tab==='Growth' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:24}}>
              <KV label={tc('admin.kv_weekly_growth')} value={"+"+stats?.newThisWeek} sub={tc('admin.kv_weekly_growth_sub')} color="#10b981" />
              <KV label={tc('admin.kv_monthly_growth')} value={"+"+stats?.newThisMonth} sub={tc('admin.kv_monthly_growth_sub')} color="#6366F1" />
              <KV label={tc('admin.kv_paying_ratio')} value={conv+"%"} sub={tc('admin.kv_paying_ratio_sub')} color="#f59e0b" />
              <KV label={tc('admin.kv_total_users')} value={stats?.totalUsers} sub={tc('admin.kv_total_users_sub')} color="#94a3b8" />
            </div>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>{tc('admin.daily_signups')}</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:3,height:120}}>
                {signups.map((s,i)=>(
                  <div key={i} title={s.date+": "+s.count} style={{flex:1,display:'flex',alignItems:'flex-end',height:'100%'}}>
                    <div style={{width:'100%',background:s.count>0?'#6366F1':'var(--ev)',borderRadius:'3px 3px 0 0',height:(s.count/maxS*100)+"px",minHeight:s.count>0?3:0,opacity:s.count>0?0.85:0.3}} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>{tc('admin.growth_levers')}</div>
              {[
                {action:tc('admin.lever_email_action'),detail:tc('admin.lever_email_detail', { count: candidates.length }),cta:tc('admin.lever_view'),onClick:()=>setTab('Revenue'),color:'#f59e0b'},
                {action:tc('admin.lever_blog_action'),detail:tc('admin.lever_blog_detail'),cta:tc('admin.lever_open'),onClick:()=>router.push('/admin/agent'),color:'#6366F1'},
              ].map(({action,detail,cta,onClick,color})=>(
                <div key={action} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,color}}>{action}</div>
                    <div style={{fontSize:12,color:'var(--tx3)',marginTop:2}}>{detail}</div>
                  </div>
                  <button onClick={onClick} style={{padding:'6px 14px',borderRadius:9999,border:'1px solid '+color,background:'transparent',color,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>{cta}</button>
                </div>
              ))}
            </div>
          </>}


        </>}
      </div>
    </div>
  )
}
