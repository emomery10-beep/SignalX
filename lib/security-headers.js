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
  "frame-src https://js.stripe.com https://hooks.stripe.com https://pos.askbiz.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

module.exports = { CONTENT_SECURITY_POLICY }
