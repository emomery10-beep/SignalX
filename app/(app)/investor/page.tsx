'use client'

// An investor's own page. Shows only the signed-in investor's investment(s) —
// the API (/api/investor/me) returns nothing about anyone else.
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Line { label: string; value: number | string; kind: 'money' | 'pct' | 'text' | 'count' }
interface Investment {
  id: string; type: string; amount: number; invested_at: string; status: string; scope: string
  payments: { paid_at: string; amount: number; note: string | null }[]
  return: { invested: number; received: number; earned: number; owing: number; returnPct: number | null; paidBackPct: number; lines: Line[]; notes: string[] }
  company: { since: string; revenue: number; gross_profit: number; net_profit: number } | null
}
interface Payload { investments: Investment[]; currency_symbol: string | null; error?: string }

const TYPE_LABEL: Record<string, string> = {
  equity: 'Equity', loan: 'Loan', revenue_share: 'Revenue share', profit_share: 'Profit share', fixed_return: 'Fixed return',
}
const niceDate = (d: string) => new Date(d + 'T00:00:00Z').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

export default function InvestorPage() {
  const [data, setData] = useState<Payload | null>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    fetch('/api/investor/me')
      .then(async r => { const j = await r.json(); if (!r.ok) throw new Error(j.error || 'Could not load'); return j as Payload })
      .then(j => { setData(j); setState('ok') })
      .catch(() => setState('error'))
  }, [])

  const signOut = async () => { await createClient().auth.signOut(); window.location.href = '/' }
  const sym = data?.currency_symbol || ''
  const money = (n: number) => `${n < 0 ? '−' : ''}${sym}${Math.abs(Math.round(n)).toLocaleString()}`
  const show = (l: Line) => l.kind === 'money' ? money(Number(l.value)) : l.kind === 'pct' ? `${l.value}%` : String(l.value)

  const headline = (i: Investment) => {
    const r = i.return, since = niceDate(i.invested_at)
    const own = r.lines.find(l => l.label === 'Ownership')?.value
    switch (i.type) {
      case 'equity': return `Since you invested on ${since}, your ${own}% share of the profit is ${money(r.earned)}.`
      case 'loan': return `${money(r.received)} received so far. ${r.owing > 0 ? `${money(r.owing)} is overdue.` : 'You are up to date.'}`
      case 'fixed_return': return `${money(r.earned)} due so far and ${money(r.received)} received${r.owing > 0 ? `, so ${money(r.owing)} is owing to you` : ''}.`
      default: return `You have earned ${money(r.earned)} since ${since}. ${money(r.received)} has been paid${r.owing > 0 ? ` and ${money(r.owing)} is owing to you` : ''}.`
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--tx)' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', background: 'var(--sf)', borderBottom: '1px solid var(--b)' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Your investment</h1>
        <button
          type="button" onClick={signOut}
          style={{ minHeight: 44, padding: '0 16px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx2)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Sign out
        </button>
      </header>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {state === 'loading' && <p role="status" style={{ fontSize: 15, color: 'var(--tx2)' }}>Loading…</p>}
        {state === 'error' && <p role="alert" style={{ fontSize: 15, color: 'var(--tx)' }}>We couldn’t load your investment. Please refresh, or ask the business owner to check your invite.</p>}
        {state === 'ok' && data && data.investments.length === 0 && (
          <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)' }}>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No investment is linked to this login yet.</p>
            <p style={{ fontSize: 14, color: 'var(--tx2)' }}>Ask the business owner to add your investment using the email you signed in with.</p>
          </div>
        )}

        {state === 'ok' && data?.investments.map(i => (
          <section key={i.id} aria-labelledby={`inv-${i.id}`} style={{ padding: 20, borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <h2 id={`inv-${i.id}`} style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {TYPE_LABEL[i.type] || i.type} · {money(i.amount)}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 2 }}>
                Invested {niceDate(i.invested_at)} · {i.scope}{i.status === 'closed' ? ' · Closed' : ''}
              </p>
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.5 }}>{headline(i)}</p>

            <table style={{ display: 'table', width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <caption style={{ position: 'absolute', left: -9999 }}>How your return is worked out</caption>
              <tbody>
                {i.return.lines.map(l => (
                  <tr key={l.label} style={{ borderTop: '1px solid var(--b)' }}>
                    <th scope="row" style={{ textAlign: 'left', fontWeight: 400, color: 'var(--tx2)', padding: '9px 0' }}>{l.label}</th>
                    <td style={{ textAlign: 'right', fontWeight: 600, padding: '9px 0', fontVariantNumeric: 'tabular-nums' }}>{show(l)}</td>
                  </tr>
                ))}
                {i.return.returnPct != null && (
                  <tr style={{ borderTop: '1px solid var(--b)' }}>
                    <th scope="row" style={{ textAlign: 'left', fontWeight: 400, color: 'var(--tx2)', padding: '9px 0' }}>Earned ÷ amount invested</th>
                    <td style={{ textAlign: 'right', fontWeight: 600, padding: '9px 0', fontVariantNumeric: 'tabular-nums' }}>{i.return.returnPct}%</td>
                  </tr>
                )}
              </tbody>
            </table>

            {i.return.notes.length > 0 && (
              <div role="status" style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--ev)', fontSize: 13, color: 'var(--tx2)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {i.return.notes.map((n, k) => <div key={k}>{n}</div>)}
              </div>
            )}

            {i.company && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>The business since {niceDate(i.company.since)}</h3>
                <table style={{ display: 'table', width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <tbody>
                    {([['Revenue', i.company.revenue], ['Gross profit', i.company.gross_profit], ['Net profit', i.company.net_profit]] as [string, number][]).map(([l, v]) => (
                      <tr key={l} style={{ borderTop: '1px solid var(--b)' }}>
                        <th scope="row" style={{ textAlign: 'left', fontWeight: 400, color: 'var(--tx2)', padding: '9px 0' }}>{l}</th>
                        <td style={{ textAlign: 'right', fontWeight: 600, padding: '9px 0', fontVariantNumeric: 'tabular-nums' }}>{money(v)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {i.payments.length > 0 && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>Payments to you</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                  {i.payments.map((p, k) => (
                    <li key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderTop: '1px solid var(--b)', fontSize: 14 }}>
                      <span style={{ color: 'var(--tx2)' }}>{niceDate(p.paid_at)}{p.note ? ` · ${p.note}` : ''}</span>
                      <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{money(p.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  )
}
