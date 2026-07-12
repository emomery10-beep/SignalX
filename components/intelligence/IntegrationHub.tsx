'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/components/LanguageProvider'

interface ConnectedSource {
  id: string
  source_type: string
  name: string
  status: string
  last_synced_at: string | null
  error_message: string | null
}

const ALL_SOURCES = [
  // E-Commerce
  { type: 'shopify',      label: 'Shopify',          category: 'E-Commerce',  icon: '🛒' },
  { type: 'amazon_fba',   label: 'Amazon FBA',        category: 'E-Commerce',  icon: '📦' },
  { type: 'ebay',         label: 'eBay',              category: 'E-Commerce',  icon: '🏪' },
  { type: 'etsy',         label: 'Etsy',              category: 'E-Commerce',  icon: '🎨' },
  { type: 'woocommerce',  label: 'WooCommerce',       category: 'E-Commerce',  icon: '🔌' },
  { type: 'walmart',      label: 'Walmart',           category: 'E-Commerce',  icon: '🏬' },
  // Accounting
  { type: 'quickbooks',   label: 'QuickBooks',        category: 'Accounting',  icon: '📊' },
  { type: 'xero',         label: 'Xero',              category: 'Accounting',  icon: '📒' },
  { type: 'freeagent',    label: 'FreeAgent',         category: 'Accounting',  icon: '🧾' },
  { type: 'wave',         label: 'Wave',              category: 'Accounting',  icon: '〰️' },
  { type: 'sage',         label: 'Sage',              category: 'Accounting',  icon: '🌿' },
  // Payments
  { type: 'stripe',       label: 'Stripe',            category: 'Payments',    icon: '💳' },
  { type: 'paypal',       label: 'PayPal',            category: 'Payments',    icon: '🅿️' },
  { type: 'gocardless',   label: 'GoCardless',        category: 'Payments',    icon: '🏦' },
  { type: 'klarna',       label: 'Klarna',            category: 'Payments',    icon: '🛍️' },
  { type: 'sumup',        label: 'SumUp',             category: 'Payments',    icon: '📲' },
  { type: 'mpesa',        label: 'M-Pesa',            category: 'Payments',    icon: '📱' },
  // Marketing
  { type: 'meta_ads',     label: 'Meta Ads',          category: 'Marketing',   icon: '📣' },
  { type: 'google_ads',   label: 'Google Ads',        category: 'Marketing',   icon: '🔍' },
  { type: 'google_analytics', label: 'Google Analytics', category: 'Marketing', icon: '📈' },
  { type: 'mailchimp',    label: 'Mailchimp',         category: 'Marketing',   icon: '✉️' },
  { type: 'klaviyo',      label: 'Klaviyo',           category: 'Marketing',   icon: '📧' },
  // Inventory & Logistics
  { type: 'linnworks',    label: 'Linnworks',         category: 'Logistics',   icon: '🔄' },
  { type: 'cin7',         label: 'Cin7',              category: 'Logistics',   icon: '📋' },
  { type: 'shipstation',  label: 'ShipStation',       category: 'Logistics',   icon: '🚢' },
  { type: 'royalmail',    label: 'Royal Mail',        category: 'Logistics',   icon: '📮' },
  // Social Commerce
  { type: 'tiktok_shop',  label: 'TikTok Shop',       category: 'Social',      icon: '🎵' },
  { type: 'instagram',    label: 'Instagram Shopping', category: 'Social',      icon: '📷' },
  { type: 'pinterest',    label: 'Pinterest',         category: 'Social',      icon: '📌' },
  // Data
  { type: 'google_sheets',label: 'Google Sheets',     category: 'Data',        icon: '📄' },
  { type: 'csv_upload',   label: 'File Upload',       category: 'Data',        icon: '📂' },
]

const CATEGORIES = ['E-Commerce', 'Accounting', 'Payments', 'Marketing', 'Logistics', 'Social', 'Data']

function timeAgo(iso: string | null) {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function IntegrationHub() {
  const { tc } = useLang()
  const router = useRouter()
  const [connected, setConnected] = useState<ConnectedSource[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/sources')
      .then(r => r.ok ? r.json() : [])
      .then(data => setConnected(Array.isArray(data) ? data : []))
      .catch(() => setConnected([]))
      .finally(() => setLoading(false))
  }, [])

  const connectedTypes = new Set(connected.map(c => c.source_type))
  const connectedCount = connectedTypes.size
  const totalCount = ALL_SOURCES.length

  const filtered = activeCategory
    ? ALL_SOURCES.filter(s => s.category === activeCategory)
    : ALL_SOURCES

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sora)', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{tc('intel_integrationhub.title')}</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)' }}>
            <span style={{ fontWeight: 700, color: connectedCount > 0 ? '#22C55E' : 'var(--tx3)' }}>{connectedCount}</span> {tc('intel_integrationhub.sourcesConnectedSuffix', { total: totalCount })}
          </div>
        </div>
        <button
          onClick={() => router.push('/sources')}
          style={{ padding: '8px 16px', borderRadius: 9999, border: 'none', background: '#6366F1', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {tc('intel_integrationhub.manageSources')}
        </button>
      </div>

      {/* Connection health bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 6, borderRadius: 9999, background: 'var(--ev)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(connectedCount / totalCount) * 100}%`,
            background: connectedCount > 10 ? '#22C55E' : connectedCount > 4 ? '#F59E0B' : '#6366F1',
            borderRadius: 9999,
            transition: 'width 600ms ease',
          }} />
        </div>
        <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 5 }}>
          {connectedCount === 0 && tc('intel_integrationhub.coverageNone')}
          {connectedCount > 0 && connectedCount < 5 && tc('intel_integrationhub.coverageLow', { n: 5 - connectedCount })}
          {connectedCount >= 5 && connectedCount < 10 && tc('intel_integrationhub.coverageMid')}
          {connectedCount >= 10 && tc('intel_integrationhub.coverageHigh')}
        </div>
      </div>

      {/* Category filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{ padding: '5px 12px', borderRadius: 9999, border: `1px solid ${!activeCategory ? '#6366F1' : 'var(--b)'}`, background: !activeCategory ? '#6366F110' : 'transparent', color: !activeCategory ? '#6366F1' : 'var(--tx3)', fontSize: 10, fontWeight: !activeCategory ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {tc('intel_integrationhub.filterAll')}
        </button>
        {CATEGORIES.map(cat => {
          const catSources = ALL_SOURCES.filter(s => s.category === cat)
          const catConnected = catSources.filter(s => connectedTypes.has(s.type)).length
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(isActive ? null : cat)}
              style={{ padding: '5px 12px', borderRadius: 9999, border: `1px solid ${isActive ? '#6366F1' : 'var(--b)'}`, background: isActive ? '#6366F110' : 'transparent', color: isActive ? '#6366F1' : 'var(--tx3)', fontSize: 10, fontWeight: isActive ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              {cat}
              {catConnected > 0 && (
                <span style={{ fontSize: 9, fontWeight: 700, background: '#22C55E', color: '#fff', borderRadius: 9999, padding: '1px 5px', lineHeight: 1 }}>{catConnected}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Source grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ height: 70, borderRadius: 12, background: 'var(--ev)', animation: 'shimmer 1.4s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {filtered.map(source => {
            const isConnected = connectedTypes.has(source.type)
            const liveSource = connected.find(c => c.source_type === source.type)
            const hasError = liveSource?.error_message
            const isExpanded = expanded === source.type

            return (
              <div
                key={source.type}
                onClick={() => setExpanded(isExpanded ? null : source.type)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: `1px solid ${isConnected ? (hasError ? '#FCA5A5' : '#BBF7D0') : 'var(--b)'}`,
                  background: isConnected ? (hasError ? 'rgba(239,68,68,0.04)' : 'rgba(34,197,94,0.04)') : 'var(--sf)',
                  cursor: 'pointer',
                  transition: 'box-shadow 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{source.icon}</span>
                  {/* Status dot */}
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 2, flexShrink: 0,
                    background: isConnected ? (hasError ? '#EF4444' : '#22C55E') : '#D1D5DB',
                    boxShadow: isConnected && !hasError ? '0 0 0 2px #BBF7D040' : 'none',
                  }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', marginBottom: 2 }}>{source.label}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
                  {isConnected
                    ? (hasError ? tc('intel_integrationhub.statusSyncError') : tc('intel_integrationhub.statusSynced', { time: timeAgo(liveSource?.last_synced_at || null) }))
                    : tc('intel_integrationhub.statusNotConnected')
                  }
                </div>
                {/* Expanded detail */}
                {isExpanded && isConnected && liveSource && (
                  <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--b)' }}>
                    <div style={{ fontSize: 9, color: 'var(--tx3)', marginBottom: 4 }}>{tc('intel_integrationhub.detailName')} <span style={{ color: 'var(--tx2)' }}>{liveSource.name}</span></div>
                    {hasError && <div style={{ fontSize: 9, color: '#EF4444' }}>{liveSource.error_message}</div>}
                    {!hasError && <div style={{ fontSize: 9, color: '#22C55E' }}>{tc('intel_integrationhub.detailActive')}</div>}
                  </div>
                )}
                {isExpanded && !isConnected && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={e => { e.stopPropagation(); router.push('/sources') }}
                      style={{ width: '100%', padding: '6px 0', borderRadius: 8, border: 'none', background: '#6366F1', color: '#fff', fontSize: 9, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      {tc('intel_integrationhub.connect')}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
