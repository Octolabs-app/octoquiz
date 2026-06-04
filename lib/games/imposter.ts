import wordPairs from '@/data/imposter-words.json'
import { pickFresh } from '@/lib/no-repeat'
import type { ImposterState, ImposterRoundResult } from '@/lib/types'

const DISCUSSION_SECONDS = 90
const POINTS_CAUGHT    = 500  // each finder gets this
const POINTS_NOT_CAUGHT = 800  // imposter gets this if they survive

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function createImposterGame(playerIds: string[], totalRounds = 3): ImposterState {
  const pair = pickFresh('imposter', wordPairs, 1, p => p.real)[0]
  const imposterId = playerIds[Math.floor(Math.random() * playerIds.length)]

  return {
    game: 'imposter',
    phase: 'reveal',
    round: 1,
    totalRounds,
    imposterId,
    realWord: pair.real,
    imposterWord: pair.imposter,
    discussionSeconds: DISCUSSION_SECONDS,
    discussionStartedAt: null,
    votes: {},
    roundResults: [],
  }
}

export function startDiscussion(state: ImposterState): ImposterState {
  return { ...state, phase: 'discussion', discussionStartedAt: Date.now() }
}

export function startVoting(state: ImposterState): ImposterState {
  return { ...state, phase: 'voting', votes: {} }
}

export function submitVote(
  state: ImposterState,
  voterId: string,
  targetId: string,
): ImposterState {
  if (state.phase !== 'voting') return state
  return {
    ...state,
    votes: { ...state.votes, [voterId]: targetId },
  }
}

export function resolveVotes(
  state: ImposterState,
  players: { id: string; name: string }[],
): { state: ImposterState; points: Record<string, number> } {
  const voteCounts: Record<string, number> = {}
  for (const targetId of Object.values(state.votes)) {
    voteCounts[targetId] = (voteCounts[targetId] ?? 0) + 1
  }

  // Most-voted player
  const mostVoted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const caught = mostVoted === state.imposterId

  const imposterPlayer = players.find(p => p.id === state.imposterId)

  const result: ImposterRoundResult = {
    round: state.round,
    imposterId: state.imposterId,
    imposterName: imposterPlayer?.name ?? '???',
    realWord: state.realWord,
    imposterWord: state.imposterWord,
    caught,
    votes: state.votes,
  }

  const points: Record<string, number> = {}
  if (caught) {
    // Everyone who voted correctly gets points
    for (const [voterId, targetId] of Object.entries(state.votes)) {
      if (targetId === state.imposterId) {
        points[voterId] = (points[voterId] ?? 0) + POINTS_CAUGHT
      }
    }
  } else {
    // Imposter wins
    points[state.imposterId] = POINTS_NOT_CAUGHT
  }

  const isLastRound = state.round >= state.totalRounds

  return {
    state: {
      ...state,
      phase: isLastRound ? 'finished' : 'result',
      roundResults: [...state.roundResults, result],
    },
    points,
  }
}

export function nextImposterRound(
  state: ImposterState,
  playerIds: string[],
): ImposterState {
  const pair = pickFresh('imposter', wordPairs, 1, p => p.real)[0]
  const imposterId = playerIds[Math.floor(Math.random() * playerIds.length)]

  return {
    ...state,
    phase: 'reveal',
    round: state.round + 1,
    imposterId,
    realWord: pair.real,
    imposterWord: pair.imposter,
    discussionStartedAt: null,
    votes: {},
  }
}

export { POINTS_CAUGHT, POINTS_NOT_CAUGHT }
