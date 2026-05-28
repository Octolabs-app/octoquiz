import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// STATIC_EXPORT=1 → static `out/` for the Capacitor APK (offline After Dark).
// Default (unset) → normal Next.js + Socket.IO server build.
const isApkBuild = process.env.STATIC_EXPORT === '1'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: __dirname,
  ...(isApkBuild
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: {
          remotePatterns: [
            { protocol: 'https', hostname: 'flagcdn.com', pathname: '/**' },
          ],
        },
      }),
}

export default nextConfig
