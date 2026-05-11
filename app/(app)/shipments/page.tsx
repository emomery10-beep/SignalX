'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Shipment {
  id: string
  tracking_number: string
  carrier_name: string
  supplier_name: string
  sku: string
  quantity: number
  total_value: number | null
  expected_arrival: string
  track_status: string
  last_event: string
  last_location: string
  shipment_type: string
  is_at_risk: boolean | null
  customs_hold: boolean
  delay_days: number | null
  financial_impact: number | null
  daily_financing_cost: number | null
  working_capital_days: number | null
  intelligence_locked: boolean
  plan_limit: string
}

const STATUS_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  'Delivered':        { bg: 'rgba(34,197,94,.08)',  text: '#16a34a', dot: '#16a34a' },
  'In Transit':       { bg: 'rgba(99,102,241,.08)', text: '#6366F1', dot: '#6366F1' },
  'Out for Delivery': { bg: 'rgba(34,197,94,.08)',  text: '#16a34a', dot: '#16a34a' },
  'Customs Hold':     { bg: 'rgba(239,68,68,.08)',  text: '#dc2626', dot: '#dc2626' },
  'Exception':        { bg: 'rgba(239,68,68,.08)',  text: '#dc2626', dot: '#dc2626' },
  'Pending':          { bg: 'rgba(107,107,96,.08)', text: 'var(--tx3)', dot: 'var(--b2)' },
  'Picked Up':        { bg: 'rgba(99,102,241,.06)', text: '#6366F1', dot: '#6366F1' },
  'Delayed':          { bg: 'rgba(245,158,11,.08)', text: '#d97706', dot: '#d97706' },
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    free:     { bg: 'rgba(107,107,96,.1)',   text: 'var(--tx3)', label: 'Free' },
    growth:   { bg: 'rgba(99,102,241,.1)',   text: '#6366F1',    label: 'Growth' },
    business: { bg: 'rgba(124,58,237,.1)',   text: '#7c3aed',    label: 'Business' },
  }
  const s = styles[plan] || styles.free
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: s.text, background: s.bg, borderRadius: 9999, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '.04em' }}>
      {s.label}
    </span>
  )
}

function LockedFeature({ feature, requiredPlan, onUpgrade }: { feature: string; requiredPlan: string; onUpgrade: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.12)' }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
      <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{feature}</span>
      <button onClick={onUpgrade} style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0 }}>
        {requiredPlan} →
      </button>
    </div>
  )
}

export default function ShipmentsPage() {
  const router = useRouter()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [health, setHealth] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [planFeatures, setPlanFeatures] = useState<any>(null)
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<'active' | 'all' | 'delivered'>('active')
  const [adding, setAdding] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  const [form, setForm] = useState({
    tracking_number: '', supplier_name: '', sku: '', quantity: '',
    unit_cost: '', expected_arrival: '', shipment_type: 'inbound', purchase_order_ref: '',
  })

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  const isBusiness = plan === 'business' || plan === 'enterprise'
  const isGrowth = plan === 'growth'
  const isFree = plan === 'free' || plan === 'starter'
  const maxShipments = isBusiness ? Infinity : isGrowth ? 5 : 1
  const activeCount = shipments.filter(s => !['Delivered', 'Undelivered', 'Expired'].includes(s.track_status)).length

  const load = async () => {
    try {
      const [sr, lr] = await Promise.all([
        fetch(`/api/track?status=${filter === 'delivered' ? 'delivered' : filter === 'all' ? 'all' : 'active'}`),
        fetch('/api/logistics'),
      ])
      if (sr.ok) {
        const d = await sr.json()
        setShipments(d.shipments || [])
        if (d.plan) setPlan(d.plan)
      }
      if (lr.ok) {
        const d = await lr.json()
        setHealth(d.health || null)
        setAlerts(d.alerts || [])
        setPlanFeatures(d.plan_features || null)
        if (d.plan) setPlan(d.plan)
      }
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [filter])

  const addShipment = async () => {
    if (!form.tracking_number.trim()) return showToast('Tracking number required', false)
    setAdding(true)
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          ...form,
          quantity: form.quantity ? parseInt(form.quantity) : null,
          unit_cost: form.unit_cost ? parseFloat(form.unit_cost) : null,
        }),
      })
      const d = await res.json()
      if (!res.ok) {
        if (d.locked) {
          showToast(d.error, false)
          setShowAdd(false)
          setTimeout(() => router.push('/billing'), 1500)
          return
        }
        return showToast(d.error || 'Failed to add', false)
      }
      showToast('Shipment added and registered ✓')
      setShowAdd(false)
      setForm({ tracking_number: '', supplier_name: '', sku: '', quantity: '', unit_cost: '', expected_arrival: '', shipment_type: 'inbound', purchase_order_ref: '' })
      load()
    } catch (e: any) {
      showToast(e.message, false)
    } finally { setAdding(false) }
  }

  const askAbout = (s: Shipment) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', {
      detail: `Analyse shipment ${s.tracking_number}${s.sku ? ` for ${s.sku}` : ''}. Status: ${s.track_status}. ${s.delay_days ? s.delay_days + ' days delayed.' : ''} What are my options?`
    })), 400)
  }

  const card = { padding: '16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 10 }

  return (
    <div className="page-shell">
      {toast && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999, padding: '10px 16px', borderRadius: 10, background: toast.ok ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)', border: `1px solid ${toast.ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, color: toast.ok ? '#16a34a' : '#dc2626', fontSize: 13, fontWeight: 500 }}>{toast.msg}</div>
      )}

      <div className="page-shell-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📦</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>Shipments</span>
              <PlanBadge plan={plan} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--tx3)' }}>
              {isFree ? '1 shipment · Status tracking only'
                : isGrowth ? '5 shipments · Basic financial data'
                : 'Unlimited · Full intelligence'}
              {maxShipments !== Infinity && <span style={{ color: activeCount >= maxShipments ? '#dc2626' : 'var(--tx3)' }}> · {activeCount}/{maxShipments} used</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {activeCount >= maxShipments && maxShipments !== Infinity && (
            <button onClick={() => router.push('/billing')} style={{ padding: '7px 14px', borderRadius: 9999, border: '1px solid rgba(99,102,241,.3)', background: 'rgba(99,102,241,.08)', color: '#6366F1', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Upgrade for more →
            </button>
          )}
          <button
            onClick={() => activeCount >= maxShipments && maxShipments !== Infinity ? router.push('/billing') : setShowAdd(true)}
            style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: activeCount >= maxShipments && maxShipments !== Infinity ? 'var(--b2)' : '#6366F1', color: activeCount >= maxShipments && maxShipments !== Infinity ? 'var(--tx3)' : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            {activeCount >= maxShipments && maxShipments !== Infinity ? '🔒 Limit reached' : '+ Add shipment'}
          </button>
        </div>
      </div>

      <div className="page-shell-body">
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Plan upgrade banner for free users */}
          {isFree && (
            <div style={{ marginBottom: 20, padding: '16px 20px', borderRadius: 14, background: 'linear-gradient(135deg, rgba(99,102,241,.08), rgba(124,58,237,.08))', border: '1px solid rgba(99,102,241,.2)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', marginBottom: 6 }}>Unlock full shipment intelligence</div>
                  <div style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.6 }}>
                    <div>🔒 <strong>Growth</strong> — 5 shipments, total value tracking, delay alerts</div>
                    <div>🔒 <strong>Business</strong> — Unlimited shipments, financial impact, customs alerts, supplier scoring, stockout risk, working capital intelligence</div>
                  </div>
                </div>
                <button onClick={() => router.push('/billing')} style={{ padding: '9px 18px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  See plans →
                </button>
              </div>
            </div>
          )}

          {/* Growth upgrade nudge */}
          {isGrowth && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(124,58,237,.06)', border: '1px solid rgba(124,58,237,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, color: 'var(--tx2)' }}>
                🔒 <strong>Business plan</strong> unlocks: financial impact per shipment · customs hold alerts · supplier reliability scoring · stockout risk engine · working capital intelligence
              </div>
              <button onClick={() => router.push('/billing')} style={{ padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(124,58,237,.3)', background: 'transparent', color: '#7c3aed', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Upgrade to Business →
              </button>
            </div>
          )}

          {/* Health stats — Growth and above */}
          {health && isGrowthOrAbove(plan) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Logistics Score', value: `${health.score}/100`, color: health.color === 'green' ? '#16a34a' : health.color === 'red' ? '#dc2626' : '#d97706', show: true },
                { label: 'Active', value: health.active_shipments, color: 'var(--tx)', show: true },
                { label: 'At Risk', value: health.at_risk, color: health.at_risk > 0 ? '#d97706' : '#16a34a', show: true },
                { label: 'Customs Holds', value: health.customs_holds, color: health.customs_holds > 0 ? '#dc2626' : '#16a34a', show: isBusiness },
                { label: 'In Transit £', value: `£${(health.total_working_capital || 0).toLocaleString()}`, color: 'var(--tx)', show: isBusiness },
                { label: 'Daily Finance', value: `£${(health.daily_financing_cost || 0).toFixed(0)}/d`, color: 'var(--tx3)', show: isBusiness },
              ].filter(s => s.show).map((stat, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: stat.color, fontFamily: 'var(--font-sora)', marginBottom: 3 }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Alerts — Business only */}
          {isBusiness && alerts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {alerts.slice(0, 3).map((alert, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 12, border: `1px solid ${alert.level === 'critical' ? 'rgba(239,68,68,.3)' : 'rgba(245,158,11,.3)'}`, background: alert.level === 'critical' ? 'rgba(239,68,68,.06)' : 'rgba(245,158,11,.06)', marginBottom: 8, display: 'flex', gap: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{alert.level === 'critical' ? '🚨' : '⚠️'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: alert.level === 'critical' ? '#dc2626' : '#d97706', marginBottom: 3 }}>{alert.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{alert.message}</div>
                  </div>
                  {alert.financial_impact > 0 && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: alert.level === 'critical' ? '#dc2626' : '#d97706', whiteSpace: 'nowrap' }}>£{alert.financial_impact.toFixed(0)}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, borderBottom: '1px solid var(--b)' }}>
            {(['active', 'all', 'delivered'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 14px', border: 'none', background: 'transparent', fontSize: 12, fontWeight: filter === f ? 600 : 400, color: filter === f ? '#6366F1' : 'var(--tx3)', borderBottom: filter === f ? '2px solid #6366F1' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
          </div>

          {/* Shipments list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--tx3)' }}>Loading…</div>
          ) : shipments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No shipments yet</div>
              <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 20 }}>Add your first tracking number to start monitoring your supply chain.</div>
              <button onClick={() => setShowAdd(true)} style={{ padding: '10px 20px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Add shipment →
              </button>
            </div>
          ) : shipments.map(s => {
            const ss = s.customs_hold ? STATUS_COLOR['Customs Hold']
              : s.delay_days && s.delay_days > 3 ? STATUS_COLOR['Delayed']
              : STATUS_COLOR[s.track_status] || STATUS_COLOR['Pending']
            const isExpanded = expandedId === s.id
            return (
              <div key={s.id} style={{ ...card, borderColor: s.customs_hold ? 'rgba(239,68,68,.3)' : s.is_at_risk ? 'rgba(245,158,11,.2)' : 'var(--b)' }}>
                <div onClick={() => setExpandedId(isExpanded ? null : s.id)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <code style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-mono)' }}>{s.tracking_number}</code>
                        {s.sku && <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{s.sku}{s.quantity ? ` ×${s.quantity}` : ''}</span>}
                        {s.customs_hold && <span style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 9999, padding: '1px 6px' }}>CUSTOMS HOLD</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 9999, background: ss.bg }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot }}/>
                          <span style={{ fontSize: 11, fontWeight: 600, color: ss.text }}>{s.track_status}</span>
                        </div>
                        {s.supplier_name && <span style={{ fontSize: 12, color: 'var(--tx3)' }}>from {s.supplier_name}</span>}
                        {s.last_location && <span style={{ fontSize: 12, color: 'var(--tx3)' }}>· {s.last_location}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      {/* Total value — Growth and above */}
                      {s.total_value !== null ? (
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>£{s.total_value.toLocaleString()}</span>
                      ) : isGrowth || isFree ? (
                        <LockedFeature feature="Total value" requiredPlan={isFree ? 'Growth' : 'Growth'} onUpgrade={() => router.push('/billing')} />
                      ) : null}
                      {/* Financial impact — Business only */}
                      {s.financial_impact !== null ? (
                        s.financial_impact > 0 && <span style={{ fontSize: 11, color: '#d97706' }}>£{s.financial_impact.toFixed(0)} impact</span>
                      ) : (isGrowth || isFree) && (
                        <LockedFeature feature="Financial impact" requiredPlan="Business" onUpgrade={() => router.push('/billing')} />
                      )}
                      {s.delay_days !== null && s.delay_days > 0 && (
                        <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>{s.delay_days}d delayed</span>
                      )}
                      {s.expected_arrival && (
                        <span style={{ fontSize: 11, color: 'var(--tx3)' }}>ETA {new Date(s.expected_arrival).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      )}
                    </div>
                  </div>
                  {s.last_event && <div style={{ fontSize: 12, color: 'var(--tx3)', fontStyle: 'italic' }}>"{s.last_event}"</div>}
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--b)', paddingTop: 12, marginTop: 10 }}>
                    {/* Intelligence locked state for non-business */}
                    {s.intelligence_locked && (
                      <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(99,102,241,.04)', border: '1px solid rgba(99,102,241,.15)', marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', marginBottom: 6 }}>🔒 Business plan intelligence</div>
                        <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 10, lineHeight: 1.6 }}>
                          Upgrade to Business to unlock: working capital days · daily financing cost · financial impact · stockout risk alerts · customs hold financial modelling · supplier reliability score
                        </div>
                        <button onClick={() => router.push('/billing')} style={{ padding: '7px 14px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          Upgrade to Business →
                        </button>
                      </div>
                    )}

                    {/* Business intelligence details */}
                    {isBusiness && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: 12 }}>
                        {[
                          { label: 'Working Capital Days', value: `${s.working_capital_days || 0}d` },
                          { label: 'Daily Financing', value: `£${(s.daily_financing_cost || 0).toFixed(2)}/day` },
                          { label: 'Financial Impact', value: `£${(s.financial_impact || 0).toFixed(0)}` },
                        ].map((item, i) => (
                          <div key={i} style={{ padding: '8px 10px', borderRadius: 9, background: 'var(--ev)', border: '1px solid var(--b)' }}>
                            <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 2 }}>{item.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button onClick={() => askAbout(s)} style={{ padding: '7px 14px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Ask AskBiz →
                      </button>
                      <a href={`https://www.17track.net/en/track?nums=${s.tracking_number}`} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontSize: 12, textDecoration: 'none' }}>
                        View on 17Track ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <>
          <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 199 }}/>
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 520, background: 'var(--sf)', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTop: '1px solid var(--b)', zIndex: 200, padding: '20px 20px 32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Add Shipment</div>
            <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 16 }}>
              {isFree ? '1 of 1 slots used · ' : isGrowth ? `${activeCount} of 5 slots used · ` : ''}
              {isFree ? 'Status tracking only' : isGrowth ? 'Basic financial data included' : 'Full intelligence included'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>Tracking Number *</label>
                <input value={form.tracking_number} onChange={e => setForm(f => ({ ...f, tracking_number: e.target.value }))}
                  placeholder="e.g. RR123456789CN" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}/>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>Shipment Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['inbound', 'outbound', 'container'].map(t => (
                    <button key={t} onClick={() => setForm(f => ({ ...f, shipment_type: t }))}
                      style={{ padding: '6px 12px', borderRadius: 9999, border: `1px solid ${form.shipment_type === t ? '#6366F1' : 'var(--b)'}`, background: form.shipment_type === t ? 'rgba(99,102,241,.1)' : 'transparent', color: form.shipment_type === t ? '#6366F1' : 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{t}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>Supplier</label>
                  <input value={form.supplier_name} onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value }))}
                    placeholder="Supplier name" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>SKU / Product</label>
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                    placeholder="Product name" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}/>
                </div>
              </div>

              {/* Financial fields — Growth and above */}
              {!isFree && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>Quantity</label>
                    <input value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                      type="number" placeholder="500" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}/>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                      Unit Cost
                      {!isBusiness && <span style={{ fontSize: 10, color: '#6366F1', marginLeft: 4 }}>Growth</span>}
                    </label>
                    <input value={form.unit_cost} onChange={e => setForm(f => ({ ...f, unit_cost: e.target.value }))}
                      type="number" step="0.01" placeholder="12.50" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}/>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>Expected Arrival</label>
                  <input value={form.expected_arrival} onChange={e => setForm(f => ({ ...f, expected_arrival: e.target.value }))}
                    type="date" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}/>
                </div>
                {!isFree && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>PO Reference</label>
                    <input value={form.purchase_order_ref} onChange={e => setForm(f => ({ ...f, purchase_order_ref: e.target.value }))}
                      placeholder="PO-2026-0042" style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}/>
                  </div>
                )}
              </div>

              {/* Value preview — Growth and above */}
              {!isFree && form.quantity && form.unit_cost && (
                <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.15)', fontSize: 12, color: '#6366F1' }}>
                  💰 Shipment value: <strong>£{(parseFloat(form.quantity) * parseFloat(form.unit_cost)).toLocaleString()}</strong>
                  {isBusiness && <span> · Daily financing: <strong>£{((parseFloat(form.quantity) * parseFloat(form.unit_cost) * 0.085) / 365).toFixed(2)}/day</strong></span>}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button onClick={addShipment} disabled={adding} style={{ flex: 1, padding: '11px', borderRadius: 9999, border: 'none', background: adding ? 'var(--b)' : '#6366F1', color: adding ? 'var(--tx3)' : '#fff', fontSize: 14, fontWeight: 600, cursor: adding ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {adding ? 'Registering…' : 'Add & Track →'}
                </button>
                <button onClick={() => setShowAdd(false)} style={{ padding: '11px 20px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function isGrowthOrAbove(plan: string) {
  return ['growth', 'business', 'enterprise'].includes(plan)
}
