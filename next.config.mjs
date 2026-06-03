/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js build — @cloudflare/next-on-pages converts to CF Pages format
  // Run: npx @cloudflare/next-on-pages  (on Linux / CF Pages build environment)
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com', pathname: '/**' },
    ],
  },
}

export default nextConfig
