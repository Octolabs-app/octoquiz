'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import type { RoomPublic, GameState, Player } from '@/lib/types'
import PlayerLobby from '@/components/player/PlayerLobby'
import TriviaPlayer from '@/components/player/games/TriviaPlayer'
import FlagQuizPlayer from '@/components/player/games/FlagQuizPlayer'
import ImposterPlayer from '@/components/player/games/ImposterPlayer'
import CapitalsPlayer from '@/components/player/games/CapitalsPlayer'
import LandmarksPlayer from '@/components/player/games/LandmarksPlayer'
import PlayerResults from '@/components/player/PlayerResults'
import ServerWakingScreen from '@/components/ui/ServerWakingScreen'

export default function PlayerPage() {
  const params = useParams()
  const router = useRouter()
  const roomCode = (params.room as string).toUpperCase()
  const { socket, connected } = useSocket()

  const [room, setRoom] = useState<RoomPublic | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [me, setMe] = useState<Player | null>(null)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem('playerName') ?? '' : ''
  )
  const [avatar, setAvatar] = useState('🦑')
  const AVATARS = ['🦑', '🐙', '🦈', '🦊', '🐺', '🐸', '🦁', '🐯'] as const

  useEffect(() => {
    if (!socket) return

    socket.on('room_state', (r) => {
      setRoom(r)
      if (me) {
        const updated = r.players.find(p => p.id === me.id)
        if (updated) setMe(updated)
      }
    })
    socket.on('game_state', (g) => setGameState(g))
    socket.on('kicked', () => {
      router.push('/')
    })
    socket.on('error', (msg) => setError(msg))

    return () => {
      socket.off('room_state')
      socket.off('game_state')
      socket.off('kicked')
      socket.off('error')
    }
  }, [socket, me, router])

  function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!socket || !name.trim()) return
    socket.emit('player_join', roomCode, name.trim(), avatar, (err, r) => {
      if (err) { setError(err); return }
      if (r) {
        setRoom(r)
        setJoined(true)
        sessionStorage.setItem('playerName', name.trim())
        const self = r.players.find(p => p.name === name.trim())
        if (self) setMe(self)
      }
    })
  }

  if (!connected) {
    return <ServerWakingScreen variant="player" />
  }

  // Name entry
  if (!joined) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-night-900">
        <div className="w-full max-w-xs text-center">
          <div className="text-5xl mb-3">🐙</div>
          <h1 className="text-2xl font-black mb-1 font-display" style={{ color: '#E8E6E1' }}>
            Room <span style={{ color: '#C6A87C' }}>{roomCode}</span>
          </h1>
          <p className="text-sm mb-6" style={{ color: 'rgba(232,230,225,0.4)' }}>Pick avatar &amp; enter your name</p>
          {/* Avatar picker */}
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
          <form onSubmit={handleJoin} className="space-y-3">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              maxLength={16}
              autoFocus
              className="w-full rounded-2xl px-4 py-4 text-lg outline-none border transition-all placeholder:text-brand-muted text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(198,168,124,0.12)', color: '#E8E6E1' }}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full rounded-2xl py-4 text-lg font-bold transition-all disabled:opacity-40 active:scale-95 font-display"
              style={{ background: 'linear-gradient(135deg, #C6A87C, #a8894e)', color: '#0B1120', minHeight: '72px' }}
            >
              {avatar} Join Game
            </button>
          </form>
        </div>
      </main>
    )
  }

  if (room?.status === 'results') {
    return <PlayerResults room={room} me={me} />
  }

  if (room?.status === 'playing' && gameState && me) {
    switch (gameState.game) {
      case 'trivia':    return <TriviaPlayer state={gameState} me={me} socket={socket!} />
      case 'flag-quiz': return <FlagQuizPlayer state={gameState} me={me} socket={socket!} />
      case 'imposter':  return <ImposterPlayer state={gameState} me={me} room={room} socket={socket!} />
      case 'capitals':  return <CapitalsPlayer state={gameState} me={me} socket={socket!} />
      case 'landmarks': return <LandmarksPlayer state={gameState} me={me} socket={socket!} />
    }
  }

  return <PlayerLobby room={room} me={me} socket={socket!} />
}
