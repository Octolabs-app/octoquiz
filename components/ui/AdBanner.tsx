'use client'
import { useEffect, useState } from 'react'

/**
 * Non-invasive ad banner for OctoQuiz.
 *
 * Placement rules:
 * - ✅ Home page (below game chips)
 * - ✅ Results/game-over screen (above play again)
 * - ✅ Lobby (sidebar, subtle)
 * - ❌ NEVER during active gameplay
 * - ❌ NEVER as popups or overlays
 *
 * Currently shows Octolabs self-promo. To switch to AdSense:
 * 1. Add <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossorigin="anonymous"></script> to layout.tsx <head>
 * 2. Replace the self-promo content with: <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXX" data-ad-slot="YYYYYYY" .../>
 */

type AdVariant = 'banner' | 'card' | 'inline'

interface AdBannerProps {
  variant?: AdVariant
  className?: string
}

const PROMOS = [
  {
    title: 'ArtisanMU',
    desc: 'Find local artisans in Mauritius — plumbers, electricians, tilers & more',
    url: 'https://artisanmu.octolabs.app',
    emoji: '🔧',
    tag: 'Marketplace',
  },
  {
    title: 'AniCal',
    desc: 'Track every anime airing schedule — clean, ad-free, no account needed',
    url: 'https://anical.octolabs.app',
    emoji: '📺',
    tag: 'App',
  },
  {
    title: 'Octolabs',
    desc: 'We build practical tools for real people. Made in Mauritius 🇲🇺',
    url: 'https://octolabs.app',
    emoji: '🐙',
    tag: 'Studio',
  },
]

export default function AdBanner({ variant = 'banner', className = '' }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [promoIndex, setPromoIndex] = useState(0)
  const promo = PROMOS[promoIndex]

  useEffect(() => {
    setPromoIndex(Math.floor(Math.random() * PROMOS.length))
  }, [])

  if (dismissed) return null

  if (variant === 'banner') {
    return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        <a
          href={promo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(198,168,124,0.08)',
            padding: '12px 16px',
            textDecoration: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>{promo.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#C6A87C', letterSpacing: '0.3px' }}>
                  {promo.title}
                </span>
                <span style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' as const,
                  color: 'rgba(198,168,124,0.5)', background: 'rgba(198,168,124,0.08)',
                  padding: '2px 6px', borderRadius: 4,
                }}>
                  {promo.tag}
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(232,230,225,0.35)', lineHeight: 1.4, margin: 0 }}>
                {promo.desc}
              </p>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(198,168,124,0.3)', flexShrink: 0 }}>→</span>
          </div>
          <div style={{
            fontSize: 8, color: 'rgba(232,230,225,0.15)', textAlign: 'right' as const,
            marginTop: 4, letterSpacing: '0.5px',
          }}>
            Ad · Octolabs
          </div>
        </a>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`w-full max-w-sm mx-auto ${className}`}>
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: 'rgba(198,168,124,0.04)',
            border: '1px solid rgba(198,168,124,0.12)',
            padding: '20px 20px 16px',
          }}
        >
          {/* Dismiss X */}
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed(true) }}
            aria-label="Dismiss ad"
            style={{
              position: 'absolute', top: 8, right: 10,
              background: 'none', border: 'none', color: 'rgba(232,230,225,0.2)',
              fontSize: 14, cursor: 'pointer', padding: 4, lineHeight: 1,
            }}
          >
            ✕
          </button>
          <a
            href={promo.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>{promo.emoji}</span>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#C6A87C', marginBottom: 4 }}>
                {promo.title}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(232,230,225,0.4)', lineHeight: 1.5, margin: '0 0 12px' }}>
                {promo.desc}
              </p>
              <span
                className="font-display"
                style={{
                  display: 'inline-block', fontSize: 11, fontWeight: 700,
                  padding: '8px 20px', borderRadius: 10,
                  background: 'rgba(198,168,124,0.12)', border: '1px solid rgba(198,168,124,0.2)',
                  color: '#C6A87C', letterSpacing: '0.5px',
                }}
              >
                Check it out →
              </span>
            </div>
          </a>
          <div style={{
            fontSize: 8, color: 'rgba(232,230,225,0.12)', textAlign: 'center' as const,
            marginTop: 10, letterSpacing: '0.5px',
          }}>
            Sponsored · Octolabs
          </div>
        </div>
      </div>
    )
  }

  // inline — minimal text link
  return (
    <div className={`text-center ${className}`}>
      <a
        href={promo.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 10, color: 'rgba(198,168,124,0.35)', textDecoration: 'none',
          letterSpacing: '0.5px', transition: 'color 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.color = 'rgba(198,168,124,0.6)')}
        onMouseOut={e => (e.currentTarget.style.color = 'rgba(198,168,124,0.35)')}
      >
        {promo.emoji} {promo.title} — {promo.desc}
      </a>
    </div>
  )
}
