'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store'
import BusinessHealthScore from '@/components/intelligence/BusinessHealthScore'
import DailyBrief from '@/components/intelligence/DailyBrief'
import AnomalyFeed from '@/components/intelligence/AnomalyFeed'
import DecisionMemory from '@/components/intelligence/DecisionMemory'
import TeamPanel from '@/components/intelligence/TeamPanel'

type Tab = 'overview' | 'anomalies' | 'decisions' | 'team' | 'sparring'

export default function IntelligencePage() {
  const router = useRouter()
  const { session } = useStore()
  const [tab, setTab] = useState<Tab>('overview')
  const [health, setHealth] = useState<Record<string, unknown> | null>(null)
  const [anomalies, setAnomalies] = useState<Record<string, unknown>[]>([])
  const [loadingHealth, setLoadingHealth] = useState(true)
  const [sparringInput, setSparringInput] = useState('')
  const [sparringResponse, setSparringResponse] = useState('')
  const [sparringSending, setSparringSending] = useState(false)
  const [scoreHistory, setScoreHistory] = useState<Record<string, unknown>[]>([])

  const askAskBiz = useCallback((prompt: string) => {
    router.push('/ask')
    setTimeout(() => window.dispatchEvent(new CustomEvent('askbiz:send', { detail: prompt })), 400)
  }, [router])

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

  const dismissAnomaly = async (id: string) => {
    await fetch('/api/health/anomaly', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, seen: true }) })
    setAnomalies(prev => prev.filter(a => a.id !== id))
  }

  const askSparring = async () => {
    if (!sparringInput.trim()) return
    setSparringSending(true)
    setSparringResponse('')
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: sparringInput }], streaming: false, simulateMode: false, cfoMode: false }) })
      const data = await res.json()
      setSparringResponse(data.answer_text || 'No response generated.')
    } catch {
      setSparringResponse('Could not connect — please try again.')
    } finally {
      setSparringSending(false)
    }
  }

  const criticalCount = anomalies.filter(a => a.severity === 'critical').length
  const warningCount = anomalies.filter(a => a.severity === 'warning').length
  const scoreHistoryItems = scoreHistory.slice(-30)
  const tabs = [
    { id: 'overview' as Tab, label: 'Overview' },
    { id: 'anomalies' as Tab, label: 'Alerts', badge: criticalCount + warningCount },
    { id: 'decisions' as Tab, label: 'Decision Memory' },
    { id: 'team' as Tab, label: 'Team' },
    { id: 'sparring' as Tab, label: 'Ask AskBiz' },
  ]
  const sparringPrompts = ['Should I launch in Germany?', 'Is now a good time to raise my prices?', 'What is my biggest business risk right now?', 'Should I hire someone or use freelancers?']

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
          {health && <BusinessHealthScore health={health as Parameters<typeof BusinessHealthScore>[0]['health']} size="sm" onAsk={askAskBiz}/>}
        </div>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 14px', border: 'none', background: 'transparent', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? '#6366F1' : 'var(--tx3)', borderBottom: tab === t.id ? '2px solid #6366F1' : '2px solid transparent', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              {t.label}
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
              <BusinessHealthScore health={health as Parameters<typeof BusinessHealthScore>[0]['health']} size="lg" showComponents onAsk={askAskBiz}/>
            )}
            {scoreHistoryItems.length > 1 && (
              <div style={{ padding: '14px 16px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>30-Day Health Trend</div>
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
                <AnomalyFeed anomalies={anomalies.slice(0, 3) as Parameters<typeof AnomalyFeed>[0]['anomalies']} onAsk={askAskBiz} compact/>
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
            </div>
          </div>
        )}
        {tab === 'anomalies' && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>Active Alerts</div>
              <div style={{ fontSize: 12, color: 'var(--tx3)' }}>AskBiz monitors your data and flags anything that needs attention</div>
            </div>
            <AnomalyFeed anomalies={anomalies as Parameters<typeof AnomalyFeed>[0]['anomalies']} onAsk={askAskBiz} onDismiss={dismissAnomaly}/>
          </div>
        )}
        {tab === 'decisions' && <div style={{ maxWidth: 720 }}><DecisionMemory onAsk={askAskBiz}/></div>}
        {tab === 'team' && <div style={{ maxWidth: 720 }}><TeamPanel/></div>}
        {tab === 'sparring' && (
          <div style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>What if...? — Scenario Planning</div>
              <div style={{ fontSize: 13, color: 'var(--tx3)', lineHeight: 1.6 }}>Ask AskBiz to challenge your thinking or model a scenario before you commit.</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {sparringPrompts.map((p, i) => (
                <button key={i} onClick={() => setSparringInput(p)} style={{ fontSize: 12, color: 'var(--tx2)', background: 'var(--ev)', border: '1px solid var(--b)', borderRadius: 9999, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>{p}</button>
              ))}
            </div>
            <textarea value={sparringInput} onChange={e => setSparringInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askSparring() } }} placeholder="Ask anything about your business strategy..." rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b2)', background: 'var(--sf)', fontSize: 13, fontFamily: 'inherit', color: 'var(--tx)', resize: 'none', outline: 'none', lineHeight: 1.6, boxSizing: 'border-box', marginBottom: 10 }}></div>
            <button onClick={askSparring} disabled={!sparringInput.trim() || sparringSending} style={{ width: '100%', padding: '11px', borderRadius: 10, border: 'none', background: sparringSending ? 'var(--b)' : '#6366F1', color: sparringSending ? 'var(--tx3)' : '#fff', fontSize: 13, fontWeight: 600, cursor: sparringSending ? 'wait' : 'pointer', fontFamily: 'inherit', marginBottom: 16 }}>
              {sparringSending ? 'Thinking...' : 'Ask AskBiz'}
            </button>
            {sparringResponse && (
              <div style={{ padding: '16px 18px', borderRadius: 14, border: '1px solid rgba(99,102,241,.2)', background: 'rgba(99,102,241,.03)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', marginBottom: 10 }}>AskBiz</div>
                <div style={{ fontSize: 14, color: 'var(--tx)', lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: sparringResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}></div>
                <button onClick={() => { setSparringInput(''); setSparringResponse('') }} style={{ marginTop: 12, fontSize: 12, color: 'var(--tx3)', background: 'transparent', border: '1px solid var(--b)', borderRadius: 9999, padding: '4px 10px', cursor: 'pointer', fontFamily: 'inherit' }}>Ask something else</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
