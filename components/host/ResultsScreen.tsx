'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { RoomPublic } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'
import { useSound } from '@/hooks/useSound'
import confetti from 'canvas-confetti'

interface Props {
  room: RoomPublic
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

const medals = ['🥇', '🥈', '🥉']

export default function ResultsScreen({ room, socket }: Props) {
  const sorted = [...room.players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]
  const { play } = useSound()

  useEffect(() => {
    play('gameover')
    const duration = 4000
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#C6A87C', '#E8E6E1', '#ffffff'] })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#C6A87C', '#E8E6E1', '#ffffff'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [play])

  function playAgain() {
    socket.emit('select_game', 'trivia')
  }

  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select overflow-hidden">
      {/* Winner spotlight */}
      {winner && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.45, duration: 0.8 }}
          className="text-center mb-10">
          <div className="text-6xl mb-2">👑</div>
          <div className="text-8xl mb-3">{winner.avatar}</div>
          <h1 className="text-6xl font-black mb-2 font-display" style={{ color: '#C6A87C' }}>
            {winner.name}
          </h1>
          <p className="text-2xl font-bold" style={{ color: 'rgba(232,230,225,0.6)' }}>
            {winner.score.toLocaleString()} pts
          </p>
        </motion.div>
      )}

      {/* Podium for top 3 */}
      <div className="flex items-end gap-4 mb-10 w-full max-w-2xl justify-center">
        {[sorted[1], sorted[0], sorted[2]].map((p, i) => {
          if (!p) return <div key={i} className="w-36" />
          const heights = ['h-36', 'h-52', 'h-28']
          const positions = [2, 1, 3]
          return (
            <motion.div
              key={p.id}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="text-3xl">{p.avatar}</div>
              <div className="font-bold text-sm" style={{ color: p.color }}>{p.name}</div>
              <div className="text-white/50 text-xs font-black">{p.score.toLocaleString()}</div>
              <div
                className={`w-28 ${heights[i]} rounded-t-2xl flex items-start justify-center pt-3 text-2xl font-black`}
                style={{ background: `${p.color}22`, border: `2px solid ${p.color}55` }}
              >
                {medals[positions[i] - 1]}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Full leaderboard */}
      {sorted.length > 3 && (
        <div className="w-full max-w-md mb-8 space-y-2">
          {sorted.slice(3).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="flex items-center gap-3 rounded-xl px-4 py-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(198,168,124,0.10)' }}
            >
              <span className="text-white/30 text-sm w-6">#{i + 4}</span>
              <span>{p.avatar}</span>
              <span className="flex-1 font-medium" style={{ color: p.color }}>{p.name}</span>
              <span className="font-black" style={{ color: 'rgba(232,230,225,0.7)' }}>{p.score.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        onClick={playAgain}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
        className="rounded-2xl px-10 py-4 text-xl font-black transition-all font-display"
        style={{ background: 'linear-gradient(135deg, #C6A87C, #a8894e)', color: '#0B1120', boxShadow: '0 12px 30px -8px rgba(198,168,124,0.4)' }}
      >
        🎮 Play Again
      </motion.button>
    </div>
  )
}
