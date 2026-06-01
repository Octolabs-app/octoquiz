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

export type GameType = 'trivia' | 'flag-quiz' | 'imposter' | 'capitals' | 'landmarks'
export type RoomStatus = 'lobby' | 'game-select' | 'playing' | 'results'

export interface Room {
  code: string
  hostId: string
  gameMasterId: string | null
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
  | CapitalsState
  | LandmarksState

// ─── TRIVIA / BRAIN BLITZ ─────────────────────────────────────────────────────
export type TriviaMode       = 'classic' | 'speed' | 'sudden-death'
export type TriviaDifficulty = 'easy' | 'medium' | 'hard'

export interface TriviaConfig {
  category:      string
  mode:          TriviaMode
  questionCount: number
  difficulty:    TriviaDifficulty
}

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
  mode:       TriviaMode
  difficulty: TriviaDifficulty
  eliminated: string[]
  streaks:    Record<string, number>
}

// ─── FLAG QUIZ ────────────────────────────────────────────────────────────────
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

// ─── IMPOSTER ─────────────────────────────────────────────────────────────────
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
  votes: Record<string, string>
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

// ─── CAPITAL CITIES ───────────────────────────────────────────────────────────
export interface CapitalsQuestion {
  id:           string
  city:         string
  country:      string
  imageUrl:     string      // Wikipedia CDN thumbnail
  options:      string[]    // 4 country names
  correctIndex: number
}

export type CapitalsPhase = 'countdown' | 'question' | 'reveal' | 'leaderboard' | 'finished'

export interface CapitalsState {
  game:         'capitals'
  phase:        CapitalsPhase
  questions:    CapitalsQuestion[]
  currentIndex: number
  answers:      Record<string, { answer: string; timeMs: number; correct: boolean }>
  timeLimit:    number
  startedAt:    number | null
}

// ─── LANDMARKS ────────────────────────────────────────────────────────────────
export type LandmarkQType = 'name' | 'country'

export interface LandmarksQuestion {
  id:             string
  name:           string      // landmark name
  country:        string
  city:           string      // city/region where it's located
  imageUrl:       string      // Wikipedia CDN thumbnail
  questionType:   LandmarkQType
  questionText:   string      // "What is this landmark?" / "Which country?"
  options:        string[]    // 4 answers
  correctIndex:   number
}

export type LandmarksPhase = 'countdown' | 'question' | 'reveal' | 'leaderboard' | 'finished'

export interface LandmarksState {
  game:         'landmarks'
  phase:        LandmarksPhase
  questions:    LandmarksQuestion[]
  currentIndex: number
  answers:      Record<string, { answer: string; timeMs: number; correct: boolean }>
  timeLimit:    number
  startedAt:    number | null
}

// ─── Socket Events ────────────────────────────────────────────────────────────

export interface ServerToClientEvents {
  room_state:    (room: RoomPublic) => void
  error:         (msg: string) => void
  player_joined: (player: Player) => void
  player_left:   (playerId: string, name: string) => void
  game_state:    (state: GameState) => void
  kicked:        () => void
}

export interface ClientToServerEvents {
  host_create_room: (cb: (code: string) => void) => void
  player_join:      (code: string, name: string, cb: (err: string | null, room: RoomPublic | null) => void) => void
  player_ready:     () => void
  select_game:      (game: GameType) => void
  start_game:       (config?: TriviaConfig) => void
  game_action:      (action: GameAction) => void
  next_round:       () => void
  end_game:         () => void
  kick_player:      (playerId: string) => void
}

export type GameAction =
  | { type: 'trivia_answer';    answerId: number }
  | { type: 'flag_answer';      answer: string }
  | { type: 'imposter_vote';    targetId: string }
  | { type: 'capitals_answer';  answer: string }
  | { type: 'landmarks_answer'; answer: string }

// Public room state (safe to send to all clients)
export type RoomPublic = Omit<Room, 'hostId'>
