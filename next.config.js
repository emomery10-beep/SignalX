/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: remove once pre-existing TS errors are fixed across the codebase
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
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
