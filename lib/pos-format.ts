// ─────────────────────────────────────────────────────────────────────────────
// Shared money formatting for the POS analytics tabs (components/pos/*).
// Large-denomination currencies (African shillings, naira, birr) are shown on a
// POS without minor units — "KSh 5,950", not "KSh 5,950.00"; everything else
// (USD, GBP, EUR, …) keeps 2 decimals. Keyed by symbol because the components
// only receive currency_symbol, not the ISO code. Mirrors NO_DECIMAL_SYMBOLS in
// pos-askbiz/app/dashboard/page.tsx (separate app, can't share the module).
// ─────────────────────────────────────────────────────────────────────────────

export const NO_DECIMAL_SYMBOLS = new Set([
  // East / West / core African
  'KSh', 'USh', 'TSh', 'RF', 'FRw', '₦', 'Br', 'FCFA',
  // Rest of Africa (large-denomination, minor units unused on a POS)
  'E£', 'DA', 'SDG', 'MK', 'MT', 'Kz', 'FC', 'FG', 'Ar', 'Sh', 'Fdj', 'ZWL', 'ZK',
])

export function moneyDigits(symbol: string): number {
  return NO_DECIMAL_SYMBOLS.has(symbol) ? 0 : 2
}

/** Format an amount with its currency symbol.
 *  `space` (default true) inserts a gap after multi-letter alpha symbols
 *  ("KSh 1,631"); pass false to keep the symbol flush ("KSh1,631"). */
export function formatMoney(symbol: string, amount: number, opts?: { space?: boolean }): string {
  const digits = moneyDigits(symbol)
  const n = (Number.isFinite(amount) ? amount : 0).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  const space = (opts?.space ?? true) && symbol.length > 1 && /[a-zA-Z]$/.test(symbol)
  return `${symbol}${space ? ' ' : ''}${n}`
}
