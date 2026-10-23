// One-off: converts old factory photo rows to private references (sb://bucket/path), the format the API
// now signs on read (lib/factory-photos.ts).
//   * data:image/... base64 stored in the table  -> uploaded to the private bucket, row points at it
//   * plain / 10-year signed Supabase Storage URLs -> replaced by the reference to the same object
// Dry run by default: it only counts. Add --apply to write.
//
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/factory-photos-migrate.mjs
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/factory-photos-migrate.mjs --apply
//
// Safe to re-run: rows already converted are skipped. After a clean run, make the six factory buckets
// private in the Supabase dashboard (old public URLs stop working at that point, which is the goal).
import { createClient } from '@supabase/supabase-js'

const APPLY = process.argv.includes('--apply')
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'); process.exit(1) }
const db = createClient(url, key, { auth: { persistSession: false } })

// table, bucket, [photo column, storage-mode column | null]
const TARGETS = [
  ['pos_factory_captures', 'factory-captures', [['photo_url', 'storage']]],
  ['pos_factory_capture_holds', 'factory-captures', [['clearance_photo_url', null]]],
  ['pos_factory_batch_events', 'factory-batch-events', [['photo_url', 'storage']]],
  ['pos_factory_quality_checks', 'factory-quality-photos', [['photo_url', 'storage']]],
  ['pos_factory_production_shifts', 'factory-shift-photos', [['start_photo_url', 'start_storage'], ['end_photo_url', 'end_storage']]],
  ['pos_factory_downtime_events', 'factory-downtime-photos', [['start_photo_url', 'start_storage'], ['end_photo_url', 'end_storage']]],
  ['pos_factory_waybills', 'factory-waybill-photos', [['photo_url', 'storage']]],
]

const OBJ = /\/storage\/v1\/object\/(?:sign|public|authenticated)\/([^/]+)\/([^?]+)/
const totals = { data: 0, url: 0, skipped: 0, failed: 0 }

for (const [table, bucket, cols] of TARGETS) {
  for (const [col, storageCol] of cols) {
    let last = null
    for (;;) {
      let q = db.from(table).select(`id, owner_id, ${col}${storageCol ? `, ${storageCol}` : ''}`)
        .or(`${col}.like.data:image*,${col}.like.*/storage/v1/object/*`).order('id').limit(100)
      if (last) q = q.gt('id', last)
      const { data, error } = await q
      if (error) { console.error(`${table}.${col}: ${error.message} (skipping; table/column may not exist)`); break }
      if (!data?.length) break
      for (const row of data) {
        last = row.id
        const v = row[col]
        try {
          let ref = null
          if (typeof v === 'string' && v.startsWith('data:image')) {
            const b64 = v.replace(/^data:image\/\w+;base64,/, '')
            const path = `${row.owner_id}/migrated_${row.id}_${col}.jpg`
            if (APPLY) {
              const { error: upErr } = await db.storage.from(bucket).upload(path, Buffer.from(b64, 'base64'), { contentType: 'image/jpeg', upsert: true })
              if (upErr) throw upErr
            }
            ref = `sb://${bucket}/${path}`
            totals.data++
          } else {
            const m = typeof v === 'string' ? v.match(OBJ) : null
            if (!m) { totals.skipped++; continue }
            ref = `sb://${decodeURIComponent(m[1])}/${decodeURIComponent(m[2])}`
            totals.url++
          }
          if (APPLY) {
            const patch = { [col]: ref, ...(storageCol ? { [storageCol]: 'supabase' } : {}) }
            const { error: updErr } = await db.from(table).update(patch).eq('id', row.id)
            if (updErr) throw updErr
          }
        } catch (e) {
          totals.failed++
          console.error(`${table} ${row.id} ${col}: ${e.message || e}`)
        }
      }
    }
  }
}
console.log(APPLY ? 'APPLIED' : 'DRY RUN (nothing written)', totals)
