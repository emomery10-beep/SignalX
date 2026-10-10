'use client'
// Cost rates for ONE factory: labour and electricity per working day, plus a monthly overhead.
// Saved per factory and shared with the CFO and the Factory tab, so cost per unit is the same
// everywhere. Managers/owners only (the API enforces it too). Starting values are country-
// specific: only a Kenyan sesame oil factory is pre-filled, every other country starts empty.
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import LanguageToggle from '@/components/LanguageToggle'
import { WORKING_DAYS_PER_MONTH } from '@/lib/factory-cost-defaults'

const ACCENT = '#d08a59'
const MANAGER_ROLES = new Set(['owner', 'manager', 'branch_manager', 'factory-production-manager'])

const field: React.CSSProperties = { minHeight: 44, padding: '0 12px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 16, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' }
const lab: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#cbd5e1', textAlign: 'left' }

interface Factory { id: string; name: string }

export default function FactoryRatesPage() {
  const router = useRouter()
  const { session, ready } = usePosAuth()
  const [factories, setFactories] = useState<Factory[]>([])
  const [factoryId, setFactoryId] = useState('')
  const [currency, setCurrency] = useState('')
  const [configured, setConfigured] = useState(false)
  const [saved, setSaved] = useState(false)
  const [staff, setStaff] = useState('')
  const [elec, setElec] = useState('')
  const [bill, setBill] = useState('')
  const [overhead, setOverhead] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  const allowed = !!session && MANAGER_ROLES.has(session.role)
  const headers = session?.headers || {}
  // PIN staff are tied to one branch (the API knows it); the owner picks a factory.
  const needsPick = !!session && !session.isPin

  // Owner: which factories exist
  useEffect(() => {
    if (!session || !needsPick) return
    fetch('/api/pos/locations', { headers }).then(r => (r.ok ? r.json() : null)).then(j => {
      const list: Factory[] = ((j?.locations || []) as any[]).filter(l => l.kind === 'factory').map(l => ({ id: l.id, name: l.name }))
      setFactories(list)
      if (list.length > 0) setFactoryId(list[0].id)
    }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.ownerId, needsPick])

  const load = useCallback(async () => {
    if (!session || (needsPick && !factoryId)) return
    const qs = needsPick ? `?location_id=${encodeURIComponent(factoryId)}` : ''
    try {
      const r = await fetch(`/api/pos/factory/cost-settings${qs}`, { headers })
      if (!r.ok) { setMsg({ kind: 'err', text: 'Could not load your rates.' }); return }
      const d = await r.json()
      const st = d.settings
      setCurrency(d.currency || '')
      setSaved(!!d.saved)
      setConfigured(!!st?.configured)
      setStaff(st?.configured ? String(st.staffPerDay) : '')
      setElec(st?.configured ? String(st.electricityPerDay) : '')
      setOverhead(st?.configured && st.overhead ? String(st.overhead) : '')
      setBill('')
    } catch { setMsg({ kind: 'err', text: 'Could not load your rates.' }) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.ownerId, factoryId, needsPick])
  useEffect(() => { load() }, [load])

  const save = async () => {
    setMsg(null)
    const s = Number(staff)
    const b = Number(bill)
    const e = b > 0 ? Math.round(b / WORKING_DAYS_PER_MONTH) : Number(elec)
    if (!Number.isFinite(s) || s < 0 || !Number.isFinite(e) || e < 0) { setMsg({ kind: 'err', text: 'Enter valid amounts.' }); return }
    setBusy(true)
    try {
      const qs = needsPick ? `?location_id=${encodeURIComponent(factoryId)}` : ''
      const r = await fetch(`/api/pos/factory/cost-settings${qs}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          staff_per_day: s, electricity_per_day: e, overhead: Number(overhead) || 0,
          electricity_basis: b > 0 ? { mode: 'monthly_bill', monthly_bill: b, working_days: WORKING_DAYS_PER_MONTH } : { mode: 'per_day' },
        }),
      })
      if (!r.ok) { const j = await r.json().catch(() => ({})); setMsg({ kind: 'err', text: j.error || 'Could not save.' }); return }
      setConfigured(true); setSaved(true); setElec(String(e)); setBill('')
      setMsg({ kind: 'ok', text: 'Saved. The CFO and Factory tab now use these rates.' })
    } catch { setMsg({ kind: 'err', text: 'Could not save.' }) } finally { setBusy(false) }
  }

  if (!ready) return <div style={{ minHeight: '100vh', background: '#0f172a' }} />

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif', paddingBottom: 40 }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.push('/factory')} aria-label="Back to factory" style={{ width: 44, height: 44, borderRadius: '50%', background: '#334155', border: 'none', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: ACCENT }}>Cost rates</h1>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Labour, electricity and overhead for your factory</div>
        </div>
      </div>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '6px 20px 8px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <LanguageToggle inline />
      </div>

      <div style={{ padding: 20, maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!session || !allowed ? (
          <p role="status" style={{ fontSize: 15, color: '#cbd5e1' }}>Only the owner or a manager can set cost rates.</p>
        ) : needsPick && factories.length === 0 ? (
          <p role="status" style={{ fontSize: 15, color: '#cbd5e1' }}>No factory found. Add a factory first, then come back to set its rates.</p>
        ) : (
          <>
            {needsPick && factories.length > 1 && (
              <label htmlFor="fac" style={lab}>
                Factory
                <select id="fac" value={factoryId} onChange={e => setFactoryId(e.target.value)} style={{ ...field, cursor: 'pointer' }}>
                  {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </label>
            )}
            {!configured && (
              <p role="status" style={{ fontSize: 14, color: '#f1f5f9', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '10px 12px' }}>
                Not set yet. Labour and electricity are left out of your cost per unit until you enter your own rates.
              </p>
            )}
            <p style={{ fontSize: 13, color: '#94a3b8' }}>
              Amounts are in {currency || 'your currency'}. Labour and electricity are charged for each working day (Monday to Saturday); overhead is a monthly figure spread over {WORKING_DAYS_PER_MONTH} working days.
            </p>
            <label htmlFor="r-staff" style={lab}>
              Labour per working day
              <input id="r-staff" type="number" inputMode="decimal" min={0} value={staff} onChange={e => setStaff(e.target.value)} style={field} />
            </label>
            <label htmlFor="r-elec" style={lab}>
              Electricity per working day
              <input id="r-elec" type="number" inputMode="decimal" min={0} value={elec} onChange={e => setElec(e.target.value)} style={field} />
            </label>
            <label htmlFor="r-bill" style={lab}>
              or your monthly electricity bill (we divide it by {WORKING_DAYS_PER_MONTH} working days)
              <input id="r-bill" type="number" inputMode="decimal" min={0} value={bill} onChange={e => setBill(e.target.value)} style={field} />
            </label>
            <label htmlFor="r-oh" style={lab}>
              Overhead per month (rent, repairs, filters, water…)
              <input id="r-oh" type="number" inputMode="decimal" min={0} value={overhead} onChange={e => setOverhead(e.target.value)} style={field} />
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" onClick={save} disabled={busy} style={{ minHeight: 48, padding: '0 22px', borderRadius: 12, border: 'none', background: ACCENT, color: '#1a1206', fontWeight: 700, fontSize: 15, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>
                {busy ? 'Saving…' : saved ? 'Update rates' : 'Save rates'}
              </button>
              {msg && <span role={msg.kind === 'err' ? 'alert' : 'status'} style={{ fontSize: 14, color: msg.kind === 'err' ? '#fca5a5' : '#86efac' }}>{msg.text}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
