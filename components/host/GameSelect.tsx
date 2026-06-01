'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoomPublic, GameType, TriviaConfig, TriviaMode, TriviaDifficulty } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'
import Scoreboard from '@/components/ui/Scoreboard'
import { TRIVIA_CATEGORIES } from '@/lib/trivia-config'

interface Props {
  room:   RoomPublic
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

const GAMES: { id: GameType; icon: string; title: string; sub: string; color: string; players: string }[] = [
  { id: 'trivia',        icon: '🧠', title: 'Brain Blitz',   sub: 'Trivia · 12 categories · 3 modes', color: '#3b82f6', players: '1–50 players' },
  { id: 'flag-quiz',     icon: '🏳️', title: 'Flag Quiz',     sub: 'Guess countries from flags',       color: '#22c55e', players: '2–50 players' },
  { id: 'imposter',      icon: '🕵️', title: 'Imposter',      sub: 'Find the spy among you',           color: '#a855f7', players: '3–50 players' },
  { id: 'truth-or-dare', icon: '🎲', title: 'Truth or Dare', sub: 'Classic party confessions',        color: '#f97316', players: '2–50 players' },
]

const MODES: { id: TriviaMode; icon: string; label: string; desc: string; color: string }[] = [
  { id: 'classic',       icon: '🎯', label: 'Classic',      desc: '20s per question',               color: '#3b82f6' },
  { id: 'speed',         icon: '⚡', label: 'Speed Blitz',  desc: '10s — answer fast!',             color: '#f59e0b' },
  { id: 'sudden-death',  icon: '💀', label: 'Sudden Death', desc: 'Wrong answer = eliminated',      color: '#ef4444' },
]

const DIFFICULTIES: { id: TriviaDifficulty; icon: string; label: string; desc: string }[] = [
  { id: 'easy',   icon: '🟢', label: 'Easy',   desc: 'Popular questions' },
  { id: 'medium', icon: '🟡', label: 'Medium', desc: 'Some thinking required' },
  { id: 'hard',   icon: '🔴', label: 'Hard',   desc: 'Expert level' },
]

const ROUND_COUNTS = [10, 15, 20]

const DEFAULT_CONFIG: TriviaConfig = {
  category:      'Mixed',
  mode:          'classic',
  questionCount: 10,
  difficulty:    'medium',
}

export default function GameSelect({ room, socket }: Props) {
  const [selected,      setSelected]      = useState<GameType | null>(room.currentGame)
  const [triviaConfig,  setTriviaConfig]  = useState<TriviaConfig>(DEFAULT_CONFIG)
  const playerCount = room.players.length

  function handleSelect(game: GameType) {
    if (game === 'imposter' && playerCount < 3) return
    setSelected(game)
    socket.emit('select_game', game)
  }

  function handleStart() {
    if (!selected) return
    if (selected === 'trivia') {
      socket.emit('start_game', triviaConfig)
    } else {
      socket.emit('start_game')
    }
  }

  function updateTrivia<K extends keyof TriviaConfig>(key: K, val: TriviaConfig[K]) {
    setTriviaConfig(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="min-h-screen bg-night-900 flex p-6 gap-6 no-select overflow-auto">
      {/* ── Left: game picker + trivia config ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        <h2 className="text-3xl font-black text-white">Choose a Game</h2>

        {/* Game cards */}
        <div className="grid grid-cols-2 gap-3">
          {GAMES.map(g => {
            const locked = g.id === 'imposter' && playerCount < 3
            return (
              <button
                key={g.id}
                onClick={() => handleSelect(g.id)}
                disabled={locked}
                className={`text-left glass rounded-2xl p-5 transition-all border-2 ${
                  locked ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                } ${selected === g.id ? 'border-white/30' : 'border-transparent'}`}
                style={{
                  background:  selected === g.id ? `${g.color}1a` : undefined,
                  boxShadow:   selected === g.id ? `0 0 30px ${g.color}33` : undefined,
                }}
              >
                <div className="text-4xl mb-2">{g.icon}</div>
                <div className="text-lg font-black mb-0.5" style={{ color: g.color }}>{g.title}</div>
                <div className="text-white/40 text-xs leading-snug mb-2">{g.sub}</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full font-medium inline-block"
                  style={{ background: `${g.color}22`, color: g.color }}>
                  {locked ? `Need ${3 - playerCount} more` : g.players}
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Brain Blitz config panel ── */}
        <AnimatePresence>
          {selected === 'trivia' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
              className="glass rounded-2xl p-5 space-y-5 border border-blue-500/20"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                <div>
                  <p className="font-black text-white text-lg">Brain Blitz Setup</p>
                  <p className="text-white/40 text-xs">Configure your game</p>
                </div>
              </div>

              {/* Category grid */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-bold">Category</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {TRIVIA_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => updateTrivia('category', cat.id)}
                      className="rounded-xl py-2 px-1 text-center text-xs font-bold transition-all border"
                      style={{
                        background: triviaConfig.category === cat.id ? `${cat.color}30` : 'rgba(255,255,255,0.04)',
                        borderColor: triviaConfig.category === cat.id ? cat.color : 'transparent',
                        color: triviaConfig.category === cat.id ? cat.color : 'rgba(255,255,255,0.5)',
                      }}
                    >
                      <div className="text-lg mb-0.5">{cat.icon}</div>
                      <div className="leading-tight">{cat.id.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-bold">Game Mode</p>
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map(m => (
                    <button
                      key={m.id}
                      onClick={() => updateTrivia('mode', m.id)}
                      className="rounded-xl py-3 px-2 text-center transition-all border"
                      style={{
                        background:  triviaConfig.mode === m.id ? `${m.color}25` : 'rgba(255,255,255,0.04)',
                        borderColor: triviaConfig.mode === m.id ? m.color : 'transparent',
                      }}
                    >
                      <div className="text-xl mb-1">{m.icon}</div>
                      <div className="text-xs font-black" style={{ color: triviaConfig.mode === m.id ? m.color : 'rgba(255,255,255,0.7)' }}>
                        {m.label}
                      </div>
                      <div className="text-[10px] text-white/30 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty + Round count side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-bold">Difficulty</p>
                  <div className="flex gap-1.5">
                    {DIFFICULTIES.map(d => (
                      <button
                        key={d.id}
                        onClick={() => updateTrivia('difficulty', d.id)}
                        title={d.desc}
                        className="flex-1 rounded-xl py-2 text-center text-xs font-bold transition-all border"
                        style={{
                          background:  triviaConfig.difficulty === d.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                          borderColor: triviaConfig.difficulty === d.id ? 'rgba(255,255,255,0.3)' : 'transparent',
                          color:       triviaConfig.difficulty === d.id ? 'white' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        <div className="text-base">{d.icon}</div>
                        <div>{d.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-bold">Questions</p>
                  <div className="flex gap-1.5">
                    {ROUND_COUNTS.map(n => (
                      <button
                        key={n}
                        onClick={() => updateTrivia('questionCount', n)}
                        className="flex-1 rounded-xl py-2 text-center text-sm font-black transition-all border"
                        style={{
                          background:  triviaConfig.questionCount === n ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.04)',
                          borderColor: triviaConfig.questionCount === n ? '#3b82f6' : 'transparent',
                          color:       triviaConfig.questionCount === n ? '#93c5fd' : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start button */}
        {selected && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-5 rounded-2xl text-2xl font-black transition-all shadow-2xl"
            style={{
              background:  `linear-gradient(135deg, ${GAMES.find(g => g.id === selected)!.color}, ${GAMES.find(g => g.id === selected)!.color}99)`,
              boxShadow:   `0 20px 60px ${GAMES.find(g => g.id === selected)!.color}44`,
            }}
          >
            {GAMES.find(g => g.id === selected)!.icon}{' '}
            Launch {GAMES.find(g => g.id === selected)!.title} →
          </motion.button>
        )}
      </div>

      {/* ── Right: player list ── */}
      <div className="w-64 flex-shrink-0">
        <h3 className="text-sm font-bold text-white/40 mb-4 uppercase tracking-wider">
          Players ({room.players.length})
        </h3>
        <Scoreboard players={room.players} />
      </div>
    </div>
  )
}
