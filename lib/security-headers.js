// Single source of truth for the Content-Security-Policy.
//
// This directive is applied in TWO places that must stay in sync:
//   1. next.config.js  — static `headers()` for normal responses
//   2. middleware.ts   — re-applied on redirect/rewrite responses, which
//                        bypass next.config's headers()
// They previously held separate copies of the string, which drifted (a GA4
// host was added to one but not the other, breaking analytics under CSP).
// Keep the policy here and import it in both.
//
// IMPORTANT: this file is plain CommonJS `.js` on purpose. next.config.js is
// loaded by Node as CommonJS at build time and cannot `require` a `.ts` file,
// so this must remain requireable by both Node (config) and the edge runtime
// (middleware). Do not convert it to TypeScript.

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://analytics.tiktok.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https: http:",
  // connect-src: GA4 with Google Signals beacons to analytics.google.com and
  // www.google.com in addition to the regional *.google-analytics.com hosts.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://js.stripe.com https://api.stripe.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.google.com https://*.vercel-insights.com https://*.vercel-analytics.com https://api.tavily.com https://*.tile.openstreetmap.org https://analytics.tiktok.com https://ads.tiktok.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://pos.askbiz.co https://www.youtube.com https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // The CSP equivalent of the X-Frame-Options: DENY already set alongside this
  // policy. Verified safe: the only iframes in the app are YouTube embeds
  // (frame-src, above), nothing embeds askbiz.co itself, and the Shopify app is
  // `embedded = false` so it is not framed inside Shopify admin either.
  "frame-ancestors 'none'",
  // Belt-and-braces with HSTS: rewrite any stray http:// subresource to https
  // rather than having it blocked as mixed content.
  'upgrade-insecure-requests',
].join('; ')

// ── Report-only policy: the next tightening, measured before it is enforced ──
//
// There is no staging environment (one production Supabase, real daily users),
// so restrictions ship as Content-Security-Policy-Report-Only FIRST, alongside
// the enforced policy above. The browser reports what *would* have broken to
// /api/csp-report without blocking anything. Read a week of real traffic, then
// fold clean directives into the enforced policy.
//
// Only two things differ from the enforced policy — keep it that way, or the
// reports stop telling you which change caused them:
//
//   1. img-src is narrowed from `https: http:` to an allow-list. This is the
//      exfiltration channel that mattered in the 2026-08-15 XSS review: with
//      `img-src https:`, injected script can beacon stolen data to any host by
//      setting an image URL. The allow-list below was derived by inventory:
//      /public assets and Next's optimiser ('self'), camera captures and canvas
//      previews (data:/blob:), Supabase Storage (product photos, spotlight
//      logos/banners), OpenStreetMap raster tiles for the POS sales map
//      (app/(app)/pos/page.tsx), and YouTube thumbnails, which lib/youtube-feed.ts
//      builds per video id at runtime. Avatars render as initials, not images.
//
//      That last host is the argument for this whole report-only step: a static
//      read of the codebase missed it (the URL is assembled from a template, so
//      it greps for nothing), and loading the homepage once under the report-only
//      header surfaced it immediately. Enforcing straight away would have blanked
//      every thumbnail on the landing page.
//   2. 'unsafe-eval' is dropped. No browser-runtime eval/new Function exists in
//      app code — the one hit, lib/voiceDiscovery.ts, documents a build-time
//      generator. Third-party is the open question (the TikTok pixel most
//      likely), which is exactly what the report data settles.
//
// 'unsafe-inline' deliberately stays in script-src here. Removing it requires
// per-request nonces, and Next only propagates a nonce it finds in the ENFORCED
// header — so dropping it in report-only mode would report every one of Next's
// own streaming inline scripts and bury the two signals above in noise. The
// nonce cutover is a separate change that needs a preview deployment.
const CONTENT_SECURITY_POLICY_REPORT_ONLY = CONTENT_SECURITY_POLICY
  // Browsers ignore upgrade-insecure-requests in a report-only policy and log a
  // console error for it on every page load. It is already active in the
  // enforced policy above, so strip it from the derived copy rather than ship a
  // permanent console error to every visitor.
  .replace('; upgrade-insecure-requests', '')
  .replace(
    "img-src 'self' data: blob: https: http:",
    "img-src 'self' data: blob: https://*.supabase.co https://*.tile.openstreetmap.org https://i.ytimg.com",
  )
  .replace(" 'unsafe-eval'", '')
  + '; report-uri /api/csp-report'

module.exports = { CONTENT_SECURITY_POLICY, CONTENT_SECURITY_POLICY_REPORT_ONLY }
