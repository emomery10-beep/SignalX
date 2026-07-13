import { ImageResponse } from 'next/og'
import { markTileSVG, toDataUri } from '@/lib/brand'

export const runtime = 'edge'

// PWA icon (192×192) referenced by public/manifest.json.
export function GET() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width="192" height="192" src={toDataUri(markTileSVG(192))} alt="AskBiz" />
      </div>
    ),
    { width: 192, height: 192 },
  )
}
