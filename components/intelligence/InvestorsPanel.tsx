'use client'

// Owner view of every investor: add an investment, pick how the deal works,
// record payments, see what each has earned. Each investor only ever sees their
// own deal, on /investor (see /api/investor/me).
import { useCallback, useEffect, useState } from 'react'

interface Line { label: string; value: number | string; kind: string }
interface Item {
  id: string; investor_email: string; investor_name: string | null; type: string; amount: number
  invested_at: string; segment: string; factory_location_id: string | null; status: string
  show_company_figures: boolean; currency_symbol: string
  payments: { id: string; paid_at: string; amount: number; note: string | null }[]
  return: { earned: number; received: number; owing: number; returnPct: number | null; lines: Line[]; notes: string[] }
}
interface Factory { id: string; name: string }

const TYPES: { id: string; label: string; hint: string }[] = [
  { id: 'equity', label: 'Equity', hint: 'They own a percentage of the business and share its profit.' },
  { id: 'loan', label: 'Loan', hint: 'You repay the amount plus interest on a monthly schedule.' },
  { id: 'revenue_share', label: 'Revenue share', hint: 'They receive a percentage of revenue, optionally up to a cap.' },
  { id: 'profit_share', label: 'Profit share', hint: 'They receive a percentage of profit, optionally up to a cap.' },
  { id: 'fixed_return', label: 'Fixed return', hint: 'A set payout every month, quarter or year.' },
]
const TYPE_LABEL = Object.fromEntries(TYPES.map(t => [t.id, t.label]))
const today = () => new Date().toISOString().split('T')[0]
const niceDate = (d: string) => new Date(d + 'T00:00:00Z').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

const inputStyle: React.CSSProperties = { minHeight: 44, padding: '0 12px', borderRadius: 10, border: '1px solid var(--b2)', background: 'var(--sf)', color: 'var(--tx)', fontSize: 15, fontFamily: 'inherit', width: '100%' }
const btn = (primary = false): React.CSSProperties => ({
  minHeight: 44, padding: '0 18px', borderRadius: 9999, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
  border: primary ? 'none' : '1px solid var(--b2)', background: primary ? 'var(--acc)' : 'transparent', color: primary ? '#fff' : 'var(--tx2)',
})

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--tx2)', textAlign: 'left' }}>
      {label}
      {children}
    </label>
  )
}

export default function InvestorsPanel({ onOpenTeam }: { onOpenTeam?: () => void }) {
  const [items, setItems] = useState<Item[]>([])
  const [over100, setOver100] = useState(false)
  const [factories, setFactories] = useState<Factory[]>([])
  const [state, setState] = useState<'loading' | 'ok' | 'forbidden' | 'error'>('loading')
  const [adding, setAdding] = useState(false)
  const [payFor, setPayFor] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // add-investment form
  const blank = { email: '', name: '', type: 'equity', amount: '', date: today(), segment: 'all', factory: '', showCompany: true,
    equity_pct: '', valuation: '', rate_pct: '', term_months: '', share_pct: '', cap_multiple: '', every: 'month', payout: '', annual_rate_pct: '' }
  const [f, setF] = useState(blank)
  const set = (k: keyof typeof blank, v: string | boolean) => setF(p => ({ ...p, [k]: v }))
  const [pay, setPay] = useState({ date: today(), amount: '', note: '' })

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/investor/investments')
      if (r.status === 403) { setState('forbidden'); return }
      if (!r.ok) throw new Error()
      const j = await r.json()
      setItems(j.investments || []); setOver100(!!j.equity_over_100); setState('ok')
    } catch { setState('error') }
  }, [])

  useEffect(() => {
    load()
    fetch('/api/pos/locations').then(r => (r.ok ? r.json() : null)).then(j => {
      setFactories(((j?.locations || []) as any[]).filter(l => l.kind === 'factory').map(l => ({ id: l.id, name: l.name })))
    }).catch(() => {})
  }, [load])

  const call = async (url: string, method: string, body?: any) => {
    setBusy(true); setMsg(null)
    try {
      const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) { setMsg(j.error || 'Something went wrong'); return false }
      return true
    } catch { setMsg('Something went wrong'); return false } finally { setBusy(false) }
  }

  const termsFor = () => {
    switch (f.type) {
      case 'equity': return { equity_pct: f.equity_pct, post_money_valuation: f.valuation }
      case 'loan': return { rate_pct: f.rate_pct, term_months: f.term_months }
      case 'revenue_share':
      case 'profit_share': return { share_pct: f.share_pct, cap_multiple: f.cap_multiple }
      default: return { every: f.every, payout: f.payout, annual_rate_pct: f.annual_rate_pct }
    }
  }
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await call('/api/investor/investments', 'POST', {
      investor_email: f.email, investor_name: f.name, type: f.type, amount: Number(f.amount), invested_at: f.date,
      segment: f.segment, factory_location_id: f.segment === 'factory' && f.factory ? f.factory : null,
      show_company_figures: f.showCompany, terms: termsFor(),
    })
    if (ok) { setF(blank); setAdding(false); setMsg('Investment added. Now invite their email as an Investor in the Team tab so they can sign in.'); load() }
  }
  const recordPayment = async (id: string) => {
    const ok = await call('/api/investor/payments', 'POST', { investment_id: id, paid_at: pay.date, amount: Number(pay.amount), note: pay.note })
    if (ok) { setPayFor(null); setPay({ date: today(), amount: '', note: '' }); load() }
  }

  const money = (n: number, sym: string) => `${n < 0 ? '−' : ''}${sym}${Math.abs(Math.round(n)).toLocaleString()}`
  const scopeLabel = (i: Item) => i.segment === 'retail' ? 'Retail' : i.segment === 'factory' ? (factories.find(x => x.id === i.factory_location_id)?.name || 'Factory') : 'Whole business'

  if (state === 'loading') return <p role="status" style={{ fontSize: 15, color: 'var(--tx2)', padding: 16 }}>Loading…</p>
  if (state === 'forbidden') return <p style={{ fontSize: 15, color: 'var(--tx2)', padding: 16 }}>Only the business owner can manage investors.</p>
  if (state === 'error') return <p role="alert" style={{ fontSize: 15, padding: 16 }}>Could not load investors. Please refresh.</p>

  const typeHint = TYPES.find(t => t.id === f.type)?.hint

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0 32px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Investors</h2>
          <p style={{ fontSize: 14, color: 'var(--tx2)', marginTop: 4 }}>
            Record each investment and how it works. Every investor signs in to their own page and sees only their own deal.
          </p>
        </div>
        <button type="button" style={btn(true)} onClick={() => { setAdding(a => !a); setMsg(null) }} aria-expanded={adding}>
          {adding ? 'Cancel' : 'Add investment'}
        </button>
      </div>

      {msg && <div role="status" style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--ev)', fontSize: 14, color: 'var(--tx)' }}>{msg}</div>}
      {over100 && <div role="alert" style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--ev)', fontSize: 14, color: 'var(--tx)' }}>Whole-business equity holdings add up to more than 100%. Check the ownership percentages.</div>}

      {adding && (
        <form onSubmit={submit} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <Field id="inv-email" label="Investor email (they sign in with this)"><input id="inv-email" type="email" required value={f.email} onChange={e => set('email', e.target.value)} style={inputStyle} /></Field>
            <Field id="inv-name" label="Name (optional)"><input id="inv-name" value={f.name} onChange={e => set('name', e.target.value)} style={inputStyle} /></Field>
            <Field id="inv-type" label="How does this investment work?">
              <select id="inv-type" value={f.type} onChange={e => set('type', e.target.value)} style={inputStyle}>
                {TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </Field>
            <Field id="inv-amount" label="Amount invested"><input id="inv-amount" type="number" inputMode="decimal" min={0} step="any" required value={f.amount} onChange={e => set('amount', e.target.value)} style={inputStyle} /></Field>
            <Field id="inv-date" label="Date invested"><input id="inv-date" type="date" required max={today()} value={f.date} onChange={e => set('date', e.target.value)} style={inputStyle} /></Field>
            <Field id="inv-seg" label="What part of the business?">
              <select id="inv-seg" value={f.segment} onChange={e => set('segment', e.target.value)} style={inputStyle}>
                <option value="all">Whole business</option>
                <option value="retail">Retail only</option>
                {factories.length > 0 && <option value="factory">Factory</option>}
              </select>
            </Field>
            {f.segment === 'factory' && factories.length > 1 && (
              <Field id="inv-fac" label="Which factory?">
                <select id="inv-fac" value={f.factory} onChange={e => set('factory', e.target.value)} style={inputStyle}>
                  <option value="">All factories</option>
                  {factories.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              </Field>
            )}
          </div>

          <p style={{ fontSize: 13, color: 'var(--tx3)' }}>{typeHint}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {f.type === 'equity' && (<>
              <Field id="t-eq" label="Ownership %"><input id="t-eq" type="number" inputMode="decimal" min={0} max={100} step="any" value={f.equity_pct} onChange={e => set('equity_pct', e.target.value)} style={inputStyle} /></Field>
              <Field id="t-val" label="or company valuation (works out the %)"><input id="t-val" type="number" inputMode="decimal" min={0} step="any" value={f.valuation} onChange={e => set('valuation', e.target.value)} style={inputStyle} /></Field>
            </>)}
            {f.type === 'loan' && (<>
              <Field id="t-rate" label="Interest rate % per year"><input id="t-rate" type="number" inputMode="decimal" min={0} max={100} step="any" required value={f.rate_pct} onChange={e => set('rate_pct', e.target.value)} style={inputStyle} /></Field>
              <Field id="t-term" label="Term (months)"><input id="t-term" type="number" inputMode="numeric" min={1} max={600} required value={f.term_months} onChange={e => set('term_months', e.target.value)} style={inputStyle} /></Field>
            </>)}
            {(f.type === 'revenue_share' || f.type === 'profit_share') && (<>
              <Field id="t-share" label={f.type === 'revenue_share' ? 'Share of revenue %' : 'Share of profit %'}><input id="t-share" type="number" inputMode="decimal" min={0} max={100} step="any" required value={f.share_pct} onChange={e => set('share_pct', e.target.value)} style={inputStyle} /></Field>
              <Field id="t-cap" label="Cap (× amount invested, optional)"><input id="t-cap" type="number" inputMode="decimal" min={0} step="any" placeholder="e.g. 1.5" value={f.cap_multiple} onChange={e => set('cap_multiple', e.target.value)} style={inputStyle} /></Field>
            </>)}
            {f.type === 'fixed_return' && (<>
              <Field id="t-every" label="Paid every">
                <select id="t-every" value={f.every} onChange={e => set('every', e.target.value)} style={inputStyle}>
                  <option value="month">Month</option><option value="quarter">Quarter</option><option value="year">Year</option>
                </select>
              </Field>
              <Field id="t-pay" label="Payout each time"><input id="t-pay" type="number" inputMode="decimal" min={0} step="any" value={f.payout} onChange={e => set('payout', e.target.value)} style={inputStyle} /></Field>
              <Field id="t-arate" label="or annual rate % (if no fixed payout)"><input id="t-arate" type="number" inputMode="decimal" min={0} step="any" value={f.annual_rate_pct} onChange={e => set('annual_rate_pct', e.target.value)} style={inputStyle} /></Field>
            </>)}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--tx2)', minHeight: 44 }}>
            <input type="checkbox" checked={f.showCompany} onChange={e => set('showCompany', e.target.checked)} style={{ width: 20, height: 20 }} />
            Show this investor the business revenue and profit
          </label>

          <div><button type="submit" style={btn(true)} disabled={busy}>{busy ? 'Saving…' : 'Save investment'}</button></div>
        </form>
      )}

      {items.length === 0 && !adding && (
        <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No investors yet</p>
          <p style={{ fontSize: 14, color: 'var(--tx2)' }}>Add an investment, then invite their email as an Investor in the Team tab so they can see their own returns.</p>
        </div>
      )}

      {items.map(i => {
        const r = i.return, sym = i.currency_symbol || ''
        return (
          <section key={i.id} aria-label={`${i.investor_name || i.investor_email} investment`} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>{i.investor_name || i.investor_email}</h3>
                <p style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 2 }}>
                  {i.investor_name ? `${i.investor_email} · ` : ''}{TYPE_LABEL[i.type] || i.type} · {money(i.amount, sym)} · {scopeLabel(i)} · since {niceDate(i.invested_at)}{i.status === 'closed' ? ' · Closed' : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <button type="button" style={btn()} onClick={() => { setPayFor(payFor === i.id ? null : i.id); setMsg(null) }} aria-expanded={payFor === i.id}>Record payment</button>
                <button type="button" style={btn()} disabled={busy} onClick={async () => { if (await call('/api/investor/investments', 'PATCH', { id: i.id, status: i.status === 'closed' ? 'active' : 'closed' })) load() }}>{i.status === 'closed' ? 'Reopen' : 'Close'}</button>
                {confirmDelete === i.id ? (
                  <>
                    <button type="button" style={{ ...btn(), color: '#b91c1c', borderColor: '#b91c1c' }} disabled={busy} onClick={async () => { if (await call(`/api/investor/investments?id=${encodeURIComponent(i.id)}`, 'DELETE')) { setConfirmDelete(null); load() } }}>Yes, delete</button>
                    <button type="button" style={btn()} onClick={() => setConfirmDelete(null)}>Keep</button>
                  </>
                ) : (
                  <button type="button" style={btn()} onClick={() => setConfirmDelete(i.id)}>Delete</button>
                )}
              </div>
            </div>

            <table style={{ display: 'table', width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <caption style={{ position: 'absolute', left: -9999 }}>Return on this investment</caption>
              <tbody>
                {r.lines.map(l => (
                  <tr key={l.label} style={{ borderTop: '1px solid var(--b)' }}>
                    <th scope="row" style={{ textAlign: 'left', fontWeight: 400, color: 'var(--tx2)', padding: '8px 0' }}>{l.label}</th>
                    <td style={{ textAlign: 'right', fontWeight: 600, padding: '8px 0', fontVariantNumeric: 'tabular-nums' }}>
                      {l.kind === 'money' ? money(Number(l.value), sym) : l.kind === 'pct' ? `${l.value}%` : String(l.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {r.notes.length > 0 && <div role="status" style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--ev)', fontSize: 13, color: 'var(--tx2)' }}>{r.notes.map((n, k) => <div key={k}>{n}</div>)}</div>}

            {payFor === i.id && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, alignItems: 'end' }}>
                <Field id={`pd-${i.id}`} label="Date paid"><input id={`pd-${i.id}`} type="date" max={today()} value={pay.date} onChange={e => setPay(p => ({ ...p, date: e.target.value }))} style={inputStyle} /></Field>
                <Field id={`pa-${i.id}`} label="Amount paid"><input id={`pa-${i.id}`} type="number" inputMode="decimal" min={0} step="any" value={pay.amount} onChange={e => setPay(p => ({ ...p, amount: e.target.value }))} style={inputStyle} /></Field>
                <Field id={`pn-${i.id}`} label="Note (optional)"><input id={`pn-${i.id}`} value={pay.note} onChange={e => setPay(p => ({ ...p, note: e.target.value }))} style={inputStyle} /></Field>
                <button type="button" style={btn(true)} disabled={busy || !(Number(pay.amount) > 0)} onClick={() => recordPayment(i.id)}>Save payment</button>
              </div>
            )}

            {i.payments.length > 0 && (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                {i.payments.map(p => (
                  <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '6px 0', borderTop: '1px solid var(--b)', fontSize: 13 }}>
                    <span style={{ color: 'var(--tx2)' }}>{niceDate(p.paid_at)}{p.note ? ` · ${p.note}` : ''}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{money(p.amount, sym)}</span>
                      <button type="button" aria-label={`Remove payment of ${p.amount}`} style={{ ...btn(), minHeight: 36, padding: '0 12px', fontSize: 12 }} disabled={busy} onClick={async () => { if (await call(`/api/investor/payments?id=${encodeURIComponent(p.id)}`, 'DELETE')) load() }}>Remove</button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}

      {items.length > 0 && onOpenTeam && (
        <p style={{ fontSize: 13, color: 'var(--tx3)' }}>
          Investors need to be invited by email with the Investor role to sign in.{' '}
          <button type="button" onClick={onOpenTeam} style={{ background: 'none', border: 'none', color: 'var(--tx)', textDecoration: 'underline', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', padding: 0 }}>Open Team</button>
        </p>
      )}
    </div>
  )
}
