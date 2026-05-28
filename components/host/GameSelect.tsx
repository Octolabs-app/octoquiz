'use client'
import { useState } from 'react'
import type { RoomPublic, GameType } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'
import Scoreboard from '@/components/ui/Scoreboard'

interface Props {
  room: RoomPublic
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

const GAMES: { id: GameType; icon: string; title: string; desc: string; color: string; players: string }[] = [
  {
    id: 'trivia',
    icon: '🧠',
    title: 'Trivia',
    desc: 'Answer questions fast — speed = more points. Categories: General, Pop Culture, Science, Sports & more.',
    color: '#3b82f6',
    players: '2–16 players',
  },
  {
    id: 'flag-quiz',
    icon: '🏳️',
    title: 'Flag Quiz',
    desc: 'Guess the country from its flag before anyone else. Fastest correct answer wins the round.',
    color: '#22c55e',
    players: '2–16 players',
  },
  {
    id: 'imposter',
    icon: '🕵️',
    title: 'Imposter',
    desc: 'Everyone gets the same secret word… except one person. Discuss, deduce, and vote out the spy.',
    color: '#a855f7',
    players: '3–16 players',
  },
  {
    id: 'truth-or-dare',
    icon: '🎲',
    title: 'Truth or Dare',
    desc: 'Classic party game. Your phone picks — truth confessions or daring challenges. Safe & fun for all.',
    color: '#f97316',
    players: '2–16 players',
  },
]

export default function GameSelect({ room, socket }: Props) {
  const [selected, setSelected] = useState<GameType | null>(room.currentGame)
  const playerCount = room.players.length

  function handleSelect(game: GameType) {
    if (game === 'imposter' && playerCount < 3) return
    setSelected(game)
    socket.emit('select_game', game)
  }

  function handleStart() {
    if (!selected) return
    socket.emit('start_game')
  }

  return (
    <div className="min-h-screen bg-night-900 flex p-8 gap-8 no-select">
      {/* Left — game picker */}
      <div className="flex-1">
        <h2 className="text-3xl font-black mb-6 text-white">Choose a Game</h2>
        <div className="grid grid-cols-2 gap-4">
          {GAMES.map(g => {
            const locked = g.id === 'imposter' && playerCount < 3
            return (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              disabled={locked}
              title={locked ? 'Needs at least 3 players' : undefined}
              className={`text-left glass rounded-3xl p-6 transition-all border-2 ${
                locked
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:scale-[1.02] active:scale-[0.98]'
              } ${selected === g.id ? 'border-white/30 scale-[1.02]' : 'border-transparent'}`}
              style={{
                background: selected === g.id ? `${g.color}22` : undefined,
                boxShadow: selected === g.id ? `0 0 30px ${g.color}33` : undefined,
              }}
            >
              <div className="text-5xl mb-3">{g.icon}</div>
              <div className="text-xl font-black mb-1" style={{ color: g.color }}>{g.title}</div>
              <div className="text-white/50 text-sm leading-relaxed mb-3">{g.desc}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  className="inline-block text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: `${g.color}33`, color: g.color }}
                >
                  {g.players}
                </div>
                {locked && (
                  <div className="inline-block text-xs px-3 py-1 rounded-full font-medium bg-white/10 text-white/50">
                    Need {3 - playerCount} more
                  </div>
                )}
              </div>
            </button>
            )
          })}
        </div>

        {selected && (
          <button
            onClick={handleStart}
            className="mt-6 w-full py-5 rounded-2xl text-2xl font-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl animate-bounce-in"
            style={{
              background: `linear-gradient(135deg, ${GAMES.find(g => g.id === selected)!.color}, ${GAMES.find(g => g.id === selected)!.color}88)`,
              boxShadow: `0 20px 60px ${GAMES.find(g => g.id === selected)!.color}44`,
            }}
          >
            Start {GAMES.find(g => g.id === selected)!.icon} {GAMES.find(g => g.id === selected)!.title} →
          </button>
        )}
      </div>

      {/* Right — player list */}
      <div className="w-72 flex-shrink-0">
        <h3 className="text-lg font-bold text-white/50 mb-4 uppercase tracking-wider">
          Players ({room.players.length})
        </h3>
        <Scoreboard players={room.players} />
      </div>
    </div>
  )
}
