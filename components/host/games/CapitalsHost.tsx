'use client'
import { useEffect, useRef } from 'react'
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

  return (
    <div className="min-h-screen bg-night-900 flex flex-col p-8 no-select">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-5xl mx-auto w-full">
        <span className="glass px-3 py-1.5 rounded-xl text-sm font-bold text-white/60">🏙️ {state.currentIndex + 1}/{state.questions.length}</span>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm">{answered}/{total} answered</span>
          {state.phase === 'question' && <Timer startedAt={state.startedAt} duration={state.timeLimit} size="md" />}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={`q-${state.currentIndex}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-center mb-10 max-w-5xl mx-auto w-full">
          <p className="text-white/40 text-lg uppercase tracking-[0.3em] mb-3">What is the capital of</p>
          <h2 className="text-6xl font-black" style={{ color: '#C6A87C' }}>{q.country}?</h2>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto w-full mb-8">
        {q.options.map((opt, i) => {
          const isCorrect = opt === q.capital
          const answerers = Object.entries(state.answers)
            .filter(([, a]) => a.answer === opt)
            .map(([id]) => room.players.find(p => p.id === id))
            .filter(Boolean)
          return (
            <motion.div key={`${state.currentIndex}-${i}`}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: revealed && !isCorrect ? 0.35 : 1, scale: revealed && isCorrect ? 1.03 : 1 }}
              transition={{ delay: i * 0.06, type: 'spring', bounce: 0.3 }}
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{
                background: revealed ? (isCorrect ? '#22c55e20' : '#ffffff08') : `${OPTION_COLORS[i]}15`,
                border:     `2px solid ${revealed ? (isCorrect ? '#22c55e' : 'transparent') : OPTION_COLORS[i] + '44'}`,
                boxShadow:  revealed && isCorrect ? '0 0 30px -8px rgba(34,197,94,0.5)' : 'none',
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
                style={{ background: OPTION_COLORS[i], color: 'white' }}>
                {revealed && isCorrect ? '✓' : OPTION_LABELS[i]}
              </div>
              <span className="font-black text-white text-2xl flex-1">{opt}</span>
              {state.phase === 'question' && answerers.length > 0 && (
                <span className="glass px-2.5 py-1 rounded-lg text-sm text-white/60 font-bold">{answerers.length}</span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Scoreboard */}
      <div className="max-w-2xl mx-auto w-full">
        <Scoreboard players={room.players} compact
          highlightIds={revealed
            ? Object.entries(state.answers).filter(([, a]) => a.correct).map(([id]) => id)
            : []} />
      </div>
    </div>
  )
}
