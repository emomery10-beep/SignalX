import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { resolvePosAuth } from '@/lib/pos-auth'
import { visionAI } from '@/lib/vision-ai'
import { logUsage } from '@/lib/log-usage'

// ============================================================
// /api/pos/customer-credit — deni (customer credit) tracking
//
// GET  ?owing=1              → customers with a balance, most-owed first
// GET  ?customer_id=X        → one customer + their full ledger history
// POST action:'payment'      → { customer_id, amount, note? } — they paid
// POST action:'opening'      → { name, phone?, amount } — one migrated debt
// POST action:'extract'      → { image } — read a debt-book photo → items[]
// POST action:'commit_import'→ { items:[{name,phone?,amount}] } — bulk opening
//
// Money-moving actions (payment / opening / commit_import) require
// manager-or-above; viewing and extraction (read-only) allow any staff.
// ============================================================

export const maxDuration = 60

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// "1,500" / "1500/=" / "KSh 1,500" -> 1500. Unreadable -> 0.
function parseAmount(v: unknown): number {
  if (typeof v === 'number' && isFinite(v)) return Math.max(0, v)
  if (typeof v !== 'string') return 0
  const n = parseFloat(v.replace(/[^\d.]/g, ''))
  return isFinite(n) ? Math.max(0, n) : 0
}

async function findOrCreateCustomer(
  service: ReturnType<typeof createServiceClient>,
  ownerId: string,
  name: string,
  phone: string,
): Promise<string | null> {
  const cleanPhone = phone.trim()
  const cleanName = name.trim()

  if (cleanPhone) {
    const { data: existing } = await service.from('pos_customers')
      .select('id').eq('owner_id', ownerId).eq('phone', cleanPhone).maybeSingle()
    if (existing) return existing.id
  } else if (cleanName) {
    // No phone (the common notebook case) — dedupe by exact name match only;
    // a fuzzy match risks merging two different people who share a name.
    const { data: existing } = await service.from('pos_customers')
      .select('id').eq('owner_id', ownerId).ilike('name', cleanName).is('phone', null).maybeSingle()
    if (existing) return existing.id
  }

  if (!cleanPhone && !cleanName) return null
  const { data: created, error } = await service.from('pos_customers')
    .insert({ owner_id: ownerId, name: cleanName || null, phone: cleanPhone || null })
    .select('id').single()
  if (error) { console.error('[customer-credit] create customer failed:', error.message); return null }
  return created.id
}

export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const service = createServiceClient()
  const { searchParams } = new URL(req.url)
  const customerId = searchParams.get('customer_id')

  if (customerId) {
    const { data: customer, error: custErr } = await service.from('pos_customers')
      .select('id, name, phone, balance_owed')
      .eq('owner_id', auth.ownerId).eq('id', customerId).maybeSingle()
    if (custErr) return NextResponse.json({ error: custErr.message }, { status: 500 })
    if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { data: ledger, error: ledgerErr } = await service.from('pos_customer_credit')
      .select('id, kind, amount, note, created_at')
      .eq('owner_id', auth.ownerId).eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    if (ledgerErr) return NextResponse.json({ error: ledgerErr.message }, { status: 500 })

    return NextResponse.json({ customer, ledger })
  }

  // Default / ?owing=1 — who owes money, most-owed first.
  const { data, error } = await service.from('pos_customers')
    .select('id, name, phone, balance_owed')
    .eq('owner_id', auth.ownerId)
    .gt('balance_owed', 0)
    .order('balance_owed', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ customers: data })
}

export async function POST(req: NextRequest) {
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const action = body?.action

  // Read-only extraction — any authenticated staff can snap a photo.
  if (action === 'extract') {
    const auth = await resolvePosAuth(req)
    if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const image = typeof body.image === 'string' ? body.image.replace(/^data:image\/\w+;base64,/, '') : ''
    if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })

    try {
      const result = await visionAI(image, `You are helping a shop owner move their customer credit book ("deni") into
a new app. This image is a page from that book — usually handwritten, one
line per customer: a name (sometimes a phone number) and an amount they owe.
It may be in English, Swahili, or another language.

TASK: read every distinct customer and the amount they owe.
- One entry per customer. Keep their name spelled as written.
- If a phone number is shown, include it as digits only. If not, leave it empty.
- Read the amount as a plain number (drop currency symbols/thousands
  separators; "1,500" -> 1500, "800/=" -> 800).
- Skip totals, dates, and anything that is not a person who owes money.
  Do not invent entries you cannot actually read.

Reply with ONLY valid JSON, no other text:
{"items":[{"name":"customer name","phone":"","amount":0}]}`, 2000)

      logUsage({ route: 'pos/customer-credit', model: result.model, usage: result.usage, userId: auth.ownerId })

      // The model sometimes returns a bare array instead of {"items":[...]}.
      const arr = result.text.match(/\[[\s\S]*\]/)
      const obj = result.text.match(/\{[\s\S]*\}/)
      let rawItems: unknown[] = []
      if (arr) { try { const p = JSON.parse(arr[0]); if (Array.isArray(p)) rawItems = p } catch { /* fall through */ } }
      if (rawItems.length === 0 && obj) { try { const p = JSON.parse(obj[0]); if (Array.isArray(p?.items)) rawItems = p.items } catch { /* fall through */ } }

      const seen = new Set<string>()
      const items: { name: string; phone: string; amount: number }[] = []
      for (const r of rawItems) {
        const name = String((r as any)?.name || '').trim().replace(/\s+/g, ' ')
        if (!name) continue
        const key = name.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        items.push({ name, phone: String((r as any)?.phone || '').replace(/[^\d+]/g, ''), amount: parseAmount((r as any)?.amount) })
        if (items.length >= 100) break
      }
      return NextResponse.json({ items })
    } catch (e) {
      console.error('[customer-credit] extract failed:', e)
      return NextResponse.json({ items: [] })
    }
  }

  // Everything below moves money — require manager or above.
  const auth = await resolvePosAuth(req, 'manager')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const service = createServiceClient()

  if (action === 'payment') {
    const amount = parseAmount(body.amount)
    const customerId = String(body.customer_id || '')
    if (!customerId || amount <= 0) return NextResponse.json({ error: 'customer_id and a positive amount are required' }, { status: 400 })

    const { error } = await service.from('pos_customer_credit').insert({
      owner_id: auth.ownerId, customer_id: customerId, kind: 'payment',
      amount, note: body.note || null, created_by: auth.staffId || auth.ownerId,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: customer } = await service.from('pos_customers').select('name, balance_owed').eq('id', customerId).maybeSingle()
    return NextResponse.json({ balance_owed: customer?.balance_owed ?? 0, name: customer?.name ?? null })
  }

  if (action === 'opening') {
    const amount = parseAmount(body.amount)
    const name = String(body.name || '').trim()
    const phone = String(body.phone || '').trim()
    if (!name && !phone) return NextResponse.json({ error: 'name or phone required' }, { status: 400 })
    if (amount <= 0) return NextResponse.json({ error: 'a positive amount is required' }, { status: 400 })

    const customerId = await findOrCreateCustomer(service, auth.ownerId, name, phone)
    if (!customerId) return NextResponse.json({ error: 'could not create customer' }, { status: 500 })

    const { error } = await service.from('pos_customer_credit').insert({
      owner_id: auth.ownerId, customer_id: customerId, kind: 'opening',
      amount, note: 'Migrated balance', created_by: auth.staffId || auth.ownerId,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ customer_id: customerId })
  }

  if (action === 'commit_import') {
    const list: unknown[] = Array.isArray(body.items) ? body.items : []
    if (list.length === 0) return NextResponse.json({ error: 'items array required' }, { status: 400 })

    let added = 0, skipped = 0
    for (const raw of list) {
      const name = String((raw as any)?.name || '').trim()
      const phone = String((raw as any)?.phone || '').trim()
      const amount = parseAmount((raw as any)?.amount)
      if ((!name && !phone) || amount <= 0) { skipped++; continue }

      const customerId = await findOrCreateCustomer(service, auth.ownerId, name, phone)
      if (!customerId) { skipped++; continue }

      const { error } = await service.from('pos_customer_credit').insert({
        owner_id: auth.ownerId, customer_id: customerId, kind: 'opening',
        amount, note: 'Migrated balance', created_by: auth.staffId || auth.ownerId,
      })
      if (error) { skipped++; continue }
      added++
    }
    return NextResponse.json({ added, skipped })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
