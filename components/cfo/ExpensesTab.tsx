'use client'
import { useState, useEffect, useCallback } from 'react'
import ReceiptScanner, { EXPENSE_CATEGORIES, type ScannedExpense } from './ReceiptScanner'

const INDIGO = '#6366F1'
const GREEN = '#22C55E'
const RED = '#EF4444'
const YELLOW = '#F59E0B'

interface Expense {
  id: string
  vendor: string
  date: string
  amount: number
  category: string
  notes: string
  receipt_url?: string | null
  created_at: string
}

interface Props {
  currencySymbol: string
  onAsk?: (prompt: string) => void
}

type SortKey = 'date' | 'amount' | 'vendor' | 'category'

export default function ExpensesTab({ currencySymbol: sym, onAsk }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showScanner, setShowScanner] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterDateRange, setFilterDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<1 | -1>(-1)
  const [toast, setToast] = useState<string | null>(null)

  const [manualForm, setManualForm] = useState<Omit<ScannedExpense, 'confidence'>>({
    vendor: '', date: new Date().toISOString().split('T')[0], amount: 0, category: 'Other', notes: '',
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Omit<ScannedExpense, 'confidence'>>({ vendor: '', date: '', amount: 0, category: 'Other', notes: '' })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fmt = (n: number) => {
    const abs = Math.abs(n)
    if (abs >= 1_000_000) return `${sym}${(abs / 1_000_000).toFixed(1)}M`
    if (abs >= 1_000) return `${sym}${(abs / 1_000).toFixed(1)}K`
    return `${sym}${Math.round(abs).toLocaleString()}`
  }

  const [setupNeeded, setSetupNeeded] = useState(false)

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cfo/expenses')
      if (res.ok) {
        const data = await res.json()
        if (data.note === 'Table not yet created') {
          setSetupNeeded(true)
        } else {
          setSetupNeeded(false)
          setExpenses(data.expenses || [])
        }
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchExpenses() }, [fetchExpenses])

  const saveExpense = async (expense: Omit<ScannedExpense, 'confidence'>) => {
    setSaving(true)
    try {
      const res = await fetch('/api/cfo/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        const msg = errData?.error || `Save failed (${res.status})`
        showToast(`❌ ${msg}`)
        setSaving(false)
        return
      }
      await fetchExpenses()
      showToast('✓ Expense saved')
      setShowScanner(false)
      setShowManual(false)
      setManualForm({ vendor: '', date: new Date().toISOString().split('T')[0], amount: 0, category: 'Other', notes: '' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save expense'
      showToast(`❌ ${msg}`)
    }
    setSaving(false)
  }

  const deleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    try {
      const res = await fetch(`/api/cfo/expenses?id=${id}`, { method: 'DELETE' })
      if (res.ok) { await fetchExpenses(); showToast('Expense deleted') }
    } catch {}
  }

  const startEdit = (e: Expense) => {
    setEditingId(e.id)
    setEditForm({ vendor: e.vendor, date: e.date, amount: e.amount, category: e.category, notes: e.notes || '' })
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = async () => {
    if (!editingId) return
    setSaving(true)
    try {
      const res = await fetch('/api/cfo/expenses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...editForm }),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        showToast(`❌ ${errData?.error || 'Update failed'}`)
        setSaving(false)
        return
      }
      await fetchExpenses()
      setEditingId(null)
      showToast('✓ Expense updated')
    } catch {
      showToast('❌ Failed to update')
    }
    setSaving(false)
  }

  // ── Filtering & sorting ──
  const now = new Date()
  const rangeMs: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

  const filtered = expenses.filter(e => {
    if (filterCategory !== 'All' && e.category !== filterCategory) return false
    if (filterDateRange !== 'all') {
      const days = rangeMs[filterDateRange]
      const expDate = new Date(e.date)
      const diff = (now.getTime() - expDate.getTime()) / (1000 * 60 * 60 * 24)
      if (diff > days) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!e.vendor.toLowerCase().includes(q) && !e.category.toLowerCase().includes(q) && !(e.notes || '').toLowerCase().includes(q)) return false
    }
    return true
  }).sort((a, b) => {
    let va: any = a[sortKey], vb: any = b[sortKey]
    if (sortKey === 'amount') { va = Number(va); vb = Number(vb) }
    if (typeof va === 'string') return va.localeCompare(vb) * sortDir
    return (va - vb) * sortDir
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 1 ? -1 : 1)
    else { setSortKey(key); setSortDir(-1) }
  }

  // ── Category totals ──
  const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
    category: cat,
    total: filtered.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  const grandTotal = filtered.reduce((s, e) => s + e.amount, 0)

  // ── This-month contribution (used in P&L banner) ──
  const thisMonthPrefix = now.toISOString().slice(0, 7) // YYYY-MM
  const thisMonthExpenses = expenses.filter(e => (e.date || '').startsWith(thisMonthPrefix))
  const thisMonthTotal = thisMonthExpenses.reduce((s, e) => s + e.amount, 0)
  const thisMonthCount = thisMonthExpenses.length

  const inputStyle: React.CSSProperties = {
    width: '100%', fontSize: 12, color: 'var(--tx)', background: 'var(--ev)',
    border: '1px solid var(--b)', borderRadius: 7, padding: '7px 10px',
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? <span style={{ fontSize: 9, marginLeft: 2 }}>{sortDir === -1 ? '▼' : '▲'}</span> : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 12, fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,.3)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 20, borderRadius: 4, background: INDIGO }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>Expenses</span>
          {filtered.length > 0 && <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{filtered.length} items · {fmt(grandTotal)}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setShowManual(false); setShowScanner(v => !v) }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: 'none', background: INDIGO, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            📷 Scan Receipt
          </button>
          <button
            onClick={() => { setShowScanner(false); setShowManual(v => !v) }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: `1px solid ${INDIGO}40`, background: 'transparent', color: INDIGO, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            + Manual
          </button>
        </div>
      </div>

      {/* Scanner */}
      {showScanner && (
        <ReceiptScanner
          currencySymbol={sym}
          onConfirm={e => saveExpense(e)}
          onCancel={() => setShowScanner(false)}
        />
      )}

      {/* Manual entry form */}
      {showManual && (
        <div style={{ borderRadius: 12, border: `1px solid ${INDIGO}30`, background: `${INDIGO}04`, padding: '16px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 12 }}>Add Expense Manually</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Vendor *</label>
              <input value={manualForm.vendor} onChange={e => setManualForm(p => ({ ...p, vendor: e.target.value }))} placeholder="e.g. Safaricom" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Amount ({sym}) *</label>
              <input type="number" min="0" step="0.01" value={manualForm.amount || ''} onChange={e => setManualForm(p => ({ ...p, amount: Number(e.target.value) }))} placeholder="0.00" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Date *</label>
              <input type="date" value={manualForm.date} onChange={e => setManualForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Category</label>
              <select value={manualForm.category} onChange={e => setManualForm(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>Notes (optional)</label>
            <input value={manualForm.notes} onChange={e => setManualForm(p => ({ ...p, notes: e.target.value }))} placeholder="Description or reference" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowManual(false)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button
              onClick={() => saveExpense(manualForm)}
              disabled={!manualForm.vendor || !manualForm.amount || saving}
              style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: INDIGO, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: (!manualForm.vendor || !manualForm.amount) ? 0.5 : 1 }}
            >
              {saving ? 'Saving…' : 'Save Expense'}
            </button>
          </div>
        </div>
      )}

      {/* Summary bar by category */}
      {categoryTotals.length > 0 && (
        <div style={{ borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>By Category</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: RED }}>{fmt(grandTotal)}</span>
          </div>
          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 10, gap: 1 }}>
            {categoryTotals.map((c, i) => {
              const pct = grandTotal > 0 ? (c.total / grandTotal) * 100 : 0
              const hues = [INDIGO, RED, YELLOW, GREEN, '#8B5CF6', '#F97316', '#06B6D4', '#EC4899']
              return <div key={i} style={{ width: `${pct}%`, background: hues[i % hues.length], minWidth: 2 }} title={`${c.category}: ${fmt(c.total)}`} />
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {categoryTotals.map((c, i) => {
              const hues = [INDIGO, RED, YELLOW, GREEN, '#8B5CF6', '#F97316', '#06B6D4', '#EC4899']
              return (
                <button
                  key={i}
                  onClick={() => setFilterCategory(filterCategory === c.category ? 'All' : c.category)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, padding: '3px 8px', borderRadius: 6, border: `1px solid ${hues[i % hues.length]}30`, background: filterCategory === c.category ? `${hues[i % hues.length]}20` : 'transparent', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--tx)' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: hues[i % hues.length], flexShrink: 0 }} />
                  <span>{c.category}</span>
                  <span style={{ color: 'var(--tx3)' }}>{fmt(c.total)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* P&L contribution banner */}
      {!setupNeeded && thisMonthTotal > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: `1px solid ${INDIGO}25`, background: `${INDIGO}06` }}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>📊</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: INDIGO }}>
              {fmt(thisMonthTotal)}
            </span>
            <span style={{ fontSize: 12, color: 'var(--tx3)' }}>
              {' '}from {thisMonthCount} expense{thisMonthCount !== 1 ? 's' : ''} contributing to this month&apos;s Operating Expenses in the P&amp;L
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search vendor, category…"
          style={{ ...inputStyle, width: 'auto', flex: 1, minWidth: 140 }}
        />
        <select value={filterDateRange} onChange={e => setFilterDateRange(e.target.value as any)} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="All">All categories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {onAsk && filtered.length > 0 && (
          <button onClick={() => onAsk(`Analyze my expenses: total ${fmt(grandTotal)} across ${filtered.length} items. Top categories: ${categoryTotals.slice(0, 3).map(c => `${c.category} ${fmt(c.total)}`).join(', ')}. How can I reduce costs?`)} style={{ padding: '7px 10px', borderRadius: 7, border: `1px solid ${INDIGO}30`, background: `${INDIGO}08`, color: INDIGO, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Ask AI
          </button>
        )}
      </div>

      {/* Setup needed state */}
      {setupNeeded && (
        <div style={{ borderRadius: 12, border: '1.5px solid #f59e0b40', background: '#f59e0b08', padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 6 }}>⚙️ Database setup required</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.6, marginBottom: 12 }}>
            The <code style={{ background: 'var(--ev)', padding: '1px 5px', borderRadius: 4 }}>cfo_expenses</code> table hasn't been created yet. Run the migration <code style={{ background: 'var(--ev)', padding: '1px 5px', borderRadius: 4 }}>20250605_cfo_expenses.sql</code> in your Supabase SQL editor, then reload.
          </div>
        </div>
      )}

      {/* Table */}
      {setupNeeded ? null : loading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--tx3)', fontSize: 12 }}>Loading expenses…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 12, border: '1px dashed var(--b)', background: 'var(--ev)' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🧾</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>No expenses yet</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>Scan a receipt or add an expense manually to get started</div>
        </div>
      ) : (
        <div style={{ borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px 90px 60px', gap: 4, padding: '8px 14px', background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
            {[
              { key: 'date' as SortKey, label: 'Date' },
              { key: 'vendor' as SortKey, label: 'Vendor / Category' },
              { key: 'category' as SortKey, label: 'Category' },
              { key: 'amount' as SortKey, label: 'Amount', right: true },
            ].map(h => (
              <button key={h.key} onClick={() => toggleSort(h.key)} style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.04em', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', justifyContent: h.right ? 'flex-end' : 'flex-start', padding: 0 }}>
                {h.label}<SortIcon k={h.key} />
              </button>
            ))}
            <div />
          </div>

          {/* Rows */}
          {filtered.map((e, i) => {
            const isEditing = editingId === e.id
            const rowStyle: React.CSSProperties = {
              display: 'grid',
              gridTemplateColumns: '100px 1fr 100px 90px 60px',
              gap: 4,
              padding: isEditing ? '10px 14px 12px' : '10px 14px',
              borderTop: i > 0 ? '1px solid var(--b)' : undefined,
              alignItems: isEditing ? 'start' : 'center',
              background: isEditing ? `${INDIGO}04` : undefined,
            }
            const cellInput: React.CSSProperties = {
              width: '100%', fontSize: 12, color: 'var(--tx)', background: 'var(--sf)',
              border: '1px solid var(--b)', borderRadius: 6, padding: '5px 8px',
              fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
            }
            return (
              <div key={e.id} style={rowStyle}>
                {isEditing ? (
                  <>
                    <input type="date" value={editForm.date} onChange={ev => setEditForm(p => ({ ...p, date: ev.target.value }))} style={cellInput} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <input value={editForm.vendor} onChange={ev => setEditForm(p => ({ ...p, vendor: ev.target.value }))} placeholder="Vendor" style={cellInput} />
                      <input value={editForm.notes} onChange={ev => setEditForm(p => ({ ...p, notes: ev.target.value }))} placeholder="Notes (optional)" style={{ ...cellInput, fontSize: 11 }} />
                    </div>
                    <select value={editForm.category} onChange={ev => setEditForm(p => ({ ...p, category: ev.target.value }))} style={{ ...cellInput, cursor: 'pointer' }}>
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" min="0" step="0.01" value={editForm.amount || ''} onChange={ev => setEditForm(p => ({ ...p, amount: Number(ev.target.value) }))} placeholder="0.00" style={{ ...cellInput, textAlign: 'right' }} />
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={saveEdit} disabled={saving || !editForm.vendor} title="Save" style={{ flex: 1, height: 28, borderRadius: 6, border: 'none', background: INDIGO, color: '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!editForm.vendor || saving) ? 0.5 : 1 }}>✓</button>
                      <button onClick={cancelEdit} title="Cancel" style={{ flex: 1, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                    </div>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{e.date}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.vendor}</div>
                      {e.notes && <div style={{ fontSize: 10, color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.notes}</div>}
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--tx3)', padding: '2px 6px', borderRadius: 5, background: 'var(--ev)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.category}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: RED, textAlign: 'right' }}>{fmt(e.amount)}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => startEdit(e)} title="Edit" style={{ flex: 1, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
                      <button onClick={() => deleteExpense(e.id)} title="Delete" style={{ flex: 1, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  </>
                )}
              </div>
            )
          })}

          {/* Footer total */}
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px 90px 60px', gap: 4, padding: '10px 14px', borderTop: '2px solid var(--b)', background: 'var(--ev)' }}>
            <div />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)' }}>{filtered.length} expenses</span>
            <div />
            <span style={{ fontSize: 14, fontWeight: 700, color: RED, textAlign: 'right' }}>{fmt(grandTotal)}</span>
            <div />
          </div>
        </div>
      )}
    </div>
  )
}
