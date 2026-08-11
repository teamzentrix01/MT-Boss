import dotenv from "dotenv";

// This project keeps its environment file under src/.env.
// Load it before Next.js inlines NEXT_PUBLIC_* values into client bundles.
dotenv.config({ path: "src/.env" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/construction',
        destination: '/Services/all',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    if (!process.env.API_PROXY_URL) {
      return [];
    }

    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.API_PROXY_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
