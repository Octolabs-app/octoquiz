'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoomPublic } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'
import QRCodeDisplay from '@/components/ui/QRCode'
import PlayerBadge from '@/components/ui/PlayerBadge'
import { useTVModeState, TVModeContext } from '@/hooks/useTVMode'

interface Props {
  room: RoomPublic
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

export default function HostLobby({ room, socket }: Props) {
  const [joinUrl, setJoinUrl] = useState('')
  const tvModeState = useTVModeState()
  const { tvMode, toggleTVMode } = tvModeState

  useEffect(() => {
    const base = window.location.origin
    setJoinUrl(`${base}/join/${room.code}`)
  }, [room.code])

  const canStart = room.players.length >= 1

  return (
    <TVModeContext.Provider value={tvModeState}>
    <div className={`min-h-screen bg-night-900 flex flex-col no-select relative overflow-hidden ${tvMode ? 'p-4' : 'p-8'}`}
      style={tvMode ? { fontSize: '1.4em' } : undefined}>
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 w-[32rem] h-[32rem] bg-purple-900/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-[28rem] h-[28rem] bg-blue-900/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-8">
        <div>
          {!tvMode && <p className="text-white/20 text-xs uppercase tracking-[0.4em] mb-1">Octolabs</p>}
          <h1 className="text-2xl font-black text-white/60 uppercase tracking-wider font-display">OctoQuiz</h1>
        </div>
        <div className="flex items-start gap-3">
        {/* TV mode toggle */}
        <button
          onClick={toggleTVMode}
          title={tvMode ? 'Exit TV mode' : 'TV / Big Screen mode'}
          className="rounded-xl px-3 py-2 text-sm font-bold transition-all"
          style={{
            background: tvMode ? 'rgba(198,168,124,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${tvMode ? '#C6A87C' : 'rgba(255,255,255,0.1)'}`,
            color: tvMode ? '#C6A87C' : 'rgba(255,255,255,0.4)',
          }}>
          📺
        </button>
        <div className="text-right">
          <p className="text-white/25 text-xs uppercase tracking-widest mb-2">Room Code</p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="font-black tracking-[0.15em] font-display"
            style={{ fontSize: tvMode ? '5rem' : '3.75rem', color: '#C6A87C' }}>
            {room.code}
          </motion.div>
        </div>
        </div>{/* end flex items-start gap-3 */}
      </div>

      <div className="relative flex flex-1 gap-8">
        {/* Left — QR + URL */}
        <div className="flex flex-col items-center justify-center gap-5 w-72 flex-shrink-0">
          {joinUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <QRCodeDisplay value={joinUrl} size={200} label="Scan to join" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="glass rounded-2xl px-4 py-3 w-full text-center"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1.5">Or type</p>
            <p className="text-white/70 font-mono text-sm break-all">{joinUrl}</p>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="w-full space-y-2">
            {[
              { n: '1', text: 'Everyone scans the QR code' },
              { n: '2', text: 'Enter your name & join' },
              { n: '3', text: 'Host picks a game & starts' },
            ].map(step => (
              <div key={step.n} className="flex items-center gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                  style={{ background: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}>
                  {step.n}
                </span>
                <span className="text-white/40">{step.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Center — Player list */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white/50 uppercase tracking-wider">
              Players
              <motion.span
                key={room.players.length}
                initial={{ scale: 1.4, color: '#a78bfa' }}
                animate={{ scale: 1, color: 'rgba(255,255,255,0.3)' }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="ml-2 inline-block">
                ({room.players.length})
              </motion.span>
            </h2>
            {!canStart && (
              <motion.p animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
                className="text-yellow-400/60 text-sm">
                Waiting for players…
              </motion.p>
            )}
          </div>

          {room.players.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-1 flex-col items-center justify-center glass rounded-3xl"
              style={{ border: '1px solid rgba(255,255,255,0.05)', minHeight: 200 }}>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-6xl mb-3">👋</motion.div>
              <p className="text-white/25 text-sm">Waiting for players to join…</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              <AnimatePresence>
                {room.players.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ scale: 0.5, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.4, delay: i * 0.04 }}>
                    <PlayerBadge player={p} size="lg" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right — Game Master + Start */}
        <div className="flex flex-col items-center justify-center gap-6 w-68 flex-shrink-0">
          {/* GM */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-5 w-full text-center"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-5xl mb-2">🎮</div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Game Master</p>
            <p className="font-bold text-white text-lg">
              {room.gameMasterId
                ? (room.players.find(p => p.id === room.gameMasterId)?.name ?? '—')
                : <span className="text-white/25 font-normal text-sm">First to join</span>}
            </p>
          </motion.div>

          {/* Pick Game button */}
          <AnimatePresence>
            {canStart && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.45 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => socket.emit('select_game', 'trivia')}
                className="w-full rounded-2xl py-5 text-xl font-black transition-all font-display"
                style={{
                  background: 'linear-gradient(135deg, #C6A87C, #a8894e)',
                  color: '#0B1120',
                  boxShadow: '0 20px 50px -15px rgba(198,168,124,0.5)',
                }}>
                Pick a Game →
              </motion.button>
            )}
          </AnimatePresence>

          {/* Min players hint */}
          {!canStart && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass rounded-2xl p-4 text-center w-full"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-white/25 text-xs mb-1">Waiting</p>
              <p className="text-5xl mb-1">👋</p>
              <p className="text-white/25 text-xs">for players to join</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
    </TVModeContext.Provider>
  )
}
