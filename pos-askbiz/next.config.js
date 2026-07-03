const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    // Custom runtime caching — the default config is tuned for content sites,
    // not a POS whose real offline data source is the IndexedDB inventory
    // mirror (lib/pos-inventory-cache.ts), not the HTTP cache.
    runtimeCaching: [
      {
        // Hashed static assets — safe to cache indefinitely.
        urlPattern: /^\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'pos-static-assets',
          expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
      {
        urlPattern: /\/(manifest\.json|favicon\.svg)$/i,
        handler: 'CacheFirst',
        options: { cacheName: 'pos-static-misc', expiration: { maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 } },
      },
      {
        // Page navigations — cache fallback lets a cold offline boot render
        // the last-seen shell instead of the browser's offline error page.
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        method: 'GET',
        options: { cacheName: 'pos-pages', networkTimeoutSeconds: 3, expiration: { maxEntries: 40, maxAgeSeconds: 7 * 24 * 60 * 60 } },
      },
      {
        // Secondary safety net only — the authoritative offline inventory
        // source is the IndexedDB mirror, which handles arbitrary search
        // terms this HTTP cache (keyed on exact query string) cannot.
        urlPattern: /\/api\/pos\/(inventory|config)(\?.*)?$/i,
        handler: 'NetworkFirst',
        method: 'GET',
        options: { cacheName: 'pos-api-fallback', networkTimeoutSeconds: 3, expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 } },
      },
      {
        // Secondary safety net for logistics — the IndexedDB resource
        // cache (lib/pos-resource-cache.ts) is the authoritative offline
        // source, same rationale as the inventory block above.
        urlPattern: /\/api\/pos\/(parcels|routes)(\?.*)?$/i,
        handler: 'NetworkFirst',
        method: 'GET',
        options: { cacheName: 'pos-api-fallback-2', networkTimeoutSeconds: 3, expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 } },
      },
      {
        // Every other API GET stays live-only — not part of this phase's offline surface.
        urlPattern: /\/api\/pos\/.*/i,
        handler: 'NetworkOnly',
        method: 'GET',
      },
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
  skipStaticOptimization: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  },
}
module.exports = withPWA(nextConfig)
