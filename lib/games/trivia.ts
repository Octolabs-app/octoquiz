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

// ─── Local question bank (fallback) ──────────────────────────────────────────
function buildLocalQuestions(category: string, questionCount: number): TriviaQuestion[] {
  const cats = triviaData.categories as Record<string, { q: string; o: string[]; a: number }[]>
  const pool = category === 'Mixed'
    ? Object.values(cats).flat()
    : (cats[category] ?? cats['General'])

  return shuffle(pool).slice(0, questionCount).map((q, i) => ({
    id: `q${i}`,
    question: q.q,
    options: q.o,
    correctIndex: q.a,
    category,
    points: POINTS_MAX,
  }))
}

// ─── Open Trivia Database (https://opentdb.com) ───────────────────────────────
// Free, ~4000+ questions. No API key. Rate limit: ~1 request / 5s per IP, so we
// fetch the whole game's worth in one call. Falls back to the local bank on any
// failure (network, rate-limit, offline dev, etc).
interface OTDBResult {
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

// OpenTDB base64-encodes every field (encode=base64) so punctuation/accents
// survive transport without HTML entities.
function b64(s: string): string {
  try { return Buffer.from(s, 'base64').toString('utf8') } catch { return s }
}

async function fetchOpenTDB(questionCount: number): Promise<TriviaQuestion[] | null> {
  const amount = Math.min(50, Math.max(1, questionCount))
  const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&encode=base64`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = (await res.json()) as { response_code: number; results: OTDBResult[] }
    if (data.response_code !== 0 || !Array.isArray(data.results) || data.results.length === 0) {
      return null
    }
    return data.results.map((r, i) => {
      const correct = b64(r.correct_answer)
      const options = shuffle([correct, ...r.incorrect_answers.map(b64)])
      return {
        id: `q${i}`,
        question: b64(r.question),
        options,
        correctIndex: options.indexOf(correct),
        category: b64(r.category),
        points: POINTS_MAX,
      }
    })
  } catch {
    return null
  }
}

export async function createTriviaGame(category = 'Mixed', questionCount = 10): Promise<TriviaState> {
  // Prefer the big OpenTDB pool; fall back to the bundled bank if it's
  // unreachable so the game always works (offline / rate-limited / etc).
  const remote = await fetchOpenTDB(questionCount)
  const questions = (remote && remote.length > 0)
    ? remote
    : buildLocalQuestions(category, questionCount)

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
