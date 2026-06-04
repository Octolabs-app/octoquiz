import CAPITALS, { ALL_CAPITAL_CITIES } from '@/data/capitals'
import { pickFresh } from '@/lib/no-repeat'
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

// Wrong-answer cities (distractors) for "What is the capital of X?"
function pickCityOptions(correctCity: string): string[] {
  const others = ALL_CAPITAL_CITIES.filter(c => c !== correctCity)
  const wrong  = shuffle(others).slice(0, 3)
  return shuffle([correctCity, ...wrong])
}

// Text quiz: "What is the capital of {country}?" — 4 city options, no images.
export async function createCapitalsGame(questionCount = 12): Promise<CapitalsState> {
  const pool = pickFresh('capitals', CAPITALS, questionCount, c => c.city)

  const questions: CapitalsQuestion[] = pool.map((c, i) => {
    const options = pickCityOptions(c.city)
    return {
      id:           `c${i}`,
      country:      c.country,
      capital:      c.city,
      options,
      correctIndex: options.indexOf(c.city),
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
  const correct = answer === q.capital

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
