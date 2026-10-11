'use client'
import { useState, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MotionConfig } from 'framer-motion'
export default function StudioFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname(),
    router = useRouter(),
    dialog = useRef<HTMLDialogElement>(null),
    [leaving, setLeaving] = useState(false)
  if (path.startsWith('/couples')) return <>{children}</>
  function show(exit: boolean) {
    setLeaving(exit)
    dialog.current?.showModal()
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className="quiz-app">
        <a href="#quiz-main" className="quiz-skip">
          Skip to content
        </a>
        <header className="quiz-header">
          <div>
            {path !== '/' ? (
              <button onClick={() => show(true)}>Back</button>
            ) : (
              <a href="https://octolabs.app">BY OCTOLABS</a>
            )}
          </div>
          <Link
            className="quiz-brand"
            href="/"
            onClick={(e) => {
              if (path !== '/') {
                e.preventDefault()
                show(true)
              }
            }}
          >
            OctoQuiz<small>by Octolabs</small>
          </Link>
          <div>{path !== '/' && <button onClick={() => show(true)}>Leave room</button>}</div>
        </header>
        <div id="quiz-main" className="quiz-main">
          {children}
        </div>
        <footer className="quiz-footer">
          <a href="https://octolabs.app">Octolabs</a>
          <button onClick={() => show(false)}>How to play</button>
        </footer>
        <dialog ref={dialog} className="quiz-dialog">
          <h2>{leaving ? 'Leave this room?' : 'A good night starts here.'}</h2>
          {leaving ? (
            <p>
              {path.startsWith('/host')
                ? 'You are hosting. Leaving closes your connection and interrupts this quiz.'
                : 'You will disconnect from this room.'}
            </p>
          ) : (
            <>
              <p>
                One person hosts on a laptop, tablet or TV. Everyone joins from their phone using
                the room code or QR link.
              </p>
              <p>
                The host picks the game and keeps that screen open. Answer on your phone, then see
                the answers and scores together. Imposter and Decoy need three players.
              </p>
              <p>
                Quiz games reward correct answers and speed. The timer starts once the question
                appears.
              </p>
            </>
          )}
          <div className="quiz-dialog-actions">
            <button autoFocus onClick={() => dialog.current?.close()}>
              {leaving ? 'Keep playing' : 'Got it'}
            </button>
            {leaving && (
              <button
                className="quiz-primary"
                onClick={() => {
                  dialog.current?.close()
                  router.push('/')
                }}
              >
                Leave room
              </button>
            )}
          </div>
        </dialog>
      </div>
    </MotionConfig>
  )
}
