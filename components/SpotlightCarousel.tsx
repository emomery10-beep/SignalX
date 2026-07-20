'use client'
import { useState, useEffect } from 'react'
import { useLang } from '@/components/LanguageProvider'

interface Spotlight {
  id: string
  business_name: string
  tagline: string
  logo_url: string | null
  link_url: string | null
}

const ROTATE_MS = 5500

// Slide 0 is always the AskBiz brand card (today's static content, unchanged
// look). Slides 1..N are approved business_spotlights, fetched client-side
// since the signin page is 'use client' end to end. A failed/empty fetch
// silently leaves just the brand slide — no loading state, no layout shift.
export default function SpotlightCarousel() {
  const { tc } = useLang()
  const [spotlights, setSpotlights] = useState<Spotlight[]>([])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setReducedMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
    fetch('/api/spotlight/public')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.spotlights?.length) setSpotlights(d.spotlights) })
      .catch(() => {})
  }, [])

  const total = spotlights.length + 1
  useEffect(() => {
    if (total <= 1 || paused || reducedMotion) return
    const t = setInterval(() => setIndex(i => (i + 1) % total), ROTATE_MS)
    return () => clearInterval(t)
  }, [total, paused, reducedMotion])

  const brandSlide = (
    <>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
      </div>
      <div style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', marginBottom: 12 }}>
        AskBiz
      </div>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,.9)', lineHeight: 1.5 }}>
        {tc('auth.signup_subtitle')}
      </p>
    </>
  )

  const spotlightSlide = (s: Spotlight) => (
    <div key={s.id}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,.65)', marginBottom: 14 }}>
        {tc('auth.spotlight_eyebrow')}
      </div>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,.15)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        {s.logo_url
          ? <img src={s.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>}
      </div>
      <div style={{ fontFamily: 'var(--font-sora, Sora)', fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', marginBottom: 10, overflowWrap: 'anywhere' as const }}>
        {s.business_name}
      </div>
      <p style={{ fontSize: 16, color: 'rgba(255,255,255,.9)', lineHeight: 1.5, marginBottom: s.link_url ? 16 : 0 }}>
        {s.tagline}
      </p>
      {s.link_url && (
        <a href={s.link_url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 9999, background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
          {tc('auth.spotlight_visit')}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
        </a>
      )}
    </div>
  )

  const slides = [<div key="brand">{brandSlide}</div>, ...spotlights.map(spotlightSlide)]

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{ position: 'relative', textAlign: 'center', padding: '0 48px', maxWidth: 420 }}>
      <div key={index} className="animate-fade-up" style={{ minHeight: 220 }}>
        {slides[index]}
      </div>

      {slides.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 28 }}>
          {slides.map((_, i) => (
            <button key={i} aria-label={`Slide ${i + 1} of ${slides.length}`} onClick={() => setIndex(i)}
              style={{
                width: i === index ? 18 : 6, height: 6, borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer',
                background: i === index ? '#fff' : 'rgba(255,255,255,.35)', transition: 'width 200ms, background 200ms',
              }}/>
          ))}
        </div>
      )}
    </div>
  )
}
