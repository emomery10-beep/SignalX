'use client'
// ─────────────────────────────────────────────────────────────────────────────
// DEV/PREVIEW ONLY — no auth. Renders the 5 sector analytics tabs with mock data
// so the UI can be reviewed without signing in or seeding the database.
// Visit: http://localhost:3000/pos-preview
// Safe to delete before deploy (it imports the real components but feeds mock props).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useMemo, useState } from 'react'
import RestaurantTab from '@/components/pos/RestaurantTab'
import RepairTab from '@/components/pos/RepairTab'
import SalonTab from '@/components/pos/SalonTab'
import RetailTab from '@/components/pos/RetailTab'
import FactoryTab from '@/components/pos/FactoryTab'

type Sector = 'restaurant' | 'repair' | 'salon' | 'retail' | 'factory'

const SECTORS: { id: Sector; label: string; color: string }[] = [
  { id: 'restaurant', label: '🍴 Restaurant', color: '#d08a59' },
  { id: 'repair', label: '🔧 Repair', color: '#6366f1' },
  { id: 'salon', label: '💇 Salon', color: '#ec4899' },
  { id: 'retail', label: '📦 Retail', color: '#22c55e' },
  { id: 'factory', label: '🏭 Factory', color: '#f59e0b' },
]

// ── deterministic pseudo-random so the preview is stable across renders ──
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rnd = mulberry32(42)
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)]
const between = (a: number, b: number) => a + rnd() * (b - a)
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString()
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString()

// ── Shared menu/product catalogue across sectors ──
const CATALOG: Record<Sector, { name: string; price: number; cost: number; cat: string }[]> = {
  restaurant: [
    { name: 'Jollof Rice & Chicken', price: 12, cost: 4.2, cat: 'Mains' },
    { name: 'Beef Suya Platter', price: 15, cost: 6.1, cat: 'Mains' },
    { name: 'Grilled Tilapia', price: 18, cost: 8.4, cat: 'Mains' },
    { name: 'Egusi Soup & Pounded Yam', price: 14, cost: 5.0, cat: 'Mains' },
    { name: 'Chapati Wrap', price: 6, cost: 1.8, cat: 'Snacks' },
    { name: 'Puff Puff (6pc)', price: 3, cost: 0.6, cat: 'Snacks' },
    { name: 'Chapman Mocktail', price: 5, cost: 1.1, cat: 'Drinks' },
    { name: 'Bottled Water', price: 1.5, cost: 0.4, cat: 'Drinks' },
    { name: 'Zobo Drink', price: 4, cost: 0.9, cat: 'Drinks' },
    { name: 'Meat Pie', price: 3.5, cost: 1.2, cat: 'Snacks' },
  ],
  salon: [
    { name: "Ladies' Haircut & Style", price: 35, cost: 4, cat: 'Hair' },
    { name: 'Full Head Colour', price: 75, cost: 18, cat: 'Colour' },
    { name: 'Balayage', price: 120, cost: 28, cat: 'Colour' },
    { name: 'Blow Dry', price: 25, cost: 2, cat: 'Hair' },
    { name: 'Gel Manicure', price: 30, cost: 6, cat: 'Nails' },
    { name: 'Pedicure', price: 35, cost: 7, cat: 'Nails' },
    { name: 'Keratin Treatment', price: 90, cost: 22, cat: 'Treatment' },
    { name: 'Argan Oil Shampoo', price: 18, cost: 7, cat: 'Retail' },
    { name: 'Heat Protect Spray', price: 14, cost: 5, cat: 'Retail' },
  ],
  retail: [
    { name: 'Cotton T-Shirt', price: 12, cost: 4.5, cat: 'Apparel' },
    { name: 'Denim Jeans', price: 38, cost: 16, cat: 'Apparel' },
    { name: 'Canvas Sneakers', price: 45, cost: 22, cat: 'Footwear' },
    { name: 'Leather Belt', price: 22, cost: 8, cat: 'Accessories' },
    { name: 'Baseball Cap', price: 15, cost: 5, cat: 'Accessories' },
    { name: 'Wool Socks (3pk)', price: 9, cost: 3, cat: 'Apparel' },
    { name: 'Sunglasses', price: 28, cost: 9, cat: 'Accessories' },
    { name: 'Backpack', price: 55, cost: 24, cat: 'Bags' },
    { name: 'Phone Case', price: 14, cost: 3, cat: 'Tech' },
    { name: 'Water Bottle', price: 16, cost: 5, cat: 'Lifestyle' },
  ],
  repair: [],
  factory: [],
}

const FIRST = ['Amara', 'Kwame', 'Zainab', 'Tunde', 'Fatima', 'Chidi', 'Ngozi', 'Femi', 'Aisha', 'Kofi', 'Sade', 'Emeka']
const LAST = ['Okafor', 'Mensah', 'Bello', 'Adeyemi', 'Owusu', 'Nwosu', 'Diallo', 'Eze', 'Abara', 'Boateng']
const fullName = () => `${pick(FIRST)} ${pick(LAST)}`
const phone = () => `+234 80${Math.floor(between(10000000, 99999999))}`

export default function PosPreviewPage() {
  const [sector, setSector] = useState<Sector>('restaurant')
  // Mock data uses Date.now() + a stateful PRNG, so it must only run client-side
  // to avoid SSR/client hydration mismatches. Render a placeholder until mounted.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // ── Mock staff (stylists / servers / cashiers / engineers) ──
  const staff = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    id: `staff-${i}`,
    name: fullName(),
    role: pick(['cashier', 'manager', 'engineer', 'supervisor']),
    sector,
    active: true,
  })), [sector])

  // ── Mock inventory for the active sector ──
  const inventory = useMemo(() => {
    const cat = CATALOG[sector].length ? CATALOG[sector] : CATALOG.retail
    return cat.map((c, i) => ({
      id: `inv-${sector}-${i}`,
      name: c.name,
      sku: `SKU${1000 + i}`,
      sale_price: c.price,
      cost_price: c.cost,
      stock_qty: Math.floor(between(0, 80)),
      low_stock_threshold: 10,
      category: c.cat,
      sector,
      unit: 'pcs',
      active: true,
      last_sold_at: daysAgo(Math.floor(between(0, 120))),
    }))
  }, [sector])

  // ── Mock transactions (last 30 days) ──
  const transactions = useMemo(() => {
    const cat = CATALOG[sector].length ? CATALOG[sector] : CATALOG.retail
    const txns = []
    const count = 90
    for (let i = 0; i < count; i++) {
      const itemCount = Math.max(1, Math.floor(between(1, 4)))
      const items = Array.from({ length: itemCount }, () => {
        // Pick by index so the line-item SKU matches the inventory SKU
        // (components join sold-units to products on `sku || name`).
        const idx = Math.floor(rnd() * cat.length)
        const p = cat[idx]
        const qty = Math.max(1, Math.floor(between(1, 3)))
        return { name: p.name, sku: `SKU${1000 + idx}`, qty, unit_price: p.price, cost_price: p.cost }
      })
      const subtotal = items.reduce((s, it) => s + it.unit_price * it.qty, 0)
      const discount = rnd() < 0.2 ? Math.round(subtotal * between(0.05, 0.2) * 100) / 100 : 0
      const status = rnd() < 0.07 ? 'refunded' : 'completed'
      // ~35% of sales land earlier *today* so the "Today" KPIs populate;
      // the rest spread across the previous 29 days.
      let createdAt: string
      if (rnd() < 0.35) {
        const d = new Date()
        d.setHours(Math.floor(between(7, Math.max(8, d.getHours()))), Math.floor(between(0, 59)), 0, 0)
        createdAt = d.toISOString()
      } else {
        const dayOffset = Math.floor(between(1, 30))
        const hourOffset = Math.floor(between(0, 23))
        createdAt = new Date(Date.now() - dayOffset * 86400000 - hourOffset * 3600000).toISOString()
      }
      txns.push({
        id: `tx-${i}-${Math.floor(rnd() * 100000)}`,
        total: Math.round((subtotal - discount) * 100) / 100,
        subtotal,
        discount_amount: discount,
        payment_type: pick(['cash', 'card', 'card', 'mobile', 'transfer']),
        status,
        created_at: createdAt,
        notes: status === 'refunded' ? pick(['wrong item', 'customer changed mind', 'faulty']) : '',
        cashier: { id: `staff-${Math.floor(rnd() * 6)}`, name: fullName() },
        pos_items: items,
        pos_customers: rnd() < 0.7 ? { phone: phone(), name: fullName() } : null,
      })
    }
    return txns
  }, [sector])

  // ── Mock service jobs (repair) ──
  const previewJobs = useMemo(() => {
    const devices = ['iPhone 13', 'Samsung A52', 'iPhone 15 Pro', 'MacBook Air', 'Tecno Spark', 'iPad 9', 'Infinix Hot', 'Dell XPS 13']
    const faults = ['Cracked screen', 'Battery replacement', 'Charging port', 'Water damage', 'Won’t power on', 'Speaker fault']
    const statuses = ['intake', 'quoted', 'accepted', 'in_progress', 'completed', 'collected']
    return Array.from({ length: 34 }, (_, i) => {
      const status = pick(statuses)
      const created = Math.floor(between(0, 28))
      const done = ['completed', 'collected'].includes(status)
      const est = Math.round(between(25, 240))
      return {
        id: `job-${i}`,
        ticket_number: `RPR-${2400 + i}`,
        status,
        device_type: pick(['Phone', 'Laptop', 'Tablet']),
        device_model: pick(devices),
        device_serial: `SN${Math.floor(between(100000, 999999))}`,
        fault_description: pick(faults),
        issue_description: pick(faults),
        customer_name: fullName(),
        customer_phone: phone(),
        engineer: pick(FIRST),
        engineer_id: `staff-${Math.floor(rnd() * 6)}`,
        assigned_staff: { id: `staff-${Math.floor(rnd() * 6)}`, name: fullName() },
        estimated_cost: est,
        quoted_price: est,
        final_cost: done ? est : null,
        parts_cost: Math.round(est * between(0.2, 0.5)),
        priority: pick(['normal', 'normal', 'high', 'urgent']),
        created_at: daysAgo(created),
        completed_at: done ? daysAgo(Math.max(0, created - Math.floor(between(1, 5)))) : null,
        warranty_until: done ? daysAgo(-Math.floor(between(30, 180))) : null,
        notes: '',
        photos: [],
      }
    })
  }, [])

  // ── Mock factory captures ──
  const previewCaptures = useMemo(() => {
    const products = ['Palm Oil 25L', 'Cassava Flour', 'Packaged Garri 5kg', 'Plantain Chips', 'Groundnut Oil', 'Rice 50kg']
    const types = ['intake', 'output', 'output', 'wastage', 'dispatch']
    return Array.from({ length: 48 }, (_, i) => {
      const type = pick(types)
      const status = rnd() < 0.15 ? 'pending' : rnd() < 0.1 ? 'rejected' : 'approved'
      return {
        id: `cap-${i}`,
        type,
        product_name: pick(products),
        product: pick(products),
        quantity: Math.round(between(5, 500)),
        unit: pick(['kg', 'L', 'boxes', 'units']),
        batch_ref: pick(['kg', 'L', 'boxes', 'units']),
        notes: type === 'wastage' ? pick(['spillage', 'spoilage', 'machine jam', 'quality reject']) : type === 'dispatch' ? pick(['Lagos depot', 'Abuja store', 'Port Harcourt']) : '',
        status,
        rejection_reason: status === 'rejected' ? 'count mismatch' : null,
        photo_url: '',
        captured_by_staff: { id: `staff-${Math.floor(rnd() * 6)}`, name: fullName() },
        approved_by_staff: status === 'approved' ? { id: 'staff-0', name: fullName() } : null,
        created_at: hoursAgo(Math.floor(between(0, 24 * 30))),
      }
    })
  }, [])

  const active = SECTORS.find(s => s.id === sector)!

  const common = { currencySymbol: '₦', selectedLocation: 'all', transactions, staff, inventory }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #f9f8f6)', color: 'var(--tx, #1a1916)' }}>
      {/* Preview banner */}
      <div style={{ background: '#1a1916', color: '#fff', padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <strong>PREVIEW MODE</strong>
        <span style={{ opacity: 0.7 }}>Mock data · no auth · {active.label} analytics tab as it appears in the owner dashboard</span>
      </div>

      {/* Sector switcher */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 20px', borderBottom: '1px solid var(--b, rgba(0,0,0,.08))', flexWrap: 'wrap', alignItems: 'center', background: 'var(--sf, #fff)' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx3, #888)', marginRight: 4 }}>Sector:</span>
        {SECTORS.map(s => (
          <button
            key={s.id}
            onClick={() => setSector(s.id)}
            style={{
              padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
              fontWeight: sector === s.id ? 700 : 500,
              border: sector === s.id ? `2px solid ${s.color}` : '1px solid var(--b, rgba(0,0,0,.12))',
              background: sector === s.id ? `${s.color}14` : 'var(--sf, #fff)',
              color: sector === s.id ? s.color : 'var(--tx2, #555)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active tab — client-only to avoid hydration mismatch from mock data */}
      <div style={{ padding: '20px', maxWidth: 1100, margin: '0 auto' }}>
        {!mounted ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--tx3, #888)', fontSize: 14 }}>Loading preview…</div>
        ) : (
          <>
            {sector === 'restaurant' && <RestaurantTab {...common} />}
            {sector === 'repair' && <RepairTab {...common} previewJobs={previewJobs} />}
            {sector === 'salon' && <SalonTab {...common} />}
            {sector === 'retail' && <RetailTab {...common} />}
            {sector === 'factory' && <FactoryTab {...common} previewCaptures={previewCaptures} />}
          </>
        )}
      </div>
    </div>
  )
}
