import dotenv from "dotenv";

// This project keeps its environment file under src/.env.
// Load it before Next.js inlines NEXT_PUBLIC_* values into client bundles.
dotenv.config({ path: "src/.env" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Keep development/HMR artifacts separate from production builds. Running
  // `next build` while `next dev` is open must not replace the live router
  // runtime, otherwise Next can dispatch Link prefetches against an old queue.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: '**.pinimg.com' },
    ],
  },

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
