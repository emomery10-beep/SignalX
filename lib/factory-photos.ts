// Private storage for factory photos (captures, shifts, downtime, waybills, quality checks, batch events).
//
// Photos used to be saved with a 10-year signed URL written into the row — anyone who ever saw the URL
// kept access for a decade — and, if the upload failed, the whole image was stored as base64 inside the
// table (then returned by every list call). Now a row stores only a reference, `sb://<bucket>/<path>`,
// and every API response swaps it for a short-lived signed URL at read time. Old rows (plain URLs or
// data: URLs) pass through untouched until scripts/factory-photos-migrate.mjs converts them.
//
// NOTE: identical copy lives in lib/factory-photos.ts (root app) — the two apps are deployed
// separately. Change both together.

export const PHOTO_REF_PREFIX = 'sb://'
export const PHOTO_URL_TTL_SECONDS = 60 * 60 // 1 hour: enough for a screen, useless as a shared link

export const isPhotoRef = (v: unknown): v is string => typeof v === 'string' && v.startsWith(PHOTO_REF_PREFIX)

function splitRef(ref: string): { bucket: string; path: string } | null {
  const rest = ref.slice(PHOTO_REF_PREFIX.length)
  const i = rest.indexOf('/')
  return i > 0 && i < rest.length - 1 ? { bucket: rest.slice(0, i), path: rest.slice(i + 1) } : null
}

export interface StoredPhoto { ok: boolean; ref: string; error: string }

/**
 * Uploads a base64 / data-URL image into a PRIVATE bucket and returns its reference. A missing bucket is
 * created (private) and the upload retried once, so a fresh environment still works. Never falls back to
 * storing the image in the database: on failure the caller returns an error and the client retries
 * (the offline queue keeps the capture).
 */
export async function storeFactoryPhoto(service: any, bucket: string, ownerId: string, name: string, image: string): Promise<StoredPhoto> {
  const base64 = image.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')
  const path = `${ownerId}/${name}_${Date.now()}.jpg`
  const put = () => service.storage.from(bucket).upload(path, buffer, { contentType: 'image/jpeg', upsert: false })
  try {
    let { error } = await put()
    if (error) {
      await service.storage.createBucket(bucket, { public: false }).catch(() => null)
      ;({ error } = await put())
    }
    if (error) return { ok: false, ref: '', error: String(error.message || error) }
    return { ok: true, ref: `${PHOTO_REF_PREFIX}${bucket}/${path}`, error: '' }
  } catch (e: any) {
    return { ok: false, ref: '', error: String(e?.message || e) }
  }
}

/** A reference becomes a short-lived signed URL; anything else (legacy URL, data: URL, empty) is returned as is. */
export async function signPhotoRef(service: any, value: string | null | undefined): Promise<string | null> {
  if (!value) return value ?? null
  if (!isPhotoRef(value)) return value
  const parts = splitRef(value)
  if (!parts) return null
  const { data, error } = await service.storage.from(parts.bucket).createSignedUrl(parts.path, PHOTO_URL_TTL_SECONDS)
  return error || !data?.signedUrl ? null : data.signedUrl
}

/** Signs the named photo fields on a row or list of rows (one batched call per bucket). Returns new objects. */
export async function signPhotoFields<T extends Record<string, any>>(service: any, rows: T[], fields: string[]): Promise<T[]> {
  const byBucket = new Map<string, Set<string>>()
  for (const r of rows) for (const f of fields) {
    const v = r?.[f]
    if (!isPhotoRef(v)) continue
    const p = splitRef(v)
    if (!p) continue
    if (!byBucket.has(p.bucket)) byBucket.set(p.bucket, new Set())
    byBucket.get(p.bucket)!.add(p.path)
  }
  const signed = new Map<string, string>() // ref → url
  await Promise.all([...byBucket].map(async ([bucket, paths]) => {
    const list = [...paths]
    const { data } = await service.storage.from(bucket).createSignedUrls(list, PHOTO_URL_TTL_SECONDS)
    for (const d of data || []) if (d?.signedUrl && d.path) signed.set(`${PHOTO_REF_PREFIX}${bucket}/${d.path}`, d.signedUrl)
  }))
  return rows.map(r => {
    const copy: Record<string, any> = { ...r }
    for (const f of fields) if (isPhotoRef(copy[f])) copy[f] = signed.get(copy[f]) ?? null
    return copy as T
  })
}

/** Convenience for a single row. */
export async function signPhotoRow<T extends Record<string, any>>(service: any, row: T, fields: string[]): Promise<T> {
  return (await signPhotoFields(service, [row], fields))[0]
}

/**
 * Replaces every `sb://` photo reference anywhere inside an API payload (rows, nested joins, arrays) with a
 * short-lived signed URL. Returns a copy; non-reference values are untouched. Use on the way out of any
 * route that returns rows with photo columns, so no handler has to know which fields hold photos.
 */
export async function signPayload<T>(service: any, payload: T): Promise<T> {
  const refs = new Set<string>()
  const collect = (v: any, depth: number) => {
    if (depth > 6 || v === null || typeof v !== 'object') { if (isPhotoRef(v)) refs.add(v); return }
    for (const k of Object.keys(v)) collect(v[k], depth + 1)
  }
  collect(payload, 0)
  if (refs.size === 0) return payload

  const byBucket = new Map<string, string[]>()
  for (const r of refs) {
    const p = splitRef(r)
    if (!p) continue
    byBucket.set(p.bucket, [...(byBucket.get(p.bucket) || []), p.path])
  }
  const signed = new Map<string, string>()
  await Promise.all([...byBucket].map(async ([bucket, paths]) => {
    const { data } = await service.storage.from(bucket).createSignedUrls(paths, PHOTO_URL_TTL_SECONDS)
    for (const d of data || []) if (d?.signedUrl && d.path) signed.set(`${PHOTO_REF_PREFIX}${bucket}/${d.path}`, d.signedUrl)
  }))
  const swap = (v: any, depth: number): any => {
    if (isPhotoRef(v)) return signed.get(v) ?? null
    if (depth > 6 || v === null || typeof v !== 'object') return v
    if (Array.isArray(v)) return v.map(x => swap(x, depth + 1))
    const out: Record<string, any> = {}
    for (const k of Object.keys(v)) out[k] = swap(v[k], depth + 1)
    return out
  }
  return swap(payload, 0)
}
