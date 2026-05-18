/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: remove once pre-existing TS errors are fixed across the codebase
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
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
