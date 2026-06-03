'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CapitalsState, Player } from '@/lib/types'
import Timer from '@/components/ui/Timer'
import { useSound } from '@/hooks/useSound'
import { useHaptic } from '@/hooks/useHaptic'

interface Props { state: CapitalsState; me: Player; sendAction: (action: import('@/lib/types').GameAction) => void }

const OPTION_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308']
const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function CapitalsPlayer({ state, me, sendAction }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const myAnswer   = state.answers[me.id]
  const q          = state.questions[state.currentIndex]
  const { play }   = useSound()
  const { haptic } = useHaptic()
  const prevIndex  = useRef(state.currentIndex)
  const prevPhase  = useRef(state.phase)

  useEffect(() => {
    if (state.currentIndex !== prevIndex.current) { setSelected(null); prevIndex.current = state.currentIndex }
  }, [state.currentIndex])

  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      if (state.phase === 'reveal') {
        if (myAnswer?.correct) { play('correct'); haptic([50, 30, 100]) }
        else { play('wrong'); haptic(200) }
      }
      prevPhase.current = state.phase
    }
  }, [state.phase, myAnswer, play, haptic])

  function handleAnswer(opt: string) {
    if (myAnswer || state.phase !== 'question') return
    play('select'); haptic(50)
    setSelected(opt)
    sendAction({ type: 'capitals_answer', answer: opt })
  }

  if (state.phase === 'countdown' || state.phase === 'leaderboard') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4 }} className="text-center">
          <div className="text-6xl mb-4">{state.phase === 'countdown' ? '🏙️' : '📊'}</div>
          <h2 className="text-3xl font-black text-white mb-2">{state.phase === 'countdown' ? `Capital ${state.currentIndex + 1}` : 'Leaderboard'}</h2>
          <p className="text-white/40 text-lg">{state.phase === 'countdown' ? 'Get ready!' : 'Scores updated'}</p>
          <div className="glass rounded-2xl px-6 py-4 mt-6 inline-block">
            <p className="text-white/40 text-xs mb-1">Your score</p>
            <p className="text-3xl font-black text-blue-400">{me.score.toLocaleString()} <span className="text-white/30 text-base">pts</span></p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (state.phase === 'finished') {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-7xl mb-3">🏙️</div>
          <h2 className="text-2xl font-black text-white">Capital Cities done!</h2>
          <p className="text-white/50 mt-2 text-xl font-bold">{me.score.toLocaleString()} pts</p>
        </motion.div>
      </div>
    )
  }

  const isRevealed = state.phase === 'reveal'

  return (
    <div className="min-h-screen bg-night-900 flex flex-col p-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/30 text-xs uppercase tracking-wider">Capital {state.currentIndex + 1}/{state.questions.length}</p>
          <p className="text-white/50 text-sm font-medium">Which country? 🌍</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white/60">{me.score.toLocaleString()} pts</span>
          {state.phase === 'question' && <Timer startedAt={state.startedAt} duration={state.timeLimit} size="sm" />}
        </div>
      </div>

      {/* City image */}
      <AnimatePresence mode="wait">
        <motion.div key={`img-${state.currentIndex}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="relative rounded-2xl overflow-hidden mb-4 flex-shrink-0" style={{ height: '40vw', maxHeight: '180px', minHeight: '120px' }}>
          {q.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={q.imageUrl} alt={q.city} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-blue-900/30 flex items-center justify-center"><span className="text-5xl">🏙️</span></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {isRevealed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-3 left-3">
              <span className="text-white font-black text-lg drop-shadow">📍 {q.city}</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Reveal feedback */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div initial={{ scale: 0.75, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.75, opacity: 0 }}
            className={`rounded-2xl p-4 text-center mb-4 text-xl font-black ${myAnswer?.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {myAnswer?.correct ? '✅ Correct!' : myAnswer ? `❌ It's ${q.country}` : "⏱️ Time's up!"}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {myAnswer && !isRevealed && (
          <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-2xl p-3 text-center mb-4 bg-purple-500/20 text-purple-400 font-bold">
            ✓ Answer locked in!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2.5 flex-1">
        {q.options.map((opt, i) => {
          const isCorrect = opt === q.country
          const isMyPick  = myAnswer?.answer === opt || selected === opt
          const locked    = !!myAnswer || state.phase !== 'question'

          let bg = `${OPTION_COLORS[i]}22`; let border = `${OPTION_COLORS[i]}55`
          if (isRevealed) {
            if (isCorrect) { bg = '#22c55e33'; border = '#22c55e' }
            else if (isMyPick) { bg = '#ef444433'; border = '#ef4444' }
            else { bg = '#ffffff08'; border = 'transparent' }
          } else if (isMyPick) { bg = `${OPTION_COLORS[i]}44`; border = OPTION_COLORS[i] }

          return (
            <motion.button key={i}
              initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: isRevealed && !isCorrect && !isMyPick ? 0.3 : 1 }}
              transition={{ delay: i * 0.05, type: 'spring', bounce: 0.3 }}
              whileTap={!locked ? { scale: 0.94 } : {}}
              onClick={() => handleAnswer(opt)} disabled={locked}
              className="rounded-2xl px-3 py-4 flex flex-col items-center gap-2 disabled:cursor-default"
              style={{ background: bg, border: `2px solid ${border}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ background: OPTION_COLORS[i], color: 'white' }}>
                {isRevealed && isCorrect ? '✓' : OPTION_LABELS[i]}
              </div>
              <span className="font-bold text-white text-xs text-center leading-snug">{opt}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
