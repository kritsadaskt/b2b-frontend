/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/partners',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://aswinno.assetwise.co.th/APIUAT/:path*',
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
        hostname: 'aswinno.assetwise.co.th',
      },
    ],
  },
};

module.exports = nextConfig;
