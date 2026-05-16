'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import BusinessHealthScore from '@/components/intelligence/BusinessHealthScore'
import DailyBrief from '@/components/intelligence/DailyBrief'
import AnomalyFeed from '@/components/intelligence/AnomalyFeed'
import DecisionMemory from '@/components/intelligence/DecisionMemory'
import TeamPanel from '@/components/intelligence/TeamPanel'
import LogisticsPulseCard from '@/components/LogisticsPulseCard'
import BusinessMemory from '@/components/intelligence/BusinessMemory'
import FeatureGate from '@/components/gates/FeatureGate'
import { usePlan } from '@/lib/hooks/usePlan'

export default function IntelligencePage() {
  const router = useRouter()
  const { planId, loading: planLoading } = usePlan()
  const [tab, setTab] = useState('overview')
  const [health, setHealth] = useState(null)
  const [anomalies, setAnomalies] = useState([])
  const [loadingHealth, setLoadingHealth] = useState(true)
  const [sparringInput, setSparringInput] = useState('')
  const [sparringResponse, setSparringResponse] = useState('')
  const [sparringSending, setSparringSending] = useState(false)
  const [scoreHistory, setScoreHistory] = useState([])

  const askAskBiz = useCallback((prompt) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }, [router])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const t = params.get('tab')
    if (t && ['overview','anomalies','decisions','team','sparring','shipments','memory','market'].includes(t)) setTab(t)
  }, [])

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          if (data.latest) setHealth(data.latest)
          setAnomalies(data.anomalies || [])
          setScoreHistory(data.history || [])
        }
      })
      .finally(() => setLoadingHealth(false))
  }, [])

  const dismissAnomaly = async (id) => {
    await fetch('/api/health/anomaly', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, seen: true }) })
    setAnomalies(prev => prev.filter(a => a.id !== id))
  }

  const askSparring = async () => {
    if (!sparringInput.trim()) return
    setSparringSending(true)
    setSparringResponse('')
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: sparringInput }], streaming: false }) })
      const data = await res.json()
      setSparringResponse(data.answer_text || 'No response generated.')
    } catch {
      setSparringResponse('Could not connect.')
    } finally {
      setSparringSending(false)
    }
  }

  const criticalCount = anomalies.filter(a => a.severity === 'critical').length
  const warningCount = anomalies.filter(a => a.severity === 'warning').length
  const scoreHistoryItems = scoreHistory.slice(-30)
  const canAlerts    = !planLoading && (planId === 'growth' || planId === 'business')
  const canDecisions = !planLoading && planId === 'business'
  const tabs = [
    { id: 'overview',   label: 'Overview' },
    { id: 'anomalies',  label: 'Alerts',          badge: canAlerts ? (criticalCount + warningCount) : 0, locked: !canAlerts },
    { id: 'decisions',  label: 'Decision Memory',  locked: !canDecisions },
    { id: 'team',       label: 'Team' },
    { id: 'sparring',   label: 'Ask AskBiz' },
    { id: 'shipments',  label: '📦 Shipments' },
    { id: 'memory',     label: '🧠 What I Know' },
    { id: 'market',     label: '🌍 Market' },
  ]
  const sparringPrompts = ['Should I launch in Germany?', 'Is now a good time to raise my prices?', 'What is my biggest business risk?', 'Hire or use freelancers?']

  // Market Intelligence state
  const [mktQuery, setMktQuery] = useState('')
  const [mktRegion, setMktRegion] = useState('')
  const [mktChannel, setMktChannel] = useState('')
  const [mktLoading, setMktLoading] = useState(false)
  const [mktResult, setMktResult] = useState<any>(null)

  const searchMarket = async () => {
    if (!mktQuery.trim()) return
    setMktLoading(true)
    setMktResult(null)
    try {
      const params = new URLSearchParams({ q: mktQuery.trim() })
      if (mktRegion) params.set('region', mktRegion)
      if (mktChannel) params.set('channel', mktChannel)
      const res = await fetch(`/api/market/products?${params}`)
      const data = await res.json()
      setMktResult(data)
    } catch {
      setMktResult({ error: 'Could not load market data.' })
    } finally {
      setMktLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flexShrink: 0, padding: '16px 20px 0', borderBottom: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700 }}>Monitor</div>
              <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Health, Alerts, Decisions, Team, AI Sparring</div>
            </div>
            {criticalCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#EF4444', borderRadius: 9999, padding: '2px 8px' }}>{criticalCount} critical</span>}
          </div>
          {health && <BusinessHealthScore health={health} size="sm" onAsk={askAskBiz}/>}
        </div>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 14px', border: 'none', background: 'transparent', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? '#6366F1' : t.locked ? 'var(--tx3)' : 'var(--tx3)', borderBottom: tab === t.id ? '2px solid #6366F1' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', opacity: t.locked ? 0.65 : 1 }}>
              {t.label}
              {t.locked && !planLoading && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
              {t.badge ? <span style={{ fontSize: 10, fontWeight: 700, background: '#EF4444', color: '#fff', borderRadius: 9999, padding: '1px 6px' }}>{t.badge}</span> : null}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
            <DailyBrief onAsk={askAskBiz}/>
            {loadingHealth ? (
              <div style={{ height: 120, borderRadius: 16, background: 'var(--ev)', animation: 'shimmer 1.4s infinite' }}></div>
            ) : (
              <BusinessHealthScore health={health} size="lg" showComponents onAsk={askAskBiz}/>
            )}
            {scoreHistoryItems.length > 1 && (
              <div style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>30-Day Trend</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 48 }}>
                  {scoreHistoryItems.map((h, i) => {
                    const sc = Number(h.score) || 0
                    const ht = Math.max(4, (sc / 100) * 48)
                    const col = sc >= 65 ? '#22C55E' : sc >= 45 ? '#F59E0B' : '#EF4444'
                    return <div key={i} style={{ flex: 1, height: ht, background: col, borderRadius: '2px 2px 0 0', opacity: 0.8, minWidth: 4 }}></div>
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--tx3)' }}><span>30 days ago</span><span>Today</span></div>
              </div>
            )}
            {anomalies.length > 0 && (
              <div style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Active Alerts</div>
                  <button onClick={() => setTab('anomalies')} style={{ fontSize: 11, color: '#6366F1', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>View all ({anomalies.length})</button>
                </div>
                <AnomalyFeed anomalies={anomalies.slice(0, 3)} onAsk={askAskBiz} compact/>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              <button onClick={() => askAskBiz('What is my best performing product by margin right now?')} style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>📊</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>Ask about your data</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Plain English questions</div>
              </button>
              <button onClick={() => setTab('sparring')} style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>⚡</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>What if...?</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Scenario planning</div>
              </button>
              <button onClick={() => setTab('decisions')} style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>📝</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>Log a decision</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>AskBiz checks back in 6 weeks</div>
              </button>
              <button onClick={() => setTab('team')} style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>👥</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>Your team</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Give your accountant access</div>
              </button>
              <button onClick={() => setTab('memory')} style={{ padding: '14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>🧠</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 3 }}>What I Know</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)' }}>Facts AskBiz has learned about you</div>
              </button>
            </div>
          </div>
        )}
        {tab === 'anomalies' && (
          <div style={{ maxWidth: 720 }}>
            <FeatureGate planId={planId} feature="anomaly_alerts">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>Active Alerts</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>AskBiz monitors your data and flags anything that needs attention</div>
              </div>
              <AnomalyFeed anomalies={anomalies} onAsk={askAskBiz} onDismiss={dismissAnomaly}/>
            </FeatureGate>
          </div>
        )}
        {tab === 'decisions' && (
          <div style={{ maxWidth: 720 }}>
            <FeatureGate planId={planId} feature="decision_memory">
              <DecisionMemory onAsk={askAskBiz}/>
            </FeatureGate>
          </div>
        )}
        {tab === 'team' && <div style={{ maxWidth: 720 }}><TeamPanel/></div>}
        {tab === 'memory' && <div style={{ maxWidth: 720 }}><BusinessMemory onAsk={askAskBiz}/></div>}
        {tab === 'shipments' && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Shipment Intelligence</div>
                <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Real-time tracking · Financial impact · Supplier scoring</div>
              </div>
              <button onClick={() => router.push('/shipments')} style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Open full view →
              </button>
            </div>
            <LogisticsPulseCard />
            <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: 'Add tracking number', action: () => router.push('/shipments') },
                  { label: 'View at-risk shipments', action: () => router.push('/shipments?filter=at_risk') },
                  { label: 'Ask about a delay', action: () => { router.push('/ask'); setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: 'Which of my shipments are delayed and what is the financial impact?' })), 400) } },
                  { label: 'Supplier performance', action: () => { router.push('/ask'); setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: 'Which supplier has the best delivery reliability based on my shipment history?' })), 400) } },
                ].map((item, i) => (
                  <button key={i} onClick={item.action} style={{ padding: '8px 14px', borderRadius: 9999, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b)'; e.currentTarget.style.color = 'var(--tx2)' }}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 'market' && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>Market Intelligence</div>
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Search real market prices, channels, and routes — powered by merchant data + live web signals</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={mktQuery}
                  onChange={e => setMktQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchMarket()}
                  placeholder="e.g. leather handbag, running shoes, phone case..."
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                <button
                  onClick={searchMarket}
                  disabled={mktLoading || !mktQuery.trim()}
                  style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#d08a59', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: mktLoading || !mktQuery.trim() ? 0.5 : 1 }}
                >
                  {mktLoading ? '...' : 'Search'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input
                  value={mktRegion}
                  onChange={e => setMktRegion(e.target.value)}
                  placeholder="Region (e.g. USA, UK, EU)"
                  style={{ flex: 1, minWidth: 140, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                />
                <select
                  value={mktChannel}
                  onChange={e => setMktChannel(e.target.value)}
                  style={{ flex: 1, minWidth: 140, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--bg)', color: 'var(--tx)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
                >
                  <option value="">All channels</option>
                  <option value="shopify">Shopify</option>
                  <option value="amazon_fba">Amazon FBA</option>
                  <option value="ebay">eBay</option>
                  <option value="etsy">Etsy</option>
                  <option value="woocommerce">WooCommerce</option>
                  <option value="pos">POS</option>
                </select>
              </div>
            </div>

            {mktResult?.locked && (
              <div style={{ padding: '24px 20px', borderRadius: 14, border: '1px solid #d08a59', background: 'rgba(208,138,89,0.07)', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🌍</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)', marginBottom: 6 }}>Market Intelligence</div>
                <div style={{ fontSize: 13, color: 'var(--tx3)', marginBottom: 16, lineHeight: 1.5 }}>Available on Growth and above. See real market prices, channel benchmarks, and live web signals.</div>
                <a href="/billing" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 9999, background: '#d08a59', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Upgrade to Growth →</a>
              </div>
            )}

            {mktResult?.error && (
              <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#EF4444' }}>{mktResult.error}</div>
            )}

            {mktResult && !mktResult.locked && !mktResult.error && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {mktResult.catalogue?.length > 0 && (
                  <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Merchant Price Data</div>
                      <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{mktResult.catalogue.length} records · {mktResult.plan} plan</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: 'var(--ev)' }}>
                            {['Product', 'Channel', 'Region', 'Avg Price', 'Min', 'Max', 'Margin %', 'Merchants'].map(h => (
                              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {mktResult.catalogue.map((row: any, i: number) => (
                            <tr key={i} style={{ borderTop: '1px solid var(--b)' }}>
                              <td style={{ padding: '9px 12px', fontWeight: 500, color: 'var(--tx)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.product_name}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.channel}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.region}</td>
                              <td style={{ padding: '9px 12px', fontWeight: 600, color: 'var(--tx)' }}>{row.currency} {row.avg_selling_price}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx3)' }}>{row.min_selling_price}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx3)' }}>{row.max_selling_price}</td>
                              <td style={{ padding: '9px 12px', color: row.avg_gross_margin ? 'var(--tx2)' : 'var(--tx3)' }}>{row.avg_gross_margin ? `${row.avg_gross_margin}%` : '—'}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx3)' }}>{row.merchant_count}+</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {mktResult.catalogue?.length === 0 && (
                  <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)', fontSize: 13, color: 'var(--tx3)' }}>
                    No merchant price data yet for this product — web signals below may help.
                  </div>
                )}

                {mktResult.routes?.length > 0 && (
                  <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Route Intelligence · {mktResult.region}</div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: 'var(--ev)' }}>
                            {['Origin', 'Destination', 'Carrier', 'Avg Transit', 'On-Time', 'Customs Hold', 'Merchants'].map(h => (
                              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {mktResult.routes.map((row: any, i: number) => (
                            <tr key={i} style={{ borderTop: '1px solid var(--b)' }}>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.origin_country}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.destination_country}</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx2)' }}>{row.carrier_code}</td>
                              <td style={{ padding: '9px 12px', fontWeight: 500 }}>{row.avg_transit_days ? `${row.avg_transit_days}d` : '—'}</td>
                              <td style={{ padding: '9px 12px', color: row.on_time_rate >= 80 ? '#22C55E' : row.on_time_rate >= 60 ? '#F59E0B' : '#EF4444', fontWeight: 600 }}>{row.on_time_rate}%</td>
                              <td style={{ padding: '9px 12px', color: row.customs_hold_rate > 10 ? '#EF4444' : 'var(--tx3)' }}>{row.customs_hold_rate}%</td>
                              <td style={{ padding: '9px 12px', color: 'var(--tx3)' }}>{row.merchant_count}+</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {mktResult.web && (
                  <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--b)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Live Web Signals</div>
                    </div>
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {mktResult.web.price_summary && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Price Summary</div>
                          <div style={{ fontSize: 13, color: 'var(--tx)', lineHeight: 1.6, padding: '10px 14px', borderRadius: 10, background: 'var(--ev)' }}>{mktResult.web.price_summary}</div>
                          {mktResult.web.price_sources?.length > 0 && (
                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {mktResult.web.price_sources.map((s: any, i: number) => (
                                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', textDecoration: 'none' }}>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6366F1' }}>{s.title}</span>
                                  <span style={{ fontSize: 11, color: 'var(--tx3)', lineHeight: 1.5 }}>{s.snippet}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {mktResult.web.news?.length > 0 && (
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Market News (last 30 days)</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {mktResult.web.news.map((n: any, i: number) => (
                              <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--b)', textDecoration: 'none' }}>
                                <span style={{ fontSize: 12, fontWeight: 500, color: '#6366F1', flex: 1 }}>{n.title}</span>
                                {n.date && <span style={{ fontSize: 11, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{n.date?.slice(0, 10)}</span>}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {mktResult.data_thin && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(208,138,89,0.08)', border: '1px solid rgba(208,138,89,0.2)', fontSize: 12, color: '#d08a59' }}>
                    Limited merchant data for this product — supplemented with live web signals. As more merchants contribute, this will improve.
                  </div>
                )}
              </div>
            )}

            {!mktResult && !mktLoading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginTop: 4 }}>
                {[['leather handbag', 'USA'], ['running shoes', 'UK'], ['phone case', 'EU'], ['candles', '']].map(([product, region], i) => (
                  <button key={i} onClick={() => { setMktQuery(product); if (region) setMktRegion(region) }} style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 3 }}>Try searching</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{product}{region ? `, ${region}` : ''}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
