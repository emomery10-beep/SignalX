'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Ranking {
  key: string; label: string; value: number; unit: string
  rank: number; total: number; percentile: number
}

interface SectorComparison {
  sector: string; is_user_sector: boolean
  metrics: { key: string; label: string; user_value: number; benchmark_value: number | null; diff_pct: number | null; unit: string; sample_size: number }[]
}

const SECTOR_KEY_MAP: Record<string, string> = {
  retail: 'sectorRetail',
  ecommerce: 'sectorEcommerce',
  restaurant: 'sectorRestaurant',
  'food-bev': 'sectorFoodBev',
  'import-export': 'sectorImportExport',
  saas: 'sectorSaas',
  services: 'sectorServices',
  fashion: 'sectorFashion',
  'health-beauty': 'sectorHealthBeauty',
  salon: 'sectorSalon',
  repair: 'sectorRepair',
  factory: 'sectorFactory',
}

export default function CrossSectorIntel({ onAsk }: { onAsk?: (prompt: string) => void }) {
  const { tc } = useLang()
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [comparisons, setComparisons] = useState<SectorComparison[]>([])
  const [userSector, setUserSector] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [sym, setSym] = useState('£')

  useEffect(() => {
    fetch('/api/cross-sector')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setRankings(data.rankings || [])
        setComparisons(data.sector_comparisons || [])
        setUserSector(data.user_sector || '')
        if (data.currency_symbol) setSym(data.currency_symbol)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F59E0B' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intel_crosssector.title')}</span>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: 36, borderRadius: 10, background: 'var(--ev, #f3f2ef)', animation: 'pulse 1.5s infinite', marginBottom: 8 }} />
        ))}
      </div>
    )
  }

  if (rankings.length === 0) return null

  const fmt = (v: number, unit: string) => unit === '£'
    ? (Math.abs(v) >= 1000 ? `${sym}${(v / 1000).toFixed(1)}k` : `${sym}${v.toFixed(0)}`)
    : `${v.toFixed(1)}%`

  const getSectorLabel = (sector: string) => {
    const key = SECTOR_KEY_MAP[sector]
    return key ? tc('intel_crosssector.' + key) : sector
  }

  return (
    <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'linear-gradient(180deg, var(--sf) 0%, rgba(245,158,11,.02) 100%)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F59E0B' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intel_crosssector.title')}</span>
          <span style={{ fontSize: 10, color: 'var(--tx3)', background: 'var(--ev, #f3f2ef)', borderRadius: 6, padding: '1px 6px' }}>
            {getSectorLabel(userSector)}
          </span>
        </div>
        {onAsk && (
          <button
            onClick={() => onAsk(tc('intel_crosssector.askAiPrompt'))}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >{tc('intel_crosssector.askAi')}</button>
        )}
      </div>

      {/* Ranking bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {rankings.map(r => {
          const pctColor = r.percentile >= 75 ? '#10B981' : r.percentile >= 50 ? '#6366F1' : r.percentile >= 25 ? '#F59E0B' : '#EF4444'
          return (
            <div key={r.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{r.label}</span>
                <span style={{ fontSize: 12, color: 'var(--tx)' }}>
                  {fmt(r.value, r.unit)}
                  <span style={{ fontSize: 10, color: 'var(--tx3)', marginLeft: 6 }}>
                    #{r.rank}/{r.total}
                  </span>
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--ev, #f3f2ef)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  width: `${Math.max(r.percentile, 3)}%`,
                  background: `linear-gradient(90deg, ${pctColor}80, ${pctColor})`,
                  transition: 'width 500ms ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Sector comparisons */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx3)', marginBottom: 8, letterSpacing: '.02em' }}>
        {tc('intel_crosssector.compareWithSectors')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {comparisons.slice(0, 8).map(comp => (
          <div key={comp.sector}>
            <button
              onClick={() => setExpanded(expanded === comp.sector ? null : comp.sector)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 10,
                background: comp.is_user_sector ? 'rgba(99,102,241,.06)' : 'var(--sf)',
                border: `1px solid ${comp.is_user_sector ? 'rgba(99,102,241,.15)' : 'var(--b)'}`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>
                  {getSectorLabel(comp.sector)}
                </span>
                {comp.is_user_sector && (
                  <span style={{ fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.1)', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>{tc('intel_crosssector.youBadge')}</span>
                )}
              </div>
              <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{expanded === comp.sector ? '▴' : '▾'}</span>
            </button>

            {expanded === comp.sector && (
              <div style={{ padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {comp.metrics.filter(m => m.benchmark_value != null).map(m => {
                  const better = m.key === 'refund_rate' ? (m.diff_pct || 0) < 0 : (m.diff_pct || 0) > 0
                  return (
                    <div key={m.key} style={{ padding: '6px 8px', borderRadius: 8, background: 'var(--ev, #f3f2ef)' }}>
                      <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{m.label}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>
                          {fmt(m.benchmark_value!, m.unit)}
                        </span>
                        {m.diff_pct !== null && (
                          <span style={{ fontSize: 10, color: better ? '#10B981' : '#EF4444' }}>
                            {m.diff_pct > 0 ? '+' : ''}{m.diff_pct}%
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>{tc('intel_crosssector.businesses', { n: m.sample_size })}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
