'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoomPublic, TruthDareState } from '@/lib/types'
import PlayerBadge from '@/components/ui/PlayerBadge'
import { useSound } from '@/hooks/useSound'

interface Props { room: RoomPublic; state: TruthDareState }

export default function TruthDareHost({ room, state }: Props) {
  const currentPlayer = room.players.find(p => p.id === state.currentPlayerId)
  const { play } = useSound()
  const prevPhase = useRef(state.phase)
  const prevTurn = useRef(state.turnIndex)

  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      if (state.phase === 'prompt') play('draw')
      if (state.phase === 'pick') play('whoosh')
      prevPhase.current = state.phase
    }
    if (state.turnIndex !== prevTurn.current) {
      play('start')
      prevTurn.current = state.turnIndex
    }
  }, [state.phase, state.turnIndex, play])

  const isTruth = state.currentChoice === 'truth'
  const truthColor = '#3b82f6'
  const dareColor = '#f97316'
  const promptColor = isTruth ? truthColor : dareColor

  if (state.phase === 'finished') {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center"
        >
          <div className="text-7xl mb-4">🎲</div>
          <h2 className="text-5xl font-black text-white">That&apos;s a wrap!</h2>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select relative overflow-hidden">
      {/* Animated background glow — reacts to truth/dare */}
      <AnimatePresence>
        <motion.div
          key={`${state.phase}-${state.currentChoice ?? 'none'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 pointer-events-none"
        >
          {state.phase === 'prompt' ? (
            <>
              <div
                className="absolute -top-40 left-1/4 w-[40rem] h-[40rem] rounded-full blur-3xl"
                style={{ background: `${promptColor}12` }}
              />
              <div
                className="absolute -bottom-40 right-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl"
                style={{ background: `${promptColor}08` }}
              />
            </>
          ) : (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-10"
              style={{ background: currentPlayer?.color ?? '#6366f1' }} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-3xl mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-white">Truth or Dare</h1>
          <p className="text-white/40 text-sm uppercase tracking-wider mt-1">
            {state.mode === 'adult' ? '🔞 Adult Mode' : '🟢 Safe Mode'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-sm">Turn {state.turnIndex + 1}</p>
        </div>
      </div>

      {/* Current player card */}
      <AnimatePresence mode="wait">
        {currentPlayer && (
          <motion.div
            key={currentPlayer.id}
            initial={{ scale: 0.7, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="mb-8 relative z-10"
          >
            <p className="text-white/40 text-center mb-3 text-sm uppercase tracking-widest">It&apos;s their turn</p>
            <motion.div
              animate={{
                boxShadow: [
                  `0 0 20px -5px ${currentPlayer.color}44`,
                  `0 0 40px -5px ${currentPlayer.color}66`,
                  `0 0 20px -5px ${currentPlayer.color}44`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="px-8 py-4 rounded-3xl text-center"
              style={{ background: `${currentPlayer.color}22`, border: `3px solid ${currentPlayer.color}` }}
            >
              <span className="text-5xl">{currentPlayer.avatar}</span>
              <p className="text-3xl font-black mt-2" style={{ color: currentPlayer.color }}>
                {currentPlayer.name}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: pick */}
      <AnimatePresence mode="wait">
        {state.phase === 'pick' && (
          <motion.div
            key="pick"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="text-center relative z-10"
          >
            <p className="text-white/50 text-xl mb-6">
              {currentPlayer?.name}, pick on your phone!
            </p>
            <div className="flex gap-6 justify-center">
              {/* Truth card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="glass rounded-3xl px-10 py-8 text-center opacity-60"
              >
                <div className="text-6xl mb-3">💬</div>
                <p className="text-2xl font-black text-blue-400">Truth</p>
              </motion.div>
              <div className="text-4xl self-center text-white/20">or</div>
              {/* Dare card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="glass rounded-3xl px-10 py-8 text-center opacity-60"
              >
                <div className="text-6xl mb-3">⚡</div>
                <p className="text-2xl font-black text-orange-400">Dare</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Phase: prompt — 3D card flip reveal */}
        {state.phase === 'prompt' && state.currentPrompt && (
          <motion.div
            key="prompt"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
            className="w-full max-w-3xl relative z-10"
            style={{ perspective: 1400 }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  `0 20px 60px -15px ${promptColor}44`,
                  `0 25px 80px -15px ${promptColor}66`,
                  `0 20px 60px -15px ${promptColor}44`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-3xl p-10 text-center mb-6"
              style={{
                background: `${promptColor}18`,
                border: `3px solid ${promptColor}`,
              }}
            >
              {/* Type badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <span className="text-5xl">{isTruth ? '💬' : '⚡'}</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-black uppercase tracking-widest mb-4"
                style={{ color: promptColor }}
              >
                {state.currentChoice === 'truth' ? 'TRUTH' : 'DARE'}
              </motion.div>

              {/* Prompt text — staggered word reveal */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, type: 'spring', bounce: 0.2 }}
                className="text-3xl xl:text-4xl font-bold text-white leading-snug"
              >
                {state.currentPrompt}
              </motion.p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-center text-white/40 text-sm"
            >
              {currentPlayer?.name} — complete the {state.currentChoice} or tap Done on your phone
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player order */}
      <div className="mt-12 flex gap-3 flex-wrap justify-center relative z-10">
        {state.playerOrder.map((pid, idx) => {
          const p = room.players.find(pl => pl.id === pid)
          if (!p) return null
          return (
            <motion.div
              key={pid}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05, type: 'spring', bounce: 0.4 }}
            >
              <PlayerBadge
                player={p}
                size="sm"
                highlight={pid === state.currentPlayerId}
                dim={pid !== state.currentPlayerId}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
