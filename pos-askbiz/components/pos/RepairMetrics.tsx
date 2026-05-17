'use client'
import { useState, useEffect } from 'react'

const ACC = '#d08a59'
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'

interface Props {
  currencySymbol: string
  selectedLocation: string
}

interface Metrics {
  active_jobs: number
  intake: number
  in_progress: number
  completed: number
  collected_today: number
  revenue_today: number
  avg_turnaround_hours: number | null
  warranty_claims: number
}

function fmt(symbol: string, amount: number): string {
  const num = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const needsSpace = symbol.length > 1 && /[a-zA-Z]$/.test(symbol)
  return `${symbol}${needsSpace ? ' ' : ''}${num}`
}

export default function RepairMetrics({ currencySymbol, selectedLocation }: Props) {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams()
        if (selectedLocation !== 'all') params.set('location_id', selectedLocation)

        // Fetch all active service jobs to compute metrics client-side
        const res = await fetch(`/api/pos/service-jobs?limit=100&${params}`)
        const data = await res.json()
        const jobs = data.jobs || []

        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        const active = jobs.filter((j: any) => !['collected', 'cancelled'].includes(j.status))
        const intake = jobs.filter((j: any) => j.status === 'intake').length
        const inProgress = jobs.filter((j: any) => j.status === 'in_progress').length
        const completed = jobs.filter((j: any) => j.status === 'completed').length
        const collectedToday = jobs.filter((j: any) => j.status === 'collected' && new Date(j.updated_at) >= todayStart)
        const revenueToday = collectedToday.reduce((s: number, j: any) => s + (j.quoted_price || 0), 0)

        // Avg turnaround for collected jobs (created_at → updated_at when collected)
        const collectedAll = jobs.filter((j: any) => j.status === 'collected')
        let avgTurnaround: number | null = null
        if (collectedAll.length > 0) {
          const totalHours = collectedAll.reduce((s: number, j: any) => {
            return s + (new Date(j.updated_at).getTime() - new Date(j.created_at).getTime()) / (1000 * 60 * 60)
          }, 0)
          avgTurnaround = Math.round(totalHours / collectedAll.length)
        }

        // Warranty claims
        const warrantyClaims = jobs.filter((j: any) => j.warranty_job_id).length

        setMetrics({
          active_jobs: active.length,
          intake,
          in_progress: inProgress,
          completed,
          collected_today: collectedToday.length,
          revenue_today: revenueToday,
          avg_turnaround_hours: avgTurnaround,
          warranty_claims: warrantyClaims,
        })
      } catch (err) {
        console.error('Failed to load repair metrics:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedLocation])

  if (loading || !metrics) return null
  if (metrics.active_jobs === 0 && metrics.collected_today === 0) return null

  const cardStyle: React.CSSProperties = {
    padding: '14px 16px', borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)',
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 10 }}>Repair Services</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Active jobs</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: metrics.active_jobs > 0 ? ACC : 'var(--tx)' }}>{metrics.active_jobs}</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
            {metrics.intake > 0 && `${metrics.intake} intake · `}{metrics.in_progress > 0 && `${metrics.in_progress} in progress · `}{metrics.completed > 0 && `${metrics.completed} ready`}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Collected today</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: metrics.collected_today > 0 ? GREEN : 'var(--tx)' }}>{metrics.collected_today}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Repair revenue</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: metrics.revenue_today > 0 ? GREEN : 'var(--tx)' }}>{fmt(currencySymbol, metrics.revenue_today)}</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>today</div>
        </div>
        {metrics.avg_turnaround_hours !== null && (
          <div style={cardStyle}>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Avg turnaround</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: metrics.avg_turnaround_hours <= 24 ? GREEN : metrics.avg_turnaround_hours <= 72 ? AMBER : RED }}>
              {metrics.avg_turnaround_hours < 24 ? `${metrics.avg_turnaround_hours}h` : `${Math.round(metrics.avg_turnaround_hours / 24)}d`}
            </div>
          </div>
        )}
        {metrics.warranty_claims > 0 && (
          <div style={cardStyle}>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>Warranty claims</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: RED }}>{metrics.warranty_claims}</div>
          </div>
        )}
      </div>
    </div>
  )
}
