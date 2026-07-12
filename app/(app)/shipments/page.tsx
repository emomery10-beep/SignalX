'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

// Centralised feature-chrome accent — change once, all 15+ usages follow
const IND     = '#6366F1'
const IND_T04 = 'rgba(99,102,241,.04)'
const IND_T06 = 'rgba(99,102,241,.06)'
const IND_T08 = 'rgba(99,102,241,.08)'
const IND_T10 = 'rgba(99,102,241,.1)'
const IND_T12 = 'rgba(99,102,241,.12)'
const IND_T15 = 'rgba(99,102,241,.15)'
const IND_T20 = 'rgba(99,102,241,.2)'

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
  'In Transit':       { bg: IND_T08,                text: IND,       dot: IND       },
  'Out for Delivery': { bg: 'rgba(34,197,94,.08)',  text: '#16a34a', dot: '#16a34a' },
  'Customs Hold':     { bg: 'rgba(239,68,68,.08)',  text: '#dc2626', dot: '#dc2626' },
  'Exception':        { bg: 'rgba(239,68,68,.08)',  text: '#dc2626', dot: '#dc2626' },
  'Pending':          { bg: 'rgba(107,107,96,.08)', text: 'var(--tx3)', dot: 'var(--b2)' },
  'Picked Up':        { bg: IND_T06,                text: IND,       dot: IND       },
  'Delayed':          { bg: 'rgba(245,158,11,.08)', text: '#d97706', dot: '#d97706' },
}

const STATUS_KEY: Record<string, string> = {
  'Delivered':        'status_delivered',
  'In Transit':       'status_in_transit',
  'Out for Delivery': 'status_out_for_delivery',
  'Customs Hold':     'status_customs_hold',
  'Exception':        'status_exception',
  'Pending':          'status_pending',
  'Picked Up':        'status_picked_up',
  'Delayed':          'status_delayed',
}

function statusLabel(status: string, tc: (key: string) => string) {
  const k = STATUS_KEY[status]
  return k ? tc('shipments.' + k) : status
}

function PlanBadge({ plan, tc }: { plan: string; tc: (key: string) => string }) {
  const styles: Record<string, { bg: string; text: string; labelKey: string }> = {
    free:     { bg: 'rgba(107,107,96,.1)', text: 'var(--tx3)', labelKey: 'plan_free'     },
    growth:   { bg: IND_T10,              text: IND,           labelKey: 'plan_growth'   },
    business: { bg: 'rgba(124,58,237,.1)', text: '#7c3aed',   labelKey: 'plan_business' },
  }
  const s = styles[plan] || styles.free
  return (
    <span style={{ fontSize: 12, fontWeight: 700, color: s.text, background: s.bg, borderRadius: 9999, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '.04em' }}>
      {tc('shipments.' + s.labelKey)}
    </span>
  )
}

function LockedFeature({ feature, requiredPlan, onUpgrade, tc }: { feature: string; requiredPlan: string; onUpgrade: () => void; tc: (key: string) => string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: IND_T04, border: `1px solid ${IND_T12}` }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={IND} strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      <span style={{ fontSize: 13, color: 'var(--tx3)' }}>{feature}</span>
      <button
        onClick={e => { e.stopPropagation(); onUpgrade() }}
        style={{ fontSize: 13, color: IND, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: '6px 6px', margin: '-6px -6px', minHeight: 32, display: 'inline-flex', alignItems: 'center' }}
      >
        {tc('shipments.locked_upgrade_arrow').replace('{plan}', requiredPlan)}
      </button>
    </div>
  )
}

export default function ShipmentsPage() {
  const router = useRouter()
  const { tc } = useLang()
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
  const modalRef = useRef<HTMLDivElement>(null)

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

  // Modal: move focus inside on open, trap Tab, close on Escape
  useEffect(() => {
    if (!showAdd) return
    const el = modalRef.current
    if (!el) return
    const firstInput = el.querySelector<HTMLElement>('input,button,select,textarea')
    firstInput?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowAdd(false); return }
      if (e.key !== 'Tab') return
      const focusable = el.querySelectorAll<HTMLElement>(
        'input:not([disabled]),button:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
      const arr = Array.from(focusable)
      if (!arr.length) return
      const first = arr[0], last = arr[arr.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showAdd])

  const addShipment = async () => {
    if (!form.tracking_number.trim()) return showToast(tc('shipments.toast_tracking_required'), false)
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
        return showToast(d.error || tc('shipments.toast_failed_to_add'), false)
      }
      showToast(d.warning || tc('shipments.toast_added'), !d.warning)
      setShowAdd(false)
      setForm({ tracking_number: '', supplier_name: '', sku: '', quantity: '', unit_cost: '', expected_arrival: '', shipment_type: 'inbound', purchase_order_ref: '' })
      load()
    } catch (e: any) {
      showToast(e.message, false)
    } finally { setAdding(false) }
  }

  const askAbout = (s: Shipment) => {
    router.push('/ask')
    const skuPart = s.sku ? tc('shipments.ask_prompt_sku').replace('{sku}', s.sku) : ''
    const delayPart = s.delay_days ? tc('shipments.ask_prompt_delay').replace('{days}', String(s.delay_days)) : ''
    const detail = tc('shipments.ask_prompt')
      .replace('{tracking}', s.tracking_number)
      .replace('{sku}', skuPart)
      .replace('{status}', statusLabel(s.track_status, tc))
      .replace('{delay}', delayPart)
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail })), 400)
  }

  const card = { padding: '16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 10 }

  return (
    <div className="page-shell">
      {/* role="alert" announces errors immediately; role="status" is polite for success */}
      {toast && (
        <div
          role={toast.ok ? 'status' : 'alert'}
          aria-live={toast.ok ? 'polite' : 'assertive'}
          style={{ position: 'fixed', top: 16, right: 16, zIndex: 999, padding: '10px 16px', borderRadius: 10, background: toast.ok ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)', border: `1px solid ${toast.ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, color: toast.ok ? '#16a34a' : '#dc2626', fontSize: 15, fontWeight: 500 }}
        >
          {toast.msg}
        </div>
      )}

      <div className="page-shell-body">
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          {/* Plan upgrade banner — flat tint, no gradient */}
          {isFree && (
            <div style={{ marginBottom: 20, padding: '16px 20px', borderRadius: 14, background: IND_T06, border: `1px solid ${IND_T20}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)', marginBottom: 6 }}>{tc('shipments.free_banner_title')}</div>
                  <div style={{ fontSize: 14, color: 'var(--tx3)', lineHeight: 1.6 }}>
                    <div>{tc('shipments.free_banner_growth')}</div>
                    <div>{tc('shipments.free_banner_business')}</div>
                  </div>
                </div>
                <button onClick={() => router.push('/billing')} style={{ padding: '9px 18px', borderRadius: 9999, border: 'none', background: IND, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 44 }}>
                  {tc('shipments.see_plans')}
                </button>
              </div>
            </div>
          )}

          {/* Growth upgrade nudge */}
          {isGrowth && (
            <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(124,58,237,.06)', border: '1px solid rgba(124,58,237,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 14, color: 'var(--tx2)' }}>
                {tc('shipments.growth_nudge')}
              </div>
              <button onClick={() => router.push('/billing')} style={{ padding: '6px 14px', borderRadius: 9999, border: '1px solid rgba(124,58,237,.3)', background: 'transparent', color: '#7c3aed', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', minHeight: 44 }}>
                {tc('shipments.upgrade_to_business')}
              </button>
            </div>
          )}

          {/* Health stats — Growth and above */}
          {health && isGrowthOrAbove(plan) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
              {[
                { label: tc('shipments.stat_logistics_score'), value: `${health.score}/100`, color: health.color === 'green' ? '#16a34a' : health.color === 'red' ? '#dc2626' : '#d97706', show: true },
                { label: tc('shipments.stat_active'), value: health.active_shipments, color: 'var(--tx)', show: true },
                { label: tc('shipments.stat_at_risk'), value: health.at_risk, color: health.at_risk > 0 ? '#d97706' : '#16a34a', show: true },
                { label: tc('shipments.stat_customs_holds'), value: health.customs_holds, color: health.customs_holds > 0 ? '#dc2626' : '#16a34a', show: isBusiness },
                { label: tc('shipments.stat_in_transit_value'), value: `£${(health.total_working_capital || 0).toLocaleString()}`, color: 'var(--tx)', show: isBusiness },
                { label: tc('shipments.stat_daily_finance'), value: `£${(health.daily_financing_cost || 0).toFixed(0)}/d`, color: 'var(--tx3)', show: isBusiness },
              ].filter(s => s.show).map((stat, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
                  <div style={{ fontSize: 19, fontWeight: 700, color: stat.color, fontFamily: 'var(--font-sora)', marginBottom: 3 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--tx3)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Alerts — Business only — SVG icons replace emoji for clean AT output */}
          {isBusiness && alerts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {alerts.slice(0, 3).map((alert, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 12, border: `1px solid ${alert.level === 'critical' ? 'rgba(239,68,68,.3)' : 'rgba(245,158,11,.3)'}`, background: alert.level === 'critical' ? 'rgba(239,68,68,.06)' : 'rgba(245,158,11,.06)', marginBottom: 8, display: 'flex', gap: 10 }}>
                  {alert.level === 'critical' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: alert.level === 'critical' ? '#dc2626' : '#d97706', marginBottom: 3 }}>{alert.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--tx3)' }}>{alert.message}</div>
                  </div>
                  {alert.financial_impact > 0 && (
                    <div style={{ fontSize: 14, fontWeight: 700, color: alert.level === 'critical' ? '#dc2626' : '#d97706', whiteSpace: 'nowrap' }}>£{alert.financial_impact.toFixed(0)}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs — role="tablist" + aria-selected communicates active state to AT */}
          <div
            className="tab-strip"
            role="tablist"
            aria-label={tc('shipments.filter_label') || 'Filter shipments'}
            style={{ gap: 6, marginBottom: 16, borderBottom: '1px solid var(--b)' }}
          >
            {(['active', 'all', 'delivered'] as const).map(f => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                style={{ padding: '8px 14px', border: 'none', background: 'transparent', fontSize: 14, fontWeight: filter === f ? 600 : 400, color: filter === f ? IND : 'var(--tx3)', borderBottom: filter === f ? `2px solid ${IND}` : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize', minHeight: 44 }}
              >
                {tc('shipments.filter_' + f)}
              </button>
            ))}
          </div>

          {/* Shipments list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--tx3)' }}>{tc('shipments.loading')}</div>
          ) : shipments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 34, marginBottom: 12 }}>📦</div>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{tc('shipments.empty_title')}</div>
              <div style={{ fontSize: 15, color: 'var(--tx3)', marginBottom: 20 }}>{tc('shipments.empty_body')}</div>
              <button onClick={() => setShowAdd(true)} style={{ padding: '10px 20px', borderRadius: 9999, border: 'none', background: IND, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}>
                {tc('shipments.empty_cta')}
              </button>
            </div>
          ) : shipments.map(s => {
            const ss = s.customs_hold ? STATUS_COLOR['Customs Hold']
              : s.delay_days && s.delay_days > 3 ? STATUS_COLOR['Delayed']
              : STATUS_COLOR[s.track_status] || STATUS_COLOR['Pending']
            const isExpanded = expandedId === s.id
            return (
              <div key={s.id} style={{ ...card, borderColor: s.customs_hold ? 'rgba(239,68,68,.3)' : s.is_at_risk ? 'rgba(245,158,11,.2)' : 'var(--b)' }}>
                {/* Expand trigger — role="button" + onKeyDown makes it keyboard accessible */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`${s.tracking_number}${s.supplier_name ? ` — ${s.supplier_name}` : ''}, ${statusLabel(s.track_status, tc)}`}
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(isExpanded ? null : s.id) } }}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <code style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-mono)' }}>{s.tracking_number}</code>
                        {s.sku && <span style={{ fontSize: 13, color: 'var(--tx3)' }}>{s.sku}{s.quantity ? ' ' + tc('shipments.qty_suffix').replace('{qty}', String(s.quantity)) : ''}</span>}
                        {s.customs_hold && <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 9999, padding: '1px 6px' }}>{tc('shipments.badge_customs_hold')}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 9999, background: ss.bg }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot }} aria-hidden="true"/>
                          <span style={{ fontSize: 13, fontWeight: 600, color: ss.text }}>{statusLabel(s.track_status, tc)}</span>
                        </div>
                        {s.supplier_name && <span style={{ fontSize: 14, color: 'var(--tx3)' }}>{tc('shipments.from_supplier').replace('{supplier}', s.supplier_name)}</span>}
                        {s.last_location && <span style={{ fontSize: 14, color: 'var(--tx3)' }}>· {s.last_location}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
                      {s.total_value !== null ? (
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>£{s.total_value.toLocaleString()}</span>
                      ) : isGrowth || isFree ? (
                        <LockedFeature feature={tc('shipments.feature_total_value')} requiredPlan={tc('shipments.plan_growth')} onUpgrade={() => router.push('/billing')} tc={tc} />
                      ) : null}
                      {s.financial_impact !== null ? (
                        s.financial_impact > 0 && <span style={{ fontSize: 13, color: '#d97706' }}>{tc('shipments.financial_impact_suffix').replace('{amount}', s.financial_impact.toFixed(0))}</span>
                      ) : (isGrowth || isFree) && (
                        <LockedFeature feature={tc('shipments.feature_financial_impact')} requiredPlan={tc('shipments.plan_business')} onUpgrade={() => router.push('/billing')} tc={tc} />
                      )}
                      {s.delay_days !== null && s.delay_days > 0 && (
                        <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 600 }}>{tc('shipments.days_delayed').replace('{days}', String(s.delay_days))}</span>
                      )}
                      {s.expected_arrival && (
                        <span style={{ fontSize: 13, color: 'var(--tx3)' }}>{tc('shipments.eta').replace('{date}', new Date(s.expected_arrival).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))}</span>
                      )}
                    </div>
                  </div>
                  {s.last_event && <div style={{ fontSize: 14, color: 'var(--tx3)', fontStyle: 'italic' }}>"{s.last_event}"</div>}
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--b)', paddingTop: 12, marginTop: 10 }}>
                    {s.intelligence_locked && (
                      <div style={{ padding: '12px 14px', borderRadius: 10, background: IND_T04, border: `1px solid ${IND_T15}`, marginBottom: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: IND, marginBottom: 6 }}>{tc('shipments.intelligence_locked_title')}</div>
                        <div style={{ fontSize: 14, color: 'var(--tx3)', marginBottom: 10, lineHeight: 1.6 }}>
                          {tc('shipments.intelligence_locked_body')}
                        </div>
                        <button onClick={() => router.push('/billing')} style={{ padding: '7px 14px', borderRadius: 9999, border: 'none', background: IND, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          {tc('shipments.upgrade_to_business')}
                        </button>
                      </div>
                    )}

                    {isBusiness && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: 12 }}>
                        {[
                          { label: tc('shipments.detail_working_capital_days'), value: tc('shipments.detail_working_capital_days_value').replace('{days}', String(s.working_capital_days || 0)) },
                          { label: tc('shipments.detail_daily_financing'), value: tc('shipments.detail_daily_financing_value').replace('{amount}', (s.daily_financing_cost || 0).toFixed(2)) },
                          { label: tc('shipments.detail_financial_impact'), value: tc('shipments.detail_financial_impact_value').replace('{amount}', (s.financial_impact || 0).toFixed(0)) },
                        ].map((item, i) => (
                          <div key={i} style={{ padding: '8px 10px', borderRadius: 9, background: 'var(--ev)', border: '1px solid var(--b)' }}>
                            <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 2 }}>{item.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--tx)' }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button onClick={() => askAbout(s)} style={{ padding: '7px 14px', borderRadius: 9999, border: 'none', background: IND, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {tc('shipments.ask_askbiz')}
                      </button>
                      <a
                        href={`https://www.17track.net/en/track?nums=${s.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${tc('shipments.view_on_17track')} (opens in new tab)`}
                        style={{ padding: '7px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx2)', fontSize: 14, textDecoration: 'none' }}
                      >
                        {tc('shipments.view_on_17track')}
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
          {/* Backdrop — aria-hidden; Escape handled by keydown listener on document */}
          <div onClick={() => setShowAdd(false)} aria-hidden="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 199 }}/>
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-shipment-title"
            style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 520, background: 'var(--sf)', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTop: '1px solid var(--b)', zIndex: 200, padding: '20px 20px 32px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div id="add-shipment-title" style={{ fontFamily: 'var(--font-sora)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tc('shipments.modal_title')}</div>
            <div style={{ fontSize: 14, color: 'var(--tx3)', marginBottom: 16 }}>
              {isFree ? tc('shipments.modal_slots_free') : isGrowth ? tc('shipments.modal_slots_growth').replace('{count}', String(activeCount)) : ''}
              {isFree ? tc('shipments.modal_sub_free') : isGrowth ? tc('shipments.modal_sub_growth') : tc('shipments.modal_sub_business')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label htmlFor="field-tracking-number" style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                  {tc('shipments.label_tracking_number')} <span aria-hidden="true" style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  id="field-tracking-number"
                  value={form.tracking_number}
                  onChange={e => setForm(f => ({ ...f, tracking_number: e.target.value }))}
                  required
                  aria-required="true"
                  placeholder={tc('shipments.placeholder_tracking_number')}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 15, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>{tc('shipments.label_shipment_type')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['inbound', 'outbound', 'container'].map(t => (
                    <button
                      key={t}
                      onClick={() => setForm(f => ({ ...f, shipment_type: t }))}
                      aria-pressed={form.shipment_type === t}
                      style={{ padding: '6px 12px', borderRadius: 9999, border: `1px solid ${form.shipment_type === t ? IND : 'var(--b)'}`, background: form.shipment_type === t ? IND_T10 : 'transparent', color: form.shipment_type === t ? IND : 'var(--tx3)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize', minHeight: 36 }}
                    >
                      {tc('shipments.type_' + t)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label htmlFor="field-supplier-name" style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>{tc('shipments.label_supplier')}</label>
                  <input
                    id="field-supplier-name"
                    value={form.supplier_name}
                    onChange={e => setForm(f => ({ ...f, supplier_name: e.target.value }))}
                    placeholder={tc('shipments.placeholder_supplier')}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 15, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label htmlFor="field-sku" style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>{tc('shipments.label_sku')}</label>
                  <input
                    id="field-sku"
                    value={form.sku}
                    onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                    placeholder={tc('shipments.placeholder_sku')}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 15, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Financial fields — Growth and above */}
              {!isFree && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label htmlFor="field-quantity" style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>{tc('shipments.label_quantity')}</label>
                    <input
                      id="field-quantity"
                      value={form.quantity}
                      onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                      type="number"
                      placeholder={tc('shipments.placeholder_quantity')}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 15, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="field-unit-cost" style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>
                      {tc('shipments.label_unit_cost')}
                      {!isBusiness && <span style={{ fontSize: 12, color: IND, marginLeft: 4 }}>{tc('shipments.unit_cost_growth_tag')}</span>}
                    </label>
                    <input
                      id="field-unit-cost"
                      value={form.unit_cost}
                      onChange={e => setForm(f => ({ ...f, unit_cost: e.target.value }))}
                      type="number"
                      step="0.01"
                      placeholder={tc('shipments.placeholder_unit_cost')}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 15, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label htmlFor="field-expected-arrival" style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>{tc('shipments.label_expected_arrival')}</label>
                  <input
                    id="field-expected-arrival"
                    value={form.expected_arrival}
                    onChange={e => setForm(f => ({ ...f, expected_arrival: e.target.value }))}
                    type="date"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 15, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                {!isFree && (
                  <div>
                    <label htmlFor="field-po-reference" style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx2)', display: 'block', marginBottom: 5 }}>{tc('shipments.label_po_reference')}</label>
                    <input
                      id="field-po-reference"
                      value={form.purchase_order_ref}
                      onChange={e => setForm(f => ({ ...f, purchase_order_ref: e.target.value }))}
                      placeholder={tc('shipments.placeholder_po_reference')}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--b)', background: 'var(--bg)', fontSize: 15, fontFamily: 'inherit', color: 'var(--tx)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                )}
              </div>

              {/* Value preview — Growth and above */}
              {!isFree && form.quantity && form.unit_cost && (
                <div style={{ padding: '10px 12px', borderRadius: 9, background: IND_T06, border: `1px solid ${IND_T15}`, fontSize: 14, color: IND }}>
                  {tc('shipments.value_preview')}<strong>£{(parseFloat(form.quantity) * parseFloat(form.unit_cost)).toLocaleString()}</strong>
                  {isBusiness && <span>{tc('shipments.value_preview_financing')}<strong>£{((parseFloat(form.quantity) * parseFloat(form.unit_cost) * 0.085) / 365).toFixed(2)}/day</strong></span>}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button onClick={addShipment} disabled={adding} style={{ flex: 1, padding: '13px', borderRadius: 9999, border: 'none', background: adding ? 'var(--b)' : IND, color: adding ? 'var(--tx3)' : '#fff', fontSize: 16, fontWeight: 600, cursor: adding ? 'not-allowed' : 'pointer', fontFamily: 'inherit', minHeight: 44 }}>
                  {adding ? tc('shipments.btn_registering') : tc('shipments.btn_add_track')}
                </button>
                <button onClick={() => setShowAdd(false)} style={{ padding: '13px 20px', borderRadius: 9999, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', minHeight: 44 }}>
                  {tc('shipments.btn_cancel')}
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
