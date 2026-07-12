'use client'
import { useState, useEffect, useRef, type CSSProperties, type FormEvent } from 'react'
import Link from 'next/link'
import { LanguageProvider, useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import type { Lang } from '@/lib/i18n'
import { COUNTRY_TO_LANG } from '@/lib/i18n'
import { localePath } from '@/lib/i18n-locale'
import type { Locale } from '@/lib/i18n-locale'
import { createClient } from '@/lib/supabase/client'

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:     '#f2f3f5',   /* clean blue-gray neutral — amber is the only warmth */
  card:   '#FFFFFF',
  alt:    '#e8eaed',   /* cool elevated surface */
  tx:     '#1A1410',
  tx2:    '#4A4038',
  tx3:    '#6b6560',
  bd:     '#dde0e4',   /* cool border */
  bd2:    '#c8ccd2',   /* cool strong border */
  acc:    '#C97A44',
  accBg:  'rgba(201,122,68,.08)',
  accBdr: 'rgba(201,122,68,.28)',
  nav:    'rgba(242,243,245,.92)',  /* matches bg */
}

interface Geo {
  country: string; countryCode: string; city: string
  currency: string; currencySymbol: string; currencyName: string; flag: string
  pricing: { growth: string; business: string; sym: string; pos: string }
}

const CURRENCIES = [
  { code:'GBP', symbol:'£' },{ code:'USD', symbol:'$' },{ code:'EUR', symbol:'€' },
  { code:'KES', symbol:'KSh' },{ code:'NGN', symbol:'₦' },{ code:'ZAR', symbol:'R' },
  { code:'UGX', symbol:'USh' },{ code:'TZS', symbol:'TSh' },{ code:'GHS', symbol:'₵' },
  { code:'AED', symbol:'د.إ' },{ code:'INR', symbol:'₹' },{ code:'AUD', symbol:'A$' },
  { code:'CAD', symbol:'C$' },{ code:'JPY', symbol:'¥' },{ code:'CHF', symbol:'Fr' },
] as const

// ── Geo-aware demo data ───────────────────────────────────────────────────────
// The UI replicas show example figures. A visitor in Nairobi should see KSh and
// local couriers, not £ and Royal Mail. Base figures are in GBP, scaled per
// currency and rounded to believable demo numbers.
const AFRICAN_CC = new Set(['KE','NG','UG','TZ','GH','ZA','ET','RW','ZM','ZW','CI','SN','CM','EG','MA'])
const DEMO_FX: Record<string,{sym:string;mult:number;dec?:boolean}> = {
  GBP:{sym:'£',mult:1,dec:true}, USD:{sym:'$',mult:1.3,dec:true}, EUR:{sym:'€',mult:1.2,dec:true},
  KES:{sym:'KSh ',mult:165}, NGN:{sym:'₦',mult:1950}, UGX:{sym:'USh ',mult:4800},
  TZS:{sym:'TSh ',mult:3300}, GHS:{sym:'₵',mult:16}, ZAR:{sym:'R ',mult:24}, ETB:{sym:'Br ',mult:75},
  INR:{sym:'₹',mult:110}, AED:{sym:'AED ',mult:4.8,dec:true}, CAD:{sym:'CA$',mult:1.7,dec:true}, AUD:{sym:'A$',mult:1.9,dec:true},
}
interface Demo {
  afri: boolean
  compact: (gbp:number)=>string
  pnl: { rev:string; cogs:string; gross:string; opex:string; net:string; avg:string }
  carriers: string[]
  ref: (n:number)=>string
}
function buildDemo(geo:Geo|null): Demo {
  const cc = geo?.countryCode || 'GB'
  const fx = DEMO_FX[geo?.currency || ''] || DEMO_FX.GBP
  const afri = AFRICAN_CC.has(cc)
  const nice = (v:number)=>{
    if(v < 100) return Math.round(v*100)/100
    const step = v<1000?1:v<10000?10:v<100000?100:1000
    return Math.round(v/step)*step
  }
  const f = (v:number)=>fx.sym+v.toLocaleString('en-GB',{maximumFractionDigits:v<100&&fx.dec?2:0})
  // P&L derived from rounded revenue/costs so the rows always add up
  const rev = nice(3247*fx.mult), cogs = nice(2138*fx.mult), opex = nice(260*fx.mult)
  const gross = rev-cogs, net = gross-opex
  const compact = (gbp:number)=>{
    const v = gbp*fx.mult
    if(v >= 1000) return fx.sym+(v/1000).toFixed(1).replace(/\.0$/,'')+'K'
    return fx.sym+String(Math.round(v))
  }
  return {
    afri, compact,
    pnl: { rev:f(rev), cogs:'−'+f(cogs), gross:f(gross), opex:'−'+f(opex), net:f(net), avg:f(nice(22.71*fx.mult)) },
    carriers: afri ? ['Sendy','G4S Courier','Boda rider','DHL'] : ['Royal Mail','DPD','Hermes','Royal Mail'],
    ref: (n:number)=>`#${cc}-${n}`,
  }
}

type BizType = 'retail'|'factory'|'restaurant'|'cargo'|'repair'
const buildBizTypes = (tc: (k: string) => string) => [
  { id:'retail' as BizType,icon:'cart',label:tc('landing.biz_retail_label'),priceLabel:tc('landing.biz_retail_price_label'),pricePh:'12.99',unitLabel:tc('landing.biz_retail_unit_label'),resultLabel:tc('landing.biz_retail_result_label'),
    fields:[{key:'a',label:tc('landing.biz_retail_field_a'),ph:'3.00'},{key:'b',label:tc('landing.biz_retail_field_b'),ph:'2.50'},{key:'c',label:tc('landing.biz_retail_field_c'),ph:'1.20'},{key:'d',label:tc('landing.biz_retail_field_d'),ph:'0.80'}]},
  { id:'factory' as BizType,icon:'factory',label:tc('landing.biz_factory_label'),priceLabel:tc('landing.biz_factory_price_label'),pricePh:'24.00',unitLabel:tc('landing.biz_factory_unit_label'),resultLabel:tc('landing.biz_factory_result_label'),
    fields:[{key:'a',label:tc('landing.biz_factory_field_a'),ph:'6.00'},{key:'b',label:tc('landing.biz_factory_field_b'),ph:'4.50'},{key:'c',label:tc('landing.biz_factory_field_c'),ph:'2.00'},{key:'d',label:tc('landing.biz_factory_field_d'),ph:'1.50'}]},
  { id:'restaurant' as BizType,icon:'utensils',label:tc('landing.biz_restaurant_label'),priceLabel:tc('landing.biz_restaurant_price_label'),pricePh:'16.50',unitLabel:tc('landing.biz_restaurant_unit_label'),resultLabel:tc('landing.biz_restaurant_result_label'),
    fields:[{key:'a',label:tc('landing.biz_restaurant_field_a'),ph:'4.20'},{key:'b',label:tc('landing.biz_restaurant_field_b'),ph:'2.00'},{key:'c',label:tc('landing.biz_restaurant_field_c'),ph:'0.50'},{key:'d',label:tc('landing.biz_restaurant_field_d'),ph:'8',isPct:true}]},
  { id:'cargo' as BizType,icon:'truck',label:tc('landing.biz_cargo_label'),priceLabel:tc('landing.biz_cargo_price_label'),pricePh:'850',unitLabel:tc('landing.biz_cargo_unit_label'),resultLabel:tc('landing.biz_cargo_result_label'),
    fields:[{key:'a',label:tc('landing.biz_cargo_field_a'),ph:'180'},{key:'b',label:tc('landing.biz_cargo_field_b'),ph:'120'},{key:'c',label:tc('landing.biz_cargo_field_c'),ph:'45'},{key:'d',label:tc('landing.biz_cargo_field_d'),ph:'30'}]},
  { id:'repair' as BizType,icon:'wrench',label:tc('landing.biz_repair_label'),priceLabel:tc('landing.biz_repair_price_label'),pricePh:'89.99',unitLabel:tc('landing.biz_repair_unit_label'),resultLabel:tc('landing.biz_repair_result_label'),
    fields:[{key:'a',label:tc('landing.biz_repair_field_a'),ph:'25.00'},{key:'b',label:tc('landing.biz_repair_field_b'),ph:'1.5'},{key:'c',label:tc('landing.biz_repair_field_c'),ph:'20'},{key:'d',label:tc('landing.biz_repair_field_d'),ph:'0'}]},
]

// FAQS — kept in sync with the FAQPage JSON-LD schema in app/page.tsx (server-side)
// The server-side script handles Google rich results; <details>/<summary> ensures answers
// are always in the HTML for crawlers regardless of JS execution.
const buildFaqs = (tc: (key: string) => string) =>
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => ({ q: tc('landing.faq_' + i + '_q'), a: tc('landing.faq_' + i + '_a') }))

function Logo({size=12,color='white'}:{size?:number;color?:string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="3" y="22" width="5" height="7" rx="1.5" fill={color} opacity=".5"/>
      <rect x="11" y="16" width="5" height="13" rx="1.5" fill={color} opacity=".75"/>
      <rect x="19" y="9" width="5" height="20" rx="1.5" fill={color}/>
    </svg>
  )
}

// ── Icon set ──────────────────────────────────────────────────────────────────
// One consistent stroke style (lucide-inspired) instead of emoji — emoji render
// differently (often poorly) on the budget Android devices most visitors use.
const IC: Record<string, JSX.Element> = {
  cart: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>,
  factory: <><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1M12 18h1M7 18h1"/></>,
  utensils: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></>,
  truck: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35a1 1 0 0 0-.78-.38H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>,
  scissors: <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/></>,
  package: <><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.29 6.96 8.73 5.05 8.73-5.05"/><path d="M12 22.08V12"/></>,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>,
  chart: <><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></>,
  bulb: <><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  trendup: <><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></>,
  trenddown: <><path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/></>,
  phone: <><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></>,
  search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
  target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  megaphone: <><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>,
  coins: <><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></>,
  bag: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
  tag: <><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5"/></>,
  book: <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
  undo: <><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></>,
  clipboard: <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></>,
  gift: <><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></>,
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  store: <><path d="m2 7 2-5h16l2 5"/><path d="M4 12v9h16v-9"/><path d="M2 7h20v2a3 3 0 0 1-3 3 3 3 0 0 1-3-2 3 3 0 0 1-6 0 3 3 0 0 1-3 2 3 3 0 0 1-3-3z"/></>,
  map: <><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
  swap: <><path d="m8 3-4 4 4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></>,
}
function Ic({n,size=13,color='#8B7355',style}:{n:string;size?:number;color?:string;style?:CSSProperties}) {
  if(n.startsWith('dot-')) return <span style={{width:size-3,height:size-3,borderRadius:'50%',background:n.slice(4),display:'inline-block',...style}}/>
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...style}} aria-hidden="true">
      {IC[n]||null}
    </svg>
  )
}

// ── Monitor / Intelligence UI replica ─────────────────────────────────────────
function MonitorUIReplica({tc,demo}:{tc:(k:string)=>string;demo:Demo}) {
  type MTab = 'overview'|'cfo'|'alerts'|'decisions'|'team'|'askai'|'ships'|'memory'|'market'
  const [tab, setTab] = useState<MTab>('overview')
  const [askQ, setAskQ] = useState('')
  const [askA, setAskA] = useState('')
  const TABS:{id:MTab;label:string}[] = [
    {id:'overview',label:tc('landing.mon_tab_overview')},{id:'cfo',label:tc('landing.mon_tab_cfo')},{id:'alerts',label:tc('landing.mon_tab_alerts')},
    {id:'decisions',label:tc('landing.mon_tab_decisions')},{id:'team',label:tc('landing.mon_tab_team')},{id:'askai',label:tc('landing.mon_tab_askai')},
    {id:'ships',label:tc('landing.mon_tab_ships')},{id:'memory',label:tc('landing.mon_tab_memory')},{id:'market',label:tc('landing.mon_tab_market')},
  ]
  const pill=(txt:string,color:string,bg:string)=>(
    <span style={{fontSize:7,fontWeight:700,padding:'2px 6px',borderRadius:9999,background:bg,color,whiteSpace:'nowrap'}}>{txt}</span>
  )
  return (
    <div style={{background:'#FAFAFA',borderRadius:16,border:'1px solid #E5E5E5',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,.09)',width:'100%',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {/* Chrome bar */}
      <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid #F0F0F0',background:'#fff'}}>
        <div className="rep-chrome-sm" style={{width:170,borderRight:'1px solid #F0F0F0',height:42,display:'flex',alignItems:'center',padding:'0 12px',gap:8,background:'#FAFAFA',flexShrink:0}}>
          <div style={{width:20,height:20,borderRadius:5,background:'#C97A44',display:'flex',alignItems:'center',justifyContent:'center'}}><Logo size={9}/></div>
          <span style={{fontSize:11,fontWeight:700,color:'#1A1410'}}>AskBiz</span>
          <span style={{marginLeft:'auto',fontSize:8,padding:'1px 5px',borderRadius:9999,background:'rgba(201,122,68,.1)',color:'#C97A44',fontWeight:700}}>{tc('landing.mon_badge')}</span>
        </div>
        <div style={{display:'flex',overflowX:'auto',flex:1,minWidth:0,scrollbarWidth:'none'}} className="pos-tabs">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:'0 12px',height:42,fontSize:10,fontWeight:tab===t.id?700:400,color:tab===t.id?'#C97A44':'#AAA',background:'none',border:'none',cursor:'pointer',borderBottom:tab===t.id?'2px solid #C97A44':'2px solid transparent',whiteSpace:'nowrap',fontFamily:'inherit',flexShrink:0}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview ── */}
      {tab==='overview'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:14,fontWeight:700,color:'#1A1410',marginBottom:1}}>{tc('landing.mon_good_morning')}</div>
            <div style={{fontSize:9,color:'#AAA'}}>{tc('landing.mon_date_full')}</div>
          </div>
          <div className="rep-3col" style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr',gap:8,marginBottom:9}}>
            <div style={{padding:'11px 13px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',display:'flex',alignItems:'center',gap:11}}>
              <div style={{position:'relative',width:38,height:38,flexShrink:0}}>
                <svg width="38" height="38" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="#F0F0F0" strokeWidth="3.5"/><circle cx="20" cy="20" r="16" fill="none" stroke="#C97A44" strokeWidth="3.5" strokeDasharray="72 100" strokeLinecap="round" transform="rotate(-90 20 20)"/></svg>
                <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#1A1410'}}>72</div>
              </div>
              <div>
                <div style={{fontSize:8,color:'#AAA',marginBottom:1}}>{tc('landing.mon_health_score')}</div>
                <div style={{fontSize:11,fontWeight:700,color:'#1A1410'}}>{tc('landing.mon_health_good')}</div>
                <div style={{fontSize:7,color:'#16a34a',fontWeight:600}}>{tc('landing.mon_health_delta')}</div>
              </div>
            </div>
            {[{icon:'bell',title:tc('landing.mon_active_alerts'),value:tc('landing.mon_active_alerts_value'),color:'#fb923c'},{icon:'trendup',title:tc('landing.mon_30day_trend'),value:'▲ 34%',color:'#16a34a'}].map((c,i)=>(
              <div key={i} style={{padding:'11px 13px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0'}}>
                <div style={{marginBottom:4}}><Ic n={c.icon} size={14} color={c.color}/></div>
                <div style={{fontSize:8,color:'#AAA',marginBottom:1}}>{c.title}</div>
                <div style={{fontSize:11,fontWeight:700,color:c.color}}>{c.value}</div>
              </div>
            ))}
          </div>
          <div style={{padding:'10px 12px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',marginBottom:7}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
              <Ic n="clock" size={11}/><span style={{fontSize:9,fontWeight:700,color:'#1A1410'}}>{tc('landing.mon_daily_brief')}</span>
              <span style={{fontSize:8,color:'#AAA',marginLeft:'auto'}}>{tc('landing.mon_daily_brief_date')}</span>
            </div>
            <p style={{fontSize:9,color:'#555',lineHeight:1.6,margin:0}}>{tc('landing.mon_daily_brief_body_a')} <strong>34% {tc('landing.mon_daily_brief_body_up')}</strong> {tc('landing.mon_daily_brief_body_b')}</p>
          </div>
          {[tc('landing.mon_ov_alert_0'),tc('landing.mon_ov_alert_1')].map((a,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'6px 10px',borderRadius:7,background:'rgba(251,146,60,.07)',marginBottom:4}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#fb923c',display:'block',flexShrink:0}}/>
              <span style={{fontSize:8,color:'#1A1410',flex:1}}>{a}</span>
              <span style={{fontSize:7,color:'#C97A44',fontWeight:700,cursor:'pointer',flexShrink:0}}>{tc('landing.mon_view_arrow')}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── CFO ── */}
      {tab==='cfo'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:12}}>{tc('landing.mon_cfo_header')}</div>
          <div className="rep-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
            {[{label:tc('landing.mon_cfo_revenue'),value:demo.pnl.rev,sub:tc('landing.mon_cfo_revenue_sub'),c:'#16a34a'},{label:tc('landing.mon_cfo_gross_profit'),value:demo.pnl.gross,sub:tc('landing.mon_cfo_gross_profit_sub'),c:'#C97A44'},{label:tc('landing.mon_cfo_net_margin'),value:'26.1%',sub:tc('landing.mon_cfo_net_margin_sub'),c:'#6366f1'}].map((k,i)=>(
              <div key={i} style={{padding:'10px 11px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0'}}>
                <div style={{fontSize:8,color:'#AAA',marginBottom:3}}>{k.label}</div>
                <div style={{fontSize:16,fontWeight:800,color:k.c,lineHeight:1}}>{k.value}</div>
                <div style={{fontSize:7,color:'#AAA',marginTop:3}}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',overflow:'hidden',marginBottom:10}}>
            <div style={{padding:'8px 12px',background:'#FAFAFA',borderBottom:'1px solid #F5F5F5',fontSize:8,fontWeight:700,color:'#AAA',letterSpacing:'.06em'}}>{tc('landing.mon_pnl_summary')}</div>
            {[{label:tc('landing.pnl_revenue'),value:demo.pnl.rev,indent:false},{label:tc('landing.pnl_cost_of_goods'),value:demo.pnl.cogs,indent:true,color:'#ef4444'},{label:tc('landing.pnl_gross_profit'),value:demo.pnl.gross,indent:false,bold:true,color:'#16a34a'},{label:tc('landing.pnl_operating_expenses'),value:demo.pnl.opex,indent:true,color:'#ef4444'},{label:tc('landing.pnl_net_profit'),value:demo.pnl.net,indent:false,bold:true,color:'#16a34a'}].map((r,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:`5px ${r.indent?'20px':'12px'} 5px 12px`,borderTop:i>0?'1px solid #F8F8F8':'none'}}>
                <span style={{fontSize:9,color:r.bold?'#1A1410':'#666',fontWeight:r.bold?700:400}}>{r.label}</span>
                <span style={{fontSize:9,fontWeight:r.bold?700:500,color:r.color||'#1A1410'}}>{r.value}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:6}}>
            {[tc('landing.mon_cfo_act_pnl'),tc('landing.mon_cfo_act_cashflow'),tc('landing.mon_cfo_act_export')].map(a=>(
              <span key={a} style={{fontSize:8,padding:'4px 10px',borderRadius:5,border:'1px solid #E5E5E5',color:'#C97A44',cursor:'pointer',fontWeight:600}}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Alerts ── */}
      {tab==='alerts'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
            <span style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{tc('landing.mon_alerts_header')}</span>
            <span style={{fontSize:7,padding:'2px 7px',borderRadius:9999,background:'rgba(251,146,60,.1)',color:'#fb923c',fontWeight:700}}>{tc('landing.mon_alerts_unread')}</span>
          </div>
          {[
            {sev:tc('landing.mon_sev_high'),icon:'trenddown',title:tc('landing.mon_alert_0_title'),body:tc('landing.mon_alert_0_body'),color:'#ef4444',bg:'rgba(239,68,68,.05)',time:tc('landing.mon_time_2h')},
            {sev:tc('landing.mon_sev_high'),icon:'package',title:tc('landing.mon_alert_1_title'),body:tc('landing.mon_alert_1_body'),color:'#ef4444',bg:'rgba(239,68,68,.05)',time:tc('landing.mon_time_4h')},
            {sev:tc('landing.mon_sev_med'),icon:'phone',title:tc('landing.mon_alert_2_title'),body:tc('landing.mon_alert_2_body'),color:'#f59e0b',bg:'rgba(245,158,11,.04)',time:tc('landing.mon_time_yesterday')},
            {sev:tc('landing.mon_sev_low'),icon:'search',title:tc('landing.mon_alert_3_title'),body:tc('landing.mon_alert_3_body'),color:'#6b7280',bg:'rgba(107,114,128,.04)',time:tc('landing.mon_time_2d')},
          ].map((a,i)=>(
            <div key={i} style={{padding:'10px 12px',borderRadius:9,border:`1px solid ${a.color}22`,background:a.bg,marginBottom:7}}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:5}}>
                <Ic n={a.icon} size={12} color={a.color}/>
                <span style={{fontSize:9,fontWeight:700,color:'#1A1410',flex:1}}>{a.title}</span>
                {pill(a.sev,a.color,`${a.color}18`)}
                <span style={{fontSize:7,color:'#AAA'}}>{a.time}</span>
              </div>
              <p style={{fontSize:8,color:'#555',lineHeight:1.5,margin:'0 0 6px'}}>{a.body}</p>
              <div style={{display:'flex',gap:5}}>
                <span style={{fontSize:7,padding:'2px 8px',borderRadius:4,border:'1px solid #E5E5E5',color:'#C97A44',cursor:'pointer',fontWeight:600}}>{tc('landing.mon_take_action')}</span>
                <span style={{fontSize:7,padding:'2px 8px',borderRadius:4,border:'1px solid #E5E5E5',color:'#888',cursor:'pointer'}}>{tc('landing.mon_dismiss')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Decisions ── */}
      {tab==='decisions'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:3}}>{tc('landing.mon_dec_header')}</div>
          <div style={{fontSize:8,color:'#AAA',marginBottom:12}}>{tc('landing.mon_dec_sub')}</div>
          {[
            {date:'23 May',action:tc('landing.mon_dec_0_action'),outcome:tc('landing.mon_dec_0_outcome'),status:'positive',review:tc('landing.mon_dec_0_review')},
            {date:'15 May',action:tc('landing.mon_dec_1_action'),outcome:tc('landing.mon_dec_1_outcome'),status:'positive',review:tc('landing.mon_dec_1_review')},
            {date:'3 May',action:tc('landing.mon_dec_2_action'),outcome:tc('landing.mon_dec_2_outcome'),status:'positive',review:tc('landing.mon_dec_2_review')},
            {date:'18 Apr',action:tc('landing.mon_dec_3_action'),outcome:tc('landing.mon_dec_3_outcome'),status:'pending',review:tc('landing.mon_dec_3_review')},
          ].map((d,i)=>(
            <div key={i} style={{padding:'10px 12px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',marginBottom:7}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:7,marginBottom:5}}>
                <span style={{fontSize:7,padding:'2px 6px',borderRadius:4,background:'#F5F5F5',color:'#888',fontWeight:700,flexShrink:0,marginTop:1}}>{d.date}</span>
                <span style={{fontSize:9,color:'#1A1410',fontWeight:500,flex:1,lineHeight:1.4}}>{d.action}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                {pill(d.outcome, d.status==='positive'?'#16a34a':'#f59e0b', d.status==='positive'?'rgba(22,163,74,.08)':'rgba(245,158,11,.08)')}
                <span style={{fontSize:7,color:'#AAA'}}>{d.review}</span>
              </div>
            </div>
          ))}
          <div style={{textAlign:'center',marginTop:6}}>
            <span style={{fontSize:8,color:'#C97A44',fontWeight:600,cursor:'pointer'}}>{tc('landing.mon_dec_log_new')}</span>
          </div>
        </div>
      )}

      {/* ── Team ── */}
      {tab==='team'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div><span style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{tc('landing.mon_team_header')}</span><span style={{fontSize:8,color:'#AAA',marginLeft:6}}>{tc('landing.mon_team_seats')}</span></div>
            <span style={{fontSize:8,padding:'4px 10px',borderRadius:5,background:'#C97A44',color:'#fff',fontWeight:700,cursor:'pointer'}}>{tc('landing.mon_team_invite')}</span>
          </div>
          {[
            {name:tc('landing.mon_team_0_name'),email:'owner@askbiz.co',role:tc('landing.mon_team_role_owner'),last:tc('landing.mon_team_now'),avatar:'YO',active:true},
            {name:'Sarah M.',email:'sarah@myshop.co',role:tc('landing.mon_team_role_analyst'),last:tc('landing.mon_time_2h'),avatar:'SM',active:true},
          ].map((m,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',marginBottom:6}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:'#F0EDE8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#C97A44',flexShrink:0,position:'relative'}}>
                {m.avatar}
                {m.active&&<span style={{position:'absolute',bottom:0,right:0,width:7,height:7,borderRadius:'50%',background:'#16a34a',border:'1.5px solid #fff'}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{m.name}</div>
                <div style={{fontSize:8,color:'#AAA'}}>{m.email} · {m.role} · {tc('landing.mon_team_active')} {m.last}</div>
              </div>
              {pill(m.role,'#C97A44','rgba(201,122,68,.08)')}
            </div>
          ))}
          <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(201,122,68,.04)',border:'1px dashed rgba(201,122,68,.2)',textAlign:'center'}}>
            <div style={{fontSize:9,color:'#C97A44',fontWeight:600,marginBottom:2}}>{tc('landing.mon_team_invite_title')}</div>
            <div style={{fontSize:8,color:'#AAA'}}>{tc('landing.mon_team_invite_sub')}</div>
          </div>
        </div>
      )}

      {/* ── Ask AI ── */}
      {tab==='askai'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:10}}>{tc('landing.mon_askai_header')}</div>
          {[
            {q:tc('landing.mon_askai_0_q'),a:tc('landing.mon_askai_0_a')},
            {q:tc('landing.mon_askai_1_q'),a:tc('landing.mon_askai_1_a')},
          ].map((qa,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:'flex',gap:7,marginBottom:5}}>
                <div style={{width:20,height:20,borderRadius:'50%',background:'#F0EDE8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#C97A44',flexShrink:0}}>YO</div>
                <div style={{padding:'7px 10px',background:'#F0EDE8',borderRadius:'8px 8px 8px 2px',fontSize:9,color:'#1A1410',maxWidth:'85%'}}>{qa.q}</div>
              </div>
              <div style={{display:'flex',gap:7}}>
                <div style={{width:20,height:20,borderRadius:5,background:'#C97A44',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Logo size={9}/></div>
                <div style={{padding:'7px 10px',background:'#fff',border:'1px solid #F0F0F0',borderRadius:'8px 8px 2px 8px',fontSize:9,color:'#333',lineHeight:1.5,maxWidth:'85%'}}>{qa.a}</div>
              </div>
            </div>
          ))}
          <div style={{display:'flex',gap:6,marginTop:8}}>
            <input readOnly value={askQ} onChange={e=>setAskQ(e.target.value)} placeholder={tc('landing.mon_askai_placeholder')} style={{flex:1,height:32,padding:'0 10px',fontSize:9,border:'1px solid #E5E5E5',borderRadius:7,background:'#FAFAFA',color:'#1A1410',fontFamily:'inherit',outline:'none'}}/>
            <span style={{fontSize:9,padding:'0 12px',height:32,display:'flex',alignItems:'center',borderRadius:7,background:'#C97A44',color:'#fff',fontWeight:700,cursor:'pointer',flexShrink:0}}>{tc('landing.mon_askai_btn')}</span>
          </div>
        </div>
      )}

      {/* ── Ships ── */}
      {tab==='ships'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:12}}>{tc('landing.mon_ships_header')}</div>
          <div className="rep-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
            {[{label:tc('landing.mon_ships_in_transit'),value:'14',color:'#6366f1'},{label:tc('landing.mon_ships_delivered_today'),value:'7',color:'#16a34a'},{label:tc('landing.mon_ships_delayed'),value:'2',color:'#ef4444'}].map((k,i)=>(
              <div key={i} style={{padding:'9px 10px',background:'#fff',borderRadius:8,border:'1px solid #F0F0F0',textAlign:'center'}}>
                <div style={{fontSize:14,fontWeight:800,color:k.color,marginBottom:2}}>{k.value}</div>
                <div style={{fontSize:7,color:'#AAA'}}>{k.label}</div>
              </div>
            ))}
          </div>
          {[
            {ref:demo.ref(4421),item:'Wireless Earbuds Pro ×10',carrier:demo.carriers[0],status:tc('landing.mon_ships_status_in_transit'),eta:tc('landing.mon_ships_eta_tomorrow'),color:'#6366f1'},
            {ref:demo.ref(4420),item:'USB Hub ×50',carrier:demo.carriers[1],status:tc('landing.mon_ships_status_delivered'),eta:`${tc('landing.mon_ships_eta_today')} 10:31`,color:'#16a34a'},
            {ref:demo.ref(4419),item:'Phone Stand ×25',carrier:demo.carriers[2],status:tc('landing.mon_ships_status_delayed'),eta:tc('landing.mon_ships_eta_unknown'),color:'#ef4444'},
            {ref:demo.ref(4418),item:'Cable Kit ×100',carrier:demo.carriers[3],status:tc('landing.mon_ships_status_in_transit'),eta:'Wed 18 Jun',color:'#6366f1'},
          ].map((s,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',borderTop:i>0?'1px solid #F5F5F5':'none'}}>
              <span style={{fontSize:7,color:'#888',fontWeight:700,flexShrink:0,fontFamily:'monospace'}}>{s.ref}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:9,fontWeight:600,color:'#1A1410'}}>{s.item}</div>
                <div style={{fontSize:7,color:'#AAA'}}>{s.carrier} · {s.eta}</div>
              </div>
              {pill(s.status,s.color,`${s.color}18`)}
            </div>
          ))}
        </div>
      )}

      {/* ── Memory ── */}
      {tab==='memory'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:3}}>{tc('landing.mon_mem_header')}</div>
          <div style={{fontSize:8,color:'#AAA',marginBottom:12}}>{tc('landing.mon_mem_sub')}</div>
          {[
            {icon:'factory',category:tc('landing.mon_mem_cat_suppliers'),fact:tc('landing.mon_mem_fact_suppliers')},
            {icon:'package',category:tc('landing.mon_mem_cat_products'),fact:tc('landing.mon_mem_fact_products')},
            {icon:'target',category:tc('landing.mon_mem_cat_goals'),fact:tc('landing.mon_mem_fact_goals')},
            {icon:'megaphone',category:tc('landing.mon_mem_cat_channels'),fact:tc('landing.mon_mem_fact_channels')},
            {icon:'coins',category:tc('landing.mon_mem_cat_costs'),fact:tc('landing.mon_mem_fact_costs')},
          ].map((m,i)=>(
            <div key={i} style={{display:'flex',gap:9,padding:'9px 0',borderTop:i>0?'1px solid #F5F5F5':'none'}}>
              <div style={{width:26,height:26,borderRadius:6,background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ic n={m.icon} size={13}/></div>
              <div>
                <div style={{fontSize:8,fontWeight:700,color:'#C97A44',marginBottom:2}}>{m.category}</div>
                <div style={{fontSize:8,color:'#555',lineHeight:1.5}}>{m.fact}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Market ── */}
      {tab==='market'&&(
        <div style={{padding:'16px 18px'}}>
          <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:12}}>{tc('landing.mon_market_header')}</div>
          <div style={{background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',marginBottom:10,overflow:'hidden'}}>
            <div style={{padding:'8px 12px',background:'#FAFAFA',borderBottom:'1px solid #F5F5F5',fontSize:8,fontWeight:700,color:'#AAA',letterSpacing:'.06em'}}>{tc('landing.mon_market_competitor_watch')}</div>
            {[
              {name:'EliteGadgets',sku:'Bluetooth Earbuds X3',change:tc('landing.mon_market_change_price_down'),when:tc('landing.mon_time_2d'),impact:tc('landing.mon_market_impact_high'),color:'#ef4444'},
              {name:'TechDen UK',sku:'USB-C 7-in-1 Hub',change:tc('landing.mon_market_change_new_listing'),when:tc('landing.mon_time_5d'),impact:tc('landing.mon_market_impact_med'),color:'#f59e0b'},
              {name:'GadgetHub',sku:'Wireless Charger Pro',change:tc('landing.mon_market_change_oos'),when:tc('landing.mon_time_today'),impact:tc('landing.mon_market_impact_opportunity'),color:'#16a34a'},
            ].map((c,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 12px',borderTop:i>0?'1px solid #F8F8F8':'none'}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:9,fontWeight:700,color:'#1A1410'}}>{c.name}</div>
                  <div style={{fontSize:7,color:'#AAA'}}>{c.sku} · {c.when}</div>
                </div>
                <span style={{fontSize:8,color:c.color,fontWeight:600}}>{c.change}</span>
                {pill(c.impact,c.color,`${c.color}18`)}
              </div>
            ))}
          </div>
          <div style={{background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',overflow:'hidden'}}>
            <div style={{padding:'8px 12px',background:'#FAFAFA',borderBottom:'1px solid #F5F5F5',fontSize:8,fontWeight:700,color:'#AAA',letterSpacing:'.06em'}}>{tc('landing.mon_market_demand_signals')}</div>
            {[
              {product:'Wireless Earbuds Pro',saves:'340',orders:'0',signal:tc('landing.mon_market_signal_high')},
              {product:'Phone Stand Flex',saves:'87',orders:'12',signal:tc('landing.mon_market_signal_converting')},
              {product:'USB Hub 7-in-1',saves:'210',orders:'3',signal:tc('landing.mon_market_signal_not_converting')},
            ].map((d,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 12px',borderTop:i>0?'1px solid #F8F8F8':'none'}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:9,fontWeight:600,color:'#1A1410'}}>{d.product}</div>
                  <div style={{fontSize:7,color:'#AAA'}}>{d.saves} {tc('landing.mon_market_saves')} · {d.orders} {tc('landing.mon_market_orders')}</div>
                </div>
                <span style={{fontSize:7,color:'#555'}}>{d.signal}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sources / Connect UI replica ───────────────────────────────────────────────
function SourcesUIReplica({tc}:{tc:(k:string)=>string}) {
  return (
    <div style={{background:'#FAFAFA',borderRadius:16,border:'1px solid #E5E5E5',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,.09)',width:'100%',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <div style={{padding:'12px 18px',borderBottom:'1px solid #F0F0F0',background:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <span style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{tc('landing.src_connect_platform')}</span>
          <span style={{fontSize:9,color:'#AAA',marginLeft:6}}>{tc('landing.src_integrations_count')}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:5,padding:'5px 10px',borderRadius:6,border:'1px solid #E5E5E5',background:'#FAFAFA'}}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#AAA" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span style={{fontSize:9,color:'#AAA'}}>{tc('landing.src_search')}</span>
        </div>
      </div>
      <div style={{padding:'7px 18px 4px',background:'rgba(34,197,94,.04)',borderBottom:'1px solid rgba(34,197,94,.1)',display:'flex',alignItems:'center',gap:6}}>
        <span style={{fontSize:9,color:'#16a34a',fontWeight:700}}>{tc('landing.src_connected_count')}</span>
        <span style={{fontSize:8,color:'#AAA'}}>{tc('landing.src_connected_synced')}</span>
      </div>
      <div style={{maxHeight:300,overflowY:'hidden'}}>
        {[
          {cat:tc('landing.src_cat_mobile_money'),items:[
            {icon:'dot-#22c55e',name:'M-Pesa',desc:tc('landing.src_desc_mpesa'),status:'connected'},
            {icon:'dot-#eab308',name:'MTN Mobile Money',desc:tc('landing.src_desc_mtn'),status:'connect'},
            {icon:'dot-#ef4444',name:'Airtel Money',desc:tc('landing.src_desc_airtel'),status:'connect'},
          ]},
          {cat:tc('landing.src_cat_ecommerce'),items:[
            {icon:'cart',name:'Shopify',desc:tc('landing.src_desc_shopify'),status:'connect'},
            {icon:'package',name:'Amazon FBA',desc:tc('landing.src_desc_amazon'),status:'connect'},
            {icon:'bag',name:'eBay Store',desc:tc('landing.src_desc_ebay'),status:'connected'},
            {icon:'tag',name:'Etsy',desc:tc('landing.src_desc_etsy'),status:'connect'},
            {icon:'phone',name:'TikTok Shop',desc:tc('landing.src_desc_tiktok'),status:'connect'},
          ]},
          {cat:tc('landing.src_cat_accounting'),items:[
            {icon:'book',name:'QuickBooks',desc:tc('landing.src_desc_quickbooks'),status:'connect'},
            {icon:'dot-#3b82f6',name:'Xero',desc:tc('landing.src_desc_xero'),status:'connect'},
            {icon:'card',name:'Stripe',desc:tc('landing.src_desc_stripe'),status:'connected'},
          ]},
        ].map(section=>(
          <div key={section.cat}>
            <div style={{padding:'7px 18px 3px',fontSize:8,fontWeight:700,color:'#BBB',letterSpacing:'.1em',background:'#FAFAFA'}}>{section.cat}</div>
            {section.items.map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 18px',borderTop:'1px solid #F5F5F5',background:item.status==='connected'?'rgba(34,197,94,.03)':'#fff'}}>
                <div style={{width:26,height:26,borderRadius:6,background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ic n={item.icon} size={13}/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:10,fontWeight:600,color:'#1A1410',marginBottom:1}}>{item.name}</div>
                  <div style={{fontSize:8,color:'#AAA',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.desc}</div>
                </div>
                <span style={{fontSize:8,fontWeight:700,padding:'3px 9px',borderRadius:5,background:item.status==='connected'?'rgba(34,197,94,.1)':'rgba(201,122,68,.1)',color:item.status==='connected'?'#16a34a':'#C97A44',border:`1px solid ${item.status==='connected'?'rgba(34,197,94,.2)':'rgba(201,122,68,.2)'}`,whiteSpace:'nowrap',flexShrink:0,cursor:'pointer'}}>
                  {item.status==='connected'?tc('landing.src_status_connected'):tc('landing.src_status_connect')}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Live staff-demo UI replica ── dynamic, tab-driven preview of the real
// staff screens (cashier/inventory/manager/courier), reusing the same sample
// "Wireless Earbuds Pro / USB Hub" shop narrative and tc() keys as the other
// replicas on this page instead of inventing new copy. Each tab swaps the
// panel in place — the "Try it full-screen" link below is for people who
// want the real, fully-functional app at pos.askbiz.co.
function DemoUIReplica({tc,demo}:{tc:(k:string)=>string;demo:Demo}) {
  type DTab = 'cashier'|'inventory'|'manager'|'courier'
  const [tab, setTab] = useState<DTab>('cashier')
  const TABS: {id:DTab;icon:string;label:string}[] = [
    {id:'cashier',   icon:'card',    label:tc('landing.demo_cashier_name')},
    {id:'inventory', icon:'package', label:tc('landing.demo_inventory_name')},
    {id:'manager',   icon:'chart',   label:tc('landing.demo_manager_name')},
    {id:'courier',   icon:'truck',   label:tc('landing.demo_logistics_name')},
  ]
  return (
    <div style={{background:'#FAFAFA',borderRadius:16,border:'1px solid #E5E5E5',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,.09)',width:'100%',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <div style={{padding:'12px 18px',borderBottom:'1px solid #F0F0F0',background:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <span style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{tc('landing.demo_header')}</span>
          <span style={{fontSize:9,color:'#AAA',marginLeft:6}}>{tc('landing.demo_header_sub')}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:5,padding:'5px 10px',borderRadius:6,background:'rgba(34,197,94,.08)'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#16a34a',display:'inline-block'}}/>
          <span style={{fontSize:9,color:'#16a34a',fontWeight:700}}>{tc('landing.demo_live_badge')}</span>
        </div>
      </div>

      <div style={{display:'flex',padding:'8px 10px 0',gap:2,background:'#fff',borderBottom:'1px solid #F5F5F5'}}>
        {TABS.map(t=>(
          <button key={t.id} className="demo-tab" onClick={()=>setTab(t.id)}
            style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'7px 4px 9px',border:'none',background:'transparent',cursor:'pointer',fontFamily:'inherit',borderBottom:tab===t.id?'2px solid #C97A44':'2px solid transparent'}}>
            <Ic n={t.icon} size={14} color={tab===t.id?'#C97A44':'#AAA'}/>
            <span style={{fontSize:9,fontWeight:tab===t.id?700:500,color:tab===t.id?'#C97A44':'#AAA'}}>{t.label}</span>
          </button>
        ))}
      </div>

      <div key={tab} className="demo-panel" style={{padding:'16px 18px',minHeight:184,background:'#fff'}}>
        {tab==='cashier' && (
          <div>
            <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:10}}>{tc('landing.posui_current_sale')}</div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#1A1410',padding:'6px 0',borderBottom:'1px solid #F5F5F5'}}><span>Wireless Earbuds Pro</span><span>{demo.compact(24)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#1A1410',padding:'6px 0',borderBottom:'1px solid #F5F5F5'}}><span>USB Hub</span><span>{demo.compact(9)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:9,color:'#AAA',padding:'8px 0 2px'}}><span>{tc('landing.posui_subtotal')}</span><span>{demo.compact(33)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:9,color:'#AAA',padding:'2px 0 10px'}}><span>{tc('landing.posui_vat')}</span><span>{demo.compact(6.6)}</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:700,color:'#1A1410',padding:'10px 0 12px',borderTop:'1px solid #F0F0F0'}}><span>{tc('landing.posui_total')}</span><span>{demo.compact(39.6)}</span></div>
            <div style={{display:'flex',gap:8}}>
              <span style={{flex:1,textAlign:'center',padding:'9px',borderRadius:9999,background:'#C97A44',color:'#fff',fontSize:10,fontWeight:700}}>{tc('landing.posui_pay_mobile')}</span>
              <span style={{flex:1,textAlign:'center',padding:'9px',borderRadius:9999,border:'1px solid #E5E5E5',color:'#6b6560',fontSize:10,fontWeight:700}}>{tc('landing.posui_pay_cash')}</span>
            </div>
          </div>
        )}
        {tab==='inventory' && (
          <div>
            <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:10}}>{tc('landing.pos_mod_inventory')}</div>
            {[
              {name:'Wireless Earbuds Pro', low:false, qty:31},
              {name:'USB Hub',              low:true,  qty:5},
              {name:'Ginger Powder',        low:true,  qty:2.2},
            ].map((p,i)=>(
              <div key={p.name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,color:'#1A1410',padding:'8px 0',borderBottom:i<2?'1px solid #F5F5F5':'none'}}>
                <span>{p.name}</span>
                <span style={{fontWeight:700,color:p.low?'#e08a1e':'#6b6560'}}>{p.qty} {tc('landing.pos_kpi_products')}</span>
              </div>
            ))}
          </div>
        )}
        {tab==='manager' && (
          <div>
            <div style={{fontSize:9,color:'#AAA',marginBottom:10}}>{tc('landing.pos_date_today')}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
              <div style={{background:'#fff',border:'1px solid #F0F0F0',borderRadius:9,padding:'10px 10px'}}><div style={{fontSize:9,color:'#AAA',marginBottom:4}}>{tc('landing.pos_kpi_revenue')}</div><div style={{fontSize:15,fontWeight:800,color:'#16a34a'}}>{demo.pnl.rev}</div></div>
              <div style={{background:'#fff',border:'1px solid #F0F0F0',borderRadius:9,padding:'10px 10px'}}><div style={{fontSize:9,color:'#AAA',marginBottom:4}}>{tc('landing.pos_kpi_sales')}</div><div style={{fontSize:15,fontWeight:800,color:'#1A1410'}}>143</div></div>
              <div style={{background:'#fff',border:'1px solid #F0F0F0',borderRadius:9,padding:'10px 10px'}}><div style={{fontSize:9,color:'#AAA',marginBottom:4}}>{tc('landing.pos_kpi_margin')}</div><div style={{fontSize:15,fontWeight:800,color:'#C97A44'}}>34.2%</div></div>
            </div>
            <div style={{fontSize:10,color:'#6b6560',lineHeight:1.5}}>{tc('landing.posui_nudge')}</div>
          </div>
        )}
        {tab==='courier' && (
          <div>
            <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:10}}>{tc('landing.mon_ships_header')}</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,color:'#1A1410',padding:'8px 0',borderBottom:'1px solid #F5F5F5',gap:8}}>
              <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{demo.ref(4421)} · Wireless Earbuds Pro ×10</span>
              <span style={{fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(99,102,241,.08)',color:'#6366f1',flexShrink:0,whiteSpace:'nowrap'}}>{tc('landing.mon_ships_status_in_transit')}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,color:'#1A1410',padding:'8px 0',gap:8}}>
              <span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{demo.ref(4420)} · USB Hub ×50</span>
              <span style={{fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:6,background:'rgba(22,163,74,.08)',color:'#16a34a',flexShrink:0,whiteSpace:'nowrap'}}>{tc('landing.mon_ships_status_delivered')}</span>
            </div>
          </div>
        )}
      </div>

      <a href={`https://pos.askbiz.co/preview/${tab==='courier'?'logistics':tab}`} target="_blank" rel="noopener noreferrer"
         style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:11,fontSize:11,fontWeight:700,color:'#C97A44',textDecoration:'none',background:'#FAFAFA',borderTop:'1px solid #F0F0F0'}}>
        {tc('landing.demo_cta')} →
      </a>
    </div>
  )
}

// ── POS full tabbed showcase ──────────────────────────────────────────────────
function PosShowcase({tc,demo}:{tc:(k:string)=>string;demo:Demo}) {
  type TabId = 'overview'|'operations'|'staff'|'branches'|'map'|'audit'|'payments'|'logistics'
  const [tab, setTab] = useState<TabId>('overview')
  const TABS:{id:TabId;label:string}[] = [
    {id:'overview',label:tc('landing.pos_tab_overview')},
    {id:'operations',label:tc('landing.pos_tab_operations')},
    {id:'staff',label:tc('landing.pos_tab_staff')},
    {id:'branches',label:tc('landing.pos_tab_branches')},
    {id:'map',label:tc('landing.pos_tab_map')},
    {id:'audit',label:tc('landing.pos_tab_audit')},
    {id:'payments',label:tc('landing.pos_tab_payments')},
    {id:'logistics',label:tc('landing.pos_tab_logistics')},
  ]
  return (
    <div style={{background:'#FAFAFA',borderRadius:16,border:'1px solid #E5E5E5',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,.09)',width:'100%',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {/* App chrome */}
      <div style={{display:'flex',alignItems:'center',background:'#fff',borderBottom:'1px solid #F0F0F0',minHeight:44}}>
        <div style={{width:180,borderRight:'1px solid #F0F0F0',height:44,display:'flex',alignItems:'center',padding:'0 14px',gap:8,background:'#FAFAFA',flexShrink:0}}>
          <div style={{width:20,height:20,borderRadius:5,background:'#C97A44',display:'flex',alignItems:'center',justifyContent:'center'}}><Logo size={9}/></div>
          <span style={{fontSize:11,fontWeight:700,color:'#1A1410'}}>AskBiz</span>
          <span style={{marginLeft:'auto',fontSize:8,padding:'1px 6px',borderRadius:9999,background:'#FDEEE0',color:'#C97A44',fontWeight:700}}>POS</span>
        </div>
        <div className="pos-tabs-wrap" style={{flex:1,overflow:'hidden'}}>
          <div className="pos-tabs" style={{display:'flex',overflowX:'auto'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{padding:'0 13px',height:44,fontSize:10.5,fontWeight:tab===t.id?700:400,color:tab===t.id?'#1A1410':'#AAA',background:'none',border:'none',cursor:'pointer',borderBottom:tab===t.id?'2px solid #C97A44':'2px solid transparent',whiteSpace:'nowrap',fontFamily:'inherit',flexShrink:0}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:'flex',gap:5,padding:'0 10px',flexShrink:0}}>
          <span style={{fontSize:8,padding:'3px 7px',border:'1px solid #E5E5E5',borderRadius:5,color:'#888',background:'#FAFAFA',whiteSpace:'nowrap'}}>{tc('landing.pos_all_branches')}</span>
          <span style={{fontSize:8,padding:'3px 7px',border:'1px solid #E5E5E5',borderRadius:5,color:'#888',background:'#FAFAFA',whiteSpace:'nowrap'}}>{tc('landing.pos_all_sectors')}</span>
        </div>
      </div>

      {/* Tab content */}
      {tab==='overview' && (
        <div style={{padding:'16px 18px'}}>
          {/* Date filters */}
          <div style={{display:'flex',gap:5,marginBottom:14,flexWrap:'wrap'}}>
            {[tc('landing.pos_date_today'),tc('landing.pos_date_yesterday'),tc('landing.pos_date_7days'),tc('landing.pos_date_30days')].map((d,i)=>(
              <span key={d} style={{fontSize:9,padding:'4px 10px',borderRadius:5,border:`1px solid ${i===0?'#C97A44':'#E5E5E5'}`,background:i===0?'rgba(201,122,68,.08)':'#fff',color:i===0?'#C97A44':'#888',cursor:'pointer',fontWeight:i===0?700:400}}>{d}</span>
            ))}
          </div>
          {/* Top row: 4 KPI cards */}
          <div className="rep-4col" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:10}}>
            {[
              {label:tc('landing.pos_kpi_revenue'),value:demo.pnl.rev,sub:tc('landing.pos_kpi_vs_prev_up34'),color:'#16a34a'},
              {label:tc('landing.pos_kpi_sales'),value:'143',sub:tc('landing.pos_kpi_vs_prev_up12'),color:'#16a34a'},
              {label:tc('landing.pos_kpi_refunds'),value:'3',sub:tc('landing.pos_kpi_vs_prev_down2'),color:'#f87171'},
              {label:tc('landing.pos_kpi_low_stock'),value:'42',sub:tc('landing.pos_kpi_products'),color:'#fb923c'},
            ].map((k,i)=>(
              <div key={i} style={{padding:'10px 12px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0'}}>
                <div style={{fontSize:9,color:'#AAA',marginBottom:5}}>{k.label}</div>
                <div style={{fontSize:18,fontWeight:800,color:k.color,marginBottom:3}}>{k.value}</div>
                <div style={{fontSize:8,color:'#AAA'}}>{k.sub}</div>
              </div>
            ))}
          </div>
          {/* Second row: 3 cards */}
          <div className="rep-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:10}}>
            {[
              {label:tc('landing.pos_kpi_gross_profit'),value:demo.pnl.gross,color:'#16a34a'},
              {label:tc('landing.pos_kpi_margin'),value:'34.2%',color:'#C97A44'},
              {label:tc('landing.pos_kpi_avg_sale'),value:demo.pnl.avg,color:'#1A1410'},
            ].map((k,i)=>(
              <div key={i} style={{padding:'10px 12px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0'}}>
                <div style={{fontSize:9,color:'#AAA',marginBottom:5}}>{k.label}</div>
                <div style={{fontSize:16,fontWeight:800,color:k.color}}>{k.value}</div>
              </div>
            ))}
          </div>
          {/* Quick action pills */}
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>
            {[tc('landing.pos_qa_analyse'),tc('landing.pos_qa_top_products'),tc('landing.pos_qa_staff_ranking'),tc('landing.pos_qa_stock_alerts')].map(a=>(
              <span key={a} style={{fontSize:9,padding:'4px 10px',borderRadius:5,border:'1px solid #E5E5E5',color:'#555',background:'#fff',cursor:'pointer'}}>{a}</span>
            ))}
          </div>
          {/* Staff performance */}
          <div style={{background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',padding:'10px 12px'}}>
            <div style={{fontSize:9,fontWeight:700,color:'#1A1410',marginBottom:8}}>{tc('landing.pos_staff_perf')} <span style={{color:'#C97A44',fontWeight:400,cursor:'pointer'}}>{tc('landing.pos_view_all')}</span></div>
            {[{name:'Phidisia',role:tc('landing.pos_role_cashier_retail'),sales:demo.compact(11),tx:6},{name:'James',role:tc('landing.pos_role_inventory_retail'),sales:demo.compact(2.9),tx:2}].map((s,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'6px 0',borderTop:i>0?'1px solid #F5F5F5':'none'}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:'#F0F0F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:'#555',flexShrink:0}}>{s.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,fontWeight:600,color:'#1A1410'}}>{s.name}</div>
                  <div style={{fontSize:8,color:'#AAA'}}>{s.role}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:10,fontWeight:700,color:'#16a34a'}}>{s.sales}</div>
                  <div style={{fontSize:8,color:'#AAA'}}>{s.tx} {tc('landing.pos_transactions')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='operations' && (
        <div style={{padding:'14px 18px'}}>
          {/* Sector tabs */}
          <div style={{display:'flex',gap:5,marginBottom:14,flexWrap:'wrap'}}>
            {[{icon:'utensils',label:tc('landing.pos_sector_restaurant')},{icon:'wrench',label:tc('landing.pos_sector_repair')},{icon:'scissors',label:tc('landing.pos_sector_salon')},{icon:'package',label:tc('landing.pos_sector_retail'),active:true},{icon:'factory',label:tc('landing.pos_sector_factory')},{icon:'truck',label:tc('landing.pos_sector_logistics')}].map(s=>(
              <span key={s.label} style={{fontSize:9,padding:'4px 10px',borderRadius:5,border:`1px solid ${s.active?'#C97A44':'#E5E5E5'}`,background:s.active?'rgba(201,122,68,.08)':'#fff',color:s.active?'#C97A44':'#888',cursor:'pointer',fontWeight:s.active?700:400,display:'flex',alignItems:'center',gap:3}}>
                <Ic n={s.icon} size={10} color="currentColor"/>{s.label}
              </span>
            ))}
          </div>
          <div style={{fontSize:11,fontWeight:700,color:'#1A1410',marginBottom:3}}>{tc('landing.pos_ops_header')}</div>
          <div style={{fontSize:9,color:'#AAA',marginBottom:12}}>{tc('landing.pos_ops_sub')}</div>
          <div className="rep-5col" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:7}}>
            {[
              {icon:'package',label:tc('landing.pos_mod_inventory'),desc:tc('landing.pos_mod_inventory_desc'),badge:'37',bdgColor:'#ef4444'},
              {icon:'cart',label:tc('landing.pos_mod_sales'),desc:tc('landing.pos_mod_sales_desc')},
              {icon:'users',label:tc('landing.pos_mod_customers'),desc:tc('landing.pos_mod_customers_desc')},
              {icon:'tag',label:tc('landing.pos_mod_promotions'),desc:tc('landing.pos_mod_promotions_desc')},
              {icon:'star',label:tc('landing.pos_mod_loyalty'),desc:tc('landing.pos_mod_loyalty_desc')},
              {icon:'undo',label:tc('landing.pos_mod_returns'),desc:tc('landing.pos_mod_returns_desc')},
              {icon:'chart',label:tc('landing.pos_mod_reports'),desc:tc('landing.pos_mod_reports_desc')},
              {icon:'clipboard',label:tc('landing.pos_mod_purchase_orders'),desc:tc('landing.pos_mod_purchase_orders_desc'),soon:true},
              {icon:'gift',label:tc('landing.pos_mod_gift_cards'),desc:tc('landing.pos_mod_gift_cards_desc'),soon:true},
              {icon:'user',label:tc('landing.pos_mod_staff'),desc:tc('landing.pos_mod_staff_desc')},
              {icon:'store',label:tc('landing.pos_mod_branches'),desc:tc('landing.pos_mod_branches_desc')},
              {icon:'map',label:tc('landing.pos_mod_map'),desc:tc('landing.pos_mod_map_desc')},
              {icon:'link',label:tc('landing.pos_mod_integrations'),desc:tc('landing.pos_mod_integrations_desc')},
              {icon:'search',label:tc('landing.pos_mod_audit'),desc:tc('landing.pos_mod_audit_desc')},
            ].map((m,i)=>(
              <div key={i} style={{padding:'10px 10px',borderRadius:9,border:'1px solid #F0F0F0',background:'#fff',cursor:'pointer',position:'relative'}}>
                {m.badge&&<span style={{position:'absolute',top:6,right:6,fontSize:7,fontWeight:700,background:'#ef4444',color:'#fff',borderRadius:9999,padding:'1px 5px'}}>{m.badge}</span>}
                {m.soon&&<span style={{position:'absolute',top:6,right:6,fontSize:7,fontWeight:700,background:'#F0F0F0',color:'#888',borderRadius:9999,padding:'1px 5px'}}>{tc('landing.pos_soon')}</span>}
                <div style={{marginBottom:6}}><Ic n={m.icon} size={15}/></div>
                <div style={{fontSize:9,fontWeight:700,color:'#1A1410',marginBottom:2}}>{m.label}</div>
                <div style={{fontSize:7,color:'#AAA',lineHeight:1.3}}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='staff' && (
        <div style={{padding:'16px 18px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div style={{fontSize:10,color:'#888'}}>{tc('landing.pos_staff_seats')} · <span style={{color:'#C97A44',fontWeight:600,cursor:'pointer'}}>{tc('landing.pos_add_seats')}</span></div>
            <span style={{fontSize:9,padding:'5px 12px',borderRadius:5,background:'#C97A44',color:'#fff',fontWeight:700,cursor:'pointer'}}>{tc('landing.pos_add_staff')}</span>
          </div>
          {[
            {name:'Phidisia',role:tc('landing.pos_role_cashier'),sector:tc('landing.pos_sector_retail_lc'),branch:'town',phone:'0797446343',pin:true,last:'13/06/2026'},
            {name:'James',role:tc('landing.pos_role_inventory'),sector:tc('landing.pos_sector_retail_lc'),branch:'town',phone:'—',pin:true,last:'10/06/2026'},
          ].map((s,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',marginBottom:6}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'#F0EDE8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#C97A44',flexShrink:0}}>{s.name[0]}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                  <span style={{fontSize:11,fontWeight:700,color:'#1A1410'}}>{s.name}</span>
                  <span style={{fontSize:8,padding:'1px 6px',borderRadius:9999,background:'rgba(34,197,94,.08)',color:'#16a34a',border:'1px solid rgba(34,197,94,.2)',fontWeight:600}}>{s.sector}</span>
                </div>
                <div style={{fontSize:9,color:'#AAA'}}>{s.role} · {s.branch}{s.phone!=='—'?` · ${s.phone}`:''} · {tc('landing.pos_pin')} {s.pin?tc('landing.pos_pin_set'):tc('landing.pos_pin_not_set')} · {tc('landing.pos_last_login')} {s.last}</div>
              </div>
              <div style={{display:'flex',gap:5}}>
                <span style={{fontSize:9,padding:'4px 10px',borderRadius:5,border:'1px solid #E5E5E5',color:'#555',cursor:'pointer'}}>{tc('landing.pos_edit')}</span>
                <span style={{fontSize:9,padding:'4px 10px',borderRadius:5,border:'1px solid #fca5a5',color:'#ef4444',cursor:'pointer'}}>{tc('landing.pos_deactivate')}</span>
              </div>
            </div>
          ))}
          <div style={{marginTop:12,padding:'10px 12px',borderRadius:9,background:'rgba(201,122,68,.04)',border:'1px dashed rgba(201,122,68,.2)',textAlign:'center'}}>
            <div style={{fontSize:10,color:'#C97A44',fontWeight:600,marginBottom:2}}>{tc('landing.pos_staff_footer_title')}</div>
            <div style={{fontSize:9,color:'#AAA'}}>{tc('landing.pos_staff_footer_sub')}</div>
          </div>
        </div>
      )}

      {tab==='payments' && (
        <div style={{padding:'16px 18px'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#1A1410',marginBottom:3}}>{tc('landing.pos_pay_header')}</div>
          <div style={{fontSize:9,color:'#AAA',marginBottom:12}}>{tc('landing.pos_pay_sub')}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
            {[
              {name:'Paystack',desc:tc('landing.pos_pay_paystack_desc'),color:'#059669',bg:'rgba(5,150,105,.05)',bd:'rgba(5,150,105,.2)'},
              {name:'Stripe',desc:tc('landing.pos_pay_stripe_desc'),color:'#6366f1',bg:'rgba(99,102,241,.05)',bd:'rgba(99,102,241,.2)'},
            ].map((p,i)=>(
              <div key={i} style={{padding:'10px 13px',borderRadius:9,background:p.bg,border:`1px solid ${p.bd}`,display:'flex',alignItems:'center',gap:9}}>
                <div style={{width:28,height:28,borderRadius:6,background:p.bg,border:`1px solid ${p.bd}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>
                  <Ic n="card" size={14} color={p.color}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}>
                    <span style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{p.name}</span>
                    <span style={{width:5,height:5,borderRadius:'50%',background:p.color,display:'inline-block'}}/>
                    <span style={{fontSize:8,color:p.color,fontWeight:600}}>{tc('landing.pos_pay_active')}</span>
                  </div>
                  <div style={{fontSize:8,color:'#AAA'}}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <span style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{tc('landing.pos_pay_received_payments')}</span>
            <span style={{fontSize:8,padding:'2px 7px',borderRadius:9999,background:'rgba(34,197,94,.08)',color:'#16a34a',border:'1px solid rgba(34,197,94,.2)',fontWeight:700}}>{tc('landing.pos_pay_received_summary')}</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:7,marginBottom:12}}>
            {[{label:tc('landing.pos_pay_stat_received'),value:'6',sub:tc('landing.pos_pay_stat_payments')},{label:tc('landing.pos_pay_stat_total'),value:demo.compact(12.2),sub:tc('landing.pos_pay_stat_collected')},{label:tc('landing.pos_pay_stat_avg'),value:demo.compact(2.04),sub:tc('landing.pos_pay_stat_per_payment')}].map((k,i)=>(
              <div key={i} style={{padding:'8px 10px',background:'#fff',borderRadius:8,border:'1px solid #F0F0F0',textAlign:'center'}}>
                <div style={{fontSize:7,color:'#AAA',letterSpacing:'.08em',marginBottom:3}}>{k.label}</div>
                <div style={{fontSize:13,fontWeight:800,color:'#16a34a'}}>{k.value}</div>
                <div style={{fontSize:7,color:'#AAA'}}>{k.sub}</div>
              </div>
            ))}
          </div>
          {[
            {name:'+254722173771',method:`M-Pesa · paystack`,time:tc('landing.pos_pay_time_17h'),ref:'#6255025614',amount:demo.compact(11)},
            {name:tc('landing.pos_pay_customer'),method:`${tc('landing.pos_pay_method_card')} · stripe`,time:tc('landing.pos_pay_time_3d'),ref:'',amount:demo.compact(0.61)},
            {name:'+254713826241',method:`M-Pesa · paystack`,time:tc('landing.pos_pay_time_5d'),ref:'#6237054796',amount:demo.compact(0.15)},
          ].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',borderTop:'1px solid #F5F5F5'}}>
              <div style={{width:22,height:22,borderRadius:5,background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ic n="phone" size={11}/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:600,color:'#1A1410'}}>{t.name}</div>
                <div style={{fontSize:8,color:'#AAA'}}>{t.method} · {t.time}{t.ref?` · ${t.ref}`:''}</div>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:'#16a34a'}}>{t.amount}</span>
              <span style={{fontSize:7,padding:'2px 7px',borderRadius:9999,background:'rgba(34,197,94,.08)',color:'#16a34a',border:'1px solid rgba(34,197,94,.2)',fontWeight:700}}>{tc('landing.pos_pay_status_received')}</span>
            </div>
          ))}
          {/* Payment Recovery */}
          <div style={{marginTop:16,borderRadius:9,border:'1px solid #F0F0F0',background:'#fff',overflow:'hidden'}}>
            <div style={{padding:'10px 14px',borderBottom:'1px solid #F5F5F5',display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:3,height:14,borderRadius:9999,background:'#C97A44'}}/>
              <span style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{tc('landing.pos_pay_recovery')}</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0}}>
              {[{label:tc('landing.pos_pay_rec_failed'),value:'0',sub:demo.compact(0),color:'#ef4444'},{label:tc('landing.pos_pay_rec_recovered'),value:'0',sub:demo.compact(0),color:'#16a34a'},{label:tc('landing.pos_pay_rec_rate'),value:'0%',sub:tc('landing.pos_pay_rec_rate_sub'),color:'#888'},{label:tc('landing.pos_pay_rec_pending'),value:'0',sub:tc('landing.pos_pay_rec_pending_sub'),color:'#f59e0b'}].map((k,i)=>(
                <div key={i} style={{padding:'10px 0',textAlign:'center',borderRight:i<3?'1px solid #F5F5F5':'none'}}>
                  <div style={{fontSize:7,color:'#AAA',letterSpacing:'.06em',marginBottom:4}}>{k.label}</div>
                  <div style={{fontSize:16,fontWeight:800,color:k.color}}>{k.value}</div>
                  <div style={{fontSize:7,color:'#AAA'}}>{k.sub}</div>
                </div>
              ))}
            </div>
            <div style={{padding:'8px 14px',borderTop:'1px solid #F5F5F5',display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:8,color:'#888'}}>{tc('landing.pos_pay_auto_retry')}</span>
              <span style={{fontSize:8,padding:'2px 8px',borderRadius:5,border:'1px solid #E5E5E5',color:'#555',background:'#FAFAFA'}}>{tc('landing.pos_pay_auto_retry_value')}</span>
            </div>
            <div style={{padding:'8px 14px 10px',borderTop:'1px solid #F5F5F5',display:'flex',gap:5,flexWrap:'wrap'}}>
              {[tc('landing.pos_pay_filter_all'),tc('landing.pos_pay_filter_failed'),tc('landing.pos_pay_filter_retrying'),tc('landing.pos_pay_filter_recovered'),tc('landing.pos_pay_filter_abandoned')].map((f,i)=>(
                <span key={f} style={{fontSize:8,padding:'3px 9px',borderRadius:5,border:`1px solid ${i===0?'#C97A44':'#E5E5E5'}`,background:i===0?'rgba(201,122,68,.06)':'transparent',color:i===0?'#C97A44':'#888',cursor:'pointer'}}>{f}</span>
              ))}
            </div>
            <div style={{padding:'24px 14px',textAlign:'center',borderTop:'1px solid #F5F5F5'}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(34,197,94,.1)',border:'2px solid #16a34a',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px',fontSize:14}}>✓</div>
              <div style={{fontSize:11,fontWeight:700,color:'#16a34a',marginBottom:3}}>{tc('landing.pos_pay_no_failed')}</div>
              <div style={{fontSize:9,color:'#AAA'}}>{tc('landing.pos_pay_no_failed_sub')}</div>
            </div>
          </div>
        </div>
      )}

      {tab==='branches' && (
        <div style={{padding:'16px 18px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div style={{fontSize:10,color:'#888'}}>{tc('landing.pos_branch_active_count')}</div>
            <span style={{fontSize:9,padding:'5px 12px',borderRadius:5,background:'#C97A44',color:'#fff',fontWeight:700,cursor:'pointer'}}>{tc('landing.pos_add_branch')}</span>
          </div>
          <div style={{background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',padding:'12px 14px',marginBottom:8}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:32,height:32,borderRadius:7,background:'rgba(201,122,68,.08)',border:'1px solid rgba(201,122,68,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Ic n="store" size={15} color="#C97A44"/></div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                  <span style={{fontSize:11,fontWeight:700,color:'#1A1410'}}>Town Branch</span>
                  <span style={{fontSize:8,padding:'1px 6px',borderRadius:9999,background:'rgba(34,197,94,.08)',color:'#16a34a',border:'1px solid rgba(34,197,94,.2)',fontWeight:600}}>{tc('landing.pos_branch_active')}</span>
                  <span style={{fontSize:8,padding:'1px 6px',borderRadius:9999,background:'rgba(201,122,68,.08)',color:'#C97A44',fontWeight:600}}>{tc('landing.pos_branch_main')}</span>
                </div>
                <div style={{fontSize:9,color:'#AAA'}}>Nairobi, Kenya · {tc('landing.pos_branch_meta')}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#16a34a'}}>{demo.compact(12.2)}</div>
                <div style={{fontSize:8,color:'#AAA'}}>{tc('landing.pos_branch_revenue_today')}</div>
              </div>
            </div>
            <div style={{marginTop:10,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
              {[{label:tc('landing.pos_branch_sales_today'),value:'6'},{label:tc('landing.pos_branch_low_stock'),value:'37',color:'#ef4444'},{label:tc('landing.pos_branch_avg_sale'),value:demo.compact(2.04)}].map((s,i)=>(
                <div key={i} style={{padding:'6px 8px',background:'#FAFAFA',borderRadius:6,textAlign:'center'}}>
                  <div style={{fontSize:7,color:'#AAA',marginBottom:2}}>{s.label}</div>
                  <div style={{fontSize:11,fontWeight:700,color:s.color||'#1A1410'}}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:'10px 12px',borderRadius:9,background:'rgba(201,122,68,.04)',border:'1px dashed rgba(201,122,68,.2)',textAlign:'center'}}>
            <div style={{fontSize:10,color:'#C97A44',fontWeight:600,marginBottom:2}}>{tc('landing.pos_branch_footer_title')}</div>
            <div style={{fontSize:9,color:'#AAA'}}>{tc('landing.pos_branch_footer_sub')}</div>
          </div>
        </div>
      )}

      {tab==='map' && (
        <div style={{padding:'16px 18px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{tc('landing.pos_map_header')}</div>
            <div style={{display:'flex',gap:5}}>
              <span style={{fontSize:8,padding:'3px 8px',border:'1px solid #E5E5E5',borderRadius:5,color:'#888',cursor:'pointer'}}>{tc('landing.pos_map_satellite')}</span>
              <span style={{fontSize:8,padding:'3px 8px',border:'1px solid #C97A44',borderRadius:5,color:'#C97A44',background:'rgba(201,122,68,.06)',cursor:'pointer'}}>{tc('landing.pos_map_map')}</span>
            </div>
          </div>
          {/* Map placeholder */}
          <div style={{borderRadius:10,overflow:'hidden',border:'1px solid #E5E5E5',height:220,background:'#F0EDE8',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {/* Grid lines to simulate map */}
            <svg width="100%" height="100%" style={{position:'absolute',top:0,left:0,opacity:.15}}>
              {[0,1,2,3,4,5].map(i=><line key={`h${i}`} x1="0" y1={`${i*20}%`} x2="100%" y2={`${i*20}%`} stroke="#C97A44" strokeWidth="1"/>)}
              {[0,1,2,3,4,5,6,7,8,9].map(i=><line key={`v${i}`} x1={`${i*12}%`} y1="0" x2={`${i*12}%`} y2="100%" stroke="#C97A44" strokeWidth="1"/>)}
            </svg>
            {/* Road lines */}
            <svg width="100%" height="100%" style={{position:'absolute',top:0,left:0,opacity:.2}}>
              <path d="M0 110 Q340 100 680 115" stroke="#8B7355" strokeWidth="3" fill="none"/>
              <path d="M200 0 Q210 110 205 220" stroke="#8B7355" strokeWidth="2" fill="none"/>
              <path d="M0 60 Q340 55 680 65" stroke="#8B7355" strokeWidth="1.5" fill="none"/>
            </svg>
            {/* Branch pin */}
            <div style={{position:'absolute',top:'45%',left:'52%',transform:'translate(-50%,-100%)'}}>
              <div style={{width:28,height:28,borderRadius:'50% 50% 50% 0',background:'#C97A44',border:'2px solid #fff',boxShadow:'0 2px 8px rgba(0,0,0,.2)',transform:'rotate(-45deg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{transform:'rotate(45deg)',display:'flex'}}><Ic n="store" size={11} color="#fff"/></div>
              </div>
            </div>
            {/* Tooltip */}
            <div style={{position:'absolute',top:'18%',left:'44%',background:'#fff',borderRadius:7,padding:'5px 9px',boxShadow:'0 4px 12px rgba(0,0,0,.12)',border:'1px solid #F0F0F0',minWidth:110}}>
              <div style={{fontSize:9,fontWeight:700,color:'#1A1410'}}>Town Branch</div>
              <div style={{fontSize:8,color:'#AAA'}}>Nairobi, Kenya</div>
              <div style={{fontSize:8,color:'#16a34a',fontWeight:600,marginTop:2}}>{tc('landing.pos_map_tooltip_status')}</div>
            </div>
          </div>
          <div style={{marginTop:10,display:'flex',gap:8,flexWrap:'wrap'}}>
            <span style={{fontSize:9,display:'flex',alignItems:'center',gap:4,color:'#888'}}><span style={{width:8,height:8,borderRadius:'50%',background:'#16a34a',display:'inline-block'}}/>{tc('landing.pos_map_legend_active')}</span>
            <span style={{fontSize:9,display:'flex',alignItems:'center',gap:4,color:'#888'}}><span style={{width:8,height:8,borderRadius:'50%',background:'#E5E5E5',display:'inline-block'}}/>{tc('landing.pos_map_legend_inactive')}</span>
          </div>
        </div>
      )}

      {tab==='audit' && (
        <div style={{padding:'16px 18px'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
            <div style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{tc('landing.pos_audit_header')}</div>
            <div style={{display:'flex',gap:5}}>
              {[tc('landing.pos_audit_filter_all'),tc('landing.pos_audit_filter_sales'),tc('landing.pos_audit_filter_stock'),tc('landing.pos_audit_filter_staff'),tc('landing.pos_audit_filter_settings')].map((f,i)=>(
                <span key={f} style={{fontSize:8,padding:'3px 8px',border:`1px solid ${i===0?'#C97A44':'#E5E5E5'}`,borderRadius:5,color:i===0?'#C97A44':'#888',background:i===0?'rgba(201,122,68,.06)':'transparent',cursor:'pointer'}}>{f}</span>
              ))}
            </div>
          </div>
          {[
            {icon:'cart',action:tc('landing.pos_audit_0_action'),detail:tc('landing.pos_audit_0_detail'),user:'Phidisia',time:'10:41 AM',branch:'Town'},
            {icon:'package',action:tc('landing.pos_audit_1_action'),detail:tc('landing.pos_audit_1_detail'),user:'James',time:'9:15 AM',branch:'Town'},
            {icon:'cart',action:tc('landing.pos_audit_0_action'),detail:tc('landing.pos_audit_2_detail'),user:'Phidisia',time:'9:02 AM',branch:'Town'},
            {icon:'undo',action:tc('landing.pos_audit_3_action'),detail:tc('landing.pos_audit_3_detail'),user:'Phidisia',time:'8:47 AM',branch:'Town'},
            {icon:'user',action:tc('landing.pos_audit_4_action'),detail:tc('landing.pos_audit_4_detail'),user:tc('landing.pos_audit_user_system'),time:'8:30 AM',branch:'Town'},
            {icon:'settings',action:tc('landing.pos_audit_5_action'),detail:tc('landing.pos_audit_5_detail'),user:tc('landing.pos_audit_user_admin'),time:tc('landing.pos_audit_time_yesterday'),branch:'Town'},
          ].map((e,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'8px 0',borderTop:i>0?'1px solid #F5F5F5':'none'}}>
              <div style={{width:24,height:24,borderRadius:6,background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}><Ic n={e.icon} size={12}/></div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:1}}>
                  <span style={{fontSize:10,fontWeight:600,color:'#1A1410'}}>{e.action}</span>
                  <span style={{fontSize:7,padding:'1px 5px',borderRadius:4,background:'#F5F5F5',color:'#888'}}>{e.branch}</span>
                </div>
                <div style={{fontSize:8,color:'#AAA'}}>{e.detail} · by {e.user}</div>
              </div>
              <span style={{fontSize:8,color:'#AAA',flexShrink:0,whiteSpace:'nowrap'}}>{e.time}</span>
            </div>
          ))}
          <div style={{marginTop:8,textAlign:'center'}}>
            <span style={{fontSize:9,color:'#C97A44',cursor:'pointer',fontWeight:600}}>{tc('landing.pos_audit_load_more')}</span>
          </div>
        </div>
      )}

      {tab==='logistics' && (
        <div style={{padding:'16px 18px'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#1A1410',marginBottom:3,display:'flex',alignItems:'center',gap:5}}><Ic n="truck" size={12}/>{tc('landing.pos_log_header')}</div>
          <div style={{fontSize:9,color:'#AAA',marginBottom:14}}>{tc('landing.pos_log_sub')}</div>
          <div className="rep-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
            {[{label:tc('landing.pos_log_active_deliveries'),value:'0',icon:'truck',color:'#C97A44'},{label:tc('landing.pos_log_pending_pos'),value:'0',icon:'clipboard',color:'#6366f1'},{label:tc('landing.pos_log_stock_transfers'),value:'0',icon:'swap',color:'#16a34a'}].map((k,i)=>(
              <div key={i} style={{padding:'10px 12px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',textAlign:'center'}}>
                <div style={{marginBottom:5,display:'flex',justifyContent:'center'}}><Ic n={k.icon} size={16} color={k.color}/></div>
                <div style={{fontSize:16,fontWeight:800,color:k.color,marginBottom:2}}>{k.value}</div>
                <div style={{fontSize:8,color:'#AAA'}}>{k.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[
              {icon:'clipboard',title:tc('landing.pos_log_po_title'),desc:tc('landing.pos_log_po_desc'),badge:tc('landing.pos_soon')},
              {icon:'swap',title:tc('landing.pos_log_transfers_title'),desc:tc('landing.pos_log_transfers_desc'),badge:tc('landing.pos_soon')},
              {icon:'truck',title:tc('landing.pos_log_delivery_title'),desc:tc('landing.pos_log_delivery_desc'),badge:tc('landing.pos_soon')},
              {icon:'pin',title:tc('landing.pos_log_driver_title'),desc:tc('landing.pos_log_driver_desc'),badge:tc('landing.pos_soon')},
            ].map((m,i)=>(
              <div key={i} style={{padding:'12px 14px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',position:'relative'}}>
                <span style={{position:'absolute',top:8,right:8,fontSize:7,fontWeight:700,background:'#F0F0F0',color:'#888',borderRadius:9999,padding:'1px 6px'}}>{m.badge}</span>
                <div style={{marginBottom:7}}><Ic n={m.icon} size={16}/></div>
                <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:3}}>{m.title}</div>
                <div style={{fontSize:8,color:'#AAA',lineHeight:1.4}}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Calculator helpers — defined OUTSIDE MiniCalcWidget so React never remounts
//    inputs on re-render (defining components inside a render fn = new type each
//    render = unmount + remount = instant focus loss after every keystroke).
//    Also uses type="text" + inputMode="decimal" so mobile shows a number pad
//    instead of the browser's spinner arrows.
function CalcInput({placeholder,value,onChange,isInt}:{placeholder:string;value:string;onChange:(v:string)=>void;isInt?:boolean}) {
  return (
    <input
      type="text"
      inputMode={isInt?'numeric':'decimal'}
      placeholder={placeholder}
      value={value}
      onChange={e=>{
        const v=e.target.value
        // allow digits, one dot (or comma), leading minus for deletions
        if(v===''||v==='-'||/^-?\d*\.?\d*$/.test(v))onChange(v)
      }}
      style={{width:'100%',height:36,padding:'0 10px',fontSize:13,border:`1px solid ${T.bd}`,borderRadius:8,background:T.alt,color:T.tx,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}
    />
  )
}
function CalcResult({value,label,color}:{value:string;label:string;color:string}) {
  return (
    <div style={{textAlign:'center',padding:'6px 2px',background:T.alt,borderRadius:8}}>
      <div style={{fontFamily:'var(--font-instrument)',fontSize:16,fontWeight:700,color,lineHeight:1.2}}>{value}</div>
      <div style={{fontSize:8,color:T.tx3,fontWeight:700,marginTop:2,textTransform:'uppercase',letterSpacing:'.03em'}}>{label}</div>
    </div>
  )
}

function HeroBigDemo({tc,demo}:{tc:(k:string)=>string;demo:Demo}) {
  const HERO_TABS = [
    {id:'ops' as const, label:'Business Intelligence', icon:'chart'},
    {id:'cashier' as const, label:'PoS', icon:'camera'},
  ]
  const [heroTab,setHeroTab] = useState<'ops'|'cashier'>('ops')
  const activeIdx = HERO_TABS.findIndex(t=>t.id===heroTab)
  return (
    <div style={{ position:'relative', borderRadius:22, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.03), 0 8px 24px rgba(0,0,0,.04), 0 40px 100px rgba(0,0,0,.09), 0 90px 160px -40px rgba(0,0,0,.12)', overflow:'hidden', minHeight:640 }}>
      <div style={{ padding:16, background:'#fff' }}>
        <div style={{
          position:'relative', display:'flex', background:'#F0F0F0', borderRadius:12, padding:4,
          WebkitMaskImage:'linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)',
          maskImage:'linear-gradient(to right, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%)',
        }}>
          <div style={{
            position:'absolute', top:4, bottom:4, left:4,
            width:`calc(${100/HERO_TABS.length}% - 4px)`,
            transform:`translateX(${activeIdx*100}%)`,
            background:'#fff', borderRadius:9,
            boxShadow:'0 1px 2px rgba(0,0,0,.06), 0 6px 10px rgba(0,0,0,.05), 0 0 20px 6px rgba(201,122,68,.14)',
            transition:'transform 480ms cubic-bezier(0.65,0,0.35,1)',
          }}/>
          {HERO_TABS.map(t=>(
            <button key={t.id} className="hero-tab-btn" onClick={()=>setHeroTab(t.id)} style={{
              position:'relative', flex:1, padding:'11px 24px', fontSize:17, fontWeight:700, fontFamily:'inherit', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', gap:8,
              background:'none', border:'none', borderRadius:9, zIndex:1,
              color: heroTab===t.id ? '#1A1410' : '#8A8A8A', transition:'color 200ms',
            }}>
              {t.icon==='chart' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 20V10M12 20V4M20 20v-6"/></svg>}
              {t.icon==='camera' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2"/></svg>}
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {heroTab==='ops' ? (
        <PosShowcase tc={tc} demo={demo} />
      ) : (
        <iframe
          src="https://pos.askbiz.co/preview/cashier"
          title="AskBiz cashier — live demo"
          style={{ width:'100%', height:640, border:'none', display:'block' }}
        />
      )}
      <div style={{
        position:'absolute', inset:0, borderRadius:22, pointerEvents:'none',
        background:`
          radial-gradient(circle 64px at 0 0, ${T.bg} 0%, transparent 100%),
          radial-gradient(circle 64px at 100% 0, ${T.bg} 0%, transparent 100%),
          radial-gradient(circle 64px at 0 100%, ${T.bg} 0%, transparent 100%),
          radial-gradient(circle 64px at 100% 100%, ${T.bg} 0%, transparent 100%)
        `,
      }}/>
    </div>
  )
}

// ── Calculator ────────────────────────────────────────────────────────────────
function MiniCalcWidget({tc,lang,initialCurrency}:{tc:(k:string)=>string;lang:Locale;initialCurrency?:string}) {
  const BIZ_TYPES = buildBizTypes(tc)
  const [mode,setMode] = useState<'margin'|'industry'>('margin')
  const [biz,setBiz] = useState<BizType>('retail')
  const [cur,setCur] = useState(()=>Math.max(0,CURRENCIES.findIndex(c=>c.code===initialCurrency)))
  const curTouched = useRef(false)
  useEffect(()=>{
    // geo can resolve after mount (client fetch fallback) — follow it until the user picks
    if(curTouched.current) return
    const i = CURRENCIES.findIndex(c=>c.code===initialCurrency)
    if(i>=0) setCur(i)
  },[initialCurrency])
  const [showCur,setShowCur] = useState(false)
  const sym = CURRENCIES[cur].symbol
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!showCur) return
    const close=(e:MouseEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))setShowCur(false)}
    document.addEventListener('mousedown',close)
    return ()=>document.removeEventListener('mousedown',close)
  },[showCur])
  const [mc,setMc] = useState({cost:'',revenue:'',units:''})
  const mCost=parseFloat(mc.cost)||0,mRev=parseFloat(mc.revenue)||0,mUnits=parseInt(mc.units)||0
  const mProfit=mRev-mCost,mMargin=mRev>0?(mProfit/mRev)*100:0,mMarkup=mCost>0?(mProfit/mCost)*100:0
  const mHasResult=mCost>0&&mRev>0
  const [iv,setIv] = useState({a:'',b:'',c:'',d:'',price:'',units:''})
  const bt=BIZ_TYPES.find(b=>b.id===biz)!
  const iA=parseFloat(iv.a)||0,iB=parseFloat(iv.b)||0,iC=parseFloat(iv.c)||0,iD=parseFloat(iv.d)||0
  const iPrice=parseFloat(iv.price)||0,iUnits=parseInt(iv.units)||0
  let iCost=iA+iB+iC+iD
  if(biz==='repair')iCost=iA+(iB*iC)+iD
  if(biz==='restaurant')iCost=(iA+iB+iC)*(1+iD/100)
  const iGross=iPrice-iCost,iMargin=iPrice>0?(iGross/iPrice)*100:0,iHasResult=iCost>0
  const mc_=(m:number)=>m>=30?'#4ade80':m>=15?'#fb923c':'#f87171'
  const switchBiz=(b:BizType)=>{setBiz(b);setIv({a:'',b:'',c:'',d:'',price:'',units:''})}
  return (
    <div ref={ref} style={{maxWidth:520,width:'100%',background:T.card,border:`1px solid ${T.bd}`,borderRadius:20,boxShadow:'0 8px 32px rgba(0,0,0,.06)',position:'relative'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 16px 0',gap:10}}>
        <div style={{display:'inline-flex',borderRadius:9999,border:`1px solid ${T.bd}`,overflow:'hidden',background:T.alt}}>
          {(['margin','industry'] as const).map(id=>(
            <button key={id} onClick={()=>setMode(id)}
              style={{padding:'7px 18px',fontSize:12,fontWeight:700,fontFamily:'var(--font-jakarta)',background:mode===id?T.acc:'transparent',color:mode===id?'#fff':T.tx3,border:'none',cursor:'pointer',transition:'all 150ms'}}>
              {id==='margin'?tc('landing.calc_mode_margin'):tc('landing.calc_mode_cogs')}
            </button>
          ))}
        </div>
        <div style={{position:'relative'}}>
          <button onClick={()=>setShowCur(!showCur)}
            style={{padding:'5px 9px',fontSize:11,fontWeight:600,fontFamily:'inherit',background:T.alt,border:`1px solid ${T.bd}`,borderRadius:7,cursor:'pointer',color:T.tx2,display:'flex',alignItems:'center',gap:3}}>
            {sym}<span style={{fontSize:8,opacity:.5}}>▼</span>
          </button>
          {showCur&&(
            <div style={{position:'absolute',top:'100%',right:0,marginTop:4,background:T.card,borderRadius:10,boxShadow:'0 8px 32px rgba(0,0,0,.18)',zIndex:500,padding:8,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:3,minWidth:180,border:`1px solid ${T.bd}`}}>
              {CURRENCIES.map((c,i)=>(
                <button key={c.code} onClick={()=>{curTouched.current=true;setCur(i);setShowCur(false)}}
                  style={{padding:'5px 7px',fontSize:10,fontWeight:cur===i?700:500,fontFamily:'inherit',background:cur===i?T.acc:'transparent',color:cur===i?'#fff':T.tx2,border:'none',borderRadius:6,cursor:'pointer',textAlign:'center'}}>
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {mode==='industry'&&(
        <div style={{display:'flex',justifyContent:'center',gap:4,padding:'10px 14px 0',flexWrap:'wrap'}}>
          {BIZ_TYPES.map(b=>(
            <button key={b.id} onClick={()=>switchBiz(b.id)}
              style={{padding:'4px 10px',fontSize:11,fontWeight:biz===b.id?700:500,fontFamily:'inherit',background:biz===b.id?T.accBg:'transparent',color:biz===b.id?T.acc:T.tx3,border:`1px solid ${biz===b.id?T.accBdr:T.bd}`,borderRadius:9999,cursor:'pointer',transition:'all 150ms',display:'flex',alignItems:'center',gap:3}}>
              <Ic n={b.icon} size={11} color="currentColor"/>{b.label}
            </button>
          ))}
        </div>
      )}
      <div style={{padding:'10px 16px 14px'}}>
        {mode==='margin'?(
          <>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:7}}>
              <CalcInput placeholder={tc('landing.calc_ph_cost').replace('{sym}',sym)} value={mc.cost} onChange={v=>setMc(p=>({...p,cost:v}))}/>
              <CalcInput placeholder={tc('landing.calc_ph_sale_price').replace('{sym}',sym)} value={mc.revenue} onChange={v=>setMc(p=>({...p,revenue:v}))}/>
              <CalcInput placeholder={tc('landing.calc_ph_units_sold')} value={mc.units} onChange={v=>setMc(p=>({...p,units:v}))} isInt/>
            </div>
            {mHasResult&&(
              <div style={{marginTop:10}}>
                <div style={{height:5,borderRadius:3,background:T.alt,overflow:'hidden',marginBottom:8}}>
                  <div style={{height:'100%',borderRadius:3,background:mc_(mMargin),transform:`scaleX(${Math.min(mMargin,100)/100})`,transformOrigin:'left center',transition:'transform 300ms cubic-bezier(0.16,1,0.3,1)'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:mUnits>0?'1fr 1fr 1fr 1fr':'1fr 1fr 1fr',gap:5}}>
                  <CalcResult value={`${mMargin.toFixed(1)}%`} label={tc('landing.calc_label_margin')} color={mc_(mMargin)}/>
                  <CalcResult value={`${sym}${mProfit.toFixed(2)}`} label={tc('landing.calc_label_profit')} color={T.tx}/>
                  <CalcResult value={`${mMarkup.toFixed(0)}%`} label={tc('landing.calc_label_markup')} color={T.tx2}/>
                  {mUnits>0&&<CalcResult value={`${sym}${(mProfit*mUnits).toLocaleString('en-GB',{maximumFractionDigits:0})}`} label={tc('landing.calc_label_total_profit')} color="#4ade80"/>}
                </div>
              </div>
            )}
          </>
        ):(
          <>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:7}}>
              {bt.fields.map(f=>(<CalcInput key={f.key} placeholder={`${f.label}${('isPct' in f && f.isPct)?'':` (${sym})`}`} value={(iv as Record<string,string>)[f.key]} onChange={v=>setIv(p=>({...p,[f.key]:v}))}/>))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
              <CalcInput placeholder={`${bt.priceLabel} (${sym})`} value={iv.price} onChange={v=>setIv(p=>({...p,price:v}))}/>
              <CalcInput placeholder={bt.unitLabel} value={iv.units} onChange={v=>setIv(p=>({...p,units:v}))} isInt/>
            </div>
            {iHasResult&&(
              <div style={{marginTop:10}}>
                {iPrice>0&&(
                  <div style={{height:5,borderRadius:3,background:T.alt,overflow:'hidden',marginBottom:8}}>
                    <div style={{height:'100%',background:`linear-gradient(90deg,#f87171 ${Math.min((iCost/iPrice)*100,100)}%,#4ade80 ${Math.min((iCost/iPrice)*100,100)}%)`,borderRadius:3}}/>
                  </div>
                )}
                <div style={{display:'grid',gridTemplateColumns:iUnits>0&&iPrice>0?'1fr 1fr 1fr 1fr':iPrice>0?'1fr 1fr 1fr':'1fr',gap:5}}>
                  <CalcResult value={`${sym}${iCost.toFixed(2)}`} label={bt.resultLabel} color="#f87171"/>
                  {iPrice>0&&<><CalcResult value={`${sym}${iGross.toFixed(2)}`} label={tc('landing.calc_label_gross_profit')} color={iGross>=0?'#4ade80':'#f87171'}/><CalcResult value={`${iMargin.toFixed(1)}%`} label={tc('landing.calc_label_margin')} color={mc_(iMargin)}/></>}
                  {iUnits>0&&iPrice>0&&<CalcResult value={`${sym}${(iGross*iUnits).toLocaleString('en-GB',{maximumFractionDigits:0})}`} label={tc('landing.calc_label_total_profit')} color="#4ade80"/>}
                </div>
              </div>
            )}
          </>
        )}
        <div style={{marginTop:8,textAlign:'center'}}>
          <Link href={localePath(mode==='margin'?'/free-tools/profit-margin-calculator':'/free-tools/cogs-calculator', lang)}
            style={{fontSize:11,color:T.acc,fontWeight:600,textDecoration:'none'}}>
            {mode==='margin'?tc('landing.calc_open_full_margin'):tc('landing.calc_open_full_cogs')}
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
// ── Nav Dropdown ─────────────────────────────────────────────────────────────
interface DropGroup { group: string; links: { href: string; label: string; desc: string }[] }
interface DropFeatured { href: string; title: string; desc: string; icon?: 'globe'|'phone' }
function NavDropdown({ label, items, lang, featured, open, onToggle, onClose }: { label: string; items: DropGroup[]; lang: Locale; featured?: DropFeatured; open: boolean; onToggle: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open, onClose])
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{ fontSize:18,color:T.tx2,background:'none',border:'none',cursor:'pointer',padding:'0 14px',height:56,display:'flex',alignItems:'center',gap:5,fontFamily:'inherit',transition:'color 150ms',whiteSpace:'nowrap' }}
        className="nav-link"
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform:open?'rotate(180deg)':'none',transition:'transform 180ms' }}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div style={{ position:'absolute',top:'calc(100% + 4px)',left:'50%',transform:'translateX(-50%)',background:T.card,borderRadius:14,boxShadow:'0 8px 40px rgba(0,0,0,.12)',border:`1px solid ${T.bd}`,zIndex:100,padding:'14px 10px',minWidth:520 }}>
          <div style={{ display:'flex',gap:0 }}>
            {items.map((grp, gi) => (
              <div key={gi} style={{ flex:1,padding:'0 8px' }}>
                <div style={{ fontSize:9,fontWeight:700,color:T.acc,letterSpacing:'.12em',textTransform:'uppercase',padding:'4px 8px 8px' }}>{grp.group}</div>
                {grp.links.map(lnk => (
                  <Link key={lnk.href} href={localePath(lnk.href, lang)} onClick={onClose}
                    style={{ display:'block',padding:'7px 8px',borderRadius:8,textDecoration:'none' }}
                    className="nav-drop-item"
                  >
                    <div style={{ fontSize:12,fontWeight:600,color:T.tx,marginBottom:lnk.desc?1:0 }}>{lnk.label}</div>
                    {lnk.desc && <div style={{ fontSize:10,color:T.tx3,lineHeight:1.3 }}>{lnk.desc}</div>}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          {featured && (
            <Link href={localePath(featured.href, lang)} onClick={onClose}
              style={{ display:'flex',alignItems:'center',gap:10,marginTop:10,paddingTop:12,borderTop:`1px solid ${T.bd}`,textDecoration:'none' }}
              className="nav-drop-item"
            >
              <div style={{ width:32,height:32,borderRadius:8,background:T.accBg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:T.acc }}>
                {featured.icon==='globe' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>}
                {featured.icon==='phone' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>}
              </div>
              <div>
                <div style={{ fontSize:12,fontWeight:600,color:T.tx }}>{featured.title}</div>
                <div style={{ fontSize:10,color:T.tx3 }}>{featured.desc}</div>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// Founder photo with a graceful initials fallback — renders cleanly even
// before /public/images/founder.jpg exists or if it fails to load.
function FounderAvatar({ src, name, size=72 }: { src: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  if (failed) {
    return (
      <div style={{ width:size,height:size,borderRadius:'50%',background:T.accBg,border:`1px solid ${T.accBdr}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.32,fontWeight:700,color:T.acc,flexShrink:0 }}>
        {initials}
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} width={size} height={size} onError={()=>setFailed(true)} style={{ width:size,height:size,borderRadius:'50%',objectFit:'cover',border:`2px solid ${T.card}`,boxShadow:'0 2px 10px rgba(0,0,0,.12)',flexShrink:0 }}/>
  )
}

function LandingInner({ geo }: { geo: Geo | null }) {
  const { lang, setLang, tc } = useLang()
  const FAQS = buildFaqs(tc)
  const [scrollY, setScrollY] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [menuOpen, setMenuOpen] = useState(false)
  const [openNavMenu, setOpenNavMenu] = useState<'product'|'solutions'|null>(null)
  const [annual, setAnnual] = useState(false)
  // FAQ state removed — using native <details> for SEO
  const [liveGeo, setLiveGeo] = useState<Geo | null>(geo)
  // Three.js globe is decoration — don't make phones on metered/slow
  // connections pay ~200KB+ for it. Static gradient background remains.
  const [showGlobe, setShowGlobe] = useState(false)
  const [authUser, setAuthUser] = useState<{ initials: string } | null>(null)
  const [leadEmail, setLeadEmail] = useState('')
  const [leadStatus, setLeadStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
  async function submitLead(e: FormEvent) {
    e.preventDefault()
    if (leadStatus === 'sending' || leadStatus === 'sent') return
    setLeadStatus('sending')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: leadEmail, source: 'landing_closing_cta', country: geo?.country, locale: lang }),
      })
      setLeadStatus(res.ok ? 'sent' : 'error')
    } catch {
      setLeadStatus('error')
    }
  }
  useEffect(() => {
    const supabase = createClient()
    let alive = true
    const deriveInitials = (u: { user_metadata?: { full_name?: string; name?: string }; email?: string }) => {
      const name = u.user_metadata?.full_name || u.user_metadata?.name || u.email || ''
      const letters = name.split(/\s+/).filter(Boolean).map(p => p[0]).join('').toUpperCase().slice(0, 2)
      // Phone/PIN accounts carry a synthetic numeric email — no letters to initial, fall back to a glyph.
      return /[A-Z]/.test(letters) ? letters : ''
    }
    supabase.auth.getUser().then(({ data }) => {
      if (alive && data.user) setAuthUser({ initials: deriveInitials(data.user) })
    }).catch(() => { /* no/expired session on a marketing page visit — stay signed-out */ })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return
      setAuthUser(session?.user ? { initials: deriveInitials(session.user) } : null)
    })
    return () => { alive = false; sub.subscription.unsubscribe() }
  }, [])
  useEffect(() => {
    const conn = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (conn?.saveData || /2g/.test(conn?.effectiveType || '')) return
    if (window.matchMedia('(max-width: 768px)').matches) return
    setShowGlobe(true)
  }, [])

  const growthPrice   = liveGeo?.pricing?.growth   || '£19'
  const businessPrice = liveGeo?.pricing?.business || '£39'
  const posPrice      = liveGeo?.pricing?.pos      || '£5'
  const country       = liveGeo?.country           || ''
  const flag          = liveGeo?.flag              || ''

  function annualPrice(price: string): string {
    const m = price.match(/([\d,]+)/); if(!m) return price
    const n = Math.round(parseInt(m[1].replace(/,/g,''),10)*10/12)
    return price.replace(/[\d,]+/, String(n))
  }
  const growthMonthly = annual ? annualPrice(growthPrice) : growthPrice
  const bizMonthly    = annual ? annualPrice(businessPrice) : businessPrice

  const demo = buildDemo(liveGeo)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    const onMouse  = (e: MouseEvent) => setMouse({ x:(e.clientX/window.innerWidth-.5)*2, y:-(e.clientY/window.innerHeight-.5)*2 })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse) }
  }, [])

  useEffect(() => {
    if (geo) return
    fetch('/api/geo').then(r=>r.json()).then(d=>{
      if(d.pricing) setLiveGeo({country:d.country||'',countryCode:d.countryCode||'',city:d.city||'',currency:d.currency||'USD',currencySymbol:d.currencySymbol||'$',currencyName:d.currencyName||'US Dollar',flag:d.flag||'',pricing:d.pricing})
      const saved = document.cookie.split(';').find(c=>c.trim().startsWith('askbiz_lang='))
      if(!saved){
        const bl=navigator.language?.split('-')[0]?.toLowerCase()
        const BMAP: Record<string,Lang>={en:'en',fr:'fr',de:'de',es:'es',ar:'ar',sw:'sw',pt:'pt',nl:'nl',it:'it',pl:'pl'}
        if(bl&&bl!=='en'&&BMAP[bl]) setLang(BMAP[bl])
        else setLang((COUNTRY_TO_LANG as Record<string,Lang>)[d.countryCode]||'en')
      }
    }).catch(()=>{})
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if(!els.length) return
    const io = new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}
    }),{threshold:0.08,rootMargin:'0px 0px -30px 0px'})
    els.forEach(el=>io.observe(el))
    return ()=>io.disconnect()
  }, [])

  const isRTL = lang === 'ar'

  // Footer link columns — small, curated lists (not the full 50-country/6-sector
  // content sets) to stay scannable; deep pages are one click away via "see all".
  const footerColumns: { title: string; links: { href: string; label: string }[]; seeAll?: { href: string; label: string } }[] = [
    {
      title: tc('landing.footer_col_product'),
      links: [
        { href: '/point-of-sale', label: tc('landing.nav_point_of_sale') },
        { href: '/pricing', label: tc('landing.nav_pricing') },
        { href: '/compare', label: tc('landing.footer_compare') },
        { href: '/integrations', label: tc('landing.footer_integrations') },
      ],
    },
    {
      title: tc('landing.footer_col_solutions'),
      links: [
        { href: '/point-of-sale/retail', label: tc('landing.pos_sector_retail') },
        { href: '/point-of-sale/restaurant', label: tc('landing.pos_sector_restaurant') },
        { href: '/point-of-sale/salon', label: tc('landing.pos_sector_salon') },
        { href: '/point-of-sale/repair', label: tc('landing.pos_sector_repair') },
        { href: '/point-of-sale/factory', label: tc('landing.pos_sector_factory') },
        { href: '/point-of-sale/logistics', label: tc('landing.pos_sector_logistics') },
      ],
    },
    {
      title: tc('landing.footer_col_countries'),
      links: [
        { href: '/business-intelligence/kenya', label: tc('landing.footer_country_kenya') },
        { href: '/business-intelligence/tanzania', label: tc('landing.footer_country_tanzania') },
        { href: '/business-intelligence/uganda', label: tc('landing.footer_country_uganda') },
        { href: '/business-intelligence/rwanda', label: tc('landing.footer_country_rwanda') },
        { href: '/business-intelligence/democratic-republic-of-congo', label: tc('landing.footer_country_drc') },
        { href: '/business-intelligence/nigeria', label: tc('landing.footer_country_nigeria') },
        { href: '/business-intelligence/ghana', label: tc('landing.footer_country_ghana') },
        { href: '/business-intelligence/south-africa', label: tc('landing.footer_country_southafrica') },
      ],
      seeAll: { href: '/business-intelligence', label: tc('landing.footer_see_all_countries') },
    },
    {
      title: tc('landing.footer_col_learn'),
      links: [
        { href: '/blog', label: tc('landing.footer_blog') },
        { href: '/academy', label: tc('landing.footer_academy') },
        { href: '/research', label: 'Research' },
        { href: '/help', label: tc('landing.footer_help') },
        { href: '/glossary', label: tc('landing.nav_glossary_label') },
        { href: '/benchmarks', label: tc('landing.nav_benchmarks_label') },
        { href: '/free-tools', label: tc('landing.footer_free_tools') },
      ],
    },
    {
      title: tc('landing.footer_col_company'),
      links: [
        { href: '/privacy', label: tc('landing.footer_privacy') },
        { href: '/terms', label: tc('landing.footer_terms') },
        { href: '/dpa', label: tc('landing.footer_dpa') },
        { href: 'mailto:hello@askbiz.co', label: tc('landing.footer_contact') },
        { href: 'https://www.facebook.com/share/g/17wFxNYZRH/', label: tc('landing.footer_community_link') },
      ],
    },
  ]

  // Desktop mega-menus — grouped, descriptive nav (mirrors the pattern used by
  // ElevenLabs and other premium SaaS sites) instead of a flat link list.
  // Each link points at a real, indexed page so this doubles as internal linking.
  const PRODUCT_MENU: DropGroup[] = [
    {
      group: tc('landing.nav_product_group_sell'),
      links: [
        { href: '/point-of-sale', label: tc('landing.nav_point_of_sale'), desc: tc('landing.nav_product_pos_desc') },
        { href: '/point-of-sale/feature/payments', label: tc('landing.nav_product_payments_title'), desc: tc('landing.nav_product_payments_desc') },
        { href: '/point-of-sale/feature/multi-branch', label: tc('landing.nav_product_branch_title'), desc: tc('landing.nav_product_branch_desc') },
        { href: '/point-of-sale/feature/staff-shifts', label: tc('landing.nav_product_staff_title'), desc: tc('landing.nav_product_staff_desc') },
      ],
    },
    {
      group: tc('landing.nav_product_group_know'),
      links: [
        { href: '/business-intelligence', label: tc('landing.nav_product_bi_title'), desc: tc('landing.nav_product_bi_desc') },
        { href: '/free-tools', label: tc('landing.nav_free_tools'), desc: tc('landing.nav_product_tools_desc') },
        { href: '/academy', label: tc('landing.nav_academy_label'), desc: tc('landing.nav_product_academy_desc') },
        { href: '/compare', label: tc('landing.nav_product_compare_title'), desc: tc('landing.nav_product_compare_desc') },
      ],
    },
  ]
  const SOLUTIONS_MENU: DropGroup[] = [
    {
      group: tc('landing.nav_solutions_group_type'),
      links: [
        { href: '/for/salon-owners', label: tc('landing.where_seg_0'), desc: '' },
        { href: '/for/hardware-store-owners', label: tc('landing.where_seg_1'), desc: '' },
        { href: '/for/mini-supermarket-owners', label: tc('landing.where_seg_2'), desc: '' },
      ],
    },
    {
      group: tc('landing.nav_solutions_group_country'),
      links: [
        { href: '/business-intelligence/kenya', label: tc('landing.where_country_0'), desc: tc('landing.nav_solutions_country_ke_desc') },
        { href: '/business-intelligence/nigeria', label: tc('landing.where_country_1'), desc: tc('landing.nav_solutions_country_ng_desc') },
        { href: '/business-intelligence/uganda', label: tc('landing.where_country_2'), desc: tc('landing.nav_solutions_country_ug_desc') },
        { href: '/business-intelligence/ghana', label: tc('landing.where_country_3'), desc: tc('landing.nav_solutions_country_gh_desc') },
      ],
    },
  ]

  return (
    <div style={{ background:T.bg, color:T.tx, fontFamily:'var(--font-jakarta, Plus Jakarta Sans, system-ui)', overflowX:'hidden', direction:isRTL?'rtl':'ltr' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes tdot{0%,80%,100%{opacity:.25;transform:scale(.7)}40%{opacity:1;transform:scale(1)}}
        @keyframes demoFadeIn{from{opacity:.4}to{opacity:1}}
        [data-reveal]{opacity:0;transform:translateY(18px);transition:opacity 600ms cubic-bezier(0.22,1,0.36,1),transform 600ms cubic-bezier(0.22,1,0.36,1)}
        [data-reveal].revealed{opacity:1;transform:translateY(0)}
        [data-reveal-delay="1"].revealed{transition-delay:80ms}
        [data-reveal-delay="2"].revealed{transition-delay:160ms}
        .cta-btn{transition:filter 100ms,box-shadow 200ms,transform 100ms}
        .cta-btn:hover{filter:brightness(1.08);box-shadow:0 8px 28px rgba(201,122,68,.38)!important}
        .cta-btn:active{transform:scale(0.97)}
        .nav-link:hover{color:${T.tx}!important}
        .nav-drop-item:hover{background:${T.alt}!important}
        .nav-auth-link,.nav-auth-cta{transition:transform 150ms cubic-bezier(0.22,1,0.36,1),box-shadow 150ms}
        .nav-auth-link:hover{transform:translateY(-2px);color:${T.tx}!important}
        .nav-auth-cta:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(208,138,89,.4)!important}
        @media(max-width:768px){
          .nav-links{display:none!important}.nav-mobile-btn{display:flex!important}
          .nav-signin-link{display:none!important}
          .hero-ctas{flex-direction:column!important}
          .hero-ctas a{width:100%!important;text-align:center!important;justify-content:center!important}
        }
        .footer-grid{grid-template-columns:repeat(5,1fr)}
        @media(max-width:900px){.footer-grid{grid-template-columns:repeat(3,1fr)!important}}
        @media(max-width:560px){.footer-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:380px){.footer-grid{grid-template-columns:1fr!important}}
        input::placeholder{color:${T.tx3}}
        /* FAQ <details> — hide browser default triangle, rotate chevron when open */
        .faq-item summary::-webkit-details-marker{display:none}
        .faq-item summary::marker{display:none}
        .faq-item[open] .faq-chevron{transform:rotate(180deg)}
        .faq-item summary:hover h3{color:${T.acc}!important}
        /* PosShowcase tab bar — hide scrollbar, show fade hint on right edge */
        .pos-tabs::-webkit-scrollbar{display:none}
        .pos-tabs{scrollbar-width:none;-ms-overflow-style:none}
        .pos-tabs-wrap{position:relative}
        .pos-tabs-wrap::after{content:'';position:absolute;top:0;right:0;width:32px;height:100%;background:linear-gradient(to left,#fff,transparent);pointer-events:none;z-index:1}
        /* DemoUIReplica tab switcher — focus ring + fade-in on remount (CSS
           animation, not a JS timer, so content never lags behind a click) */
        .demo-tab:focus-visible{outline:2px solid ${T.acc};outline-offset:-2px;border-radius:6px}
        .demo-panel{animation:demoFadeIn 200ms cubic-bezier(0.22,1,0.36,1)}
        @media(prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none}*{animation:none!important}}
      ` }}/>

      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <nav aria-label="Primary navigation" style={{ position:'sticky',top:0,zIndex:50,background:T.nav,backdropFilter:'blur(20px)',padding:'0 clamp(16px,3vw,32px)',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,opacity:Math.max(0,1-scrollY/140),transform:`translateY(${Math.min(scrollY/7,14)}px)`,pointerEvents:scrollY>130?'none':'auto',transition:'opacity 120ms linear' }}>
        <Link href={localePath('/', lang as Locale)} style={{ display:'flex',alignItems:'center',gap:8,textDecoration:'none',color:T.tx,flexShrink:0 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:T.acc,display:'flex',alignItems:'center',justifyContent:'center' }}><Logo size={13}/></div>
          <span style={{ fontFamily:'var(--font-instrument)',fontSize:18,fontWeight:400,letterSpacing:'-.01em' }}>AskBiz</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links" style={{ display:'flex',alignItems:'center',gap:0,flex:1,justifyContent:'center' }}>
          <NavDropdown
            label={tc('landing.nav_menu_product')}
            items={PRODUCT_MENU}
            lang={lang as Locale}
            featured={{ href:'/point-of-sale/feature/works-everywhere', title:tc('landing.nav_product_featured_title'), desc:tc('landing.nav_product_featured_desc'), icon:'phone' }}
            open={openNavMenu==='product'}
            onToggle={()=>setOpenNavMenu(m=>m==='product'?null:'product')}
            onClose={()=>setOpenNavMenu(null)}
          />
          <NavDropdown
            label={tc('landing.nav_menu_solutions')}
            items={SOLUTIONS_MENU}
            lang={lang as Locale}
            featured={{ href:'/business-intelligence', title:tc('landing.nav_solutions_featured_title'), desc:tc('landing.nav_solutions_featured_desc'), icon:'globe' }}
            open={openNavMenu==='solutions'}
            onToggle={()=>setOpenNavMenu(m=>m==='solutions'?null:'solutions')}
            onClose={()=>setOpenNavMenu(null)}
          />
          {[
            ['#pricing',tc('landing.nav_pricing')],
            ['/help',tc('landing.nav_help')],
          ].map(([href,label])=>(
            <a key={href} href={href} className="nav-link" style={{ fontSize:18,color:T.tx2,textDecoration:'none',padding:'0 14px',transition:'color 150ms',whiteSpace:'nowrap' }}>{label}</a>
          ))}
        </div>

        <div style={{ display:'flex',alignItems:'center',gap:8,flexShrink:0 }}>
          <LanguageToggle />
          {authUser ? (
            <Link href={localePath('/home', lang as Locale)} className="nav-auth-link" aria-label="Go to your account" style={{
              width:30,height:30,borderRadius:'50%',background:'transparent',border:`1px solid ${T.bd}`,color:T.tx2,fontSize:12,fontWeight:600,
              display:'inline-flex',alignItems:'center',justifyContent:'center',textDecoration:'none',flexShrink:0,
            }}>
              {authUser.initials || (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.tx2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </Link>
          ) : (
            <>
              <Link href={localePath('/signin', lang as Locale)} className="nav-signin-link nav-auth-link" style={{ fontSize:14,color:T.tx2,textDecoration:'none',padding:'0 4px',fontWeight:500,whiteSpace:'nowrap' }}>
                {tc('landing.nav_sign_in')}
              </Link>
              <Link href={localePath('/signin?mode=signup', lang as Locale)} className="nav-auth-cta" style={{ fontSize:14,fontWeight:700,color:'#fff',background:T.acc,borderRadius:9999,padding:'8px 18px',textDecoration:'none',whiteSpace:'nowrap',boxShadow:'0 2px 12px rgba(208,138,89,.3)' }}>
                {tc('landing.nav_get_started')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="nav-mobile-btn" style={{ display:'none',alignItems:'center',gap:8 }}>
          <button onClick={()=>setMenuOpen(o=>!o)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} style={{ width:38,height:38,borderRadius:9,border:`1px solid ${T.bd}`,background:'transparent',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',padding:0 }}>
            {menuOpen
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.tx} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.tx} strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen&&(
        <div style={{ display:'flex',flexDirection:'column',position:'fixed',top:56,left:0,right:0,bottom:0,background:T.bg,zIndex:49,overflowY:'auto',padding:'8px 20px 32px' }}>
          {[
            ['#pos',tc('landing.nav_how_it_works')],
            ['/point-of-sale',tc('landing.nav_point_of_sale')],
            ['#pricing',tc('landing.nav_pricing')],
            ['/integrations',tc('landing.nav_integrations')],
            ['/help',tc('landing.nav_help_centre_label')],
            ['/academy',tc('landing.nav_academy_label')],
            ['/blog',tc('landing.nav_blog_label')],
          ].map(([href,label])=>(
            <a key={href} href={href.startsWith('#') ? href : localePath(href, lang as Locale)} onClick={()=>setMenuOpen(false)} style={{ display:'block',padding:'14px 12px',fontSize:15,fontWeight:500,color:T.tx,textDecoration:'none',borderBottom:`1px solid ${T.bd}` }}>{label}</a>
          ))}
          <div style={{ marginTop:20,display:'flex',flexDirection:'column',gap:10 }}>
            {authUser ? (
              <Link href={localePath('/home', lang as Locale)} onClick={()=>setMenuOpen(false)} style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'14px',borderRadius:9999,background:T.acc,color:'#fff',fontSize:15,fontWeight:700,textDecoration:'none',textAlign:'center' }}>
                <span style={{ width:26,height:26,borderRadius:'50%',background:'rgba(255,255,255,.25)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:12 }}>
                  {authUser.initials || (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  )}
                </span>
                Go to your account
              </Link>
            ) : (
              <>
                <Link href={localePath('/signin?mode=signup', lang as Locale)} onClick={()=>setMenuOpen(false)} style={{ display:'block',padding:'14px',borderRadius:9999,background:T.acc,color:'#fff',fontSize:15,fontWeight:700,textDecoration:'none',textAlign:'center' }}>{tc('landing.nav_get_started')}</Link>
                <Link href={localePath('/signin', lang as Locale)} onClick={()=>setMenuOpen(false)} style={{ display:'block',padding:'14px',borderRadius:9999,border:`1px solid ${T.bd}`,background:'transparent',color:T.tx2,fontSize:14,fontWeight:500,textDecoration:'none',textAlign:'center' }}>{tc('landing.mobile_sign_in')}</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section id="calc" style={{ position:'relative',display:'flex',alignItems:'center' }}>
        <div style={{ position:'absolute',top:'20%',left:'5%',width:'50%',height:'60%',background:'radial-gradient(ellipse,rgba(201,122,68,.05) 0%,transparent 70%)',pointerEvents:'none',zIndex:1 }}/>
        <div style={{ maxWidth:1280,margin:'0 auto',width:'100%',padding:'clamp(32px,5vw,48px) clamp(20px,5vw,80px) clamp(40px,6vw,64px)',position:'relative',zIndex:2 }}>
          <div className="hero-grid" style={{ gap:'clamp(24px,4vw,48px)', gridTemplateColumns:'1.1fr 1fr', alignItems:'end' }}>
            {/* Left — headline */}
            <div>
              <h1 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(30px,4vw,68px)',fontWeight:400,lineHeight:1.02,letterSpacing:'-.02em',color:T.tx }}>
                {tc('landing.hero_title_line1')}<br/>
                <em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.hero_title_line2')}</em>
              </h1>
            </div>
            {/* Right — subtitle, aligned beside the bottom of the headline */}
            <div>
              <p style={{ fontSize:'clamp(15px,1.3vw,17px)',color:T.tx2,lineHeight:1.6 }}>
                {tc('landing.hero_subtitle')}
              </p>
            </div>
          </div>
          <div style={{ marginTop:'clamp(24px,3vw,36px)' }}>
            <HeroBigDemo tc={tc} demo={demo} />
          </div>
        </div>
        <div style={{ position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:6,zIndex:2,opacity:Math.max(0,1-scrollY/250),pointerEvents:'none' }}>
          <span style={{ fontSize:9,color:T.tx3,letterSpacing:'.14em',textTransform:'uppercase' }}>{tc('landing.hero_scroll')}</span>
          <div style={{ width:1,height:28,background:`linear-gradient(to bottom,${T.bd},transparent)` }}/>
        </div>
      </section>

      {/* ── PROOF STRIP ───────────────────────────────────────────────── */}
      <div style={{ borderTop:`1px solid ${T.bd}`,borderBottom:`1px solid ${T.bd}`,background:T.card,padding:'14px clamp(16px,4vw,40px)',display:'flex',alignItems:'center',justifyContent:'center',gap:'clamp(20px,3vw,48px)',flexWrap:'wrap' }}>
        {[
          { before:tc('landing.stat_0_label'), after:tc('landing.stat_0_value') },
          { before:tc('landing.stat_1_label'), after:tc('landing.stat_1_value') },
          { before:tc('landing.stat_2_label'), after:tc('landing.stat_2_value') },
          { before:tc('landing.stat_3_label'), after:tc('landing.stat_3_value') },
          { before:tc('landing.stat_4_label'), after:tc('landing.stat_4_value') },
        ].map((s,i)=>(
          <div key={i} style={{ display:'flex',alignItems:'center',gap:7,flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.acc} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize:12,color:T.tx2,lineHeight:1.4 }}>
              <strong style={{ color:T.tx,fontWeight:600 }}>{s.after}</strong>{' '}{s.before}
            </span>
          </div>
        ))}
      </div>

      {/* ── WHERE IT WORKS ── keyword-bearing H2 + quotable definition for
           search and answer engines; links into country hubs and use-case pages ── */}
      <section style={{ background:T.bg,padding:'clamp(44px,5vw,64px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:760,margin:'0 auto',textAlign:'center' }} data-reveal>
          <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(24px,3vw,38px)',fontWeight:400,lineHeight:1.15,letterSpacing:'-.02em',color:T.tx,marginBottom:14 }}>
            {tc('landing.where_title')}
          </h2>
          <p style={{ fontSize:16,color:T.tx2,lineHeight:1.75,marginBottom:22,maxWidth:620,marginLeft:'auto',marginRight:'auto' }}>
            {tc('landing.where_body')}
          </p>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginBottom:10 }}>
            {[
              ['/business-intelligence/kenya',tc('landing.where_country_0')],
              ['/business-intelligence/nigeria',tc('landing.where_country_1')],
              ['/business-intelligence/uganda',tc('landing.where_country_2')],
              ['/business-intelligence/ghana',tc('landing.where_country_3')],
              ['/business-intelligence/tanzania',tc('landing.where_country_4')],
              ['/business-intelligence/south-africa',tc('landing.where_country_5')],
            ].map(([href,label])=>(
              <Link key={href} href={localePath(href, lang as Locale)} style={{ padding:'7px 15px',borderRadius:9999,border:`1px solid ${T.bd}`,background:T.card,fontSize:12,color:T.tx2,fontWeight:600,textDecoration:'none' }}>
                {label}
              </Link>
            ))}
          </div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center' }}>
            {[
              ['/for/salon-owners',tc('landing.where_seg_0')],
              ['/for/hardware-store-owners',tc('landing.where_seg_1')],
              ['/for/mini-supermarket-owners',tc('landing.where_seg_2')],
            ].map(([href,label])=>(
              <Link key={href} href={localePath(href, lang as Locale)} style={{ padding:'6px 13px',borderRadius:9999,border:`1px solid ${T.accBdr}`,background:T.accBg,fontSize:12,color:T.acc,fontWeight:600,textDecoration:'none' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POINT OF SALE — Eleven-pattern example section ─────────────── */}
      <section id="pos" style={{ padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)',background:T.bg }}>
        <div style={{ maxWidth:1180,margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:'clamp(32px,5vw,64px)', alignItems:'end', marginBottom:40 }} data-reveal>
            <div>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:T.acc, marginBottom:14 }}>Point of sale</div>
              <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(28px,4vw,50px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',color:T.tx,marginBottom:20 }}>
                {tc('landing.pos_title_line1')}<br/><em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.pos_title_line2')}</em>
              </h2>
              <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
                <Link href={localePath('/signin?mode=signup', lang as Locale)} className="cta-btn" style={{ padding:'11px 26px',borderRadius:9999,background:T.acc,color:'#1a1410',fontSize:14,fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:7 }}>
                  {tc('landing.pos_cta')}
                </Link>
                <Link href="/demo" style={{ padding:'11px 22px',borderRadius:9999,border:`1px solid ${T.bd}`,background:'transparent',color:T.tx2,fontSize:14,fontWeight:500,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6 }}>
                  {tc('landing.pos_demo_cta')}
                </Link>
              </div>
            </div>
            <p style={{ fontSize:16,color:T.tx2,lineHeight:1.7,margin:0 }}>
              {tc('landing.pos_subtitle')} <span style={{ color:T.tx3 }}>{tc('landing.pos_cta_note',{pos:posPrice})}</span>
            </p>
          </div>

          {/* Bento feature grid — custom line icons, single accent, no emoji */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }} className="rep-4col">
            {[
              { icon:'camera', title:'Camera scan', desc:'No barcode gun — point and sell.' },
              { icon:'wallet', title:'M-Pesa built in', desc:'Mobile money and cash, no setup.' },
              { icon:'branch', title:'Multi-branch', desc:'One view across every location.' },
              { icon:'cloud-off', title:'Works offline', desc:'Cash sales keep going, no signal.' },
            ].map(f=>(
              <div key={f.title} style={{ border:`1px solid ${T.bd}`, borderRadius:14, padding:'20px 18px', background:T.card }}>
                <div style={{ marginBottom:14 }}>
                  {f.icon==='camera' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.tx2} strokeWidth="1.4"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2"/></svg>}
                  {f.icon==='wallet' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.tx2} strokeWidth="1.4"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="14" r="1.3"/></svg>}
                  {f.icon==='branch' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.tx2} strokeWidth="1.4"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M6 8.4V13a4 4 0 0 0 4 4M18 8.4V13a4 4 0 0 1-4 4"/></svg>}
                  {f.icon==='cloud-off' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.tx2} strokeWidth="1.4"><path d="M17 18H7a4 4 0 0 1-1-7.87A5.5 5.5 0 0 1 16.9 8.1 4 4 0 0 1 17 18z"/><path d="M3 3l18 18" strokeLinecap="round"/></svg>}
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:T.tx, marginBottom:5 }}>{f.title}</div>
                <div style={{ fontSize:12.5, color:T.tx3, lineHeight:1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE / MONITOR ────────────────────────────────────── */}
      <section style={{ padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)',background:T.alt,borderTop:`1px solid ${T.bd}`,borderBottom:`1px solid ${T.bd}` }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="two-col-wide" style={{ gap:'clamp(36px,5vw,64px)' }}>
            <div data-reveal>
              <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,46px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:14,color:T.tx }}>
                {tc('landing.monitor_title_line1')}<br/><em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.monitor_title_line2')}</em>
              </h2>
              <p style={{ fontSize:16,color:T.tx2,lineHeight:1.7,marginBottom:22,maxWidth:320 }}>
                {tc('landing.monitor_subtitle')}
              </p>
              <div style={{ display:'flex',flexDirection:'column',gap:9 }}>
                {[
                  {icon:'zap',label:tc('landing.monitor_feat_0')},
                  {icon:'chart',label:tc('landing.monitor_feat_1')},
                  {icon:'bulb',label:tc('landing.monitor_feat_2')},
                  {icon:'clock',label:tc('landing.monitor_feat_3')},
                ].map((f,i)=>(
                  <div key={i} style={{ display:'flex',gap:9,alignItems:'flex-start',fontSize:13,color:T.tx2 }}>
                    <Ic n={f.icon} size={15} color={T.acc} style={{marginTop:1}}/><span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal data-reveal-delay="1">
              <MonitorUIReplica tc={tc} demo={demo} />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOURCES / CONNECT ─────────────────────────────────────────── */}
      <section style={{ background:T.bg,padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="two-col" style={{ gap:'clamp(36px,5vw,64px)' }}>
            <div data-reveal>
              <SourcesUIReplica tc={tc} />
            </div>
            <div data-reveal data-reveal-delay="1">
              <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,46px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:14,color:T.tx }}>
                {tc('landing.sources_title_line1')} {tc('landing.sources_title_line2')}
              </h2>
              <p style={{ fontSize:16,color:T.tx2,lineHeight:1.75,marginBottom:22,maxWidth:320 }}>
                {tc('landing.sources_subtitle')}
              </p>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {[0,1,2,3].map(i=>tc('landing.sources_feat_'+i)).map((f,i)=>(
                  <div key={i} style={{ display:'flex',gap:8,alignItems:'center',fontSize:13,color:T.tx2 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.acc} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>{f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE STAFF DEMO ── dynamic tab-driven widget (DemoUIReplica) on the
           left, matched by height against the text column on the right ── */}
      <section style={{ background:T.card,padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="two-col" style={{ gap:'clamp(36px,5vw,64px)' }}>
            <div data-reveal>
              <DemoUIReplica tc={tc} demo={demo} />
            </div>
            <div data-reveal data-reveal-delay="1">
              <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,46px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:14,color:T.tx }}>
                {tc('landing.demo_title_line1')}<br/><em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.demo_title_line2')}</em>
              </h2>
              <p style={{ fontSize:16,color:T.tx2,lineHeight:1.75,marginBottom:22,maxWidth:320 }}>
                {tc('landing.demo_subtitle')}
              </p>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {[0,1,2,3].map(i=>tc('landing.demo_feat_'+i)).map((f,i)=>(
                  <div key={i} style={{ display:'flex',gap:8,alignItems:'center',fontSize:13,color:T.tx2 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.acc} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>{f}
                  </div>
                ))}
              </div>
              <a href="https://pos.askbiz.co/preview" target="_blank" rel="noopener noreferrer" className="cta-btn" style={{ display:'inline-flex',alignItems:'center',gap:7,marginTop:22,padding:'11px 22px',borderRadius:9999,background:T.acc,color:'#fff',fontSize:13,fontWeight:700,textDecoration:'none' }}>
                {tc('landing.demo_cta')} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY WE BUILT IT ── founder note.
           TODO: replace with 2-3 real customer testimonials (name, business type,
           city, photo) as soon as the first traders agree to be quoted. ── */}
      <section style={{ background:T.card,borderTop:`1px solid ${T.bd}`,padding:'clamp(56px,7vw,80px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:640,margin:'0 auto',textAlign:'center' }} data-reveal>
          <div style={{ fontSize:11,fontWeight:700,color:T.acc,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:14 }}>{tc('landing.proof_note_label')}</div>
          <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:400,lineHeight:1.1,letterSpacing:'-.02em',color:T.tx,marginBottom:20 }}>
            {tc('landing.proof_note_title')}
          </h2>
          <p style={{ fontSize:'clamp(14px,1.3vw,16px)',color:T.tx2,lineHeight:1.8,marginBottom:22 }}>
            {tc('landing.proof_note_body')}
          </p>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginBottom:26 }}>
            <FounderAvatar src="/images/founder.jpg" name={tc('landing.proof_note_name')} />
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:14,fontWeight:700,color:T.tx }}>{tc('landing.proof_note_name')}</div>
              <div style={{ fontSize:12,color:T.tx3 }}>{tc('landing.proof_note_title_role')}</div>
            </div>
          </div>
          <p style={{ fontSize:16,color:T.tx2,marginBottom:18 }}>{tc('landing.proof_note_join')}</p>
          <Link href={localePath('/signin?mode=signup', lang as Locale)} className="cta-btn" style={{ display:'inline-flex',alignItems:'center',gap:7,padding:'12px 26px',borderRadius:9999,background:T.acc,color:'#fff',fontSize:14,fontWeight:700,textDecoration:'none' }}>
            {tc('landing.proof_note_cta')}
          </Link>
        </div>
      </section>

      {/* ── COMPARE ───────────────────────────────────────────────────── */}
      <section style={{ background:T.alt,borderTop:`1px solid ${T.bd}`,borderBottom:`1px solid ${T.bd}`,padding:'clamp(56px,7vw,88px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:44 }} data-reveal>
            <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,46px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:14,color:T.tx }}>
              {tc('landing.compare_title_line1')} {tc('landing.compare_title_line2')}
            </h2>
            <p style={{ fontSize:16,color:T.tx2,lineHeight:1.7,maxWidth:440,margin:'0 auto' }}>
              {tc('landing.compare_subtitle')}
            </p>
          </div>

          {/* Three-column cards — African visitors compare against their real
              alternatives (notebook, hardware till); elsewhere Shopify/Power BI */}
          <div data-reveal data-reveal-delay="1" className="three-col" style={{ gap:16,marginBottom:40 }}>
            {[
              demo.afri ? {
                name:tc('landing.compare_alt_0_name'),
                role:tc('landing.compare_alt_0_role'),
                price:tc('landing.compare_alt_0_price'),
                pros:[0,1,2].map(j=>tc('landing.compare_alt_0_pro_'+j)),
                cons:[0,1,2,3].map(j=>tc('landing.compare_alt_0_con_'+j)),
                verdict:tc('landing.compare_alt_0_verdict'),
              } : {
                name:tc('landing.compare_0_name'),
                role:tc('landing.compare_0_role'),
                price:tc('landing.compare_0_price'),
                pros:[0,1,2].map(j=>tc('landing.compare_0_pro_'+j)),
                cons:[0,1,2,3].map(j=>tc('landing.compare_0_con_'+j)),
                verdict:tc('landing.compare_0_verdict'),
              },
              {
                name:tc('landing.compare_1_name'),
                role:tc('landing.compare_1_role'),
                price:tc('landing.compare_1_price',{growth:growthPrice,business:businessPrice}),
                highlight:true,
                pros:[0,1,2,3,4,5].map(j=>tc('landing.compare_1_pro_'+j)),
                cons:demo.afri?[0,1].map(j=>tc('landing.compare_alt_1_con_'+j)):[0,1].map(j=>tc('landing.compare_1_con_'+j)),
                verdict:demo.afri?tc('landing.compare_alt_1_verdict'):tc('landing.compare_1_verdict'),
              },
              demo.afri ? {
                name:tc('landing.compare_alt_2_name'),
                role:tc('landing.compare_alt_2_role'),
                price:tc('landing.compare_alt_2_price'),
                pros:[0,1,2].map(j=>tc('landing.compare_alt_2_pro_'+j)),
                cons:[0,1,2,3].map(j=>tc('landing.compare_alt_2_con_'+j)),
                verdict:tc('landing.compare_alt_2_verdict'),
              } : {
                name:tc('landing.compare_2_name'),
                role:tc('landing.compare_2_role'),
                price:tc('landing.compare_2_price'),
                pros:[0,1,2].map(j=>tc('landing.compare_2_pro_'+j)),
                cons:[0,1,2,3].map(j=>tc('landing.compare_2_con_'+j)),
                verdict:tc('landing.compare_2_verdict'),
              },
            ].map((tool,i)=>(
              <div key={i} style={{ background:tool.highlight?T.acc:'transparent',borderRadius:14,border:`1px solid ${tool.highlight?'transparent':T.bd}`,padding:'24px',display:'flex',flexDirection:'column',gap:0,position:'relative' }}>
                {tool.highlight && <div style={{ position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:T.acc,border:`2px solid ${T.bg}`,borderRadius:9999,padding:'2px 12px',fontSize:10,fontWeight:700,color:'#fff',whiteSpace:'nowrap',letterSpacing:'.06em' }}>{tc('landing.compare_recommended')}</div>}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:16,fontWeight:700,color:tool.highlight?'#fff':T.tx,marginBottom:3 }}>{tool.name}</div>
                  <div style={{ fontSize:11,color:tool.highlight?'rgba(255,255,255,.7)':T.tx3,marginBottom:8 }}>{tool.role}</div>
                  <div style={{ fontSize:13,fontWeight:700,color:tool.highlight?'#fff':T.acc }}>{tool.price}</div>
                </div>
                <div style={{ flex:1,display:'flex',flexDirection:'column',gap:12 }}>
                  <div>
                    {tool.pros.map((p,j)=>(
                      <div key={j} style={{ display:'flex',gap:7,alignItems:'flex-start',fontSize:12,color:tool.highlight?'rgba(255,255,255,.9)':T.tx2,marginBottom:5 }}>
                        <span style={{ color:tool.highlight?'#fff':'#16a34a',flexShrink:0,marginTop:1 }}>✓</span>{p}
                      </div>
                    ))}
                  </div>
                  <div>
                    {tool.cons.map((c,j)=>(
                      <div key={j} style={{ display:'flex',gap:7,alignItems:'flex-start',fontSize:12,color:tool.highlight?'rgba(255,255,255,.6)':T.tx3,marginBottom:5 }}>
                        <span style={{ flexShrink:0,marginTop:1 }}>–</span>{c}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop:16,paddingTop:14,borderTop:`1px solid ${tool.highlight?'rgba(255,255,255,.2)':T.bd}`,fontSize:12,color:tool.highlight?'rgba(255,255,255,.8)':T.tx2,lineHeight:1.55,fontStyle:'italic' }}>
                  {tool.verdict}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:'center' }}>
            <Link href={localePath('/compare', lang as Locale)} style={{ fontSize:13,color:T.tx3,textDecoration:'none',borderBottom:`1px solid ${T.bd}`,paddingBottom:1 }}>
              {tc('landing.compare_full_link')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)',background:T.bg }}>
        <div style={{ maxWidth:1000,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:36 }} data-reveal>
            <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.8vw,48px)',fontWeight:400,lineHeight:1.08,letterSpacing:'-.02em',marginBottom:10,color:T.tx }}>
              {tc('landing.pricing_title')}
            </h2>
            <p style={{ fontSize:13,color:T.tx2 }}>{tc('landing.pricing_subtitle')}</p>
          </div>
          {/* POS add-on */}
          <div data-reveal style={{ borderRadius:16,border:`1px solid ${T.accBdr}`,background:`rgba(201,122,68,.04)`,padding:'clamp(16px,2.5vw,24px) clamp(16px,2.5vw,28px)',marginBottom:20 }}>
            <div style={{ display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:16 }}>
              <div>
                <div style={{ display:'inline-flex',alignItems:'center',gap:8,marginBottom:9 }}>
                  <span style={{ fontFamily:'var(--font-instrument)',fontSize:20,color:T.acc }}>{tc('landing.pricing_pos_name')}</span>
                  <span style={{ fontSize:9,fontWeight:700,color:'#fff',background:T.acc,padding:'2px 7px',borderRadius:9999,textTransform:'uppercase' }}>{tc('landing.pricing_pos_addon')}</span>
                </div>
                <div style={{ display:'flex',alignItems:'baseline',gap:4,marginBottom:5 }}>
                  <span style={{ fontFamily:'var(--font-instrument)',fontSize:32,color:T.tx }}>{posPrice}</span>
                  <span style={{ fontSize:12,color:T.tx3 }}>{tc('landing.pricing_pos_per_seat')}</span>
                </div>
                <Link href={localePath('/signin?mode=signup', lang as Locale)} className="cta-btn" style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'8px 18px',borderRadius:9999,background:T.acc,color:'#fff',fontSize:12,fontWeight:700,textDecoration:'none',marginTop:10 }}>
                  {tc('landing.pricing_pos_cta')}
                </Link>
              </div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6,maxWidth:480 }}>
                {[0,1,2,3,4,5,6,7].map(i=>tc('landing.pricing_pos_pill_'+i)).map((f,i)=>(
                  <span key={i} style={{ padding:'5px 11px',borderRadius:9999,background:T.accBg,border:`1px solid ${T.accBdr}`,fontSize:11,color:T.tx2 }}>{f}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Annual toggle */}
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:16 }}>
            <span style={{ fontSize:12,color:annual?T.tx3:T.tx,fontWeight:annual?400:600 }}>{tc('landing.pricing_toggle_monthly')}</span>
            <button role="switch" aria-checked={annual} onClick={()=>setAnnual(v=>!v)} style={{ width:44,height:23,borderRadius:12,background:annual?T.acc:T.bd2,border:'none',cursor:'pointer',position:'relative',transition:'background 200ms',outline:'none' }}>
              <div style={{ width:17,height:17,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:annual?24:3,transition:'left 200ms',boxShadow:'0 1px 4px rgba(0,0,0,.3)' }}/>
            </button>
            <span style={{ fontSize:12,color:annual?T.tx:T.tx3,fontWeight:annual?600:400 }}>
              {tc('landing.pricing_toggle_annual')} <span style={{ fontSize:10,fontWeight:700,color:'#16a34a',background:'rgba(22,163,74,.08)',borderRadius:9999,padding:'1px 6px',marginLeft:3 }}>{tc('landing.pricing_toggle_save')}</span>
            </span>
          </div>
          {/* Tiers */}
          <div className="three-col" style={{ gap:12 }}>
            {[
              {id:'free',name:tc('landing.plan_free_name'),colour:'#8C7B6B',price:liveGeo?.pricing?.sym?(liveGeo.pricing.sym.length>1?`${liveGeo.pricing.sym} 0`:`${liveGeo.pricing.sym}0`):tc('landing.plan_free_price'),sub:tc('landing.plan_free_sub'),popular:false,
                features:[0,1,2,3,4,5,6].map(j=>tc('landing.plan_free_feat_'+j))},
              {id:'growth',name:tc('landing.plan_growth_name'),colour:T.acc,price:growthMonthly,sub:tc('landing.plan_growth_sub'),popular:true,
                features:[0,1,2,3,4,5,6].map(j=>tc('landing.plan_growth_feat_'+j,{pos:posPrice}))},
              {id:'business',name:tc('landing.plan_business_name'),colour:'#6366f1',price:bizMonthly,sub:tc('landing.plan_business_sub'),popular:false,
                features:[0,1,2,3,4,5,6].map(j=>tc('landing.plan_business_feat_'+j,{pos:posPrice}))},
            ].map((plan,i)=>(
              <div key={i} data-reveal style={{ borderRadius:16,border:plan.popular?`1px solid ${T.accBdr}`:`1px solid ${T.bd}`,background:plan.popular?`rgba(201,122,68,.03)`:T.card,padding:'20px 16px',position:'relative',display:'flex',flexDirection:'column',transitionDelay:`${i*60}ms` }}>
                {plan.popular&&(
                  <div style={{ position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',padding:'2px 12px',borderRadius:9999,background:T.acc,color:'#fff',fontSize:9,fontWeight:700,whiteSpace:'nowrap',textTransform:'uppercase',letterSpacing:'.06em' }}>
                    {tc('landing.plan_most_popular')}
                  </div>
                )}
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontFamily:'var(--font-instrument)',fontSize:17,color:plan.colour,marginBottom:9 }}>{plan.name}</div>
                  <div style={{ display:'flex',alignItems:'baseline',gap:4,marginBottom:4 }}>
                    <span style={{ fontFamily:'var(--font-instrument)',fontSize:30,color:T.tx }}>{plan.price}</span>
                    {plan.id!=='free'&&<span style={{ fontSize:11,color:T.tx3 }}>{plan.sub}{annual?tc('landing.pricing_annual_suffix'):''}</span>}
                  </div>
                </div>
                <div style={{ flex:1,marginBottom:14 }}>
                  {plan.features.map((f,j)=>(
                    <div key={j} style={{ display:'flex',gap:7,alignItems:'flex-start',fontSize:12,color:T.tx2,marginBottom:7 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={plan.colour} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0,marginTop:2 }}><path d="M20 6L9 17l-5-5"/></svg>{f}
                    </div>
                  ))}
                </div>
                <Link href={localePath('/signin?mode=signup', lang as Locale)} className="cta-btn" style={{ display:'block',padding:'10px',borderRadius:10,border:plan.popular?'none':`1px solid ${T.bd}`,background:plan.popular?T.acc:'transparent',color:plan.popular?'#fff':T.tx2,fontSize:12,fontWeight:600,textDecoration:'none',textAlign:'center' }}>
                  {plan.id==='free'?tc('landing.plan_free_cta'):plan.id==='growth'?tc('landing.plan_growth_cta'):tc('landing.plan_business_cta')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── JSON-LD in app/page.tsx; <details> keeps answers in DOM for crawlers ── */}
      <section style={{ maxWidth:620,margin:'0 auto',padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)' }}>
        <h2 data-reveal style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(24px,3.2vw,42px)',fontWeight:400,textAlign:'center',marginBottom:36,letterSpacing:'-.02em',color:T.tx }}>
          {tc('landing.faq_section_title')}
        </h2>
        {FAQS.map((faq,i)=>(
          <details key={i} data-reveal className="faq-item" style={{ borderBottom:`1px solid ${T.bd}` }} open={i===0?true:undefined}>
            <summary style={{ padding:'15px 10px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,cursor:'pointer',listStyle:'none' }}>
              <h3 style={{ fontSize:13,fontWeight:600,color:T.tx,margin:0 }}>{faq.q}</h3>
              <svg className="faq-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.tx3} strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0,transition:'transform 200ms' }}><path d="M6 9l6 6 6-6"/></svg>
            </summary>
            <p style={{ fontSize:13,color:T.tx2,lineHeight:1.75,margin:0,padding:'0 10px 16px' }}>{faq.a}</p>
          </details>
        ))}
      </section>

      {/* ── CLOSING CTA ───────────────────────────────────────────────── */}
      <section style={{ background:T.alt,borderTop:`1px solid ${T.bd}`,padding:'clamp(52px,6vw,72px) clamp(16px,4vw,40px)',textAlign:'center' }}>
        <div style={{ maxWidth:560,margin:'0 auto' }} data-reveal>
          <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,44px)',fontWeight:400,lineHeight:1.1,letterSpacing:'-.02em',color:T.tx,marginBottom:12 }}>
            {tc('landing.closing_title')}
          </h2>
          <p style={{ fontSize:16,color:T.tx2,lineHeight:1.7,marginBottom:24 }}>{tc('landing.closing_sub')}</p>
          <Link href={localePath('/signin?mode=signup', lang as Locale)} className="cta-btn" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'14px 32px',borderRadius:9999,background:T.acc,color:'#fff',fontSize:15,fontWeight:700,textDecoration:'none',boxShadow:'0 4px 24px rgba(201,122,68,.3)' }}>
            {tc('landing.closing_cta')}
          </Link>
          <p style={{ fontSize:12,color:T.tx3,marginTop:14 }}>{tc('landing.hero_trust_free')}</p>
          <p style={{ fontSize:12,color:T.tx3,marginTop:4 }}>{tc('landing.hero_trust_secure')}</p>

          {/* ── Lightweight lead capture — for visitors not ready to sign up yet ── */}
          <div style={{ marginTop:36,paddingTop:28,borderTop:`1px solid ${T.bd}` }}>
            <p style={{ fontSize:13,color:T.tx2,marginBottom:12 }}>{tc('landing.lead_capture_title')}</p>
            {leadStatus === 'sent' ? (
              <p style={{ fontSize:13,color:T.acc,fontWeight:600 }}>{tc('landing.lead_capture_success')}</p>
            ) : (
              <form onSubmit={submitLead} style={{ display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap' }}>
                <input
                  type="email"
                  required
                  value={leadEmail}
                  onChange={e=>setLeadEmail(e.target.value)}
                  placeholder={tc('landing.lead_capture_placeholder')}
                  style={{ padding:'11px 16px',borderRadius:9999,border:`1px solid ${T.bd}`,background:T.card,color:T.tx,fontSize:13,minWidth:220,flex:'1 1 220px',maxWidth:280 }}
                />
                <button
                  type="submit"
                  disabled={leadStatus==='sending'}
                  style={{ padding:'11px 22px',borderRadius:9999,border:'none',background:T.tx,color:'#fff',fontSize:13,fontWeight:700,cursor:leadStatus==='sending'?'default':'pointer',opacity:leadStatus==='sending'?0.6:1 }}
                >
                  {tc('landing.lead_capture_cta')}
                </button>
              </form>
            )}
            {leadStatus === 'error' && (
              <p style={{ fontSize:12,color:'#b45309',marginTop:8 }}>{tc('landing.lead_capture_error')}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ borderTop:`1px solid ${T.bd}`,background:T.card,padding:'48px clamp(16px,4vw,40px) 24px' }}>
        <div style={{ maxWidth:1180,margin:'0 auto' }}>
          <p style={{ fontSize:13,color:T.tx2,lineHeight:1.7,maxWidth:720,marginBottom:36 }}>{tc('landing.footer_intro')}</p>

          <nav aria-label="Footer navigation" className="footer-grid" style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'28px 24px',paddingBottom:32,borderBottom:`1px solid ${T.bd}` }}>
            {footerColumns.map(col => (
              <div key={col.title}>
                <div style={{ fontSize:11,fontWeight:700,color:T.tx,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:14 }}>{col.title}</div>
                <ul style={{ listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:11 }}>
                  {col.links.map(l => {
                    const isExternal = l.href.startsWith('mailto:') || l.href.startsWith('http')
                    return (
                      <li key={l.href}>
                        <a
                          href={isExternal ? l.href : localePath(l.href, lang as Locale)}
                          className="nav-link"
                          style={{ fontSize:13,color:T.tx2,textDecoration:'none',transition:'color 150ms',display:'inline-block',padding:'2px 0' }}
                          {...(l.href.startsWith('http') ? { target:'_blank', rel:'noopener noreferrer' } : {})}
                        >{l.label}</a>
                      </li>
                    )
                  })}
                  {col.seeAll && (
                    <li>
                      <a href={localePath(col.seeAll.href, lang as Locale)} className="nav-link" style={{ fontSize:13,color:T.acc,fontWeight:600,textDecoration:'none',display:'inline-block',padding:'2px 0' }}>{col.seeAll.label}</a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>

          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,paddingTop:20 }}>
            <div style={{ display:'flex',alignItems:'center',gap:7 }}>
              <div style={{ width:22,height:22,borderRadius:6,background:T.acc,display:'flex',alignItems:'center',justifyContent:'center' }}><Logo size={10}/></div>
              <span style={{ fontFamily:'var(--font-instrument)',fontSize:14,color:T.tx }}>AskBiz</span>
              <span style={{ fontSize:12,color:T.tx3 }}>· {tc('landing.footer_utauza')}</span>
              <span style={{ fontSize:12,color:T.tx3 }}>{tc('landing.footer_copyright')}</span>
            </div>
            <p style={{ fontSize:11,color:T.tx3,opacity:0.8,margin:0 }}>{tc('landing.footer_tagline')} · {tc('landing.footer_countries')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function LandingClient({ geo, lang = 'en' }: { geo: Geo | null; lang?: string }) {
  return (
    <LanguageProvider initialLang={lang as Lang}>
      <LandingInner geo={geo} />
    </LanguageProvider>
  )
}
