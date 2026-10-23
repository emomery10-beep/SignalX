// Client-side holder for the factory's time zone, learned from the capture API (`time_zone` in its
// response). The Factory screens bucket captures into days with it, so "today" matches what the server and
// the CFO call today. Defaults to Nairobi until the first response arrives.
//
// NOTE: identical copy lives in pos-askbiz/lib/factory-tz-client.ts. Change both together.
import { DEFAULT_FACTORY_TZ, dayOfInZone } from '@/lib/factory-time'

let current = DEFAULT_FACTORY_TZ

export const getFactoryTz = (): string => current
export function setFactoryTz(tz: unknown) {
  if (typeof tz === 'string' && tz) current = tz
}
/** Calendar day (YYYY-MM-DD) of a date on the factory's clock. */
export const factoryDayKey = (d: string | Date): string => dayOfInZone(new Date(d).getTime(), current)
