/**
 * Generate a random 5-letter room code.
 * 24^5 is about 8M combinations. With one Durable Object per code, this keeps
 * accidental overlap very unlikely for a casual party-game room.
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // no 0/O or I/1 ambiguity
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}
