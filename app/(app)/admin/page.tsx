'use client'
import { useState, useEffect } from 'react'

interface Stats { queries:number; files:number; alerts:number; forecasts:number; exports:number }
interface Log { id:string; event:string; metadata:Record<string,unknown>; created_at:string }
interface Profile { region:string; currency:string; sector_hints:string; plan:string; business_type:string }

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ queries:0, files:0, alerts:0, forecasts:0, exports:0 })
  const [logs, setLogs] = useState<Log[]>([])
  const [profile, setProfile] = useState<Profile|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin').then(r => r.json()).then(d => {
      setStats(d.stats || {}); setLogs(d.recentLogs || []); setProfile(d.profile || null); setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const statCards = [
    { label:'AI queries',    value:stats.queries,   sub:'All time',             color:'#1ed4ca' },
    { label:'Files',         value:stats.files,     sub:'Parsed successfully',  color:'#9268f8' },
    { label:'Active alerts', value:stats.alerts,    sub:'Monitoring your data', color:'#f5a623' },
    { label:'Forecasts',     value:stats.forecasts, sub:'Demand predictions',   color:'#22c55e' },
  ]

  const evtLabel: Record<string,string> = {
    ai_query:'AI query', file_uploaded:'File uploaded', forecast_generated:'Forecast run',
    tile_saved:'Tile saved', dashboard_created:'Dashboard created',
    conversation_created:'Conversation started', export_generated:'Export downloaded',
    onboarding_complete:'Onboarding completed',
  }

  const fmt = (ts:string) => {
    const diff=(Date.now()-new Date(ts).getTime())/1000
    if(diff<60) return 'Just now'
    if(diff<3600) return `${Math.floor(diff/60)}m ago`
    if(diff<86400) return `${Math.floor(diff/3600)}h ago`
    return new Date(ts).toLocaleDateString()
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'20px 24px 16px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
        <div style={{fontFamily:'var(--font-sora)',fontSize:18,fontWeight:600}}>Admin</div>
        <div style={{fontSize:13,color:'var(--tx2)',marginTop:3}}>Usage stats, geo context, and audit log</div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'20px 24px'}}>
        {profile?.sector_hints&&(
          <div style={{display:'flex',alignItems:'flex-start',gap:8,padding:'10px 14px',marginBottom:20,borderRadius:10,background:'rgba(30,212,202,.06)',border:'1px solid rgba(30,212,202,.18)',fontSize:12}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1ed4ca" strokeWidth="2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span style={{color:'#47e2da'}}><strong>Region:</strong> {profile.region} &nbsp;·&nbsp;<strong>Currency:</strong> {profile.currency} &nbsp;·&nbsp;<strong>Sectors:</strong> {profile.sector_hints}</span>
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
          {statCards.map((s,i)=>(
            <div key={i} style={{padding:16,borderRadius:13,border:'1px solid var(--b)',background:'var(--sf)'}}>
              <div style={{fontSize:11,color:'var(--tx3)',marginBottom:6,fontWeight:500}}>{s.label}</div>
              <div style={{fontFamily:'var(--font-sora)',fontSize:26,fontWeight:600,color:s.color}}>{loading?'—':s.value}</div>
              <div style={{fontSize:11,color:'var(--tx3)',marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:24}}>
          {[{label:'Manage alerts',href:'/alerts',icon:'🔔',desc:`${stats.alerts} active`},{label:'Run a forecast',href:'/forecasts',icon:'📈',desc:`${stats.forecasts} completed`},{label:'Browse templates',href:'/templates',icon:'📋',desc:'4 industry sets'}].map((l,i)=>(
            <a key={i} href={l.href} style={{padding:'14px 16px',borderRadius:12,border:'1px solid var(--b)',background:'var(--sf)',textDecoration:'none',display:'flex',gap:12,alignItems:'center',transition:'border-color 180ms'}}
              onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.borderColor='var(--b2)'}
              onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.borderColor='var(--b)'}>
              <div style={{fontSize:22}}>{l.icon}</div>
              <div><div style={{fontSize:13,fontWeight:500,color:'var(--tx)'}}>{l.label}</div><div style={{fontSize:11,color:'var(--tx3)'}}>{l.desc}</div></div>
            </a>
          ))}
        </div>
        <div style={{marginBottom:14,fontSize:12,fontWeight:500,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.07em'}}>Audit log</div>
        <div style={{borderRadius:14,border:'1px solid var(--b)',overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
            <thead><tr>{['Time','Event','Details','Status'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',fontSize:10,fontWeight:500,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.05em',background:'var(--ev)',borderBottom:'1px solid var(--b)',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
            <tbody>
              {loading&&<tr><td colSpan={4} style={{padding:'20px 12px',textAlign:'center',color:'var(--tx3)'}}>Loading…</td></tr>}
              {!loading&&logs.length===0&&<tr><td colSpan={4} style={{padding:'20px 12px',textAlign:'center',color:'var(--tx3)'}}>No events yet</td></tr>}
              {logs.map(l=>(
                <tr key={l.id}>
                  <td style={{padding:'8px 12px',borderBottom:'1px solid var(--b)',color:'var(--tx3)',whiteSpace:'nowrap'}}>{fmt(l.created_at)}</td>
                  <td style={{padding:'8px 12px',borderBottom:'1px solid var(--b)',color:'var(--tx2)'}}>{evtLabel[l.event]||l.event}</td>
                  <td style={{padding:'8px 12px',borderBottom:'1px solid var(--b)',color:'var(--tx3)',fontSize:11,maxWidth:240,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.metadata?Object.entries(l.metadata).slice(0,2).map(([k,v])=>`${k}: ${v}`).join(' · '):'—'}</td>
                  <td style={{padding:'8px 12px',borderBottom:'1px solid var(--b)'}}><span style={{padding:'3px 9px',borderRadius:9999,background:'rgba(30,212,202,.1)',border:'1px solid rgba(30,212,202,.22)',fontSize:11,color:'#47e2da'}}>OK</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspicious accounts */}
      <div style={{ margin:'0 28px 28px', padding:22, borderRadius:16, border:'1px solid rgba(244,128,128,.25)', background:'rgba(244,128,128,.04)' }}>
        <div style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:600, marginBottom:4, color:'#f48080' }}>⚠ Fraud prevention</div>
        <div style={{ fontSize:12, color:'var(--tx3)', marginBottom:14 }}>Accounts flagged by IP analysis — more than 3 signups from same IP address</div>
        <div style={{ fontSize:13, color:'var(--tx2)' }}>
          View flagged accounts in Supabase: <code style={{ background:'var(--ev)', padding:'2px 6px', borderRadius:4, fontSize:11 }}>select * from suspicious_accounts;</code>
        </div>
      </div>

    </div>
  )
}
