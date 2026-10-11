'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { RoomPublic } from '@/lib/types'
import { useSound } from '@/hooks/useSound'
export default function ResultsScreen({
  room,
  onPlayAgain,
}: {
  room: RoomPublic
  onPlayAgain?: () => void
}) {
  const sorted = [...room.players].sort((a, b) => b.score - a.score),
    winners = sorted.filter((p) => p.score === sorted[0]?.score),
    { play } = useSound()
  useEffect(() => {
    play('gameover')
  }, [play])
  return (
    <main className="quiz-results quiz-page-enter">
      <div className="quiz-section-heading">
        <p className="quiz-eyebrow">GOOD GAME. GREAT COMPANY.</p>
        <img src="/octoquiz.svg" alt="" width="96" height="96" />
        <h1>
          {winners.map((p) => p.name).join(' & ') || 'Well played!'}
          {winners.length > 0 && (winners.length > 1 ? ' share the win.' : ' takes the win.')}
        </h1>
        <p>Every answer counted. There’s always one more round.</p>
      </div>
      <ol className="quiz-results-list">
        {sorted.map((p) => (
          <li key={p.id}>
            <span>{String(sorted.findIndex((x) => x.score === p.score) + 1).padStart(2, '0')}</span>
            <span className="quiz-avatar" style={{ background: p.color + '22' }}>
              {p.avatar}
            </span>
            <strong>{p.name}</strong>
            <b>
              {p.score.toLocaleString()} <small>points</small>
            </b>
          </li>
        ))}
      </ol>
      <div className="quiz-results-actions">
        <button className="quiz-primary" onClick={onPlayAgain}>
          Play again
        </button>
        <Link className="quiz-button" href="/">
          Back to home
        </Link>
      </div>
    </main>
  )
}
