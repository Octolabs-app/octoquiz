'use client'
import type { RoomPublic } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'

interface Props {
  room: RoomPublic
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

const medals = ['🥇', '🥈', '🥉']
const confetti = ['🎉', '🎊', '✨', '🌟', '🏆']

export default function ResultsScreen({ room, socket }: Props) {
  const sorted = [...room.players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]

  function playAgain() {
    socket.emit('select_game', 'trivia')
  }

  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select">
      <div className="text-center mb-12 animate-bounce-in">
        <div className="text-8xl mb-4">🏆</div>
        <h1 className="text-6xl font-black mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Game Over!
        </h1>
        {winner && (
          <p className="text-3xl text-white/70">
            <span style={{ color: winner.color }}>{winner.avatar} {winner.name}</span>
            {' '}wins with{' '}
            <span className="text-yellow-400 font-black">{winner.score.toLocaleString()} pts</span>
          </p>
        )}
      </div>

      {/* Podium for top 3 */}
      <div className="flex items-end gap-4 mb-12 w-full max-w-2xl justify-center">
        {[sorted[1], sorted[0], sorted[2]].map((p, i) => {
          if (!p) return <div key={i} className="w-40" />
          const heights = ['h-40', 'h-56', 'h-32']
          const positions = [2, 1, 3]
          return (
            <div
              key={p.id}
              className="flex flex-col items-center gap-2 animate-fade-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="text-3xl">{p.avatar}</div>
              <div className="font-bold text-sm" style={{ color: p.color }}>{p.name}</div>
              <div className="text-white/60 text-xs font-black">{p.score.toLocaleString()}</div>
              <div
                className={`w-32 ${heights[i]} rounded-t-2xl flex items-start justify-center pt-3 text-2xl font-black`}
                style={{ background: `${p.color}33`, border: `2px solid ${p.color}66` }}
              >
                {medals[positions[i] - 1]}
              </div>
            </div>
          )
        })}
      </div>

      {/* Full leaderboard */}
      {sorted.length > 3 && (
        <div className="w-full max-w-md mb-8 space-y-2">
          {sorted.slice(3).map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 glass rounded-xl px-4 py-2"
            >
              <span className="text-white/30 text-sm w-6">#{i + 4}</span>
              <span>{p.avatar}</span>
              <span className="flex-1 font-medium" style={{ color: p.color }}>{p.name}</span>
              <span className="font-black text-white/70">{p.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={playAgain}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-2xl px-10 py-4 text-xl font-black transition-all active:scale-95"
        >
          🎮 Play Again
        </button>
      </div>
    </div>
  )
}
