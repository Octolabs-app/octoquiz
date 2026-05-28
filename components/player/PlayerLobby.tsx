'use client'
import type { RoomPublic, Player } from '@/lib/types'
import type { Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '@/lib/types'

interface Props {
  room: RoomPublic | null
  me: Player | null
  socket: Socket<ServerToClientEvents, ClientToServerEvents>
}

export default function PlayerLobby({ room, me, socket }: Props) {
  if (!room || !me) {
    return (
      <div className="min-h-screen bg-night-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-pulse">⏳</div>
          <p className="text-white/50">Connecting to room...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center p-6 pt-12">
      {/* My badge */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-4 animate-bounce-in"
        style={{ background: `${me.color}33`, border: `3px solid ${me.color}` }}
      >
        {me.avatar}
      </div>
      <h2 className="text-2xl font-black mb-1" style={{ color: me.color }}>{me.name}</h2>
      <p className="text-white/40 text-sm mb-8">Room <span className="font-bold text-white/60">{room.code}</span></p>

      {/* Waiting */}
      <div className="glass rounded-3xl p-6 w-full text-center mb-8">
        <div className="text-4xl mb-3 animate-pulse">👀</div>
        <p className="text-white/60 font-medium">Waiting for the game to start...</p>
        <p className="text-white/30 text-sm mt-1">Check the TV for updates</p>
      </div>

      {/* All players */}
      <div className="w-full">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
          {room.players.length} player{room.players.length !== 1 ? 's' : ''} in room
        </p>
        <div className="space-y-2">
          {room.players.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 animate-slide-in"
              style={{
                animationDelay: `${i * 60}ms`,
                background: p.id === me.id ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${p.id === me.id ? p.color + '66' : 'transparent'}`,
              }}
            >
              <span className="text-xl">{p.avatar}</span>
              <span className="font-bold" style={{ color: p.color }}>{p.name}</span>
              {p.id === me.id && (
                <span className="ml-auto text-xs glass px-2 py-0.5 rounded-full text-white/40">You</span>
              )}
              {room.gameMasterId === p.id && (
                <span className="ml-auto text-xs text-yellow-400">⭐ GM</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
