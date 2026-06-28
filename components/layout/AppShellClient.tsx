'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'
import { useMotion } from '@/hooks/useMotion'
import HelpWidget from '@/components/help/HelpWidget'
import NotificationBell from '@/components/layout/NotificationBell'
import LanguageToggle from '@/components/LanguageToggle'

const PRIMARY_NAV = [
  { id: 'ask',        href: '/ask',          label: 'Ask',         icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { id: 'monitor',    href: '/intelligence', label: 'My Business', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5' },
  { id: 'pos',        href: '/pos',          label: 'POS',         icon: 'M2 3h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3z M8 21h8M12 17v4' },
]

const MORE_NAV = [
  { id: 'tools',      href: '/tools',      label: 'Intelligence',        icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 0-2-2V9m0 0h18' },
  { id: 'forecasts',  href: '/forecasts',  label: 'Forecasts',          icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { id: 'expansion',  href: '/expansion',  label: 'Find new products',  icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
  { id: 'sources',    href: '/sources',    label: 'Connect data',       icon: 'M12 2c4.97 0 9 2.24 9 5s-4.03 5-9 5-9-2.24-9-5 4.03-5 9-5z M3 7c0 2.76 4.03 5 9 5s9-2.24 9-5 M3 12c0 2.76 4.03 5 9 5s9-2.24 9-5 M3 17c0 2.76 4.03 5 9 5s9-2.24 9-5' },
  { id: 'files',      href: '/files',      label: 'My files',           icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6' },
  { id: 'alerts',     href: '/alerts',     label: 'Alerts',             icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
  { id: 'templates',  href: '/templates',  label: 'Templates',          icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' },
  { id: 'billing',    href: '/billing',    label: 'Upgrade plan',       icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { id: 'settings',   href: '/settings',   label: 'Settings',           icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
]

// ── Shared colour tokens (matching globals.css) ───────────────────────────────
const ACC  = '#d08a59'          // --acc  terracotta — primary brand
const ACC_BG  = 'rgba(208,138,89,.1)'
const ACC_BG2 = 'rgba(208,138,89,.06)'
const ACC_BORDER = 'rgba(208,138,89,.25)'
// Ask feature keeps indigo — it's a distinct conversational mode
const ASK  = '#6366F1'
const ASK_BG = 'rgba(99,102,241,.1)'

function ConvItem({ conv, active }: { conv: { id: string; title?: string }; active: boolean }) {
  const { lang } = useLang()
  return (
    <Link
      href={localePath('/ask/' + conv.id, lang)}
      style={{
        display: 'block',
        padding: '6px 9px',
        borderRadius: 7,
        textDecoration: 'none',
        fontSize: 12,
        color: active ? 'var(--tx)' : 'var(--tx2)',
        background: active ? 'var(--ev)' : 'transparent',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'background 120ms',
        marginBottom: 1,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--ev)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {conv.title || 'New conversation'}
    </Link>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 40, height: 22, borderRadius: 11,
        // Use terracotta for on-state instead of indigo
        background: value ? ACC : 'var(--b2)',
        cursor: 'pointer', position: 'relative',
        transition: 'background 200ms', flexShrink: 0,
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2, left: value ? 20 : 2,
        transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }}/>
    </div>
  )
}

function ProfilePanel({ user, onClose, onSignOut }: {
  user: { name: string; email: string; plan: string }
  onClose: () => void
  onSignOut: () => void
}) {
  const router = useRouter()
  const { lang } = useLang()
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeFollowUps, setIncludeFollowUps] = useState(true)

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(0,0,0,.35)' }}/>
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: 288, zIndex: 200,
        background: 'var(--sf)', borderTopRightRadius: 20,
        borderTop: '1px solid var(--b)', borderRight: '1px solid var(--b)',
        maxHeight: '92vh', overflowY: 'auto',
        boxShadow: '4px -4px 48px rgba(0,0,0,.15)',
      }}>
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--b)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
            {/* Avatar — terracotta not indigo */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: ACC,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {/* Plan badge — terracotta not indigo */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 9999,
            background: ACC_BG, border: `1px solid ${ACC_BORDER}`,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACC }}/>
            <span style={{ fontSize: 11, fontWeight: 600, color: ACC, textTransform: 'capitalize' }}>
              {user.plan} Plan
            </span>
          </div>
        </div>

        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--b)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
            AI response style
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--tx2)', flex: 1, paddingRight: 10 }}>Show charts and graphs</span>
            <Toggle value={includeCharts} onChange={() => setIncludeCharts(v => !v)}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--tx2)', flex: 1, paddingRight: 10 }}>Show follow-up suggestions</span>
            <Toggle value={includeFollowUps} onChange={() => setIncludeFollowUps(v => !v)}/>
          </div>
        </div>

        <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onSignOut}
            style={{ padding: '10px', borderRadius: 11, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}
          >
            Sign out
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, paddingTop: 4 }}>
            <a href={localePath('/privacy', lang)} style={{ fontSize: 11, color: 'var(--tx3)', textDecoration: 'none' }}>Privacy</a>
            <a href={localePath('/terms', lang)} style={{ fontSize: 11, color: 'var(--tx3)', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default function AppShellClient({ user, conversations, children }: {
  user: { id: string; name: string; email: string; plan: string; bizType?: string; currency?: string; currencySymbol?: string; region?: string; sectorHints?: string }
  conversations: { id: string; title?: string; created_at: string }[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { setUser, updateSettings } = useStore()
  const { tc, lang } = useLang()
  const [profileOpen, setProfileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('sidebar_collapsed') === '1'
    return false
  })
  const [alertCount, setAlertCount] = useState(0)
  const [search, setSearch] = useState('')
  const [convOpen, setConvOpen] = useState(true)

  const toggleCollapsed = () => {
    setCollapsed(v => {
      const next = !v
      localStorage.setItem('sidebar_collapsed', next ? '1' : '0')
      return next
    })
  }

  const isAdmin = user?.email === 'emomery10@gmail.com' || user?.email === 'emomery10@googlemail.com'
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  useEffect(() => {
    setUser({ id: user.id, name: user.name, email: user.email, plan: user.plan as any, initials })
    updateSettings({ bizType: user.bizType as any })
  }, [user, setUser, updateSettings, initials])

  useEffect(() => {
    fetch('/api/alerts').then(r => r.json()).then(d => setAlertCount(Array.isArray(d) ? d.filter((a: { is_active: boolean }) => a.is_active).length : 0)).catch(() => {})
  }, [])

  useEffect(() => { setSidebarOpen(false); setMoreOpen(false) }, [pathname])
  useMotion()

  const signOut = async () => { await supabase.auth.signOut(); router.push('/') }
  const newChat = () => router.push('/ask')

  const today = new Date().toDateString()
  const filtered = conversations.filter(c => !search || c.title?.toLowerCase().includes(search.toLowerCase()))
  const todayConvs = filtered.filter(c => new Date(c.created_at).toDateString() === today)
  const olderConvs = filtered.filter(c => new Date(c.created_at).toDateString() !== today)

  // Nav item active colour — Ask uses indigo (conversational mode), everything else terracotta
  const navActiveColor = (id: string) => id === 'ask' ? ASK : ACC
  const navActiveBg    = (id: string) => id === 'ask' ? ASK_BG : ACC_BG

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-dm, DM Sans)' }}>

      {/* Desktop collapsed bar — hamburger + logo when sidebar is collapsed */}
      <div
        className="desktop-collapsed-bar"
        style={{
          position: 'fixed', top: 0, left: 0, width: 52, height: '100vh',
          background: 'var(--sf)', borderRight: '1px solid var(--b)',
          display: collapsed ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center',
          paddingTop: 12, gap: 8, zIndex: 99,
        }}
      >
        <button
          onClick={toggleCollapsed}
          title="Expand sidebar"
          style={{ width: 36, height: 36, borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ev)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tx)" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <Link href={localePath('/home', lang)} title="Home" aria-label="AskBiz home" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
              <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
              <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
              <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
              <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>
        <NotificationBell />
      </div>

      <aside
        className={`desktop-sidebar ${collapsed ? 'desktop-sidebar-collapsed' : ''}`}
        id="sidebar"
        style={{
          width: 240, flexShrink: 0, background: 'var(--sf)',
          borderRight: '1px solid var(--b)',
          display: 'flex', flexDirection: 'column',
          height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0,
          zIndex: 99,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 280ms var(--ease)',
        }}
      >
        {/* Logo row */}
        <div style={{ padding: '14px 12px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <Link href={localePath('/home', lang)} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', color: 'var(--tx)', minWidth: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.45"/>
                <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.7"/>
                <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
                <path d="M21 7 L24 3 L27 7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 700, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>AskBiz</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
            <NotificationBell />
            <button
              onClick={toggleCollapsed}
              title="Collapse sidebar"
              className="collapse-btn"
              style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--ev)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Tab switcher — Home / Ask / Business (like Claude's Chat/Cowork/Code) */}
        <div style={{ display: 'flex', gap: 2, padding: '0 10px 10px', flexShrink: 0 }}>
          {PRIMARY_NAV.map(n => {
            const active = pathname.startsWith(n.href) || (n.id === 'home' && pathname === '/home')
            const activeColor = navActiveColor(n.id)
            return (
              <Link
                key={n.id}
                href={localePath(n.href, lang)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '7px 4px', borderRadius: 8,
                  textDecoration: 'none', fontSize: 12, fontWeight: active ? 600 : 500,
                  color: active ? activeColor : 'var(--tx3)',
                  background: active ? 'var(--sf)' : 'transparent',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,.08), 0 0 0 1px var(--b)' : 'none',
                  transition: 'all 120ms',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--ev)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={n.icon}/>
                </svg>
                {n.id === 'monitor' ? tc('appnav.monitor_short') : tc('appnav.' + n.id)}
                {n.id === 'monitor' && alertCount > 0 && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}/>
                )}
              </Link>
            )
          })}
        </div>

        {/* Nav list — New question / Business Tools / Dashboard / Forecasts / More */}
        <div style={{ padding: '0 8px 4px', flexShrink: 0 }}>
          {/* New question */}
          <button
            onClick={newChat}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--tx2)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', width: '100%', marginBottom: 2, transition: 'background 120ms' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--ev)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {tc('appnav.new_question')}
          </button>

          {/* Business Tools */}
          {MORE_NAV.filter(n => ['tools'].includes(n.id)).map(n => {
            const active = pathname.startsWith(n.href)
            return (
              <Link
                key={n.id}
                href={localePath(n.href, lang)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '9px 10px', borderRadius: 10,
                  textDecoration: 'none', fontSize: 13, fontWeight: 500,
                  background: active ? ACC_BG : 'transparent',
                  color: active ? ACC : 'var(--tx2)',
                  marginBottom: 2, transition: 'all 120ms',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--ev)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d={n.icon}/>
                </svg>
                {tc('appnav.' + n.id)}
              </Link>
            )
          })}

          {/* More */}
          <button
            onClick={() => setMoreOpen(v => !v)}
            aria-expanded={moreOpen}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--tx3)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', width: '100%', marginTop: 2, transition: 'background 120ms' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--ev)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
            {tc('appnav.more')}
          </button>
        </div>

        {/* More expanded */}
        {moreOpen && (
          <div style={{ padding: '0 8px 4px', maxHeight: 260, overflowY: 'auto' }}>
            {MORE_NAV.filter(n => !['tools'].includes(n.id)).map(n => {
              const active = pathname.startsWith(n.href)
              return (
                <Link
                  key={n.id}
                  href={localePath(n.href, lang)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 10px', borderRadius: 8,
                    textDecoration: 'none', fontSize: 12, fontWeight: 400,
                    background: active ? ACC_BG2 : 'transparent',
                    color: active ? ACC : 'var(--tx3)',
                    marginBottom: 1, transition: 'all 120ms',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--ev)' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d={n.icon}/>
                  </svg>
                  {tc('appnav.' + n.id)}
                </Link>
              )
            })}
            {isAdmin && (
              <Link href={localePath('/admin', lang)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 8, textDecoration: 'none', fontSize: 12, color: 'var(--tx3)', marginBottom: 1 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
                {tc('appnav.admin')}
              </Link>
            )}
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--b)', margin: '4px 0', flexShrink: 0 }}/>

        {/* Search */}
        <div style={{ padding: '6px 8px', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tc('appnav.search_placeholder')}
              style={{ fontFamily: 'inherit', fontSize: 12, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 8, padding: '6px 8px 6px 26px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* History header */}
        <div
          onClick={() => setConvOpen(v => !v)}
          style={{ padding: '5px 10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ev)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{tc('appnav.history')}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'transform 200ms', transform: convOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>

        {/* Conversation list */}
        <div style={{ flex: convOpen ? 1 : 0, minHeight: 0, overflow: 'hidden', transition: 'flex 250ms ease' }}>
          <div style={{ height: '100%', overflowY: 'auto', padding: '3px 7px' }}>
            {todayConvs.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', padding: '3px 5px 2px' }}>{tc('appnav.today')}</div>
                {todayConvs.map(c => <ConvItem key={c.id} conv={c} active={pathname.includes(c.id)}/>)}
              </>
            )}
            {olderConvs.length > 0 && (
              <>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', padding: '5px 5px 2px' }}>{tc('appnav.earlier')}</div>
                {olderConvs.slice(0, 30).map(c => <ConvItem key={c.id} conv={c} active={pathname.includes(c.id)}/>)}
              </>
            )}
            {conversations.length === 0 && (
              <div style={{ padding: '12px 8px', fontSize: 12, color: 'var(--tx3)', textAlign: 'center' }}>{tc('appnav.no_conversations')}</div>
            )}
          </div>
        </div>

        {/* User row — avatar + compact language toggle */}
        <div style={{ padding: '4px 8px 10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div
              onClick={() => setProfileOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 9, cursor: 'pointer', transition: 'background 150ms', flex: 1, minWidth: 0 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--ev)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sora)' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx3)', textTransform: 'capitalize' }}>{user.plan} plan</div>
              </div>
            </div>
            <LanguageToggle compact />
          </div>
        </div>
      </aside>

      {profileOpen && <ProfilePanel user={user} onClose={() => setProfileOpen(false)} onSignOut={signOut}/>}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,.4)' }}
          className="mobile-only"
        />
      )}

      {/* Mobile top bar — just the hamburger icon, no background/bar */}
      <div
        className="mobile-header"
        id="mobile-topbar"
        style={{ display: 'none', position: 'fixed', top: 12, left: 12, zIndex: 97 }}
      >
        <button
          onClick={() => setSidebarOpen(v => !v)}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tx)" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className={`main-content ${collapsed ? 'main-content-collapsed' : ''}`}>
        {children}
      </div>

      {/* Mobile bottom tab bar — Ask / My Business / POS */}
      <nav
        className="mobile-bottom-nav"
        aria-label="Primary navigation"
        style={{ display: 'none', height: 60, alignItems: 'stretch' }}
      >
        {PRIMARY_NAV.map(n => {
          const active = pathname.startsWith(n.href)
          const activeColor = navActiveColor(n.id)
          return (
            <Link
              key={n.id}
              href={localePath(n.href, lang)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, textDecoration: 'none',
                color: active ? activeColor : 'var(--tx3)',
                fontSize: 10, fontWeight: active ? 600 : 400,
                transition: 'color 120ms',
                fontFamily: 'var(--font-dm)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d={n.icon}/>
              </svg>
              <span>{n.id === 'monitor' ? tc('appnav.monitor_short') : tc('appnav.' + n.id)}</span>
            </Link>
          )
        })}
      </nav>
      <HelpWidget />
    </div>
  )
}
