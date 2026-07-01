/**
 * Typed room relay events for OctoQuiz.
 *
 * Architecture (host-as-server):
 *  - Host tracks presence with role='host'
 *  - Players track presence with their player data
 *  - Host broadcasts room_state / game_state to all
 *  - Players broadcast player_action to the relay for the host to handle
 */

import type { RoomPublic, GameState, GameAction } from './types'

// ── Presence payloads ─────────────────────────────────────────────────────────

export interface HostPresence {
  role: 'host'
  hostId: string
}

export interface PlayerPresence {
  role: 'player'
  id: string
  name: string
  avatar: string
  color: string
  score: number
  isConnected: boolean
}

export type RoomPresence = HostPresence | PlayerPresence

// ── Broadcast events (host → all) ─────────────────────────────────────────────

export type HostEvent =
  | { event: 'room_state';  payload: RoomPublic }
  | { event: 'game_state';  payload: GameState  }
  | { event: 'player_kicked'; payload: { id: string } }

// ── Broadcast events (player → channel, host reads) ──────────────────────────

export type PlayerEvent =
  | { event: 'player_action'; payload: { playerId: string; action: GameAction } }
  | { event: 'player_ready';  payload: { playerId: string } }

export type ChannelEvent = HostEvent | PlayerEvent
