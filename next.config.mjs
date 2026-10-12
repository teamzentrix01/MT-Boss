import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Load env before Next inlines NEXT_PUBLIC_* values (root .env is canonical; src/.env optional).
dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, "src", ".env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    // Compile in the main process and use threads for type checking. This avoids
    // child-process spawn failures on restricted Windows environments.
    webpackBuildWorker: false,
    workerThreads: true,
  },
  // Keep development/HMR artifacts separate from production builds. Running
  // `next build` while `next dev` is open must not replace the live router
  // runtime, otherwise Next can dispatch Link prefetches against an old queue.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  reactCompiler: true,
  images: {
    qualities: [70, 75, 80],
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
