'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import {
  HOT, NHI, POSITIONS, QUIZ, TOD, WHEEL,
  type Intensity, type PositionCard,
} from '@/data/after-dark'
import { WYR_CARDS, RIDDLE_CARDS, SPIN_CONSEQUENCES } from '@/data/after-dark-extra'
import { useSound } from '@/hooks/useSound'

// Detect whether we're running inside the Capacitor APK (vs. plain web).
// Used to hide the "← Back" link (which would send users to the broken
// multiplayer landing) and to use native back-button / exit behaviour.
function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(globalThis as any).Capacitor?.isNativePlatform?.()
}

// Sip milestones — celebrated when crossed (combined p1+p2 sips)
const SIP_MILESTONES: { at: number; label: string; emoji: string }[] = [
  { at: 5,  label: 'Lightweight',     emoji: '🍷' },
  { at: 10, label: 'Tipsy',           emoji: '🍸' },
  { at: 20, label: 'Buzzed',          emoji: '🥂' },
  { at: 35, label: 'Wasted',          emoji: '🍾' },
  { at: 50, label: 'Legend',          emoji: '👑' },
  { at: 75, label: 'Hall of Fame',    emoji: '🏆' },
]

type Mode = 'tod' | 'nhi' | 'quiz' | 'hot' | 'pos' | 'wheel' | 'wyr' | 'riddles' | 'spin'

const MODES: { id: Mode; label: string; sub: string; tone: string; emoji: string }[] = [
  { id: 'tod',     label: 'Truth or Dare',    sub: 'Vérité ou défi',          tone: 'from-[var(--ad-primary)] to-[var(--ad-blush)]',  emoji: '🎲' },
  { id: 'wheel',   label: 'Wheel',            sub: 'Roue du désir',           tone: 'from-[var(--ad-ember)] to-[var(--ad-gold)]',     emoji: '🎰' },
  { id: 'wyr',     label: 'Would You Rather', sub: 'Tu préfères',             tone: 'from-[var(--ad-blush)] to-[var(--ad-violet)]',   emoji: '🤔' },
  { id: 'spin',    label: 'Spin Bottle',      sub: 'Tourne la bouteille',     tone: 'from-[var(--ad-primary)] to-[var(--ad-ember)]',  emoji: '🍾' },
  { id: 'riddles', label: 'Dirty Minds',      sub: 'Devinettes coquines',     tone: 'from-[var(--ad-ember)] to-[var(--ad-violet)]',   emoji: '🧩' },
  { id: 'pos',     label: 'Positions',        sub: 'Kama Sutra',              tone: 'from-[var(--ad-violet)] to-[var(--ad-primary)]', emoji: '🌹' },
  { id: 'nhi',     label: 'Never Have I…',    sub: 'Je n\'ai jamais',         tone: 'from-[var(--ad-violet)] to-[var(--ad-blush)]',   emoji: '🙈' },
  { id: 'quiz',    label: 'Couple Quiz',      sub: 'Qui connaît le mieux',    tone: 'from-[var(--ad-gold)] to-[var(--ad-ember)]',     emoji: '💬' },
  { id: 'hot',     label: 'Hot Seat',         sub: 'Siège brûlant',           tone: 'from-[var(--ad-ember)] to-[var(--ad-primary)]',  emoji: '🔥' },
]

const LEVELS: { id: Intensity; label: string; emoji: string }[] = [
  { id: 'mild',    label: 'Sweet',   emoji: '🍬' },
  { id: 'spicy',   label: 'Spicy',   emoji: '🌶️' },
  { id: 'inferno', label: 'Inferno', emoji: '🔥' },
]

function levelsUpTo(lvl: Intensity): Intensity[] {
  if (lvl === 'mild')  return ['mild']
  if (lvl === 'spicy') return ['mild', 'spicy']
  return ['mild', 'spicy', 'inferno']
}

function pickRandom<T>(pool: T[], played: Set<number>) {
  const available = pool.map((_, i) => i).filter(i => !played.has(i))
  if (available.length === 0) {
    const idx = Math.floor(Math.random() * pool.length)
    return { item: pool[idx], idx, reset: true }
  }
  const idx = available[Math.floor(Math.random() * available.length)]
  return { item: pool[idx], idx, reset: false }
}

// ─── Root ─────────────────────────────────────
export default function CouplesPage() {
  const [ageConfirmed, setAgeConfirmed] = useState(() => {
    if (typeof window === 'undefined') return false
    // localStorage so APK users don't re-confirm on every launch;
    // sessionStorage was tab-only, lost when phone backgrounded the app.
    return localStorage.getItem('ad_age_ok') === '1'
  })
  if (!ageConfirmed) {
    return (
      <AgeGate onConfirm={() => {
        localStorage.setItem('ad_age_ok', '1')
        setAgeConfirmed(true)
      }} />
    )
  }
  return <GameView />
}

// ─── Age Gate ─────────────────────────────────
function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="after-dark min-h-screen flex flex-col items-center justify-center p-6 relative">
      <AmbientBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.35, duration: 0.7 }}
        className="w-full max-w-sm text-center"
      >
        <motion.div
          animate={{ rotate: [-4, 4, -4], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-6 inline-block"
        >🔞</motion.div>
        <h1 className="text-3xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif",
            background: 'linear-gradient(135deg, oklch(0.62 0.24 18), oklch(0.72 0.18 350))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          After Dark
        </h1>
        <p className="text-sm mb-2" style={{ color: 'var(--ad-muted)' }}>This game contains adult content.</p>
        <p className="text-base font-semibold mb-8" style={{ color: 'var(--ad-fg)' }}>
          You must be <span style={{ color: 'oklch(0.72 0.18 350)' }}>18 or older</span> to continue.
        </p>
        <div className="space-y-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            onClick={onConfirm}
            className="w-full rounded-2xl py-4 text-base font-bold text-white"
            style={{ background: 'linear-gradient(135deg, oklch(0.62 0.24 18), oklch(0.72 0.18 350) 60%, oklch(0.55 0.18 320))',
              boxShadow: '0 20px 60px -20px oklch(0.62 0.24 18 / 0.5)' }}>
            Yes, I'm 18+ — Enter
          </motion.button>
          {isNativeApp() ? (
            <button
              onClick={() => {
                // In Capacitor: try to exit the app cleanly.
                try {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const cap = (globalThis as any).Capacitor
                  if (cap?.Plugins?.App?.exitApp) {
                    cap.Plugins.App.exitApp()
                    return
                  }
                } catch { /* fall through */ }
                window.close()
              }}
              className="block w-full rounded-2xl py-4 text-base text-center transition-all active:scale-95"
              style={{ border: '1px solid var(--ad-border)', color: 'var(--ad-muted)' }}
            >
              No, close the app
            </button>
          ) : (
            <Link href="/" className="block w-full rounded-2xl py-4 text-base text-center transition-all active:scale-95"
              style={{ border: '1px solid var(--ad-border)', color: 'var(--ad-muted)' }}>
              No, take me back
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ─── Ambient Background ───────────────────────
function AmbientBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      dur: 5 + Math.random() * 9,
      delay: Math.random() * 6,
      color: i % 3 === 0 ? 'oklch(0.62 0.24 18 / 0.6)' : i % 3 === 1 ? 'oklch(0.78 0.13 80 / 0.5)' : 'oklch(0.55 0.18 320 / 0.5)',
    })), [])
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl" style={{ background: 'oklch(0.62 0.24 18 / 0.2)' }} />
      <div className="absolute top-1/2 -right-40 h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ background: 'oklch(0.55 0.18 320 / 0.2)' }} />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl" style={{ background: 'oklch(0.68 0.2 40 / 0.15)' }} />
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color }}
          animate={{ y: [0, -28, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Main Game View ────────────────────────────
function GameView() {
  // ── Nav & heat ──
  const [mode, setMode]           = useState<Mode>('tod')
  const [intensity, setIntensity] = useState<Intensity>(() => {
    if (typeof window === 'undefined') return 'spicy'
    const saved = localStorage.getItem('ad_intensity') as Intensity | null
    return saved && (saved === 'mild' || saved === 'spicy' || saved === 'inferno') ? saved : 'spicy'
  })
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('ad_intensity', intensity)
  }, [intensity])

  // ── Score ──
  const [p1, setP1] = useState(0)
  const [p2, setP2] = useState(0)
  const [turn, setTurn] = useState<1 | 2>(1)

  // ── Player names (drunk-friendly: rename "You/Them") ──
  const [p1Name, setP1Name] = useState<string>(() => {
    if (typeof window === 'undefined') return 'You'
    return localStorage.getItem('ad_p1') || 'You'
  })
  const [p2Name, setP2Name] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Them'
    return localStorage.getItem('ad_p2') || 'Them'
  })
  const [editingNames, setEditingNames] = useState(false)

  // ── Combo streak ──
  const [combo, setCombo] = useState(0)
  const [lastMilestone, setLastMilestone] = useState(0)

  // ── UI helpers ──
  const [toast, setToastMsg]  = useState<string | null>(null)
  const [sparks, setSparks]   = useState<{ id: number; x: number; y: number }[]>([])
  const sparkId               = useRef(0)
  const [played, setPlayed]   = useState<Record<string, Set<number>>>({})
  const [cardKey, setCardKey] = useState(0)
  const { play: playSfx }     = useSound()

  // ── Classic cards ──
  const [tod,  setTod]  = useState<typeof TOD[number]  | null>(null)
  const [nhi,  setNhi]  = useState<typeof NHI[number]  | null>(null)
  const [quiz, setQuiz] = useState<typeof QUIZ[number] | null>(null)
  const [hot,  setHot]  = useState<typeof HOT[number]  | null>(null)
  const [pos,  setPos]  = useState<PositionCard | null>(null)
  const [wheel, setWheel] = useState<{ action:string; part:string; dur:string; actionEn:string; partEn:string; durEn:string } | null>(null)
  const [spinning,   setSpinning]   = useState(false)
  const [revealQuiz, setRevealQuiz] = useState(false)
  const [todFilter,  setTodFilter]  = useState<'all'|'truth'|'dare'>('all')

  // ── Would You Rather ──
  const [wyrCard,  setWyrCard]  = useState<typeof WYR_CARDS[number] | null>(null)
  const [wyrPhase, setWyrPhase] = useState<'idle'|'p1pick'|'transit'|'p2pick'|'reveal'>('idle')
  const [wyrP1,    setWyrP1]    = useState<'a'|'b'|null>(null)
  const [wyrP2,    setWyrP2]    = useState<'a'|'b'|null>(null)

  // ── Dirty Minds ──
  const [riddle,         setRiddle]         = useState<typeof RIDDLE_CARDS[number] | null>(null)
  const [riddleRevealed, setRiddleRevealed] = useState(false)
  const [riddleTimer,    setRiddleTimer]    = useState(30)
  const [riddleActive,   setRiddleActive]   = useState(false)

  // ── Spin the Bottle ──
  const [spinPhase,      setSpinPhase]      = useState<'setup'|'spinning'|'result'>('setup')
  const [spinPlayers,    setSpinPlayers]    = useState(['Player 1', 'Player 2'])
  const [spinNameInput,  setSpinNameInput]  = useState('')
  const [bottleAngle,    setBottleAngle]    = useState(0)
  const [bottleSpinning, setBottleSpinning] = useState(false)
  const [spinTarget,     setSpinTarget]     = useState<number | null>(null)
  const [spinCard,       setSpinCard]       = useState<typeof SPIN_CONSEQUENCES[number] | null>(null)

  // ── Position Hold Timer ──
  const [posTimer,   setPosTimer]   = useState(0)
  const [posTimerOn, setPosTimerOn] = useState(false)
  const [posMaxTimer, setPosMaxTimer] = useState(300)

  // ── Riddle timer ──
  useEffect(() => {
    if (!riddleActive || riddleRevealed) return
    if (riddleTimer <= 0) { setRiddleRevealed(true); setRiddleActive(false); return }
    const id = setTimeout(() => setRiddleTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [riddleActive, riddleRevealed, riddleTimer])

  // ── Position hold timer ──
  useEffect(() => {
    if (!posTimerOn || posTimer <= 0) return
    const id = setTimeout(() => setPosTimer(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [posTimerOn, posTimer])
  useEffect(() => {
    if (posTimerOn && posTimer === 0) { setPosTimerOn(false); haptic(80); showToast('🏆 Position complete! Rate it below.') }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posTimer, posTimerOn])

  // ── Helpers ──
  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2200)
  }
  function haptic(ms: number | number[] = 12) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms)
  }
  function burstSparks() {
    const arr = Array.from({ length: 14 }, () => ({
      id: sparkId.current++,
      x: (Math.random() - 0.5) * 320,
      y: (Math.random() - 0.5) * 240,
    }))
    setSparks(arr)
    setTimeout(() => setSparks([]), 900)
  }
  function filtered<T extends { level: Intensity }>(pool: T[], extra?: (i: T) => boolean) {
    const ok = new Set(levelsUpTo(intensity))
    return pool.filter(i => ok.has(i.level) && (extra ? extra(i) : true))
  }
  function filteredNew<T extends { intensity: Intensity }>(pool: T[]) {
    const ok = new Set(levelsUpTo(intensity))
    return pool.filter(i => ok.has(i.intensity))
  }
  function poolKey(m: string) { return `${m}-${intensity}` }
  function addSip(player: 0|1|2, amount: number) {
    haptic(20)
    playSfx('points')
    if (player === 1 || player === 0) setP1(v => v + amount)
    if (player === 2 || player === 0) setP2(v => v + amount)
    const who = player === 0 ? 'both' : (player === 1 ? p1Name : p2Name)
    showToast(`🥃 +${amount} ${who}`)
  }

  // Watch total sips & celebrate when crossing a milestone
  useEffect(() => {
    const total = p1 + p2
    const hit = SIP_MILESTONES.filter(m => m.at <= total && m.at > lastMilestone).pop()
    if (hit) {
      setLastMilestone(hit.at)
      playSfx('start')
      haptic([20, 60, 20])
      burstSparks()
      showToast(`${hit.emoji} ${hit.label}! ${hit.at} sips!`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p1, p2])

  // Persist player names
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('ad_p1', p1Name)
    localStorage.setItem('ad_p2', p2Name)
  }, [p1Name, p2Name])

  function cheers() {
    haptic([10, 40, 10, 40, 20])
    playSfx('start')
    playSfx('points')
    setP1(v => v + 1); setP2(v => v + 1)
    burstSparks()
    showToast('🍻 Cheers! Both drink!')
  }

  function surpriseMe() {
    haptic(15)
    playSfx('whoosh')
    const others = MODES.filter(m => m.id !== mode)
    const next = others[Math.floor(Math.random() * others.length)]
    setMode(next.id)
    // tiny delay to let mode mount, then auto-draw
    setTimeout(() => {
      if (next.id === 'tod' || next.id === 'nhi' || next.id === 'quiz' || next.id === 'hot' || next.id === 'pos') {
        draw(next.id)
      } else if (next.id === 'wheel') {
        spinWheel()
      } else if (next.id === 'wyr') {
        drawWYR()
      } else if (next.id === 'riddles') {
        drawRiddle()
      }
    }, 280)
    showToast(`🎲 ${next.emoji} ${next.label}!`)
  }

  function draw(m: Mode) {
    haptic(15)
    playSfx('draw')
    setCombo(c => c + 1)
    const key = poolKey(m + (m === 'tod' ? `-${todFilter}` : ''))
    const seen = played[key] ?? new Set<number>()
    const markPlayed = (idx: number, reset: boolean) => {
      setPlayed(prev => ({ ...prev, [key]: reset ? new Set([idx]) : new Set(seen).add(idx) }))
    }
    if (m === 'tod') {
      const pool = filtered(TOD, i => todFilter === 'all' ? true : i.t === todFilter)
      const { item, idx, reset } = pickRandom(pool, seen)
      markPlayed(idx, reset); setTod(item)
      if (reset) showToast('🔄 Deck reshuffled')
      setTurn(t => t === 1 ? 2 : 1)
    } else if (m === 'nhi') {
      const pool = filtered(NHI)
      const { item, idx, reset } = pickRandom(pool, seen)
      markPlayed(idx, reset); setNhi(item)
      if (reset) showToast('🔄 Deck reshuffled')
    } else if (m === 'quiz') {
      const pool = filtered(QUIZ)
      const { item, idx, reset } = pickRandom(pool, seen)
      markPlayed(idx, reset); setQuiz(item); setRevealQuiz(false)
      if (reset) showToast('🔄 Deck reshuffled')
    } else if (m === 'hot') {
      const pool = filtered(HOT)
      const { item, idx, reset } = pickRandom(pool, seen)
      markPlayed(idx, reset); setHot(item)
      if (reset) showToast('🔄 Deck reshuffled')
      setTurn(t => t === 1 ? 2 : 1)
    } else if (m === 'pos') {
      const pool = filtered(POSITIONS)
      if (!pool.length) { showToast('No positions at this level — turn up the heat 🔥'); return }
      const { item, idx, reset } = pickRandom(pool, seen)
      markPlayed(idx, reset); setPos(item)
      // reset hold timer on new position
      setPosTimer(0); setPosTimerOn(false)
      const minVal = parseInt(item.duration.match(/\d+/)?.[0] ?? '5')
      setPosMaxTimer(minVal * 60)
      if (reset) showToast('🔄 Deck reshuffled')
    }
    setCardKey(k => k + 1)
    burstSparks()
  }

  function spinWheel() {
    if (spinning) return
    haptic(20)
    playSfx('whoosh')
    setSpinning(true); setWheel(null)
    setCombo(c => c + 1)
    setTimeout(() => {
      const lvl = intensity
      const ai = Math.floor(Math.random() * WHEEL.actions[lvl].length)
      const pi = Math.floor(Math.random() * WHEEL.parts[lvl].length)
      const di = Math.floor(Math.random() * WHEEL.durations.length)
      setWheel({ action: WHEEL.actions[lvl][ai], actionEn: WHEEL.actionsEn[lvl][ai],
                 part: WHEEL.parts[lvl][pi], partEn: WHEEL.partsEn[lvl][pi],
                 dur: WHEEL.durations[di], durEn: WHEEL.durationsEn[di] })
      setSpinning(false); burstSparks()
      playSfx('reveal')
      haptic(40)
    }, 1400)
  }

  function drawWYR() {
    haptic(15)
    playSfx('draw')
    setCombo(c => c + 1)
    const pool = filteredNew(WYR_CARDS)
    if (!pool.length) { showToast('No cards at this level'); return }
    const idx = Math.floor(Math.random() * pool.length)
    setWyrCard(pool[idx])
    setWyrPhase('p1pick')
    setWyrP1(null); setWyrP2(null)
    setCardKey(k => k + 1)
    burstSparks()
  }

  function drawRiddle() {
    haptic(15)
    playSfx('draw')
    setCombo(c => c + 1)
    const pool = filteredNew(RIDDLE_CARDS)
    if (!pool.length) { showToast('No riddles at this level'); return }
    const idx = Math.floor(Math.random() * pool.length)
    setRiddle(pool[idx])
    setRiddleRevealed(false)
    setRiddleTimer(30)
    setRiddleActive(true)
    setCardKey(k => k + 1)
    burstSparks()
  }

  // Combo celebration at 5/10/15…
  useEffect(() => {
    if (combo > 0 && combo % 5 === 0) {
      playSfx('points')
      haptic([15, 40, 15])
      showToast(`🔥 ${combo} card combo!`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combo])

  function doSpinBottle() {
    if (bottleSpinning || spinPlayers.length < 2) return
    haptic([8, 30, 8, 30, 16] as unknown as number)
    playSfx('whoosh')
    setBottleSpinning(true)
    setSpinTarget(null); setSpinCard(null)
    const n = spinPlayers.length
    const target = Math.floor(Math.random() * n)
    const degPerPlayer = 360 / n
    const targetDeg = target * degPerPlayer
    const extraSpins = (4 + Math.floor(Math.random() * 3)) * 360
    const current = bottleAngle % 360
    const diff = ((targetDeg - current) + 360) % 360
    const finalAngle = bottleAngle + extraSpins + diff
    setBottleAngle(finalAngle)
    setTimeout(() => {
      const pool = filteredNew(SPIN_CONSEQUENCES)
      if (pool.length) {
        setSpinCard(pool[Math.floor(Math.random() * pool.length)])
      }
      setSpinTarget(target)
      setBottleSpinning(false)
      setSpinPhase('result')
      playSfx('reveal')
      haptic(50)
      burstSparks()
    }, 2600)
    setSpinPhase('spinning')
  }

  function resetAll() {
    haptic(20)
    playSfx('whoosh')
    setP1(0); setP2(0); setPlayed({})
    setCombo(0); setLastMilestone(0)
    setTod(null); setNhi(null); setQuiz(null); setHot(null); setPos(null); setWheel(null)
    setWyrCard(null); setWyrPhase('idle')
    setRiddle(null); setRiddleRevealed(false); setRiddleActive(false)
    setSpinPhase('setup'); setSpinTarget(null); setSpinCard(null)
    setPosTimer(0); setPosTimerOn(false)
    showToast('🌹 Fresh start')
  }

  return (
    <div className="after-dark relative min-h-screen overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <AmbientBackground />

      {!isNativeApp() && (
        <Link href="/" className="absolute top-4 left-4 z-20 text-xs uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity" style={{ color: 'var(--ad-muted)' }}>
          ← Back
        </Link>
      )}

      {/* Header */}
      <header className="px-4 pt-12 pb-4 text-center sm:pt-14">
        <p className="mb-2 text-[10px] uppercase tracking-[0.4em]" style={{ color: 'var(--ad-gold)' }}>After Dark Edition · 18+</p>
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-4xl font-bold leading-[0.95] sm:text-7xl"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
        >
          <span className="ad-text-gradient">After</span>{' '}
          <span className="italic" style={{ color: 'var(--ad-fg)', opacity: 0.9 }}>Dark</span>
        </motion.h1>
        <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm" style={{ color: 'var(--ad-muted)' }}>
          Un jeu intime pour deux ou plus. <span className="ad-flame">🕯️</span>
        </p>
      </header>

      {/* Score + Heat */}
      <section className="mx-auto mb-4 flex max-w-2xl flex-col items-center gap-3 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="ad-glass flex w-full items-center justify-between rounded-full px-5 py-3"
          style={{ border: '1px solid var(--ad-border)', boxShadow: 'var(--ad-shadow-card)' }}
        >
          {editingNames ? (
            <>
              <input
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value.slice(0, 12))}
                onBlur={() => setEditingNames(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingNames(false) }}
                autoFocus
                maxLength={12}
                className="w-24 bg-transparent text-center text-sm font-bold outline-none"
                style={{ color: 'var(--ad-primary)', borderBottom: '1px dashed var(--ad-primary)' }}
              />
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--ad-muted)' }}>vs</span>
              <input
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value.slice(0, 12))}
                onBlur={() => setEditingNames(false)}
                onKeyDown={(e) => { if (e.key === 'Enter') setEditingNames(false) }}
                maxLength={12}
                className="w-24 bg-transparent text-center text-sm font-bold outline-none"
                style={{ color: 'var(--ad-blush)', borderBottom: '1px dashed var(--ad-blush)' }}
              />
            </>
          ) : (
            <>
              <button onClick={() => { haptic(); setEditingNames(true) }} className="cursor-pointer">
                <PlayerScore name={p1Name} sips={p1} color="var(--ad-primary)" active={turn === 1} />
              </button>
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--ad-muted)' }}>vs</span>
              <button onClick={() => { haptic(); setEditingNames(true) }} className="cursor-pointer">
                <PlayerScore name={p2Name} sips={p2} color="var(--ad-blush)"   active={turn === 2} reverse />
              </button>
            </>
          )}
        </motion.div>

        {/* Quick actions — Cheers + Surprise Me + Combo */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={cheers}
            className="flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--ad-ember), var(--ad-gold))',
              boxShadow: '0 6px 24px -8px oklch(0.68 0.2 40 / 0.6)',
            }}
          >
            🍻 Cheers!
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={surpriseMe}
            className="flex min-h-[40px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--ad-violet), var(--ad-primary))',
              boxShadow: '0 6px 24px -8px oklch(0.62 0.24 18 / 0.5)',
            }}
          >
            🎲 Surprise Me
          </motion.button>
          {combo >= 3 && (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex min-h-[40px] items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
              style={{
                border: '1px solid var(--ad-gold)',
                color: 'var(--ad-gold)',
                background: 'oklch(0.78 0.13 80 / 0.1)',
              }}
            >
              🔥 ×{combo} combo
            </motion.div>
          )}
        </div>

        {/* Heat selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--ad-muted)' }}>Heat</span>
          <div className="flex gap-1 rounded-full p-1" style={{ border: '1px solid var(--ad-border)', background: 'color-mix(in oklab, var(--ad-surface) 60%, transparent)' }}>
            {LEVELS.map(l => {
              const active = intensity === l.id
              const colors: Record<Intensity, string> = { mild: 'var(--ad-blush)', spicy: 'var(--ad-ember)', inferno: 'var(--ad-primary)' }
              return (
                <motion.button key={l.id} whileTap={{ scale: 0.93 }}
                  onClick={() => { haptic(); setIntensity(l.id) }}
                  className="flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background: active ? (l.id === 'inferno' ? 'var(--ad-grad-heat)' : colors[l.id]) : 'transparent',
                    color: active ? '#fff' : 'var(--ad-muted)',
                    boxShadow: active && l.id === 'inferno' ? 'var(--ad-shadow-heat)' : 'none',
                  }}
                >
                  <span className={active && l.id === 'inferno' ? 'ad-flame' : ''}>{l.emoji}</span>
                  {l.label}
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mode tabs */}
      <nav className="mx-auto mb-5 flex max-w-3xl gap-2 overflow-x-auto px-4 pb-2 ad-scrollbar-hide sm:flex-wrap sm:justify-center">
        {MODES.map((m, i) => {
          const active = mode === m.id
          return (
            <motion.button key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => { haptic(); setMode(m.id) }}
              className="group relative flex-shrink-0 overflow-hidden rounded-2xl px-3.5 py-3 text-left sm:px-4"
              style={{
                border: `1px solid ${active ? 'transparent' : 'var(--ad-border)'}`,
                background: active ? undefined : 'color-mix(in oklab, var(--ad-surface) 40%, transparent)',
                boxShadow: active ? 'var(--ad-shadow-heat)' : 'none',
              }}
            >
              {active && (
                <motion.div layoutId="active-tab-bg"
                  className={`absolute inset-0 -z-0 bg-gradient-to-br ${m.tone}`}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <div className="relative flex items-center gap-1.5">
                <span className="text-base">{m.emoji}</span>
                <div>
                  <div className="text-xs font-bold sm:text-sm" style={{ color: active ? '#fff' : 'var(--ad-fg)', fontFamily: "'Playfair Display', Georgia, serif" }}>{m.label}</div>
                  <div className="text-[8px] uppercase tracking-[0.18em] sm:text-[9px]" style={{ color: active ? 'rgba(255,255,255,0.7)' : 'var(--ad-muted)' }}>{m.sub}</div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </nav>

      {/* Card area */}
      <section className="mx-auto max-w-2xl px-4" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <AnimatePresence mode="wait">

          {/* ── Truth or Dare ── */}
          {mode === 'tod' && (
            <ModeFrame key="tod">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5">
                  {(['all', 'truth', 'dare'] as const).map(f => (
                    <button key={f} onClick={() => { haptic(); setTodFilter(f) }}
                      className="min-h-[36px] rounded-full px-3 py-1 text-[11px] uppercase tracking-wider transition-all active:scale-95"
                      style={{ border: `1px solid ${todFilter === f ? 'var(--ad-gold)' : 'var(--ad-border)'}`, color: todFilter === f ? 'var(--ad-gold)' : 'var(--ad-muted)' }}>
                      {f === 'all' ? 'All' : f === 'truth' ? 'Truth' : 'Dare'}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ad-muted)' }}>Player {turn === 1 ? 2 : 1}'s turn</span>
              </div>
              <ADCard sparks={sparks} cardKey={`tod-${cardKey}`}>
                {!tod
                  ? <Placeholder pill="Truth or Dare" fr="Tire ta première carte." en="Draw your first card to start." />
                  : <>
                      <Pill tone={tod.t === 'truth' ? 'primary' : 'ember'} label={tod.t === 'truth' ? 'Vérité · Truth' : 'Défi · Dare'} level={tod.level} />
                      <CardText fr={tod.fr} en={tod.en} />
                    </>
                }
              </ADCard>
              <BtnRow>
                <PrimaryBtn onClick={() => draw('tod')}>{tod ? 'Next card' : 'Draw card'} →</PrimaryBtn>
                <GhostBtn onClick={() => { addSip(turn === 1 ? 2 : 1, 2); showToast('🐔 Chicken! +2 sips') }}>🐔 Chicken (+2 🥃)</GhostBtn>
              </BtnRow>
            </ModeFrame>
          )}

          {/* ── Never Have I Ever ── */}
          {mode === 'nhi' && (
            <ModeFrame key="nhi">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ad-muted)' }}>Si tu l'as fait — tu bois.</p>
              <ADCard sparks={sparks} cardKey={`nhi-${cardKey}`}>
                {!nhi
                  ? <Placeholder pill="Never Have I Ever" fr="Si tu l'as fait, bois une gorgée." en="If you've done it, take a sip." />
                  : <>
                      <Pill tone="violet" label="Never Have I Ever" level={nhi.level} />
                      <CardText fr={nhi.fr} en={nhi.en} />
                    </>
                }
              </ADCard>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <SipBtn onClick={() => addSip(1, 1)} color="var(--ad-primary)">You drank 🥃</SipBtn>
                <SipBtn onClick={() => addSip(2, 1)} color="var(--ad-blush)">They drank 🥃</SipBtn>
                <SipBtn onClick={() => addSip(0, 1)} color="var(--ad-ember)">Both of us 🥃🥃</SipBtn>
                <SipBtn onClick={() => showToast('🙅 Saints tonight')} color="var(--ad-gold)">No one 😇</SipBtn>
              </div>
              <BtnRow>
                <PrimaryBtn color="var(--ad-violet)" onClick={() => draw('nhi')}>Next confession →</PrimaryBtn>
              </BtnRow>
            </ModeFrame>
          )}

          {/* ── Couple Quiz ── */}
          {mode === 'quiz' && (
            <ModeFrame key="quiz">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ad-muted)' }}>One reads · the other answers · loser drinks</p>
              <ADCard sparks={sparks} cardKey={`quiz-${cardKey}`}>
                {!quiz
                  ? <Placeholder pill="Couple Quiz" fr="À quel point vous vous connaissez?" en="How well do you know each other?" />
                  : <>
                      <Pill tone="gold" label="Couple Quiz" level={quiz.level} />
                      <CardText fr={quiz.fr} en={quiz.en} />
                      {revealQuiz && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-3 rounded-xl px-4 py-3 text-sm"
                          style={{ border: '1px solid oklch(0.78 0.13 80 / 0.3)', background: 'oklch(0.78 0.13 80 / 0.1)', color: 'var(--ad-gold)' }}>
                          💡 {quiz.a}
                        </motion.div>
                      )}
                    </>
                }
              </ADCard>
              <BtnRow>
                <PrimaryBtn color="var(--ad-gold)" onClick={() => draw('quiz')}>New question →</PrimaryBtn>
                {quiz && !revealQuiz && <GhostBtn onClick={() => setRevealQuiz(true)}>👁 Reveal hint</GhostBtn>}
              </BtnRow>
              <BtnRow>
                <SmallBtn onClick={() => { setP1(p => p + 1); showToast('✨ +1 You') }}   color="var(--ad-primary)">+1 You</SmallBtn>
                <SmallBtn onClick={() => { setP2(p => p + 1); showToast('✨ +1 Them') }} color="var(--ad-blush)">+1 Them</SmallBtn>
                <SmallBtn onClick={() => addSip(0, 1)}                                   color="var(--ad-muted)">Wrong! 🥃</SmallBtn>
              </BtnRow>
            </ModeFrame>
          )}

          {/* ── Hot Seat ── */}
          {mode === 'hot' && (
            <ModeFrame key="hot">
              <div className="mb-3 flex justify-between text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ad-muted)' }}>
                <span>Hot seat 🔥</span>
                <span style={{ color: 'var(--ad-ember)' }}>Player {turn === 1 ? 2 : 1} is on the seat</span>
              </div>
              <ADCard sparks={sparks} cardKey={`hot-${cardKey}`}>
                {!hot
                  ? <Placeholder pill="Hot Seat 🔥" fr="Réponds honnêtement… ou bois 3 gorgées." en="Answer honestly… or take 3 sips." />
                  : <>
                      <Pill tone="primary" label="Hot Seat 🔥" level={hot.level} />
                      <CardText fr={hot.fr} en={hot.en} />
                    </>
                }
              </ADCard>
              <BtnRow>
                <PrimaryBtn onClick={() => draw('hot')}>🔥 Hot card</PrimaryBtn>
                <GhostBtn onClick={() => { addSip(turn === 1 ? 2 : 1, 3); showToast('🤐 Pass — 3 sips!') }}>🤐 Pass (3 🥃)</GhostBtn>
              </BtnRow>
            </ModeFrame>
          )}

          {/* ── Positions ── */}
          {mode === 'pos' && (
            <ModeFrame key="pos">
              <PositionView
                pos={pos}
                cardKey={`pos-${cardKey}`}
                sparks={sparks}
                posTimer={posTimer}
                posTimerOn={posTimerOn}
                posMaxTimer={posMaxTimer}
                onStartTimer={() => {
                  const minVal = pos ? parseInt(pos.duration.match(/\d+/)?.[0] ?? '5') : 5
                  const secs = minVal * 60
                  setPosMaxTimer(secs); setPosTimer(secs); setPosTimerOn(true); haptic(30)
                }}
                onStopTimer={() => { setPosTimerOn(false); setPosTimer(0) }}
                onRate={(emoji) => { haptic(20); showToast(`${emoji} Noted! Next position?`) }}
              />
              <BtnRow>
                <PrimaryBtn color="var(--ad-violet)" onClick={() => draw('pos')}>
                  {pos ? '🔀 Prochaine pose' : '🌹 Tirer une pose'}
                </PrimaryBtn>
                {pos && !posTimerOn && (
                  <GhostBtn onClick={() => { addSip(0, 1); showToast('😘 Skip — les deux boivent') }}>
                    Skip (1 🥃 each)
                  </GhostBtn>
                )}
              </BtnRow>
            </ModeFrame>
          )}

          {/* ── Wheel of Desire ── */}
          {mode === 'wheel' && (
            <ModeFrame key="wheel">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ad-muted)' }}>Spin · Action × Endroit × Durée</p>
              <WheelView wheel={wheel} spinning={spinning} intensity={intensity} sparks={sparks} cardKey={`wheel-${cardKey}`} />
              <BtnRow>
                <PrimaryBtn color="var(--ad-ember)" onClick={spinWheel}>
                  {spinning ? 'Spinning…' : wheel ? 'Re-spin 🎰' : 'Spin the wheel 🎰'}
                </PrimaryBtn>
                {wheel && !spinning && (
                  <GhostBtn onClick={() => { addSip(turn === 1 ? 2 : 1, 2); showToast('🙈 Chicken — 2 🥃') }}>🙈 Chicken (2 🥃)</GhostBtn>
                )}
              </BtnRow>
            </ModeFrame>
          )}

          {/* ── Would You Rather ── */}
          {mode === 'wyr' && (
            <ModeFrame key="wyr">
              <AnimatePresence mode="wait">

                {/* Idle / draw first card */}
                {wyrPhase === 'idle' && (
                  <motion.div key="wyr-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ADCard sparks={sparks} cardKey="wyr-idle">
                      <Placeholder pill="Would You Rather 🤔" fr="Choisissez entre deux options… en même temps." en="Both players pick secretly — then reveal together." />
                    </ADCard>
                    <BtnRow>
                      <PrimaryBtn onClick={drawWYR}>Draw a card →</PrimaryBtn>
                    </BtnRow>
                  </motion.div>
                )}

                {/* Player 1 picks */}
                {wyrPhase === 'p1pick' && wyrCard && (
                  <motion.div key="wyr-p1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                    <div className="mb-3 text-center">
                      <span className="rounded-full px-3 py-1 text-xs uppercase tracking-widest" style={{ background: 'oklch(0.62 0.24 18 / 0.2)', color: 'var(--ad-primary)', border: '1px solid oklch(0.62 0.24 18 / 0.3)' }}>
                        👤 Player 1 — choose secretly
                      </span>
                    </div>
                    <WYRChoiceCard card={wyrCard} pick={null} onPick={choice => {
                      setWyrP1(choice)
                      setWyrPhase('transit')
                      haptic(20)
                    }} />
                  </motion.div>
                )}

                {/* Transit — pass phone */}
                {wyrPhase === 'transit' && (
                  <motion.div key="wyr-transit" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-6 py-8 text-center">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                      <span className="text-7xl">📱</span>
                    </motion.div>
                    <div>
                      <p className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ad-fg)' }}>Player 1 has chosen!</p>
                      <p className="text-sm" style={{ color: 'var(--ad-muted)' }}>Pass the phone to Player 2 without showing them.</p>
                    </div>
                    <PrimaryBtn onClick={() => setWyrPhase('p2pick')}>Player 2 is ready →</PrimaryBtn>
                  </motion.div>
                )}

                {/* Player 2 picks */}
                {wyrPhase === 'p2pick' && wyrCard && (
                  <motion.div key="wyr-p2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                    <div className="mb-3 text-center">
                      <span className="rounded-full px-3 py-1 text-xs uppercase tracking-widest" style={{ background: 'oklch(0.72 0.18 350 / 0.2)', color: 'var(--ad-blush)', border: '1px solid oklch(0.72 0.18 350 / 0.3)' }}>
                        👤 Player 2 — choose secretly
                      </span>
                    </div>
                    <WYRChoiceCard card={wyrCard} pick={null} onPick={choice => {
                      setWyrP2(choice)
                      setWyrPhase('reveal')
                      haptic(20)
                      burstSparks()
                    }} />
                  </motion.div>
                )}

                {/* Reveal */}
                {wyrPhase === 'reveal' && wyrCard && (
                  <motion.div key="wyr-reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="mb-4 text-center text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--ad-gold)' }}>
                      ✨ Revealing…
                    </div>
                    <WYRReveal card={wyrCard} p1={wyrP1} p2={wyrP2} sparks={sparks} />
                    {wyrP1 && wyrP2 && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                        className="mt-4 rounded-2xl px-4 py-3 text-center"
                        style={{ background: wyrP1 === wyrP2 ? 'oklch(0.78 0.13 80 / 0.12)' : 'oklch(0.62 0.24 18 / 0.12)', border: `1px solid ${wyrP1 === wyrP2 ? 'oklch(0.78 0.13 80 / 0.3)' : 'oklch(0.62 0.24 18 / 0.3)'}` }}>
                        <p className="text-base font-bold" style={{ color: wyrP1 === wyrP2 ? 'var(--ad-gold)' : 'var(--ad-primary)' }}>
                          {wyrP1 === wyrP2 ? '🎉 You think alike!' : '🥃 Different tastes — one of you drinks!'}
                        </p>
                        {wyrP1 !== wyrP2 && <p className="text-xs mt-1" style={{ color: 'var(--ad-muted)' }}>Whoever feels worse about their answer takes a sip.</p>}
                      </motion.div>
                    )}
                    <BtnRow>
                      <PrimaryBtn onClick={drawWYR}>Next card →</PrimaryBtn>
                      {wyrP1 !== wyrP2 && <GhostBtn onClick={() => addSip(0, 1)}>Both sip 🥃</GhostBtn>}
                    </BtnRow>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModeFrame>
          )}

          {/* ── Dirty Minds ── */}
          {mode === 'riddles' && (
            <ModeFrame key="riddles">
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ad-muted)' }}>
                Innocentes devinettes… à l'esprit très coquin.
              </p>
              <ADCard sparks={sparks} cardKey={`riddles-${cardKey}`}>
                {!riddle
                  ? <Placeholder pill="Dirty Minds 🧩" fr="Des devinettes innocentes aux réponses surprenantes." en="Innocent riddles with surprisingly naughty answers." />
                  : <>
                      <Pill tone="ember" label="Dirty Minds 🧩" level={riddle.intensity} />
                      <p className="text-xl font-bold leading-snug sm:text-2xl text-center"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--ad-fg)' }}>
                        {riddle.riddle}
                      </p>

                      {/* Timer bar */}
                      {!riddleRevealed && (
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--ad-muted)' }}>
                            <span>Time</span>
                            <motion.span
                              key={riddleTimer}
                              initial={{ scale: 1.3, color: 'oklch(0.62 0.24 18)' }}
                              animate={{ scale: 1, color: riddleTimer <= 10 ? 'oklch(0.62 0.24 18)' : 'oklch(0.66 0.04 30)' }}
                              style={{ fontVariantNumeric: 'tabular-nums' }}
                            >
                              {riddleTimer}s
                            </motion.span>
                          </div>
                          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--ad-surface-2)' }}>
                            <motion.div className="h-full rounded-full"
                              animate={{ width: `${(riddleTimer / 30) * 100}%` }}
                              transition={{ duration: 0.5 }}
                              style={{ background: riddleTimer > 15 ? 'var(--ad-ember)' : 'var(--ad-primary)' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Answer reveal */}
                      {riddleRevealed && (
                        <motion.div initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }}
                          transition={{ type: 'spring', bounce: 0.4 }}
                          className="rounded-2xl px-5 py-4 text-center w-full"
                          style={{ background: 'oklch(0.78 0.13 80 / 0.12)', border: '1px solid oklch(0.78 0.13 80 / 0.3)' }}>
                          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--ad-muted)' }}>The answer is…</p>
                          <p className="text-xl font-bold" style={{ color: 'var(--ad-gold)', fontFamily: "'Playfair Display', serif" }}>
                            {riddle.answer}
                          </p>
                          {riddle.hint && <p className="text-xs mt-1 italic" style={{ color: 'var(--ad-muted)' }}>Hint: {riddle.hint}</p>}
                        </motion.div>
                      )}
                    </>
                }
              </ADCard>
              <BtnRow>
                {!riddle && <PrimaryBtn color="var(--ad-ember)" onClick={drawRiddle}>Draw a riddle 🧩</PrimaryBtn>}
                {riddle && !riddleRevealed && (
                  <>
                    <PrimaryBtn color="var(--ad-ember)" onClick={() => { setRiddleRevealed(true); setRiddleActive(false) }}>👁 Reveal answer</PrimaryBtn>
                    <GhostBtn onClick={() => { addSip(0, 1); drawRiddle() }}>Skip (both sip 🥃)</GhostBtn>
                  </>
                )}
                {riddle && riddleRevealed && (
                  <>
                    <PrimaryBtn color="var(--ad-ember)" onClick={drawRiddle}>Next riddle →</PrimaryBtn>
                    <GhostBtn onClick={() => addSip(0, 1)}>Got it wrong (sip 🥃)</GhostBtn>
                  </>
                )}
              </BtnRow>
            </ModeFrame>
          )}

          {/* ── Spin the Bottle ── */}
          {mode === 'spin' && (
            <ModeFrame key="spin">
              <AnimatePresence mode="wait">

                {/* Setup */}
                {spinPhase === 'setup' && (
                  <motion.div key="spin-setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-center" style={{ color: 'var(--ad-muted)' }}>
                      Add players (2–8), then spin!
                    </p>
                    <div className="ad-glass rounded-3xl p-4 mb-4" style={{ border: '1px solid var(--ad-border)' }}>
                      {/* Player list */}
                      <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                        <AnimatePresence>
                          {spinPlayers.map((name, i) => (
                            <motion.div key={`${name}-${i}`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="flex items-center gap-1 rounded-full px-3 py-1.5"
                              style={{ background: 'oklch(0.62 0.24 18 / 0.18)', border: '1px solid oklch(0.62 0.24 18 / 0.3)', color: 'var(--ad-fg)' }}>
                              <span className="text-sm">{name}</span>
                              <button onClick={() => setSpinPlayers(ps => ps.filter((_, j) => j !== i))}
                                className="text-xs opacity-50 hover:opacity-100 ml-1"
                                style={{ color: 'var(--ad-primary)' }}>✕</button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      {/* Add player */}
                      {spinPlayers.length < 8 && (
                        <div className="flex gap-2">
                          <input value={spinNameInput} onChange={e => setSpinNameInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && spinNameInput.trim()) {
                                setSpinPlayers(ps => [...ps, spinNameInput.trim()])
                                setSpinNameInput('')
                              }
                            }}
                            placeholder="Add a player…" maxLength={14}
                            className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                            style={{ background: 'color-mix(in oklab, var(--ad-surface-2) 80%, transparent)', border: '1px solid var(--ad-border)', color: 'var(--ad-fg)' }} />
                          <button onClick={() => {
                            if (spinNameInput.trim()) {
                              setSpinPlayers(ps => [...ps, spinNameInput.trim()])
                              setSpinNameInput('')
                            }
                          }} className="rounded-xl px-4 py-2 text-sm font-bold"
                            style={{ background: 'oklch(0.62 0.24 18 / 0.25)', color: 'var(--ad-primary)', border: '1px solid oklch(0.62 0.24 18 / 0.35)' }}>
                            + Add
                          </button>
                        </div>
                      )}
                    </div>
                    <BtnRow>
                      <PrimaryBtn onClick={() => {
                        if (spinPlayers.length >= 2) {
                          setSpinPhase('spinning')
                          setSpinTarget(null)
                          setSpinCard(null)
                        } else {
                          showToast('Need at least 2 players!')
                        }
                      }}>
                        🍾 Start spinning!
                      </PrimaryBtn>
                    </BtnRow>
                  </motion.div>
                )}

                {/* Spin & Result */}
                {(spinPhase === 'spinning' || spinPhase === 'result') && (
                  <motion.div key="spin-game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <SpinBottleView
                      players={spinPlayers}
                      bottleAngle={bottleAngle}
                      isSpinning={bottleSpinning}
                      target={spinTarget}
                      sparks={sparks}
                    />
                    {spinPhase === 'result' && spinTarget !== null && spinCard && (
                      <motion.div initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.35, delay: 0.3 }}
                        className="mt-4 rounded-3xl p-5 text-center"
                        style={{ background: 'oklch(0.62 0.24 18 / 0.12)', border: '1px solid oklch(0.62 0.24 18 / 0.3)' }}>
                        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--ad-muted)' }}>
                          🍾 {spinPlayers[spinTarget]}'s challenge
                        </p>
                        <p className="text-lg font-bold leading-snug" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ad-fg)' }}>
                          {spinCard.text}
                        </p>
                        {spinCard.duration && (
                          <span className="inline-block mt-2 text-[10px] rounded-full px-3 py-1 uppercase tracking-widest"
                            style={{ background: 'oklch(0.78 0.13 80 / 0.1)', color: 'var(--ad-gold)', border: '1px solid oklch(0.78 0.13 80 / 0.25)' }}>
                            ⏱ {spinCard.duration}
                          </span>
                        )}
                      </motion.div>
                    )}
                    <BtnRow>
                      {!bottleSpinning && (
                        <>
                          <PrimaryBtn onClick={doSpinBottle}>🍾 Spin again!</PrimaryBtn>
                          <GhostBtn onClick={() => { setSpinPhase('setup'); setSpinTarget(null) }}>Edit players</GhostBtn>
                        </>
                      )}
                      {bottleSpinning && (
                        <p className="text-sm animate-pulse" style={{ color: 'var(--ad-gold)' }}>Spinning…</p>
                      )}
                    </BtnRow>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModeFrame>
          )}
        </AnimatePresence>

        {/* Reset */}
        <div className="mt-10 pb-10 text-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={resetAll}
            className="min-h-[44px] text-[11px] uppercase tracking-[0.3em] transition-colors"
            style={{ color: 'var(--ad-muted)' }}>
            Reset the night 🌹
          </motion.button>
        </div>
      </section>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.45 }}
            className="ad-glass fixed left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm"
            style={{ bottom: 'max(2rem, env(safe-area-inset-bottom) + 0.5rem)', border: '1px solid var(--ad-border)', boxShadow: 'var(--ad-shadow-card)', color: 'var(--ad-fg)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════ Sub-components ══════════ */

function PlayerScore({ name, sips, color, active, reverse }: {
  name: string; sips: number; color: string; active: boolean; reverse?: boolean
}) {
  return (
    <div className={`flex items-center gap-2.5 ${reverse ? 'flex-row-reverse' : ''}`}>
      <div className="relative">
        <div className="h-2.5 w-2.5 rounded-full transition-all" style={{ background: color, boxShadow: active ? `0 0 16px ${color}` : 'none' }} />
        {active && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: color, opacity: 0.4 }} />}
      </div>
      <div className={reverse ? 'text-right' : 'text-left'}>
        <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ad-muted)' }}>{name}</div>
        <div className="flex items-baseline gap-1">
          <motion.span key={sips} initial={{ scale: 1.5, color: 'oklch(0.78 0.13 80)' }}
            animate={{ scale: 1, color: color }} transition={{ type: 'spring', bounce: 0.6, duration: 0.4 }}
            className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {sips}
          </motion.span>
          <span className="text-xs opacity-70">🥃</span>
        </div>
      </div>
    </div>
  )
}

function ModeFrame({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
      {children}
    </motion.div>
  )
}

function ADCard({ children, sparks, cardKey }: {
  children: React.ReactNode
  sparks: { id: number; x: number; y: number }[]
  cardKey: string
}) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div key={cardKey}
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="ad-glass ad-card-noise relative flex min-h-[240px] flex-col items-center justify-center gap-4 overflow-hidden rounded-[28px] p-6 text-center sm:min-h-[280px] sm:p-8"
          style={{ transformPerspective: 1000, border: '1px solid var(--ad-border)', boxShadow: 'var(--ad-shadow-card)' }}
        >
          <div className="absolute inset-x-0 top-0 h-[2px] opacity-80" style={{ background: 'var(--ad-grad-heat)' }} />
          <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" style={{ background: 'oklch(0.62 0.24 18 / 0.2)' }} />
          {children}
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {sparks.map(s => (
            <motion.span key={s.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{ x: s.x, y: s.y, opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute h-2 w-2 rounded-full"
              style={{ background: 'var(--ad-gold)', boxShadow: '0 0 10px var(--ad-gold)' }} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Pill({ tone, label, level }: { tone: string; label: string; level: Intensity }) {
  const emoji = level === 'mild' ? '🍬' : level === 'spicy' ? '🌶️' : '🔥'
  const colorMap: Record<string, string> = { primary: 'var(--ad-primary)', blush: 'var(--ad-blush)', ember: 'var(--ad-ember)', gold: 'var(--ad-gold)', violet: 'var(--ad-violet)' }
  const c = colorMap[tone] ?? 'var(--ad-primary)'
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]"
        style={{ color: c, border: `1px solid color-mix(in oklab, ${c} 40%, transparent)`, background: `color-mix(in oklab, ${c} 12%, transparent)` }}>
        {label}
      </span>
      <span className="text-xs">{emoji}</span>
    </div>
  )
}

function CardText({ fr, en }: { fr: string; en: string }) {
  return (
    <>
      <p className="text-xl font-bold leading-snug sm:text-2xl" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--ad-fg)' }}>{fr}</p>
      <p className="max-w-md text-sm italic" style={{ color: 'var(--ad-muted)' }}>{en}</p>
    </>
  )
}

function Placeholder({ pill, fr, en }: { pill: string; fr: string; en: string }) {
  return (
    <>
      <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
        style={{ border: '1px solid var(--ad-border)', background: 'color-mix(in oklab, var(--ad-surface) 60%, transparent)', color: 'var(--ad-muted)' }}>
        {pill}
      </span>
      <p className="text-xl" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ad-fg)' }}>{fr}</p>
      <p className="max-w-md text-sm italic" style={{ color: 'var(--ad-muted)' }}>{en}</p>
    </>
  )
}

function BtnRow({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex flex-wrap justify-center gap-2">{children}</div>
}

function PrimaryBtn({ children, onClick, color = 'var(--ad-grad-heat)' }: { children: React.ReactNode; onClick: () => void; color?: string }) {
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      onClick={() => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); onClick() }}
      className="relative min-h-[48px] overflow-hidden rounded-2xl px-6 py-3 text-sm font-semibold text-white"
      style={{ background: color, boxShadow: `0 12px 30px -10px color-mix(in oklab, ${color} 60%, transparent)` }}>
      {children}
    </motion.button>
  )
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
      onClick={() => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); onClick() }}
      className="min-h-[48px] rounded-2xl px-5 py-3 text-sm"
      style={{ border: '1px solid var(--ad-border)', background: 'color-mix(in oklab, var(--ad-surface) 60%, transparent)', color: 'var(--ad-fg)' }}>
      {children}
    </motion.button>
  )
}

function SmallBtn({ children, onClick, color }: { children: React.ReactNode; onClick: () => void; color: string }) {
  return (
    <motion.button whileTap={{ scale: 0.94 }}
      onClick={() => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); onClick() }}
      className="min-h-[44px] rounded-xl px-4 py-2 text-xs"
      style={{ color, border: `1px solid color-mix(in oklab, ${color} 40%, transparent)` }}>
      {children}
    </motion.button>
  )
}

function SipBtn({ children, onClick, color }: { children: React.ReactNode; onClick: () => void; color: string }) {
  return (
    <motion.button whileTap={{ scale: 0.93 }}
      onClick={() => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); onClick() }}
      className="min-h-[48px] rounded-2xl px-4 py-3 text-sm font-medium"
      style={{ color, border: `1px solid color-mix(in oklab, ${color} 35%, transparent)`, background: 'color-mix(in oklab, var(--ad-surface) 40%, transparent)' }}>
      {children}
    </motion.button>
  )
}

function Difficulty({ n }: { n: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map(i => <span key={i} className="text-[10px]" style={{ opacity: i <= n ? 1 : 0.25 }}>🔥</span>)}
    </div>
  )
}

function PositionView({ pos, cardKey, sparks, posTimer, posTimerOn, posMaxTimer, onStartTimer, onStopTimer, onRate }: {
  pos: PositionCard | null
  cardKey: string
  sparks: { id: number; x: number; y: number }[]
  posTimer: number
  posTimerOn: boolean
  posMaxTimer: number
  onStartTimer: () => void
  onStopTimer: () => void
  onRate: (emoji: string) => void
}) {
  const timerDone = !posTimerOn && posTimer === 0 && posMaxTimer > 0

  return (
    <div className="relative">
      {/* Spark overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <AnimatePresence>
          {sparks.map(s => (
            <motion.span key={s.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{ x: s.x, y: s.y, opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute h-2 w-2 rounded-full"
              style={{ background: 'var(--ad-gold)', boxShadow: '0 0 10px var(--ad-gold)' }} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={cardKey}
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="ad-glass ad-card-noise relative overflow-hidden rounded-[28px]"
          style={{ transformPerspective: 1000, border: '1px solid var(--ad-border)', boxShadow: 'var(--ad-shadow-card)' }}
        >
          {/* Top gradient line */}
          <div className="absolute inset-x-0 top-0 h-[2px] opacity-80" style={{ background: 'var(--ad-grad-heat)' }} />

          {!pos ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 p-6 text-center">
              <Placeholder pill="Kama Sutra · After Dark" fr="Tirez une pose et osez la tenir." en="Draw a position and dare to hold it." />
            </div>
          ) : (
            <>
              {/* Illustration panel */}
              <div className="relative flex items-center justify-center py-5"
                style={{ background: 'linear-gradient(180deg, oklch(0.14 0.06 15 / 0.8) 0%, oklch(0.1 0.03 15 / 0.4) 100%)' }}>
                {/* ambient glow behind figure */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-32 w-48 rounded-full blur-3xl" style={{ background: 'oklch(0.62 0.24 18 / 0.18)' }} />
                </div>
                <PosIllustration svgId={pos.svgId} />
              </div>

              {/* Content panel */}
              <div className="flex flex-col items-center gap-3 px-6 pb-5 pt-3 text-center">
                <Pill tone="violet" label="Kama Sutra" level={pos.level} />

                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] mb-0.5" style={{ color: 'var(--ad-gold)' }}>{pos.en}</p>
                  <p className="text-2xl font-bold leading-tight sm:text-3xl"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--ad-fg)' }}>
                    {pos.fr}
                  </p>
                </div>

                <p className="max-w-sm text-sm leading-relaxed" style={{ color: 'var(--ad-fg)', opacity: 0.85 }}>{pos.descFr}</p>
                <p className="max-w-sm text-xs italic leading-relaxed" style={{ color: 'var(--ad-muted)' }}>{pos.descEn}</p>

                {/* Stats row */}
                <div className="flex items-center gap-4 rounded-full px-4 py-2 text-[11px]"
                  style={{ border: '1px solid var(--ad-border)', background: 'color-mix(in oklab, var(--ad-surface) 60%, transparent)' }}>
                  <span style={{ color: 'var(--ad-muted)' }}>⏱ <span style={{ color: 'var(--ad-fg)' }}>{pos.duration}</span></span>
                  <span style={{ color: 'var(--ad-border)' }}>·</span>
                  <span style={{ color: 'var(--ad-muted)' }}>Heat <Difficulty n={pos.difficulty} /></span>
                </div>

                {/* Tip */}
                {pos.tipFr && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="w-full rounded-2xl px-4 py-2.5 text-left text-xs"
                    style={{ background: 'oklch(0.78 0.13 80 / 0.08)', border: '1px solid oklch(0.78 0.13 80 / 0.2)', color: 'var(--ad-gold)' }}>
                    💡 <em>{pos.tipFr}</em>
                  </motion.div>
                )}

                {/* Timer section */}
                {!posTimerOn && posTimer === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={onStartTimer}
                    className="mt-1 w-full rounded-2xl py-3 text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, oklch(0.55 0.18 320), oklch(0.45 0.2 290))', boxShadow: '0 8px 24px -8px oklch(0.55 0.18 320 / 0.5)' }}>
                    ⏱ Hold This Position — {pos.duration}
                  </motion.button>
                )}

                {posTimerOn && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex flex-col items-center gap-2">
                    {/* Big timer */}
                    <motion.p
                      key={posTimer}
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-black tabular-nums"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: posTimer <= 30 ? 'var(--ad-primary)' : 'var(--ad-fg)',
                        textShadow: posTimer <= 30 ? '0 0 20px oklch(0.62 0.24 18 / 0.6)' : 'none',
                      }}>
                      {Math.floor(posTimer / 60)}:{String(posTimer % 60).padStart(2, '0')}
                    </motion.p>
                    {/* Progress bar */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--ad-surface-2)' }}>
                      <motion.div className="h-full rounded-full"
                        animate={{ width: `${(posTimer / posMaxTimer) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        style={{ background: posTimer > posMaxTimer * 0.4 ? 'var(--ad-violet)' : 'var(--ad-primary)' }} />
                    </div>
                    <button onClick={onStopTimer}
                      className="text-xs uppercase tracking-widest opacity-50 hover:opacity-80 mt-1"
                      style={{ color: 'var(--ad-muted)' }}>
                      Stop timer
                    </button>
                  </motion.div>
                )}

                {timerDone && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full rounded-2xl p-3 text-center"
                    style={{ background: 'oklch(0.78 0.13 80 / 0.1)', border: '1px solid oklch(0.78 0.13 80 / 0.25)' }}>
                    <p className="text-sm font-bold mb-2" style={{ color: 'var(--ad-gold)' }}>🏆 How was it?</p>
                    <div className="flex justify-center gap-2">
                      {['😐', '🙂', '😊', '🔥', '🌋'].map((e, i) => (
                        <motion.button key={i} whileTap={{ scale: 0.85 }}
                          onClick={() => onRate(e)}
                          className="text-2xl active:opacity-60">
                          {e}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Kama Sutra SVG Illustrations ──────────────
function PosIllustration({ svgId }: { svgId: number }) {
  const P1 = '#e05858'   // crimson – receiver / bottom
  const P2 = '#d4609a'   // pink    – giver / top

  const sp = {
    width: 200, height: 140,
    viewBox: '0 0 200 140',
    style: { filter: 'drop-shadow(0 6px 24px rgba(210,80,120,0.32))' },
  }

  // helpers
  const fl = (y: number) => (
    <line x1={10} y1={y} x2={190} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} strokeLinecap="round"/>
  )
  const hd = (cx: number, cy: number, c: string, r = 11.5) => (
    <circle cx={cx} cy={cy} r={r} fill={c + '40'} stroke={c} strokeWidth={2.5}/>
  )
  const jt = (cx: number, cy: number, c: string) => (
    <circle cx={cx} cy={cy} r={3.5} fill={c} opacity={0.65}/>
  )
  const sg = (d: string, c: string, w: number) => (
    <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>
  )

  // 1 — Missionary
  if (svgId === 1) return (
    <svg {...sp}>
      {fl(134)}
      {hd(28, 108, P1)}{sg('M40,108 Q95,106 145,108', P1, 9)}
      {sg('M145,108 Q156,91 158,70', P1, 6)}{sg('M145,108 Q162,116 166,130', P1, 6)}
      {sg('M72,108 Q64,116 58,126', P1, 5)}{sg('M105,108 Q115,116 120,126', P1, 5)}
      {jt(40,108,P1)}{jt(145,108,P1)}
      {hd(30, 80, P2)}{sg('M42,82 Q92,88 148,96', P2, 9)}
      {sg('M148,96 Q158,82 160,64', P2, 6)}{sg('M148,96 Q162,106 164,120', P2, 6)}
      {sg('M75,85 Q64,92 55,106', P2, 5)}
      {jt(42,82,P2)}{jt(148,96,P2)}
    </svg>
  )

  // 2 — Spooning
  if (svgId === 2) return (
    <svg {...sp}>
      {fl(132)}
      {hd(32, 98, P1)}{sg('M44,99 Q95,101 148,104', P1, 9)}
      {sg('M148,104 Q162,108 172,120', P1, 6)}{sg('M148,104 Q162,115 168,128', P1, 4)}
      {jt(44,99,P1)}{jt(148,104,P1)}
      {hd(44, 74, P2)}{sg('M56,76 Q104,80 155,87', P2, 9)}
      {sg('M155,87 Q168,79 176,68', P2, 6)}{sg('M155,87 Q168,96 174,110', P2, 6)}
      {sg('M88,78 Q82,88 78,100', P2, 5)}
      {jt(56,76,P2)}{jt(155,87,P2)}
    </svg>
  )

  // 3 — Lotus
  if (svgId === 3) return (
    <svg {...sp}>
      {hd(100, 58, P1)}{sg('M100,70 Q100,83 100,96', P1, 9)}
      {sg('M100,96 Q82,110 62,124', P1, 6)}{sg('M62,124 Q80,130 100,125', P1, 4)}
      {sg('M100,96 Q118,110 138,124', P1, 6)}{sg('M138,124 Q120,130 100,125', P1, 4)}
      {sg('M100,82 Q82,74 72,68', P1, 5)}{sg('M100,82 Q118,74 128,68', P1, 5)}
      {jt(100,70,P1)}{jt(100,96,P1)}
      {hd(100, 28, P2)}{sg('M100,40 Q100,55 100,70', P2, 9)}
      {sg('M100,70 Q82,82 68,90', P2, 6)}{sg('M100,70 Q118,82 132,90', P2, 6)}
      {sg('M100,54 Q80,64 72,74', P2, 5)}{sg('M100,54 Q120,64 128,74', P2, 5)}
      {jt(100,40,P2)}{jt(100,70,P2)}
    </svg>
  )

  // 4 — Cowgirl
  if (svgId === 4) return (
    <svg {...sp}>
      {fl(133)}
      {hd(28, 110, P1)}{sg('M40,110 Q95,109 148,110', P1, 9)}
      {sg('M148,110 Q162,102 168,92', P1, 6)}{sg('M148,110 Q162,118 168,128', P1, 6)}
      {sg('M80,110 Q72,118 66,128', P1, 5)}{sg('M108,110 Q118,118 122,128', P1, 5)}
      {jt(40,110,P1)}{jt(148,110,P1)}
      {hd(108, 33, P2)}{sg('M108,44 Q108,64 108,86', P2, 9)}
      {sg('M108,86 Q90,100 82,116', P2, 6)}{sg('M108,86 Q126,100 134,116', P2, 6)}
      {sg('M108,60 Q90,72 80,82', P2, 5)}{sg('M108,60 Q126,72 136,82', P2, 5)}
      {jt(108,44,P2)}{jt(108,86,P2)}
    </svg>
  )

  // 5 — Reverse Cowgirl
  if (svgId === 5) return (
    <svg {...sp}>
      {fl(133)}
      {hd(28, 110, P1)}{sg('M40,110 Q95,109 148,110', P1, 9)}
      {sg('M148,110 Q162,102 168,92', P1, 6)}{sg('M148,110 Q162,118 168,128', P1, 6)}
      {sg('M80,110 Q72,118 66,128', P1, 5)}{sg('M108,110 Q118,118 122,128', P1, 5)}
      {jt(40,110,P1)}{jt(148,110,P1)}
      {hd(108, 33, P2)}{sg('M108,44 Q108,64 108,86', P2, 9)}
      {sg('M108,86 Q90,100 82,116', P2, 6)}{sg('M108,86 Q126,100 134,116', P2, 6)}
      {sg('M108,60 Q126,66 145,72', P2, 5)}{sg('M108,68 Q132,76 152,84', P2, 5)}
      {jt(108,44,P2)}{jt(108,86,P2)}
    </svg>
  )

  // 6 — Doggy Style
  if (svgId === 6) return (
    <svg {...sp}>
      {fl(134)}
      {hd(36, 82, P1)}{sg('M48,84 Q75,80 102,84 Q128,88 142,94', P1, 9)}
      {sg('M65,82 Q52,100 42,118', P1, 6)}{sg('M42,118 Q30,125 22,128', P1, 4)}
      {sg('M142,94 Q148,112 148,130', P1, 6)}{sg('M142,94 Q158,110 162,130', P1, 6)}
      {jt(65,82,P1)}{jt(142,94,P1)}
      {hd(168, 46, P2)}{sg('M168,57 Q166,74 164,96', P2, 9)}
      {sg('M168,74 Q158,82 145,88', P2, 5)}{sg('M168,80 Q157,87 144,92', P2, 5)}
      {sg('M164,96 Q155,116 152,132', P2, 6)}{sg('M164,96 Q175,116 178,132', P2, 6)}
      {jt(168,57,P2)}{jt(164,96,P2)}
    </svg>
  )

  // 7 — The Chair
  if (svgId === 7) return (
    <svg {...sp}>
      <line x1={70} y1={70} x2={70} y2={134} stroke="#9ca3af" strokeWidth={3} strokeLinecap="round" opacity={0.35}/>
      <line x1={130} y1={70} x2={130} y2={134} stroke="#9ca3af" strokeWidth={3} strokeLinecap="round" opacity={0.35}/>
      <line x1={65} y1={108} x2={135} y2={108} stroke="#9ca3af" strokeWidth={3} strokeLinecap="round" opacity={0.35}/>
      <line x1={58} y1={70} x2={142} y2={70} stroke="#9ca3af" strokeWidth={4} strokeLinecap="round" opacity={0.35}/>
      {hd(100, 56, P1)}{sg('M100,68 Q100,84 100,108', P1, 9)}
      {sg('M100,108 Q84,108 70,108', P1, 6)}{sg('M70,108 Q68,120 68,134', P1, 4)}
      {sg('M100,108 Q116,108 130,108', P1, 6)}{sg('M130,108 Q132,120 132,134', P1, 4)}
      {jt(100,68,P1)}{jt(100,108,P1)}
      {hd(100, 28, P2)}{sg('M100,40 Q100,56 100,72', P2, 9)}
      {sg('M100,72 Q80,90 72,108', P2, 6)}{sg('M100,72 Q120,90 128,108', P2, 6)}
      {sg('M100,54 Q80,62 68,72', P2, 5)}{sg('M100,54 Q120,62 132,72', P2, 5)}
      {jt(100,40,P2)}{jt(100,72,P2)}
    </svg>
  )

  // 8 — Butterfly
  if (svgId === 8) return (
    <svg {...sp}>
      {fl(133)}
      {hd(26, 106, P1)}{sg('M38,106 Q85,104 132,105', P1, 9)}
      {sg('M132,105 Q145,78 150,54', P1, 6)}{sg('M150,54 Q158,46 162,44', P1, 4)}
      {sg('M132,105 Q152,80 162,56', P1, 6)}{sg('M162,56 Q170,48 172,46', P1, 4)}
      {sg('M72,105 Q62,114 55,124', P1, 5)}
      {jt(38,106,P1)}{jt(132,105,P1)}
      {hd(162, 28, P2)}{sg('M162,39 Q162,58 162,84', P2, 9)}
      {sg('M162,60 Q156,54 152,50', P2, 5)}{sg('M162,68 Q168,60 170,54', P2, 5)}
      {sg('M162,84 Q152,110 150,130', P2, 6)}{sg('M162,84 Q172,110 174,130', P2, 6)}
      {jt(162,39,P2)}{jt(162,84,P2)}
    </svg>
  )

  // 9 — 69
  if (svgId === 9) return (
    <svg {...sp}>
      {hd(162, 46, P1)}{sg('M150,52 Q105,70 56,90', P1, 9)}
      {sg('M56,90 Q38,76 28,62', P1, 6)}{sg('M56,90 Q40,104 28,118', P1, 6)}
      {sg('M162,60 Q170,72 174,82', P1, 5)}
      {jt(150,52,P1)}{jt(56,90,P1)}
      {hd(38, 98, P2)}{sg('M50,94 Q95,75 144,56', P2, 9)}
      {sg('M144,56 Q162,42 174,30', P2, 6)}{sg('M144,56 Q162,68 172,80', P2, 6)}
      {sg('M38,112 Q28,118 22,124', P2, 5)}
      {jt(50,94,P2)}{jt(144,56,P2)}
    </svg>
  )

  // 10 — Scissors
  if (svgId === 10) return (
    <svg {...sp}>
      {fl(132)}
      {hd(30, 72, P1)}{sg('M42,74 Q90,80 142,88', P1, 9)}
      {sg('M142,88 Q158,78 168,70', P1, 6)}{sg('M142,88 Q158,98 168,106', P1, 6)}
      {sg('M72,76 Q64,58 60,46', P1, 5)}
      {jt(42,74,P1)}{jt(142,88,P1)}
      {hd(170, 100, P2)}{sg('M158,98 Q110,90 58,84', P2, 9)}
      {sg('M58,84 Q44,72 32,60', P2, 6)}{sg('M58,84 Q44,96 30,104', P2, 6)}
      {sg('M128,96 Q132,114 134,126', P2, 5)}
      {jt(158,98,P2)}{jt(58,84,P2)}
    </svg>
  )

  // 11 — Against the Wall
  if (svgId === 11) return (
    <svg {...sp}>
      <line x1={16} y1={12} x2={16} y2={138} stroke="#9ca3af" strokeWidth={5} strokeLinecap="round" opacity={0.35}/>
      {hd(50, 46, P1)}{sg('M50,57 Q60,72 66,88', P1, 9)}
      {sg('M58,70 Q36,64 18,56', P1, 5)}{sg('M60,78 Q38,76 18,76', P1, 5)}
      {sg('M66,88 Q56,110 52,130', P1, 6)}{sg('M66,88 Q78,110 82,130', P1, 6)}
      {jt(50,57,P1)}{jt(66,88,P1)}
      {hd(120, 44, P2)}{sg('M120,56 Q118,72 116,96', P2, 9)}
      {sg('M120,74 Q98,82 80,88', P2, 5)}{sg('M120,82 Q99,88 82,93', P2, 5)}
      {sg('M116,96 Q106,116 102,132', P2, 6)}{sg('M116,96 Q128,116 132,132', P2, 6)}
      {jt(120,56,P2)}{jt(116,96,P2)}
    </svg>
  )

  // 12 — Pretzel
  if (svgId === 12) return (
    <svg {...sp}>
      {fl(133)}
      {hd(30, 94, P1)}{sg('M42,95 Q90,98 145,100', P1, 9)}
      {sg('M145,100 Q162,116 168,130', P1, 6)}
      {sg('M145,100 Q140,75 132,56', P1, 6)}{sg('M132,56 Q128,48 130,42', P1, 4)}
      {sg('M75,95 Q65,118 60,130', P1, 5)}
      {jt(42,95,P1)}{jt(145,100,P1)}
      {hd(164, 54, P2)}{sg('M164,65 Q162,80 160,98', P2, 9)}
      {sg('M164,78 Q148,66 132,56', P2, 5)}{sg('M164,82 Q176,78 184,72', P2, 5)}
      {sg('M160,98 Q150,118 146,132', P2, 6)}{sg('M160,98 Q172,116 176,132', P2, 6)}
      {jt(164,65,P2)}{jt(160,98,P2)}
    </svg>
  )

  // 13 — Wheelbarrow
  if (svgId === 13) return (
    <svg {...sp}>
      {fl(133)}
      {hd(36, 118, P1)}{sg('M40,107 Q62,88 84,74', P1, 9)}
      {sg('M56,94 Q40,108 24,116', P1, 6)}{sg('M24,116 Q16,122 14,130', P1, 4)}
      {sg('M84,74 Q102,58 118,50', P1, 6)}{sg('M84,74 Q98,58 106,48', P1, 6)}
      {jt(56,94,P1)}{jt(84,74,P1)}
      {hd(148, 40, P2)}{sg('M148,51 Q148,68 148,90', P2, 9)}
      {sg('M148,68 Q134,60 118,52', P2, 5)}{sg('M148,72 Q128,64 108,54', P2, 5)}
      {sg('M148,90 Q136,112 132,132', P2, 6)}{sg('M148,90 Q160,112 164,132', P2, 6)}
      {jt(148,51,P2)}{jt(148,90,P2)}
    </svg>
  )

  return (
    <svg {...sp}>
      <text x="100" y="75" textAnchor="middle" fill={P1} fontSize="48">💋</text>
    </svg>
  )
}

function Reel({ items, spinning, finalIdx }: { items: string[]; spinning: boolean; finalIdx: number | null }) {
  const list = useMemo(() => {
    const padding = Array.from({ length: 14 }, () => items[Math.floor(Math.random() * items.length)])
    return [...padding, ...items]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning])
  const settled = finalIdx !== null && !spinning
  return (
    <div className="relative h-14 overflow-hidden rounded-xl" style={{ border: '1px solid var(--ad-border)', background: 'color-mix(in oklab, var(--ad-surface) 70%, transparent)' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3" style={{ background: 'linear-gradient(to bottom, var(--ad-surface), transparent)' }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3" style={{ background: 'linear-gradient(to top, var(--ad-surface), transparent)' }} />
      <motion.div
        animate={spinning ? { y: ['0%', '-300%', '-600%'] } : settled ? { y: `-${(list.length - items.length + (finalIdx as number)) * 56}px` } : { y: 0 }}
        transition={spinning ? { duration: 1.2, ease: 'linear' } : { type: 'spring', bounce: 0.25, duration: 0.7 }}
        className="flex flex-col"
      >
        {list.map((it, i) => (
          <div key={i} className="flex h-14 items-center justify-center px-2 text-center text-base font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ad-fg)' }}>
            {it}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function WheelView({ wheel, spinning, intensity, sparks, cardKey }: {
  wheel: { action: string; part: string; dur: string; actionEn: string; partEn: string; durEn: string } | null
  spinning: boolean; intensity: Intensity
  sparks: { id: number; x: number; y: number }[]; cardKey: string
}) {
  const lvl = intensity
  const actions = WHEEL.actions[lvl]; const parts = WHEEL.parts[lvl]; const durs = WHEEL.durations
  const aIdx = wheel ? actions.indexOf(wheel.action) : null
  const pIdx = wheel ? parts.indexOf(wheel.part) : null
  const dIdx = wheel ? durs.indexOf(wheel.dur) : null
  return (
    <ADCard sparks={sparks} cardKey={cardKey}>
      {!wheel && !spinning
        ? <Placeholder pill="Wheel of Desire 🎰" fr="Tournez la roue. Faites exactement ce qu'elle dit." en="Spin the wheel. Do exactly what it says." />
        : <>
            <Pill tone="ember" label="Wheel of Desire" level={intensity} />
            <div className="grid w-full max-w-md grid-cols-3 gap-2">
              <Reel items={actions} spinning={spinning} finalIdx={aIdx} />
              <Reel items={parts} spinning={spinning} finalIdx={pIdx} />
              <Reel items={durs} spinning={spinning} finalIdx={dIdx} />
            </div>
            {wheel && !spinning && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-2 space-y-1">
                <p className="text-xl font-bold leading-snug sm:text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ad-fg)' }}>
                  <span className="ad-shimmer">{wheel.action}</span> {wheel.part} <span style={{ color: 'var(--ad-ember)' }}>· {wheel.dur}</span>
                </p>
                <p className="text-xs italic" style={{ color: 'var(--ad-muted)' }}>{wheel.actionEn} {wheel.partEn} · {wheel.durEn}</p>
              </motion.div>
            )}
            {spinning && <p className="text-[11px] uppercase tracking-[0.3em]" style={{ color: 'var(--ad-gold)' }}>Spinning the fates…</p>}
          </>
      }
    </ADCard>
  )
}

// ── Would You Rather components ───────────────
function WYRChoiceCard({ card, pick, onPick }: {
  card: typeof WYR_CARDS[number]
  pick: 'a' | 'b' | null
  onPick: (c: 'a' | 'b') => void
}) {
  return (
    <div className="space-y-3">
      {(['a', 'b'] as const).map(choice => (
        <motion.button key={choice}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onPick(choice)}
          className="w-full rounded-2xl p-5 text-left relative overflow-hidden"
          style={{
            background: pick === choice ? 'oklch(0.62 0.24 18 / 0.25)' : 'color-mix(in oklab, var(--ad-surface) 60%, transparent)',
            border: `1px solid ${pick === choice ? 'oklch(0.62 0.24 18 / 0.6)' : 'var(--ad-border)'}`,
            boxShadow: pick === choice ? '0 8px 24px -8px oklch(0.62 0.24 18 / 0.4)' : 'none',
          }}>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: choice === 'a' ? 'oklch(0.62 0.24 18 / 0.3)' : 'oklch(0.72 0.18 350 / 0.3)', color: choice === 'a' ? 'var(--ad-primary)' : 'var(--ad-blush)' }}>
              {choice.toUpperCase()}
            </span>
            <p className="text-base font-medium leading-snug" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ad-fg)' }}>
              {choice === 'a' ? card.a : card.b}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

function WYRReveal({ card, p1, p2, sparks }: {
  card: typeof WYR_CARDS[number]
  p1: 'a' | 'b' | null
  p2: 'a' | 'b' | null
  sparks: { id: number; x: number; y: number }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(['a', 'b'] as const).map((choice, ci) => {
        const text = choice === 'a' ? card.a : card.b
        const p1picked = p1 === choice
        const p2picked = p2 === choice
        const anyPicked = p1picked || p2picked
        return (
          <motion.div key={choice}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ delay: ci * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl p-4 text-center"
            style={{
              transformPerspective: 800,
              background: anyPicked ? `oklch(${choice === 'a' ? '0.62 0.24 18' : '0.72 0.18 350'} / 0.2)` : 'color-mix(in oklab, var(--ad-surface) 50%, transparent)',
              border: `1px solid ${anyPicked ? `oklch(${choice === 'a' ? '0.62 0.24 18' : '0.72 0.18 350'} / 0.5)` : 'var(--ad-border)'}`,
            }}>
            <div className="text-2xl font-black mb-2" style={{ color: choice === 'a' ? 'var(--ad-primary)' : 'var(--ad-blush)' }}>{choice.toUpperCase()}</div>
            <p className="text-xs leading-snug mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ad-fg)' }}>{text}</p>
            <div className="flex flex-col gap-1">
              {p1picked && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.4 }}
                  className="rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest"
                  style={{ background: 'oklch(0.62 0.24 18 / 0.25)', color: 'var(--ad-primary)' }}>
                  You ✓
                </motion.span>
              )}
              {p2picked && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.55 }}
                  className="rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest"
                  style={{ background: 'oklch(0.72 0.18 350 / 0.25)', color: 'var(--ad-blush)' }}>
                  Them ✓
                </motion.span>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Spin the Bottle component ─────────────────
function SpinBottleView({ players, bottleAngle, isSpinning, target, sparks }: {
  players: string[]
  bottleAngle: number
  isSpinning: boolean
  target: number | null
  sparks: { id: number; x: number; y: number }[]
}) {
  const SIZE = 260
  const CENTER = SIZE / 2
  const RADIUS = 100

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Circle */}
        <svg className="absolute inset-0" width={SIZE} height={SIZE}>
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="oklch(0.3 0.06 15 / 0.4)" strokeWidth="1" />
          {players.map((_, i) => {
            const angle = (i / players.length) * 2 * Math.PI - Math.PI / 2
            const x2 = CENTER + RADIUS * Math.cos(angle)
            const y2 = CENTER + RADIUS * Math.sin(angle)
            return <line key={i} x1={CENTER} y1={CENTER} x2={x2} y2={y2} stroke="oklch(0.3 0.06 15 / 0.2)" strokeWidth="1" strokeDasharray="3 3" />
          })}
        </svg>

        {/* Player labels */}
        {players.map((name, i) => {
          const angle = (i / players.length) * 2 * Math.PI - Math.PI / 2
          const x = CENTER + (RADIUS + 22) * Math.cos(angle)
          const y = CENTER + (RADIUS + 22) * Math.sin(angle)
          const isTarget = target === i && !isSpinning
          return (
            <motion.div key={i}
              animate={{ scale: isTarget ? 1.2 : 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="absolute flex items-center justify-center rounded-full text-[9px] font-bold px-2 py-1"
              style={{
                left: x, top: y, transform: 'translate(-50%, -50%)',
                background: isTarget ? 'oklch(0.62 0.24 18 / 0.4)' : 'color-mix(in oklab, var(--ad-surface) 70%, transparent)',
                border: `1px solid ${isTarget ? 'oklch(0.62 0.24 18 / 0.8)' : 'var(--ad-border)'}`,
                color: isTarget ? '#fff' : 'var(--ad-muted)',
                boxShadow: isTarget ? '0 0 16px oklch(0.62 0.24 18 / 0.5)' : 'none',
                maxWidth: 60, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
              {name}
            </motion.div>
          )
        })}

        {/* Center dot */}
        <div className="absolute rounded-full z-10"
          style={{ width: 12, height: 12, left: CENTER - 6, top: CENTER - 6, background: 'var(--ad-primary)', boxShadow: '0 0 12px var(--ad-primary)' }} />

        {/* Bottle arrow */}
        <motion.div
          animate={{ rotate: bottleAngle }}
          transition={{ duration: 2.5, ease: [0.08, 0.1, 0.1, 1] }}
          className="absolute z-10"
          style={{ left: CENTER, top: CENTER - 4, width: RADIUS - 8, height: 8, originX: '0%', originY: '50%', borderRadius: 4,
            background: 'linear-gradient(90deg, var(--ad-primary), var(--ad-blush))' }}>
          <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0,
            borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '14px solid var(--ad-blush)' }} />
        </motion.div>
      </div>

      {/* Sparks overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {sparks.map(s => (
            <motion.span key={s.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{ x: s.x, y: s.y, opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute h-2 w-2 rounded-full"
              style={{ background: 'var(--ad-gold)', boxShadow: '0 0 10px var(--ad-gold)' }} />
          ))}
        </AnimatePresence>
      </div>

      {target !== null && !isSpinning && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-lg font-bold text-center" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ad-fg)' }}>
          🍾 <span style={{ color: 'var(--ad-primary)' }}>{players[target]}</span> gets a challenge!
        </motion.p>
      )}
    </div>
  )
}
