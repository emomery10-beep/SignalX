'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GeoData { currency: string; currencySymbol: string; country: string; trendTopics: string[] }

const CHAT_EXAMPLES = [
  { q: "Which items should I restock urgently?", a: "4 items need urgent restocking — Matchboxes (2 units left), Tomato Paste (3 units), Sugar 1kg (5 units) and Maize Flour (8 units). At your current sell rate, Matchboxes will run out in 1 day.", tag: "Stock alert" },
  { q: "What's my best margin product right now?", a: "Your best margin product is Yoghurt 400g at 31.4% gross margin, followed by Cooking Oil 1L at 27.8%. Both are well above your portfolio average of 22.1%.", tag: "Margin analysis" },
  { q: "Can I raise my cooking oil price by 5%?", a: "Yes — the numbers support it. A 5% increase brings the price to KSh 205. At current volume of 1,200 units/month, that adds KSh 2,358 in monthly profit. Your nearest competitor is at KSh 210, so you still have room.", tag: "Pricing decision" },
  { q: "What product should I launch next?", a: "Based on your top customers and current gaps, Body Lotion 400ml scores highest (74/100). Your cooking oil buyers purchase lotion 38% of the time elsewhere. Estimated margin: 34%. Suggested opening order: 200 units.", tag: "Expansion" },
]

const TESTIMONIALS = [
  { name: "James K.", role: "Retail shop owner", location: "Nairobi", text: "I used to spend 2 hours every Monday checking stock and margins. Now I just ask and get the answer in seconds. My restock decisions are so much faster.", avatar: "JK" },
  { name: "Amina R.", role: "Distributor", location: "Mombasa", text: "The expansion intelligence feature found a product gap I'd been missing for 3 years. Launched it, sold out in 3 weeks.", avatar: "AR" },
  { name: "David O.", role: "Ecommerce seller", location: "Lagos", text: "I connect my Shopify store and it just works. Every morning I check what's happening in my business in 2 minutes flat.", avatar: "DO" },
]

const STEPS = [
  { num: "1", title: "Upload your data or connect your store", body: "Drop in a CSV, XLSX or connect Shopify, Stripe or Google Sheets. Takes 2 minutes.", icon: "📂" },
  { num: "2", title: "Ask anything in plain English", body: "Type your question like you'd ask a friend. No training, no dashboards to learn.", icon: "💬" },
  { num: "3", title: "Get a clear answer with next steps", body: "Not raw data — a decision. With the numbers, a chart, and what to do about it.", icon: "✅" },
]

const PAINS = [
  { pain: "Staring at spreadsheets trying to figure out which products to restock", fix: "Ask AskBiz. Get the answer in 10 seconds." },
  { pain: "Guessing whether you can afford to raise prices", fix: "Simulate it. See the exact impact before you change anything." },
  { pain: "Not knowing your real margins after costs and fees", fix: "Every answer is grounded in your actual numbers." },
  { pain: "Spending hours on analysis you're still not confident about", fix: "Let AskBiz do the analysis. You make the call." },
]

export default function LandingClient({ geo }: { geo: GeoData | null }) {
  const [activeExample, setActiveExample] = useState(0)
  const [typing, setTyping] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const sym = geo?.currencySymbol || '$'
  const country = geo?.country || 'your region'

  useEffect(() => {
    const cycle = setInterval(() => {
      setShowAnswer(false)
      setTyping(true)
      setTimeout(() => { setTyping(false); setShowAnswer(true) }, 1200)
      setActiveExample(i => (i + 1) % CHAT_EXAMPLES.length)
    }, 5000)
    setTyping(true)
    setTimeout(() => { setTyping(false); setShowAnswer(true) }, 1200)
    return () => clearInterval(cycle)
  }, [])

  const ex = CHAT_EXAMPLES[activeExample]

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--tx)', fontFamily: 'var(--font-dm, DM Sans, sans-serif)', overflowX: 'hidden' }}>

      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(249,248,246,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--b)', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', fontSize: 16, fontWeight: 700, letterSpacing: '-.02em' }}>AskBiz</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/signin" style={{ padding: '8px 16px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Sign in
          </Link>
          <Link href="/signin" style={{ padding: '8px 18px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Try free →
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '72px 24px 56px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 9999, background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.25)', fontSize: 13, color: 'var(--acc)', fontWeight: 500, marginBottom: 28 }}>
          📍 Showing prices in {sym} · {country}
        </div>

        <h1 style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-.03em', marginBottom: 20 }}>
          Your business data,<br/>
          <span style={{ background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>explained in plain English.</span>
        </h1>

        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--tx2)', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 36px' }}>
          Upload your sales data or connect your store. Ask a question. Get a clear answer with the numbers, a chart, and exactly what to do next. No dashboards. No training. No guessing.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <Link href="/signin" style={{ padding: '14px 28px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(208,138,89,.3)' }}>
            Start free — no card needed →
          </Link>
          <a href="#how-it-works" style={{ padding: '14px 24px', borderRadius: 9999, border: '1px solid var(--b2)', background: 'transparent', color: 'var(--tx)', fontSize: 15, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            See how it works
          </a>
        </div>
        <p style={{ fontSize: 13, color: 'var(--tx3)' }}>10 free questions every month. No card required.</p>
      </section>

      {/* ── LIVE DEMO CHAT ─────────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 72px' }}>
        <div style={{ background: 'var(--sf)', border: '1px solid var(--b)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.1)' }}>
          {/* Chat header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--b)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="11" height="11" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>AskBiz</div>
              <div style={{ fontSize: 11, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}/>
                Ready to answer
              </div>
            </div>
            <div style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 9999, background: 'rgba(208,138,89,.1)', border: '1px solid rgba(208,138,89,.2)', fontSize: 11, color: 'var(--acc)', fontWeight: 500 }}>
              {ex.tag}
            </div>
          </div>

          {/* Messages */}
          <div style={{ padding: '20px 18px', minHeight: 200 }}>
            {/* User message */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <div style={{ padding: '10px 14px', borderRadius: 14, borderBottomRightRadius: 3, background: 'var(--ev)', border: '1px solid var(--b)', fontSize: 14, maxWidth: '80%', lineHeight: 1.55 }}>
                {ex.q}
              </div>
            </div>

            {/* AI response */}
            {typing && (
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 14, borderBottomLeftRadius: 3, background: 'var(--ev)', border: '1px solid var(--b)', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span className="tdot"/><span className="tdot"/><span className="tdot"/>
                </div>
              </div>
            )}
            {showAnswer && (
              <div style={{ display: 'flex', gap: 10, animation: 'fadeUp .3s ease both' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: 14, borderBottomLeftRadius: 3, background: 'var(--sf)', border: '1px solid var(--b)', fontSize: 14, lineHeight: 1.65, maxWidth: '85%' }}>
                  {ex.a}
                </div>
              </div>
            )}
          </div>

          {/* Question selector */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--b)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CHAT_EXAMPLES.map((e, i) => (
              <button key={i} onClick={() => { setActiveExample(i); setShowAnswer(false); setTyping(true); setTimeout(() => { setTyping(false); setShowAnswer(true) }, 1000) }}
                style={{ padding: '6px 12px', borderRadius: 9999, border: `1px solid ${i === activeExample ? 'rgba(208,138,89,.4)' : 'var(--b)'}`, background: i === activeExample ? 'rgba(208,138,89,.08)' : 'transparent', color: i === activeExample ? 'var(--acc)' : 'var(--tx2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: i === activeExample ? 500 : 400, transition: 'all 150ms' }}>
                {e.tag}
              </button>
            ))}
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--tx3)', marginTop: 12 }}>
          Live demo — these are real answers from real business data
        </p>
      </section>

      {/* ── PAIN POINTS ────────────────────────────────────────── */}
      <section style={{ background: 'var(--sf)', borderTop: '1px solid var(--b)', borderBottom: '1px solid var(--b)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, textAlign: 'center', marginBottom: 10, letterSpacing: '-.02em' }}>
            Sound familiar?
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--tx2)', fontSize: 16, marginBottom: 40 }}>
            Every business owner we've spoken to has said at least one of these.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 14 }}>
            {PAINS.map((p, i) => (
              <div key={i} style={{ padding: '18px 20px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--bg)' }}>
                <div style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 8, lineHeight: 1.55 }}>
                  <span style={{ color: 'var(--tx3)', marginRight: 6 }}>😩</span> "{p.pain}"
                </div>
                <div style={{ fontSize: 13, color: 'var(--acc)', fontWeight: 500 }}>
                  → {p.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" style={{ maxWidth: 800, margin: '0 auto', padding: '72px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, textAlign: 'center', marginBottom: 10, letterSpacing: '-.02em' }}>
          Three steps to a clearer decision
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--tx2)', fontSize: 16, marginBottom: 48 }}>
          No training. No dashboards to learn. Just ask.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ padding: '24px 22px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--sf)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--acc)', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{s.num}</div>
              <div style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: 'var(--tx2)', lineHeight: 1.65 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <section style={{ background: 'var(--sf)', borderTop: '1px solid var(--b)', borderBottom: '1px solid var(--b)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, textAlign: 'center', marginBottom: 10, letterSpacing: '-.02em' }}>
            Real business owners. Real results.
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--tx2)', fontSize: 16, marginBottom: 40 }}>
            From Nairobi to Lagos to Dubai — businesses like yours are already using AskBiz.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ padding: '22px', borderRadius: 16, border: '1px solid var(--b)', background: 'var(--bg)' }}>
                <div style={{ fontSize: 20, marginBottom: 14 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--tx)', marginBottom: 16 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--tx3)' }}>{t.role} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, textAlign: 'center' }}>
          {[
            { num: '< 3 min', label: 'Average time to first insight' },
            { num: '40+', label: 'Currencies auto-detected' },
            { num: '4', label: 'Business types covered' },
            { num: '100%', label: 'Grounded in your data' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '20px', borderRadius: 14, border: '1px solid var(--b)', background: 'var(--sf)' }}>
              <div style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 26, fontWeight: 700, color: 'var(--acc)', marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'var(--tx2)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--sf)', borderTop: '1px solid var(--b)', borderBottom: '1px solid var(--b)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, marginBottom: 10, letterSpacing: '-.02em' }}>
            Simple, honest pricing
          </h2>
          <p style={{ color: 'var(--tx2)', fontSize: 16, marginBottom: 40 }}>
            Start free. Upgrade when you're ready. Cancel any time — no questions asked.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14 }}>
            {[
              { name: 'Free', price: '£0', desc: 'Try it out', features: ['10 AI questions/month', '1 file upload', 'Basic analysis'], cta: 'Start free', highlight: false },
              { name: 'Growth', price: '£19', desc: 'For solo business owners', features: ['500 questions/month', '10 file uploads', 'Expansion intelligence', 'Alerts & forecasts', '7-day free trial'], cta: 'Start free trial', highlight: true },
              { name: 'Business', price: '£49', desc: 'Early adoption price — locked forever', features: ['2,000 questions/month', 'Unlimited uploads', '5 team members', 'API access'], cta: 'Get Business', highlight: false },
            ].map((p, i) => (
              <div key={i} style={{ padding: '22px', borderRadius: 16, border: `1px solid ${p.highlight ? 'rgba(208,138,89,.4)' : 'var(--b)'}`, background: p.highlight ? 'rgba(208,138,89,.05)' : 'var(--bg)', position: 'relative' }}>
                {p.highlight && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '3px 14px', borderRadius: 9999, background: 'var(--acc)', color: '#fff', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                <div style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginBottom: 12 }}>{p.desc}</div>
                <div style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 28, fontWeight: 700, marginBottom: 16 }}>{p.price}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--tx3)' }}>{p.price !== '£0' ? '/mo' : ''}</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18, textAlign: 'left' }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ fontSize: 13, color: 'var(--tx2)', display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--acc)', flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <Link href="/signin" style={{ display: 'block', padding: '10px', borderRadius: 9999, border: p.highlight ? 'none' : '1px solid var(--b2)', background: p.highlight ? 'var(--acc)' : 'transparent', color: p.highlight ? '#fff' : 'var(--tx)', fontSize: 14, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>👋</div>
        <h2 style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, marginBottom: 14, letterSpacing: '-.02em', lineHeight: 1.2 }}>
          Your data has the answers.<br/>Let's find them together.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--tx2)', lineHeight: 1.7, marginBottom: 32 }}>
          Upload your first file, ask your first question, get your first insight — in under 3 minutes. No training. No setup. No card needed to start.
        </p>
        <Link href="/signin" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '15px 32px', borderRadius: 9999, border: 'none', background: 'var(--acc)', color: '#fff', fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 24px rgba(208,138,89,.3)', letterSpacing: '-.01em' }}>
          Try AskBiz free — no card needed →
        </Link>
        <p style={{ fontSize: 13, color: 'var(--tx3)', marginTop: 14 }}>
          Trusted by business owners across East Africa, West Africa, and the Gulf.
        </p>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--b)', padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#d08a59,#8c6fe0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,14 6,8 10,11 14,4"/></svg>
          </div>
          <span style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 13, fontWeight: 600 }}>AskBiz</span>
          <span style={{ fontSize: 12, color: 'var(--tx3)' }}>© 2026</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="/privacy" style={{ fontSize: 13, color: 'var(--tx3)', textDecoration: 'none' }}>Privacy</a>
            <a href="/terms" style={{ fontSize: 13, color: 'var(--tx3)', textDecoration: 'none' }}>Terms</a>
            <a href="mailto:hello@askbiz.co" style={{ fontSize: 13, color: 'var(--tx3)', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </div>
  )
}
