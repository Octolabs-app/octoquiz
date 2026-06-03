'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import type { DrawImposterState, Player, RoomPublic, GameAction, DrawStroke } from '@/lib/types'
import { useHaptic } from '@/hooks/useHaptic'

interface Props {
  state: DrawImposterState
  me: Player
  room: RoomPublic
  sendAction: (action: GameAction) => void
  sendDraw: (stroke: DrawStroke) => void
  strokes: DrawStroke[]
}

const PALETTE = ['#E8E6E1', '#C6A87C', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#0B1120']
let strokeSeq = 0

export default function DrawImposterPlayer({ state, me, room, sendAction, sendDraw, strokes }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef    = useRef<CanvasRenderingContext2D | null>(null)
  const drawing   = useRef(false)
  const cur       = useRef<number[]>([])
  const [color, setColor] = useState('#E8E6E1')
  const [width, setWidth] = useState(4)
  const [voted, setVoted] = useState<string | null>(null)
  const [calledVote, setCalledVote] = useState(false)
  const { haptic } = useHaptic()

  const isImposter = state.imposterId === me.id
  const myWord     = isImposter ? state.imposterWord : state.realWord
  const isMyTurn   = state.phase === 'drawing' && state.currentDrawer === me.id
  const drawer     = room.players.find(p => p.id === state.currentDrawer)

  // ── Canvas render of the shared board ────────────────────────────────────────
  const redraw = useCallback(() => {
    const c = canvasRef.current, ctx = ctxRef.current
    if (!c || !ctx) return
    const rect = c.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)
    for (const s of strokes) {
      if (s.points.length < 2) continue
      ctx.strokeStyle = s.color; ctx.lineWidth = s.width
      ctx.beginPath()
      ctx.moveTo(s.points[0] * rect.width, s.points[1] * rect.height)
      for (let i = 2; i < s.points.length; i += 2) ctx.lineTo(s.points[i] * rect.width, s.points[i + 1] * rect.height)
      ctx.stroke()
    }
  }, [strokes])

  const fitCanvas = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    const rect = c.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = Math.round(rect.width * dpr); c.height = Math.round(rect.height * dpr)
    const ctx = c.getContext('2d')!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctxRef.current = ctx
    redraw()
  }, [redraw])

  useEffect(() => {
    if (state.phase !== 'drawing') return
    fitCanvas()
    window.addEventListener('resize', fitCanvas)
    return () => window.removeEventListener('resize', fitCanvas)
  }, [fitCanvas, state.phase])

  useEffect(() => { redraw() }, [strokes, redraw])

  // ── Pointer drawing (only on your turn) ──────────────────────────────────────
  function norm(e: React.PointerEvent) {
    const c = canvasRef.current!; const rect = c.getBoundingClientRect()
    return [(e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height]
  }
  function onDown(e: React.PointerEvent) {
    if (!isMyTurn) return
    e.preventDefault(); drawing.current = true; cur.current = norm(e)
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  function onMove(e: React.PointerEvent) {
    if (!drawing.current || !isMyTurn) return
    const [x, y] = norm(e); const last = cur.current; cur.current = [...last, x, y]
    const ctx = ctxRef.current, c = canvasRef.current
    if (ctx && c) {
      const rect = c.getBoundingClientRect()
      ctx.strokeStyle = color; ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(last[last.length - 2] * rect.width, last[last.length - 1] * rect.height)
      ctx.lineTo(x * rect.width, y * rect.height)
      ctx.stroke()
    }
  }
  function onUp() {
    if (!drawing.current) return
    drawing.current = false
    if (cur.current.length >= 4 && isMyTurn) {
      sendDraw({ id: `${me.id}-${strokeSeq++}`, playerId: me.id, round: state.round, color, width, points: cur.current })
    }
    cur.current = []
  }

  function callVote() {
    if (calledVote) return
    setCalledVote(true); haptic(40); sendAction({ type: 'call_vote' })
  }
  function vote(targetId: string) {
    if (voted || targetId === me.id) return
    setVoted(targetId); haptic(50); sendAction({ type: 'drawimposter_vote', targetId })
  }

  // ── Reveal ──
  if (state.phase === 'reveal') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
        <div className="text-center animate-bounce-in w-full max-w-xs">
          <div className="text-5xl mb-3">🎨</div>
          <p className="text-white/40 text-sm uppercase tracking-widest mb-5">Your secret word</p>
          <div className="rounded-3xl p-8 mb-5 w-full border-2" style={{ background: '#C6A87C1a', borderColor: '#C6A87C' }}>
            <p className="text-4xl font-black" style={{ color: '#C6A87C' }}>{myWord}</p>
          </div>
          <div className="glass rounded-2xl p-4 text-sm text-white/55 leading-relaxed text-left">
            🖌️ You&apos;ll take <b>turns</b> drawing this on <b>one shared whiteboard</b> (watch the TV).
            Everyone has the same word… but <b>one player&apos;s is different</b>. Draw carefully — then vote out the odd one!
          </div>
        </div>
      </div>
    )
  }

  // ── Drawing ──
  if (state.phase === 'drawing') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col p-3 select-none">
        <div className="flex items-center justify-between mb-2 px-1">
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">Round {state.round}/{state.totalRounds} · your word</p>
            <p className="text-lg font-black" style={{ color: '#C6A87C' }}>{myWord}</p>
          </div>
          <button onClick={callVote} disabled={calledVote}
            className="rounded-xl px-3 py-2 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)', color: '#f87171' }}>
            {calledVote ? '✓ Vote called' : '🗳️ Call vote'}
          </button>
        </div>

        <div className="mb-2 px-1">
          {isMyTurn ? (
            <p className="text-sm font-bold text-green-400">✏️ Your turn — draw on the shared board!</p>
          ) : (
            <p className="text-sm text-white/50">👀 {drawer ? `${drawer.avatar} ${drawer.name}` : 'Someone'} is drawing… watch the board</p>
          )}
        </div>

        <canvas ref={canvasRef}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}
          className="flex-1 w-full rounded-2xl touch-none"
          style={{ background: '#0f1628', border: `1px solid ${isMyTurn ? '#22c55e' : 'rgba(198,168,124,0.2)'}`, opacity: isMyTurn ? 1 : 0.95 }} />

        {/* Tools — only while it's your turn */}
        {isMyTurn ? (
          <div className="flex items-center gap-2 mt-2 px-1">
            <div className="flex gap-1.5 flex-1 overflow-x-auto">
              {PALETTE.map(c => (
                <button key={c} onClick={() => setColor(c)} className="w-7 h-7 rounded-full flex-shrink-0 transition-transform"
                  style={{ background: c, border: color === c ? '2px solid #fff' : '2px solid rgba(255,255,255,0.2)', transform: color === c ? 'scale(1.18)' : 'scale(1)' }} />
              ))}
            </div>
            <button onClick={() => setWidth(width === 4 ? 10 : width === 10 ? 18 : 4)}
              className="rounded-lg px-2 py-1 text-xs text-white/60" style={{ background: 'rgba(255,255,255,0.06)' }}>
              ●{width === 4 ? 'S' : width === 10 ? 'M' : 'L'}
            </button>
          </div>
        ) : (
          <p className="text-center text-white/25 text-[10px] mt-2">Everyone shares one whiteboard — your turn comes around each round.</p>
        )}
      </div>
    )
  }

  // ── Voting ──
  if (state.phase === 'voting') {
    return (
      <div className="min-h-screen bg-night-900 flex flex-col p-4 pt-8">
        <div className="text-center mb-6 animate-bounce-in">
          <div className="text-4xl mb-2">🗳️</div>
          <h2 className="text-2xl font-black text-white">Who&apos;s the Decoy?</h2>
          <p className="text-white/40 text-sm">Vote for the odd drawing (see the TV)</p>
        </div>
        {voted ? (
          <div className="glass rounded-2xl p-6 text-center animate-bounce-in">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white/60 font-medium">Vote submitted!</p>
            <p className="text-white/40 text-sm mt-1">Watch the TV…</p>
          </div>
        ) : (
          <div className="space-y-3">
            {room.players.filter(p => p.id !== me.id).map(p => (
              <button key={p.id} onClick={() => vote(p.id)}
                className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 transition-all active:scale-[0.97]"
                style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.1)' }}>
                <span className="text-2xl">{p.avatar}</span>
                <span className="font-bold text-white flex-1 text-left">{p.name}</span>
                <span className="text-xl">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Result / finished ──
  return (
    <div className="min-h-screen bg-night-900 flex flex-col items-center justify-center p-6">
      <div className="text-center animate-bounce-in">
        <div className="text-5xl mb-3">📺</div>
        <h2 className="text-2xl font-black text-white mb-2">Check the TV!</h2>
        <p className="text-white/40 text-sm">See who the decoy was</p>
        <p className="text-white/60 text-xl font-bold mt-4">{me.score.toLocaleString()} pts</p>
      </div>
    </div>
  )
}
