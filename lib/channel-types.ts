/**
 * Typed Supabase Realtime channel events for OctoQuiz.
 *
 * Architecture (host-as-server):
 *  - Host joins as PRESENCE with role='host'
 *  - Players join as PRESENCE with their player data
 *  - Host BROADCASTS room_state / game_state to all
 *  - Players BROADCAST player_action to the channel (host handles it)
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
  | { event: 'player_join';   payload: { name: string; avatar: string; color: string } }
  | { event: 'player_action'; payload: { playerId: string; action: GameAction } }
  | { event: 'player_ready';  payload: { playerId: string } }
  | { event: 'select_game';   payload: { game: string } }
  | { event: 'start_game';    payload: { config?: unknown } }
  | { event: 'kick_player';   payload: { targetId: string } }
  | { event: 'next_round';    payload: Record<string, never> }
  | { event: 'end_game';      payload: Record<string, never> }

export type ChannelEvent = HostEvent | PlayerEvent
