import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { hasPermission } from '@/lib/pos-permissions'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// Maps audit log event names → which sector they belong to
const EVENT_SECTOR: Record<string, string> = {
  'job.created':         'repair',
  'job.status_change':   'repair',
  'job.updated':         'repair',
  'job.part_added':      'repair',
  'job.part_removed':    'repair',
  'job.photo_uploaded':  'repair',
  'job.device_scanned':  'repair',
  'capture.submitted':   'factory',
  'capture.approved':    'factory',
  'capture.rejected':    'factory',
  'transaction.refund':  'mixed',   // sector from cashier
  'transaction.amended': 'mixed',
  'inventory.adjusted':  'retail',
  'inventory.restocked': 'retail',
  'staff.created':       'all',
  'staff.updated':       'all',
  'staff.deactivated':   'all',
  'staff.pin_changed':   'all',
  'shift.opened':        'all',
  'shift.closed':        'all',
}

export type UnifiedAuditEvent = {
  id:           string
  source:       'audit_log' | 'job_history' | 'parcel_history'
  sector:       string
  event:        string
  title:        string
  detail:       string
  actor:        string | null
  actor_role:   string | null
  from_value:   string | null
  to_value:     string | null
  entity_id:    string | null
  entity_ref:   string | null   // job number, tracking number, etc.
  metadata:     Record<string, unknown>
  severity:     'high' | 'medium' | 'low' | 'info'
  created_at:   string
}

function severityFromEvent(event: string, meta: Record<string, unknown>): 'high' | 'medium' | 'low' | 'info' {
  if (event === 'transaction.refund')    return 'high'
  if (event === 'transaction.amended')   return 'high'
  if (event === 'capture.rejected')      return 'high'
  if (event === 'staff.deactivated')     return 'high'
  if (event === 'job.status_change') {
    const to = String(meta?.to_status || '')
    if (to === 'completed' || to === 'collected') return 'info'
    if (to === 'in_progress') return 'medium'
    return 'low'
  }
  if (event === 'capture.approved')      return 'info'
  if (event === 'capture.submitted')     return 'medium'
  if (event === 'inventory.adjusted')    return 'medium'
  if (event === 'job.part_added' || event === 'job.part_removed') return 'low'
  if (event === 'staff.created')         return 'info'
  if (event === 'shift.opened' || event === 'shift.closed') return 'info'
  return 'low'
}

function titleFromEvent(event: string, meta: Record<string, unknown>, from: string | null, to: string | null): string {
  switch (event) {
    case 'transaction.refund':   return `Refund issued${meta?.full_refund ? ' (full)' : ' (partial)'}`
    case 'transaction.amended':  return 'Transaction amended'
    case 'job.created':          return 'Repair job created'
    case 'job.status_change':    return `Job status → ${to || ''}`
    case 'job.updated':          return 'Job details updated'
    case 'job.part_added':       return `Part added — ${meta?.part_name || to || ''}`
    case 'job.part_removed':     return `Part removed — ${meta?.part_name || from || ''}`
    case 'job.photo_uploaded':   return 'Job photo uploaded'
    case 'job.device_scanned':   return 'Device barcode scanned'
    case 'capture.submitted':    return `${String(meta?.capture_type || 'Capture')} submitted`
    case 'capture.approved':     return `${String(meta?.capture_type || 'Capture')} approved`
    case 'capture.rejected':     return `${String(meta?.capture_type || 'Capture')} rejected`
    case 'inventory.adjusted':   return `Stock adjusted — ${meta?.product_name || to || ''}`
    case 'inventory.restocked':  return `Restocked — ${meta?.product_name || to || ''}`
    case 'staff.created':        return `Staff added — ${meta?.staff_name || to || ''}`
    case 'staff.updated':        return `Staff profile updated — ${meta?.staff_name || ''}`
    case 'staff.deactivated':    return `Staff deactivated — ${meta?.staff_name || ''}`
    case 'staff.pin_changed':    return 'PIN changed'
    case 'shift.opened':         return 'Shift opened'
    case 'shift.closed':         return `Shift closed${meta?.total ? ` — ${meta.total}` : ''}`
    default:                     return event.replace('.', ' — ')
  }
}

function detailFromEvent(event: string, meta: Record<string, unknown>, from: string | null, to: string | null): string {
  switch (event) {
    case 'transaction.refund':
      return [
        meta?.refund_reason ? `Reason: ${meta.refund_reason}` : null,
        meta?.item_count    ? `${meta.item_count} item(s)` : null,
        meta?.approved_by   ? `Approved by ${meta.approved_by}` : null,
      ].filter(Boolean).join(' · ') || 'No reason recorded'
    case 'transaction.amended':
      return from && to ? `${from} → ${to}` : (meta?.amended_reason ? String(meta.amended_reason) : 'No reason recorded')
    case 'job.status_change':
      return `${from || '?'} → ${to || '?'}${meta?.notes ? ` · ${meta.notes}` : ''}`
    case 'capture.rejected':
      return meta?.reason ? `Rejection reason: ${meta.reason}` : 'No reason given'
    case 'capture.submitted':
      return [
        meta?.product_name ? String(meta.product_name) : null,
        meta?.quantity      ? `Qty: ${meta.quantity}` : null,
        meta?.batch_ref     ? `Batch: ${meta.batch_ref}` : null,
      ].filter(Boolean).join(' · ') || ''
    case 'capture.approved':
      return meta?.product_name ? `${meta.product_name}${meta?.quantity ? ` · Qty: ${meta.quantity}` : ''}` : ''
    case 'inventory.adjusted':
      return from && to ? `${from} → ${to} units` : (meta?.reason ? String(meta.reason) : '')
    case 'inventory.restocked':
      return to ? `+${to} units added` : ''
    case 'shift.closed':
      return [
        meta?.cash_total    ? `Cash: ${meta.cash_total}` : null,
        meta?.card_total    ? `Card: ${meta.card_total}` : null,
        meta?.transaction_count ? `${meta.transaction_count} transactions` : null,
      ].filter(Boolean).join(' · ') || ''
    default:
      return ''
  }
}

// GET /api/pos/audit-unified
// ?sector=retail|repair|factory|logistics|salon|restaurant|all
// &event_group=transactions|jobs|captures|inventory|staff|deliveries|all
// &date=YYYY-MM-DD  &page=0  &limit=50
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return json({ error: 'Unauthorised' }, 401)
  if (!hasPermission(auth.role, 'reports.view')) {
    return json({ error: 'Requires manager or owner access' }, 403)
  }

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const sector     = searchParams.get('sector')     || 'all'
  const eventGroup = searchParams.get('event_group') || 'all'
  const date       = searchParams.get('date')
  const page       = Math.max(0, parseInt(searchParams.get('page')  || '0'))
  const limit      = Math.min(100, parseInt(searchParams.get('limit') || '50'))

  const events: UnifiedAuditEvent[] = []

  // ── 1. pos_audit_log ─────────────────────────────────────
  const shouldFetchAuditLog = ['all', 'transactions', 'jobs', 'captures', 'inventory', 'staff'].includes(eventGroup)
  const shouldFetchDeliveries = eventGroup === 'all' || eventGroup === 'deliveries'

  if (shouldFetchAuditLog) {
    let q = service
      .from('pos_audit_log')
      .select('*')
      .eq('owner_id', auth.ownerId)
      .order('created_at', { ascending: false })
      .limit(date ? 200 : 500)  // wider window when no date filter

    if (date) {
      q = q.gte('created_at', `${date}T00:00:00.000Z`).lt('created_at', `${date}T23:59:59.999Z`)
    }

    // Filter by event group
    if (eventGroup === 'transactions') q = q.in('event', ['transaction.refund', 'transaction.amended'])
    if (eventGroup === 'jobs')        q = q.in('event', ['job.created','job.status_change','job.updated','job.part_added','job.part_removed','job.photo_uploaded','job.device_scanned'])
    if (eventGroup === 'captures')    q = q.in('event', ['capture.submitted','capture.approved','capture.rejected'])
    if (eventGroup === 'inventory')   q = q.in('event', ['inventory.adjusted','inventory.restocked'])
    if (eventGroup === 'staff')       q = q.in('event', ['staff.created','staff.updated','staff.deactivated','staff.pin_changed','shift.opened','shift.closed'])

    // Sector filter for known-sector events
    if (sector !== 'all') {
      const sectorEvents = Object.entries(EVENT_SECTOR)
        .filter(([, s]) => s === sector || s === 'all' || s === 'mixed')
        .map(([e]) => e)
      q = q.in('event', sectorEvents)
    }

    const { data: logRows } = await q
    for (const row of logRows || []) {
      const meta = (row.metadata || {}) as Record<string, unknown>
      const eventSector = EVENT_SECTOR[row.event] || 'all'
      // For mixed-sector events (transactions), use metadata sector if available
      const resolvedSector = eventSector === 'mixed' ? (String(meta?.cashier_sector || 'retail')) : eventSector

      events.push({
        id:          row.id,
        source:      'audit_log',
        sector:      resolvedSector,
        event:       row.event,
        title:       titleFromEvent(row.event, meta, row.from_value, row.to_value),
        detail:      detailFromEvent(row.event, meta, row.from_value, row.to_value),
        actor:       row.staff_name || null,
        actor_role:  row.staff_role || null,
        from_value:  row.from_value || null,
        to_value:    row.to_value   || null,
        entity_id:   row.entity_id  || null,
        entity_ref:  null,
        metadata:    meta,
        severity:    severityFromEvent(row.event, meta),
        created_at:  row.created_at,
      })
    }
  }

  // ── 2. pos_service_job_history (repair) ──────────────────
  if ((sector === 'all' || sector === 'repair') && (eventGroup === 'all' || eventGroup === 'jobs')) {
    let q = service
      .from('pos_service_job_history')
      .select(`
        id, job_id, from_status, to_status, notes, metadata, created_at,
        changed_by:pos_staff!pos_service_job_history_changed_by_fkey(id, name, role),
        job:pos_service_jobs!pos_service_job_history_job_id_fkey(job_number, customer_name, device_type, owner_id)
      `)
      .order('created_at', { ascending: false })
      .limit(date ? 100 : 300)

    if (date) {
      q = q.gte('created_at', `${date}T00:00:00.000Z`).lt('created_at', `${date}T23:59:59.999Z`)
    }

    const { data: jobRows } = await q
    for (const row of (jobRows || []) as any[]) {
      if (!row.job || row.job.owner_id !== auth.ownerId) continue  // skip jobs not owned by this account
      const meta = (row.metadata || {}) as Record<string, unknown>
      const staffName = row.changed_by?.name || null
      const staffRole = row.changed_by?.role || null
      const jobRef = row.job?.job_number ? `#${row.job.job_number}` : null
      const device = row.job?.device_type || row.job?.customer_name || ''

      events.push({
        id:          row.id,
        source:      'job_history',
        sector:      'repair',
        event:       'job.status_change',
        title:       `Job ${jobRef || ''} — ${row.from_status || '?'} → ${row.to_status}`,
        detail:      [device, row.notes].filter(Boolean).join(' · '),
        actor:       staffName,
        actor_role:  staffRole,
        from_value:  row.from_status || null,
        to_value:    row.to_status,
        entity_id:   row.job_id,
        entity_ref:  jobRef,
        metadata:    meta,
        severity:    row.to_status === 'completed' || row.to_status === 'collected' ? 'info'
                   : row.to_status === 'in_progress' ? 'medium' : 'low',
        created_at:  row.created_at,
      })
    }
  }

  // ── 3. pos_parcel_history (logistics) ────────────────────
  if ((sector === 'all' || sector === 'logistics') && shouldFetchDeliveries) {
    let q = service
      .from('pos_parcel_history')
      .select(`
        id, parcel_id, from_status, to_status, notes, metadata, created_at,
        changed_by:pos_staff!pos_parcel_history_changed_by_fkey(id, name, role),
        parcel:pos_parcels!pos_parcel_history_parcel_id_fkey(tracking_number, recipient_name, destination_address, owner_id)
      `)
      .order('created_at', { ascending: false })
      .limit(date ? 100 : 300)

    if (date) {
      q = q.gte('created_at', `${date}T00:00:00.000Z`).lt('created_at', `${date}T23:59:59.999Z`)
    }

    const { data: parcelRows } = await q
    for (const row of (parcelRows || []) as any[]) {
      // Filter to this owner's parcels
      if (!row.parcel || row.parcel.owner_id !== auth.ownerId) continue
      const meta = (row.metadata || {}) as Record<string, unknown>
      const staffName = row.changed_by?.name || null
      const staffRole = row.changed_by?.role || null
      const trackingRef = row.parcel?.tracking_number ? `#${row.parcel.tracking_number}` : null
      const recipient = row.parcel?.recipient_name || ''
      const isFailure = row.to_status === 'failed_delivery' || row.to_status === 'returned'

      events.push({
        id:          row.id,
        source:      'parcel_history',
        sector:      'logistics',
        event:       `parcel.${row.to_status}`,
        title:       `Parcel ${trackingRef || ''} — ${(row.to_status || '').replace(/_/g, ' ')}`,
        detail:      [recipient, row.notes].filter(Boolean).join(' · '),
        actor:       staffName,
        actor_role:  staffRole,
        from_value:  row.from_status || null,
        to_value:    row.to_status,
        entity_id:   row.parcel_id,
        entity_ref:  trackingRef,
        metadata:    meta,
        severity:    isFailure ? 'high' : row.to_status === 'delivered' ? 'info' : 'low',
        created_at:  row.created_at,
      })
    }
  }

  // Sort all events newest-first, paginate
  events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const total   = events.length
  const paged   = events.slice(page * limit, (page + 1) * limit)

  return json({ events: paged, total, page, limit })
}
