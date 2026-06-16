/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    if (!process.env.API_PROXY_URL) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_PROXY_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
