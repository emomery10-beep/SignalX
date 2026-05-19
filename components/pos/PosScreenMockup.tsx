'use client'
// Renders a realistic AskBiz POS admin screen mockup
// Based on the actual askbiz.co/pos UI design language

const acc = '#d08a59'
const green = '#16a34a'
const red = '#dc2626'
const tx = '#1a1916'
const tx2 = '#6b6760'
const tx3 = '#a39e97'
const bg = '#f9f8f6'
const sf = '#ffffff'
const b = 'rgba(0,0,0,.08)'

type Screen = 'overview' | 'register' | 'inventory' | 'reports' | 'staff' |
              'retail' | 'restaurant' | 'repair' | 'salon' | 'factory' | 'logistics'

const TAB_LABELS: Record<Screen, string> = {
  overview: 'Overview', register: 'Register', inventory: 'Inventory',
  reports: 'Overview', staff: 'Staff', retail: 'Operations',
  restaurant: 'Restaurant', repair: 'Repairs', salon: 'Bookings',
  factory: 'Operations', logistics: 'Logistics',
}

function KpiCard({ label, value, sub, color = green }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '12px 14px', flex: 1 }}>
      <div style={{ fontSize: 10, color: tx3, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 9, color: sub.startsWith('↑') ? green : red, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontSize: 9, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}35`, borderRadius: 4, padding: '2px 6px' }}>
      {label}
    </span>
  )
}

function ScreenContent({ screen }: { screen: Screen }) {
  if (screen === 'overview') return (
    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {['Today','Yesterday','Last 7 days'].map((t, i) => (
          <button key={t} style={{ fontSize: 9, padding: '3px 8px', borderRadius: 5, border: `1px solid ${i===0?acc:b}`, background: i===0?`${acc}15`:sf, color: i===0?acc:tx2, cursor: 'default', fontWeight: i===0?700:400 }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <KpiCard label="Revenue" value="KSh 25,012" sub="↑ 100% vs prev" />
        <KpiCard label="Sales" value="45" sub="↑ 100% vs prev" />
        <KpiCard label="Gross profit" value="KSh 12,422" color={green} />
        <KpiCard label="Margin" value="49.7%" color={green} />
      </div>
      <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: tx3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Sales by Hour</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 44 }}>
          {[12, 5, 28, 18, 42, 31, 19, 38, 22, 14, 8, 25].map((h, i) => (
            <div key={i} style={{ flex: 1, background: i === 4 ? acc : `${acc}40`, borderRadius: '2px 2px 0 0', height: `${(h/42)*100}%` }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          {['8:00','10:00','12:00','14:00','16:00','20:00'].map(t => (
            <span key={t} style={{ fontSize: 8, color: tx3 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ background: `${red}08`, border: `1px solid ${red}20`, borderRadius: 7, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: red }}>37 items low stock</div>
          <div style={{ fontSize: 9, color: tx2 }}>Click Inventory to view reorder recommendations</div>
        </div>
      </div>
    </div>
  )

  if (screen === 'register') return (
    <div style={{ display: 'flex', gap: 0, height: '100%' }}>
      {/* Product panel */}
      <div style={{ flex: 1, borderRight: `1px solid ${b}`, padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', background: bg, border: `1px solid ${b}`, borderRadius: 6 }}>
          <span style={{ fontSize: 12 }}>🔍</span>
          <span style={{ fontSize: 10, color: tx3 }}>Search products or scan barcode…</span>
        </div>
        {[
          { name: 'Argan Oil 30ml', price: 'KSh 150', sku: 'ARG-001', stock: 20 },
          { name: 'Banadir Coffee 100g', price: 'KSh 100', sku: 'BAN-002', stock: 119 },
          { name: 'Baobab Oil 30ml', price: 'KSh 150', sku: 'BAO-003', stock: 7 },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: sf, border: `1px solid ${b}`, borderRadius: 7 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: tx }}>{p.name}</div>
              <div style={{ fontSize: 9, color: tx3 }}>{p.sku} · Stock: {p.stock}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: tx }}>{p.price}</span>
              <button style={{ fontSize: 9, background: acc, color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'default' }}>+ Add</button>
            </div>
          </div>
        ))}
      </div>
      {/* Basket panel */}
      <div style={{ width: 140, padding: '12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: tx, marginBottom: 2 }}>Basket</div>
        {[
          { name: 'Argan Oil 30ml', qty: 2, price: 'KSh 300' },
          { name: 'Banadir Coffee', qty: 1, price: 'KSh 100' },
        ].map((item, i) => (
          <div key={i} style={{ padding: '6px 8px', background: bg, border: `1px solid ${b}`, borderRadius: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: tx }}>{item.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 9, color: tx3 }}>× {item.qty}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: tx }}>{item.price}</span>
            </div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${b}`, paddingTop: 6, marginTop: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: tx2, marginBottom: 2 }}>
            <span>Subtotal</span><span>KSh 400</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: tx2, marginBottom: 4 }}>
            <span>Tax (16%)</span><span>KSh 64</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: tx }}>
            <span>Total</span><span>KSh 464</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
          <button style={{ padding: '7px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'default' }}>💵 Cash</button>
          <button style={{ padding: '7px', background: acc, color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'default' }}>💳 Card</button>
          <button style={{ padding: '7px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'default' }}>📱 Mobile</button>
        </div>
      </div>
    </div>
  )

  if (screen === 'inventory') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: tx2 }}>60 products</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ fontSize: 9, padding: '4px 8px', border: `1px solid ${b}`, borderRadius: 5, background: sf, cursor: 'default', color: tx2 }}>Scan products</button>
          <button style={{ fontSize: 9, padding: '4px 8px', border: 'none', borderRadius: 5, background: acc, color: '#fff', cursor: 'default', fontWeight: 600 }}>+ Add product</button>
        </div>
      </div>
      <div style={{ background: `${red}08`, border: `1px solid ${red}20`, borderRadius: 6, padding: '6px 10px', fontSize: 9, color: red, fontWeight: 600 }}>
        ⚠ 37 items below reorder threshold
      </div>
      <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 7, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, padding: '6px 10px', background: bg, borderBottom: `1px solid ${b}` }}>
          {['PRODUCT','PRICE','COST','STOCK'].map(h => (
            <div key={h} style={{ fontSize: 8, fontWeight: 700, color: tx3, textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</div>
          ))}
        </div>
        {[
          { name: 'Argan Oil 30ml', tag: 'Retail', price: 'KSh 150', cost: 'KSh 100', stock: 20, low: false },
          { name: 'Banadir Coffee 100g', tag: 'Retail', price: 'KSh 100', cost: 'KSh 60', stock: 119, low: false },
          { name: 'Baobab Oil 30ml', tag: 'Retail', price: 'KSh 150', cost: 'KSh 100', stock: 7, low: true },
          { name: 'Black Seed Oil', tag: 'Retail', price: 'KSh 200', cost: 'KSh 130', stock: 3, low: true },
        ].map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, padding: '8px 10px', borderBottom: i < 3 ? `1px solid ${b}` : 'none', background: p.low ? `${red}04` : 'transparent' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: tx }}>{p.name}</div>
              <div style={{ fontSize: 8, color: tx3 }}>{p.tag}</div>
            </div>
            <div style={{ fontSize: 10, color: tx, alignSelf: 'center' }}>{p.price}</div>
            <div style={{ fontSize: 10, color: green, alignSelf: 'center' }}>{p.cost}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: p.low ? red : tx, alignSelf: 'center' }}>{p.stock}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (screen === 'reports') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {['Today','Yesterday','Last 7 days','Last 30 days'].map((t, i) => (
          <button key={t} style={{ fontSize: 8, padding: '3px 6px', borderRadius: 4, border: `1px solid ${i===2?acc:b}`, background: i===2?`${acc}15`:sf, color: i===2?acc:tx2, cursor: 'default', fontWeight: i===2?700:400 }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        <KpiCard label="Revenue" value="KSh 25,012" sub="↑ 100% vs prev" />
        <KpiCard label="Gross profit" value="KSh 12,422" sub="↑ 100% vs prev" />
        <KpiCard label="Avg sale" value="KSh 555" />
      </div>
      <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: tx3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Top Products — Last 7 days</div>
        {[
          { name: 'Banadir Coffee 100g', units: 18, rev: 'KSh 1,800', margin: '40%' },
          { name: 'Argan Oil 30ml', units: 12, rev: 'KSh 1,800', margin: '33%' },
          { name: 'Baobab Oil 30ml', units: 8, rev: 'KSh 1,200', margin: '33%' },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 2 ? `1px solid ${b}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: acc }}>#{i+1}</span>
              <span style={{ fontSize: 10, color: tx }}>{p.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 9, color: tx2 }}>
              <span>{p.units} units</span>
              <span style={{ fontWeight: 700, color: tx }}>{p.rev}</span>
              <span style={{ color: green }}>{p.margin}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button style={{ flex: 1, fontSize: 9, padding: '6px', background: sf, border: `1px solid ${b}`, borderRadius: 5, cursor: 'default', color: tx2 }}>📥 Export CSV</button>
        <button style={{ flex: 1, fontSize: 9, padding: '6px', background: sf, border: `1px solid ${b}`, borderRadius: 5, cursor: 'default', color: tx2 }}>📋 MTD VAT</button>
      </div>
    </div>
  )

  if (screen === 'staff') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: tx2 }}>2 of 2 seats used</span>
        <button style={{ fontSize: 9, padding: '5px 10px', background: red, color: '#fff', border: 'none', borderRadius: 5, cursor: 'default', fontWeight: 600 }}>Upgrade seats →</button>
      </div>
      {[
        { name: 'annet', role: 'cashier', tag: 'retail', branch: 'town', last: '19/05/2026', color: '#16a34a' },
        { name: 'james', role: 'inventory', tag: 'retail', branch: 'town', last: '18/05/2026', color: '#2563eb' },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: sf, border: `1px solid ${b}`, borderRadius: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${acc}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: acc }}>{s.name[0].toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: tx }}>{s.name}</span>
              <StatusBadge label="retail" color={green} />
            </div>
            <div style={{ fontSize: 9, color: tx3 }}>{s.role} · {s.branch} · PIN set · Last login {s.last}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ fontSize: 9, padding: '4px 8px', background: sf, border: `1px solid ${b}`, borderRadius: 4, cursor: 'default', color: tx2 }}>Edit</button>
            <button style={{ fontSize: 9, padding: '4px 8px', background: `${red}10`, border: `1px solid ${red}30`, borderRadius: 4, cursor: 'default', color: red }}>Deactivate</button>
          </div>
        </div>
      ))}
      <div style={{ background: `${green}08`, border: `1px solid ${green}25`, borderRadius: 7, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>✅</span>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: green }}>annet is live on Register #1</div>
          <div style={{ fontSize: 9, color: tx2 }}>Logged in 3 minutes ago · Ready to take payments</div>
        </div>
      </div>
    </div>
  )

  if (screen === 'retail') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>🛒 Retail Operations</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 4 }}>Stock management, sales tracking, and supplier orders.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[
          { icon: '📦', title: 'Inventory', desc: 'Stock levels & products', badge: '37' },
          { icon: '🛒', title: 'Sales', desc: 'Revenue & transactions' },
          { icon: '👥', title: 'Staff', desc: 'Cashiers & permissions' },
          { icon: '🏪', title: 'Branches', desc: 'Locations & stock by branch' },
          { icon: '🗺️', title: 'Map', desc: 'Branch locations on map' },
          { icon: '🔍', title: 'Audit', desc: 'Transaction & change log' },
        ].map((tile, i) => (
          <div key={i} style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 10px', position: 'relative' }}>
            {tile.badge && <div style={{ position: 'absolute', top: 6, right: 6, background: red, color: '#fff', fontSize: 8, fontWeight: 700, borderRadius: 9999, padding: '1px 5px' }}>{tile.badge}</div>}
            <div style={{ fontSize: 20, marginBottom: 4 }}>{tile.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: tx }}>{tile.title}</div>
            <div style={{ fontSize: 8, color: tx3, lineHeight: 1.4 }}>{tile.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (screen === 'restaurant') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>🍽 Restaurant Operations</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 4 }}>Floor plan, kitchen, orders, menu and labour — all in one place.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[
          { icon: '🏠', title: 'Hub', desc: 'Live operations dashboard' },
          { icon: '🗺️', title: 'Floor Plan', desc: 'Table status & seating' },
          { icon: '📋', title: 'Orders', desc: 'Take & manage orders' },
          { icon: '🍳', title: 'Kitchen', desc: 'Live KDS display' },
          { icon: '📖', title: 'Menu', desc: 'Edit items & pricing' },
          { icon: '⏱️', title: 'Labour', desc: 'Clock in/out & costs' },
          { icon: '📱', title: 'Online Orders', desc: 'Accept & manage online orders' },
          { icon: '📅', title: 'Reservations', desc: 'Bookings & covers management' },
          { icon: '🗑️', title: 'Waste', desc: 'Log & track food waste' },
        ].map((tile, i) => (
          <div key={i} style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 10px' }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{tile.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: tx }}>{tile.title}</div>
            <div style={{ fontSize: 8, color: tx3, lineHeight: 1.4 }}>{tile.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (screen === 'repair') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>🔧 Repair Operations</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 2 }}>Service jobs, engineer assignments, parts and customer collection.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
        {[
          { icon: '🔧', title: 'Service Jobs', desc: 'All jobs by status' },
          { icon: '👥', title: 'Staff', desc: 'Engineers & roles' },
          { icon: '🛒', title: 'Sales', desc: 'Revenue & transactions' },
          { icon: '📦', title: 'Parts', desc: 'Inventory levels' },
          { icon: '🔍', title: 'Audit', desc: 'Every action logged' },
        ].map((tile, i) => (
          <div key={i} style={{ background: sf, border: `1px solid ${b}`, borderRadius: 7, padding: '8px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{tile.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: tx }}>{tile.title}</div>
            <div style={{ fontSize: 7, color: tx3, lineHeight: 1.4 }}>{tile.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginTop: 4 }}>Service Jobs</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {['All','Intake','Quoted','Accepted','In Progress','Completed','Collected'].map((s, i) => (
          <button key={s} style={{ fontSize: 8, padding: '3px 7px', borderRadius: 4, border: `1px solid ${i===0?acc:b}`, background: i===0?`${acc}15`:sf, color: i===0?acc:tx2, cursor: 'default', fontWeight: i===0?700:400 }}>{s}</button>
        ))}
      </div>
      <div style={{ padding: '10px 12px', background: bg, border: `1px solid ${b}`, borderRadius: 7, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: tx2 }}>No service jobs yet</div>
        <div style={{ fontSize: 9, color: tx3 }}>Create a new job to get started</div>
      </div>
    </div>
  )

  if (screen === 'salon') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>💇 Salon & Bookings</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 4 }}>Appointments, stylist management, and retail sales.</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[
          { icon: '📅', title: 'Appointments', desc: 'Book & manage appointments per stylist' },
          { icon: '💇', title: 'Services', desc: 'Service menu, pricing & packages' },
          { icon: '🛒', title: 'Retail', desc: 'Product sales alongside services' },
          { icon: '📊', title: 'Performance', desc: 'Revenue & commissions per stylist' },
        ].map((tile, i) => (
          <div key={i} style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20 }}>{tile.icon}</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: tx, marginBottom: 2 }}>{tile.title}</div>
              <div style={{ fontSize: 8, color: tx3, lineHeight: 1.4 }}>{tile.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: `${acc}08`, border: `1px solid ${acc}25`, borderRadius: 8, padding: '10px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: acc, marginBottom: 4 }}>Today's appointments</div>
        {[
          { time: '09:00', client: 'Sarah M.', service: 'Cut & Blow dry', stylist: 'annet', dur: '60 min' },
          { time: '11:00', client: 'James K.', service: 'Men\'s cut', stylist: 'james', dur: '30 min' },
          { time: '14:30', client: 'Aisha O.', service: 'Colour & style', stylist: 'annet', dur: '90 min' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderTop: i > 0 ? `1px solid ${b}` : 'none' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: acc, width: 36 }}>{a.time}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: tx }}>{a.client}</div>
              <div style={{ fontSize: 8, color: tx3 }}>{a.service} · {a.stylist} · {a.dur}</div>
            </div>
            <StatusBadge label="Confirmed" color={green} />
          </div>
        ))}
      </div>
    </div>
  )

  if (screen === 'factory') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>🏭 Factory Operations</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 4 }}>Production captures, intake/output tracking, wastage logs and dispatch.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
        {[
          { icon: '📷', title: 'Captures', desc: 'Intake, output, wastage & dispatch' },
          { icon: '✅', title: 'Approvals', desc: 'Pending sign-offs' },
          { icon: '🤖', title: 'Intelligence', desc: 'AI anomaly detection' },
          { icon: '👥', title: 'Staff', desc: 'Supervisors & floor workers' },
          { icon: '📦', title: 'Inventory', desc: 'Raw materials & finished goods' },
        ].map((tile, i) => (
          <div key={i} style={{ background: sf, border: `1px solid ${b}`, borderRadius: 7, padding: '8px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{tile.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: tx }}>{tile.title}</div>
            <div style={{ fontSize: 7, color: tx3, lineHeight: 1.4 }}>{tile.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '6px 10px', background: bg, borderBottom: `1px solid ${b}` }}>
          {['BATCH','TYPE','QTY','STATUS','TIME'].map(h => (
            <div key={h} style={{ fontSize: 7, fontWeight: 700, color: tx3, textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</div>
          ))}
        </div>
        {[
          { batch: 'B-2024-047', type: 'intake', qty: '500kg', status: 'approved', time: '08:12', scolor: green },
          { batch: 'B-2024-047', type: 'output', qty: '420kg', status: 'approved', time: '14:30', scolor: green },
          { batch: 'B-2024-047', type: 'wastage', qty: '32kg', status: 'pending', time: '14:30', scolor: acc },
          { batch: 'B-2024-048', type: 'intake', qty: '300kg', status: 'pending', time: '16:00', scolor: acc },
        ].map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '6px 10px', borderBottom: i < 3 ? `1px solid ${b}` : 'none', background: r.type === 'wastage' ? `${red}04` : 'transparent' }}>
            <div style={{ fontSize: 8, color: tx }}>{r.batch}</div>
            <div style={{ fontSize: 8, color: r.type === 'wastage' ? red : tx2, fontWeight: r.type === 'wastage' ? 700 : 400 }}>{r.type}</div>
            <div style={{ fontSize: 8, color: tx }}>{r.qty}</div>
            <StatusBadge label={r.status} color={r.scolor} />
            <div style={{ fontSize: 8, color: tx3 }}>{r.time}</div>
          </div>
        ))}
      </div>
      <div style={{ background: `${red}08`, border: `1px solid ${red}20`, borderRadius: 6, padding: '6px 10px', fontSize: 9, color: red }}>
        ⚠ Wastage rate 6.4% — above your 5% baseline. Review batch B-2024-047.
      </div>
    </div>
  )

  if (screen === 'logistics') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx }}>🚚 Logistics Network</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 2 }}>Parcels, fleet, routes & revenue across all branches</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
        {[
          { label: 'Received', value: '12', color: tx },
          { label: 'In Transit', value: '8', color: '#2563eb' },
          { label: 'At Branch', value: '3', color: acc },
          { label: 'Delivered', value: '47', color: green },
        ].map(k => (
          <div key={k.label} style={{ background: sf, border: `1px solid ${b}`, borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 8, color: tx3, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: tx, marginBottom: 6 }}>💰 Revenue</div>
          {[['Today', 'KSh 4,200'], ['Total', 'KSh 28,900'], ['Unpaid', 'KSh 1,800']].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, padding: '2px 0', borderBottom: `1px solid ${b}` }}>
              <span style={{ color: tx2 }}>{k}</span>
              <span style={{ fontWeight: 600, color: k === 'Unpaid' ? red : tx }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: tx, marginBottom: 6 }}>🚚 Fleet</div>
          {[['Available', '3', green], ['In Transit', '4', '#2563eb'], ['Maintenance', '1', red]].map(([k,v,c]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, padding: '2px 0', borderBottom: `1px solid ${b}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: c as string }} />
                <span style={{ color: tx2 }}>{k}</span>
              </div>
              <span style={{ fontWeight: 700, color: c as string }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return null
}

export default function PosScreenMockup({ screen }: { screen: Screen }) {
  const tabLabel = TAB_LABELS[screen]
  const navItems = [
    { label: 'Overview', icon: '📊', active: screen === 'overview' || screen === 'reports' },
    { label: 'Operations', icon: '🛒', active: ['retail','restaurant','repair','salon','factory','inventory','register'].includes(screen) },
    { label: 'Staff', icon: '👥', active: screen === 'staff' },
    { label: 'Branches', icon: '🏪', active: false },
    { label: 'Audit', icon: '🔍', active: false },
    { label: 'Logistics', icon: '🚚', active: screen === 'logistics' },
  ]

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${b}`, boxShadow: '0 8px 32px rgba(0,0,0,.10)', background: sf, maxWidth: 560, width: '100%' }}>
      {/* Browser chrome */}
      <div style={{ background: '#EBEBEB', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${b}` }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FEBC2E' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#28C840' }} />
        </div>
        <div style={{ flex: 1, background: sf, borderRadius: 5, padding: '3px 10px', fontSize: 10, color: tx3 }}>
          askbiz.co/pos — {tabLabel}
        </div>
      </div>

      {/* App shell */}
      <div style={{ display: 'flex', minHeight: 400 }}>
        {/* Left sidebar */}
        <div style={{ width: 120, background: '#1a1916', flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
          {/* Logo */}
          <div style={{ padding: '0 12px 12px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 32 32" fill="none"><rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/><rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/><rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>AskBiz</span>
            </div>
          </div>
          {/* Top nav */}
          <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.08)', marginBottom: 6 }}>
            {[
              { icon: '💬', label: 'Ask' },
              { icon: '📈', label: 'Business' },
              { icon: '🖥', label: 'POS', active: true },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', margin: '1px 6px', borderRadius: 6, background: item.active ? `${acc}25` : 'transparent' }}>
                <span style={{ fontSize: 11 }}>{item.icon}</span>
                <span style={{ fontSize: 10, color: item.active ? acc : 'rgba(255,255,255,.5)', fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
              </div>
            ))}
          </div>
          {/* POS tabs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, padding: '0 0' }}>
            {navItems.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', margin: '1px 6px', borderRadius: 6, background: item.active ? `${acc}20` : 'transparent', borderLeft: item.active ? `2px solid ${acc}` : '2px solid transparent' }}>
                <span style={{ fontSize: 10 }}>{item.icon}</span>
                <span style={{ fontSize: 9, color: item.active ? '#fff' : 'rgba(255,255,255,.45)', fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
              </div>
            ))}
          </div>
          {/* User */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: acc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>E</div>
            <div>
              <div style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>emomery10</div>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,.4)' }}>Starter Plan</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, background: bg, overflow: 'hidden' }}>
          {/* Top bar */}
          <div style={{ background: sf, borderBottom: `1px solid ${b}`, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tx }}>Point of Sale</div>
              <div style={{ fontSize: 9, color: tx3 }}>Today · Tue 19 May</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ fontSize: 9, padding: '4px 8px', background: sf, border: `1px solid ${b}`, borderRadius: 5, cursor: 'default', color: tx2 }}>📋 MTD VAT</button>
              <button style={{ fontSize: 9, padding: '4px 8px', background: sf, border: `1px solid ${b}`, borderRadius: 5, cursor: 'default', color: tx2 }}>📥 Export CSV</button>
              <button style={{ fontSize: 9, padding: '4px 8px', background: acc, border: 'none', borderRadius: 5, cursor: 'default', color: '#fff', fontWeight: 600 }}>🖥 Open till</button>
            </div>
          </div>
          {/* Screen content */}
          <div style={{ overflow: 'auto', maxHeight: 340 }}>
            <ScreenContent screen={screen} />
          </div>
        </div>
      </div>
    </div>
  )
}
