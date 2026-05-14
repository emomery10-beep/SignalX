'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAILS = ['emomery10@gmail.com', 'emomery10@googlemail.com']
const PLAN_COLORS: Record<string, string> = {
  free: '#94a3b8', growth: '#f59e0b', business: '#8b5cf6', enterprise: '#10b981',
}
const TABS = ['Overview','Revenue','Users','Activity','Content','Costs','Growth','X Agent'] as const
type Tab = typeof TABS[number]

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
  const [agentContent, setAgentContent] = useState<any[]>([])
  const [signups, setSignups] = useState<any[]>([])

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
        setAgentContent(d.agentContent || [])
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
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) }, body: JSON.stringify({ action: 'change_plan', userId, planId }) })
    const d = await res.json()
    if (d.success) { setActionMsg('Plan updated to ' + planId); loadAll(); setTimeout(() => setActionMsg(''), 3000) }
  }

  if (!authorized) return null

  const fu = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()) || u.full_name?.toLowerCase().includes(search.toLowerCase()))
  const mrr = stats?.mrr || 0
  const arr = mrr * 12
  const conv = stats?.totalUsers > 0 ? ((stats?.payingUsers / stats?.totalUsers) * 100).toFixed(1) : '0'
  const xPosted = xActivity.filter(x => x.status === 'posted').length
  const xPending = xActivity.filter(x => x.status === 'pending').length
  const pc = agentContent.filter(c => c.status === 'pending').length
  const counts = signups.map(s => s.count as number)
  const maxS = counts.length > 0 ? Math.max(...counts, 1) : 1

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',fontFamily:'var(--font-dm,DM Sans,sans-serif)'}}>
      {actionMsg && <div style={{position:'fixed',top:16,right:16,zIndex:999,padding:'10px 16px',borderRadius:10,background:'rgba(34,197,94,.15)',border:'1px solid rgba(34,197,94,.3)',color:'#16a34a',fontSize:13,fontWeight:500}}>✓ {actionMsg}</div>}
      <div style={{padding:'20px 24px',borderBottom:'1px solid var(--b)',background:'var(--sf)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 style={{fontFamily:'var(--font-sora)',fontSize:20,fontWeight:700,margin:0}}>🔐 AskBiz Admin</h1>
          <p style={{fontSize:12,color:'var(--tx3)',margin:'2px 0 0'}}>Full webapp oversight</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <a href="/admin/agent" style={{padding:'7px 14px',borderRadius:9999,border:'1px solid #6366F1',background:'rgba(99,102,241,.08)',color:'#6366F1',fontSize:12,fontWeight:600,textDecoration:'none'}}>⚡ Growth Agent</a>
          <button onClick={loadAll} style={{padding:'7px 14px',borderRadius:9999,border:'1px solid var(--b)',background:'transparent',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>↻ Refresh</button>
        </div>
      </div>
      <div style={{display:'flex',overflowX:'auto',borderBottom:'1px solid var(--b)',background:'var(--sf)',padding:'0 24px'}}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{padding:'12px 16px',border:'none',background:'transparent',fontSize:13,fontWeight:tab===t?600:400,color:tab===t?'#6366F1':'var(--tx3)',borderBottom:tab===t?'2px solid #6366F1':'2px solid transparent',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap'}}>
            {t}{t==='Users'?` (${users.length})`:t==='Content'&&pc>0?` (${pc})`:t==='X Agent'&&xPending>0?` (${xPending})`:''}
          </button>
        ))}
      </div>
      <div style={{padding:'24px',maxWidth:1100,margin:'0 auto'}}>
        {loading ? <div style={{textAlign:'center',padding:60,color:'var(--tx3)'}}>Loading...</div> : <>

          {tab==='Overview' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12,marginBottom:24}}>
              <KV label="MRR" value={"£"+mrr} sub="Monthly recurring" color="#f59e0b" />
              <KV label="ARR" value={"£"+arr} sub="Annual run rate" color="#8b5cf6" />
              <KV label="Paying Users" value={stats?.payingUsers} sub="Growth + Business" color="#10b981" />
              <KV label="Free Users" value={stats?.freeUsers} sub="Opportunities" color="#94a3b8" />
              <KV label="Conversion" value={conv+"%"} sub="Free to paid" color="#6366F1" />
              <KV label="New This Week" value={stats?.newThisWeek} sub="Last 7 days" color="#60a5fa" />
              <KV label="New This Month" value={stats?.newThisMonth} sub="Calendar month" color="#34d399" />
              <KV label="Flagged" value={stats?.suspiciousCount} sub="Suspicious" color="#f87171" />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Plan Distribution</div>
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
                <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Quick Stats</div>
                {[{label:'X Replies Posted',value:xPosted,color:'#1d9bf0'},{label:'X Pending',value:xPending,color:'#f59e0b'},{label:'Content Pending',value:pc,color:'#6366F1'},{label:'Upgrade Candidates',value:candidates.length,color:'#10b981'}].map(({label,value,color}) => (
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
              <KV label="MRR" value={"£"+mrr} sub="Monthly recurring" color="#f59e0b" />
              <KV label="ARR" value={"£"+arr} sub="Annualised" color="#8b5cf6" />
              <KV label="Avg/Paying User" value={"£"+(mrr/(stats?.payingUsers||1)).toFixed(0)} sub="Per paying user" color="#10b981" />
              <KV label="Conversion" value={conv+"%"} sub="Free to paid" color="#6366F1" />
              <KV label="Growth Users" value={users.filter(u=>u.plan_id==='growth').length} sub="£19/mo each" color="#f59e0b" />
              <KV label="Business Users" value={users.filter(u=>u.plan_id==='business').length} sub="£49/mo each" color="#8b5cf6" />
            </div>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Upgrade Candidates ({candidates.length})</div>
              <p style={{fontSize:12,color:'var(--tx3)',marginBottom:16}}>Free users at 7-9 questions — prime conversion targets.</p>
              {candidates.length===0 ? <div style={{textAlign:'center',padding:20,color:'var(--tx3)'}}>No candidates</div> :
                candidates.map(c => (
                  <div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--b)',flexWrap:'wrap',gap:8}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:13}}>{c.full_name||'User'}</div>
                      <div style={{fontSize:12,color:'var(--tx3)'}}>{c.email} · {c.questions_used}/10</div>
                    </div>
                    <button onClick={() => changePlan(c.id,'growth')} style={{padding:'6px 14px',borderRadius:9999,border:'none',background:'#f59e0b',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Give Growth →</button>
                  </div>
                ))
              }
            </div>
          </>}

          {tab==='Users' && <>
            <div style={{marginBottom:16,display:'flex',gap:12,alignItems:'center'}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by email or name…" style={{flex:1,minWidth:200,padding:'9px 14px',borderRadius:10,border:'1px solid var(--b)',background:'var(--ev)',fontFamily:'inherit',fontSize:13,outline:'none'}} />
              <span style={{fontSize:12,color:'var(--tx3)'}}>{fu.length} of {users.length}</span>
            </div>
            <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                  <thead>
                    <tr style={{background:'var(--ev)'}}>
                      {['Name','Email','Plan','Type','Country','Questions','Joined','Actions'].map(h => (
                        <th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:600,whiteSpace:'nowrap',color:'var(--tx2)'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fu.map((u,i) => (
                      <tr key={u.id} style={{borderTop:'1px solid var(--b)',background:u.is_suspicious?'rgba(248,113,113,.04)':i%2===0?'var(--sf)':'var(--bg)'}}>
                        <td style={{padding:'9px 12px',fontWeight:500}}>{u.full_name||'—'}{u.is_suspicious?' ⚠️':''}</td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)'}}>{u.email}</td>
                        <td style={{padding:'9px 12px'}}><span style={{padding:'2px 8px',borderRadius:9999,fontSize:11,fontWeight:600,background:(PLAN_COLORS[u.plan_id]||'#94a3b8')+'20',color:PLAN_COLORS[u.plan_id]||'#94a3b8'}}>{u.plan_id}</span></td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)',textTransform:'capitalize'}}>{u.business_type||'—'}</td>
                        <td style={{padding:'9px 12px',color:'var(--tx2)'}}>{u.registration_country||'—'}</td>
                        <td style={{padding:'9px 12px'}}>{u.questions_used||0}</td>
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
              <KV label="New This Month" value={stats?.newThisMonth} sub="New signups" color="#6366F1" />
              <KV label="Total Questions" value={users.reduce((s,u)=>s+(u.questions_used||0),0)} sub="All time" color="#10b981" />
              <KV label="Avg Questions" value={(users.reduce((s,u)=>s+(u.questions_used||0),0)/(users.length||1)).toFixed(1)} sub="Per user" color="#f59e0b" />
              <KV label="Power Users" value={users.filter(u=>u.questions_used>=5).length} sub="5+ questions" color="#8b5cf6" />
            </div>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Daily Signups — Last 30 Days</div>
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
                <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>By Country</div>
                {Object.entries(users.reduce((acc:any,u)=>{const c=u.registration_country||'Unknown';acc[c]=(acc[c]||0)+1;return acc},{})).sort((a:any,b:any)=>b[1]-a[1]).slice(0,8).map(([c,n]:any)=>(
                  <div key={c} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--b)',fontSize:12}}>
                    <span>{c}</span><span style={{fontWeight:600}}>{n}</span>
                  </div>
                ))}
              </div>
              <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>By Business Type</div>
                {Object.entries(users.reduce((acc:any,u)=>{const t=u.business_type||'Unknown';acc[t]=(acc[t]||0)+1;return acc},{})).sort((a:any,b:any)=>b[1]-a[1]).map(([t,n]:any)=>(
                  <div key={t} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--b)',fontSize:12}}>
                    <span style={{textTransform:'capitalize'}}>{t}</span><span style={{fontWeight:600}}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {tab==='Content' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12,marginBottom:24}}>
              <KV label="Total" value={agentContent.length} sub="All content" />
              <KV label="Pending" value={pc} sub="Awaiting approval" color="#f59e0b" />
              <KV label="Published" value={agentContent.filter(c=>c.status==='published').length} sub="Live" color="#10b981" />
              <KV label="Rejected" value={agentContent.filter(c=>c.status==='rejected').length} sub="Declined" color="#f87171" />
            </div>
            <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
              {agentContent.length===0?<div style={{textAlign:'center',padding:40,color:'var(--tx3)'}}>No content yet</div>:
                agentContent.slice(0,30).map(item=>(
                  <div key={item.id} style={{padding:'12px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                    <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:6,background:item.type==='blog'?'rgba(99,102,241,.1)':item.type==='thread'?'rgba(34,197,94,.1)':'rgba(245,158,11,.1)',color:item.type==='blog'?'#6366F1':item.type==='thread'?'#16a34a':'#d97706',textTransform:'uppercase'}}>{item.type}</span>
                    <span style={{fontSize:11,color:item.status==='pending'?'#f59e0b':item.status==='published'?'#10b981':'#94a3b8',fontWeight:500}}>{item.status}</span>
                    <span style={{fontSize:12,color:'var(--tx2)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.source_title||item.source_query||'No title'}</span>
                    <span style={{fontSize:11,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                ))
              }
            </div>
          </>}

          {tab==='Costs' && <>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Estimated Monthly Costs</div>
              <p style={{fontSize:12,color:'var(--tx3)',marginBottom:16}}>Based on current usage. Check Anthropic and Tavily dashboards for actuals.</p>
              {[
                {service:'Anthropic Claude API',estimate:'£0.003 per question',note:'~'+users.reduce((s,u)=>s+(u.questions_used||0),0)+' questions total',color:'#6366F1'},
                {service:'Tavily Search API',estimate:'£0.001 per search',note:'X agent and market research',color:'#f59e0b'},
                {service:'Supabase',estimate:'Free or £25/mo',note:'Depends on database size',color:'#10b981'},
                {service:'Vercel',estimate:'Free Hobby plan',note:'Upgrade needed for crons',color:'#94a3b8'},
                {service:'Resend Email',estimate:'Free up to 3,000/mo',note:'Team invites',color:'#60a5fa'},
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
            <div style={{padding:20,borderRadius:14,border:'1px solid rgba(99,102,241,.2)',background:'rgba(99,102,241,.04)'}}>
              <div style={{fontSize:13,fontWeight:600,color:'#6366F1',marginBottom:12}}>Unit Economics</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                {[
                  {label:'Revenue per user',value:'£'+(mrr/(users.length||1)).toFixed(2)+'/mo'},
                  {label:'Cost per question',value:'~£0.003'},
                  {label:'Gross margin est.',value:'~85%'},
                  {label:'LTV (12 months)',value:'£'+((mrr/(stats?.payingUsers||1))*12).toFixed(0)},
                ].map(({label,value})=>(
                  <div key={label} style={{padding:'10px 12px',borderRadius:9,background:'var(--sf)',border:'1px solid var(--b)'}}>
                    <div style={{fontSize:11,color:'var(--tx3)',marginBottom:4}}>{label}</div>
                    <div style={{fontSize:18,fontWeight:700,fontFamily:'var(--font-sora)'}}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {tab==='Growth' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:24}}>
              <KV label="Weekly Growth" value={"+"+stats?.newThisWeek} sub="Last 7 days" color="#10b981" />
              <KV label="Monthly Growth" value={"+"+stats?.newThisMonth} sub="This month" color="#6366F1" />
              <KV label="Paying Ratio" value={conv+"%"} sub="Of total users" color="#f59e0b" />
              <KV label="Total Users" value={stats?.totalUsers} sub="All time" color="#94a3b8" />
            </div>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)',marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:16}}>Daily Signups — Last 30 Days</div>
              <div style={{display:'flex',alignItems:'flex-end',gap:3,height:120}}>
                {signups.map((s,i)=>(
                  <div key={i} title={s.date+": "+s.count} style={{flex:1,display:'flex',alignItems:'flex-end',height:'100%'}}>
                    <div style={{width:'100%',background:s.count>0?'#6366F1':'var(--ev)',borderRadius:'3px 3px 0 0',height:(s.count/maxS*100)+"px",minHeight:s.count>0?3:0,opacity:s.count>0?0.85:0.3}} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{padding:20,borderRadius:14,border:'1px solid var(--b)',background:'var(--sf)'}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Growth Levers</div>
              {[
                {action:'Email upgrade candidates',detail:candidates.length+' users at 7-9 questions',cta:'View',onClick:()=>setTab('Revenue'),color:'#f59e0b'},
                {action:'X Agent engagement',detail:xPosted+' posted, '+xPending+' pending',cta:'Manage',onClick:()=>setTab('X Agent'),color:'#1d9bf0'},
                {action:'Content agent',detail:pc+' pieces pending approval',cta:'Review',onClick:()=>setTab('Content'),color:'#6366F1'},
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

          {tab==='X Agent' && <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12,marginBottom:24}}>
              <KV label="Total Activity" value={xActivity.length} sub="All time" color="#1d9bf0" />
              <KV label="Posted" value={xPosted} sub="Replies sent" color="#10b981" />
              <KV label="Pending" value={xPending} sub="Awaiting review" color="#f59e0b" />
              <KV label="Rejected" value={xActivity.filter(x=>x.status==='rejected').length} sub="Declined" color="#f87171" />
            </div>
            <div style={{marginBottom:16}}>
              <a href="/admin/agent" style={{padding:'9px 18px',borderRadius:9999,border:'none',background:'#1d9bf0',color:'#fff',fontSize:13,fontWeight:600,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6}}>Open X Agent →</a>
            </div>
            <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'hidden',background:'var(--sf)'}}>
              <div style={{padding:'12px 16px',borderBottom:'1px solid var(--b)',fontSize:12,fontWeight:600,color:'var(--tx2)',background:'var(--ev)'}}>Recent Activity</div>
              {xActivity.length===0?<div style={{textAlign:'center',padding:40,color:'var(--tx3)'}}>No X activity yet.</div>:
                xActivity.slice(0,20).map(item=>(
                  <div key={item.id} style={{padding:'12px 16px',borderBottom:'1px solid var(--b)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                      <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:9999,background:item.status==='posted'?'rgba(16,185,129,.1)':item.status==='pending'?'rgba(245,158,11,.1)':'rgba(248,113,113,.1)',color:item.status==='posted'?'#10b981':item.status==='pending'?'#f59e0b':'#f87171'}}>{item.status}</span>
                      <span style={{fontSize:12,fontWeight:600,color:'var(--tx2)'}}>{'@'+item.tweet_author}</span>
                      <span style={{fontSize:11,color:'var(--tx3)'}}>{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                    </div>
                    <p style={{fontSize:12,color:'var(--tx2)',margin:'0 0 6px',lineHeight:1.5}}>{(item.tweet_text||'').slice(0,120)}</p>
                    <p style={{fontSize:12,color:'#6366F1',margin:0,borderLeft:'2px solid #6366F1',paddingLeft:8,lineHeight:1.5}}>{(item.generated_reply||'').slice(0,120)}</p>
                  </div>
                ))
              }
            </div>
          </>}

        </>}
      </div>
    </div>
  )
}
