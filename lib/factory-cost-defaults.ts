// Country- and type-aware starting assumptions for factory labour and electricity.
//
// Only a Kenyan sesame oil factory is pre-filled: those numbers were confirmed by the owner (Kenyan
// labour rate, KPLC CI1 three-phase tariff, the installed machine list). Every
// other country starts UNSET — we do not guess another country's wages or
// tariffs, and we never fall back to Kenya's. Unset means labour/electricity
// are left out of factory cost and the CFO flags the cost as incomplete until
// the owner enters their own figures.
import type { FactoryCostSettings } from '@/lib/factory-financials'

// Kenya: 2,400 KSh/day staff; 11.2 kW of machines × 9 h × 13.44 KSh/kWh.
const KENYA: FactoryCostSettings = {
  configured: true,
  staffPerDay: 2400,
  electricityPerDay: Math.round((10 * 0.746 + 1 * 0.746 + 3) * 9 * 13.44),
  overhead: 0,
}

const UNSET: FactoryCostSettings = { configured: false, staffPerDay: 0, electricityPerDay: 0, overhead: 0 }

// The Kenya numbers (labour rate, press machines) were confirmed for the owner's
// own sesame oil line, so they only pre-fill a Kenyan SESAME factory. Any other
// factory type — and any other country — starts unset until its owner enters
// their own rates.
export function factoryCostDefaultsFor(countryCode: string | null | undefined, factoryType?: string | null): FactoryCostSettings {
  return (countryCode || '').toUpperCase() === 'KE' && factoryType === 'sesame_oil' ? { ...KENYA } : { ...UNSET }
}
