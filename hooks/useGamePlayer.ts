'use client'
/**
 * useGamePlayer — connects a player to an OctoQuiz room via Supabase Realtime.
 * Replaces useSocket.ts for the player side.
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase, channelName } from '@/lib/supabase'
import { PLAYER_COLORS, PLAYER_EMOJIS } from '@/lib/types'
import type { RoomPublic, GameState, GameAction } from '@/lib/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface JoinOptions {
  name:   string
  avatar: string
}

export function useGamePlayer(roomCode: string) {
  const [room,      setRoom]      = useState<RoomPublic | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [me,        setMe]        = useState<RoomPublic['players'][number] | null>(null)
  const [connected, setConnected] = useState(false)
  const [kicked,    setKicked]    = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const playerIdRef = useRef<string>('')

  const sendAction = useCallback((action: GameAction) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'player_action',
      payload: { playerId: playerIdRef.current, action },
    })
  }, [])

  const sendReady = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'player_ready',
      payload: { playerId: playerIdRef.current },
    })
  }, [])

  const emitSelectGame = useCallback((game: string) => {
    channelRef.current?.send({ type: 'broadcast', event: 'select_game', payload: { game } })
  }, [])

  const emitStartGame = useCallback((config?: unknown) => {
    channelRef.current?.send({ type: 'broadcast', event: 'start_game', payload: { config } })
  }, [])

  const emitNextRound = useCallback(() => {
    channelRef.current?.send({ type: 'broadcast', event: 'next_round', payload: {} })
  }, [])

  const emitEndGame = useCallback(() => {
    channelRef.current?.send({ type: 'broadcast', event: 'end_game', payload: {} })
  }, [])

  const emitKick = useCallback((targetId: string) => {
    channelRef.current?.send({ type: 'broadcast', event: 'kick_player', payload: { targetId } })
  }, [])

  // join — call this after the channel is connected
  const join = useCallback((opts: JoinOptions) => {
    const ch = channelRef.current
    if (!ch || !connected) { setError('Not connected yet'); return }

    const colorIndex = Math.floor(Math.random() * PLAYER_COLORS.length)
    const color = PLAYER_COLORS[colorIndex]

    ch.track({
      role:   'player',
      id:     playerIdRef.current,
      name:   opts.name,
      avatar: opts.avatar,
      color,
      score:  0,
      isConnected: true,
    })
  }, [connected])

  // ── Channel setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const code = roomCode.toUpperCase()
    // Stable player ID for this session
    const storedId = sessionStorage.getItem(`octoquiz_pid_${code}`)
    const playerId  = storedId ?? `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    sessionStorage.setItem(`octoquiz_pid_${code}`, playerId)
    playerIdRef.current = playerId

    const ch = supabase.channel(channelName(code), {
      config: { presence: { key: playerId }, broadcast: { self: false, ack: false } },
    })
    channelRef.current = ch

    ch
      .on('broadcast', { event: 'room_state' }, ({ payload }: { payload: RoomPublic }) => {
        setRoom(payload)
        const self = payload.players.find(p => p.id === playerId)
        if (self) setMe(self)
      })
      .on('broadcast', { event: 'game_state' }, ({ payload }: { payload: GameState }) => {
        setGameState(payload)
      })
      .on('broadcast', { event: 'player_kicked' }, ({ payload }: { payload: { id: string } }) => {
        if (payload.id === playerId) setKicked(true)
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') setConnected(true)
        if (status === 'CHANNEL_ERROR') setError('Connection failed — check room code')
      })

    return () => {
      ch.unsubscribe()
      channelRef.current = null
    }
  }, [roomCode])

  return {
    room, gameState, me, connected, kicked, error,
    join, sendAction, sendReady,
    emitSelectGame, emitStartGame, emitNextRound, emitEndGame, emitKick,
    playerId: playerIdRef.current,
  }
}
