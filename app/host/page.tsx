'use client'
import { useEffect, useState } from 'react'
import { useGameHost } from '@/hooks/useGameHost'
import { generateRoomCode } from '@/lib/supabase'
import type { TriviaConfig } from '@/lib/types'
import HostLobby from '@/components/host/HostLobby'
import GameSelect from '@/components/host/GameSelect'
import TriviaHost from '@/components/host/games/TriviaHost'
import FlagQuizHost from '@/components/host/games/FlagQuizHost'
import ImposterHost from '@/components/host/games/ImposterHost'
import CapitalsHost from '@/components/host/games/CapitalsHost'
import LandmarksHost from '@/components/host/games/LandmarksHost'
import DrawImposterHost from '@/components/host/games/DrawImposterHost'
import ResultsScreen from '@/components/host/ResultsScreen'
import ServerWakingScreen from '@/components/ui/ServerWakingScreen'

// Static-export friendly: the room code lives in the query string (?room=ABCD),
// resolved on the client so there is no dynamic route segment to prerender.
export default function HostPage() {
  const [roomCode, setRoomCode] = useState<string | null>(null)

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    let code = (sp.get('room') || '').toUpperCase()
    if (!code) {
      code = generateRoomCode()
      const url = new URL(window.location.href)
      url.searchParams.set('room', code)
      window.history.replaceState({}, '', url.toString())
    }
    setRoomCode(code)
  }, [])

  if (!roomCode) return <ServerWakingScreen variant="host" />
  return <HostRoom roomCode={roomCode} />
}

function HostRoom({ roomCode }: { roomCode: string }) {
  const {
    room, gameState, connected,
    selectGame, startGame, kickPlayer, endGame, nextRound,
    drawData, drawSkipToVote,
  } = useGameHost(roomCode)

  if (!connected || !room) return <ServerWakingScreen variant="host" />
  if (room.status === 'results') return <ResultsScreen room={room} onPlayAgain={nextRound} />

  // Build a "socket-like" object so existing components work unchanged
  const emit = {
    selectGame: (game: string)         => selectGame(game as Parameters<typeof selectGame>[0]),
    startGame:  (config?: TriviaConfig) => startGame(config),
    kickPlayer: (id: string)           => kickPlayer(id),
    endGame:    ()                     => endGame(),
    nextRound:  ()                     => nextRound(),
  }

  if (room.status === 'lobby')       return <HostLobby  room={room} emit={emit} />
  if (room.status === 'game-select') return <GameSelect room={room} emit={emit} />

  if (room.status === 'playing' && gameState) {
    if (gameState.game === 'trivia')    return <TriviaHost   state={gameState} room={room} />
    if (gameState.game === 'flag-quiz') return <FlagQuizHost  state={gameState} room={room} />
    if (gameState.game === 'imposter')  return <ImposterHost  state={gameState} room={room} emit={emit} />
    if (gameState.game === 'capitals')  return <CapitalsHost  state={gameState} room={room} />
    if (gameState.game === 'landmarks') return <LandmarksHost state={gameState} room={room} />
    if (gameState.game === 'drawimposter') return <DrawImposterHost state={gameState} room={room} drawData={drawData} onSkipToVote={drawSkipToVote} />
  }

  return <HostLobby room={room} emit={emit} />
}
