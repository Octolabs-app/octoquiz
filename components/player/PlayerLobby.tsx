'use client'
import type { RoomPublic, Player } from '@/lib/types'
export default function PlayerLobby({
  room,
  me,
}: {
  room: RoomPublic | null
  me: Player | null
  emit?: unknown
}) {
  if (!room || !me) return <p role="status">Connecting to your table…</p>
  return (
    <main className="quiz-results quiz-page-enter">
      <div className="quiz-section-heading">
        <p className="quiz-eyebrow">YOU'RE AT THE TABLE / {room.code}</p>
        <div className="quiz-player-badge" aria-hidden="true">
          {me.avatar}
        </div>
        <h1>Welcome, {me.name}.</h1>
        <p>
          {room.status === 'game-select'
            ? 'The host is choosing your game.'
            : 'Everyone’s gathering. Your game starts soon.'}
        </p>
      </div>
      <section className="quiz-panel">
        <h2>Your phone is your controller.</h2>
        <p>
          Keep this screen open. Questions and answer buttons will appear here when the host starts.
        </p>
      </section>
      <h2 className="quiz-roster-title">
        Your players · {room.players.filter((p) => p.isConnected).length} connected
      </h2>
      <ul className="quiz-player-list">
        {room.players.map((p) => (
          <li key={p.id}>
            <span className="quiz-avatar">{p.avatar}</span>
            <div>
              <strong>
                {p.name}
                {p.id === me.id ? ' · You' : ''}
              </strong>
              <small>{p.isConnected ? 'At the table' : 'Disconnected'}</small>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
