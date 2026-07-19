import { ImageResponse } from 'next/og'
import { markTileSVG, toDataUri } from '@/lib/brand'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Apple touch icon — full mark on the accent tile, mirrors app/icon.svg's tile
// but with the phone+lens detail (viewfinder-only reads better at 16px, full
// mark reads better at 180px). See lib/brand.ts.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width="180" height="180" src={toDataUri(markTileSVG(180))} alt="AskBiz" />
      </div>
    ),
    { ...size },
  )
}
