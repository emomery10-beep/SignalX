// A dispatch's customer phone used to be squeezed into the `buyer_name` column. It now has its own
// column (customer_phone, migration 20261023000001), but the code must keep working in the window before
// that migration is applied, so every read and write goes through here.
import { cleanWhatsAppNumber } from '@/lib/factory-dispatch-whatsapp'

let cached: { ready: boolean; at: number } | null = null
const RECHECK_MS = 5 * 60 * 1000

/** True once pos_factory_captures.customer_phone exists. Cached; a "not yet" answer is rechecked every 5 minutes. */
export async function customerPhoneColumnReady(service: any): Promise<boolean> {
  if (cached && (cached.ready || Date.now() - cached.at < RECHECK_MS)) return cached.ready
  const { error } = await service.from('pos_factory_captures').select('customer_phone').limit(1)
  cached = { ready: !error, at: Date.now() }
  return cached.ready
}

/** Digits only, or '' when it cannot be a phone number (7–15 digits). */
export function normalisePhone(v: unknown): string {
  const d = cleanWhatsAppNumber(typeof v === 'string' ? v : '')
  return d.length >= 7 && d.length <= 15 ? d : ''
}

/** The customer's number for a capture, from the new column or, for older rows, the overloaded buyer_name. */
export function capturePhone(c: { customer_phone?: string | null; buyer_name?: string | null }): string {
  return normalisePhone(c.customer_phone) || normalisePhone(c.buyer_name)
}

/** Column(s) to write a phone into: its own column when it exists, else the legacy buyer_name. */
export async function phoneFields(service: any, phone: string): Promise<Record<string, string>> {
  if (!phone) return {}
  return (await customerPhoneColumnReady(service)) ? { customer_phone: phone } : { buyer_name: phone }
}
