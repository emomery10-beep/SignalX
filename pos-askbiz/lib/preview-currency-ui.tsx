'use client'
// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW ONLY — React glue for preview-currency.ts: a hook that resolves the
// demo currency (geo-detected, overridable) and a compact market selector so
// the demo can be flipped between countries live (for sales/screenshots).
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import {
  type PreviewCurrency, MARKETS, detectPreviewCurrency, currencyToPreview,
} from './preview-currency'

export interface PreviewCurrencyControl extends PreviewCurrency {
  setCurrency: (currency: string) => void
}

/** Resolve the demo currency once (geo/override) and expose a setter so the
 *  selector can switch markets. Seeded lazily from detectPreviewCurrency so the
 *  very first render already shows the right currency — no post-mount flash. */
export function usePreviewCurrency(): PreviewCurrencyControl {
  const [state, setState] = useState<PreviewCurrency>(() => detectPreviewCurrency())
  return { ...state, setCurrency: (currency) => setState(currencyToPreview(currency)) }
}

/** Compact "🇰🇪 Kenya (KSh)" dropdown for the preview toolbars. */
export function CurrencySelect({ value, onChange }: { value: string; onChange: (currency: string) => void }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 'auto', fontSize: 13, color: '#555' }}>
      <span style={{ color: '#888' }}>Market</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '6px 10px', borderRadius: 9, fontSize: 13, fontFamily: 'inherit',
          border: '1px solid rgba(0,0,0,.12)', background: '#fff', color: '#1a1916', cursor: 'pointer',
        }}
      >
        {MARKETS.map(m => (
          <option key={m.code} value={m.currency}>
            {currencyToPreview(m.currency).flag} {m.label} ({currencyToPreview(m.currency).symbol})
          </option>
        ))}
      </select>
    </label>
  )
}
