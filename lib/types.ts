// ─── Player ──────────────────────────────────────────────────────────────────

export const PLAYER_COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#eab308',
  '#f97316', '#a855f7', '#ec4899', '#06b6d4',
] as const

export const PLAYER_EMOJIS = ['🦊', '🐺', '🦁', '🐯', '🐻', '🦄', '🐸', '🦋'] as const

export interface Player {
  id: string          // socket ID
  name: string
  color: string
  avatar: string
  score: number
  isReady: boolean
  isConnected: boolean
}

// ─── Room ────────────────────────────────────────────────────────────────────

export type GameType = 'trivia' | 'flag-quiz' | 'imposter' | 'truth-or-dare'
export type RoomStatus = 'lobby' | 'game-select' | 'playing' | 'results'

export interface Room {
  code: string
  hostId: string            // TV screen socket ID
  gameMasterId: string | null  // first player who can control game flow
  players: Player[]
  status: RoomStatus
  currentGame: GameType | null
  gameState: GameState | null
  createdAt: number
}

// ─── Game States ─────────────────────────────────────────────────────────────

export type GameState =
  | TriviaState
  | FlagQuizState
  | ImposterState
  | TruthDareState

// TRIVIA
export interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  category: string
  points: number
}

export type TriviaPhase = 'countdown' | 'question' | 'reveal' | 'leaderboard' | 'finished'

export interface TriviaState {
  game: 'trivia'
  phase: TriviaPhase
  questions: TriviaQuestion[]
  currentIndex: number
  answers: Record<string, { index: number; timeMs: number }>
  timeLimit: number
  startedAt: number | null
  category: string
}

// FLAG QUIZ
export interface FlagQuizQuestion {
  countryCode: string
  countryName: string
  flag: string
  options: string[]
}

export type FlagPhase = 'countdown' | 'question' | 'reveal' | 'leaderboard' | 'finished'

export interface FlagQuizState {
  game: 'flag-quiz'
  phase: FlagPhase
  questions: FlagQuizQuestion[]
  currentIndex: number
  answers: Record<string, { answer: string; timeMs: number; correct: boolean }>
  timeLimit: number
  startedAt: number | null
}

// IMPOSTER
export type ImposterPhase = 'reveal' | 'discussion' | 'voting' | 'result' | 'finished'

export interface ImposterState {
  game: 'imposter'
  phase: ImposterPhase
  round: number
  totalRounds: number
  imposterId: string
  realWord: string
  imposterWord: string
  discussionSeconds: number
  discussionStartedAt: number | null
  votes: Record<string, string>     // voterId → targetId
  roundResults: ImposterRoundResult[]
}

export interface ImposterRoundResult {
  round: number
  imposterId: string
  imposterName: string
  realWord: string
  imposterWord: string
  caught: boolean
  votes: Record<string, string>
}

// TRUTH OR DARE
export type TruthDareMode = 'safe' | 'adult'
export type TruthDarePhase = 'pick' | 'prompt' | 'done' | 'finished'

export interface TruthDareState {
  game: 'truth-or-dare'
  phase: TruthDarePhase
  mode: TruthDareMode
  currentPlayerId: string
  currentPrompt: string | null
  currentChoice: 'truth' | 'dare' | null
  turnIndex: number
  playerOrder: string[]
  skipsUsed: Record<string, number>
}

// ─── Socket Events ────────────────────────────────────────────────────────────

export interface ServerToClientEvents {
  room_state:       (room: RoomPublic) => void
  error:            (msg: string) => void
  player_joined:    (player: Player) => void
  player_left:      (playerId: string, name: string) => void
  game_state:       (state: GameState) => void
  kicked:           () => void
}

export interface ClientToServerEvents {
  host_create_room: (cb: (code: string) => void) => void
  player_join:      (code: string, name: string, cb: (err: string | null, room: RoomPublic | null) => void) => void
  player_ready:     () => void
  select_game:      (game: GameType) => void
  start_game:       () => void
  game_action:      (action: GameAction) => void
  next_round:       () => void
  end_game:         () => void
  kick_player:      (playerId: string) => void
}

export type GameAction =
  | { type: 'trivia_answer';    answerId: number }
  | { type: 'flag_answer';      answer: string }
  | { type: 'imposter_vote';    targetId: string }
  | { type: 'td_pick';          choice: 'truth' | 'dare' }
  | { type: 'td_done' }
  | { type: 'td_skip' }

// Public room state (safe to send to all clients)
export type RoomPublic = Omit<Room, 'hostId'>
