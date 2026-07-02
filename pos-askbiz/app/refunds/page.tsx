'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'
import { hasPermission } from '@/lib/pos-permissions'
import { getRoleHomeRoute } from '@/lib/pos-role-client'

const API = process.env.NEXT_PUBLIC_API_URL || ''
const ACC = 'var(--pos-accent)'

interface TxItem {
  id: string
  name: string
  qty: number
  unit_price: number
  line_total: number
  refunded?: boolean
}

interface Tx {
  id: string
  total: number
  payment_type: string
  status: string
  created_at: string
  cashier?: { id: string; name: string } | null
  pos_items?: TxItem[]
}

interface StaffSession {
  id: string
  name: string
  role: string
  owner_id: string
  currency_symbol: string
}

export default function RefundsPage() {
  const router = useRouter()
  const { tc, fmtDateTime } = useLang()
  const [staff, setStaff] = useState<StaffSession | null>(null)
  const [sym, setSym] = useState('£')
  const [txns, setTxns] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Refund sheet
  const [selected, setSelected] = useState<Tx | null>(null)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [doneMsg, setDoneMsg] = useState('')

  const loadTxns = useCallback(async (s: StaffSession) => {
    setLoading(true)
    setLoadError('')
    try {
      const from = new Date(Date.now() - 7 * 86400000).toISOString()
      const res = await fetch(`${API}/api/pos/transactions?from=${from}`, {
        headers: { 'x-owner-id': s.owner_id, 'x-staff-id': s.id },
      })
      const data = await res.json()
      if (!res.ok) { setLoadError(data.error || tc('dashboard.refunds_load_failed')); setTxns([]) }
      else setTxns((data.transactions || []).filter((t: Tx) => ['completed', 'partially_refunded', 'refunded'].includes(t.status)))
    } catch {
      setLoadError(tc('dashboard.refunds_load_failed'))
    }
    setLoading(false)
  }, [tc])

  useEffect(() => {
    const session = localStorage.getItem('pos_staff')
    if (!session) { router.push('/'); return }
    const s = JSON.parse(session) as StaffSession
    // Refunds are manager/owner only — same permission the API enforces
    if (!hasPermission(s.role, 'refund.approve')) { router.push(getRoleHomeRoute(s.role)); return }
    setStaff(s)
    setSym(s.currency_symbol || '£')
    loadTxns(s)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openSheet = (t: Tx) => {
    const refundable = (t.pos_items || []).filter(i => !i.refunded)
    setSelected(t)
    // Default to a full refund of everything still refundable
    setCheckedItems(Object.fromEntries(refundable.map(i => [i.id, true])))
    setReason('')
    setSubmitError('')
  }

  const refundableItems = (selected?.pos_items || []).filter(i => !i.refunded)
  const chosen = refundableItems.filter(i => checkedItems[i.id])
  const refundAmount = chosen.reduce((s, i) => s + (i.line_total ?? i.qty * i.unit_price), 0)
  const isFullRefund = chosen.length === refundableItems.length && (selected?.pos_items || []).every(i => i.refunded || checkedItems[i.id])

  const submitRefund = async () => {
    if (!staff || !selected || chosen.length === 0 || !reason.trim() || submitting) return
    if (!window.confirm(tc('dashboard.refunds_confirm', { amount: `${sym}${refundAmount.toFixed(2)}` }))) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch(`${API}/api/pos/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-owner-id': staff.owner_id, 'x-staff-id': staff.id },
        body: JSON.stringify({
          transaction_id: selected.id,
          full_refund: isFullRefund,
          item_ids: isFullRefund ? undefined : chosen.map(i => i.id),
          reason: reason.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setSubmitError(data.error || tc('dashboard.refunds_failed'))
      } else {
        setDoneMsg(tc('dashboard.refunds_done', { amount: `${sym}${refundAmount.toFixed(2)}` }))
        setSelected(null)
        loadTxns(staff)
        setTimeout(() => setDoneMsg(''), 5000)
      }
    } catch {
      setSubmitError(tc('dashboard.refunds_failed'))
    }
    setSubmitting(false)
  }

  const QUICK_REASONS = ['refunds_reason_faulty', 'refunds_reason_wrong_item', 'refunds_reason_changed_mind', 'refunds_reason_overcharged']

  if (!staff) return null

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: 'var(--pos-bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--pos-border)' }}>
        <button onClick={() => router.back()} aria-label={tc('dashboard.refunds_back')} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--pos-surface)', border: '1px solid var(--pos-border)', color: 'var(--pos-ink)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--pos-ink)' }}>{tc('dashboard.refunds_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--pos-muted)' }}>{tc('dashboard.refunds_subtitle')}</div>
        </div>
      </div>

      {doneMsg && (
        <div role="status" style={{ margin: '12px 20px 0', padding: '11px 14px', borderRadius: 12, background: 'var(--pos-success-pale)', border: '1px solid var(--pos-success-ring)', fontSize: 14, fontWeight: 600, color: 'var(--pos-success)' }}>
          ✓ {doneMsg}
        </div>
      )}
      {loadError && (
        <div role="alert" style={{ margin: '12px 20px 0', padding: '11px 14px', borderRadius: 12, background: 'var(--pos-danger-pale)', border: '1px solid var(--pos-danger-ring)', fontSize: 13, color: 'var(--pos-danger)' }}>
          ⚠ {loadError}
        </div>
      )}

      {/* Transaction list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--pos-muted)', fontSize: 14 }}>{tc('dashboard.refunds_loading')}</div>
        ) : txns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--pos-muted)', fontSize: 14 }}>{tc('dashboard.refunds_empty')}</div>
        ) : (
          txns.map(t => {
            const fullyRefunded = t.status === 'refunded'
            return (
              <button
                key={t.id}
                onClick={() => { if (!fullyRefunded) openSheet(t) }}
                disabled={fullyRefunded}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 16px', background: 'var(--pos-surface)', borderRadius: 14, marginBottom: 8, border: '1px solid var(--pos-border)', cursor: fullyRefunded ? 'default' : 'pointer', fontFamily: 'inherit', textAlign: 'left', opacity: fullyRefunded ? 0.55 : 1 }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--pos-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {(t.pos_items || []).map(i => i.name).join(', ') || tc('dashboard.refunds_no_items')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--pos-muted)', marginTop: 2 }}>
                    {fmtDateTime(t.created_at)}{t.cashier?.name ? ` · ${t.cashier.name}` : ''} · {t.payment_type}
                  </div>
                  {t.status !== 'completed' && (
                    <span style={{ display: 'inline-block', marginTop: 4, fontSize: 10, fontWeight: 700, color: 'var(--pos-danger)', background: 'var(--pos-danger-pale)', padding: '2px 8px', borderRadius: 9999 }}>
                      {t.status === 'refunded' ? tc('dashboard.refunds_badge_refunded') : tc('dashboard.refunds_badge_partial')}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: fullyRefunded ? 'var(--pos-danger)' : 'var(--pos-ink)' }}>{sym}{(t.total || 0).toFixed(2)}</div>
              </button>
            )
          })
        )}
      </div>

      {/* Refund sheet */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'flex-end', zIndex: 999 }} onClick={e => e.target === e.currentTarget && !submitting && setSelected(null)}>
          <div className="pos-sheet" style={{ width: '100%', maxHeight: '85vh', overflowY: 'auto', background: 'var(--pos-surface)', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px' }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--pos-ink)', marginBottom: 4 }}>{tc('dashboard.refunds_sheet_title')}</div>
            <div style={{ fontSize: 13, color: 'var(--pos-muted)', marginBottom: 16 }}>{tc('dashboard.refunds_sheet_hint')}</div>

            {/* Item checkboxes */}
            {(selected.pos_items || []).map(i => (
              <label key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: '1px solid var(--pos-border)', marginBottom: 8, cursor: i.refunded ? 'default' : 'pointer', opacity: i.refunded ? 0.5 : 1, background: 'var(--pos-bg)' }}>
                <input
                  type="checkbox"
                  checked={!!checkedItems[i.id]}
                  disabled={!!i.refunded}
                  onChange={e => setCheckedItems(prev => ({ ...prev, [i.id]: e.target.checked }))}
                  style={{ width: 20, height: 20, accentColor: 'var(--pos-accent)' }}
                />
                <span style={{ flex: 1, fontSize: 14, color: 'var(--pos-ink)' }}>
                  {i.name} ×{i.qty}
                  {i.refunded && <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'var(--pos-danger)' }}>{tc('dashboard.refunds_badge_refunded')}</span>}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos-ink)' }}>{sym}{(i.line_total ?? i.qty * i.unit_price).toFixed(2)}</span>
              </label>
            ))}

            {/* Reason */}
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--pos-ink)', margin: '14px 0 8px' }}>{tc('dashboard.refunds_reason_label')}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {QUICK_REASONS.map(k => {
                const label = tc(`dashboard.${k}`)
                return (
                  <button key={k} onClick={() => setReason(label)} style={{ padding: '8px 12px', borderRadius: 9999, border: `1.5px solid ${reason === label ? ACC : 'var(--pos-border)'}`, background: reason === label ? 'var(--pos-accent-pale)' : 'var(--pos-bg)', color: reason === label ? ACC : 'var(--pos-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {label}
                  </button>
                )
              })}
            </div>
            <input
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder={tc('dashboard.refunds_reason_placeholder')}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid var(--pos-border)', fontSize: 14, fontFamily: 'inherit', background: 'var(--pos-bg)', color: 'var(--pos-ink)', boxSizing: 'border-box', marginBottom: 14 }}
            />

            {submitError && (
              <div role="alert" style={{ marginBottom: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--pos-danger-pale)', border: '1px solid var(--pos-danger-ring)', fontSize: 13, color: 'var(--pos-danger)' }}>
                ⚠ {submitError}
              </div>
            )}

            <button
              onClick={submitRefund}
              disabled={submitting || chosen.length === 0 || !reason.trim()}
              style={{ width: '100%', padding: '15px', borderRadius: 12, background: 'var(--pos-danger)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: submitting ? 'wait' : 'pointer', opacity: (chosen.length === 0 || !reason.trim()) ? 0.5 : 1 }}
            >
              {submitting
                ? tc('dashboard.refunds_processing')
                : chosen.length === 0
                ? tc('dashboard.refunds_pick_items')
                : !reason.trim()
                ? tc('dashboard.refunds_need_reason')
                : tc(isFullRefund ? 'dashboard.refunds_submit_full' : 'dashboard.refunds_submit_partial', { amount: `${sym}${refundAmount.toFixed(2)}` })}
            </button>
            <button onClick={() => !submitting && setSelected(null)} style={{ width: '100%', marginTop: 8, padding: '12px', borderRadius: 12, background: 'transparent', border: '1px solid var(--pos-border)', fontSize: 14, cursor: 'pointer', color: 'var(--pos-muted)', fontFamily: 'inherit' }}>
              {tc('dashboard.refunds_cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
