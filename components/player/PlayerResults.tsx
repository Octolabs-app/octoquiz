'use client'
import type { RoomPublic, Player } from '@/lib/types'

interface Props { room: RoomPublic | null; me: Player | null }

const medals = ['🥇', '🥈', '🥉']

export default function PlayerResults({ room, me }: Props) {
  if (!room || !me) return null
  const sorted = [...room.players].sort((a, b) => b.score - a.score)
  const myRank = sorted.findIndex(p => p.id === me.id) + 1
  const winner = sorted[0]
  const iWon = winner?.id === me.id

  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center p-6 pt-10">
      <div className="text-center mb-8 animate-bounce-in">
        <div className="text-6xl mb-3">{myRank <= 3 ? medals[myRank - 1] : '🎮'}</div>
        <h1 className="text-3xl font-black mb-1">
          {iWon ? 'You Won!' : `#${myRank} Place`}
        </h1>
        <p className="text-white/50">
          {me.score.toLocaleString()} points
        </p>
      </div>

      <div className="w-full space-y-2">
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all"
            style={{
              background: p.id === me.id ? `${p.color}22` : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${p.id === me.id ? p.color + '66' : 'transparent'}`,
              transform: p.id === me.id ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span className="text-lg w-6 text-center">
              {i < 3 ? medals[i] : <span className="text-white/30 text-sm">#{i + 1}</span>}
            </span>
            <span className="text-xl">{p.avatar}</span>
            <span className="font-bold flex-1" style={{ color: p.color }}>
              {p.name} {p.id === me.id && <span className="text-white/30 text-xs">(you)</span>}
            </span>
            <span className="font-black text-white/80">{p.score.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 glass rounded-2xl p-4 w-full text-center">
        <p className="text-white/40 text-sm">Waiting for next game...</p>
        <p className="text-white/20 text-xs mt-1">The Game Master will start a new round</p>
      </div>
    </div>
  )
}
