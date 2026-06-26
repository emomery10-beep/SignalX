'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { LanguageProvider, useLang } from '@/components/LanguageProvider'
import LanguageToggle from '@/components/LanguageToggle'
import type { Lang } from '@/lib/i18n'
import { COUNTRY_TO_LANG } from '@/lib/i18n'
import { localePath } from '@/lib/i18n-locale'
import type { Locale } from '@/lib/i18n-locale'

const SkullCanvas = dynamic(() => import('@/components/three/SkullCanvas'), {
  ssr: false,
  loading: () => null,
})

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
  { code:'AED', symbol:'د.إ' },{ code:'INR', symbol:'₹' },{ code:'AUD', symbol:'A$' },
  { code:'CAD', symbol:'C$' },{ code:'JPY', symbol:'¥' },{ code:'CHF', symbol:'Fr' },
] as const

type BizType = 'retail'|'factory'|'restaurant'|'cargo'|'repair'
const buildBizTypes = (tc: (k: string) => string) => [
  { id:'retail' as BizType,icon:'🛒',label:tc('landing.biz_retail_label'),priceLabel:tc('landing.biz_retail_price_label'),pricePh:'12.99',unitLabel:tc('landing.biz_retail_unit_label'),resultLabel:tc('landing.biz_retail_result_label'),
    fields:[{key:'a',label:tc('landing.biz_retail_field_a'),ph:'3.00'},{key:'b',label:tc('landing.biz_retail_field_b'),ph:'2.50'},{key:'c',label:tc('landing.biz_retail_field_c'),ph:'1.20'},{key:'d',label:tc('landing.biz_retail_field_d'),ph:'0.80'}]},
  { id:'factory' as BizType,icon:'🏭',label:tc('landing.biz_factory_label'),priceLabel:tc('landing.biz_factory_price_label'),pricePh:'24.00',unitLabel:tc('landing.biz_factory_unit_label'),resultLabel:tc('landing.biz_factory_result_label'),
    fields:[{key:'a',label:tc('landing.biz_factory_field_a'),ph:'6.00'},{key:'b',label:tc('landing.biz_factory_field_b'),ph:'4.50'},{key:'c',label:tc('landing.biz_factory_field_c'),ph:'2.00'},{key:'d',label:tc('landing.biz_factory_field_d'),ph:'1.50'}]},
  { id:'restaurant' as BizType,icon:'🍽️',label:tc('landing.biz_restaurant_label'),priceLabel:tc('landing.biz_restaurant_price_label'),pricePh:'16.50',unitLabel:tc('landing.biz_restaurant_unit_label'),resultLabel:tc('landing.biz_restaurant_result_label'),
    fields:[{key:'a',label:tc('landing.biz_restaurant_field_a'),ph:'4.20'},{key:'b',label:tc('landing.biz_restaurant_field_b'),ph:'2.00'},{key:'c',label:tc('landing.biz_restaurant_field_c'),ph:'0.50'},{key:'d',label:tc('landing.biz_restaurant_field_d'),ph:'8',isPct:true}]},
  { id:'cargo' as BizType,icon:'🚛',label:tc('landing.biz_cargo_label'),priceLabel:tc('landing.biz_cargo_price_label'),pricePh:'850',unitLabel:tc('landing.biz_cargo_unit_label'),resultLabel:tc('landing.biz_cargo_result_label'),
    fields:[{key:'a',label:tc('landing.biz_cargo_field_a'),ph:'180'},{key:'b',label:tc('landing.biz_cargo_field_b'),ph:'120'},{key:'c',label:tc('landing.biz_cargo_field_c'),ph:'45'},{key:'d',label:tc('landing.biz_cargo_field_d'),ph:'30'}]},
  { id:'repair' as BizType,icon:'🔧',label:tc('landing.biz_repair_label'),priceLabel:tc('landing.biz_repair_price_label'),pricePh:'89.99',unitLabel:tc('landing.biz_repair_unit_label'),resultLabel:tc('landing.biz_repair_result_label'),
    fields:[{key:'a',label:tc('landing.biz_repair_field_a'),ph:'25.00'},{key:'b',label:tc('landing.biz_repair_field_b'),ph:'1.5'},{key:'c',label:tc('landing.biz_repair_field_c'),ph:'20'},{key:'d',label:tc('landing.biz_repair_field_d'),ph:'0'}]},
]

// FAQS — kept in sync with the FAQPage JSON-LD schema in app/page.tsx (server-side)
// The server-side script handles Google rich results; <details>/<summary> ensures answers
// are always in the HTML for crawlers regardless of JS execution.
const buildFaqs = (tc: (key: string) => string) =>
  [0, 1, 2, 3, 4, 5, 6].map(i => ({ q: tc('landing.faq_' + i + '_q'), a: tc('landing.faq_' + i + '_a') }))

function Logo({size=12,color='white'}:{size?:number;color?:string}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="3" y="22" width="5" height="7" rx="1.5" fill={color} opacity=".5"/>
      <rect x="11" y="16" width="5" height="13" rx="1.5" fill={color} opacity=".75"/>
      <rect x="19" y="9" width="5" height="20" rx="1.5" fill={color}/>
    </svg>
  )
}

// ── Actual AskBiz "Ask" UI replica ────────────────────────────────────────────
function AskUIReplica({tc}:{tc:(k:string)=>string}) {
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'idle'|'typing'|'thinking'|'answer'>('idle')
  const question = tc('landing.ask_question')

  useEffect(() => {
    const start = setTimeout(() => setPhase('typing'), 1200)
    return () => clearTimeout(start)
  }, [])

  useEffect(() => {
    if (phase === 'typing') {
      if (typed.length < question.length) {
        const t = setTimeout(() => setTyped(question.slice(0, typed.length + 1)), 52)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('thinking'), 600)
        return () => clearTimeout(t)
      }
    }
    if (phase === 'thinking') {
      const t = setTimeout(() => setPhase('answer'), 1100)
      return () => clearTimeout(t)
    }
    if (phase === 'answer') {
      const t = setTimeout(() => { setPhase('idle'); setTyped('') }, 5000)
      return () => clearTimeout(t)
    }
    if (phase === 'idle' && typed === '') {
      const t = setTimeout(() => setPhase('typing'), 1500)
      return () => clearTimeout(t)
    }
  }, [phase, typed])

  return (
    <div style={{background:'#FAFAFA',borderRadius:16,border:'1px solid #E5E5E5',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,.09)',maxWidth:700,width:'100%',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {/* App chrome */}
      <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid #F0F0F0',background:'#fff'}}>
        <div className="rep-hide-sm" style={{width:210,borderRight:'1px solid #F0F0F0',height:48,display:'flex',alignItems:'center',padding:'0 12px',gap:10,background:'#FAFAFA',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:22,height:22,borderRadius:6,background:'#C97A44',display:'flex',alignItems:'center',justifyContent:'center'}}><Logo size={10}/></div>
            <span style={{fontSize:12,fontWeight:700,color:'#1A1410'}}>AskBiz</span>
          </div>
          <div style={{marginLeft:'auto',display:'flex',gap:6}}>
            {[tc('landing.ask_nav_ask'),tc('landing.ask_nav_business'),tc('landing.ask_nav_pos')].map((t,i)=>(
              <span key={t} style={{fontSize:9,fontWeight:i===0?700:400,color:i===0?'#C97A44':'#AAA',borderBottom:i===0?'1px solid #C97A44':'1px solid transparent',paddingBottom:1}}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{flex:1,padding:'0 16px',fontSize:11,fontWeight:600,color:'#1A1410'}}>{tc('landing.ask_new_conversation')}</div>
        <div className="rep-hide-sm" style={{display:'flex',gap:6,padding:'0 14px'}}>
          {[tc('landing.ask_btn_run_scenario'),tc('landing.ask_btn_cfo_view'),tc('landing.ask_btn_upload')].map(btn=>(
            <span key={btn} style={{fontSize:9,padding:'4px 8px',borderRadius:5,border:'1px solid #E5E5E5',color:'#888',cursor:'pointer'}}>{btn}</span>
          ))}
        </div>
      </div>
      <div style={{display:'flex',minHeight:350}}>
        {/* Left sidebar */}
        <div className="rep-hide-sm" style={{width:210,borderRight:'1px solid #F0F0F0',padding:'10px 8px',background:'#FAFAFA',flexShrink:0,display:'flex',flexDirection:'column',gap:3}}>
          <div style={{fontSize:8,fontWeight:700,color:'#BBB',padding:'3px 8px',letterSpacing:'.1em',textTransform:'uppercase'}}>{tc('landing.ask_quick_questions')}</div>
          {[tc('landing.ask_q_top_sellers'),tc('landing.ask_q_margin_by_product'),tc('landing.ask_q_revenue_vs_last_week'),tc('landing.ask_q_stock_running_low')].map((q,i)=>(
            <div key={i} style={{fontSize:9,padding:'5px 8px',borderRadius:5,color:'#666',cursor:'pointer',lineHeight:1.3}}>{q}</div>
          ))}
          <div style={{marginTop:6,fontSize:8,fontWeight:700,color:'#BBB',padding:'3px 8px',letterSpacing:'.1em',textTransform:'uppercase'}}>{tc('landing.ask_history')}</div>
          {[tc('landing.ask_hist_0'),tc('landing.ask_hist_1'),tc('landing.ask_q_top_sellers')].map((h,i)=>(
            <div key={i} style={{fontSize:8,padding:'4px 8px',borderRadius:5,color:'#999',cursor:'pointer',lineHeight:1.4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{h}</div>
          ))}
        </div>
        {/* Main chat area */}
        <div style={{flex:1,display:'flex',flexDirection:'column',background:'#fff'}}>
          {phase === 'idle' && typed === '' ? (
            <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px 28px',gap:14}}>
              <div style={{width:38,height:38,borderRadius:10,background:'#C97A44',display:'flex',alignItems:'center',justifyContent:'center'}}><Logo size={16}/></div>
              <div style={{textAlign:'center'}}>
                <p style={{fontSize:15,fontWeight:700,color:'#1A1410',margin:'0 0 3px'}}>{tc('landing.ask_empty_title')}</p>
                <p style={{fontSize:10,color:'#999',margin:0}}>{tc('landing.ask_empty_sub')}</p>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,width:'100%',maxWidth:380}}>
                {[
                  {icon:'💱',title:tc('landing.ask_card_currency_title'),sub:tc('landing.ask_card_currency_sub')},
                  {icon:'🏭',title:tc('landing.ask_card_suppliers_title'),sub:tc('landing.ask_card_suppliers_sub')},
                  {icon:'📦',title:tc('landing.ask_card_true_cost_title'),sub:tc('landing.ask_card_true_cost_sub')},
                  {icon:'🌍',title:tc('landing.ask_card_markets_title'),sub:tc('landing.ask_card_markets_sub')},
                ].map((card,i)=>(
                  <div key={i} style={{padding:'9px 11px',borderRadius:8,border:'1px solid #F0F0F0',background:'#FAFAFA',cursor:'pointer'}}>
                    <div style={{fontSize:15,marginBottom:3}}>{card.icon}</div>
                    <div style={{fontSize:10,fontWeight:700,color:'#1A1410',marginBottom:1}}>{card.title}</div>
                    <div style={{fontSize:9,color:'#AAA',lineHeight:1.3}}>{card.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{width:'100%',maxWidth:380,padding:'8px 11px',borderRadius:8,border:'1px dashed #E5E5E5',background:'#FAFAFA',display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
                <div>
                  <div style={{fontSize:10,fontWeight:600,color:'#1A1410',marginBottom:1}}>{tc('landing.ask_connect_title')}</div>
                  <div style={{fontSize:8,color:'#AAA'}}>{tc('landing.ask_connect_sub')}</div>
                </div>
                <span style={{fontSize:9,fontWeight:700,padding:'5px 9px',borderRadius:6,background:'#C97A44',color:'#fff',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>{tc('landing.ask_connect_btn')}</span>
              </div>
            </div>
          ) : (
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:10,padding:'18px 20px',overflowY:'auto'}}>
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <div style={{maxWidth:'78%',background:'#F4EFE8',border:'1px solid #E8DDD4',borderRadius:'12px 12px 3px 12px',padding:'9px 13px',fontSize:12,color:'#1A1410',lineHeight:1.5}}>
                  {typed}
                  {phase==='typing'&&<span style={{display:'inline-block',width:2,height:13,background:'#C97A44',marginLeft:2,verticalAlign:'middle',animation:'blink .9s infinite'}}/>}
                </div>
              </div>
              {(phase==='thinking'||phase==='answer')&&(
                <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                  <div style={{width:24,height:24,borderRadius:6,background:'#C97A44',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Logo size={10}/>
                  </div>
                  {phase==='thinking' ? (
                    <div style={{padding:'9px 12px',background:'#FAFAFA',border:'1px solid #F0F0F0',borderRadius:'3px 12px 12px 12px',display:'flex',gap:4,alignItems:'center'}}>
                      {[0,160,320].map(d=>(
                        <span key={d} style={{width:6,height:6,borderRadius:'50%',background:'#CCC',display:'block',animation:`tdot 1.2s infinite ${d}ms`}}/>
                      ))}
                    </div>
                  ):(
                    <div style={{flex:1}}>
                      <div style={{padding:'10px 13px',background:'#FAFAFA',border:'1px solid #F0F0F0',borderRadius:'3px 12px 12px 12px',fontSize:12,lineHeight:1.7,color:'#1A1410',marginBottom:7}}>
                        <strong>Wireless Earbuds Pro</strong> {tc('landing.ask_answer_main_a')} <strong style={{color:'#C97A44'}}>{tc('landing.ask_answer_main_b')}</strong>{tc('landing.ask_answer_main_c')}<br/>
                        <span style={{color:'#888',fontSize:11}}>⚠ Ginger Powder {tc('landing.ask_answer_warn_a')}<span style={{color:'#dc2626',fontWeight:700}}>{tc('landing.ask_answer_warn_b')}</span>{tc('landing.ask_answer_warn_c')}</span>
                      </div>
                      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                        {[tc('landing.ask_chip_margin'),tc('landing.ask_chip_week'),tc('landing.ask_chip_units')].map(chip=>(
                          <span key={chip} style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:9999,background:'rgba(34,197,94,.08)',color:'#16a34a',border:'1px solid rgba(34,197,94,.2)'}}>{chip}</span>
                        ))}
                        <span style={{fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:9999,background:'rgba(220,38,38,.08)',color:'#dc2626',border:'1px solid rgba(220,38,38,.2)'}}>{tc('landing.ask_chip_ginger')}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Input */}
          <div style={{borderTop:'1px solid #F0F0F0',padding:'9px 14px',display:'flex',alignItems:'center',gap:7,background:'#fff'}}>
            <div style={{flex:1,border:'1px solid #E5E5E5',borderRadius:8,padding:'7px 11px',fontSize:11,color:'#CCC',background:'#FAFAFA'}}>
              {phase==='typing'?typed:tc('landing.ask_input_placeholder')}
            </div>
            <div style={{width:26,height:26,borderRadius:6,background:'#C97A44',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Monitor / Intelligence UI replica ─────────────────────────────────────────
function MonitorUIReplica({tc}:{tc:(k:string)=>string}) {
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
        <div style={{display:'flex',overflowX:'auto',flex:1,scrollbarWidth:'none'}} className="pos-tabs">
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
            {[{icon:'🚨',title:tc('landing.mon_active_alerts'),value:tc('landing.mon_active_alerts_value'),color:'#fb923c'},{icon:'📈',title:tc('landing.mon_30day_trend'),value:'▲ 34%',color:'#16a34a'}].map((c,i)=>(
              <div key={i} style={{padding:'11px 13px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0'}}>
                <div style={{fontSize:14,marginBottom:4}}>{c.icon}</div>
                <div style={{fontSize:8,color:'#AAA',marginBottom:1}}>{c.title}</div>
                <div style={{fontSize:11,fontWeight:700,color:c.color}}>{c.value}</div>
              </div>
            ))}
          </div>
          <div style={{padding:'10px 12px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',marginBottom:7}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
              <span style={{fontSize:10}}>⏰</span><span style={{fontSize:9,fontWeight:700,color:'#1A1410'}}>{tc('landing.mon_daily_brief')}</span>
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
            {[{label:tc('landing.mon_cfo_revenue'),value:'£3,247',sub:tc('landing.mon_cfo_revenue_sub'),c:'#16a34a'},{label:tc('landing.mon_cfo_gross_profit'),value:'£1,109',sub:tc('landing.mon_cfo_gross_profit_sub'),c:'#C97A44'},{label:tc('landing.mon_cfo_net_margin'),value:'26.1%',sub:tc('landing.mon_cfo_net_margin_sub'),c:'#6366f1'}].map((k,i)=>(
              <div key={i} style={{padding:'10px 11px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0'}}>
                <div style={{fontSize:8,color:'#AAA',marginBottom:3}}>{k.label}</div>
                <div style={{fontSize:16,fontWeight:800,color:k.c,lineHeight:1}}>{k.value}</div>
                <div style={{fontSize:7,color:'#AAA',marginTop:3}}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',overflow:'hidden',marginBottom:10}}>
            <div style={{padding:'8px 12px',background:'#FAFAFA',borderBottom:'1px solid #F5F5F5',fontSize:8,fontWeight:700,color:'#AAA',letterSpacing:'.06em'}}>{tc('landing.mon_pnl_summary')}</div>
            {[{label:tc('landing.pnl_revenue'),value:'£3,247',indent:false},{label:tc('landing.pnl_cost_of_goods'),value:'−£2,138',indent:true,color:'#ef4444'},{label:tc('landing.pnl_gross_profit'),value:'£1,109',indent:false,bold:true,color:'#16a34a'},{label:tc('landing.pnl_operating_expenses'),value:'−£260',indent:true,color:'#ef4444'},{label:tc('landing.pnl_net_profit'),value:'£849',indent:false,bold:true,color:'#16a34a'}].map((r,i)=>(
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
            {sev:tc('landing.mon_sev_high'),icon:'📉',title:tc('landing.mon_alert_0_title'),body:tc('landing.mon_alert_0_body'),color:'#ef4444',bg:'rgba(239,68,68,.05)',time:tc('landing.mon_time_2h')},
            {sev:tc('landing.mon_sev_high'),icon:'📦',title:tc('landing.mon_alert_1_title'),body:tc('landing.mon_alert_1_body'),color:'#ef4444',bg:'rgba(239,68,68,.05)',time:tc('landing.mon_time_4h')},
            {sev:tc('landing.mon_sev_med'),icon:'📱',title:tc('landing.mon_alert_2_title'),body:tc('landing.mon_alert_2_body'),color:'#f59e0b',bg:'rgba(245,158,11,.04)',time:tc('landing.mon_time_yesterday')},
            {sev:tc('landing.mon_sev_low'),icon:'🔍',title:tc('landing.mon_alert_3_title'),body:tc('landing.mon_alert_3_body'),color:'#6b7280',bg:'rgba(107,114,128,.04)',time:tc('landing.mon_time_2d')},
          ].map((a,i)=>(
            <div key={i} style={{padding:'10px 12px',borderRadius:9,border:`1px solid ${a.color}22`,background:a.bg,marginBottom:7}}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:5}}>
                <span style={{fontSize:12}}>{a.icon}</span>
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
            {ref:'#UK-4421',item:'Wireless Earbuds Pro ×10',carrier:'Royal Mail',status:tc('landing.mon_ships_status_in_transit'),eta:tc('landing.mon_ships_eta_tomorrow'),color:'#6366f1'},
            {ref:'#UK-4420',item:'USB Hub ×50',carrier:'DPD',status:tc('landing.mon_ships_status_delivered'),eta:`${tc('landing.mon_ships_eta_today')} 10:31`,color:'#16a34a'},
            {ref:'#UK-4419',item:'Phone Stand ×25',carrier:'Hermes',status:tc('landing.mon_ships_status_delayed'),eta:tc('landing.mon_ships_eta_unknown'),color:'#ef4444'},
            {ref:'#UK-4418',item:'Cable Kit ×100',carrier:'Royal Mail',status:tc('landing.mon_ships_status_in_transit'),eta:'Wed 18 Jun',color:'#6366f1'},
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
            {icon:'🏭',category:tc('landing.mon_mem_cat_suppliers'),fact:tc('landing.mon_mem_fact_suppliers')},
            {icon:'📦',category:tc('landing.mon_mem_cat_products'),fact:tc('landing.mon_mem_fact_products')},
            {icon:'🎯',category:tc('landing.mon_mem_cat_goals'),fact:tc('landing.mon_mem_fact_goals')},
            {icon:'📣',category:tc('landing.mon_mem_cat_channels'),fact:tc('landing.mon_mem_fact_channels')},
            {icon:'💸',category:tc('landing.mon_mem_cat_costs'),fact:tc('landing.mon_mem_fact_costs')},
          ].map((m,i)=>(
            <div key={i} style={{display:'flex',gap:9,padding:'9px 0',borderTop:i>0?'1px solid #F5F5F5':'none'}}>
              <div style={{width:26,height:26,borderRadius:6,background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0}}>{m.icon}</div>
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
      <div style={{maxHeight:300,overflowY:'auto'}}>
        {[
          {cat:tc('landing.src_cat_ecommerce'),items:[
            {icon:'🛒',name:'Shopify',desc:tc('landing.src_desc_shopify'),status:'connect'},
            {icon:'📦',name:'Amazon FBA',desc:tc('landing.src_desc_amazon'),status:'connect'},
            {icon:'🛍️',name:'eBay Store',desc:tc('landing.src_desc_ebay'),status:'connected'},
            {icon:'🧵',name:'Etsy',desc:tc('landing.src_desc_etsy'),status:'connect'},
            {icon:'📱',name:'TikTok Shop',desc:tc('landing.src_desc_tiktok'),status:'connect'},
          ]},
          {cat:tc('landing.src_cat_accounting'),items:[
            {icon:'📒',name:'QuickBooks',desc:tc('landing.src_desc_quickbooks'),status:'connect'},
            {icon:'🔵',name:'Xero',desc:tc('landing.src_desc_xero'),status:'connect'},
            {icon:'💳',name:'Stripe',desc:tc('landing.src_desc_stripe'),status:'connected'},
          ]},
        ].map(section=>(
          <div key={section.cat}>
            <div style={{padding:'7px 18px 3px',fontSize:8,fontWeight:700,color:'#BBB',letterSpacing:'.1em',background:'#FAFAFA'}}>{section.cat}</div>
            {section.items.map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 18px',borderTop:'1px solid #F5F5F5',background:item.status==='connected'?'rgba(34,197,94,.03)':'#fff'}}>
                <div style={{width:26,height:26,borderRadius:6,background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,flexShrink:0}}>{item.icon}</div>
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

// ── PoS Register UI replica ───────────────────────────────────────────────────
// ── PoS full tabbed showcase ──────────────────────────────────────────────────
function PosShowcase({tc}:{tc:(k:string)=>string}) {
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
              {label:tc('landing.pos_kpi_revenue'),value:'£3,247',sub:tc('landing.pos_kpi_vs_prev_up34'),color:'#16a34a'},
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
              {label:tc('landing.pos_kpi_gross_profit'),value:'£1,109',color:'#16a34a'},
              {label:tc('landing.pos_kpi_margin'),value:'34.2%',color:'#C97A44'},
              {label:tc('landing.pos_kpi_avg_sale'),value:'£22.71',color:'#1A1410'},
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
            {[{name:'Phidisia',role:tc('landing.pos_role_cashier_retail'),sales:'KSh 1.8K',tx:6},{name:'James',role:tc('landing.pos_role_inventory_retail'),sales:'KSh 480',tx:2}].map((s,i)=>(
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
            {[{icon:'🍽️',label:tc('landing.pos_sector_restaurant')},{icon:'🔧',label:tc('landing.pos_sector_repair')},{icon:'💈',label:tc('landing.pos_sector_salon')},{icon:'📦',label:tc('landing.pos_sector_retail'),active:true},{icon:'🏭',label:tc('landing.pos_sector_factory')},{icon:'🚛',label:tc('landing.pos_sector_logistics')}].map(s=>(
              <span key={s.label} style={{fontSize:9,padding:'4px 10px',borderRadius:5,border:`1px solid ${s.active?'#C97A44':'#E5E5E5'}`,background:s.active?'rgba(201,122,68,.08)':'#fff',color:s.active?'#C97A44':'#888',cursor:'pointer',fontWeight:s.active?700:400,display:'flex',alignItems:'center',gap:3}}>
                <span>{s.icon}</span>{s.label}
              </span>
            ))}
          </div>
          <div style={{fontSize:11,fontWeight:700,color:'#1A1410',marginBottom:3}}>{tc('landing.pos_ops_header')}</div>
          <div style={{fontSize:9,color:'#AAA',marginBottom:12}}>{tc('landing.pos_ops_sub')}</div>
          <div className="rep-5col" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:7}}>
            {[
              {icon:'📦',label:tc('landing.pos_mod_inventory'),desc:tc('landing.pos_mod_inventory_desc'),badge:'37',bdgColor:'#ef4444'},
              {icon:'🛒',label:tc('landing.pos_mod_sales'),desc:tc('landing.pos_mod_sales_desc')},
              {icon:'👥',label:tc('landing.pos_mod_customers'),desc:tc('landing.pos_mod_customers_desc')},
              {icon:'🏷️',label:tc('landing.pos_mod_promotions'),desc:tc('landing.pos_mod_promotions_desc')},
              {icon:'⭐',label:tc('landing.pos_mod_loyalty'),desc:tc('landing.pos_mod_loyalty_desc')},
              {icon:'↩️',label:tc('landing.pos_mod_returns'),desc:tc('landing.pos_mod_returns_desc')},
              {icon:'📊',label:tc('landing.pos_mod_reports'),desc:tc('landing.pos_mod_reports_desc')},
              {icon:'📋',label:tc('landing.pos_mod_purchase_orders'),desc:tc('landing.pos_mod_purchase_orders_desc'),soon:true},
              {icon:'🎁',label:tc('landing.pos_mod_gift_cards'),desc:tc('landing.pos_mod_gift_cards_desc'),soon:true},
              {icon:'👤',label:tc('landing.pos_mod_staff'),desc:tc('landing.pos_mod_staff_desc')},
              {icon:'🏪',label:tc('landing.pos_mod_branches'),desc:tc('landing.pos_mod_branches_desc')},
              {icon:'🗺️',label:tc('landing.pos_mod_map'),desc:tc('landing.pos_mod_map_desc')},
              {icon:'🔗',label:tc('landing.pos_mod_integrations'),desc:tc('landing.pos_mod_integrations_desc')},
              {icon:'🔍',label:tc('landing.pos_mod_audit'),desc:tc('landing.pos_mod_audit_desc')},
            ].map((m,i)=>(
              <div key={i} style={{padding:'10px 10px',borderRadius:9,border:'1px solid #F0F0F0',background:'#fff',cursor:'pointer',position:'relative'}}>
                {m.badge&&<span style={{position:'absolute',top:6,right:6,fontSize:7,fontWeight:700,background:'#ef4444',color:'#fff',borderRadius:9999,padding:'1px 5px'}}>{m.badge}</span>}
                {m.soon&&<span style={{position:'absolute',top:6,right:6,fontSize:7,fontWeight:700,background:'#F0F0F0',color:'#888',borderRadius:9999,padding:'1px 5px'}}>{tc('landing.pos_soon')}</span>}
                <div style={{fontSize:16,marginBottom:5}}>{m.icon}</div>
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
                  {i===0?'💳':'💜'}
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
            {[{label:tc('landing.pos_pay_stat_received'),value:'6',sub:tc('landing.pos_pay_stat_payments')},{label:tc('landing.pos_pay_stat_total'),value:'KSh 2.0K',sub:tc('landing.pos_pay_stat_collected')},{label:tc('landing.pos_pay_stat_avg'),value:'KSh 337',sub:tc('landing.pos_pay_stat_per_payment')}].map((k,i)=>(
              <div key={i} style={{padding:'8px 10px',background:'#fff',borderRadius:8,border:'1px solid #F0F0F0',textAlign:'center'}}>
                <div style={{fontSize:7,color:'#AAA',letterSpacing:'.08em',marginBottom:3}}>{k.label}</div>
                <div style={{fontSize:13,fontWeight:800,color:'#16a34a'}}>{k.value}</div>
                <div style={{fontSize:7,color:'#AAA'}}>{k.sub}</div>
              </div>
            ))}
          </div>
          {[
            {name:'+254722173771',method:`Mpesa · paystack`,time:tc('landing.pos_pay_time_17h'),ref:'#6255025614',amount:'KSh 1.8K'},
            {name:tc('landing.pos_pay_customer'),method:`${tc('landing.pos_pay_method_card')} · stripe`,time:tc('landing.pos_pay_time_3d'),ref:'',amount:'KSh 100'},
            {name:'+254713826241',method:`Mpesa · paystack`,time:tc('landing.pos_pay_time_5d'),ref:'#6237054796',amount:'KSh 24'},
          ].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'8px 0',borderTop:'1px solid #F5F5F5'}}>
              <div style={{width:22,height:22,borderRadius:5,background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,flexShrink:0}}>📱</div>
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
              {[{label:tc('landing.pos_pay_rec_failed'),value:'0',sub:'KSh 0',color:'#ef4444'},{label:tc('landing.pos_pay_rec_recovered'),value:'0',sub:'KSh 0',color:'#16a34a'},{label:tc('landing.pos_pay_rec_rate'),value:'0%',sub:tc('landing.pos_pay_rec_rate_sub'),color:'#888'},{label:tc('landing.pos_pay_rec_pending'),value:'0',sub:tc('landing.pos_pay_rec_pending_sub'),color:'#f59e0b'}].map((k,i)=>(
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
              <div style={{width:32,height:32,borderRadius:7,background:'rgba(201,122,68,.08)',border:'1px solid rgba(201,122,68,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>🏪</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2}}>
                  <span style={{fontSize:11,fontWeight:700,color:'#1A1410'}}>Town Branch</span>
                  <span style={{fontSize:8,padding:'1px 6px',borderRadius:9999,background:'rgba(34,197,94,.08)',color:'#16a34a',border:'1px solid rgba(34,197,94,.2)',fontWeight:600}}>{tc('landing.pos_branch_active')}</span>
                  <span style={{fontSize:8,padding:'1px 6px',borderRadius:9999,background:'rgba(201,122,68,.08)',color:'#C97A44',fontWeight:600}}>{tc('landing.pos_branch_main')}</span>
                </div>
                <div style={{fontSize:9,color:'#AAA'}}>Nairobi, Kenya · {tc('landing.pos_branch_meta')}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#16a34a'}}>KSh 2.0K</div>
                <div style={{fontSize:8,color:'#AAA'}}>{tc('landing.pos_branch_revenue_today')}</div>
              </div>
            </div>
            <div style={{marginTop:10,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
              {[{label:tc('landing.pos_branch_sales_today'),value:'6'},{label:tc('landing.pos_branch_low_stock'),value:'37',color:'#ef4444'},{label:tc('landing.pos_branch_avg_sale'),value:'KSh 337'}].map((s,i)=>(
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
                <div style={{transform:'rotate(45deg)',fontSize:12}}>🏪</div>
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
            {icon:'🛒',action:tc('landing.pos_audit_0_action'),detail:tc('landing.pos_audit_0_detail'),user:'Phidisia',time:'10:41 AM',branch:'Town'},
            {icon:'📦',action:tc('landing.pos_audit_1_action'),detail:tc('landing.pos_audit_1_detail'),user:'James',time:'9:15 AM',branch:'Town'},
            {icon:'🛒',action:tc('landing.pos_audit_0_action'),detail:tc('landing.pos_audit_2_detail'),user:'Phidisia',time:'9:02 AM',branch:'Town'},
            {icon:'↩️',action:tc('landing.pos_audit_3_action'),detail:tc('landing.pos_audit_3_detail'),user:'Phidisia',time:'8:47 AM',branch:'Town'},
            {icon:'👤',action:tc('landing.pos_audit_4_action'),detail:tc('landing.pos_audit_4_detail'),user:tc('landing.pos_audit_user_system'),time:'8:30 AM',branch:'Town'},
            {icon:'⚙️',action:tc('landing.pos_audit_5_action'),detail:tc('landing.pos_audit_5_detail'),user:tc('landing.pos_audit_user_admin'),time:tc('landing.pos_audit_time_yesterday'),branch:'Town'},
          ].map((e,i)=>(
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:9,padding:'8px 0',borderTop:i>0?'1px solid #F5F5F5':'none'}}>
              <div style={{width:24,height:24,borderRadius:6,background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,flexShrink:0,marginTop:1}}>{e.icon}</div>
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
          <div style={{fontSize:11,fontWeight:700,color:'#1A1410',marginBottom:3}}>🚛 {tc('landing.pos_log_header')}</div>
          <div style={{fontSize:9,color:'#AAA',marginBottom:14}}>{tc('landing.pos_log_sub')}</div>
          <div className="rep-3col" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
            {[{label:tc('landing.pos_log_active_deliveries'),value:'0',icon:'🚛',color:'#C97A44'},{label:tc('landing.pos_log_pending_pos'),value:'0',icon:'📋',color:'#6366f1'},{label:tc('landing.pos_log_stock_transfers'),value:'0',icon:'↔️',color:'#16a34a'}].map((k,i)=>(
              <div key={i} style={{padding:'10px 12px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',textAlign:'center'}}>
                <div style={{fontSize:18,marginBottom:4}}>{k.icon}</div>
                <div style={{fontSize:16,fontWeight:800,color:k.color,marginBottom:2}}>{k.value}</div>
                <div style={{fontSize:8,color:'#AAA'}}>{k.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[
              {icon:'📋',title:tc('landing.pos_log_po_title'),desc:tc('landing.pos_log_po_desc'),badge:tc('landing.pos_soon')},
              {icon:'↔️',title:tc('landing.pos_log_transfers_title'),desc:tc('landing.pos_log_transfers_desc'),badge:tc('landing.pos_soon')},
              {icon:'🚛',title:tc('landing.pos_log_delivery_title'),desc:tc('landing.pos_log_delivery_desc'),badge:tc('landing.pos_soon')},
              {icon:'📍',title:tc('landing.pos_log_driver_title'),desc:tc('landing.pos_log_driver_desc'),badge:tc('landing.pos_soon')},
            ].map((m,i)=>(
              <div key={i} style={{padding:'12px 14px',background:'#fff',borderRadius:9,border:'1px solid #F0F0F0',position:'relative'}}>
                <span style={{position:'absolute',top:8,right:8,fontSize:7,fontWeight:700,background:'#F0F0F0',color:'#888',borderRadius:9999,padding:'1px 6px'}}>{m.badge}</span>
                <div style={{fontSize:18,marginBottom:6}}>{m.icon}</div>
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

function PosUIReplica({tc}:{tc:(k:string)=>string}) {
  return (
    <div style={{background:'#FAFAFA',borderRadius:16,border:'1px solid #E5E5E5',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,.09)',width:'100%',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid #F0F0F0',background:'#fff',padding:'9px 14px',gap:7,overflowX:'auto'}}>
        {[tc('landing.posui_tab_register'),tc('landing.posui_tab_inventory'),tc('landing.posui_tab_shifts'),tc('landing.posui_tab_reports'),tc('landing.posui_tab_customers'),tc('landing.posui_tab_settings')].map((tab,i)=>(
          <span key={tab} style={{fontSize:9,fontWeight:i===0?700:400,color:i===0?'#C97A44':'#AAA',padding:'3px 9px',borderRadius:5,background:i===0?'rgba(201,122,68,.08)':'transparent',whiteSpace:'nowrap',cursor:'pointer',border:i===0?'1px solid rgba(201,122,68,.2)':'1px solid transparent'}}>{tab}</span>
        ))}
        <span style={{marginLeft:'auto',fontSize:8,padding:'3px 8px',borderRadius:5,background:'rgba(34,197,94,.08)',color:'#16a34a',fontWeight:700,border:'1px solid rgba(34,197,94,.2)',flexShrink:0}}>● {tc('landing.posui_open')}</span>
      </div>
      <div className="rep-split" style={{display:'grid',gridTemplateColumns:'1.15fr 1fr',minHeight:320}}>
        {/* Left: basket */}
        <div style={{padding:'12px 14px',borderRight:'1px solid #F0F0F0',display:'flex',flexDirection:'column',gap:7,background:'#fff'}}>
          <div style={{display:'flex',gap:5,marginBottom:2}}>
            <div style={{flex:1,display:'flex',alignItems:'center',gap:5,padding:'6px 9px',borderRadius:6,border:'1px solid #E5E5E5',background:'#FAFAFA'}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2"><rect x="3" y="3" width="4" height="4"/><rect x="17" y="3" width="4" height="4"/><rect x="3" y="17" width="4" height="4"/><path d="M7 3h8M3 7v2M21 7v2M7 21h4M15 21h2M21 17v2M15 15h6v6"/></svg>
              <span style={{fontSize:9,color:'#CCC'}}>{tc('landing.pos_scan_placeholder')}</span>
            </div>
            <div style={{width:28,height:28,borderRadius:6,background:'#C97A44',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>
              <span style={{fontSize:12}}>📷</span>
            </div>
          </div>
          <div style={{fontSize:9,fontWeight:700,color:'#1A1410',marginBottom:1}}>{tc('landing.posui_current_sale')}</div>
          {[
            {name:'Wireless Earbuds Pro',sku:'SKU-0041',qty:2,price:'£24.99',margin:'34.2%'},
            {name:'Phone Case (Black)',sku:'SKU-0198',qty:1,price:'£8.50',margin:'28.7%'},
            {name:'USB-C Cable 2m',sku:'SKU-0072',qty:3,price:'£6.99',margin:'41.0%'},
          ].map((item,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:7,padding:'7px 9px',background:'#FAFAFA',borderRadius:7,border:'1px solid #F0F0F0'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:9,fontWeight:600,color:'#1A1410',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.name}</div>
                <div style={{fontSize:7,color:'#CCC'}}>{item.sku} · {tc('landing.posui_qty')}: {item.qty}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:10,fontWeight:700,color:'#1A1410'}}>{item.price}</div>
                <div style={{fontSize:7,color:'#16a34a',fontWeight:600}}>▲ {item.margin}</div>
              </div>
            </div>
          ))}
          {/* AI nudge */}
          <div style={{padding:'7px 9px',borderRadius:7,background:'rgba(201,122,68,.06)',border:'1px solid rgba(201,122,68,.18)',display:'flex',gap:6,alignItems:'flex-start'}}>
            <span style={{fontSize:10,flexShrink:0}}>💡</span>
            <p style={{fontSize:8,color:'#7B4C20',margin:0,lineHeight:1.4}}>{tc('landing.posui_nudge')}</p>
          </div>
          <div style={{marginTop:'auto',borderTop:'1px solid #F0F0F0',paddingTop:8}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:9,color:'#AAA',marginBottom:3}}><span>{tc('landing.posui_subtotal')}</span><span>£64.46</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:9,color:'#AAA',marginBottom:6}}><span>{tc('landing.posui_vat')}</span><span>£12.89</span></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:800,color:'#1A1410'}}><span>{tc('landing.posui_total')}</span><span style={{color:'#C97A44'}}>£77.35</span></div>
          </div>
        </div>
        {/* Right: payment */}
        <div style={{padding:'12px 14px',display:'flex',flexDirection:'column',gap:7,background:'#FAFAFA'}}>
          <div style={{fontSize:9,fontWeight:700,color:'#1A1410',marginBottom:1}}>{tc('landing.posui_payment')}</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
            {[{label:tc('landing.posui_pay_card'),icon:'💳',active:true},{label:tc('landing.posui_pay_cash'),icon:'💵',active:false},{label:tc('landing.posui_pay_mobile'),icon:'📱',active:false},{label:tc('landing.posui_pay_split'),icon:'⚡',active:false}].map((m,i)=>(
              <div key={i} style={{padding:'7px 5px',borderRadius:7,border:`1px solid ${m.active?'rgba(201,122,68,.3)':'#E5E5E5'}`,background:m.active?'rgba(201,122,68,.06)':'#fff',textAlign:'center',cursor:'pointer'}}>
                <div style={{fontSize:13,marginBottom:2}}>{m.icon}</div>
                <div style={{fontSize:8,fontWeight:600,color:m.active?'#C97A44':'#AAA'}}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:4,flex:1}}>
            {['1','2','3','4','5','6','7','8','9','⌫','0','✓'].map((k)=>(
              <div key={k} style={{display:'flex',alignItems:'center',justifyContent:'center',borderRadius:6,background:k==='✓'?'#C97A44':'#fff',border:`1px solid ${k==='✓'?'#C97A44':'#E5E5E5'}`,height:30,fontSize:k==='✓'?13:12,fontWeight:700,color:k==='✓'?'#fff':'#1A1410',cursor:'pointer'}}>
                {k}
              </div>
            ))}
          </div>
          <div style={{padding:'11px',borderRadius:9,background:'#C97A44',color:'#fff',textAlign:'center',fontWeight:700,fontSize:12,cursor:'pointer'}}>
            {tc('landing.posui_charge')} £77.35
          </div>
          <div style={{textAlign:'center',fontSize:8,color:'#AAA'}}>{tc('landing.posui_receipt_options')}</div>
        </div>
      </div>
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

// ── Calculator ────────────────────────────────────────────────────────────────
function MiniCalcWidget({tc,lang}:{tc:(k:string)=>string;lang:Locale}) {
  const BIZ_TYPES = buildBizTypes(tc)
  const [mode,setMode] = useState<'margin'|'industry'>('margin')
  const [biz,setBiz] = useState<BizType>('retail')
  const [cur,setCur] = useState(0)
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
                <button key={c.code} onClick={()=>{setCur(i);setShowCur(false)}}
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
              <span>{b.icon}</span>{b.label}
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
function NavDropdown({ label, items, lang }: { label: string; items: DropGroup[]; lang: Locale }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ fontSize:12,color:T.tx2,background:'none',border:'none',cursor:'pointer',padding:'0 9px',height:56,display:'flex',alignItems:'center',gap:4,fontFamily:'inherit',transition:'color 150ms',whiteSpace:'nowrap' }}
        className="nav-link"
      >
        {label}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform:open?'rotate(180deg)':'none',transition:'transform 180ms' }}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div style={{ position:'absolute',top:'calc(100% + 4px)',left:'50%',transform:'translateX(-50%)',background:T.card,borderRadius:14,boxShadow:'0 8px 40px rgba(0,0,0,.12)',border:`1px solid ${T.bd}`,zIndex:100,padding:'12px 8px',display:'flex',gap:0,minWidth:520 }}>
          {items.map((grp, gi) => (
            <div key={gi} style={{ flex:1,padding:'0 8px' }}>
              <div style={{ fontSize:9,fontWeight:700,color:T.acc,letterSpacing:'.12em',textTransform:'uppercase',padding:'4px 8px 8px' }}>{grp.group}</div>
              {grp.links.map(lnk => (
                <Link key={lnk.href} href={localePath(lnk.href, lang)} onClick={() => setOpen(false)}
                  style={{ display:'block',padding:'7px 8px',borderRadius:8,textDecoration:'none' }}
                  className="nav-drop-item"
                >
                  <div style={{ fontSize:12,fontWeight:600,color:T.tx,marginBottom:1 }}>{lnk.label}</div>
                  <div style={{ fontSize:10,color:T.tx3,lineHeight:1.3 }}>{lnk.desc}</div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function LandingInner({ geo }: { geo: Geo | null }) {
  const { lang, setLang, tc } = useLang()
  const FAQS = buildFaqs(tc)
  const [scrollY, setScrollY] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [menuOpen, setMenuOpen] = useState(false)
  const [annual, setAnnual] = useState(false)
  // FAQ state removed — using native <details> for SEO
  const [liveGeo, setLiveGeo] = useState<Geo | null>(geo)

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

  return (
    <div style={{ background:T.bg, color:T.tx, fontFamily:'var(--font-jakarta, Plus Jakarta Sans, system-ui)', overflowX:'hidden', direction:isRTL?'rtl':'ltr' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes tdot{0%,80%,100%{opacity:.25;transform:scale(.7)}40%{opacity:1;transform:scale(1)}}
        [data-reveal]{opacity:0;transform:translateY(18px);transition:opacity 600ms cubic-bezier(0.22,1,0.36,1),transform 600ms cubic-bezier(0.22,1,0.36,1)}
        [data-reveal].revealed{opacity:1;transform:translateY(0)}
        [data-reveal-delay="1"].revealed{transition-delay:80ms}
        [data-reveal-delay="2"].revealed{transition-delay:160ms}
        .cta-btn{transition:filter 100ms,box-shadow 200ms,transform 100ms}
        .cta-btn:hover{filter:brightness(1.08);box-shadow:0 8px 28px rgba(201,122,68,.38)!important}
        .cta-btn:active{transform:scale(0.97)}
        .nav-link:hover{color:${T.tx}!important}
        .nav-drop-item:hover{background:${T.alt}!important}
        @media(max-width:768px){
          .nav-links{display:none!important}.nav-mobile-btn{display:flex!important}
          .hero-ctas{flex-direction:column!important}
          .hero-ctas a{width:100%!important;text-align:center!important;justify-content:center!important}
        }
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
        @media(prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none}*{animation:none!important}}
      ` }}/>

      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <nav aria-label="Primary navigation" style={{ position:'sticky',top:0,zIndex:50,background:T.nav,backdropFilter:'blur(20px)',borderBottom:`1px solid ${T.bd}`,padding:'0 clamp(16px,3vw,32px)',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8 }}>
        <Link href={localePath('/', lang as Locale)} style={{ display:'flex',alignItems:'center',gap:8,textDecoration:'none',color:T.tx,flexShrink:0 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:T.acc,display:'flex',alignItems:'center',justifyContent:'center' }}><Logo size={13}/></div>
          <span style={{ fontFamily:'var(--font-instrument)',fontSize:18,fontWeight:400,letterSpacing:'-.01em' }}>AskBiz</span>
        </Link>

        {/* Desktop nav */}
        <div className="nav-links" style={{ display:'flex',alignItems:'center',gap:0,flex:1,justifyContent:'center' }}>
          {/* Product links */}
          {[
            ['/free-tools',tc('landing.nav_free_tools')],
            ['/point-of-sale',tc('landing.nav_point_of_sale')],
            ['/integrations',tc('landing.nav_integrations')],
          ].map(([href,label])=>(
            <Link key={href} href={localePath(href, lang as Locale)} className="nav-link" style={{ fontSize:12,color:T.tx2,textDecoration:'none',padding:'0 9px',transition:'color 150ms',whiteSpace:'nowrap' }}>{label}</Link>
          ))}

          {/* Resources mega-dropdown */}
          <NavDropdown lang={lang as Locale} label={tc('landing.nav_resources')} items={[
            {group:tc('landing.nav_group_learn'), links:[
              {href:'/academy',label:tc('landing.nav_academy_label'),desc:tc('landing.nav_academy_desc')},
              {href:'/blog',label:tc('landing.nav_blog_label'),desc:tc('landing.nav_blog_desc')},
              {href:'/how-to',label:tc('landing.nav_howto_label'),desc:tc('landing.nav_howto_desc')},
              {href:'/academy/learning-paths',label:tc('landing.nav_learning_paths_label'),desc:tc('landing.nav_learning_paths_desc')},
            ]},
            {group:tc('landing.nav_group_reference'), links:[
              {href:'/glossary',label:tc('landing.nav_glossary_label'),desc:tc('landing.nav_glossary_desc')},
              {href:'/benchmarks',label:tc('landing.nav_benchmarks_label'),desc:tc('landing.nav_benchmarks_desc')},
              {href:'/free-tools',label:tc('landing.nav_all_free_tools_label'),desc:tc('landing.nav_all_free_tools_desc')},
              {href:'/case-studies',label:tc('landing.nav_case_studies_label'),desc:tc('landing.nav_case_studies_desc')},
            ]},
            {group:tc('landing.nav_group_company'), links:[
              {href:'/changelog',label:tc('landing.nav_changelog_label'),desc:tc('landing.nav_changelog_desc')},
              {href:'/developers',label:tc('landing.nav_developers_label'),desc:tc('landing.nav_developers_desc')},
              {href:'/transparency',label:tc('landing.nav_transparency_label'),desc:tc('landing.nav_transparency_desc')},
            ]},
          ]}/>

          {/* Support */}
          <NavDropdown lang={lang as Locale} label={tc('landing.nav_support')} items={[
            {group:tc('landing.nav_group_help'), links:[
              {href:'/help',label:tc('landing.nav_help_centre_label'),desc:tc('landing.nav_help_centre_desc')},
              {href:'/help/faq',label:tc('landing.nav_faq_label'),desc:tc('landing.nav_faq_desc')},
              {href:'/help/glossary',label:tc('landing.nav_metric_glossary_label'),desc:tc('landing.nav_metric_glossary_desc')},
            ]},
          ]}/>

          <Link href="#pricing" className="nav-link" style={{ fontSize:12,color:T.tx2,textDecoration:'none',padding:'0 9px',whiteSpace:'nowrap',transition:'color 150ms' }}>{tc('landing.nav_pricing')}</Link>
        </div>

        <div style={{ display:'flex',alignItems:'center',gap:6,flexShrink:0 }}>
          <LanguageToggle />
          <Link href={localePath('/signin', lang as Locale)} style={{ width:36,height:36,borderRadius:8,border:`1px solid ${T.bd}`,background:'transparent',color:T.tx2,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',textDecoration:'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
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
            ['',tc('landing.mobile_section_product'),''],
            ['/free-tools',tc('landing.nav_free_tools'),''],
            ['/point-of-sale',tc('landing.nav_point_of_sale'),''],
            ['/integrations',tc('landing.nav_integrations'),''],
            ['',tc('landing.mobile_section_learn'),''],
            ['/academy',tc('landing.nav_academy_label'),''],
            ['/blog',tc('landing.nav_blog_label'),''],
            ['/how-to',tc('landing.nav_howto_label'),''],
            ['/case-studies',tc('landing.nav_case_studies_label'),''],
            ['/glossary',tc('landing.nav_glossary_label'),''],
            ['/benchmarks',tc('landing.nav_benchmarks_label'),''],
            ['',tc('landing.mobile_section_company'),''],
            ['/changelog',tc('landing.nav_changelog_label'),''],
            ['/developers',tc('landing.nav_developers_label'),''],
            ['/help',tc('landing.nav_help_centre_label'),''],
            ['/help/faq',tc('landing.nav_faq_label'),''],
            ['#pricing',tc('landing.nav_pricing'),''],
          ].map(([href,label],i)=>
            !href ? (
              <div key={i} style={{ padding:'12px 12px 4px',fontSize:9,fontWeight:700,color:T.acc,letterSpacing:'.12em',textTransform:'uppercase' }}>{label}</div>
            ) : (
              <a key={href} href={href.startsWith('#') ? href : localePath(href, lang as Locale)} onClick={()=>setMenuOpen(false)} style={{ display:'block',padding:'11px 12px',fontSize:14,fontWeight:500,color:T.tx,textDecoration:'none',borderBottom:`1px solid ${T.bd}` }}>{label}</a>
            )
          )}
          <div style={{ marginTop:20,display:'flex',flexDirection:'column',gap:10 }}>
            <Link href={localePath('/signin?mode=signup', lang as Locale)} onClick={()=>setMenuOpen(false)} style={{ display:'block',padding:'14px',borderRadius:9999,background:T.acc,color:'#fff',fontSize:15,fontWeight:700,textDecoration:'none',textAlign:'center' }}>{tc('landing.mobile_start_free')}</Link>
            <Link href={localePath('/signin', lang as Locale)} onClick={()=>setMenuOpen(false)} style={{ display:'block',padding:'14px',borderRadius:9999,border:`1px solid ${T.bd}`,background:'transparent',color:T.tx2,fontSize:14,fontWeight:500,textDecoration:'none',textAlign:'center' }}>{tc('landing.mobile_sign_in')}</Link>
          </div>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section id="calc" style={{ position:'relative',minHeight:'100svh',display:'flex',alignItems:'center' }}>
        <div style={{ position:'absolute',inset:0,zIndex:0,pointerEvents:'none' }}>
          <SkullCanvas scroll={scrollY} mouse={mouse} />
        </div>
        <div style={{ position:'absolute',top:'20%',left:'5%',width:'50%',height:'60%',background:'radial-gradient(ellipse,rgba(201,122,68,.05) 0%,transparent 70%)',pointerEvents:'none',zIndex:1 }}/>
        <div style={{ maxWidth:1280,margin:'0 auto',width:'100%',padding:'clamp(80px,10vw,100px) clamp(20px,5vw,80px)',position:'relative',zIndex:2 }}>
          <div className="hero-grid" style={{ gap:'clamp(32px,4vw,64px)' }}>
            {/* Left — headline */}
            <div>
              <h1 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(38px,5vw,72px)',fontWeight:400,lineHeight:.98,letterSpacing:'-.025em',marginBottom:28,color:T.tx }}>
                {tc('landing.hero_title_line1')}<br/>
                <em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.hero_title_line2')}</em>
              </h1>
              <p style={{ fontSize:'clamp(15px,1.4vw,18px)',color:T.tx2,lineHeight:1.7,marginBottom:36,maxWidth:420 }}>
                {tc('landing.hero_subtitle')}
              </p>
              <div className="hero-ctas" style={{ display:'flex',gap:12,flexWrap:'wrap',marginBottom:24 }}>
                <Link href={localePath('/signin?mode=signup', lang as Locale)} className="cta-btn" style={{ padding:'14px 28px',borderRadius:9999,background:T.acc,color:'#1a1410',fontSize:14,fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:`0 4px 24px rgba(201,122,68,.3)` }}>
                  {tc('landing.hero_cta_primary')}
                </Link>
                <a href="#pos" style={{ padding:'14px 20px',borderRadius:9999,border:`1px solid ${T.bd}`,background:'rgba(255,255,255,.6)',color:T.tx2,fontSize:14,fontWeight:500,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:6,backdropFilter:'blur(8px)' }}>
                  {tc('landing.hero_cta_secondary')}
                </a>
              </div>
              <div style={{ display:'flex',gap:16,flexWrap:'wrap',fontSize:12,color:T.tx3 }}>
                <span>{tc('landing.hero_trust_free')}</span>
                <span>{tc('landing.hero_trust_gdpr')}</span>
                <span>{tc('landing.hero_trust_ready')}</span>
              </div>
              <div style={{ marginTop:12,display:'inline-flex',alignItems:'center',gap:8,background:'rgba(22,163,74,.07)',border:'1px solid rgba(22,163,74,.18)',borderRadius:9999,padding:'6px 14px' }}>
                <span style={{ fontSize:11,fontWeight:700,color:'#16a34a' }}>{tc('landing.hero_badge_free')}</span>
                <span style={{ fontSize:11,color:T.tx3 }}>·</span>
                <span style={{ fontSize:11,color:T.tx2,fontWeight:600 }}>{tc('landing.hero_badge_pricing',{growth:growthPrice,business:businessPrice})}</span>
                <span style={{ fontSize:11,color:T.tx3 }}>·</span>
                <span style={{ fontSize:11,color:T.tx3 }}>{tc('landing.hero_badge_pos')}</span>
              </div>
              {country && <p style={{ fontSize:12,color:T.tx3,marginTop:8 }}>{tc('landing.hero_local_currency',{flag,country})}</p>}
            </div>
            {/* Right — calculator */}
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              <MiniCalcWidget tc={tc} lang={lang as Locale} />
            </div>
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
        ].map((s,i)=>(
          <div key={i} style={{ display:'flex',alignItems:'center',gap:7,flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.acc} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            <span style={{ fontSize:12,color:T.tx2,lineHeight:1.4 }}>
              <strong style={{ color:T.tx,fontWeight:600 }}>{s.after}</strong>{' '}{s.before}
            </span>
          </div>
        ))}
      </div>

      {/* ── INTELLIGENCE / MONITOR ────────────────────────────────────── */}
      <section style={{ padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)',background:T.bg }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="two-col-wide" style={{ gap:'clamp(36px,5vw,64px)' }}>
            <div data-reveal>
              <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,46px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:14,color:T.tx }}>
                {tc('landing.monitor_title_line1')}<br/><em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.monitor_title_line2')}</em>
              </h2>
              <p style={{ fontSize:14,color:T.tx2,lineHeight:1.7,marginBottom:22,maxWidth:320 }}>
                {tc('landing.monitor_subtitle')}
              </p>
              <div style={{ display:'flex',flexDirection:'column',gap:9 }}>
                {[
                  {icon:'⚡',label:tc('landing.monitor_feat_0')},
                  {icon:'📊',label:tc('landing.monitor_feat_1')},
                  {icon:'🧠',label:tc('landing.monitor_feat_2')},
                  {icon:'⏰',label:tc('landing.monitor_feat_3')},
                ].map((f,i)=>(
                  <div key={i} style={{ display:'flex',gap:9,alignItems:'flex-start',fontSize:13,color:T.tx2 }}>
                    <span style={{ fontSize:14,flexShrink:0 }}>{f.icon}</span><span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal data-reveal-delay="1">
              <MonitorUIReplica tc={tc} />
            </div>
          </div>
        </div>
      </section>

      {/* ── SOURCES / CONNECT ─────────────────────────────────────────── */}
      <section style={{ background:T.alt,borderTop:`1px solid ${T.bd}`,borderBottom:`1px solid ${T.bd}`,padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div className="two-col" style={{ gap:'clamp(36px,5vw,64px)' }}>
            <div data-reveal>
              <SourcesUIReplica tc={tc} />
            </div>
            <div data-reveal data-reveal-delay="1">
              <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,46px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:14,color:T.tx }}>
                {tc('landing.sources_title_line1')}<br/><em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.sources_title_line2')}</em>
              </h2>
              <p style={{ fontSize:14,color:T.tx2,lineHeight:1.75,marginBottom:22,maxWidth:320 }}>
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

      {/* ── POINT OF SALE ─────────────────────────────────────────────── */}
      <section id="pos" style={{ padding:'clamp(60px,7vw,88px) clamp(16px,4vw,40px)',background:T.bg }}>
        <div style={{ maxWidth:1180,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:44 }} data-reveal>
            <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(28px,4vw,54px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',color:T.tx,marginBottom:12 }}>
              {tc('landing.pos_title_line1')}<br/><em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.pos_title_line2')}</em>
            </h2>
            <p style={{ fontSize:14,color:T.tx2,lineHeight:1.7,maxWidth:480,margin:'0 auto' }}>
              {tc('landing.pos_subtitle')}
            </p>
          </div>
          <div data-reveal data-reveal-delay="1">
            <PosShowcase tc={tc} />
          </div>
          <div style={{ display:'flex',flexWrap:'wrap',gap:7,justifyContent:'center',marginTop:24 }}>
            {[0,1,2,3,4,5,6,7,8,9].map(i=>tc('landing.pos_pill_'+i)).map(f=>(
              <span key={f} style={{ padding:'6px 14px',borderRadius:9999,border:`1px solid ${T.bd}`,background:T.card,fontSize:12,color:T.tx2,fontWeight:500 }}>{f}</span>
            ))}
          </div>
          <div style={{ textAlign:'center',marginTop:24,display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap' }}>
            <Link href={localePath('/signin?mode=signup', lang as Locale)} className="cta-btn" style={{ padding:'11px 26px',borderRadius:9999,background:T.acc,color:'#1a1410',fontSize:14,fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:7 }}>
              {tc('landing.pos_cta')}
            </Link>
            <span style={{ fontSize:12,color:T.tx3,alignSelf:'center' }}>{tc('landing.pos_cta_note',{pos:posPrice})}</span>
          </div>
        </div>
      </section>

      {/* ── COMPARE ───────────────────────────────────────────────────── */}
      <section style={{ background:T.alt,borderTop:`1px solid ${T.bd}`,borderBottom:`1px solid ${T.bd}`,padding:'clamp(56px,7vw,88px) clamp(16px,4vw,40px)' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:44 }} data-reveal>
            <h2 style={{ fontFamily:'var(--font-instrument)',fontSize:'clamp(26px,3.5vw,46px)',fontWeight:400,lineHeight:1.05,letterSpacing:'-.02em',marginBottom:14,color:T.tx }}>
              {tc('landing.compare_title_line1')}<br/><em style={{ color:T.acc,fontStyle:'italic' }}>{tc('landing.compare_title_line2')}</em>
            </h2>
            <p style={{ fontSize:14,color:T.tx2,lineHeight:1.7,maxWidth:440,margin:'0 auto' }}>
              {tc('landing.compare_subtitle')}
            </p>
          </div>

          {/* Three-column cards */}
          <div data-reveal data-reveal-delay="1" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:40 }}>
            {[
              {
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
                price:tc('landing.compare_1_price'),
                highlight:true,
                pros:[0,1,2,3,4,5].map(j=>tc('landing.compare_1_pro_'+j)),
                cons:[0,1].map(j=>tc('landing.compare_1_con_'+j)),
                verdict:tc('landing.compare_1_verdict'),
              },
              {
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
          {/* PoS add-on */}
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
          <div className="three-col" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
            {[
              {id:'free',name:tc('landing.plan_free_name'),colour:'#8C7B6B',price:tc('landing.plan_free_price'),sub:tc('landing.plan_free_sub'),popular:false,
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

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ borderTop:`1px solid ${T.bd}`,background:T.card,padding:'clamp(16px,2.5vw,24px) clamp(16px,4vw,40px)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10 }}>
        <div style={{ display:'flex',alignItems:'center',gap:7 }}>
          <div style={{ width:22,height:22,borderRadius:6,background:T.acc,display:'flex',alignItems:'center',justifyContent:'center' }}><Logo size={10}/></div>
          <span style={{ fontFamily:'var(--font-instrument)',fontSize:14,color:T.tx }}>AskBiz</span>
          <span style={{ fontSize:12,color:T.tx3 }}>{tc('landing.footer_copyright')}</span>
        </div>
        <nav aria-label="Footer navigation" style={{ display:'flex',gap:16,flexWrap:'wrap' }}>
          {[['/', tc('landing.footer_home')],['/blog',tc('landing.footer_blog')],['/academy',tc('landing.footer_academy')],['/free-tools',tc('landing.footer_free_tools')],['/integrations',tc('landing.footer_integrations')],['/help',tc('landing.footer_help')],['/privacy',tc('landing.footer_privacy')],['/terms',tc('landing.footer_terms')],['/dpa',tc('landing.footer_dpa')],['mailto:hello@askbiz.co',tc('landing.footer_contact')]].map(([href,label])=>(
            <a key={href} href={href.startsWith('mailto:') ? href : localePath(href, lang as Locale)} className="nav-link" style={{ fontSize:12,color:T.tx3,textDecoration:'none',transition:'color 150ms' }}>{label}</a>
          ))}
        </nav>
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
