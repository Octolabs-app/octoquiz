'use client'
import Link from 'next/link'
import type { RoomPublic, Player } from '@/lib/types'

export default function PlayerResults({
  room,
  me,
}: {
  room: RoomPublic | null
  me: Player | null
}) {
  if (!room || !me) return null
  const sorted = [...room.players].sort((a, b) => b.score - a.score)
  const rank = sorted.findIndex((p) => p.score === me.score) + 1
  const tied = sorted.filter((p) => p.score === sorted[0]?.score).length > 1
  return (
    <main className="quiz-results quiz-page-enter">
      <div className="quiz-section-heading">
        <p className="quiz-eyebrow">GOOD GAME. GREAT COMPANY.</p>
        <h1>
          {rank === 1
            ? tied
              ? 'You share the win!'
              : 'You take the win!'
            : `You finished #${rank}.`}
        </h1>
        <p>{me.score.toLocaleString()} points. Ready for another?</p>
      </div>
      <ol className="quiz-results-list">
        {sorted.map((p) => (
          <li key={p.id}>
            <span>{String(sorted.findIndex((x) => x.score === p.score) + 1).padStart(2, '0')}</span>
            <span className="quiz-avatar">{p.avatar}</span>
            <strong>
              {p.name}
              {p.id === me.id ? ' · You' : ''}
            </strong>
            <b>
              {p.score.toLocaleString()} <small>points</small>
            </b>
          </li>
        ))}
      </ol>
      <div className="quiz-panel">
        <p>The host will start the next game. Keep this screen open to stay at the table.</p>
      </div>
      <div className="quiz-results-actions">
        <Link className="quiz-button" href="/">
          Back to home
        </Link>
      </div>
    </main>
  )
}
