'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TriviaState, Player } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'
import Timer from '@/components/ui/Timer'
import { useSound } from '@/hooks/useSound'
import { useHaptic } from '@/hooks/useHaptic'

interface Props {
  state: TriviaState
  me: Player
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308']

// Simple confetti burst via DOM
function spawnConfetti(container: HTMLElement | null) {
  if (!container) return
  const colors = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171']
  for (let k = 0; k < 28; k++) {
    const el = document.createElement('div')
    el.style.cssText = `
      position:absolute;
      width:${6 + Math.random() * 6}px;
      height:${6 + Math.random() * 6}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      background:${colors[Math.floor(Math.random() * colors.length)]};
      top:50%;left:50%;
      pointer-events:none;
      z-index:50;
      transform-origin:center;
    `
    container.appendChild(el)
    const angle = (Math.random() * 360 * Math.PI) / 180
    const dist = 60 + Math.random() * 100
    const tx = Math.cos(angle) * dist
    const ty = Math.sin(angle) * dist - 60
    el.animate(
      [
        { transform: `translate(-50%,-50%) scale(1)`, opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.4) rotate(${Math.random() * 360}deg)`, opacity: 0 },
      ],
      { duration: 700 + Math.random() * 400, easing: 'ease-out', fill: 'forwards' },
    ).onfinish = () => el.remove()
  }
}

export default function TriviaPlayer({ state, me, socket }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const myAnswer = state.answers[me.id]
  const q = state.questions[state.currentIndex]
  const { play } = useSound()
  const { haptic } = useHaptic()
  const prevPhase = useRef(state.phase)
  const prevIndex = useRef(state.currentIndex)
  const revealRef = useRef<HTMLDivElement | null>(null)

  // Reset selected on new question
  useEffect(() => {
    if (state.currentIndex !== prevIndex.current) {
      setSelected(null)
      prevIndex.current = state.currentIndex
    }
  }, [state.currentIndex])

  // Sound on reveal
  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      if (state.phase === 'reveal') {
        const myIsCorrect = myAnswer && myAnswer.index === q.correctIndex
        if (myIsCorrect) {
          play('correct')
          play('points')
          haptic([50, 30, 100])   // double-pulse for correct
          setTimeout(() => spawnConfetti(revealRef.current), 100)
        } else {
          play('wrong')
          haptic(200)             // long buzz for wrong
        }
      }
      prevPhase.current = state.phase
    }
  }, [state.phase, myAnswer, q.correctIndex, play])

  function handleAnswer(idx: number) {
    if (myAnswer || state.phase !== 'question') return
    play('select')
    haptic(50)
    setSelected(idx)
    socket.emit('game_action', { type: 'trivia_answer', answerId: idx })
  }

  if (state.phase === 'countdown' || state.phase === 'leaderboard') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-3xl font-black text-white mb-2">
            {state.phase === 'countdown'
              ? `Question ${state.currentIndex + 1}`
              : 'Leaderboard'}
          </h2>
          <p className="text-white/40 text-lg">
            {state.phase === 'countdown' ? 'Get ready!' : 'Scores updated'}
          </p>
          <motion.p
            key={me.score}
            initial={{ scale: 1.3, color: '#a78bfa' }}
            animate={{ scale: 1, color: 'rgba(255,255,255,0.6)' }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-2xl font-bold mt-4"
          >
            {me.score.toLocaleString()} <span className="text-white/30 text-base">pts</span>
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (state.phase === 'finished') {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-center"
        >
          <div className="text-6xl mb-3">✅</div>
          <h2 className="text-2xl font-black text-white">Done!</h2>
          <p className="text-white/50 mt-2">{me.score.toLocaleString()} pts total</p>
        </motion.div>
      </div>
    )
  }

  const isRevealed = state.phase === 'reveal'
  const myIsCorrect = myAnswer && myAnswer.index === q.correctIndex

  return (
    <div className="min-h-screen bg-night-900 flex flex-col p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/30 text-xs uppercase tracking-wider">
            Question {state.currentIndex + 1}/{state.questions.length}
          </p>
          <p className="text-white/60 text-sm font-medium">{state.category}</p>
        </div>
        <div className="flex items-center gap-3">
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
          </motion.div>
        )}
      </AnimatePresence>

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
          const isMyPick = myAnswer?.index === i || selected === i
          const locked = !!myAnswer || state.phase !== 'question'

          let bg = `${OPTION_COLORS[i]}22`
          let border = `${OPTION_COLORS[i]}55`

          if (isRevealed) {
            if (isCorrect) { bg = '#22c55e33'; border = '#22c55e' }
            else if (isMyPick && !isCorrect) { bg = '#ef444433'; border = '#ef4444' }
            else { bg = '#ffffff08'; border = 'transparent' }
          } else if (isMyPick) {
            bg = `${OPTION_COLORS[i]}44`
            border = OPTION_COLORS[i]
          }

          return (
            <motion.button
              key={i}
              initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
              animate={{
                x: 0,
                opacity: isRevealed && !isCorrect && !isMyPick ? 0.35 : 1,
                scale: isRevealed && isCorrect ? 1.03 : 1,
              }}
              transition={{ delay: i * 0.06, type: 'spring', bounce: 0.3 }}
              whileTap={!locked ? { scale: 0.95 } : {}}
              onClick={() => handleAnswer(i)}
              disabled={locked}
              className="w-full rounded-2xl px-5 py-4 flex items-center gap-4 disabled:cursor-default text-left"
              style={{ background: bg, border: `2px solid ${border}` }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ background: OPTION_COLORS[i], color: 'white' }}
              >
                {isRevealed && isCorrect ? '✓' : OPTION_LABELS[i]}
              </div>
              <span className="font-semibold text-white">{opt}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
