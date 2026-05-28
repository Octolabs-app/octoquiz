'use client'
import { useCallback } from 'react'

/**
 * Haptic feedback hook.
 *
 * - When running inside the Capacitor Android APK, uses the native
 *   `@capacitor/haptics` plugin — stronger, more reliable on real devices.
 * - In any browser, falls back to `navigator.vibrate(...)`.
 * - On unsupported platforms, silently no-ops.
 *
 * Pass a single number for a simple buzz, or an array for a pattern
 * (web only — native uses a representative intensity).
 */
export function useHaptic() {
  const haptic = useCallback((ms: number | number[] = 50) => {
    // Try the native plugin first (only present inside the APK build).
    try {
      // Dynamic import — at web build time this resolves to a stub that
      // throws inside non-Capacitor contexts. We swallow.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cap = (globalThis as any).Capacitor
      if (cap?.isNativePlatform?.()) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Haptics, ImpactStyle } = require('@capacitor/haptics')
        const total = Array.isArray(ms) ? ms.reduce((a, b) => a + b, 0) : ms
        const style = total >= 200 ? ImpactStyle.Heavy
          : total >= 80  ? ImpactStyle.Medium
          : ImpactStyle.Light
        Haptics.impact({ style }).catch(() => {})
        return
      }
    } catch { /* not in capacitor — fall through */ }

    try { navigator?.vibrate?.(ms) } catch { /* unsupported */ }
  }, [])

  return { haptic }
}
