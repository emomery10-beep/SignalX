'use client'

import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'
import { VideoCard } from '@/components/marketing/VideoReel'
import type { YoutubeVideo } from '@/lib/youtube-feed'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const SF  = '#ffffff'
const TX  = '#171512'
const TX2 = '#5c574f'
const BD  = '#e8e6e1'

function EmptyStateIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={ACC} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="5" width="14" height="14" rx="2.5" />
      <path d="M21.5 8.2 16.5 11l5 2.8Z" />
    </svg>
  )
}

export default function VideoLibraryClient({ videos }: { videos: YoutubeVideo[] }) {
  const { lang } = useLang()

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 12px' }}>
        <div style={{ display: 'flex', gap: 6, fontSize: 12, color: TX2, marginBottom: 20 }}>
          <Link href={localePath('/academy', lang)} className="vl-crumb" style={{ color: TX2, textDecoration: 'none' }}>Academy</Link>
          <span>/</span>
          <span style={{ color: TX }}>Video Library</span>
        </div>

        <h1 style={{ fontFamily: 'Sora, system-ui', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 700, color: TX, lineHeight: 1.15, margin: '0 0 12px' }}>
          Video Library
        </h1>
        <p style={{ fontSize: 15, color: TX2, lineHeight: 1.7, maxWidth: 640, margin: '0 0 36px' }}>
          Short walkthroughs of AskBiz, straight from our YouTube channel — this page updates automatically whenever a new video goes live.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
        {videos.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            gap: 14, padding: '64px 24px', background: SF, border: `1px solid ${BD}`, borderRadius: 16,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#fff8f3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <EmptyStateIcon />
            </div>
            <div>
              <div style={{ fontFamily: 'Sora, system-ui', fontSize: 16, fontWeight: 700, color: TX, marginBottom: 6 }}>
                No videos yet
              </div>
              <p style={{ fontSize: 13, color: TX2, lineHeight: 1.6, margin: 0, maxWidth: 320 }}>
                Check back soon — new walkthroughs are added to this page automatically as they're published.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 18 }}>
            {videos.map(v => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .vl-crumb { transition: color 120ms; }
        .vl-crumb:hover, .vl-crumb:focus-visible { color: ${ACC}; text-decoration: underline; }
      `}</style>
    </div>
  )
}
