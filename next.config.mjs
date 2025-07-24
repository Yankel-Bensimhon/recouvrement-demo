/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/claims/:path*',
        destination: 'http://localhost:3001/api/claims/:path*',
      },
      {
        source: '/api/auth/signup',
        destination: 'http://localhost:3001/api/auth/signup',
      },
    ]
  },
};

export default nextConfig;
