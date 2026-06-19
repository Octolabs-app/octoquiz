function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers ?? {}),
    },
  })
}

function roomFromPath(pathname) {
  const [, prefix, code] = pathname.split('/')
  if (prefix !== 'realtime' || !code) return null
  const normalized = code.toUpperCase()
  return /^[A-Z]{4,8}$/.test(normalized) ? normalized : null
}

function safeParse(data) {
  if (typeof data !== 'string') return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export class RoomObject {
  constructor(ctx) {
    this.ctx = ctx
    this.sessions = new Map()
  }

  async fetch(request) {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return json({ error: 'websocket_required' }, { status: 426 })
    }

    const pair = new WebSocketPair()
    const [client, server] = Object.values(pair)
    const session = { key: crypto.randomUUID(), presence: null }

    server.accept()
    this.sessions.set(server, session)
    this.send(server, { type: 'status', status: 'SUBSCRIBED' })

    server.addEventListener('message', (event) => this.onMessage(server, event.data))
    server.addEventListener('close', () => this.onClose(server))
    server.addEventListener('error', () => this.onClose(server))

    return new Response(null, { status: 101, webSocket: client })
  }

  onMessage(socket, data) {
    const msg = safeParse(data)
    if (!msg || typeof msg !== 'object') return

    const session = this.sessions.get(socket)
    if (!session) return

    if (msg.type === 'presence_track' && msg.payload && typeof msg.payload === 'object') {
      const payload = msg.payload
      const key = typeof payload.id === 'string'
        ? payload.id
        : typeof payload.hostId === 'string'
          ? payload.hostId
          : session.key

      session.key = key
      session.presence = payload
      const existingPresences = []
      for (const [otherSocket, otherSession] of this.sessions.entries()) {
        if (otherSocket !== socket && otherSession.presence) {
          existingPresences.push(otherSession.presence)
        }
      }
      if (existingPresences.length > 0) {
        this.send(socket, {
          type: 'presence',
          event: 'join',
          key: 'sync',
          newPresences: existingPresences,
        })
      }
      this.broadcast({ type: 'presence', event: 'join', key, newPresences: [payload] }, socket)
      return
    }

    if (msg.type !== 'broadcast' || typeof msg.event !== 'string') return

    const payload = msg.payload && typeof msg.payload === 'object'
      ? { ...msg.payload }
      : msg.payload

    // The client UI still sends playerId for compatibility. The relay stamps
    // sender-owned events with the tracked presence id so one player cannot
    // spoof another player's answer/vote through a crafted payload.
    if (
      session.presence?.role === 'player' &&
      payload &&
      typeof payload === 'object' &&
      ['player_action', 'player_ready'].includes(msg.event)
    ) {
      payload.playerId = session.presence.id
    }

    if (
      session.presence?.role === 'player' &&
      msg.event === 'draw' &&
      payload?.stroke &&
      typeof payload.stroke === 'object'
    ) {
      payload.stroke = { ...payload.stroke, playerId: session.presence.id }
    }

    this.broadcast({ type: 'broadcast', event: msg.event, payload }, socket)
  }

  onClose(socket) {
    const session = this.sessions.get(socket)
    this.sessions.delete(socket)

    if (session?.presence) {
      this.broadcast({
        type: 'presence',
        event: 'leave',
        key: session.key,
        leftPresences: [session.presence],
      }, socket)
    }
  }

  broadcast(message, except) {
    const data = JSON.stringify(message)
    for (const socket of this.sessions.keys()) {
      if (socket === except) continue
      this.send(socket, data)
    }
  }

  send(socket, message) {
    try {
      socket.send(typeof message === 'string' ? message : JSON.stringify(message))
    } catch {
      this.onClose(socket)
    }
  }
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/healthz') {
      return new Response('ok', {
        headers: {
          'cache-control': 'no-store',
          'content-type': 'text/plain; charset=utf-8',
        },
      })
    }

    const roomCode = roomFromPath(url.pathname)
    if (roomCode) {
      const roomId = env.ROOMS.idFromName(roomCode)
      return env.ROOMS.get(roomId).fetch(request)
    }

    return env.ASSETS.fetch(request)
  },
}

export default worker
