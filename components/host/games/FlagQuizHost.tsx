'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { RoomPublic, FlagQuizState } from '@/lib/types'
import Timer from '@/components/ui/Timer'
import Scoreboard from '@/components/ui/Scoreboard'
import { useSound } from '@/hooks/useSound'

interface Props { room: RoomPublic; state: FlagQuizState }

const OPTION_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308']

export default function FlagQuizHost({ room, state }: Props) {
  const q = state.questions[state.currentIndex]
  const answered = Object.keys(state.answers).length
  const total = room.players.length
  const { play } = useSound()
  const prevPhase = useRef(state.phase)
  const prevIndex = useRef(state.currentIndex)

  // Sound effects on phase changes
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
              {state.phase === 'countdown' ? '🏳️' : '📊'}
            </div>
            <h2 className="text-4xl font-black text-white">
              {state.phase === 'countdown'
                ? `Flag ${state.currentIndex + 1} of ${state.questions.length}`
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
          <div className="text-7xl mb-4">🌍</div>
          <h2 className="text-5xl font-black text-white">Flag Quiz Complete!</h2>
        </motion.div>
      </div>
    )
  }

  const correctAnswers = Object.values(state.answers).filter(a => a.correct)
  const flagUrl = `https://flagcdn.com/w320/${q.countryCode.toLowerCase()}.png`

  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select relative overflow-hidden">
      {/* Ambient background glow — shifts to green on reveal */}
      <AnimatePresence>
        <motion.div
          key={state.phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full blur-3xl"
            style={{
              background: state.phase === 'reveal'
                ? 'rgba(34,197,94,0.08)'
                : 'rgba(99,102,241,0.07)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-4xl mb-8 relative z-10">
        <span className="glass px-4 py-2 rounded-xl text-white/50 text-sm">
          🏳️ Flag {state.currentIndex + 1}/{state.questions.length}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm">{answered}/{total} answered</span>
          {state.phase === 'question' && (
            <Timer startedAt={state.startedAt} duration={state.timeLimit} size="lg" />
          )}
        </div>
      </div>

      {/* Big flag — key on currentIndex so it re-animates every new flag */}
      <motion.div
        key={`flag-${state.currentIndex}`}
        initial={{ scale: 0.4, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.6 }}
        className="text-center mb-8 relative z-10"
        style={{ perspective: 1200 }}
      >
        <div className="relative inline-block">
          {/* Shadow behind flag */}
          <div className="absolute inset-0 blur-2xl opacity-50 scale-90 -z-10"
            style={{ background: 'rgba(0,0,0,0.5)' }} />
          <Image
            src={flagUrl}
            alt={`Flag of ${q.countryName}`}
            width={320}
            height={213}
            className="rounded-xl"
            style={{
              boxShadow: '0 25px 60px -10px rgba(0,0,0,0.7)',
              border: '3px solid rgba(255,255,255,0.12)',
              width: 'min(320px, 60vw)',
              height: 'auto',
            }}
            priority
            unoptimized
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/30 text-xl mt-4"
        >
          Which country is this?
        </motion.p>
      </motion.div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-8 relative z-10">
        {q.options.map((opt, i) => {
          const isCorrect = opt === q.countryName
          const revealed = state.phase === 'reveal'
          const countAnswered = Object.values(state.answers).filter(a => a.answer === opt).length
          // Which players picked this?
          const answererNames = Object.entries(state.answers)
            .filter(([, a]) => a.answer === opt)
            .map(([id]) => room.players.find(p => p.id === id))
            .filter(Boolean)

          return (
            <motion.div
              key={opt}
              initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
              animate={{
                x: 0,
                opacity: revealed && !isCorrect ? 0.35 : 1,
                scale: revealed && isCorrect ? 1.03 : 1,
              }}
              transition={{ delay: i * 0.06, type: 'spring', bounce: 0.3 }}
              className="rounded-2xl px-5 py-4 flex flex-col gap-2 relative overflow-hidden"
              style={{
                background: revealed
                  ? isCorrect ? '#22c55e20' : '#ffffff08'
                  : `${OPTION_COLORS[i]}18`,
                border: `2px solid ${
                  revealed
                    ? isCorrect ? '#22c55e' : 'transparent'
                    : `${OPTION_COLORS[i]}66`
                }`,
                boxShadow: revealed && isCorrect
                  ? '0 0 30px -5px rgba(34,197,94,0.4)'
                  : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 text-white"
                    style={{ background: OPTION_COLORS[i] }}
                  >
                    {revealed && isCorrect ? '✓' : String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-xl font-bold text-white">{opt}</span>
                </div>
                <AnimatePresence>
                  {state.phase === 'question' && countAnswered > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="glass px-2.5 py-1 rounded-lg text-sm text-white/70 font-bold"
                    >
                      {countAnswered}
                    </motion.span>
                  )}
                </AnimatePresence>
                {revealed && isCorrect && (
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="text-2xl"
                  >
                    ✅
                  </motion.span>
                )}
              </div>

              {/* Player avatars who answered this option */}
              <AnimatePresence>
                {answererNames.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex gap-1.5 flex-wrap pl-12"
                  >
                    {answererNames.map(p => {
                      if (!p) return null
                      const ans = state.answers[p.id]
                      const secs = ans?.timeMs ? (ans.timeMs / 1000).toFixed(1) : null
                      return (
                        <motion.span
                          key={p.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', bounce: 0.5 }}
                          className="text-sm px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                          style={{
                            background: `${p.color}33`,
                            border: `1px solid ${p.color}66`,
                            color: p.color,
                          }}
                        >
                          {p.avatar} {p.name}
                          {revealed && secs && (
                            <span className="opacity-70 text-xs font-medium">⚡{secs}s</span>
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

      {/* Reveal answer */}
      <AnimatePresence>
        {state.phase === 'reveal' && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="text-center relative z-10"
          >
            <p className="text-white/50 text-lg mb-2">The answer was</p>
            <p className="text-5xl font-black text-green-400">{q.countryName}</p>
            <p className="text-white/40 mt-2">
              {correctAnswers.length} player{correctAnswers.length !== 1 ? 's' : ''} got it right!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side scores */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 w-52 z-20">
        <Scoreboard players={room.players} compact highlightIds={
          state.phase === 'reveal'
            ? Object.entries(state.answers).filter(([, a]) => a.correct).map(([id]) => id)
            : []
        } />
      </div>
    </div>
  )
}
