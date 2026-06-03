'use client'
import { useEffect, useState } from 'react'
import type { RoomPublic, ImposterState } from '@/lib/types'
import type { HostEmit } from '@/lib/host-emit'
import Scoreboard from '@/components/ui/Scoreboard'
import PlayerBadge from '@/components/ui/PlayerBadge'

interface Props {
  room: RoomPublic
  state: ImposterState
  emit: HostEmit
}

export default function ImposterHost({ room, state, emit }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (state.phase !== 'discussion' || !state.discussionStartedAt) return
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - state.discussionStartedAt!) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [state.phase, state.discussionStartedAt])

  const timeLeft = Math.max(0, state.discussionSeconds - elapsed)
  const votesIn = Object.keys(state.votes).length

  // Reveal phase — players are reading their words
  if (state.phase === 'reveal') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select">
        <div className="text-center animate-bounce-in mb-12">
          <div className="text-8xl mb-4">🕵️</div>
          <h1 className="text-6xl font-black text-white mb-3">Round {state.round}/{state.totalRounds}</h1>
          <p className="text-white/50 text-2xl">Players, check your secret word on your phone!</p>
          <p className="text-white/30 text-lg mt-2">One player has a <span className="text-purple-400">different word</span>. Can you find them?</p>
        </div>
        <div className="grid grid-cols-4 gap-3 max-w-2xl w-full mb-12">
          {room.players.map(p => (
            <PlayerBadge key={p.id} player={p} size="md" />
          ))}
        </div>
        <button
          onClick={() => emit.nextRound()}
          className="bg-purple-600 hover:bg-purple-500 rounded-2xl px-12 py-5 text-2xl font-black transition-all active:scale-95 animate-pulse-glow"
        >
          Start Discussion →
        </button>
      </div>
    )
  }

  // Discussion phase — free talk
  if (state.phase === 'discussion') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select">
        <div className="flex items-center justify-between w-full max-w-3xl mb-8">
          <div>
            <p className="text-white/30 uppercase tracking-widest text-sm">Round {state.round}/{state.totalRounds}</p>
            <h2 className="text-5xl font-black text-white">Discuss!</h2>
          </div>
          <div className="text-center">
            <div
              className={`text-7xl font-black tabular-nums ${timeLeft < 20 ? 'text-red-400 animate-pulse' : 'text-white'}`}
            >
              {timeLeft}s
            </div>
            <p className="text-white/40 text-sm">until voting</p>
          </div>
        </div>
        <div className="glass rounded-3xl p-8 w-full max-w-3xl text-center mb-8">
          <p className="text-2xl text-white/70 leading-relaxed">
            Ask each other about your secret word. <br />
            <span className="text-purple-400">One player's word is different</span> — find the imposter!
          </p>
          <p className="text-white/30 mt-3 text-sm">Tip: Ask general questions like "describe it in one word" or "where would you find it?"</p>
        </div>
        <div className="grid grid-cols-4 gap-3 max-w-2xl w-full">
          {room.players.map(p => (
            <PlayerBadge key={p.id} player={p} size="md" />
          ))}
        </div>
        {/* Progress bar */}
        <div className="mt-6 w-full max-w-3xl h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-1000"
            style={{ width: `${(elapsed / state.discussionSeconds) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  // Voting phase
  if (state.phase === 'voting') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select">
        <div className="text-center mb-10 animate-bounce-in">
          <div className="text-7xl mb-4">🗳️</div>
          <h2 className="text-5xl font-black text-white">Vote!</h2>
          <p className="text-white/50 text-xl mt-2">Who is the Imposter?</p>
          <p className="text-white/30 mt-1">{votesIn}/{room.players.length} votes in</p>
        </div>
        <div className="grid grid-cols-4 gap-4 max-w-2xl w-full">
          {room.players.map(p => {
            const voteCount = Object.values(state.votes).filter(v => v === p.id).length
            return (
              <div key={p.id} className="flex flex-col items-center gap-2">
                <PlayerBadge player={p} size="md" highlight={voteCount > 0} />
                {voteCount > 0 && (
                  <div className="flex gap-1">
                    {Array.from({ length: voteCount }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">👆</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {/* Vote progress */}
        <div className="mt-8 w-full max-w-2xl h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${(votesIn / room.players.length) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  // Result phase
  if (state.phase === 'result') {
    const lastResult = state.roundResults[state.roundResults.length - 1]
    const imposter = room.players.find(p => p.id === state.imposterId)

    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select">
        <div className="text-center animate-bounce-in">
          <div className="text-8xl mb-6">{lastResult?.caught ? '🎉' : '😈'}</div>
          <h2 className={`text-6xl font-black mb-4 ${lastResult?.caught ? 'text-green-400' : 'text-red-400'}`}>
            {lastResult?.caught ? 'Imposter Caught!' : 'Imposter Escapes!'}
          </h2>
          {imposter && (
            <p className="text-3xl text-white mb-2">
              <span style={{ color: imposter.color }}>{imposter.avatar} {imposter.name}</span> was the imposter!
            </p>
          )}
          <div className="flex items-center justify-center gap-8 mt-6 glass rounded-2xl px-10 py-5 inline-flex">
            <div className="text-center">
              <p className="text-white/40 text-sm">Everyone's word</p>
              <p className="text-3xl font-black text-white">{state.realWord}</p>
            </div>
            <div className="text-4xl text-white/20">vs</div>
            <div className="text-center">
              <p className="text-purple-400 text-sm">Imposter's word</p>
              <p className="text-3xl font-black text-purple-400">{state.imposterWord}</p>
            </div>
          </div>
        </div>
        <div className="mt-10 w-full max-w-md">
          <p className="text-white/40 text-center text-sm mb-3">Scores</p>
          <Scoreboard players={room.players} />
        </div>
      </div>
    )
  }

  // Finished
  return (
    <div className="min-h-screen bg-night-900 flex items-center justify-center">
      <div className="text-center animate-bounce-in">
        <div className="text-7xl mb-4">🕵️</div>
        <h2 className="text-5xl font-black text-white">Game Complete!</h2>
      </div>
    </div>
  )
}
