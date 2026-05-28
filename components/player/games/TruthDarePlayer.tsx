'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TruthDareState, Player } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'
import { useSound } from '@/hooks/useSound'

interface Props {
  state: TruthDareState
  me: Player
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

export default function TruthDarePlayer({ state, me, socket }: Props) {
  const isMyTurn = state.currentPlayerId === me.id
  const mySkips = state.skipsUsed[me.id] ?? 0
  const { play } = useSound()
  const prevPhase = useRef(state.phase)

  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      if (state.phase === 'prompt' && isMyTurn) play('draw')
      if (state.phase === 'pick' && isMyTurn) play('start')
      prevPhase.current = state.phase
    }
  }, [state.phase, isMyTurn, play])

  const isTruth = state.currentChoice === 'truth'
  const promptColor = isTruth ? '#3b82f6' : '#f97316'

  if (state.phase === 'finished') {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-center"
        >
          <div className="text-6xl mb-3">🎲</div>
          <h2 className="text-2xl font-black text-white">Game Over!</h2>
        </motion.div>
      </div>
    )
  }

  // Not your turn — watching screen
  if (!isMyTurn) {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-4"
          >
            👀
          </motion.div>
          <h2 className="text-xl font-black text-white mb-2">Watching the show...</h2>
          <p className="text-white/40 text-sm">It&apos;s not your turn yet</p>
          <p className="text-white/60 font-bold mt-6 text-lg">{me.score.toLocaleString()} pts</p>

          <AnimatePresence>
            {state.phase === 'prompt' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 glass rounded-2xl p-4 text-sm text-white/30 text-center"
              >
                📺 Check the TV to see the prompt!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }

  // My turn — pick phase
  if (state.phase === 'pick') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 50%, ${me.color}33, transparent 70%)` }}
        />

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.45 }}
          className="text-center mb-8 relative z-10"
        >
          <motion.div
            animate={{ boxShadow: [`0 0 20px -5px ${me.color}55`, `0 0 40px -5px ${me.color}88`, `0 0 20px -5px ${me.color}55`] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4"
            style={{ background: `${me.color}33`, border: `3px solid ${me.color}` }}
          >
            {me.avatar}
          </motion.div>
          <h2 className="text-2xl font-black text-white">Your Turn!</h2>
          <p className="text-white/40 text-sm mt-1">Choose wisely...</p>
        </motion.div>

        <div className="flex gap-5 w-full max-w-xs relative z-10">
          <motion.button
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05, y: -4 }}
            onClick={() => {
              play('select')
              socket.emit('game_action', { type: 'td_pick', choice: 'truth' })
            }}
            className="flex-1 rounded-3xl py-10 flex flex-col items-center gap-3"
            style={{ background: '#3b82f622', border: '2px solid #3b82f6' }}
          >
            <span className="text-5xl">💬</span>
            <span className="text-xl font-black text-blue-400">Truth</span>
          </motion.button>

          <motion.button
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4, delay: 0.15 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05, y: -4 }}
            onClick={() => {
              play('select')
              socket.emit('game_action', { type: 'td_pick', choice: 'dare' })
            }}
            className="flex-1 rounded-3xl py-10 flex flex-col items-center gap-3"
            style={{ background: '#f9731622', border: '2px solid #f97316' }}
          >
            <span className="text-5xl">⚡</span>
            <span className="text-xl font-black text-orange-400">Dare</span>
          </motion.button>
        </div>
      </div>
    )
  }

  // My turn — prompt phase (3D card flip reveal)
  if (state.phase === 'prompt' && state.currentPrompt) {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col p-4 pt-8 relative overflow-hidden">
        {/* Ambient glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${promptColor}14, transparent 70%)` }}
        />

        {/* Type label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 relative z-10"
        >
          <span className="text-4xl">{isTruth ? '💬' : '⚡'}</span>
          <div className="text-lg font-black uppercase tracking-widest mt-1" style={{ color: promptColor }}>
            {state.currentChoice}
          </div>
        </motion.div>

        {/* Card flip reveal */}
        <motion.div
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
          className="flex-1 relative z-10 flex flex-col"
          style={{ perspective: 900 }}
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 15px 50px -10px ${promptColor}44`,
                `0 20px 70px -10px ${promptColor}66`,
                `0 15px 50px -10px ${promptColor}44`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex-1 rounded-3xl p-6 flex items-center justify-center text-center mb-6"
            style={{
              background: `${promptColor}18`,
              border: `3px solid ${promptColor}`,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.2 }}
              className="text-2xl font-bold text-white leading-snug"
            >
              {state.currentPrompt}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 relative z-10"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              play('points')
              socket.emit('game_action', { type: 'td_done' })
            }}
            className="w-full bg-green-600 hover:bg-green-500 rounded-2xl py-5 text-xl font-black transition-all"
            style={{ boxShadow: '0 8px 30px -8px rgba(34,197,94,0.5)' }}
          >
            ✅ Done!
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => socket.emit('game_action', { type: 'td_skip' })}
            className="w-full glass hover:bg-white/10 rounded-2xl py-3 text-base text-white/50 transition-all"
          >
            Skip (used {mySkips})
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return null
}
