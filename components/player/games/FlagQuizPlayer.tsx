'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { FlagQuizState, Player } from '@/lib/types'
import Timer from '@/components/ui/Timer'
import { useSound } from '@/hooks/useSound'
import { useHaptic } from '@/hooks/useHaptic'

interface Props {
  state: FlagQuizState
  me: Player
  sendAction: (action: import('@/lib/types').GameAction) => void
}

export default function FlagQuizPlayer({ state, me, sendAction }: Props) {
  const q = state.questions[state.currentIndex]
  const myAnswer = state.answers[me.id]
  const { play } = useSound()
  const { haptic } = useHaptic()
  const prevPhase = useRef(state.phase)

  // Sound + haptic on reveal
  useEffect(() => {
    if (state.phase !== prevPhase.current) {
      if (state.phase === 'reveal') {
        if (myAnswer?.correct) { play('correct'); haptic([50, 30, 100]) }
        else { play('wrong'); haptic(200) }
      }
      prevPhase.current = state.phase
    }
  }, [state.phase, myAnswer, play, haptic])

  function handleAnswer(country: string) {
    if (myAnswer || state.phase !== 'question') return
    play('select')
    haptic(50)
    sendAction({ type: 'flag_answer', answer: country })
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
          <div className="text-6xl mb-4">🏳️</div>
          <h2 className="text-3xl font-black text-white mb-2">
            {state.phase === 'countdown' ? `Flag ${state.currentIndex + 1}` : 'Scores!'}
          </h2>
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
          <div className="text-6xl mb-3">🌍</div>
          <h2 className="text-2xl font-black text-white">Finished!</h2>
          <p className="text-white/50 mt-2">{me.score.toLocaleString()} pts</p>
        </motion.div>
      </div>
    )
  }

  const revealed = state.phase === 'reveal'
  const myIsCorrect = myAnswer?.correct
  const flagUrl = `https://flagcdn.com/w320/${q.countryCode.toLowerCase()}.png`

  return (
    <div className="min-h-screen bg-night-900 flex flex-col p-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/30 text-xs uppercase tracking-wider">
            Flag {state.currentIndex + 1}/{state.questions.length}
          </p>
          <motion.p
            key={me.score}
            initial={{ scale: 1.2, color: '#a78bfa' }}
            animate={{ scale: 1, color: 'rgba(255,255,255,0.6)' }}
            className="text-sm font-bold"
          >
            {me.score.toLocaleString()} pts
          </motion.p>
        </div>
        {state.phase === 'question' && (
          <Timer startedAt={state.startedAt} duration={state.timeLimit} size="sm" />
        )}
      </div>

      {/* Flag image — shown on player phone */}
      <motion.div
        key={`pflag-${state.currentIndex}`}
        initial={{ scale: 0.6, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
        className="flex justify-center mb-4"
        style={{ perspective: 800 }}
      >
        <div className="relative">
          <Image
            src={flagUrl}
            alt="Flag"
            width={200}
            height={133}
            className="rounded-xl"
            style={{
              boxShadow: '0 12px 40px -8px rgba(0,0,0,0.6)',
              border: '2px solid rgba(255,255,255,0.12)',
              width: 'min(200px, 65vw)',
              height: 'auto',
            }}
            priority
            unoptimized
          />
        </div>
      </motion.div>
      <p className="text-white/30 text-sm text-center mb-4">Which country is this?</p>

      {/* Reveal feedback */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className={`rounded-2xl p-4 text-center mb-4 text-xl font-black ${
              myIsCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {myIsCorrect
              ? `✅ ${q.countryName}!`
              : myAnswer
              ? `❌ It was ${q.countryName}`
              : `⏱️ It was ${q.countryName}`}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {myAnswer && !revealed && (
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-2xl p-4 text-center mb-4 bg-purple-500/20 text-purple-400 font-bold"
          >
            ✓ Locked in: {myAnswer.answer}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {q.options.map((opt, i) => {
          const isCorrect = opt === q.countryName
          const isMyPick = myAnswer?.answer === opt
          const locked = !!myAnswer || state.phase !== 'question'

          let bg = 'rgba(255,255,255,0.06)'
          let border = 'rgba(255,255,255,0.1)'

          if (revealed) {
            if (isCorrect) { bg = '#22c55e22'; border = '#22c55e' }
            else if (isMyPick) { bg = '#ef444422'; border = '#ef4444' }
            else { bg = 'rgba(255,255,255,0.03)'; border = 'transparent' }
          } else if (isMyPick) {
            bg = 'rgba(168,85,247,0.25)'
            border = '#a855f7'
          }

          return (
            <motion.button
              key={opt}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: revealed && !isCorrect && !isMyPick ? 0.3 : 1,
                y: 0,
                scale: revealed && isCorrect ? 1.04 : 1,
              }}
              transition={{ delay: i * 0.05, type: 'spring', bounce: 0.3 }}
              whileTap={!locked ? { scale: 0.94 } : {}}
              onClick={() => handleAnswer(opt)}
              disabled={locked}
              className="rounded-2xl py-5 px-3 font-bold text-white text-center transition-colors"
              style={{ background: bg, border: `2px solid ${border}` }}
            >
              {opt}
              {revealed && isCorrect && ' ✅'}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
