'use client'

import Link from 'next/link'
import { useLang } from '@/components/LanguageProvider'
import { localePath } from '@/lib/i18n-locale'
import { VideoCard } from '@/components/marketing/VideoReel'
import type { YoutubeVideo } from '@/lib/youtube-feed'

const ACC = '#d08a59'
const BG  = '#f9f8f6'
const TX  = '#171512'
const TX2 = '#5c574f'
const BD  = '#e8e6e1'

export default function VideoLibraryClient({ videos }: { videos: YoutubeVideo[] }) {
  const { lang } = useLang()

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 12px' }}>
        <div style={{ display: 'flex', gap: 6, fontSize: 12, color: TX2, marginBottom: 20 }}>
          <Link href={localePath('/academy', lang)} style={{ color: TX2, textDecoration: 'none' }}>Academy</Link>
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
          <p style={{ color: TX2, fontSize: 14 }}>No videos yet — check back soon.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 18 }}>
            {videos.map(v => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
