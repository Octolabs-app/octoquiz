'use client'
import { useEffect, useState } from 'react'

interface TimerProps {
  startedAt: number | null
  duration: number          // seconds
  onExpire?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export default function Timer({ startedAt, duration, onExpire, size = 'md' }: TimerProps) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    if (!startedAt) { setRemaining(duration); return }

    const tick = () => {
      const elapsed = (Date.now() - startedAt) / 1000
      const left = Math.max(0, duration - elapsed)
      setRemaining(left)
      if (left <= 0) onExpire?.()
    }

    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [startedAt, duration, onExpire])

  const pct = remaining / duration
  const urgent = remaining <= 5
  const r = size === 'lg' ? 54 : size === 'md' ? 36 : 24
  const circ = 2 * Math.PI * r
  const stroke = circ * (1 - pct)

  const sizeMap = {
    sm: { svg: 64,  r: 24, text: 'text-xl',  sw: 4 },
    md: { svg: 88,  r: 36, text: 'text-3xl', sw: 5 },
    lg: { svg: 128, r: 54, text: 'text-5xl', sw: 7 },
  }
  const s = sizeMap[size]

  return (
    <div className="relative flex items-center justify-center" style={{ width: s.svg, height: s.svg }}>
      <svg width={s.svg} height={s.svg} className="-rotate-90">
        <circle
          cx={s.svg / 2} cy={s.svg / 2} r={s.r}
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={s.sw}
        />
        <circle
          cx={s.svg / 2} cy={s.svg / 2} r={s.r}
          fill="none"
          stroke={urgent ? '#ef4444' : pct > 0.5 ? '#22c55e' : '#eab308'}
          strokeWidth={s.sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={stroke}
          style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.5s' }}
        />
      </svg>
      <span className={`absolute font-black tabular-nums ${s.text} ${urgent ? 'text-red-400 animate-pulse' : 'text-white'}`}>
        {Math.ceil(remaining)}
      </span>
    </div>
  )
}
