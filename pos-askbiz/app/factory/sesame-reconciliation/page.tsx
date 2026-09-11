'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

const GREEN  = '#22c55e'
const RED    = '#ef4444'
const AMBER  = '#f59e0b'
const BLUE   = '#3b82f6'

interface ReconciliationData {
  stages: {
    name: string
    quantity: number
    unit: string
    captures: number
    lastDate: string
  }[]
  flow: {
    intake: number
    output: number
    packaging: number
    dispatch: number
    stock: number
    balanced: boolean
    mismatches: string[]
  }
  batches: {
    id: string
    date: string
    intake: number
    output: number
    packaging: number
    dispatch: number
    status: 'balanced' | 'incomplete' | 'mismatch'
  }[]
  posSync: {
    pendingDispatch: number
    syncedDispatch: number
    lastSync: string | null
  }
}

export default function SesameReconciliationPage() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const [data, setData] = useState<ReconciliationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!authReady || !session) return
    load()
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => load(), 15000)
    return () => clearInterval(interval)
  }, [authReady, session])

  async function load() {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch('/api/pos/factory/sesame-reconciliation', {
        headers: session.headers
      })
      const d = res.ok ? await res.json() : null
      if (d) {
        setData(d)
        // Auto-sync if there are pending dispatches
        if (d.posSync.pendingDispatch > 0) {
          setTimeout(() => syncToPOS(), 1000)
        }
      }
    } catch (e) {
      console.error('Reconciliation load error:', e)
    } finally {
      setLoading(false)
    }
  }

  async function syncToPOS() {
    if (!session || !data?.posSync.pendingDispatch) return
    setSyncing(true)
    try {
      const res = await fetch('/api/pos/factory/sesame-reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...session.headers },
        body: JSON.stringify({ action: 'sync_to_pos' })
      })
      const result = await res.json()
      console.log('Sync response:', result, 'Status:', res.status)
      if (res.ok) {
        setTimeout(() => load(), 500)
      } else {
        console.error('Sync failed:', result)
      }
    } catch (e) {
      console.error('Sync error:', e)
    } finally {
      setSyncing(false)
    }
  }

  if (!authReady || !session) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9' }}>Loading...</div>
  }

  if (loading || !data) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9' }}>Loading reconciliation data...</div>
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/factory/sesame')} style={{ background: '#334155', border: 'none', color: '#94a3b8', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: BLUE }}>🔗 Reconciliation</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Track sesame oil through all stages</div>
          </div>
        </div>
        <button onClick={load} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>↻ Refresh</button>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Flow Stages */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📊 Production Flow Stages</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            {data.stages.map(stage => (
              <div key={stage.name} style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{stage.name}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: BLUE, marginBottom: 4 }}>{stage.quantity.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 6 }}>
                  {stage.unit} • {stage.captures} captures
                </div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Last: {new Date(stage.lastDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reconciliation Status */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>✓ Reconciliation Status</div>

          {data.flow.balanced ? (
            <div style={{ background: GREEN + '15', border: `1px solid ${GREEN}40`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>✓ BALANCED</div>
              <div style={{ fontSize: 12, color: '#e2e8f0', marginTop: 6 }}>
                {data.flow.intake.toLocaleString()} intake = {data.flow.packaging.toLocaleString()} packaging + {data.flow.dispatch.toLocaleString()} dispatched + {data.flow.stock.toLocaleString()} stock
              </div>
            </div>
          ) : (
            <div style={{ background: RED + '15', border: `1px solid ${RED}40`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: RED }}>✕ MISMATCH DETECTED</div>
              <div style={{ fontSize: 12, color: '#e2e8f0', marginTop: 6 }}>
                {data.flow.mismatches.map((m, i) => <div key={i}>• {m}</div>)}
              </div>
            </div>
          )}

          {/* Flow breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Total Intake</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BLUE }}>{data.flow.intake}</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Packaged</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: GREEN }}>{data.flow.packaging}</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>Dispatched</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: AMBER }}>{data.flow.dispatch}</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>In Stock</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: BLUE }}>{data.flow.stock}</div>
            </div>
          </div>
        </div>

        {/* POS Sync Status */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🔄 POS Inventory Sync</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Pending Sync</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: AMBER }}>{data.posSync.pendingDispatch}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Jerrycans awaiting sync</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Synced to POS</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>{data.posSync.syncedDispatch}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
                {data.posSync.lastSync ? `Last: ${new Date(data.posSync.lastSync).toLocaleString()}` : 'Never synced'}
              </div>
            </div>
          </div>
          {data.posSync.pendingDispatch > 0 && (
            <div style={{ width: '100%', background: AMBER + '15', border: `1px solid ${AMBER}40`, color: AMBER, padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
              ⏳ Auto-syncing {data.posSync.pendingDispatch} jerrycans...
            </div>
          )}
        </div>

        {/* Batch Details */}
        {data.batches.length > 0 && (
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📦 Production Batches</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Date</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Intake</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Output</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Packaged</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Dispatched</th>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.batches.map(batch => (
                    <tr key={batch.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '10px', color: '#e2e8f0' }}>{new Date(batch.date).toLocaleDateString()}</td>
                      <td style={{ padding: '10px', color: BLUE }}>{batch.intake}</td>
                      <td style={{ padding: '10px', color: GREEN }}>{batch.output}</td>
                      <td style={{ padding: '10px', color: BLUE }}>{batch.packaging}</td>
                      <td style={{ padding: '10px', color: AMBER }}>{batch.dispatch}</td>
                      <td style={{ padding: '10px' }}>
                        <span style={{
                          fontSize: 10,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: batch.status === 'balanced' ? GREEN + '1a' : batch.status === 'incomplete' ? AMBER + '1a' : RED + '1a',
                          color: batch.status === 'balanced' ? GREEN : batch.status === 'incomplete' ? AMBER : RED,
                          fontWeight: 600
                        }}>
                          {batch.status === 'balanced' ? '✓ Balanced' : batch.status === 'incomplete' ? '⏳ Incomplete' : '✕ Mismatch'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
