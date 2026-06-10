'use client'

import { useState, useRef, useEffect } from 'react'

interface SearchResult {
  query: string
  response: string
  sources: string[]
  timestamp: string
}

interface UnifiedSearchProps {
  ownerId: string
  ownerEmail: string
  compact?: boolean // For embedding in pulse bar
}

export function UnifiedSearch({ ownerId, ownerEmail, compact = false }: UnifiedSearchProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [history, setHistory] = useState<SearchResult[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setShowHistory(false)

    try {
      const response = await fetch('/api/pos/intelligence/unified-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          owner_id: ownerId,
          owner_email: ownerEmail,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
        setHistory([data, ...history.slice(0, 4)]) // Keep last 5 searches
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const suggestionQueries = [
    '📦 Where can I buy low stock items?',
    '📊 What is my revenue trend?',
    '🚚 Where are my shipments?',
    '💰 What suppliers have best pricing?',
    '📈 Business health summary',
    '🔴 Critical alerts',
  ]

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="🔍 Ask about inventory, suppliers, shipping..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            fontSize: '13px',
          }}
        />
        <button
          onClick={() => handleSearch()}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          {loading ? '⏳' : '🚀'}
        </button>
      </div>
    )
  }

  // Full page search
  return (
    <div className="pos-screen" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Search Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '800', color: '#1f2937' }}>
          🔍 Business Intelligence Search
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          Search across POS data, suppliers (Tivali), shipping (Track17), and AI insights
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          position: 'relative',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask about low stock, suppliers, shipments, revenue, health... (Bloomberg style 📊)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          style={{
            flex: 1,
            padding: '14px 16px',
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            fontSize: '15px',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="pos-btn-primary"
          style={{
            padding: '14px 28px',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '⏳ Searching...' : '🚀 Search'}
        </button>

        {/* Search History Dropdown */}
        {showHistory && history.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ padding: '8px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>
              Recent Searches
            </div>
            {history.map((h, i) => (
              <button
                key={i}
                className="pos-item"
                onClick={() => {
                  setQuery(h.query)
                  setResult(h)
                  setShowHistory(false)
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#f9fafb',
                  border: 'none',
                  borderBottom: '1px solid #e5e7eb',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#1f2937',
                  animationDelay: `${Math.min(i, 8) * 40}ms`,
                }}
              >
                {h.query}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Quick Suggestions */}
      {!result && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase' }}>
            Try These Queries
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
            {suggestionQueries.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(suggestion)
                  // Trigger search after state update
                  setTimeout(() => handleSearch(), 0)
                }}
                style={{
                  padding: '12px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#1e40af',
                  fontWeight: '500',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e: any) => {
                  ;(e.target as HTMLElement).style.backgroundColor = '#dbeafe'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="pos-reveal" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' }}>
          {/* Query Echo */}
          <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Query</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{result.query}</div>
            <div style={{ fontSize: '11px', color: 'var(--pos-hint)', marginTop: '8px' }}>
              Sources: {result.sources.join(' • ')} | {new Date(result.timestamp).toLocaleTimeString()}
            </div>
          </div>

          {/* Response */}
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#374151', whiteSpace: 'pre-wrap' }}>
            {result.response}
          </div>

          {/* Actions */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={() => setResult(null)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              New Search
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(result.response).then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  })
                }
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: copied ? '#dcfce7' : '#dbeafe',
                border: `1px solid ${copied ? '#86efac' : '#bfdbfe'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                color: copied ? '#15803d' : '#1e40af',
                transition: 'background-color 0.2s, color 0.2s',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy Result'}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', marginBottom: '12px' }}>⏳ Gathering intelligence from:</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px', color: '#6b7280' }}>
            <div>📊 POS</div>
            <div>🏭 Tivali</div>
            <div>🚚 Track17</div>
            <div>🤖 Claude</div>
          </div>
        </div>
      )}
    </div>
  )
}
