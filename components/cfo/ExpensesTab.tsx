'use client'
import { useState, useEffect, useCallback } from 'react'
import ReceiptScanner, { EXPENSE_CATEGORIES, type ScannedExpense } from './ReceiptScanner'
import { useLang } from '@/components/LanguageProvider'
import { getDateRange } from '@/lib/cfo-date-range'

// Maps backend category enum values → i18n key suffixes. Enum values stay as-is
// for the API; only DISPLAY labels are translated.
const CATEGORY_KEYS: Record<string, string> = {
  'Supplier / Stock Purchase': 'cat_supplier_stock',
  'Rent / Lease': 'cat_rent_lease',
  'Payroll': 'cat_payroll',
  'Utilities': 'cat_utilities',
  'Software / SaaS': 'cat_software_saas',
  'Marketing & Ads': 'cat_marketing_ads',
  'Supplies': 'cat_supplies',
  'Travel': 'cat_travel',
  'Meals & Entertainment': 'cat_meals_entertainment',
  'Shipping': 'cat_shipping',
  'Professional Services': 'cat_professional_services',
  'Equipment': 'cat_equipment',
  'Insurance': 'cat_insurance',
  'Taxes & Fees': 'cat_taxes_fees',
  'Other': 'cat_other',
}

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
  period?: string
}

type SortKey = 'date' | 'amount' | 'vendor' | 'category'

export default function ExpensesTab({ currencySymbol: sym, onAsk, period }: Props) {
  const { tc } = useLang()
  // Translate a backend category enum value to its display label.
  const catLabel = (c: string) => CATEGORY_KEYS[c] ? tc('cfo_expenses.' + CATEGORY_KEYS[c]) : c
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
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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
        const msg = errData?.error || tc('cfo_expenses.toast_save_failed', { status: res.status })
        showToast(`❌ ${msg}`)
        setSaving(false)
        return
      }
      await fetchExpenses()
      showToast(tc('cfo_expenses.toast_saved'))
      setShowScanner(false)
      setShowManual(false)
      setManualForm({ vendor: '', date: new Date().toISOString().split('T')[0], amount: 0, category: 'Other', notes: '' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : tc('cfo_expenses.toast_generic_save_failed')
      showToast(`❌ ${msg}`)
    }
    setSaving(false)
  }

  const deleteExpense = async (id: string) => {
    if (!confirm(tc('cfo_expenses.confirm_delete'))) return
    try {
      const res = await fetch(`/api/cfo/expenses?id=${id}`, { method: 'DELETE' })
      if (res.ok) { await fetchExpenses(); showToast(tc('cfo_expenses.toast_deleted')) }
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
        showToast(`❌ ${errData?.error || tc('cfo_expenses.toast_update_failed')}`)
        setSaving(false)
        return
      }
      await fetchExpenses()
      setEditingId(null)
      showToast(tc('cfo_expenses.toast_updated'))
    } catch {
      showToast(`❌ ${tc('cfo_expenses.toast_update_failed')}`)
    }
    setSaving(false)
  }

  // ── Filtering & sorting ──
  const now = new Date()
  const rangeMs: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 }

  // Resolve active date window: global period prop takes priority over internal dropdown
  const activeDateRange: { start: string; end: string } | null = (() => {
    if (period) {
      const r = getDateRange(period, now)
      return { start: r.start, end: r.end }
    }
    if (filterDateRange === 'all') return null
    const days = rangeMs[filterDateRange]
    const start = new Date(now.getTime() - days * 86400000).toISOString().split('T')[0]
    return { start, end: now.toISOString().split('T')[0] }
  })()

  const filtered = expenses.filter(e => {
    if (filterCategory !== 'All' && e.category !== filterCategory) return false
    if (activeDateRange) {
      if (e.date < activeDateRange.start || e.date > activeDateRange.end) return false
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

  const cellInput: React.CSSProperties = {
    width: '100%', fontSize: 12, color: 'var(--tx)', background: 'var(--sf)',
    border: '1px solid var(--b)', borderRadius: 6, padding: '5px 8px',
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <div style={{ width: 4, height: 20, borderRadius: 4, background: INDIGO, flexShrink: 0 }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)', whiteSpace: 'nowrap' }}>{tc('cfo_expenses.heading')}</span>
          {filtered.length > 0 && !isMobile && <span style={{ fontSize: 11, color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tc('cfo_expenses.items_summary', { n: filtered.length, total: fmt(grandTotal) })}</span>}
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => { setShowManual(false); setShowScanner(v => !v) }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: isMobile ? '8px 12px' : '7px 14px', borderRadius: 8, border: 'none', background: INDIGO, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            {tc('cfo_expenses.scan_receipt')}
          </button>
          <button
            onClick={() => { setShowScanner(false); setShowManual(v => !v) }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: isMobile ? '8px 12px' : '7px 14px', borderRadius: 8, border: `1px solid ${INDIGO}40`, background: 'transparent', color: INDIGO, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            {tc('cfo_expenses.manual')}
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

      {/* Manual entry form — rendered as a true full-screen/centered modal (fixed
          backdrop + opaque panel, above the floating quick-scan FAB's z-index:50)
          so it never shares scroll position with, or visually bleeds into, the
          "By Category" chart underneath it. Was previously an inline block sitting
          directly in normal document flow, which is what caused the overlap. */}
      {showManual && (
        <div
          onClick={() => setShowManual(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 999, backdropFilter: 'blur(2px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', padding: isMobile ? 0 : 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: isMobile ? '100%' : 440, maxHeight: isMobile ? '88vh' : '90vh', overflowY: 'auto', background: 'var(--bg)', border: `1px solid ${INDIGO}30`, borderRadius: isMobile ? '16px 16px 0 0' : 14, boxShadow: '0 12px 40px rgba(0,0,0,.3)', zIndex: 1000, padding: 16, boxSizing: 'border-box' }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 12 }}>{tc('cfo_expenses.add_manually_title')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_expenses.label_vendor')}</label>
                <input value={manualForm.vendor} onChange={e => setManualForm(p => ({ ...p, vendor: e.target.value }))} placeholder={tc('cfo_expenses.placeholder_vendor')} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_expenses.label_amount', { sym })}</label>
                <input type="number" min="0" step="0.01" value={manualForm.amount || ''} onChange={e => setManualForm(p => ({ ...p, amount: Number(e.target.value) }))} placeholder={tc('cfo_expenses.placeholder_amount')} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_expenses.label_date')}</label>
                <input type="date" value={manualForm.date} onChange={e => setManualForm(p => ({ ...p, date: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_expenses.label_category')}</label>
                <select value={manualForm.category} onChange={e => setManualForm(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 5 }}>{tc('cfo_expenses.label_notes')}</label>
              <input value={manualForm.notes} onChange={e => setManualForm(p => ({ ...p, notes: e.target.value }))} placeholder={tc('cfo_expenses.placeholder_notes')} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowManual(false)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{tc('cfo_expenses.cancel')}</button>
              <button
                onClick={() => saveExpense(manualForm)}
                disabled={!manualForm.vendor || !manualForm.amount || saving}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: INDIGO, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: (!manualForm.vendor || !manualForm.amount) ? 0.5 : 1 }}
              >
                {saving ? tc('cfo_expenses.saving') : tc('cfo_expenses.save_expense')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary bar by category */}
      {categoryTotals.length > 0 && (
        <div style={{ borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>{tc('cfo_expenses.by_category')}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: RED }}>{fmt(grandTotal)}</span>
          </div>
          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 10, gap: 1 }}>
            {categoryTotals.map((c, i) => {
              const pct = grandTotal > 0 ? (c.total / grandTotal) * 100 : 0
              const hues = [INDIGO, RED, YELLOW, GREEN, '#8B5CF6', '#F97316', '#06B6D4', '#EC4899']
              return <div key={i} style={{ width: `${pct}%`, background: hues[i % hues.length], minWidth: 2 }} title={`${catLabel(c.category)}: ${fmt(c.total)}`} />
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
                  <span>{catLabel(c.category)}</span>
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
              {' '}{tc('cfo_expenses.banner_prefix')} {thisMonthCount} {thisMonthCount !== 1 ? tc('cfo_expenses.banner_expense_many') : tc('cfo_expenses.banner_expense_one')} {tc('cfo_expenses.banner_suffix')}
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={tc('cfo_expenses.placeholder_search')}
          style={{ ...inputStyle, width: 'auto', flex: 1, minWidth: 140 }}
        />
        <select value={filterDateRange} onChange={e => setFilterDateRange(e.target.value as any)} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="7d">{tc('cfo_expenses.filter_7d')}</option>
          <option value="30d">{tc('cfo_expenses.filter_30d')}</option>
          <option value="90d">{tc('cfo_expenses.filter_90d')}</option>
          <option value="all">{tc('cfo_expenses.filter_all')}</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...inputStyle, width: 'auto', cursor: 'pointer' }}>
          <option value="All">{tc('cfo_expenses.filter_all_categories')}</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
        </select>
        {onAsk && filtered.length > 0 && (
          <button onClick={() => onAsk(tc('cfo_expenses.ask_ai_prompt', { total: fmt(grandTotal), count: filtered.length, top: categoryTotals.slice(0, 3).map(c => `${catLabel(c.category)} ${fmt(c.total)}`).join(', ') }))} style={{ padding: '7px 10px', borderRadius: 7, border: `1px solid ${INDIGO}30`, background: `${INDIGO}08`, color: INDIGO, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {tc('cfo_expenses.ask_ai')}
          </button>
        )}
      </div>

      {/* Setup needed state */}
      {setupNeeded && (
        <div style={{ borderRadius: 12, border: '1.5px solid #f59e0b40', background: '#f59e0b08', padding: '20px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', marginBottom: 6 }}>{tc('cfo_expenses.setup_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)', lineHeight: 1.6, marginBottom: 12 }}>
            {tc('cfo_expenses.setup_body_pre')} <code style={{ background: 'var(--ev)', padding: '1px 5px', borderRadius: 4 }}>cfo_expenses</code> {tc('cfo_expenses.setup_body_mid')} <code style={{ background: 'var(--ev)', padding: '1px 5px', borderRadius: 4 }}>20250605_cfo_expenses.sql</code> {tc('cfo_expenses.setup_body_post')}
          </div>
        </div>
      )}

      {/* Table */}
      {setupNeeded ? null : loading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--tx3)', fontSize: 12 }}>{tc('cfo_expenses.loading')}</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', borderRadius: 12, border: '1px dashed var(--b)', background: 'var(--ev)' }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🧾</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', marginBottom: 6 }}>{tc('cfo_expenses.empty_title')}</div>
          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('cfo_expenses.empty_body')}</div>
        </div>
      ) : (
        <div style={{ borderRadius: 12, border: '1px solid var(--b)', background: 'var(--sf)', overflow: 'hidden' }}>
          {isMobile ? (
            // ── Mobile: card list ─────────────────────────────────────────────
            <>
              {filtered.map((e, i) => {
                const isEditing = editingId === e.id
                return (
                  <div key={e.id} style={{ padding: '12px 14px', borderTop: i > 0 ? '1px solid var(--b)' : undefined, background: isEditing ? `${INDIGO}04` : undefined }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input type="date" value={editForm.date} onChange={ev => setEditForm(p => ({ ...p, date: ev.target.value }))} style={cellInput} />
                        <input value={editForm.vendor} onChange={ev => setEditForm(p => ({ ...p, vendor: ev.target.value }))} placeholder={tc('cfo_expenses.placeholder_vendor_short')} style={cellInput} />
                        <input value={editForm.notes} onChange={ev => setEditForm(p => ({ ...p, notes: ev.target.value }))} placeholder={tc('cfo_expenses.placeholder_notes_short')} style={{ ...cellInput, fontSize: 11 }} />
                        <select value={editForm.category} onChange={ev => setEditForm(p => ({ ...p, category: ev.target.value }))} style={{ ...cellInput, cursor: 'pointer' }}>
                          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
                        </select>
                        <input type="number" min="0" step="0.01" value={editForm.amount || ''} onChange={ev => setEditForm(p => ({ ...p, amount: Number(ev.target.value) }))} placeholder="0.00" style={{ ...cellInput, textAlign: 'right' }} />
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={cancelEdit} style={{ flex: 1, padding: '9px', borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 }}>{tc('cfo_expenses.cancel')}</button>
                          <button onClick={saveEdit} disabled={saving || !editForm.vendor} style={{ flex: 2, padding: '9px', borderRadius: 7, border: 'none', background: INDIGO, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, opacity: (!editForm.vendor || saving) ? 0.5 : 1 }}>✓ {saving ? tc('cfo_expenses.saving') : tc('cfo_expenses.save_expense')}</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 5 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.vendor}</div>
                            {e.notes && <div style={{ fontSize: 11, color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{e.notes}</div>}
                          </div>
                          <span style={{ fontSize: 15, fontWeight: 800, color: RED, flexShrink: 0 }}>{fmt(e.amount)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10, color: 'var(--tx3)', padding: '2px 7px', borderRadius: 5, background: 'var(--ev)', whiteSpace: 'nowrap' }}>{catLabel(e.category)}</span>
                            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{e.date}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => startEdit(e)} title={tc('cfo_expenses.title_edit')} style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
                            <button onClick={() => deleteExpense(e.id)} title={tc('cfo_expenses.title_delete')} style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
              {/* Mobile footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderTop: '2px solid var(--b)', background: 'var(--ev)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)' }}>{tc('cfo_expenses.footer_count', { n: filtered.length })}</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: RED }}>{fmt(grandTotal)}</span>
              </div>
            </>
          ) : (
            // ── Desktop: grid table ───────────────────────────────────────────
            <>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 90px 56px', gap: 4, padding: '8px 14px', background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
                {[
                  { key: 'date' as SortKey, label: tc('cfo_expenses.col_date') },
                  { key: 'vendor' as SortKey, label: tc('cfo_expenses.col_vendor') },
                  { key: 'category' as SortKey, label: tc('cfo_expenses.col_category') },
                  { key: 'amount' as SortKey, label: tc('cfo_expenses.col_amount'), right: true },
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
                return (
                  <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 90px 56px', gap: 4, padding: isEditing ? '10px 14px 12px' : '10px 14px', borderTop: i > 0 ? '1px solid var(--b)' : undefined, alignItems: isEditing ? 'start' : 'center', background: isEditing ? `${INDIGO}04` : undefined }}>
                    {isEditing ? (
                      <>
                        <input type="date" value={editForm.date} onChange={ev => setEditForm(p => ({ ...p, date: ev.target.value }))} style={cellInput} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <input value={editForm.vendor} onChange={ev => setEditForm(p => ({ ...p, vendor: ev.target.value }))} placeholder={tc('cfo_expenses.placeholder_vendor_short')} style={cellInput} />
                          <input value={editForm.notes} onChange={ev => setEditForm(p => ({ ...p, notes: ev.target.value }))} placeholder={tc('cfo_expenses.placeholder_notes_short')} style={{ ...cellInput, fontSize: 11 }} />
                        </div>
                        <select value={editForm.category} onChange={ev => setEditForm(p => ({ ...p, category: ev.target.value }))} style={{ ...cellInput, cursor: 'pointer' }}>
                          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{catLabel(c)}</option>)}
                        </select>
                        <input type="number" min="0" step="0.01" value={editForm.amount || ''} onChange={ev => setEditForm(p => ({ ...p, amount: Number(ev.target.value) }))} placeholder={tc('cfo_expenses.placeholder_amount')} style={{ ...cellInput, textAlign: 'right' }} />
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={saveEdit} disabled={saving || !editForm.vendor} title={tc('cfo_expenses.title_save')} style={{ flex: 1, height: 28, borderRadius: 6, border: 'none', background: INDIGO, color: '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!editForm.vendor || saving) ? 0.5 : 1 }}>✓</button>
                          <button onClick={cancelEdit} title={tc('cfo_expenses.title_cancel')} style={{ flex: 1, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{e.date}</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.vendor}</div>
                          {e.notes && <div style={{ fontSize: 10, color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.notes}</div>}
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--tx3)', padding: '2px 6px', borderRadius: 5, background: 'var(--ev)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{catLabel(e.category)}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: RED, textAlign: 'right' }}>{fmt(e.amount)}</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => startEdit(e)} title={tc('cfo_expenses.title_edit')} style={{ flex: 1, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
                          <button onClick={() => deleteExpense(e.id)} title={tc('cfo_expenses.title_delete')} style={{ flex: 1, height: 28, borderRadius: 6, border: '1px solid var(--b)', background: 'transparent', color: 'var(--tx3)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}

              {/* Footer total */}
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 90px 56px', gap: 4, padding: '10px 14px', borderTop: '2px solid var(--b)', background: 'var(--ev)' }}>
                <div />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx3)' }}>{tc('cfo_expenses.footer_count', { n: filtered.length })}</span>
                <div />
                <span style={{ fontSize: 14, fontWeight: 700, color: RED, textAlign: 'right' }}>{fmt(grandTotal)}</span>
                <div />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
