import wordPairs from '@/data/imposter-words.json'
import type { DrawImposterState } from '@/lib/types'

const DRAW_SECONDS  = 25      // per drawing round
const TOTAL_ROUNDS  = 4
const POINTS_CAUGHT = 500     // each player who fingered the imposter
const POINTS_SURVIVE = 800    // imposter reward for escaping
const POINTS_ARTIST = 150     // bonus for a non-imposter who got a vote? no — kept simple

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function createDrawImposterGame(
  playerIds: string[],
  totalRounds = TOTAL_ROUNDS,
): DrawImposterState {
  const pair = shuffle([...wordPairs])[0]
  const imposterId = playerIds[Math.floor(Math.random() * playerIds.length)]
  return {
    game: 'drawimposter',
    phase: 'reveal',
    round: 1,
    totalRounds,
    imposterId,
    realWord: pair.real,
    imposterWord: pair.imposter,
    drawSeconds: DRAW_SECONDS,
    roundStartedAt: null,
    voteCalls: [],
    votes: {},
    caught: null,
  }
}

export function startDrawing(state: DrawImposterState): DrawImposterState {
  return { ...state, phase: 'drawing', round: 1, roundStartedAt: Date.now() }
}

export function nextDrawRound(state: DrawImposterState): DrawImposterState {
  return { ...state, round: state.round + 1, roundStartedAt: Date.now() }
}

export function openDrawVoting(state: DrawImposterState): DrawImposterState {
  return { ...state, phase: 'voting', votes: {}, roundStartedAt: null }
}

export function addVoteCall(state: DrawImposterState, playerId: string): DrawImposterState {
  if (state.voteCalls.includes(playerId)) return state
  return { ...state, voteCalls: [...state.voteCalls, playerId] }
}

/** True once more than half the players have asked to vote early. */
export function shouldStartEarlyVote(state: DrawImposterState, playerCount: number): boolean {
  return playerCount > 0 && state.voteCalls.length > Math.floor(playerCount / 2)
}

export function submitDrawVote(
  state: DrawImposterState,
  voterId: string,
  targetId: string,
): DrawImposterState {
  if (state.phase !== 'voting') return state
  return { ...state, votes: { ...state.votes, [voterId]: targetId } }
}

export function resolveDrawVotes(
  state: DrawImposterState,
  players: { id: string; name: string }[],
): { state: DrawImposterState; points: Record<string, number> } {
  const voteCounts: Record<string, number> = {}
  for (const targetId of Object.values(state.votes)) {
    voteCounts[targetId] = (voteCounts[targetId] ?? 0) + 1
  }
  const mostVoted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const caught = mostVoted === state.imposterId

  const points: Record<string, number> = {}
  if (caught) {
    for (const [voterId, targetId] of Object.entries(state.votes)) {
      if (targetId === state.imposterId) points[voterId] = (points[voterId] ?? 0) + POINTS_CAUGHT
    }
  } else {
    points[state.imposterId] = (points[state.imposterId] ?? 0) + POINTS_SURVIVE
  }

  return {
    state: { ...state, phase: 'finished', caught },
    points,
  }
}

export { DRAW_SECONDS, TOTAL_ROUNDS, POINTS_CAUGHT, POINTS_SURVIVE, POINTS_ARTIST }
