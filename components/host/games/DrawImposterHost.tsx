'use client'
import { useEffect, useRef, useState } from 'react'
import type { RoomPublic, DrawImposterState, DrawStroke } from '@/lib/types'
import Scoreboard from '@/components/ui/Scoreboard'

interface Props {
  room: RoomPublic
  state: DrawImposterState
  drawData: Record<string, DrawStroke[]>
  onSkipToVote: () => void
}

// ── A single player's live canvas ──────────────────────────────────────────────
function PlayerCanvas({ strokes, label, color, accent }: {
  strokes: DrawStroke[]; label: string; color: string; accent?: boolean
}) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const c = ref.current; if (!c) return
    const rect = c.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    if (c.width !== Math.round(rect.width * dpr)) { c.width = Math.round(rect.width * dpr); c.height = Math.round(rect.height * dpr) }
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const s of strokes) {
      if (s.points.length < 2) continue
      ctx.strokeStyle = s.color; ctx.lineWidth = s.width
      ctx.beginPath()
      ctx.moveTo(s.points[0] * rect.width, s.points[1] * rect.height)
      for (let i = 2; i < s.points.length; i += 2) ctx.lineTo(s.points[i] * rect.width, s.points[i + 1] * rect.height)
      ctx.stroke()
    }
  }, [strokes])

  return (
    <div className="flex flex-col">
      <div className="aspect-[4/3] w-full rounded-xl overflow-hidden"
        style={{ background: '#0f1628', border: `2px solid ${accent ? color : 'rgba(198,168,124,0.18)'}` }}>
        <canvas ref={ref} className="w-full h-full" />
      </div>
      <p className="text-center text-xs font-bold mt-1.5 truncate" style={{ color }}>{label}</p>
    </div>
  )
}

export default function DrawImposterHost({ room, state, drawData, onSkipToVote }: Props) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (state.phase !== 'drawing') return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [state.phase])

  const cols = room.players.length <= 2 ? 2 : room.players.length <= 6 ? 3 : 4
  const timeLeft = state.roundStartedAt
    ? Math.max(0, state.drawSeconds - Math.floor((now - state.roundStartedAt) / 1000))
    : state.drawSeconds

  const gallery = (
    <div className="grid gap-3 w-full max-w-5xl mx-auto" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {room.players.map(p => (
        <PlayerCanvas key={p.id} strokes={drawData[p.id] ?? []} label={`${p.avatar} ${p.name}`} color={p.color} />
      ))}
    </div>
  )

  // ── Reveal ──
  if (state.phase === 'reveal') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select">
        <div className="text-center animate-bounce-in mb-10">
          <div className="text-8xl mb-4">🎨</div>
          <h1 className="text-6xl font-black mb-3" style={{ color: '#C6A87C' }}>Decoy</h1>
          <p className="text-white/60 text-2xl">Everyone got a secret word on their phone…</p>
          <p className="text-white/35 text-lg mt-2">…but <span style={{ color: '#C6A87C' }}>one player&apos;s word is different</span>. Draw it over {state.totalRounds} rounds, then vote out the decoy!</p>
        </div>
        <div className="text-white/30 text-lg animate-pulse">✏️ Get your pens ready…</div>
      </div>
    )
  }

  // ── Drawing ──
  if (state.phase === 'drawing') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col p-6 no-select">
        <div className="flex items-center justify-between mb-5 max-w-5xl mx-auto w-full">
          <div>
            <p className="text-white/30 uppercase tracking-widest text-sm">Round {state.round}/{state.totalRounds}</p>
            <h2 className="text-4xl font-black text-white">Draw your word!</h2>
          </div>
          <div className="flex items-center gap-5">
            {state.voteCalls.length > 0 && (
              <p className="text-red-400/80 text-sm">🗳️ {state.voteCalls.length}/{room.players.length} want to vote</p>
            )}
            <div className="text-center">
              <div className={`text-6xl font-black tabular-nums ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
            </div>
            <button onClick={onSkipToVote}
              className="rounded-2xl px-6 py-4 text-lg font-black transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#C6A87C,#a8894e)', color: '#0B1120' }}>
              Start vote →
            </button>
          </div>
        </div>
        {gallery}
      </div>
    )
  }

  // ── Voting ──
  if (state.phase === 'voting') {
    const votesIn = Object.keys(state.votes).length
    const tally = (id: string) => Object.values(state.votes).filter(v => v === id).length
    return (
      <div className="min-h-screen bg-night-900 flex flex-col p-6 no-select">
        <div className="text-center mb-5">
          <h2 className="text-5xl font-black text-white">🗳️ Vote out the Decoy!</h2>
          <p className="text-white/40 mt-1">{votesIn}/{room.players.length} votes in — look at the drawings and decide</p>
        </div>
        <div className="grid gap-3 w-full max-w-5xl mx-auto" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
          {room.players.map(p => (
            <div key={p.id} className="relative">
              <PlayerCanvas strokes={drawData[p.id] ?? []} label={`${p.avatar} ${p.name}`} color={p.color} accent={tally(p.id) > 0} />
              {tally(p.id) > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                  style={{ background: '#C6A87C', color: '#0B1120' }}>{tally(p.id)}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Result / finished ──
  const imposter = room.players.find(p => p.id === state.imposterId)
  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select">
      <div className="text-center animate-bounce-in">
        <div className="text-8xl mb-6">{state.caught ? '🎉' : '😈'}</div>
        <h2 className={`text-6xl font-black mb-4 ${state.caught ? 'text-green-400' : 'text-red-400'}`}>
          {state.caught ? 'Decoy Caught!' : 'Decoy Escapes!'}
        </h2>
        {imposter && (
          <p className="text-3xl text-white mb-4">
            <span style={{ color: imposter.color }}>{imposter.avatar} {imposter.name}</span> was the decoy!
          </p>
        )}
        <div className="flex items-center justify-center gap-8 mt-2 glass rounded-2xl px-10 py-5 inline-flex">
          <div className="text-center">
            <p className="text-white/40 text-sm">Everyone&apos;s word</p>
            <p className="text-3xl font-black text-white">{state.realWord}</p>
          </div>
          <div className="text-4xl text-white/20">vs</div>
          <div className="text-center">
            <p className="text-sm" style={{ color: '#C6A87C' }}>Decoy&apos;s word</p>
            <p className="text-3xl font-black" style={{ color: '#C6A87C' }}>{state.imposterWord}</p>
          </div>
        </div>
      </div>
      <div className="mt-10 w-full max-w-md">
        <p className="text-white/40 text-center text-sm mb-3">Scores</p>
        <Scoreboard players={room.players} />
      </div>
    </div>
  )
}
