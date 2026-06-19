import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // OctoQuiz ships as static Next.js assets. Cloudflare Workers serves these
  // assets and handles room WebSockets through a Durable Object relay.
  output: 'export',
  reactStrictMode: false,
  images: {
    // Static export has no image optimization server; serve images as-is.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com', pathname: '/**' },
    ],
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
