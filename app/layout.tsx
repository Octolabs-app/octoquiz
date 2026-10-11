import type { Metadata, Viewport } from 'next'
import StudioFrame from '@/components/ui/StudioFrame'
import './globals.css'
import './studio.css'



export const metadata: Metadata = {
  title: 'OctoQuiz — by Octolabs',
  icons: {icon: '/octoquiz.svg'},
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


  themeColor: '#f3f4ed',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body className="min-h-screen bg-night-900 text-brand-text antialiased">
        <StudioFrame>{children}</StudioFrame>
      </body>
    </html>
  )
}
