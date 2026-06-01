'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoomPublic, TriviaState } from '@/lib/types'
import Timer from '@/components/ui/Timer'
import Scoreboard from '@/components/ui/Scoreboard'
import { useSound } from '@/hooks/useSound'
import { TRIVIA_CATEGORIES } from '@/lib/games/trivia'

interface Props { room: RoomPublic; state: TriviaState }

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308']

const MODE_META: Record<string, { icon: string; label: string; color: string }> = {
  'classic':      { icon: '🎯', label: 'Classic',      color: '#3b82f6' },
  'speed':        { icon: '⚡', label: 'Speed Blitz',  color: '#f59e0b' },
  'sudden-death': { icon: '💀', label: 'Sudden Death', color: '#ef4444' },
}

export default function TriviaHost({ room, state }: Props) {
  const q         = state.questions[state.currentIndex]
  const answered  = Object.keys(state.answers).length
  const activePlayers = room.players.filter(p => !state.eliminated.includes(p.id))
  const { play }  = useSound()
  const prevPhase = useRef(state.phase)
  const prevIndex = useRef(state.currentIndex)
  const modeMeta  = MODE_META[state.mode] ?? MODE_META.classic
  const catMeta   = TRIVIA_CATEGORIES.find(c => c.id === state.category)

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

  // ── Leaderboard / countdown screens ──────────────────────────────────────────
  if (state.phase === 'leaderboard' || state.phase === 'countdown') {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center p-8 no-select">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.45 }}
            className="text-center mb-8"
          >
            {/* Mode + category tags */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="glass px-4 py-1.5 rounded-full text-sm font-bold" style={{ color: modeMeta.color }}>
                {modeMeta.icon} {modeMeta.label}
              </span>
              {catMeta && (
                <span className="glass px-4 py-1.5 rounded-full text-sm font-bold" style={{ color: catMeta.color }}>
                  {catMeta.icon} {catMeta.id}
                </span>
              )}
              {state.mode === 'sudden-death' && state.eliminated.length > 0 && (
                <span className="glass px-4 py-1.5 rounded-full text-sm font-bold text-red-400">
                  💀 {state.eliminated.length} eliminated
                </span>
              )}
            </div>

            <div className="text-6xl mb-3">
              {state.phase === 'countdown' ? (catMeta?.icon ?? '🧠') : '📊'}
            </div>
            <h2 className="text-5xl font-black text-white">
              {state.phase === 'countdown'
                ? `Question ${state.currentIndex + 1} of ${state.questions.length}`
                : 'Leaderboard'}
            </h2>
            {state.phase === 'countdown' && (
              <p className="text-white/40 mt-2 text-xl">Get ready!</p>
            )}
          </motion.div>

          <Scoreboard players={room.players} eliminatedIds={state.eliminated} />
        </div>
      </div>
    )
  }

  // ── Finished screen ───────────────────────────────────────────────────────────
  if (state.phase === 'finished') {
    const winner = state.mode === 'sudden-death'
      ? activePlayers[0]
      : [...room.players].sort((a, b) => b.score - a.score)[0]

    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center p-8 no-select">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">🏆</div>
          <h2 className="text-5xl font-black text-white mb-2">Brain Blitz Complete!</h2>
          {winner && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl text-yellow-400 font-black mt-4"
            >
              {winner.avatar} {winner.name} wins!
            </motion.p>
          )}
          <p className="text-white/40 mt-3 text-lg">Calculating final scores…</p>
        </motion.div>
      </div>
    )
  }

  // ── Main question screen (question + reveal) ──────────────────────────────────
  return (
    <div className="min-h-screen bg-night-900 flex p-6 gap-6 no-select relative overflow-hidden">
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
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[35rem] rounded-full blur-3xl opacity-[0.05]"
            style={{ background: state.phase === 'reveal' ? '#22c55e' : modeMeta.color }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Main question area ── */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <motion.span
              key={state.currentIndex}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass px-3 py-1.5 rounded-xl text-white/60 text-sm font-bold"
            >
              Q {state.currentIndex + 1}/{state.questions.length}
            </motion.span>
            {catMeta && (
              <span className="glass px-3 py-1.5 rounded-xl text-sm font-bold" style={{ color: catMeta.color }}>
                {catMeta.icon} {catMeta.id}
              </span>
            )}
            <span className="glass px-3 py-1.5 rounded-xl text-sm font-bold" style={{ color: modeMeta.color }}>
              {modeMeta.icon} {modeMeta.label}
            </span>
            {state.difficulty !== 'medium' && (
              <span className="glass px-3 py-1.5 rounded-xl text-xs font-bold text-white/50">
                {state.difficulty === 'hard' ? '🔴 Hard' : '🟢 Easy'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm font-medium">
              {answered}/{activePlayers.length} answered
            </span>
            {state.phase === 'question' && (
              <Timer startedAt={state.startedAt} duration={state.timeLimit} size="md" />
            )}
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${state.currentIndex}`}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
            className="glass rounded-3xl p-8 mb-5 flex-shrink-0"
          >
            <p className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-snug text-center">
              {q.question}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Answer grid */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex
            const revealed  = state.phase === 'reveal'
            const answerers = Object.entries(state.answers)
              .filter(([, a]) => a.index === i)
              .map(([id]) => room.players.find(p => p.id === id))
              .filter(Boolean)

            return (
              <motion.div
                key={`${state.currentIndex}-${i}`}
                initial={{ x: i % 2 === 0 ? -40 : 40, opacity: 0 }}
                animate={{
                  x:       0,
                  opacity: revealed && !isCorrect ? 0.3 : 1,
                  scale:   revealed && isCorrect  ? 1.03 : 1,
                }}
                transition={{ delay: i * 0.07, type: 'spring', bounce: 0.3 }}
                className="rounded-3xl p-4 flex flex-col gap-2 overflow-hidden"
                style={{
                  background: revealed
                    ? isCorrect ? '#22c55e20' : '#ffffff06'
                    : `${OPTION_COLORS[i]}18`,
                  border: `2px solid ${revealed ? (isCorrect ? '#22c55e' : 'transparent') : OPTION_COLORS[i] + '44'}`,
                  boxShadow: revealed && isCorrect ? '0 0 50px -8px rgba(34,197,94,0.5)' : 'none',
                }}
              >
                {/* Label + text */}
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={revealed && isCorrect ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
                    style={{ background: OPTION_COLORS[i], color: 'white' }}
                  >
                    {revealed && isCorrect ? '✓' : OPTION_LABELS[i]}
                  </motion.div>
                  <span className="text-xl xl:text-2xl font-bold text-white flex-1 leading-snug">{opt}</span>

                  {/* Live answer count during question */}
                  <AnimatePresence>
                    {state.phase === 'question' && answerers.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="glass px-3 py-1 rounded-lg text-sm text-white/70 font-black"
                      >
                        {answerers.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Player avatars who chose this option */}
                <AnimatePresence>
                  {answerers.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="flex gap-1.5 flex-wrap pl-[4.5rem]"
                    >
                      {answerers.map(p => {
                        if (!p) return null
                        const ans     = state.answers[p.id]
                        const secs    = ans?.timeMs ? (ans.timeMs / 1000).toFixed(1) : null
                        const streak  = state.streaks?.[p.id] ?? 0
                        return (
                          <motion.span
                            key={p.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                            className="text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                            style={{
                              background: `${p.color}22`,
                              border:     `1px solid ${p.color}44`,
                              color:       p.color,
                            }}
                          >
                            {p.avatar} {p.name}
                            {streak >= 3 && <span className="opacity-80">🔥{streak}</span>}
                            {revealed && secs && <span className="opacity-60">⚡{secs}s</span>}
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
            className="h-full rounded-full"
            style={{ background: modeMeta.color }}
            animate={{ width: `${((state.currentIndex) / state.questions.length) * 100}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4 relative z-10">
        {/* Live scores header */}
        <div className="flex items-center justify-between">
          <h3 className="text-white/40 text-xs uppercase tracking-wider font-bold">Live</h3>
          {state.mode === 'sudden-death' && state.eliminated.length > 0 && (
            <span className="text-xs text-red-400 font-bold">
              💀 {state.eliminated.length} out
            </span>
          )}
        </div>

        <Scoreboard
          players={room.players}
          eliminatedIds={state.eliminated}
          highlightIds={state.phase === 'reveal'
            ? Object.entries(state.answers)
                .filter(([, a]) => a.index === q.correctIndex)
                .map(([id]) => id)
            : []}
          compact
        />

        {/* Answered count */}
        <motion.div
          className="glass rounded-2xl p-4 text-center mt-auto"
          key={answered}
          animate={answered === activePlayers.length ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white/40 text-xs mb-1">Answered</p>
          <p className="text-3xl font-black text-white">
            {answered}<span className="text-white/30">/{activePlayers.length}</span>
          </p>
        </motion.div>

        {/* Streak leaders */}
        {Object.keys(state.streaks ?? {}).length > 0 && (
          <div className="glass rounded-2xl p-3">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">🔥 Hot Streaks</p>
            {room.players
              .filter(p => (state.streaks?.[p.id] ?? 0) >= 2)
              .sort((a, b) => (state.streaks?.[b.id] ?? 0) - (state.streaks?.[a.id] ?? 0))
              .slice(0, 4)
              .map(p => (
                <div key={p.id} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-white/60">{p.avatar} {p.name}</span>
                  <span className="font-black text-orange-400">🔥 {state.streaks?.[p.id]}</span>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}
