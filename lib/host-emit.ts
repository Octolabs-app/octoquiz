import type { TriviaConfig, GameType, GameAction } from './types'

/** Replaces socket.emit for host-side components */
export interface HostEmit {
  selectGame:  (game: GameType) => void
  startGame:   (config?: TriviaConfig) => void
  kickPlayer:  (id: string) => void
  endGame:     () => void
  nextRound:   () => void
}

/** Replaces socket.emit for player-side components */
export interface PlayerEmit {
  selectGame:  (game: string) => void
  startGame:   (config?: unknown) => void
  kickPlayer:  (targetId: string) => void
  endGame:     () => void
  nextRound:   () => void
  gameAction:  (action: GameAction) => void
  playerReady: () => void
}
