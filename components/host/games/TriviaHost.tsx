'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoomPublic, TriviaState } from '@/lib/types'
import Timer from '@/components/ui/Timer'
import Scoreboard from '@/components/ui/Scoreboard'
import { useSound } from '@/hooks/useSound'

interface Props { room: RoomPublic; state: TriviaState }

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308']

export default function TriviaHost({ room, state }: Props) {
  const q = state.questions[state.currentIndex]
  const answered = Object.keys(state.answers).length
  const total = room.players.length
  const { play } = useSound()
  const prevPhase = useRef(state.phase)
  const prevIndex = useRef(state.currentIndex)

  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      if (state.phase === 'reveal') play('reveal')
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
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.45 }}
            className="text-center mb-8"
          >
            <div className="text-5xl mb-3">
              {state.phase === 'countdown' ? '🧠' : '📊'}
            </div>
            <h2 className="text-4xl font-black text-white">
              {state.phase === 'countdown'
                ? `Question ${state.currentIndex + 1} of ${state.questions.length}`
                : 'Leaderboard'}
            </h2>
          </motion.div>
          <Scoreboard players={room.players} />
        </div>
      </div>
    )
  }

  if (state.phase === 'finished') {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center"
        >
          <div className="text-7xl mb-4">✅</div>
          <h2 className="text-5xl font-black text-white">Trivia Complete!</h2>
          <p className="text-white/50 mt-2">Calculating final scores...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-night-900 flex p-8 gap-8 no-select relative overflow-hidden">
      {/* Ambient glow */}
      <AnimatePresence>
        <motion.div
          key={state.phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[30rem] rounded-full blur-3xl opacity-[0.06]"
            style={{ background: state.phase === 'reveal' ? '#22c55e' : '#6366f1' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Main question area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.span
              key={state.currentIndex}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass px-4 py-2 rounded-xl text-white/50 text-sm font-medium"
            >
              Q {state.currentIndex + 1}/{state.questions.length}
            </motion.span>
            <span className="glass px-4 py-2 rounded-xl text-white/50 text-sm">
              🧠 {state.category}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">{answered}/{total} answered</span>
            {state.phase === 'question' && (
              <Timer startedAt={state.startedAt} duration={state.timeLimit} size="md" />
            )}
          </div>
        </div>

        {/* Question card — slides in per question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${state.currentIndex}`}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
            className="glass rounded-3xl p-8 mb-6 flex-shrink-0"
          >
            <p className="text-3xl xl:text-4xl font-bold text-white leading-snug text-center">
              {q.question}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Answer options — staggered entrance */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex
            const revealed = state.phase === 'reveal'
            const answerers = Object.entries(state.answers)
              .filter(([, a]) => a.index === i)
              .map(([id]) => room.players.find(p => p.id === id))
              .filter(Boolean)

            return (
              <motion.div
                key={`${state.currentIndex}-${i}`}
                initial={{ x: i % 2 === 0 ? -40 : 40, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: revealed && !isCorrect ? 0.35 : 1,
                  scale: revealed && isCorrect ? 1.03 : 1,
                }}
                transition={{ delay: i * 0.07, type: 'spring', bounce: 0.3 }}
                className="rounded-3xl p-4 flex flex-col gap-2 overflow-hidden"
                style={{
                  background: revealed
                    ? isCorrect ? '#22c55e20' : '#ffffff08'
                    : `${OPTION_COLORS[i]}1a`,
                  border: `2px solid ${revealed ? (isCorrect ? '#22c55e' : 'transparent') : OPTION_COLORS[i] + '55'}`,
                  boxShadow: revealed && isCorrect
                    ? '0 0 40px -8px rgba(34,197,94,0.5)'
                    : 'none',
                }}
              >
                {/* Label + text */}
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={revealed && isCorrect ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0"
                    style={{ background: OPTION_COLORS[i], color: 'white' }}
                  >
                    {revealed && isCorrect ? '✓' : OPTION_LABELS[i]}
                  </motion.div>
                  <span className="text-xl font-bold text-white flex-1">{opt}</span>

                  {/* Answer count */}
                  <AnimatePresence>
                    {state.phase === 'question' && answerers.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="glass px-3 py-1 rounded-lg text-sm text-white/70 font-bold"
                      >
                        {answerers.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Player avatars who answered this */}
                <AnimatePresence>
                  {answerers.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="flex gap-1.5 flex-wrap pl-16"
                    >
                      {answerers.map(p => {
                        if (!p) return null
                        const ans = state.answers[p.id]
                        const secs = ans?.timeMs ? (ans.timeMs / 1000).toFixed(1) : null
                        return (
                          <motion.span
                            key={p.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                            className="text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                            style={{
                              background: `${p.color}28`,
                              border: `1px solid ${p.color}55`,
                              color: p.color,
                            }}
                          >
                            {p.avatar} {p.name}
                            {revealed && secs && (
                              <span className="opacity-70 font-medium">⚡{secs}s</span>
                            )}
                          </motion.span>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-500 rounded-full"
            animate={{ width: `${(state.currentIndex / state.questions.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Right sidebar — live scores */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4 relative z-10">
        <h3 className="text-white/40 text-sm uppercase tracking-wider font-bold">Live Scores</h3>
        <Scoreboard
          players={room.players}
          highlightIds={state.phase === 'reveal'
            ? Object.entries(state.answers)
                .filter(([, a]) => a.index === q.correctIndex)
                .map(([id]) => id)
            : []}
          compact
        />
        <motion.div
          className="glass rounded-2xl p-4 text-center mt-auto"
          key={answered}
          animate={answered === total ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white/40 text-xs mb-1">Answered</p>
          <p className="text-3xl font-black text-white">
            {answered}<span className="text-white/30">/{total}</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
