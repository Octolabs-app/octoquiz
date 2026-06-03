/** @type {import('next').NextConfig} */
const nextConfig = {
  // OctoQuiz is a fully client-side SPA (Supabase Realtime, no server routes),
  // so we ship a static export and host it on Cloudflare Pages — no Node server.
  output: 'export',
  reactStrictMode: false,
  images: {
    // Static export has no image optimization server; serve images as-is.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com', pathname: '/**' },
    ],
  },
}

export default nextConfig
