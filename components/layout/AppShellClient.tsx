'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store'

interface Props {
  user: { id:string; name:string; email:string; plan:string; currency:string; currencySymbol:string; bizType:string; region:string; sectorHints:string }
  conversations: Array<{ id:string; title:string; created_at:string }>
  children: React.ReactNode
}

const NAV = [
  { id:'chat',       href:'/chat',       label:'Chat',       icon:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id:'files',      href:'/files',      label:'Files',      icon:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
  { id:'dashboards', href:'/dashboards', label:'Dashboard',  icon:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { id:'expansion',  href:'/expansion',  label:'Expansion',  icon:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id:'alerts',     href:'/alerts',     label:'Alerts',     icon:'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
  { id:'forecasts',  href:'/forecasts',  label:'Forecasts',  icon:'M22 12h-4l-3 9L9 3l-3 9H2' },
  { id:'templates',  href:'/templates',  label:'Templates',  icon:'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' },
  { id:'sources',    href:'/sources',    label:'Sources',    icon:'M12 2c4.97 0 9 2.24 9 5s-4.03 5-9 5-9-2.24-9-5 4.03-5 9-5z M3 7c0 2.76 4.03 5 9 5s9-2.24 9-5 M3 12c0 2.76 4.03 5 9 5s9-2.24 9-5 M3 17c0 2.76 4.03 5 9 5s9-2.24 9-5' },
  { id:'admin',      href:'/admin',      label:'Admin',      icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
]

function ConvItem({ conv, active }: { conv: { id:string; title:string }; active: boolean }) {
  return (
    <Link href={`/chat/${conv.id}`}
      style={{display:'block',padding:'6px 9px',borderRadius:7,textDecoration:'none',fontSize:12,color:active?'var(--tx)':'var(--tx2)',background:active?'var(--ev)':'transparent',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',transition:'background 120ms',marginBottom:1}}
      onMouseEnter={e=>{ if(!active)(e.currentTarget as HTMLAnchorElement).style.background='var(--ev)' }}
      onMouseLeave={e=>{ if(!active)(e.currentTarget as HTMLAnchorElement).style.background='transparent' }}>
      {conv.title || 'New conversation'}
    </Link>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: ()=>void }) {
  return (
    <div onClick={onChange} style={{width:40,height:22,borderRadius:11,background:value?'#d08a59':'var(--b2)',cursor:'pointer',position:'relative',transition:'background 200ms',flexShrink:0}}>
      <div style={{width:18,height:18,borderRadius:'50%',background:'#fff',position:'absolute',top:2,left:value?20:2,transition:'left 200ms',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
    </div>
  )
}

function ProfilePanel({ user, onClose, onSignOut }: { user: Props['user']; onClose:()=>void; onSignOut:()=>void }) {
  const [lang, setLang] = useState('en')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeKpis, setIncludeKpis] = useState(true)
  const [includeFollowUps, setIncludeFollowUps] = useState(true)
  const router = useRouter()
  const initials = user.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2)

  return (
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:199,background:'rgba(0,0,0,.35)'}}/>
      <div style={{position:'fixed',bottom:0,left:0,width:272,zIndex:200,background:'var(--sf)',borderTopRightRadius:16,borderTop:'1px solid var(--b)',borderRight:'1px solid var(--b)',maxHeight:'88vh',overflowY:'auto',boxShadow:'4px -4px 40px rgba(0,0,0,.15)'}}>

        <div style={{padding:'18px 18px 14px',borderBottom:'1px solid var(--b)'}}>
          <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:12}}>
            <div style={{width:42,height:42,borderRadius:'50%',background:'linear-gradient(135deg,#d08a59,#8c6fe0)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff',flexShrink:0}}>{initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:'var(--font-sora)',fontSize:14,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
              <div style={{fontSize:11,color:'var(--tx3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.email}</div>
            </div>
            <button onClick={onClose} style={{width:26,height:26,borderRadius:6,border:'1px solid var(--b)',background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'4px 10px',borderRadius:9999,background:'rgba(208,138,89,.1)',border:'1px solid rgba(208,138,89,.25)'}}>
            <div style={{width:5,height:5,borderRadius:'50%',background:'#d08a59'}}/>
            <span style={{fontSize:11,fontWeight:600,color:'#d08a59',textTransform:'capitalize'}}>{user.plan} Plan</span>
          </div>
        </div>

        <div style={{padding:'12px 18px',borderBottom:'1px solid var(--b)'}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>Preferences</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <span style={{fontSize:13,color:'var(--tx2)'}}>Language</span>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{fontSize:12,color:'var(--tx)',background:'var(--ev)',border:'1px solid var(--b)',borderRadius:6,padding:'3px 7px',outline:'none',fontFamily:'inherit',cursor:'pointer'}}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
              <option value="ar">العربية</option>
              <option value="sw">Kiswahili</option>
              <option value="yo">Yorùbá</option>
              <option value="ha">Hausa</option>
              <option value="zh">中文</option>
              <option value="hi">हिन्दी</option>
              <option value="pt">Português</option>
            </select>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:13,color:'var(--tx2)'}}>Business type</span>
            <span style={{fontSize:12,color:'var(--tx3)',textTransform:'capitalize'}}>{user.bizType||'retail'}</span>
          </div>
        </div>

        <div style={{padding:'12px 18px',borderBottom:'1px solid var(--b)'}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>AI Settings</div>
          {[
            {label:'Include charts in responses',value:includeCharts,set:setIncludeCharts},
            {label:'Show KPI cards',value:includeKpis,set:setIncludeKpis},
            {label:'Follow-up suggestions',value:includeFollowUps,set:setIncludeFollowUps},
          ].map(item=>(
            <div key={item.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
              <span style={{fontSize:13,color:'var(--tx2)',flex:1,paddingRight:10}}>{item.label}</span>
              <Toggle value={item.value} onChange={()=>item.set((v:boolean)=>!v)}/>
            </div>
          ))}
        </div>

        <div style={{padding:'12px 18px',borderBottom:'1px solid var(--b)'}}>
          <div style={{fontSize:10,fontWeight:700,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>Security</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:13,color:'var(--tx2)'}}>Authentication</div>
              <div style={{fontSize:11,color:'var(--tx3)',marginTop:2}}>Google · Email</div>
            </div>
            <button onClick={()=>{onClose();router.push('/settings')}} style={{fontSize:12,padding:'4px 10px',borderRadius:6,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx2)',cursor:'pointer',fontFamily:'inherit'}}>Manage</button>
          </div>
        </div>

        <div style={{padding:'14px 18px',display:'flex',flexDirection:'column',gap:8}}>
          <button onClick={()=>{onClose();router.push('/billing')}} style={{padding:'10px',borderRadius:10,border:'none',background:'#000',color:'#fff',fontFamily:'var(--font-sora)',fontSize:13,fontWeight:600,cursor:'pointer'}}>
            Upgrade plan →
          </button>
          <button onClick={onSignOut} style={{padding:'9px',borderRadius:10,border:'1px solid var(--b)',background:'transparent',color:'var(--tx3)',fontFamily:'inherit',fontSize:13,cursor:'pointer'}}>
            Sign out
          </button>
          <div style={{display:'flex',justifyContent:'center',gap:16,paddingTop:4}}>
            <a href="/privacy" style={{fontSize:11,color:'var(--tx3)',textDecoration:'none'}}>Privacy</a>
            <a href="/terms" style={{fontSize:11,color:'var(--tx3)',textDecoration:'none'}}>Terms</a>
            <a href="/settings" style={{fontSize:11,color:'var(--tx3)',textDecoration:'none'}}>Settings</a>
          </div>
        </div>

      </div>
    </>
  )
}

export default function AppShellClient({user,conversations,children}:Props){
  const pathname=usePathname(),router=useRouter(),supabase=createClient()
  const {setUser,updateSettings}=useStore()
  const [profileOpen,setProfileOpen]=useState(false)
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [alertCount,setAlertCount]=useState(0)
  const [search,setSearch]=useState('')
  const [convOpen,setConvOpen]=useState(false)
  const [navOpen,setNavOpen]=useState(true)
  const isAdmin = user?.email === 'emomery10@gmail.com'
  const initials = user.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2)

  useEffect(()=>{
    setUser({id:user.id,name:user.name,email:user.email,plan:user.plan as 'starter'|'growth'|'business',initials})
    updateSettings({bizType:user.bizType as 'retail'|'ecommerce'|'distributor'|'exporter'})
  },[user,setUser,updateSettings,initials])

  const [displayCurrency, setDisplayCurrency] = useState(user.currency || 'USD')
  const [displaySymbol, setDisplaySymbol] = useState(user.currencySymbol || '$')

  useEffect(()=>{
    fetch('/api/alerts').then(r=>r.json()).then(d=>setAlertCount(Array.isArray(d)?d.filter((a:{is_active:boolean})=>a.is_active).length:0)).catch(()=>{})
    // Always detect currency from IP/location — overrides profile default
    fetch('/api/geo').then(r=>r.json()).then(d=>{
      if(d.currency){ setDisplayCurrency(d.currency); setDisplaySymbol(d.currencySymbol) }
    }).catch(()=>{})
  },[])

  useEffect(()=>{ setSidebarOpen(false) },[pathname])

  const signOut = async()=>{ await supabase.auth.signOut(); router.push('/') }
  const newChat = ()=>router.push('/chat')



  const today=new Date().toDateString()
  const filtered=conversations.filter(c=>!search||c.title?.toLowerCase().includes(search.toLowerCase()))
  const todayConvs=filtered.filter(c=>new Date(c.created_at).toDateString()===today)
  const olderConvs=filtered.filter(c=>new Date(c.created_at).toDateString()!==today)

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--bg)',fontFamily:'var(--font-dm,DM Sans)'}}>

      <aside className="desktop-sidebar" style={{width:240,flexShrink:0,background:'var(--sf)',borderRight:'1px solid var(--b)',display:'flex',flexDirection:'column',height:'100vh',position:'fixed',left:0,top:0,bottom:0,zIndex:99,transform:sidebarOpen?'translateX(0)':'translateX(-100%)',transition:'transform 280ms cubic-bezier(.16,1,.3,1)'}} id="sidebar">

        {/* Logo */}
        <div style={{padding:'13px 13px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none',color:'var(--tx)'}}>
            <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#d08a59,#8c6fe0)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
            </div>
            <span style={{fontFamily:'var(--font-sora)',fontSize:15,fontWeight:700,letterSpacing:'-.025em'}}>AskBiz</span>
          </Link>
          <button onClick={newChat} title="New chat" style={{width:27,height:27,borderRadius:7,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx2)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        {/* Nav toggle */}
        <div onClick={()=>setNavOpen(v=>!v)}
          style={{padding:'5px 9px 5px',borderBottom:'1px solid var(--b)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',userSelect:'none'}}
          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='var(--ev)'}
          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
          <span style={{fontSize:10,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em'}}>Menu</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2.5" strokeLinecap="round"
            style={{transition:'transform 200ms',transform:navOpen?'rotate(180deg)':'rotate(0deg)'}}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>

        {/* Chat — always visible */}
        <div style={{padding:'4px 8px',flexShrink:0}}>
          {(()=>{
            const n=NAV[0]
            const active=pathname.startsWith(n.href)
            return(
              <Link href={n.href} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',borderRadius:8,textDecoration:'none',fontSize:13,fontWeight:500,transition:'all 120ms',background:active?'rgba(208,138,89,.1)':'transparent',color:active?'var(--acc)':'var(--tx2)'}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon}/></svg>
                {n.label}
              </Link>
            )
          })()}
        </div>

        {/* Nav items — collapsible */}
        <div style={{flex:navOpen?'0 0 auto':'0 0 0',overflow:'hidden',transition:'max-height 250ms cubic-bezier(.16,1,.3,1)',maxHeight:navOpen?400:0,flexShrink:0}}>
          <div style={{padding:'2px 8px 4px'}}>
            {NAV.filter(n=>n.id!=='chat'&&(n.id!=='admin'||isAdmin)).map(n=>{
              const active=pathname.startsWith(n.href)
              const badge=n.id==='alerts'&&alertCount>0
              return(
                <Link key={n.id} href={n.href} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',borderRadius:8,textDecoration:'none',fontSize:13,fontWeight:500,transition:'all 120ms',background:active?'rgba(208,138,89,.1)':'transparent',color:active?'var(--acc)':'var(--tx2)',marginBottom:1}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon}/></svg>
                  {n.label}
                  {badge&&<span style={{marginLeft:'auto',minWidth:15,height:15,borderRadius:9999,background:'var(--acc)',color:'#fff',fontSize:9,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 4px'}}>{alertCount}</span>}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Search */}
        <div style={{padding:'7px 9px',borderBottom:'1px solid var(--b)',flexShrink:0}}>
          <div style={{position:'relative'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)'}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations…" style={{fontFamily:'inherit',fontSize:12,color:'var(--tx)',background:'var(--ev)',border:'1px solid var(--b2)',borderRadius:8,padding:'6px 9px 6px 28px',outline:'none',width:'100%'}}/>
          </div>
        </div>

        {/* Conversations toggle */}
        <div onClick={()=>setConvOpen(v=>!v)}
          style={{padding:'5px 9px 5px',borderTop:'1px solid var(--b)',borderBottom:'1px solid var(--b)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg)',cursor:'pointer',userSelect:'none'}}
          onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='var(--ev)'}
          onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='var(--bg)'}>
          <span style={{fontSize:10,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em'}}>Conversations</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2.5" strokeLinecap="round"
            style={{transition:'transform 200ms',transform:convOpen?'rotate(180deg)':'rotate(0deg)'}}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>

        {/* Conversation list — collapsible */}
        <div style={{flex:convOpen?1:0,minHeight:0,overflow:'hidden',transition:'flex 250ms ease, min-height 250ms ease'}}>
          <div style={{height:'100%',overflowY:'auto',padding:'5px 7px'}}>
            {todayConvs.length>0&&<>
              <div style={{fontSize:10,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',padding:'3px 5px 2px'}}>Today</div>
              {todayConvs.map(c=><ConvItem key={c.id} conv={c} active={pathname.includes(c.id)}/>)}
            </>}
            {olderConvs.length>0&&<>
              <div style={{fontSize:10,fontWeight:600,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',padding:'5px 5px 2px'}}>Earlier</div>
              {olderConvs.slice(0,30).map(c=><ConvItem key={c.id} conv={c} active={pathname.includes(c.id)}/>)}
            </>}
            {conversations.length===0&&<div style={{padding:'14px 8px',fontSize:12,color:'var(--tx3)',textAlign:'center'}}>No conversations yet</div>}
          </div>
        </div>


        {/* Upgrade button */}
        <div style={{padding:'8px 9px',borderTop:'1px solid var(--b)',flexShrink:0}}>
          <Link href="/billing"
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'9px',borderRadius:9,background:'#000',color:'#fff',textDecoration:'none',fontSize:13,fontWeight:600,fontFamily:'var(--font-sora)',transition:'opacity 150ms'}}
            onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.opacity='.8'}
            onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.opacity='1'}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Upgrade
          </Link>
        </div>

        {/* Profile */}
        <div style={{padding:'6px 9px 11px',flexShrink:0}}>
          <div onClick={()=>setProfileOpen(true)}
            style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',borderRadius:9,cursor:'pointer',transition:'background 150ms'}}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='var(--ev)'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
            <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#d08a59,#8c6fe0)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#fff',flexShrink:0}}>{initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:'var(--font-sora)'}}>{user.name}</div>
              <div style={{fontSize:10,color:'var(--tx3)',textTransform:'capitalize'}}>{user.plan} · {displayCurrency}</div>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="5" r="1" fill="var(--tx3)"/>
              <circle cx="12" cy="12" r="1" fill="var(--tx3)"/>
              <circle cx="12" cy="19" r="1" fill="var(--tx3)"/>
            </svg>
          </div>
        </div>

      </aside>

      {profileOpen&&<ProfilePanel user={user} onClose={()=>setProfileOpen(false)} onSignOut={async()=>{ await supabase.auth.signOut(); router.push('/') }}/>}

      {sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{position:'fixed',inset:0,zIndex:98,background:'rgba(0,0,0,.4)'}} className="mobile-only"/>}

      <div className="mobile-header" style={{display:'none',position:'fixed',top:0,left:0,right:0,zIndex:97,background:'var(--sf)',borderBottom:'1px solid var(--b)',padding:'10px 14px',alignItems:'center',gap:10}}>
        <button onClick={()=>setSidebarOpen(v=>!v)} style={{width:34,height:34,borderRadius:8,border:'1px solid var(--b)',background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--tx)" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <span style={{fontFamily:'var(--font-sora)',fontSize:15,fontWeight:700}}>AskBiz</span>
        <button onClick={newChat} style={{marginLeft:'auto',width:34,height:34,borderRadius:8,border:'1px solid var(--b)',background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tx)" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

      <div style={{flex:1,display:'flex',flexDirection:'column'}} className="main-content">
        {children}
      </div>

      <nav className="mobile-bottom-nav" style={{display:'none',position:'fixed',bottom:0,left:0,right:0,zIndex:97,background:'var(--sf)',borderTop:'1px solid var(--b)',padding:'6px 0 8px'}}>
        <div style={{display:'flex',justifyContent:'space-around'}}>
          {[
            {id:'chat',href:'/chat',icon:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',label:'Chat'},
            {id:'dashboards',href:'/dashboards',icon:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',label:'Dash'},
            {id:'alerts',href:'/alerts',icon:'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9',label:'Alerts'},
            {id:'files',href:'/files',icon:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6',label:'Files'},
            {id:'billing',href:'/billing',icon:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',label:'Plan'},
          ].map(n=>{
            const active=pathname.startsWith(n.href)
            return(
              <Link key={n.id} href={n.href} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'4px 12px',textDecoration:'none',color:active?'var(--acc)':'var(--tx3)',fontSize:10,fontWeight:500}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={n.icon}/></svg>
                {n.label}
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}
