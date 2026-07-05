'use client'
// ─────────────────────────────────────────────────────────────────────────────
// DEV/PREVIEW ONLY — no auth. The 5 sector analytics tabs with mock data, in the
// visitor's geo-detected currency. The demo itself lives in PosLiveDemo (shared
// with the per-country pages at app/demo/[country]).
// Visit: http://localhost:3000/pos-preview
// ─────────────────────────────────────────────────────────────────────────────
import PosLiveDemo from '@/components/pos/PosLiveDemo'

export default function PosPreviewPage() {
  return <PosLiveDemo />
}
