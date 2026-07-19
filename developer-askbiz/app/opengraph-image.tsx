import { ImageResponse } from 'next/og'
import { markTileSVG, toDataUri } from '@/lib/brand'

export const runtime = 'edge'
export const alt = 'AskBiz Developers'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Default social card for every page that doesn't set its own — App Router
// file convention picks this up automatically. Static, not per-page dynamic
// (unlike the root marketing site's satori-based /api/og) — deliberately
// simple, this app has no per-page hero imagery to render into a card.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#04080f',
          gap: 36,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width="140" height="140" src={toDataUri(markTileSVG(140))} alt="" />
        <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, color: '#eaf0fb', letterSpacing: '-0.02em' }}>
          AskBiz Developers
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#5280cc' }}>
          Vision, WhatsApp, and business-intelligence APIs
        </div>
      </div>
    ),
    { ...size },
  )
}
