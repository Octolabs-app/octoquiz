export type RelayMessage =
  | { type: 'status'; status: 'SUBSCRIBED' | 'ERROR' }
  | { type: 'presence'; event: 'join'; key: string; newPresences: Record<string, unknown>[] }
  | { type: 'presence'; event: 'leave'; key: string; leftPresences?: Record<string, unknown>[] }
  | { type: 'broadcast'; event: string; payload: unknown }

export function realtimeUrl(roomCode: string): string {
  const url = new URL(`/realtime/${roomCode.toUpperCase()}`, window.location.href)
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  return url.toString()
}

export function parseRelayMessage(data: unknown): RelayMessage | null {
  if (typeof data !== 'string') return null
  try {
    const parsed = JSON.parse(data) as RelayMessage
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function sendRelay(socket: WebSocket | null, message: unknown): boolean {
  if (!socket || socket.readyState !== WebSocket.OPEN) return false
  socket.send(JSON.stringify(message))
  return true
}
