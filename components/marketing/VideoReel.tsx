'use client'

import { useState, useEffect, useRef } from 'react'
import type { YoutubeVideo } from '@/lib/youtube-feed'

const ACC = '#C97A44'

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 2 }} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1410" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  )
}

export function VideoCard({ video, size }: { video: YoutubeVideo; size?: number }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div
      className="vc-card"
      style={{
        flex: size ? `0 0 ${size}px` : undefined,
        width: size ?? '100%',
        aspectRatio: '9/16',
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
        background: '#111',
      }}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        <button
          type="button"
          className="vc-trigger"
          aria-label={`Play video: ${video.title}`}
          onClick={() => setPlaying(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            padding: 0, border: 'none', background: 'none', cursor: 'pointer',
            display: 'block', textAlign: 'left', font: 'inherit',
          }}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.78) 0%, rgba(0,0,0,.05) 40%, rgba(0,0,0,0) 60%)' }} />
          <div className="vc-play" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 48, height: 48, borderRadius: '50%', background: `${ACC}e6`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,.35)' }}>
            <PlayIcon />
          </div>
          <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'left' }}>
            {video.title}
          </div>
        </button>
      )}

      <style jsx>{`
        .vc-card { transition: transform 200ms ease-out, box-shadow 200ms ease-out; }
        .vc-card:hover, .vc-card:focus-within { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(26,20,16,.16); }
        .vc-trigger:focus-visible { outline: 2px solid #fff; outline-offset: -4px; border-radius: 14px; }
        .vc-card:hover .vc-play { transform: translate(-50%,-50%) scale(1.08); }
        .vc-play { transition: transform 150ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .vc-card, .vc-card:hover, .vc-play, .vc-card:hover .vc-play { transition: none !important; transform: none !important; }
        }
      `}</style>
    </div>
  )
}

/** Horizontal scrolling reel of the latest AskBiz YouTube uploads. Updates
 * automatically as new videos are published — no manual wiring needed. */
export default function VideoReel({ label, title, cardSize = 200 }: { label?: string; title?: string; cardSize?: number }) {
  const [videos, setVideos] = useState<YoutubeVideo[] | null>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/youtube-latest')
      .then(r => r.json())
      .then(d => { if (!cancelled) setVideos(d.videos || []) })
      .catch(() => { if (!cancelled) setVideos([]) })
    return () => { cancelled = true }
  }, [])

  if (videos !== null && videos.length === 0) return null

  const scrollByCards = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * (cardSize + 14) * 2, behavior: 'smooth' })
  }

  return (
    <section style={{ background: '#fff', borderTop: '1px solid #e8e6e1', padding: 'clamp(48px,6vw,72px) clamp(16px,4vw,40px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {label && (
          <div style={{ fontSize: 12, fontWeight: 700, color: ACC, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>
            {label}
          </div>
        )}
        {title && (
          <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 400, letterSpacing: '-.02em', color: '#1A1410', textAlign: 'center', margin: '0 0 32px' }}>
            {title}
          </h2>
        )}

        <div className="vr-wrap" style={{ position: 'relative' }}>
          <div ref={scrollerRef} className="vr-scroller" style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x proximity' }}>
            {videos === null
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="vr-skeleton" style={{ flex: `0 0 ${cardSize}px`, width: cardSize, aspectRatio: '9/16', borderRadius: 14 }} />
                ))
              : videos.map(v => (
                  <div key={v.id} style={{ scrollSnapAlign: 'start' }}>
                    <VideoCard video={v} size={cardSize} />
                  </div>
                ))}
          </div>

          {/* Edge fades hint that the reel scrolls further in each direction */}
          <div className="vr-fade vr-fade-l" aria-hidden="true" />
          <div className="vr-fade vr-fade-r" aria-hidden="true" />

          {videos !== null && videos.length > 3 && (
            <>
              <button type="button" className="vr-nav vr-nav-l" aria-label="Scroll to previous videos" onClick={() => scrollByCards(-1)}>
                <ChevronIcon direction="left" />
              </button>
              <button type="button" className="vr-nav vr-nav-r" aria-label="Scroll to more videos" onClick={() => scrollByCards(1)}>
                <ChevronIcon direction="right" />
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .vr-scroller { scrollbar-width: none; -ms-overflow-style: none; }
        .vr-scroller::-webkit-scrollbar { display: none; }
        .vr-skeleton {
          background: linear-gradient(100deg, #f0e8df 30%, #f7f0e8 50%, #f0e8df 70%);
          background-size: 200% 100%;
          animation: vr-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes vr-shimmer { 0% { background-position: 150% 0; } 100% { background-position: -50% 0; } }
        .vr-fade { position: absolute; top: 0; bottom: 8px; width: 32px; pointer-events: none; }
        .vr-fade-l { left: 0; background: linear-gradient(to right, #fff, rgba(255,255,255,0)); }
        .vr-fade-r { right: 0; background: linear-gradient(to left, #fff, rgba(255,255,255,0)); }
        .vr-nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e8e6e1;
          background: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 4px 12px rgba(26,20,16,.12);
          transition: background 120ms, transform 120ms;
        }
        .vr-nav:hover { background: #faf6f1; }
        .vr-nav:focus-visible { outline: 2px solid ${ACC}; outline-offset: 2px; }
        .vr-nav-l { left: -4px; }
        .vr-nav-r { right: -4px; }
        @media (max-width: 640px) {
          .vr-nav, .vr-fade { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vr-skeleton { animation: none; }
        }
      `}</style>
    </section>
  )
}
