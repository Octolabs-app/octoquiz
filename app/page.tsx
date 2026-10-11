'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateRoomCode } from '@/lib/room-code'
const avatars = ['🦊', '🐙', '🦈', '🐸', '🦁', '🐯', '🐼', '🐧']
export default function HomePage() {
  const router = useRouter(),
    [joining, setJoining] = useState(false),
    [code, setCode] = useState(''),
    [name, setName] = useState(''),
    [avatar, setAvatar] = useState(avatars[0])
  return (
    <main className="quiz-home quiz-page-enter">
      <section className="quiz-identity">
        <p className="quiz-eyebrow">GOOD QUESTIONS. GREAT COMPANY.</p>
        <img src="/octoquiz.svg" alt="OctoQuiz question mark" width="148" height="148" />
        <h1>
          Make it
          <br />a quiz night.
        </h1>
        <p>
          Six ways to play.
          <br />
          Everyone’s invited.
        </p>
        <span className="quiz-tag">No account. Just your people.</span>
      </section>
      <section className="quiz-home-actions">
        {joining ? (
          <form
            className="quiz-form"
            onSubmit={(e) => {
              e.preventDefault()
              sessionStorage.setItem('playerName', name.trim())
              sessionStorage.setItem('playerAvatar', avatar)
              router.push(`/join?room=${code}`)
            }}
          >
            <button type="button" onClick={() => setJoining(false)}>
              Back
            </button>
            <p className="quiz-eyebrow">FIND YOUR PEOPLE</p>
            <h2>Join the table</h2>
            <label>
              Room code
              <input
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z]/g, '')
                      .slice(0, 5),
                  )
                }
                autoComplete="off"
                placeholder="ABCDE"
                minLength={5}
                maxLength={5}
                required
              />
            </label>
            <label>
              Your name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={16}
                autoComplete="nickname"
                required
                placeholder="e.g. Camille"
              />
            </label>
            <fieldset>
              <legend>Pick your player</legend>
              <div className="quiz-avatars">
                {avatars.map((a) => (
                  <button
                    type="button"
                    key={a}
                    aria-label={`Avatar ${a}`}
                    aria-pressed={avatar === a}
                    onClick={() => setAvatar(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="quiz-primary" disabled={code.length !== 5 || !name.trim()}>
              Join game
            </button>
          </form>
        ) : (
          <>
            <div className="quiz-choices">
              <button
                className="quiz-choice"
                onClick={() => router.push(`/host?room=${generateRoomCode()}`)}
              >
                <span className="quiz-choice-index">01 / BRING EVERYONE TOGETHER</span>
                <h2>Host</h2>
                <p>
                  Set the table. Pick a game.
                  <br />
                  Invite your people.
                </p>
                <strong>Create a room</strong>
              </button>
              <button className="quiz-choice" onClick={() => setJoining(true)}>
                <span className="quiz-choice-index">02 / TAKE YOUR SEAT</span>
                <h2>Join</h2>
                <p>
                  Use the room code.
                  <br />
                  Your phone is your controller.
                </p>
                <strong>Find your room</strong>
              </button>
            </div>
            <div className="quiz-game-notes">
              {['Brain Blitz', 'Flags', 'Capitals', 'Landmarks', 'Imposter', 'Decoy'].map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
            <p className="quiz-muted">Host on a laptop, tablet or TV. Join on any phone.</p>
          </>
        )}
      </section>
    </main>
  )
}
