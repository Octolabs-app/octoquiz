// Decoy uses its own list of simple, single-word, easy-to-draw pairs
// (the verbal Imposter game keeps the longer location-style words).
import wordPairs from '@/data/decoy-words.json'
import type { DrawImposterState } from '@/lib/types'

const TURN_SECONDS   = 15      // each player's turn on the shared board
const TOTAL_ROUNDS   = 4       // how many times each player draws
const POINTS_CAUGHT  = 500     // each player who fingered the decoy
const POINTS_SURVIVE = 800     // decoy reward for escaping

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
  const order = shuffle([...playerIds])
  const imposterId = order[Math.floor(Math.random() * order.length)]
  return {
    game: 'drawimposter',
    phase: 'reveal',
    round: 1,
    totalRounds,
    imposterId,
    realWord: pair.real,
    imposterWord: pair.imposter,
    drawerOrder: order,
    turnIndex: 0,
    currentDrawer: order[0] ?? '',
    turnSeconds: TURN_SECONDS,
    turnStartedAt: null,
    voteCalls: [],
    votes: {},
    caught: null,
  }
}

/** Total number of turns across the whole game. */
export function totalTurns(state: DrawImposterState): number {
  return state.totalRounds * state.drawerOrder.length
}

export function startDrawing(state: DrawImposterState): DrawImposterState {
  return {
    ...state,
    phase: 'drawing',
    turnIndex: 0,
    round: 1,
    currentDrawer: state.drawerOrder[0] ?? '',
    turnStartedAt: Date.now(),
  }
}

/** Advance to the next player's turn. Returns done=true when all turns are used. */
export function advanceTurn(state: DrawImposterState): { state: DrawImposterState; done: boolean } {
  const next = state.turnIndex + 1
  if (next >= totalTurns(state)) return { state, done: true }
  const n = state.drawerOrder.length
  return {
    state: {
      ...state,
      turnIndex: next,
      round: Math.floor(next / n) + 1,
      currentDrawer: state.drawerOrder[next % n] ?? '',
      turnStartedAt: Date.now(),
    },
    done: false,
  }
}

export function openDrawVoting(state: DrawImposterState): DrawImposterState {
  return { ...state, phase: 'voting', votes: {}, turnStartedAt: null }
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

  return { state: { ...state, phase: 'finished', caught }, points }
}

export { TURN_SECONDS, TOTAL_ROUNDS, POINTS_CAUGHT, POINTS_SURVIVE }
