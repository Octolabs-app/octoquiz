'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { generateRoomCode } from '@/lib/supabase'
import AdBanner from '@/components/ui/AdBanner'

const OCTOLABS_LOGO = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="32" cy="26" r="12" fill="#C6A87C"/>
    <circle cx="28" cy="24" r="1.6" fill="#0B1120"/>
    <circle cx="36" cy="24" r="1.6" fill="#0B1120"/>
    <path d="M22,36 Q18,46 20,54" stroke="#C6A87C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M27,37 Q24,47 28,54" stroke="#C6A87C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M32,38 Q32,48 32,54" stroke="#C6A87C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M37,37 Q40,47 36,54" stroke="#C6A87C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M42,36 Q46,46 44,54" stroke="#C6A87C" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
  </svg>
)

const AVATAR_OPTIONS = ['🦑', '🐙', '🦈', '🦊', '🐺', '🐸', '🦁', '🐯'] as const

const GAMES = [
  { icon: '🧠', label: 'Brain Blitz', color: '#C6A87C' },
  { icon: '🏳️', label: 'Flags',       color: '#C6A87C' },
  { icon: '🏙️', label: 'Capitals',    color: '#C6A87C' },
  { icon: '🏛️', label: 'Landmarks',   color: '#C6A87C' },
  { icon: '🕵️', label: 'Imposter',    color: '#C6A87C' },
  { icon: '🎨', label: 'Decoy',       color: '#C6A87C' },
]

export default function HomePage() {
  const router = useRouter()
  const [view,   setView]   = useState<'home' | 'join'>('home')
  const [code,   setCode]   = useState('')
  const [name,   setName]   = useState('')
  const [avatar, setAvatar] = useState<string>(AVATAR_OPTIONS[0])
  const [error,  setError]  = useState('')

  function handleHostRoom() {
    const roomCode = generateRoomCode()
    router.push(`/host?room=${roomCode}`)
  }

  function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim() || !name.trim()) return
    sessionStorage.setItem('playerName',   name.trim())
    sessionStorage.setItem('playerAvatar', avatar)
    router.push(`/join?room=${code.trim().toUpperCase()}`)
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'join' ? (
        <motion.main key="join"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="min-h-screen flex flex-col items-center justify-center p-6 bg-night-900">
          <div className="w-full max-w-sm">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setView('home')}
              className="text-brand-muted hover:text-brand-text mb-8 flex items-center gap-2 text-sm transition-colors">
              ← Back
            </motion.button>
            <h1 className="text-3xl font-black mb-2 text-center font-display text-brand-text">Join a Room</h1>
            <p className="text-brand-muted text-center mb-6 text-sm">Enter the code shown on the TV</p>
            {/* Emoji picker */}
            <div className="mb-6">
              <p className="text-brand-muted text-xs uppercase tracking-widest mb-3 text-center">Pick your avatar</p>
              <div className="grid grid-cols-8 gap-2">
                {AVATAR_OPTIONS.map(em => (
                  <button key={em} onClick={() => setAvatar(em)} className="text-2xl rounded-xl py-2 transition-all"
                    style={{
                      background: avatar === em ? 'rgba(198,168,124,0.2)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${avatar === em ? '#C6A87C' : 'rgba(198,168,124,0.12)'}`,
                      transform: avatar === em ? 'scale(1.15)' : 'scale(1)',
                    }}>{em}</button>
                ))}
              </div>
            </div>
            <form onSubmit={handleJoin} className="space-y-3">
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE" maxLength={5}
                className="w-full rounded-2xl px-5 py-4 text-2xl font-black text-center tracking-[0.3em] outline-none border transition-all uppercase placeholder:text-brand-muted"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(198,168,124,0.12)', color: '#E8E6E1' }}
                autoFocus />
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" maxLength={16}
                className="w-full rounded-2xl px-5 py-4 text-lg outline-none border transition-all placeholder:text-brand-muted"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(198,168,124,0.12)', color: '#E8E6E1' }} />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <motion.button type="submit" whileTap={{ scale: 0.96 }}
                disabled={!code.trim() || !name.trim()}
                className="w-full rounded-2xl py-5 text-lg font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed font-display"
                style={{ background: 'linear-gradient(135deg, #C6A87C, #a8894e)', color: '#0B1120', boxShadow: '0 12px 30px -10px rgba(198,168,124,0.4)' }}>
                {avatar} Join Game →
              </motion.button>
            </form>
          </div>
        </motion.main>
      ) : (
        <motion.main key="home"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen flex flex-col items-center justify-center p-6 bg-night-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.16, 0.08] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full blur-3xl"
              style={{ background: 'rgba(198,168,124,0.15)' }} />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full blur-3xl"
              style={{ background: 'rgba(198,168,124,0.10)' }} />
          </div>
          <div className="relative z-10 w-full max-w-md text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-5"
                style={{ background: '#0f1628', border: '1.5px solid rgba(198,168,124,0.25)', boxShadow: '0 20px 60px -15px rgba(198,168,124,0.25)' }}>
                <div className="w-14 h-14">{OCTOLABS_LOGO}</div>
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-5xl font-black mb-1 font-display" style={{ color: '#C6A87C' }}>
              OctoQuiz
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="mb-10 text-sm uppercase tracking-[0.3em]" style={{ color: 'rgba(232,230,225,0.4)' }}>
              by Octolabs
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="space-y-3">
              <motion.button onClick={handleHostRoom} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full rounded-2xl py-5 text-xl font-bold text-night-900 transition-all font-display"
                style={{ background: 'linear-gradient(135deg, #C6A87C, #a8894e)', boxShadow: '0 16px 40px -12px rgba(198,168,124,0.4)' }}>
                📺 Host on TV
              </motion.button>
              <motion.button onClick={() => setView('join')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full rounded-2xl py-5 text-xl font-bold transition-all font-display"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(198,168,124,0.20)', color: '#E8E6E1' }}>
                📱 Join as Player
              </motion.button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="mt-8 grid grid-cols-3 gap-2">
              {GAMES.map((g, i) => (
                <motion.div key={g.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="rounded-2xl py-3.5 text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(198,168,124,0.12)' }}>
                  <div className="text-2xl mb-1">{g.icon}</div>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(232,230,225,0.45)' }}>{g.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Non-invasive ad — below game chips, only on home screen */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="mt-6">
              <AdBanner variant="banner" />
            </motion.div>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  )
}
