import prompts from '@/data/truth-or-dare.json'
import type { TruthDareState, TruthDareMode } from '@/lib/types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const usedTruths = new Set<string>()
const usedDares  = new Set<string>()

function pickPrompt(type: 'truth' | 'dare', mode: TruthDareMode): string {
  const pool = prompts[mode][type === 'truth' ? 'truths' : 'dares']
  const unused = pool.filter(p => !(type === 'truth' ? usedTruths : usedDares).has(p))
  const source = unused.length > 0 ? unused : pool  // reset if exhausted

  const picked = shuffle(source)[0]
  if (type === 'truth') usedTruths.add(picked)
  else usedDares.add(picked)
  return picked
}

export function createTruthDareGame(playerIds: string[], mode: TruthDareMode = 'safe'): TruthDareState {
  usedTruths.clear()
  usedDares.clear()
  const playerOrder = shuffle([...playerIds])

  return {
    game: 'truth-or-dare',
    phase: 'pick',
    mode,
    currentPlayerId: playerOrder[0],
    currentPrompt: null,
    currentChoice: null,
    turnIndex: 0,
    playerOrder,
    skipsUsed: Object.fromEntries(playerIds.map(id => [id, 0])),
  }
}

export function playerPicksTD(
  state: TruthDareState,
  playerId: string,
  choice: 'truth' | 'dare',
): TruthDareState {
  if (state.phase !== 'pick') return state
  if (state.currentPlayerId !== playerId) return state

  const prompt = pickPrompt(choice, state.mode)
  return { ...state, phase: 'prompt', currentChoice: choice, currentPrompt: prompt }
}

export function completeTurn(state: TruthDareState): TruthDareState {
  const nextIndex = (state.turnIndex + 1) % state.playerOrder.length
  return {
    ...state,
    phase: 'pick',
    currentPlayerId: state.playerOrder[nextIndex],
    currentPrompt: null,
    currentChoice: null,
    turnIndex: nextIndex,
  }
}

export function skipTurn(state: TruthDareState, playerId: string): TruthDareState {
  if (state.currentPlayerId !== playerId) return state
  const skipsUsed = {
    ...state.skipsUsed,
    [playerId]: (state.skipsUsed[playerId] ?? 0) + 1,
  }
  return completeTurn({ ...state, skipsUsed })
}
