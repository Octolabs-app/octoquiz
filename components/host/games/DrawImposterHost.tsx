'use client'
import { useEffect, useRef, useState } from 'react'
import type { RoomPublic, DrawImposterState, DrawStroke } from '@/lib/types'
import Scoreboard from '@/components/ui/Scoreboard'

interface Props {
  room: RoomPublic
  state: DrawImposterState
  strokes: DrawStroke[]
  onSkipToVote: () => void
}

// ── The single shared whiteboard everyone draws on ─────────────────────────────
function SharedBoard({ strokes, className, style }: {
  strokes: DrawStroke[]; className?: string; style?: React.CSSProperties
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
    <div className={className} style={{ background: '#0f1628', border: '2px solid rgba(198,168,124,0.25)', borderRadius: 16, ...style }}>
      <canvas ref={ref} className="w-full h-full" style={{ borderRadius: 14 }} />
    </div>
  )
}

export default function DrawImposterHost({ room, state, strokes, onSkipToVote }: Props) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (state.phase !== 'drawing') return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [state.phase])

  const drawer = room.players.find(p => p.id === state.currentDrawer)
  const timeLeft = state.turnStartedAt
    ? Math.max(0, state.turnSeconds - Math.floor((now - state.turnStartedAt) / 1000))
    : state.turnSeconds

  // ── Reveal ──
  if (state.phase === 'reveal') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-8 no-select">
        <div className="text-center animate-bounce-in mb-8">
          <div className="text-8xl mb-4">🎨</div>
          <h1 className="text-6xl font-black mb-3" style={{ color: '#C6A87C' }}>Decoy</h1>
          <p className="text-white/60 text-2xl">Everyone got a secret word on their phone…</p>
        </div>
        <div className="glass rounded-2xl p-6 max-w-2xl text-center" style={{ border: '1px solid rgba(198,168,124,0.2)' }}>
          <p className="text-white/70 text-lg leading-relaxed">
            🖌️ <b>How to play:</b> Players take turns adding <b>ONE line each</b> to <b>one shared whiteboard</b>.
            Everyone is drawing the <b>same word</b> — except the <span style={{ color: '#C6A87C' }}>decoy</span>, who got a different one.
            After {state.totalRounds} rounds of lines, <b>vote out</b> whoever&apos;s lines look off!
          </p>
        </div>
        <div className="text-white/30 text-lg animate-pulse mt-8">✏️ Get ready — first up: {drawer ? `${drawer.avatar} ${drawer.name}` : '…'}</div>
      </div>
    )
  }

  // ── Drawing ──
  if (state.phase === 'drawing') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col p-6 no-select">
        <div className="flex items-center justify-between mb-4 max-w-5xl mx-auto w-full">
          <div>
            <p className="text-white/30 uppercase tracking-widest text-sm">Round {state.round}/{state.totalRounds}</p>
            <h2 className="text-4xl font-black text-white flex items-center gap-3">
              {drawer && <span style={{ color: drawer.color }}>{drawer.avatar} {drawer.name}</span>}
              <span className="text-white/50 text-2xl font-normal">is drawing a line…</span>
            </h2>
          </div>
          <div className="flex items-center gap-5">
            {state.voteCalls.length > 0 && (
              <p className="text-red-400/80 text-sm">🗳️ {state.voteCalls.length}/{room.players.length} want to vote</p>
            )}
            <div className={`text-6xl font-black tabular-nums ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{timeLeft}s</div>
            <button onClick={onSkipToVote}
              className="rounded-2xl px-6 py-4 text-lg font-black transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#C6A87C,#a8894e)', color: '#0B1120' }}>
              Start vote →
            </button>
          </div>
        </div>
        <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col">
          <SharedBoard strokes={strokes} className="flex-1 w-full" />
          <p className="text-center text-white/30 text-sm mt-3">
            🖌️ One line each, one shared board. Everyone draws the same word… except the decoy.
          </p>
        </div>
      </div>
    )
  }

  // ── Voting ──
  if (state.phase === 'voting') {
    const votesIn = Object.keys(state.votes).length
    const tally = (id: string) => Object.values(state.votes).filter(v => v === id).length
    return (
      <div className="min-h-screen bg-night-900 flex flex-col p-6 no-select">
        <div className="text-center mb-4">
          <h2 className="text-5xl font-black text-white">🗳️ Vote out the Decoy!</h2>
          <p className="text-white/40 mt-1">{votesIn}/{room.players.length} votes in — study the board and decide on your phone</p>
        </div>
        <div className="flex-1 max-w-5xl mx-auto w-full flex gap-6">
          <SharedBoard strokes={strokes} className="flex-1" style={{ minHeight: 320 }} />
          <div className="w-64 flex-shrink-0 space-y-2">
            {room.players.map(p => (
              <div key={p.id} className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: tally(p.id) > 0 ? `${p.color}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${tally(p.id) > 0 ? p.color : 'transparent'}` }}>
                <span className="text-xl">{p.avatar}</span>
                <span className="font-bold text-white flex-1 truncate">{p.name}</span>
                {tally(p.id) > 0 && <span className="text-sm font-black" style={{ color: '#C6A87C' }}>{tally(p.id)}</span>}
              </div>
            ))}
          </div>
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
        <div className="flex items-center justify-center gap-8 glass rounded-2xl px-10 py-5 inline-flex">
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
      <div className="mt-8 flex items-start gap-8">
        <SharedBoard strokes={strokes} style={{ width: 360, height: 240 }} />
        <div className="w-72">
          <p className="text-white/40 text-center text-sm mb-3">Scores</p>
          <Scoreboard players={room.players} />
        </div>
      </div>
    </div>
  )
}
