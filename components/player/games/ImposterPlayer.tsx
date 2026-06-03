'use client'
import { useState } from 'react'
import type { ImposterState, Player, RoomPublic } from '@/lib/types'
import { useHaptic } from '@/hooks/useHaptic'

interface Props {
  state: ImposterState
  me: Player
  room: RoomPublic
  sendAction: (action: import('@/lib/types').GameAction) => void
}

export default function ImposterPlayer({ state, me, room, sendAction }: Props) {
  const [voted, setVoted] = useState<string | null>(null)
  const isImposter = state.imposterId === me.id
  const myVote = state.votes[me.id]
  const { haptic } = useHaptic()

  function handleVote(targetId: string) {
    if (myVote || targetId === me.id) return
    haptic(50)
    setVoted(targetId)
    sendAction({ type: 'imposter_vote', targetId })
  }

  // Reveal phase — show secret word
  if (state.phase === 'reveal') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
        <div className="text-center animate-bounce-in w-full max-w-xs">
          <div className="text-5xl mb-3">🤫</div>
          <p className="text-white/40 text-sm uppercase tracking-widest mb-6">Your secret word</p>

          <div
            className={`rounded-3xl p-8 text-center mb-6 w-full ${
              isImposter ? 'border-2 border-red-500' : 'border-2 border-purple-500'
            }`}
            style={{
              background: isImposter ? '#ef444422' : '#a855f722',
            }}
          >
            <p className={`text-5xl font-black ${isImposter ? 'text-red-400' : 'text-purple-400'}`}>
              {isImposter ? state.imposterWord : state.realWord}
            </p>
            {isImposter && (
              <p className="text-red-400/70 text-sm mt-3">You are the 🕵️ Imposter!</p>
            )}
          </div>

          <div className="glass rounded-2xl p-4 text-sm text-white/50 leading-relaxed">
            {isImposter
              ? "Your word is different! Try to blend in and figure out what everyone else's word is."
              : "Remember your word! Answer questions about it without giving it away. Find the imposter!"}
          </div>
          <p className="text-white/30 text-sm mt-4">👀 Wait for the host to start the discussion</p>
        </div>
      </div>
    )
  }

  // Discussion phase
  if (state.phase === 'discussion') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
        <div className="text-center animate-bounce-in w-full max-w-xs">
          <div className="text-5xl mb-3">💬</div>
          <h2 className="text-2xl font-black text-white mb-2">Discuss!</h2>
          <p className="text-white/50 text-sm mb-8">Talk about your word without saying it directly</p>

          <div
            className="rounded-2xl p-5 text-center mb-6"
            style={{
              background: isImposter ? '#ef444422' : '#a855f722',
              border: `2px solid ${isImposter ? '#ef4444' : '#a855f7'}`,
            }}
          >
            <p className="text-white/40 text-xs mb-1">Your word</p>
            <p className={`text-3xl font-black ${isImposter ? 'text-red-400' : 'text-purple-400'}`}>
              {isImposter ? state.imposterWord : state.realWord}
            </p>
          </div>

          <div className="glass rounded-2xl p-4 text-sm text-white/40">
            {isImposter
              ? '🕵️ Try to figure out what everyone else\'s word is!'
              : '🔍 Listen carefully — one person has a different word!'}
          </div>
        </div>
      </div>
    )
  }

  // Voting phase
  if (state.phase === 'voting') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col p-4 pt-8">
        <div className="text-center mb-6 animate-bounce-in">
          <div className="text-4xl mb-2">🗳️</div>
          <h2 className="text-2xl font-black text-white">Vote!</h2>
          <p className="text-white/40 text-sm">Who is the Imposter?</p>
        </div>

        {myVote ? (
          <div className="glass rounded-2xl p-6 text-center animate-bounce-in">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white/60 font-medium">Vote submitted!</p>
            <p className="text-white/40 text-sm mt-1">Waiting for others...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {room.players
              .filter(p => p.id !== me.id)
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => handleVote(p.id)}
                  className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 transition-all active:scale-[0.97] hover:scale-[1.01]"
                  style={{
                    background: voted === p.id ? `${p.color}33` : 'rgba(255,255,255,0.06)',
                    border: `2px solid ${voted === p.id ? p.color : 'rgba(255,255,255,0.1)'}`,
                  }}
                >
                  <span className="text-2xl">{p.avatar}</span>
                  <span className="font-bold text-white flex-1 text-left">{p.name}</span>
                  <span className="text-xl">
                    {voted === p.id ? '👆' : '→'}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    )
  }

  // Result / finished
  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
      <div className="text-center animate-bounce-in">
        <div className="text-5xl mb-3">📺</div>
        <h2 className="text-2xl font-black text-white mb-2">Check the TV!</h2>
        <p className="text-white/40 text-sm">See who the imposter was</p>
        <p className="text-white/60 text-xl font-bold mt-4">
          {me.score.toLocaleString()} pts
        </p>
      </div>
    </div>
  )
}
