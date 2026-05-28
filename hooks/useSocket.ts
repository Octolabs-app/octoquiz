'use client'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>

let globalSocket: GameSocket | null = null

export function useSocket() {
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<GameSocket | null>(null)

  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io(window.location.origin, {
        transports: ['websocket'],
        reconnectionAttempts: 5,
      })
    }
    socketRef.current = globalSocket

    const onConnect    = () => setConnected(true)
    const onDisconnect = () => setConnected(false)

    globalSocket.on('connect', onConnect)
    globalSocket.on('disconnect', onDisconnect)
    if (globalSocket.connected) setConnected(true)

    return () => {
      globalSocket?.off('connect', onConnect)
      globalSocket?.off('disconnect', onDisconnect)
    }
  }, [])

  return { socket: socketRef.current, connected }
}
