'use client'
import { useState, useEffect, useMemo } from 'react'
import { useLang } from '@/components/LanguageProvider'
import type { ZakatResult } from '@/lib/zakat'

const ACCENT = '#22C55E'
const AMBER = '#F59E0B'
const HAWL_TOTAL_DAYS = 355

interface Charity {
  id: string
  name: string
  cause_category: string | null
  logo_url: string | null
  donate_url: string
}

function fmtMoney(n: number, sym: string) {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`
  return `${sym}${Math.round(n).toLocaleString()}`
}

function daysAgo(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

const TILE_INPUT_STYLE = {
  fontSize: 16, fontWeight: 600, color: 'var(--tx)', background: 'var(--sf)',
  border: '1px solid var(--b)', borderRadius: 6, padding: '4px 6px',
  fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' as const,
}

function EditableTile({ label, value, sym, tone, onCommit }: {
  label: string
  value: number
  sym: string
  tone?: 'negative'
  onCommit: (v: number | undefined) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const startEdit = () => { setDraft(String(value)); setEditing(true) }
  const commit = () => {
    const num = draft === '' ? undefined : Number(draft)
    onCommit(num !== undefined && !Number.isNaN(num) ? num : undefined)
    setEditing(false)
  }

  return (
    <div style={{ background: 'var(--ev)', borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
        {label}
      </div>
      {editing ? (
        <input
          autoFocus
          type="text"
          inputMode="decimal"
          value={draft}
          onChange={e => setDraft(e.target.value.replace(/[^0-9.]/g, ''))}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
          style={TILE_INPUT_STYLE}
        />
      ) : (
        <button
          onClick={startEdit}
          style={{
            fontSize: 16, fontWeight: 600, fontFamily: 'inherit',
            color: tone === 'negative' ? '#EF4444' : 'var(--tx)',
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
          }}
        >
          {tone === 'negative' && value > 0 ? '− ' : ''}{fmtMoney(value, sym)}
        </button>
      )}
    </div>
  )
}

export default function ZakatCalculator() {
  const { tc } = useLang()
  const [data, setData] = useState<ZakatResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [overrides, setOverrides] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [checkingPrice, setCheckingPrice] = useState(false)
  const [priceError, setPriceError] = useState<string | null>(null)
  const [charities, setCharities] = useState<Charity[]>([])

  useEffect(() => {
    fetch('/api/zakat')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false))

    fetch('/api/zakat/charities')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setCharities(d.charities || []))
      .catch(() => {})
  }, [])

  const breakdown = data?.breakdown

  const effective = useMemo(() => {
    if (!breakdown) return null
    return {
      cashValue: overrides.cashValue ?? breakdown.cashValue,
      inventoryValue: overrides.inventoryValue ?? breakdown.inventoryValue,
      receivablesValue: overrides.receivablesValue ?? breakdown.receivablesValue,
      payablesValue: overrides.payablesValue ?? breakdown.payablesValue,
    }
  }, [breakdown, overrides])

  const setOverride = (field: string, v: number | undefined) => {
    setOverrides(prev => {
      const next = { ...prev }
      if (v === undefined) delete next[field]
      else next[field] = v
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/zakat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrides }),
      })
      if (res.ok) {
        const result = await res.json()
        setData(result)
        setOverrides({})
        setSavedFlash(true)
        setTimeout(() => setSavedFlash(false), 2000)
      } else {
        const body = await res.json().catch(() => ({}))
        setSaveError(body?.error || tc('intel_zakat.saveError'))
      }
    } catch {
      setSaveError(tc('intel_zakat.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleCheckPrice = async () => {
    setCheckingPrice(true)
    setPriceError(null)
    try {
      const res = await fetch('/api/zakat/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metal: data?.nisab.metal || 'silver' }),
      })
      if (res.ok) {
        // The route already recomputes and returns the full zakat position
        // alongside the fresh price — no need for a separate GET /api/zakat.
        const { priceCheck, ...result } = await res.json()
        setData(result)
      } else {
        const body = await res.json().catch(() => ({}))
        setPriceError(body?.error || tc('intel_zakat.checkPriceError'))
      }
    } catch {
      setPriceError(tc('intel_zakat.checkPriceError'))
    } finally {
      setCheckingPrice(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 52, borderRadius: 12, background: 'var(--ev)', animation: 'pulse 1.5s infinite ease-in-out' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data || !breakdown || !effective) {
    return (
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)', fontSize: 13, color: 'var(--tx3)' }}>
        {tc('intel_zakat.loadError')}
      </div>
    )
  }

  const hasOverrides = Object.keys(overrides).length > 0
  const liveBase = Math.max(0, effective.cashValue + effective.inventoryValue + effective.receivablesValue - effective.payablesValue)
  const liveEstimate = liveBase * 0.025
  const sym = breakdown.currency
  const hawlPct = data.hawl.daysElapsed != null ? Math.min(100, Math.round((data.hawl.daysElapsed / HAWL_TOTAL_DAYS) * 100)) : 0

  const statusBadge = data.due
    ? { label: tc('intel_zakat.dueNow'), color: AMBER, bg: 'rgba(245,158,11,.1)' }
    : data.aboveNisab
      ? { label: tc('intel_zakat.accruing'), color: ACCENT, bg: 'rgba(34,197,94,.1)' }
      : data.nisabKnown
        ? { label: tc('intel_zakat.belowNisab'), color: 'var(--tx3)', bg: 'var(--ev)' }
        : { label: tc('intel_zakat.checkToBegin'), color: 'var(--tx3)', bg: 'var(--ev)' }

  const metalLabel = tc(data.nisab.metal === 'gold' ? 'intel_zakat.metalGold' : 'intel_zakat.metalSilver')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ padding: '16px 18px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, background: ACCENT }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)', letterSpacing: '.02em' }}>{tc('intel_zakat.title')}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 4 }}>{tc('intel_zakat.amountDueLabel')}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--tx)', fontFamily: 'var(--font-sora, inherit)' }}>
              {fmtMoney(data.due ? data.amountDue : liveEstimate, sym)}
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: statusBadge.color, background: statusBadge.bg, borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap' }}>
            {statusBadge.label}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 14 }}>
          <EditableTile label={tc('intel_zakat.inventoryLabel')} value={effective.inventoryValue} sym={sym} onCommit={v => setOverride('inventoryValue', v)} />
          <EditableTile label={tc('intel_zakat.cashLabel')} value={effective.cashValue} sym={sym} onCommit={v => setOverride('cashValue', v)} />
          <EditableTile label={tc('intel_zakat.receivablesLabel')} value={effective.receivablesValue} sym={sym} onCommit={v => setOverride('receivablesValue', v)} />
          <EditableTile label={tc('intel_zakat.payablesLabel')} value={effective.payablesValue} sym={sym} tone="negative" onCommit={v => setOverride('payablesValue', v)} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--b)', paddingTop: 12, marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('intel_zakat.estimateLabel')}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{fmtMoney(liveEstimate, sym)}</span>
        </div>

        <div style={{ borderTop: '1px solid var(--b)', paddingTop: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--tx3)' }}>
              {data.hawl.active
                ? tc('intel_zakat.hawlProgress', { elapsed: data.hawl.daysElapsed ?? 0, total: HAWL_TOTAL_DAYS })
                : tc('intel_zakat.hawlNotStarted')}
            </span>
            {data.hawl.dueDate && (
              <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{tc('intel_zakat.hawlDue', { date: data.hawl.dueDate })}</span>
            )}
          </div>
          {data.hawl.active && (
            <div style={{ height: 6, background: 'var(--ev)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${hawlPct}%`, background: ACCENT, transition: 'width 300ms' }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--b)', paddingTop: 12, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 12, color: 'var(--tx3)' }}>
            {tc('intel_zakat.nisabLabel', { metal: metalLabel })}
            {': '}
            {data.nisab.cachedValue != null ? fmtMoney(data.nisab.cachedValue, sym) : '—'}
            {' · '}
            {data.nisab.checkedAt
              ? (daysAgo(data.nisab.checkedAt) < 1 ? tc('intel_zakat.checkedJustNow') : tc('intel_zakat.checkedDaysAgo', { n: daysAgo(data.nisab.checkedAt) }))
              : tc('intel_zakat.neverChecked')}
          </div>
          <button
            onClick={handleCheckPrice}
            disabled={checkingPrice}
            style={{
              fontSize: 12, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--b)',
              background: 'transparent', color: 'var(--tx)', cursor: checkingPrice ? 'default' : 'pointer',
              fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: checkingPrice ? 0.6 : 1,
            }}
          >
            {checkingPrice ? tc('intel_zakat.checkingPrice') : tc('intel_zakat.checkPriceButton')}
          </button>
        </div>
        {priceError && (
          <div style={{ fontSize: 11, color: '#EF4444', marginTop: 8 }}>{priceError}</div>
        )}

        {(hasOverrides || savedFlash) && (
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSave}
              disabled={saving || !hasOverrides}
              style={{
                fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 8, border: 'none',
                background: savedFlash ? 'rgba(34,197,94,.12)' : ACCENT,
                color: savedFlash ? ACCENT : '#fff',
                cursor: saving || !hasOverrides ? 'default' : 'pointer', fontFamily: 'inherit',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {savedFlash ? tc('intel_zakat.saved') : saving ? tc('intel_zakat.saving') : tc('intel_zakat.saveCalculation')}
            </button>
          </div>
        )}
        {saveError && (
          <div style={{ fontSize: 11, color: '#EF4444', marginTop: 8, textAlign: 'right' }}>{saveError}</div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 12, color: 'var(--tx3)', marginBottom: 10 }}>{tc('intel_zakat.charitiesHeading')}</div>
        {charities.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--tx3)', padding: '12px 0' }}>{tc('intel_zakat.noCharities')}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {charities.map(c => (
              <a
                key={c.id}
                href={c.donate_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--b)',
                  background: 'var(--sf)', textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {c.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.logo_url} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                      🤲
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                    {c.cause_category && <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{c.cause_category}</div>}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{tc('intel_zakat.donateLink')} →</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
