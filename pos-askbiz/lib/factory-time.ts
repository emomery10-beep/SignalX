// Which calendar day a factory event belongs to. A factory's "day" is the day on its own clock: a capture
// logged at 9:30pm in Nairobi is already tomorrow in UTC, and a Lagos factory is an hour behind Nairobi.
// Every day-bucketing rule (daily output, working days, cost cycles, date filters, revenue dating) goes
// through here so they cannot disagree. IANA zones handle the odd ones for free (Egypt's DST, Morocco's
// Ramadan shift).
//
// NOTE: identical copy lives in pos-askbiz/lib/factory-time.ts — the two apps are deployed
// separately. Change both together.

export const DEFAULT_FACTORY_TZ = 'Africa/Nairobi'

const TZ_BY_COUNTRY: Record<string, string> = {
  KE: 'Africa/Nairobi', UG: 'Africa/Kampala', TZ: 'Africa/Dar_es_Salaam', RW: 'Africa/Kigali', BI: 'Africa/Bujumbura',
  ET: 'Africa/Addis_Ababa', SO: 'Africa/Mogadishu', DJ: 'Africa/Djibouti', ER: 'Africa/Asmara', SS: 'Africa/Juba', SD: 'Africa/Khartoum',
  NG: 'Africa/Lagos', GH: 'Africa/Accra', CI: 'Africa/Abidjan', SN: 'Africa/Dakar', ML: 'Africa/Bamako', BF: 'Africa/Ouagadougou',
  NE: 'Africa/Niamey', TG: 'Africa/Lome', BJ: 'Africa/Porto-Novo', GM: 'Africa/Banjul', GN: 'Africa/Conakry', SL: 'Africa/Freetown',
  LR: 'Africa/Monrovia', MR: 'Africa/Nouakchott', CV: 'Atlantic/Cape_Verde', ST: 'Africa/Sao_Tome',
  CM: 'Africa/Douala', GA: 'Africa/Libreville', GQ: 'Africa/Malabo', CF: 'Africa/Bangui', TD: 'Africa/Ndjamena', CG: 'Africa/Brazzaville',
  CD: 'Africa/Kinshasa', AO: 'Africa/Luanda',
  ZA: 'Africa/Johannesburg', LS: 'Africa/Maseru', SZ: 'Africa/Mbabane', BW: 'Africa/Gaborone', NA: 'Africa/Windhoek',
  ZM: 'Africa/Lusaka', ZW: 'Africa/Harare', MW: 'Africa/Blantyre', MZ: 'Africa/Maputo', MG: 'Indian/Antananarivo', MU: 'Indian/Mauritius',
  EG: 'Africa/Cairo', LY: 'Africa/Tripoli', TN: 'Africa/Tunis', DZ: 'Africa/Algiers', MA: 'Africa/Casablanca',
}

/** The factory's time zone for an ISO country code; unknown or missing → Nairobi (the historical default). */
export function factoryTimeZone(country?: string | null): string {
  return (country && TZ_BY_COUNTRY[country.trim().toUpperCase()]) || DEFAULT_FACTORY_TZ
}

const fmtCache = new Map<string, Intl.DateTimeFormat>()
function dayFormatter(tz: string): Intl.DateTimeFormat {
  let f = fmtCache.get(tz)
  if (!f) {
    // en-CA formats as YYYY-MM-DD.
    try { f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }) }
    catch { f = new Intl.DateTimeFormat('en-CA', { timeZone: DEFAULT_FACTORY_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }) }
    fmtCache.set(tz, f)
  }
  return f
}

/** Calendar day (YYYY-MM-DD) of an instant on the factory's clock. */
export function dayOfInZone(ms: number, tz: string = DEFAULT_FACTORY_TZ): string {
  return dayFormatter(tz).format(new Date(ms))
}

/** Offset of the zone from UTC at an instant, in ms (east positive). */
function offsetMs(ms: number, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(ms))
  const get = (t: string) => Number(parts.find(p => p.type === t)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  return asUtc - Math.floor(ms / 1000) * 1000
}

/** The instant the given factory-local day starts (00:00 on the factory's clock). */
export function zoneDayStart(day: string, tz: string = DEFAULT_FACTORY_TZ): Date {
  const guess = Date.parse(`${day}T00:00:00Z`)
  let start = guess - offsetMs(guess, tz)
  start = guess - offsetMs(start, tz) // second pass settles days that contain a DST change
  return new Date(start)
}

/** Start of the NEXT factory-local day: the exclusive upper bound for "everything on `day`". */
export function zoneDayEnd(day: string, tz: string = DEFAULT_FACTORY_TZ): Date {
  const next = new Date(Date.parse(`${day}T00:00:00Z`) + 36 * 3600 * 1000).toISOString().slice(0, 10)
  return zoneDayStart(next, tz)
}

/** The owner's factory time zone, from their profile country (currency KES as a fallback for older accounts). */
export async function ownerFactoryTimeZone(service: any, ownerId: string): Promise<string> {
  try {
    const { data } = await service.from('profiles').select('country_code, currency').eq('id', ownerId).maybeSingle()
    const country = data?.country_code || (data?.currency === 'KES' ? 'KE' : null)
    return factoryTimeZone(country)
  } catch {
    return DEFAULT_FACTORY_TZ
  }
}
