'use client'
import { useRef, useCallback } from 'react'

export type SoundName =
  | 'correct'   // ✅ right answer — ascending chime
  | 'wrong'     // ❌ wrong answer — descending buzz
  | 'tick'      // 🕐 timer tick — 880 Hz beep
  | 'reveal'    // 🎺 answer revealed — pop + shimmer
  | 'points'    // ⭐ score up — sparkle run
  | 'draw'      // 🃏 card drawn — whoosh
  | 'start'     // 🚀 game starts — short fanfare
  | 'select'    // 👆 button selected — soft click
  | 'whoosh'    // 💨 transition — sweep
  | 'winner'    // 🏆 round winner — short melody
  | 'gameover'  // 🎉 game over — full fanfare

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  function ctx(): AudioContext {
    if (!ctxRef.current) {
      ctxRef.current = new (
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  /** Helper: play a single tone */
  function tone(
    ac: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    gain = 0.25,
    type: OscillatorType = 'sine',
    fadeOut = true,
  ) {
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.connect(g)
    g.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, startTime)
    g.gain.setValueAtTime(gain, startTime)
    if (fadeOut) g.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.start(startTime)
    osc.stop(startTime + duration + 0.01)
  }

  /** Helper: white noise burst */
  function noise(ac: AudioContext, startTime: number, duration: number, gain = 0.15) {
    const bufSize = Math.ceil(ac.sampleRate * duration)
    const buf = ac.createBuffer(1, bufSize, ac.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = ac.createBufferSource()
    src.buffer = buf
    const g = ac.createGain()
    src.connect(g)
    g.connect(ac.destination)
    g.gain.setValueAtTime(gain, startTime)
    g.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    src.start(startTime)
    src.stop(startTime + duration + 0.01)
  }

  const play = useCallback((name: SoundName) => {
    try {
      const ac = ctx()
      const now = ac.currentTime

      switch (name) {
        case 'correct': {
          // ✅ Rising major arpeggio C5 → E5 → G5 → C6
          const notes = [523.25, 659.25, 783.99, 1046.5]
          notes.forEach((f, i) => tone(ac, f, now + i * 0.08, 0.35, 0.22, 'sine'))
          break
        }

        case 'wrong': {
          // ❌ Descending buzz 200 Hz → 100 Hz
          const osc = ac.createOscillator()
          const g = ac.createGain()
          osc.connect(g); g.connect(ac.destination)
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(200, now)
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.3)
          g.gain.setValueAtTime(0.2, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
          osc.start(now); osc.stop(now + 0.38)
          break
        }

        case 'tick': {
          // 🕐 880 Hz beep — 50 ms
          tone(ac, 880, now, 0.05, 0.15, 'sine')
          break
        }

        case 'reveal': {
          // 🎺 Bass thud + shimmer
          tone(ac, 120, now, 0.18, 0.3, 'triangle')
          tone(ac, 880, now + 0.04, 0.12, 0.15, 'sine')
          tone(ac, 1320, now + 0.08, 0.1, 0.1, 'sine')
          noise(ac, now, 0.08, 0.08)
          break
        }

        case 'points': {
          // ⭐ Quick sparkle run (pentatonic)
          const sparkle = [523.25, 587.33, 659.25, 783.99, 880]
          sparkle.forEach((f, i) => tone(ac, f, now + i * 0.055, 0.18, 0.14, 'sine'))
          break
        }

        case 'draw': {
          // 🃏 Card flip — quick frequency sweep
          const osc = ac.createOscillator()
          const g = ac.createGain()
          osc.connect(g)
          g.connect(ac.destination)
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(600, now)
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.15)
          g.gain.setValueAtTime(0.2, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
          osc.start(now)
          osc.stop(now + 0.2)
          noise(ac, now, 0.12, 0.06)
          break
        }

        case 'start': {
          // 🚀 Short 3-note fanfare
          tone(ac, 523.25, now, 0.15, 0.25, 'triangle')
          tone(ac, 659.25, now + 0.14, 0.15, 0.25, 'triangle')
          tone(ac, 783.99, now + 0.28, 0.35, 0.3, 'triangle')
          break
        }

        case 'select': {
          // 👆 Soft tap / click
          tone(ac, 800, now, 0.06, 0.14, 'sine')
          break
        }

        case 'whoosh': {
          // 💨 Sweep down
          const osc = ac.createOscillator()
          const g = ac.createGain()
          osc.connect(g)
          g.connect(ac.destination)
          osc.type = 'sine'
          osc.frequency.setValueAtTime(1200, now)
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.22)
          g.gain.setValueAtTime(0.18, now)
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
          osc.start(now)
          osc.stop(now + 0.27)
          break
        }

        case 'winner': {
          // 🏆 Round winner short melody
          const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5]
          melody.forEach((f, i) => tone(ac, f, now + i * 0.09, 0.25, 0.2, 'triangle'))
          break
        }

        case 'gameover': {
          // 🎉 Full fanfare
          tone(ac, 523.25, now,       0.12, 0.25, 'triangle')
          tone(ac, 659.25, now + 0.1, 0.12, 0.25, 'triangle')
          tone(ac, 783.99, now + 0.2, 0.12, 0.25, 'triangle')
          tone(ac, 1046.5, now + 0.32, 0.3, 0.3, 'triangle')
          tone(ac, 880,    now + 0.32, 0.3, 0.15, 'sine')
          tone(ac, 1318.5, now + 0.55, 0.5, 0.3, 'triangle')
          noise(ac, now + 0.55, 0.3, 0.1)
          break
        }
      }
    } catch {
      // Silently ignore — audio not critical
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { play }
}
