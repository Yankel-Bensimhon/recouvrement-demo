/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/claims/:path*', // Proxy claim-specific API calls
        destination: `${BACKEND_URL}/api/claims/:path*`,
      },
      {
        source: '/api/auth/:path*', // Proxy auth-specific API calls
        destination: `${BACKEND_URL}/api/auth/:path*`,
      },
      {
        source: '/api/documents/:path*', // Proxy document-specific API calls
        destination: `${BACKEND_URL}/api/documents/:path*`,
      },
      // Note: NextAuth's own API route (`/api/auth/[...nextauth].js`) is handled by Next.js itself
      // and should NOT be proxied by the rule above.
      // The proxy is for YOUR custom backend, not for NextAuth's internal API handlers.
    ]
  },
}

module.exports = nextConfig
