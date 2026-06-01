import LANDMARKS, { ALL_LANDMARK_COUNTRIES, ALL_LANDMARK_NAMES } from '@/data/landmarks'
import type { LandmarksState, LandmarksQuestion } from '@/lib/types'

const TIME_LIMIT = 25   // slightly more time — landmarks can be trickier
const POINTS_MAX = 1000
const POINTS_MIN = 200

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickOptions(correct: string, pool: string[]): string[] {
  const others = pool.filter(x => x !== correct)
  return shuffle([correct, ...shuffle(others).slice(0, 3)])
}

async function fetchLandmarkImage(wikiPage: string): Promise<string> {
  try {
    const url  = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiPage)}`
    const res  = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return ''
    const data = await res.json()
    return data.originalimage?.source ?? data.thumbnail?.source ?? ''
  } catch { return '' }
}

export async function createLandmarksGame(questionCount = 12): Promise<LandmarksState> {
  const pool = shuffle([...LANDMARKS]).slice(0, questionCount)

  const imageUrls = await Promise.all(
    pool.map(l => fetchLandmarkImage(l.wikiPage))
  )

  const questions: LandmarksQuestion[] = pool.map((l, i) => {
    if (l.questionType === 'name') {
      const options = pickOptions(l.name, ALL_LANDMARK_NAMES)
      return {
        id:           `l${i}`,
        name:         l.name,
        country:      l.country,
        city:         l.city,
        imageUrl:     imageUrls[i],
        questionType: 'name' as const,
        questionText: 'What is this landmark?',
        options,
        correctIndex: options.indexOf(l.name),
      }
    } else {
      const options = pickOptions(l.country, ALL_LANDMARK_COUNTRIES)
      return {
        id:           `l${i}`,
        name:         l.name,
        country:      l.country,
        city:         l.city,
        imageUrl:     imageUrls[i],
        questionType: 'country' as const,
        questionText: 'Which country is this in?',
        options,
        correctIndex: options.indexOf(l.country),
      }
    }
  })

  return {
    game:         'landmarks',
    phase:        'countdown',
    questions,
    currentIndex: 0,
    answers:      {},
    timeLimit:    TIME_LIMIT,
    startedAt:    null,
  }
}

export function startLandmarksQuestion(state: LandmarksState): LandmarksState {
  return { ...state, phase: 'question', answers: {}, startedAt: Date.now() }
}

export function submitLandmarksAnswer(
  state: LandmarksState,
  playerId: string,
  answer: string,
): LandmarksState {
  if (state.phase !== 'question') return state
  if (state.answers[playerId]) return state

  const q       = state.questions[state.currentIndex]
  const timeMs  = state.startedAt ? Date.now() - state.startedAt : TIME_LIMIT * 1000
  const correct = answer === (q.questionType === 'name' ? q.name : q.country)

  return {
    ...state,
    answers: { ...state.answers, [playerId]: { answer, timeMs, correct } },
  }
}

export function calculateLandmarksPoints(
  state: LandmarksState,
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

export function revealLandmarksAnswer(state: LandmarksState): LandmarksState {
  return { ...state, phase: 'reveal' }
}

export function showLandmarksLeaderboard(state: LandmarksState): LandmarksState {
  return { ...state, phase: 'leaderboard' }
}

export function advanceLandmarksQuestion(state: LandmarksState): LandmarksState {
  const next = state.currentIndex + 1
  if (next >= state.questions.length) return { ...state, phase: 'finished' }
  return { ...state, phase: 'countdown', currentIndex: next, answers: {}, startedAt: null }
}
