'use client'
// Trace a production run both ways: what went in (and from which supplier), what was made and packed, and which
// customers received it. For recalls. Approvers only. Open as /factory/trace or /factory/trace?run_ref=ABC.
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import { hasPermission } from '@/lib/pos-permissions'
import { factoryDayKey, setFactoryTz } from '@/lib/factory-tz-client'

interface Row { id: string; type: string; status: string; date: string; product: string | null; quantity: number | null; party: string | null; destination: string | null; phone: string | null }
interface Result { run: { run_ref: string; input_product_name: string | null }; went_in: Row[]; made: Row[]; packed: Row[]; sent: Row[] }

const ACCENT = '#d08a59'
const field: React.CSSProperties = { minHeight: 44, padding: '0 12px', borderRadius: 10, border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: 16, fontFamily: 'inherit', flex: 1, minWidth: 0, boxSizing: 'border-box' }

export default function TracePage() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready } = usePosAuth()
  const [ref, setRef] = useState('')
  const [recent, setRecent] = useState<{ id: string; run_ref: string }[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'notfound'>('idle')

  const allowed = !!session && hasPermission(session.role, 'capture.approve')
  const headers = session?.headers || {}

  const search = useCallback(async (value: string) => {
    const v = value.trim()
    if (!v || !session) return
    setState('loading'); setResult(null)
    try {
      const r = await fetch('/api/pos/factory/trace?run_ref=' + encodeURIComponent(v), { headers })
      if (r.status === 404) { setState('notfound'); return }
      if (!r.ok) { setState('idle'); return }
      setResult(await r.json()); setState('idle')
    } catch { setState('idle') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.ownerId, session?.staffId])

  useEffect(() => {
    if (!ready || !session || !allowed) return
    fetch('/api/pos/factory/capture?limit=1', { headers }).then(r => (r.ok ? r.json() : null)).then(j => setFactoryTz(j?.time_zone)).catch(() => {})
    fetch('/api/pos/factory/trace?recent=1', { headers }).then(r => (r.ok ? r.json() : null)).then(j => setRecent(j?.runs || [])).catch(() => {})
    const q = new URLSearchParams(window.location.search).get('run_ref')
    if (q) { setRef(q); search(q) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, session?.ownerId, allowed])

  const section = (titleKey: string, rows: Row[], showParty: 'supplier' | 'customer' | null, emptyKey?: string) => (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{tc('factory_trace.' + titleKey)}</div>
      {rows.length === 0 ? (
        <div style={{ fontSize: 14, color: '#64748b' }}>{emptyKey ? tc('factory_trace.' + emptyKey) : '—'}</div>
      ) : rows.map(r => (
        <div key={r.id} style={{ padding: '8px 0', borderTop: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <strong style={{ fontSize: 15 }}>{r.product || '—'}</strong>
            <span style={{ fontSize: 14 }}>{r.quantity != null ? Number(r.quantity).toLocaleString() : ''}</span>
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            {factoryDayKey(r.date)}{r.status === 'pending' ? ' · ' + tc('factory_trace.pending') : ''}
            {showParty && (r.party || showParty === 'customer') ? ' · ' + tc('factory_trace.' + showParty) + ': ' + (r.party || tc('factory_trace.no_name')) : ''}
            {r.destination ? ' · ' + r.destination : ''}{r.phone ? ' · ' + r.phone : ''}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => router.push('/factory')} aria-label={tc('factory_trace.back')} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 22, cursor: 'pointer', minWidth: 44, minHeight: 44 }}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: ACCENT, margin: 0 }}>{tc('factory_trace.title')}</h1>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{tc('factory_trace.subtitle')}</div>
        </div>
      </div>
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '6px 20px 8px', display: 'flex', justifyContent: 'flex-end' }}><LanguageToggle inline /></div>

      <div style={{ padding: 20, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!ready || !session ? <p role="status">{tc('factory_trace.loading')}</p>
          : !allowed ? <p role="status" style={{ color: '#cbd5e1' }}>{tc('factory_trace.no_access')}</p>
          : (
            <>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{tc('factory_trace.hint')}</p>
              <form onSubmit={e => { e.preventDefault(); search(ref) }} style={{ display: 'flex', gap: 10 }}>
                <input value={ref} onChange={e => setRef(e.target.value)} placeholder={tc('factory_trace.search_placeholder')} style={field} />
                <button type="submit" style={{ minHeight: 44, padding: '0 20px', borderRadius: 10, border: 'none', background: ACCENT, color: '#1a1206', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{tc('factory_trace.search')}</button>
              </form>
              {recent.length > 0 && !result && (
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{tc('factory_trace.recent')}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {recent.map(r => <button key={r.id} onClick={() => { setRef(r.run_ref); search(r.run_ref) }} style={{ minHeight: 40, padding: '0 14px', borderRadius: 20, border: '1px solid #475569', background: 'transparent', color: '#e2e8f0', fontSize: 14, cursor: 'pointer' }}>{r.run_ref}</button>)}
                  </div>
                </div>
              )}
              {state === 'loading' && <p role="status">{tc('factory_trace.loading')}</p>}
              {state === 'notfound' && <p role="status" style={{ color: '#fca5a5' }}>{tc('factory_trace.not_found')}</p>}
              {result && (
                <>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{result.run.run_ref}{result.run.input_product_name ? ' · ' + result.run.input_product_name : ''}</div>
                  {section('section_in', result.went_in, 'supplier')}
                  {section('section_made', result.made, null)}
                  {section('section_packed', result.packed, null)}
                  {section('section_out', result.sent, 'customer', 'no_dispatch')}
                </>
              )}
            </>
          )}
      </div>
    </div>
  )
}
