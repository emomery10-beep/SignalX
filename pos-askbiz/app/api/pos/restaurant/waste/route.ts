import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { resolvePosAuth } from '@/lib/pos-auth'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}

// GET — waste log for period
export async function GET(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '7')
  const from = new Date()
  from.setDate(from.getDate() - days)
  from.setHours(0, 0, 0, 0)

  const service = createServiceClient()

  const { data: logs, error } = await service
    .from('restaurant_waste_log')
    .select(`
      id, item_name, qty, unit, cost_per_unit, total_cost, reason, created_at,
      menu_item_id,
      restaurant_menu_items(name, base_price, food_cost)
    `)
    .eq('owner_id', auth.ownerId)
    .gte('created_at', from.toISOString())
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Aggregate by reason and item
  const totalCost  = (logs || []).reduce((s: number, l: any) => s + (l.total_cost || 0), 0)
  const byReason   = groupBy(logs || [], (l: any) => l.reason || 'other')
  const byItem     = groupBy(logs || [], (l: any) => l.item_name)

  const reasonSummary = Object.entries(byReason).map(([reason, items]) => ({
    reason,
    count:      (items as any[]).length,
    total_cost: (items as any[]).reduce((s, l) => s + (l.total_cost || 0), 0),
  })).sort((a, b) => b.total_cost - a.total_cost)

  const itemSummary = Object.entries(byItem).map(([item_name, items]) => ({
    item_name,
    count:      (items as any[]).length,
    total_cost: (items as any[]).reduce((s, l) => s + (l.total_cost || 0), 0),
    total_qty:  (items as any[]).reduce((s, l) => s + (l.qty || 0), 0),
  })).sort((a, b) => b.total_cost - a.total_cost).slice(0, 10)

  return NextResponse.json({
    logs,
    summary: { total_cost: totalCost, total_entries: (logs || []).length, by_reason: reasonSummary, top_wasted_items: itemSummary },
  })
}

// POST — log waste (manual or from photo recognition)
export async function POST(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { item_name, menu_item_id, qty, unit, cost_per_unit, reason, notes } = body

  if (!item_name || !qty) {
    return NextResponse.json({ error: 'item_name and qty required' }, { status: 400 })
  }

  const service = createServiceClient()

  // If no cost_per_unit provided, try to get food_cost from menu item
  let resolvedCost = cost_per_unit || 0
  if (!resolvedCost && menu_item_id) {
    const { data: mi } = await service
      .from('restaurant_menu_items')
      .select('food_cost')
      .eq('id', menu_item_id)
      .eq('owner_id', auth.ownerId)
      .single()
    resolvedCost = (mi as any)?.food_cost || 0
  }

  const totalCost = resolvedCost * (qty || 1)

  const { data, error } = await service
    .from('restaurant_waste_log')
    .insert({
      owner_id:     auth.ownerId,
      location_id:  auth.locationId || null,
      logged_by:    auth.staffId    || null,
      menu_item_id: menu_item_id    || null,
      item_name,
      qty:          qty || 1,
      unit:         unit || 'portion',
      cost_per_unit: resolvedCost,
      total_cost:   totalCost,
      reason:       reason || 'other',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ log: data, total_cost: totalCost })
}

// POST /recognize — identify waste item from photo + suggest qty/cost
export async function PUT(req: NextRequest) {
  const auth = await resolvePosAuth(req, 'inventory')
  if (!auth) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { image, media_type = 'image/jpeg' } = await req.json()
  if (!image) return NextResponse.json({ error: 'image required' }, { status: 400 })

  const service  = createServiceClient()
  const anthropic = new Anthropic()

  // Fetch menu items to match against
  const { data: menuItems } = await service
    .from('restaurant_menu_items')
    .select('id, name, food_cost, base_price, unit')
    .eq('owner_id', auth.ownerId)
    .eq('active', true)
    .order('name')

  const menuList = (menuItems || []).slice(0, 150).map((m: any) => `- ${m.name}`).join('\n')

  const resp = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: media_type as any, data: image },
        },
        {
          type: 'text',
          text: `You are a restaurant waste tracking assistant. Look at this photo of food waste.

Identify:
1. What food item is being wasted
2. Approximate quantity
3. Most likely waste reason
4. Whether it matches any of these menu items:\n${menuList}

Reply ONLY with valid JSON:
{
  "item_name": "Chicken Breast",
  "qty": 2,
  "unit": "portion",
  "reason": "overcooked",
  "menu_item_name": "Grilled Chicken",
  "confidence": 85,
  "notes": "Two portions appear burnt"
}

Rules:
- item_name: what the food actually is (short, clean)
- qty: your best estimate of quantity (default 1)
- unit: "portion" | "kg" | "g" | "litre" | "item"
- reason: one of: expired | dropped | overcooked | returned | spoiled | overproduced | trimming | other
- menu_item_name: the closest match from the menu list above, or null if nothing fits
- confidence: 0-100
- notes: brief observation (max 20 words) or ""`,
        },
      ],
    }],
  })

  const content = resp.content[0]
  if (content.type !== 'text') return NextResponse.json({ recognized: null })

  const jsonMatch = content.text.trim().match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ recognized: null })

  let recognized: any
  try { recognized = JSON.parse(jsonMatch[0]) } catch { return NextResponse.json({ recognized: null }) }

  // Try to match the returned menu_item_name to a real menu item
  let matchedItem = null
  if (recognized.menu_item_name && menuItems) {
    const targetLower = recognized.menu_item_name.toLowerCase()
    matchedItem = menuItems.find((m: any) => m.name.toLowerCase() === targetLower)
      || menuItems.find((m: any) => m.name.toLowerCase().includes(targetLower) || targetLower.includes(m.name.toLowerCase()))
  }

  return NextResponse.json({
    recognized: {
      ...recognized,
      menu_item_id:   matchedItem?.id         || null,
      menu_item_name: matchedItem?.name        || recognized.menu_item_name || null,
      cost_per_unit:  (matchedItem as any)?.food_cost || 0,
    },
  })
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = key(item)
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {} as Record<string, T[]>)
}
