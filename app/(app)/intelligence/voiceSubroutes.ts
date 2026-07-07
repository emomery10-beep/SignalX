// ── Voice-nav self-declaration for app/(app)/intelligence/page.tsx ──
//
// Lives in a SIBLING file, not inside page.tsx itself, because Next.js's App
// Router restricts page.tsx files to a fixed set of named exports (default,
// metadata, generateMetadata, viewport, generateViewport,
// generateStaticParams, and a few route-segment config fields) and enforces
// this via a generated .next/types/.../page.ts type-check — any other named
// export (like VOICE_SUBROUTES) fails that check under `tsc --noEmit`, even
// though `next build` itself tolerates it when `ignoreBuildErrors` is set.
// Keeping the convention's exported const out of page.tsx avoids that
// entirely, at zero cost to the "self-declaring, right next to the component
// that owns the tabs" goal — this file sits directly beside page.tsx.
//
// See lib/voiceDiscovery.ts for the VOICE_SUBROUTES convention itself.
// scripts/generate-voice-routes.mjs reads THIS file (not page.tsx) for the
// intelligence page's top-level tabs.
//
// English only, module-level literal array. 'overview' is omitted — it's the
// bare /intelligence route, already covered by static page discovery. 'cfo'
// is marked locked: true as a literal (not `!canCfo`, which is a runtime
// value the generator cannot evaluate) — see lib/voiceDiscovery.ts: locked is
// informational only and never excludes a route from the whitelist.
//
// 'zakat' is deliberately NOT included here yet — the Zakat calculator
// feature is still mid-rollout (see project memory: phases 5/6 paused
// pending a charity-directory conversation and a migration apply), so it is
// intentionally kept out of voice-nav for now. Add it back here once that
// feature is fully live.
//
// Keep this in sync with the `tabs` array inside page.tsx (same ids, same
// set of tabs minus 'overview' and 'zakat').

import type { VoiceSubroute } from '@/lib/voiceDiscovery'

export const VOICE_SUBROUTES: VoiceSubroute[] = [
  { path: '/intelligence?tab=cfo', label: 'CFO Dashboard', description: 'Open the CFO financial intelligence dashboard', locked: true },
  { path: '/intelligence?tab=team', label: 'Team', description: 'View team performance panel' },
  { path: '/intelligence?tab=logistics', label: 'Logistics', description: 'View shipments and courier logistics' },
  { path: '/intelligence?tab=market', label: 'Market', description: 'View market and cross-sector intelligence' },
  { path: '/intelligence?tab=actions', label: 'Actions', description: 'View recommended daily actions' },
]
