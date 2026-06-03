'use client'
import { useParams } from 'next/navigation'
import { useGameHost } from '@/hooks/useGameHost'
import type { TriviaConfig } from '@/lib/types'
import HostLobby from '@/components/host/HostLobby'
import GameSelect from '@/components/host/GameSelect'
import TriviaHost from '@/components/host/games/TriviaHost'
import FlagQuizHost from '@/components/host/games/FlagQuizHost'
import ImposterHost from '@/components/host/games/ImposterHost'
import CapitalsHost from '@/components/host/games/CapitalsHost'
import LandmarksHost from '@/components/host/games/LandmarksHost'
import ResultsScreen from '@/components/host/ResultsScreen'
import ServerWakingScreen from '@/components/ui/ServerWakingScreen'

export default function HostPage() {
  const params   = useParams()
  const roomCode = (params.room as string).toUpperCase()

  const {
    room, gameState, connected,
    selectGame, startGame, kickPlayer, endGame, nextRound,
  } = useGameHost(roomCode)

  if (!connected || !room) return <ServerWakingScreen variant="host" />
  if (room.status === 'results') return <ResultsScreen room={room} onPlayAgain={nextRound} />

  // Build a "socket-like" object so existing components work unchanged
  const emit = {
    selectGame: (game: string)       => selectGame(game as Parameters<typeof selectGame>[0]),
    startGame:  (config?: TriviaConfig) => startGame(config),
    kickPlayer: (id: string)         => kickPlayer(id),
    endGame:    ()                   => endGame(),
    nextRound:  ()                   => nextRound(),
  }

  if (room.status === 'lobby')       return <HostLobby  room={room} emit={emit} />
  if (room.status === 'game-select') return <GameSelect room={room} emit={emit} />

  if (room.status === 'playing' && gameState) {
    if (gameState.game === 'trivia')    return <TriviaHost   state={gameState} room={room} />
    if (gameState.game === 'flag-quiz') return <FlagQuizHost  state={gameState} room={room} />
    if (gameState.game === 'imposter')  return <ImposterHost  state={gameState} room={room} emit={emit} />
    if (gameState.game === 'capitals')  return <CapitalsHost  state={gameState} room={room} />
    if (gameState.game === 'landmarks') return <LandmarksHost state={gameState} room={room} />
  }

  return <HostLobby room={room} emit={emit} />
}
