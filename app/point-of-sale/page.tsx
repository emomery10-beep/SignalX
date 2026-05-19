'use client'
import { useState } from 'react'
import Link from 'next/link'
import { SECTORS as SHARED_SECTORS } from '@/lib/pos-sectors'

const C = {
  bg:'#f9f8f6', sf:'#ffffff', ev:'#f3f2ef',
  tx:'#1a1916', tx2:'#6b6760', tx3:'#a39e97',
  b:'rgba(0,0,0,.08)', b2:'rgba(0,0,0,.14)',
  acc:'#d08a59', accBg:'rgba(208,138,89,.08)', accBdr:'rgba(208,138,89,.25)',
}

const FEATURES = [
  { icon:'🧾', title:'Register & Checkout', desc:'Fast checkout with barcode scanning or manual search. Split payments, layaways, discounts, refunds, and digital receipts in any currency.', tag:'Core' },
  { icon:'💱', title:'Any Currency, Any Country', desc:'Set your store currency to GBP, USD, EUR, NGN, KES, AED, INR, ZAR or 150+ others. Exchange rates, symbol formatting, and decimal rules handled automatically.', tag:'Global' },
  { icon:'📦', title:'Inventory Management', desc:'Real-time stock levels across every branch. Low-stock alerts, stock transfers, batch updates, and AI-powered reorder recommendations.', tag:'Smart' },
  { icon:'🏪', title:'Multi-Branch', desc:'Run multiple locations — in the same country or across borders — from one dashboard. Per-branch currency, tax, inventory, and staff settings.', tag:'Scale' },
  { icon:'👥', title:'Staff & Shifts', desc:'Role-based access for cashiers and managers. Shift open/close with cash reconciliation, OTP login, and per-cashier performance tracking.', tag:'Team' },
  { icon:'🧮', title:'Tax & Compliance', desc:'VAT, GST, sales tax, and custom local tax rates. Multi-jurisdiction rules, consolidated reports, and filing-ready previews. Syncs to Xero and QuickBooks.', tag:'Finance' },
  { icon:'🌍', title:'Localisation', desc:'Date formats, number separators, address formats, and receipt layouts automatically match your country. Right-to-left language support included.', tag:'Local' },
  { icon:'💳', title:'Flexible Payments', desc:'Accept card, cash, mobile money (M-Pesa, MTN, Airtel), QR pay, and split payments. Works offline and syncs when reconnected.', tag:'Payments' },
  { icon:'🤖', title:'AI Intelligence', desc:'Anomaly detection on transactions, AI-driven supplier recommendations, sales pattern insights, and demand forecasting — all from your PoS data.', tag:'AI' },
  { icon:'📊', title:'Reports & Analytics', desc:'Daily, weekly, and monthly sales reports broken down by product, cashier, branch, and payment method. Export in your local currency.', tag:'Insights' },
  { icon:'🔒', title:'Privacy & Compliance', desc:'GDPR, NDPR, POPIA, and PDPA ready. One-click customer data export, deletion requests, consent logging, and configurable retention policies.', tag:'Trust' },
  { icon:'📱', title:'Works Everywhere', desc:'Runs on any device — iPad at the counter, Android phone for pop-ups, or desktop in the back office. No proprietary hardware, no lock-in.', tag:'Flex' },
]

const WORKFLOW = [
  { step:'1', title:'Open a shift', desc:'Cashier logs in with OTP, counts the float, and the register is live.' },
  { step:'2', title:'Ring up sales', desc:'Scan barcodes or search products. Split payments, apply discounts, issue digital receipts.' },
  { step:'3', title:'AI works in the background', desc:'Every transaction feeds your intelligence layer — anomaly alerts, restock suggestions, margin analysis.' },
  { step:'4', title:'Close & reconcile', desc:'Close the shift, reconcile cash, and the day\'s data flows into your reports and accounting sync.' },
]

// SECTORS imported from @/lib/pos-sectors
const SECTORS = SHARED_SECTORS

const DEMO_STEPS = [
  { label: 'Point & scan', desc: 'Point the camera at any barcode or QR code. No typing.' },
  { label: 'Instant recognition', desc: 'Product matched in your inventory in under a second.' },
  { label: 'Added to basket', desc: 'Line item appears with price, quantity, and tax — automatically.' },
  { label: 'Tap to pay', desc: 'Card, cash, or mobile wallet. Receipt sent digitally.' },
]

export default function PosPage() {
  const [annual, setAnnual] = useState(true)
  const [demoStep, setDemoStep] = useState(0)
  const [demoRunning, setDemoRunning] = useState(false)
  const [walkthroughStep, setWalkthroughStep] = useState(0)
  const [walkthroughPlaying, setWalkthroughPlaying] = useState(false)
  const [sectorTab, setSectorTab] = useState('retail')
  const seatPrice = '£5'

  function playWalkthrough() {
    if (walkthroughPlaying) return
    setWalkthroughPlaying(true)
    setWalkthroughStep(1)
    setTimeout(() => setWalkthroughStep(2), 2200)
    setTimeout(() => setWalkthroughStep(3), 4400)
    setTimeout(() => setWalkthroughStep(4), 6600)
    setTimeout(() => { setWalkthroughPlaying(false) }, 8800)
  }

  function runDemo() {
    if (demoRunning) return
    setDemoRunning(true)
    setDemoStep(1)
    setTimeout(() => setDemoStep(2), 1600)
    setTimeout(() => setDemoStep(3), 2900)
    setTimeout(() => setDemoStep(4), 4200)
    setTimeout(() => { setDemoStep(0); setDemoRunning(false) }, 6200)
  }

  return (
    <div style={{ background:C.bg, minHeight:'100vh' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fadeUp .5s ease both }
        .card-hover { transition: transform 180ms ease, box-shadow 180ms ease }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,.07) }
        @keyframes scanLine { 0%,100% { top:8% } 50% { top:82% } }
        .scan-line { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#4ade80 40%,#4ade80 60%,transparent); animation:scanLine 1.1s ease-in-out infinite; box-shadow:0 0 10px rgba(74,222,128,.7); z-index:4 }
        @keyframes popIn { from { opacity:0; transform:scale(.88) translateY(6px) } to { opacity:1; transform:scale(1) translateY(0) } }
        .pop-in { animation:popIn .3s cubic-bezier(.34,1.56,.64,1) both }
        @keyframes slideUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        .slide-up { animation:slideUp .35s ease both }
        @keyframes pulseGreen { 0%,100% { box-shadow:0 0 0 0 rgba(74,222,128,.4) } 50% { box-shadow:0 0 0 10px rgba(74,222,128,0) } }
        .pulse-green { animation:pulseGreen 1.2s ease infinite }
        @keyframes spin { to { transform:rotate(360deg) } }
        @media (max-width:767px) { .sector-features-grid { grid-template-columns:1fr !important } }
        @media (min-width:640px) and (max-width:1023px) { .sector-features-grid { grid-template-columns:1fr 1fr !important } }
        @keyframes progressBar { from { width:0% } to { width:100% } }
        .progress-fill { animation: progressBar 8.8s linear both }
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor { display:inline-block; width:2px; height:14px; background:#d08a59; animation:cursorBlink .8s ease infinite; verticalAlign:middle; marginLeft:2px }
        @media (max-width:767px) { .walkthrough-nav { display:none !important } .walkthrough-facts { grid-template-columns:1fr !important } }
        @media (max-width:767px) {
          .pos-hero-grid { grid-template-columns:1fr !important }
          .features-grid { grid-template-columns:1fr !important }
          .workflow-grid { grid-template-columns:1fr !important }
          .compare-grid { grid-template-columns:1fr !important }
          .demo-grid { grid-template-columns:1fr !important }
          .pos-hero-mock { display:none !important }
        }
        @media (min-width:640px) and (max-width:1023px) {
          .features-grid { grid-template-columns:1fr 1fr !important }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(249,248,246,.96)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${C.b}`, padding:'0 clamp(16px,4vw,32px)', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:800, color:C.tx, textDecoration:'none', letterSpacing:'-.03em' }}>
          ask<span style={{ color:C.acc }}>biz</span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <Link href="/#pricing" style={{ fontSize:13, color:C.tx2, textDecoration:'none', fontWeight:500 }}>Pricing</Link>
          <Link href="/signin" className="btn-primary" style={{ padding:'8px 18px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>
            Try free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pos-hero-grid" style={{ maxWidth:1100, margin:'0 auto', padding:'clamp(56px,8vw,100px) clamp(16px,4vw,40px) clamp(40px,6vw,72px)', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(32px,5vw,64px)', alignItems:'center' }}>
        <div>
          <div className="fade-up" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:9999, background:C.accBg, border:`1px solid ${C.accBdr}`, fontSize:12, color:C.acc, fontWeight:600, marginBottom:24 }}>
            🧾 Point of Sale
          </div>
          <h1 className="fade-up" style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(30px,4.5vw,48px)', fontWeight:700, lineHeight:1.1, letterSpacing:'-.035em', marginBottom:20, color:C.tx }}>
            A full PoS system,<br/>
            <span style={{ color:C.acc }}>powered by AI.</span>
          </h1>
          <p className="fade-up" style={{ fontSize:'clamp(15px,1.8vw,18px)', color:C.tx2, lineHeight:1.7, marginBottom:14, maxWidth:460 }}>
            Ring up sales, manage inventory across branches, track staff shifts, and stay tax-compliant — while your AI learns from every transaction.
          </p>
          <p className="fade-up" style={{ fontSize:13, color:C.tx3, marginBottom:32, lineHeight:1.6 }}>
            {seatPrice}/seat per month · Works on tablet, phone, or desktop · No special hardware
          </p>
          <div className="fade-up" style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <Link href="/signin" className="btn-primary" style={{ padding:'13px 28px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8, boxShadow:`0 4px 20px ${C.acc}40` }}>
              Start free trial
            </Link>
            <a href="#features" style={{ padding:'13px 20px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:14, fontWeight:500, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
              See features ↓
            </a>
            <a href="#sectors" style={{ padding:'13px 20px', borderRadius:9999, border:`1px solid ${C.b2}`, background:'transparent', color:C.tx2, fontSize:14, fontWeight:500, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>
              🛒🍽️🔧 By sector
            </a>
          </div>
        </div>

        {/* Mock register UI */}
        <div className="pos-hero-mock fade-up" style={{ background:C.sf, borderRadius:20, border:`1px solid ${C.b}`, padding:24, boxShadow:'0 12px 40px rgba(0,0,0,.06)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.tx }}>Register — Shift #104</div>
            <div style={{ fontSize:11, color:'#16a34a', fontWeight:600, background:'rgba(22,163,74,.08)', padding:'3px 10px', borderRadius:9999 }}>● Live</div>
          </div>
          {[
            { name:'Wireless Earbuds', qty:2, price:'£29.99', total:'£59.98' },
            { name:'Phone Case — Matte Black', qty:1, price:'£12.50', total:'£12.50' },
            { name:'USB-C Cable 2m', qty:3, price:'£6.99', total:'£20.97' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.ev}`, fontSize:13 }}>
              <div>
                <div style={{ fontWeight:600, color:C.tx }}>{item.name}</div>
                <div style={{ fontSize:11, color:C.tx3 }}>× {item.qty} @ {item.price}</div>
              </div>
              <div style={{ fontWeight:700, color:C.tx }}>{item.total}</div>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:16, paddingTop:12, borderTop:`2px solid ${C.tx}` }}>
            <div>
              <div style={{ fontSize:11, color:C.tx3, marginBottom:2 }}>Subtotal · VAT 20%</div>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:22, fontWeight:800, color:C.tx }}>£111.94</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ padding:'10px 20px', borderRadius:10, background:C.ev, fontSize:13, fontWeight:600, color:C.tx2, cursor:'default' }}>Split</div>
              <div style={{ padding:'10px 24px', borderRadius:10, background:C.acc, color:'#fff', fontSize:13, fontWeight:700, cursor:'default', boxShadow:`0 2px 12px ${C.acc}35` }}>Pay →</div>
            </div>
          </div>
          <div style={{ marginTop:16, display:'flex', gap:8 }}>
            <div style={{ flex:1, padding:'8px', borderRadius:8, background:C.ev, textAlign:'center', fontSize:11, fontWeight:600, color:C.tx3 }}>💳 Card</div>
            <div style={{ flex:1, padding:'8px', borderRadius:8, background:C.ev, textAlign:'center', fontSize:11, fontWeight:600, color:C.tx3 }}>💵 Cash</div>
            <div style={{ flex:1, padding:'8px', borderRadius:8, background:C.ev, textAlign:'center', fontSize:11, fontWeight:600, color:C.tx3 }}>📱 Mobile Wallet</div>
          </div>
        </div>
      </section>

      {/* Camera-first Demo */}
      <section style={{ background:`linear-gradient(160deg, #0f0f0e 0%, #1a1916 100%)`, padding:'clamp(56px,7vw,92px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>How it feels</div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(24px,3.5vw,38px)', fontWeight:700, textAlign:'center', marginBottom:12, letterSpacing:'-.03em', color:'#fff' }}>
            Scan. Add. Done.
          </h2>
          <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:'rgba(255,255,255,.55)', lineHeight:1.7, maxWidth:520, margin:'0 auto 52px', textAlign:'center' }}>
            No manual entry. Point, scan, checkout — the entire sale takes seconds.
          </p>

          <div className="demo-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(32px,5vw,72px)', alignItems:'center' }}>

            {/* Phone mock */}
            <div style={{ display:'flex', justifyContent:'center' }}>
              <div style={{ width:260, background:'#111', borderRadius:40, padding:'14px 10px 20px', boxShadow:'0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.06)', position:'relative' }}>
                {/* Status bar */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 14px 10px', color:'rgba(255,255,255,.5)', fontSize:10 }}>
                  <span>9:41</span>
                  <div style={{ width:80, height:6, background:'rgba(255,255,255,.08)', borderRadius:3 }} />
                  <span>●●●</span>
                </div>
                {/* App bar */}
                <div style={{ background:'#1a1a1a', margin:'0 2px', borderRadius:'14px 14px 0 0', padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,.06)' }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:600 }}>askbiz Register</span>
                  <span style={{ fontSize:10, color:'#4ade80', fontWeight:600 }}>● Live</span>
                </div>
                {/* Camera view */}
                <div style={{ background:'#000', margin:'0 2px', aspectRatio:'1/1.1', position:'relative', overflow:'hidden' }}>
                  {/* Subtle camera noise texture */}
                  <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(255,255,255,.03) 0%, transparent 70%)', zIndex:1 }} />
                  {/* Viewfinder corners */}
                  {[{top:14,left:14},{top:14,right:14},{bottom:14,left:14},{bottom:14,right:14}].map((pos, i) => (
                    <div key={i} style={{ position:'absolute', ...pos, width:22, height:22, zIndex:3,
                      borderTop: (i < 2) ? `2px solid ${C.acc}` : 'none',
                      borderBottom: (i >= 2) ? `2px solid ${C.acc}` : 'none',
                      borderLeft: (i === 0 || i === 2) ? `2px solid ${C.acc}` : 'none',
                      borderRight: (i === 1 || i === 3) ? `2px solid ${C.acc}` : 'none',
                    }} />
                  ))}
                  {/* Barcode target area */}
                  {demoStep <= 1 && (
                    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2 }}>
                      {demoStep === 0 && (
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontSize:28, marginBottom:8 }}>📷</div>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', letterSpacing:'.04em' }}>Aim at barcode</div>
                        </div>
                      )}
                      {demoStep === 1 && (
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', letterSpacing:'.04em', background:'rgba(0,0,0,.5)', padding:'4px 10px', borderRadius:6 }}>Scanning…</div>
                          {/* fake barcode lines */}
                          <div style={{ marginTop:14, display:'flex', gap:2, justifyContent:'center', opacity:.4 }}>
                            {[3,7,2,6,4,8,3,5,7,2,6,4,5,3,8,4,7,3].map((h, j) => (
                              <div key={j} style={{ width:2, height:h*4, background:'#fff', borderRadius:1 }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Scanning line */}
                  {demoStep === 1 && <div className="scan-line" />}
                  {/* Recognition overlay */}
                  {demoStep === 2 && (
                    <div className="pop-in" style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:5, background:'rgba(0,0,0,.75)', backdropFilter:'blur(4px)' }}>
                      <div style={{ background:'#1a1a1a', borderRadius:16, padding:'16px 20px', border:`1px solid rgba(74,222,128,.4)`, minWidth:180, textAlign:'center' }}>
                        <div style={{ width:36, height:36, background:'rgba(74,222,128,.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', fontSize:18 }}>✓</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:3 }}>USB-C Charger 65W</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,.45)', marginBottom:10 }}>SKU: CHG-65W-BK</div>
                        <div style={{ fontSize:18, fontWeight:800, color:'#4ade80', fontFamily:'var(--font-sora)' }}>£24.99</div>
                      </div>
                    </div>
                  )}
                  {/* Added state */}
                  {demoStep === 3 && (
                    <div className="pop-in" style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:5, background:'rgba(0,0,0,.75)', backdropFilter:'blur(4px)', padding:16 }}>
                      <div style={{ width:'100%', background:'#1a1a1a', borderRadius:12, padding:'12px 14px', marginBottom:10, border:'1px solid rgba(255,255,255,.08)' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,.7)', marginBottom:4 }}>
                          <span>USB-C Charger 65W</span>
                          <span style={{ color:'#4ade80', fontWeight:700 }}>£24.99</span>
                        </div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,.7)', marginBottom:4 }}>
                          <span>Wireless Mouse Pro</span>
                          <span style={{ color:'#4ade80', fontWeight:700 }}>£49.99</span>
                        </div>
                        <div style={{ borderTop:'1px solid rgba(255,255,255,.1)', paddingTop:8, marginTop:4, display:'flex', justifyContent:'space-between', fontSize:12, color:'#fff', fontWeight:700 }}>
                          <span>Total</span>
                          <span>£74.98</span>
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:'rgba(74,222,128,.8)', fontWeight:600, letterSpacing:'.06em' }}>+1 ITEM ADDED</div>
                    </div>
                  )}
                  {/* Paid state */}
                  {demoStep === 4 && (
                    <div className="pop-in" style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:5, background:'rgba(0,0,0,.85)', backdropFilter:'blur(6px)' }}>
                      <div style={{ textAlign:'center' }}>
                        <div className="pulse-green" style={{ width:56, height:56, background:'rgba(74,222,128,.15)', border:'2px solid #4ade80', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontSize:24 }}>✓</div>
                        <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>Payment complete</div>
                        <div style={{ fontSize:12, color:'rgba(255,255,255,.5)' }}>£74.98 · Card · 2.1s</div>
                        <div style={{ marginTop:10, fontSize:10, color:'rgba(74,222,128,.7)', fontWeight:600, letterSpacing:'.06em' }}>RECEIPT SENT · AI UPDATED</div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Bottom tray */}
                <div style={{ background:'#1a1a1a', margin:'0 2px', borderRadius:'0 0 14px 14px', padding:'10px 14px', borderTop:'1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {['💳','💵','📱'].map((icon, i) => (
                      <div key={i} style={{ flex:1, background:'rgba(255,255,255,.06)', borderRadius:8, padding:'6px 0', textAlign:'center', fontSize:13 }}>{icon}</div>
                    ))}
                  </div>
                </div>
                {/* Home indicator */}
                <div style={{ width:70, height:3, background:'rgba(255,255,255,.2)', borderRadius:2, margin:'12px auto 0' }} />
              </div>
            </div>

            {/* Steps + CTA */}
            <div>
              <div style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:36 }}>
                {DEMO_STEPS.map((s, i) => {
                  const stepNum = i + 1
                  const isActive = demoStep === stepNum
                  const isDone = demoStep > stepNum
                  return (
                    <div key={i} style={{ display:'flex', gap:16, padding:'16px 0', borderBottom:'1px solid rgba(255,255,255,.06)', transition:'opacity .3s ease', opacity: demoStep === 0 || isActive || isDone ? 1 : .35 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, fontFamily:'var(--font-sora)',
                        background: isDone ? '#4ade80' : isActive ? C.acc : 'rgba(255,255,255,.08)',
                        color: (isDone || isActive) ? '#fff' : 'rgba(255,255,255,.4)',
                        transition: 'background .3s ease, color .3s ease',
                        boxShadow: isActive ? `0 0 16px ${C.acc}60` : isDone ? '0 0 16px rgba(74,222,128,.4)' : 'none',
                      }}>
                        {isDone ? '✓' : stepNum}
                      </div>
                      <div style={{ paddingTop:4 }}>
                        <div style={{ fontSize:14, fontWeight:700, color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.5)', marginBottom:3, transition:'color .3s ease' }}>{s.label}</div>
                        <div style={{ fontSize:12, color:'rgba(255,255,255,.35)', lineHeight:1.6 }}>{s.desc}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={runDemo}
                disabled={demoRunning}
                style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'14px 28px', borderRadius:9999, background: demoRunning ? 'rgba(255,255,255,.08)' : C.acc, color: demoRunning ? 'rgba(255,255,255,.4)' : '#fff', fontSize:15, fontWeight:700, border:'none', cursor: demoRunning ? 'not-allowed' : 'pointer', boxShadow: demoRunning ? 'none' : `0 4px 24px ${C.acc}50`, transition:'all .25s ease', letterSpacing:'-.01em' }}>
                {demoRunning ? (
                  <>
                    <span style={{ display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'rgba(255,255,255,.7)', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
                    Running demo…
                  </>
                ) : (
                  <>▶ Watch it in action</>
                )}
              </button>
              <p style={{ marginTop:12, fontSize:12, color:'rgba(255,255,255,.3)' }}>No sign-up needed — just hit play.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>Features</div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,36px)', fontWeight:700, textAlign:'center', marginBottom:12, letterSpacing:'-.03em', color:C.tx }}>
            Built to sell anywhere in the world
          </h2>
          <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:C.tx2, lineHeight:1.7, maxWidth:580, margin:'0 auto 20px', textAlign:'center' }}>
            One platform. Any country, any currency, any tax system. No extra setup — just pick your locale and start selling.
          </p>

          {/* Global banner */}
          <div style={{ borderRadius:16, background:`linear-gradient(135deg, #1a1916 0%, #252320 100%)`, border:`1px solid rgba(208,138,89,.2)`, padding:'clamp(18px,3vw,26px) clamp(20px,3vw,32px)', marginBottom:36, display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span style={{ fontSize:20 }}>🌍</span>
                <span style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:700, color:'#fff' }}>Works in 150+ countries</span>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,.5)', margin:0, lineHeight:1.6, maxWidth:440 }}>
                Set your store currency once. Prices, receipts, tax reports, and accounting exports all follow. Switch branches to different currencies without losing a thing.
              </p>
            </div>
            {/* Currency ticker */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {[
                { sym:'£', name:'GBP', flag:'🇬🇧' },
                { sym:'$', name:'USD', flag:'🇺🇸' },
                { sym:'€', name:'EUR', flag:'🇪🇺' },
                { sym:'₦', name:'NGN', flag:'🇳🇬' },
                { sym:'KSh', name:'KES', flag:'🇰🇪' },
                { sym:'د.إ', name:'AED', flag:'🇦🇪' },
                { sym:'₹', name:'INR', flag:'🇮🇳' },
                { sym:'R', name:'ZAR', flag:'🇿🇦' },
                { sym:'¥', name:'JPY', flag:'🇯🇵' },
                { sym:'৳', name:'BDT', flag:'🇧🇩' },
              ].map((c, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:8, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)' }}>
                  <span style={{ fontSize:13 }}>{c.flag}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:'#fff', fontFamily:'var(--font-sora)' }}>{c.sym}</span>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,.35)' }}>{c.name}</span>
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'center', padding:'5px 12px', borderRadius:8, background:'rgba(208,138,89,.12)', border:`1px solid ${C.accBdr}` }}>
                <span style={{ fontSize:12, color:C.acc, fontWeight:600 }}>+140 more</span>
              </div>
            </div>
          </div>

          {/* Feature cards — 4 col, 3 rows */}
          <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card-hover" style={{ padding:'22px 18px', borderRadius:16, border: f.tag === 'Global' ? `2px solid ${C.accBdr}` : `1px solid ${C.b}`, background: f.tag === 'Global' ? C.accBg : C.bg, display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:24 }}>{f.icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color: f.tag === 'Global' ? C.acc : C.acc, background: f.tag === 'Global' ? `rgba(208,138,89,.18)` : C.accBg, border:`1px solid ${C.accBdr}`, padding:'2px 8px', borderRadius:9999, textTransform:'uppercase', letterSpacing:'.05em' }}>{f.tag}</span>
                </div>
                <div style={{ fontFamily:'var(--font-sora)', fontSize:15, fontWeight:700, color:C.tx }}>{f.title}</div>
                <p style={{ fontSize:13, color:C.tx2, lineHeight:1.65, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Tax systems callout */}
          <div style={{ marginTop:28, borderRadius:14, border:`1px solid ${C.b}`, background:C.bg, padding:'18px 24px', display:'flex', flexWrap:'wrap', alignItems:'center', gap:16, justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:22 }}>🧮</span>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.tx, marginBottom:2 }}>Every major tax system supported</div>
                <div style={{ fontSize:12, color:C.tx3 }}>VAT · GST · Sales Tax · Withholding Tax · Custom rates — configured per branch, per country.</div>
              </div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['🇬🇧 UK VAT','🇪🇺 EU VAT (OSS)','🇺🇸 US Sales Tax','🇳🇬 FIRS / VAT','🇰🇪 KRA / VAT','🇮🇳 GST','🇿🇦 SARS / VAT','🇦🇪 UAE VAT','🇦🇺 GST','Custom'].map((t, i) => (
                <span key={i} style={{ fontSize:11, color:C.tx2, background:C.ev, padding:'3px 9px', borderRadius:6, fontWeight:500 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sector showcase */}
      <section id="sectors" style={{ background:C.bg, borderTop:`1px solid ${C.b}`, padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>Your sector</div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,36px)', fontWeight:700, textAlign:'center', marginBottom:12, letterSpacing:'-.03em', color:C.tx }}>
            Tailored to how you work
          </h2>
          <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:C.tx2, lineHeight:1.7, maxWidth:560, margin:'0 auto 36px', textAlign:'center' }}>
            One platform, six sectors. The PoS adapts its tiles, workflows, and intelligence to match your type of business.
          </p>

          {/* Sector tabs */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginBottom:36 }}>
            {SECTORS.map(s => {
              const active = sectorTab === s.id
              return (
                <button key={s.id} onClick={() => setSectorTab(s.id)} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:9999, border: active ? `2px solid ${s.color}` : `1px solid ${C.b2}`, background: active ? `${s.color}12` : C.sf, color: active ? s.color : C.tx2, fontSize:14, fontWeight: active ? 700 : 500, cursor:'pointer', transition:'all .2s ease', boxShadow: active ? `0 2px 12px ${s.color}25` : 'none' }}>
                  <span style={{ fontSize:18 }}>{s.icon}</span>
                  {s.label}
                </button>
              )
            })}
          </div>

          {/* Active sector panel */}
          {SECTORS.filter(s => s.id === sectorTab).map(sector => (
            <div key={sector.id} className="pop-in" style={{ borderRadius:20, border:`1px solid ${C.b}`, background:C.sf, overflow:'hidden' }}>
              {/* Header bar */}
              <div style={{ background:`linear-gradient(135deg, ${sector.color}18 0%, ${sector.color}06 100%)`, borderBottom:`1px solid ${C.b}`, padding:'clamp(20px,3vw,28px) clamp(20px,3vw,32px)', display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:20 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                    <span style={{ fontSize:28 }}>{sector.icon}</span>
                    <span style={{ fontFamily:'var(--font-sora)', fontSize:22, fontWeight:800, color:C.tx }}>{sector.label}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:'#fff', background:sector.color, padding:'3px 10px', borderRadius:9999, letterSpacing:'.04em' }}>Sector</span>
                  </div>
                  <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:700, color:sector.color, marginBottom:4 }}>{sector.tagline}</div>
                  <p style={{ fontSize:14, color:C.tx2, margin:0, maxWidth:500, lineHeight:1.6 }}>{sector.desc}</p>
                </div>
                {/* Mini operations tile preview */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, maxWidth:320 }}>
                  {sector.tiles.map((tile, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:10, background: i === 0 ? sector.color : C.ev, border: i === 0 ? 'none' : `1px solid ${C.b}`, fontSize:12, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? '#fff' : C.tx2 }}>
                      {tile}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature grid */}
              <div style={{ padding:'clamp(20px,3vw,28px) clamp(20px,3vw,32px)' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }} className="sector-features-grid">
                  {sector.features.map((f, i) => (
                    <div key={i} style={{ padding:'16px', borderRadius:14, border:`1px solid ${C.b}`, background:C.bg, display:'flex', flexDirection:'column', gap:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:20 }}>{f.icon}</span>
                        <span style={{ fontFamily:'var(--font-sora)', fontSize:13, fontWeight:700, color:C.tx }}>{f.title}</span>
                      </div>
                      <p style={{ fontSize:12, color:C.tx2, lineHeight:1.6, margin:0 }}>{f.desc}</p>
                    </div>
                  ))}
                </div>
                {/* CTA to dedicated sector page */}
                <div style={{ marginTop:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
                  <p style={{ fontSize:13, color:C.tx3, margin:0 }}>All sectors share inventory, staff, branches, tax, AI, and multi-currency.</p>
                  <Link href={`/point-of-sale/${sectorTab}`} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:9999, background:SECTORS.find(s => s.id === sectorTab)?.color || C.acc, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                    Full {SECTORS.find(s => s.id === sectorTab)?.label} guide →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth:900, margin:'0 auto', padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>How it works</div>
        <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, textAlign:'center', marginBottom:48, letterSpacing:'-.03em', color:C.tx }}>
          From shift open to close
        </h2>
        <div className="workflow-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {WORKFLOW.map((s, i) => (
            <div key={i} style={{ textAlign:'center' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:C.acc, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontFamily:'var(--font-sora)', fontSize:16, fontWeight:800 }}>{s.step}</div>
              <div style={{ fontFamily:'var(--font-sora)', fontSize:14, fontWeight:700, color:C.tx, marginBottom:8 }}>{s.title}</div>
              <p style={{ fontSize:13, color:C.tx2, lineHeight:1.6, margin:0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section style={{ background:C.sf, borderTop:`1px solid ${C.b}`, borderBottom:`1px solid ${C.b}`, padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>Why askbiz PoS</div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, textAlign:'center', marginBottom:44, letterSpacing:'-.03em', color:C.tx }}>
            More than a register
          </h2>
          <div className="compare-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div style={{ padding:24, borderRadius:16, border:`1px solid ${C.b}`, background:C.bg }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.tx3, marginBottom:16 }}>Traditional PoS</div>
              {['Ring up sales','Basic inventory','Manual reporting','Separate analytics tool','No AI insights','Extra cost for multi-branch'].map((f, i) => (
                <div key={i} style={{ display:'flex', gap:8, alignItems:'center', fontSize:13, color:C.tx3, marginBottom:8 }}>
                  <span style={{ fontSize:12 }}>—</span> {f}
                </div>
              ))}
            </div>
            <div style={{ padding:24, borderRadius:16, border:`2px solid ${C.acc}`, background:`rgba(208,138,89,.02)` }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.acc, marginBottom:16 }}>askbiz PoS</div>
              {['Ring up sales + AI anomaly alerts','Smart inventory with reorder AI','Auto reports synced to Xero / QB','Built-in business intelligence','AI pattern insights from every sale','Multi-branch included'].map((f, i) => (
                <div key={i} style={{ display:'flex', gap:8, alignItems:'center', fontSize:13, color:C.tx, marginBottom:8 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.acc} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}><path d="M20 6L9 17l-5-5"/></svg>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Setup walkthrough */}
      <section style={{ background:C.bg, borderTop:`1px solid ${C.b}`, padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>Setup in minutes</div>
          <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,36px)', fontWeight:700, textAlign:'center', marginBottom:12, letterSpacing:'-.03em', color:C.tx }}>
            Add a cashier or inventory user<br/>in under 2 minutes
          </h2>
          <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:C.tx2, lineHeight:1.7, maxWidth:520, margin:'0 auto 44px', textAlign:'center' }}>
            No IT team. No training manuals. Pick a name, set a role, share an OTP — your staff is live.
          </p>

          {/* Walkthrough player */}
          <div style={{ borderRadius:20, overflow:'hidden', border:`1px solid ${C.b2}`, boxShadow:'0 16px 48px rgba(0,0,0,.08)', background:'#fff' }}>
            {/* Fake browser chrome */}
            <div style={{ background:'#f3f2ef', padding:'10px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${C.b}` }}>
              <div style={{ display:'flex', gap:6 }}>
                {['#ff5f57','#ffbd2e','#28c840'].map((c,i) => <div key={i} style={{ width:11, height:11, borderRadius:'50%', background:c }} />)}
              </div>
              <div style={{ flex:1, background:'rgba(0,0,0,.06)', borderRadius:6, padding:'4px 12px', fontSize:11, color:C.tx3, textAlign:'center' }}>
                pos.askbiz.co — Staff Management
              </div>
            </div>

            {/* Screen area */}
            <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', minHeight:340 }}>
              {/* Left nav */}
              <div className="walkthrough-nav" style={{ background:'#faf9f7', borderRight:`1px solid ${C.b}`, padding:'16px 0' }}>
                <div style={{ padding:'6px 16px', marginBottom:4 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.tx3, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>askbiz PoS</div>
                </div>
                {[
                  { icon:'🏠', label:'Overview' },
                  { icon:'🧾', label:'Register' },
                  { icon:'📦', label:'Inventory' },
                  { icon:'👥', label:'Staff', active: true },
                  { icon:'📊', label:'Reports' },
                  { icon:'⚙️', label:'Settings' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', fontSize:13, fontWeight: item.active ? 600 : 400, color: item.active ? C.acc : C.tx2, background: item.active ? C.accBg : 'transparent', borderRight: item.active ? `2px solid ${C.acc}` : '2px solid transparent' }}>
                    <span style={{ fontSize:15 }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content — changes by step */}
              <div style={{ padding:'24px 28px', position:'relative', minHeight:300 }}>

                {/* Step 0 — idle / cover */}
                {walkthroughStep === 0 && (
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(249,248,246,.92)', backdropFilter:'blur(2px)', zIndex:10, gap:16 }}>
                    <div style={{ width:64, height:64, borderRadius:'50%', background:C.acc, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, boxShadow:`0 6px 24px ${C.acc}50`, cursor:'pointer' }} onClick={playWalkthrough}>▶</div>
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:700, color:C.tx, marginBottom:4 }}>Watch: Add your first cashier</div>
                      <div style={{ fontSize:13, color:C.tx3 }}>2 min walkthrough · No audio needed</div>
                    </div>
                    <button onClick={playWalkthrough} style={{ padding:'10px 28px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:14, fontWeight:700, border:'none', cursor:'pointer', boxShadow:`0 3px 16px ${C.acc}40` }}>
                      ▶ Play walkthrough
                    </button>
                  </div>
                )}

                {/* Step 1 — Staff list, click Add */}
                {walkthroughStep >= 1 && (
                  <div style={{ opacity: walkthroughStep >= 1 ? 1 : 0, transition:'opacity .4s ease' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                      <div>
                        <div style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:700, color:C.tx }}>Staff Members</div>
                        <div style={{ fontSize:12, color:C.tx3, marginTop:2 }}>2 active · 1 location</div>
                      </div>
                      <div style={{ padding:'8px 16px', borderRadius:9, background: walkthroughStep === 1 ? C.acc : C.acc, color:'#fff', fontSize:13, fontWeight:700, cursor:'default', boxShadow: walkthroughStep === 1 ? `0 0 0 3px ${C.acc}30, 0 3px 12px ${C.acc}40` : `0 3px 12px ${C.acc}40`, transition:'box-shadow .3s ease' }}>
                        + Add staff member
                      </div>
                    </div>
                    {[
                      { name:'Sarah M.', role:'Manager', status:'Active', avatar:'S' },
                      { name:'James K.', role:'Cashier', status:'Active', avatar:'J' },
                    ].map((s, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:`1px solid ${C.ev}` }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:C.ev, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:C.tx2 }}>{s.avatar}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.tx }}>{s.name}</div>
                          <div style={{ fontSize:11, color:C.tx3 }}>{s.role}</div>
                        </div>
                        <div style={{ fontSize:11, color:'#16a34a', fontWeight:600, background:'rgba(22,163,74,.08)', padding:'3px 9px', borderRadius:9999 }}>● {s.status}</div>
                      </div>
                    ))}
                    {walkthroughStep === 1 && (
                      <div className="pop-in" style={{ position:'absolute', top:20, right:28, background:'#fff', borderRadius:12, border:`2px solid ${C.acc}`, padding:'6px 12px', fontSize:12, color:C.acc, fontWeight:600, boxShadow:`0 4px 16px ${C.acc}25` }}>
                        👆 Click to add new staff
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2 — Add staff form */}
                {walkthroughStep === 2 && (
                  <div className="pop-in" style={{ position:'absolute', inset:0, background:'#fff', padding:'24px 28px', zIndex:5 }}>
                    <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:700, color:C.tx, marginBottom:20 }}>New Staff Member</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:600, color:C.tx2, marginBottom:6, textTransform:'uppercase', letterSpacing:'.04em' }}>Full name</div>
                        <div style={{ padding:'9px 12px', borderRadius:8, border:`2px solid ${C.acc}`, fontSize:13, color:C.tx, background:'#fff', display:'flex', alignItems:'center', gap:4 }}>
                          Amara Osei<span className="cursor" />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize:11, fontWeight:600, color:C.tx2, marginBottom:6, textTransform:'uppercase', letterSpacing:'.04em' }}>Role</div>
                        <div style={{ padding:'9px 12px', borderRadius:8, border:`1px solid ${C.b2}`, fontSize:13, color:C.tx, background:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span>Cashier</span><span style={{ fontSize:10, color:C.tx3 }}>▼</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:C.tx2, marginBottom:6, textTransform:'uppercase', letterSpacing:'.04em' }}>Branch access</div>
                      <div style={{ padding:'9px 12px', borderRadius:8, border:`1px solid ${C.b2}`, fontSize:13, color:C.tx, background:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span>Main Branch</span><span style={{ fontSize:10, color:C.tx3 }}>▼</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', padding:'10px 14px', borderRadius:9, background:C.accBg, border:`1px solid ${C.accBdr}`, marginBottom:18 }}>
                      <span style={{ fontSize:16 }}>🔒</span>
                      <span style={{ fontSize:12, color:C.tx2, lineHeight:1.5 }}>Staff log in with a one-time OTP — no password needed. You control who can access what.</span>
                    </div>
                    <div style={{ padding:'10px 24px', borderRadius:9, background:C.acc, color:'#fff', fontSize:14, fontWeight:700, display:'inline-flex', alignItems:'center', gap:8, boxShadow:`0 3px 12px ${C.acc}40`, cursor:'default' }}>
                      Create & send OTP →
                    </div>
                  </div>
                )}

                {/* Step 3 — OTP generated */}
                {walkthroughStep === 3 && (
                  <div className="pop-in" style={{ position:'absolute', inset:0, background:'#fff', padding:'24px 28px', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <div style={{ width:60, height:60, borderRadius:'50%', background:'rgba(22,163,74,.1)', border:'2px solid #16a34a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:16 }}>✓</div>
                    <div style={{ fontFamily:'var(--font-sora)', fontSize:18, fontWeight:700, color:C.tx, marginBottom:6, textAlign:'center' }}>Amara Osei added</div>
                    <div style={{ fontSize:13, color:C.tx3, marginBottom:24, textAlign:'center' }}>Share this one-time code with your staff member</div>
                    <div style={{ display:'flex', gap:8, marginBottom:20 }}>
                      {['7','4','2','9','1','8'].map((d, i) => (
                        <div key={i} style={{ width:44, height:52, borderRadius:10, background:C.ev, border:`2px solid ${C.b2}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-sora)', fontSize:22, fontWeight:800, color:C.tx }}>{d}</div>
                      ))}
                    </div>
                    <div style={{ display:'flex', gap:10 }}>
                      <div style={{ padding:'8px 18px', borderRadius:8, border:`1px solid ${C.b2}`, fontSize:13, color:C.tx2, cursor:'default', display:'flex', alignItems:'center', gap:6 }}>
                        📋 Copy code
                      </div>
                      <div style={{ padding:'8px 18px', borderRadius:8, background:C.acc, color:'#fff', fontSize:13, fontWeight:700, cursor:'default', display:'flex', alignItems:'center', gap:6, boxShadow:`0 2px 10px ${C.acc}35` }}>
                        📱 Send via WhatsApp
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 — Staff logs in */}
                {walkthroughStep === 4 && (
                  <div className="pop-in" style={{ position:'absolute', inset:0, background:'#fff', padding:'24px 28px', zIndex:5 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                      <div>
                        <div style={{ fontFamily:'var(--font-sora)', fontSize:17, fontWeight:700, color:C.tx }}>Staff Members</div>
                        <div style={{ fontSize:12, color:C.tx3, marginTop:2 }}>3 active · 1 location</div>
                      </div>
                    </div>
                    {[
                      { name:'Sarah M.', role:'Manager', status:'Active', avatar:'S' },
                      { name:'James K.', role:'Cashier', status:'Active', avatar:'J' },
                      { name:'Amara O.', role:'Cashier', status:'Active', avatar:'A', new:true },
                    ].map((s, i) => (
                      <div key={i} className={s.new ? 'pop-in' : ''} style={{ display:'flex', alignItems:'center', gap:12, padding: s.new ? '12px' : '12px 0', borderBottom:`1px solid ${C.ev}`, background: s.new ? C.accBg : 'transparent', borderRadius: s.new ? 8 : 0, margin: s.new ? '4px 0' : 0 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background: s.new ? C.acc : C.ev, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color: s.new ? '#fff' : C.tx2 }}>{s.avatar}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:C.tx, display:'flex', alignItems:'center', gap:6 }}>{s.name} {s.new && <span style={{ fontSize:10, color:C.acc, fontWeight:700, background:C.accBg, border:`1px solid ${C.accBdr}`, padding:'1px 6px', borderRadius:9999 }}>NEW</span>}</div>
                          <div style={{ fontSize:11, color:C.tx3 }}>{s.role}</div>
                        </div>
                        <div style={{ fontSize:11, color:'#16a34a', fontWeight:600, background:'rgba(22,163,74,.08)', padding:'3px 9px', borderRadius:9999 }}>● {s.status}</div>
                      </div>
                    ))}
                    <div style={{ marginTop:16, padding:'12px 16px', borderRadius:10, background:'rgba(22,163,74,.06)', border:'1px solid rgba(22,163,74,.2)', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:18 }}>🎉</span>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#16a34a' }}>Amara is live on Register #2</div>
                        <div style={{ fontSize:11, color:C.tx3 }}>Logged in 12 seconds ago · Ready to take payments</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar footer */}
            <div style={{ background:'#f3f2ef', borderTop:`1px solid ${C.b}`, padding:'10px 16px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background: walkthroughStep >= n ? C.acc : C.ev, border: walkthroughStep === n ? `2px solid ${C.acc}` : '2px solid transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color: walkthroughStep >= n ? '#fff' : C.tx3, transition:'all .3s ease' }}>{walkthroughStep > n ? '✓' : n}</div>
                    {n < 4 && <div style={{ width:24, height:2, background: walkthroughStep > n ? C.acc : C.ev, transition:'background .3s ease', borderRadius:1 }} />}
                  </div>
                ))}
              </div>
              <div style={{ flex:1, height:3, background:C.ev, borderRadius:2, overflow:'hidden' }}>
                {walkthroughPlaying && <div className="progress-fill" style={{ height:'100%', background:C.acc, borderRadius:2 }} />}
                {!walkthroughPlaying && walkthroughStep === 4 && <div style={{ height:'100%', background:C.acc, width:'100%', borderRadius:2 }} />}
              </div>
              <div style={{ fontSize:11, color:C.tx3, whiteSpace:'nowrap' }}>
                {walkthroughStep === 0 && 'Click play to start'}
                {walkthroughStep === 1 && 'Step 1 — Staff list'}
                {walkthroughStep === 2 && 'Step 2 — Fill in details'}
                {walkthroughStep === 3 && 'Step 3 — OTP generated'}
                {walkthroughStep === 4 && '✓ Done — staff is live'}
              </div>
              {walkthroughStep > 0 && !walkthroughPlaying && (
                <button onClick={() => { setWalkthroughStep(0); setWalkthroughPlaying(false) }} style={{ fontSize:11, color:C.tx3, background:'none', border:`1px solid ${C.b2}`, borderRadius:6, padding:'3px 10px', cursor:'pointer' }}>↺ Replay</button>
              )}
            </div>
          </div>

          {/* 3 quick facts below */}
          <div className="walkthrough-facts" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginTop:24 }}>
            {[
              { icon:'⏱', stat:'< 2 min', desc:'Average setup time per staff member' },
              { icon:'📱', stat:'OTP login', desc:'No passwords — staff get a one-time code' },
              { icon:'🔑', stat:'3 roles', desc:'Manager · Cashier · Inventory — set once, controlled forever' },
            ].map((f, i) => (
              <div key={i} style={{ padding:'18px 16px', borderRadius:14, border:`1px solid ${C.b}`, background:C.sf, display:'flex', gap:12, alignItems:'flex-start' }}>
                <span style={{ fontSize:22 }}>{f.icon}</span>
                <div>
                  <div style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:800, color:C.tx, marginBottom:2 }}>{f.stat}</div>
                  <div style={{ fontSize:12, color:C.tx3, lineHeight:1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ maxWidth:600, margin:'0 auto', padding:'clamp(52px,7vw,84px) clamp(16px,4vw,40px)' }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:16, textAlign:'center' }}>Pricing</div>
        <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, textAlign:'center', marginBottom:8, letterSpacing:'-.03em', color:C.tx }}>
          Simple per-seat pricing
        </h2>
        <p style={{ textAlign:'center', fontSize:14, color:C.tx2, marginBottom:36 }}>Add PoS to any Growth or Business plan.</p>

        <div style={{ borderRadius:20, border:`2px solid ${C.acc}`, background:C.sf, padding:'32px 28px', textAlign:'center', position:'relative' }}>
          <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', padding:'3px 14px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em' }}>
            Add-on
          </div>
          <div style={{ fontFamily:'var(--font-sora)', fontSize:42, fontWeight:800, color:C.tx, letterSpacing:'-.03em', marginBottom:4 }}>
            {seatPrice}<span style={{ fontSize:16, fontWeight:500, color:C.tx3 }}>/seat/month</span>
          </div>
          <p style={{ fontSize:14, color:C.tx2, marginBottom:24, lineHeight:1.6 }}>
            Each seat is one register or device. Add as many as you need.
          </p>
          <div style={{ textAlign:'left', maxWidth:340, margin:'0 auto 28px' }}>
            {[
              'Unlimited transactions',
              'All 12 features included',
              'Multi-branch at no extra cost',
              'AI intelligence from day one',
              'Xero & QuickBooks sync',
              'Cancel anytime',
            ].map((f, i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'center', fontSize:13, color:C.tx2, marginBottom:8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.acc} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}><path d="M20 6L9 17l-5-5"/></svg>
                {f}
              </div>
            ))}
          </div>
          <Link href="/signin" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 32px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:`0 4px 20px ${C.acc}40` }}>
            Start free trial
          </Link>
          <p style={{ fontSize:12, color:C.tx3, marginTop:12 }}>Free during trial · No credit card needed</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:C.sf, borderTop:`1px solid ${C.b}`, padding:'clamp(52px,7vw,80px) clamp(16px,4vw,40px)', textAlign:'center' }}>
        <h2 style={{ fontFamily:'var(--font-sora)', fontSize:'clamp(22px,3.5vw,34px)', fontWeight:700, letterSpacing:'-.03em', color:C.tx, marginBottom:14 }}>
          Ready to sell smarter?
        </h2>
        <p style={{ fontSize:'clamp(14px,1.6vw,17px)', color:C.tx2, lineHeight:1.7, maxWidth:480, margin:'0 auto 28px' }}>
          Set up your first register in under 5 minutes. No hardware needed — just sign in and start selling.
        </p>
        <Link href="/signin" className="btn-primary" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', borderRadius:9999, background:C.acc, color:'#fff', fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:`0 4px 20px ${C.acc}40` }}>
          Get started free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${C.b}`, padding:'28px clamp(16px,4vw,40px)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, fontSize:12, color:C.tx3 }}>
        <Link href="/" style={{ fontFamily:'var(--font-sora)', fontSize:16, fontWeight:800, color:C.tx, textDecoration:'none' }}>
          ask<span style={{ color:C.acc }}>biz</span>
        </Link>
        <div style={{ display:'flex', gap:20 }}>
          <Link href="/" style={{ color:C.tx3, textDecoration:'none' }}>Home</Link>
          <Link href="/#pricing" style={{ color:C.tx3, textDecoration:'none' }}>Pricing</Link>
          <Link href="/signin" style={{ color:C.tx3, textDecoration:'none' }}>Sign in</Link>
        </div>
      </footer>
    </div>
  )
}
