'use client'
import { useEffect, useState } from 'react'
import type { RoomPublic } from '@/lib/types'
import type { HostEmit } from '@/lib/host-emit'
import QRCodeDisplay from '@/components/ui/QRCode'
export default function HostLobby({ room, emit }: { room: RoomPublic; emit: HostEmit }) {
  const [url, setUrl] = useState(''),
    [copied, setCopied] = useState(false),
    [error, setError] = useState('')
  useEffect(() => {
    setUrl(`${location.origin}/join?room=${room.code}`)
  }, [room.code])
  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setError('')
    } catch {
      setError('Select and copy the link below.')
    }
  }
  return (
    <main className="quiz-lobby quiz-page-enter">
      <div className="quiz-section-heading">
        <p className="quiz-eyebrow">MULTIPLAYER / YOUR TABLE</p>
        <h1>Everyone’s gathering.</h1>
        <p>Share the code. Pick your game. Make a night of it.</p>
      </div>
      <div className="quiz-lobby-grid">
        <section className="quiz-panel">
          <div className="quiz-row">
            <h2>Your players</h2>
            <span>{room.players.length} / 50</span>
          </div>
          <ul className="quiz-player-list">
            {room.players.map((p) => (
              <li key={p.id}>
                <span className="quiz-avatar" style={{ background: p.color + '22' }}>
                  {p.avatar}
                </span>
                <div>
                  <strong>{p.name}</strong>
                  <small>
                    {p.isConnected ? 'Ready to play' : 'Disconnected'}
                    {p.id === room.gameMasterId ? ' · Game master' : ''}
                  </small>
                </div>
                <button onClick={() => emit.kickPlayer(p.id)} aria-label={`Remove ${p.name}`}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {!room.players.length && (
            <div className="quiz-empty">
              <span>＋</span>
              <h3>Your people go here.</h3>
              <p>
                Ask them to scan the QR code
                <br />
                or enter your room code.
              </p>
            </div>
          )}
          <p className="quiz-muted">One player for quiz games. Three for Imposter and Decoy.</p>
        </section>
        <section className="quiz-panel quiz-invite">
          <p className="quiz-eyebrow">AN OPEN INVITATION</p>
          <h2>Take a seat.</h2>
          <div className="quiz-room-code" aria-label={`Room code ${room.code}`}>
            {room.code}
          </div>
          <div className="quiz-invite-row">
            {url && <QRCodeDisplay value={url} size={160} label="Scan to join" />}
            <div>
              <p>
                Open OctoQuiz on your phone
                <br />
                and enter this code.
              </p>
              <label className="quiz-link-label">
                Invite link
                <input value={url} readOnly onFocus={(e) => e.target.select()} />
              </label>
              <button onClick={copy}>{copied ? 'Copied' : 'Copy invite link'}</button>
            </div>
          </div>
          {error && <p role="status">{error}</p>}
          <button
            className="quiz-primary"
            disabled={!room.players.some((p) => p.isConnected)}
            onClick={() => emit.selectGame('trivia')}
          >
            Choose a game
          </button>
          <p className="quiz-muted">Keep this host screen open while you play.</p>
        </section>
      </div>
    </main>
  )
}
