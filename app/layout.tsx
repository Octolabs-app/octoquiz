import type { Metadata, Viewport } from 'next'
import { Jura } from 'next/font/google'
import './globals.css'

const jura = Jura({ subsets: ['latin'], variable: '--font-display', weight: ['400', '600', '700'] })

export const metadata: Metadata = {
  title: 'OctoQuiz',
  description: 'Multiplayer party trivia by Octolabs — Trivia, Flag Quiz, Imposter & more',
  openGraph: {
    title: 'OctoQuiz',
    description: 'Multiplayer party trivia by Octolabs',
    siteName: 'OctoQuiz',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0B1120',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jura.variable}>
      <body className="min-h-screen bg-night-900 text-brand-text antialiased">
        {children}
      </body>
    </html>
  )
}
