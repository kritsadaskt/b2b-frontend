/** @type {import('next').NextConfig} */
const baseSegment = (process.env.NEXT_PUBLIC_BASE_PATH || '')
  .trim()
  .replace(/^\/+|\/+$/g, '');
const basePath = baseSegment ? `/${baseSegment}` : '';

const supplierApiBase = (
  process.env.SUPPLIER_API_BASE_URL || 'https://api.assetwise.co.th/api'
)
  .trim()
  .replace(/\/+$/, '');

const nextConfig = {
  ...(basePath ? { basePath } : {}),
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${supplierApiBase}/:path*`,
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
      {
        protocol: 'https',
        hostname: 'aswinno.assetwise.co.th',
      },
    ],
  },
};

module.exports = nextConfig;
