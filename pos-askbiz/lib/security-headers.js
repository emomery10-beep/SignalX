// Security headers for pos.askbiz.co.
//
// This app shipped with NO security headers at all — no CSP, no HSTS, no
// X-Frame-Options, no nosniff — while being the app cashiers use on shared
// devices to enter staff PINs and take payments. That gap was found during the
// 2026-08-15 blind-XSS review; this file closes it.
//
// Plain CommonJS `.js` on purpose, same as the root app's lib/security-headers.js:
// next.config.js is loaded by Node as CommonJS at build time and cannot require
// a `.ts` file. Do not convert it to TypeScript.
//
// The CSP here is applied REPORT-ONLY (see next.config.js). Handing an app its
// first-ever CSP as an enforced policy is how you take a till offline in the
// middle of a trading day; report-only gives us the same information with none
// of that risk. Promote it to enforced once /api/csp-report comes back quiet.

// Client-side third-party surface, established by inventory rather than guessed:
//   - Leaflet is loaded from the unpkg CDN at runtime (app/(app)/pos/page.tsx and
//     app/intelligence/page.tsx inject both its <script> and its stylesheet), so
//     unpkg needs script-src AND style-src.
//   - OpenStreetMap raster tiles are <img> loads, so they belong in img-src.
//   - Everything else the browser talks to is same-origin /api/* or Supabase.
//     There is no client-side Stripe.js, no Google Fonts, no analytics pixel and
//     no iframe anywhere in this app — hence no frame-src entry and no
//     'unsafe-eval'. If any of that changes, the report data will say so.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://unpkg.com",
  "font-src 'self' data:",
  // data:/blob: are load-bearing here, not incidental: this is a camera-first
  // POS and every captured photo is previewed from a data: or blob: URL before
  // upload (components/ui/CameraCapture.tsx).
  "img-src 'self' data: blob: https://*.supabase.co https://*.tile.openstreetmap.org",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  // The PWA service worker (@ducanh2912/next-pwa) registers from this origin.
  // worker-src would otherwise fall back through child-src to script-src, which
  // happens to allow it today — stated explicitly so a later script-src change
  // cannot silently break offline mode.
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Nothing embeds pos.askbiz.co: the main app links to it with
  // target="_blank" throughout and the one old cashier <iframe> was replaced by
  // components/marketing/InteractivePosDemo.tsx in the root app.
  "frame-ancestors 'none'",
  'report-uri /api/csp-report',
].join('; ')

// NOTE for whoever promotes this to enforced: add 'upgrade-insecure-requests'
// at that point. It is deliberately absent here because browsers ignore it in a
// report-only policy and log a console error for it on every page load, which
// on a till would be permanent noise for zero benefit. Strict-Transport-Security
// (enforced below) already covers the mixed-content case in the meantime.

// Non-CSP headers. These are safe to ENFORCE immediately — none of them can
// break a page the way a missing CSP host can.
//
// Permissions-Policy mirrors the root app's exactly. camera=(self) grants
// same-origin camera access, which is what this app needs (it is not framed, so
// there is no cross-origin delegation to worry about) — getUserMedia is used
// across intake, stocktake, waste, deliveries and salon flows.
const SECURITY_HEADERS = [
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(self), microphone=(self), geolocation=(self)' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

module.exports = { CONTENT_SECURITY_POLICY, SECURITY_HEADERS }
