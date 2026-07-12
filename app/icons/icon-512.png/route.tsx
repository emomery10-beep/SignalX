import { ImageResponse } from 'next/og'
import { markTileSVG, toDataUri } from '@/lib/brand'

export const runtime = 'edge'

// PWA icon (512×512) referenced by public/manifest.json and the Organization schema logo.
export function GET() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width="512" height="512" src={toDataUri(markTileSVG(512))} alt="AskBiz" />
      </div>
    ),
    { width: 512, height: 512 },
  )
}
