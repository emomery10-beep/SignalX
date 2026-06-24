'use client'
// Renders a realistic AskBiz POS admin screen mockup
// Based on the actual askbiz.co/pos UI design language

import { useLang } from '@/components/LanguageProvider'

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

function buildTabLabels(tc: (k: string) => string): Record<Screen, string> {
  return {
    overview:   tc('pos_screenmockup.tabOverview'),
    register:   tc('pos_screenmockup.tabRegister'),
    inventory:  tc('pos_screenmockup.tabInventory'),
    reports:    tc('pos_screenmockup.tabReports'),
    staff:      tc('pos_screenmockup.tabStaff'),
    retail:     tc('pos_screenmockup.tabRetailOps'),
    restaurant: tc('pos_screenmockup.tabRestaurant'),
    repair:     tc('pos_screenmockup.tabRepairs'),
    salon:      tc('pos_screenmockup.tabBookings'),
    factory:    tc('pos_screenmockup.tabFactoryOps'),
    logistics:  tc('pos_screenmockup.tabLogistics'),
  }
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

function ScreenContent({ screen, tc }: { screen: Screen; tc: (k: string, vars?: Record<string, string | number>) => string }) {
  if (screen === 'overview') return (
    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[
          tc('pos_screenmockup.periodToday'),
          tc('pos_screenmockup.periodYesterday'),
          tc('pos_screenmockup.periodLast7'),
        ].map((t, i) => (
          <button key={t} style={{ fontSize: 9, padding: '3px 8px', borderRadius: 5, border: `1px solid ${i===0?acc:b}`, background: i===0?`${acc}15`:sf, color: i===0?acc:tx2, cursor: 'default', fontWeight: i===0?700:400 }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <KpiCard label={tc('pos_screenmockup.kpiRevenue')} value="KSh 25,012" sub="↑ 100% vs prev" />
        <KpiCard label={tc('pos_screenmockup.kpiSales')} value="45" sub="↑ 100% vs prev" />
        <KpiCard label={tc('pos_screenmockup.kpiGrossProfit')} value="KSh 12,422" color={green} />
        <KpiCard label={tc('pos_screenmockup.kpiMargin')} value="49.7%" color={green} />
      </div>
      <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: tx3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('pos_screenmockup.salesByHour')}</div>
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
          <div style={{ fontSize: 10, fontWeight: 700, color: red }}>{tc('pos_screenmockup.lowStockAlert')}</div>
          <div style={{ fontSize: 9, color: tx2 }}>{tc('pos_screenmockup.lowStockDetail')}</div>
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
          <span style={{ fontSize: 10, color: tx3 }}>{tc('pos_screenmockup.registerSearch')}</span>
        </div>
        {[
          { name: 'Argan Oil 30ml', price: 'KSh 150', sku: 'ARG-001', stock: 20 },
          { name: 'Banadir Coffee 100g', price: 'KSh 100', sku: 'BAN-002', stock: 119 },
          { name: 'Baobab Oil 30ml', price: 'KSh 150', sku: 'BAO-003', stock: 7 },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: sf, border: `1px solid ${b}`, borderRadius: 7 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: tx }}>{p.name}</div>
              <div style={{ fontSize: 9, color: tx3 }}>{p.sku} · {tc('pos_screenmockup.registerStockLabel', { stock: p.stock })}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: tx }}>{p.price}</span>
              <button style={{ fontSize: 9, background: acc, color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'default' }}>{tc('pos_screenmockup.registerAddBtn')}</button>
            </div>
          </div>
        ))}
      </div>
      {/* Basket panel */}
      <div style={{ width: 140, padding: '12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: tx, marginBottom: 2 }}>{tc('pos_screenmockup.basketTitle')}</div>
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
            <span>{tc('pos_screenmockup.basketSubtotal')}</span><span>KSh 400</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: tx2, marginBottom: 4 }}>
            <span>{tc('pos_screenmockup.basketTax')}</span><span>KSh 64</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: tx }}>
            <span>{tc('pos_screenmockup.basketTotal')}</span><span>KSh 464</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
          <button style={{ padding: '7px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'default' }}>{tc('pos_screenmockup.payBtnCash')}</button>
          <button style={{ padding: '7px', background: acc, color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'default' }}>{tc('pos_screenmockup.payBtnCard')}</button>
          <button style={{ padding: '7px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'default' }}>{tc('pos_screenmockup.payBtnMobile')}</button>
        </div>
      </div>
    </div>
  )

  if (screen === 'inventory') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: tx2 }}>{tc('pos_screenmockup.inventoryProductCount')}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ fontSize: 9, padding: '4px 8px', border: `1px solid ${b}`, borderRadius: 5, background: sf, cursor: 'default', color: tx2 }}>{tc('pos_screenmockup.inventoryScanBtn')}</button>
          <button style={{ fontSize: 9, padding: '4px 8px', border: 'none', borderRadius: 5, background: acc, color: '#fff', cursor: 'default', fontWeight: 600 }}>{tc('pos_screenmockup.inventoryAddBtn')}</button>
        </div>
      </div>
      <div style={{ background: `${red}08`, border: `1px solid ${red}20`, borderRadius: 6, padding: '6px 10px', fontSize: 9, color: red, fontWeight: 600 }}>
        {tc('pos_screenmockup.inventoryLowAlert')}
      </div>
      <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 7, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, padding: '6px 10px', background: bg, borderBottom: `1px solid ${b}` }}>
          {[
            tc('pos_screenmockup.colProduct'),
            tc('pos_screenmockup.colPrice'),
            tc('pos_screenmockup.colCost'),
            tc('pos_screenmockup.colStock'),
          ].map(h => (
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
        {[
          tc('pos_screenmockup.periodToday'),
          tc('pos_screenmockup.periodYesterday'),
          tc('pos_screenmockup.periodLast7'),
          tc('pos_screenmockup.periodLast30'),
        ].map((t, i) => (
          <button key={t} style={{ fontSize: 8, padding: '3px 6px', borderRadius: 4, border: `1px solid ${i===2?acc:b}`, background: i===2?`${acc}15`:sf, color: i===2?acc:tx2, cursor: 'default', fontWeight: i===2?700:400 }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        <KpiCard label={tc('pos_screenmockup.kpiRevenue')} value="KSh 25,012" sub="↑ 100% vs prev" />
        <KpiCard label={tc('pos_screenmockup.kpiGrossProfit')} value="KSh 12,422" sub="↑ 100% vs prev" />
        <KpiCard label={tc('pos_screenmockup.kpiAvgSale')} value="KSh 555" />
      </div>
      <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: tx3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>{tc('pos_screenmockup.topProductsHeading')}</div>
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
        <button style={{ flex: 1, fontSize: 9, padding: '6px', background: sf, border: `1px solid ${b}`, borderRadius: 5, cursor: 'default', color: tx2 }}>{tc('pos_screenmockup.reportExportCsv')}</button>
        <button style={{ flex: 1, fontSize: 9, padding: '6px', background: sf, border: `1px solid ${b}`, borderRadius: 5, cursor: 'default', color: tx2 }}>{tc('pos_screenmockup.reportMtdVat')}</button>
      </div>
    </div>
  )

  if (screen === 'staff') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: tx2 }}>{tc('pos_screenmockup.staffSeatsUsed')}</span>
        <button style={{ fontSize: 9, padding: '5px 10px', background: red, color: '#fff', border: 'none', borderRadius: 5, cursor: 'default', fontWeight: 600 }}>{tc('pos_screenmockup.staffUpgradeBtn')}</button>
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
            <div style={{ fontSize: 9, color: tx3 }}>{s.role} · {s.branch} · {tc('pos_screenmockup.staffPinSet')} · {tc('pos_screenmockup.staffLastLogin', { date: s.last })}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={{ fontSize: 9, padding: '4px 8px', background: sf, border: `1px solid ${b}`, borderRadius: 4, cursor: 'default', color: tx2 }}>{tc('pos_screenmockup.staffEditBtn')}</button>
            <button style={{ fontSize: 9, padding: '4px 8px', background: `${red}10`, border: `1px solid ${red}30`, borderRadius: 4, cursor: 'default', color: red }}>{tc('pos_screenmockup.staffDeactivateBtn')}</button>
          </div>
        </div>
      ))}
      <div style={{ background: `${green}08`, border: `1px solid ${green}25`, borderRadius: 7, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>✅</span>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: green }}>{tc('pos_screenmockup.staffLiveTitle')}</div>
          <div style={{ fontSize: 9, color: tx2 }}>{tc('pos_screenmockup.staffLiveDetail')}</div>
        </div>
      </div>
    </div>
  )

  if (screen === 'retail') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>{tc('pos_screenmockup.retailOpsTitle')}</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 4 }}>{tc('pos_screenmockup.retailOpsSubtitle')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[
          { icon: '📦', title: tc('pos_screenmockup.retailTileInventoryTitle'), desc: tc('pos_screenmockup.retailTileInventoryDesc'), badge: '37' },
          { icon: '🛒', title: tc('pos_screenmockup.retailTileSalesTitle'), desc: tc('pos_screenmockup.retailTileSalesDesc') },
          { icon: '👥', title: tc('pos_screenmockup.retailTileStaffTitle'), desc: tc('pos_screenmockup.retailTileStaffDesc') },
          { icon: '🏪', title: tc('pos_screenmockup.retailTileBranchesTitle'), desc: tc('pos_screenmockup.retailTileBranchesDesc') },
          { icon: '🗺️', title: tc('pos_screenmockup.retailTileMapTitle'), desc: tc('pos_screenmockup.retailTileMapDesc') },
          { icon: '🔍', title: tc('pos_screenmockup.retailTileAuditTitle'), desc: tc('pos_screenmockup.retailTileAuditDesc') },
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
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>{tc('pos_screenmockup.restaurantOpsTitle')}</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 4 }}>{tc('pos_screenmockup.restaurantOpsSubtitle')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[
          { icon: '🏠', title: tc('pos_screenmockup.restaurantTileHubTitle'), desc: tc('pos_screenmockup.restaurantTileHubDesc') },
          { icon: '🗺️', title: tc('pos_screenmockup.restaurantTileFloorTitle'), desc: tc('pos_screenmockup.restaurantTileFloorDesc') },
          { icon: '📋', title: tc('pos_screenmockup.restaurantTileOrdersTitle'), desc: tc('pos_screenmockup.restaurantTileOrdersDesc') },
          { icon: '🍳', title: tc('pos_screenmockup.restaurantTileKitchenTitle'), desc: tc('pos_screenmockup.restaurantTileKitchenDesc') },
          { icon: '📖', title: tc('pos_screenmockup.restaurantTileMenuTitle'), desc: tc('pos_screenmockup.restaurantTileMenuDesc') },
          { icon: '⏱️', title: tc('pos_screenmockup.restaurantTileLabourTitle'), desc: tc('pos_screenmockup.restaurantTileLabourDesc') },
          { icon: '📱', title: tc('pos_screenmockup.restaurantTileOnlineTitle'), desc: tc('pos_screenmockup.restaurantTileOnlineDesc') },
          { icon: '📅', title: tc('pos_screenmockup.restaurantTileReservationsTitle'), desc: tc('pos_screenmockup.restaurantTileReservationsDesc') },
          { icon: '🗑️', title: tc('pos_screenmockup.restaurantTileWasteTitle'), desc: tc('pos_screenmockup.restaurantTileWasteDesc') },
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
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>{tc('pos_screenmockup.repairOpsTitle')}</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 2 }}>{tc('pos_screenmockup.repairOpsSubtitle')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
        {[
          { icon: '🔧', title: tc('pos_screenmockup.repairTileJobsTitle'), desc: tc('pos_screenmockup.repairTileJobsDesc') },
          { icon: '👥', title: tc('pos_screenmockup.repairTileStaffTitle'), desc: tc('pos_screenmockup.repairTileStaffDesc') },
          { icon: '🛒', title: tc('pos_screenmockup.repairTileSalesTitle'), desc: tc('pos_screenmockup.repairTileSalesDesc') },
          { icon: '📦', title: tc('pos_screenmockup.repairTilePartsTitle'), desc: tc('pos_screenmockup.repairTilePartsDesc') },
          { icon: '🔍', title: tc('pos_screenmockup.repairTileAuditTitle'), desc: tc('pos_screenmockup.repairTileAuditDesc') },
        ].map((tile, i) => (
          <div key={i} style={{ background: sf, border: `1px solid ${b}`, borderRadius: 7, padding: '8px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{tile.icon}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: tx }}>{tile.title}</div>
            <div style={{ fontSize: 7, color: tx3, lineHeight: 1.4 }}>{tile.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginTop: 4 }}>{tc('pos_screenmockup.repairServiceJobsHeading')}</div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {[
          tc('pos_screenmockup.repairFilterAll'),
          tc('pos_screenmockup.repairFilterIntake'),
          tc('pos_screenmockup.repairFilterQuoted'),
          tc('pos_screenmockup.repairFilterAccepted'),
          tc('pos_screenmockup.repairFilterInProgress'),
          tc('pos_screenmockup.repairFilterCompleted'),
          tc('pos_screenmockup.repairFilterCollected'),
        ].map((s, i) => (
          <button key={s} style={{ fontSize: 8, padding: '3px 7px', borderRadius: 4, border: `1px solid ${i===0?acc:b}`, background: i===0?`${acc}15`:sf, color: i===0?acc:tx2, cursor: 'default', fontWeight: i===0?700:400 }}>{s}</button>
        ))}
      </div>
      <div style={{ padding: '10px 12px', background: bg, border: `1px solid ${b}`, borderRadius: 7, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: tx2 }}>{tc('pos_screenmockup.repairEmptyTitle')}</div>
        <div style={{ fontSize: 9, color: tx3 }}>{tc('pos_screenmockup.repairEmptyDetail')}</div>
      </div>
    </div>
  )

  if (screen === 'salon') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>{tc('pos_screenmockup.salonOpsTitle')}</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 4 }}>{tc('pos_screenmockup.salonOpsSubtitle')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[
          { icon: '📅', title: tc('pos_screenmockup.salonTileApptTitle'), desc: tc('pos_screenmockup.salonTileApptDesc') },
          { icon: '💇', title: tc('pos_screenmockup.salonTileServicesTitle'), desc: tc('pos_screenmockup.salonTileServicesDesc') },
          { icon: '🛒', title: tc('pos_screenmockup.salonTileRetailTitle'), desc: tc('pos_screenmockup.salonTileRetailDesc') },
          { icon: '📊', title: tc('pos_screenmockup.salonTilePerfTitle'), desc: tc('pos_screenmockup.salonTilePerfDesc') },
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
        <div style={{ fontSize: 10, fontWeight: 700, color: acc, marginBottom: 4 }}>{tc('pos_screenmockup.salonTodayAppts')}</div>
        {[
          { time: '09:00', client: 'Sarah M.', service: 'Cut & Blow dry', stylist: 'annet', dur: '60 min' },
          { time: '11:00', client: 'James K.', service: "Men's cut", stylist: 'james', dur: '30 min' },
          { time: '14:30', client: 'Aisha O.', service: 'Colour & style', stylist: 'annet', dur: '90 min' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderTop: i > 0 ? `1px solid ${b}` : 'none' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: acc, width: 36 }}>{a.time}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: tx }}>{a.client}</div>
              <div style={{ fontSize: 8, color: tx3 }}>{a.service} · {a.stylist} · {a.dur}</div>
            </div>
            <StatusBadge label={tc('pos_screenmockup.salonStatusConfirmed')} color={green} />
          </div>
        ))}
      </div>
    </div>
  )

  if (screen === 'factory') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx, marginBottom: 2 }}>{tc('pos_screenmockup.factoryOpsTitle')}</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 4 }}>{tc('pos_screenmockup.factoryOpsSubtitle')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 5 }}>
        {[
          { icon: '📷', title: tc('pos_screenmockup.factoryTileCapturesTitle'), desc: tc('pos_screenmockup.factoryTileCapturesDesc') },
          { icon: '✅', title: tc('pos_screenmockup.factoryTileApprovalsTitle'), desc: tc('pos_screenmockup.factoryTileApprovalsDesc') },
          { icon: '🤖', title: tc('pos_screenmockup.factoryTileIntelTitle'), desc: tc('pos_screenmockup.factoryTileIntelDesc') },
          { icon: '👥', title: tc('pos_screenmockup.factoryTileStaffTitle'), desc: tc('pos_screenmockup.factoryTileStaffDesc') },
          { icon: '📦', title: tc('pos_screenmockup.factoryTileInventoryTitle'), desc: tc('pos_screenmockup.factoryTileInventoryDesc') },
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
          {[
            tc('pos_screenmockup.factoryColBatch'),
            tc('pos_screenmockup.factoryColType'),
            tc('pos_screenmockup.factoryColQty'),
            tc('pos_screenmockup.factoryColStatus'),
            tc('pos_screenmockup.factoryColTime'),
          ].map(h => (
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
        {tc('pos_screenmockup.factoryWastageAlert')}
      </div>
    </div>
  )

  if (screen === 'logistics') return (
    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: tx }}>{tc('pos_screenmockup.logisticsTitle')}</div>
      <div style={{ fontSize: 9, color: tx2, marginBottom: 2 }}>{tc('pos_screenmockup.logisticsSubtitle')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
        {[
          { labelKey: 'pos_screenmockup.logisticsKpiReceived', value: '12', color: tx },
          { labelKey: 'pos_screenmockup.logisticsKpiInTransit', value: '8', color: '#2563eb' },
          { labelKey: 'pos_screenmockup.logisticsKpiAtBranch', value: '3', color: acc },
          { labelKey: 'pos_screenmockup.logisticsKpiDelivered', value: '47', color: green },
        ].map(k => (
          <div key={k.labelKey} style={{ background: sf, border: `1px solid ${b}`, borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 8, color: tx3, marginTop: 2 }}>{tc(k.labelKey)}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: tx, marginBottom: 6 }}>{tc('pos_screenmockup.logisticsRevenueTitle')}</div>
          {[
            [tc('pos_screenmockup.logisticsRevToday'), 'KSh 4,200'],
            [tc('pos_screenmockup.logisticsRevTotal'), 'KSh 28,900'],
            [tc('pos_screenmockup.logisticsRevUnpaid'), 'KSh 1,800'],
          ].map(([k, v], idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, padding: '2px 0', borderBottom: `1px solid ${b}` }}>
              <span style={{ color: tx2 }}>{k}</span>
              <span style={{ fontWeight: 600, color: idx === 2 ? red : tx }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: sf, border: `1px solid ${b}`, borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: tx, marginBottom: 6 }}>{tc('pos_screenmockup.logisticsFleetTitle')}</div>
          {[
            [tc('pos_screenmockup.logisticsFleetAvailable'), '3', green],
            [tc('pos_screenmockup.logisticsFleetInTransit'), '4', '#2563eb'],
            [tc('pos_screenmockup.logisticsFleetMaintenance'), '1', red],
          ].map(([k, v, c], idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, padding: '2px 0', borderBottom: `1px solid ${b}` }}>
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
  const { tc } = useLang()
  const TAB_LABELS = buildTabLabels(tc)
  const tabLabel = TAB_LABELS[screen]
  const navItems = [
    { label: tc('pos_screenmockup.navOverview'), icon: '📊', active: screen === 'overview' || screen === 'reports' },
    { label: tc('pos_screenmockup.navOperations'), icon: '🛒', active: ['retail','restaurant','repair','salon','factory','inventory','register'].includes(screen) },
    { label: tc('pos_screenmockup.navStaff'), icon: '👥', active: screen === 'staff' },
    { label: tc('pos_screenmockup.navBranches'), icon: '🏪', active: false },
    { label: tc('pos_screenmockup.navAudit'), icon: '🔍', active: false },
    { label: tc('pos_screenmockup.navLogistics'), icon: '🚚', active: screen === 'logistics' },
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
          {tc('pos_screenmockup.browserUrlPrefix', { tab: tabLabel })}
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
              { icon: '💬', label: tc('pos_screenmockup.navAsk') },
              { icon: '📈', label: tc('pos_screenmockup.navBusiness') },
              { icon: '🖥', label: tc('pos_screenmockup.navPos'), active: true },
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
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,.4)' }}>{tc('pos_screenmockup.userPlan')}</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, background: bg, overflow: 'hidden' }}>
          {/* Top bar */}
          <div style={{ background: sf, borderBottom: `1px solid ${b}`, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: tx }}>{tc('pos_screenmockup.appTitle')}</div>
              <div style={{ fontSize: 9, color: tx3 }}>{tc('pos_screenmockup.appDateSubtitle')}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ fontSize: 9, padding: '4px 8px', background: sf, border: `1px solid ${b}`, borderRadius: 5, cursor: 'default', color: tx2 }}>{tc('pos_screenmockup.headerMtdVat')}</button>
              <button style={{ fontSize: 9, padding: '4px 8px', background: sf, border: `1px solid ${b}`, borderRadius: 5, cursor: 'default', color: tx2 }}>{tc('pos_screenmockup.headerExportCsv')}</button>
              <button style={{ fontSize: 9, padding: '4px 8px', background: acc, border: 'none', borderRadius: 5, cursor: 'default', color: '#fff', fontWeight: 600 }}>{tc('pos_screenmockup.headerOpenTill')}</button>
            </div>
          </div>
          {/* Screen content */}
          <div style={{ overflow: 'auto', maxHeight: 340 }}>
            <ScreenContent screen={screen} tc={tc} />
          </div>
        </div>
      </div>
    </div>
  )
}
