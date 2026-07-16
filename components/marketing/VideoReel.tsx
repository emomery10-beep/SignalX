'use client'

import { useState, useEffect } from 'react'
import type { YoutubeVideo } from '@/lib/youtube-feed'

const ACC = '#C97A44'

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 2 }}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

export function VideoCard({ video, size }: { video: YoutubeVideo; size?: number }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div
      style={{
        flex: size ? `0 0 ${size}px` : undefined,
        width: size ?? '100%',
        aspectRatio: '9/16',
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
        background: '#111',
        cursor: playing ? 'default' : 'pointer',
      }}
      onClick={() => !playing && setPlaying(true)}
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
        <>
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 45%)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 48, height: 48, borderRadius: '50%', background: `${ACC}e6`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlayIcon />
          </div>
          <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {video.title}
          </div>
        </>
      )}
    </div>
  )
}

/** Horizontal scrolling reel of the latest AskBiz YouTube uploads. Updates
 * automatically as new videos are published — no manual wiring needed. */
export default function VideoReel({ label, title, cardSize = 200 }: { label?: string; title?: string; cardSize?: number }) {
  const [videos, setVideos] = useState<YoutubeVideo[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/youtube-latest')
      .then(r => r.json())
      .then(d => { if (!cancelled) setVideos(d.videos || []) })
      .catch(() => { if (!cancelled) setVideos([]) })
    return () => { cancelled = true }
  }, [])

  if (videos !== null && videos.length === 0) return null

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
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x proximity' }}>
          {videos === null
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ flex: `0 0 ${cardSize}px`, width: cardSize, aspectRatio: '9/16', borderRadius: 14, background: '#f0e8df' }} />
              ))
            : videos.map(v => (
                <div key={v.id} style={{ scrollSnapAlign: 'start' }}>
                  <VideoCard video={v} size={cardSize} />
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
