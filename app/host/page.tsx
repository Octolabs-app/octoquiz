'use client'
import { useEffect, useState } from 'react'
import { useGameHost } from '@/hooks/useGameHost'
import { generateRoomCode } from '@/lib/room-code'
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
    selectGame, startGame, kickPlayer, endGame, changeGame, nextRound,
    drawStrokes, drawSkipToVote,
  } = useGameHost(roomCode)

  if (!connected || !room) return <ServerWakingScreen variant="host" />
  if (room.status === 'results') return <ResultsScreen room={room} onPlayAgain={nextRound} />

  // Build a "socket-like" object so existing components work unchanged
  const emit = {
    selectGame: (game: string)         => selectGame(game as Parameters<typeof selectGame>[0]),
    startGame:  (config?: TriviaConfig) => startGame(config),
    kickPlayer: (id: string)           => kickPlayer(id),
    endGame:    ()                     => endGame(),
    changeGame: ()                     => changeGame(),
    nextRound:  ()                     => nextRound(),
  }

  if (room.status === 'lobby')       return <HostLobby  room={room} emit={emit} />
  if (room.status === 'game-select') return <GameSelect room={room} emit={emit} />

  if (room.status === 'playing' && gameState) {
    const game =
      gameState.game === 'trivia'       ? <TriviaHost    state={gameState} room={room} /> :
      gameState.game === 'flag-quiz'    ? <FlagQuizHost  state={gameState} room={room} /> :
      gameState.game === 'imposter'     ? <ImposterHost  state={gameState} room={room} emit={emit} /> :
      gameState.game === 'capitals'     ? <CapitalsHost  state={gameState} room={room} /> :
      gameState.game === 'landmarks'    ? <LandmarksHost state={gameState} room={room} /> :
      gameState.game === 'drawimposter' ? <DrawImposterHost state={gameState} room={room} strokes={drawStrokes} onSkipToVote={drawSkipToVote} /> :
      null
    if (game) {
      return (
        <>
          {game}
          <HostGameControls onSwitchGame={changeGame} onEndGame={endGame} />
        </>
      )
    }
  }

  return <HostLobby room={room} emit={emit} />
}

/**
 * Floating host-only controls layered over any in-progress game so the host can
 * jump straight to a different game (players + cumulative scores preserved) or
 * end early to the results screen — without waiting for the game to finish.
 */
function HostGameControls({ onSwitchGame, onEndGame }: { onSwitchGame: () => void; onEndGame: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 no-select">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Host controls"
        className="w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all active:scale-90 backdrop-blur"
        style={{ background: 'rgba(11,17,32,0.7)', border: '1px solid rgba(198,168,124,0.4)', color: '#C6A87C' }}
      >
        {open ? '✕' : '⚙️'}
      </button>

      {open && (
        <div
          className="flex flex-col gap-2 rounded-2xl p-2 backdrop-blur"
          style={{ background: 'rgba(11,17,32,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <button
            onClick={() => { setOpen(false); onSwitchGame() }}
            className="rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
            style={{ background: 'rgba(198,168,124,0.15)', border: '1px solid rgba(198,168,124,0.4)', color: '#C6A87C' }}
          >
            ⇄ Switch game
          </button>
          <button
            onClick={() => { setOpen(false); onEndGame() }}
            className="rounded-xl px-4 py-2.5 text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
          >
            ⏹ End game
          </button>
        </div>
      )}
    </div>
  )
}
