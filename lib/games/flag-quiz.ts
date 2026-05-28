import countries from '@/data/countries.json'
import type { FlagQuizState, FlagQuizQuestion } from '@/lib/types'

const TIME_LIMIT = 15
const POINTS_MAX = 800
const POINTS_MIN = 100

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickOptions(correct: string, count = 4): string[] {
  const others = countries
    .filter(c => c.name !== correct)
    .map(c => c.name)
  const wrong = shuffle(others).slice(0, count - 1)
  return shuffle([correct, ...wrong])
}

export function createFlagQuizGame(questionCount = 15): FlagQuizState {
  const pool = shuffle([...countries]).slice(0, questionCount)
  const questions: FlagQuizQuestion[] = pool.map(c => ({
    countryCode: c.code,
    countryName: c.name,
    flag: c.flag,
    options: pickOptions(c.name),
  }))

  return {
    game: 'flag-quiz',
    phase: 'countdown',
    questions,
    currentIndex: 0,
    answers: {},
    timeLimit: TIME_LIMIT,
    startedAt: null,
  }
}

export function startFlagQuestion(state: FlagQuizState): FlagQuizState {
  return { ...state, phase: 'question', answers: {}, startedAt: Date.now() }
}

export function submitFlagAnswer(
  state: FlagQuizState,
  playerId: string,
  answer: string,
): FlagQuizState {
  if (state.phase !== 'question') return state
  if (state.answers[playerId]) return state

  const timeMs = state.startedAt ? Date.now() - state.startedAt : TIME_LIMIT * 1000
  const correct = answer.toLowerCase().trim() ===
    state.questions[state.currentIndex].countryName.toLowerCase().trim()

  return {
    ...state,
    answers: {
      ...state.answers,
      [playerId]: { answer, timeMs, correct },
    },
  }
}

export function calculateFlagPoints(
  state: FlagQuizState,
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

export function advanceFlagQuestion(state: FlagQuizState): FlagQuizState {
  const nextIndex = state.currentIndex + 1
  if (nextIndex >= state.questions.length) {
    return { ...state, phase: 'finished' }
  }
  return { ...state, phase: 'countdown', currentIndex: nextIndex, answers: {}, startedAt: null }
}

export function revealFlagAnswer(state: FlagQuizState): FlagQuizState {
  return { ...state, phase: 'reveal' }
}

export function showFlagLeaderboard(state: FlagQuizState): FlagQuizState {
  return { ...state, phase: 'leaderboard' }
}
