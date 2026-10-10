// Country- and type-aware starting assumptions for factory labour and electricity.
//
// NOTE: identical copy lives in ../lib/factory-cost-defaults.ts (the root app) — the two
// apps are deployed separately. Change both together.
//
// Only a Kenyan sesame oil factory is pre-filled: those numbers were confirmed by the owner
// (Kenyan labour rate, KPLC CI1 three-phase tariff, the installed machine list). Every other
// country starts UNSET — we do not guess another country's wages or tariffs, and we never
// fall back to Kenya's. Unset means labour/electricity are left out of factory cost and the
// CFO flags the cost as incomplete until the owner enters their own figures.
export interface FactoryCostSettings {
  configured: boolean
  staffPerDay: number
  electricityPerDay: number
  overhead: number // per MONTH
}

// Kenya: 2,400 KSh/day staff; 11.2 kW of machines × 9 h × 13.44 KSh/kWh.
const KENYA: FactoryCostSettings = {
  configured: true,
  staffPerDay: 2400,
  electricityPerDay: Math.round((10 * 0.746 + 1 * 0.746 + 3) * 9 * 13.44),
  overhead: 0,
}

/** Working days in a month (Mon–Sat) — converts a monthly overhead into a per-working-day cost. */
export const WORKING_DAYS_PER_MONTH = 26

const UNSET: FactoryCostSettings = { configured: false, staffPerDay: 0, electricityPerDay: 0, overhead: 0 }

export function factoryCostDefaultsFor(countryCode: string | null | undefined, factoryType?: string | null): FactoryCostSettings {
  return (countryCode || '').toUpperCase() === 'KE' && factoryType === 'sesame_oil' ? { ...KENYA } : { ...UNSET }
}
