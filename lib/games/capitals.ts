import CAPITALS, { ALL_CAPITAL_COUNTRIES } from '@/data/capitals'
import type { CapitalsState, CapitalsQuestion } from '@/lib/types'

const TIME_LIMIT = 20
const POINTS_MAX = 900
const POINTS_MIN = 150

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickCountryOptions(correct: string): string[] {
  const others = ALL_CAPITAL_COUNTRIES.filter(c => c !== correct)
  const wrong  = shuffle(others).slice(0, 3)
  return shuffle([correct, ...wrong])
}

/** Fetch Wikipedia thumbnail for a capital city */
async function fetchCapitalImage(wikiPage: string): Promise<string> {
  try {
    const url  = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiPage)}`
    const res  = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return ''
    const data = await res.json()
    // Prefer larger original image, fall back to thumbnail
    return data.originalimage?.source ?? data.thumbnail?.source ?? ''
  } catch { return '' }
}

export async function createCapitalsGame(questionCount = 12): Promise<CapitalsState> {
  const pool = shuffle([...CAPITALS]).slice(0, questionCount)

  // Fetch all images in parallel
  const imageUrls = await Promise.all(
    pool.map(c => fetchCapitalImage(c.wikiPage))
  )

  const questions: CapitalsQuestion[] = pool.map((c, i) => {
    const options = pickCountryOptions(c.country)
    return {
      id:           `c${i}`,
      city:         c.city,
      country:      c.country,
      imageUrl:     imageUrls[i],
      options,
      correctIndex: options.indexOf(c.country),
    }
  })

  return {
    game:         'capitals',
    phase:        'countdown',
    questions,
    currentIndex: 0,
    answers:      {},
    timeLimit:    TIME_LIMIT,
    startedAt:    null,
  }
}

export function startCapitalsQuestion(state: CapitalsState): CapitalsState {
  return { ...state, phase: 'question', answers: {}, startedAt: Date.now() }
}

export function submitCapitalsAnswer(
  state: CapitalsState,
  playerId: string,
  answer: string,
): CapitalsState {
  if (state.phase !== 'question') return state
  if (state.answers[playerId]) return state

  const q       = state.questions[state.currentIndex]
  const timeMs  = state.startedAt ? Date.now() - state.startedAt : TIME_LIMIT * 1000
  const correct = answer === q.country

  return {
    ...state,
    answers: { ...state.answers, [playerId]: { answer, timeMs, correct } },
  }
}

export function calculateCapitalsPoints(
  state: CapitalsState,
  playerIds: string[],
): Record<string, number> {
  const pts: Record<string, number> = {}
  for (const pid of playerIds) {
    const ans = state.answers[pid]
    if (!ans?.correct) { pts[pid] = 0; continue }
    const ratio = Math.max(0, 1 - ans.timeMs / (TIME_LIMIT * 1000))
    pts[pid] = Math.round(POINTS_MIN + ratio * (POINTS_MAX - POINTS_MIN))
  }
  return pts
}

export function revealCapitalsAnswer(state: CapitalsState): CapitalsState {
  return { ...state, phase: 'reveal' }
}

export function showCapitalsLeaderboard(state: CapitalsState): CapitalsState {
  return { ...state, phase: 'leaderboard' }
}

export function advanceCapitalsQuestion(state: CapitalsState): CapitalsState {
  const next = state.currentIndex + 1
  if (next >= state.questions.length) return { ...state, phase: 'finished' }
  return { ...state, phase: 'countdown', currentIndex: next, answers: {}, startedAt: null }
}
