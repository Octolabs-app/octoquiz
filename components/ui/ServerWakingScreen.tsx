'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Shown whenever the Socket.IO connection isn't established yet.
 *
 * The very first request of the evening on Render's free tier triggers
 * a ~30s cold start. Without this screen, players just see a blank page
 * and assume something is broken. With it, they see a friendly progress
 * indicator + an explanation, so they know to wait.
 *
 * For the first 2 seconds we show a quiet spinner (most connections
 * complete fast — no point flashing a scary "server is asleep" message
 * for a normal 200ms handshake). After 2s we escalate the message.
 */
export default function ServerWakingScreen({
  variant = 'player',
}: {
  variant?: 'player' | 'host'
}) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const slow  = elapsed >= 2     // start showing the cold-start hint
  const long  = elapsed >= 10    // remind them this is normal
  const stuck = elapsed >= 45    // probably actually broken

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-night-900 px-6 text-center relative overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(168,85,247,0.18)' }}
      />

      <div className="relative z-10 max-w-sm w-full">
        {/* Animated dots / spinner */}
        <div className="relative h-16 mb-6 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-full"
            style={{
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: '#a855f7',
              borderRightColor: '#a855f7',
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute text-3xl"
          >
            🎮
          </motion.div>
        </div>

        {/* Headline that escalates with elapsed time */}
        <motion.h2
          key={slow ? 'slow' : 'normal'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-white mb-2"
        >
          {!slow  && 'Connecting…'}
          {slow && !long  && '☕ Waking up the server…'}
          {long && !stuck && '☕ Almost there!'}
          {stuck && '😬 Hmm, this is taking a while.'}
        </motion.h2>

        {/* Body copy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/50 text-sm leading-relaxed mb-6"
        >
          {!slow && (
            <p>Just a sec…</p>
          )}
          {slow && !stuck && (
            <>
              <p className="mb-2">
                {variant === 'host'
                  ? "The TV is connecting to OctoQuiz's game server."
                  : "Your phone is connecting to the game."}
              </p>
              <p className="text-white/40 text-xs">
                The server takes about <span className="text-purple-400 font-bold">30 seconds</span> to wake up
                if no one's played recently — that's free hosting for you.
                It'll be lightning-fast after this.
              </p>
            </>
          )}
          {stuck && (
            <>
              <p className="mb-2">Still trying — refreshing should help.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 inline-block rounded-full bg-purple-600 hover:bg-purple-500 px-5 py-2 text-white font-bold text-sm transition-colors"
              >
                🔄 Reload
              </button>
            </>
          )}
        </motion.div>

        {/* Progress strip (only shown once cold-start is admitted) */}
        {slow && !stuck && (
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
              initial={{ width: '0%' }}
              animate={{ width: ['0%', '95%'] }}
              transition={{ duration: 30, ease: 'easeOut' }}
            />
          </div>
        )}

        {/* Elapsed counter — subtle, only after we admit cold start */}
        {slow && (
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/30">
            {elapsed}s
          </p>
        )}
      </div>
    </div>
  )
}
