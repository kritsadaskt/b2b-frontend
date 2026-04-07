/** @type {import('next').NextConfig} */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/\/$/, '');

const nextConfig = {
  ...(basePath ? { basePath } : {}),
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.assetwise.co.th/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.assetwise.co.th',
      },
    ],
  },
};

module.exports = nextConfig;
