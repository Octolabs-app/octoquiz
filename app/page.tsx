'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '@/hooks/useSocket'

// Escalates wording with elapsed time so users understand the ~30s
// free-tier cold start instead of staring at a stuck spinner.
function ConnectingLabel() {
  const [s, setS] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setS(v => v + 1), 1000)
    return () => clearInterval(t)
  }, [])
  if (s < 3)  return <span>Connecting to server…</span>
  if (s < 12) return <span>☕ Waking up the server — ~30s on free tier ({s}s)</span>
  if (s < 45) return <span>☕ Almost there… ({s}s)</span>
  return <span>😬 Server slow — try refreshing the page</span>
}

const GAMES = [
  { icon: '🧠', label: 'Trivia',   color: '#3b82f6' },
  { icon: '🏳️', label: 'Flags',    color: '#22c55e' },
  { icon: '🕵️', label: 'Imposter', color: '#a855f7' },
  { icon: '🎲', label: 'T or D',   color: '#f97316' },
]

export default function HomePage() {
  const router   = useRouter()
  const { socket, connected } = useSocket()
  const [view,    setView]    = useState<'home' | 'join'>('home')
  const [code,    setCode]    = useState('')
  const [name,    setName]    = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleHostRoom() {
    if (!socket) return
    setLoading(true)
    socket.emit('host_create_room', (roomCode) => {
      router.push(`/host/${roomCode}`)
    })
  }

  function handleJoinRoom(e: React.FormEvent) {
    e.preventDefault()
    if (!socket || !code.trim() || !name.trim()) return
    setError(''); setLoading(true)
    socket.emit('player_join', code.trim().toUpperCase(), name.trim(), (err, room) => {
      setLoading(false)
      if (err) { setError(err); return }
      if (room) {
        sessionStorage.setItem('playerName', name.trim())
        router.push(`/join/${room.code}`)
      }
    })
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'join' ? (
        <motion.main key="join"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="min-h-screen flex flex-col items-center justify-center p-6 bg-night-900">
          <div className="w-full max-w-sm">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('home')}
              className="text-white/40 hover:text-white mb-8 flex items-center gap-2 text-sm transition-colors">
              ← Back
            </motion.button>
            <h1 className="text-3xl font-black mb-2 text-center">Join a Room</h1>
            <p className="text-white/50 text-center mb-8 text-sm">Enter the code shown on the TV</p>
            <form onSubmit={handleJoinRoom} className="space-y-3">
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                maxLength={4}
                className="w-full glass rounded-2xl px-5 py-4 text-2xl font-black text-center tracking-[0.3em] outline-none focus:border-purple-500 border border-transparent transition-all uppercase placeholder:text-white/20"
                autoFocus
              />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                maxLength={16}
                className="w-full glass rounded-2xl px-5 py-4 text-lg outline-none focus:border-purple-500 border border-transparent transition-all placeholder:text-white/30"
              />
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-red-400 text-sm text-center">{error}</motion.p>
                )}
              </AnimatePresence>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                disabled={!connected || loading || !code.trim() || !name.trim()}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl py-4 text-lg font-bold transition-colors">
                {loading ? 'Joining…' : 'Join Game →'}
              </motion.button>
            </form>
          </div>
        </motion.main>
      ) : (
        <motion.main key="home"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen flex flex-col items-center justify-center p-6 bg-night-900 relative overflow-hidden">

          {/* Background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-purple-600/20 rounded-full blur-3xl" />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.22, 0.12] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-3xl" />
            <motion.div animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 w-full max-w-md text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-5 text-5xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 20px 60px -15px rgba(124,58,237,0.6)' }}>
                🎮
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-5xl font-black mb-1 bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Game Night
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-white/40 mb-10 text-sm uppercase tracking-[0.3em]">
              by Yomu Studio
            </motion.p>

            {/* Action buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="space-y-3">
              <motion.button
                onClick={handleHostRoom}
                disabled={!connected || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-2xl py-5 text-xl font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 16px 40px -12px rgba(124,58,237,0.5)' }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating…
                  </span>
                ) : '📺 Host on TV'}
              </motion.button>

              <motion.button
                onClick={() => setView('join')}
                disabled={!connected}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full glass hover:bg-white/10 disabled:opacity-40 rounded-2xl py-5 text-xl font-bold transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                📱 Join as Player
              </motion.button>
            </motion.div>

            {/* Game chips */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="mt-8 grid grid-cols-4 gap-2.5">
              {GAMES.map((g, i) => (
                <motion.div key={g.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="glass rounded-2xl py-3.5 text-center"
                  style={{ border: `1px solid ${g.color}22` }}>
                  <div className="text-2xl mb-1">{g.icon}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">{g.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* After Dark section */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="mt-8 w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'oklch(0.62 0.24 18 / 0.2)' }} />
                <span className="text-[9px] uppercase tracking-[0.4em] font-semibold px-2"
                  style={{ color: 'oklch(0.62 0.24 18 / 0.6)' }}>18+ only</span>
                <div className="flex-1 h-px" style={{ background: 'oklch(0.62 0.24 18 / 0.2)' }} />
              </div>

              <Link href="/couples"
                className="group block w-full rounded-3xl p-5 transition-all active:scale-[0.98] relative overflow-hidden"
                style={{ background: 'oklch(0.13 0.04 15)', border: '1px solid oklch(0.62 0.24 18 / 0.3)', boxShadow: '0 0 50px -20px oklch(0.62 0.24 18 / 0.45)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%, oklch(0.62 0.24 18 / 0.12), transparent 70%)' }} />
                <div className="relative flex items-center gap-4">
                  <motion.div animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-4xl">🕯️</motion.div>
                  <div className="flex-1 text-left">
                    <div className="font-black text-lg leading-tight" style={{
                      background: 'linear-gradient(135deg, oklch(0.62 0.24 18), oklch(0.72 0.18 350) 60%, oklch(0.55 0.18 320))',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>After Dark</div>
                    <div className="text-xs mt-0.5" style={{ color: 'oklch(0.58 0.04 30)' }}>
                      Intimate couples game · 18+ · For two
                    </div>
                  </div>
                  <span className="text-sm font-bold transition-transform group-hover:translate-x-1"
                    style={{ color: 'oklch(0.62 0.24 18 / 0.5)' }}>→</span>
                </div>
                <div className="relative mt-3 flex gap-2 flex-wrap">
                  {['Truth or Dare', 'Kama Sutra 🌹', 'Hot Seat 🔥', 'Wheel', 'Never Have I Ever', 'Quiz'].map(tag => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full"
                      style={{ background: 'oklch(0.62 0.24 18 / 0.1)', border: '1px solid oklch(0.62 0.24 18 / 0.18)', color: 'oklch(0.72 0.18 350 / 0.7)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>

            {/* Connection status — escalates after 3s to admit the cold start */}
            <AnimatePresence>
              {!connected && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-5 text-center text-sm">
                  <div className="flex items-center justify-center gap-2 text-yellow-400/80">
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-400/60 animate-pulse" />
                    <ConnectingLabel />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  )
}
