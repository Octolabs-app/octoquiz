import triviaData from '@/data/trivia.json'
import type { TriviaState, TriviaQuestion } from '@/lib/types'

const POINTS_MAX = 1000
const POINTS_MIN = 200
const TIME_LIMIT = 20

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function createTriviaGame(category = 'General', questionCount = 10): TriviaState {
  const cats = triviaData.categories as Record<string, { q: string; o: string[]; a: number }[]>
  const pool = category === 'Mixed'
    ? Object.values(cats).flat()
    : (cats[category] ?? cats['General'])

  const selected = shuffle(pool).slice(0, questionCount)
  const questions: TriviaQuestion[] = selected.map((q, i) => ({
    id: `q${i}`,
    question: q.q,
    options: q.o,
    correctIndex: q.a,
    category,
    points: POINTS_MAX,
  }))

  return {
    game: 'trivia',
    phase: 'countdown',
    questions,
    currentIndex: 0,
    answers: {},
    timeLimit: TIME_LIMIT,
    startedAt: null,
    category,
  }
}

export function startQuestion(state: TriviaState): TriviaState {
  return {
    ...state,
    phase: 'question',
    answers: {},
    startedAt: Date.now(),
  }
}

export function submitTriviaAnswer(
  state: TriviaState,
  playerId: string,
  answerId: number,
): TriviaState {
  if (state.phase !== 'question') return state
  if (state.answers[playerId]) return state // already answered

  const timeMs = state.startedAt ? Date.now() - state.startedAt : state.timeLimit * 1000

  return {
    ...state,
    answers: {
      ...state.answers,
      [playerId]: { index: answerId, timeMs },
    },
  }
}

export function calculateTriviaPoints(
  state: TriviaState,
  playerIds: string[],
): Record<string, number> {
  const q = state.questions[state.currentIndex]
  const pts: Record<string, number> = {}

  for (const pid of playerIds) {
    const ans = state.answers[pid]
    if (!ans || ans.index !== q.correctIndex) {
      pts[pid] = 0
      continue
    }
    // Points scale with speed: full points at 0ms, min points at timeLimit
    const ratio = Math.max(0, 1 - ans.timeMs / (state.timeLimit * 1000))
    pts[pid] = Math.round(POINTS_MIN + ratio * (POINTS_MAX - POINTS_MIN))
  }

  return pts
}

export function advanceTriviaQuestion(state: TriviaState): TriviaState {
  const nextIndex = state.currentIndex + 1
  if (nextIndex >= state.questions.length) {
    return { ...state, phase: 'finished' }
  }
  return {
    ...state,
    phase: 'countdown',
    currentIndex: nextIndex,
    answers: {},
    startedAt: null,
  }
}

export function revealTriviaAnswer(state: TriviaState): TriviaState {
  return { ...state, phase: 'reveal' }
}

export function showTriviaLeaderboard(state: TriviaState): TriviaState {
  return { ...state, phase: 'leaderboard' }
}

export const TRIVIA_CATEGORIES = ['General', 'Pop Culture', 'Science', 'Sports', 'Food & Drink', 'Mixed']
