'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store'
import SettingsOverlay from './SettingsOverlay'

interface Props {
  user: { id:string; name:string; email:string; plan:string; currency:string; currencySymbol:string; bizType:string; region:string; sectorHints:string }
  conversations: Array<{ id:string; title:string; created_at:string }>
  children: React.ReactNode
}

const NAV = [
  { id:'chat',       href:'/chat',       label:'Chat',       icon:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id:'files',      href:'/files',      label:'Files',      icon:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
  { id:'dashboards', href:'/dashboards', label:'Dashboard',  icon:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { id:'expansion', href:'/expansion', label:'Expansion', icon:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id:'alerts',     href:'/alerts',     label:'Alerts',     icon:'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
  { id:'forecasts',  href:'/forecasts',  label:'Forecasts',  icon:'M22 12h-4l-3 9L9 3l-3 9H2' },
  { id:'templates',  href:'/templates',  label:'Templates',  icon:'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' },
  { id:'billing',    href:'/billing',    label:'Billing',    icon:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id:'sources',    href:'/sources',    label:'Sources',    icon:'M12 2c4.97 0 9 2.24 9 5s-4.03 5-9 5-9-2.24-9-5 4.03-5 9-5z M3 7c0 2.76 4.03 5 9 5s9-2.24 9-5 M3 12c0 2.76 4.03 5 9 5s9-2.24 9-5 M3 17c0 2.76 4.03 5 9 5s9-2.24 9-5' },
  { id:'admin',      href:'/admin',      label:'Admin',      icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
]

// Bottom nav shows only 5 most important items on mobile
const MOBILE_NAV = [
  { id:'chat',       href:'/chat',       label:'Chat',      icon:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id:'dashboards', href:'/dashboards', label:'Dashboard', icon:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { id:'alerts',     href:'/alerts',     label:'Alerts',    icon:'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
  { id:'files',      href:'/files',      label:'Files',     icon:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
  { id:'expansion',  href:'/expansion',  label:'Expand',    icon:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id:'billing',    href:'/billing',    label:'Billing',   icon:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
]

function isToday(s:string){const d=new Date(s),n=new Date();return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()&&d.getDate()===n.getDate()}

export default function AppShellClient({user,conversations,children}:Props){
  const pathname=usePathname(),router=useRouter(),supabase=createClient()
  const {setUser,updateSettings}=useStore()
  const [settingsOpen,setSettingsOpen]=useState(false)
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [geo,setGeo]=useState<{currency:string;region:string;trendTopics:string[];country:string}|null>(null)
  const [alertCount,setAlertCount]=useState(0)

  useEffect(()=>{
    setUser({id:user.id,name:user.name,email:user.email,plan:user.plan as 'starter'|'growth'|'business',initials:user.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2)})
    updateSettings({bizType:user.bizType as 'retail'|'ecommerce'|'distributor'|'exporter'})
  },[user,setUser,updateSettings])

  useEffect(()=>{
    fetch('/api/geo').then(r=>r.json()).then(d=>setGeo(d)).catch(()=>{})
    fetch('/api/alerts').then(r=>r.json()).then(d=>setAlertCount(Array.isArray(d)?d.filter((a:{is_active:boolean})=>a.is_active).length:0)).catch(()=>{})
  },[])

  // Close sidebar when navigating on mobile
  useEffect(()=>{ setSidebarOpen(false) },[pathname])

  const newChat=async()=>{
    const {data:{user:u}}=await supabase.auth.getUser()
    if(!u) return
    const {data:conv}=await supabase.from('conversations').insert({user_id:u.id,title:'New conversation'}).select().single()
    router.push(conv?`/chat/${conv.id}`:'/chat')
  }

  const initials=user.name.split(' ').map((n:string)=>n[0]).join('').toUpperCase().slice(0,2)
  const todayConvs=conversations.filter(c=>isToday(c.created_at))
  const olderConvs=conversations.filter(c=>!isToday(c.created_at))

  return(
    <div style={{display:'flex',height:'100vh',overflow:'hidden',position:'relative',zIndex:1}}>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div onClick={()=>setSidebarOpen(false)}
          style={{position:'fixed',inset:0,background:'rgba(4,8,15,.7)',zIndex:98,backdropFilter:'blur(4px)'}}/>
      )}

      {/* SIDEBAR */}
      <aside className="desktop-sidebar" style={{
        width:256, flexShrink:0, background:'var(--sf)', borderRight:'1px solid var(--b)',
        display:'flex', flexDirection:'column', height:'100vh',
        position:'fixed', left:0, top:0, bottom:0, zIndex:99,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition:'transform 280ms cubic-bezier(.16,1,.3,1)',
      }}
      // Show on desktop always
      id="sidebar">
        {/* Logo */}
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--b)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:9,textDecoration:'none',color:'var(--tx)'}}>
            <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#d08a59,#8c6fe0)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="#04080f" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
            </div>
            <span style={{fontFamily:'var(--font-sora)',fontSize:15,fontWeight:600,letterSpacing:'-.025em'}}>AskBiz</span>
          </Link>
          <button onClick={newChat} style={{width:30,height:30,borderRadius:7,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx2)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        {/* Nav */}
        <div style={{padding:'8px 10px',borderBottom:'1px solid var(--b)',display:'flex',flexDirection:'column',gap:2}}>
          {NAV.map(n=>{
            const active=pathname.startsWith(n.href)
            const badge=n.id==='alerts'&&alertCount>0
            return(
              <Link key={n.id} href={n.href} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 11px',borderRadius:10,textDecoration:'none',fontSize:14,fontWeight:500,transition:'all 130ms',background:active?'rgba(208,138,89,.1)':'transparent',color:active?'var(--acc)':'var(--tx2)',minHeight:40}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon}/></svg>
                {n.label}
                {badge&&<span style={{marginLeft:'auto',minWidth:18,height:18,borderRadius:9999,background:'var(--acc)',color:'#ffffff',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',padding:'0 5px'}}>{alertCount}</span>}
              </Link>
            )
          })}
        </div>

        {/* Search */}
        <div style={{padding:'8px 12px',borderBottom:'1px solid var(--b)'}}>
          <input placeholder="Search conversations…" style={{fontFamily:'inherit',fontSize:14,color:'var(--tx)',background:'var(--ev)',border:'1px solid var(--b2)',borderRadius:10,padding:'9px 12px',outline:'none',width:'100%'}}/>
        </div>

        {/* Conversations */}
        <div style={{flex:1,overflowY:'auto',padding:8}}>
          {todayConvs.length>0&&<><div style={{fontSize:11,fontWeight:500,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',padding:'7px 8px 4px'}}>Today</div>{todayConvs.map(c=><ConvItem key={c.id} conv={c} active={pathname.includes(c.id)}/>)}</>}
          {olderConvs.length>0&&<><div style={{fontSize:11,fontWeight:500,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'.08em',padding:'7px 8px 4px'}}>Earlier</div>{olderConvs.slice(0,20).map(c=><ConvItem key={c.id} conv={c} active={pathname.includes(c.id)}/>)}</>}
          {conversations.length===0&&<div style={{padding:'16px 10px',fontSize:13,color:'var(--tx3)',textAlign:'center'}}>No conversations yet</div>}
        </div>

        {/* Trends */}
        {geo?.trendTopics&&geo.trendTopics.length>0&&(
          <div style={{padding:'8px 12px',borderTop:'1px solid var(--b)'}}>
            <div style={{padding:'8px 10px',borderRadius:9,background:'rgba(140,111,224,.07)',border:'1px solid rgba(140,111,224,.2)',fontSize:11,color:'#8c6fe0'}}>
              <strong style={{fontWeight:500,display:'block',marginBottom:3}}>Trending in {geo.region?.split(',')[0]||'your region'}</strong>
              {geo.trendTopics.slice(0,2).join(' · ')}
            </div>
          </div>
        )}

        {/* User */}
        <div style={{padding:10,borderTop:'1px solid var(--b)'}}>
          <div onClick={()=>setSettingsOpen(true)} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:10,cursor:'pointer',minHeight:44}}
            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background='rgba(82,128,204,.07)'}
            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background='transparent'}>
            <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#d08a59,#8c6fe0)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600,color:'#ffffff',flexShrink:0}}>{initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user.name}</div>
              <div style={{fontSize:11,color:'var(--tx3)'}}>{user.plan} plan</div>
            </div>
            <div style={{padding:'3px 8px',borderRadius:9999,background:'rgba(208,138,89,.1)',border:'1px solid rgba(208,138,89,.25)',fontSize:12,color:'var(--acc)',flexShrink:0}}>{user.currency}</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{flex:1,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',minWidth:0,marginLeft:0}} id="main-content">

        {/* Mobile top bar */}
        <div style={{display:'none',height:54,padding:'0 16px',borderBottom:'1px solid var(--b)',background:'var(--sf)',alignItems:'center',justifyContent:'space-between',flexShrink:0,zIndex:10,position:'relative'}} id="mobile-topbar">
          <button onClick={()=>setSidebarOpen(!sidebarOpen)}
            style={{width:40,height:40,borderRadius:9,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none',color:'var(--tx)'}}>
            <div style={{width:26,height:26,borderRadius:7,background:'linear-gradient(135deg,#d08a59,#8c6fe0)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="11" height="11" viewBox="0 0 18 18" fill="none" stroke="#04080f" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
            </div>
            <span style={{fontFamily:'var(--font-sora)',fontSize:15,fontWeight:600}}>AskBiz</span>
          </Link>
          <button onClick={newChat}
            style={{width:40,height:40,borderRadius:9,border:'1px solid var(--b2)',background:'transparent',color:'var(--tx2)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}} className="main-content-area">
          {children}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">
        {MOBILE_NAV.map(n=>{
          const active=pathname.startsWith(n.href)
          const badge=n.id==='alerts'&&alertCount>0
          return(
            <Link key={n.id} href={n.href} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,flex:1,textDecoration:'none',color:active?'var(--acc)':'var(--tx3)',minHeight:60,fontSize:10,fontWeight:500,position:'relative',padding:'4px 0'}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active?2:1.6} strokeLinecap="round" strokeLinejoin="round"><path d={n.icon}/></svg>
              {n.label}
              {badge&&<span style={{position:'absolute',top:4,right:'50%',transform:'translateX(10px)',width:16,height:16,borderRadius:9999,background:'var(--acc)',color:'#ffffff',fontSize:9,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>{alertCount}</span>}
            </Link>
          )
        })}
      </nav>

      {settingsOpen&&<SettingsOverlay user={user} geo={geo} onClose={()=>setSettingsOpen(false)}/>}
    </div>
  )
}

function ConvItem({conv,active}:{conv:{id:string;title:string};active:boolean}){
  return(
    <Link href={`/chat/${conv.id}`} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:10,textDecoration:'none',fontSize:13,overflow:'hidden',whiteSpace:'nowrap',transition:'all 130ms',border:'1px solid transparent',background:active?'rgba(208,138,89,.08)':'transparent',color:active?'var(--acc)':'var(--tx2)',borderColor:active?'rgba(208,138,89,.2)':'transparent',minHeight:36}}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{flexShrink:0}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span style={{overflow:'hidden',textOverflow:'ellipsis',flex:1}}>{conv.title}</span>
    </Link>
  )
}
