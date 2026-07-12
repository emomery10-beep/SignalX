'use client'
import { useState, useEffect, useCallback } from 'react'
import { getRegionConfig } from '@/lib/region-config'
import { useLang } from '@/components/LanguageProvider'

type Tc = (k: string, vars?: Record<string, string | number>) => string

interface Receivable {
  id: string
  type: 'receivable' | 'payable'
  counterparty: string
  amount: number
  dueDate: string
  daysOverdue: number
  status: 'current' | 'overdue_30' | 'overdue_60' | 'overdue_90'
  notes?: string
  source?: string  // 'pos', 'shopify', 'ebay', etc.
  auto?: boolean   // true if auto-generated from connected sources
}

interface Props {
  currencySymbol: string
  countryCode?: string | null
  onAsk?: (prompt: string) => void
  onTotalsChange?: (receivables: number, payables: number) => void
  period?: string
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

const AGING_BUCKETS = [
  { key: 'current', color: '#22C55E' },
  { key: 'overdue_30', color: '#F59E0B' },
  { key: 'overdue_60', color: '#F97316' },
  { key: 'overdue_90', color: '#EF4444' },
] as const

const bucketLabel = (tc: Tc, key: string): string => tc('cfo_receivables.bucket_' + key)

export default function ReceivablesTracker({ currencySymbol: sym, countryCode, onAsk, onTotalsChange, period }: Props) {
  const { tc } = useLang()
  const region = getRegionConfig(countryCode)
  const [view, setView] = useState<'receivables' | 'payables'>('receivables')
  const [items, setItems] = useState<Receivable[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({ counterparty: '', amount: '', dueDate: '', notes: '' })
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('grouped')
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)

  const loadItems = useCallback(() => {
    const url = period ? `/api/cfo/receivables?period=${period}` : '/api/cfo/receivables'
    fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.items) return
        const mapped: Receivable[] = data.items.map((r: any) => ({
          id: r.id,
          type: r.type === 'payable' ? 'payable' : 'receivable',
          counterparty: r.counterparty,
          amount: r.amount,
          dueDate: r.due_date,
          daysOverdue: r.days_overdue || 0,
          status: r.status || 'current',
          notes: r.notes || undefined,
          source: r.source || undefined,
          auto: r.auto || false,
        }))
        setItems(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [period])

  useEffect(() => { loadItems() }, [loadItems])

  useEffect(() => {
    if (onTotalsChange) {
      const recTotal = items.filter(i => i.type === 'receivable').reduce((s, i) => s + i.amount, 0)
      const payTotal = items.filter(i => i.type === 'payable').reduce((s, i) => s + i.amount, 0)
      onTotalsChange(recTotal, payTotal)
    }
  }, [items, onTotalsChange])

  const addItem = () => {
    if (!newItem.counterparty || !newItem.amount || !newItem.dueDate) return

    fetch('/api/cfo/receivables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: view === 'receivables' ? 'receivable' : 'payable',
        counterparty: newItem.counterparty,
        amount: Number(newItem.amount),
        due_date: newItem.dueDate,
        notes: newItem.notes || undefined,
      }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.item) {
          const r = data.item
          setItems(prev => [...prev, {
            id: r.id,
            type: r.type === 'payable' ? 'payable' : 'receivable',
            counterparty: r.counterparty,
            amount: r.amount,
            dueDate: r.due_date,
            daysOverdue: r.days_overdue || 0,
            status: r.status || 'current',
            notes: r.notes || undefined,
          }])
        }
      })
      .catch(() => {})

    setNewItem({ counterparty: '', amount: '', dueDate: '', notes: '' })
    setShowAdd(false)
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    fetch(`/api/cfo/receivables?id=${id}`, { method: 'DELETE' }).catch(() => {})
  }

  const filtered = items.filter(i => i.type === (view === 'receivables' ? 'receivable' : 'payable'))
  const totalAmount = filtered.reduce((s, i) => s + i.amount, 0)
  const overdueAmount = filtered.filter(i => i.status !== 'current').reduce((s, i) => s + i.amount, 0)

  // Aging summary
  const agingData = AGING_BUCKETS.map(bucket => {
    const amt = filtered.filter(i => i.status === bucket.key).reduce((s, i) => s + i.amount, 0)
    return { ...bucket, amount: amt, pct: totalAmount > 0 ? (amt / totalAmount) * 100 : 0 }
  })

  // Group by counterparty for grouped view
  const grouped = (() => {
    const map = new Map<string, { items: Receivable[]; total: number; maxOverdue: number; worstStatus: string }>()
    for (const item of filtered) {
      // Normalize: strip auto-generated suffixes for POS (use base name)
      const key = item.counterparty
      if (!map.has(key)) map.set(key, { items: [], total: 0, maxOverdue: 0, worstStatus: 'current' })
      const g = map.get(key)!
      g.items.push(item)
      g.total += item.amount
      g.maxOverdue = Math.max(g.maxOverdue, item.daysOverdue)
      const statusOrder = ['current', 'overdue_30', 'overdue_60', 'overdue_90']
      if (statusOrder.indexOf(item.status) > statusOrder.indexOf(g.worstStatus)) g.worstStatus = item.status
    }
    return Array.from(map.entries())
      .map(([name, g]) => ({ name, ...g }))
      .sort((a, b) => b.maxOverdue - a.maxOverdue || b.total - a.total)
  })()

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_receivables.title')}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {onAsk && overdueAmount > 0 && (
            <button
              onClick={() => onAsk(tc('cfo_receivables.ask_prompt', { overdue: fmt(overdueAmount, sym), view: tc('cfo_receivables.view_' + view), total: fmt(totalAmount, sym), country: region.countryName }))}
              style={{ fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              {tc('cfo_receivables.ask_ai')}
            </button>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            style={{ fontSize: 9, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {tc('cfo_receivables.add')}
          </button>
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', padding: '10px 18px', gap: 4, borderBottom: '1px solid var(--b)', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['receivables', 'payables'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '5px 12px', borderRadius: 7, fontSize: 9, fontWeight: view === v ? 600 : 400,
                border: view === v ? '1px solid #6366F1' : '1px solid var(--b)',
                background: view === v ? 'rgba(99,102,241,.08)' : 'transparent',
                color: view === v ? '#6366F1' : 'var(--tx3)',
                cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
              }}
            >
              {v === 'receivables' ? tc('cfo_receivables.tab_who_owes_you') : tc('cfo_receivables.tab_what_you_owe')}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['grouped', 'list'] as const).map(m => (
            <button key={m} onClick={() => setViewMode(m)} style={{
              padding: '5px 10px', borderRadius: 7, fontSize: 9, fontWeight: viewMode === m ? 600 : 400,
              border: viewMode === m ? '1px solid #6366F1' : '1px solid var(--b)',
              background: viewMode === m ? 'rgba(99,102,241,.08)' : 'transparent',
              color: viewMode === m ? '#6366F1' : 'var(--tx3)',
              cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
            }}>{m === 'grouped' ? tc('cfo_receivables.view_by_customer') : tc('cfo_receivables.view_all_items')}</button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--b)' }}>
        <div style={{ padding: '10px 18px', background: 'var(--sf)', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tc('cfo_receivables.total_outstanding')}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(totalAmount, sym)}</div>
        </div>
        <div style={{ padding: '10px 18px', background: 'var(--sf)', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tc('cfo_receivables.overdue')}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: overdueAmount > 0 ? '#EF4444' : '#22C55E', fontVariantNumeric: 'tabular-nums' }}>{fmt(overdueAmount, sym)}</div>
        </div>
      </div>

      {/* Aging bar */}
      {totalAmount > 0 && (
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)' }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx2)', marginBottom: 6 }}>{tc('cfo_receivables.aging')}</div>
          <div style={{ height: 20, borderRadius: 6, overflow: 'hidden', display: 'flex', background: 'var(--ev, #e5e5e5)' }}>
            {agingData.map(b => b.pct > 0 ? (
              <div key={b.key} style={{ width: `${Math.min(b.pct, 100)}%`, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms' }}>
                {b.pct > 12 && <span style={{ fontSize: 8, color: '#fff', fontWeight: 600 }}>{fmt(b.amount, sym)}</span>}
              </div>
            ) : null)}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 9, color: 'var(--tx3)' }}>
            {agingData.map(b => (
              <span key={b.key}><span style={{ color: b.color }}>●</span> {bucketLabel(tc, b.key)}: {fmt(b.amount, sym)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--tx)', marginBottom: 8 }}>
            {view === 'receivables' ? tc('cfo_receivables.add_receivable') : tc('cfo_receivables.add_payable')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder={view === 'receivables' ? tc('cfo_receivables.placeholder_customer') : tc('cfo_receivables.placeholder_supplier')}
              value={newItem.counterparty}
              onChange={e => setNewItem(p => ({ ...p, counterparty: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 9, fontFamily: 'inherit', outline: 'none' }}
            />
            <input
              type="number"
              placeholder={tc('cfo_receivables.placeholder_amount')}
              value={newItem.amount}
              onChange={e => setNewItem(p => ({ ...p, amount: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 9, fontFamily: 'inherit', outline: 'none' }}
            />
            <input
              type="date"
              value={newItem.dueDate}
              onChange={e => setNewItem(p => ({ ...p, dueDate: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 9, fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder={tc('cfo_receivables.placeholder_notes')}
              value={newItem.notes}
              onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))}
              style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 9, fontFamily: 'inherit', outline: 'none' }}
            />
            <button
              onClick={addItem}
              style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#6366F1', color: '#fff', fontSize: 9, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {tc('cfo_receivables.btn_add')}
            </button>
            <button
              onClick={() => setShowAdd(false)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 9, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {tc('cfo_receivables.btn_cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--tx3)', fontSize: 10 }}>
            {view === 'receivables' ? tc('cfo_receivables.empty_receivables') : tc('cfo_receivables.empty_payables')}
          </div>
        )}

        {/* Grouped view */}
        {viewMode === 'grouped' && grouped.map((group, gi) => {
          const bucket = AGING_BUCKETS.find(b => b.key === group.worstStatus) || AGING_BUCKETS[0]
          const isExpanded = expandedCustomer === group.name
          return (
            <div key={gi} style={{ borderTop: '1px solid var(--b)' }}>
              <div
                onClick={() => setExpandedCustomer(isExpanded ? null : group.name)}
                style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', gap: 10, cursor: 'pointer', transition: 'background 120ms' }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: bucket.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx)' }}>{group.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>
                    {group.items.length === 1 ? tc('cfo_receivables.item_count_one', { n: group.items.length }) : tc('cfo_receivables.item_count_many', { n: group.items.length })}
                    {group.maxOverdue > 0 && <span style={{ color: '#EF4444', fontWeight: 600 }}> · {tc('cfo_receivables.days_overdue', { n: group.maxOverdue })}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(group.total, sym)}</div>
                </div>
                <span style={{ fontSize: 9, color: 'var(--tx3)', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
              </div>
              {isExpanded && (
                <div style={{ background: 'rgba(99,102,241,.02)', borderTop: '1px solid var(--b)' }}>
                  {group.items.map(item => {
                    const b = AGING_BUCKETS.find(x => x.key === item.status) || AGING_BUCKETS[0]
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 18px 8px 34px', gap: 10, borderBottom: '1px solid var(--b)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: b.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
                            {tc('cfo_receivables.due', { date: new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) })}
                            {item.daysOverdue > 0 && <span style={{ color: '#EF4444', fontWeight: 600 }}> · {tc('cfo_receivables.days_overdue', { n: item.daysOverdue })}</span>}
                            {item.notes && <span> · {item.notes}</span>}
                            {item.source && <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase' }}>{item.source}</span>}
                          </div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: b.color, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{fmt(item.amount, sym)}</span>
                        {!item.auto && (
                          <button onClick={() => removeItem(item.id)} style={{ fontSize: 10, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>×</button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* List view */}
        {viewMode === 'list' && filtered.sort((a, b) => b.daysOverdue - a.daysOverdue).map(item => {
          const bucket = AGING_BUCKETS.find(b => b.key === item.status) || AGING_BUCKETS[0]
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderTop: '1px solid var(--b)', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: bucket.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--tx)' }}>{item.counterparty}</span>
                  {item.auto && item.source && (
                    <span style={{
                      fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 4,
                      background: item.source === 'pos' ? 'rgba(99,102,241,.1)' : item.source === 'shopify' ? 'rgba(150,191,72,.1)' : item.source === 'ebay' ? 'rgba(229,50,56,.1)' : 'rgba(208,138,89,.1)',
                      color: item.source === 'pos' ? '#6366F1' : item.source === 'shopify' ? '#5A8A00' : item.source === 'ebay' ? '#E53238' : '#d08a59',
                      textTransform: 'uppercase',
                    }}>
                      {item.source === 'pos' ? 'POS' : item.source === 'amazon_fba' ? 'Amazon' : item.source.charAt(0).toUpperCase() + item.source.slice(1)}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
                  {tc('cfo_receivables.due', { date: new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) })}
                  {item.daysOverdue > 0 && <span style={{ color: '#EF4444', fontWeight: 600 }}> · {tc('cfo_receivables.days_overdue', { n: item.daysOverdue })}</span>}
                  {item.notes && <span> · {item.notes}</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                {fmt(item.amount, sym)}
              </div>
              {!item.auto && (
                <button
                  onClick={() => removeItem(item.id)}
                  style={{ fontSize: 10, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px', lineHeight: 1 }}
                  title={tc('cfo_receivables.remove')}
                >×</button>
              )}
            </div>
          )
        })}
      </div>

      {/* Info banner */}
      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--b)', background: 'rgba(245,158,11,.03)', fontSize: 9, color: 'var(--tx3)', lineHeight: 1.5 }}>
        {region.receivablesInsight}
      </div>
    </div>
  )
}
