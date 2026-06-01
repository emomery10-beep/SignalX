'use client'
import { useState, useEffect, useCallback } from 'react'
import { getRegionConfig } from '@/lib/region-config'

interface Receivable {
  id: string
  type: 'receivable' | 'payable'
  counterparty: string
  amount: number
  dueDate: string
  daysOverdue: number
  status: 'current' | 'overdue_30' | 'overdue_60' | 'overdue_90'
  notes?: string
}

interface Props {
  currencySymbol: string
  countryCode?: string | null
  onAsk?: (prompt: string) => void
  onTotalsChange?: (receivables: number, payables: number) => void
}

function fmt(n: number, sym: string): string {
  if (Math.abs(n) >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000) return `${sym}${(n / 1_000).toFixed(0)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

const AGING_BUCKETS = [
  { key: 'current', label: 'Current', color: '#22C55E' },
  { key: 'overdue_30', label: '1-30 days', color: '#F59E0B' },
  { key: 'overdue_60', label: '31-60 days', color: '#F97316' },
  { key: 'overdue_90', label: '60+ days', color: '#EF4444' },
] as const

export default function ReceivablesTracker({ currencySymbol: sym, countryCode, onAsk, onTotalsChange }: Props) {
  const region = getRegionConfig(countryCode)
  const [view, setView] = useState<'receivables' | 'payables'>('receivables')
  const [items, setItems] = useState<Receivable[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState({ counterparty: '', amount: '', dueDate: '', notes: '' })

  const loadItems = useCallback(() => {
    fetch('/api/cfo/receivables')
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
        }))
        setItems(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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

  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: '#F97316' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Receivables & Payables</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {onAsk && overdueAmount > 0 && (
            <button
              onClick={() => onAsk(`I have ${fmt(overdueAmount, sym)} in overdue ${view}. Total outstanding: ${fmt(totalAmount, sym)}. What's the best strategy to collect overdue amounts in ${region.countryName} without damaging business relationships?`)}
              style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
            >
              Ask AI
            </button>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            style={{ fontSize: 10, color: '#6366F1', background: 'rgba(99,102,241,.08)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', padding: '10px 18px', gap: 4, borderBottom: '1px solid var(--b)' }}>
        {(['receivables', 'payables'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: view === v ? 600 : 400,
              border: view === v ? '1px solid #6366F1' : '1px solid var(--b)',
              background: view === v ? 'rgba(99,102,241,.08)' : 'transparent',
              color: view === v ? '#6366F1' : 'var(--tx3)',
              cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
            }}
          >
            {v === 'receivables' ? 'Who Owes You' : 'What You Owe'}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--b)' }}>
        <div style={{ padding: '10px 18px', background: 'var(--sf)', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Outstanding</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums' }}>{fmt(totalAmount, sym)}</div>
        </div>
        <div style={{ padding: '10px 18px', background: 'var(--sf)', textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--tx3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overdue</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: overdueAmount > 0 ? '#EF4444' : '#22C55E', fontVariantNumeric: 'tabular-nums' }}>{fmt(overdueAmount, sym)}</div>
        </div>
      </div>

      {/* Aging bar */}
      {totalAmount > 0 && (
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Aging</div>
          <div style={{ height: 20, borderRadius: 6, overflow: 'hidden', display: 'flex', background: 'var(--ev, #e5e5e5)' }}>
            {agingData.map(b => b.pct > 0 ? (
              <div key={b.key} style={{ width: `${b.pct}%`, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 300ms' }}>
                {b.pct > 12 && <span style={{ fontSize: 8, color: '#fff', fontWeight: 600 }}>{fmt(b.amount, sym)}</span>}
              </div>
            ) : null)}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 10, color: 'var(--tx3)' }}>
            {agingData.map(b => (
              <span key={b.key}><span style={{ color: b.color }}>●</span> {b.label}: {fmt(b.amount, sym)}</span>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--b)', background: 'rgba(99,102,241,.02)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', marginBottom: 8 }}>
            Add {view === 'receivables' ? 'Receivable' : 'Payable'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder={view === 'receivables' ? 'Customer name' : 'Supplier name'}
              value={newItem.counterparty}
              onChange={e => setNewItem(p => ({ ...p, counterparty: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }}
            />
            <input
              type="number"
              placeholder="Amount"
              value={newItem.amount}
              onChange={e => setNewItem(p => ({ ...p, amount: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }}
            />
            <input
              type="date"
              value={newItem.dueDate}
              onChange={e => setNewItem(p => ({ ...p, dueDate: e.target.value }))}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Notes (optional)"
              value={newItem.notes}
              onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))}
              style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', fontSize: 11, fontFamily: 'inherit', outline: 'none' }}
            />
            <button
              onClick={addItem}
              style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#6366F1', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Add
            </button>
            <button
              onClick={() => setShowAdd(false)}
              style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--tx3)', fontSize: 12 }}>
            No {view} tracked yet. Click "+ Add" to start tracking {view === 'receivables' ? 'who owes you' : 'what you owe'}.
          </div>
        )}
        {filtered.sort((a, b) => b.daysOverdue - a.daysOverdue).map(item => {
          const bucket = AGING_BUCKETS.find(b => b.key === item.status) || AGING_BUCKETS[0]
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderTop: '1px solid var(--b)', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: bucket.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--tx)' }}>{item.counterparty}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)' }}>
                  Due {new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  {item.daysOverdue > 0 && <span style={{ color: '#EF4444', fontWeight: 600 }}> · {item.daysOverdue}d overdue</span>}
                  {item.notes && <span> · {item.notes}</span>}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                {fmt(item.amount, sym)}
              </div>
              <button
                onClick={() => removeItem(item.id)}
                style={{ fontSize: 12, color: 'var(--tx3)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px', lineHeight: 1 }}
                title="Remove"
              >
                ×
              </button>
            </div>
          )
        })}
      </div>

      {/* Info banner */}
      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--b)', background: 'rgba(245,158,11,.03)', fontSize: 10, color: 'var(--tx3)', lineHeight: 1.5 }}>
        {region.receivablesInsight}
      </div>
    </div>
  )
}
