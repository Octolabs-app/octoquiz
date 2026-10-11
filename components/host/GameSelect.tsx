'use client'
import { useState } from 'react'
import type { RoomPublic, GameType, TriviaConfig } from '@/lib/types'
import type { HostEmit } from '@/lib/host-emit'
import { TRIVIA_CATEGORIES } from '@/lib/trivia-config'
const games: {
  id: GameType
  title: string
  description: string
  symbol: string
  minimum: number
}[] = [
  {
    id: 'trivia',
    title: 'Brain Blitz',
    description: 'Big questions from twelve categories.',
    symbol: '?',
    minimum: 1,
  },
  {
    id: 'flag-quiz',
    title: 'Flags',
    description: 'A whole world in four answers.',
    symbol: '⚑',
    minimum: 1,
  },
  {
    id: 'capitals',
    title: 'Capitals',
    description: 'Find the city. Claim the points.',
    symbol: '⌂',
    minimum: 1,
  },
  {
    id: 'landmarks',
    title: 'Landmarks',
    description: 'Famous places. Familiar faces?',
    symbol: '▥',
    minimum: 1,
  },
  {
    id: 'imposter',
    title: 'Imposter',
    description: 'Someone knows a different word.',
    symbol: '…',
    minimum: 3,
  },
  {
    id: 'drawimposter',
    title: 'Decoy',
    description: 'Draw together. Spot the odd one out.',
    symbol: '✎',
    minimum: 3,
  },
]
export default function GameSelect({ room, emit }: { room: RoomPublic; emit: HostEmit }) {
  const [starting, setStarting] = useState(false),
    [startError, setStartError] = useState('')
  const [selected, setSelected] = useState<GameType>(room.currentGame ?? 'trivia'),
    [config, setConfig] = useState<TriviaConfig>({
      category: 'Mixed',
      mode: 'classic',
      questionCount: 10,
      difficulty: 'medium',
    })
  const count = room.players.filter((p) => p.isConnected).length,
    game = games.find((g) => g.id === selected)!
  return (
    <main className="quiz-select quiz-page-enter">
      <div className="quiz-section-heading">
        <p className="quiz-eyebrow">A LITTLE FRIENDLY COMPETITION</p>
        <h1>What’s on the table?</h1>
        <p>
          {count} player{count === 1 ? '' : 's'} ready. Six ways to spend a good evening.
        </p>
      </div>
      <div className="quiz-select-grid">
        <section className="quiz-game-grid">
          {games.map((g, i) => (
            <button
              key={g.id}
              className={`quiz-game-card game-color-${i}`}
              disabled={count < g.minimum}
              aria-pressed={selected === g.id}
              onClick={() => {
                setSelected(g.id)
                emit.selectGame(g.id)
              }}
            >
              <span className="quiz-game-symbol">{g.symbol}</span>
              <h2>{g.title}</h2>
              <p>{g.description}</p>
              <small>
                {count < g.minimum
                  ? `Needs ${g.minimum} connected players`
                  : selected === g.id
                    ? 'Selected ✓'
                    : g.minimum === 3
                      ? '3+ players'
                      : 'Quiz game'}
              </small>
            </button>
          ))}
        </section>
        <aside className="quiz-panel quiz-game-settings">
          <p className="quiz-eyebrow">YOUR NEXT GAME</p>
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          {selected === 'trivia' && (
            <div className="quiz-form">
              <label>
                Category
                <select
                  value={config.category}
                  onChange={(e) => setConfig({ ...config, category: e.target.value })}
                >
                  {TRIVIA_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Game mode
                <select
                  value={config.mode}
                  onChange={(e) =>
                    setConfig({ ...config, mode: e.target.value as TriviaConfig['mode'] })
                  }
                >
                  <option value="classic">Classic · 20 seconds</option>
                  <option value="speed">Speed · 7–15 seconds</option>
                  <option value="sudden-death">Sudden Death · wrong answers eliminate</option>
                </select>
              </label>
              <label>
                Difficulty
                <select
                  value={config.difficulty}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      difficulty: e.target.value as TriviaConfig['difficulty'],
                    })
                  }
                >
                  {['easy', 'medium', 'hard'].map((d) => (
                    <option value={d} key={d}>
                      {d[0].toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Questions
                <select
                  value={config.questionCount}
                  onChange={(e) => setConfig({ ...config, questionCount: Number(e.target.value) })}
                >
                  {[10, 15, 20].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
          <button
            className="quiz-primary"
            disabled={count < game.minimum || starting}
            onClick={async () => {
              setStarting(true)
              setStartError('')
              try {
                await emit.startGame(selected === 'trivia' ? config : undefined)
              } catch {
                setStartError('Could not prepare this game. Check your connection and try again.')
              } finally {
                setStarting(false)
              }
            }}
          >
            {starting ? 'Preparing your game…' : `Start ${game.title}`}
          </button>
          {startError && <p role="alert">{startError}</p>}
          <p className="quiz-muted">Everyone sees the next question together.</p>
        </aside>
      </div>
    </main>
  )
}
