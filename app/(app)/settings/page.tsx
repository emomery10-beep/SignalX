'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store'
import { CURRENCIES } from '@/lib/geo'
import { PLAN_FEATURES, getPlanFeatures } from '@/lib/plans'
import ApiKeys from '@/components/settings/ApiKeys'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ConsentState {
  data_consent: boolean
  training_consent: boolean
  data_consent_at: string | null
  training_consent_at: string | null
}

interface AddressState {
  business_name: string
  phone: string
  address: string
  town: string
  county: string
  postcode: string
}

interface TeamMember {
  id: string
  email: string
  name: string
  role: string
  status: 'pending' | 'active' | 'removed'
  invited_at: string
}

interface ConnectedSource {
  id: string
  source_type: string
  name: string
  status: string
  last_synced_at: string | null
  sync_interval_minutes: number
  error_message: string | null
  created_at: string
}

type Section = 'profile' | 'team' | 'localisation' | 'address' | 'integrations' | 'ai' | 'notifications' | 'api' | 'privacy' | 'compliance' | 'account'

// ── Nav ───────────────────────────────────────────────────────────────────────

const NAV: { id: Section; label: string; icon: string }[] = [
  { id: 'profile',      label: 'Profile',           icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { id: 'team',         label: 'Team',              icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
  { id: 'localisation', label: 'Localisation',      icon: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' },
  { id: 'address',      label: 'Business address',  icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { id: 'integrations', label: 'Integrations',      icon: 'M12 2c4.97 0 9 2.24 9 5s-4.03 5-9 5-9-2.24-9-5 4.03-5 9-5z M3 12c0 2.76 4.03 5 9 5s9-2.24 9-5 M3 17c0 2.76 4.03 5 9 5s9-2.24 9-5 M3 7v10' },
  { id: 'ai',            label: 'AI preferences',    icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5' },
  { id: 'notifications', label: 'Notifications',     icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
  { id: 'api',           label: 'API access',        icon: 'M8 9l3 3-3 3 M13 15h3 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
  { id: 'privacy',      label: 'Privacy & data',    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'compliance',   label: 'Compliance',        icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
  { id: 'account',      label: 'Account',           icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' },
]

// ── Shared primitives ─────────────────────────────────────────────────────────

function Toggle({ value, onChange, color = 'var(--acc)', disabled = false }: { value: boolean; onChange: () => void; color?: string; disabled?: boolean }) {
  return (
    <div
      role="switch" aria-checked={value}
      onClick={() => !disabled && onChange()}
      style={{ width: 44, height: 26, borderRadius: 13, background: value ? color : 'var(--b2)', cursor: disabled ? 'not-allowed' : 'pointer', position: 'relative', transition: 'background 200ms', flexShrink: 0, opacity: disabled ? .5 : 1 }}
    >
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: value ? 20 : 2, transition: 'left 200ms', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }}/>
    </div>
  )
}

function SettingRow({ label, description, right, border = true, top = false }: { label: string; description?: string; right: React.ReactNode; border?: boolean; top?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 24, padding: '16px 20px', borderBottom: border ? '1px solid var(--b)' : 'none' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)', marginBottom: description ? 3 : 0 }}>{label}</div>
        {description && <div style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5 }}>{description}</div>}
      </div>
      {right}
    </div>
  )
}

function Card({ children, danger = false }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div style={{ background: 'var(--sf)', border: `1px solid ${danger ? 'rgba(220,38,38,.15)' : 'var(--b)'}`, borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 16 }}>
      {children}
    </div>
  )
}

function CardHeader({ title, danger = false }: { title: string; danger?: boolean }) {
  return (
    <div style={{ padding: '13px 20px', borderBottom: `1px solid ${danger ? 'rgba(220,38,38,.1)' : 'var(--b)'}`, fontSize: 11, fontWeight: 700, color: danger ? '#dc2626' : 'var(--tx3)', textTransform: 'uppercase' as const, letterSpacing: '.07em' }}>
      {title}
    </div>
  )
}

function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: 20, fontWeight: 700, color: 'var(--tx)', margin: '0 0 6px' }}>{title}</h2>
      <p style={{ fontSize: 14, color: 'var(--tx3)', margin: 0, lineHeight: 1.5 }}>{description}</p>
    </div>
  )
}

function SaveRow({ onClick, saving, saved, label = 'Save changes' }: { onClick: () => void; saving: boolean; saved: boolean; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={onClick} disabled={saving}
        style={{ padding: '10px 22px', borderRadius: 'var(--r-md)', background: 'var(--acc)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1, boxShadow: '0 2px 8px rgba(208,138,89,.25)', transition: 'opacity 150ms' }}
      >
        {saving ? 'Saving…' : label}
      </button>
      {saved && (
        <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          Saved
        </span>
      )}
    </div>
  )
}

function UpgradeBadge({ plan }: { plan: string }) {
  return (
    <a href="/billing" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--rf)', background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.2)', fontSize: 11, fontWeight: 600, color: 'var(--acc)', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
      Upgrade to {plan}
    </a>
  )
}

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 14,
  background: 'var(--bg)', border: '1px solid var(--b2)',
  borderRadius: 'var(--r-md)', color: 'var(--tx)',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  transition: 'border-color 150ms',
}

const sel: React.CSSProperties = {
  fontFamily: 'inherit', fontSize: 13, color: 'var(--tx)',
  background: 'var(--ev)', border: '1px solid var(--b2)',
  borderRadius: 'var(--r-md)', padding: '7px 10px', outline: 'none', cursor: 'pointer',
}

// ── SOURCE ICONS ─────────────────────────────────────────────────────────────

const SOURCE_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  // E-Commerce
  shopify:          { label: 'Shopify',            color: '#95bf47', bg: 'rgba(149,191,71,.1)',  icon: '🛍️' },
  amazon_fba:       { label: 'Amazon FBA',         color: '#ff9900', bg: 'rgba(255,153,0,.1)',   icon: '📦' },
  ebay:             { label: 'eBay',               color: '#e53238', bg: 'rgba(229,50,56,.1)',   icon: '🏷️' },
  etsy:             { label: 'Etsy',               color: '#f1641e', bg: 'rgba(241,100,30,.1)',  icon: '🧶' },
  woocommerce:      { label: 'WooCommerce',        color: '#7f54b3', bg: 'rgba(127,84,179,.1)',  icon: '🛒' },
  walmart:          { label: 'Walmart',            color: '#0071ce', bg: 'rgba(0,113,206,.1)',   icon: '🏪' },
  // Accounting
  quickbooks:       { label: 'QuickBooks',         color: '#2ca02c', bg: 'rgba(44,160,44,.1)',   icon: '📒' },
  xero:             { label: 'Xero',               color: '#13b5ea', bg: 'rgba(19,181,234,.1)',  icon: '📘' },
  sage:             { label: 'Sage',               color: '#00b050', bg: 'rgba(0,176,80,.1)',    icon: '💚' },
  freeagent:        { label: 'FreeAgent',          color: '#f26a21', bg: 'rgba(242,106,33,.1)',  icon: '🟠' },
  wave:             { label: 'Wave',               color: '#1e88e5', bg: 'rgba(30,136,229,.1)',  icon: '🌊' },
  // Payments
  stripe:           { label: 'Stripe',             color: '#635bff', bg: 'rgba(99,91,255,.1)',   icon: '💳' },
  paypal:           { label: 'PayPal',             color: '#0070e0', bg: 'rgba(0,112,224,.1)',   icon: '🅿️' },
  gocardless:       { label: 'GoCardless',         color: '#f46a35', bg: 'rgba(244,106,53,.1)',  icon: '🏦' },
  klarna:           { label: 'Klarna',             color: '#ff6b8a', bg: 'rgba(255,107,138,.1)', icon: '🌸' },
  sumup:            { label: 'SumUp',              color: '#1a1a2e', bg: 'rgba(26,26,46,.08)',   icon: '💵' },
  // Marketing & Ads
  meta_ads:         { label: 'Meta Ads',           color: '#0081fb', bg: 'rgba(0,129,251,.1)',   icon: '📣' },
  google_ads:       { label: 'Google Ads',         color: '#4285f4', bg: 'rgba(66,133,244,.1)',  icon: '🎯' },
  google_analytics: { label: 'Google Analytics',   color: '#e8710a', bg: 'rgba(232,113,10,.1)',  icon: '📈' },
  klaviyo:          { label: 'Klaviyo',            color: '#6c47ff', bg: 'rgba(108,71,255,.1)',  icon: '📧' },
  mailchimp:        { label: 'Mailchimp',          color: '#f0b429', bg: 'rgba(240,180,41,.15)', icon: '🐒' },
  // Social Commerce
  tiktok_shop:      { label: 'TikTok Shop',        color: '#010101', bg: 'rgba(1,1,1,.06)',      icon: '🎵' },
  instagram:        { label: 'Instagram Shopping', color: '#E1306C', bg: 'rgba(225,48,108,.06)', icon: '📸' },
  pinterest:        { label: 'Pinterest',          color: '#E60023', bg: 'rgba(230,0,35,.06)',   icon: '📌' },
  // Inventory & Logistics
  linnworks:        { label: 'Linnworks',          color: '#e84545', bg: 'rgba(232,69,69,.1)',   icon: '🗂️' },
  cin7:             { label: 'Cin7',               color: '#ff6b35', bg: 'rgba(255,107,53,.1)',  icon: '🏭' },
  shipstation:      { label: 'ShipStation',        color: '#3a6eb5', bg: 'rgba(58,110,181,.1)',  icon: '🚚' },
  royal_mail:       { label: 'Royal Mail',         color: '#e2001a', bg: 'rgba(226,0,26,.1)',    icon: '📮' },
  // Point of Sale
  square:           { label: 'Square',             color: '#3d3d3d', bg: 'rgba(100,100,100,.08)',icon: '⬛' },
  // Data
  google_sheets:    { label: 'Google Sheets',      color: '#34a853', bg: 'rgba(52,168,83,.1)',   icon: '📊' },
}

function sourceMeta(type: string) {
  return SOURCE_META[type] || { label: type, color: 'var(--tx2)', bg: 'var(--ev)', icon: '🔗' }
}

// ── PANELS ────────────────────────────────────────────────────────────────────

function ProfilePanel({ onSignOut }: { onSignOut: () => void }) {
  const { user } = useStore()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d && !d.error) {
        setFirstName(d.first_name || '')
        setLastName(d.last_name  || '')
      }
    })
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ first_name: firstName.trim(), last_name: lastName.trim() }) })
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } finally { setSaving(false) }
  }

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div>
      <PanelHeader title="Profile" description="Update your display name and view your account details."/>

      {/* Avatar + info */}
      <Card>
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--b)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{user.name || '—'}</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{user.email}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 'var(--rf)', background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.2)' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--acc)' }}/>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--acc)', textTransform: 'capitalize' }}>{user.plan} plan</span>
          </div>
        </div>

        {/* Name editing */}
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>First name</label>
            <input style={inp} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name"/>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Last name</label>
            <input style={inp} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name"/>
          </div>
        </div>
        <div style={{ padding: '0 20px 16px' }}>
          <SaveRow onClick={save} saving={saving} saved={saved} label="Update name"/>
        </div>
      </Card>

      {/* Sign-in methods */}
      <Card>
        <CardHeader title="Sign-in methods"/>
        <SettingRow label="Google" description="Sign in with your Google account" right={<span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 'var(--rf)', background: 'rgba(34,197,94,.08)', color: '#16a34a', fontWeight: 600, border: '1px solid rgba(34,197,94,.2)' }}>Connected</span>}/>
        <SettingRow label="Email magic link" description="Sign in with a one-time link sent to your email" border={false} right={<span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 'var(--rf)', background: 'rgba(34,197,94,.08)', color: '#16a34a', fontWeight: 600, border: '1px solid rgba(34,197,94,.2)' }}>Connected</span>}/>
      </Card>

      <button
        onClick={onSignOut}
        style={{ width: '100%', padding: '11px', borderRadius: 'var(--r-md)', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500 }}
      >
        Sign out
      </button>
    </div>
  )
}

function TeamPanel() {
  const { user } = useStore()
  const plan = user.plan as 'free' | 'growth' | 'business'
  const features = getPlanFeatures(plan)
  const maxMembers = features.team_members   // 1 = solo, 5 = business, -1 = unlimited
  const canInvite = maxMembers === -1 || maxMembers > 1

  const [members, setMembers] = useState<TeamMember[]>([])
  const [roles, setRoles]     = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName]   = useState('')
  const [inviteRole, setInviteRole]   = useState('analyst')
  const [inviting, setInviting]       = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')

  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(d => {
      setMembers(d.members || [])
      setRoles(d.roles || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const invite = async () => {
    if (!inviteEmail.trim()) return
    setInviting(true); setInviteError(''); setInviteSuccess('')
    try {
      const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole, name: inviteName.trim() || undefined }) })
      const data = await res.json()
      if (!res.ok) { setInviteError(data.error); return }
      setInviteSuccess(data.message)
      setInviteEmail(''); setInviteName('')
      setMembers(m => [...m, data.member])
    } catch { setInviteError('Failed to send invite') }
    finally { setInviting(false) }
  }

  const changeRole = async (id: string, role: string) => {
    await fetch('/api/team', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role }) })
    setMembers(m => m.map(mb => mb.id === id ? { ...mb, role } : mb))
  }

  const removeMember = async (id: string) => {
    if (!confirm('Remove this team member? They will lose access immediately.')) return
    await fetch('/api/team', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'removed' }) })
    setMembers(m => m.filter(mb => mb.id !== id))
  }

  const activeCount = members.filter(m => m.status === 'active').length + 1  // +1 for owner
  const pendingCount = members.filter(m => m.status === 'pending').length

  const ROLE_DESC: Record<string, string> = {
    owner:      'Full access',
    admin:      'Read, write, invite',
    analyst:    'Read & write',
    accountant: 'Read & financial data',
    buyer:      'Read & inventory',
    viewer:     'Read only',
  }

  return (
    <div>
      <PanelHeader title="Team" description="Invite colleagues and manage their roles and permissions."/>

      {!canInvite ? (
        <Card>
          <div style={{ padding: '28px 24px', textAlign: 'center' as const }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>👥</div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Team collaboration is a Business feature</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.6 }}>Invite up to 5 team members with role-based access — analysts, accountants, buyers, and more.</div>
            <a href="/billing" style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 'var(--r-md)', background: 'var(--acc)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sora)', boxShadow: '0 2px 8px rgba(208,138,89,.25)' }}>
              Upgrade to Business →
            </a>
          </div>
        </Card>
      ) : (
        <>
          {/* Usage bar */}
          <Card>
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--tx2)' }}>
                <span style={{ fontWeight: 600, color: 'var(--tx)' }}>{activeCount}</span> of <span style={{ fontWeight: 600, color: 'var(--tx)' }}>{maxMembers === -1 ? '∞' : maxMembers}</span> seats used
                {pendingCount > 0 && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--tx3)' }}>· {pendingCount} invite{pendingCount > 1 ? 's' : ''} pending</span>}
              </div>
              {maxMembers !== -1 && (
                <div style={{ width: 120, height: 4, background: 'var(--ev)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((activeCount / maxMembers) * 100, 100)}%`, background: activeCount >= maxMembers ? '#d97706' : 'var(--acc)', borderRadius: 2, transition: 'width 300ms' }}/>
                </div>
              )}
            </div>
          </Card>

          {/* Invite form */}
          <Card>
            <CardHeader title="Invite a team member"/>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Email *</label>
                  <input style={inp} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" type="email" onKeyDown={e => e.key === 'Enter' && invite()}/>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Name (optional)</label>
                  <input style={inp} value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Jane Smith"/>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 8 }}>Role</label>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                  {roles.filter(r => r !== 'owner').map(r => (
                    <button
                      key={r}
                      onClick={() => setInviteRole(r)}
                      style={{ padding: '7px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: inviteRole === r ? 600 : 400, border: inviteRole === r ? '1.5px solid var(--acc)' : '1px solid var(--b2)', background: inviteRole === r ? 'rgba(208,138,89,.08)' : 'var(--sf)', color: inviteRole === r ? 'var(--acc)' : 'var(--tx2)', textAlign: 'left' as const }}
                    >
                      <div style={{ textTransform: 'capitalize' as const }}>{r}</div>
                      <div style={{ fontSize: 10, color: 'var(--tx3)', fontWeight: 400, marginTop: 1 }}>{ROLE_DESC[r]}</div>
                    </button>
                  ))}
                </div>
              </div>
              {inviteError && <div style={{ fontSize: 12, color: '#dc2626', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.15)', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>{inviteError}</div>}
              {inviteSuccess && <div style={{ fontSize: 12, color: '#16a34a', background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 8, padding: '8px 12px', marginBottom: 10 }}>✓ {inviteSuccess}</div>}
              <button
                onClick={invite} disabled={inviting || !inviteEmail.trim() || activeCount >= maxMembers}
                style={{ padding: '10px 20px', borderRadius: 'var(--r-md)', background: 'var(--acc)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: (inviting || !inviteEmail.trim() || activeCount >= maxMembers) ? 'not-allowed' : 'pointer', opacity: (inviting || !inviteEmail.trim() || activeCount >= maxMembers) ? .6 : 1, boxShadow: '0 2px 8px rgba(208,138,89,.2)' }}
              >
                {inviting ? 'Sending invite…' : 'Send invite'}
              </button>
            </div>
          </Card>

          {/* Member list */}
          {!loading && members.length > 0 && (
            <Card>
              <CardHeader title="Members"/>
              {/* Owner row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--b)' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {(useStore.getState().user.name || '?')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{useStore.getState().user.name || 'You'}</div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{useStore.getState().user.email}</div>
                </div>
                <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 'var(--rf)', background: 'rgba(208,138,89,.1)', color: 'var(--acc)', fontWeight: 600, border: '1px solid rgba(208,138,89,.2)' }}>Owner</span>
              </div>
              {members.map((mb, i) => (
                <div key={mb.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: i < members.length - 1 ? '1px solid var(--b)' : 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--ev)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--tx2)', flexShrink: 0 }}>
                    {(mb.name || mb.email)[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mb.name || mb.email}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mb.email}</div>
                  </div>
                  {mb.status === 'pending' && (
                    <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 'var(--rf)', background: 'rgba(245,158,11,.1)', color: '#d97706', fontWeight: 600, border: '1px solid rgba(245,158,11,.2)', flexShrink: 0 }}>Pending</span>
                  )}
                  <select
                    value={mb.role}
                    onChange={e => changeRole(mb.id, e.target.value)}
                    style={{ ...sel, fontSize: 12, flexShrink: 0 }}
                  >
                    {roles.filter(r => r !== 'owner').map(r => <option key={r} value={r} style={{ textTransform: 'capitalize' }}>{r}</option>)}
                  </select>
                  <button
                    onClick={() => removeMember(mb.id)}
                    style={{ fontSize: 12, color: '#dc2626', background: 'transparent', border: '1px solid rgba(220,38,38,.2)', borderRadius: 'var(--r-md)', padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </Card>
          )}
          {!loading && members.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center' as const, background: 'var(--ev)', borderRadius: 'var(--r-lg)', color: 'var(--tx3)', fontSize: 13 }}>
              No team members yet. Invite your first colleague above.
            </div>
          )}
        </>
      )}
    </div>
  )
}

function LocalisationPanel() {
  const { settings, updateSettings } = useStore()
  const [currency, setCurrency] = useState('USD')
  const [bizType, setBizType]   = useState(settings.bizType)
  const [lang, setLang]         = useState('en')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d && !d.error) {
        if (d.currency)      setCurrency(d.currency)
        if (d.business_type) setBizType(d.business_type)
      }
    })
    const l = localStorage.getItem('askbiz-lang')
    if (l) setLang(l)
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currency, currency_symbol: CURRENCIES[currency]?.sym || '$', business_type: bizType }) })
      updateSettings({ bizType: bizType as 'retail' | 'ecommerce' | 'distributor' | 'exporter' })
      localStorage.setItem('askbiz-lang', lang)
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PanelHeader title="Localisation" description="Set your currency, business type and language. These shape how AskBiz presents data and answers."/>

      <Card>
        <CardHeader title="Regional"/>
        <SettingRow label="Currency" description="Used in all AI answers, charts and tools" right={<select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...sel, minWidth: 160 }}>{Object.entries(CURRENCIES).map(([code, c]) => <option key={code} value={code}>{c.flag} {code} — {c.name.split(' ').slice(0, 2).join(' ')}</option>)}</select>}/>
        <SettingRow label="Language" description="Language for the AskBiz interface" border={false} right={<select value={lang} onChange={e => setLang(e.target.value)} style={sel}><option value="en">English</option><option value="fr">Français</option><option value="es">Español</option><option value="de">Deutsch</option><option value="ar">العربية</option><option value="sw">Kiswahili</option><option value="pt">Português</option></select>}/>
      </Card>

      <Card>
        <CardHeader title="Business"/>
        <SettingRow label="Business type" description="Shapes how AskBiz frames answers and recommendations" border={false} right={<select value={bizType} onChange={e => setBizType(e.target.value as any)} style={{ ...sel, minWidth: 160 }}><option value="retail">Retail / shop</option><option value="ecommerce">Ecommerce</option><option value="distributor">Distributor</option><option value="exporter">Exporter</option></select>}/>
      </Card>

      <SaveRow onClick={save} saving={saving} saved={saved}/>
    </div>
  )
}

function AddressPanel() {
  const [address, setAddress] = useState<AddressState>({ business_name: '', phone: '', address: '', town: '', county: '', postcode: '' })
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [errors, setErrors]   = useState<Partial<Record<keyof AddressState, string>>>({})
  const [loaded, setLoaded]   = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d && !d.error) setAddress({ business_name: d.business_name || '', phone: d.phone || '', address: d.address || '', town: d.town || '', county: d.county || '', postcode: d.postcode || '' })
      setLoaded(true)
    }).catch(() => setLoaded(true))
  }, [])

  const save = async () => {
    const errs: Partial<Record<keyof AddressState, string>> = {}
    if (!address.address.trim()) errs.address = 'Required'
    if (!address.town.trim())    errs.town    = 'Required'
    if (!address.postcode.trim()) errs.postcode = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setSaving(true)
    try {
      const res = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(address) })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    } finally { setSaving(false) }
  }

  const addressComplete = !!(address.address.trim() && address.town.trim() && address.postcode.trim())

  return (
    <div>
      <PanelHeader title="Business address" description="Used as the sender address when generating live shipping quotes. Sent directly to the courier — never shared."/>

      {!addressComplete && (
        <div style={{ display: 'flex', gap: 10, padding: '12px 16px', background: 'rgba(208,138,89,.07)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 'var(--r-md)', marginBottom: 20, fontSize: 13, color: '#7a4a1c', lineHeight: 1.6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Add your address to unlock live parcel quotes in the search bar.
        </div>
      )}

      {!loaded ? (
        <div style={{ height: 280, borderRadius: 'var(--r-lg)', background: 'var(--ev)' }}/>
      ) : (
        <Card>
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Business name</label>
              <input style={inp} value={address.business_name} onChange={e => setAddress(a => ({ ...a, business_name: e.target.value }))} placeholder="e.g. Acme Ltd"/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Phone number</label>
              <input style={inp} value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="e.g. 07700 900000"/>
            </div>
          </div>
          <div style={{ padding: '0 20px 14px' }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Address line 1 *</label>
            <input style={{ ...inp, borderColor: errors.address ? '#dc2626' : 'var(--b2)' }} value={address.address} onChange={e => { setAddress(a => ({ ...a, address: e.target.value })); setErrors(er => ({ ...er, address: undefined })) }} placeholder="e.g. 12 High Street"/>
            {errors.address && <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>Required</div>}
          </div>
          <div style={{ padding: '0 20px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Town / city *</label>
              <input style={{ ...inp, borderColor: errors.town ? '#dc2626' : 'var(--b2)' }} value={address.town} onChange={e => { setAddress(a => ({ ...a, town: e.target.value })); setErrors(er => ({ ...er, town: undefined })) }} placeholder="e.g. London"/>
              {errors.town && <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>Required</div>}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>County</label>
              <input style={inp} value={address.county} onChange={e => setAddress(a => ({ ...a, county: e.target.value }))} placeholder="e.g. Greater London"/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>Postcode *</label>
              <input style={{ ...inp, borderColor: errors.postcode ? '#dc2626' : 'var(--b2)' }} value={address.postcode} onChange={e => { setAddress(a => ({ ...a, postcode: e.target.value })); setErrors(er => ({ ...er, postcode: undefined })) }} placeholder="EC1A 1BB"/>
              {errors.postcode && <div style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>Required</div>}
            </div>
          </div>
          <div style={{ padding: '0 20px 16px' }}>
            <SaveRow onClick={save} saving={saving} saved={saved} label="Save address"/>
          </div>
        </Card>
      )}
    </div>
  )
}

const CONNECTOR_GROUPS = [
  { category: 'E-Commerce', items: [
    { id: 'shopify',      label: 'Shopify',      href: '/api/auth/shopify',    desc: 'Orders, products, inventory, customers',     oauth: true  },
    { id: 'amazon_fba',   label: 'Amazon FBA',   href: '/api/auth/amazon',     desc: 'FBA orders, inventory, fees, returns',       oauth: true  },
    { id: 'ebay',         label: 'eBay',         href: '/api/auth/ebay',       desc: 'Listings, orders, seller metrics, fees',     oauth: true  },
    { id: 'etsy',         label: 'Etsy',         href: '/api/auth/etsy',       desc: 'Shop stats, orders, listings, revenue',      oauth: true  },
    { id: 'woocommerce',  label: 'WooCommerce',  href: '/sources',             desc: 'Orders, products, customers, revenue',       oauth: false },
    { id: 'walmart',      label: 'Walmart',      href: '/sources',             desc: 'Marketplace orders, inventory, performance', oauth: false },
  ]},
  { category: 'Accounting', items: [
    { id: 'quickbooks',   label: 'QuickBooks',   href: '/api/auth/quickbooks', desc: 'P&L, invoices, expenses, cash flow',          oauth: true  },
    { id: 'xero',         label: 'Xero',         href: '/api/auth/xero',       desc: 'Invoices, bank reconciliation, P&L, payroll', oauth: true  },
    { id: 'sage',         label: 'Sage',         href: '/sources',             desc: 'Accounts, invoices, payroll, VAT returns',    oauth: false },
    { id: 'freeagent',    label: 'FreeAgent',    href: '/api/auth/freeagent',  desc: 'Invoices, expenses, tax timeline',             oauth: true  },
    { id: 'wave',         label: 'Wave',         href: '/sources',             desc: 'Invoices, receipts, payroll, accounting',     oauth: false },
  ]},
  { category: 'Payments', items: [
    { id: 'stripe',       label: 'Stripe',       href: '/api/auth/stripe',     desc: 'Payments, payouts, refunds, transactions',   oauth: true  },
    { id: 'paypal',       label: 'PayPal',       href: '/api/auth/paypal',     desc: 'Transactions, payouts, refunds, disputes',   oauth: true  },
    { id: 'gocardless',   label: 'GoCardless',   href: '/api/auth/gocardless', desc: 'Direct debit, subscriptions, mandates',      oauth: true  },
    { id: 'klarna',       label: 'Klarna',       href: '/sources',             desc: 'BNPL orders, conversion rates, settlements', oauth: false },
    { id: 'sumup',        label: 'SumUp',        href: '/sources',             desc: 'Card reader sales, POS transactions',        oauth: false },
  ]},
  { category: 'Marketing & Ads', items: [
    { id: 'meta_ads',         label: 'Meta Ads',         href: '/api/auth/meta',             desc: 'Facebook & Instagram ad spend, ROAS',    oauth: true  },
    { id: 'google_ads',       label: 'Google Ads',       href: '/api/auth/google-ads',       desc: 'Search campaigns, spend, conversions',   oauth: true  },
    { id: 'google_analytics', label: 'Google Analytics', href: '/api/auth/google-analytics', desc: 'Traffic, sessions, funnels, revenue',    oauth: true  },
    { id: 'klaviyo',          label: 'Klaviyo',          href: '/sources',                   desc: 'Email revenue, flows, attribution',      oauth: false },
    { id: 'mailchimp',        label: 'Mailchimp',        href: '/api/auth/mailchimp',        desc: 'Campaigns, open rates, audience growth', oauth: true  },
  ]},
  { category: 'Social Commerce', items: [
    { id: 'tiktok_shop', label: 'TikTok Shop',        href: '/sources', desc: 'Orders, video analytics, product performance', oauth: false },
    { id: 'instagram',   label: 'Instagram Shopping', href: '/sources', desc: 'Post insights, product clicks, shopping',      oauth: false },
    { id: 'pinterest',   label: 'Pinterest',          href: '/sources', desc: 'Pin analytics, demand signals, catalog',       oauth: false },
  ]},
  { category: 'Inventory & Logistics', items: [
    { id: 'linnworks',   label: 'Linnworks',   href: '/api/auth/linnworks', desc: 'Multi-channel inventory, orders, fulfilment', oauth: true  },
    { id: 'cin7',        label: 'Cin7',        href: '/sources',            desc: 'Inventory, purchase orders, B2B, 3PL',       oauth: false },
    { id: 'shipstation', label: 'ShipStation', href: '/sources',            desc: 'Shipments, tracking, carriers, costs',       oauth: false },
    { id: 'royal_mail',  label: 'Royal Mail',  href: '/sources',            desc: 'Parcel tracking, Click & Drop orders',       oauth: false },
  ]},
  { category: 'Point of Sale & Data', items: [
    { id: 'square',        label: 'Square',        href: '/sources',          desc: 'Orders, inventory, payments, locations', oauth: false },
    { id: 'google_sheets', label: 'Google Sheets', href: '/api/auth/google',  desc: 'Any spreadsheet — sales, stock, P&L',   oauth: true  },
  ]},
]

function IntegrationsPanel() {
  const [sources,       setSources]       = useState<ConnectedSource[]>([])
  const [loading,       setLoading]       = useState(true)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sources').then(r => r.json()).then(d => {
      setSources(Array.isArray(d) ? d : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const disconnect = async (id: string, name: string) => {
    if (!confirm(`Disconnect ${name}? Your historical data will remain but live syncing will stop.`)) return
    setDisconnecting(id)
    try {
      await fetch('/api/sources', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      setSources(s => s.filter(src => src.id !== id))
    } finally { setDisconnecting(null) }
  }

  const connectedTypes = new Set(sources.map(s => s.source_type))

  return (
    <div>
      <PanelHeader title="Integrations" description="Connect your business tools so AskBiz can answer questions using your live data."/>

      {loading ? (
        <div style={{ height: 200, borderRadius: 'var(--r-lg)', background: 'var(--ev)' }}/>
      ) : (
        <>
          {/* Connected sources */}
          {sources.length > 0 && (
            <Card>
              <CardHeader title={`Connected (${sources.length})`}/>
              {sources.map((src, i) => {
                const meta    = sourceMeta(src.source_type)
                const isError = src.status === 'error' || !!src.error_message
                return (
                  <div key={src.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: i < sources.length - 1 ? '1px solid var(--b)' : 'none' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {meta.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{src.name || meta.label}</div>
                      <div style={{ fontSize: 12, color: isError ? '#dc2626' : 'var(--tx3)', marginTop: 1 }}>
                        {isError ? src.error_message || 'Sync error — reconnect to fix' :
                          src.last_synced_at ? `Synced ${new Date(src.last_synced_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : 'Never synced'}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 'var(--rf)', fontWeight: 600, background: isError ? 'rgba(220,38,38,.08)' : 'rgba(34,197,94,.08)', color: isError ? '#dc2626' : '#16a34a', border: `1px solid ${isError ? 'rgba(220,38,38,.2)' : 'rgba(34,197,94,.2)'}`, flexShrink: 0 }}>
                      {isError ? 'Error' : 'Active'}
                    </span>
                    <button onClick={() => disconnect(src.id, src.name || meta.label)} disabled={disconnecting === src.id}
                      style={{ fontSize: 12, color: 'var(--tx3)', background: 'transparent', border: '1px solid var(--b2)', borderRadius: 'var(--r-md)', padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0, opacity: disconnecting === src.id ? .5 : 1 }}>
                      {disconnecting === src.id ? 'Removing…' : 'Disconnect'}
                    </button>
                  </div>
                )
              })}
            </Card>
          )}

          {/* All connectors grouped by category */}
          {CONNECTOR_GROUPS.map(group => (
            <div key={group.category} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8, padding: '0 2px' }}>
                {group.category}
              </div>
              <Card>
                {group.items.map((c, i) => {
                  const isConnected = connectedTypes.has(c.id)
                  const meta        = sourceMeta(c.id)
                  return (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: i < group.items.length - 1 ? '1px solid var(--b)' : 'none' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                        {meta.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {c.label}
                          {!c.oauth && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 3, padding: '1px 4px', letterSpacing: '.05em', textTransform: 'uppercase' }}>Token</span>}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 1 }}>{c.desc}</div>
                      </div>
                      {isConnected ? (
                        <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 'var(--rf)', fontWeight: 600, background: 'rgba(34,197,94,.08)', color: '#16a34a', border: '1px solid rgba(34,197,94,.2)', flexShrink: 0 }}>Connected</span>
                      ) : (
                        <a href={c.href} style={{ fontSize: 12, fontWeight: 600, color: 'var(--acc)', background: 'rgba(208,138,89,.08)', border: '1px solid rgba(208,138,89,.2)', borderRadius: 'var(--r-md)', padding: '5px 12px', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
                          {c.oauth ? 'Connect' : 'Set up →'}
                        </a>
                      )}
                    </div>
                  )
                })}
              </Card>
            </div>
          ))}

          <div style={{ padding: '12px 14px', borderRadius: 10, border: '1px dashed var(--b2)', fontSize: 13, color: 'var(--tx3)', lineHeight: 1.6 }}>
            💡 No integration yet? <strong style={{ color: 'var(--tx)' }}>Upload a CSV or Excel file</strong> from the chat page — instant analysis, no connection needed.
          </div>
        </>
      )}
    </div>
  )
}

function AIPanel() {
  const { settings, updateSettings, user } = useStore()
  const plan = user.plan as 'free' | 'growth' | 'business'
  const canUseCfoMode = getPlanFeatures(plan).cfo_mode

  const [showCharts, setShowCharts]     = useState(settings.showCharts)
  const [showMetrics, setShowMetrics]   = useState(settings.showMetrics)
  const [showFollowUps, setShowFollowUps] = useState(settings.showFollowUps)
  const [cfoMode, setCfoMode]           = useState(settings.cfoMode)

  const toggle = (key: 'showCharts' | 'showMetrics' | 'showFollowUps' | 'cfoMode') => {
    const cur = { showCharts, showMetrics, showFollowUps, cfoMode }[key]
    const next = !cur
    if (key === 'showCharts')   setShowCharts(next)
    if (key === 'showMetrics')  setShowMetrics(next)
    if (key === 'showFollowUps') setShowFollowUps(next)
    if (key === 'cfoMode')      setCfoMode(next)
    updateSettings({ [key]: next })
  }

  return (
    <div>
      <PanelHeader title="AI preferences" description="Control how AskBiz formats and presents answers. Changes apply immediately across all conversations."/>

      <Card>
        <CardHeader title="Response format"/>
        <SettingRow label="Charts and graphs" description="Automatically render charts when the answer contains numeric or trend data" right={<Toggle value={showCharts} onChange={() => toggle('showCharts')}/>}/>
        <SettingRow label="KPI summary cards" description="Show key metrics as highlighted cards at the top of each answer" right={<Toggle value={showMetrics} onChange={() => toggle('showMetrics')}/>}/>
        <SettingRow label="Follow-up suggestions" description="Suggest next questions after every answer to help you dig deeper" border={false} right={<Toggle value={showFollowUps} onChange={() => toggle('showFollowUps')}/>}/>
      </Card>

      <Card>
        <CardHeader title="Advanced"/>
        <SettingRow
          label="CFO Mode"
          description="Board-ready responses — percentage-first language, executive summaries and formal tone"
          border={false}
          right={
            canUseCfoMode
              ? <Toggle value={cfoMode} onChange={() => toggle('cfoMode')} color="#6366f1"/>
              : <UpgradeBadge plan="Business"/>
          }
        />
      </Card>

      <div style={{ padding: '12px 16px', background: 'var(--ev)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--tx3)' }}>
        These preferences are saved to your browser and apply to all future questions.
      </div>
    </div>
  )
}

function NotificationsPanel() {
  const [form, setForm] = useState({
    whatsapp_number:    '',
    notify_whatsapp:    false,
    notify_email_alerts: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d && !d.error) setForm({
        whatsapp_number:     d.whatsapp_number    || '',
        notify_whatsapp:     d.notify_whatsapp    ?? false,
        notify_email_alerts: d.notify_email_alerts ?? true,
      })
    })
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 9,
    border: '1px solid var(--b2)', background: 'var(--ev)',
    color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
  }

  const row = (label: string, sub: string, checked: boolean, onChange: () => void) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--b)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.5 }}>{sub}</div>
      </div>
      <div
        onClick={onChange}
        style={{ width: 40, height: 22, borderRadius: 11, background: checked ? '#d08a59' : 'var(--b2)', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 200ms', marginTop: 2 }}
      >
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: checked ? 20 : 2, transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}/>
      </div>
    </div>
  )

  return (
    <div>
      <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: 'var(--tx)' }}>Notifications</h2>
      <p style={{ margin: '0 0 28px', fontSize: 13, color: 'var(--tx3)' }}>Choose how AskBiz reaches you when something needs your attention.</p>

      {/* Channels */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Channels</div>
        {row('Email alerts', 'Receive an email when a critical or warning alert fires.', form.notify_email_alerts, () => setForm(f => ({ ...f, notify_email_alerts: !f.notify_email_alerts })))}
        {row('WhatsApp alerts', 'Get a WhatsApp message for stock, revenue, and shipment alerts.', form.notify_whatsapp, () => setForm(f => ({ ...f, notify_whatsapp: !f.notify_whatsapp })))}
      </div>

      {/* WhatsApp number */}
      {form.notify_whatsapp && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--tx3)', marginBottom: 6 }}>WhatsApp number</label>
          <input
            style={inp}
            value={form.whatsapp_number}
            onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))}
            placeholder="+44 7700 900000"
          />
          <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--tx3)' }}>
            Include country code (e.g. +44 for UK, +234 for Nigeria). Must be a WhatsApp-enabled number.
          </p>
        </div>
      )}

      {/* Info box */}
      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(208,138,89,.06)', border: '1px solid rgba(208,138,89,.2)', marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>
          AskBiz checks your data every 4 hours and sends alerts for low stock, revenue drops, delayed shipments, and sector news relevant to your business and region.
        </p>
      </div>

      <button
        onClick={save}
        disabled={saving}
        style={{ padding: '10px 22px', borderRadius: 9999, border: 'none', background: '#d08a59', color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'default' : 'pointer', fontFamily: 'inherit' }}
      >
        {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save preferences'}
      </button>
    </div>
  )
}

function APIPanel() {
  return (
    <div>
      <PanelHeader title="API access" description="Create and manage API keys to integrate AskBiz into your own products and workflows."/>
      <ApiKeys/>
    </div>
  )
}

function PrivacyPanel() {
  const [consent, setConsent] = useState<ConsentState>({ data_consent: true, training_consent: true, data_consent_at: null, training_consent_at: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/consent').then(r => r.json()).then(d => {
      if (d.consent) setConsent({ ...d.consent, data_consent: d.consent.data_consent ?? true, training_consent: d.consent.training_consent ?? true })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = async (dc: boolean, tc: boolean) => {
    await fetch('/api/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data_consent: dc, training_consent: tc }) })
  }

  const toggle = (type: 'data' | 'training') => {
    if (type === 'data') {
      const n = !consent.data_consent; setConsent(c => ({ ...c, data_consent: n })); save(n, consent.training_consent)
    } else {
      const n = !consent.training_consent; setConsent(c => ({ ...c, training_consent: n })); save(consent.data_consent, n)
    }
  }

  return (
    <div>
      <PanelHeader title="Privacy & data" description="Control how AskBiz uses your business data. Both settings are optional and can be changed at any time."/>

      {loading ? (
        <div style={{ height: 160, borderRadius: 'var(--r-lg)', background: 'var(--ev)', marginBottom: 16 }}/>
      ) : (
        <Card>
          <CardHeader title="Data preferences"/>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--b)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)', marginBottom: 3 }}>Financial data personalisation</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5 }}>Store aggregated financial metrics to personalise AI answers. No individual transactions are ever stored.</div>
                {consent.data_consent_at && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 5 }}>Consented {new Date(consent.data_consent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
              </div>
              <Toggle value={consent.data_consent} onChange={() => toggle('data')}/>
            </div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)', marginBottom: 3 }}>Help improve AskBiz AI</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5 }}>Use fully anonymised interactions to improve AI accuracy. Your business is never identifiable.</div>
                {consent.training_consent_at && <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 5 }}>Consented {new Date(consent.training_consent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
              </div>
              <Toggle value={consent.training_consent} onChange={() => toggle('training')} color="#8c6fe0"/>
            </div>
          </div>
        </Card>
      )}

      <p style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.6, margin: 0 }}>
        Read our full <a href="/privacy" style={{ color: 'var(--acc)', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a> to understand how your data is handled.
      </p>
    </div>
  )
}

function AccountPanel() {
  const { user } = useStore()
  const plan = user.plan as 'free' | 'growth' | 'business'
  const features = getPlanFeatures(plan)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason]       = useState('')
  const [deleting, setDeleting]               = useState(false)
  const [deleteRequested, setDeleteRequested] = useState(false)
  const [pendingDeletion, setPendingDeletion] = useState(false)
  const [cancellingDeletion, setCancellingDeletion] = useState(false)
  const [exporting, setExporting]             = useState(false)

  useEffect(() => {
    fetch('/api/account').then(r => r.json()).then(d => { if (d.deletionRequest) setPendingDeletion(true) }).catch(() => {})
  }, [])

  const requestDeletion = async () => {
    setDeleting(true)
    try {
      const res = await fetch('/api/account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'request_deletion', reason: deleteReason }) })
      if (res.ok) { setDeleteRequested(true); setPendingDeletion(true); setShowDeleteModal(false) }
    } finally { setDeleting(false) }
  }

  const cancelDeletion = async () => {
    setCancellingDeletion(true)
    try {
      const res = await fetch('/api/account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'cancel_deletion' }) })
      if (res.ok) setPendingDeletion(false)
    } finally { setCancellingDeletion(false) }
  }

  const exportData = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/export')
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'askbiz-my-data.json'; a.click()
        URL.revokeObjectURL(url)
      }
    } finally { setExporting(false) }
  }

  const PLAN_LIMITS = [
    { label: 'Questions / month',  value: features.questions_per_month  === -1 ? 'Unlimited' : features.questions_per_month },
    { label: 'File uploads / month', value: features.uploads_per_month  === -1 ? 'Unlimited' : features.uploads_per_month },
    { label: 'Connected sources',  value: features.sources_limit        === -1 ? 'Unlimited' : features.sources_limit },
    { label: 'Team seats',         value: features.team_members         === -1 ? 'Unlimited' : features.team_members },
    { label: 'Alerts',             value: features.alerts_limit         === 0  ? 'Not included' : features.alerts_limit === -1 ? 'Unlimited' : features.alerts_limit },
  ]

  return (
    <div>
      <PanelHeader title="Account" description="Manage your subscription, export your data, or close your account."/>

      {pendingDeletion && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 16px', background: 'rgba(220,38,38,.05)', border: '1px solid rgba(220,38,38,.18)', borderRadius: 'var(--r-md)', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', marginBottom: 2 }}>Account deletion pending</div>
            <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Your data will be deleted within 30 days. You can cancel this request at any time.</div>
          </div>
          <button onClick={cancelDeletion} disabled={cancellingDeletion} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 'var(--r-md)', border: '1px solid rgba(220,38,38,.3)', background: 'transparent', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: cancellingDeletion ? .6 : 1 }}>
            {cancellingDeletion ? 'Cancelling…' : 'Cancel deletion'}
          </button>
        </div>
      )}

      {/* Plan summary */}
      <Card>
        <CardHeader title="Current plan"/>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--b)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: 'var(--tx)', textTransform: 'capitalize', marginBottom: 3 }}>{plan} plan</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{plan === 'free' ? 'No card required' : plan === 'growth' ? '£19 / month' : '£39 / month'}</div>
          </div>
          <a href="/billing" style={{ padding: '8px 18px', borderRadius: 'var(--r-md)', background: 'var(--acc)', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(208,138,89,.2)', flexShrink: 0 }}>
            {plan === 'free' ? 'Upgrade plan →' : 'Manage billing →'}
          </a>
        </div>
        <div style={{ padding: '12px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {PLAN_LIMITS.map((l, i) => (
            <div key={l.label} style={{ padding: '10px 12px', borderRight: i < PLAN_LIMITS.length - 1 ? '1px solid var(--b)' : 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: l.value === 'Not included' ? 'var(--tx3)' : 'var(--tx)', marginBottom: 2 }}>{String(l.value)}</div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{l.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Data export */}
      <Card>
        <CardHeader title="Your data"/>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)', marginBottom: 3 }}>Export my data</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Download everything AskBiz holds about you (GDPR Article 15)</div>
          </div>
          <button onClick={exportData} disabled={exporting} style={{ flexShrink: 0, padding: '8px 18px', borderRadius: 'var(--r-md)', border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500, opacity: exporting ? .6 : 1 }}>
            {exporting ? 'Preparing…' : 'Export'}
          </button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card danger>
        <CardHeader title="Danger zone" danger/>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)', marginBottom: 3 }}>Delete account</div>
            <div style={{ fontSize: 13, color: 'var(--tx3)' }}>Permanently delete your account and all data within 30 days (GDPR Article 17)</div>
          </div>
          <button onClick={() => setShowDeleteModal(true)} disabled={pendingDeletion} style={{ flexShrink: 0, padding: '8px 18px', borderRadius: 'var(--r-md)', border: '1px solid rgba(220,38,38,.3)', background: 'rgba(220,38,38,.04)', color: '#dc2626', fontSize: 13, fontFamily: 'inherit', cursor: pendingDeletion ? 'not-allowed' : 'pointer', fontWeight: 500, opacity: pendingDeletion ? .5 : 1 }}>
            {pendingDeletion ? 'Pending' : 'Delete account'}
          </button>
        </div>
      </Card>

      {showDeleteModal && (
        <>
          <div onClick={() => setShowDeleteModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 199 }}/>
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 420, background: 'var(--sf)', borderRadius: 16, border: '1px solid rgba(220,38,38,.3)', zIndex: 200, padding: 24 }}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>Delete your account</div>
            <p style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.6 }}>This will permanently delete all your data. Your request will be processed within 30 days in accordance with GDPR Article 17.</p>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 6 }}>Reason (optional)</label>
            <textarea value={deleteReason} onChange={e => setDeleteReason(e.target.value)} placeholder="Tell us why you are leaving…" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' as const, resize: 'none' as const, height: 80, marginBottom: 16 }}/>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={requestDeletion} disabled={deleting} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                {deleting ? 'Submitting…' : 'Request deletion'}
              </button>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {deleteRequested && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', padding: '12px 20px', borderRadius: 12, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', color: '#16a34a', fontSize: 13, fontWeight: 500, zIndex: 300 }}>
          ✅ Deletion request submitted. Your data will be deleted within 30 days.
        </div>
      )}
    </div>
  )
}

// ── Compliance Panel ──────────────────────────────────────────────────────────

function CompliancePanel() {
  const { user } = useStore()
  const [icoNumber, setIcoNumber]   = useState('')
  const [vatNumber, setVatNumber]   = useState('')
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [collectiveOpt, setCollectiveOpt]       = useState(false)
  const [marketIntelOpt, setMarketIntelOpt]     = useState(false)
  const [loadingOpt, setLoadingOpt] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('profiles').select('ico_number,vat_number,collective_opt_in,market_intelligence_opt_in').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        setIcoNumber(data.ico_number || '')
        setVatNumber(data.vat_number || '')
        setCollectiveOpt(data.collective_opt_in || false)
        setMarketIntelOpt(data.market_intelligence_opt_in || false)
      }
      setLoadingOpt(false)
    })
  }, [user.id])

  const saveCompliance = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ ico_number: icoNumber, vat_number: vatNumber }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const toggleCollective = async () => {
    const next = !collectiveOpt
    setCollectiveOpt(next)
    const supabase = createClient()
    await supabase.from('profiles').update({ collective_opt_in: next, collective_opted_at: next ? new Date().toISOString() : null }).eq('id', user.id)
  }

  const toggleMarketIntel = async () => {
    const next = !marketIntelOpt
    setMarketIntelOpt(next)
    const supabase = createClient()
    await supabase.from('profiles').update({ market_intelligence_opt_in: next, market_intelligence_opted_at: next ? new Date().toISOString() : null }).eq('id', user.id)
  }

  const STATUS_BADGE = (label: string, ok: boolean) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: ok ? 'rgba(34,197,94,.08)' : 'rgba(234,179,8,.08)', border: `1px solid ${ok ? 'rgba(34,197,94,.25)' : 'rgba(234,179,8,.25)'}`, fontSize: 11, fontWeight: 600, color: ok ? '#16a34a' : '#a16207' }}>
      <span>{ok ? '✓' : '⚠'}</span>{label}
    </span>
  )

  return (
    <div>
      <PanelHeader title="Compliance" description="GDPR, ICO registration, VAT, and data residency information for your account."/>

      {/* Data residency */}
      <Card>
        <CardHeader title="Data residency"/>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Storage region', value: 'AWS eu-west-2 · London, UK' },
              { label: 'Data sovereignty', value: 'United Kingdom (UK GDPR)' },
              { label: 'EU transfers', value: 'UK adequacy decision applies' },
              { label: 'Backup retention', value: '30 days, same region' },
            ].map(item => (
              <div key={item.label} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--ev)' }}>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--tx)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* GDPR status */}
      <Card>
        <CardHeader title="GDPR compliance status"/>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STATUS_BADGE('Data minimisation', true)}
            {STATUS_BADGE('Right to erasure (Art. 17)', true)}
            {STATUS_BADGE('Data portability (Art. 20)', true)}
            {STATUS_BADGE('Lawful basis recorded', true)}
            {STATUS_BADGE('Privacy policy published', true)}
            {STATUS_BADGE('DPA signed', true)}
          </div>
          <p style={{ fontSize: 12, color: 'var(--tx3)', margin: 0, lineHeight: 1.6 }}>
            AskBiz acts as a <strong>data processor</strong> on your behalf. You remain the data controller for any customer or staff data you process through the platform. Download our <a href="/dpa" target="_blank" rel="noreferrer" style={{ color: 'var(--acc)', textDecoration: 'none', fontWeight: 500 }}>Data Processing Agreement (DPA) →</a>
          </p>
        </div>
      </Card>

      {/* ICO + VAT */}
      {!loadingOpt && (
        <Card>
          <CardHeader title="Registration numbers"/>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 6 }}>ICO registration number (UK)</label>
              <input
                value={icoNumber}
                onChange={e => setIcoNumber(e.target.value)}
                placeholder="e.g. ZB123456"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' as const }}
              />
              <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 5 }}>Required if you process personal data in the UK. <a href="https://ico.org.uk/for-organisations/register/" target="_blank" rel="noreferrer" style={{ color: 'var(--acc)', textDecoration: 'none' }}>Register with ICO →</a></div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 6 }}>VAT registration number</label>
              <input
                value={vatNumber}
                onChange={e => setVatNumber(e.target.value)}
                placeholder="e.g. GB 123456789"
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' as const }}
              />
              <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 5 }}>Used on receipts and MTD-compatible VAT exports from your POS data.</div>
            </div>
            <button
              onClick={saveCompliance}
              disabled={saving}
              style={{ alignSelf: 'flex-start', padding: '9px 20px', borderRadius: 10, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', opacity: saving ? .6 : 1 }}
            >
              {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save numbers'}
            </button>
          </div>
        </Card>
      )}

      {/* Making Tax Digital */}
      <Card>
        <CardHeader title="Making Tax Digital (MTD)"/>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {STATUS_BADGE('MTD-compatible exports', true)}
            {STATUS_BADGE('Digital record-keeping', true)}
          </div>
          <p style={{ fontSize: 13, color: 'var(--tx3)', margin: 0, lineHeight: 1.6 }}>
            All POS transactions are stored as digital records in HMRC-compatible format. Export VAT-period reports directly from <a href="/pos" style={{ color: 'var(--acc)', textDecoration: 'none', fontWeight: 500 }}>Point of Sale → Export</a>.
          </p>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(208,138,89,.06)', border: '1px solid rgba(208,138,89,.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--acc)', marginBottom: 3 }}>What's included in MTD exports</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--tx3)', lineHeight: 1.8 }}>
              <li>Transaction date, reference, and total</li>
              <li>VAT amount (20% standard, 5% reduced, 0% exempt)</li>
              <li>Payment type (cash / card / other)</li>
              <li>Net, VAT, and gross columns per line item</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Collective intelligence opt-in */}
      {!loadingOpt && (
        <Card>
          <CardHeader title="Market intelligence contribution"/>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)', marginBottom: 3 }}>Share anonymised benchmarks</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5, marginBottom: 6 }}>
                  Contribute fully anonymised, aggregated metrics to AskBiz's collective intelligence layer. This powers answers like "How will my chocolates sell in Kenya?" — no individual business is ever identifiable.
                </div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Opt out at any time. Only sector, region, and aggregated values are shared — never your business name, products, or transactions.</div>
              </div>
              <Toggle value={collectiveOpt} onChange={toggleCollective} color="#8c6fe0"/>
            </div>
          </div>
        </Card>
      )}

      {/* Market intelligence opt-in */}
      {!loadingOpt && (
        <Card>
          <CardHeader title="Global market intelligence"/>
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--tx)', marginBottom: 3 }}>Contribute to the global price pool</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.5, marginBottom: 6 }}>
                  Share anonymised selling prices and channel data from your connected stores. In return, see what products are actually selling for across thousands of merchants worldwide — by channel, region, and trend. Your identity, cost prices, and business name are never shared.
                </div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Enabled by default for new accounts. Only product names, selling prices, channel, and region are pooled — aggregated across 3+ merchants minimum before any signal is published. You can opt out at any time.</div>
              </div>
              <Toggle value={marketIntelOpt} onChange={toggleMarketIntel} color="#d08a59"/>
            </div>
          </div>
        </Card>
      )}

      {/* POS staff data notice */}
      <Card>
        <CardHeader title="POS staff data"/>
        <div style={{ padding: '16px 20px' }}>
          <p style={{ fontSize: 13, color: 'var(--tx3)', margin: 0, lineHeight: 1.6 }}>
            When you add cashier or inventory staff to your POS, you are acting as their data controller. Their phone numbers and login activity are stored securely in the UK. You are responsible for informing them under UK GDPR Article 13. <a href="/privacy#staff" target="_blank" rel="noreferrer" style={{ color: 'var(--acc)', textDecoration: 'none', fontWeight: 500 }}>Staff privacy notice template →</a>
          </p>
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 9, background: 'var(--ev)', fontSize: 12, color: 'var(--tx3)' }}>
            Staff OTP codes expire after <strong>10 minutes</strong> and are deleted after use. Phone numbers are stored only to authenticate your team — they are not used for marketing.
          </div>
        </div>
      </Card>

      {/* Breach notification */}
      <Card>
        <CardHeader title="Data breach notification"/>
        <div style={{ padding: '16px 20px' }}>
          <p style={{ fontSize: 13, color: 'var(--tx3)', margin: 0, lineHeight: 1.6 }}>
            In the event of a data breach affecting your business data, AskBiz will notify you within <strong>72 hours</strong> of becoming aware, in accordance with UK GDPR Article 33. Notifications are sent to your registered email address.
          </p>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--tx3)' }}>
            Registered contact: <strong style={{ color: 'var(--tx)' }}>{user.email}</strong>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ── Page shell ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router  = useRouter()
  const supabase = createClient()
  const [active, setActive] = useState<Section>('profile')
  const [winW, setWinW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const h = () => setWinW(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const isMobile = winW < 768

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const activeItem = NAV.find(n => n.id === active)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Sidebar — desktop only */}
        {!isMobile && (
          <nav style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--b)', overflowY: 'auto', padding: '12px 8px' }}>
            {NAV.map(item => {
              const isActive = item.id === active
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 11px', marginBottom: 2, borderRadius: 'var(--r-md)', border: 'none', background: isActive ? 'rgba(208,138,89,.1)' : 'transparent', color: isActive ? 'var(--acc)' : 'var(--tx2)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const, transition: 'background 120ms, color 120ms' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--ev)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d={item.icon}/>
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                  {isActive && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </nav>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
          <div style={{ maxWidth: 680, padding: isMobile ? '16px 16px 60px' : '32px 36px 60px' }}>
            {active === 'profile'      && <ProfilePanel onSignOut={signOut}/>}
            {active === 'team'         && <TeamPanel/>}
            {active === 'localisation' && <LocalisationPanel/>}
            {active === 'address'      && <AddressPanel/>}
            {active === 'integrations' && <IntegrationsPanel/>}
            {active === 'ai'            && <AIPanel/>}
            {active === 'notifications' && <NotificationsPanel/>}
            {active === 'api'           && <APIPanel/>}
            {active === 'privacy'      && <PrivacyPanel/>}
            {active === 'compliance'   && <CompliancePanel/>}
            {active === 'account'      && <AccountPanel/>}
          </div>
        </div>
      </div>
    </div>
  )
}
