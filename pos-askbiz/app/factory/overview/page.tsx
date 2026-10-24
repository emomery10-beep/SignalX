'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { usePosConfig } from '@/lib/hooks/usePosConfig'

const AMBER = '#f59e0b'
const GREEN = '#22c55e'
const RED = '#ef4444'
const BLUE = '#60a5fa'
const MUTED = '#94a3b8'

interface Overview {
  factoryType: string | null
  label: string
  icon: string
  rawLabel: string
  byproductNoun: string
  unitNoun: string
  unitPlural: string
  unitTitle: string
  yieldMin: number | null
  yieldMax: number | null
  pricesHidden: boolean
  raw: { arrived: number; used: number; remaining: number; ratePerUnit: number; cost: number; unit: string; names: string[] }
  output: { main: number; mainUnit: string; mainLabel: string | null; byproduct: number; byproductUnit: string; yield: number | null }
  units: { produced: number; dispatched: number; inStock: number; unitCost: number }
  value: { raw: number; finished: number; byproduct: number; total: number }
  money: { revenue: number; cogs: number; margin: number; soldUnits: number; byproductSoldCost: number }
  products: { name: string; unit?: string | null; onHand: number; in: number; out: number; lastDispatchPrice: number; role?: string }[]
  unitNotes?: { converted: number; excluded: { product: string; unit: string; quantity: number; captures: number }[] }
}

const ROLE_LABEL: Record<string, string> = { raw: 'Raw material', bulk: 'Intermediate', finished: 'Finished', byproduct: 'By-product', other: 'Other' }

// Template ids are snake_case ("coconut_oil"); show a readable fallback when a type has no template.
const prettyType = (t: string | null) => (t ? t.replace(/_/g, ' ').replace(/\b\w/g, m => m.toUpperCase()) : 'Production')

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>{title}</h2>
      {children}
    </section>
  )
}

const GRID: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }
const BTN: React.CSSProperties = { background: '#334155', border: 'none', color: '#cbd5e1', padding: '0 16px', minHeight: 44, borderRadius: 8, cursor: 'pointer', fontSize: 13 }

export default function FactoryProductionOverviewPage() {
  const router = useRouter()
  const { session, ready: authReady } = usePosAuth()
  const { sym } = usePosConfig(session as any, authReady)
  const [data, setData] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  // Owners can run several factories (e.g. sesame + coconut): they pick one so figures never blend. PIN staff are tied to their branch.
  const [factories, setFactories] = useState<{ id: string; name: string }[]>([])
  const [factoryId, setFactoryId] = useState('')
  const [factoriesReady, setFactoriesReady] = useState(false)
  const ownerPicks = !!session && !session.isPin

  useEffect(() => {
    if (!authReady || !session) return
    if (!ownerPicks) { setFactoriesReady(true); return }
    fetch('/api/pos/locations', { headers: session.headers })
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        const list = ((j?.locations || []) as any[]).filter(l => l.kind === 'factory').map(l => ({ id: l.id as string, name: (l.name as string) || 'Factory' }))
        setFactories(list)
        if (list.length > 0) setFactoryId(list[0].id)
      })
      .catch(() => {})
      .finally(() => setFactoriesReady(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, session?.ownerId, ownerPicks])

  const load = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setFailed(false)
    try {
      const qs = ownerPicks && factoryId ? `?location_id=${encodeURIComponent(factoryId)}` : ''
      const res = await fetch(`/api/pos/factory/production-overview${qs}`, { headers: session.headers })
      if (!res.ok) throw new Error(String(res.status))
      setData(await res.json())
    } catch (e) {
      console.error('Production overview load error:', e)
      setFailed(true)
    } finally {
      setLoading(false)
    }
  }, [session, ownerPicks, factoryId])

  useEffect(() => {
    if (authReady && session && factoriesReady) load()
  }, [authReady, session, factoriesReady, load])

  const shell = (msg: string) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9' }}>{msg}</div>
  )
  if (!authReady || !session) return shell('Loading...')
  if (failed && !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9' }}>
        <div role="alert">Couldn&apos;t load production data.</div>
        <button onClick={load} style={BTN}>Try again</button>
      </div>
    )
  }
  if (loading && !data) return shell('Loading production data...')
  if (!data) return shell('Loading production data...')

  const money = (v: number) => `${sym ? sym + ' ' : ''}${Math.round(v || 0).toLocaleString()}`
  const qty = (v: number, u?: string | null) => `${(v || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}${u ? ' ' + u : ''}`
  const title = data.label !== 'Production' ? data.label : prettyType(data.factoryType)
  const rawName = data.raw.names.length === 1 ? data.raw.names[0] : data.rawLabel.replace(/\s*\(Material\)\s*$/i, '')
  const { units, value, money: m, output, raw } = data
  const hasAnything = raw.arrived > 0 || raw.used > 0 || output.main > 0 || units.produced > 0 || data.products.length > 0
  const balanced = Math.abs(units.produced - (units.dispatched + units.inStock)) < 0.01
  const unitWord = (v: number) => (v === 1 ? data.unitNoun : data.unitPlural)
  const yieldInRange = output.yield != null && data.yieldMin != null && data.yieldMax != null && output.yield >= data.yieldMin && output.yield <= data.yieldMax

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/factory')} aria-label="Back to Factory" style={{ ...BTN, padding: 0, width: 44, fontSize: 18 }}>←</button>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: AMBER, margin: 0 }}><span aria-hidden="true">{data.icon} </span>{title}</h1>
            <div style={{ fontSize: 12, color: MUTED }}>Real-time intake, production &amp; inventory</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {data.factoryType === 'sesame_oil' && (
            <button onClick={() => router.push('/factory/sesame-reconciliation')} style={BTN}>Reconciliation</button>
          )}
          <button onClick={load} disabled={loading} style={{ ...BTN, opacity: loading ? 0.6 : 1 }}>{loading ? 'Refreshing…' : 'Refresh'}</button>
        </div>
      </header>

      <main style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
        {data.unitNotes && data.unitNotes.excluded.length > 0 && (
          <div role="status" style={{ background: '#451a03', border: `1px solid ${AMBER}`, color: '#fde68a', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 14, lineHeight: 1.5 }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>Not counted in the kg totals</strong>
            {data.unitNotes.excluded.map(e => (
              <div key={`${e.product}-${e.unit}`}>{e.quantity.toLocaleString()} {e.unit} of {e.product || 'an item'} ({e.captures} {e.captures === 1 ? 'entry' : 'entries'}) was logged in {e.unit}, which can&apos;t be added to kilograms. Log it again in kg to include it.</div>
            ))}
          </div>
        )}
        {ownerPicks && factories.length > 1 && (
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="factory-pick" style={{ display: 'block', fontSize: 12, color: MUTED, marginBottom: 6 }}>Factory</label>
            <select id="factory-pick" value={factoryId} onChange={e => setFactoryId(e.target.value)}
              style={{ background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: 8, minHeight: 44, padding: '0 12px', fontSize: 14, minWidth: 220 }}>
              {factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        )}
        {!hasAnything && (
          <Section title="Nothing logged yet">
            <p style={{ margin: '0 0 12px', color: MUTED, fontSize: 14, lineHeight: 1.5 }}>
              Photograph an intake, output or dispatch and this page will fill in with your own products, stock and costs.
            </p>
            <button onClick={() => router.push('/factory/capture')} style={{ ...BTN, background: AMBER, color: '#0f172a', fontWeight: 600 }}>Log your first capture</button>
          </Section>
        )}

        {(raw.arrived > 0 || raw.used > 0) && (
          <Section title="Intake & deduction">
            <div style={GRID}>
              <Stat label="Total arrival" value={qty(raw.arrived, raw.unit)} sub={rawName} color={BLUE} />
              <Stat label="Used in production" value={qty(raw.used, raw.unit)} sub={raw.ratePerUnit > 0 ? `@ ${raw.ratePerUnit.toFixed(2)} per ${raw.unit}` : undefined} color={AMBER} />
              <Stat label="Material cost" value={money(raw.cost)} sub="Total used" color={RED} />
              <Stat label="Remaining" value={qty(raw.remaining, raw.unit)} sub="In stock" color={GREEN} />
            </div>
          </Section>
        )}

        {(output.main > 0 || output.byproduct > 0 || output.yield != null) && (
          <Section title="Production output">
            <div style={GRID}>
              {output.main > 0 && <Stat label={output.mainLabel || 'Produced'} value={qty(output.main, output.mainUnit)} color={GREEN} />}
              {output.byproduct > 0 && <Stat label={`${data.byproductNoun === 'by-product' ? 'By-product' : data.byproductNoun[0].toUpperCase() + data.byproductNoun.slice(1)} generated`} value={qty(output.byproduct, output.byproductUnit)} color={RED} />}
              {output.yield != null && (
                <Stat
                  label="Yield"
                  value={`${output.yield.toFixed(1)}%`}
                  sub={data.yieldMin != null && data.yieldMax != null ? `Normal: ${data.yieldMin}-${data.yieldMax}%${yieldInRange ? '' : output.yield < data.yieldMin ? ' · below normal' : ' · above normal'}` : undefined}
                  color={data.yieldMin != null && !yieldInRange ? AMBER : GREEN}
                />
              )}
            </div>
          </Section>
        )}

        {(units.produced > 0 || units.dispatched > 0 || units.inStock > 0) && (
          <Section title={`${data.unitTitle} inventory`}>
            <div style={GRID}>
              <Stat label="Produced" value={`${qty(units.produced)} ${unitWord(units.produced)}`} color={GREEN} />
              <Stat label="Dispatched" value={`${qty(units.dispatched)} ${unitWord(units.dispatched)}`} color={AMBER} />
              <Stat label="In stock" value={`${qty(units.inStock)} ${unitWord(units.inStock)}`} sub="Ready to sell" color={BLUE} />
            </div>
            <div role="status" style={{ marginTop: 12, padding: '8px 12px', background: balanced ? '#22c55e1a' : '#ef44441a', borderRadius: 6, fontSize: 12, color: balanced ? GREEN : RED }}>
              {balanced
                ? `✓ Balanced: ${qty(units.produced)} produced = ${qty(units.dispatched)} dispatched + ${qty(units.inStock)} in stock`
                : `✕ Mismatch: ${qty(units.produced)} produced ≠ ${qty(units.dispatched)} + ${qty(units.inStock)}`}
            </div>
          </Section>
        )}

        {value.total > 0 && (
          <Section title="Stock value">
            <div style={GRID}>
              <Stat label={`Raw materials`} value={money(value.raw)} sub={`${qty(raw.remaining, raw.unit)} remaining`} color={BLUE} />
              <Stat label="Finished goods" value={money(value.finished)} sub={units.unitCost > 0 ? `${qty(units.inStock)} × ${money(units.unitCost)}` : 'Costed once units are produced'} color={GREEN} />
              <Stat label="Total stock value" value={money(value.total)} sub="Raw + finished + by-product" color={GREEN} />
            </div>
          </Section>
        )}

        {(m.cogs > 0 || m.revenue > 0 || units.dispatched > 0) && (
          <Section title="Revenue & profitability">
            <div style={{ ...GRID, marginBottom: 16 }}>
              {!data.pricesHidden && <Stat label="Total revenue" value={money(m.revenue)} color={GREEN} />}
              <Stat label="Cost of goods" value={money(m.cogs)} color={RED} />
              {!data.pricesHidden && (
                <Stat label="Gross margin" value={money(m.margin)} sub={`${m.revenue > 0 ? ((m.margin / m.revenue) * 100).toFixed(1) : 0}% margin`} color={m.margin >= 0 ? GREEN : RED} />
              )}
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, margin: '0 0 10px' }}>Cost breakdown</h3>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>
                {rawName}: {money(raw.cost)} ({qty(raw.used, raw.unit)} @ {(raw.ratePerUnit || 0).toFixed(2)})
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>
                {data.unitPlural[0].toUpperCase() + data.unitPlural.slice(1)} sold: {money(m.soldUnits * units.unitCost)} ({qty(m.soldUnits)} sold × {money(units.unitCost)})
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>By-product sold: {money(m.byproductSoldCost)} (cost of by-product dispatched)</div>
            </div>
          </Section>
        )}

        {data.products.length > 0 && (
          <Section title="All your products">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 520 }}>
                <caption style={{ position: 'absolute', left: -9999 }}>Stock by product</caption>
                <thead>
                  <tr style={{ textAlign: 'left', color: MUTED }}>
                    <th scope="col" style={{ padding: '8px 10px', fontWeight: 500 }}>Product</th>
                    <th scope="col" style={{ padding: '8px 10px', fontWeight: 500 }}>Type</th>
                    <th scope="col" style={{ padding: '8px 10px', fontWeight: 500, textAlign: 'right' }}>In</th>
                    <th scope="col" style={{ padding: '8px 10px', fontWeight: 500, textAlign: 'right' }}>Out</th>
                    <th scope="col" style={{ padding: '8px 10px', fontWeight: 500, textAlign: 'right' }}>On hand</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map(p => (
                    <tr key={p.name} style={{ borderTop: '1px solid #334155' }}>
                      <th scope="row" style={{ padding: '10px', fontWeight: 600, textAlign: 'left' }}>{p.name}</th>
                      <td style={{ padding: '10px', color: MUTED }}>{ROLE_LABEL[p.role || 'other'] || 'Other'}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{qty(p.in, p.unit)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{qty(p.out, p.unit)}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: GREEN }}>{qty(p.onHand, p.unit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}
      </main>
    </div>
  )
}
