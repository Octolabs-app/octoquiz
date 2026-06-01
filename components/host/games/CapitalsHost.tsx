'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoomPublic, CapitalsState } from '@/lib/types'
import Timer from '@/components/ui/Timer'
import Scoreboard from '@/components/ui/Scoreboard'
import { useSound } from '@/hooks/useSound'

interface Props { room: RoomPublic; state: CapitalsState }

const OPTION_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308']
const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function CapitalsHost({ room, state }: Props) {
  const q          = state.questions[state.currentIndex]
  const answered   = Object.keys(state.answers).length
  const total      = room.players.length
  const { play }   = useSound()
  const prevPhase  = useRef(state.phase)
  const prevIndex  = useRef(state.currentIndex)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [state.currentIndex])

  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      if (state.phase === 'reveal')    play('reveal')
      if (state.phase === 'countdown') play('whoosh')
      prevPhase.current = state.phase
    }
    if (state.currentIndex !== prevIndex.current) {
      play('start')
      prevIndex.current = state.currentIndex
    }
  }, [state.phase, state.currentIndex, play])

  if (state.phase === 'leaderboard' || state.phase === 'countdown') {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center p-8 no-select">
        <div className="w-full max-w-2xl text-center">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4 }}>
            <div className="text-6xl mb-3">{state.phase === 'countdown' ? '🏙️' : '📊'}</div>
            <h2 className="text-4xl font-black text-white mb-8">
              {state.phase === 'countdown' ? `Capital ${state.currentIndex + 1} of ${state.questions.length}` : 'Leaderboard'}
            </h2>
          </motion.div>
          <Scoreboard players={room.players} />
        </div>
      </div>
    )
  }

  if (state.phase === 'finished') {
    const winner = [...room.players].sort((a, b) => b.score - a.score)[0]
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="text-center">
          <div className="text-8xl mb-4">🏙️</div>
          <h2 className="text-5xl font-black text-white">Capital Cities Complete!</h2>
          {winner && <p className="text-3xl text-yellow-400 font-black mt-4">{winner.avatar} {winner.name} wins!</p>}
        </motion.div>
      </div>
    )
  }

  const revealed = state.phase === 'reveal'
  const correctCountry = q.country

  return (
    <div className="min-h-screen bg-night-900 flex gap-0 no-select overflow-hidden">
      {/* ── Left: city image ── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night-900 to-transparent z-10 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`img-${state.currentIndex}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {q.imageUrl && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={q.imageUrl}
                alt={q.city}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-purple-900/40">
                <span className="text-[12rem] opacity-20">🏙️</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* City name reveal + question text */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-3"
              >
                <span className="glass px-4 py-2 rounded-xl text-2xl font-black text-white">
                  📍 {q.city}, {q.country}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <h2 className="text-3xl font-black text-white drop-shadow-lg">
            {revealed ? '✅ The answer is...' : 'Which country is this the capital of?'}
          </h2>
        </div>
      </div>

      {/* ── Right: options + scoreboard ── */}
      <div className="w-[420px] flex-shrink-0 flex flex-col bg-night-900/95 border-l border-white/5 p-6 gap-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="glass px-3 py-1.5 rounded-xl text-sm font-bold text-white/60">
            🏙️ {state.currentIndex + 1}/{state.questions.length}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-sm">{answered}/{total}</span>
            {state.phase === 'question' && (
              <Timer startedAt={state.startedAt} duration={state.timeLimit} size="md" />
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const isCorrect  = opt === correctCountry
            const answerers  = Object.entries(state.answers)
              .filter(([, a]) => a.answer === opt)
              .map(([id]) => room.players.find(p => p.id === id))
              .filter(Boolean)

            return (
              <motion.div
                key={`${state.currentIndex}-${i}`}
                initial={{ x: 30, opacity: 0 }}
                animate={{
                  x:       0,
                  opacity: revealed && !isCorrect ? 0.3 : 1,
                  scale:   revealed && isCorrect ? 1.03 : 1,
                }}
                transition={{ delay: i * 0.06, type: 'spring', bounce: 0.3 }}
                className="rounded-2xl p-3"
                style={{
                  background: revealed ? (isCorrect ? '#22c55e20' : '#ffffff08') : `${OPTION_COLORS[i]}15`,
                  border:     `2px solid ${revealed ? (isCorrect ? '#22c55e' : 'transparent') : OPTION_COLORS[i] + '44'}`,
                  boxShadow:  revealed && isCorrect ? '0 0 30px -8px rgba(34,197,94,0.5)' : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                    style={{ background: OPTION_COLORS[i], color: 'white' }}>
                    {revealed && isCorrect ? '✓' : OPTION_LABELS[i]}
                  </div>
                  <span className="font-bold text-white text-sm flex-1">{opt}</span>
                  {state.phase === 'question' && answerers.length > 0 && (
                    <span className="glass px-2 py-0.5 rounded text-xs text-white/60 font-bold">{answerers.length}</span>
                  )}
                </div>
                {answerers.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2 pl-12">
                    {answerers.map(p => p && (
                      <span key={p.id} className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: `${p.color}22`, border: `1px solid ${p.color}44`, color: p.color }}>
                        {p.avatar} {p.name}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Answered count */}
        <motion.div className="glass rounded-2xl p-3 text-center" key={answered}
          animate={answered === total ? { scale: [1, 1.06, 1] } : {}} transition={{ duration: 0.3 }}>
          <p className="text-white/40 text-xs mb-1">Answered</p>
          <p className="text-2xl font-black text-white">{answered}<span className="text-white/30">/{total}</span></p>
        </motion.div>

        {/* Scoreboard */}
        <Scoreboard players={room.players} compact
          highlightIds={revealed
            ? Object.entries(state.answers).filter(([, a]) => a.correct).map(([id]) => id)
            : []} />
      </div>
    </div>
  )
}
