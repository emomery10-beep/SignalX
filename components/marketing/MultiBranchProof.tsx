'use client'

// ── Multi-Branch + Sales Heatmap Proof ────────────────────────────────────────
// Surfaces multi-branch management and a LIVE, animated sales HEATMAP — density
// blooms over the city where sales are happening, with live-sale ripples. Warm
// coral-editorial chrome. Copy from landing.mb_* keys.
// Note: the shipped POS "Map" tab currently plots individual sale pins, not a
// density heatmap — flagged to the owner; this section presents the heatmap they
// asked for (a valid density rendering of the same geo-tagged sales data).

type Tc = (k: string, vars?: Record<string, string | number>) => string

const M = { bg: '#FDFBF7', tx: '#1A1410', tx2: '#4A4038', tx3: '#6b6560', acc: '#C97A44', accSoft: 'rgba(201,122,68,0.10)', bd: '#e4e0d8', card: '#fff' }
const MAP = { land: '#eef1ec', block: '#e2e7e0', park: '#dce8d6', road: '#f7f9f6' }

// Heat blooms as % of the map box. hot drives colour intensity + size.
const HEAT = [
  { x: 32, y: 44, s: 200, hot: 1,   d: 0 },
  { x: 63, y: 27, s: 150, hot: .82, d: .6 },
  { x: 76, y: 66, s: 165, hot: .74, d: 1.1 },
  { x: 21, y: 74, s: 120, hot: .6,  d: 1.6 },
  { x: 49, y: 56, s: 100, hot: .55, d: .3 },
]
// Small branch markers + live-sale ripples.
const BRANCHES = [{ x: 32, y: 44 }, { x: 63, y: 27 }, { x: 76, y: 66 }, { x: 21, y: 74 }]

function heatBg(hot: number) {
  const a = (n: number) => (n * hot).toFixed(2)
  return `radial-gradient(circle, rgba(214,40,25,${a(0.5)}) 0%, rgba(240,120,20,${a(0.42)}) 38%, rgba(250,205,70,${a(0.24)}) 64%, transparent 78%)`
}

export default function MultiBranchProof({ tc }: { tc: Tc }) {
  const branches = ['mb_branch_all', 'mb_branch_0', 'mb_branch_1', 'mb_branch_2']
  return (
    <section style={{ padding: 'clamp(64px,9vw,112px) clamp(16px,4vw,40px)', background: M.bg }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }} data-reveal>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 9999, background: M.accSoft, color: M.acc, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            {tc('landing.mb_eyebrow')}
          </div>
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(28px,4.6vw,52px)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-.02em', color: M.tx, margin: '0 0 18px' }}>
            {tc('landing.mb_title')} <em style={{ color: M.acc, fontStyle: 'italic' }}>{tc('landing.mb_title_accent')}</em>
          </h2>
          <p style={{ fontSize: 'clamp(16px,1.8vw,19px)', color: M.tx2, lineHeight: 1.65, maxWidth: 540, margin: '0 auto' }}>
            {tc('landing.mb_sub')}
          </p>
        </div>

        {/* Map card (double-bezel) */}
        <div style={{ marginTop: 'clamp(36px,5vw,56px)' }} data-reveal data-reveal-delay="1">
          <div style={{ padding: 8, borderRadius: 28, background: M.accSoft, border: `1px solid ${M.bd}` }}>
            <div style={{ borderRadius: 22, overflow: 'hidden', background: M.card, border: `1px solid ${M.bd}`, boxShadow: '0 24px 60px -28px rgba(80,45,15,.28)' }}>

              {/* branch switcher */}
              <div style={{ display: 'flex', gap: 8, padding: '14px 16px', borderBottom: `1px solid ${M.bd}`, overflowX: 'auto' }}>
                {branches.map((k, z) => (
                  <span key={z} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 9999, fontSize: 13, fontWeight: 600, background: z === 0 ? M.acc : M.accSoft, color: z === 0 ? '#fff' : M.acc }}>
                    {tc(`landing.${k}`)}
                  </span>
                ))}
              </div>

              {/* map + heatmap */}
              <div style={{ position: 'relative' }}>
                {/* base map */}
                <svg viewBox="0 0 400 250" style={{ display: 'block', width: '100%', height: 'auto', background: MAP.land }} preserveAspectRatio="xMidYMid slice">
                  <rect x="20" y="20" width="90" height="60" rx="8" fill={MAP.block} />
                  <rect x="150" y="30" width="120" height="46" rx="8" fill={MAP.block} />
                  <rect x="300" y="24" width="80" height="70" rx="8" fill={MAP.park} />
                  <rect x="30" y="150" width="110" height="80" rx="8" fill={MAP.block} />
                  <rect x="170" y="120" width="90" height="60" rx="8" fill={MAP.park} />
                  <rect x="280" y="130" width="100" height="100" rx="8" fill={MAP.block} />
                  <g stroke={MAP.road} strokeWidth="9" strokeLinecap="round">
                    <path d="M0 105h400" /><path d="M0 190h400" /><path d="M130 0v250" /><path d="M270 0v250" /><path d="M0 55h140M270 60h130" />
                  </g>
                </svg>

                {/* animated heatmap layer */}
                <div className="mb-hm" aria-hidden>
                  {HEAT.map((h, z) => (
                    <span key={z} style={{ left: `${h.x}%`, top: `${h.y}%`, width: h.s, height: h.s, background: heatBg(h.hot), animationDelay: `${h.d}s` }} />
                  ))}
                </div>
                {/* live-sale ripples + branch dots */}
                <div className="mb-markers" aria-hidden>
                  {BRANCHES.map((b, z) => (
                    <span key={z} className="mb-dot" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
                      <i className="mb-ring" style={{ animationDelay: `${z * 0.7}s` }} />
                    </span>
                  ))}
                </div>

                {/* hottest-branch tooltip */}
                <div style={{ position: 'absolute', left: '32%', top: '44%', transform: 'translate(-50%,-165%)', background: M.card, borderRadius: 12, boxShadow: '0 10px 26px rgba(0,0,0,.18)', padding: '9px 13px', whiteSpace: 'nowrap', zIndex: 3 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: M.tx }}>{tc('landing.mb_pin_name')}</div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#d6281a' }}>{tc('landing.mb_pin_stat')}</div>
                </div>

                {/* heat legend */}
                <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.9)', borderRadius: 9999, padding: '5px 10px', zIndex: 3 }}>
                  <span style={{ fontSize: 10, color: M.tx3, fontWeight: 600 }}>{tc('landing.mb_legend_low')}</span>
                  <span style={{ width: 54, height: 6, borderRadius: 3, background: 'linear-gradient(90deg,rgba(250,205,70,.6),rgba(240,120,20,.85),#d6281a)' }} />
                  <span style={{ fontSize: 10, color: M.tx3, fontWeight: 600 }}>{tc('landing.mb_legend_high')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* footnote bullets */}
          <div style={{ display: 'flex', gap: 'clamp(14px,3vw,32px)', justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
            {['mb_pt_0', 'mb_pt_1', 'mb_pt_2'].map((k, z) => (
              <span key={z} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: M.tx2 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: M.acc }} />
                {tc(`landing.${k}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .mb-hm{position:absolute;inset:0;overflow:hidden;filter:blur(7px);pointer-events:none}
        .mb-hm span{position:absolute;border-radius:50%;transform:translate(-50%,-50%);animation:mb-breathe 3.6s ease-in-out infinite}
        @keyframes mb-breathe{0%,100%{transform:translate(-50%,-50%) scale(.9);opacity:.72}50%{transform:translate(-50%,-50%) scale(1.14);opacity:1}}
        .mb-markers{position:absolute;inset:0;pointer-events:none}
        .mb-dot{position:absolute;width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px #d6281a,0 2px 6px rgba(0,0,0,.3);transform:translate(-50%,-50%)}
        .mb-ring{position:absolute;left:50%;top:50%;border:2px solid rgba(214,40,26,.55);border-radius:50%;transform:translate(-50%,-50%);animation:mb-ripple 3s ease-out infinite}
        @keyframes mb-ripple{0%{width:6px;height:6px;opacity:.85}100%{width:110px;height:110px;opacity:0}}
        @media(prefers-reduced-motion:reduce){.mb-hm span{animation-duration:6s}.mb-ring{animation-duration:6s}}
      `}</style>
    </section>
  )
}
