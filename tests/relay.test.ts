import test from 'node:test'
import assert from 'node:assert/strict'
// The relay class can be exercised without a Cloudflare runtime; fetch owns the
// platform-specific WebSocketPair, while onMessage owns protocol validation.
import { RoomObject } from '../worker/index.js'

function fixture() {
  const room = new RoomObject({})
  function socket() {
    const messages: unknown[] = []
    const ws = { send: (data: string) => messages.push(JSON.parse(data)) }
    room.sessions.set(ws, { key: crypto.randomUUID(), presence: null })
    return { ws, messages }
  }
  function send(ws: unknown, data: unknown) {
    room.onMessage(ws, JSON.stringify(data))
  }
  return { room, socket, send }
}
test('relay requires presence, enforces host ownership and prevents identity switching', () => {
  const { room, socket, send } = fixture(),
    host = socket(),
    player = socket(),
    stranger = socket()
  send(stranger.ws, { type: 'broadcast', event: 'room_state', payload: { status: 'results' } })
  assert.equal(host.messages.length, 0)
  send(host.ws, { type: 'presence_track', payload: { role: 'host', hostId: 'h' } })
  send(stranger.ws, { type: 'presence_track', payload: { role: 'host', hostId: 'h2' } })
  assert.equal(room.sessions.get(stranger.ws).presence, null)
  send(player.ws, { type: 'presence_track', payload: { role: 'player', id: 'p', name: 'Alice' } })
  send(stranger.ws, {
    type: 'presence_track',
    payload: { role: 'player', id: 'p', name: 'Impersonator' },
  })
  assert.equal(room.sessions.get(stranger.ws).presence, null)
  send(player.ws, { type: 'presence_track', payload: { role: 'host', hostId: 'p' } })
  assert.equal(room.sessions.get(player.ws).presence.role, 'player')
  host.messages.length = 0
  send(player.ws, { type: 'broadcast', event: 'game_state', payload: { phase: 'finished' } })
  assert.equal(host.messages.length, 0)
  send(player.ws, {
    type: 'broadcast',
    event: 'player_action',
    payload: { playerId: 'other', action: { type: 'flag_answer', answer: 'France' } },
  })
  assert.deepEqual(host.messages.at(-1), {
    type: 'broadcast',
    event: 'player_action',
    payload: { playerId: 'p', action: { type: 'flag_answer', answer: 'France' } },
  })
  room.onClose(player.ws)
  send(stranger.ws, { type: 'presence_track', payload: { role: 'player', id: 'p', name: 'Alice' } })
  assert.equal(room.sessions.get(stranger.ws).presence.id, 'p')
})
test('relay rejects malformed/oversized messages and stamps drawing identities', () => {
  const { room, socket, send } = fixture(),
    host = socket(),
    player = socket()
  send(host.ws, { type: 'presence_track', payload: { role: 'host', hostId: 'h' } })
  for (const name of ['', ' '.repeat(5), 'x'.repeat(21)])
    send(player.ws, { type: 'presence_track', payload: { role: 'player', id: 'p', name } })
  assert.equal(room.sessions.get(player.ws).presence, null)
  send(player.ws, { type: 'presence_track', payload: { role: 'player', id: 'p', name: 'Alice' } })
  host.messages.length = 0
  room.onMessage(player.ws, '{')
  room.onMessage(player.ws, 'x'.repeat(131073))
  room.onMessage(player.ws, new Uint8Array([1]))
  assert.equal(host.messages.length, 0)
  send(player.ws, {
    type: 'broadcast',
    event: 'draw',
    payload: { stroke: { playerId: 'victim', points: [] } },
  })
  assert.equal((host.messages.at(-1) as any).payload.stroke.playerId, 'p')
})
