'use client'
// Money: who owes the factory (customers who took goods on credit) and whom the factory owes (suppliers
// delivered raw material). Built from approved dispatches and deliveries less recorded payments; the CFO
// reads the same numbers. Customers' balances carry sale prices, so that tab is for the production manager
// and owner; an inventory manager sees supplier balances only.
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { hasPermission } from '@/lib/pos-permissions'

const ACCENT = '#d08a59'
const GOOD = '#4ade80'
const BAD = '#f87171'
const METHODS = ['cash', 'mobile_money', 'bank', 'cheque', 'other']

interface Item {
  capture_id: string; party_name: string; party_phone?: string | null; product_name: string; quantity: number
  value: number; paid: number; outstanding: number; due_date: string; days_overdue: number; bucket: string
}
interface Report {
  ready: boolean; receivables: Item[]; payables: Item[]
  arTotal: number; apTotal: number; arOverdue: number; apOverdue: number
  aging: { current: number; overdue_30: number; overdue_60: number; overdue_90: number }
}

const field: React.CSSProperties = { minHeight: 44, padding: '0 12px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 16, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }

export default function FactoryMoneyPage() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready } = usePosAuth()
  const [report, setReport] = useState<Report | null>(null)
  const [currency, setCurrency] = useState('')
  const [tab, setTab] = useState<'customers' | 'suppliers'>('customers')
  const [paying, setPaying] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('cash')
  const [reference, setReference] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const seesCustomers = !!session && hasPermission(session.role, 'capture.approve_dispatch')
  const seesSuppliers = !!session && (seesCustomers || hasPermission(session.role, 'capture.approve'))
  const headers = session?.headers || {}

  const load = useCallback(async () => {
    if (!session) return
    try {
      const r = await fetch('/api/pos/factory/payments', { headers })
      if (r.ok) setReport(await r.json())
    } catch { /* leave as is */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.ownerId, session?.staffId])

  useEffect(() => {
    if (!ready || !session) return
    load()
    fetch('/api/pos/config', { headers }).then(r => (r.ok ? r.json() : null)).then(j => setCurrency(j?.currency_symbol || '')).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, session?.ownerId, load])

  useEffect(() => { if (session && !seesCustomers && seesSuppliers) setTab('suppliers') }, [session, seesCustomers, seesSuppliers])

  const fmt = (n: number) => `${currency}${Math.round(n).toLocaleString()}`

  async function savePayment(it: Item) {
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) return
    setBusy(true); setMsg(null)
    try {
      const r = await fetch('/api/pos/factory/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ capture_id: it.capture_id, amount: value, method, reference: reference.trim() || undefined, client_tx_id: `pay-${it.capture_id}-${Date.now()}` }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setMsg({ kind: 'err', text: d.error || tc('factory_money.error_generic') }); return }
      setMsg({ kind: 'ok', text: tc('factory_money.saved') })
      setPaying(null); setAmount(''); setReference('')
      await load()
    } catch { setMsg({ kind: 'err', text: tc('factory_money.error_generic') }) } finally { setBusy(false) }
  }

  async function remind(it: Item) {
    if (!window.confirm(tc('factory_money.remind_confirm', { name: it.party_name || tc('factory_money.unknown_party'), amount: fmt(it.outstanding) }))) return
    setMsg(null)
    try {
      const r = await fetch('/api/pos/factory/payments/remind', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ capture_id: it.capture_id }) })
      const d = await r.json().catch(() => ({}))
      setMsg(r.ok ? { kind: 'ok', text: tc('factory_money.remind_sent') } : { kind: 'err', text: d.error || tc('factory_money.error_generic') })
    } catch { setMsg({ kind: 'err', text: tc('factory_money.error_generic') }) }
  }

  const items = tab === 'customers' ? report?.receivables || [] : report?.payables || []
  const aging = report?.aging

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => router.push('/factory')} aria-label={tc('factory_money.back')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', minWidth: 44, minHeight: 44 }}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: ACCENT, margin: 0 }}>{tc('factory_money.title')}</h1>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{tc('factory_money.subtitle')}</div>
        </div>
      </div>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '6px 20px 8px', display: 'flex', justifyContent: 'flex-end' }}>
        <LanguageToggle inline />
      </div>

      <div style={{ padding: 20, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!ready || !session ? (
          <p role="status" style={{ fontSize: 15, color: '#cbd5e1' }}>{tc('factory_money.loading')}</p>
        ) : !seesSuppliers ? (
          <p role="status" style={{ fontSize: 15, color: '#cbd5e1' }}>{tc('factory_money.no_access')}</p>
        ) : !report ? (
          <p role="status" style={{ fontSize: 15, color: '#cbd5e1' }}>{tc('factory_money.loading')}</p>
        ) : !report.ready ? (
          <p role="status" style={{ fontSize: 15, color: '#cbd5e1' }}>{tc('factory_money.not_ready')}</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: seesCustomers ? '1fr 1fr' : '1fr', gap: 12 }}>
              {seesCustomers && (
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{tc('factory_money.owed_to_us')}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: GOOD }}>{fmt(report.arTotal)}</div>
                  {report.arOverdue > 0 && <div style={{ fontSize: 12, color: BAD, marginTop: 2 }}>{tc('factory_money.overdue')}: {fmt(report.arOverdue)}</div>}
                </div>
              )}
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{tc('factory_money.we_owe')}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: ACCENT }}>{fmt(report.apTotal)}</div>
                {report.apOverdue > 0 && <div style={{ fontSize: 12, color: BAD, marginTop: 2 }}>{tc('factory_money.overdue')}: {fmt(report.apOverdue)}</div>}
              </div>
            </div>

            {seesCustomers && aging && report.arTotal > 0 && (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{tc('factory_money.aging_title')}</div>
                {([['current', 'aging_current', GOOD], ['overdue_30', 'aging_30', '#fbbf24'], ['overdue_60', 'aging_60', '#fb923c'], ['overdue_90', 'aging_90', BAD]] as const).map(([k, label, color]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0', color: aging[k] > 0 ? color : '#64748b' }}>
                    <span>{tc('factory_money.' + label)}</span><strong>{fmt(aging[k])}</strong>
                  </div>
                ))}
              </div>
            )}

            {seesCustomers && (
              <div role="tablist" style={{ display: 'flex', gap: 8 }}>
                {(['customers', 'suppliers'] as const).map(t => (
                  <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setPaying(null) }}
                    style={{ flex: 1, minHeight: 44, borderRadius: 10, border: tab === t ? `1.5px solid ${ACCENT}` : '1px solid #334155', background: tab === t ? '#2a1d12' : '#1e293b', color: tab === t ? ACCENT : '#cbd5e1', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    {tc('factory_money.tab_' + t)}
                  </button>
                ))}
              </div>
            )}

            {msg && <div role={msg.kind === 'err' ? 'alert' : 'status'} style={{ fontSize: 14, color: msg.kind === 'err' ? '#fca5a5' : '#86efac' }}>{msg.text}</div>}

            {items.length === 0 ? (
              <p style={{ fontSize: 14, color: '#94a3b8' }}>{tc(tab === 'customers' ? 'factory_money.empty_customers' : 'factory_money.empty_suppliers')}</p>
            ) : items.map(it => (
              <div key={it.capture_id} style={{ background: '#1e293b', border: `1px solid ${it.days_overdue > 0 ? BAD + '66' : '#334155'}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{it.party_name || tc('factory_money.unknown_party')}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{it.product_name} · {it.quantity.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{fmt(it.outstanding)}</div>
                    <div style={{ fontSize: 12, color: it.days_overdue > 0 ? BAD : '#94a3b8' }}>
                      {it.days_overdue > 0 ? tc('factory_money.days_overdue', { count: it.days_overdue }) : tc('factory_money.due_on', { date: it.due_date })}
                    </div>
                  </div>
                </div>
                {it.paid > 0 && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{tc('factory_money.paid_of', { paid: fmt(it.paid), total: fmt(it.value) })}</div>}

                {paying === it.capture_id ? (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontSize: 13, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>{tc('factory_money.amount')}
                      <input type="number" inputMode="decimal" min={0} value={amount} onChange={e => setAmount(e.target.value)} placeholder={String(it.outstanding)} style={field} />
                    </label>
                    <label style={{ fontSize: 13, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>{tc('factory_money.method')}
                      <select value={method} onChange={e => setMethod(e.target.value)} style={field}>
                        {METHODS.map(m => <option key={m} value={m}>{tc('factory_money.method_' + m)}</option>)}
                      </select>
                    </label>
                    <label style={{ fontSize: 13, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: 6 }}>{tc('factory_money.reference')}
                      <input value={reference} onChange={e => setReference(e.target.value)} style={field} />
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => savePayment(it)} disabled={busy || !(Number(amount) > 0)} style={{ flex: 1, minHeight: 48, borderRadius: 12, border: 'none', background: ACCENT, color: '#1a1206', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: busy || !(Number(amount) > 0) ? 0.6 : 1 }}>{tc('factory_money.save')}</button>
                      <button onClick={() => setPaying(null)} style={{ minHeight: 48, padding: '0 18px', borderRadius: 12, border: '1px solid #334155', background: 'transparent', color: '#cbd5e1', fontSize: 15, cursor: 'pointer' }}>{tc('factory_money.cancel')}</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button onClick={() => { setPaying(it.capture_id); setAmount(String(it.outstanding)); setMsg(null) }}
                      style={{ minHeight: 44, padding: '0 16px', borderRadius: 10, border: `1px solid ${ACCENT}`, background: 'transparent', color: ACCENT, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                      {tc('factory_money.record_payment')}
                    </button>
                    {tab === 'customers' && (
                      <button onClick={() => remind(it)}
                        style={{ minHeight: 44, padding: '0 16px', borderRadius: 10, border: '1px solid #25D366', background: 'transparent', color: '#25D366', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                        💬 {tc('factory_money.remind_button')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {seesCustomers && <p style={{ fontSize: 12, color: '#64748b' }}>{tc('factory_money.cfo_note')}</p>}
          </>
        )}
      </div>
    </div>
  )
}
