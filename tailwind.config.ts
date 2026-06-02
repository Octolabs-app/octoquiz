import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#0B1120',
          800: '#0f1628',
          700: '#141d32',
          600: '#1a253d',
          500: '#222f4a',
        },
        brand: {
          gold:   '#C6A87C',
          text:   '#E8E6E1',
          muted:  'rgba(232,230,225,0.45)',
          card:   'rgba(255,255,255,0.03)',
        },
        player: {
          red:    '#ef4444',
          blue:   '#3b82f6',
          green:  '#22c55e',
          yellow: '#eab308',
          orange: '#f97316',
          purple: '#a855f7',
          pink:   '#ec4899',
          cyan:   '#06b6d4',
        },
      },
      fontFamily: {
        display: ['Jura', 'var(--font-display)', 'system-ui', 'sans-serif'],
        body:    ['system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-in':  'bounceIn 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'fade-up':    'fadeUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'score-pop':  'scorePop 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'slide-in':   'slideIn 0.35s ease-out',
        'shake':      'shake 0.4s ease-in-out',
        'ring-pulse': 'ringPulse 0.6s ease-in-out infinite',
        'float-up':   'floatUp 1s ease-out forwards',
      },
      keyframes: {
        bounceIn: {
          '0%':   { transform: 'scale(0.3)', opacity: '0' },
          '50%':  { transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108,99,255,0.4)' },
          '50%':      { boxShadow: '0 0 40px rgba(108,99,255,0.8)' },
        },
        scorePop: {
          '0%':   { transform: 'scale(1)' },
          '30%':  { transform: 'scale(1.4)' },
          '60%':  { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-8px)' },
          '40%':      { transform: 'translateX(8px)' },
          '60%':      { transform: 'translateX(-6px)' },
          '80%':      { transform: 'translateX(6px)' },
        },
        ringPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%':      { transform: 'scale(1.12)', opacity: '0.7' },
        },
        floatUp: {
          '0%':   { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-80px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
