'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGamePlayer } from '@/hooks/useGamePlayer'
import PlayerLobby from '@/components/player/PlayerLobby'
import TriviaPlayer from '@/components/player/games/TriviaPlayer'
import FlagQuizPlayer from '@/components/player/games/FlagQuizPlayer'
import ImposterPlayer from '@/components/player/games/ImposterPlayer'
import CapitalsPlayer from '@/components/player/games/CapitalsPlayer'
import LandmarksPlayer from '@/components/player/games/LandmarksPlayer'
import DrawImposterPlayer from '@/components/player/games/DrawImposterPlayer'
import PlayerResults from '@/components/player/PlayerResults'
import ServerWakingScreen from '@/components/ui/ServerWakingScreen'

const AVATARS = ['🦑', '🐙', '🦈', '🦊', '🐺', '🐸', '🦁', '🐯'] as const

// Static-export friendly: room code comes from the query string (?room=ABCD),
// resolved on the client so there is no dynamic route segment to prerender.
export default function JoinPage() {
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const code = (sp.get('room') || '').toUpperCase()
    if (!code) { router.replace('/'); return }
    setRoomCode(code)
  }, [router])

  if (!roomCode) return <ServerWakingScreen variant="player" />
  return <JoinRoom roomCode={roomCode} />
}

function JoinRoom({ roomCode }: { roomCode: string }) {
  const router   = useRouter()

  const [name,   setName]   = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem('playerName') ?? '' : '')
  const [avatar, setAvatar] = useState(() => typeof window !== 'undefined' ? sessionStorage.getItem('playerAvatar') ?? '🦑' : '🦑')
  const [joined, setJoined] = useState(false)
  const [formError, setFormError] = useState('')
  // Only the name that was cached from the home screen triggers auto-join.
  // (Live typing must NOT auto-join, or you'd join after the first keystroke.)
  const cachedName = useRef(typeof window !== 'undefined' ? sessionStorage.getItem('playerName') ?? '' : '')

  const {
    room, gameState, me, connected, kicked, error,
    join, sendAction, sendReady, sendDraw, drawStrokes,
  } = useGamePlayer(roomCode)

  // Auto-join ONLY if a name was cached from the home page (not while typing)
  useEffect(() => {
    if (connected && !joined && cachedName.current.trim()) {
      join({ name: cachedName.current.trim(), avatar })
      setJoined(true)
    }
  }, [connected, joined, avatar, join])

  // Kicked
  useEffect(() => { if (kicked) router.push('/') }, [kicked, router])

  // Build emit adapter for existing components
  const emit = {
    gameAction:  sendAction,
    playerReady: sendReady,
  }

  if (!connected) return <ServerWakingScreen variant="player" />

  // Join form (if no cached name / avatar)
  if (!joined) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-night-900">
        <div className="w-full max-w-xs text-center">
          <div className="text-5xl mb-3">🐙</div>
          <h1 className="text-2xl font-black mb-1 font-display" style={{ color: '#E8E6E1' }}>
            Room <span style={{ color: '#C6A87C' }}>{roomCode}</span>
          </h1>
          <p className="text-sm mb-6" style={{ color: 'rgba(232,230,225,0.4)' }}>Pick avatar &amp; enter your name</p>
          <div className="grid grid-cols-8 gap-2 mb-5">
            {AVATARS.map(em => (
              <button key={em} onClick={() => setAvatar(em)} className="text-2xl rounded-xl py-1.5 transition-all"
                style={{
                  background: avatar === em ? 'rgba(198,168,124,0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${avatar === em ? '#C6A87C' : 'rgba(198,168,124,0.12)'}`,
                  transform: avatar === em ? 'scale(1.15)' : 'scale(1)',
                }}>{em}</button>
            ))}
          </div>
          <div className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" maxLength={16} autoFocus
              className="w-full rounded-2xl px-4 py-4 text-lg outline-none border transition-all placeholder:text-brand-muted text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(198,168,124,0.12)', color: '#E8E6E1' }} />
            {(error || formError) && <p className="text-red-400 text-sm">{error || formError}</p>}
            <button
              disabled={!name.trim()}
              onClick={() => {
                if (!name.trim()) { setFormError('Enter your name'); return }
                sessionStorage.setItem('playerName', name.trim())
                sessionStorage.setItem('playerAvatar', avatar)
                join({ name: name.trim(), avatar })
                setJoined(true)
              }}
              className="w-full rounded-2xl py-4 text-lg font-bold transition-all disabled:opacity-40 active:scale-95 font-display"
              style={{ background: 'linear-gradient(135deg, #C6A87C, #a8894e)', color: '#0B1120', minHeight: '72px' }}
            >
              {avatar} Join Game
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!room || !me) {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-pulse">⏳</div>
          <p style={{ color: 'rgba(232,230,225,0.5)' }}>Joining room…</p>
        </div>
      </div>
    )
  }

  if (room.status === 'results') return <PlayerResults room={room} me={me} />

  if (room.status === 'lobby' || room.status === 'game-select') {
    return <PlayerLobby room={room} me={me} emit={emit} />
  }

  if (room.status === 'playing' && gameState) {
    if (gameState.game === 'trivia')    return <TriviaPlayer   state={gameState} me={me} sendAction={sendAction} />
    if (gameState.game === 'flag-quiz') return <FlagQuizPlayer  state={gameState} me={me} sendAction={sendAction} />
    if (gameState.game === 'imposter')  return <ImposterPlayer  state={gameState} me={me} room={room} sendAction={sendAction} />
    if (gameState.game === 'capitals')  return <CapitalsPlayer  state={gameState} me={me} sendAction={sendAction} />
    if (gameState.game === 'landmarks') return <LandmarksPlayer state={gameState} me={me} sendAction={sendAction} />
    if (gameState.game === 'drawimposter') return <DrawImposterPlayer state={gameState} me={me} room={room} sendAction={sendAction} sendDraw={sendDraw} strokes={drawStrokes} />
  }

  return <PlayerLobby room={room} me={me} emit={emit} />
}
