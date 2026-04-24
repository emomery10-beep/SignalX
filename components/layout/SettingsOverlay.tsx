'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store'
import { CURRENCIES } from '@/lib/geo'

interface Props {
  user: { name: string; email: string; plan: string; currency: string; bizType: string }
  geo: { region?: string; country?: string; trendTopics?: string[] } | null
  onClose: () => void
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '9px 0', borderBottom: '1px solid var(--b)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--tx2)', marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width: 36, height: 20, borderRadius: 9999, border: 'none', background: on ? '#1ed4ca' : 'var(--b2)', position: 'relative', cursor: 'pointer', transition: 'background 200ms', flexShrink: 0 }}>
      <span style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: '#fff', top: 3, left: 3, transition: 'transform 200ms', transform: on ? 'translateX(16px)' : 'none' }}/>
    </button>
  )
}

export default function SettingsOverlay({ user, geo, onClose }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const { updateSettings, settings } = useStore()
  const [currency, setCurrency] = useState(user.currency)
  const [bizType, setBizType] = useState(user.bizType)
  const [showCharts, setShowCharts] = useState(settings.showCharts)
  const [showMetrics, setShowMetrics] = useState(settings.showMetrics)
  const [showFollowUps, setShowFollowUps] = useState(settings.showFollowUps)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      await supabase.from('profiles').update({
        currency, currency_symbol: CURRENCIES[currency]?.sym || '$',
        business_type: bizType,
      }).eq('id', authUser.id)
    }
    updateSettings({ bizType: bizType as 'retail'|'ecommerce'|'distributor'|'exporter', showCharts, showMetrics, showFollowUps })
    setSaving(false)
    onClose()
    router.refresh()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }} style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,15,.72)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'var(--sf)', border: '1px solid var(--b2)', borderRadius: 22, width: '100%', maxWidth: 520, maxHeight: '88vh', overflowY: 'auto', boxShadow: 'var(--shl)' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 17px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'var(--sf)', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 17, fontWeight: 600, letterSpacing: '-.02em' }}>Settings</div>
          <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Account */}
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--b)' }}>Account</div>
          <Row label={user.name} desc={`${user.email} · ${user.plan} plan`}>
            <button style={outlineBtn}>Edit</button>
          </Row>
          <div style={{ marginBottom: 24 }}></div>

          {/* Localisation */}
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--b)' }}>Localisation</div>
          {geo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 11px', marginBottom: 12, borderRadius: 10, background: 'rgba(30,212,202,.06)', border: '1px solid rgba(30,212,202,.18)', fontSize: 12, color: '#47e2da' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Detected: {geo.region || geo.country || 'Global'} {geo.trendTopics?.length ? `· ${geo.trendTopics.length} trending topics` : ''}
            </div>
          )}
          <Row label="Currency" desc="Used in all AI answers and charts">
            <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ fontFamily: 'inherit', fontSize: 12, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 10, padding: '6px 10px', outline: 'none', minWidth: 130 }}>
              {Object.entries(CURRENCIES).map(([code, c]) => (
                <option key={code} value={code}>{c.flag} {code} — {c.name.split(' ').slice(0,2).join(' ')}</option>
              ))}
            </select>
          </Row>
          <Row label="Business type" desc="Shapes how AskBiz frames answers">
            <select value={bizType} onChange={e => setBizType(e.target.value)} style={{ fontFamily: 'inherit', fontSize: 12, color: 'var(--tx)', background: 'var(--ev)', border: '1px solid var(--b2)', borderRadius: 10, padding: '6px 10px', outline: 'none', minWidth: 130 }}>
              <option value="retail">Retail / shop</option>
              <option value="ecommerce">Ecommerce</option>
              <option value="distributor">Distributor</option>
              <option value="exporter">Exporter</option>
            </select>
          </Row>
          <div style={{ marginBottom: 24 }}></div>

          {/* AI preferences */}
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--b)' }}>AI preferences</div>
          <Row label="Include charts automatically" desc="Render charts when the answer has visual data"><Toggle on={showCharts} onChange={setShowCharts}/></Row>
          <Row label="KPI summary cards" desc="Show key numbers as metric cards in answers"><Toggle on={showMetrics} onChange={setShowMetrics}/></Row>
          <Row label="Follow-up suggestions" desc="Suggest next questions after every answer"><Toggle on={showFollowUps} onChange={setShowFollowUps}/></Row>
          <div style={{ marginBottom: 24 }}></div>

          {/* Security */}
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--b)' }}>Security</div>
          <Row label="Auth methods" desc="Email/password · Google OAuth · Magic link"><button style={outlineBtn}>Manage</button></Row>
          <Row label="Sign out" desc=""><button onClick={signOut} style={{ ...outlineBtn, color: '#f48080', borderColor: 'rgba(232,64,64,.28)', background: 'rgba(232,64,64,.08)' }}>Sign out</button></Row>
        </div>

        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ ...outlineBtn, flex: 1, padding: 10, borderRadius: 9999, fontSize: 13 }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: 10, borderRadius: 9999, border: 'none', background: '#1ed4ca', color: '#04080f', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

const outlineBtn: React.CSSProperties = { padding: '5px 13px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontFamily: 'inherit', fontSize: 12, cursor: 'pointer' }
