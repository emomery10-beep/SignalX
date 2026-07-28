// Shared currency conversion for the homepage's illustrative demo mockups
// (Zakat, Forecast, Offline, multi-language phone, etc). Every mock figure on
// the page is authored in KES magnitude; `money()` converts it to the
// visitor's real currency using the same static approximate rates everywhere,
// so no two sections disagree about what currency the visitor should see.
// Not a live FX feed — illustrative, like the rest of this demo data.

export type Fx = { sym: string; mult: number; dec?: boolean }

export const DEMO_FX: Record<string, Fx> = {
  GBP: { sym: '£', mult: 1, dec: true }, USD: { sym: '$', mult: 1.3, dec: true }, EUR: { sym: '€', mult: 1.2, dec: true },
  KES: { sym: 'KSh ', mult: 165 }, NGN: { sym: '₦', mult: 1950 }, UGX: { sym: 'USh ', mult: 4800 },
  TZS: { sym: 'TSh ', mult: 3300 }, GHS: { sym: '₵', mult: 16 }, ZAR: { sym: 'R ', mult: 24 }, ETB: { sym: 'Br ', mult: 75 },
  INR: { sym: '₹', mult: 110 }, AED: { sym: 'AED ', mult: 4.8, dec: true }, CAD: { sym: 'CA$', mult: 1.7, dec: true }, AUD: { sym: 'A$', mult: 1.9, dec: true },
}

export const KES_MULT = 165

export function fxFor(currency?: string): Fx {
  return DEMO_FX[currency || ''] || DEMO_FX.GBP
}

export function money(kesAmount: number, fx?: Fx): string {
  const amt = fx ? (kesAmount / KES_MULT) * fx.mult : kesAmount
  return (fx?.sym ?? 'KSh ') + Math.round(amt).toLocaleString('en-US')
}
