'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePosAuth } from '@/lib/hooks/usePosAuth'
import { useLang } from '@/components/LanguageProvider'

const AMBER  = '#f59e0b'
const GREEN  = '#22c55e'
const RED    = '#ef4444'
const BLUE   = '#3b82f6'

interface ProductionData {
  // Intake tracking
  totalArrival: number
  totalFeedUsed: number
  remainingArrival: number
  feedCost: number
  costPerKg: number

  // Production tracking
  oilProduced: number
  wastage: number
  yield: number

  // Packaging & dispatch
  jerrycansProduced: number
  jerrycansDispatched: number
  jerrycansInStock: number

  // Revenue
  totalRevenue: number
  costOfGoods: number
  grossMargin: number
}

export default function SesameProductionPage() {
  const router = useRouter()
  const { tc } = useLang()
  const { session, ready: authReady } = usePosAuth()
  const [data, setData] = useState<ProductionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authReady || !session) return
    load()
  }, [authReady, session])

  async function load() {
    if (!session) return
    setLoading(true)
    try {
      const res = await fetch('/api/pos/factory/sesame-production', {
        headers: session.headers
      })
      const d = res.ok ? await res.json() : null
      if (d) setData(d)
    } catch (e) {
      console.error('Sesame production load error:', e)
    } finally {
      setLoading(false)
    }
  }

  if (!authReady || !session) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9' }}>Loading...</div>
  }

  if (loading || !data) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#f1f5f9' }}>Loading production data...</div>
  }

  return (
    <div className="pos-screen" style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => router.push('/factory')} style={{ background: '#334155', border: 'none', color: '#94a3b8', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18 }}>←</button>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: AMBER }}>🌾 Sesame Production</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>Real-time intake, production & inventory</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => router.push('/factory/sesame-reconciliation')} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🔗 Reconciliation</button>
          <button onClick={load} style={{ background: '#334155', border: 'none', color: '#94a3b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>↻ Refresh</button>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Intake Tracking */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📥 Intake & Deduction</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Total Arrival</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: BLUE }}>{data.totalArrival.toLocaleString()} kg</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Used for Pressing</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: AMBER }}>{data.totalFeedUsed.toLocaleString()} kg</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>@ {data.costPerKg.toFixed(2)} KSh/kg</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Feed Cost</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: RED }}>{data.feedCost.toLocaleString()} KSh</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Total spent</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Remaining</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>{data.remainingArrival.toLocaleString()} kg</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>In stock</div>
            </div>
          </div>
        </div>

        {/* Production Tracking */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚙️ Production Output</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Oil Produced</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>{data.oilProduced.toLocaleString('en-US', { maximumFractionDigits: 1 })} L</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Waste Generated</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: RED }}>{data.wastage.toLocaleString()} kg</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Yield %</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: data.yield > 30 ? GREEN : AMBER }}>{data.yield.toFixed(1)}%</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Normal: 33-63%</div>
            </div>
          </div>
        </div>

        {/* Packaging & Dispatch */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📦 Jerrycan Inventory (20L)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Produced</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>{data.jerrycansProduced} cans</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Dispatched</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: AMBER }}>{data.jerrycansDispatched} cans</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>In Stock</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: BLUE }}>{data.jerrycansInStock} cans</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>Ready to sell</div>
            </div>
          </div>
          {/* Reconciliation check */}
          <div style={{ marginTop: 12, padding: '8px 12px', background: data.jerrycansProduced === (data.jerrycansDispatched + data.jerrycansInStock) ? '#22c55e1a' : '#ef44441a', borderRadius: 6, fontSize: 11, color: data.jerrycansProduced === (data.jerrycansDispatched + data.jerrycansInStock) ? GREEN : RED }}>
            {data.jerrycansProduced === (data.jerrycansDispatched + data.jerrycansInStock)
              ? `✓ Balanced: ${data.jerrycansProduced} produced = ${data.jerrycansDispatched} dispatched + ${data.jerrycansInStock} stock`
              : `✕ Mismatch: ${data.jerrycansProduced} produced ≠ ${data.jerrycansDispatched} + ${data.jerrycansInStock}`}
          </div>
        </div>

        {/* Revenue & Margin */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>💰 Revenue & Profitability</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 16 }}>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Total Revenue</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>{data.totalRevenue.toLocaleString()} KSh</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Cost of Goods</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: RED }}>{data.costOfGoods.toLocaleString()} KSh</div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Gross Margin</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>{data.grossMargin.toLocaleString()} KSh</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{data.totalRevenue > 0 ? ((data.grossMargin / data.totalRevenue) * 100).toFixed(1) : 0}% margin</div>
            </div>
          </div>

          {/* Cost breakdown */}
          <div style={{ background: '#0f172a', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Cost Breakdown</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>
              Sesame seed: {data.feedCost.toLocaleString()} KSh ({data.totalFeedUsed.toLocaleString()} kg @ 30 KSh/kg)
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>
              Jerrycans sold: {(((data.jerrycansProduced || 0) - (data.jerrycansInStock || 0)) * 6000).toLocaleString()} KSh ({(data.jerrycansProduced || 0) - (data.jerrycansInStock || 0)} sold × 6000 KSh)
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              Waste in stock: {((data.wastage - 0) * 30).toLocaleString()} KSh (cost to be offset by sales)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
