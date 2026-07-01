'use client'
/**
 * useGamePlayer — connects a player to an OctoQuiz room through the
 * Cloudflare Durable Object room relay.
 */
import { useEffect, useRef, useState, useCallback } from 'react'
import { realtimeUrl, parseRelayMessage, sendRelay } from '@/lib/realtime'
import { PLAYER_COLORS } from '@/lib/types'
import type { RoomPublic, GameState, GameAction, DrawStroke } from '@/lib/types'

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
  // Shared Decoy whiteboard strokes (everyone sees the same board)
  const [drawStrokes, setDrawStrokes] = useState<DrawStroke[]>([])

  const channelRef = useRef<WebSocket | null>(null)
  const playerIdRef = useRef<string>('')

  const sendAction = useCallback((action: GameAction) => {
    sendRelay(channelRef.current, {
      type: 'broadcast',
      event: 'player_action',
      payload: { playerId: playerIdRef.current, action },
    })
  }, [])

  // Broadcast a stroke to the shared whiteboard (host + all players render it)
  const sendDraw = useCallback((stroke: DrawStroke) => {
    setDrawStrokes(prev => [...prev, stroke])   // render my own immediately (self:false)
    sendRelay(channelRef.current, { type: 'broadcast', event: 'draw', payload: { stroke } })
  }, [])

  const sendReady = useCallback(() => {
    sendRelay(channelRef.current, {
      type: 'broadcast',
      event: 'player_ready',
      payload: { playerId: playerIdRef.current },
    })
  }, [])

  // join — call this after the channel is connected
  const join = useCallback((opts: JoinOptions) => {
    const ch = channelRef.current
    if (!ch || !connected) { setError('Not connected yet'); return }

    const colorIndex = Math.floor(Math.random() * PLAYER_COLORS.length)
    const color = PLAYER_COLORS[colorIndex]

    sendRelay(ch, {
      type: 'presence_track',
      payload: {
        role:   'player',
        id:     playerIdRef.current,
        name:   opts.name,
        avatar: opts.avatar,
        color,
        score:  0,
        isConnected: true,
      },
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

    const socket = new WebSocket(realtimeUrl(code))
    channelRef.current = socket

    socket.addEventListener('open', () => {
      setConnected(true)
      setError(null)
    })

    socket.addEventListener('message', event => {
      const msg = parseRelayMessage(event.data)
      if (!msg || msg.type !== 'broadcast') return

      if (msg.event === 'room_state') {
        const payload = msg.payload as RoomPublic
        setRoom(payload)
        const self = payload.players.find(p => p.id === playerId)
        if (self) setMe(self)
      } else if (msg.event === 'game_state') {
        setGameState(msg.payload as GameState)
      } else if (msg.event === 'player_kicked') {
        const payload = msg.payload as { id?: string }
        if (payload.id === playerId) setKicked(true)
      } else if (msg.event === 'draw') {
        const payload = msg.payload as { stroke?: DrawStroke }
        if (payload.stroke) setDrawStrokes(prev => [...prev, payload.stroke!])
      } else if (msg.event === 'draw_reset') {
        setDrawStrokes([])
      }
    })

    socket.addEventListener('close', () => setConnected(false))
    socket.addEventListener('error', () => {
      setConnected(false)
      setError('Connection failed — check room code')
    })

    return () => {
      socket.close()
      channelRef.current = null
    }
  }, [roomCode])

  return {
    room, gameState, me, connected, kicked, error,
    join, sendAction, sendReady, sendDraw, drawStrokes,
    playerId: playerIdRef.current,
  }
}
