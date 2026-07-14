// Bespoke Somalia-market landing page (served at /so for Somali visitors).
// Server component — no client JS, native <details> for the FAQ — so it loads
// fast on the budget Android phones most Somali market traders use.
//
// Reuses the AskBiz brand system (coral accent #C97A44, warm neutral surface,
// viewfinder logo). EVC Plus / Zaad / eDahab-led framing per the south/central
// Somalia market lead. All copy is Somali; ⚠ pending native-speaker review.
import Link from 'next/link'
import { localePath } from '@/lib/i18n-locale'
import LanguageToggle from '@/components/LanguageToggle'

// Brand tokens — mirrored from components/layout/LandingClient.tsx (single accent).
const T = {
  bg: '#f2f3f5', card: '#FFFFFF', alt: '#e8eaed',
  tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560',
  bd: '#dde0e4', bd2: '#c8ccd2',
  acc: '#C97A44', accBg: 'rgba(201,122,68,.08)', accBdr: 'rgba(201,122,68,.28)',
}

function Logo({ size = 12, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 11 V5 H11" /><path d="M21 5 H27 V11" />
        <path d="M5 21 V27 H11" /><path d="M27 21 V27 H21" />
      </g>
      <circle cx="16" cy="16" r="2.6" fill={color} />
    </svg>
  )
}

// Consistent 1.6-stroke line icons (no emoji — they render poorly on budget Androids).
const IC: Record<string, JSX.Element> = {
  camera: <><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" /><circle cx="12" cy="13" r="3.2" /></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16" cy="14" r="1.3" /></>,
  chart: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>,
  box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></>,
  cloudoff: <><path d="M17 18H7a4 4 0 0 1-1-7.87A5.5 5.5 0 0 1 16.9 8.1 4 4 0 0 1 17 18z" /><path d="M3 3l18 18" strokeLinecap="round" /></>,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 14v7h-7" /></>,
  cash: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></>,
}
function Icon({ name, size = 22, color = T.tx2 }: { name: string; size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{IC[name]}</svg>
}

const wrap: React.CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: '0 20px' }

export default function SomaliaLanding({ lang = 'so' }: { lang?: string }) {
  const signup = localePath('/signin?mode=signup', lang as never)
  const signin = localePath('/signin', lang as never)

  const rails = ['EVC Plus', 'Zaad', 'eDahab', 'Lacag caddaan', 'QR (SOMQR)']

  const pains = [
    { t: 'Buug qalinle — ma xisaabin kartid faa’iidada maalinta?', f: 'AskBiz ayaa kuu xisaabiya — si toos ah.' },
    { t: 'Alaabta way dhammaataa adigoon ogeyn ilaa macmiilku weydiiyo.', f: 'Digniin kayd ka hor inta aanay dhammaan.' },
    { t: 'EVC iyo lacag caddaan oo isku dhafan — hadhaaga run ah ma hesho.', f: 'Dhammaan hal meel, si toos ah loo isku daray.' },
    { t: 'Faa’iido ma jirtaa? Malaha uun — ma hubto.', f: 'Warbixin cad, maalin kasta, 4 daqiiqo gudahood.' },
  ]

  const feats = [
    { i: 'camera', t: 'Kamarad-hore', d: 'Sawir alaabta — AskBiz ayaa magacaaba oo qiimeeya.' },
    { i: 'wallet', t: 'Lacagta oo dhan hal meel', d: 'EVC Plus, Zaad, eDahab, lacag caddaan iyo kaadh.' },
    { i: 'chart', t: 'Caawa ogow faa’iidadaada', d: 'Warbixin maalinle — dakhli, faa’iido, kuwa iibka badan.' },
    { i: 'box', t: 'Kayd iyo digniino', d: 'Ogow waxa dhammaanaya ka hor inta aanay ku dhammaan.' },
    { i: 'users', t: 'Deyn macmiil', d: 'La soco cidda deyn ku leh iyo inta ay tahay.' },
    { i: 'cloudoff', t: 'Wuu shaqeeyaa offline', d: 'Internet daciif? Iibinta lacag caddaan way sii socotaa.' },
  ]

  const traders = ['Dukaanka suuqa', 'Iibiyaha xoolaha', 'Kushoot / kioosk', 'Salon & timo-jar', 'Makhaayad', 'Gaarsiiye']

  const faqs = [
    { q: 'AskBiz ma la isticmaali karaa EVC Plus, Zaad iyo eDahab?', a: 'Haa. AskBiz wuxuu raad-raacaa iibka aad ku qaadato EVC Plus, Zaad, eDahab, lacag caddaan, QR (SOMQR), ama kaadh — dhammaan hal meel.' },
    { q: 'Ma bilaash baa?', a: 'Haa, waad bilaash ku bilaabi kartaa. Kaadh looma baahna, qalab looma baahna. Waxaad kor u qaadan kartaa markaad diyaar tahay.' },
    { q: 'Taleefan nooc kasta ma ku shaqeeyaa?', a: 'Haa — taleefan kasta oo Android ah ama iPhone. Uma baahnid mashiin keesh ama qalab gaar ah.' },
    { q: 'Ma shaqeeyaa internet la’aan?', a: 'Haa. Iibinta lacagta caddaanka ah way sii socotaa signal la’aanteed; app-ku wuxuu safka geliyaa iibka wuxuuna is-cusboonaysiiyaa markaad internetka ku soo laabato.' },
    { q: 'Qiimaha ma Shilin Soomaali ama Doolar baa?', a: 'Labadaba. Waxaad dooran kartaa Shilin Soomaali (SOS) ama Doolar (USD) — sida aad ganacsigaaga ugu isticmaasho.' },
    { q: 'Xogtaydu ma ammaan baa?', a: 'Haa. Xogtaadu waa sir-dhigan marka la kaydiyo iyo marka la wareejinayo, waligeenna kuma iibinno cid saddexaad.' },
    { q: 'Af Soomaali ma ku shaqeeyaa?', a: 'Haa — guud ahaan app-ka waa af Soomaali, laga bilaabo isqorista ilaa warbixinta maalinlaha ah.' },
  ]

  return (
    <div style={{ background: T.bg, color: T.tx, fontFamily: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', minHeight: '100dvh' }}>
      <style>{`@media(max-width:479px){.so-country-badge{display:none!important}}`}</style>
      {/* ── Nav ───────────────────────────────────────────────── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(242,243,245,.92)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${T.bd}` }}>
        <nav style={{ ...wrap, display: 'flex', alignItems: 'center', gap: 12, height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, background: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Logo size={14} /></span>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.3 }}>AskBiz</span>
            <span className="so-country-badge" style={{ fontSize: 10, color: T.tx3, fontWeight: 600, border: `1px solid ${T.bd}`, borderRadius: 9999, padding: '2px 8px' }}>Soomaaliya 🇸🇴</span>
          </div>
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <LanguageToggle />
            <Link href={signin} style={{ fontSize: 13, color: T.tx2, textDecoration: 'none', fontWeight: 600 }}>Gal</Link>
            <Link href={signup} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.acc, borderRadius: 9999, padding: '9px 18px', textDecoration: 'none', boxShadow: '0 2px 12px rgba(201,122,68,.3)', whiteSpace: 'nowrap' }}>Isqor bilaash</Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ ...wrap, paddingTop: 56, paddingBottom: 40, textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: T.acc, background: T.accBg, border: `1px solid ${T.accBdr}`, borderRadius: 9999, padding: '6px 14px' }}>
          <Icon name="wallet" size={14} color={T.acc} /> EVC Plus · Zaad · eDahab
        </span>
        <h1 style={{ fontSize: 'clamp(30px,7vw,52px)', lineHeight: 1.08, fontWeight: 850, letterSpacing: -1, margin: '20px auto 0', maxWidth: 720 }}>
          Ku iibi taleefankaaga.<br /><span style={{ color: T.acc }}>Caawa ogow lacagtaada.</span>
        </h1>
        <p style={{ fontSize: 'clamp(16px,3.4vw,19px)', color: T.tx2, lineHeight: 1.6, margin: '18px auto 0', maxWidth: 560 }}>
          AskBiz waa POS taleefan iyo la-socodka iibka maalinlaha ah ee dukaannada iyo ganacsatada yaryar ee Soomaaliya. Qaado EVC Plus, Zaad, eDahab, lacag caddaan ama QR — taleefan kasta, bilaash ku bilow.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 28 }}>
          <Link href={signup} style={{ padding: '14px 28px', borderRadius: 9999, background: T.acc, color: '#fff', fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 22px rgba(201,122,68,.32)' }}>Bilaash ku bilow →</Link>
          <Link href="/demo" style={{ padding: '14px 26px', borderRadius: 9999, border: `1px solid ${T.bd2}`, background: 'transparent', color: T.tx2, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Daawo sida ay u shaqeyso ↓</Link>
        </div>
        <p style={{ fontSize: 13, color: T.tx3, marginTop: 16 }}>Kaadh looma baahna · qalab looma baahna · jooji goor kasta</p>
      </section>

      {/* ── Mobile-money hook band ────────────────────────────── */}
      <section style={{ background: T.tx, color: '#fff', padding: '32px 0' }}>
        <div style={{ ...wrap, textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.acc, margin: 0 }}>Ku shaqeeya lacagta aad horeba u isticmaasho</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 16 }}>
            {rails.map(r => (
              <span key={r} style={{ fontSize: 14, fontWeight: 600, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.16)', borderRadius: 9999, padding: '8px 16px' }}>{r}</span>
            ))}
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.8)', lineHeight: 1.6, margin: '20px auto 0', maxWidth: 620 }}>
            In ka badan <strong style={{ color: '#fff' }}>70% dadka waaweyn ee Soomaaliya</strong> waxay isticmaalaan lacagta mobiilka — AskBiz si toos ah ayuu ula socodsiiyaa iib kasta.
          </p>
        </div>
      </section>

      {/* ── Pain points ──────────────────────────────────────── */}
      <section style={{ ...wrap, paddingTop: 56, paddingBottom: 20 }}>
        <h2 style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 800, letterSpacing: -0.5, textAlign: 'center', margin: 0 }}>Ma ku dhacdaa?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14, marginTop: 28 }}>
          {pains.map((p, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.bd}`, borderRadius: 16, padding: 22 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: T.tx, margin: 0, lineHeight: 1.4 }}>{p.t}</p>
              <p style={{ fontSize: 14, color: T.acc, fontWeight: 600, margin: '10px 0 0', lineHeight: 1.5 }}>→ {p.f}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section style={{ ...wrap, paddingTop: 44, paddingBottom: 20 }}>
        <h2 style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 800, letterSpacing: -0.5, textAlign: 'center', margin: 0 }}>Waxa AskBiz kuu qabto</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 14, marginTop: 28 }}>
          {feats.map((f, i) => (
            <div key={i} style={{ background: T.card, border: `1px solid ${T.bd}`, borderRadius: 16, padding: 22 }}>
              <span style={{ display: 'inline-flex', width: 42, height: 42, borderRadius: 11, background: T.accBg, alignItems: 'center', justifyContent: 'center' }}><Icon name={f.i} color={T.acc} /></span>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '14px 0 6px' }}>{f.t}</h3>
              <p style={{ fontSize: 14, color: T.tx2, lineHeight: 1.55, margin: 0 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Market fit ───────────────────────────────────────── */}
      <section style={{ ...wrap, paddingTop: 44, paddingBottom: 20, textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(22px,4.5vw,30px)', fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>Ganacsi kasta oo wax iibiya</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 22 }}>
          {traders.map(t => (
            <span key={t} style={{ fontSize: 14, fontWeight: 600, color: T.tx2, background: T.card, border: `1px solid ${T.bd}`, borderRadius: 9999, padding: '10px 18px' }}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── Pricing note ─────────────────────────────────────── */}
      <section style={{ ...wrap, paddingTop: 44, paddingBottom: 20 }}>
        <div style={{ background: T.acc, borderRadius: 20, padding: '32px 26px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: 'clamp(22px,4.5vw,30px)', fontWeight: 800, margin: 0, letterSpacing: -0.4 }}>Bilaash ayaad ku bilaabaysaa</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.9)', margin: '12px auto 0', maxWidth: 480, lineHeight: 1.6 }}>
            Qiimaha waxaa lagu muujiyaa Shilin Soomaali (SOS) ama Doolar (USD). Kaadh looma baahna — kaliya taleefankaaga.
          </p>
          <Link href={signup} style={{ display: 'inline-block', marginTop: 20, padding: '13px 30px', borderRadius: 9999, background: '#fff', color: T.tx, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Hadda bilow →</Link>
        </div>
      </section>

      {/* ── FAQ (also feeds FAQPage schema) ──────────────────── */}
      <section style={{ ...wrap, paddingTop: 44, paddingBottom: 20, maxWidth: 760 }}>
        <h2 style={{ fontSize: 'clamp(24px,5vw,34px)', fontWeight: 800, letterSpacing: -0.5, textAlign: 'center', margin: '0 0 24px' }}>Su’aalaha caadiga ah</h2>
        {faqs.map((f, i) => (
          <details key={i} style={{ borderBottom: `1px solid ${T.bd}`, padding: '4px 0' }}>
            <summary style={{ cursor: 'pointer', listStyle: 'none', padding: '16px 4px', fontSize: 16, fontWeight: 700, color: T.tx, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              {f.q}<span style={{ color: T.acc, flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ fontSize: 15, color: T.tx2, lineHeight: 1.65, margin: '0 4px 16px' }}>{f.a}</p>
          </details>
        ))}
      </section>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <section style={{ ...wrap, paddingTop: 36, paddingBottom: 64, textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,5.5vw,38px)', fontWeight: 850, letterSpacing: -0.8, margin: 0, maxWidth: 600, marginInline: 'auto', lineHeight: 1.15 }}>
          Bilow maanta — ku iibi taleefankaaga, caawa ogow lacagtaada.
        </h2>
        <div style={{ marginTop: 24 }}>
          <Link href={signup} style={{ display: 'inline-block', padding: '15px 36px', borderRadius: 9999, background: T.acc, color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(201,122,68,.3)' }}>Bilaash ku bilow →</Link>
        </div>
        <p style={{ fontSize: 13, color: T.tx3, marginTop: 14 }}>Bilaash lagu bilaabo · kaadh looma baahna · waligeen kuma iibinno xogtaada</p>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${T.bd}`, padding: '28px 0' }}>
        <div style={{ ...wrap, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: T.acc, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Logo size={12} /></span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>AskBiz</span>
            <span style={{ fontSize: 12, color: T.tx3 }}>· Soomaaliya · © 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/so/pricing" style={{ fontSize: 13, color: T.tx2, textDecoration: 'none' }}>Qiimaha</Link>
            <Link href="/so/help" style={{ fontSize: 13, color: T.tx2, textDecoration: 'none' }}>Caawimaad</Link>
            <Link href="/demo" style={{ fontSize: 13, color: T.tx2, textDecoration: 'none' }}>Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
