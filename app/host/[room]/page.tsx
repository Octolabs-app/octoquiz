'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'
import type { RoomPublic, GameState } from '@/lib/types'
import HostLobby from '@/components/host/HostLobby'
import GameSelect from '@/components/host/GameSelect'
import TriviaHost from '@/components/host/games/TriviaHost'
import FlagQuizHost from '@/components/host/games/FlagQuizHost'
import ImposterHost from '@/components/host/games/ImposterHost'
import TruthDareHost from '@/components/host/games/TruthDareHost'
import ResultsScreen from '@/components/host/ResultsScreen'
import ServerWakingScreen from '@/components/ui/ServerWakingScreen'

export default function HostPage() {
  const params = useParams()
  const router = useRouter()
  const roomCode = (params.room as string).toUpperCase()
  const { socket, connected } = useSocket()
  const [room, setRoom] = useState<RoomPublic | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    if (!socket) return

    socket.on('room_state', (r) => setRoom(r))
    socket.on('game_state', (g) => setGameState(g))

    // Re-hydrate room state (idempotent — works on first load and page refresh)
    socket.emit('host_create_room', (code) => {
      // Only redirect if server assigned a different code (e.g. direct URL with wrong code)
      if (code !== roomCode) {
        router.replace(`/host/${code}`)
      }
    })

    return () => {
      socket.off('room_state')
      socket.off('game_state')
    }
  }, [socket]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!connected) {
    return <ServerWakingScreen variant="host" />
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-900">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-white/60 text-xl">Setting up room...</p>
        </div>
      </div>
    )
  }

  if (room.status === 'results') {
    return <ResultsScreen room={room} socket={socket!} />
  }

  if (room.status === 'playing' && gameState) {
    switch (gameState.game) {
      case 'trivia':      return <TriviaHost room={room} state={gameState} />
      case 'flag-quiz':   return <FlagQuizHost room={room} state={gameState} />
      case 'imposter':    return <ImposterHost room={room} state={gameState} socket={socket!} />
      case 'truth-or-dare': return <TruthDareHost room={room} state={gameState} />
    }
  }

  if (room.status === 'game-select') {
    return <GameSelect room={room} socket={socket!} />
  }

  return <HostLobby room={room} socket={socket!} />
}
