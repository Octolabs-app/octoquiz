import { getLocalQuestions } from '@/data/trivia-local'
import type { TriviaState, TriviaQuestion, TriviaConfig, TriviaMode, TriviaDifficulty } from '@/lib/types'
export { TRIVIA_CATEGORIES } from '@/lib/trivia-config'

// ─── Config defaults ──────────────────────────────────────────────────────────
const DEFAULT_CONFIG: TriviaConfig = {
  category:      'Mixed',
  mode:          'classic',
  questionCount: 10,
  difficulty:    'medium',
}

// Points range per difficulty
const POINTS: Record<TriviaDifficulty, { max: number; min: number }> = {
  easy:   { max:  600, min: 150 },
  medium: { max:  900, min: 200 },
  hard:   { max: 1200, min: 300 },
}

// Time limit per mode (seconds)
function getTimeLimit(mode: TriviaMode, difficulty: TriviaDifficulty): number {
  if (mode === 'speed') {
    return difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7
  }
  if (mode === 'sudden-death') return 15
  return 20 // classic
}

// ─── OpenTDB category map ─────────────────────────────────────────────────────
// https://opentdb.com/api_category.php
const OPENTDB_CATEGORY_MAP: Record<string, number | null> = {
  'General Knowledge': 9,
  'Geography & Capitals': 22,
  'Science & Nature': 17,
  'History': 23,
  'Movies & TV': 11,
  'Music': 12,
  'Sports': 21,
  'Pop Culture': null,    // no exact match — use local
  'Food & Cuisine': null, // no OpenTDB category — use local
  'World Landmarks': null,// no OpenTDB category — use local
  'Mixed': null,          // random — no category filter
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── OpenTDB session tokens (anti-repetition) ────────────────────────────────
// OpenTDB tracks which questions have been served per token — once all questions
// in a pool are exhausted it returns code 4 and we reset the token.
// We keep one token per (category × difficulty) key so different rooms sharing
// the same category never repeat questions.

interface TokenEntry { token: string; fetchedAt: number }
const tokenCache = new Map<string, TokenEntry>()

async function getOrCreateToken(cacheKey: string): Promise<string | null> {
  const existing = tokenCache.get(cacheKey)
  // Tokens last 6 hours on OpenTDB side; we refresh after 5h to be safe.
  if (existing && Date.now() - existing.fetchedAt < 5 * 60 * 60 * 1000) {
    return existing.token
  }
  try {
    const res  = await fetch('https://opentdb.com/api_token.php?command=request', { signal: AbortSignal.timeout(5000) })
    const data = await res.json() as { response_code: number; token: string }
    if (data.response_code !== 0) return null
    tokenCache.set(cacheKey, { token: data.token, fetchedAt: Date.now() })
    return data.token
  } catch { return null }
}

async function resetToken(cacheKey: string, token: string): Promise<string | null> {
  try {
    const res  = await fetch(`https://opentdb.com/api_token.php?command=reset&token=${token}`, { signal: AbortSignal.timeout(5000) })
    const data = await res.json() as { response_code: number; token: string }
    if (data.response_code !== 0) return null
    tokenCache.set(cacheKey, { token: data.token, fetchedAt: Date.now() })
    return data.token
  } catch { return null }
}

// ─── OpenTDB fetch ────────────────────────────────────────────────────────────
interface OTDBResult {
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

function b64(s: string): string {
  try { return Buffer.from(s, 'base64').toString('utf8') } catch { return s }
}

async function fetchOpenTDB(
  questionCount: number,
  category: string,
  difficulty: TriviaDifficulty,
): Promise<TriviaQuestion[] | null> {
  const amount    = Math.min(50, Math.max(1, questionCount))
  const catId     = OPENTDB_CATEGORY_MAP[category]
  const catParam  = catId ? `&category=${catId}` : ''
  const diffParam = `&difficulty=${difficulty}`
  const cacheKey  = `${category}::${difficulty}`

  // Get (or create) a session token so OpenTDB tracks which questions we've seen
  let token = await getOrCreateToken(cacheKey)
  const tokenParam = token ? `&token=${token}` : ''
  const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&encode=base64${catParam}${diffParam}${tokenParam}`

  function mapResults(results: OTDBResult[]): TriviaQuestion[] {
    return results.map((r, i) => {
      const correct = b64(r.correct_answer)
      const options = shuffle([correct, ...r.incorrect_answers.map(b64)])
      return {
        id:           `q${i}`,
        question:     b64(r.question),
        options,
        correctIndex: options.indexOf(correct),
        category:     b64(r.category),
        points:       POINTS[difficulty].max,
      }
    })
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return null
    const data = (await res.json()) as { response_code: number; results: OTDBResult[] }

    // Code 4 = token exhausted (all questions served) → reset and retry once
    if (data.response_code === 4 && token) {
      token = await resetToken(cacheKey, token)
      if (!token) return null
      const retryUrl = `https://opentdb.com/api.php?amount=${amount}&type=multiple&encode=base64${catParam}${diffParam}&token=${token}`
      const retryRes  = await fetch(retryUrl, { signal: AbortSignal.timeout(8000) })
      if (!retryRes.ok) return null
      const retryData = (await retryRes.json()) as { response_code: number; results: OTDBResult[] }
      if (retryData.response_code !== 0 || !Array.isArray(retryData.results) || retryData.results.length === 0) return null
      return mapResults(retryData.results)
    }

    if (data.response_code !== 0 || !Array.isArray(data.results) || data.results.length === 0) return null
    return mapResults(data.results)
  } catch {
    return null
  }
}

// ─── Local bank deduplication ─────────────────────────────────────────────────
// Track which local question indices have been served per category so repeated
// sessions never replay the same questions until the pool is exhausted.
const localUsed = new Map<string, Set<number>>()

function buildLocalQuestions(
  category: string,
  questionCount: number,
  difficulty: TriviaDifficulty = 'medium',
): TriviaQuestion[] {
  const raw      = getLocalQuestions(category, 999) // get full pool
  const usedKey  = `local::${category}`
  const used     = localUsed.get(usedKey) ?? new Set<number>()

  // Fresh indices not yet served
  let available = raw
    .map((_, i) => i)
    .filter(i => !used.has(i))

  // If we've used everything, reset and start fresh
  if (available.length < questionCount) {
    used.clear()
    available = raw.map((_, i) => i)
  }

  // Shuffle then take what we need
  const picked = shuffle(available).slice(0, questionCount)
  picked.forEach(i => used.add(i))
  localUsed.set(usedKey, used)

  return picked.map((idx, i) => {
    const q = raw[idx]
    return {
      id:           `q${i}`,
      question:     q.q,
      options:      q.o,
      correctIndex: q.a,
      category,
      points:       POINTS[difficulty].max,
    }
  })
}

// ─── Create game ──────────────────────────────────────────────────────────────
export async function createTriviaGame(cfg: Partial<TriviaConfig> = {}): Promise<TriviaState> {
  const config: TriviaConfig = { ...DEFAULT_CONFIG, ...cfg }
  const { category, mode, questionCount, difficulty } = config

  // Local-only categories skip the OpenTDB call entirely
  const localOnly = OPENTDB_CATEGORY_MAP[category] === null && category !== 'Mixed'
  const remote = localOnly ? null : await fetchOpenTDB(questionCount, category, difficulty)
  const questions = (remote && remote.length > 0)
    ? remote
    : buildLocalQuestions(category, questionCount, difficulty)

  return {
    game:       'trivia',
    phase:      'countdown',
    questions,
    currentIndex: 0,
    answers:    {},
    timeLimit:  getTimeLimit(mode, difficulty),
    startedAt:  null,
    category,
    mode,
    difficulty,
    eliminated: [],
    streaks:    {},
  }
}

// ─── Phase transitions ────────────────────────────────────────────────────────
export function startQuestion(state: TriviaState): TriviaState {
  return { ...state, phase: 'question', answers: {}, startedAt: Date.now() }
}

export function submitTriviaAnswer(
  state: TriviaState,
  playerId: string,
  answerId: number,
): TriviaState {
  if (state.phase !== 'question') return state
  if (state.answers[playerId]) return state            // already answered
  if (state.eliminated.includes(playerId)) return state // spectator

  const timeMs = state.startedAt ? Date.now() - state.startedAt : state.timeLimit * 1000
  return {
    ...state,
    answers: { ...state.answers, [playerId]: { index: answerId, timeMs } },
  }
}

// ─── Scoring with streak + difficulty multiplier ──────────────────────────────
export function calculateTriviaPoints(
  state: TriviaState,
  playerIds: string[],
): Record<string, number> {
  const q   = state.questions[state.currentIndex]
  const pts: Record<string, number> = {}
  const { max, min } = POINTS[state.difficulty]

  for (const pid of playerIds) {
    if (state.eliminated.includes(pid)) { pts[pid] = 0; continue }
    const ans = state.answers[pid]
    if (!ans || ans.index !== q.correctIndex) { pts[pid] = 0; continue }

    // Speed bonus
    const ratio   = Math.max(0, 1 - ans.timeMs / (state.timeLimit * 1000))
    let score     = Math.round(min + ratio * (max - min))

    // Streak multiplier
    const streak = (state.streaks[pid] ?? 0) + 1 // +1 because they just got it right
    if (streak >= 8) score = Math.round(score * 2.0)
    else if (streak >= 5) score = Math.round(score * 1.5)
    else if (streak >= 3) score = Math.round(score * 1.25)

    pts[pid] = score
  }
  return pts
}

// ─── Update streaks after each question ──────────────────────────────────────
export function updateStreaks(
  state: TriviaState,
  playerIds: string[],
): TriviaState {
  const q       = state.questions[state.currentIndex]
  const streaks = { ...state.streaks }
  for (const pid of playerIds) {
    if (state.eliminated.includes(pid)) continue
    const ans     = state.answers[pid]
    const correct = ans && ans.index === q.correctIndex
    streaks[pid]  = correct ? (streaks[pid] ?? 0) + 1 : 0
  }
  return { ...state, streaks }
}

// ─── Sudden Death elimination ─────────────────────────────────────────────────
// Call AFTER calculateTriviaPoints. Marks wrong-answer and non-answering players
// as eliminated. Returns updated state.
export function eliminateWrongAnswers(
  state: TriviaState,
  playerIds: string[],
): TriviaState {
  if (state.mode !== 'sudden-death') return state
  const q          = state.questions[state.currentIndex]
  const newElims   = [...state.eliminated]
  for (const pid of playerIds) {
    if (newElims.includes(pid)) continue   // already eliminated
    const ans    = state.answers[pid]
    const wrong  = !ans || ans.index !== q.correctIndex
    if (wrong) newElims.push(pid)
  }
  return { ...state, eliminated: newElims }
}

// ─── Check if sudden-death is over ───────────────────────────────────────────
export function isSuddenDeathOver(state: TriviaState, playerIds: string[]): boolean {
  if (state.mode !== 'sudden-death') return false
  const active = playerIds.filter(id => !state.eliminated.includes(id))
  return active.length <= 1
}

export function revealTriviaAnswer(state: TriviaState): TriviaState {
  return { ...state, phase: 'reveal' }
}

export function showTriviaLeaderboard(state: TriviaState): TriviaState {
  return { ...state, phase: 'leaderboard' }
}

export function advanceTriviaQuestion(state: TriviaState): TriviaState {
  const nextIndex = state.currentIndex + 1
  if (nextIndex >= state.questions.length) {
    return { ...state, phase: 'finished' }
  }
  return {
    ...state,
    phase:        'countdown',
    currentIndex: nextIndex,
    answers:      {},
    startedAt:    null,
  }
}

// TRIVIA_CATEGORIES is now in lib/trivia-config.ts and re-exported above
