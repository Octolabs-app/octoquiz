'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TriviaState, Player } from '@/lib/types'
import Timer from '@/components/ui/Timer'
import { useSound } from '@/hooks/useSound'
import { useHaptic } from '@/hooks/useHaptic'

interface Props {
  state:  TriviaState
  me:     Player
  sendAction: (action: import('@/lib/types').GameAction) => void
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308']

function spawnConfetti(container: HTMLElement | null) {
  if (!container) return
  const colors = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171']
  for (let k = 0; k < 32; k++) {
    const el = document.createElement('div')
    el.style.cssText = `
      position:absolute;
      width:${6 + Math.random() * 7}px;
      height:${6 + Math.random() * 7}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      background:${colors[Math.floor(Math.random() * colors.length)]};
      top:50%;left:50%;
      pointer-events:none;
      z-index:50;
    `
    container.appendChild(el)
    const angle = (Math.random() * 360 * Math.PI) / 180
    const dist  = 70 + Math.random() * 110
    el.animate(
      [
        { transform: `translate(-50%,-50%) scale(1)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist - 70}px)) scale(0.3) rotate(${Math.random() * 360}deg)`, opacity: 0 },
      ],
      { duration: 800 + Math.random() * 400, easing: 'ease-out', fill: 'forwards' },
    ).onfinish = () => el.remove()
  }
}

export default function TriviaPlayer({ state, me, sendAction }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const myAnswer      = state.answers[me.id]
  const isEliminated  = state.eliminated.includes(me.id)
  const myStreak      = state.streaks?.[me.id] ?? 0
  const q             = state.questions[state.currentIndex]
  const { play }      = useSound()
  const { haptic }    = useHaptic()
  const prevPhase     = useRef(state.phase)
  const prevIndex     = useRef(state.currentIndex)
  const revealRef     = useRef<HTMLDivElement | null>(null)

  // Reset selection on new question
  useEffect(() => {
    if (state.currentIndex !== prevIndex.current) {
      setSelected(null)
      prevIndex.current = state.currentIndex
    }
  }, [state.currentIndex])

  // Sound + haptic on reveal
  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      if (state.phase === 'reveal') {
        const myIsCorrect = myAnswer && myAnswer.index === q.correctIndex
        if (myIsCorrect) {
          play('correct')
          play('points')
          haptic([50, 30, 100])
          setTimeout(() => spawnConfetti(revealRef.current), 100)
        } else if (!isEliminated) {
          play('wrong')
          haptic(200)
        }
      }
      prevPhase.current = state.phase
    }
  }, [state.phase, myAnswer, q.correctIndex, isEliminated, play, haptic])

  function handleAnswer(idx: number) {
    if (myAnswer || state.phase !== 'question' || isEliminated) return
    play('select')
    haptic(50)
    if (navigator.vibrate) navigator.vibrate(100)
    setSelected(idx)
    sendAction({ type: 'trivia_answer', answerId: idx })
  }

  // ── Eliminated screen ─────────────────────────────────────────────────────────
  if (isEliminated) {
    const activePlayers = state.eliminated.length < (state.questions.length > 0 ? 50 : 0)
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-center"
        >
          <div className="text-8xl mb-4">💀</div>
          <h2 className="text-3xl font-black text-white mb-2">You're Out!</h2>
          <p className="text-white/40 text-lg mb-6">Better luck next time</p>
          <div className="glass rounded-2xl px-6 py-4 inline-block">
            <p className="text-white/50 text-sm mb-1">Your final score</p>
            <p className="text-3xl font-black text-white">{me.score.toLocaleString()} pts</p>
          </div>
          <p className="text-white/30 text-sm mt-6">Watch the remaining players battle it out…</p>

          {/* Show current question as spectator */}
          <div className="mt-8 w-full max-w-sm">
            <div className="glass rounded-2xl p-4">
              <p className="text-white/30 text-xs mb-2 uppercase tracking-wider">Current question</p>
              <p className="text-white/70 text-sm leading-relaxed">{q.question}</p>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Countdown / Leaderboard ───────────────────────────────────────────────────
  if (state.phase === 'countdown' || state.phase === 'leaderboard') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-center w-full max-w-sm"
        >
          <div className="text-6xl mb-4">
            {state.phase === 'countdown' ? '🧠' : '📊'}
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {state.phase === 'countdown'
              ? `Question ${state.currentIndex + 1}`
              : 'Leaderboard'}
          </h2>
          <p className="text-white/40 text-lg">
            {state.phase === 'countdown' ? 'Get ready!' : 'Scores updated'}
          </p>

          {/* My score */}
          <motion.div
            key={me.score}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="glass rounded-2xl px-6 py-4 mt-6 inline-block"
          >
            <p className="text-white/40 text-xs mb-1">Your score</p>
            <p className="text-3xl font-black text-purple-400">{me.score.toLocaleString()} <span className="text-white/30 text-base">pts</span></p>
          </motion.div>

          {/* Streak badge */}
          <AnimatePresence>
            {myStreak >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="mt-4"
              >
                <span className="glass px-4 py-2 rounded-full text-sm font-black text-orange-400">
                  🔥 {myStreak} in a row!
                  {myStreak >= 8 ? ' 2× bonus' : myStreak >= 5 ? ' 1.5× bonus' : myStreak >= 3 ? ' 1.25× bonus' : ''}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }

  // ── Finished ──────────────────────────────────────────────────────────────────
  if (state.phase === 'finished') {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-center"
        >
          <div className="text-7xl mb-3">🏆</div>
          <h2 className="text-2xl font-black text-white">Brain Blitz done!</h2>
          <p className="text-white/50 mt-2 text-xl font-bold">{me.score.toLocaleString()} pts</p>
          {myStreak >= 3 && (
            <p className="text-orange-400 font-bold mt-2">🔥 Max streak: {myStreak}</p>
          )}
        </motion.div>
      </div>
    )
  }

  // ── Main question screen ──────────────────────────────────────────────────────
  const isRevealed  = state.phase === 'reveal'
  const myIsCorrect = myAnswer && myAnswer.index === q.correctIndex

  return (
    <div className="min-h-screen bg-night-900 flex flex-col p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/30 text-xs uppercase tracking-wider">
            Q {state.currentIndex + 1}/{state.questions.length}
          </p>
          <p className="text-white/50 text-sm font-medium">{state.category}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak badge */}
          <AnimatePresence>
            {myStreak >= 2 && (
              <motion.span
                key={myStreak}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', bounce: 0.6 }}
                className="text-xs font-black text-orange-400 glass px-2 py-0.5 rounded-full"
              >
                🔥 {myStreak}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Mode indicator */}
          {state.mode === 'sudden-death' && (
            <span className="text-xs text-red-400 font-bold glass px-2 py-0.5 rounded-full">💀 SD</span>
          )}
          {state.mode === 'speed' && (
            <span className="text-xs text-yellow-400 font-bold glass px-2 py-0.5 rounded-full">⚡ Speed</span>
          )}

          <motion.span
            key={me.score}
            initial={{ scale: 1.2, color: '#a78bfa' }}
            animate={{ scale: 1, color: 'rgba(255,255,255,0.6)' }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-sm font-bold"
          >
            {me.score.toLocaleString()} pts
          </motion.span>
          {state.phase === 'question' && (
            <Timer startedAt={state.startedAt} duration={state.timeLimit} size="sm" />
          )}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`q-${state.currentIndex}`}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.25, duration: 0.35 }}
          className="glass rounded-2xl p-5 mb-4"
        >
          <p className="text-lg font-bold text-white leading-snug">{q.question}</p>
        </motion.div>
      </AnimatePresence>

      {/* Reveal feedback */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            ref={revealRef}
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.75, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className={`relative rounded-2xl p-4 text-center mb-4 text-xl font-black overflow-hidden ${
              myIsCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {myIsCorrect ? '✅ Correct!' : myAnswer ? '❌ Wrong!' : '⏱️ Time\'s up!'}
            {myIsCorrect && myStreak >= 3 && (
              <p className="text-sm font-bold text-orange-400 mt-1">🔥 {myStreak} streak combo!</p>
            )}
            {state.mode === 'sudden-death' && !myIsCorrect && (
              <p className="text-sm text-red-300/60 mt-1">You will be eliminated…</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked-in banner */}
      <AnimatePresence>
        {myAnswer && !isRevealed && (
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            className="rounded-2xl p-4 text-center mb-4 bg-purple-500/20 text-purple-400 font-bold"
          >
            ✓ Answer locked in!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="space-y-3 flex-1">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex
          const isMyPick  = myAnswer?.index === i || selected === i
          const locked    = !!myAnswer || state.phase !== 'question'

          let bg     = `${OPTION_COLORS[i]}22`
          let border = `${OPTION_COLORS[i]}55`

          if (isRevealed) {
            if (isCorrect)              { bg = '#22c55e33'; border = '#22c55e' }
            else if (isMyPick)          { bg = '#ef444433'; border = '#ef4444' }
            else                        { bg = '#ffffff08'; border = 'transparent' }
          } else if (isMyPick) {
            bg     = `${OPTION_COLORS[i]}44`
            border = OPTION_COLORS[i]
          }

          return (
            <motion.button
              key={i}
              initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
              animate={{
                x:       0,
                opacity: isRevealed && !isCorrect && !isMyPick ? 0.3 : 1,
                scale:   isRevealed && isCorrect ? 1.03 : 1,
              }}
              transition={{ delay: i * 0.06, type: 'spring', bounce: 0.3 }}
              whileTap={!locked ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(i)}
              disabled={locked}
              className="w-full rounded-2xl px-5 flex items-center gap-4 disabled:cursor-default text-left"
              style={{ minHeight: '72px', paddingTop: '14px', paddingBottom: '14px', background: bg, border: `2px solid ${border}` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background: OPTION_COLORS[i], color: 'white' }}
              >
                {isRevealed && isCorrect ? '✓' : OPTION_LABELS[i]}
              </div>
              <span className="font-semibold text-white text-sm leading-snug">{opt}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
