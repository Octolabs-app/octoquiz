import test from 'node:test'
import assert from 'node:assert/strict'
import { answerTime, timedPoints, caughtByVotes } from '../lib/game-rules'
import {
  createFlagQuizGame,
  startFlagQuestion,
  submitFlagAnswer,
  calculateFlagPoints,
  advanceFlagQuestion,
} from '../lib/games/flag-quiz'
import {
  createCapitalsGame,
  startCapitalsQuestion,
  submitCapitalsAnswer,
  calculateCapitalsPoints,
} from '../lib/games/capitals'
import { submitLandmarksAnswer, calculateLandmarksPoints } from '../lib/games/landmarks'
import {
  submitTriviaAnswer,
  calculateTriviaPoints,
  eliminateWrongAnswers,
} from '../lib/games/trivia'
import { createImposterGame, submitVote } from '../lib/games/imposter'
import { createDrawImposterGame, submitDrawVote } from '../lib/games/draw-imposter'
import { pickFresh } from '../lib/no-repeat'
import type { TriviaState, LandmarksState } from '../lib/types'

test('deadline is exclusive; clock rollback, missing start and malformed time do not score', () => {
  assert.equal(answerTime(0, 15, 14999), 14999)
  assert.equal(answerTime(0, 15, 15000), null)
  for (const value of [-1, NaN, Infinity, 15000, 15001])
    assert.equal(timedPoints(value, 15, 100, 800), 0)
  assert.equal(answerTime(100, 15, 99), null)
  assert.equal(answerTime(null, 15, 1), null)
  let previous = Infinity
  for (let t = 0; t < 15000; t++) {
    const score = timedPoints(t, 15, 100, 800)
    assert(score >= 100 && score <= 800 && score <= previous)
    previous = score
  }
})
test('flags: options unique, original country present, answers immutable and late answers rejected', () => {
  let state = startFlagQuestion(createFlagQuizGame(15))
  assert.equal(state.questions.length, 15)
  for (const q of state.questions) {
    assert.equal(new Set(q.options).size, 4)
    assert(q.options.includes(q.countryName))
  }
  state = submitFlagAnswer(state, 'a', state.questions[0].countryName)
  assert(state.answers.a.correct)
  assert.equal(submitFlagAnswer(state, 'a', 'wrong'), state)
  assert(calculateFlagPoints(state, ['a', 'b']).a > 0)
  const late = { ...state, answers: {}, startedAt: Date.now() - 15001 }
  assert.equal(submitFlagAnswer(late, 'b', 'anything'), late)
  for (let i = 0; i < 15; i++) state = advanceFlagQuestion(state)
  assert.equal(state.phase, 'finished')
})
test('capitals and landmarks reject late inputs and award only correct answers', async () => {
  let c = startCapitalsQuestion(await createCapitalsGame(12))
  c = submitCapitalsAnswer(c, 'a', c.questions[0].capital)
  assert(calculateCapitalsPoints(c, ['a']).a > 0)
  const late = { ...c, answers: {}, startedAt: Date.now() - c.timeLimit * 1000 - 1 }
  assert.equal(submitCapitalsAnswer(late, 'b', 'X'), late)
  const l = {
    game: 'landmarks',
    phase: 'question',
    questions: [
      {
        id: 'l',
        name: 'A',
        country: 'B',
        city: 'C',
        imageUrl: '',
        questionType: 'name',
        questionText: '?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
      },
    ],
    currentIndex: 0,
    answers: {},
    timeLimit: 20,
    startedAt: Date.now(),
  } as LandmarksState
  const answered = submitLandmarksAnswer(l, 'a', 'A')
  assert(calculateLandmarksPoints(answered, ['a']).a > 0)
  const lateL = { ...l, startedAt: Date.now() - l.timeLimit * 1000 - 1 }
  assert.equal(submitLandmarksAnswer(lateL, 'a', 'A'), lateL)
})
test('trivia: malformed indices rejected, valid answer locks, streak bonus and sudden death', () => {
  const s = {
    game: 'trivia',
    phase: 'question',
    questions: [
      {
        id: 't',
        question: '?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
        category: 'Mixed',
        points: 1000,
      },
    ],
    currentIndex: 0,
    answers: {},
    timeLimit: 20,
    startedAt: Date.now(),
    category: 'Mixed',
    mode: 'classic',
    difficulty: 'medium',
    eliminated: [],
    streaks: {},
  } as TriviaState
  for (const index of [-1, 4, NaN, 1.5]) assert.equal(submitTriviaAnswer(s, 'a', index), s)
  const answered = submitTriviaAnswer(s, 'a', 1)
  assert.equal(submitTriviaAnswer(answered, 'a', 0), answered)
  assert(
    calculateTriviaPoints({ ...answered, streaks: { a: 7 } }, ['a']).a >
      calculateTriviaPoints(answered, ['a']).a,
  )
  assert.deepEqual(
    eliminateWrongAnswers({ ...answered, mode: 'sudden-death' }, ['a', 'b']).eliminated,
    ['b'],
  )
  const late = { ...s, startedAt: Date.now() - 20001 }
  assert.equal(submitTriviaAnswer(late, 'a', 1), late)
})
test('votes lock, self votes rejected and ties never select a winner by insertion order', () => {
  const ids = ['a', 'b', 'c']
  assert.equal(caughtByVotes({ a: 'c', b: 'c' }, 'c', ids), true)
  assert.equal(caughtByVotes({ a: 'c', c: 'a' }, 'c', ids), false)
  assert.equal(caughtByVotes({ outsider: 'c' }, 'c', ids), false)
  const s = { ...createImposterGame(ids), phase: 'voting' as const },
    v = submitVote(s, 'a', 'b')
  assert.equal(submitVote(v, 'a', 'c'), v)
  assert.equal(submitVote(s, 'a', 'a'), s)
  const d = { ...createDrawImposterGame(ids), phase: 'voting' as const },
    dv = submitDrawVote(d, 'a', 'b')
  assert.equal(submitDrawVote(dv, 'a', 'c'), dv)
})
test('fresh picker avoids repeats until the remaining pool is exhausted', () => {
  const pool = ['a', 'b', 'c', 'd']
  const first = pickFresh('test', pool, 2, (x) => x),
    second = pickFresh('test', pool, 2, (x) => x)
  assert.equal(new Set([...first, ...second]).size, 4)
  assert.equal(pickFresh('test', pool, 10, (x) => x).length, 4)
})
