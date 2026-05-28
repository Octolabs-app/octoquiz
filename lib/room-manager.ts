import type { Room, Player, GameType, GameState } from '@/lib/types'
import { PLAYER_COLORS, PLAYER_EMOJIS } from '@/lib/types'

const rooms = new Map<string, Room>()

function generateCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // skip ambiguous I/O
  let code: string
  do {
    code = Array.from({ length: 4 }, () =>
      letters[Math.floor(Math.random() * letters.length)]
    ).join('')
  } while (rooms.has(code))
  return code
}

export function createRoom(hostId: string): Room {
  const code = generateCode()
  const room: Room = {
    code,
    hostId,
    gameMasterId: null,
    players: [],
    status: 'lobby',
    currentGame: null,
    gameState: null,
    createdAt: Date.now(),
  }
  rooms.set(code, room)
  return room
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code.toUpperCase())
}

export function deleteRoom(code: string): void {
  rooms.delete(code)
}

export function addPlayer(code: string, player: Omit<Player, 'color' | 'avatar' | 'score' | 'isReady' | 'isConnected'>): Player | null {
  const room = rooms.get(code)
  if (!room) return null

  const colorIndex = room.players.length % PLAYER_COLORS.length
  const avatarIndex = room.players.length % PLAYER_EMOJIS.length

  const newPlayer: Player = {
    ...player,
    color: PLAYER_COLORS[colorIndex],
    avatar: PLAYER_EMOJIS[avatarIndex],
    score: 0,
    isReady: false,
    isConnected: true,
  }

  room.players.push(newPlayer)

  if (!room.gameMasterId) {
    room.gameMasterId = newPlayer.id
  }

  rooms.set(code, room)
  return newPlayer
}

export function removePlayer(socketId: string): { room: Room; player: Player } | null {
  for (const [code, room] of rooms.entries()) {
    const idx = room.players.findIndex((p: Player) => p.id === socketId)
    if (idx === -1) continue

    const player = room.players[idx]
    room.players.splice(idx, 1)

    if (room.gameMasterId === socketId) {
      room.gameMasterId = room.players[0]?.id ?? null
    }

    if (room.players.length === 0 && socketId !== room.hostId) {
      // keep room alive if host is still there
    }

    rooms.set(code, room)
    return { room, player }
  }
  return null
}

export function findRoomBySocket(socketId: string): Room | null {
  for (const room of rooms.values()) {
    if (room.hostId === socketId) return room
    if (room.players.some((p: Player) => p.id === socketId)) return room
  }
  return null
}

export function setGameState(code: string, state: GameState | null): void {
  const room = rooms.get(code)
  if (room) { room.gameState = state; rooms.set(code, room) }
}

export function setRoomStatus(code: string, status: Room['status']): void {
  const room = rooms.get(code)
  if (room) { room.status = status; rooms.set(code, room) }
}

export function setCurrentGame(code: string, game: GameType | null): void {
  const room = rooms.get(code)
  if (room) { room.currentGame = game; rooms.set(code, room) }
}

export function addPoints(code: string, points: Record<string, number>): void {
  const room = rooms.get(code)
  if (!room) return
  for (const player of room.players) {
    if (points[player.id]) player.score += points[player.id]
  }
  rooms.set(code, room)
}

export function resetScores(code: string): void {
  const room = rooms.get(code)
  if (!room) return
  room.players.forEach(p => { p.score = 0 })
  rooms.set(code, room)
}

export function markPlayerReady(code: string, playerId: string, ready: boolean): void {
  const room = rooms.get(code)
  if (!room) return
  const p = room.players.find(p => p.id === playerId)
  if (p) p.isReady = ready
  rooms.set(code, room)
}

export function reconnectPlayer(code: string, playerId: string): void {
  const room = rooms.get(code)
  if (!room) return
  const p = room.players.find(p => p.id === playerId)
  if (p) p.isConnected = true
  rooms.set(code, room)
}

// Cleanup stale rooms older than 4 hours
setInterval(() => {
  const cutoff = Date.now() - 4 * 60 * 60 * 1000
  for (const [code, room] of rooms.entries()) {
    if (room.createdAt < cutoff) rooms.delete(code)
  }
}, 30 * 60 * 1000)
