// lib/voiceDiscovery.ts
//
// Shared convention for components that manage their own internal tab/sub-view
// state to self-declare voice-navigable sub-routes, right next to the tab
// definitions they already own. Consumed at BUILD TIME by
// scripts/generate-voice-routes.mjs (which statically greps source files for
// a `VOICE_SUBROUTES` export — it does not execute your component). Nothing
// here runs in the browser bundle for classification purposes; this file only
// exports the TYPE and small runtime helpers your component uses to read back
// its own ?sub= param.

export interface VoiceSubroute {
  /** Full resultant path INCLUDING query string, e.g. '/intelligence?tab=cfo&sub=expenses' */
  path: string
  /** Short human label, shown in UI surfaces like HelpWidget's recent-commands list */
  label: string
  /** ONE English sentence. Never write translations by hand — the generator's
   *  translation step (Step 3) produces fr/es/nl/de/sw automatically and caches them. */
  description: string
  /** Set true if this sub-route is only reachable behind a paywall/plan gate.
   *  Discovery DOES NOT exclude locked sub-routes (see generate-voice-routes.mjs
   *  for rationale) — this flag is carried through for future UI use (e.g.
   *  HelpWidget could show a lock icon) but has no effect on whether Groq can
   *  classify to it. */
  locked?: boolean
}

/**
 * Parses `?sub=` from a URLSearchParams-like source and returns it only if it's
 * one of the ids you declared, else falls back to your default. Keeps the
 * "read sub from URL on mount" effect in every adopting component identical
 * instead of every component hand-rolling its own parsing.
 */
export function readSubParam<T extends string>(
  search: URLSearchParams | string,
  validIds: readonly T[],
  fallback: T,
): T {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search
  const raw = params.get('sub')
  return (validIds as readonly string[]).includes(raw || '') ? (raw as T) : fallback
}

/*
 * ── HOW A FUTURE COMPONENT ADOPTS THIS (Stage 2 retrofit pattern) ──────────
 *
 * 1. Next to your existing tab-id array/tab-builder function, export a
 *    VOICE_SUBROUTES constant — one entry per tab, English only. IMPORTANT:
 *    it must be a fully LITERAL array (no .map()/function calls wrapping it),
 *    because the build-time generator extracts it via static regex + a
 *    sandboxed `new Function()` eval of just that array literal — it never
 *    imports or executes your component, so any expression referencing other
 *    module-scope consts (SUB_TAB_IDS.map(...), tc(...), etc.) will not resolve:
 *
 *   export const VOICE_SUBROUTES: VoiceSubroute[] = [
 *     { path: '/intelligence?tab=cfo&sub=expenses', label: 'Expenses', description: 'View and log business expenses' },
 *     { path: '/intelligence?tab=cfo&sub=tax',      label: 'Tax Estimator', description: 'Estimate tax and compliance obligations' },
 *     // ...one literal object per tab
 *   ]
 *
 *   (Labels shown to the USER still go through tc()/locales as normal — this
 *   English label/description pair is ONLY for the voice-nav manifest.)
 *
 * 2. In your mount effect, use readSubParam() instead of hand-rolled parsing:
 *
 *   useEffect(() => {
 *     const sub = readSubParam(window.location.search, SUB_TAB_IDS, 'dashboard')
 *     setSubTab(sub)
 *   }, [])
 *
 * 3. Add your file's path to SUBROUTE_SOURCE_FILES in
 *    scripts/generate-voice-routes.mjs, then run `npm run build` (or
 *    `node scripts/generate-voice-routes.mjs` directly) — the generator
 *    statically finds your VOICE_SUBROUTES export and folds it into
 *    lib/voiceRoutes.ts. Nothing else to wire up by hand.
 *
 * CAVEAT — if the component IS a Next.js `page.tsx` (not a regular
 * component): App Router restricts page.tsx to a fixed set of named exports
 * (default, metadata, generateMetadata, viewport, generateViewport,
 * generateStaticParams, route-segment config). Next.js's generated
 * `.next/types/.../page.ts` type-check fails `tsc --noEmit` on any other named
 * export, including VOICE_SUBROUTES — even though `next build` itself may
 * tolerate it if `typescript.ignoreBuildErrors` is set. Put VOICE_SUBROUTES in
 * a SIBLING file instead (e.g. `voiceSubroutes.ts` next to `page.tsx`) and add
 * that sibling file's path to SUBROUTE_SOURCE_FILES, not the page.tsx path.
 * See app/(app)/intelligence/voiceSubroutes.ts for a worked example.
 */
