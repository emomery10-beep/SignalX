/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: remove once pre-existing TS errors are fixed across the codebase
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    return [
      // /og-image.png is referenced by OG/Twitter/schema metadata across the
      // site but never existed as a static file (it 404'd). Serve it from the
      // dynamic OG generator's brand card.
      { source: '/og-image.png', destination: '/api/og?mode=brand' },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'X-Content-Type-Options',      value: 'nosniff' },
          { key: 'Referrer-Policy',             value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',          value: 'camera=(self), microphone=(), geolocation=(self)' },
          { key: 'Strict-Transport-Security',    value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy',     value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://analytics.tiktok.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://js.stripe.com https://api.stripe.com https://www.google-analytics.com https://*.vercel-insights.com https://*.vercel-analytics.com https://api.tavily.com https://*.tile.openstreetmap.org https://analytics.tiktok.com https://ads.tiktok.com; frame-src https://js.stripe.com https://hooks.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
      {
        // Force-revalidate sitemaps so Google always gets fresh content
        source: '/sitemap/:path*',
        headers: [
          { key: 'Cache-Control',         value: 'public, max-age=0, must-revalidate' },
          { key: 'CDN-Cache-Control',      value: 'max-age=0' },
          { key: 'Vercel-CDN-Cache-Control', value: 'max-age=0' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control',         value: 'public, max-age=0, must-revalidate' },
          { key: 'CDN-Cache-Control',      value: 'max-age=0' },
          { key: 'Vercel-CDN-Cache-Control', value: 'max-age=0' },
        ],
      },
      {
        // Apply CORS to every /api/pos/* route so pos.askbiz.co can call them
        source: '/api/pos/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: 'https://pos.askbiz.co' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, x-staff-id, x-owner-id' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
