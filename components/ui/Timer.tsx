'use client'
import { useEffect, useRef, useState } from 'react'
import { useSound } from '@/hooks/useSound'

interface TimerProps {
  startedAt: number | null
  duration: number
  onExpire?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export default function Timer({ startedAt, duration, onExpire, size = 'md' }: TimerProps) {
  const [remaining, setRemaining] = useState(duration)
  const { play } = useSound()
  const lastTickSecond = useRef(-1)

  useEffect(() => {
    if (!startedAt) { setRemaining(duration); return }

    const tick = () => {
      const elapsed = (Date.now() - startedAt) / 1000
      const left = Math.max(0, duration - elapsed)
      setRemaining(left)
      if (left <= 0) onExpire?.()

      // Tick sound every second when under 5s
      const sec = Math.ceil(left)
      if (left > 0 && left <= 5 && sec !== lastTickSecond.current) {
        lastTickSecond.current = sec
        play('tick')
      }
    }

    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [startedAt, duration, onExpire, play])

  const pct = remaining / duration
  const urgent = remaining <= 5

  const sizeMap = {
    sm: { svg: 64,  r: 24, text: 'text-xl',  sw: 4 },
    md: { svg: 88,  r: 36, text: 'text-3xl', sw: 5 },
    lg: { svg: 128, r: 54, text: 'text-5xl', sw: 7 },
  }
  const s = sizeMap[size]
  const circ = 2 * Math.PI * s.r
  const stroke = circ * (1 - pct)

  return (
    <div className="relative flex items-center justify-center" style={{ width: s.svg, height: s.svg }}>
      <svg
        width={s.svg} height={s.svg}
        className={`-rotate-90 ${urgent ? 'animate-ring-pulse' : ''}`}
      >
        <circle
          cx={s.svg / 2} cy={s.svg / 2} r={s.r}
          fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={s.sw}
        />
        <circle
          cx={s.svg / 2} cy={s.svg / 2} r={s.r}
          fill="none"
          stroke={urgent ? '#EF5350' : pct > 0.5 ? '#C6A87C' : '#eab308'}
          strokeWidth={s.sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={stroke}
          style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.5s' }}
        />
      </svg>
      <span className={`absolute font-black tabular-nums ${s.text} ${urgent ? 'text-red-400 animate-pulse' : 'text-brand-text'}`}>
        {Math.ceil(remaining)}
      </span>
    </div>
  )
}
