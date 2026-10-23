// Shared request-body validation for the POS factory routes. Everything the client sends is untrusted:
// ids must belong to the caller's account, numbers must be real, text and photos must be bounded.
import type { PosAuthResult } from '@/lib/pos-auth'

export const MAX_QUANTITY = 10_000_000
export const MAX_MONEY = 1_000_000_000
// Base64 characters. ~8M ≈ 6 MB of image, above anything a phone camera upload should send after the
// client downscales it (Vercel's own body limit is lower still).
export const MAX_IMAGE_CHARS = 8_000_000

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Flat shapes (not discriminated unions): this project compiles without strictNullChecks, where `if (!r.ok)`
// would not narrow a union.
export interface Parsed<T> { ok: boolean; value: T; error: string }
export interface LocationResult { ok: boolean; locationId: string | null; error: string; status: number }

/** Empty / missing → null. Otherwise a finite number in [0, max]. */
export function parseOptionalAmount(v: unknown, field: string, max: number = MAX_QUANTITY): Parsed<number | null> {
  if (v === undefined || v === null || v === '') return { ok: true, value: null, error: '' }
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN
  if (!Number.isFinite(n) || n < 0 || n > max) return { ok: false, value: null, error: `${field} must be a number between 0 and ${max}` }
  return { ok: true, value: n, error: '' }
}

export function clipText(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t ? t.slice(0, max) : null
}

/** null when the image is acceptable, else a message. Checks size and that it really is a JPEG/PNG/WebP. */
export function imageProblem(image: unknown): string | null {
  if (typeof image !== 'string' || !image) return 'image required'
  if (image.length > MAX_IMAGE_CHARS) return 'image too large'
  const b64 = image.replace(/^data:image\/\w+;base64,/, '')
  let head: Buffer
  try { head = Buffer.from(b64.slice(0, 32), 'base64') } catch { return 'image invalid' }
  const jpeg = head[0] === 0xff && head[1] === 0xd8
  const png = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47
  const webp = head.slice(0, 4).toString('ascii') === 'RIFF' && head.slice(8, 12).toString('ascii') === 'WEBP'
  return jpeg || png || webp ? null : 'image must be a JPEG, PNG or WebP photo'
}

/**
 * The factory a request writes to. A location named in the body must belong to the caller's account, and
 * a staff member tied to a factory can only write to that one. Absent → falls back to the caller's own
 * (staff record / owner's selected factory), which is re-checked the same way.
 */
export async function resolveOwnedLocation(
  service: any,
  auth: PosAuthResult,
  bodyLocationId: unknown,
): Promise<LocationResult> {
  const fromBody = typeof bodyLocationId === 'string' && bodyLocationId ? bodyLocationId : null
  const wanted = fromBody ?? auth.locationId
  if (!wanted) return { ok: true, locationId: null, error: '', status: 200 }
  // An owner's selector value like 'all' is "no single factory", not an id; only a body value must be real.
  if (!UUID_RE.test(wanted)) return fromBody ? { ok: false, locationId: null, error: 'Unknown location', status: 400 } : { ok: true, locationId: null, error: '', status: 200 }
  if (auth.staffId && auth.locationId && wanted !== auth.locationId) {
    return { ok: false, locationId: null, error: 'You are not assigned to that factory', status: 403 }
  }
  const { data } = await service.from('pos_locations').select('id').eq('id', wanted).eq('owner_id', auth.ownerId).maybeSingle()
  if (!data) return { ok: false, locationId: null, error: 'Unknown location', status: 400 }
  return { ok: true, locationId: wanted, error: '', status: 200 }
}

/** A cash-register shift id sent by the client must be one of this account's shifts. */
export async function ownedShiftId(service: any, ownerId: string, shiftId: unknown): Promise<string | null> {
  if (typeof shiftId !== 'string' || !shiftId) return null
  const { data } = await service.from('pos_shifts').select('id').eq('id', shiftId).eq('owner_id', ownerId).maybeSingle()
  return data ? shiftId : null
}

/** Digits only for a party's phone (7-15 digits), else ''. */
export function normalisePartyPhone(v: unknown): string {
  const d = typeof v === 'string' ? v.replace(/\D/g, '') : ''
  return d.length >= 7 && d.length <= 15 ? d : ''
}
