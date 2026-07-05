// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW ONLY — mock data generators for the staff-screen demo (/preview/*).
// Field shapes are matched to what the real pages actually read (sell/page.tsx,
// inventory/page.tsx, dashboard/page.tsx, logistics/*) and to the real API
// route handlers' response shapes, so the real UI renders exactly as it would
// against live data. Never used outside pos-askbiz/app/preview/**.
// ─────────────────────────────────────────────────────────────────────────────

import { scaleMoney } from './preview-currency'

export type Sector = 'retail' | 'restaurant' | 'salon' | 'repair' | 'factory' | 'logistics'

// ── deterministic pseudo-random so a given seed always renders the same demo ──
export function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeHelpers(seed: number) {
  const rnd = mulberry32(seed)
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)]
  const between = (a: number, b: number) => a + rnd() * (b - a)
  const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(rnd() * 16), v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
  const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString()
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString()
  return { rnd, pick, between, uuid, daysAgo, hoursAgo }
}

const FIRST = ['Amara', 'Kwame', 'Zainab', 'Tunde', 'Fatima', 'Chidi', 'Ngozi', 'Femi', 'Aisha', 'Kofi', 'Sade', 'Emeka', 'Wanjiru', 'Otieno', 'Achieng']
const LAST = ['Okafor', 'Mensah', 'Bello', 'Adeyemi', 'Owusu', 'Nwosu', 'Diallo', 'Eze', 'Abara', 'Boateng', 'Kamau', 'Otieno']

const CATALOG: Record<Sector, { name: string; price: number; cost: number; cat: string }[]> = {
  restaurant: [
    { name: 'Jollof Rice & Chicken', price: 12, cost: 4.2, cat: 'Mains' },
    { name: 'Beef Suya Platter', price: 15, cost: 6.1, cat: 'Mains' },
    { name: 'Grilled Tilapia', price: 18, cost: 8.4, cat: 'Mains' },
    { name: 'Chapati Wrap', price: 6, cost: 1.8, cat: 'Snacks' },
    { name: 'Puff Puff (6pc)', price: 3, cost: 0.6, cat: 'Snacks' },
    { name: 'Chapman Mocktail', price: 5, cost: 1.1, cat: 'Drinks' },
    { name: 'Bottled Water', price: 1.5, cost: 0.4, cat: 'Drinks' },
  ],
  salon: [
    { name: "Ladies' Haircut & Style", price: 35, cost: 4, cat: 'Hair' },
    { name: 'Full Head Colour', price: 75, cost: 18, cat: 'Colour' },
    { name: 'Gel Manicure', price: 30, cost: 6, cat: 'Nails' },
    { name: 'Pedicure', price: 35, cost: 7, cat: 'Nails' },
    { name: 'Argan Oil Shampoo', price: 18, cost: 7, cat: 'Retail' },
    { name: 'Heat Protect Spray', price: 14, cost: 5, cat: 'Retail' },
  ],
  retail: [
    { name: 'Cotton T-Shirt', price: 12, cost: 4.5, cat: 'Apparel' },
    { name: 'Denim Jeans', price: 38, cost: 16, cat: 'Apparel' },
    { name: 'Canvas Sneakers', price: 45, cost: 22, cat: 'Footwear' },
    { name: 'Leather Belt', price: 22, cost: 8, cat: 'Accessories' },
    { name: 'Baseball Cap', price: 15, cost: 5, cat: 'Accessories' },
    { name: 'Phone Case', price: 14, cost: 3, cat: 'Tech' },
    { name: 'Water Bottle', price: 16, cost: 5, cat: 'Lifestyle' },
  ],
  repair: [
    { name: 'Screen Replacement (parts)', price: 45, cost: 22, cat: 'Parts' },
    { name: 'Battery (parts)', price: 18, cost: 8, cat: 'Parts' },
    { name: 'Charging Port (parts)', price: 12, cost: 5, cat: 'Parts' },
    { name: 'Screen Protector', price: 4, cost: 1, cat: 'Accessories' },
  ],
  factory: [
    { name: 'Palm Oil 25L', price: 40, cost: 28, cat: 'Output' },
    { name: 'Cassava Flour 5kg', price: 8, cost: 4.5, cat: 'Output' },
    { name: 'Packaged Garri 5kg', price: 9, cost: 5, cat: 'Output' },
    { name: 'Groundnut Oil 5L', price: 22, cost: 15, cat: 'Output' },
  ],
  // Logistics doesn't sell a product catalogue — parcels/trucks/routes cover
  // it (see makeParcels/makeTrucks/makeRoutes below). Falls back to retail's
  // catalogue wherever makeInventory/makeTransactions are called unconditionally.
  logistics: [],
}

// Fallback symbol per sector, used only when the caller doesn't pass a
// geo-detected currency symbol (see buildMockSession / usePreviewCurrency).
const CURRENCY: Record<string, string> = { retail: 'KSh', restaurant: '₦', salon: 'KSh', repair: '₵', factory: '₦', logistics: '₦' }

export function makeConfig(sector: Sector, currencySymbol?: string) {
  return { currency_symbol: currencySymbol || CURRENCY[sector] || 'KSh', business_type: sector, staff_sector: sector }
}

export function makeStaffRoster(seed: number, count = 6) {
  const { pick, uuid } = makeHelpers(seed)
  return Array.from({ length: count }, () => ({
    id: uuid(),
    name: `${pick(FIRST)} ${pick(LAST)}`,
    role: pick(['cashier', 'manager', 'inventory']),
  }))
}

// ── Inventory ── matches InventoryItem (inventory/page.tsx + sell/page.tsx) and
// the real GET /api/pos/inventory shape ({ inventory: InventoryRow[], total }).
export function makeInventory(sector: Sector, seed: number, factor = 1, count = 12) {
  const { pick, between, uuid, daysAgo } = makeHelpers(seed)
  const cat = CATALOG[sector].length ? CATALOG[sector] : CATALOG.retail
  return Array.from({ length: count }, (_, i) => {
    const base = cat[i % cat.length]
    const id = uuid()
    return {
      id,
      name: base.name,
      sku: `SKU${1000 + i}`,
      sale_price: scaleMoney(base.price, factor),
      cost_price: scaleMoney(base.cost, factor),
      stock_qty: Math.floor(between(0, 80)),
      low_stock_threshold: 10,
      unit: 'pcs',
      category: base.cat,
      sector,
      active: true,
      expiry_date: null as string | null,
      batch_number: `B${2400 + i}`,
      supplier: pick(['Nairobi Wholesale Ltd', 'Lagos Distributors', 'Kampala Traders Co']),
      brand: null as string | null,
      last_sold_at: daysAgo(Math.floor(between(0, 20))),
      location: { id: 'loc-preview', name: 'Main Branch' },
    }
  })
}

// ── Transactions ── matches GET /api/pos/transactions shape exactly, and biases
// ~35% into "today" attributed to `cashierId` so sell/page.tsx's loadTodayStats
// (which filters `t.cashier?.id === s.id && status === 'completed'`) populates.
export function makeTransactions(sector: Sector, seed: number, cashierId: string, cashierName: string, factor = 1, count = 40) {
  const { rnd, pick, between, uuid, daysAgo } = makeHelpers(seed + 1)
  const cat = CATALOG[sector].length ? CATALOG[sector] : CATALOG.retail
  return Array.from({ length: count }, (_, i) => {
    const itemCount = Math.max(1, Math.floor(between(1, 4)))
    const items = Array.from({ length: itemCount }, () => {
      const idx = Math.floor(rnd() * cat.length)
      const p = cat[idx]
      const qty = Math.max(1, Math.floor(between(1, 3)))
      return { name: p.name, sku: `SKU${1000 + idx}`, qty, unit_price: scaleMoney(p.price, factor), cost_price: scaleMoney(p.cost, factor), inventory_id: uuid() }
    })
    const subtotal = items.reduce((s, it) => s + it.unit_price * it.qty, 0)
    const discount = rnd() < 0.15 ? Math.round(subtotal * between(0.05, 0.15) * 100) / 100 : 0
    const status = rnd() < 0.06 ? 'refunded' : 'completed'
    const isToday = rnd() < 0.35
    let createdAt: string
    if (isToday) {
      const d = new Date(); d.setHours(Math.floor(between(7, Math.max(8, d.getHours()))), Math.floor(between(0, 59)), 0, 0)
      createdAt = d.toISOString()
    } else {
      createdAt = daysAgo(Math.floor(between(1, 29)))
    }
    return {
      id: uuid(),
      owner_id: 'owner-preview',
      cashier_id: cashierId,
      customer_id: null as string | null,
      subtotal,
      discount_amount: discount,
      amount_tendered: subtotal - discount,
      total: Math.round((subtotal - discount) * 100) / 100,
      payment_type: pick(['cash', 'card', 'mobile', 'transfer']),
      status,
      notes: status === 'refunded' ? pick(['wrong item', 'customer changed mind']) : '',
      created_at: createdAt,
      pos_location_id: 'loc-preview',
      cashier: { id: cashierId, name: cashierName, role: 'cashier' },
      pos_customers: rnd() < 0.6 ? { id: uuid(), phone: `+234 80${Math.floor(between(10000000, 99999999))}`, name: `${pick(FIRST)} ${pick(LAST)}` } : null,
      pos_items: items,
    }
  })
}

// ── Service jobs (repair sector, manager dashboard) ── superset of ServiceJob
// (dashboard/page.tsx) + the real GET /api/pos/service-jobs shape.
export function makeServiceJobs(seed: number, factor = 1, count = 20) {
  const { pick, between, uuid, daysAgo } = makeHelpers(seed + 2)
  const devices = ['iPhone 13', 'Samsung A52', 'iPhone 15 Pro', 'Tecno Spark', 'Infinix Hot']
  const faults = ['Cracked screen', 'Battery replacement', 'Charging port', 'Water damage', "Won't power on"]
  const statuses = ['intake', 'quoted', 'accepted', 'in_progress', 'completed', 'collected']
  return Array.from({ length: count }, (_, i) => {
    const status = pick(statuses)
    const created = Math.floor(between(0, 20))
    const staff = { id: uuid(), name: `${pick(FIRST)} ${pick(LAST)}`, role: 'engineer' }
    return {
      id: uuid(),
      ticket_number: `RPR-${2400 + i}`,
      status,
      device_model: pick(devices),
      fault_description: pick(faults),
      customer_name: `${pick(FIRST)} ${pick(LAST)}`,
      quoted_price: scaleMoney(Math.round(between(25, 240)), factor),
      assigned_to: staff.name,
      created_at: daysAgo(created),
      checked_in_staff: staff,
      assigned_staff: staff,
      checked_out_staff: ['completed', 'collected'].includes(status) ? staff : null,
      customer: { id: uuid(), phone: `+234 80${Math.floor(between(10000000, 99999999))}`, name: `${pick(FIRST)} ${pick(LAST)}` },
      location: { id: 'loc-preview', name: 'Main Branch' },
      preset: { id: uuid(), name: pick(faults), category: 'repair' },
      transaction: ['completed', 'collected'].includes(status) ? { id: uuid(), total: scaleMoney(Math.round(between(25, 240)), factor), payment_type: 'cash', status: 'completed' } : null,
    }
  })
}

// ── Factory captures (factory sector, manager dashboard) ── superset of
// FactoryCapture (dashboard/page.tsx) + real GET /api/pos/factory/capture shape.
export function makeFactoryCaptures(seed: number, count = 24) {
  const { pick, between, uuid, hoursAgo } = makeHelpers(seed + 3)
  const products = ['Palm Oil 25L', 'Cassava Flour', 'Packaged Garri 5kg', 'Groundnut Oil']
  const types = ['intake', 'output', 'output', 'wastage', 'dispatch']
  return Array.from({ length: count }, (_, i) => {
    const type = pick(types)
    const status = pick(['approved', 'approved', 'pending', 'rejected'])
    const staff = { id: uuid(), name: `${pick(FIRST)} ${pick(LAST)}`, role: 'engineer' }
    return {
      id: uuid(),
      type,
      status,
      photo_url: '',
      storage: 'preview',
      product_name: pick(products),
      batch_ref: `B${2400 + i}`,
      quantity: Math.round(between(5, 500)),
      notes: type === 'wastage' ? 'spillage' : '',
      created_at: hoursAgo(Math.floor(between(0, 24 * 20))),
      captured_by_staff: staff,
      approved_by_staff: status === 'approved' ? { id: uuid(), name: `${pick(FIRST)} ${pick(LAST)}`, role: 'manager' } : null,
      location: { id: 'loc-preview', name: 'Main Branch' },
    }
  })
}

// ── Logistics: branches, trucks, routes, parcels ── matches the union of Parcel
// interfaces across logistics/page.tsx, dispatch/, collect/, dashboard/, and the
// real GET /api/pos/parcels shape.
export function makeBranches(seed: number, count = 4) {
  const { uuid } = makeHelpers(seed + 4)
  const names = ['Nairobi CBD Branch', 'Lagos Mainland Branch', 'Kampala Central Branch', 'Accra Depot']
  return Array.from({ length: count }, (_, i) => ({ id: uuid(), name: names[i % names.length], address: '' }))
}

export function makeTrucks(seed: number, count = 5) {
  const { pick, uuid } = makeHelpers(seed + 5)
  return Array.from({ length: count }, (_, i) => ({
    id: uuid(),
    plate_number: `K${pick(['B', 'C', 'D'])}${100 + i}X`,
    make_model: pick(['Isuzu NPR', 'Toyota Hiace', 'Mitsubishi Canter']),
    status: pick(['available', 'in_transit', 'available']),
  }))
}

export function makeRoutes(seed: number, branches: { id: string; name: string }[], factor = 1) {
  const { between } = makeHelpers(seed + 6)
  return branches.map((b, i) => ({
    id: `route-${i}`,
    name: `To ${b.name}`,
    destination_branch_id: b.id,
    destination: b,
    origin: branches[0],
    flat_rate: scaleMoney(Math.round(between(200, 800)), factor),
    price_per_kg: scaleMoney(Math.round(between(20, 80)), factor),
    active: true,
  }))
}

export function makeParcels(seed: number, factor = 1, count = 18) {
  const { pick, between, uuid, daysAgo, hoursAgo } = makeHelpers(seed + 7)
  const branches = makeBranches(seed)
  const trucks = makeTrucks(seed)
  const statuses = ['received', 'at_branch', 'assigned', 'loaded', 'in_transit', 'at_destination', 'out_for_delivery', 'delivered', 'collected']
  return Array.from({ length: count }, (_, i) => {
    const truck = pick(trucks)
    const driver = { id: uuid(), name: `${pick(FIRST)} ${pick(LAST)}` }
    const destBranch = pick(branches)
    return {
      id: uuid(),
      tracking_number: `PKG-${9000 + i}`,
      status: pick(statuses),
      sender_name: `${pick(FIRST)} ${pick(LAST)}`,
      sender_phone: `+234 80${Math.floor(between(10000000, 99999999))}`,
      receiver_name: `${pick(FIRST)} ${pick(LAST)}`,
      receiver_phone: `+234 80${Math.floor(between(10000000, 99999999))}`,
      receiver_id_number: `ID${Math.floor(between(1000000, 9999999))}`,
      destination_city: destBranch.name.replace(' Branch', '').replace(' Depot', ''),
      description: pick(['Documents', 'Electronics', 'Clothing parcel', 'Spare parts']),
      weight_kg: Math.round(between(1, 40)),
      parcel_size: pick(['small', 'medium', 'large']),
      fee_charged: scaleMoney(Math.round(between(200, 2000)), factor),
      payment_status: pick(['paid', 'paid', 'pending']),
      payment_method: pick(['cash', 'mobile']),
      created_at: daysAgo(Math.floor(between(0, 10))),
      dispatched_at: hoursAgo(Math.floor(between(1, 48))),
      delivered_at: null as string | null,
      delivery_type: pick(['branch_pickup', 'door_delivery']),
      destination_branch_id: destBranch.id,
      current_branch_id: destBranch.id,
      assigned_truck_id: truck.id,
      assigned_driver_id: driver.id,
      truck,
      driver,
      destination_branch: destBranch,
      current_branch: destBranch,
      sender_branch: branches[0],
      received_staff: { id: uuid(), name: `${pick(FIRST)} ${pick(LAST)}` },
      route: { id: `route-0`, name: `To ${destBranch.name}`, price_per_kg: scaleMoney(Math.round(between(20, 80)), factor), flat_rate: scaleMoney(Math.round(between(200, 800)), factor) },
    }
  })
}

export function makeTruckLocations(seed: number, trucks: { id: string; plate_number: string }[]) {
  const { between } = makeHelpers(seed + 8)
  return trucks.map(t => ({
    id: `loc-${t.id}`,
    truck_id: t.id,
    lat: -1.29 + between(-0.05, 0.05),
    lng: 36.82 + between(-0.05, 0.05),
    recorded_at: new Date().toISOString(),
    truck: t,
    driver: { id: `driver-${t.id}`, name: 'Preview Driver' },
  }))
}

// ── Sector-specific front-of-house fixtures ── restaurant floor, salon
// bookings, repair intake device scan. Matches the real GET /api/pos/staff,
// GET /api/pos/restaurant/tables, GET /api/pos/salon/appointments, and
// POST /api/pos/service-jobs/scan-device response shapes (read directly from
// the route handlers, not guessed).

// GET /api/pos/staff → { staff: [...] } — used by restaurant/floor (loadStaff)
// and salon/bookings (both filter/map on id, name, role, active).
export function makeStaffList(seed: number, count = 6) {
  const { pick, uuid, daysAgo } = makeHelpers(seed + 9)
  const roles = ['cashier', 'waiter', 'stylist', 'manager']
  return Array.from({ length: count }, () => ({
    id: uuid(),
    name: `${pick(FIRST)} ${pick(LAST)}`,
    email: null as string | null,
    phone: null as string | null,
    role: pick(roles),
    active: true,
    last_login_at: daysAgo(0),
    created_at: daysAgo(90),
    location_id: 'loc-preview',
    location: { id: 'loc-preview', name: 'Main Branch' },
  }))
}

// GET /api/pos/restaurant/tables → { tables: [...] } — matches Table
// interface in restaurant/floor/page.tsx exactly (x_pos/y_pos/width/height
// drive the floor-plan layout, so these need to be sane, non-overlapping).
export function makeRestaurantTables(seed: number, staff: { id: string; name: string }[], factor = 1, count = 10) {
  const { rnd, pick, between, uuid, hoursAgo } = makeHelpers(seed + 10)
  const sections = ['Main Floor', 'Patio', 'Bar']
  const statuses = ['available', 'available', 'seated', 'seated', 'reserved', 'available']
  return Array.from({ length: count }, (_, i) => {
    const status = pick(statuses)
    const col = i % 5, row = Math.floor(i / 5)
    const server = pick(staff)
    const hasOrder = status === 'seated'
    return {
      id: uuid(),
      name: `T${i + 1}`,
      section: sections[i % sections.length],
      capacity: pick([2, 2, 4, 4, 6]),
      shape: pick(['round', 'square']),
      x_pos: col * 140 + 20,
      y_pos: row * 140 + 20,
      width: 100,
      height: 100,
      status,
      current_order_id: hasOrder ? uuid() : null,
      server_id: status !== 'available' ? server.id : null,
      seated_at: status === 'seated' ? hoursAgo(Math.floor(between(0, 1))) : null,
      reservation_name: status === 'reserved' ? `${pick(FIRST)} ${pick(LAST)}` : null,
      reservation_at: status === 'reserved' ? hoursAgo(-Math.floor(between(1, 3))) : null,
      server: status !== 'available' ? { id: server.id, name: server.name, role: 'waiter' } : null,
      current_order: hasOrder ? {
        id: uuid(), status: 'in_progress', covers: pick([2, 3, 4]),
        total: scaleMoney(Math.round(between(15, 90)), factor), created_at: hoursAgo(0.5), seated_at: hoursAgo(0.5),
        order_items: [
          { id: uuid(), name: 'Jollof Rice & Chicken', qty: 2, status: 'fired' },
          { id: uuid(), name: 'Bottled Water', qty: 2, status: 'served' },
        ],
      } : null,
      upcoming_reservations: rnd() < 0.3 ? [{ id: uuid(), customer_name: `${pick(FIRST)} ${pick(LAST)}`, covers: pick([2, 4]), reserved_at: hoursAgo(-2), status: 'confirmed' }] : [],
    }
  })
}

// GET /api/pos/salon/appointments → { appointments: [...] } — matches
// Appointment interface in salon/bookings/page.tsx exactly.
export function makeAppointments(seed: number, staff: { id: string; name: string }[], factor = 1, count = 14) {
  const { pick, between, uuid, hoursAgo, daysAgo } = makeHelpers(seed + 11)
  const services = [
    { name: "Ladies' Haircut & Style", cat: 'Hair', price: scaleMoney(35, factor), mins: 45 },
    { name: 'Full Head Colour', cat: 'Colour', price: scaleMoney(75, factor), mins: 120 },
    { name: 'Gel Manicure', cat: 'Nails', price: scaleMoney(30, factor), mins: 40 },
    { name: 'Pedicure', cat: 'Nails', price: scaleMoney(35, factor), mins: 45 },
    { name: 'Keratin Treatment', cat: 'Treatment', price: scaleMoney(90, factor), mins: 150 },
  ]
  const statuses = ['booked', 'booked', 'confirmed', 'completed', 'cancelled']
  return Array.from({ length: count }, (_, i) => {
    const svc = pick(services)
    const stylist = pick(staff)
    const isPast = i % 3 === 0
    return {
      id: uuid(),
      client_id: uuid(),
      stylist_id: stylist.id,
      service_name: svc.name,
      service_category: svc.cat,
      scheduled_at: isPast ? daysAgo(Math.floor(between(1, 5))) : hoursAgo(-Math.floor(between(0, 72))),
      duration_mins: svc.mins,
      price: svc.price,
      status: isPast ? 'completed' : pick(statuses),
      notes: null as string | null,
      client: { id: uuid(), name: `${pick(FIRST)} ${pick(LAST)}`, phone: `+254 7${Math.floor(between(10000000, 99999999))}` },
      stylist: { id: stylist.id, name: stylist.name },
    }
  })
}

// POST /api/pos/service-jobs/scan-device → { device: DeviceInfo, warranty_info }
// — camera-based AI scan; mock returns one fixed, clearly-fake sample device
// since there's no real hardware to scan in a demo.
export function makeScanDeviceResult() {
  return {
    device: {
      model: 'iPhone 13 Pro',
      serial: 'DEMO-SN-0001',
      manufacture_date: '2022-03',
      storage: '256GB',
      color: 'Sierra Blue',
      model_number: 'A2483',
      confidence: 0.92,
    },
    warranty_info: null,
  }
}

export { FIRST, LAST }
