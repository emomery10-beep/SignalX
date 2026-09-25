'use client'
import { useState, useEffect, useMemo, useCallback, Fragment } from 'react'
import { useLang } from '@/components/LanguageProvider'
import { formatMoney } from '@/lib/pos-format'

// ── Color constants ──────────────────────────────────────────
const GREEN = '#16a34a'
const RED = '#dc2626'
const AMBER = '#ca8a04'
const ACC = '#f59e0b' // factory accent (amber/yellow)
const ACC_BG = 'rgba(245,158,11,.08)'
const ACC_BORDER = 'rgba(245,158,11,.25)'

// ── Types ────────────────────────────────────────────────────
type CaptureType = 'intake' | 'intake_arrival' | 'intake_feed' | 'output' | 'wastage' | 'dispatch' | 'packaging'
type CaptureStatus = 'pending' | 'approved' | 'rejected'
type SubTab = 'overview' | 'production' | 'quality' | 'inventory' | 'dispatch' | 'costing'
type SortDir = 'asc' | 'desc'

interface FactoryCapture {
  id: string
  type: CaptureType
  product: string
  quantity: number
  unit: string
  notes?: string | null
  photos?: string[] | null
  status: CaptureStatus
  approved_by?: string | null
  operator?: string | null
  staff_id?: string | null
  cost_per_unit?: number | null
  sale_price?: number | null
  /** Approver-set price for a dispatch, per unit. Null for a pending/rejected
   * dispatch, or for any capture viewed by a role without capture.approve
   * (redacted server-side — see route.ts). */
  dispatch_price?: number | null
  destination?: string | null
  created_at: string
}

interface InventoryItem {
  id?: string
  name: string
  category?: string // 'raw' | 'finished' | other
  quantity?: number
  stock?: number
  stock_qty?: number // the real `inventory` table's actual column name
  unit?: string
  cost?: number
  cost_price?: number
  price?: number
  selling_price?: number
  sale_price?: number // the real `inventory` table's actual column name
  reorder_point?: number
  reorder_level?: number
}

interface StaffMember {
  id: string
  name: string
  role?: string
}

interface FactoryTabProps {
  currencySymbol: string
  selectedLocation: string
  transactions: any[]
  staff: any[]
  inventory: any[]
  /** Preview/dev only: inject captures to bypass the authed fetch. */
  previewCaptures?: any[]
}

// ── Helpers ──────────────────────────────────────────────────
function fmt(symbol: string, amount: number): string {
  return formatMoney(symbol, amount)
}

function fmtInt(n: number): string {
  return (isFinite(n) ? Math.round(n) : 0).toLocaleString()
}

function pct(n: number): string {
  return `${(isFinite(n) ? n : 0).toFixed(1)}%`
}

function dayKey(date: string | Date): string {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function shortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function fullDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function weekKey(date: string | Date): string {
  const d = new Date(date)
  const onejan = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

// Nairobi (UTC+3, no DST) calendar day, not the viewer's browser timezone —
// same convention as productionDays below and pos-askbiz's copy of this
// dashboard (app/factory/page.tsx), so "today"/"yesterday" mean the same
// thing regardless of where this page is opened from.
function nairobiDayKey(d: Date): string {
  const n = new Date(d.getTime() + 3 * 3600 * 1000)
  return `${n.getUTCFullYear()}-${String(n.getUTCMonth() + 1).padStart(2, '0')}-${String(n.getUTCDate()).padStart(2, '0')}`
}
function shiftDayKey(key: string, deltaDays: number): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + deltaDays)
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`
}
function formatDayKey(key: string): string {
  // timeZone must be pinned explicitly — toLocaleDateString otherwise
  // renders in the VIEWER's local zone, which can flip the displayed date
  // by a day (e.g. a US-Pacific viewer would see "23 Sep" for a key whose
  // Nairobi midnight instant falls in the afternoon of the 23rd their time).
  return new Date(`${key}T00:00:00+03:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Nairobi' })
}
// Day-of-week of a Nairobi calendar-day key — built from its Y/M/D
// components directly (not by re-parsing with a +03:00 offset), since that
// offset would shift the instant back onto the PREVIOUS UTC calendar day and
// silently return the wrong weekday.
function isSundayDayKey(key: string): boolean {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() === 0
}

// Capture product names are free text (dropdown + typed "other"), so the
// same product shows up as "Sesame seed" and "sesame seed" — different
// grouping keys for what's really one product. Collapse case/whitespace
// only — a genuinely distinct bad entry (confirmed 3x "Sesame seeds" from
// one staff member, always the same real product) was corrected at the
// source in the DB instead of merged here by guesswork, since merging
// display-side risks silently blending two actually-different products in
// a case this normalizer can't tell apart. isLikelyRealProduct filters the
// obvious junk (single-character entries, e.g. a stray "S") out of the
// costing tables below.
function norm(product: string): string {
  return product.trim().toLowerCase().replace(/\s+/g, ' ')
}
function isLikelyRealProduct(label: string): boolean {
  return label.trim().length >= 3
}

// Established elsewhere in this codebase (app/factory/production/page.tsx's
// yield-summary: "1 kg oil ≈ 1.09 litres") — reused here so a litres-
// denominated output capture converts onto the same kg basis as the
// majority (kg) captures instead of being summed as if litres and kg were
// interchangeable units.
const OIL_KG_PER_LITRE = 1 / 1.09
// Converts an output capture's quantity onto a kg basis. Returns null for a
// unit that can't be safely converted — confirmed live: 2 historical
// captures logged as "pcs"/"200g" whose own notes ("Sesame seed 20l
// mtungi", "By 20l") say they were really counting 20L jerrycans, not
// literal grams or generic pieces of bulk oil — so a quantity of "9" or
// "20" there doesn't mean what it would for a real pcs/weight unit. Callers
// exclude these from weight-based totals rather than guess at the intended
// jerrycan count.
function outputQtyInKg(c: FactoryCapture): number | null {
  const qty = Number(c.quantity) || 0
  const unit = (c.unit || '').trim().toLowerCase()
  if (unit === '' || unit === 'kg' || unit === 'kgs') return qty
  if (unit === 'litres' || unit === 'liters' || unit === 'litre' || unit === 'liter' || unit === 'l') return qty * OIL_KG_PER_LITRE
  return null
}

// The real `inventory` table (this factory's actual stock — everything
// dispatch-synced from approved captures, see [[sesame-factory-analytics-fix-status]])
// uses stock_qty/sale_price, not quantity/stock/selling_price/price. Those
// were the only names checked here, so every real row silently read as 0 —
// only the locally-computed synthetic items below (which set both name
// styles themselves) ever displayed correctly. cost_price was already
// covered, which is why cost read fine once qty did.
function getQty(item: InventoryItem): number {
  return Number(item.quantity ?? item.stock ?? item.stock_qty ?? 0) || 0
}
function getCost(item: InventoryItem): number {
  return Number(item.cost ?? item.cost_price ?? 0) || 0
}
function getSell(item: InventoryItem): number {
  return Number(item.selling_price ?? item.price ?? item.sale_price ?? 0) || 0
}
function getReorder(item: InventoryItem): number {
  return Number(item.reorder_point ?? item.reorder_level ?? 0) || 0
}
// `category` is NULL on every real inventory row today (confirmed live) —
// only the synthetic factory-computed items below ever set it. Name-based
// fallback so Raw/Finished still classify real rows instead of every one
// of them silently falling through to '—' and never reaching either KPI.
function isRaw(item: InventoryItem): boolean {
  const cat = (item.category || '').toLowerCase()
  if (cat) return cat.includes('raw')
  const n = (item.name || '').toLowerCase()
  return n.includes('seed') && !n.includes('oil') && !n.includes('waste')
}
function isFinished(item: InventoryItem): boolean {
  const cat = (item.category || '').toLowerCase()
  if (cat) return cat.includes('finish')
  const n = (item.name || '').toLowerCase()
  return (n.includes('oil') || n.includes('jerrycan') || n.includes('mtungi')) && !n.includes('waste')
}

// categorize a free-text note into a coarse waste reason
function wasteReason(note?: string | null): string {
  const n = (note || '').toLowerCase()
  if (!n) return 'Uncategorised'
  if (/(broke|crack|damag|defect|fault)/.test(n)) return 'Damage / Defect'
  if (/(expir|spoil|stale|rot|mould|mold)/.test(n)) return 'Expiry / Spoilage'
  if (/(spill|drop|leak)/.test(n)) return 'Spillage'
  if (/(setup|calibrat|test|trial|sample)/.test(n)) return 'Setup / Testing'
  if (/(over|excess|surplus)/.test(n)) return 'Overproduction'
  if (/(contaminat|dirty|foreign)/.test(n)) return 'Contamination'
  return 'Other'
}

// ── Status / type badges ─────────────────────────────────────
const STATUS_STYLE: Record<CaptureStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'rgba(202,138,4,.12)', text: AMBER, label: 'Pending' },
  approved: { bg: 'rgba(22,163,74,.12)', text: GREEN, label: 'Approved' },
  rejected: { bg: 'rgba(220,38,38,.12)', text: RED, label: 'Rejected' },
}
const TYPE_STYLE: Record<CaptureType, { bg: string; text: string; label: string }> = {
  intake: { bg: 'rgba(59,130,246,.12)', text: '#3b82f6', label: 'Intake' },
  intake_arrival: { bg: 'rgba(59,130,246,.12)', text: '#3b82f6', label: 'Intake Arrival' },
  intake_feed: { bg: 'rgba(6,182,212,.12)', text: '#06b6d4', label: 'Intake Feed' },
  output: { bg: 'rgba(245,158,11,.12)', text: ACC, label: 'Output' },
  wastage: { bg: 'rgba(220,38,38,.12)', text: RED, label: 'Wastage' },
  dispatch: { bg: 'rgba(168,85,247,.12)', text: '#a855f7', label: 'Dispatch' },
  packaging: { bg: 'rgba(14,165,233,.12)', text: '#0ea5e9', label: 'Packaging' },
}

function StatusBadge({ status }: { status: CaptureStatus }) {
  const { tc } = useLang()
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending
  const label = tc('pos_factory.status' + (status === 'pending' ? 'Pending' : status === 'approved' ? 'Approved' : 'Rejected'))
  return (
    <span style={{ fontSize: 9, fontWeight: 700, color: s.text, background: s.bg, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}
const TYPE_LABEL_KEY: Record<string, string> = {
  intake: 'Intake',
  intake_arrival: 'IntakeArrival',
  intake_feed: 'IntakeFeed',
  output: 'Output',
  wastage: 'Wastage',
  dispatch: 'Dispatch',
  packaging: 'Packaging',
}

function TypeBadge({ type }: { type: CaptureType }) {
  const { tc } = useLang()
  const s = TYPE_STYLE[type] || TYPE_STYLE.intake
  const labelKey = TYPE_LABEL_KEY[type] || (type.charAt(0).toUpperCase() + type.slice(1))
  const label = tc('pos_factory.type' + labelKey)
  return (
    <span style={{ fontSize: 9, fontWeight: 700, color: s.text, background: s.bg, padding: '3px 10px', borderRadius: 9999, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

// ── KPI card ─────────────────────────────────────────────────
// Small visual for a KpiCard breakdown popover. 'stack' draws one bar split
// into proportional segments (a composition — e.g. what a total is made
// of). 'compare' draws one full-width bar per item, each sized relative to
// the largest (a comparison — e.g. formula estimate vs. manually set).
function MiniBars({ items, mode }: { items: { label: string; raw: number; color: string }[]; mode: 'stack' | 'compare' }) {
  const positive = items.filter(it => it.raw > 0)
  if (positive.length < 2) return null
  if (mode === 'stack') {
    const total = positive.reduce((s, it) => s + it.raw, 0)
    if (total <= 0) return null
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', width: '100%', height: 8, borderRadius: 4, overflow: 'hidden', background: 'var(--b)' }}>
          {positive.map((it, i) => (
            <div key={i} title={`${it.label}`} style={{ width: `${(it.raw / total) * 100}%`, background: it.color }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {positive.map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 8, color: 'var(--tx3)' }}>
              <span style={{ width: 6, height: 6, borderRadius: 2, background: it.color, display: 'inline-block' }} />
              {it.label}
            </div>
          ))}
        </div>
      </div>
    )
  }
  const max = Math.max(...positive.map(it => it.raw))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
      {positive.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 8, color: 'var(--tx3)', width: 74, flexShrink: 0 }}>{it.label}</div>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--b)', overflow: 'hidden' }}>
            <div style={{ width: `${(it.raw / max) * 100}%`, height: '100%', background: it.color, borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function KpiCard({ label, value, sub, accent, onClick, active, breakdown, breakdownNote, chart, chartMode, headerRight }: {
  label: string; value: string; sub?: string; accent?: string; onClick?: () => void; active?: boolean
  breakdown?: { label: string; value: string; strong?: boolean }[]; breakdownNote?: string
  chart?: { label: string; raw: number; color: string }[]; chartMode?: 'stack' | 'compare'
  /** Extra control rendered on its own row under the label (e.g. a day
   * switcher) — kept off the label row so it has room to breathe on a
   * narrow grid tile, and repeated in the dialog header below so it stays
   * usable while the breakdown is open. */
  headerRight?: React.ReactNode
}) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  // This card is rendered on both the owner's desktop dashboard and the
  // staff mobile PWA. A bottom sheet (narrow box, dimmed gutters either
  // side) is the right mobile affordance but reads as "floating, not
  // centered" on a wide desktop window — same 768px breakpoint the parent
  // page (app/(app)/pos/page.tsx) already uses for its own isMobile check.
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Escape-to-close and background scroll lock while the sheet is open —
  // standard modal behavior this component didn't have yet.
  useEffect(() => {
    if (!showBreakdown) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowBreakdown(false) }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow }
  }, [showBreakdown])

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', padding: 16, borderRadius: 12, background: 'var(--sf)',
        border: active ? `1.5px solid ${accent || ACC}` : '1px solid var(--b)',
        cursor: onClick ? 'pointer' : 'default', transition: 'border-color .15s',
        boxShadow: active ? `0 0 0 3px ${ACC_BG}` : 'none',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = accent || ACC }}
      onMouseLeave={e => { if (onClick && !active) e.currentTarget.style.borderColor = 'var(--b)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: headerRight ? 2 : 6 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--tx3)' }}>{label}</div>
        {breakdown && breakdown.length > 0 && (
          // 44x44 hit area (touch-target minimum) around a compact 24px
          // visual circle — negative margins keep the card header's layout
          // unchanged while the tappable region is still full-size.
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setShowBreakdown(true) }}
            title="Show how this is calculated"
            aria-label="Show how this is calculated"
            style={{
              width: 44, height: 44, margin: '-10px -10px -10px 0', flexShrink: 0,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{
              width: 24, height: 24, borderRadius: '50%', border: '1px solid var(--b)',
              background: 'var(--bg)', color: 'var(--tx3)', fontSize: 10, fontWeight: 700, lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              i
            </span>
          </button>
        )}
      </div>
      {headerRight && <div style={{ marginBottom: 6 }}>{headerRight}</div>}
      <div style={{ fontSize: 22, fontWeight: 800, color: accent || 'var(--tx)', fontFamily: 'var(--font-sora)' }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 4 }}>{sub}</div>}
      {showBreakdown && breakdown && breakdown.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${label} breakdown`}
          onClick={e => { e.stopPropagation(); setShowBreakdown(false) }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex',
            alignItems: isDesktop ? 'center' : 'flex-end', justifyContent: 'center', zIndex: 1000,
            animation: 'kpiSheetFadeIn 200ms ease-out',
          }}
        >
          <style>{`
            @keyframes kpiSheetFadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes kpiSheetSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            @keyframes kpiDialogIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
            @media (prefers-reduced-motion: reduce) {
              .kpi-breakdown-sheet, .kpi-breakdown-sheet * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
            }
          `}</style>
          <div
            className="kpi-breakdown-sheet"
            onClick={e => e.stopPropagation()}
            style={isDesktop ? {
              background: 'var(--bg)', borderRadius: 16,
              width: '90%', maxWidth: 440, maxHeight: '85vh', overflowY: 'auto', padding: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,.25)',
              animation: 'kpiDialogIn 200ms cubic-bezier(.16,1,.3,1)',
            } : {
              background: 'var(--bg)', borderTopLeftRadius: 16, borderTopRightRadius: 16,
              width: '100%', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto', padding: 24,
              boxShadow: '0 -8px 30px rgba(0,0,0,.25)',
              animation: 'kpiSheetSlideUp 220ms cubic-bezier(.16,1,.3,1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{label}</div>
              <button
                type="button"
                onClick={() => setShowBreakdown(false)}
                aria-label="Close"
                style={{ width: 44, height: 44, margin: '-10px -10px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', fontSize: 22, lineHeight: 1, color: 'var(--tx3)', cursor: 'pointer', flexShrink: 0 }}
              >
                ×
              </button>
            </div>
            {headerRight && <div style={{ marginBottom: 10 }}>{headerRight}</div>}
            <div style={{ fontSize: 24, fontWeight: 800, color: accent || 'var(--tx)', fontFamily: 'var(--font-sora)', marginBottom: 14 }}>{value}</div>
            {chart && chart.length > 0 && <MiniBars items={chart} mode={chartMode || 'stack'} />}
            {breakdown.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 12,
                  color: line.strong ? 'var(--tx)' : 'var(--tx2)', fontWeight: line.strong ? 700 : 400,
                  padding: '8px 0', borderTop: '1px solid var(--b)',
                }}
              >
                <span>{line.label}</span>
                <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{line.value}</span>
              </div>
            ))}
            {breakdownNote && (
              <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 10, fontStyle: 'italic' }}>{breakdownNote}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Inline day-nav control (‹ Today/Yesterday/date › ) ────────
// Used to scope a single KpiCard to one calendar day instead of the
// dashboard's usual all-time total — see its `headerRight` prop above.
// 44x44 hit areas around a compact visual button, same convention as the
// KpiCard info button, so both meet mobile touch-target size on this same
// card without widening the row.
function DaySwitcher({ label, onPrev, onNext, nextDisabled, loading }: {
  label: string; onPrev: () => void; onNext: () => void; nextDisabled?: boolean; loading?: boolean
}) {
  const navBtn = (disabled: boolean): React.CSSProperties => ({
    width: 44, height: 44, margin: '-12px', flexShrink: 0,
    background: 'none', border: 'none', padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: disabled ? 'default' : 'pointer',
  })
  const glyph: React.CSSProperties = {
    width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--b)',
    background: 'var(--bg)', color: 'var(--tx2)', fontSize: 11, lineHeight: 1, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20 }} onClick={e => e.stopPropagation()}>
      <button type="button" onClick={onPrev} disabled={loading} aria-label="Previous day" style={navBtn(!!loading)}>
        <span style={glyph}>‹</span>
      </button>
      <span style={{ fontSize: 10, fontWeight: 700, color: ACC, minWidth: 52, textAlign: 'center' }}>{loading ? '…' : label}</span>
      <button type="button" onClick={onNext} disabled={nextDisabled || loading} aria-label="Next day" style={navBtn(!!(nextDisabled || loading))}>
        <span style={{ ...glyph, opacity: (nextDisabled || loading) ? 0.35 : 1 }}>›</span>
      </button>
    </div>
  )
}

// ── Section heading ──────────────────────────────────────────
function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'var(--sf)', border: '1px solid var(--b)', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  )
}

// ── Empty / loading ──────────────────────────────────────────
function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--tx3)' }}>
      <div style={{ fontSize: 38, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>{title}</div>
      {hint && <div style={{ fontSize: 11, marginTop: 8, maxWidth: 320, margin: '8px auto 0' }}>{hint}</div>}
    </div>
  )
}

// ── SVG: combined output bars + wastage overlay line ─────────
function OutputBarChart({ days, currencySymbol }: { days: { key: string; output: number; wastage: number }[]; currencySymbol: string }) {
  const { tc } = useLang()
  const W = 760, H = 220, padL = 36, padR = 16, padT = 16, padB = 28
  const innerW = W - padL - padR, innerH = H - padT - padB
  const maxOut = Math.max(1, ...days.map(d => d.output))
  const maxWaste = Math.max(1, ...days.map(d => d.wastage))
  const bw = innerW / Math.max(1, days.length)
  const linePts = days.map((d, i) => {
    const x = padL + i * bw + bw / 2
    const y = padT + innerH - (d.wastage / maxWaste) * innerH
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ minWidth: 600 }}>
        {[0, 0.25, 0.5, 0.75, 1].map((g, i) => {
          const y = padT + innerH - g * innerH
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--b)" strokeWidth={1} />
              <text x={4} y={y + 3} fontSize={9} fill="var(--tx3)">{fmtInt(maxOut * g)}</text>
            </g>
          )
        })}
        {days.map((d, i) => {
          const h = (d.output / maxOut) * innerH
          const x = padL + i * bw + bw * 0.18
          const y = padT + innerH - h
          return (
            <g key={d.key}>
              <rect x={x} y={y} width={bw * 0.64} height={Math.max(0, h)} fill={ACC} opacity={0.85} rx={2} />
              {i % 5 === 0 && <text x={padL + i * bw + bw / 2} y={H - 8} fontSize={9} fill="var(--tx3)" textAnchor="middle">{shortDate(d.key)}</text>}
            </g>
          )
        })}
        {days.length > 1 && <polyline points={linePts} fill="none" stroke={RED} strokeWidth={1.8} />}
        {days.map((d, i) => {
          const x = padL + i * bw + bw / 2
          const y = padT + innerH - (d.wastage / maxWaste) * innerH
          return <circle key={`c${d.key}`} cx={x} cy={y} r={2.2} fill={RED} />
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, fontSize: 9, color: 'var(--tx3)', marginTop: 4 }}>
        <span><span style={{ display: 'inline-block', width: 10, height: 10, background: ACC, borderRadius: 2, marginRight: 4 }} />{tc('pos_factory.unitsProduced')}</span>
        <span><span style={{ display: 'inline-block', width: 10, height: 2, background: RED, marginRight: 4, verticalAlign: 'middle' }} />{tc('pos_factory.wastageUnits')}</span>
      </div>
    </div>
  )
}

// ── SVG: horizontal bars (waste by product etc.) ─────────────
function HBarChart({ data, color, currencySymbol, valueIsMoney }: {
  data: { label: string; value: number }[]; color: string; currencySymbol: string; valueIsMoney?: boolean
}) {
  const { tc } = useLang()
  const max = Math.max(1, ...data.map(d => d.value))
  if (data.length === 0) return <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noData')}</div>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(d => (
        <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 130, fontSize: 10, color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
          <div style={{ flex: 1, height: 18, background: 'var(--ev)', borderRadius: 4, position: 'relative' }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: '100%', background: color, borderRadius: 4, minWidth: 2 }} />
          </div>
          <div style={{ width: 80, textAlign: 'right', fontSize: 10, fontWeight: 600 }}>
            {valueIsMoney ? fmt(currencySymbol, d.value) : fmtInt(d.value)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── SVG: line chart (trends) ─────────────────────────────────
function LineChart({ points, color, yLabel, formatY }: {
  points: { label: string; value: number }[]; color: string; yLabel?: string; formatY?: (n: number) => string
}) {
  const { tc } = useLang()
  const W = 760, H = 200, padL = 40, padR = 16, padT = 16, padB = 28
  const innerW = W - padL - padR, innerH = H - padT - padB
  const max = Math.max(1, ...points.map(p => p.value))
  if (points.length === 0) return <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noData')}</div>
  const step = innerW / Math.max(1, points.length - 1)
  const poly = points.map((p, i) => {
    const x = padL + i * step
    const y = padT + innerH - (p.value / max) * innerH
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const fmtY = formatY || ((n: number) => fmtInt(n))
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ minWidth: 600 }}>
        {[0, 0.5, 1].map((g, i) => {
          const y = padT + innerH - g * innerH
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="var(--b)" strokeWidth={1} />
              <text x={4} y={y + 3} fontSize={9} fill="var(--tx3)">{fmtY(max * g)}</text>
            </g>
          )
        })}
        <polyline points={poly} fill="none" stroke={color} strokeWidth={2} />
        {points.map((p, i) => {
          const x = padL + i * step
          const y = padT + innerH - (p.value / max) * innerH
          return (
            <g key={p.label}>
              <circle cx={x} cy={y} r={2.6} fill={color} />
              {(i % Math.max(1, Math.ceil(points.length / 8)) === 0) && (
                <text x={x} y={H - 8} fontSize={9} fill="var(--tx3)" textAnchor="middle">{p.label}</text>
              )}
            </g>
          )
        })}
      </svg>
      {yLabel && <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{yLabel}</div>}
    </div>
  )
}

// ── SVG: pie chart (cost breakdown) ──────────────────────────
function PieChart({ slices, currencySymbol }: { slices: { label: string; value: number; color: string }[]; currencySymbol: string }) {
  const { tc } = useLang()
  const total = slices.reduce((s, x) => s + x.value, 0)
  if (total <= 0) return <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noCostData')}</div>
  const R = 80, C = 100
  let acc = 0
  const arcs = slices.map(s => {
    const frac = s.value / total
    const start = acc * 2 * Math.PI
    acc += frac
    const end = acc * 2 * Math.PI
    const x1 = C + R * Math.sin(start), y1 = C - R * Math.cos(start)
    const x2 = C + R * Math.sin(end), y2 = C - R * Math.cos(end)
    const large = end - start > Math.PI ? 1 : 0
    return { d: `M${C},${C} L${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`, ...s, frac }
  })
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 200 200" width={180} height={180}>
        {arcs.map(a => <path key={a.label} d={a.d} fill={a.color} stroke="var(--sf)" strokeWidth={1} />)}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {arcs.map(a => (
          <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
            <span style={{ width: 12, height: 12, background: a.color, borderRadius: 3, display: 'inline-block' }} />
            <span style={{ color: 'var(--tx2)', minWidth: 120 }}>{a.label}</span>
            <span style={{ fontWeight: 700 }}>{fmt(currencySymbol, a.value)}</span>
            <span style={{ color: 'var(--tx3)' }}>({pct(a.frac * 100)})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Sortable header cell ─────────────────────────────────────
function Th({ label, col, sortCol, sortDir, onSort, align }: {
  label: string; col?: string; sortCol?: string; sortDir?: SortDir; onSort?: (c: string) => void; align?: 'left' | 'right' | 'center'
}) {
  const sortable = !!col && !!onSort
  return (
    <th
      onClick={() => sortable && onSort!(col!)}
      style={{
        textAlign: align || 'left', padding: '8px 10px', fontSize: 9, fontWeight: 700, color: 'var(--tx3)',
        textTransform: 'uppercase', borderBottom: '1px solid var(--b)', cursor: sortable ? 'pointer' : 'default',
        whiteSpace: 'nowrap', userSelect: 'none',
      }}
    >
      {label}{sortable && sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
    </th>
  )
}

const tdStyle: React.CSSProperties = { padding: '8px 10px', fontSize: 11, borderBottom: '1px solid var(--b)', verticalAlign: 'top' }

// ═════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════
export default function FactoryTab({ currencySymbol, selectedLocation, transactions, staff, inventory, previewCaptures }: FactoryTabProps) {
  const { tc } = useLang()
  const [subTab, setSubTab] = useState<SubTab>('overview')
  const [captures, setCaptures] = useState<FactoryCapture[]>([])
  const [loading, setLoading] = useState(true)

  // ── Fetch factory captures ─────────────────────────────────
  const fetchCaptures = useCallback(async () => {
    // Preview/dev: use injected captures and skip the authed fetch.
    if (previewCaptures) {
      setCaptures(previewCaptures as FactoryCapture[])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedLocation && selectedLocation !== 'all') params.set('location_id', selectedLocation)
      params.set('limit', '2000')
      const res = await fetch(`/api/pos/factory/capture?${params}`)
      const data = await res.json()
      let list: FactoryCapture[] = Array.isArray(data) ? data : (data.captures || data.data || [])
      // Map API response fields (product_name) to component interface (product)
      list = Array.isArray(list) ? list.map(c => ({ ...c, product: c.product || (c as any).product_name })) : []
      setCaptures(list)
    } catch (err) {
      console.error('Failed to fetch factory captures:', err)
      setCaptures([])
    } finally {
      setLoading(false)
    }
  }, [selectedLocation, previewCaptures])

  useEffect(() => { fetchCaptures() }, [fetchCaptures])

  // ── Normalise props ────────────────────────────────────────
  const inv: InventoryItem[] = useMemo(() => Array.isArray(inventory) ? inventory : [], [inventory])
  const staffList: StaffMember[] = useMemo(() => Array.isArray(staff) ? staff : [], [staff])
  const txns: any[] = useMemo(() => Array.isArray(transactions) ? transactions : [], [transactions])

  const staffName = useCallback((id?: string | null) => {
    if (!id) return null
    return staffList.find(s => s.id === id)?.name || null
  }, [staffList])

  // ── Derived: typed capture groups ──────────────────────────
  const outputs = useMemo(() => captures.filter(c => c.type === 'output'), [captures])
  // Include all intake types: intake, intake_arrival, intake_feed
  const intakes = useMemo(() => captures.filter(c => c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed'), [captures])
  // Material actually CONSUMED into production — excludes intake_arrival
  // (which is stock received, not yet used) to avoid double-counting cost
  const intakesConsumed = useMemo(() => captures.filter(c => c.type === 'intake' || c.type === 'intake_feed'), [captures])
  const packaging = useMemo(() => captures.filter(c => (c.type as any) === 'packaging'), [captures])
  const wastages = useMemo(() => captures.filter(c => c.type === 'wastage'), [captures])
  const dispatches = useMemo(() => captures.filter(c => c.type === 'dispatch'), [captures])

  // ── Core KPIs ──────────────────────────────────────────────
  const todayKey = dayKey(new Date())
  const unitsToday = useMemo(() => outputs.filter(c => dayKey(c.created_at) === todayKey).reduce((s, c) => s + (Number(c.quantity) || 0), 0), [outputs, todayKey])
  const totalOutput = useMemo(() => outputs.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [outputs])
  const totalIntake = useMemo(() => intakes.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [intakes])
  const totalWaste = useMemo(() => wastages.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [wastages])
  const wastagePct = totalOutput + totalWaste > 0 ? (totalWaste / (totalOutput + totalWaste)) * 100 : 0
  const pendingCount = useMemo(() => captures.filter(c => c.status === 'pending').length, [captures])
  const efficiency = totalIntake > 0 ? (totalOutput / totalIntake) * 100 : 0
  // Dispatch is this factory's actual point of sale (goods leave as an
  // approved, priced dispatch — there's no separate POS checkout for them),
  // so its value belongs in revenue alongside pos_transactions. dispatch_price
  // is set by the approver (see app/factory/approvals in pos-askbiz); only
  // approved dispatches have one.
  const dispatchRevenue = useMemo(() => dispatches
    .filter(d => d.status === 'approved')
    .reduce((s, d) => s + (Number(d.quantity) || 0) * (Number(d.dispatch_price) || 0), 0), [dispatches])
  const salesRevenue = useMemo(() => txns.reduce((s, t) => s + (Number(t.total ?? t.amount ?? 0) || 0), 0) + dispatchRevenue, [txns, dispatchRevenue])

  // ── Daily series (last 30 days) ────────────────────────────
  const dailySeries = useMemo(() => {
    const out: { key: string; output: number; wastage: number }[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const k = dayKey(d)
      out.push({ key: k, output: 0, wastage: 0 })
    }
    const idx = new Map(out.map((o, i) => [o.key, i]))
    for (const c of outputs) { const i = idx.get(dayKey(c.created_at)); if (i != null) out[i].output += Number(c.quantity) || 0 }
    for (const c of wastages) { const i = idx.get(dayKey(c.created_at)); if (i != null) out[i].wastage += Number(c.quantity) || 0 }
    return out
  }, [outputs, wastages])

  // ── Status breakdown ───────────────────────────────────────
  const statusBreakdown = useMemo(() => {
    const b: Record<CaptureStatus, number> = { pending: 0, approved: 0, rejected: 0 }
    for (const c of captures) b[c.status] = (b[c.status] || 0) + 1
    return b
  }, [captures])

  // ── KPI focus filter (clicking a KPI filters production view) ─
  const [kpiFocus, setKpiFocus] = useState<string | null>(null)
  const focusKpi = (key: string, tab?: SubTab) => {
    setKpiFocus(prev => prev === key ? null : key)
    if (tab) setSubTab(tab)
  }

  // ── Inventory cost lookup by product name ──────────────────
  const costByProduct = useMemo(() => {
    const m = new Map<string, number>()
    for (const it of inv) {
      const c = getCost(it)
      if (c > 0) m.set((it.name || '').toLowerCase(), c)
    }
    return m
  }, [inv])

  // ── Average purchase price per product from intake_price_per_kg
  // annotations (set on intake_arrival captures). Lets downstream
  // intake_feed captures of the same product — which never carry
  // their own price — inherit the purchase cost.
  const paramCostByProduct = useMemo(() => {
    const sums = new Map<string, { total: number; count: number }>()
    for (const c of captures) {
      const anyC = c as any
      if (anyC.param_label === 'intake_price_per_kg' && anyC.param_value != null && Number(anyC.param_value) > 0) {
        const key = (c.product || '').toLowerCase()
        const e = sums.get(key) || { total: 0, count: 0 }
        e.total += Number(anyC.param_value)
        e.count += 1
        sums.set(key, e)
      }
    }
    const m = new Map<string, number>()
    sums.forEach((v, k) => m.set(k, v.total / v.count))
    return m
  }, [captures])
  const sellByProduct = useMemo(() => {
    const m = new Map<string, number>()
    for (const it of inv) {
      const c = getSell(it)
      if (c > 0) m.set((it.name || '').toLowerCase(), c)
    }
    return m
  }, [inv])
  const costForCapture = useCallback((c: FactoryCapture): number => {
    if (c.cost_per_unit != null && Number(c.cost_per_unit) > 0) return Number(c.cost_per_unit)
    // Intake captures may carry their purchase price as a param annotation
    // (param_label: 'intake_price_per_kg') rather than cost_per_unit
    const anyC = c as any
    if (anyC.param_label === 'intake_price_per_kg' && anyC.param_value != null && Number(anyC.param_value) > 0) {
      return Number(anyC.param_value)
    }
    const productKey = (c.product || '').toLowerCase()
    return paramCostByProduct.get(productKey) || costByProduct.get(productKey) || 0
  }, [costByProduct, paramCostByProduct])

  // ═══════════════════ SUB-TAB BAR ════════════════════════════
  const subTabs: { id: SubTab; label: string }[] = [
    { id: 'overview', label: tc('pos_factory.tabOverview') },
    { id: 'production', label: tc('pos_factory.tabProduction') },
    { id: 'quality', label: tc('pos_factory.tabQuality') },
    { id: 'inventory', label: tc('pos_factory.tabInventory') },
    { id: 'dispatch', label: tc('pos_factory.tabDispatch') },
    { id: 'costing', label: tc('pos_factory.tabCosting') },
  ]

  // ═══════════════════ RENDER ════════════════════════════════
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-sora)', fontSize: 16, fontWeight: 700, flex: 1 }}>
          <span style={{ marginRight: 8 }}>🏭</span>{tc('pos_factory.factoryAnalytics')}
        </div>
        <button onClick={fetchCaptures} style={{ padding: '8px 16px', borderRadius: 10, background: 'transparent', color: 'var(--tx)', fontSize: 11, fontWeight: 600, border: `1px solid ${ACC_BORDER}`, cursor: 'pointer', fontFamily: 'inherit' }}>
          {tc('pos_factory.refresh')}
        </button>
      </div>

      {/* Sub-tab navigation */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', borderBottom: '1px solid var(--b)', paddingBottom: 12 }}>
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            padding: '7px 16px', borderRadius: 9999,
            border: subTab === t.id ? `1.5px solid ${ACC}` : '1px solid var(--b)',
            background: subTab === t.id ? ACC_BG : 'var(--sf)',
            color: subTab === t.id ? ACC : 'var(--tx2)',
            fontSize: 11, fontWeight: subTab === t.id ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ fontSize: 11, color: 'var(--tx3)', padding: 20 }}>{tc('pos_factory.loadingFactoryData')}</div>
      ) : (
        <>
          {subTab === 'overview' && (
            <OverviewView
              currencySymbol={currencySymbol}
              unitsToday={unitsToday} wastagePct={wastagePct} dispatchCount={dispatches.length}
              pendingCount={pendingCount} efficiency={efficiency} salesRevenue={salesRevenue}
              dailySeries={dailySeries} totalOutput={totalOutput} statusBreakdown={statusBreakdown}
              kpiFocus={kpiFocus} focusKpi={focusKpi}
              captures={captures}
            />
          )}
          {subTab === 'production' && (
            <ProductionView captures={captures} staffName={staffName} currencySymbol={currencySymbol} />
          )}
          {subTab === 'quality' && (
            <QualityView captures={captures} wastages={wastages} costForCapture={costForCapture} totalWaste={totalWaste} currencySymbol={currencySymbol} staffName={staffName} />
          )}
          {subTab === 'inventory' && (
            <InventoryView inv={inv} intakes={intakes} currencySymbol={currencySymbol} outputs={outputs} dispatches={dispatches} />
          )}
          {subTab === 'dispatch' && (
            <DispatchView dispatches={dispatches} staffName={staffName} currencySymbol={currencySymbol} />
          )}
          {subTab === 'costing' && (
            <CostingView
              intakes={intakesConsumed} outputs={outputs} wastages={wastages} packaging={packaging} dispatches={dispatches}
              costForCapture={costForCapture} sellByProduct={sellByProduct}
              totalOutput={totalOutput} currencySymbol={currencySymbol}
              selectedLocation={selectedLocation} previewCaptures={previewCaptures}
            />
          )}
        </>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// OVERVIEW SUB-TAB
// ═════════════════════════════════════════════════════════════
function OverviewView(props: {
  currencySymbol: string
  unitsToday: number; wastagePct: number; dispatchCount: number; pendingCount: number; efficiency: number; salesRevenue: number
  dailySeries: { key: string; output: number; wastage: number }[]
  totalOutput: number
  statusBreakdown: Record<CaptureStatus, number>
  kpiFocus: string | null; focusKpi: (k: string, t?: SubTab) => void
  captures: FactoryCapture[]
}) {
  const { tc } = useLang()
  const { currencySymbol, unitsToday, wastagePct, dispatchCount, pendingCount, efficiency, salesRevenue, dailySeries, statusBreakdown, kpiFocus, focusKpi, captures } = props
  const totalStatus = statusBreakdown.pending + statusBreakdown.approved + statusBreakdown.rejected
  const periodOutput = dailySeries.reduce((s, d) => s + d.output, 0)
  const periodDispatch = props.captures.filter(c => c.type === 'dispatch').reduce((s, c) => s + (Number(c.quantity) || 0), 0)

  return (
    <div>
      {/* 6 KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.unitsTodayLabel')} value={fmtInt(unitsToday)} sub={tc('pos_factory.fromOutputCaptures')} accent={ACC} onClick={() => focusKpi('output', 'production')} active={kpiFocus === 'output'} />
        <KpiCard label={tc('pos_factory.wastagePctLabel')} value={pct(wastagePct)} sub={tc('pos_factory.ofTotalOutput')} accent={wastagePct > 5 ? RED : GREEN} onClick={() => focusKpi('wastage', 'quality')} active={kpiFocus === 'wastage'} />
        <KpiCard label={tc('pos_factory.dispatchCountLabel')} value={fmtInt(dispatchCount)} sub={tc('pos_factory.shipmentsLogged')} accent="#a855f7" onClick={() => focusKpi('dispatch', 'dispatch')} active={kpiFocus === 'dispatch'} />
        <KpiCard label={tc('pos_factory.pendingApprovalsLabel')} value={fmtInt(pendingCount)} sub={tc('pos_factory.awaitingSignOff')} accent={pendingCount > 0 ? AMBER : GREEN} onClick={() => focusKpi('pending', 'production')} active={kpiFocus === 'pending'} />
        <KpiCard label={tc('pos_factory.productionEfficiencyLabel')} value={pct(efficiency)} sub={tc('pos_factory.outputDivIntake')} accent={efficiency >= 80 ? GREEN : AMBER} onClick={() => focusKpi('efficiency', 'costing')} active={kpiFocus === 'efficiency'} />
        <KpiCard label={tc('pos_factory.revenueFromSalesLabel')} value={fmt(currencySymbol, salesRevenue)} sub={tc('pos_factory.allTransactions')} accent={GREEN} />
      </div>

      {/* Daily output + wastage chart */}
      <Section title={tc('pos_factory.dailyOutputTitle')} right={<span style={{ fontSize: 10, color: 'var(--tx3)' }}>{fmtInt(periodOutput)} units total</span>}>
        {periodOutput === 0 ? (
          <EmptyState icon="📊" title={tc('pos_factory.noProductionTitle')} hint={tc('pos_factory.noProductionHint')} />
        ) : (
          <OutputBarChart days={dailySeries} currencySymbol={currencySymbol} />
        )}
      </Section>

      {/* Production vs Dispatch */}
      <Section title={tc('pos_factory.productionVsDispatch')}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <HBarChart
              data={[{ label: tc('pos_factory.produced'), value: periodOutput }, { label: tc('pos_factory.dispatched'), value: periodDispatch }]}
              color={ACC} currencySymbol={currencySymbol}
            />
          </div>
          <div style={{ minWidth: 200 }}>
            {periodOutput >= periodDispatch ? (
              <div style={{ fontSize: 11, color: 'var(--tx2)' }}>
                {tc('pos_factory.producingMore', { n: fmtInt(periodOutput - periodDispatch) })}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: 'var(--tx2)' }}>
                {tc('pos_factory.shippingMore', { n: fmtInt(periodDispatch - periodOutput) })}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Work status breakdown */}
      <Section title={tc('pos_factory.workStatusBreakdown')}>
        {totalStatus === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noCapturesRecorded')}</div>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {(['approved', 'pending', 'rejected'] as CaptureStatus[]).map(s => (
              <div key={s} style={{ flex: 1, minWidth: 140, padding: 14, borderRadius: 10, background: 'var(--ev)', border: '1px solid var(--b)' }}>
                <div style={{ marginBottom: 6 }}><StatusBadge status={s} /></div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-sora)' }}>{statusBreakdown[s]}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)' }}>{pct((statusBreakdown[s] / totalStatus) * 100)} {tc('pos_factory.ofAll')}</div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// PRODUCTION SUB-TAB
// ═════════════════════════════════════════════════════════════
function ProductionView({ captures, staffName, currencySymbol }: {
  captures: FactoryCapture[]; staffName: (id?: string | null) => string | null; currencySymbol: string
}) {
  const { tc } = useLang()
  const [typeFilter, setTypeFilter] = useState<'all' | 'intake' | 'output'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | CaptureStatus>('all')
  const [productFilter, setProductFilter] = useState('')
  const [operatorFilter, setOperatorFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sortCol, setSortCol] = useState('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expanded, setExpanded] = useState<string | null>(null)

  const onSort = (c: string) => {
    if (sortCol === c) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(c); setSortDir('asc') }
  }

  // production = intake (all types) + output
  const base = useMemo(() => captures.filter(c => c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed' || c.type === 'output'), [captures])

  const operators = useMemo(() => {
    const set = new Set<string>()
    for (const c of base) {
      const name = c.operator || staffName(c.staff_id)
      if (name) set.add(name)
    }
    return Array.from(set).sort()
  }, [base, staffName])

  const filtered = useMemo(() => {
    let rows = base
    if (typeFilter !== 'all') rows = rows.filter(c => c.type === typeFilter)
    if (statusFilter !== 'all') rows = rows.filter(c => c.status === statusFilter)
    if (productFilter) rows = rows.filter(c => c.product === productFilter)
    if (operatorFilter !== 'all') rows = rows.filter(c => (c.operator || staffName(c.staff_id)) === operatorFilter)
    if (search) rows = rows.filter(c => (c.product || '').toLowerCase().includes(search.toLowerCase()))
    if (fromDate) rows = rows.filter(c => new Date(c.created_at) >= new Date(fromDate))
    if (toDate) rows = rows.filter(c => new Date(c.created_at) <= new Date(toDate + 'T23:59:59'))
    const sorted = [...rows].sort((a, b) => {
      let av: any, bv: any
      switch (sortCol) {
        case 'product': av = a.product || ''; bv = b.product || ''; break
        case 'type': av = a.type; bv = b.type; break
        case 'quantity': av = Number(a.quantity) || 0; bv = Number(b.quantity) || 0; break
        case 'status': av = a.status; bv = b.status; break
        default: av = new Date(a.created_at).getTime(); bv = new Date(b.created_at).getTime()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [base, typeFilter, statusFilter, productFilter, operatorFilter, search, fromDate, toDate, sortCol, sortDir, staffName])

  const products = useMemo(() => Array.from(new Set(base.map(c => c.product).filter(Boolean))).sort(), [base])

  // Yield per product (output / intake) - include all intake types
  const yields = useMemo(() => {
    const m = new Map<string, { intake: number; output: number }>()
    for (const c of base) {
      const k = c.product || 'Unknown'
      const e = m.get(k) || { intake: 0, output: 0 }
      if (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') e.intake += Number(c.quantity) || 0
      if (c.type === 'output') e.output += Number(c.quantity) || 0
      m.set(k, e)
    }
    return Array.from(m.entries())
      .map(([product, v]) => ({ product, ...v, yield: v.intake > 0 ? (v.output / v.intake) * 100 : 0 }))
      .filter(y => y.intake > 0 || y.output > 0)
      .sort((a, b) => b.yield - a.yield)
  }, [base])

  // Batch tracking: group by date+product - include all intake types
  const batches = useMemo(() => {
    const m = new Map<string, { date: string; product: string; intake: number; output: number; count: number }>()
    for (const c of base) {
      const dk = dayKey(c.created_at)
      const k = `${dk}|${c.product}`
      const e = m.get(k) || { date: dk, product: c.product || 'Unknown', intake: 0, output: 0, count: 0 }
      if (c.type === 'intake' || c.type === 'intake_arrival' || c.type === 'intake_feed') e.intake += Number(c.quantity) || 0
      if (c.type === 'output') e.output += Number(c.quantity) || 0
      e.count += 1
      m.set(k, e)
    }
    return Array.from(m.values()).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
  }, [base])

  const filterBtn = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px', borderRadius: 8, border: active ? `1.5px solid ${ACC}` : '1px solid var(--b)',
    background: active ? ACC_BG : 'var(--sf)', color: active ? ACC : 'var(--tx3)',
    fontSize: 10, fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
  })
  const inputStyle: React.CSSProperties = { padding: '7px 10px', borderRadius: 8, border: '1px solid var(--b)', background: 'var(--sf)', color: 'var(--tx)', fontSize: 11, fontFamily: 'inherit' }

  return (
    <div>
      {/* Filters */}
      <Section title={tc('pos_factory.productionLog')}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['all', 'intake', 'output'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} style={filterBtn(typeFilter === t)}>
              {t === 'all' ? tc('pos_factory.allTypes') : tc('pos_factory.type' + (t === 'intake' ? 'Intake' : 'Output'))}
            </button>
          ))}
          <span style={{ width: 1, background: 'var(--b)', margin: '0 4px' }} />
          {(['all', 'approved', 'pending', 'rejected'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={filterBtn(statusFilter === s)}>
              {s === 'all' ? tc('pos_factory.allStatus') : tc('pos_factory.status' + (s === 'pending' ? 'Pending' : s === 'approved' ? 'Approved' : 'Rejected'))}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tc('pos_factory.searchProductPlaceholder')} style={{ ...inputStyle, flex: 1, minWidth: 160 }} />
          <select value={productFilter} onChange={e => setProductFilter(e.target.value)} style={inputStyle}>
            <option value="">{tc('pos_factory.allProducts')}</option>
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={operatorFilter} onChange={e => setOperatorFilter(e.target.value)} style={inputStyle}>
            <option value="all">{tc('pos_factory.allOperators')}</option>
            {operators.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={inputStyle} />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={inputStyle} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon="🛠️" title={tc('pos_factory.noProductionRecords')} hint={tc('pos_factory.noProductionRecordsHint')} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr>
                  <Th label={tc('pos_factory.colDate')} col="created_at" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                  <Th label={tc('pos_factory.colType')} col="type" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                  <Th label={tc('pos_factory.colProduct')} col="product" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                  <Th label={tc('pos_factory.colQty')} col="quantity" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                  <Th label={tc('pos_factory.colUnit')} />
                  <Th label={tc('pos_factory.colOperator')} />
                  <Th label={tc('pos_factory.colStatus')} col="status" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                  <Th label={tc('pos_factory.colNotes')} />
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const op = c.operator || staffName(c.staff_id) || '—'
                  const isOpen = expanded === c.id
                  return (
                    <Fragment key={c.id}>
                      <tr onClick={() => setExpanded(isOpen ? null : c.id)} style={{ cursor: 'pointer' }}>
                        <td style={tdStyle}>{shortDate(c.created_at)}</td>
                        <td style={tdStyle}><TypeBadge type={c.type} /></td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{c.product || '—'}</td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{fmtInt(Number(c.quantity) || 0)}</td>
                        <td style={tdStyle}>{c.unit || '—'}</td>
                        <td style={tdStyle}>{op}</td>
                        <td style={tdStyle}><StatusBadge status={c.status} /></td>
                        <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--tx3)' }}>{c.notes || '—'}</td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={8} style={{ padding: 14, background: 'var(--ev)', borderBottom: '1px solid var(--b)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', marginBottom: 4 }}>{tc('pos_factory.detailsLabel')}</div>
                                <div style={{ fontSize: 11 }}>{tc('pos_factory.capturedLabel')} {fullDateTime(c.created_at)}</div>
                                <div style={{ fontSize: 11 }}>{tc('pos_factory.typeLabel')} {tc('pos_factory.type' + (c.type === 'intake' ? 'Intake' : c.type === 'output' ? 'Output' : c.type === 'wastage' ? 'Wastage' : 'Dispatch'))} · {tc('pos_factory.statusLabel')} {tc('pos_factory.status' + (c.status === 'pending' ? 'Pending' : c.status === 'approved' ? 'Approved' : 'Rejected'))}</div>
                                <div style={{ fontSize: 11 }}>{tc('pos_factory.quantityLabel')} {fmtInt(Number(c.quantity) || 0)} {c.unit || ''}</div>
                                {c.notes && <div style={{ fontSize: 11, marginTop: 6, color: 'var(--tx2)' }}>{c.notes}</div>}
                              </div>
                              <div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--tx3)', marginBottom: 4 }}>{tc('pos_factory.approvalLabel')}</div>
                                <div style={{ fontSize: 11 }}>{c.approved_by ? tc('pos_factory.approvedBy', { name: staffName(c.approved_by) || c.approved_by }) : tc('pos_factory.notYetApproved')}</div>
                                {c.photos && c.photos.length > 0 && (
                                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                                    {c.photos.map((p, i) => (
                                      <img key={i} src={p} alt={tc('pos_factory.capturePhoto', { n: i + 1 })} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--b)' }} />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Yield per product */}
      <Section title={tc('pos_factory.yieldByProduct')}>
        {yields.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noYieldData')}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colIntake')} align="right" /><Th label={tc('pos_factory.colOutput')} align="right" /><Th label={tc('pos_factory.colYield')} align="right" />
              </tr></thead>
              <tbody>
                {yields.map(y => (
                  <tr key={y.product}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{y.product}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(y.intake)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(y.output)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: y.yield >= 90 ? GREEN : y.yield >= 70 ? AMBER : RED }}>{pct(y.yield)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Batch tracking */}
      <Section title={tc('pos_factory.batchTrackingTitle')}>
        {batches.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noBatches')}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colDate')} /><Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colCaptures')} align="right" /><Th label={tc('pos_factory.colIntake')} align="right" /><Th label={tc('pos_factory.colOutput')} align="right" /><Th label={tc('pos_factory.colYield')} align="right" />
              </tr></thead>
              <tbody>
                {batches.map(b => {
                  const y = b.intake > 0 ? (b.output / b.intake) * 100 : 0
                  return (
                    <tr key={`${b.date}-${b.product}`}>
                      <td style={tdStyle}>{shortDate(b.date)}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{b.product}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{b.count}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(b.intake)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(b.output)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx3)' }}>{b.intake > 0 ? pct(y) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// QUALITY SUB-TAB
// ═════════════════════════════════════════════════════════════
function QualityView({ captures, wastages, costForCapture, totalWaste, currencySymbol, staffName }: {
  captures: FactoryCapture[]; wastages: FactoryCapture[]; costForCapture: (c: FactoryCapture) => number
  totalWaste: number; currencySymbol: string; staffName: (id?: string | null) => string | null
}) {
  const { tc } = useLang()
  const totalCaptures = captures.length
  const rejected = useMemo(() => captures.filter(c => c.status === 'rejected'), [captures])
  const rejectionRate = totalCaptures > 0 ? (rejected.length / totalCaptures) * 100 : 0
  // first pass yield: approved / (approved + rejected)
  const approvedCount = captures.filter(c => c.status === 'approved').length
  const decided = approvedCount + rejected.length
  const firstPassYield = decided > 0 ? (approvedCount / decided) * 100 : 0

  const wasteByProduct = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of wastages) m.set(c.product || 'Unknown', (m.get(c.product || 'Unknown') || 0) + (Number(c.quantity) || 0))
    return Array.from(m.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8)
  }, [wastages])

  const wasteByReason = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of wastages) { const r = wasteReason(c.notes); m.set(r, (m.get(r) || 0) + (Number(c.quantity) || 0)) }
    return Array.from(m.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }, [wastages])

  // weekly rejection rate trend
  const rejectionTrend = useMemo(() => {
    const m = new Map<string, { total: number; rej: number }>()
    for (const c of captures) {
      const k = weekKey(c.created_at)
      const e = m.get(k) || { total: 0, rej: 0 }
      e.total += 1
      if (c.status === 'rejected') e.rej += 1
      m.set(k, e)
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ label: k.split('-W')[1] ? `W${k.split('-W')[1]}` : k, value: v.total > 0 ? (v.rej / v.total) * 100 : 0 }))
  }, [captures])

  const costOfWaste = useMemo(() => wastages.reduce((s, c) => s + (Number(c.quantity) || 0) * costForCapture(c), 0), [wastages, costForCapture])

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.rejectionRateLabel')} value={pct(rejectionRate)} sub={tc('pos_factory.rejectionRateSub', { rejected: rejected.length, total: totalCaptures })} accent={rejectionRate > 5 ? RED : GREEN} />
        <KpiCard label={tc('pos_factory.firstPassYieldLabel')} value={pct(firstPassYield)} sub={tc('pos_factory.approvedFirstDecision')} accent={firstPassYield >= 90 ? GREEN : AMBER} />
        <KpiCard label={tc('pos_factory.totalWastageLabel')} value={fmtInt(totalWaste)} sub={tc('pos_factory.unitsWasted')} accent={RED} />
        <KpiCard label={tc('pos_factory.costOfWasteLabel')} value={fmt(currencySymbol, costOfWaste)} sub={tc('pos_factory.wastedMaterialValue')} accent={RED} />
      </div>

      <Section title={tc('pos_factory.wastageByProduct')}>
        <HBarChart data={wasteByProduct} color={RED} currencySymbol={currencySymbol} />
      </Section>

      <Section title={tc('pos_factory.wastageByReason')}>
        {wasteByReason.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noWastageRecorded')}</div>
        ) : (
          <HBarChart data={wasteByReason} color={AMBER} currencySymbol={currencySymbol} />
        )}
      </Section>

      <Section title={tc('pos_factory.rejectionRateTrend')}>
        {rejectionTrend.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.notEnoughTrendData')}</div>
        ) : (
          <LineChart points={rejectionTrend} color={RED} yLabel={tc('pos_factory.pctRejectedPerWeek')} formatY={(n) => pct(n)} />
        )}
      </Section>

      <Section title={tc('pos_factory.nonConformanceLog')}>
        {rejected.length === 0 ? (
          <EmptyState icon="✅" title={tc('pos_factory.noRejectionsTitle')} hint={tc('pos_factory.noRejectionsHint')} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colDate')} /><Th label={tc('pos_factory.colType')} /><Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colQty')} align="right" /><Th label={tc('pos_factory.colReason')} /><Th label={tc('pos_factory.colCorrectiveAction')} />
              </tr></thead>
              <tbody>
                {rejected.map(c => (
                  <tr key={c.id}>
                    <td style={tdStyle}>{shortDate(c.created_at)}</td>
                    <td style={tdStyle}><TypeBadge type={c.type} /></td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{c.product || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(Number(c.quantity) || 0)}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx2)' }}>{c.notes || wasteReason(c.notes)}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx3)' }}>{c.approved_by ? tc('pos_factory.reviewedBy', { name: staffName(c.approved_by) || c.approved_by }) : tc('pos_factory.pendingReview')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// INVENTORY SUB-TAB
// ═════════════════════════════════════════════════════════════
function InventoryView({ inv, intakes, currencySymbol, outputs, dispatches }: {
  inv: InventoryItem[]; intakes: FactoryCapture[]; currencySymbol: string; outputs?: FactoryCapture[]; dispatches?: FactoryCapture[]
}) {
  const { tc } = useLang()
  const [sortCol, setSortCol] = useState('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [sesameData, setSesameData] = useState<any>(null)

  // Fetch sesame production costs for inventory valuation
  useEffect(() => {
    fetch('/api/pos/factory/sesame-production')
      .then(r => {
        if (!r.ok) throw new Error(`API error: ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (data && typeof data === 'object') setSesameData(data)
        else console.warn('Sesame data is invalid:', data)
      })
      .catch(err => console.error('Sesame data fetch failed:', err))
  }, [])
  const onSort = (c: string) => {
    if (sortCol === c) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(c); setSortDir('asc') }
  }

  // Calculate factory inventory: sesame seed (intake) + jerrycans (produced - dispatched)
  const factoryInventory = useMemo(() => {
    const items: InventoryItem[] = []

    // Sesame seed: sum all intake_arrival + intake_feed
    const seedQuantity = intakes.reduce((sum, c) => {
      if (c.type === 'intake_arrival' || c.type === 'intake_feed') {
        return sum + (Number(c.quantity) || 0)
      }
      return sum
    }, 0)

    // Use real costs from sesame production API
    const seedCost = sesameData?.costPerKg || 0
    const rawMaterialsCost = sesameData?.rawMaterialsCost || 0
    const seedsInStock = sesameData?.remainingArrival || 0

    if (seedsInStock > 0) {
      items.push({
        name: 'Sesame seed',
        category: 'raw',
        quantity: seedsInStock,
        stock: seedsInStock,
        unit: 'kg',
        cost: seedCost,
        cost_price: seedCost,
      })
    }

    // Jerrycans: use real production cost from API
    const jerrycanProductionCost = 6000 // KSh per can
    const jerrycansInStock = sesameData?.jerrycansInStock || 0
    const finishedGoodsValue = sesameData?.finishedGoodsValue || 0

    if (jerrycansInStock > 0) {
      items.push({
        name: 'Sesame oil - Jerrycan (20L)',
        category: 'finished',
        quantity: jerrycansInStock,
        stock: jerrycansInStock,
        unit: 'pcs',
        cost: jerrycanProductionCost,
        cost_price: jerrycanProductionCost,
      })
    }

    return items
  }, [intakes, outputs, dispatches, sesameData])

  // usage rate estimate from intake captures (units consumed per day over 30d)
  const usageByProduct = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of intakes) m.set((c.product || '').toLowerCase(), (m.get((c.product || '').toLowerCase()) || 0) + (Number(c.quantity) || 0))
    const out = new Map<string, number>()
    m.forEach((v, k) => out.set(k, v / 30))
    return out
  }, [intakes])

  const rows = useMemo(() => {
    // Combine factory-calculated inventory + static inventory
    const allItems = [...factoryInventory, ...inv]
    const mapped = allItems.map(it => {
      const qty = getQty(it)
      const cost = getCost(it)
      const reorder = getReorder(it)
      const usage = usageByProduct.get((it.name || '').toLowerCase()) || 0
      const daysOfStock = usage > 0 ? qty / usage : Infinity
      return {
        name: it.name || 'Unnamed',
        category: isRaw(it) ? 'Raw' : isFinished(it) ? 'Finished' : (it.category || '—'),
        qty, unit: it.unit || '—', cost, reorder, daysOfStock,
        value: qty * cost,
        low: reorder > 0 && qty <= reorder,
      }
    })
    return [...mapped].sort((a, b) => {
      let av: any = (a as any)[sortCol], bv: any = (b as any)[sortCol]
      if (sortCol === 'daysOfStock') { av = isFinite(a.daysOfStock) ? a.daysOfStock : 1e9; bv = isFinite(b.daysOfStock) ? b.daysOfStock : 1e9 }
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [inv, factoryInventory, usageByProduct, sortCol, sortDir])

  const stockValue = useMemo(() => rows.reduce((s, r) => s + r.value, 0), [rows])
  const lowStock = useMemo(() => rows.filter(r => r.low), [rows])
  const rawValue = rows.filter(r => r.category === 'Raw').reduce((s, r) => s + r.value, 0)
  const finishedValue = rows.filter(r => r.category === 'Finished').reduce((s, r) => s + r.value, 0)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.stockValueLabel')} value={fmt(currencySymbol, stockValue)} sub={tc('pos_factory.itemsCount', { n: rows.length })} accent={ACC} />
        <KpiCard label={tc('pos_factory.rawMaterialsValueLabel')} value={fmt(currencySymbol, rawValue)} sub={tc('pos_factory.rawInventory')} accent="#3b82f6" />
        <KpiCard label={tc('pos_factory.finishedGoodsValueLabel')} value={fmt(currencySymbol, finishedValue)} sub={tc('pos_factory.finishedInventory')} accent={GREEN} />
        <KpiCard label={tc('pos_factory.lowStockItemsLabel')} value={fmtInt(lowStock.length)} sub={tc('pos_factory.atBelowReorderPoint')} accent={lowStock.length > 0 ? RED : GREEN} />
      </div>

      {lowStock.length > 0 && (
        <Section title={tc('pos_factory.reorderSuggestions')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lowStock.map(r => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(220,38,38,.06)', border: `1px solid ${RED}33` }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{tc('pos_factory.reorderHint', { qty: fmtInt(r.qty), unit: r.unit, reorder: fmtInt(r.reorder) })}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title={tc('pos_factory.inventoryTitle')}>
        {rows.length === 0 ? (
          <EmptyState icon="📦" title={tc('pos_factory.noInventoryTitle')} hint={tc('pos_factory.noInventoryHint')} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colName')} col="name" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colCategory')} col="category" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colStock')} col="qty" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colUnit')} />
                <Th label={tc('pos_factory.colCost')} col="cost" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colValue')} col="value" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colReorder')} col="reorder" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colDaysOfStock')} col="daysOfStock" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
              </tr></thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.name} style={{ background: r.low ? 'rgba(220,38,38,.05)' : 'transparent' }}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.low && <span style={{ color: RED, marginRight: 4 }}>●</span>}{r.name}</td>
                    <td style={tdStyle}>{r.category}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(r.qty)}</td>
                    <td style={tdStyle}>{r.unit}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(currencySymbol, r.cost)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600 }}>{fmt(currencySymbol, r.value)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: 'var(--tx3)' }}>{r.reorder > 0 ? fmtInt(r.reorder) : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: isFinite(r.daysOfStock) ? (r.daysOfStock < 7 ? RED : 'var(--tx2)') : 'var(--tx3)' }}>
                      {isFinite(r.daysOfStock) ? `${Math.round(r.daysOfStock)}d` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// DISPATCH SUB-TAB
// ═════════════════════════════════════════════════════════════
function DispatchView({ dispatches, staffName, currencySymbol }: {
  dispatches: FactoryCapture[]; staffName: (id?: string | null) => string | null; currencySymbol: string
}) {
  const { tc } = useLang()
  const [sortCol, setSortCol] = useState('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const onSort = (c: string) => {
    if (sortCol === c) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(c); setSortDir('asc') }
  }

  const rows = useMemo(() => {
    return [...dispatches].sort((a, b) => {
      let av: any, bv: any
      switch (sortCol) {
        case 'product': av = a.product || ''; bv = b.product || ''; break
        case 'quantity': av = Number(a.quantity) || 0; bv = Number(b.quantity) || 0; break
        case 'status': av = a.status; bv = b.status; break
        default: av = new Date(a.created_at).getTime(); bv = new Date(b.created_at).getTime()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [dispatches, sortCol, sortDir])

  const pending = dispatches.filter(d => d.status === 'pending')
  const totalDispatched = dispatches.reduce((s, c) => s + (Number(c.quantity) || 0), 0)

  // weekly dispatch volume
  const weekly = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of dispatches) m.set(weekKey(c.created_at), (m.get(weekKey(c.created_at)) || 0) + (Number(c.quantity) || 0))
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => ({ label: k.split('-W')[1] ? `W${k.split('-W')[1]}` : k, value: v }))
  }, [dispatches])

  const weeklyMax = Math.max(1, ...weekly.map(w => w.value))

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard label={tc('pos_factory.totalShipmentsLabel')} value={fmtInt(dispatches.length)} sub={tc('pos_factory.dispatchCaptures')} accent="#a855f7" />
        <KpiCard label={tc('pos_factory.unitsDispatchedLabel')} value={fmtInt(totalDispatched)} sub={tc('pos_factory.acrossAllShipments')} accent={ACC} />
        <KpiCard label={tc('pos_factory.pendingDispatchesLabel')} value={fmtInt(pending.length)} sub={tc('pos_factory.awaitingApproval')} accent={pending.length > 0 ? AMBER : GREEN} />
        <KpiCard label={tc('pos_factory.onTimeRateLabel')} value="—" sub={tc('pos_factory.trackingComingSoon')} accent="var(--tx3)" />
      </div>

      <Section title={tc('pos_factory.dispatchVolumeWeekly')}>
        {weekly.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noDispatchesRecorded')}</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, padding: '0 4px' }}>
            {weekly.map(w => (
              <div key={w.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{ fontSize: 9, fontWeight: 600, marginBottom: 4 }}>{fmtInt(w.value)}</div>
                <div style={{ width: '70%', maxWidth: 48, background: '#a855f7', borderRadius: '4px 4px 0 0', height: `${(w.value / weeklyMax) * 110}px`, minHeight: 2 }} />
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 4 }}>{w.label}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {pending.length > 0 && (
        <Section title={tc('pos_factory.pendingDispatchesTitle')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pending.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: ACC_BG, border: `1px solid ${ACC_BORDER}` }}>
                <span style={{ fontSize: 12 }}>⏳</span>
                <div style={{ flex: 1, fontSize: 11, fontWeight: 600 }}>{d.product || 'Unknown'} — {fmtInt(Number(d.quantity) || 0)} {d.unit || ''}</div>
                <div style={{ fontSize: 10, color: 'var(--tx3)' }}>{d.destination || d.notes || tc('pos_factory.noDestination')}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title={tc('pos_factory.shipmentsTitle')}>
        {rows.length === 0 ? (
          <EmptyState icon="🚚" title={tc('pos_factory.noDispatchesTitle')} hint={tc('pos_factory.noDispatchesHint')} />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colDate')} col="created_at" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colProduct')} col="product" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colQty')} col="quantity" sortCol={sortCol} sortDir={sortDir} onSort={onSort} align="right" />
                <Th label={tc('pos_factory.colUnit')} />
                <Th label={tc('pos_factory.colDestination')} />
                <Th label={tc('pos_factory.colStatus')} col="status" sortCol={sortCol} sortDir={sortDir} onSort={onSort} />
                <Th label={tc('pos_factory.colApprovedBy')} />
              </tr></thead>
              <tbody>
                {rows.map(d => (
                  <tr key={d.id}>
                    <td style={tdStyle}>{shortDate(d.created_at)}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{d.product || '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmtInt(Number(d.quantity) || 0)}</td>
                    <td style={tdStyle}>{d.unit || '—'}</td>
                    <td style={{ ...tdStyle, color: 'var(--tx2)' }}>{d.destination || d.notes || '—'}</td>
                    <td style={tdStyle}><StatusBadge status={d.status} /></td>
                    <td style={{ ...tdStyle, color: 'var(--tx3)' }}>{staffName(d.approved_by) || d.approved_by || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════
// COSTING SUB-TAB — crown jewel
// ═════════════════════════════════════════════════════════════
function CostingView({ intakes, outputs, wastages, packaging, dispatches, costForCapture, sellByProduct, totalOutput, currencySymbol, selectedLocation, previewCaptures }: {
  intakes: FactoryCapture[]; outputs: FactoryCapture[]; wastages: FactoryCapture[]; packaging?: FactoryCapture[]; dispatches?: FactoryCapture[]
  costForCapture: (c: FactoryCapture) => number
  sellByProduct: Map<string, number>
  totalOutput: number; currencySymbol: string
  /** For the day-scoped "Cost per 20L Jerrycan" fetch below only — kept
   * separate from this view's own (all-time, pre-filtered) props. */
  selectedLocation?: string; previewCaptures?: any[]
}) {
  const { tc } = useLang()

  // Real operating costs (Kenya rates) — per 20L jerrycan
  const STAFF_COST_PER_DAY = 2400 // KSh
  const MOTOR_HOURS_PER_DAY = 9 // confirmed by owner — not 24/7
  // Real machines confirmed by the owner (2026-09-23), replacing the prior
  // placeholder single "1 HP motor" — that number understated real usage by
  // roughly 15x. Researched against manufacturer/supplier listings:
  //   - Milano MOP100 press: 10 HP — confirmed by two independent Kenyan
  //     suppliers (makimara.co.ke, metrostores.co.ke).
  //   - Milano ~250 filter: no exact "250K" model was found. The nearest
  //     verified Milano filter machine (MOF300, kreatives.co.ke) runs 1 HP
  //     — used as the estimate here. If the real nameplate differs, correct
  //     it below or use the Edit override on the Electricity card.
  //   - KK40 press: 3 kW, the "F Universal" variant per the manufacturer's
  //     own spec sheet (oelpresse.de). The "F Special" variant is 4kW —
  //     swap this if that's the one actually installed.
  const MACHINES = [
    { name: 'Milano MOP100 press', kw: 10 * 0.746 },
    { name: 'Milano filter (~250)', kw: 1 * 0.746 },
    { name: 'KK40 press', kw: 3 },
  ]
  // KPLC CI1 (415V three-phase, the standard low-voltage 3-phase supply a
  // small factory would have) energy charge, 2025/26 — confirmed by owner
  // this factory is on 3-phase, not single-phase. Meaningfully lower than
  // the single-phase Small Commercial (SC3) rate of ~19-20 KSh/kWh this
  // used before. NOTE: CI tariffs also carry a separate fixed demand charge
  // (~KSh 1,100/kVA/month) on top of the per-kWh energy charge, which isn't
  // modeled here — it's billed on the whole facility's peak simultaneous
  // demand, not attributable to this one motor without knowing the site's
  // registered kVA. The real monthly bill will run higher than this
  // energy-only figure by that fixed amount.
  const ELECTRICITY_RATE_PER_KWH = 13.44

  // Calculate real operating costs
  const staffCostPerDay = STAFF_COST_PER_DAY
  const totalMachineKW = MACHINES.reduce((s, m) => s + m.kw, 0)
  const electricityCostPerDay = useMemo(() => {
    return totalMachineKW * MOTOR_HOURS_PER_DAY * ELECTRICITY_RATE_PER_KWH
  }, [totalMachineKW])

  // Number of distinct calendar days the factory actually had activity,
  // from real capture timestamps — drives labor/electricity cost so it
  // scales with the real production period instead of an assumed cadence.
  // Confirmed by owner: machines only run 6 days/week (never Sundays), so a
  // Sunday capture (e.g. a dispatch or wastage log with no pressing) is
  // excluded rather than counted as a full operating day.
  //
  // Both the Sunday check AND the day-bucketing must be evaluated in the
  // factory's own timezone (Nairobi, UTC+3, no DST), not the viewer's
  // browser timezone. `dayKey`/`new Date(...).getDay()` use the browser's
  // local clock — so the same data could split one real Nairobi business
  // day across two different local calendar days (or vice versa), or miss/
  // over-count Sundays, depending on where the dashboard is opened from. A
  // fixed +3h shift, read back with UTC getters, gives a stable answer
  // regardless of viewer location.
  const productionDays = useMemo(() => {
    const days = new Set<string>()
    const addIfWorkingDay = (created_at: string) => {
      const nairobi = new Date(new Date(created_at).getTime() + 3 * 3600 * 1000)
      if (nairobi.getUTCDay() === 0) return
      const key = `${nairobi.getUTCFullYear()}-${String(nairobi.getUTCMonth() + 1).padStart(2, '0')}-${String(nairobi.getUTCDate()).padStart(2, '0')}`
      days.add(key)
    }
    for (const c of intakes) addIfWorkingDay(c.created_at)
    for (const c of outputs) addIfWorkingDay(c.created_at)
    for (const c of (packaging || [])) addIfWorkingDay(c.created_at)
    for (const c of wastages) addIfWorkingDay(c.created_at)
    return days.size
  }, [intakes, outputs, packaging, wastages])

  // Count total 20L jerrycans produced. Jerrycans are recorded as
  // 'packaging' type captures, not 'output' — packaging repackages an
  // already-logged output into sellable units. Fall back to scanning
  // outputs too, in case a factory type logs jerrycans directly as output.
  const jerrycansProduced = useMemo(() => {
    const fromPackaging = (packaging || []).reduce((sum, c) => {
      if ((c.product || '').toLowerCase().includes('jerrycan')) return sum + (Number(c.quantity) || 0)
      return sum
    }, 0)
    if (fromPackaging > 0) return fromPackaging
    return outputs.reduce((sum, c) => {
      // Match products like "Sesame oil - Jerrycan Matungi (20L)"
      if ((c.product || '').toLowerCase().includes('jerrycan')) {
        return sum + (Number(c.quantity) || 0)
      }
      return sum
    }, 0)
  }, [outputs, packaging])

  // Cost per 20L jerrycan (allocated across actual jerrycan output)
  // Gross cost of ALL seed fed into the press, including the portion that
  // ended up as wastage rather than oil.
  const grossMaterialCost = useMemo(() => intakes.reduce((s, c) => s + (Number(c.quantity) || 0) * costForCapture(c), 0), [intakes, costForCapture])
  const intakeQtyTotal = useMemo(() => intakes.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [intakes])
  const avgSeedCostPerKg = intakeQtyTotal > 0 ? grossMaterialCost / intakeQtyTotal : 0
  const wastageQtyTotal = useMemo(() => wastages.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [wastages])
  // Material cost attributable to jerrycans only — excludes the cost of
  // seed that became wastage rather than oil, so cost-per-jerrycan isn't
  // inflated by material that never made it into a sellable jerrycan.
  const totalMaterialCost = Math.max(0, grossMaterialCost - (wastageQtyTotal * avgSeedCostPerKg))

  // Manual top-up for ad-hoc labour (casual/temporary workers beyond the
  // fixed daily staff rate) — the capture log has no record of casual
  // hires, so this is entered by hand and added on top of the real-days
  // calculation below.
  const [adhocLaborCost, setAdhocLaborCost] = useState(0)
  const [isEditingLabor, setIsEditingLabor] = useState(false)

  // Electricity is a FULL override, not an add-on — the formula's "1 HP,
  // 14h/day, every active day" assumption is a generic default (not this
  // factory's real motor/hours/tariff), so it can just be wrong, not merely
  // incomplete. Confirmed against a real ~KSh30,000/month total bill: the
  // formula attributing ~22% of that to one small press motor alone was
  // implausible, so the user needs to replace it outright, not add to it.
  const [electricityOverride, setElectricityOverride] = useState<number | null>(null)
  const [isEditingElectricity, setIsEditingElectricity] = useState(false)
  const isElectricityAmended = electricityOverride != null

  // Labor + electricity cost for the actual period the factory operated
  // (real distinct days with logged activity), then spread across actual
  // jerrycan output — not a fixed weekly assumption regardless of volume —
  // plus any manually entered ad-hoc labour cost on top.
  const totalLabor = productionDays * staffCostPerDay + adhocLaborCost
  const formulaElectricity = productionDays * electricityCostPerDay
  const totalElectricity = isElectricityAmended ? electricityOverride! : formulaElectricity
  const staffCostPerJerrycan = jerrycansProduced > 0 ? totalLabor / jerrycansProduced : 0
  const electricityCostPerJerrycan = jerrycansProduced > 0 ? totalElectricity / jerrycansProduced : 0
  // Manual fallback price, only used until real wastage sale data exists
  const [wastagePerUnitCost, setWastagePerUnitCost] = useState(30)
  // Manual override — lets the user amend the price even once actual dispatch
  // data exists (e.g. the realized average is skewed by an early low-price sale).
  const [wastagePriceOverride, setWastagePriceOverride] = useState<number | null>(null)
  // Value recoverable by selling wastage (press cake/byproduct), NOT a loss.
  // Wastage still IN STOCK (produced minus already sold/dispatched) —
  // once sold, its value shows up as real revenue elsewhere, not here.
  const { wastageSoldQty, wasteSaleRevenue } = useMemo(() => {
    let qty = 0, revenue = 0
    for (const c of (dispatches || [])) {
      if ((c.product || '').toLowerCase().includes('waste')) {
        const q = Number(c.quantity) || 0
        qty += q
        if (c.sale_price != null && Number(c.sale_price) > 0) revenue += q * Number(c.sale_price)
      }
    }
    return { wastageSoldQty: qty, wasteSaleRevenue: revenue }
  }, [dispatches])
  const wastageInStockQty = Math.max(0, wastageQtyTotal - wastageSoldQty)
  // Actual realized price per kg from real dispatch sales, when available —
  // falls back to the manual estimate only if wastage has never been sold.
  const actualWastePricePerKg = wastageSoldQty > 0 ? wasteSaleRevenue / wastageSoldQty : 0
  const usingActualWastePrice = actualWastePricePerKg > 0
  const computedWastePricePerKg = usingActualWastePrice ? actualWastePricePerKg : wastagePerUnitCost
  const isWastePriceAmended = wastagePriceOverride != null
  const effectiveWastePricePerKg = isWastePriceAmended ? wastagePriceOverride! : computedWastePricePerKg
  const wasteSaleValue = useMemo(() => {
    return wastageInStockQty * effectiveWastePricePerKg
  }, [wastageInStockQty, effectiveWastePricePerKg])
  // Cost of the seed that became wastage (see totalMaterialCost's own
  // deduction above) and the revenue that byproduct is actually clawing
  // back, side by side — these two numbers live in unrelated places
  // elsewhere on this page (Material Cost's "Less wastage" line vs. the
  // separate Wastage Sale Value card), easy to read as connected when
  // they're not netted anywhere. wasteSaleRevenue is realized (already
  // sold); wasteSaleValue is still projected (in stock, not yet sold).
  const wastageCostTotal = wastageQtyTotal * avgSeedCostPerKg
  const netWastagePosition = wasteSaleRevenue + wasteSaleValue - wastageCostTotal

  // Overhead (oil changes, filters, maintenance, misc equipment costs) has
  // no real capture data behind it — was a flat 5% guess on top of the
  // other components. Now an explicit manual entry, defaulting to KSh0 so
  // it never inflates the cost figures unless the owner actually enters a
  // real number for what they spent.
  const [overheadOverride, setOverheadOverride] = useState(0)
  const [isEditingOverhead, setIsEditingOverhead] = useState(false)
  const totalOverhead = overheadOverride
  const overheadPerJerrycan = jerrycansProduced > 0 ? totalOverhead / jerrycansProduced : 0
  // Labor excluded from the jerrycan cost roll-up at the owner's request —
  // wastage byproduct sales (~600kg/week @ KSh30/kg) already cover it as a
  // separate revenue stream, so it's tracked on its own (Labor Cost card,
  // margins table) rather than folded into Cost per 20L Jerrycan.
  const totalProductionCost = totalMaterialCost + totalElectricity + totalOverhead
  const costPerJerrycan = jerrycansProduced > 0 ? totalProductionCost / jerrycansProduced : 0

  // ═══ Daily Cost per 20L Jerrycan (scroll-back view) ═══════════
  // Everything above is an ALL-TIME average. This section adds a single-day
  // view of the same "Cost per 20L Jerrycan" card, scoped via its own
  // ?date= fetch — deliberately NOT a client-side filter over this view's
  // own (capped at limit=2000) props, since that cap holds fine for an
  // all-time average spanning months but silently drops older days once
  // history grows past it. Same class of bug already hit once in
  // pos-askbiz's Production Log (fixed commit ee21452b) — the capture API
  // already supports real server-side date filtering for exactly this.
  const todayNairobi = nairobiDayKey(new Date())
  const yesterdayNairobi = shiftDayKey(todayNairobi, -1)
  const [costingDay, setCostingDay] = useState(todayNairobi)
  const [dayCaptures, setDayCaptures] = useState<FactoryCapture[]>([])
  const [dayLoading, setDayLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      // Preview/demo harness has no API to call — filter the fixed mock set
      // client-side instead, same fallback the main captures fetch uses.
      if (previewCaptures) {
        const list = (previewCaptures as FactoryCapture[]).filter(c => nairobiDayKey(new Date(c.created_at)) === costingDay)
        if (!cancelled) setDayCaptures(list)
        return
      }
      setDayLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedLocation && selectedLocation !== 'all') params.set('location_id', selectedLocation)
        params.set('date', costingDay)
        params.set('limit', '2000')
        const res = await fetch(`/api/pos/factory/capture?${params}`)
        const data = await res.json()
        let list: FactoryCapture[] = Array.isArray(data) ? data : (data.captures || data.data || [])
        list = Array.isArray(list) ? list.map(c => ({ ...c, product: c.product || (c as any).product_name })) : []
        if (!cancelled) setDayCaptures(list)
      } catch (err) {
        console.error('Failed to fetch day-scoped factory captures:', err)
        if (!cancelled) setDayCaptures([])
      } finally {
        if (!cancelled) setDayLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [costingDay, selectedLocation, previewCaptures])

  // Same type grouping (intake+intake_feed, matching the `intakes` prop
  // this view already receives — see intakesConsumed in the parent) and the
  // same formulas as the all-time figures above, just fed from the
  // day-scoped fetch instead — so a single day's number is built exactly
  // the same way as the all-time average sitting next to it.
  const dayIntakes = useMemo(() => dayCaptures.filter(c => c.type === 'intake' || c.type === 'intake_feed'), [dayCaptures])
  const dayOutputs = useMemo(() => dayCaptures.filter(c => c.type === 'output'), [dayCaptures])
  const dayPackaging = useMemo(() => dayCaptures.filter(c => (c.type as any) === 'packaging'), [dayCaptures])
  const dayWastages = useMemo(() => dayCaptures.filter(c => c.type === 'wastage'), [dayCaptures])

  const dayJerrycansProduced = useMemo(() => {
    const fromPackaging = dayPackaging.reduce((sum, c) => (c.product || '').toLowerCase().includes('jerrycan') ? sum + (Number(c.quantity) || 0) : sum, 0)
    if (fromPackaging > 0) return fromPackaging
    return dayOutputs.reduce((sum, c) => (c.product || '').toLowerCase().includes('jerrycan') ? sum + (Number(c.quantity) || 0) : sum, 0)
  }, [dayPackaging, dayOutputs])

  const dayGrossMaterialCost = useMemo(() => dayIntakes.reduce((s, c) => s + (Number(c.quantity) || 0) * costForCapture(c), 0), [dayIntakes, costForCapture])
  const dayIntakeQtyTotal = useMemo(() => dayIntakes.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [dayIntakes])
  const dayAvgSeedCostPerKg = dayIntakeQtyTotal > 0 ? dayGrossMaterialCost / dayIntakeQtyTotal : 0
  const dayWastageQtyTotal = useMemo(() => dayWastages.reduce((s, c) => s + (Number(c.quantity) || 0), 0), [dayWastages])
  const dayTotalMaterialCost = Math.max(0, dayGrossMaterialCost - (dayWastageQtyTotal * dayAvgSeedCostPerKg))
  const dayMaterialPerCan = dayJerrycansProduced > 0 ? dayTotalMaterialCost / dayJerrycansProduced : 0

  // Electricity: same "was this an active working day" logic as
  // productionDays/totalElectricity above (Sundays excluded — confirmed by
  // owner the machines never run then), just asking it of one day instead
  // of counting across all history. Ignores any lifetime manual electricity
  // override on purpose — that override is a single lump-sum replacement
  // for the whole tracked period with no day-level resolution, so it can't
  // tell us what any one specific day cost; the formula estimate is the
  // only number that IS day-resolvable.
  const dayHasActivity = dayIntakes.length > 0 || dayOutputs.length > 0 || dayPackaging.length > 0 || dayWastages.length > 0
  const dayIsActiveWorkingDay = !isSundayDayKey(costingDay) && dayHasActivity
  const dayElectricityTotal = dayIsActiveWorkingDay ? electricityCostPerDay : 0
  const dayElectricityPerCan = dayJerrycansProduced > 0 ? dayElectricityTotal / dayJerrycansProduced : 0

  // Overhead has no date on it at all — a single manually-typed lifetime
  // figure (see totalOverhead above), so there's no real per-day number to
  // show. Reuse its all-time per-jerrycan rate rather than inventing a
  // day-specific split with no data behind it; the card labels this clearly.
  const dayCostPerJerrycan = dayMaterialPerCan + dayElectricityPerCan + overheadPerJerrycan
  const costingDayLabel = costingDay === todayNairobi ? 'Today' : costingDay === yesterdayNairobi ? 'Yesterday' : formatDayKey(costingDay)

  const pieSlices = [
    { label: tc('pos_factory.pieMaterials'), value: totalMaterialCost, color: ACC },
    { label: 'Electricity', value: totalElectricity, color: '#fbbf24' },
    { label: tc('pos_factory.pieOverhead'), value: totalOverhead, color: '#a855f7' },
  ].filter(s => s.value > 0)

  // standard vs actual material usage per product
  // Real realized price per product, from this factory's own approved
  // dispatches (see DEFAULT_DISPATCH_PRICE / app/factory/approvals in
  // pos-askbiz) — the actual point of sale for factory output. Preferred
  // over the generic retail `inventory` catalog below, which is keyed by
  // packaged-SKU names (bottle sizes, brand variants) that essentially
  // never match a bulk production product name. Mirrors the wastage
  // actual-vs-estimate pattern (wastageSoldQty/wasteSaleRevenue above).
  const actualSellSumsByProduct = useMemo(() => {
    const sums = new Map<string, { revenue: number; qty: number }>()
    for (const d of (dispatches || [])) {
      if (d.status !== 'approved') continue
      const price = Number(d.dispatch_price) || 0
      const qty = Number(d.quantity) || 0
      if (price <= 0 || qty <= 0) continue
      const k = norm(d.product || '')
      if (!k) continue
      const e = sums.get(k) || { revenue: 0, qty: 0 }
      e.revenue += qty * price
      e.qty += qty
      sums.set(k, e)
    }
    return sums
  }, [dispatches])
  // Actual realized dispatch price first, generic catalog price as fallback
  // for a product that's never actually been dispatched yet. Exact match
  // ONLY — this used to also substring-match ("Sesame oil" against the
  // dispatch SKU "Sesame oil - Jerrycan Matungi (20L)"), which silently
  // compared a per-KG bulk-oil cost against a per-JERRYCAN sell price (a
  // ~18x unit mismatch that showed as a nonsense ~97% margin). Bulk,
  // pre-packaging product genuinely has no sell reference — it's never
  // sold at that stage, only after packaging — so it correctly shows "—"
  // now instead of a wrong number. The packaged-jerrycan row below carries
  // its own exact-matching label instead.
  const sellPriceFor = useCallback((product: string): number => {
    const k = norm(product)
    const exact = actualSellSumsByProduct.get(k)
    if (exact && exact.qty > 0) return exact.revenue / exact.qty
    return sellByProduct.get(k) || 0
  }, [actualSellSumsByProduct, sellByProduct])

  const stdVsActual = useMemo(() => {
    const m = new Map<string, { label: string; actualCost: number; intakeQty: number; outputQty: number }>()
    for (const c of intakes) {
      const k = norm(c.product || 'Unknown')
      const e = m.get(k) || { label: (c.product || 'Unknown').trim(), actualCost: 0, intakeQty: 0, outputQty: 0 }
      e.actualCost += (Number(c.quantity) || 0) * costForCapture(c)
      e.intakeQty += Number(c.quantity) || 0
      m.set(k, e)
    }
    for (const c of outputs) {
      const kg = outputQtyInKg(c)
      if (kg == null) continue
      const k = norm(c.product || 'Unknown')
      const e = m.get(k) || { label: (c.product || 'Unknown').trim(), actualCost: 0, intakeQty: 0, outputQty: 0 }
      e.outputQty += kg
      m.set(k, e)
    }
    const bulkRows = Array.from(m.values())
      .filter(v => isLikelyRealProduct(v.label))
      // Superseded by the dedicated jerrycan row below, which uses the
      // correct per-jerrycan basis — showing bulk "Sesame oil" here too
      // would duplicate it under a mismatched per-kg cost.
      .filter(v => norm(v.label) !== 'sesame oil')
      .map(v => {
        // A raw material (Sesame seed) is genuinely bought (has real
        // intake) — its true cost is what you paid per kg of intake, NOT
        // its total cost divided by some unrelated "output" quantity (a
        // handful of captures can be mislabeled with the raw material's
        // name by mistake, e.g. a single stray 50kg "output" entry against
        // 8,800+kg of real intake — dividing the whole seed spend by that
        // stray figure produced a nonsense per-kg cost).
        // A pressed product with no real intake cost of its own (virtually
        // never true here since bulk oil is excluded above) falls back to
        // totalMaterialCost, the factory's actual net seed cost.
        let actualPerUnit = 0
        if (v.intakeQty > 0 && v.actualCost > 0) {
          actualPerUnit = v.actualCost / v.intakeQty
        } else if (v.outputQty > 0) {
          const cost = v.actualCost > 0 ? v.actualCost : totalMaterialCost
          actualPerUnit = cost / v.outputQty
        }
        const std = sellPriceFor(v.label)
        return { product: v.label, actualPerUnit, standard: std, variance: std > 0 ? actualPerUnit - std : 0 }
      }).filter(r => r.actualPerUnit > 0 || r.standard > 0)

    // The actually-sold unit is a packaged 20L jerrycan, not bulk oil —
    // bulk "Sesame oil" above is a pre-packaging intermediate, excluded
    // from bulkRows since it's the same real product as this row. This row
    // uses figures that are already unit-consistent elsewhere in this
    // view: material cost per jerrycan (this table is specifically
    // Material Cost) against the real dispatch-weighted sell price for
    // that exact product name.
    const jerrycanLabel = 'Sesame oil - Jerrycan Matungi (20L)'
    const jerrycanRows = []
    if (jerrycansProduced > 0) {
      const actualPerUnit = totalMaterialCost / jerrycansProduced
      const std = sellPriceFor(jerrycanLabel)
      jerrycanRows.push({ product: jerrycanLabel, actualPerUnit, standard: std, variance: std > 0 ? actualPerUnit - std : 0 })
    }
    return [...bulkRows, ...jerrycanRows]
  }, [intakes, outputs, costForCapture, sellPriceFor, totalMaterialCost, jerrycansProduced])

  // Output captures whose unit couldn't be safely converted onto a kg basis
  // (see outputQtyInKg) — excluded from stdVsActual/margins above; surfaced
  // as a caveat note rather than silently dropped.
  const excludedOutputUnits = useMemo(() => {
    let qty = 0, count = 0
    for (const c of outputs) {
      if (outputQtyInKg(c) == null) { qty += Number(c.quantity) || 0; count++ }
    }
    return { qty, count }
  }, [outputs])

  // cost-per-jerrycan trend over time (weekly)
  const costTrend = useMemo(() => {
    const intakeByWeek = new Map<string, number>()
    const wastageByWeek = new Map<string, number>()
    const jerrycansByWeek = new Map<string, number>()
    for (const c of intakes) intakeByWeek.set(weekKey(c.created_at), (intakeByWeek.get(weekKey(c.created_at)) || 0) + (Number(c.quantity) || 0) * costForCapture(c))
    for (const c of wastages) wastageByWeek.set(weekKey(c.created_at), (wastageByWeek.get(weekKey(c.created_at)) || 0) + (Number(c.quantity) || 0))
    // Finished jerrycans are logged as 'packaging' captures, not 'output'
    // (see jerrycansProduced above) — this loop only ever checked outputs,
    // so jerrycansByWeek stayed empty and every week showed KSh0. Mirror the
    // same packaging-first, output-fallback logic used there.
    const hasPackagingJerrycans = (packaging || []).some(c => (c.product || '').toLowerCase().includes('jerrycan'))
    const jerrycanSource = hasPackagingJerrycans ? (packaging || []) : outputs
    for (const c of jerrycanSource) {
      if ((c.product || '').toLowerCase().includes('jerrycan')) {
        jerrycansByWeek.set(weekKey(c.created_at), (jerrycansByWeek.get(weekKey(c.created_at)) || 0) + (Number(c.quantity) || 0))
      }
    }
    const weeks = Array.from(new Set([...Array.from(intakeByWeek.keys()), ...Array.from(jerrycansByWeek.keys())])).sort()
    return weeks.map(w => {
      const grossMat = intakeByWeek.get(w) || 0
      // Net out that week's wastage cost, same as totalMaterialCost above,
      // so the trend isn't inflated by seed that never became oil.
      const mat = Math.max(0, grossMat - (wastageByWeek.get(w) || 0) * avgSeedCostPerKg)
      const cans = jerrycansByWeek.get(w) || 0
      // Labor excluded here too, to match costPerJerrycan above.
      const elec = cans * electricityCostPerJerrycan
      const oh = cans * overheadPerJerrycan
      const cpu = cans > 0 ? (mat + elec + oh) / cans : 0
      return { label: w.split('-W')[1] ? `W${w.split('-W')[1]}` : w, value: cpu }
    })
  }, [intakes, outputs, packaging, wastages, costForCapture, avgSeedCostPerKg, electricityCostPerJerrycan, overheadPerJerrycan])

  // margin analysis per product
  const margins = useMemo(() => {
    const outByProduct = new Map<string, { label: string; cost: number; intakeQty: number; qty: number }>()
    for (const c of intakes) {
      const k = norm(c.product || 'Unknown')
      const e = outByProduct.get(k) || { label: (c.product || 'Unknown').trim(), cost: 0, intakeQty: 0, qty: 0 }
      e.cost += (Number(c.quantity) || 0) * costForCapture(c)
      e.intakeQty += Number(c.quantity) || 0
      outByProduct.set(k, e)
    }
    for (const c of outputs) {
      const kg = outputQtyInKg(c)
      if (kg == null) continue
      const k = norm(c.product || 'Unknown')
      const e = outByProduct.get(k) || { label: (c.product || 'Unknown').trim(), cost: 0, intakeQty: 0, qty: 0 }
      e.qty += kg
      outByProduct.set(k, e)
    }
    const bulkRows = Array.from(outByProduct.values())
      .filter(v => isLikelyRealProduct(v.label))
      // Superseded by the dedicated jerrycan row below — see stdVsActual.
      .filter(v => norm(v.label) !== 'sesame oil')
      .map(v => {
        // Raw material (real intake, e.g. Sesame seed): cost per kg of what
        // was actually bought — not divided by an unrelated output-stage
        // quantity (see stdVsActual's bulkRows for the full explanation).
        // Same fallback to totalMaterialCost as stdVsActual for a pressed
        // product with no real intake cost of its own.
        let matPerUnit = 0
        if (v.intakeQty > 0 && v.cost > 0) {
          matPerUnit = v.cost / v.intakeQty
        } else if (v.qty > 0) {
          const cost = v.cost > 0 ? v.cost : totalMaterialCost
          matPerUnit = cost / v.qty
        }
        // electricityCostPerJerrycan is a cost PER 20L JERRYCAN — only add
        // it where v.qty is actually jerrycan-denominated. Bulk rows here
        // (Sesame seed in kg) never actually match this — see the
        // dedicated jerrycan row below instead, which uses the
        // already-correct costPerJerrycan directly rather than
        // reconstructing it here. Labor excluded per owner request — see
        // costPerJerrycan above.
        const isJerrycanUnit = /jerrycan|mtungi/i.test(v.label)
        const electricityOverhead = isJerrycanUnit ? electricityCostPerJerrycan + overheadPerJerrycan : 0
        const fullCost = matPerUnit + electricityOverhead
        const sell = sellPriceFor(v.label)
        const margin = sell > 0 ? ((sell - fullCost) / sell) * 100 : 0
        return { product: v.label, fullCost, sell, margin, hasSell: sell > 0, fullCostIsMaterialOnly: !isJerrycanUnit }
      }).filter(r => r.fullCost > 0)

    // The actually-sold unit — see the matching row in stdVsActual above
    // for why bulk "Sesame oil" has no sell reference of its own. fullCost
    // here is costPerJerrycan (already material + electricity + overhead,
    // all correctly per-jerrycan — labor excluded per owner request) so
    // this row needs no separate "material only" caveat.
    const jerrycanLabel = 'Sesame oil - Jerrycan Matungi (20L)'
    const jerrycanRows = []
    if (jerrycansProduced > 0 && costPerJerrycan > 0) {
      const sell = sellPriceFor(jerrycanLabel)
      const margin = sell > 0 ? ((sell - costPerJerrycan) / sell) * 100 : 0
      jerrycanRows.push({ product: jerrycanLabel, fullCost: costPerJerrycan, sell, margin, hasSell: sell > 0, fullCostIsMaterialOnly: false })
    }
    return [...bulkRows, ...jerrycanRows].sort((a, b) => b.margin - a.margin)
  }, [intakes, outputs, costForCapture, sellPriceFor, electricityCostPerJerrycan, overheadPerJerrycan, totalMaterialCost, jerrycansProduced, costPerJerrycan])

  return (
    <div>
      {/* Real Operating Costs */}
      <div style={{ padding: 14, borderRadius: 12, border: `1px solid ${ACC_BORDER}`, background: ACC_BG, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, color: ACC }}>Operating Costs (per 20L Jerrycan)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, fontSize: 10, color: 'var(--tx2)' }}>
          <div>
            <div style={{ marginBottom: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              Staff
              {!isEditingLabor && (
                <button
                  type="button"
                  onClick={() => setIsEditingLabor(true)}
                  style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  {adhocLaborCost > 0 ? 'Edit ad-hoc' : '+ Ad-hoc labour'}
                </button>
              )}
            </div>
            <div>{fmt(currencySymbol, staffCostPerDay)}/day × {fmtInt(productionDays)} active day{productionDays === 1 ? '' : 's'}</div>
            {isEditingLabor ? (
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, color: 'var(--tx3)' }}>+ Ad-hoc labour (KSh)</span>
                <input
                  type="number"
                  autoFocus
                  value={adhocLaborCost}
                  onChange={e => setAdhocLaborCost(Math.max(0, Number(e.target.value) || 0))}
                  style={{ width: 70, padding: '4px 6px', borderRadius: 6, border: `1px solid ${ACC_BORDER}`, background: 'var(--sf)', fontSize: 10, fontFamily: 'inherit' }}
                />
                <button
                  type="button"
                  onClick={() => setIsEditingLabor(false)}
                  style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Done
                </button>
              </div>
            ) : adhocLaborCost > 0 ? (
              <div style={{ fontSize: 9, color: ACC, marginTop: 2 }}>+ {fmt(currencySymbol, adhocLaborCost)} ad-hoc labour added</div>
            ) : null}
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>≈ {fmt(currencySymbol, staffCostPerJerrycan)}/jerrycan</div>
          </div>
          <div>
            <div style={{ marginBottom: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              Electricity
              {!isEditingElectricity && !isElectricityAmended && (
                <button
                  type="button"
                  onClick={() => { setIsEditingElectricity(true) }}
                  style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Edit
                </button>
              )}
            </div>
            {isElectricityAmended && !isEditingElectricity ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: ACC }}>{fmt(currencySymbol, electricityOverride!)} <span style={{ fontSize: 9, fontWeight: 400, color: 'var(--tx3)' }}>manually set</span></div>
                <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                  <button type="button" onClick={() => setIsEditingElectricity(true)} style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Edit</button>
                  <button type="button" onClick={() => setElectricityOverride(null)} style={{ fontSize: 9, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Reset to formula ({fmt(currencySymbol, formulaElectricity)})</button>
                </div>
              </>
            ) : isEditingElectricity ? (
              <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, color: 'var(--tx3)' }}>Actual cost (KSh)</span>
                <input
                  type="number"
                  autoFocus
                  value={electricityOverride ?? Math.round(formulaElectricity)}
                  onChange={e => setElectricityOverride(Math.max(0, Number(e.target.value) || 0))}
                  style={{ width: 80, padding: '4px 6px', borderRadius: 6, border: `1px solid ${ACC_BORDER}`, background: 'var(--sf)', fontSize: 10, fontFamily: 'inherit' }}
                />
                <button
                  type="button"
                  onClick={() => { if (electricityOverride == null) setElectricityOverride(Math.round(formulaElectricity)); setIsEditingElectricity(false) }}
                  style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>{MACHINES.length} machines, {totalMachineKW.toFixed(1)} kW combined, {MOTOR_HOURS_PER_DAY}h/day @ {ELECTRICITY_RATE_PER_KWH} KSh/kWh</div>
            )}
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>≈ {fmt(currencySymbol, electricityCostPerJerrycan)}/jerrycan</div>
          </div>
          <div>
            <div style={{ marginBottom: 2, fontWeight: 600 }}>Seeds (Material)</div>
            <div>From intake_arrival prices, net of wastage</div>
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{fmt(currencySymbol, totalMaterialCost)} across {fmtInt(jerrycansProduced)} jerrycans (excl. {fmt(currencySymbol, wastageQtyTotal * avgSeedCostPerKg)} wasted seed cost)</div>
          </div>
          <div>
            <div style={{ marginBottom: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              Overhead
              {!isEditingOverhead && (
                <button
                  type="button"
                  onClick={() => setIsEditingOverhead(true)}
                  style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Edit
                </button>
              )}
            </div>
            {isEditingOverhead ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, color: 'var(--tx3)' }}>KSh</span>
                <input
                  type="number"
                  autoFocus
                  value={overheadOverride}
                  onChange={e => setOverheadOverride(Math.max(0, Number(e.target.value) || 0))}
                  style={{ width: 80, padding: '4px 6px', borderRadius: 6, border: `1px solid ${ACC_BORDER}`, background: 'var(--sf)', fontSize: 10, fontFamily: 'inherit' }}
                />
                <button
                  type="button"
                  onClick={() => setIsEditingOverhead(false)}
                  style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>{totalOverhead > 0 ? 'Manually set' : 'Not tracked — no maintenance/misc-cost captures'}</div>
            )}
            <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{fmt(currencySymbol, totalOverhead)} total{totalOverhead > 0 && jerrycansProduced > 0 ? ` (${fmt(currencySymbol, overheadPerJerrycan)}/jerrycan)` : ''}</div>
          </div>
          <div>
            <div style={{ marginBottom: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              Wastage Sale Price (per kg)
              {!isWastePriceAmended && (
                <button
                  type="button"
                  onClick={() => setWastagePriceOverride(computedWastePricePerKg)}
                  style={{ fontSize: 9, fontWeight: 600, color: ACC, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Edit
                </button>
              )}
            </div>
            {isWastePriceAmended ? (
              <>
                <input
                  type="number"
                  autoFocus
                  value={wastagePriceOverride ?? 0}
                  onChange={e => setWastagePriceOverride(Math.max(0, Number(e.target.value) || 0))}
                  style={{ width: 70, padding: '4px 6px', borderRadius: 6, border: `1px solid ${ACC_BORDER}`, background: 'var(--sf)', fontSize: 10, fontFamily: 'inherit' }}
                />
                <button
                  type="button"
                  onClick={() => setWastagePriceOverride(null)}
                  style={{ marginLeft: 6, fontSize: 9, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  Reset to {usingActualWastePrice ? 'actual' : 'estimate'}
                </button>
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>
                  Manually set{usingActualWastePrice ? ` — actual avg is ${fmt(currencySymbol, actualWastePricePerKg)}` : ''}
                </div>
              </>
            ) : usingActualWastePrice ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>{fmt(currencySymbol, actualWastePricePerKg)}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>Actual avg from {fmtInt(wastageSoldQty)}kg sold via dispatch</div>
              </>
            ) : (
              <>
                <input
                  type="number"
                  value={wastagePerUnitCost}
                  onChange={e => setWastagePerUnitCost(Math.max(0, Number(e.target.value) || 0))}
                  style={{ width: 70, padding: '4px 6px', borderRadius: 6, border: `1px solid ${ACC_BORDER}`, background: 'var(--sf)', fontSize: 10, fontFamily: 'inherit' }}
                />
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>Estimate — no wastage sold yet (default 30 KSh/kg)</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <KpiCard
          label="Cost per 20L Jerrycan"
          value={dayJerrycansProduced > 0 ? fmt(currencySymbol, dayCostPerJerrycan) : '—'}
          sub={dayJerrycansProduced > 0 ? `${fmtInt(dayJerrycansProduced)} jerrycan${dayJerrycansProduced === 1 ? '' : 's'} · ${costingDayLabel.toLowerCase()}` : `No jerrycans packaged — ${costingDayLabel.toLowerCase()}`}
          accent={ACC}
          headerRight={
            <DaySwitcher
              label={costingDayLabel}
              loading={dayLoading}
              nextDisabled={costingDay === todayNairobi}
              onPrev={() => setCostingDay(d => shiftDayKey(d, -1))}
              onNext={() => setCostingDay(d => shiftDayKey(d, 1))}
            />
          }
          chart={dayJerrycansProduced > 0 ? [
            { label: 'Material', raw: dayMaterialPerCan, color: ACC },
            { label: 'Electricity', raw: dayElectricityPerCan, color: '#fbbf24' },
            { label: 'Overhead', raw: overheadPerJerrycan, color: '#a855f7' },
          ] : undefined}
          breakdown={dayJerrycansProduced > 0 ? [
            { label: 'Material', value: `${fmt(currencySymbol, dayMaterialPerCan)}/can` },
            { label: 'Electricity', value: `${fmt(currencySymbol, dayElectricityPerCan)}/can` },
            { label: 'Overhead', value: `${fmt(currencySymbol, overheadPerJerrycan)}/can (lifetime avg)` },
            { label: 'Cost per jerrycan', value: fmt(currencySymbol, dayCostPerJerrycan), strong: true },
          ] : [
            { label: 'Jerrycans packaged', value: '0' },
          ]}
          breakdownNote={dayJerrycansProduced > 0
            ? `${costingDayLabel} · ÷ ${fmtInt(dayJerrycansProduced)} jerrycans produced that day. Electricity uses the formula estimate (day-specific manual overrides aren't supported). Overhead shows the lifetime average per can — it has no date of its own. Labor excluded — offset by ~600kg/week of wastage byproduct sold at KSh30/kg.`
            : `No packaging captures logged for ${costingDayLabel.toLowerCase()}. Use ‹ to check an earlier day.`
          }
        />
        <KpiCard
          label={tc('pos_factory.totalProductionCost')} value={fmt(currencySymbol, totalProductionCost)} sub={`${fmtInt(jerrycansProduced)} jerrycans produced`} accent="var(--tx)"
          chart={[
            { label: 'Material', raw: totalMaterialCost, color: ACC },
            { label: 'Electricity', raw: totalElectricity, color: '#fbbf24' },
            { label: 'Overhead', raw: totalOverhead, color: '#a855f7' },
          ]}
          breakdown={[
            { label: 'Material', value: fmt(currencySymbol, totalMaterialCost) },
            { label: 'Electricity', value: fmt(currencySymbol, totalElectricity) },
            { label: 'Overhead', value: fmt(currencySymbol, totalOverhead) },
            { label: 'Total', value: fmt(currencySymbol, totalProductionCost), strong: true },
          ]}
          breakdownNote="Labor excluded (see Labor Cost card below for its own figure) — offset by wastage byproduct sales."
        />
        <KpiCard
          label={tc('pos_factory.materialCostLabel')} value={fmt(currencySymbol, totalMaterialCost)} sub="Excl. wasted-seed cost" accent="#3b82f6"
          chart={[
            { label: 'Net material', raw: totalMaterialCost, color: '#3b82f6' },
            { label: 'Wastage removed', raw: wastageQtyTotal * avgSeedCostPerKg, color: RED },
          ]}
          breakdown={[
            { label: 'Seed intake (all)', value: `${fmtInt(intakeQtyTotal)}kg` },
            { label: 'Avg. price/kg', value: `${fmt(currencySymbol, avgSeedCostPerKg)}/kg` },
            { label: 'Gross seed cost', value: fmt(currencySymbol, grossMaterialCost) },
            { label: 'Less wastage', value: `− ${fmt(currencySymbol, wastageQtyTotal * avgSeedCostPerKg)}` },
            { label: 'Net material cost', value: fmt(currencySymbol, totalMaterialCost), strong: true },
          ]}
          breakdownNote="Price sourced from intake_arrival captures; wastage removed at the same avg. price/kg."
        />
        <KpiCard
          label="Labor Cost" value={fmt(currencySymbol, totalLabor)} sub={`${fmt(currencySymbol, staffCostPerJerrycan)}/jerrycan`} accent="#60a5fa"
          chart={adhocLaborCost > 0 ? [
            { label: 'Base', raw: productionDays * staffCostPerDay, color: '#60a5fa' },
            { label: 'Ad-hoc', raw: adhocLaborCost, color: '#f59e0b' },
          ] : undefined}
          breakdown={[
            { label: 'Days active', value: `${fmtInt(productionDays)} days` },
            { label: 'Rate', value: `${fmt(currencySymbol, staffCostPerDay)}/day` },
            { label: 'Base labor', value: fmt(currencySymbol, productionDays * staffCostPerDay) },
            ...(adhocLaborCost > 0 ? [{ label: '+ Ad-hoc labour', value: fmt(currencySymbol, adhocLaborCost) }] : []),
            { label: 'Total', value: fmt(currencySymbol, totalLabor), strong: true },
          ]}
          breakdownNote="Days active = distinct calendar days (excl. Sundays) with any intake, output, packaging, or wastage capture logged."
        />
        <KpiCard
          label="Electricity Cost" value={fmt(currencySymbol, totalElectricity)} sub={isElectricityAmended ? `${fmt(currencySymbol, electricityCostPerJerrycan)}/jerrycan · manually set` : `${fmt(currencySymbol, electricityCostPerJerrycan)}/jerrycan @ ${MOTOR_HOURS_PER_DAY}h/day`} accent="#fbbf24"
          chart={isElectricityAmended ? [
            { label: 'Formula est.', raw: formulaElectricity, color: '#94a3b8' },
            { label: 'Manually set', raw: electricityOverride!, color: '#fbbf24' },
          ] : undefined}
          chartMode="compare"
          breakdown={isElectricityAmended ? [
            { label: 'Formula estimate', value: fmt(currencySymbol, formulaElectricity) },
            { label: 'Manually set to', value: fmt(currencySymbol, electricityOverride!), strong: true },
          ] : [
            ...MACHINES.map(m => ({ label: m.name, value: `${m.kw.toFixed(2)} kW` })),
            { label: 'Combined', value: `${totalMachineKW.toFixed(2)} kW`, strong: true },
            { label: 'Hours/day', value: `${MOTOR_HOURS_PER_DAY}h` },
            { label: 'Rate', value: `${ELECTRICITY_RATE_PER_KWH} KSh/kWh` },
            { label: 'Cost/day', value: fmt(currencySymbol, electricityCostPerDay) },
            { label: 'Days active', value: `${fmtInt(productionDays)} days` },
            { label: 'Total', value: fmt(currencySymbol, totalElectricity), strong: true },
          ]}
          breakdownNote={isElectricityAmended ? "Overridden — click Edit on the Electricity card above to change or reset." : `Assumes the motor runs the full ${MOTOR_HOURS_PER_DAY}h on every active day — click Edit on the Electricity card above if that overstates real usage.`}
        />
        <KpiCard
          label="Overhead Cost" value={fmt(currencySymbol, totalOverhead)} sub={totalOverhead > 0 ? `${fmt(currencySymbol, overheadPerJerrycan)}/jerrycan` : "Not set — defaults to KSh0"} accent="#a855f7"
          breakdown={[
            { label: 'Overhead', value: fmt(currencySymbol, totalOverhead), strong: true },
            { label: 'Per jerrycan', value: `${fmt(currencySymbol, overheadPerJerrycan)}/can` },
          ]}
          breakdownNote="No formula behind this — oil changes, filters, maintenance, and misc equipment costs aren't tracked as captures, so this stays KSh0 until you enter a real number below."
        />
        <KpiCard
          label="Wastage Sale Value (in stock)" value={fmt(currencySymbol, wasteSaleValue)} sub={`${fmtInt(wastageInStockQty)}kg unsold @ ${isWastePriceAmended ? 'amended' : usingActualWastePrice ? 'actual' : 'estimated'} ${fmt(currencySymbol, effectiveWastePricePerKg)}/kg`} accent={GREEN}
          chart={[
            { label: 'In stock', raw: wastageInStockQty, color: GREEN },
            { label: 'Already sold', raw: wastageSoldQty, color: '#94a3b8' },
          ]}
          breakdown={[
            { label: 'Total wastage', value: `${fmtInt(wastageQtyTotal)}kg` },
            { label: 'Already sold', value: `${fmtInt(wastageSoldQty)}kg` },
            { label: 'In stock', value: `${fmtInt(wastageInStockQty)}kg` },
            { label: 'Price/kg', value: `${fmt(currencySymbol, effectiveWastePricePerKg)}/kg` },
            { label: 'Sale value', value: fmt(currencySymbol, wasteSaleValue), strong: true },
          ]}
        />
        <KpiCard
          label="Wastage: Net Position"
          value={`${netWastagePosition >= 0 ? '+' : '−'}${fmt(currencySymbol, Math.abs(netWastagePosition))}`}
          sub={netWastagePosition >= 0 ? 'Byproduct sales are covering the loss' : 'Byproduct sales not yet covering the loss'}
          accent={netWastagePosition >= 0 ? GREEN : RED}
          chart={[
            { label: 'Wastage cost', raw: wastageCostTotal, color: RED },
            { label: 'Revenue recovered', raw: wasteSaleRevenue, color: GREEN },
            { label: 'Value in stock', raw: wasteSaleValue, color: '#94a3b8' },
          ]}
          chartMode="compare"
          breakdown={[
            { label: 'Seed lost to wastage', value: `− ${fmt(currencySymbol, wastageCostTotal)}` },
            { label: 'Revenue recovered (sold)', value: `+ ${fmt(currencySymbol, wasteSaleRevenue)}` },
            { label: 'Value in stock (unsold)', value: `+ ${fmt(currencySymbol, wasteSaleValue)}` },
            { label: 'Net position', value: `${netWastagePosition >= 0 ? '+' : '−'}${fmt(currencySymbol, Math.abs(netWastagePosition))}`, strong: true },
          ]}
          breakdownNote="Ties together two numbers that live separately elsewhere on this page: Material Cost's 'Less wastage' deduction (the cost) and Wastage Sale Value (the recovery) — not netted against each other anywhere else."
        />
      </div>

      {/* Material cost breakdown pie */}
      <Section title={tc('pos_factory.costComponentBreakdown')}>
        <PieChart slices={pieSlices} currencySymbol={currencySymbol} />
      </Section>

      {/* Cost per unit trend */}
      <Section title={tc('pos_factory.costPerUnitTrend')}>
        {costTrend.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noTrendData')}</div>
        ) : (
          <LineChart points={costTrend} color={ACC} yLabel={tc('pos_factory.costPerUnitLabel', { symbol: currencySymbol })} formatY={(n) => fmt(currencySymbol, n)} />
        )}
      </Section>

      {excludedOutputUnits.count > 0 && (
        <div style={{ fontSize: 10, color: 'var(--tx3)', marginBottom: 8 }}>
          Note: {excludedOutputUnits.count} output record{excludedOutputUnits.count === 1 ? '' : 's'} ({fmtInt(excludedOutputUnits.qty)} units logged in an unrecognized unit — pcs/200g, whose own notes suggest they meant 20L jerrycans, not that literal unit) are excluded from the two tables below until corrected in the Production log.
        </div>
      )}

      {/* Standard vs Actual */}
      <Section title={tc('pos_factory.stdVsActualTitle')}>
        {stdVsActual.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noMaterialCostData')}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colStandardSellRef')} align="right" /><Th label={tc('pos_factory.colActualPerUnit')} align="right" /><Th label={tc('pos_factory.colVariance')} align="right" />
              </tr></thead>
              <tbody>
                {stdVsActual.map(r => (
                  <tr key={r.product}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.product}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{r.standard > 0 ? fmt(currencySymbol, r.standard) : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{fmt(currencySymbol, r.actualPerUnit)}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: r.standard === 0 ? 'var(--tx3)' : r.variance <= 0 ? GREEN : RED }}>
                      {r.standard === 0 ? '—' : `${r.variance > 0 ? '+' : ''}${fmt(currencySymbol, r.variance)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Margin analysis */}
      <Section title={tc('pos_factory.marginAnalysisTitle')}>
        {margins.length === 0 ? (
          <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{tc('pos_factory.noMarginData')}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead><tr>
                <Th label={tc('pos_factory.colProduct')} /><Th label={tc('pos_factory.colFullCostPerUnit')} align="right" /><Th label={tc('pos_factory.colSellingPrice')} align="right" /><Th label={tc('pos_factory.colMargin')} align="right" />
              </tr></thead>
              <tbody>
                {margins.map(r => (
                  <tr key={r.product}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{r.product}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      {fmt(currencySymbol, r.fullCost)}
                      {r.fullCostIsMaterialOnly && <span title="Material cost only — labor/electricity/overhead aren't allocated per unit for bulk (non-jerrycan) product yet" style={{ marginLeft: 4, color: 'var(--tx3)', cursor: 'help' }}>*</span>}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{r.hasSell ? fmt(currencySymbol, r.sell) : '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: !r.hasSell ? 'var(--tx3)' : r.margin >= 30 ? GREEN : r.margin >= 0 ? AMBER : RED }}>
                      {r.hasSell ? pct(r.margin) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {margins.some(r => r.fullCostIsMaterialOnly) && (
              <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 6 }}>* Material cost only — labor, electricity and overhead are currently allocated per 20L jerrycan, so they're only added for jerrycan-denominated rows.</div>
            )}
          </div>
        )}
      </Section>

      {/* Cost notes */}
      <div style={{ padding: 16, borderRadius: 12, border: '1px dashed var(--b)', background: 'var(--ev)', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--tx2)', marginBottom: 4 }}>Cost Per 20L Jerrycan</div>
        <div style={{ fontSize: 10, color: 'var(--tx3)', maxWidth: 500, margin: '0 auto', lineHeight: 1.5 }}>
          <div>Material cost from intake_arrival captures; electricity allocated based on actual 20L jerrycan output. Labor excluded from this figure — wastage byproduct sales already cover it as a separate income stream (see Labor Cost card for its own number).</div>
          <div style={{ marginTop: 8 }}>Overhead (oil changes, filters, maintenance, misc equipment costs) is KSh0 unless entered manually — edit it in Operating Costs above.</div>
          <div style={{ marginTop: 8 }}>Everything on this page is an all-time average. Use the ‹ › switcher on the Cost per 20L Jerrycan card above (and in its breakdown) to see one specific day instead.</div>
          <div style={{ marginTop: 8, fontSize: 9, fontStyle: 'italic' }}>Total 20L jerrycans produced: {fmtInt(jerrycansProduced)}</div>
        </div>
      </div>
    </div>
  )
}
